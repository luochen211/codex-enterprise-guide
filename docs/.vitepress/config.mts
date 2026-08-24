import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Codex Enterprise Guide",
  description: "Codex 从 0 到企业级项目",
  base: "/codex-enterprise-guide/",
  cleanUrls: true,
  lang: "zh-CN",
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "学习路径", link: "/roadmap" },
      { text: "指南", link: "/guide/overview" },
      { text: "部署", link: "/delivery/server" },
      { text: "案例", link: "/cases/" },
      { text: "GitHub", link: "https://github.com/cuidong233/codex-enterprise-guide" },
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          { text: "项目总览", link: "/guide/overview" },
          { text: "产品形态", link: "/guide/product-forms" },
          { text: "从业务流转到系统设计", link: "/guide/system-design" },
          { text: "技术栈", link: "/guide/tech-stack" },
          { text: "对 AI 友好的代码", link: "/guide/ai-friendly-code" },
          { text: "学习路径", link: "/roadmap" },
        ],
      },
      {
        text: "GitHub 协作",
        items: [
          { text: "仓库、分支、PR 与 worktree", link: "/guide/github-workflow" },
        ],
      },
      {
        text: "工程化落地",
        items: [
          { text: "服务器部署", link: "/delivery/server" },
          { text: "CI/CD 流水线", link: "/delivery/cicd" },
        ],
      },
      {
        text: "实践",
        items: [
          { text: "案例库", link: "/cases/" },
          { text: "共建指南", link: "/contribute" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/cuidong233/codex-enterprise-guide" },
    ],
    search: {
      provider: "local",
    },
    footer: {
      message: "Built as a practical Codex enterprise guide.",
      copyright: "Released under the MIT License.",
    },
  },
});
