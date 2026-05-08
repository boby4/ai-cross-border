import * as XLSX from 'xlsx'

export interface ExportRow {
  商品名称: string
  核心卖点: string
  平台: string
  语言: string
  文案类型: string
  生成结果: string
}

export function exportToExcel(data: ExportRow[], filename: string = 'ai文案导出.xlsx') {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'AI文案')
  XLSX.writeFile(wb, filename)
}

export function importFromExcel(file: File): Promise<ExportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<ExportRow>(ws)
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
