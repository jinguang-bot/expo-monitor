import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
    nodeEnv: process.env.NODE_ENV,
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    await prisma.$connect()
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    return NextResponse.json({
      status: 'connected',
      env: envCheck,
      tables: tableCheck
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      env: envCheck,
      error: error.message,
      code: error.code
    })
  }
}
