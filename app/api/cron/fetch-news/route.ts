import { NextRequest, NextResponse } from 'next/server'
import { fetchNewsForUpcomingExhibitions, fetchNewsForAllExhibitions } from '@/lib/cron'

/**
 * API endpoint to trigger news fetch manually
 * Can be called by external cron services or manually
 * 
 * Query params:
 * - all: if true, fetch news for all exhibitions (default: only upcoming)
 * - secret: optional secret key for security (recommended for production)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fetchAll = searchParams.get('all') === 'true'
    const secret = searchParams.get('secret')

    // In production, you should validate the secret
    // if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    console.log(`Starting news fetch (fetchAll: ${fetchAll})`)

    const result = fetchAll 
      ? await fetchNewsForAllExhibitions()
      : await fetchNewsForUpcomingExhibitions()

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return NextResponse.json({
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
