'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'
import { ExternalLink, Plus, Trash2, Eye, MousePointer2, User as UserIcon } from 'lucide-react'

type Charity = {
  id: string
  name: string
  description: string
  giveWellRating: string
  charityWatchRating: string
  donationUrl: string
}

type ProfileCharity = {
  id: string
  charityId: string
  viewCount: number
  clickCount: number
  charity: Charity
}

type User = {
  id: string
  email: string
  username: string | null
  profileCharities: ProfileCharity[]
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [availableCharities, setAvailableCharities] = useState<Charity[]>([])
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  const fetchData = async () => {
    try {
      const [userRes, charitiesRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/charities')
      ])
      
      const userData = await userRes.json()
      const charitiesData = await charitiesRes.json()
      
      setUser(userData)
      setAvailableCharities(charitiesData)
      if (userData.username) setUsername(userData.username)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Updating...')
    
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      
      const data = await res.json()
      if (data.error) {
        setMessage(data.error)
      } else {
        setMessage('Username updated!')
        setUser({ ...user!, username: data.username })
      }
    } catch (error) {
      setMessage('An error occurred.')
    }
  }

  const toggleCharity = async (charityId: string, action: 'add' | 'remove') => {
    try {
      const res = await fetch('/api/user/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId, action })
      })
      
      if (res.ok) {
        fetchData() // Refresh
      }
    } catch (error) {
      console.error('Error toggling charity:', error)
    }
  }

  if (loading) return <main>Loading...</main>

  const selectedCharityIds = user?.profileCharities.map(pc => pc.charityId) || []

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome, {session?.user?.email}</p>
      </header>

      <section className="card">
        <h3><UserIcon size={18} /> Profile Settings</h3>
        <form onSubmit={handleUpdateUsername} className={styles.usernameForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Your unique username</label>
            <div className={styles.inputWithPrefix}>
              <span>fundraise.bio/</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save Username</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
        {user?.username && (
          <p className={styles.profileLink}>
            Public profile: <a href={`/${user.username}`} target="_blank" rel="noreferrer">/{user.username} <ExternalLink size={14} /></a>
          </p>
        )}
      </section>

      <div className={styles.grid}>
        <section className={styles.charityList}>
          <h3>Selected Charities</h3>
          {user?.profileCharities.length === 0 ? (
            <p>You haven't selected any charities yet.</p>
          ) : (
            user?.profileCharities.map((pc) => (
              <div key={pc.id} className={`${styles.charityCard} card`}>
                <div className={styles.charityHeader}>
                  <h4>{pc.charity.name}</h4>
                  <button 
                    onClick={() => toggleCharity(pc.charityId, 'remove')}
                    className={styles.deleteBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className={styles.statsRow}>
                  <span><Eye size={14} /> {pc.viewCount} views</span>
                  <span><MousePointer2 size={14} /> {pc.clickCount} clicks</span>
                </div>
              </div>
            ))
          )}
        </section>

        <section className={styles.charitySelector}>
          <h3>Add Charities</h3>
          <div className={styles.availableList}>
            {availableCharities
              .filter(c => !selectedCharityIds.includes(c.id))
              .map(charity => (
                <div key={charity.id} className={styles.availableItem}>
                  <div>
                    <strong>{charity.name}</strong>
                    <p>{charity.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleCharity(charity.id, 'add')}
                    className="btn btn-outline"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  )
}
