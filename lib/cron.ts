import { prisma } from './prisma'
import { searchNews } from './brave-search'
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

export async function fetchNewsForAllExhibitions() {
  console.log('Starting news fetch for all exhibitions...')
  
  const exhibitions = await prisma.exhibitions.findMany({
    select: { id: true, name: true, industry: true }
  })

  console.log(`Found ${exhibitions.length} exhibitions`)

  let totalNews = 0
  let errors = 0

  for (const exhibition of exhibitions) {
    try {
      const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
      const searchResults = await searchNews(searchQuery)

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
              source: source,
              category: category,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            },
            create: {
              id: randomUUID(),
              exhibitionId: exhibition.id,
              title: item.title,
              url: item.url,
              description: item.description || '',
              source: source,
              category: category,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            }
          })
          totalNews++
        } catch (error) {
          console.error(`Failed to save news for ${exhibition.name}:`, error)
        }
      }

      console.log(`✓ Fetched news for ${exhibition.name}`)
      await new Promise(resolve => setTimeout(resolve, 1100))
    } catch (error) {
      console.error(`✗ Failed to fetch news for ${exhibition.name}:`, error)
      errors++
    }
  }

  console.log(`\nNews fetch completed:`)
  console.log(`  Total news saved: ${totalNews}`)
  console.log(`  Errors: ${errors}`)

  return { totalNews, errors }
}

export async function fetchNewsForUpcomingExhibitions() {
  console.log('Starting news fetch for upcoming exhibitions...')
  
  const now = new Date()
  const threeMonthsLater = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
  
  const upcomingExhibitions = await prisma.exhibitions.findMany({
    where: {
      startDate: {
        gte: now,
        lte: threeMonthsLater
      }
    },
    orderBy: { startDate: 'asc' },
    select: { id: true, name: true, industry: true }
  })

  console.log(`Found ${upcomingExhibitions.length} upcoming exhibitions`)

  let totalNews = 0
  let errors = 0

  for (const exhibition of upcomingExhibitions) {
    try {
      const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
      const searchResults = await searchNews(searchQuery)

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
              source: source,
              category: category,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            },
            create: {
              id: randomUUID(),
              exhibitionId: exhibition.id,
              title: item.title,
              url: item.url,
              description: item.description || '',
              source: source,
              category: category,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            }
          })
          totalNews++
        } catch (error) {
          console.error(`Failed to save news for ${exhibition.name}:`, error)
        }
      }

      console.log(`✓ Fetched news for ${exhibition.name}`)
      await new Promise(resolve => setTimeout(resolve, 1100))
    } catch (error) {
      console.error(`✗ Failed to fetch news for ${exhibition.name}:`, error)
      errors++
    }
  }

  console.log(`\nNews fetch completed:`)
  console.log(`  Total news saved: ${totalNews}`)
  console.log(`  Errors: ${errors}`)

  return { totalNews, errors }
}
