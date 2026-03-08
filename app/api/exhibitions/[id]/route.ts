import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const exhibition = await prisma.exhibition.findUnique({
    where: { id },
    include: {
      news: {
        orderBy: { publishedAt: 'desc' },
        take: 50,
      }
    }
  })

  if (!exhibition) {
    return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
  }

  return NextResponse.json(exhibition)
}
