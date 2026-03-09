import { prisma } from './prisma'
import { searchNews } from './brave-search'
import { randomUUID } from 'crypto'

export interface FetchResult {
  totalNews: number
  errors: number
  details?: string
}

export async function fetchNewsForExhibition(exhibitionId: string): Promise<number> {
  const exhibition = await prisma.exhibitions.findUnique({
    where: { id: exhibitionId },
    select: { id: true, name: true, industry: true }
  })

  if (!exhibition) {
    throw new Error('Exhibition not found')
  }

  const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
  const searchResults = await searchNews(searchQuery)

  let savedCount = 0

  for (const item of searchResults) {
    try {
      if (!item.url || item.url.length < 10) continue

      const source = extractDomain(item.url)
      const category = categorizeNews(item.title, item.description || '')

      await prisma.news.upsert({
        where: { url: item.url },
        update: {
          title: item.title,
          description: item.description || '',
          source,
          category,
          publishedAt: item.published ? new Date(item.published) : new Date(),
        },
        create: {
          id: randomUUID(),
          exhibitionId: exhibition.id,
          title: item.title,
          url: item.url,
          description: item.description || '',
          source,
          category,
          publishedAt: item.published ? new Date(item.published) : new Date(),
        }
      })
      savedCount++
    } catch (error) {
      console.error(`Failed to save news: ${item.title}`, error)
    }
  }

  return savedCount
}

export async function fetchAllNews(): Promise<FetchResult> {
  const exhibitions = await prisma.exhibitions.findMany({
    select: { id: true }
  })

  let totalNews = 0
  let errors = 0

  for (const exhibition of exhibitions) {
    try {
      const count = await fetchNewsForExhibition(exhibition.id)
      totalNews += count
      await new Promise(resolve => setTimeout(resolve, 1100))
    } catch (error) {
      console.error(`Failed to fetch news for exhibition ${exhibition.id}:`, error)
      errors++
    }
  }

  return { totalNews, errors }
}

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
