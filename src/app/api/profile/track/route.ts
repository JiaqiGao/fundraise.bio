import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { profileCharityId, type } = await req.json()

  if (type === 'view') {
    await prisma.profileCharity.update({
      where: { id: profileCharityId },
      data: { viewCount: { increment: 1 } }
    })
  } else if (type === 'click') {
    await prisma.profileCharity.update({
      where: { id: profileCharityId },
      data: { clickCount: { increment: 1 } }
    })
  }

  return NextResponse.json({ success: true })
}
