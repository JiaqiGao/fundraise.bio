import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { profileCharityId, amount, donorName } = await req.json()

  if (!profileCharityId || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const numAmount = parseFloat(amount)
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > 10000) {
    return NextResponse.json({ error: 'Invalid amount (max $10,000)' }, { status: 400 })
  }

  if (donorName && donorName.length > 150) {
    return NextResponse.json({ error: 'Name too long (max 150 chars)' }, { status: 400 })
  }

  const donation = await prisma.donationReport.create({
    data: {
      profileCharityId,
      amount: numAmount,
      donorName: (donorName || 'Anonymous').substring(0, 150)
    }
  })

  return NextResponse.json(donation)
}
