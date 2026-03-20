import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { charityId, action } = await req.json()
  
  if (action === 'add') {
    const profileCharity = await prisma.profileCharity.upsert({
      where: {
        userId_charityId: {
          userId: session.user.id,
          charityId: charityId
        }
      },
      update: {},
      create: {
        userId: session.user.id,
        charityId: charityId
      }
    })
    return NextResponse.json(profileCharity)
  } else if (action === 'remove') {
    await prisma.profileCharity.delete({
      where: {
        userId_charityId: {
          userId: session.user.id,
          charityId: charityId
        }
      }
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
