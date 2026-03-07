import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getExhibitions(params: { status?: string; country?: string; search?: string }) {
  const where: any = {}
  
  if (params.status && params.status !== 'all') {
    where.status = params.status
  }
  
  if (params.country && params.country !== 'all') {
    where.country = params.country
  }
  
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { location: { contains: params.search, mode: 'insensitive' } },
    ]
  }
  
  return prisma.exhibition.findMany({
    where,
    orderBy: { startDate: 'asc' },
    include: {
      _count: {
        select: { news: true }
      }
    }
  })
}

async function getCountries() {
  const exhibitions = await prisma.exhibition.findMany({
    select: { country: true },
    distinct: ['country']
  })
  return exhibitions.map(e => e.country).sort()
}

export default async function ExhibitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; country?: string; search?: string }>
}) {
  const params = await searchParams
  const [exhibitions, countries] = await Promise.all([
    getExhibitions(params),
    getCountries(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">展会列表</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="搜索展会..."
            defaultValue={params.search}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            defaultValue={params.status || 'all'}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部状态</option>
            <option value="upcoming">即将开始</option>
            <option value="ongoing">进行中</option>
            <option value="ended">已结束</option>
          </select>
          <select
            name="country"
            defaultValue={params.country || 'all'}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部国家</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            筛选
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exhibitions.map((exhibition) => (
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
            <p className="text-sm text-gray-500 mb-2">{exhibition.country} · {exhibition.location}</p>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(exhibition.startDate).toLocaleDateString('zh-CN')} - {new Date(exhibition.endDate).toLocaleDateString('zh-CN')}
            </p>
            {exhibition.industry && (
              <p className="text-xs text-gray-400">{exhibition.industry}</p>
            )}
            <p className="text-xs text-blue-600 mt-2">
              {exhibition._count.news} 条相关新闻
            </p>
          </Link>
        ))}
      </div>

      {exhibitions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          没有找到符合条件的展会
        </div>
      )}
    </div>
  )
}
