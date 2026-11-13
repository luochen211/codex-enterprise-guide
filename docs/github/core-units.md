# 第 0 课　三个核心单位：Issue、PR、GHSA

**这一课学完：** 你分得清 GitHub 上的三个核心单位：Issue 是一件要做的事，PR 是一批要合进主线的改动，GHSA 是一个安全漏洞的公告。其他功能可以先不知道，这三个一定要知道。

![三个核心单位](/github/00.webp)

## 三个单位并排看

| | Issue | PR | GHSA |
|---|---|---|---|
| 是什么 | 一件要做的事，或一个问题 | 一批要合进主线的改动 | 一个安全漏洞的公告 |
| 回答什么问题 | 要做什么，为什么做 | 怎么做的，能不能合 | 哪个包的哪些版本有漏洞，升到哪个版本安全 |
| 谁开 | 发现问题的人：你、用户、同事 | 写改动的人：你、AI、贡献者 | 项目维护者起草和发布；发现漏洞的人可以私下提交报告 |
| 在哪看 | 仓库的 Issues 页 | 仓库的 Pull requests 页 | 仓库的 Security and quality 页；所有公开公告在 github.com/advisories |
| 编号长什么样 | `#12` | `#13` | `GHSA-xxxx-xxxx-xxxx` |

Issue 和 PR 在同一个仓库里共用一套编号，所以有了 Issue #12，就不会再有 PR #12。

## 三者的关系

```text
Issue #12  订单金额为零时也能提交         ← 要做什么
   ↓
PR #13     说明里写 Closes #12            ← 怎么做的
   ↓ 合并
#12 自动关闭
```

Issue 说要做什么，PR 是怎么做的。一件普通的事，就是一个 Issue 加一个 PR。

安全漏洞走另一条路。公开仓库的 Issue 谁都能看，把漏洞细节写进去，等于告诉所有人怎么攻击还没升级的用户。所以安全漏洞不能开公开 Issue，要走 GHSA 这条专用通道：私下报告，私下修，发了修复版本再公开公告。

## Issue：一件事一个编号

Issue 是仓库里的一张任务单。要修的问题、要加的功能、要回答的疑问，都可以开一个。

它是基本单位，因为事情有了编号才能被引用、分配和关闭。讨论、截图、最后的决定都留在这一个编号下面。分支名、提交说明、PR 说明里写上 `#12`，就能指回这件事。

怎么写一张好 Issue、怎么从 Issue 走到合并，见 [第 3 课　Issue](/github/issue)。

## PR：一批改动一个编号

PR（Pull Request，合并请求）把一条分支上的改动打包，请求合进主线。改了哪些文件、自动检查过没过、谁提了什么意见，都在 PR 页面上。

它是基本单位，因为主线上的每一次变化都能追到一个 PR：谁改的、为什么改、检查结果是什么。出了问题，也是按 PR 整个退回。

PR 和 Issue 靠 PR 说明里的一行连起来：

```text
Closes #12
```

PR 合进默认分支时，#12 自动关闭。开分支、开 PR、合并的命令见 [第 2 课　分支和 PR](/github/branch-and-pr)。

## GHSA：安全漏洞的公告

### 先认几个名词

- **GHSA**：GitHub Security Advisory（GitHub 安全公告）的编号。格式是 `GHSA-xxxx-xxxx-xxxx`，后面三段是随机分配的小写字母和数字。在 GitHub 上新建一份公告，或者 GitHub 从别处收录一份公告时，它就拿到一个 GHSA 编号。
- **GitHub Advisory Database**：GitHub 的漏洞公告库，地址是 github.com/advisories，收录开源软件包里已知的漏洞和恶意软件。来源有四个：GitHub 上各仓库发布的公告、美国国家漏洞库（NVD）、npm 的安全公告、社区提交。
- **CVE**：全行业通用的漏洞编号，格式像 `CVE-2025-12345`。只有授权机构（叫 CNA）能发，GitHub 是其中之一。一份公告可以同时有 GHSA 和 CVE 两个编号：GHSA 是 GitHub 的编号，CVE 是行业通用的编号。从 NVD 收录的公告会链接到对应的 CVE 记录。
- **Dependabot 告警**：Dependabot 是 GitHub 自带的依赖检查工具。仓库开了 Dependabot alerts 以后，它拿你项目里的依赖和版本去对公告库，对上了就发告警。

公告库里的公告分三类：GitHub 审核过的、没审核的（直接从 NVD 导入）、恶意软件。只有审核过的才会触发 Dependabot 告警，所以一个新漏洞从公开到你收到告警，中间可能隔一段时间。

下面按三种身份讲。

### 你是使用者：收到告警怎么办

Dependabot 告警公开仓库和私有仓库都能开：仓库 Settings → 左侧 Security and quality 一栏 → Advanced Security，在 Dependabot alerts 右边点 Enable。

告警在仓库的 Security and quality 页，左侧 Findings 下的 Dependabot → Vulnerabilities。每条告警都链接到一份公告。

要不要处理，看四件事：

1. **严重程度。** 公告标了四档之一：Critical、High、Moderate、Low。高的先处理。
2. **这个包在哪用。** 上线运行时要用的包，比只在开发时用的包要紧。开发用的依赖，告警上会带 Development 标签。
3. **你用没用到出问题的部分。** 公告会写受影响的函数。有的告警还能显示调用路径，说明你的代码可能调到它；这只说明可能，不能证明一定能被利用。
4. **有没有修复版本。** 有，就升级。没有，看公告里的临时办法，或者换一个包。恶意软件公告没有修复版本，直接停用那个包。

有修复版本的，默认就升，越早越好。升级要跨大版本、改动大的，开一个 Issue 排上日程。确认不受影响的，在告警上点 Dismiss，选一个原因关掉，留个记录。

**怎么升级：**

- 开了 Dependabot security updates，它会自动开一个 PR，把依赖升到包含修复的最低版本。没开的话，在告警详情页顶部点 Create Dependabot security update，也能让它开 PR。
- 间接依赖（你的依赖又依赖的包）要连带升级上层包时，多数语言生态里 Dependabot 做不了。这种情况交给 AI。
- 交给 AI 时，给它 GHSA 编号或告警链接，让它查受影响版本、升到修复版本、跑构建和测试、开 PR。

**你验收：** PR 里只动了依赖文件和必要的代码；版本到了公告写的修复版本或更高；检查全绿；合并后再看告警页，这条告警已经移到 Closed 里。

### 你是维护者：有人报告了漏洞

仓库安全公告和私密漏洞报告只用于公开仓库。

**先准备好两样东西：**

1. **开启私密漏洞报告（Private vulnerability reporting）。** 仓库 Settings → 左侧 Security and quality 一栏 → Advanced Security，在 Private vulnerability reporting 右边点 Enable。仓库所有者和管理员能开。开了以后，别人在仓库的 Advisories 页能看到 Report a vulnerability 按钮，可以私下提交报告。
2. **写 SECURITY.md。** 这是仓库的安全说明。在 Security and quality 页，左侧 Reporting 下点 Security policy → Start setup。写两件事：哪些版本还在维护，发现漏洞怎么报告。提交时按第 2 课开分支、走 PR。

**收到报告以后：**

1. **看报告。** 在 Security and quality 页，左侧 Reporting 下点 Advisories。私下报告来的公告状态是 Triage（待分诊）。
2. **决定接不接。** 确认是漏洞，点 Accept and open as draft，它变成一份草稿公告，仍然不公开。要追问，就在公告下评论，报告人能看到；只想和有写权限的同事商量，勾选 Confidential 发保密评论。确认不是安全问题，先写一句原因，再点 Close security advisory。
3. **自己发现的漏洞也走这里。** 在 Advisories 页点 New draft security advisory 起草，填标题、描述、受影响的包和版本、修复版本、严重程度。
4. **在临时私有 fork 里修。** 在公告页底部点 Start a temporary private fork。fork 是仓库的一份副本，这一份只有维护者和受邀的人能看到。在里面开 PR 修。注意 CI 和其他集成访问不了这个 fork，PR 上不跑检查，测试要在本地跑。修好后在公告页底部点 Merge pull request(s)，fork 里的 PR 一次全部合进来。
5. **需要的话申请 CVE。** 起草时在 CVE identifier 选以后申请，然后在公告页底部点 Request CVE。GitHub 通常在 72 小时内审核。申请 CVE 不会让公告公开。项目已经归别的 CNA 管的，GitHub 不能给它发 CVE。
6. **发了修复版本再公开。** 先发布包含修复的新版本，在公告里填上修复版本，再点 Publish advisory。公开后，临时 fork 会被删除；GitHub Security Lab 会审核这份公告，决定是否收进公告库。收进去以后，用到你这个包的项目会收到 Dependabot 告警。

公告里一定要填修复版本。不填的话，Dependabot 会告警，但告诉不了用户该升到哪个版本。

### 你是发现者：在别人的项目里发现漏洞

1. 打开那个仓库的 Security and quality 页。有 Report a vulnerability 按钮，就点它。默认要填摘要、细节、复现方法和影响。用了 AI 帮你找漏洞或写报告，勾上 I used AI assistance to find or write up this report。点 Submit report 提交。
2. 没有这个按钮，照仓库 SECURITY.md 里写的方式联系维护者。
3. 两样都没有，可以开一个 Issue，只问「安全问题该发给谁」。Issue 是公开的，里面不写任何漏洞细节。
4. 不要开公开 Issue 或 PR 透露细节。修复 PR 也一样：一个公开的修复 PR，等于指出了漏洞在哪。修复放在维护者的临时私有 fork 里做。
5. 等维护者发了修复版本再公开。联系不上维护者，或者对方拖得太久，过一段时间再公开也是业内接受的做法。

## 这一步谁来做

| 交给 AI 的 | 你要判断和验收的 |
|---|---|
| 把事情写成 Issue；开 PR 并写 `Closes #编号`；按 GHSA 编号查受影响版本、升级依赖、跑测试、开 PR；起草 SECURITY.md 和公告描述 | 这条告警要不要处理、什么时候处理；升级后的版本到了修复版本、检查全绿；漏洞细节没有出现在公开的 Issue、PR 和提交说明里；什么时候公开公告 |

## 练习

1. 打开 github.com/advisories，搜一个你项目里在用的包。点开一份公告，找到它的 GHSA 编号、CVE 编号（如果有）、受影响版本和修复版本。
2. 在自己的一个公开仓库里打开 Dependabot alerts 和 Private vulnerability reporting，再按上面的步骤加一个 SECURITY.md。
3. 在同一个仓库里开一个 Issue，再开一个 PR，说明里写 `Closes` 加上那个 Issue 的编号。看看两者的编号怎么排，合并后 Issue 有没有自动关闭。

---

上一课：[课程列表](/github/)　·　下一课：[第 1 课　仓库和提交](/github/repo-and-commit)
