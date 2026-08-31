<script setup lang="ts">
import { ref } from "vue";

const repositoryUrl = "https://github.com/luochen211/codex-enterprise-guide";
const visible = ref(true);

function openRepository() {
  window.open(repositoryUrl, "_blank", "noopener,noreferrer");
  visible.value = false;
}
</script>

<template>
  <aside v-if="visible" class="star-prompt" aria-label="GitHub Star 提示">
    <button class="star-prompt-close" type="button" aria-label="关闭提示" @click="visible = false">
      ×
    </button>
    <div class="star-prompt-icon" aria-hidden="true">★</div>
    <div class="star-prompt-copy">
      <strong>觉得这个指南有用？</strong>
      <p>欢迎在 GitHub 上加个 Star，帮助更多开发者发现它。</p>
    </div>
    <div class="star-prompt-actions">
      <button class="star-prompt-primary" type="button" @click="openRepository">
        去 GitHub 加 Star
      </button>
      <button class="star-prompt-secondary" type="button" @click="visible = false">
        稍后
      </button>
    </div>
  </aside>
</template>
