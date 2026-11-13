# 第 5 课　什么不能进仓库：密钥和 .gitignore

**这一课学完：** 密钥、密码、客户数据不会被你传上 GitHub；自动部署要用的密钥放在 Secrets 里；万一泄露了，知道先做什么。

![保险箱和橱窗](/github/05.webp)

## 哪些东西不能进仓库

| 不能放 | 例子 | 放哪 |
|---|---|---|
| 密钥和密码 | API Key、数据库密码、支付密钥、`.env` | 本地 `.env` 文件 + GitHub Secrets |
| 客户和用户数据 | 导出的表格、数据库备份、聊天记录 | 只放在受控的存储里 |
| 能重新生成的东西 | `node_modules/`、`dist/`、`.venv/` | 不放，用命令重新装、重新构建 |
| 大文件 | 视频、模型、安装包 | 对象存储或网盘；GitHub 单个文件超过 100 MB 会被拒绝 |

私有仓库也一样。仓库会被克隆到很多台电脑上，会被 AI 读，以后也可能被改成公开。

## 用 .gitignore 挡住

在项目根目录建一个 `.gitignore` 文件，写进去的文件和文件夹，`git add .` 时会被跳过：

```text
.env
.env.*
!.env.example
node_modules/
dist/
.venv/
*.log
.DS_Store
```

`!.env.example` 的意思是例外：留一份不含真实值的样例，告诉别人需要哪些配置。

`.gitignore` 只对还没被提交过的文件生效。文件已经提交过了，要先用 `git rm --cached 文件名` 把它移出仓库，再提交。

## 自动部署要用密钥怎么办

放进 GitHub Secrets：仓库 Settings → Secrets and variables → Actions → New repository secret。

![GitHub Secrets 设置页](/github-actions-secrets-settings.png)

工作流里这样取用：

```yaml
- run: ./deploy.sh
  env:
    SERVER_KEY: ${{ secrets.SERVER_KEY }}
```

存进去以后网页上看不到原值，日志里出现时也会被打码。

## 已经推上去了怎么办

顺序不能反：

1. **先作废这个密钥。** 去对应平台吊销旧的、换一个新的。只要推上去过，就当它已经泄露了：历史记录里还在，别人可能已经克隆或缓存了。
2. **再清理仓库。** 删掉文件、加进 `.gitignore`、提交。要从历史里彻底抹掉，需要专门的工具改写历史，交给 AI 做之前先备份。
3. **查有没有被用过。** 看对应平台的调用记录和账单。

GitHub 会自动扫描一部分常见格式的密钥，推送时可能直接拦下来。这是兜底，不能当作防线。

## 这一步谁来做

| 交给 AI 的 | 你要判断和验收的 |
|---|---|
| 写 `.gitignore`、把密钥改成从环境变量读、配 Secrets 的用法 | 提交前看一眼 `git status`，有没有 `.env`、数据文件、大文件；密钥泄露时先作废再清理 |

## 练习

在项目里建一个 `.env`，写一个假的 Key，加上 `.gitignore`，确认 `git status` 里看不到它。再在 GitHub 上建一个 Secret，在工作流里打印它，看看日志里是不是被打成了 `***`。

---

上一课：[第 4 课　Actions](/github/actions)　·　下一课：[第 6 课　让 AI 操作 GitHub](/github/ai)
