import { Suspense } from 'react'
import { Bar, BarChart, Line, LineChart, PieChart } from 'recharts'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Dashboard',
}

export default async function Dashboard() {
  const stats = await prisma.exhibition.groupBy({
    _sum: {
      status: true,
    },
    count: true,
  })

  const countryStats = await prisma.exhibition.groupBy({
    country: true,
    _count: {
      country: true,
      count: true,
    },
    orderBy: {
      count: 'desc',
    },
  })

  const newsStats = await prisma.news.groupBy({
    exhibitionId: true,
    _count: {
      id: true,
    },
    orderBy: {
      exhibition: {
        name: true,
      _count: {
        news: _count,
      },
    },
    take: 5,
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Exhibition Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart data={pieData}>
                <Pie
                  data={pieData}
                  name="upcoming"
                  value={stats.find(s => s.status === 'upcoming')?._count || 0}
                  cx-active
                </Pie>
                <Pie
                  data={pieData}
                  name="ongoing"
                  value={stats.find(s => s.status === 'ongoing')?._count || 0}
                  cx={{ backgroundColor: '#60a5' }}
                </Pie>
                <Pie
                  data={pieData}
                  name="ended"
                  value={stats.find(s => s.status === 'ended')?._count || 0}
                  cx={{ backgroundColor: '#d1d5' }}
                </Pie>
              </ResponsiveContainer>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>News by Exhibition</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="exhibition" />
                <YAxis type="category" />
                <Bar dataKey="exhibition" fill="#4496BA" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Country Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="country" />
                <YAxis type="category" allowDataKey={['0-9']} />
                <Bar dataKey="country" fill="#4496ba" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}
