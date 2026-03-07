import { prisma } from '@/lib/prisma'

async function getDashboardData() {
  const exhibitions = await prisma.exhibition.findMany({
    include: {
      _count: {
        select: { news: true }
      }
    }
  })
  
  const newsCount = await prisma.news.count()

  // Status distribution
  const statusData = [
    { name: '即将开始', value: exhibitions.filter(e => e.status === 'upcoming').length },
    { name: '进行中', value: exhibitions.filter(e => e.status === 'ongoing').length },
    { name: '已结束', value: exhibitions.filter(e => e.status === 'ended').length },
  ]

  // Country distribution
  const countryCount: Record<string, number> = {}
  exhibitions.forEach(e => {
    countryCount[e.country] = (countryCount[e.country] || 0) + 1
  })
  const countryData = Object.entries(countryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  // News by exhibition
  const newsByExhibition = exhibitions
    .map(e => ({ name: e.name.length > 25 ? e.name.substring(0, 25) + '...' : e.name, count: e._count.news }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    statusData,
    countryData,
    newsByExhibition,
    totalExhibitions: exhibitions.length,
    totalNews: newsCount
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">数据看板</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">展会总数</p>
          <p className="text-4xl font-bold text-gray-900">{data.totalExhibitions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">新闻总数</p>
          <p className="text-4xl font-bold text-gray-900">{data.totalNews}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">即将开始</p>
          <p className="text-4xl font-bold text-blue-600">{data.statusData.find(s => s.name === '即将开始')?.value || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">进行中</p>
          <p className="text-4xl font-bold text-green-600">{data.statusData.find(s => s.name === '进行中')?.value || 0}</p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">展会状态分布</h2>
        <div className="flex gap-8">
          {data.statusData.map((status) => (
            <div key={status.name} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${
                status.name === '即将开始' ? 'bg-blue-500' :
                status.name === '进行中' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <span className="text-gray-700">{status.name}:</span>
              <span className="font-bold text-gray-900">{status.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Country Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">展会国家分布 (Top 10)</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.countryData.map((country) => (
            <div key={country.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{country.name}</span>
              <span className="font-bold text-blue-600">{country.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* News by Exhibition */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">各展会新闻数量 (Top 10)</h2>
        {data.newsByExhibition.length > 0 ? (
          <div className="space-y-3">
            {data.newsByExhibition.map((exhibition, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-48 text-sm text-gray-600 truncate">{exhibition.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${Math.max(5, (exhibition.count / (data.newsByExhibition[0]?.count || 1)) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{exhibition.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">暂无新闻数据</p>
        )}
      </div>
    </div>
  )
}
