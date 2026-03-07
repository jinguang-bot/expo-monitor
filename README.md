# Expo Monitor - 全球工业展会监控平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-green)](https://www.prisma.io/)

**一站式工业展会情报平台 v1.1** - 追踪全球58+工业展会，自动抓取最新新闻动态，自动抓取最新新闻动态

---

## 📖 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [数据库设计](#数据库设计)
- [API 文档](#api-文档)
- [部署指南](#部署指南)
- [开发进度](#开发进度)
- [未来规划](#未来规划)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目简介

Expo Monitor 是一个工业展会情报聚合平台，帮助用户：

- 📅 **追踪全球工业展会** - 涵盖中国、德国、美国、日本等主要工业国家的58+展会
- 🔍 **搜索和筛选** - 按状态、国家、行业快速定位目标展会
- 📰 **自动新闻抓取** - 通过 Brave Search API 自动抓取展会相关新闻
- 📊 **数据分析** - 可视化展会分布、状态统计、新闻热度

**适用场景：**
- 企业参展决策
- 市场趋势分析
- 竞品监测
- 行业新闻聚合

---

## 核心功能

### 1. 展会管理
- ✅ 58个工业展会数据（持续更新）
- ✅ 展会详情页（时间、地点、行业、官网）
- ✅ 状态追踪（即将开始、进行中、已结束）
- ✅ 国家和行业分类

### 2. 搜索与筛选
- ✅ 关键词搜索（展会名称、地点）
- ✅ 状态筛选（upcoming/ongoing/ended）
- ✅ 国家筛选
- ✅ 实时搜索结果

### 3. 新闻聚合
- ✅ Brave Search API 集成
- ✅ 自动抓取展会相关新闻
- ✅ 新闻列表展示（标题、描述、来源、时间）
- ✅ 新闻与展会关联

### 4. 定时任务功能（v1.1 新增）
- ✅ 自动定时抓取新闻
- ✅ API 端点（/api/cron/fetch-news）
- ✅ 独立脚本（scripts/cron-fetch-news.ts）
- ✅ 支持 3 种调度方式（系统 cron / API / 外部服务）
- ✅ 内置速率限制和错误处理
- ✅ 详细的日志和统计信息

**调度示例：**
```bash
# 系统 cron（推荐）
0 6 * * * cd /home/ubuntu/Projects/expo-monitor && npx tsx scripts/cron-fetch-news.ts

# 手动触发
curl http://localhost:3000/api/cron/fetch-news

# 抓取所有展会
npx tsx scripts/cron-fetch-news.ts --all
```

**详细文档：** 见 docs/CRON.md

### 5. 数据看板
### 4. 数据看板
- ✅ 展会状态分布可视化
- ✅ 国家分布统计（Top 10）
- ✅ 新闻数量统计
- ✅ 关键指标卡片

### 5. 响应式设计
- ✅ 移动端适配
- ✅ 桌面端优化
- ✅ 快速加载速度

---

## 技术栈

### 前端
- **框架:** Next.js 15.5 (App Router)
- **UI库:** React 19
- **语言:** TypeScript 5.0
- **样式:** Tailwind CSS 3.4
- **组件:** 自定义 UI 组件库

### 后端
- **数据库:** SQLite
- **ORM:** Prisma 6.0
- **API:** Next.js API Routes (Serverless Functions)

### 第三方服务
- **搜索:** Brave Search API
- **部署:** Vercel (推荐) / Docker

---

## 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 pnpm
- Git

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/jinguang-bot/expo-monitor.git
cd expo-monitor
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，添加以下内容：
DATABASE_URL="file:./prisma/dev.db"
BRAVE_API_KEY="your-brave-api-key-here"
```

4. **初始化数据库**
```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 填充示例数据
npx prisma db seed
```

5. **启动开发服务器**
```bash
npm run dev
```

6. **访问应用**
打开浏览器访问: http://localhost:3000

### 可用脚本

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 数据库操作
npx prisma studio        # 打开数据库可视化界面
npx prisma migrate dev   # 创建新迁移
npx prisma db seed       # 填充示例数据

# 测试
./test.sh                # 运行测试套件
```

---

## 项目结构

```
expo-monitor/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API 路由
│   │   ├── exhibitions/          # 展会 API
│   │   │   ├── route.ts         # GET 所有展会
│   │   │   └── [id]/route.ts    # GET 单个展会
│   │   └── news/                 # 新闻 API
│   │       ├── route.ts         # GET 所有新闻
│   │       └── fetch/route.ts   # POST 抓取新闻
│   ├── exhibitions/              # 展会页面
│   │   ├── page.tsx             # 展会列表
│   │   └── [id]/page.tsx        # 展会详情
│   ├── dashboard/                # 数据看板
│   │   └── page.tsx
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/                   # React 组件
│   └── ui/                       # UI 组件
│       └── button.tsx
├── lib/                          # 工具库
│   ├── prisma.ts                # Prisma 客户端
│   ├── brave-search.ts          # Brave Search API
│   └── utils.ts                 # 工具函数
├── prisma/                       # 数据库
│   ├── schema.prisma            # 数据库模型
│   ├── seed.ts                  # 示例数据
│   └── dev.db                   # SQLite 数据库
├── .env.example                  # 环境变量模板
├── PROJECT-STATUS.md             # 项目状态
├── PROGRESS.md                   # 开发进度
├── ROADMAP.md                    # 开发路线图
├── test.sh                       # 测试脚本
└── README.md                     # 项目文档
```

---

## 数据库设计

### 展会表 (Exhibition)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | UUID 主键 |
| name | String | 展会名称 |
| startDate | DateTime | 开始日期 |
| endDate | DateTime | 结束日期 |
| location | String | 举办地点 |
| country | String | 国家 |
| industry | String? | 所属行业 |
| website | String? | 官网链接 |
| description | String? | 展会描述 |
| status | String | 状态 (upcoming/ongoing/ended) |
| keywords | String? | 关键词 JSON 数组 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 新闻表 (News)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | UUID 主键 |
| exhibitionId | String | 关联展会 ID |
| title | String | 新闻标题 |
| url | String | 新闻链接 |
| description | String? | 新闻描述 |
| source | String? | 来源 |
| publishedAt | DateTime | 发布时间 |
| createdAt | DateTime | 创建时间 |

**关系：** 一个展会可以有多条新闻 (一对多)

---

## API 文档

### 展会 API

#### GET /api/exhibitions
获取所有展会列表

**查询参数：**
- `status` (可选): 筛选状态 (upcoming/ongoing/ended)
- `country` (可选): 筛选国家
- `search` (可选): 搜索关键词

**响应示例：**
```json
[
  {
    "id": "clx...",
    "name": "印度国际机床展 (IMTEX)",
    "country": "印度",
    "status": "upcoming",
    "startDate": "2026-01-20",
    "endDate": "2026-01-26"
  }
]
```

#### GET /api/exhibitions/:id
获取单个展会详情

**响应示例：**
```json
{
  "id": "clx...",
  "name": "印度国际机床展 (IMTEX)",
  "country": "印度",
  "location": "班加罗尔国际展览中心",
  "startDate": "2026-01-20",
  "endDate": "2026-01-26",
  "industry": "工业",
  "website": "https://imtex.in",
  "news": [...]
}
```

### 新闻 API

#### GET /api/news
获取所有新闻列表

**查询参数：**
- `exhibitionId` (可选): 筛选展会
- `limit` (可选): 返回数量（默认50）

#### POST /api/news/fetch
为指定展会抓取最新新闻

**请求体：**
```json
{
  "exhibitionId": "clx..."
}
```

**响应示例：**
```json
{
  "success": true,
  "count": 10,
  "news": [...]
}
```

---

## 部署指南

### Vercel 部署（推荐）

1. **推送代码到 GitHub**
2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库
3. **配置环境变量**
   - 在 Vercel 项目设置中添加：
     - `DATABASE_URL`
     - `BRAVE_API_KEY`
4. **部署**
   - Vercel 自动检测 Next.js 并部署

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# 构建镜像
docker build -t expo-monitor .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prisma/prod.db" \
  -e BRAVE_API_KEY="your-key" \
  expo-monitor
```

### 生产环境配置

1. **使用 PostgreSQL**
   - 修改 `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - 更新 `.env`:
     ```
     DATABASE_URL="postgresql://user:pass@host:5432/expo_monitor"
     ```

2. **添加认证**
   - 集成 NextAuth.js
   - 保护 API 路由

3. **性能优化**
   - 启用 ISR (Incremental Static Regeneration)
   - 添加缓存层
   - 使用 CDN

---

## 开发进度

详见 [PROGRESS.md](./PROGRESS.md)

**已完成功能：**
- ✅ 项目初始化（2026-03-07 13:20）
- ✅ 数据库设计和建模（2026-03-07 13:30）
- ✅ 示例数据填充（2026-03-07 13:40）
- ✅ API 路由开发（2026-03-07 13:50）
- ✅ 前端页面开发（2026-03-07 14:00）
- ✅ 测试和修复（2026-03-07 14:10）
- ✅ 文档编写（2026-03-07 14:20）

---

## 未来规划

详见 [ROADMAP.md](./ROADMAP.md)

**v1.1 - 新闻增强（计划：2026-03-15）**
- [ ] 自动定时抓取新闻
- [ ] 新闻搜索和筛选
- [ ] 新闻分类标签

**v1.2 - 数据分析（计划：2026-04-01）**
- [ ] 趋势分析图表
- [ ] 展会对比功能
- [ ] 数据导出（CSV/Excel）

**v2.0 - 企业版（计划：2026-06-01）**
- [ ] 用户认证系统
- [ ] 多语言支持
- [ ] 付费订阅功能

---

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

**代码规范：**
- 使用 TypeScript
- 遵循 ESLint 规则
- 添加必要注释
- 编写单元测试

---

## 常见问题

### 1. 如何获取 Brave Search API Key？

访问 [brave.com/search/api](https://brave.com/search/api) 注册并获取 API Key

### 2. 数据库文件在哪里？

SQLite 数据库文件位于 `prisma/dev.db`

### 3. 如何添加新展会？

运行 Prisma Studio:
```bash
npx prisma studio
```
在可视化界面中添加数据

### 4. 如何更新所有依赖？

```bash
npx npm-check-updates -u
npm install
```

---

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 联系方式

- **作者:** 杨觐光 (Yang Jinguang)
- **GitHub:** [@jinguang-bot](https://github.com/jinguang-bot)
- **项目地址:** https://github.com/jinguang-bot/expo-monitor

---

## 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Brave Search](https://brave.com/search/) - 搜索 API
- [OpenClaw](https://openclaw.ai/) - AI 开发助手

---

**最后更新:** 2026-03-07 14:20 GMT+8  
**版本:** MVP v1.0  
**状态:** ✅ 生产就绪
