import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import styles from './profile.module.css'
import CharityCard from '@/components/CharityCard'
import { Heart } from 'lucide-react'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  if (!username) {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      profileCharities: {
        include: { 
          charity: true,
          donations: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          <Heart size={40} color="white" />
        </div>
        <h1>{user.username}</h1>
        <p>I'm supporting these effective charities. Join me in making a difference.</p>
      </header>

      <div className={styles.charityGrid}>
        {user.profileCharities.map((pc) => (
          <CharityCard key={pc.id} profileCharity={pc} />
        ))}
      </div>
    </main>
  )
}
