import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const country = searchParams.get('country')
  const search = searchParams.get('search')

  const where: any = {}

  if (status && status !== 'all') {
    where.status = status
  }

  if (country && country !== 'all') {
    where.country = country
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ]
  }

  const exhibitions = await prisma.exhibition.findMany({
    where,
    orderBy: { startDate: 'asc' },
    include: {
      _count: {
        select: { news: true }
      }
    }
  })

  return NextResponse.json(exhibitions)
}
