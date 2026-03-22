import Link from 'next/link'
import styles from './nav.module.css'

export default function ProfileNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          fundraise.bio
        </Link>
        <Link href="/" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
          Create your own profile
        </Link>
      </div>
    </nav>
  )
}
