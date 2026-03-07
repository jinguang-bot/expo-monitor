import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const exhibitionId = searchParams.get('exhibitionId')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: any = {}

  if (exhibitionId) {
    where.exhibitionId = exhibitionId
  }

  const news = await prisma.news.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      exhibition: {
        select: { name: true }
      }
    }
  })

  return NextResponse.json(news)
}
