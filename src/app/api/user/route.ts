import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = (await getServerSession(authOptions)) as any
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user['id'] },
    include: {
      profileCharities: {
        include: { charity: true }
      }
    }
  })

  return NextResponse.json(user)
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as any
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username } = await req.json()
  
  // Basic validation
  if (!username || username.length < 3 || username.length > 150) {
    return NextResponse.json({ error: 'Username must be between 3 and 150 chars' }, { status: 400 })
  }

  // Sanitize username
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '')
  if (cleanUsername !== username.toLowerCase()) {
    return NextResponse.json({ error: 'Username can only contain alphanumeric characters and underscores' }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user['id'] },
      data: { username: username.toLowerCase() }
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
  }
}
