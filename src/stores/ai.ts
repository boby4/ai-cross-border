import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateByAI } from '@/api/ai'
import { buildPrompt } from '@/utils/prompt'
import { saveHistory, type HistoryItem } from '@/utils/storage'

export interface GenerateForm {
  productName: string
  sellingPoints: string
  platform: string
  language: string
  type: string
}

export const useAiStore = defineStore('ai', () => {
  const loading = ref(false)
  const result = ref('')
  const error = ref('')

  const form = ref<GenerateForm>({
    productName: '',
    sellingPoints: '',
    platform: 'amazon',
    language: 'chinese',
    type: 'all'
  })

  async function generate() {
    if (!form.value.productName.trim()) {
      error.value = '请输入商品名称'
      return
    }

    loading.value = true
    error.value = ''
    result.value = ''

    try {
      const prompt = buildPrompt({
        productName: form.value.productName,
        sellingPoints: form.value.sellingPoints,
        platform: form.value.platform,
        language: form.value.language,
        type: form.value.type
      })

      const content = await generateByAI(prompt)
      result.value = content

      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        productName: form.value.productName,
        sellingPoints: form.value.sellingPoints,
        platform: form.value.platform,
        language: form.value.language,
        type: form.value.type,
        result: content,
        createdAt: new Date().toLocaleString('zh-CN')
      }
      saveHistory(historyItem)
    } catch (err: any) {
      error.value = err?.message || '生成失败，请稍后重试'
    } finally {
      loading.value = false
    }
  }

  function clearForm() {
    form.value = {
      productName: '',
      sellingPoints: '',
      platform: 'amazon',
      language: 'chinese',
      type: 'all'
    }
    result.value = ''
  }

  return {
    loading,
    result,
    error,
    form,
    generate,
    clearForm
  }
})
