# 技术栈

技术栈不是一串流行名词，而是一个项目为了完成交付所选择的工具组合。

对新手来说，先不用急着比较 React、Vue、Node.js、Python 谁更好。更重要的是理解：一个真实项目通常由哪些层组成，每一层解决什么问题，以及这些选择会如何影响开发、部署和维护。

## 技术栈解决什么问题

一个项目通常会遇到这些问题：

| 问题 | 对应技术层 |
| --- | --- |
| 用户在哪里看到和操作产品 | 前端、小程序、App、桌面端 |
| 数据和业务规则在哪里处理 | 后端服务、Serverless、云函数 |
| 数据保存在哪里 | 数据库、缓存、对象存储 |
| 用户如何登录和区分权限 | 鉴权、账号系统、角色权限 |
| 项目如何上线 | 静态托管、云服务器、容器、CI/CD |
| 出问题后如何排查 | 日志、监控、错误追踪 |

技术栈的本质，是把这些问题逐层回答清楚。

## 常见技术层

### 前端

前端负责用户能看到、能点击、能输入的部分。

常见选择：

- HTML、CSS、JavaScript
- Vue、React、Svelte
- Vite、Next.js、Nuxt、VitePress
- Ant Design、Element Plus、Tailwind CSS

适合让 Codex 做的任务：

- 新增页面和组件。
- 调整布局和交互。
- 接入接口数据。
- 修复浏览器报错和样式问题。

### 小程序端

小程序端负责在微信、支付宝、抖音等平台里提供轻量产品体验。

常见选择：

- 微信原生小程序。
- uni-app、Taro 等跨端框架。
- 平台登录、支付、订阅消息、分享能力。

适合让 Codex 做的任务：

- 拆分页面、组件和接口请求。
- 编写表单校验。
- 补充平台配置说明。
- 根据审核要求检查隐私、类目和域名配置。

### 后端

后端负责业务逻辑、数据处理、权限控制和接口输出。

常见选择：

- Node.js、Python、Java、Go、PHP。
- Express、NestJS、FastAPI、Spring Boot、Gin。
- REST、GraphQL、WebSocket。

适合让 Codex 做的任务：

- 新增接口。
- 调整业务规则。
- 处理错误码和边界情况。
- 补接口文档和测试用例。

### 数据库和存储

数据库负责保存结构化数据，存储服务负责保存图片、文件、视频等资源。

常见选择：

- MySQL、PostgreSQL、SQLite。
- MongoDB。
- Redis。
- S3、OSS、COS 等对象存储。

适合让 Codex 做的任务：

- 设计数据表字段。
- 编写迁移脚本。
- 优化查询逻辑。
- 补充数据备份和恢复说明。

### 部署和运维

部署负责让项目从本地运行变成公网可访问，运维负责持续稳定运行。

常见选择：

- GitHub Pages、Cloudflare Pages、Vercel、Netlify。
- 云服务器、Nginx、HTTPS、域名解析。
- Docker、Docker Compose。
- GitHub Actions、GitLab CI。

适合让 Codex 做的任务：

- 编写构建和发布脚本。
- 配置 GitHub Actions。
- 整理服务器部署步骤。
- 排查构建失败和发布失败。

## 不同产品形态的典型组合

| 产品形态 | 常见技术栈 |
| --- | --- |
| 官网/落地页 | Vite、Vue/React、静态托管、CDN |
| 文档站 | VitePress、Markdown、GitHub Pages |
| Web 应用 | React/Vue、后端 API、数据库、登录鉴权 |
| 小程序 | 小程序端、后端 API、云开发或对象存储、平台登录 |
| 管理后台 | Vue/React、组件库、后端管理接口、角色权限 |
| API 服务 | 后端框架、数据库、OpenAPI、日志监控 |
| 自动化工具 | Node.js/Python/Shell、命令行、定时任务、CI |

## 如何向 Codex 描述技术栈

不要只说“这是一个前端项目”。尽量把关键层说清楚：

```text
当前项目是一个 VitePress 文档站。

技术栈：
- 文档框架：VitePress
- 内容格式：Markdown
- 包管理：npm
- 部署方式：GitHub Pages
- 构建命令：npm run build

请在现有结构下新增文档页面，并确保 VitePress 可以构建通过。
```

更复杂的项目可以这样写：

```text
产品形态：微信小程序 + 管理后台
前端：微信小程序原生框架，后台使用 Vue 3 + Element Plus
后端：Node.js + NestJS
数据库：PostgreSQL
文件存储：对象存储
部署：云服务器 + Docker Compose

本次只修改小程序报名流程和后端报名接口，不改后台权限系统。
```

## 新手先记住一句话

技术栈不是越高级越好，而是越贴近产品形态、团队能力和交付要求越好。

对 Codex 来说，技术栈越清楚，它越能判断应该读哪些文件、运行哪些命令、遵守哪些框架约定，以及最后用什么方式验证结果。
