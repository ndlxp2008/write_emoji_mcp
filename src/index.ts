#!/usr/bin/env node

/**
 * 这是一个 MCP 服务器模板，实现了一个MD 文件处理工具。
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import { MCP_CONFIG } from './config/index.js'
import { process_file } from './tools/index.js'

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import axios from 'axios'
import { load } from 'cheerio'
/**
 * 初始化 MCP 服务器，设置资源、工具和提示。
 */
const server = new Server(
  {
    name: MCP_CONFIG.base.name,
    version: MCP_CONFIG.base.version,
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  },
)

/**
 * 列出可用工具的处理程序。
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [process_file],
  }
})

/**
 * 处理文件请求
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'process_file': {
      const projectPath = String(request.params.arguments?.projectPath)
      const mdPath = projectPath + String(request.params.arguments?.file)
      const emojiDir = path.resolve(projectPath, './emojis/remote')
      if (!mdPath || !emojiDir) {
        throw new Error('File and dir are required')
      }

      const content = fs.readFileSync(mdPath, 'utf-8')
      const lines = content.split(/\r?\n/)

      // 加载本地表情包列表
      const emojis = glob
        .sync('**/*.{png,jpg,gif,svg}', { cwd: emojiDir })
        .map((file: string) => path.join(emojiDir, file))
      const keywordMap = {
        性能: [],
        安全: [],
        功能: [],
        错误: [],
        优化: [],
      }
      // 根据文件名初始化映射，或者可自定义更多关键词
      emojis.forEach((imgPath: string) => {
        const name = path.basename(imgPath, path.extname(imgPath))
        Object.keys(keywordMap).forEach((kw) => {
          if (name.includes(kw)) {
            keywordMap[kw].push(imgPath)
          }
        })
      })

      // 遍历 MD，每行检测关键词并插入表情包
      let newLines = lines.map((line: string) => {
        let resLine = line
        Object.entries(keywordMap).forEach(([kw, arr]) => {
          if (arr.length > 0 && line.includes(kw)) {
            // 随机选一张表情
            const img = arr[Math.floor(Math.random() * arr.length)]
            const rel = path.relative(path.dirname(mdPath), img).replace(/\\/g, '/')
            resLine += ` ![${kw}](${rel})`
          }
        })
        return resLine
      })

      // 处理远程表情占位符 {{emoji:名称}}
      const contentWithLocal = newLines.join('\n')
      const placeholderRegex = /\{\{emoji:([^\}]+)\}\}/g
      const names = new Set()
      let match
      while ((match = placeholderRegex.exec(contentWithLocal)) !== null) {
        names.add(match[1])
      }
      const fetchMap = {}
      // 设置请求头，模拟浏览器，避免 403 错误
      const DEFAULT_HEADERS = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        Referer: 'https://www.doutub.com/',
      }
      for (const name of names) {
        const searchUrl = `https://www.doutub.com/search/${encodeURIComponent(String(name))}/1`
        try {
          // 请求搜索页面
          const resp = await axios.get(searchUrl, { headers: DEFAULT_HEADERS })
          const $ = load(resp.data)
          // 定位第一个 expression-list 下的 div > img
          const imgEl = $('.expression-list > div').first().find('img').first()
          let imgUrl = imgEl.attr('data-src') || imgEl.attr('src') || ''
          // 规范化 URL
          if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl
          if (!imgUrl) {
            console.warn(`未找到远程表情 URL: ${name}`)
            fetchMap[name as string] = ''
          } else {
            console.log(`名称 ${name} 的远程表情 URL：`, imgUrl)
            try {
              // 下载并保存图片
              const imgResp = await axios.get(imgUrl, {
                responseType: 'arraybuffer',
                headers: DEFAULT_HEADERS,
              })
              const ext = path.extname(new URL(imgUrl).pathname) || '.jpg'
              const remoteDir = path.join(emojiDir, 'remote')
              fs.mkdirSync(remoteDir, { recursive: true })
              const fileName = `${name}_${Date.now()}${ext}`
              const savePath = path.join(remoteDir, fileName)
              fs.writeFileSync(savePath, imgResp.data)
              fetchMap[name as string] = path
                .relative(path.dirname(mdPath), savePath)
                .replace(/\\/g, '/')
              console.log(`远程表情已保存: ${savePath}`)
            } catch (err) {
              console.error(`下载 ${name} 失败:`, (err as Error).message)
              fetchMap[name as string] = ''
            }
          }
        } catch (err) {
          console.error(`访问搜索页面失败 ${searchUrl}:`, (err as Error).message)
          fetchMap[name as string] = ''
        }
      }
      const finalContent = contentWithLocal.replace(placeholderRegex, (_, name) => {
        const url = fetchMap[name]
        return url ? `![${name}](${url})` : ''
      })
      fs.writeFileSync(mdPath, finalContent, 'utf-8')
      console.log('处理完成:', mdPath)

      //
      return {
        content: [
          {
            type: 'text',
            text: `Processed 22 file ${mdPath}`,
          },
        ],
      }
    }

    default:
      throw new Error('Unknown tool')
  }
})

/**
 * 列出可用提示的处理程序。
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'xxxxxxxx',
        description: 'aaaaaaaaaaaaaaa',
      },
    ],
  }
})

/**
 * 使用 stdio 传输启动服务器。
 * 这样，服务器就能通过标准输入/输出流进行通信。
 */
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error('Server error:', error)
  process.exit(1)
})
