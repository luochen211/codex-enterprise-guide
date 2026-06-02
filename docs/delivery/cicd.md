# CI/CD 流水线

CI/CD 解决的是另一个朴素问题：每次改动怎么被自动检查、构建和发布。

CI 是持续集成，负责验证代码质量。CD 是持续交付或持续部署，负责把通过验证的版本发布出去。

## 当前项目流水线

当前仓库是一个文档站，所以先用一条最小 workflow 跑通 GitHub Pages 部署。

流程是：

```text
push main
  -> npm ci
  -> npm run check
  -> npm run build
  -> upload Pages artifact
  -> deploy GitHub Pages
```

配置文件：

```text
.github/workflows/deploy.yml
```

这条 workflow 同时承担了检查、构建和发布，适合当前这种单应用、低复杂度项目。

但在复杂项目里，CI/CD 通常不是一条大流水线，而是一组 workflow。每条 workflow 负责一个清晰边界：一个应用、一个服务、一个环境，或者一个交付阶段。

## 为什么需要 CI/CD

没有 CI/CD 时，项目发布依赖人的记忆：

- 有没有跑构建？
- 构建产物是不是最新？
- 上传目录有没有选错？
- 失败后怎么回滚？

有 CI/CD 后，每次合并都走同一条流水线，结果可追踪，失败可定位，发布可复现。

## Workflow 的拆分方式

在 GitHub Actions 里，workflow 是 CI/CD 的落地文件，放在：

```text
.github/workflows/
```

一个复杂项目通常会有多条 workflow。例如：

```text
.github/workflows/
  ci-frontend-web.yml
  ci-frontend-admin.yml
  ci-frontend-dashboard.yml
  ci-backend-api.yml
  ci-backend-worker.yml
  deploy-dev.yml
  deploy-staging.yml
  deploy-prod.yml
  security-scan.yml
```

它背后的层级是：

```text
CI/CD 体系
  -> 多个 workflow
      -> 每个 workflow 负责一个应用、服务、环境或阶段
          -> 每个 workflow 里有多个 job
              -> 每个 job 里有多个 step
```

比如同一个前端项目，也可以继续按业务入口拆：

| Workflow | 负责范围 | 常见检查 |
| --- | --- | --- |
| `ci-frontend-web.yml` | 前台官网或用户端 | lint、typecheck、test、build |
| `ci-frontend-admin.yml` | 管理后台 | lint、typecheck、权限相关测试、build |
| `ci-frontend-dashboard.yml` | 数据大屏 | 图表组件测试、构建、截图冒烟 |
| `ci-backend-api.yml` | 后端 API | 单元测试、集成测试、接口契约检查 |
| `ci-backend-worker.yml` | 异步任务或定时任务 | 单元测试、任务执行冒烟、镜像构建 |

拆分的核心目的不是文件变多，而是让交付边界变清楚：

- 改了前台，只跑前台相关检查。
- 改了管理端，不阻塞后端无关服务。
- 后端 API 失败时，定位到 API workflow，而不是在一条巨大的流水线里翻日志。
- 生产发布可以单独审批，不被普通 PR 检查绑死。

如果项目是 monorepo，还可以配合 `paths` 触发条件，让不同目录变化只启动对应 workflow：

```yaml
on:
  pull_request:
    paths:
      - "apps/admin/**"
      - "packages/ui/**"
```

这表示只有管理端或共享 UI 包变化时，才触发这条 workflow。

## 推荐的企业级分层

| 阶段 | 触发条件 | 做什么 |
| --- | --- | --- |
| Pull Request | 提交 PR | 安装依赖、构建、基础测试 |
| Preview | PR 构建通过 | 生成预览地址，方便 review |
| Production | 合并 main | 发布到生产环境 |
| Rollback | 发布异常 | 回滚到上一个成功版本 |

## 当前项目后续可加的检查

### 链接检查

检查站内链接、外链和锚点是否失效。

### Playwright 冒烟测试

自动打开首页，确认页面标题、导航和关键内容存在。

### 内容规范检查

检查标题层级、空链接、重复页面和缺失 frontmatter。

### 部署通知

发布成功后，把线上地址和 commit 信息推送到团队群。

## 失败排查顺序

CI/CD 失败时，先按这个顺序看：

1. 依赖是否安装成功。
2. 构建命令是否能在本地复现。
3. 输出目录是否和 workflow 配置一致。
4. Pages 或服务器权限是否正确。
5. 最近一次提交改了哪些文件。

先复现，再修复。不要直接在服务器上手动改线上文件。
