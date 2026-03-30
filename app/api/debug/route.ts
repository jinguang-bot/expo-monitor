import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlLength: process.env.DATABASE_URL?.length,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    
    // Test connection
    await prisma.$connect()
    
    // Check tables
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    // Test query
    const exhibitionCount = await prisma.exhibitions.count()
    const newsCount = await prisma.news.count()
    
    return NextResponse.json({
      status: 'connected',
      env: envCheck,
      tables: tables.map(t => t.table_name),
      counts: {
        exhibitions: exhibitionCount,
        news: newsCount
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      env: envCheck,
      error: {
        message: error.message,
        code: error.code,
        meta: error.meta
      }
    }, { status: 500 })
  }
}
