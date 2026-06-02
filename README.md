# Codex 从 0 到企业级项目

一份面向个人、创作者、开发者与团队的 Codex 实践指南。目标不是整理命令，而是把 Codex 用法沉淀成可学习、可复制、可团队化的工作流。

## 当前版本

这个项目现在已经升级为 VitePress 文档站：

- `docs/`：文档内容源
- `docs/.vitepress/config.mts`：站点配置、导航和侧边栏
- `docs/.vitepress/theme/custom.css`：主题样式
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署流水线

本地启动：

```bash
npm install
npm run dev
```

然后访问：

```text
http://localhost:4173
```

构建：

```bash
npm run build
```

## 内容方向

- 学习路线：从第一次上手到企业级协作
- 入口地图：CLI、桌面 App、Cloud、IDE、ChatGPT 怎么选
- 配置专题：`config.toml`、MCP、Skills、Subagents、沙盒与审批
- 实践方法：任务设计、验证闭环、风险说明、复盘模板
- 实战案例：真实项目改造、CI 修复、Playwright 验证、AGENTS.md、自动化工作流
- 服务器部署：静态托管、云服务器、Nginx、HTTPS、域名、日志和备份
- CI/CD：自动检查、构建、测试、预览发布、生产发布和回滚
- 团队沉淀：规则文件、案例库、贡献规范和排障手册

## 服务器介绍

这个项目后续可以按三个阶段演进：

1. 静态托管：适合早期文档站，可部署到 GitHub Pages、Cloudflare Pages、Vercel 或 Netlify。
2. 云服务器：适合需要自己控制运行环境时使用，可用 Nginx 提供静态文件服务，并配置域名和 HTTPS。
3. 容器部署：适合团队化和多环境管理，用 Docker 固定运行环境，再接入日志、备份和回滚策略。

最小上线链路：

```text
本地开发 -> Git 提交 -> 自动构建 -> 上传构建产物 -> Nginx/静态平台对外访问
```

## CI/CD 介绍

CI 负责在代码合并前自动检查项目质量，CD 负责把通过检查的版本发布出去。

当前仓库是单个文档站，所以用一条 GitHub Pages workflow 跑通最小闭环。复杂项目会把 CI/CD 拆成多条 workflow，例如前台、管理端、数据大屏、后端 API、后台任务、预发部署、生产部署等。

推荐流水线层级：

1. Pull Request：自动检查 HTML/CSS/JS 基础问题，确认页面能构建。
2. Preview：为每个 PR 生成预览地址，方便 review 页面效果。
3. Main Branch：合并到主分支后自动发布到生产环境。
4. Rollback：保留历史构建产物，生产发布异常时可以快速回滚。

复杂项目的 workflow 可以这样拆：

```text
.github/workflows/
  ci-frontend-web.yml
  ci-frontend-admin.yml
  ci-frontend-dashboard.yml
  ci-backend-api.yml
  ci-backend-worker.yml
  deploy-staging.yml
  deploy-prod.yml
```

真正的价值是：谁变了就只跑谁，谁失败了就只看谁，谁发布就只审批谁。

后续如果迁移到 VuePress 或 VitePress，可以加入 `pnpm lint`、`pnpm build`、链接检查和 Playwright 冒烟测试。

当前仓库已经内置 GitHub Pages workflow：

```text
push main -> npm ci -> npm run check -> npm run build -> upload artifact -> deploy pages
```

## 下一步

1. 补第一篇教程：`第一次让 Codex 理解一个项目`
2. 补一个案例：`用 Codex 为当前项目生成 README 和首页`
3. 补一篇服务器部署教程：`把文档站发布到云服务器`
4. 补一篇 CI/CD 教程：`用 GitHub Actions 自动构建和发布`
5. 增加目录页：`roadmap.html`、`cases.html`、`playbook.html`
6. 需要更长期维护时，再迁移到 VuePress 或 VitePress
