# Expo Monitor - 全球展会监控系统

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/jinguang-bot/expo-monitor)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> 监控全球工业展会，追踪相关新闻动态，AI驱动的展会情报分析平台

**在线演示：** http://localhost:3000  
**GitHub：** https://github.com/jinguang-bot/expo-monitor

---

## ✨ 核心功能

### 🎯 展会管理
- **58个全球工业展会** - 覆盖中国、德国、美国、日本等12个国家
- **智能搜索** - 按名称、地点、国家搜索（大小写不敏感）
- **多维筛选** - 按状态（即将开始/进行中/已结束）、国家筛选
- **详情页** - 完整的展会信息、相关新闻、关键词标签

### 📰 新闻聚合 ⭐ NEW in v1.2
- **新闻搜索** - 按标题、描述、展会名称搜索
- **展会筛选** - 按特定展会筛选相关新闻
- **时间筛选** - 今天、最近7天、最近30天、全部时间
- **智能抓取** - 自动从 Brave Search API 获取最新新闻
- **定时任务** - 每日自动抓取即将举行的展会新闻

### 📊 数据看板
- **展会状态分布** - 可视化展示各状态数量
- **国家分布** - Top 10 国家展会数量
- **新闻统计** - 按展会统计新闻数量
- **关键指标** - 总展会数、总新闻数、即将开始数、进行中数

### 🤖 自动化功能
- **定时抓取** - 每日自动抓取新闻（支持系统 cron / API / 外部服务）
- **智能限流** - API 调用限速保护（1.1秒间隔）
- **去重机制** - URL 唯一约束，避免重复新闻
- **错误处理** - 完整的错误捕获和日志记录

---

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/jinguang-bot/expo-monitor.git
cd expo-monitor
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Brave Search API (获取: https://brave.com/search/api/)
BRAVE_API_KEY="your-api-key-here"
```

### 4. 初始化数据库
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 5. 启动开发服务器
```bash
npm run dev
```

访问：http://localhost:3000

---

## 📖 功能指南

### 新闻搜索 (v1.2 新功能) ⭐

**访问路径：** `/news`

**搜索功能：**
1. **关键词搜索** - 输入关键词，搜索标题、描述、展会名称
2. **展会筛选** - 从下拉列表选择特定展会
3. **时间筛选** - 选择今天、最近7天、最近30天或全部
4. **组合筛选** - 可以同时使用多种筛选条件

**示例场景：**
- 查看"汉诺威工业展"的最新新闻
- 搜索最近7天的"机器人"相关新闻
- 查看今天抓取的所有新闻

### 展会搜索

**访问路径：** `/exhibitions`

**搜索技巧：**
- 输入展会名称、地点或国家
- 搜索不区分大小写
- 支持中英文搜索

### 新闻抓取

**手动抓取：**
1. 进入展会详情页
2. 点击"Fetch Latest News"按钮
3. 系统自动调用 Brave Search API
4. 新闻保存到数据库并显示

**自动抓取：**
```bash
# 抓取即将举行的展会新闻（未来3个月）
npx tsx scripts/cron-fetch-news.ts

# 抓取所有展会新闻
npx tsx scripts/cron-fetch-news.ts --all
```

**定时任务设置：**
```bash
# 系统 Cron（推荐）
0 6 * * * cd /home/ubuntu/Projects/expo-monitor && npx tsx scripts/cron-fetch-news.ts

# 或通过 API 调用
curl http://localhost:3000/api/cron/fetch-news
```

---

## 🛠️ 技术栈

- **框架：** Next.js 15 (App Router)
- **语言：** TypeScript
- **前端：** React 19
- **样式：** Tailwind CSS
- **数据库：** SQLite (Prisma ORM)
- **API：** Brave Search API
- **部署：** Vercel / Docker

---

## 📁 项目结构

```
expo-monitor/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── cron/          # 定时任务 API
│   │   ├── exhibitions/   # 展会 API
│   │   └── news/          # 新闻 API
│   ├── exhibitions/       # 展会页面
│   ├── news/              # 新闻页面 ⭐ v1.2
│   ├── dashboard/         # 数据看板
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   └── ui/               # UI 组件库
├── lib/                   # 工具库
│   ├── prisma.ts         # Prisma 客户端
│   ├── brave-search.ts   # Brave Search API
│   ├── cron.ts           # 定时任务工具
│   └── utils.ts          # 辅助函数
├── scripts/               # 脚本
│   └── cron-fetch-news.ts # Cron 脚本
├── prisma/               # 数据库
│   ├── schema.prisma     # 数据模型
│   └── seed.ts           # 示例数据
└── docs/                  # 文档
    └── CRON.md           # 定时任务文档
```

---

## 📊 数据模型

### Exhibition (展会)
```typescript
{
  id: string
  name: string              // 展会名称
  description: string       // 描述
  location: string          // 地点
  country: string           // 国家
  startDate: DateTime       // 开始日期
  endDate: DateTime         // 结束日期
  website: string           // 官网
  industry: string          // 行业
  status: string            // upcoming/ongoing/ended
  keywords: string          // 关键词 (JSON)
  news: News[]              // 相关新闻
}
```

### News (新闻)
```typescript
{
  id: string
  exhibitionId: string      // 关联展会
  title: string             // 标题
  description: string       // 描述
  url: string               // 原文链接 (唯一)
  source: string            // 来源
  publishedAt: DateTime     // 发布时间
  exhibition: Exhibition    // 关联展会
}
```

---

## 🧪 测试

### 运行测试
```bash
./test.sh
```

### 手动测试
```bash
# 测试首页
curl http://localhost:3000

# 测试展会 API
curl http://localhost:3000/api/exhibitions

# 测试新闻 API
curl http://localhost:3000/api/news

# 测试新闻搜索
curl "http://localhost:3000/news?search=robot&timeRange=week"

# 测试定时任务
npx tsx scripts/cron-fetch-news.ts
```

---

## 🔧 常用命令

### 开发
```bash
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm start                # 启动生产服务器
```

### 数据库
```bash
npx prisma studio        # 打开数据库 GUI
npx prisma migrate dev   # 创建迁移
npx prisma db seed       # 填充数据
npx prisma db reset      # 重置数据库
```

### 定时任务
```bash
# 抓取即将举行的展会新闻
npx tsx scripts/cron-fetch-news.ts

# 抓取所有展会新闻
npx tsx scripts/cron-fetch-news.ts --all

# 通过 API 抓取
curl http://localhost:3000/api/cron/fetch-news
```

---

## 📈 版本历史

### v1.2 (2026-03-08) - 新闻搜索和筛选
- ✅ 新闻搜索功能（标题、描述、展会名称）
- ✅ 展会筛选（下拉选择）
- ✅ 时间筛选（今天、最近7天、最近30天）
- ✅ 更新导航栏
- ✅ Bug 修复和性能优化

### v1.1 (2026-03-08) - 定时任务
- ✅ 自动定时抓取新闻
- ✅ 3种调度方式支持
- ✅ 大小写不敏感搜索
- ✅ 完整文档 (CRON.md)

### v1.0 (2026-03-07) - MVP 发布
- ✅ 58个全球工业展会
- ✅ 展会搜索和筛选
- ✅ 手动新闻抓取
- ✅ 数据看板
- ✅ Brave Search API 集成

---

## 🗺️ 路线图

### v1.3 - 新闻分类和导出
- [ ] 新闻自动分类（产品发布、行业动态、技术趋势）
- [ ] 按分类筛选
- [ ] 导出展会列表 (CSV)
- [ ] 导出新闻列表 (CSV)

### v1.4 - 数据可视化
- [ ] 集成 Recharts 图表库
- [ ] 新闻趋势图（按时间）
- [ ] 展会活跃度排名
- [ ] 分类分布图

### v2.0 - 生产部署
- [ ] Docker 容器化
- [ ] PostgreSQL 数据库
- [ ] Vercel 部署
- [ ] 用户认证
- [ ] 邮件通知

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 👤 作者

**OpenClaw AI Assistant** with guidance from 杨觐光 (Yang Jinguang)

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [Brave Search API](https://brave.com/search/api/) - 新闻搜索
- [Tailwind CSS](https://tailwindcss.com/) - UI 框架

---

**最后更新：** 2026-03-08 09:55 GMT+8
