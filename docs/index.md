---
layout: home

hero:
  name: Codex Enterprise Guide
  text: Codex 从 0 到企业级项目
  tagline: 不只让 Codex 写出代码，还要让它读懂项目、完成验证，并把结果稳定交付出去。
  image:
    src: /logo.svg
    alt: Codex Enterprise Guide
  actions:
    - theme: brand
      text: 从学习路径开始
      link: /roadmap
    - theme: alt
      text: 查看部署方案
      link: /delivery/server

features:
  - title: 产品形态
    details: 先判断你做的是官网、小程序、后台还是 API，避免一句“帮我做个系统”把任务说空。
  - title: 技术栈
    details: 看懂前端、后端、数据库、存储和部署各自负责什么，知道该让 Codex 去哪里改。
  - title: AI 友好代码
    details: 用高内聚、低耦合、单一职责组织代码，让 Codex 更容易读懂、修改和验证。
  - title: 学习路径
    details: 从第一个低风险任务开始，逐步走到真实仓库、自动发布和团队协作。
  - title: 服务器部署
    details: 解释静态托管、云服务器、Nginx、HTTPS、日志、备份和回滚边界。
  - title: CI/CD 流水线
    details: 用自动检查、构建、预览环境和生产发布，把每次改动变成可追踪交付。
  - title: 团队 Playbook
    details: 沉淀 AGENTS.md、任务模板、权限策略、验收清单和复盘规范。
---

## 项目定位

会让 Codex 生成一段代码，只是开始。后面还要判断修改位置是否正确、测试有没有覆盖、代码是否进入主线，以及线上是否真的生效。

这个项目围绕这些真实问题组织内容。你会看到怎样描述任务、怎样让 Codex 先读项目再动手、怎样检查结果，以及怎样把一次成功交付沉淀成团队可以重复使用的流程。

在进入工具之前，我们先补最容易被跳过的一层：你到底在做什么产品。官网、小程序、管理后台和 API 的交付方法完全不同。产品形态没说清，后面的技术栈、任务边界和验收都会跟着跑偏。

![Codex 学习路径：从会用到可交付](/learning-path.png)

## 当前落地形态

| 模块 | 当前状态 |
| --- | --- |
| 文档框架 | VitePress |
| 托管平台 | GitHub Pages |
| CI/CD | GitHub Actions |
| 构建命令 | `npm run build` |
| 本地预览 | `npm run dev` |

## 现在从哪里开始

第一次来，先走[学习路径](/roadmap)。如果你已经在真实仓库里工作，先读[GitHub 协作基础](/guide/github-workflow)；如果你正在排查事故，直接进入[案例库](/cases/)；准备上线时，再看[服务器部署](/delivery/server)和[CI/CD 流水线](/delivery/cicd)。
