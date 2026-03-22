import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import styles from './explore.module.css'
import { Heart } from 'lucide-react'

export default async function ExplorePage() {
  const profiles = await prisma.user.findMany({
    where: {
      username: { not: null },
      profileCharities: { some: {} }
    },
    include: {
      _count: {
        select: { profileCharities: true }
      }
    }
  })

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Explore Profiles</h1>
        <p>Discover people who are supporting effective causes.</p>
      </header>

      <div className={styles.grid}>
        {profiles.length === 0 ? (
          <p>No profiles found yet. Be the first to create one!</p>
        ) : (
          profiles.map((profile) => (
            <Link key={profile.username} href={`/${profile.username}`} className="card">
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  <Heart size={20} color="white" />
                </div>
                <h3>{profile.username}</h3>
              </div>
              <p>Supporting {profile._count.profileCharities} charities</p>
            </Link>
          ))
        )}
      </div>
    </main>
  )
}
