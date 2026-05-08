<template>
  <div class="history-page">
    <div class="page-header">
      <h2>历史记录</h2>
      <p class="page-desc">查看和管理历史生成记录，支持复制和再次生成</p>
    </div>

    <div class="history-toolbar" v-if="list.length > 0">
      <el-button type="danger" plain size="small" @click="handleClearAll">
        清空全部记录
      </el-button>
    </div>

    <div v-if="list.length === 0" class="history-empty">
      <el-empty description="暂无历史记录，去首页生成文案吧" />
    </div>

    <div v-else class="history-list">
      <div
        v-for="item in list"
        :key="item.id"
        class="history-card"
      >
        <div class="history-card-header">
          <div class="history-card-title">
            <span class="product-name">{{ item.productName }}</span>
            <el-tag size="small" type="info">{{ platformLabel(item.platform) }}</el-tag>
            <el-tag size="small" type="info">{{ languageLabel(item.language) }}</el-tag>
          </div>
          <div class="history-card-time">{{ item.createdAt }}</div>
        </div>

        <div class="history-card-body">
          <pre class="history-result">{{ item.result }}</pre>
        </div>

        <div class="history-card-footer">
          <el-button size="small" plain @click="copyItem(item)">
            <el-icon style="margin-right: 4px"><DocumentCopy /></el-icon>
            复制
          </el-button>
          <el-button size="small" plain @click="regenerate(item)">
            <el-icon style="margin-right: 4px"><Refresh /></el-icon>
            再次生成
          </el-button>
          <el-button size="small" type="danger" plain @click="deleteItem(item.id)">
            <el-icon style="margin-right: 4px"><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentCopy, Refresh, Delete } from '@element-plus/icons-vue'
import { getHistoryList, deleteHistory, clearHistory, type HistoryItem } from '@/utils/storage'
import { generateByAI } from '@/api/ai'
import { buildPrompt } from '@/utils/prompt'
import { saveHistory } from '@/utils/storage'

const list = ref<HistoryItem[]>(getHistoryList())

function platformLabel(val: string): string {
  const map: Record<string, string> = {
    amazon: 'Amazon',
    shopee: 'Shopee',
    tiktok: 'TikTok Shop'
  }
  return map[val] || val
}

function languageLabel(val: string): string {
  const map: Record<string, string> = {
    chinese: '中文',
    english: '英文',
    japanese: '日文'
  }
  return map[val] || val
}

function copyItem(item: HistoryItem) {
  navigator.clipboard.writeText(item.result).then(() => {
    ElMessage.success('已复制到剪贴板')
  })
}

async function regenerate(item: HistoryItem) {
  try {
    const prompt = buildPrompt({
      productName: item.productName,
      sellingPoints: item.sellingPoints,
      platform: item.platform,
      language: item.language,
      type: item.type
    })
    const content = await generateByAI(prompt)

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      productName: item.productName,
      sellingPoints: item.sellingPoints,
      platform: item.platform,
      language: item.language,
      type: item.type,
      result: content,
      createdAt: new Date().toLocaleString('zh-CN')
    }
    saveHistory(newItem)
    list.value = getHistoryList()
    ElMessage.success('重新生成成功')
  } catch (err: any) {
    ElMessage.error('生成失败：' + (err?.message || '未知错误'))
  }
}

function deleteItem(id: string) {
  deleteHistory(id)
  list.value = getHistoryList()
  ElMessage.success('已删除')
}

function handleClearAll() {
  ElMessageBox.confirm('确认清空所有历史记录？此操作不可恢复。', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    clearHistory()
    list.value = []
    ElMessage.success('已清空全部记录')
  })
}
</script>

<style scoped>
.history-page {
  max-width: 1000px;
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

.history-toolbar {
  margin-bottom: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  padding: 20px;
}

.history-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 8px;
}

.history-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.history-card-time {
  font-size: 13px;
  color: #909399;
}

.history-result {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.history-card-footer {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.history-empty {
  padding: 80px 0;
}
</style>
