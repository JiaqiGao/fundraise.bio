import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { profileCharityId, amount, donorName } = await req.json()

  if (!profileCharityId || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const donation = await prisma.donationReport.create({
    data: {
      profileCharityId,
      amount: parseFloat(amount),
      donorName: donorName || 'Anonymous'
    }
  })

  return NextResponse.json(donation)
}
