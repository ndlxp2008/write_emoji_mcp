# 问题列表

### mcp 相关

```
   1.mcp的环境变量都不是编辑文件的根目录，需要另外加参数projectPath，用cursor编辑器去传入（需要更优雅的方式解决）
   2.prompt优化？（使用更结构化的prompt）
      帮我根据项目内容构建一个README.md文件:
      1.编写这个mcp项目安装、使用相关的内容
      2.文字使用口语化
      3.插入一些{{emoji:表情词}}辅助口语化，使文章更生动。
      4.文章生成后调用process_file工具转换这个.md文章，
      5.process_file工具参数:{
        "projectPath": "操作系统为windows项目的根目录实际值根据.md文件项目的根目录",
        "file": "README.md",
        "dir": "."
      }
      6.参数中file,为构建的文件名；projectPath为操作系统为windows项目的根目录实际值根据.md文件项目的根目录。
```
