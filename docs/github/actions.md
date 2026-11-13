# 第 4 课　Actions：推上去就自动检查和上线

**这一课学完：** 每次推送或开 PR，GitHub 自动帮你装依赖、构建、跑测试；合进 main 以后自动上线。检查红了，你知道去哪找原因。

![自动流水线](/github/04.webp)

## Actions 是什么

GitHub Actions 是 GitHub 自带的自动化。你在仓库里放一个 YAML 文件，写清楚「什么时候触发、在什么机器上、按顺序做哪些事」，GitHub 就会照做。PR 页面上的绿色对勾和红色叉，就是它的结果。

文件放在 `.github/workflows/` 下面，名字随意，比如 `ci.yml`。

## 一个最小的检查流程

下面是一个 Node 项目的例子，每个 PR 都会构建并测试一遍：

```yaml
name: CI

on:
  pull_request:
    paths-ignore: ["docs/**", "**/*.md"]   # 只改文档时不跑

concurrency:                                # 同一个 PR 推了新提交，取消旧的那次
  group: ci-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10                     # 卡住最多跑 10 分钟
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm                        # 缓存依赖，下次快很多
      - run: npm ci
      - run: npm run build
      - run: npm test
```

Python、Go 等项目换掉 `setup-node` 和最后三行命令就行，结构一样。这类文件交给 AI 写就可以，你要看懂的是上面几行注释。

## 自动上线

最简单的上线是 GitHub Pages：静态网站、文档站可以免费放在 `你的用户名.github.io/仓库名`。在仓库 Settings → Pages 里把 Source 选成「GitHub Actions」，再加一个合并到 main 后构建并发布的工作流。

你现在看的这个网站就是这样上线的，工作流在仓库的 `.github/workflows/deploy.yml`。

要部署到自己的服务器，原理一样，只是最后一步换成连服务器发布，见 [CI/CD 流水线](/delivery/cicd)。

## 红了怎么查

1. 在 PR 的 Checks 或仓库的 Actions 页面点开失败的那次运行；
2. 找到第一个红色的步骤，展开看日志；
3. 往上翻，找第一条报错，后面的报错往往是被它连累的；
4. 在本地复现、修好、再推送。

**不要直接点「重新运行」。** 没改代码就重跑，大多还是红的，白白耗掉额度。只有确认是网络抖动这类偶发问题时才重跑。

## 额度

公开仓库用 GitHub 提供的标准机器是免费的。私有仓库在免费账号下每月有 2,000 分钟，macOS 机器按 10 倍算，Windows 按 2 倍算。所以：

- 推送前先在本地跑一遍检查；
- 改好一批再推，不要改一行推一次；
- 每个任务都设 `timeout-minutes`，没设的话默认最多能跑 6 小时。

## 这一步谁来做

| 交给 AI 的 | 你要判断和验收的 |
|---|---|
| 写工作流文件、读失败日志、修到变绿 | 检查真的覆盖了构建和测试；合并后部署那次运行成功；打开线上地址确认改动已经生效 |

## 练习

给第 1 课的项目加一个 `ci.yml`，故意写错一行让它变红，按上面四步找到报错，修好后看它变绿。

---

上一课：[第 3 课　Issue](/github/issue)　·　下一课：[第 5 课　什么不能进仓库](/github/secrets)
