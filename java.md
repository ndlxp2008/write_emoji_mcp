# Java 安装指南

嘿，小伙伴，想开始 Java 之旅？先来搞定 Java 安装吧 ![微笑](emojis/remote/remote/微笑_1745564253818.jpg)

## 1. 下载 Java

1. 打开 Oracle 官网（https://www.oracle.com/java/technologies/downloads/）或者访问 OpenJDK（https://jdk.java.net/）。
2. 选个合适的版本（一般用最新的 LTS 版就稳妥，比如 Java 17）。
3. 根据系统下载对应的安装包（Windows 一般是 `.exe` 文件）。 ![下载](emojis/remote/remote/下载_1745564256049.gif)

## 2. 安装 Java

1. 找到下载好的 `.exe`，双击运行。
2. 然后一路"下一步"，别忘记看一下安装路径，默认一般是 `C:\Program Files\Java\jdk-xx`。 ![安装](emojis/remote/remote/安装_1745564257455.jpg)
3. 等待安装完成，就可以点击"关闭"啦。

## 3. 配置环境变量

1. 右键"此电脑"->"属性"->"高级系统设置"->"环境变量"。
2. 在"系统变量"里新建变量 `JAVA_HOME`，值填你刚刚安装的路径，比如 `C:\Program Files\Java\jdk-17`。 
3. 找到 `Path`，点击"编辑"，新增一行 `%JAVA_HOME%\bin`。
4. 点"确定"保存，一路 OK 收工！

## 4. 验证安装

打开命令行（Win+R，输入 `cmd`），输入：

```bash
java -version
```

如果看到类似 `java version "17.0.x"` 这样的信息，就说明安装成功啦 ![成功](emojis/remote/remote/成功_1745564259173.jpg)

## 5. 小贴士

- 如果安装过程中遇到权限问题，可以右键以管理员身份运行安装包 ![提示](emojis/remote/remote/提示_1745564260928.jpg)
- 想写代码？`JAVA_HOME` 路径下的 `bin` 目录里有 `javac.exe`，就是用来编译 `.java` 文件的哦 ~ 

好了，到这里就搞定了，赶紧试试写个 "Hello World" 吧！ ![快乐](emojis/remote/remote/快乐_1745564265080.jpg)
