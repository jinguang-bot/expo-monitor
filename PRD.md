# 全球展会监控系统 PRD

## 项目概述

**项目名称**：全球展会监控系统（Expo Monitor）
**版本**：MVP v1.0
**目标用户**：参展商、采购商
**核心价值**：帮助用户快速了解全球工业展会动态，获取相关新闻信息

---

## 1. 产品目标

### 1.1 商业目标
- 为参展商提供展会动态监控，帮助制定参展策略
- 为采购商提供行业展会信息，优化采购计划
- 建立展会信息聚合平台，提升信息获取效率

### 1.2 用户目标
- 快速了解近期和即将举办的工业展会
- 实时获取展会相关新闻动态
- 通过BI仪表盘直观查看展会信息

---

## 2. 核心功能（MVP）

### 2.1 展会管理
- **预定义展会库**：系统内置30个工业展会
- **展会信息展示**：
  - 展会名称、地点、时间
  - 展会官网链接
  - 展会描述
  - 展会状态（即将开始/进行中/已结束）

### 2.2 新闻监控
- **自动新闻抓取**：使用Brave Search API
- **新闻展示**：
  - 新闻标题、来源、时间
  - 新闻摘要
  - 原文链接
- **展会关联**：新闻与展会自动关联

### 2.3 BI仪表盘
- **展会时间线**：按时间展示展会
- **展会地图**：在地图上标记展会地点
- **新闻统计**：展会新闻数量统计
- **展会状态分布**：饼图展示（即将开始/进行中/已结束）

---

## 3. 技术架构

### 3.1 技术栈
- **前端**：Next.js 15 + React 19 + TypeScript
- **UI框架**：Tailwind CSS + shadcn/ui
- **图表库**：Recharts（BI图表）
- **地图**：React Leaflet（展会地图）
- **后端**：Next.js API Routes
- **数据库**：SQLite（开发阶段）→ PostgreSQL（生产环境）
- **ORM**：Prisma
- **搜索API**：Brave Search API
- **部署**：本地部署 → Docker

### 3.2 架构设计
```
Frontend (Next.js)
    ↓
API Routes (/api/*)
    ↓
Services Layer
    ├── ExpoService (展会管理)
    ├── NewsService (新闻监控)
    └── SearchService (Brave Search)
    ↓
Database (SQLite/PostgreSQL)
```

---

## 4. 数据模型

### 4.1 Exhibition（展会）
```typescript
interface Exhibition {
  id: string;
  name: string; // 展会名称
  description: string; // 展会描述
  location: string; // 举办地点
  country: string; // 国家
  startDate: Date; // 开始日期
  endDate: Date; // 结束日期
  website: string; // 官网
  industry: string; // 行业（工业）
  status: 'upcoming' | 'ongoing' | 'ended'; // 状态
  keywords: string[]; // 搜索关键词
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 News（新闻）
```typescript
interface News {
  id: string;
  exhibitionId: string; // 关联展会
  title: string; // 新闻标题
  summary: string; // 摘要
  source: string; // 来源
  url: string; // 原文链接
  publishedAt: Date; // 发布时间
  createdAt: Date;
}
```

---

## 5. API 设计

### 5.1 展会相关
- `GET /api/exhibitions` - 获取展会列表
- `GET /api/exhibitions/:id` - 获取展会详情
- `GET /api/exhibitions/stats` - 获取展会统计

### 5.2 新闻相关
- `GET /api/news?exhibitionId=xxx` - 获取展会新闻
- `POST /api/news/fetch` - 手动触发新闻抓取

### 5.3 搜索相关
- `POST /api/search` - 调用Brave Search

---

## 6. MVP 功能范围

### ✅ 包含
- 30个预定义工业展会
- Brave Search新闻抓取
- BI仪表盘展示
- 本地部署

### ❌ 不包含（后续迭代）
- 用户系统
- 自定义添加展会
- AI分析能力
- 邮件/通知
- 多语言支持

---

## 7. 开发计划

### Phase 1: 项目搭建（Day 1）
- 初始化Next.js项目
- 配置Tailwind CSS + shadcn/ui
- 配置Prisma + SQLite
- 创建数据库模型
- 创建GitHub仓库

### Phase 2: 核心功能（Day 2-3）
- 展会管理API
- 新闻抓取功能（Brave Search）
- 数据库种子（30个展会）

### Phase 3: 前端展示（Day 4-5）
- 展会列表页面
- 展会详情页面
- BI仪表盘（图表、地图）

### Phase 4: 测试与优化（Day 6）
- 功能测试
- 性能优化
- 文档完善

---

## 8. 成功指标

### 8.1 技术指标
- ✅ 所有API正常工作
- ✅ 前端页面响应式设计
- ✅ 新闻抓取成功率 > 90%
- ✅ 页面加载时间 < 3秒

### 8.2 业务指标
- ✅ 30个展会信息完整
- ✅ 新闻每展会至少10条
- ✅ BI图表展示正常

---

## 9. 风险与应对

### 9.1 技术风险
- **Brave Search API限流**
  - 应对：添加缓存机制，控制请求频率
- **新闻质量参差不齐**
  - 应对：添加关键词过滤，优先展示高质量来源

### 9.2 数据风险
- **展会信息过时**
  - 应对：定期更新展会信息
- **新闻重复**
  - 应对：添加去重逻辑

---

## 10. 后续迭代方向

### v1.1
- 支持用户自定义展会
- 添加邮件通知
- 优化新闻质量

### v1.2
- 添加AI分析（趋势预测、情感分析）
- 支持多语言
- 移动端适配

### v2.0
- 用户系统
- 协作功能
- API开放

---

**文档版本**：1.0
**创建日期**：2026-03-07
**作者**：Claw (AI Assistant)
