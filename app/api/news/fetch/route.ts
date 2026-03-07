import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchNews } from '@/lib/brave-search'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exhibitionId } = body

    if (!exhibitionId) {
      return NextResponse.json({ error: 'exhibitionId is required' }, { status: 400 })
    }

    const exhibition = await prisma.exhibition.findUnique({
      where: { id: exhibitionId }
    })

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
    }

    // Search for news using Brave Search API
    const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
    const searchResults = await searchNews(searchQuery)

    // Save news to database
    const savedNews = []
    for (const item of searchResults) {
      try {
        // Skip if URL is empty or invalid
        if (!item.url || item.url.length < 10) continue
        
        const news = await prisma.news.upsert({
          where: { url: item.url },
          update: {
            title: item.title,
            description: item.description || '',
            source: item.source || 'Unknown',
            publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
          },
          create: {
            exhibitionId,
            title: item.title,
            url: item.url,
            description: item.description || '',
            source: item.source || 'Unknown',
            publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
          }
        })
        savedNews.push(news)
      } catch (error) {
        console.error('Failed to save news:', error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: savedNews.length,
      news: savedNews 
    })
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
