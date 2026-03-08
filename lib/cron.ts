import { prisma } from './prisma'
import { searchNews } from './brave-search'

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return 'Unknown'
  }
}

/**
 * Fetch news for all exhibitions
 * This function can be called by a cron job or manually
 */
export async function fetchNewsForAllExhibitions() {
  console.log('Starting news fetch for all exhibitions...')
  
  const exhibitions = await prisma.exhibition.findMany({
    select: { id: true, name: true, industry: true }
  })

  console.log(`Found ${exhibitions.length} exhibitions`)

  let totalNews = 0
  let errors = 0

  for (const exhibition of exhibitions) {
    try {
      // Search for news using Brave Search API
      const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
      const searchResults = await searchNews(searchQuery)

      // Save news to database
      for (const item of searchResults) {
        try {
          // Skip if URL is empty or invalid
          if (!item.url || item.url.length < 10) continue
          
          const source = extractDomain(item.url)
          
          await prisma.news.upsert({
            where: { url: item.url },
            update: {
              title: item.title,
              description: item.description || '',
              source: source,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            },
            create: {
              exhibitionId: exhibition.id,
              title: item.title,
              url: item.url,
              description: item.description || '',
              source: source,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            }
          })
          totalNews++
        } catch (error) {
          console.error(`Failed to save news for ${exhibition.name}:`, error)
        }
      }

      console.log(`✓ Fetched news for ${exhibition.name}`)
      
      // Rate limiting: wait 1.1 seconds between requests
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

/**
 * Fetch news for upcoming exhibitions (next 3 months)
 */
export async function fetchNewsForUpcomingExhibitions() {
  console.log('Starting news fetch for upcoming exhibitions...')
  
  const now = new Date()
  const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

  const exhibitions = await prisma.exhibition.findMany({
    where: {
      startDate: {
        gte: now,
        lte: threeMonthsLater
      }
    },
    select: { id: true, name: true, industry: true }
  })

  console.log(`Found ${exhibitions.length} upcoming exhibitions`)

  let totalNews = 0
  let errors = 0

  for (const exhibition of exhibitions) {
    try {
      // Search for news using Brave Search API
      const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
      const searchResults = await searchNews(searchQuery)

      // Save news to database
      for (const item of searchResults) {
        try {
          // Skip if URL is empty or invalid
          if (!item.url || item.url.length < 10) continue
          
          const source = extractDomain(item.url)
          
          await prisma.news.upsert({
            where: { url: item.url },
            update: {
              title: item.title,
              description: item.description || '',
              source: source,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            },
            create: {
              exhibitionId: exhibition.id,
              title: item.title,
              url: item.url,
              description: item.description || '',
              source: source,
              publishedAt: item.published ? new Date(item.published) : new Date(),
            }
          })
          totalNews++
        } catch (error) {
          console.error(`Failed to save news for ${exhibition.name}:`, error)
        }
      }

      console.log(`✓ Fetched ${searchResults.length} news for ${exhibition.name}`)
      
      // Rate limiting: wait 1.1 seconds between requests
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
