import express from 'express'
import { exec } from 'child_process'
import path from 'path'

const app = express()
app.use(express.json())

// post /process
app.post('/process', (req, res) => {
  const { file, dir } = req.body
  if (!file) {
    return res.status(400).json({ error: 'Missing file parameter' })
  }
  const emojiDir = dir || './emojis'
  const cmd = `npx md-emoji-mcp "${file}" -d "${emojiDir}"`
  exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) {
      console.error('执行 md-emoji-mcp 出错:', stderr)
      return res.status(500).json({ error: stderr })
    }
    res.json({ status: 'success', output: stdout })
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`md-emoji-mcp Server listening on port ${PORT}`)
})
