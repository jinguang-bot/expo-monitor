# Expo Monitor - Quick Start Guide

> **最后更新：** 2026-03-08 01:00 GMT+8  
> **版本：** v1.1  
> **状态：** ✅ 生产就绪

---

## 🚀 快速开始（5分钟）

### 1. 克隆并安装
```bash
git clone https://github.com/jinguang-bot/expo-monitor.git
cd expo-monitor
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env，添加：
# DATABASE_URL="file:./prisma/dev.db"
# BRAVE_API_KEY="your-api-key"
```

### 3. 初始化数据库
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问：http://localhost:3000

---

## 📁 项目结构

```
expo-monitor/
├── app/
│   ├── api/
│   │   ├── cron/fetch-news/      # ⭐ 定时任务 API (v1.1)
│   │   ├── exhibitions/          # 展会 API
│   │   └── news/                 # 新闻 API
│   ├── exhibitions/              # 展会页面
│   ├── dashboard/                # 数据看板
│   └── page.tsx                  # 首页
├── lib/
│   ├── cron.ts                   # ⭐ 定时任务逻辑 (v1.1)
│   ├── brave-search.ts           # Brave Search API
│   └── prisma.ts                 # Prisma 客户端
├── scripts/
│   └── cron-fetch-news.ts        # ⭐ Cron 脚本 (v1.1)
├── prisma/
│   ├── schema.prisma             # 数据库模型
│   └── seed.ts                   # 示例数据
└── docs/
    └── CRON.md                   # ⭐ 定时任务文档 (v1.1)
```

---

## 🔑 核心文件说明

### 1. 数据库模型（prisma/schema.prisma）
```prisma
model Exhibition {
  id          String   @id @default(uuid())
  name        String
  startDate   DateTime
  endDate     DateTime
  location    String
  country     String
  status      String    // upcoming/ongoing/ended
  news        News[]
}

model News {
  id           String   @id @default(uuid())
  exhibitionId String
  exhibition   Exhibition @relation(fields: [exhibitionId], references: [id])
  title        String
  url          String   @unique    // ⭐ v1.1 新增唯一约束
  description  String?             // ⭐ v1.1 重命名
  publishedAt  DateTime
}
```

### 2. 定时任务逻辑（lib/cron.ts）⭐ v1.1
```typescript
// 抓取未来3个月的展会新闻
export async function fetchNewsForUpcomingExhibitions() {
  const upcomingExhibitions = await prisma.exhibition.findMany({
    where: {
      startDate: {
        gte: new Date(),
        lte: addMonths(new Date(), 3)
      }
    }
  })

  for (const exhibition of upcomingExhibitions) {
    await fetchAndSaveNews(exhibition)
    await sleep(1100)  // 速率限制：1.1秒
  }
}

// 抓取所有展会新闻
export async function fetchNewsForAllExhibitions() {
  // ...
}
```

### 3. API 端点（app/api/cron/fetch-news/route.ts）⭐ v1.1
```typescript
// GET /api/cron/fetch-news
export async function GET(request: NextRequest) {
  const fetchAll = request.nextUrl.searchParams.get('all') === 'true'
  
  const result = fetchAll 
    ? await fetchNewsForAllExhibitions()
    : await fetchNewsForUpcomingExhibitions()
  
  return NextResponse.json({ success: true, ...result })
}
```

### 4. Cron 脚本（scripts/cron-fetch-news.ts）⭐ v1.1
```typescript
// 独立运行的 TypeScript 脚本
const fetchAll = process.argv.includes('--all')

async function main() {
  const result = fetchAll 
    ? await fetchNewsForAllExhibitions()
    : await fetchNewsForUpcomingExhibitions()
  
  console.log(JSON.stringify(result, null, 2))
}

main()
```

---

## 🎯 核心功能

### 1. 展会管理
- ✅ 58个全球工业展会
- ✅ 搜索（大小写不敏感）
- ✅ 筛选（状态/国家）
- ✅ 详情页

### 2. 新闻聚合
- ✅ Brave Search API 集成
- ✅ 手动抓取（详情页按钮）
- ✅ 自动抓取（定时任务）⭐ v1.1
- ✅ 去重（URL 唯一约束）⭐ v1.1

### 3. 定时任务 ⭐ v1.1
```bash
# 方式 1：系统 Cron（推荐）
0 6 * * * cd /home/ubuntu/Projects/expo-monitor && npx tsx scripts/cron-fetch-news.ts

# 方式 2：API 端点
curl http://localhost:3000/api/cron/fetch-news

# 方式 3：外部服务
# Vercel Cron / GitHub Actions / cron-job.org
```

### 4. 数据看板
- ✅ 展会状态分布
- ✅ 国家分布（Top 10）
- ✅ 新闻数量统计
- ✅ 关键指标卡片

---

## 🧪 测试

### 运行测试套件
```bash
./test.sh
```

### 手动测试
```bash
# 1. 测试首页
curl http://localhost:3000

# 2. 测试展会 API
curl http://localhost:3000/api/exhibitions

# 3. 测试搜索
curl "http://localhost:3000/api/exhibitions?search=hannover"

# 4. 测试新闻抓取
curl -X POST http://localhost:3000/api/news/fetch \
  -H "Content-Type: application/json" \
  -d '{"exhibitionId":"SOME_ID"}'

# 5. 测试定时任务 ⭐ v1.1
npx tsx scripts/cron-fetch-news.ts
```

---

## 📊 数据统计

### 当前数据
- 展会数量：58
- 覆盖国家：12+
- 覆盖行业：10+

### API 调用（Brave Search）
- 免费额度：2000 次/月
- 单次抓取：约 15 次调用
- 月度估算：15 × 30 = 450 次
- 结论：✅ 在免费额度内

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

### 定时任务 ⭐ v1.1
```bash
# 抓取即将举行的展会新闻（默认）
npx tsx scripts/cron-fetch-news.ts

# 抓取所有展会新闻
npx tsx scripts/cron-fetch-news.ts --all

# 通过 API 抓取
curl http://localhost:3000/api/cron/fetch-news
curl "http://localhost:3000/api/cron/fetch-news?all=true"
```

---

## 🐛 故障排查

### 1. 数据库错误
```bash
# 检查数据库文件
ls -lh prisma/dev.db

# 重新生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate deploy
```

### 2. API 错误
```bash
# 检查 API Key
cat .env | grep BRAVE_API_KEY

# 测试 Brave Search API
curl -H "X-Subscription-Token: YOUR_KEY" \
  "https://api.search.brave.com/res/v1/web/search?q=test"
```

### 3. 定时任务错误 ⭐ v1.1
```bash
# 查看详细日志
npx tsx scripts/cron-fetch-news.ts 2>&1 | tee cron-debug.log

# 检查环境变量
cat .env

# 手动测试 API
curl http://localhost:3000/api/cron/fetch-news
```

---

## 📝 v1.1 更新日志

### ✅ 已完成
1. **Phase 1: 测试和修复**
   - ✅ 修复 Brave Search API 新闻抓取
   - ✅ 修复搜索大小写敏感问题
   - ✅ 修复数据库字段问题

2. **Phase 2: 定时任务功能**
   - ✅ 实现自动定时抓取
   - ✅ 创建 API 端点
   - ✅ 创建独立脚本
   - ✅ 支持 3 种调度方式

### 📊 统计
- 总开发时间：约 1 小时
- 代码提交：2 次（c92cd43 + 4ac7a9c）
- 文件修改：9 个
- 新增代码：约 400 行

---

## 🚀 下一步（v1.2）

### 计划功能
1. [ ] 新闻搜索和筛选
2. [ ] 数据看板优化（添加图表库）
3. [ ] 新闻分类标签
4. [ ] 导出功能（CSV/Excel）
5. [ ] 生产部署（PostgreSQL + Vercel）

### 开发指南
1. 阅读现有代码（lib/, app/api/）
2. 参考现有功能（展会搜索 → 新闻搜索）
3. 保持代码风格一致
4. 更新文档（README.md, PROGRESS.md）
5. 提交前运行测试

---

## 📚 相关文档

- **完整文档：** README.md
- **开发进度：** PROGRESS.md
- **路线图：** ROADMAP.md
- **项目状态：** PROJECT-STATUS.md
- **定时任务：** docs/CRON.md ⭐ v1.1

---

## 💡 开发提示

### 1. 代码风格
- 使用 TypeScript
- 函数命名清晰（fetchNewsForUpcomingExhibitions）
- 添加详细注释
- 错误处理完整

### 2. 数据库操作
- 使用 Prisma ORM
- 优先使用 upsert（避免重复）
- 注意事务处理
- 及时断开连接

### 3. API 设计
- RESTful 风格
- 统一错误格式
- 详细日志记录
- 速率限制保护

### 4. 测试原则
- 所有核心功能必须测试
- API 端点测试覆盖率 100%
- 边界条件测试
- 错误场景测试

---

## 🎯 快速启动检查清单

- [ ] 克隆仓库
- [ ] 安装依赖（npm install）
- [ ] 配置环境变量（.env）
- [ ] 初始化数据库（prisma migrate + seed）
- [ ] 启动开发服务器（npm run dev）
- [ ] 访问 http://localhost:3000
- [ ] 测试核心功能（搜索、抓取新闻）
- [ ] 测试定时任务（npx tsx scripts/cron-fetch-news.ts）⭐ v1.1

---

**维护者：** 杨觐光 (Yang Jinguang)  
**最后更新：** 2026-03-08 01:00 GMT+8
