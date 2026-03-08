# Expo Monitor - v1.2 开发进度

**开始时间：** 2026-03-08 09:38 GMT+8  
**当前版本：** v1.2 Phase 1  
**状态：** ✅ Phase 1 完成

---

## Phase 1: 新闻搜索和筛选功能（09:38-09:52）

**目标：** 在 /news 页面实现新闻搜索和筛选

### ✅ 已完成

1. **创建新闻页面** - `app/news/page.tsx`
   - ✅ 搜索框（支持标题、描述、展会名称搜索）
   - ✅ 展会下拉选择器（58个展会）
   - ✅ 时间范围选择器（今天、最近7天、最近30天、全部）
   - ✅ 新闻列表（卡片式布局）
   - ✅ 响应式设计
   - ✅ 空状态提示

2. **更新导航栏** - `app/layout.tsx`
   - ✅ 添加"新闻列表"链接
   - ✅ 导航顺序：首页 → 展会列表 → 新闻列表 → 数据看板

3. **修复构建错误**
   - ✅ 修复 `app/api/exhibitions/[id]/route.ts` (params 类型)
   - ✅ 修复 `app/api/news/fetch/route.ts` (source 字段)
   - ✅ 修复 `app/page.tsx` (city → location)
   - ✅ 修复 `lib/cron.ts` (source 字段)
   - ✅ 安装缺失依赖 (tailwind-merge, clsx)

4. **搜索功能特性**
   - ✅ 大小写不敏感搜索
   - ✅ 多字段搜索（标题、描述、展会名称）
   - ✅ 时间范围筛选
   - ✅ 展会筛选
   - ✅ 组合筛选（搜索 + 筛选）
   - ✅ 限制结果数量（最多100条）

### 📊 技术实现

**搜索逻辑：**
```typescript
const where: any = {}

if (params.search) {
  where.OR = [
    { title: { contains: params.search, mode: 'insensitive' } },
    { description: { contains: params.search, mode: 'insensitive' } },
    { exhibition: { name: { contains: params.search, mode: 'insensitive' } } },
  ]
}

if (params.exhibitionId && params.exhibitionId !== 'all') {
  where.exhibitionId = params.exhibitionId
}

if (params.startDate) {
  where.publishedAt = { ...where.publishedAt, gte: new Date(params.startDate) }
}
```

**时间范围计算：**
```typescript
function getTimeRange(range: string | undefined) {
  switch (range) {
    case 'today':
      return { startDate: today.toISOString() }
    case 'week':
      return { startDate: weekAgo.toISOString() }
    case 'month':
      return { startDate: monthAgo.toISOString() }
    default:
      return {}
  }
}
```

### 🧪 构建测试

```bash
npm run build
```

**结果：**
- ✅ 编译成功
- ✅ 所有路由正常
- ✅ 新增路由：ƒ /news (170 B, 106 kB)

**路由列表：**
```
├ ○ /                        # 首页
├ ○ /dashboard               # 数据看板
├ ƒ /exhibitions             # 展会列表
├ ƒ /exhibitions/[id]        # 展会详情
└ ƒ /news                    # 新闻列表 ⭐ NEW
```

### 📝 文件修改

**新增文件：**
- `app/news/page.tsx` - 新闻搜索页面

**修改文件：**
- `app/layout.tsx` - 添加新闻链接
- `app/api/exhibitions/[id]/route.ts` - 修复类型错误
- `app/api/news/fetch/route.ts` - 修复 source 字段
- `app/page.tsx` - 修复字段名称
- `lib/cron.ts` - 修复 source 字段

**安装依赖：**
- tailwind-merge
- clsx

---

## 下一步：Phase 2 - 新闻分类标签

**计划任务：**
1. 修改 Prisma schema，添加 category 字段
2. 创建数据库迁移
3. 更新新闻抓取逻辑（自动分类）
4. 在新闻列表显示分类标签
5. 添加按分类筛选功能

**预计时间：** 30-45 分钟

---

## v1.2 完整路线图

1. ✅ **Phase 1: 新闻搜索和筛选**（已完成）
2. ⏳ **Phase 2: 新闻分类标签**（进行中）
3. ⏳ **Phase 3: 数据看板优化**（待开始）
4. ⏳ **Phase 4: 导出功能**（待开始）
5. ⏳ **Phase 5: 生产部署准备**（待开始）

---

**记录人：** OpenClaw AI Assistant  
**最后更新：** 2026-03-08 09:52 GMT+8

---

## Phase 2: 新闻分类标签功能（11:15-11:23）

**目标：** 添加新闻自动分类和筛选功能

### ✅ 已完成

1. **数据库迁移**
   - ✅ 修改 Prisma schema，添加 `category` 字段
   - ✅ 创建迁移文件（20260308031409_add_category_field）
   - ✅ 应用迁移到数据库
   - ✅ 验证数据库结构（category 字段已添加）

2. **分类逻辑**
   - ✅ 创建 `lib/categorize-news.ts` - 自动分类工具
   - ✅ 支持 4 种分类：
     * 产品发布（产品发布）
     * 技术趋势（技术趋势）
     * 市场分析（市场分析）
     * 行业动态（行业动态）

3. **代码准备**
   - ✅ 创建 `lib/cron-with-category.ts` - 带分类的新闻抓取逻辑
   - ✅ 准备更新后的 API 路由（暂时移除 category UI）

4. **UI 简化**
   - ✅ 简化新闻页面（暂时移除 category 筛选）
   - ✅ 移除 category 显示（等待数据填充）
   - ✅ 修复构建错误

### 📊 技术实现

**分类逻辑：**
```typescript
export function categorizeNews(title: string, description: string): string {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = (description || '').toLowerCase()
  
  // 产品发布
  if (lowerTitle.includes('launch') || lowerTitle.includes('release')) {
    return '产品发布'
  }
  
  // 技术趋势
  if (lowerDesc.includes('ai') || lowerDesc.includes('technology')) {
    return '技术趋势'
  }
  
  // 市场分析
  if (lowerDesc.includes('market') || lowerDesc.includes('industry')) {
    return '市场分析'
  }
  
  return '行业动态'
}
```

**数据库迁移：**
```sql
ALTER TABLE "news" ADD column category TEXT;
```

### ⚠️ 临时决策

**为什么移除了 category UI？**

1. **数据库状态**：98 条新闻记录的 category 字段都是 NULL
2. **避免空状态**：UI 显示空白标签影响用户体验
3. **分步实施**：先搭建基础设施，再填充数据，最后启用 UI

**下一步计划：**
- 创建脚本：为现有 98 条新闻填充 category
- 测试分类准确性
- 重新启用 category UI

### 🧪 构建测试

```bash
npm run build
```

**结果：**
- ✅ 编译成功
- ✅ 所有路由正常
- ✅ 无 TypeScript 错误

**路由列表：**
```
├ ○ /                        # 首页
├ ○ /dashboard               # 数据看板
├ ƒ /exhibitions             # 展会列表
├ ƒ /exhibitions/[id]        # 展会详情
└ ƒ /news                    # 新闻列表
```

### 📝 文件修改

**新增文件：**
- `lib/categorize-news.ts` - 分类工具
- `lib/cron-with-category.ts` - 带分类的新闻抓取逻辑
- `prisma/migrations/20260308031409_add_category_field/migration.sql` - 数据库迁移

**修改文件：**
- `prisma/schema.prisma` - 添加 category 字段
- `lib/cron.ts` - 准备更新（暂时移除 category 赋值）
- `app/api/news/fetch/route.ts` - 准备更新（暂时移除 category 赋值）
- `app/news/page.tsx` - 简化 UI（暂时移除 category 显示和筛选）

---

## 当前状态（11:23 AM）

**Phase 1 完成：** ✅ 新闻搜索和筛选（无分类）

**Phase 2 部分完成：** ⏳ 基础设施搭建完成，UI 暂时隐藏

**下一步：**
1. 创建脚本填充现有新闻的 category 字段
2. 测试分类准确性
3. 重新启用 category UI
4. 继续 Phase 3（数据看板优化）

---

**记录人:** OpenClaw AI Assistant  
**最后更新:** 2026-03-08 11:23 GMT+8
