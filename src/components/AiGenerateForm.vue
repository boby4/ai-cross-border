<template>
  <div class="ai-generate-form">
    <el-form :model="form" label-width="100px" label-position="top">
      <el-form-item label="商品名称">
        <el-input
          v-model="form.productName"
          placeholder="请输入商品名称，例如：无线蓝牙耳机"
          :rows="2"
          type="textarea"
        />
      </el-form-item>

      <el-form-item label="核心卖点">
        <el-input
          v-model="form.sellingPoints"
          placeholder="请输入核心卖点，例如：降噪功能、续航48小时、IPX5防水"
          :rows="3"
          type="textarea"
        />
      </el-form-item>

      <el-form-item label="目标平台">
        <el-select v-model="form.platform" style="width: 100%">
          <el-option label="Amazon" value="amazon" />
          <el-option label="Shopee" value="shopee" />
          <el-option label="TikTok Shop" value="tiktok" />
        </el-select>
      </el-form-item>

      <el-form-item label="目标语言">
        <el-select v-model="form.language" style="width: 100%">
          <el-option label="中文" value="chinese" />
          <el-option label="英文" value="english" />
          <el-option label="日文" value="japanese" />
        </el-select>
      </el-form-item>

      <el-form-item label="文案类型">
        <el-select v-model="form.type" style="width: 100%">
          <el-option label="全部" value="all" />
          <el-option label="商品标题" value="title" />
          <el-option label="商品描述" value="description" />
          <el-option label="SEO关键词" value="seo" />
          <el-option label="TikTok口播文案" value="tiktok" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="$emit('generate')"
          style="width: 100%"
        >
          {{ loading ? '正在生成...' : '开始生成' }}
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button @click="$emit('clear')" style="width: 100%">
          清空
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { GenerateForm } from '@/stores/ai'

defineProps<{
  form: GenerateForm
  loading: boolean
}>()

defineEmits<{
  generate: []
  clear: []
}>()
</script>

<style scoped>
.ai-generate-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}
</style>
