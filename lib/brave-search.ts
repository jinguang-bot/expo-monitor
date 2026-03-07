import axios from 'axios'

const BRAVE_API_KEY = process.env.BRAVE_API_KEY
const BRAVE_API_URL = 'https://api.search.brave.com/res/v1/web/search'

export interface SearchResult {
  title: string
  url: string
  description: string
  published?: string
}

export async function searchNews(query: string, count: number = 10): Promise<SearchResult[]> {
  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY is not configured')
  }

  try {
    const response = await axios.get(BRAVE_API_URL, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY,
      },
      params: {
        q: query,
        count,
        search_lang: 'en',
        freshness: 'pd7', // Past 7 days
      },
    })

    const results = response.data.web?.results || []

    return results.map((result: any) => ({
      title: result.title,
      url: result.url,
      description: result.description,
      published: result.page_age || undefined,
    }))
  } catch (error) {
    console.error('Brave Search API error:', error)
    throw error
  }
}

// Rate limiting: max 1 request per second for free tier
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1100 // 1.1 seconds

export async function searchNewsWithRateLimit(
  query: string,
  count: number = 10
): Promise<SearchResult[]> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }

  lastRequestTime = Date.now()
  return searchNews(query, count)
}
