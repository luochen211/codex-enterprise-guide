# 服务器部署

服务器部署解决的是一个朴素问题：项目怎么稳定地被别人访问。

对于这个文档站，最小可行方案是 GitHub Pages。随着项目变复杂，可以逐步升级到云服务器、对象存储、CDN 或容器部署。

## 三种部署形态

| 形态 | 适合阶段 | 典型方案 |
| --- | --- | --- |
| 静态托管 | 项目早期、文档站、官网 | GitHub Pages、Cloudflare Pages、Vercel |
| 云服务器 | 需要自己控制域名、日志、Nginx、备份 | Linux + Nginx + HTTPS |
| 容器部署 | 多环境、团队协作、后端服务 | Docker + 镜像仓库 + 部署脚本 |

## 当前项目采用的方案

当前仓库使用 GitHub Pages：

```text
本地写内容 -> push main -> GitHub Actions 构建 -> GitHub Pages 发布
```

线上访问地址：

```text
https://cuidong233.github.io/codex-enterprise-guide/
```

## 云服务器部署时需要理解什么

如果未来迁移到自己的服务器，至少要理解这些组件：

### 域名解析

域名负责把用户访问的地址指向服务器 IP。

常见记录：

| 类型 | 用途 |
| --- | --- |
| A 记录 | 指向 IPv4 地址 |
| CNAME | 指向另一个域名 |
| TXT | 验证域名所有权 |

### Nginx

Nginx 可以负责静态文件服务、反向代理、HTTPS 配置和访问日志。

最小静态站配置大概长这样：

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/codex-enterprise-guide;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### HTTPS

公开网站应该默认启用 HTTPS。常见做法是用 Let's Encrypt 申请免费证书，再由 Nginx 加载证书。

### 日志和备份

上线后要能回答：

- 谁访问了？
- 哪些请求失败了？
- 当前线上版本是什么？
- 出问题时能不能回滚？
- 内容和配置有没有备份？

## 最小服务器检查清单

- 域名已经解析到正确位置。
- HTTPS 可用。
- 首页返回 `200 OK`。
- 静态资源路径正确。
- 构建产物可以回滚。
- 服务器登录权限可控。
- 部署脚本不会覆盖未备份数据。
