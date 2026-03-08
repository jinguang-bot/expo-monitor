import { prisma } from '../lib/prisma'
import { categorizeNews } from '../lib/categorize-news'

async function backfillCategories() {
  console.log('开始填充新闻分类...')
  
  // 获取所有新闻
  const news = await prisma.news.findMany({
    select: { id: true, title: true, description: true, category: true }
  })
  
  console.log(`找到 ${news.length} 条新闻`)
  
  // 统计信息
  const stats: Record<string, number> = {
    '产品发布': 0,
    '技术趋势': 0,
    '市场分析': 0,
    '行业动态': 0,
  }
  
  let updated = 0
  
  for (const item of news) {
    // 如果已有分类，跳过
    if (item.category) {
      continue
    }
    
    // 自动分类
    const category = categorizeNews(item.title, item.description || '')
    
    // 更新数据库
    await prisma.news.update({
      where: { id: item.id },
      data: { category }
    })
    
    stats[category]++
    updated++
  }
  
  console.log('\n填充完成！')
  console.log(`更新了 ${updated} 条新闻`)
  console.log('\n分类统计：')
  Object.entries(stats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} 条`)
  })
  
  await prisma.$disconnect()
}

backfillCategories().catch(console.error)
