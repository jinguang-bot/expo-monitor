import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchNews } from '@/lib/brave-search'
import { randomUUID } from 'crypto'

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return 'Unknown'
  }
}

function categorizeNews(title: string, description: string): string {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = (description || '').toLowerCase()
  
  if (lowerTitle.includes('launch') || lowerTitle.includes('release') || 
      lowerTitle.includes('announce') || lowerTitle.includes('unveil')) {
    return '产品发布'
  }
  
  if (lowerDesc.includes('ai') || lowerDesc.includes('artificial intelligence') ||
      lowerDesc.includes('machine learning') || lowerDesc.includes('technology')) {
    return '技术趋势'
  }
  
  if (lowerDesc.includes('market') || lowerDesc.includes('industry') || 
      lowerDesc.includes('growth') || lowerDesc.includes('analysis')) {
    return '市场分析'
  }
  
  return '行业动态'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exhibitionId } = body

    if (!exhibitionId) {
      return NextResponse.json({ error: 'exhibitionId is required' }, { status: 400 })
    }

    const exhibition = await prisma.exhibitions.findUnique({
      where: { id: exhibitionId }
    })

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
    }

    const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
    const searchResults = await searchNews(searchQuery)

    const savedNews = []
    for (const item of searchResults) {
      try {
        if (!item.url || item.url.length < 10) continue
        
        const source = extractDomain(item.url)
        const category = categorizeNews(item.title, item.description || '')
        
        const news = await prisma.news.upsert({
          where: { url: item.url },
          update: {
            title: item.title,
            description: item.description || '',
            source: source,
            category: category,
            publishedAt: item.published ? new Date(item.published) : new Date(),
          },
          create: {
            id: randomUUID(),
            exhibitionId,
            title: item.title,
            url: item.url,
            description: item.description || '',
            source: source,
            category: category,
            publishedAt: item.published ? new Date(item.published) : new Date(),
          }
        })
        savedNews.push(news)
      } catch (error) {
        console.error(`Failed to save news: ${item.title}`, error)
      }
    }

    return NextResponse.json({ 
      success: true,
      count: savedNews.length,
      news: savedNews
    })
  } catch (error) {
    console.error('News fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
