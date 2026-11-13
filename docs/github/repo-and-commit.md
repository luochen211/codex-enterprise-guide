# 第 1 课　仓库和提交：把代码存到 GitHub

**这一课学完：** 你的项目在 GitHub 上有一个仓库，每做完一步就存一个档，改坏了能退回到上一个好的版本。

![存档点](/github/01.webp)

## 先分清三样东西

| 东西 | 是什么 | 打个比方 |
|---|---|---|
| Git | 装在你电脑上的版本管理工具 | 游戏的存档功能 |
| 提交（commit） | 某一刻项目的完整快照，附一句说明 | 一个存档点 |
| GitHub | 放 Git 仓库的网站，还管协作、检查和部署 | 云存档 |

只有 Git 也能存档，但存档只在你电脑上，电脑坏了就没了。推到 GitHub 以后，换电脑、找人协作、自动部署才有可能。

## 第一次准备（只做一次）

1. 装 Git 和 GitHub 命令行工具 `gh`。Mac 上可以用 `brew install git gh`，Windows 去 git-scm.com 和 cli.github.com 下载安装包。
2. 告诉 Git 你是谁，这会写进每一个提交里：

   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱"
   ```

3. 登录 GitHub：

   ```bash
   gh auth login
   ```

   按提示选 GitHub.com、HTTPS，用浏览器登录即可。

## 把一个项目放上 GitHub

在项目文件夹里执行：

```bash
git init                      # 让这个文件夹变成 Git 仓库
git add .                     # 把当前所有文件放进「待存档」区
git commit -m "feat: 初始版本"  # 存第一个档
gh repo create my-demo --private --source=. --push   # 在 GitHub 建仓库并推上去
```

`--private` 表示私有仓库，只有你能看到；想公开就换成 `--public`。

已经在 GitHub 上的项目，用 `git clone 仓库地址` 拉到本地。

::: warning 先做第 5 课再推
如果项目里有 `.env`、密码、API Key，先读第 5 课，把它们挡在仓库外面再执行上面的命令。推上去以后再删，历史记录里还在。
:::

## 每天用的五条命令

```bash
git status            # 现在改了哪些文件
git diff              # 具体改了什么
git add 文件名         # 把要存档的文件挑出来（git add . 是全部）
git commit -m "说明"   # 存档
git push              # 把存档推到 GitHub
```

再加一条看历史：`git log --oneline`，一行一个提交。

**多久提交一次：** 每做完一件能说清楚的小事就提交一次，比如「修好登录报错」「加上订单列表」。一个提交只做一件事，出了问题才好定位、好退回。

**说明怎么写：** 用一句话说清改了什么。常见写法是在前面加类型：`feat:` 新功能，`fix:` 修问题，`docs:` 改文档。例如 `fix: 订单金额为零时不能提交`。

## 改坏了怎么退回

| 情况 | 做法 |
|---|---|
| 改了还没提交，想放弃某个文件的改动 | `git restore 文件名` |
| 已经提交、已经推上去，想撤销某个提交 | `git revert 提交编号`，会新增一个「反向」提交，历史不丢 |

提交编号用 `git log --oneline` 查，就是每行开头那串字母数字。

两条命令先别用：`git reset --hard` 会直接丢掉没提交的改动；`git push --force` 会覆盖 GitHub 上的历史，别人的提交可能跟着消失。真要用，先确认你知道它会删掉什么。

## 这一步谁来做

| 交给 AI 的 | 你要判断和验收的 |
|---|---|
| 敲 `git` 命令、写提交说明、建仓库 | GitHub 网页上能看到最新的提交；一个提交只做了一件事；没有密钥和大文件被传上去 |

## 练习

拿一个小项目：建仓库、推上去；改一行代码，提交并推送；再用 `git revert` 撤销这个提交。最后在 GitHub 网页上点开提交记录，看到这三个提交。

---

[课程列表](/github/)　·　下一课：[第 2 课　分支和 PR](/github/branch-and-pr)
