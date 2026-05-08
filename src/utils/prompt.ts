export function buildPrompt(data: {
  productName: string
  sellingPoints: string
  platform: string
  language: string
  type: string
}) {
  const platformNames: Record<string, string> = {
    amazon: 'Amazon',
    shopee: 'Shopee',
    tiktok: 'TikTok Shop'
  }

  const languageNames: Record<string, string> = {
    chinese: '中文',
    english: '英文',
    japanese: '日文'
  }

  const platformName = platformNames[data.platform] || data.platform
  const languageName = languageNames[data.language] || data.language

  let typeRequirement = ''

  if (data.type === 'title') {
    typeRequirement = `请只生成商品标题（5个候选标题），每个标题一行，不要其他内容。`
  } else if (data.type === 'description') {
    typeRequirement = `请生成完整的商品描述，包括五点描述和详细描述。`
  } else if (data.type === 'seo') {
    typeRequirement = `请生成SEO搜索关键词列表，分为核心关键词和长尾关键词。`
  } else if (data.type === 'tiktok') {
    typeRequirement = `请生成适合TikTok短视频的口播文案，要求有吸引力的开头和明确的行动号召。`
  } else {
    typeRequirement = `请输出以下内容：
1. 商品标题（3-5个候选）
2. 五点描述
3. 商品详情描述
4. SEO关键词`
  }

  return `你是一名资深跨境电商运营专家。

请根据以下商品信息，生成适合 ${platformName} 平台的 ${languageName} 文案。

商品名称：${data.productName}

核心卖点：${data.sellingPoints}

要求：
1. 符合 ${platformName} 平台风格
2. 有营销转化能力
3. 语言自然流畅
4. 适合跨境电商场景
5. 输出结构清晰

${typeRequirement}`
}
