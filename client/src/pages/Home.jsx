import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, Search, BookOpen, Users, ChevronRight, Zap } from 'lucide-react'
import { getStats } from '../api'

function StatNum({ target }) {
    const [val, setVal] = useState(0)
    useEffect(() => {
        if (!target) return
        let start = 0
        const step = Math.ceil(target / 40)
        const id = setInterval(() => {
            start += step
            if (start >= target) { setVal(target); clearInterval(id) }
            else setVal(start)
        }, 30)
        return () => clearInterval(id)
    }, [target])
    return <span className="stat-num">{val}</span>
}

export default function Home() {
    const [stats, setStats] = useState({ newsCount: 0, lostCount: 0, foundCount: 0, textbookCount: 0 })

    useEffect(() => {
        getStats().then(r => setStats(r.data.data)).catch(() => { })
    }, [])

    return (
        <>
            {/* ── HERO ── */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-badge">Campus Digital Hub</span>
                        <h1 className="hero-title">Your Campus, <br />All in One Place</h1>
                        <p className="hero-sub">
                            Share news, find lost items, and buy/sell textbooks with fellow students.
                            Fast, simple, and direct.
                        </p>
                        <div className="hero-actions">
                            <Link to="/news" className="btn btn-primary">Browse News</Link>
                            <Link to="/lostfound" className="btn btn-ghost">Lost & Found</Link>
                            <Link to="/textbooks" className="btn btn-ghost">Textbooks</Link>
                        </div>

                        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '48px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}><StatNum target={stats.newsCount} /></div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NEWS POSTS</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}><StatNum target={stats.lostCount + stats.foundCount} /></div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>L&F REPORTS</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}><StatNum target={stats.textbookCount} /></div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BOOKS LISTED</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'center' }}>
                        <h2 className="section-title">Everything for Campus Life</h2>
                        <p className="section-sub">Simple, powerful tools built for students.</p>
                    </div>

                    <div className="cards-grid">
                        <div className="card">
                            <h3 style={{ marginBottom: '8px' }}>📰 Campus News</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flex: 1 }}>
                                Stay updated with the latest announcements, events, and academic notices.
                            </p>
                            <Link to="/news" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>Explore News</Link>
                        </div>
                        <div className="card">
                            <h3 style={{ marginBottom: '8px' }}>🔍 Lost & Found</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flex: 1 }}>
                                Identify lost items or post something you found. Help your community.
                            </p>
                            <Link to="/lostfound" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>View Board</Link>
                        </div>
                        <div className="card">
                            <h3 style={{ marginBottom: '8px' }}>📚 Used Textbooks</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', flex: 1 }}>
                                The marketplace for students. Find cheap books or sell your old ones.
                            </p>
                            <Link to="/textbooks" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', marginTop: '12px' }}>Browse Books</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
