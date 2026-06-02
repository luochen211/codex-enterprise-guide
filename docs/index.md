---
layout: home

hero:
  name: Codex Enterprise Guide
  text: Codex 从 0 到企业级项目
  tagline: 一份面向个人、创作者、开发者与团队的实践指南。把 Codex 从“能帮我写代码”落到“能稳定进入真实工作流”。
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
    details: 先认识官网、Web 应用、小程序、App、管理后台、API 和自动化工具，避免一开始就把项目说虚。
  - title: 技术栈
    details: 理解前端、后端、数据库、存储、部署和 CI/CD 各自解决什么问题。
  - title: AI 友好代码
    details: 用高内聚、低耦合、单一职责组织代码，让 Codex 更容易读懂、修改和验证。
  - title: 学习路径
    details: 从第一次上手、工程实践、工作流扩展，到团队沉淀，按阶段建立能力。
  - title: 服务器部署
    details: 解释静态托管、云服务器、Nginx、HTTPS、日志、备份和回滚边界。
  - title: CI/CD 流水线
    details: 用自动检查、构建、预览环境和生产发布，把每次改动变成可追踪交付。
  - title: 团队 Playbook
    details: 沉淀 AGENTS.md、任务模板、权限策略、验收清单和复盘规范。
---

## 项目定位

这个项目不是 Codex 命令速查表，而是一套可以不断补充的工程化知识库。

它会围绕真实任务组织内容：怎么让 Codex 读懂项目，怎么提出可执行任务，怎么验证结果，怎么把成功经验沉淀成团队规范，怎么把文档站部署到公网，并让 CI/CD 接管每次发布。

在进入具体工具之前，它也会先补一层基础认知：一个项目可能是官网、小程序、Web 应用、管理后台、API 服务或自动化工具。先判断产品形态，再说明技术栈和代码组织方式，才能把交付边界和验收标准说清楚。

![Codex 学习路径：从会用到可交付](/learning-path.png)

## 当前落地形态

| 模块 | 当前状态 |
| --- | --- |
| 文档框架 | VitePress |
| 托管平台 | GitHub Pages |
| CI/CD | GitHub Actions |
| 构建命令 | `npm run build` |
| 本地预览 | `npm run dev` |

## 下一步内容

1. 补齐“第一次让 Codex 理解一个项目”的完整教程。
2. 补齐“服务器部署到公网”的操作记录。
3. 补齐“GitHub Actions 自动发布”的逐行解释。
4. 开始收集真实案例，把每个案例写成可复现模板。
