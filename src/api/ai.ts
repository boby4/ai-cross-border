import axios from 'axios'

export interface GenerateParams {
  productName: string
  sellingPoints: string
  platform: string
  language: string
  type: string
}

export async function generateByAI(prompt: string) {
  const res = await axios.post(
    'https://api.deepseek.com/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return res.data.choices?.[0]?.message?.content || ''
}
