# 从 Demo 到商用

一份写给有一定编程基础、但基础不扎实的人的实践指南：用 AI 编程，把 Demo 做成能收钱、能长期运行的项目。目标不是整理命令，而是把 AI 编程的用法沉淀成可学习、可复制、可团队化的工作流。

## 当前版本

这个项目现在已经升级为 VitePress 文档站：

- `docs/`：文档内容源
- `docs/.vitepress/config.mts`：站点配置、导航和侧边栏
- `docs/.vitepress/theme/`：主题扩展和首页 GitHub Star 提示
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

## 全书结构

在线阅读：<https://luochen211.github.io/codex-enterprise-guide/>

14 章，分五部分。每章只讲两件事：这一步交给 AI 做什么，你自己要判断、验收什么。全书用一个餐厅运营后台做示例项目。

| 部分 | 章节 |
| --- | --- |
| 开篇 | 序：从一单不到 2000 元的项目讲起；0 你停在哪个层次 |
| 一、想清楚做什么 | 1 Demo 和商用系统差在哪；2 先弄清业务怎么转；3 能用现成的就别自己造 |
| 二、让 AI 把它做出来 | 4 把需求拆成 AI 能做、你能验的任务；5 管住 AI：规则、工作流和审查；6 什么叫做完了 |
| 三、上线并稳住 | 7 第一天就上线；8 上线后别出事 |
| 四、能收钱、担得起责 | 9 收钱：支付、退款与对账；10 守住底线：权限、隐私与合规；11 算账与运营 |
| 五、和真实世界打交道 | 12 报价、排期与需求变更；13 出事了先找证据；14 交付、验收与维护 |
| 附录 | A 商用上线前自测清单；B 去哪找真实项目练手；C 术语表 |

章节页在 `docs/book/`，侧边栏在 `docs/.vitepress/sidebar.mts`。正文陆续发布；还没写好的章节先放这一章要讲的内容和配图。原来的指南文章收在站点的「参考资料」里，链接不变。

## 服务器介绍

这个项目后续可以按三个阶段演进：

1. 静态托管：适合早期文档站，可部署到 GitHub Pages、Cloudflare Pages、Vercel 或 Netlify。
2. 应用托管：适合快速部署后端 API、Bot 或小型全栈项目，例如 Railway、Render、Fly.io。Railway 更像 PaaS/应用托管平台，不是传统意义上需要自己登录维护的云服务器。
3. 云服务器：适合需要自己控制运行环境时使用，国内常见是阿里云 ECS，也可以用腾讯云、华为云等；国外类似 AWS EC2、DigitalOcean Droplet。部署时通常要自己配置 Linux、Nginx、域名、HTTPS、日志和备份。
4. 域名注册和 DNS：域名可以在阿里云、腾讯云、Cloudflare Registrar、Namecheap、GoDaddy 等平台购买。Cloudflare 很常见，因为它既能买域名，也能托管 DNS、CDN 和缓存。
5. 容器部署：适合团队化和多环境管理，用 Docker 固定运行环境，再接入日志、备份和回滚策略。

可以简单理解：阿里云 ECS 是“买一台云上的 Linux 机器”；Railway 是“把应用交给平台帮你跑”；Vercel 是“把前端或文档站交给平台帮你构建和发布”。

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

1. 按顺序写各章正文，写好一章发布一章。
2. 补齐附录：商用上线前自测清单、术语表。
