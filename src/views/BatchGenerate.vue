<template>
  <div class="batch-page">
    <div class="page-header">
      <h2>批量生成</h2>
      <p class="page-desc">批量管理商品信息，一键生成多平台文案，支持 Excel 导入导出</p>
    </div>

    <div class="batch-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" @click="addRow">
          <el-icon style="margin-right: 4px"><Plus /></el-icon>
          新增行
        </el-button>
        <el-button
          type="success"
          :loading="batchLoading"
          :disabled="rows.length === 0"
          @click="batchGenerate"
        >
          <el-icon style="margin-right: 4px"><MagicStick /></el-icon>
          批量生成
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-upload
          accept=".xlsx,.xls"
          :show-file-list="false"
          :before-upload="handleImport"
          :auto-upload="false"
        >
          <el-button plain>
            <el-icon style="margin-right: 4px"><Upload /></el-icon>
            导入 Excel
          </el-button>
        </el-upload>
        <el-button plain :disabled="rows.length === 0" @click="handleExport">
          <el-icon style="margin-right: 4px"><Download /></el-icon>
          导出 Excel
        </el-button>
      </div>
    </div>

    <div class="batch-table">
      <el-table :data="rows" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column label="商品名称" min-width="160">
          <template #default="{ row }">
            <el-input v-model="row.productName" placeholder="请输入商品名称" size="small" />
          </template>
        </el-table-column>

        <el-table-column label="核心卖点" min-width="200">
          <template #default="{ row }">
            <el-input v-model="row.sellingPoints" placeholder="请输入核心卖点" size="small" />
          </template>
        </el-table-column>

        <el-table-column label="平台" width="140">
          <template #default="{ row }">
            <el-select v-model="row.platform" size="small" style="width: 100%">
              <el-option label="Amazon" value="amazon" />
              <el-option label="Shopee" value="shopee" />
              <el-option label="TikTok Shop" value="tiktok" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="语言" width="110">
          <template #default="{ row }">
            <el-select v-model="row.language" size="small" style="width: 100%">
              <el-option label="中文" value="chinese" />
              <el-option label="英文" value="english" />
              <el-option label="日文" value="japanese" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="文案类型" width="130">
          <template #default="{ row }">
            <el-select v-model="row.type" size="small" style="width: 100%">
              <el-option label="全部" value="all" />
              <el-option label="标题" value="title" />
              <el-option label="描述" value="description" />
              <el-option label="SEO" value="seo" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.loading" type="warning" size="small">生成中</el-tag>
            <el-tag v-else-if="row.result" type="success" size="small">已生成</el-tag>
            <el-tag v-else type="info" size="small">未生成</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="生成结果" min-width="180">
          <template #default="{ row }">
            <div v-if="row.result" class="result-cell">
              <span class="result-preview">{{ row.result.slice(0, 60) }}...</span>
              <el-button type="primary" link size="small" @click="showResult(row)">查看</el-button>
            </div>
            <span v-else class="no-result">-</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="{ $index }">
            <el-button type="danger" link size="small" @click="removeRow($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="resultDialogVisible" title="生成结果" width="700px">
      <pre class="dialog-result">{{ currentResult }}</pre>
      <template #footer>
        <el-button @click="copyDialogResult" type="primary">复制</el-button>
        <el-button @click="resultDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, MagicStick, Upload, Download } from '@element-plus/icons-vue'
import { generateByAI } from '@/api/ai'
import { buildPrompt } from '@/utils/prompt'
import { exportToExcel, importFromExcel, type ExportRow } from '@/utils/exportExcel'

interface BatchRow {
  productName: string
  sellingPoints: string
  platform: string
  language: string
  type: string
  loading: boolean
  result: string
}

const rows = reactive<BatchRow[]>([])
const batchLoading = ref(false)

const resultDialogVisible = ref(false)
const currentResult = ref('')

function addRow() {
  rows.push({
    productName: '',
    sellingPoints: '',
    platform: 'amazon',
    language: 'chinese',
    type: 'all',
    loading: false,
    result: ''
  })
}

function removeRow(index: number) {
  rows.splice(index, 1)
}

async function batchGenerate() {
  const emptyRows = rows.filter((r) => !r.productName.trim())
  if (emptyRows.length > 0) {
    ElMessage.warning('请填写所有商品的名称')
    return
  }

  batchLoading.value = true

  for (const row of rows) {
    if (row.result && !row.loading) continue

    row.loading = true
    try {
      const prompt = buildPrompt({
        productName: row.productName,
        sellingPoints: row.sellingPoints,
        platform: row.platform,
        language: row.language,
        type: row.type
      })
      row.result = await generateByAI(prompt)
    } catch (err: any) {
      row.result = '生成失败：' + (err?.message || '未知错误')
    } finally {
      row.loading = false
    }
  }

  batchLoading.value = false
  ElMessage.success('批量生成完成')
}

function showResult(row: BatchRow) {
  currentResult.value = row.result
  resultDialogVisible.value = true
}

function copyDialogResult() {
  navigator.clipboard.writeText(currentResult.value).then(() => {
    ElMessage.success('已复制到剪贴板')
  })
}

async function handleImport(file: File) {
  try {
    const data = await importFromExcel(file)
    data.forEach((item) => {
      rows.push({
        productName: item.商品名称 || '',
        sellingPoints: item.核心卖点 || '',
        platform: mapPlatform(item.平台),
        language: mapLanguage(item.语言),
        type: mapType(item.文案类型),
        loading: false,
        result: item.生成结果 || ''
      })
    })
    ElMessage.success(`成功导入 ${data.length} 条数据`)
  } catch {
    ElMessage.error('导入失败，请检查文件格式')
  }
  return false
}

function handleExport() {
  const data: ExportRow[] = rows.map((row) => ({
    商品名称: row.productName,
    核心卖点: row.sellingPoints,
    平台: reverseMapPlatform(row.platform),
    语言: reverseMapLanguage(row.language),
    文案类型: reverseMapType(row.type),
    生成结果: row.result
  }))
  exportToExcel(data)
  ElMessage.success('导出成功')
}

function mapPlatform(name: string): string {
  const map: Record<string, string> = {
    'Amazon': 'amazon',
    'amazon': 'amazon',
    'Shopee': 'shopee',
    'shopee': 'shopee',
    'TikTok': 'tiktok',
    'TikTok Shop': 'tiktok',
    'tiktok': 'tiktok'
  }
  return map[name] || 'amazon'
}

function reverseMapPlatform(val: string): string {
  const map: Record<string, string> = {
    amazon: 'Amazon',
    shopee: 'Shopee',
    tiktok: 'TikTok Shop'
  }
  return map[val] || val
}

function mapLanguage(name: string): string {
  const map: Record<string, string> = {
    '中文': 'chinese',
    'chinese': 'chinese',
    '英文': 'english',
    'english': 'english',
    '日文': 'japanese',
    'japanese': 'japanese'
  }
  return map[name] || 'chinese'
}

function reverseMapLanguage(val: string): string {
  const map: Record<string, string> = {
    chinese: '中文',
    english: '英文',
    japanese: '日文'
  }
  return map[val] || val
}

function mapType(name: string): string {
  const map: Record<string, string> = {
    '全部': 'all',
    'all': 'all',
    '标题': 'title',
    'title': 'title',
    '描述': 'description',
    'description': 'description',
    'SEO': 'seo',
    'seo': 'seo'
  }
  return map[name] || 'all'
}

function reverseMapType(val: string): string {
  const map: Record<string, string> = {
    all: '全部',
    title: '标题',
    description: '描述',
    seo: 'SEO'
  }
  return map[val] || val
}
</script>

<style scoped>
.batch-page {
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

.batch-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.batch-table {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
}

.result-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-preview {
  color: #606266;
  font-size: 13px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-result {
  color: #c0c4cc;
}

.dialog-result {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  max-height: 500px;
  overflow-y: auto;
}
</style>
