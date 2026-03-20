import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main>
      <div className={styles.hero}>
        <h1>fundraise.bio</h1>
        <p>Support reputable charities and share your impact with a custom profile.</p>
        <div className={styles.cta}>
          <Link href="/login" className="btn btn-primary">Get Started</Link>
          <Link href="/explore" className="btn btn-outline">Explore Profiles</Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className="card">
          <h3>Pre-vetted Charities</h3>
          <p>We only list charities that are highly rated by GiveWell and CharityWatch.</p>
        </div>
        <div className="card">
          <h3>Custom Profile</h3>
          <p>Create your own fundraise.bio/username and pick the causes you care about.</p>
        </div>
        <div className="card">
          <h3>Transparent Tracking</h3>
          <p>Keep track of how many people view and support the charities on your list.</p>
        </div>
      </div>
    </main>
  )
}
