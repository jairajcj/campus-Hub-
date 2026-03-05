import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Search, Plus, Newspaper, User, Clock, Tag, Trash2, X } from 'lucide-react'
import { getNews, createNews, deleteNews } from '../api'
import Modal from '../components/Modal'

const CATEGORIES = ['all', 'announcement', 'event', 'academic', 'sports', 'cultural', 'other']

const CAT_TAG = {
    announcement: 'tag-primary', event: 'tag-cyan', academic: 'tag-purple',
    sports: 'tag-green', cultural: 'tag-amber', other: 'tag-gray'
}

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}

function NewsCard({ post, onDelete }) {
    return (
        <div className="card fade-in">
            <div className="card-header">
                <span className={`tag ${CAT_TAG[post.category] || 'tag-gray'}`}>{post.category}</span>
                <button className="btn btn-icon btn-ghost" style={{ color: 'var(--rose)', opacity: 0.7 }}
                    onClick={() => onDelete(post._id)} title="Delete post">
                    <Trash2 size={14} />
                </button>
            </div>
            <div className="card-body">
                <h3 className="card-title" style={{ marginBottom: '0.6rem' }}>{post.title}</h3>
                <p className="card-desc">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                        {post.tags.map(t => <span key={t} className="tag tag-gray"><Tag size={10} />{t}</span>)}
                    </div>
                )}
            </div>
            <div className="card-footer">
                <span className="card-meta"><User size={12} />{post.authorName}</span>
                <span className="card-meta"><Clock size={12} />{timeAgo(post.createdAt)}</span>
            </div>
            {(post.authorEmail || post.authorPhone) && (
                <div className="contact-strip">
                    {post.authorEmail && (
                        <div className="contact-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            <a href={`mailto:${post.authorEmail}`}>{post.authorEmail}</a>
                        </div>
                    )}
                    {post.authorPhone && (
                        <div className="contact-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.75 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span>{post.authorPhone}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function PostNewsForm({ onSubmit, loading }) {
    const [form, setForm] = useState({ title: '', content: '', category: 'announcement', authorName: '', authorEmail: '', authorPhone: '', tags: '' })
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.title || !form.content || !form.authorName) { toast.error('Please fill in all required fields'); return }
        onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group full">
                    <label className="form-label">Title <span className="required">*</span></label>
                    <input className="form-input" placeholder="e.g. Annual Tech Fest 2026" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="form-group full">
                    <label className="form-label">Content <span className="required">*</span></label>
                    <textarea className="form-textarea" rows={4} placeholder="Write your news content here..." value={form.content} onChange={e => set('content', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Tags <span className="form-hint">(comma-separated)</span></label>
                    <input className="form-input" placeholder="e.g. fest, tech, 2026" value={form.tags} onChange={e => set('tags', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Your Name <span className="required">*</span></label>
                    <input className="form-input" placeholder="Full name" value={form.authorName} onChange={e => set('authorName', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="you@university.edu" value={form.authorEmail} onChange={e => set('authorEmail', e.target.value)} />
                </div>
                <div className="form-group full">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+91 98765 43210" value={form.authorPhone} onChange={e => set('authorPhone', e.target.value)} />
                </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Posting...' : <><Plus size={16} /> Post News</>}
                </button>
            </div>
        </form>
    )
}

export default function NewsPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [showModal, setModal] = useState(false)
    const [category, setCategory] = useState('all')
    const [search, setSearch] = useState('')

    const fetchNews = useCallback(async () => {
        setLoading(true)
        try {
            const params = {}
            if (category !== 'all') params.category = category
            if (search) params.search = search
            const res = await getNews(params)
            setItems(res.data.data)
        } catch { toast.error('Failed to load news') }
        finally { setLoading(false) }
    }, [category, search])

    useEffect(() => { fetchNews() }, [fetchNews])

    // Listen to Navbar Post button
    useEffect(() => {
        const handler = (e) => { if (e.detail === 'news') setModal(true) }
        window.addEventListener('open-post', handler)
        return () => window.removeEventListener('open-post', handler)
    }, [])

    const handlePost = async (data) => {
        setPosting(true)
        try {
            await createNews(data)
            toast.success('News posted successfully! 🎉')
            setModal(false)
            fetchNews()
        } catch { toast.error('Failed to post news') }
        finally { setPosting(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this post?')) return
        try {
            await deleteNews(id)
            toast.success('Post deleted')
            fetchNews()
        } catch { toast.error('Failed to delete') }
    }

    return (
        <main className="page-section">
            <div className="container">
                <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div className="section-badge primary"><Newspaper size={13} /> Campus News</div>
                        <h1 className="section-title">Latest from Campus</h1>
                        <p className="section-sub">Stay up to date with events, announcements, and community stories.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Post News</button>
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news..." />
                    </div>
                    <div className="filter-group">
                        {CATEGORIES.map(c => (
                            <button key={c} className={`filter-chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
                                {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="loading-grid">{Array(6).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}</div>
                ) : items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Newspaper size={32} /></div>
                        <h3>No news yet</h3>
                        <p>Be the first to share a campus update!</p>
                        <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} /> Post News</button>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {items.map(p => <NewsCard key={p._id} post={p} onDelete={handleDelete} />)}
                    </div>
                )}
            </div>

            {showModal && (
                <Modal title="📰 Post Campus News" onClose={() => setModal(false)}>
                    <PostNewsForm onSubmit={handlePost} loading={posting} />
                </Modal>
            )}
        </main>
    )
}
