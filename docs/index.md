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
      text: 从路线开始
      link: /roadmap
    - theme: alt
      text: 查看部署方案
      link: /delivery/server

features:
  - title: 学习路线
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
