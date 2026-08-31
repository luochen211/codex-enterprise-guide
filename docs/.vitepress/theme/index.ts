import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import { useData } from "vitepress";
import StarPrompt from "./StarPrompt.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout() {
    const { frontmatter } = useData();
    return h(DefaultTheme.Layout, null, {
      "layout-bottom": () => frontmatter.value.layout === "home" ? h(StarPrompt) : null,
    });
  },
};
