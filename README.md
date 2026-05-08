# AI 跨境运营助手

面向跨境电商运营人员的 AI 文案生成工具，支持多平台、多语言、批量生成和 Excel 导入导出。

## 功能特性

- **AI 商品文案生成** — 输入商品名称和卖点，自动生成标题、五点描述、详情和 SEO 关键词
- **多平台支持** — Amazon / Shopee / TikTok Shop
- **多语言支持** — 中文 / 英文 / 日文
- **文案类型** — 商品标题 / 商品描述 / SEO 关键词 / TikTok 口播文案
- **批量生成** — 表格批量管理商品，一键依次生成
- **Excel 导入导出** — 支持 xlsx/xls 格式的导入和导出
- **历史记录** — 基于 localStorage 自动保存，支持查看、复制、重新生成和删除

## 项目截图

### AI 生成（首页）

![AI生成首页](https://i.mji.rip/2026/05/08/aa98d5cf19ba6a2b51006ab4e86d4030.png)

### 批量生成

![批量生成](https://i.mji.rip/2026/05/08/adc0db2e0463340d9d5c52e7915750a4.png)

### 历史记录

![历史记录](https://i.mji.rip/2026/05/08/894cffd9d4a659ce66857aaead418f49.png)

> 截图路径为 `screenshots/` 目录。你需要手动截取三个页面的截图，分别命名为 `home.png`、`batch.png`、`history.png` 放入该目录即可。

## 技术栈

| 技术 | 说明 |
|---|---|
| Vue 3 | 渐进式前端框架 |
| Vite | 构建工具 |
| TypeScript | 类型安全 |
| Pinia | 状态管理 |
| Element Plus | UI 组件库 |
| Axios | HTTP 请求 |
| DeepSeek API | AI 大模型接口 |
| xlsx | Excel 读写 |

## 快速开始

### 环境要求

- Node.js >= 18
- Yarn（推荐）或 npm

### 安装依赖

```bash
# 进入项目目录
cd ai-cross-border

# 使用 yarn
yarn install

# 或使用 npm
npm install
```

### 配置 API Key

编辑项目根目录下的 `.env` 文件，填入你的 DeepSeek API Key：

```bash
VITE_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
```

> API Key 获取地址：[DeepSeek 开放平台](https://platform.deepseek.com/)

### 启动开发服务器

```bash
yarn dev

# 或
npm run dev
```

浏览器访问 `http://localhost:5173/` 即可使用。

### 构建生产版本

```bash
yarn build

# 或
npm run build
```

构建产物在 `dist/` 目录下，可直接部署到任意静态服务器。

## 项目结构

```
src/
├── api/
│   └── ai.ts              # DeepSeek API 调用封装
├── components/
│   ├── AiGenerateForm.vue # AI 生成输入表单
│   └── ResultPanel.vue    # 生成结果展示面板
├── router/
│   └── index.ts           # 路由配置
├── stores/
│   └── ai.ts              # Pinia 状态管理
├── utils/
│   ├── prompt.ts          # Prompt 构造器
│   ├── storage.ts         # localStorage 工具
│   └── exportExcel.ts     # Excel 导入导出
├── views/
│   ├── Home.vue           # 首页 - AI 生成
│   ├── BatchGenerate.vue  # 批量生成页
│   └── History.vue        # 历史记录页
├── App.vue                # 根组件
└── main.ts                # 入口文件
```

## 页面说明

### 1. AI 生成（首页）

左侧输入商品信息（名称、卖点、平台、语言、文案类型），点击"开始生成"，右侧展示 AI 结果。支持复制和重新生成。

### 2. 批量生成

以表格形式管理多个商品，支持新增行、删除行、批量依次生成。通过工具栏可导入 Excel 批量录入商品数据，也可将生成结果导出为 Excel。

### 3. 历史记录

自动保存每次生成的结果，以卡片形式展示。支持复制、重新生成和删除单条记录，也支持一键清空全部记录。

## 提示

- 批量生成采用逐行串行调用，避免并发请求触发 API 限流
- 历史记录存储在浏览器 localStorage 中，清除浏览器数据会丢失记录
- 导入 Excel 时，表头和字段映射会自动处理中英文名称
