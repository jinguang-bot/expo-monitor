// 新闻自动分类工具

export function categorizeNews(title: string, description: string): string {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = (description || '').toLowerCase()
  
  // 产品发布
  if (lowerTitle.includes('launch') || lowerTitle.includes('release') || 
      lowerTitle.includes('announce') || lowerTitle.includes('unveil')) {
    return '产品发布'
  }
  
  // 技术趋势
  if (lowerDesc.includes('ai') || lowerDesc.includes('artificial intelligence') ||
      lowerDesc.includes('machine learning') || lowerDesc.includes('technology')) {
    return '技术趋势'
  }
  
  // 市场分析
  if (lowerDesc.includes('market') || lowerDesc.includes('industry') || 
      lowerDesc.includes('growth') || lowerDesc.includes('analysis')) {
    return '市场分析'
  }
  
  // 行业动态
  return '行业动态'
}
