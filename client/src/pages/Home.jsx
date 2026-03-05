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
                <div className="hero-bg">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                    <div className="grid-lines" />
                </div>
                <div className="hero-content container">
                    <div className="hero-badge">
                        <Zap size={14} /> &nbsp;Your Campus. Your Community.
                    </div>
                    <h1 className="hero-title">
                        Stay Connected.<br />
                        <span className="gradient-text">Stay Informed.</span>
                    </h1>
                    <p className="hero-sub">
                        The all-in-one digital hub for every student — share campus news, report
                        lost items, and buy or sell used textbooks, all in one place.
                    </p>
                    <div className="hero-actions">
                        <Link to="/news" className="btn btn-primary btn-lg"><Newspaper size={18} /> Browse News</Link>
                        <Link to="/textbooks" className="btn btn-green btn-lg"><BookOpen size={18} /> Find Textbooks</Link>
                        <Link to="/lostfound" className="btn btn-ghost btn-lg"><Search size={18} /> Lost &amp; Found</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item"><StatNum target={stats.newsCount} /><span className="stat-label">News Posts</span></div>
                        <div className="stat-divider" />
                        <div className="stat-item"><StatNum target={stats.lostCount} /><span className="stat-label">Lost Items</span></div>
                        <div className="stat-divider" />
                        <div className="stat-item"><StatNum target={stats.foundCount} /><span className="stat-label">Found Items</span></div>
                        <div className="stat-divider" />
                        <div className="stat-item"><StatNum target={stats.textbookCount} /><span className="stat-label">Textbooks</span></div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="page-section" style={{ paddingTop: '4rem' }}>
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge primary"><Users size={13} /> Platform</div>
                        <h2 className="section-title">Everything for Campus Life</h2>
                        <p className="section-sub">Three powerful tools, one seamless platform built just for students.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon primary"><Newspaper size={22} /></div>
                            <h3>Campus News</h3>
                            <p>Post and discover announcements, events, academic updates, sports results and cultural happenings across campus.</p>
                            <Link to="/news" className="btn btn-outline-primary btn-sm" style={{ marginTop: '1rem' }}>
                                Explore News <ChevronRight size={15} />
                            </Link>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon amber"><Search size={22} /></div>
                            <h3>Lost &amp; Found</h3>
                            <p>Lost your keys, ID, or laptop? Post a report or help someone else recover their belongings. Filter by category and location.</p>
                            <Link to="/lostfound" className="btn btn-ghost btn-sm" style={{ marginTop: '1rem', borderColor: 'var(--amber)', color: 'var(--amber)' }}>
                                View Board <ChevronRight size={15} />
                            </Link>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon green"><BookOpen size={22} /></div>
                            <h3>Used Textbooks</h3>
                            <p>Buy and sell used textbooks with fellow students. Filter by subject, condition, and price. Contact sellers directly.</p>
                            <Link to="/textbooks" className="btn btn-green btn-sm" style={{ marginTop: '1rem' }}>
                                Browse Books <ChevronRight size={15} />
                            </Link>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon cyan"><Users size={22} /></div>
                            <h3>Direct Contact</h3>
                            <p>No middlemen — every post includes direct contact info so students can reach each other instantly via email or phone.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
