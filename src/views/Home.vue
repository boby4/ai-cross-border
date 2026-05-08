<template>
  <div class="home-page">
    <div class="page-header">
      <h2>AI 商品文案生成</h2>
      <p class="page-desc">输入商品信息，一键生成多平台跨境电商文案</p>
    </div>

    <div class="generate-layout">
      <div class="generate-left">
        <AiGenerateForm
          :form="store.form"
          :loading="store.loading"
          @generate="store.generate"
          @clear="store.clearForm"
        />
      </div>
      <div class="generate-right">
        <ResultPanel
          :result="store.result"
          :loading="store.loading"
          :error="store.error"
          @regenerate="store.generate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAiStore } from '@/stores/ai'
import AiGenerateForm from '@/components/AiGenerateForm.vue'
import ResultPanel from '@/components/ResultPanel.vue'

const store = useAiStore()
</script>

<style scoped>
.home-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.page-desc {
  font-size: 14px;
  color: #909399;
}

.generate-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .generate-layout {
    grid-template-columns: 1fr;
  }
}
</style>
