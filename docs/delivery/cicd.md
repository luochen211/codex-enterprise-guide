# CI/CD 流水线

CI/CD 解决的是另一个朴素问题：每次改动怎么被自动检查、构建和发布。

CI 是持续集成，负责验证代码质量。CD 是持续交付或持续部署，负责把通过验证的版本发布出去。

## 当前项目流水线

当前仓库使用 GitHub Actions 部署 GitHub Pages。

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

## 为什么需要 CI/CD

没有 CI/CD 时，项目发布依赖人的记忆：

- 有没有跑构建？
- 构建产物是不是最新？
- 上传目录有没有选错？
- 失败后怎么回滚？

有 CI/CD 后，每次合并都走同一条流水线，结果可追踪，失败可定位，发布可复现。

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
