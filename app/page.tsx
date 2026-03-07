import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getStats() {
  const [totalExhibitions, upcomingExhibitions, ongoingExhibitions, totalNews] = await Promise.all([
    prisma.exhibition.count(),
    prisma.exhibition.count({ where: { status: 'upcoming' } }),
    prisma.exhibition.count({ where: { status: 'ongoing' } }),
    prisma.news.count(),
  ])
  return { totalExhibitions, upcomingExhibitions, ongoingExhibitions, totalNews }
}

async function getFeaturedExhibitions() {
  return prisma.exhibition.findMany({
    where: {
      OR: [
        { status: 'ongoing' },
        { status: 'upcoming' },
      ],
    },
    orderBy: { startDate: 'asc' },
    take: 6,
  })
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
          <h2 className="text-xl font-bold text-gray-900">近期展会</h2>
          <Link href="/exhibitions" className="text-sm text-blue-600 hover:text-blue-800">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredExhibitions.map((exhibition) => (
            <Link
              key={exhibition.id}
              href={`/exhibitions/${exhibition.id}`}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{exhibition.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  exhibition.status === 'ongoing' 
                    ? 'bg-green-100 text-green-800' 
                    : exhibition.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {exhibition.status === 'ongoing' ? '进行中' : exhibition.status === 'upcoming' ? '即将开始' : '已结束'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{exhibition.country} · {exhibition.city}</p>
              <p className="text-sm text-gray-600">
                {new Date(exhibition.startDate).toLocaleDateString('zh-CN')} - {new Date(exhibition.endDate).toLocaleDateString('zh-CN')}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
