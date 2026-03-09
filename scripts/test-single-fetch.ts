#!/usr/bin/env tsx
/**
 * 测试脚本：抓取单个展会的新闻（用于验证重试机制）
 */

import { prisma } from '../lib/prisma'
import { searchNews } from '../lib/brave-search'
import { categorizeNews } from '../lib/categorize-news'

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  let lastError: Error | undefined
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.warn(`⚠️  Attempt ${attempt}/${maxRetries} failed:`, error)
      
      if (attempt < maxRetries) {
        console.log(`   Retrying in ${delayMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }
  
  throw lastError
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return 'Unknown'
  }
}

async function main() {
  const startTime = Date.now()
  console.log('='.repeat(60))
  console.log('测试脚本：抓取单个展会的新闻')
  console.log('='.repeat(60))
  
  // 获取第一个展会
  const exhibition = await prisma.exhibitions.findFirst()
  
  if (!exhibition) {
    console.error('❌ 数据库中没有展会')
    process.exit(1)
  }
  
  console.log(`\n📋 测试展会: ${exhibition.name}`)
  console.log(`   ID: ${exhibition.id}`)
  console.log(`   行业: ${exhibition.industry}`)
  
  try {
    const searchQuery = `${exhibition.name} ${exhibition.industry || ''} 2026`.trim()
    console.log(`\n🔍 搜索关键词: "${searchQuery}"`)
    
    // 使用重试包装器调用Brave Search API
    const searchResults = await withRetry(
      () => searchNews(searchQuery, 5),  // 只抓取5个结果
      3,  // 最多重试3次
      2000  // 间隔2秒
    )
    
    console.log(`\n✅ 搜索成功！找到 ${searchResults.length} 条新闻`)
    
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
            source: source,
            category: category,
            publishedAt: item.published ? new Date(item.published) : new Date(),
          },
          create: {
            exhibitionId: exhibition.id,
            title: item.title,
            url: item.url,
            description: item.description || '',
            source: source,
            category: category,
            publishedAt: item.published ? new Date(item.published) : new Date(),
          }
        })
        savedCount++
        console.log(`   ✓ 保存: ${item.title.substring(0, 50)}...`)
      } catch (error) {
        console.error(`   ✗ 保存失败: ${item.title}`, error)
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✅ 测试成功！`)
    console.log(`   保存新闻: ${savedCount} 条`)
    console.log(`   用时: ${duration} 秒`)
    console.log('='.repeat(60))
    
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`\n${'='.repeat(60)}`)
    console.log(`❌ 测试失败！`)
    console.log(`   错误: ${error}`)
    console.log(`   用时: ${duration} 秒`)
    console.log('='.repeat(60))
    process.exit(1)
  }
  
  process.exit(0)
}

main()
