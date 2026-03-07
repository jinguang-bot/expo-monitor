import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getExhibition(id: string) {
  return prisma.exhibition.findUnique({
    where: { id },
    include: {
      news: {
        orderBy: { publishedAt: 'desc' },
        take: 50,
      }
    }
  })
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const exhibition = await getExhibition(id)

  if (!exhibition) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/exhibitions" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← 返回展会列表
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{exhibition.name}</h1>
          <span className={`px-3 py-1 text-sm rounded-full ${
            exhibition.status === 'ongoing' 
              ? 'bg-green-100 text-green-800' 
              : exhibition.status === 'upcoming'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {exhibition.status === 'ongoing' ? '进行中' : exhibition.status === 'upcoming' ? '即将开始' : '已结束'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><span className="font-medium">地点：</span>{exhibition.country} · {exhibition.location}</p>
            <p><span className="font-medium">时间：</span>{new Date(exhibition.startDate).toLocaleDateString('zh-CN')} - {new Date(exhibition.endDate).toLocaleDateString('zh-CN')}</p>
          </div>
          <div>
            {exhibition.industry && <p><span className="font-medium">行业：</span>{exhibition.industry}</p>}
            {exhibition.website && (
              <p>
                <span className="font-medium">官网：</span>
                <a href={exhibition.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  访问官网
                </a>
              </p>
            )}
          </div>
        </div>

        {exhibition.description && (
          <p className="mt-4 text-gray-600">{exhibition.description}</p>
        )}

        {exhibition.keywords && (
          <div className="mt-4 flex flex-wrap gap-2">
            {JSON.parse(exhibition.keywords).map((keyword: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">相关新闻 ({exhibition.news.length})</h2>
        <form action={`/api/news/fetch`} method="POST">
          <input type="hidden" name="exhibitionId" value={exhibition.id} />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            获取最新新闻
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {exhibition.news.map((news) => (
          <div key={news.id} className="bg-white rounded-xl shadow-sm p-6">
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
            >
              {news.title}
            </a>
            {news.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{news.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {news.source} · {new Date(news.publishedAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
        ))}

        {exhibition.news.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
            暂无相关新闻，点击"获取最新新闻"按钮抓取
          </div>
        )}
      </div>
    </div>
  )
}
