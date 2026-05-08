export interface HistoryItem {
  id: string
  productName: string
  sellingPoints: string
  platform: string
  language: string
  type: string
  result: string
  createdAt: string
}

const STORAGE_KEY = 'ai_cross_border_history'

export function getHistoryList(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHistory(item: HistoryItem): void {
  const list = getHistoryList()
  list.unshift(item)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function deleteHistory(id: string): void {
  const list = getHistoryList().filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
