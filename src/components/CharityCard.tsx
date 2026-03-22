'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, CheckCircle, ShieldCheck } from 'lucide-react'
import styles from './CharityCard.module.css'

type Donation = {
  id: string
  amount: number
  donorName: string | null
  createdAt: Date
}

type ProfileCharity = {
  id: string
  charityId: string
  charity: {
    id: string
    name: string
    description: string
    giveWellRating: string | null
    charityWatchRating: string | null
    donationUrl: string
  }
  donations: Donation[]
}

export default function CharityCard({ profileCharity }: { profileCharity: ProfileCharity }) {
  const [amount, setAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [reported, setReported] = useState(false)
  const [loading, setLoading] = useState(false)

  const { charity } = profileCharity

  // Track view on mount
  useEffect(() => {
    fetch('/api/profile/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileCharityId: profileCharity.id, type: 'view' })
    })
  }, [profileCharity.id])

  const handleClick = () => {
    fetch('/api/profile/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileCharityId: profileCharity.id, type: 'click' })
    })
    window.open(charity.donationUrl, '_blank')
  }

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/profile/report-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileCharityId: profileCharity.id,
          amount,
          donorName
        })
      })
      
      if (res.ok) {
        setReported(true)
      }
    } catch (error) {
      console.error('Error reporting donation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`card ${styles.charityCard}`}>
      <div className={styles.header}>
        <h3>{charity.name}</h3>
        <div className={styles.badges}>
          {charity.giveWellRating && (
            <span className={styles.badge} title="GiveWell Rating">
              <ShieldCheck size={14} /> GiveWell: {charity.giveWellRating}
            </span>
          )}
          {charity.charityWatchRating && (
            <span className={styles.badge} title="CharityWatch Rating">
              <CheckCircle size={14} /> CharityWatch: {charity.charityWatchRating}
            </span>
          )}
        </div>
      </div>
      
      <p className={styles.description}>{charity.description}</p>
      
      <button onClick={handleClick} className="btn btn-primary">
        Donate to {charity.name} <ExternalLink size={16} style={{ marginLeft: '0.5rem' }} />
      </button>

      <div className={styles.donationsSection}>
        <h4>Self-Report Donation</h4>
        {!reported ? (
          <form onSubmit={handleReport} className={styles.reportForm}>
            <div className={styles.inputRow}>
              <input
                type="number"
                placeholder="Amount ($)"
                value={amount}
                min="1"
                max="10000"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Your Name (optional)"
                value={donorName}
                maxLength={150}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline" disabled={loading}>
              {loading ? 'Submitting...' : 'Report Donation'}
            </button>
          </form>
        ) : (
          <p className={styles.success}>Thanks for reporting your support!</p>
        )}

        {profileCharity.donations.length > 0 && (
          <div className={styles.recentSupporters}>
            <h5>Recent Supporters</h5>
            <ul>
              {profileCharity.donations.map((d) => (
                <li key={d.id}>
                  <strong>{d.donorName || 'Anonymous'}</strong> donated ${d.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
