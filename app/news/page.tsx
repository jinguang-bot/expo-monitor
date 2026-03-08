import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getNews(params: { 
  search?: string
  exhibitionId?: string
  startDate?: string
  endDate?: string 
  category?: string
}) {
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
  
  if (params.category && params.category !== 'all') {
    where.category = params.category
  }
  
  if (params.startDate) {
    where.publishedAt = { ...where.publishedAt, gte: new Date(params.startDate) }
  }
  
  if (params.endDate) {
    where.publishedAt = { ...where.publishedAt, lte: new Date(params.endDate) }
  }
  
  return prisma.news.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    include: {
      exhibition: {
        select: {
          id: true,
          name: true,
          country: true,
        }
      }
    },
    take: 100,
  })
}

async function getExhibitions() {
  return prisma.exhibition.findMany({
    select: { id: true, name: true, country: true },
    orderBy: { name: 'asc' }
  })
}

async function getCategories() {
  const news = await prisma.news.findMany({
    select: { category: true },
    distinct: ['category']
  })
  return news.map(n => n.category).filter(Boolean).sort()
}

function getTimeRange(range: string | undefined): { startDate?: string; endDate?: string } {
  if (!range || range === 'all') return {}
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (range) {
    case 'today':
      return {
        startDate: today.toISOString(),
      }
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      return { startDate: weekAgo.toISOString() }
    case 'month':
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      return { startDate: monthAgo.toISOString() }
    default:
      return {}
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  '产品发布': '🚀 产品发布',
  '行业动态': '📰 行业动态',
  '技术趋势': '💡 技术趋势',
  '市场分析': '📊 市场分析',
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    search?: string
    exhibitionId?: string
    timeRange?: string
    category?: string
    startDate?: string
    endDate?: string
  }>
}) {
  const params = await searchParams
  const timeRange = getTimeRange(params.timeRange)
  
  const queryParams = {
    search: params.search,
    exhibitionId: params.exhibitionId,
    category: params.category,
    startDate: params.startDate || timeRange.startDate,
    endDate: params.endDate || timeRange.endDate,
  }
  
  const [news, exhibitions, categories] = await Promise.all([
    getNews(queryParams),
    getExhibitions(),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新闻列表</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form className="flex flex-wrap gap-4" method="GET">
          <input
            type="text"
            name="search"
            placeholder="搜索新闻标题、描述或展会..."
            defaultValue={params.search}
            className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            name="exhibitionId"
            defaultValue={params.exhibitionId || 'all'}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部展会</option>
            {exhibitions.map((exhibition) => (
              <option key={exhibition.id} value={exhibition.id}>
                {exhibition.name} ({exhibition.country})
              </option>
            ))}
          </select>
          
          <select
            name="category"
            defaultValue={params.category || 'all'}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部分类</option>
            {categories.map((category) => (
              <option key={category!} value={category!}>
                {CATEGORY_LABELS[category!] || category}
              </option>
            ))}
          </select>
          
          <select
            name="timeRange"
            defaultValue={params.timeRange || 'all'}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">最近7天</option>
            <option value="month">最近30天</option>
          </select>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            筛选
          </button>
        </form>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        共找到 {news.length} 条新闻
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-lg flex-1">
                {item.title}
              </h3>
              <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
            
            {item.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                {item.exhibition && (
                  <Link 
                    href={`/exhibitions/${item.exhibition.id}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.exhibition.name}
                  </Link>
                )}
                {item.category && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </>
                )}
                <span className="text-gray-300">·</span>
                <span className="text-gray-400">External Link →</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">没有找到符合条件的新闻</p>
          <p className="text-sm">尝试调整搜索条件或 <a href="/news" className="text-blue-600 hover:underline">清除筛选</a></p>
        </div>
      )}
    </div>
  )
}
