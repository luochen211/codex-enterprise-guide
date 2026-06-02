# 服务器部署

服务器部署解决的是一个朴素问题：项目怎么稳定地被别人访问。

对于这个文档站，最小可行方案是 GitHub Pages。随着项目变复杂，可以逐步升级到云服务器、对象存储、CDN、应用托管平台或容器部署。

## 先分清几类平台

很多新手会把“服务器”“云服务器”“托管平台”混在一起。实际选型时，可以先按控制权来理解：

| 类型 | 你主要管理什么 | 典型平台 | 适合什么 |
| --- | --- | --- | --- |
| 云服务器 | 操作系统、运行环境、Nginx、日志、备份、安全配置 | 阿里云 ECS、腾讯云 CVM、华为云 ECS、AWS EC2、DigitalOcean Droplet | 想自己控制环境，或者需要长期稳定运行后端服务 |
| 应用托管平台 | 代码仓库、环境变量、构建命令、运行命令、数据库连接 | Railway、Render、Fly.io、Heroku | 想快速上线后端、Bot、API、定时任务，又不想维护服务器细节 |
| 前端/静态托管平台 | 静态文件、前端构建、预览环境、域名绑定 | Vercel、Netlify、Cloudflare Pages、GitHub Pages | 文档站、官网、前端应用、落地页 |
| 域名注册/管理平台 | 域名购买、DNS 解析、域名续费 | 阿里云域名、腾讯云域名、Cloudflare Registrar、Namecheap、GoDaddy | 购买域名，并把域名指向服务器或托管平台 |
| 对象存储 + CDN | 静态资源、访问加速、缓存策略 | 阿里云 OSS + CDN、腾讯云 COS + CDN、Cloudflare R2 | 图片、下载文件、大量静态资源分发 |

国内项目常见选择是阿里云。最典型的是阿里云 ECS，也就是传统云服务器：买到一台 Linux 机器，自己登录上去安装 Node、Nginx、数据库或 Docker，再配置域名和 HTTPS。

域名可以和服务器在同一家买，也可以分开买。比如服务器用阿里云，但域名和 DNS 放在 Cloudflare；或者域名在 Namecheap 买，DNS 托管到 Cloudflare，再把解析指向 Railway、Vercel 或自己的云服务器。

国外如果用 Railway，它更准确地说是“应用托管平台”或 PaaS，不是传统云服务器。它背后当然运行在云资源上，但你通常不直接管理一台 Linux 服务器，而是把代码、环境变量和启动命令交给平台，由平台帮你构建、运行、重启和暴露访问地址。

Vercel 则更偏前端/静态托管和 Serverless 平台。它非常适合部署 Next.js、React/Vue 前端、文档站和轻量 API，但如果你需要长期运行的后台进程、复杂内网服务或自己控制 Nginx，传统云服务器或应用托管平台会更合适。

## 三种部署形态

| 形态 | 适合阶段 | 典型方案 |
| --- | --- | --- |
| 静态托管 | 项目早期、文档站、官网 | GitHub Pages、Cloudflare Pages、Vercel |
| 应用托管 | 后端 API、Bot、小型全栈项目 | Railway、Render、Fly.io |
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

域名购买和域名解析可以分开理解：

- 域名注册商负责卖域名和续费，比如阿里云域名、腾讯云域名、Cloudflare Registrar、Namecheap、GoDaddy。
- DNS 负责把域名指向具体位置，比如服务器 IP、Vercel 项目地址、Railway 项目地址或 GitHub Pages 地址。
- Cloudflare 很常见，因为它既能买域名，也能托管 DNS，还能提供 CDN、防护和缓存。

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
