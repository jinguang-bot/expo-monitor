#!/usr/bin/env tsx
/**
 * Cron script to fetch news for exhibitions
 * 
 * Usage:
 *   # Fetch news for upcoming exhibitions only (recommended for daily cron)
 *   tsx scripts/cron-fetch-news.ts
 *   
 *   # Fetch news for all exhibitions
 *   tsx scripts/cron-fetch-news.ts --all
 *   
 *   # Add to crontab (runs every day at 6 AM)
 *   0 6 * * * cd /home/ubuntu/Projects/expo-monitor && /usr/bin/tsx scripts/cron-fetch-news.ts >> /var/log/expo-monitor-cron.log 2>&1
 */

import { fetchNewsForUpcomingExhibitions, fetchNewsForAllExhibitions } from '../lib/cron'

const args = process.argv.slice(2)
const fetchAll = args.includes('--all')

async function main() {
  console.log('='.repeat(60))
  console.log(`Exhibition News Fetcher - ${new Date().toISOString()}`)
  console.log('='.repeat(60))
  
  try {
    const result = fetchAll 
      ? await fetchNewsForAllExhibitions()
      : await fetchNewsForUpcomingExhibitions()

    console.log('\n' + '='.repeat(60))
    console.log('Result:')
    console.log(JSON.stringify(result, null, 2))
    console.log('='.repeat(60))
    
    process.exit(0)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()
