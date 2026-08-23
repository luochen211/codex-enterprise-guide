# 案例：错误基线与 worktree 管理导致的系统级回退事故

这不是一次“目录起错名字”的小问题，而是一次把 Git 分支身份、真实基线和工作区状态混在一起后，最终影响业务可用性的事故。

## 事故结果

事故造成了三个直接结果：

1. 下单无法使用。
2. 后台系统出现大量回退。
3. 整个系统几乎全部瘫痪。

这说明 worktree 管理不是本地开发习惯问题。恢复基线判断错了，或者在没有保护脏改动的情况下清理、覆盖工作区，可能直接变成一次系统级回退。

## 事故现场

当时有多个并行 worktree，目录名里反复出现 `main`。但目录名不是 Git 身份，真正的身份必须以 worktree 当前检出的分支或提交为准。

现场确认到的关键关系是：

| 位置 | 实际身份 | 状态 |
| --- | --- | --- |
| `/private/tmp/imaging-issue-21-main` | `main` | 本地旧主线，`92743ab`，比 `origin/main` 落后 81 个提交 |
| `origin/main` | 远端真实主线 | `7cd9cd8` |
| `/Volumes/Luochen/Business-work/Imaging-OnlineRetouchingOrder` | `feat/issue-19-ops-config` | 功能分支，包含功能提交，但不是主线 |
| `/private/tmp/imaging-issue-19-main` | `feat/issue-19-ops-config-main` | 功能分支，不是 `main` |

## 从 GitHub 分支页面读这张截图

下面这张图是 GitHub 的远端分支页面。它能说明远端有哪些 branch、分支相对 `main` 的提交差异，以及哪些分支关联了 PR；它不能说明本地哪个目录是 worktree，也不能说明本地 worktree 有没有未提交改动。

![GitHub 分支列表截图](/github-branches-20260823.png)

这张截图里实际有一个默认分支和五个个人分支。`Your branches` 与 `Active branches` 是同一批分支的两种展示，不是两套不同的分支。

| 截图中的分支 | 这代表什么 | 截图里的 `Behind / Ahead` |
| --- | --- | --- |
| `main` | 远端默认主线，其他分支通常以它作为比较基线 | 默认分支 |
| `feat/issue-19-ops-config` | Issue 19 的功能分支 | `Behind 61 / Ahead 22`，已经和 `main` 分叉，不能当成主线 |
| `fix/refresh-dispatch-test` | 刷新派发测试的修复分支 | `Behind 3 / Ahead 0`，当前没有相对 `main` 的独有提交 |
| `fix/optional-retoucher-leader` | 允许没有 leader 的修复分支 | `Behind 4 / Ahead 0`，当前没有相对 `main` 的独有提交 |
| `fix/order-500-datetime-serialization` | 修复订单 500 时间序列化 | `Behind 7 / Ahead 1`，有 1 个分支独有提交 |
| `fix/remove-order-delay` | 删除订单延期流程的修复分支 | `Behind 33 / Ahead 0`，关联 PR #57，但分支当前没有相对 `main` 的独有提交 |

`Behind` 和 `Ahead` 要这样读：

- `Behind 61`：这个分支缺少 `main` 上的 61 个提交。
- `Ahead 22`：这个分支有 22 个 `main` 没有的提交。
- 两个数字同时大于 0：说明两条分支已经分叉，不是“功能分支自动包含最新主线”。
- `Ahead 0`：不代表分支一定没有历史，也不代表 PR 一定已经合并；只能说明当前相对 `main` 没有独有提交，是否关闭或删除要另查 PR、提交和 worktree。

截图里的绿色 `3 / 3` 只表示检查通过，不表示分支已经合并；`Pull request` 列只表示 GitHub 找到了关联 PR，空白也不等于没有代码改动。右侧的垃圾桶是删除远端分支的入口，在 dirty state、PR 状态和 worktree 映射没有核对之前不能点击。

这也是这次事故必须区分的两张表：

```text
GitHub 分支页面：远端 branch / behind / ahead / PR / CI
本地 worktree：目录路径 / 当前 branch / HEAD / git status / 未跟踪文件
```

只有把两张表按 branch 连接起来，才能知道一个 GitHub 分支对应哪个本地目录，以及这个目录里的改动是否已经安全交接。

正确的恢复关系应该是：

```text
origin/main（7cd9cd8）
  + feat/issue-19-ops-config 的功能提交
  + 各 worktree 尚未提交的改动
```

不能直接把 `feat/issue-19-ops-config` 当成 `main`。它虽然包含 21 个功能提交，但同时缺少远端主线上的提交；正确做法是从 `origin/main` 创建隔离 worktree，再逐步合并或 cherry-pick 功能提交，逐文件解决冲突。

## 复核时先排除清理行为

事故复盘的第一条边界是：**在真实状态没有盘点完成之前，所有清理行为一律排除。**

本次复核没有执行以下动作：

- `git worktree remove`
- `git worktree prune`
- `git clean`
- `git reset`
- 强制 checkout、覆盖目录或删除分支

2026-08-23 的只读审计显示：当前共有 15 个 worktree；当前主工作目录（`feat/issue-19-ops-config`）有 14 条 dirty 记录；`recovery/main-integrated` 有 36 条 dirty 记录；另有一个实际路径已经不存在、但仍被 Git 记录为 `prunable` 的 worktree。

![worktree 只读审计截图](/worktree-audit-20260823.png)

这张截图的意义不是证明“已经清理干净”，而是证明在清理前先留下了现场：哪些 worktree 存在、当前分支是什么、哪些目录有改动、哪些路径已经缺失。

## 根因

### 1. 把目录名当成了分支身份

`imaging-issue-21-main` 看起来像“Issue 21 的主线”，但它实际检出的是旧的本地 `main`。`imaging-issue-19-main` 也不是 `main`，实际是 `feat/issue-19-ops-config-main`。

如果只看目录名，就会把不同节点的功能分支误判成主线，后续恢复、合并和验证都会建立在错误前提上。

### 2. 把过期的本地 `main` 当成了真实基线

本地 `main` 的提交是 `92743ab`，而远端 `origin/main` 已经是 `7cd9cd8`，两者相差 81 个提交。

本地分支名字叫 `main`，不等于它代表当前主线。对于恢复和新 worktree 创建，必须先更新远端引用，再明确记录 `origin/main` 的提交 SHA。

### 3. 把功能分支当成了主线的替代品

功能分支拥有一部分新功能，不代表它包含最新主线。直接把功能分支当作主线，会同时带来两类问题：一方面缺少主线已有改动，另一方面把未经过正确集成的功能改动带入恢复结果。

### 4. 没有先保护每个 worktree 的 dirty state

并行 worktree 里可能同时存在：

- 已提交但尚未合并的功能提交。
- 已修改但未提交的源码和测试。
- 未跟踪的截图、文档、录屏和验收材料。
- 已删除但尚未确认是否应恢复的文件。

只看分支提交，不看 `git status --short`，就无法知道实际工作成果是否已经安全交接。此时执行清理、覆盖或强制切换，可能把还没有进入 Git 历史的改动直接带走。

## 正确的恢复流程

### 第一步：锁定真实基线

```bash
git fetch origin main
git rev-parse origin/main
```

把返回的 SHA 写入任务记录。之后所有新的恢复 worktree 都从这个 SHA 创建，而不是从某个目录名或不确定的本地 `main` 创建。

### 第二步：建立真实映射

每个 DAG 节点都记录以下四项：

```text
任务 / branch / worktree 路径 / BASE_SHA
```

判断依据固定为：

```bash
git worktree list --porcelain
git -C <worktree> branch --show-current
git -C <worktree> rev-parse HEAD
git -C <worktree> status --short
```

目录名只能帮助人阅读，不能参与基线判断。

### 第三步：隔离集成功能

从 `origin/main` 新建干净 worktree，再把功能分支的提交逐步合并或 cherry-pick 进去。每次冲突都要逐文件核对，不能用整目录覆盖来“快速恢复”。

未提交改动则单独登记、保存和确认，不能把它们默认为某个分支已经包含的内容。

### 第四步：设置清理门禁

worktree 只有在完成安全交接后才能删除。完成的定义必须同时满足：

- `git status --short` 为空。
- 需要保留的改动已经提交并 push。
- PR、测试和验收证据已经交接。
- 未跟踪文件已经确认不需要，或已经单独归档。
- 没有下游节点继续引用该 worktree。

如果任一条件不满足，就禁止执行 `remove`、`prune`、`clean`、`reset` 或强制覆盖。

因此，“所有完成的 worktree 最终都要删掉”可以作为生命周期目标，但不能作为先于审计的自动动作。删除是最后一步，不是恢复流程的一部分。

## 以后如何验收

每次开始并行任务前，先留下：

```text
origin/main SHA
任务到 branch 的映射
branch 到 worktree 的映射
创建时的 git status
```

每个 worktree 完成时，再留下：

```text
最终 git status
最终 HEAD
push 结果
PR 或合并结果
未跟踪文件处理结果
```

只有创建证据和完成证据都存在，才允许清理 worktree。

## 复盘结论

这次事故真正暴露的不是 Git 命令不会用，而是缺少一套不可歧义的工作区生命周期：

> 先确认真实基线，再确认真实分支；先保护 dirty state，再允许恢复；先完成交接，最后才能清理。

PR 负责远程审核，DAG 负责依赖调度，worktree 负责本地隔离。三者都没有替代关系，必须通过明确的 branch、path、HEAD 和 status 映射连接起来。
