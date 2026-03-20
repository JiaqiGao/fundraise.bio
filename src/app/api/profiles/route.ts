import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const profiles = await prisma.user.findMany({
    where: {
      username: { not: null },
      profileCharities: { some: {} } // only show profiles with charities
    },
    select: {
      username: true,
      _count: {
        select: { profileCharities: true }
      }
    }
  })
  
  return NextResponse.json(profiles)
}
