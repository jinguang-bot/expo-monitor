import { prisma } from './prisma'
import { searchNews } from './brave-search'

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
          
          await prisma.news.upsert({
            where: { url: item.url },
            update: {
              title: item.title,
              description: item.description || '',
              source: item.source || 'Unknown',
              publishedAt: item.published ? new Date(item.published) : new Date(),
            },
            create: {
              exhibitionId: exhibition.id,
              title: item.title,
              url: item.url,
              description: item.description || '',
              source: item.source || 'Unknown',
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
  console.log(`- Total news: ${totalNews}`)
  console.log(`- Errors: ${errors}`)
  console.log(`- Exhibitions processed: ${exhibitions.length}`)

  return {
    totalNews,
    errors,
    exhibitionsProcessed: exhibitions.length
  }
}

/**
 * Fetch news for upcoming exhibitions only
 * More efficient for regular cron jobs
 */
export async function fetchNewsForUpcomingExhibitions() {
  console.log('Starting news fetch for upcoming exhibitions...')
  
  const now = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)

  const exhibitions = await prisma.exhibition.findMany({
    where: {
      startDate: {
        gte: now,
        lte: threeMonthsLater
      }
    },
    select: { id: true, name: true, industry: true }
  })

  console.log(`Found ${exhibitions.length} upcoming exhibitions in next 3 months`)

  let totalNews = 0
  let errors = 0

  for (const exhibition of exhibitions) {
    try {
      const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
      const searchResults = await searchNews(searchQuery)

      for (const item of searchResults) {
        try {
          if (!item.url || item.url.length < 10) continue
          
          await prisma.news.upsert({
            where: { url: item.url },
            update: {
              title: item.title,
              description: item.description || '',
              source: item.source || 'Unknown',
              publishedAt: item.published ? new Date(item.published) : new Date(),
            },
            create: {
              exhibitionId: exhibition.id,
              title: item.title,
              url: item.url,
              description: item.description || '',
              source: item.source || 'Unknown',
              publishedAt: item.published ? new Date(item.published) : new Date(),
            }
          })
          totalNews++
        } catch (error) {
          console.error(`Failed to save news:`, error)
        }
      }

      console.log(`✓ ${exhibition.name}`)
      await new Promise(resolve => setTimeout(resolve, 1100))
    } catch (error) {
      console.error(`✗ ${exhibition.name}:`, error)
      errors++
    }
  }

  return {
    totalNews,
    errors,
    exhibitionsProcessed: exhibitions.length
  }
}
