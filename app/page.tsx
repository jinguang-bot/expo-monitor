import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getStats() {
  try {
    const [totalExhibitions, upcomingExhibitions, ongoingExhibitions, totalNews] = await Promise.all([
      prisma.exhibitions.count(),
      prisma.exhibitions.count({ where: { status: 'upcoming' } }),
      prisma.exhibitions.count({ where: { status: 'ongoing' } }),
      prisma.news.count(),
    ])
    return { totalExhibitions, upcomingExhibitions, ongoingExhibitions, totalNews }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return { totalExhibitions: 0, upcomingExhibitions: 0, ongoingExhibitions: 0, totalNews: 0 }
  }
}

async function getFeaturedExhibitions() {
  try {
    return await prisma.exhibitions.findMany({
      where: {
        OR: [
          { status: 'ongoing' },
          { status: 'upcoming' },
        ],
      },
      orderBy: { startDate: 'asc' },
      take: 6,
    })
  } catch (error) {
    console.error('Failed to fetch exhibitions:', error)
    return []
  }
}

export default async function HomePage() {
  const stats = await getStats()
  const featuredExhibitions = await getFeaturedExhibitions()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">展会总数</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalExhibitions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">进行中</p>
          <p className="text-3xl font-bold text-green-600">{stats.ongoingExhibitions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">即将开始</p>
          <p className="text-3xl font-bold text-blue-600">{stats.upcomingExhibitions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">新闻总数</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalNews}</p>
        </div>
      </div>

      {/* Featured Exhibitions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">重点展会</h2>
          <Link href="/exhibitions" className="text-blue-600 hover:text-blue-700">
            查看全部 →
          </Link>
        </div>
        
        {featuredExhibitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExhibitions.map((exhibition) => (
              <Link 
                key={exhibition.id}
                href={`/exhibitions/${exhibition.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{exhibition.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    exhibition.status === 'ongoing' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {exhibition.status === 'ongoing' ? '进行中' : '即将开始'}
                  </span>
                </div>
                {exhibition.location && (
                  <p className="text-sm text-gray-600 mb-2">📍 {exhibition.location}</p>
                )}
                {exhibition.startDate && (
                  <p className="text-sm text-gray-500">
                    {new Date(exhibition.startDate).toLocaleDateString('zh-CN')}
                    {exhibition.endDate && ` - ${new Date(exhibition.endDate).toLocaleDateString('zh-CN')}`}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">暂无展会数据</p>
            <Link 
              href="/api/fetch-news"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              开始抓取数据
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
