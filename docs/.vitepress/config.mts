import { defineConfig } from "vitepress";
import { bookSidebar } from "./sidebar.mts";

export default defineConfig({
  title: "从 Demo 到商用",
  description: "用 AI 编程，把 Demo 做成能收钱、能长期运行的项目",
  base: "/codex-enterprise-guide/",
  cleanUrls: true,
  lang: "zh-CN",
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "目录", link: "/book/" },
      { text: "从序开始", link: "/book/preface" },
      { text: "参考资料", link: "/guide/overview" },
      { text: "案例", link: "/cases/" },
      { text: "GitHub", link: "https://github.com/luochen211/codex-enterprise-guide" },
    ],
    sidebar: [
      ...bookSidebar,
      {
        text: "参考资料",
        collapsed: true,
        items: [
          { text: "项目总览", link: "/guide/overview" },
          { text: "学习路径", link: "/roadmap" },
          { text: "产品形态", link: "/guide/product-forms" },
          { text: "从业务流转到系统设计", link: "/guide/system-design" },
          { text: "技术栈", link: "/guide/tech-stack" },
          { text: "对 AI 友好的代码", link: "/guide/ai-friendly-code" },
          { text: "仓库、分支、PR 与 worktree", link: "/guide/github-workflow" },
          { text: "服务器部署", link: "/delivery/server" },
          { text: "CI/CD 流水线", link: "/delivery/cicd" },
        ],
      },
      {
        text: "实践",
        collapsed: true,
        items: [
          { text: "案例库", link: "/cases/" },
          { text: "共建指南", link: "/contribute" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/luochen211/codex-enterprise-guide" },
    ],
    search: {
      provider: "local",
    },
    footer: {
      message: "从 Demo 到商用：用 AI 编程，把 Demo 做成能收钱、能长期运行的项目。",
      copyright: "Released under the MIT License.",
    },
  },
});
