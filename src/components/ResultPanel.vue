<template>
  <div class="result-panel">
    <div class="result-header">
      <h3>生成结果</h3>
      <div class="result-actions" v-if="result">
        <el-button size="small" @click="copyResult" type="primary" plain>
          <el-icon style="margin-right: 4px"><DocumentCopy /></el-icon>
          复制
        </el-button>
        <el-button size="small" @click="$emit('regenerate')" plain>
          重新生成
        </el-button>
      </div>
    </div>

    <div class="result-body" v-loading="loading">
      <div v-if="error" class="result-error">
        <el-alert :title="error" type="error" show-icon :closable="false" />
      </div>

      <div v-else-if="result" class="result-content">
        <pre>{{ result }}</pre>
      </div>

      <div v-else class="result-empty">
        <el-empty description="输入商品信息，点击生成按钮开始" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

const props = defineProps<{
  result: string
  loading: boolean
  error: string
}>()

defineEmits<{
  regenerate: []
}>()

function copyResult() {
  if (!props.result) return
  navigator.clipboard.writeText(props.result).then(() => {
    ElMessage.success('已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}
</script>

<style scoped>
.result-panel {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  min-height: 400px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.result-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.result-body {
  min-height: 300px;
}

.result-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
}

.result-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.result-error {
  padding: 20px 0;
}
</style>
