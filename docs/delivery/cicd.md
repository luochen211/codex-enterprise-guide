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

## GitHub Secrets 是什么

GitHub Secrets 是 GitHub Actions 使用的加密敏感配置，用来保存不应该进入代码仓库的值，例如：

- 云服务 Access Key、部署 Token、第三方 API Key。
- 数据库密码、Webhook Token、私有 npm 注册表 Token。
- 测试环境或生产环境的登录凭证。

它解决的是“workflow 需要凭证，但凭证不能写进 Git”的问题。

不要把真实密钥写进以下位置：

- 源代码、`README.md`、`.env` 并提交到仓库。
- workflow 的 `run:` 命令、日志或错误信息。
- issue、PR 评论、截图或聊天记录。

即使仓库现在是私有的，也不应该把密钥当作普通配置提交。代码可能被复制、误公开、下载到本地，或者被未来的日志和构建产物带出去。密钥一旦泄露，应立即在提供方吊销并重新生成，不能只靠删除 Git 文件修复。

### 为什么当前项目没有添加 Secret

当前项目是 GitHub Pages 文档站，workflow 使用的是：

- `permissions.contents: read` 读取代码。
- `permissions.pages: write` 上传 Pages 发布产物。
- `permissions.id-token: write` 配合 GitHub Pages 官方部署流程进行身份验证。

当前的构建不需要第三方 API、数据库或云服务器凭证，所以没有必要为了“完整”而新增一个假 Secret。没有敏感凭证需要使用时，不添加 Secret 反而更安全、更容易维护。

如果以后增加服务器部署、域名服务、内容通知或外部 API，再根据具体服务添加最小范围的 Secret。

## 如何添加 GitHub Secret

### 通过 GitHub 网页添加仓库 Secret

你需要对仓库拥有写权限。进入仓库后：

1. 打开 `Settings`。
2. 进入 `Secrets and variables` → `Actions`。
3. 选择 `Secrets`，点击 `New repository secret`。
4. 在 `Name` 中填写变量名，例如 `DEPLOY_TOKEN`。
5. 在 `Secret` 中粘贴真实值，点击 `Add secret`。

页面大致如下。示例中的 Secret 名称仅用于演示，真实项目应根据实际服务命名：

![GitHub Actions Secrets 设置页面](/github-actions-secrets-settings.png)

Secret 创建后，GitHub 只显示它的名称，不提供再次查看原值的入口。需要更换时，直接更新或删除后重新添加；不要把旧值复制到 issue 或 PR 中。

### 通过 GitHub CLI 添加

先确认当前登录的是正确账号和仓库，再让 CLI 交互式读取值：

```bash
gh secret set DEPLOY_TOKEN --repo OWNER/REPO
```

也可以从本地文件读取：

```bash
gh secret set DEPLOY_TOKEN --repo OWNER/REPO < ./deploy-token.txt
```

不要把真实值直接写在命令行参数中，以免进入 shell 历史记录。临时文件使用后应立即删除，并确认没有被 Git 跟踪。

如果凭证只应该用于生产发布，可以使用 Environment Secret：

```bash
gh secret set --env production DEPLOY_TOKEN --repo OWNER/REPO
```

这样可以把 Secret 限定到 `production` 环境，并进一步配置 required reviewers，避免普通检查任务直接拿到生产凭证。

## 如何在 workflow 中使用

Secret 创建后，不会自动进入每个 step。需要在 workflow 中显式通过 `secrets` context 传给 action 或脚本：

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: ./scripts/deploy.sh
```

优先通过 `env` 传入程序，不要把 Secret 拼进命令字符串。日志中也不要输出它：

```yaml
# 错误示例：可能把凭证带入日志
- run: echo "token=${{ secrets.DEPLOY_TOKEN }}"
```

## Secret 不会自动让生产环境生效

添加 Secret 只是完成了“把变量安全地存放在 GitHub”这一步。它不会自动登录服务器，也不会自动写入服务器的 `.env`，更不会自动重启后端进程。

生产部署至少要走完这条链路：

```text
GitHub Secret
  -> Actions workflow 显式读取
  -> 部署脚本通过环境变量接收
  -> 脚本安全写入服务器环境文件
  -> 重启或重载后端服务
  -> 健康检查和业务验收
```

例如，workflow 可以把 Secret 传给部署脚本：

```yaml
- name: Deploy backend
  env:
    DEPLOY_SSH_HOST: ${{ secrets.DEPLOY_SSH_HOST }}
    DEPLOY_SSH_USER: ${{ secrets.DEPLOY_SSH_USER }}
    API_KEY: ${{ secrets.API_KEY }}
  run: ./scripts/deploy-backend.sh
```

部署脚本则需要在服务器上完成类似工作：

```bash
# 伪代码：具体路径和服务名按项目实际情况修改
printf '%s\n' "API_KEY=$API_KEY" | \\
  ssh "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST" 'umask 077 && cat > /srv/app/.env'
ssh "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST" 'sudo systemctl restart app-backend'
curl --fail https://api.example.com/health
```

真实脚本还需要解决 Secret 内容如何通过标准输入或受控文件传输、环境文件权限、服务用户权限、失败回滚和日志脱敏等问题。不要把 Secret 直接拼接进 SSH 命令，也不要在部署日志中打印环境文件内容。

因此，验证“Secret 配置完成”至少要分成三层：

1. **GitHub 层**：Actions 能读取到对应 Secret，且 job/Environment 权限正确。
2. **服务器层**：部署脚本确实把新值写入目标环境文件，文件权限和属主正确。
3. **应用层**：服务已重启或重载，健康检查和一条真实业务路径确认新配置生效。

当前项目只有 GitHub Pages 文档部署，没有生产后端或服务器部署脚本，因此这里只记录完整方法，不新增虚假的服务器 Secret 或部署代码。将来增加后端部署时，必须把“写入环境文件、重启服务、健康检查”作为同一个交付闭环实现。

### Repository、Environment 和 Organization Secret

| 类型 | 适合场景 | 权限范围 |
| --- | --- | --- |
| Repository Secret | 单个仓库使用的测试或部署凭证 | 当前仓库 |
| Environment Secret | staging、production 等环境隔离 | 指定环境，可配审批 |
| Organization Secret | 多个仓库共享的统一凭证 | 组织，可限制可用仓库 |

选择原则是“最小范围”：只给实际需要的 workflow、环境和仓库授权。用于生产发布的凭证通常应放在 Environment，而不是直接放成整个仓库都能使用的 Secret。

### Fork PR 的安全边界

来自 fork 的 PR 默认拿不到上游仓库的 Secrets。这是必要的安全边界，因为 PR 中的 workflow 代码可能被修改为读取或外传凭证。

因此：

- 普通 `pull_request` 检查应尽量不依赖 Secret。
- 不要为了让 fork PR 通过，随意把 Secret 暴露给外部贡献者。
- 需要发布或访问生产资源的 job，应放在受保护环境，并要求维护者审批。

详细规则可参考 [GitHub Secrets 官方文档](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)。

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
