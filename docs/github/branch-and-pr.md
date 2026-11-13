# 第 2 课　分支和 PR：改动先走岔路

**这一课学完：** 你不再直接改主线。每个改动先在分支上做，开 PR 让检查跑一遍，没问题再合进 main。

![岔路与检查站](/github/02.webp)

## 为什么不直接改 main

main 是默认主线，通常也是线上正在跑的那份代码。直接在 main 上改，改到一半出了问题，线上和你手里的半成品就混在一起了。

分支是从 main 某一刻分出去的一条岔路。你在岔路上随便改，main 不受影响。改好以后开一个 PR（Pull Request，合并请求），请 GitHub 跑检查、请别人看，确认没问题再合回 main。

## 一次完整的流程

```bash
git switch main && git pull           # 1. 回到主线，拉到最新
git switch -c fix/order-total         # 2. 开一条新分支
# ……改代码，按第 1 课提交……
git push -u origin fix/order-total    # 3. 把分支推上去
gh pr create --fill                   # 4. 开 PR，标题和说明先用提交说明填
```

开完 PR，在网页上看三处：

1. **Files changed：** 改动是不是都和这件事有关，有没有夹带别的文件；
2. **Checks：** 自动检查是不是都通过了（绿色对勾），第 4 课会讲怎么配；
3. **Conversation：** 别人留的意见处理了没有。

都没问题就合并：

```bash
gh pr merge --merge --delete-branch   # 合并，并删掉 GitHub 上的分支
git switch main && git pull           # 本地主线跟上
git branch -d fix/order-total         # 删掉本地分支
```

**分支名：** 用「类型/做什么」，如 `feat/order-export`、`fix/login-500`。名字只是提示，判断一条分支到底是什么，要看它包含哪些提交。

## PR 显示有冲突怎么办

两条分支改了同一个文件的同一处，Git 不知道留哪个，就会报冲突。在自己的分支上把最新的 main 合进来：

```bash
git switch fix/order-total
git pull origin main
```

冲突的文件里会出现这样的标记：

```text
<<<<<<< HEAD
你的版本
=======
main 上的版本
>>>>>>> main
```

留下正确的内容，删掉三行标记，然后 `git add`、`git commit`、`git push`。

在别人的仓库里提 PR 时，看到「落后于 main」先别急着处理。维护者可能正在排合并顺序，等轮到你，他会通知你。见案例 [PR 有冲突，也不代表现在就要处理](/cases/pr-rebase-timing-incident)。

## 用分支保护锁住 main

在仓库的 Settings → Branches 里可以设规则：改 main 必须走 PR，检查必须通过，不能强推。

公开仓库在免费账号下就能用。个人私有仓库要升级 GitHub Pro 才能强制执行；没有这层保护时，只能靠约定「不直接改 main」。

## 这一步谁来做

| 交给 AI 的 | 你要判断和验收的 |
|---|---|
| 开分支、提交、推送、开 PR、解冲突 | PR 里只有这件事的改动；检查全绿；冲突解完后功能还对；合并后 main 上能看到这次改动 |

## 练习

在第 1 课的项目里开一条分支，改一处文字，开 PR，在网页上看一遍 Files changed，然后合并。再故意在 main 和另一条分支上改同一行，体验一次冲突并解决它。

---

上一课：[第 1 课　仓库和提交](/github/repo-and-commit)　·　下一课：[第 3 课　Issue](/github/issue)
