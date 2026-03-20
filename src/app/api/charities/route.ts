import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const charities = await prisma.charity.findMany()
  return NextResponse.json(charities)
}
