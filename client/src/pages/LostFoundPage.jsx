import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Search, Plus, MapPin, Calendar, User, CheckCircle, Trash2 } from 'lucide-react'
import { getLostFound, createLostFound, deleteLostFound, updateLFStatus } from '../api'
import Modal from '../components/Modal'

const CATEGORIES = ['all', 'electronics', 'id-cards', 'keys', 'bags', 'books', 'clothing', 'jewelry', 'sports', 'stationery', 'other']

const CAT_LABELS = {
    'electronics': 'Electronics', 'id-cards': 'ID/Cards', 'keys': 'Keys', 'bags': 'Bags',
    'books': 'Books', 'clothing': 'Clothing', 'jewelry': 'Jewelry', 'sports': 'Sports', 'stationery': 'Stationery', 'other': 'Other'
}

function timeAgo(d) {
    const diff = (Date.now() - new Date(d)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}

function LFCard({ item, onDelete, onResolve }) {
    const isLost = item.type === 'lost'
    return (
        <div className="card fade-in" style={{ opacity: item.status === 'resolved' ? 0.65 : 1 }}>
            <div className="card-header">
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className={`tag ${isLost ? 'tag-rose' : 'tag-green'}`}>{isLost ? '🔍 Lost' : '✅ Found'}</span>
                    <span className="tag tag-gray">{CAT_LABELS[item.category] || item.category}</span>
                    {item.status === 'resolved' && <span className="tag tag-primary">Resolved</span>}
                </div>
                <button className="btn btn-icon btn-ghost" style={{ color: 'var(--rose)', opacity: 0.7 }}
                    onClick={() => onDelete(item._id)} title="Delete">
                    <Trash2 size={14} />
                </button>
            </div>
            <div className="card-body">
                <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>{item.itemName}</h3>
                <p className="card-desc">{item.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.75rem' }}>
                    <span className="card-meta"><MapPin size={12} />{item.location}</span>
                    <span className="card-meta"><Calendar size={12} />{new Date(item.dateLostFound).toLocaleDateString()}</span>
                    <span className="card-meta"><User size={12} />{item.posterName}</span>
                </div>
            </div>
            <div className="card-footer">
                <span className="card-meta">{timeAgo(item.createdAt)}</span>
                {item.status === 'active' && (
                    <button className="btn btn-green btn-sm" onClick={() => onResolve(item._id)}>
                        <CheckCircle size={14} /> Mark Resolved
                    </button>
                )}
            </div>
            {(item.posterEmail || item.posterPhone) && (
                <div className="contact-strip">
                    {item.posterEmail && (
                        <div className="contact-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            <a href={`mailto:${item.posterEmail}`}>{item.posterEmail}</a>
                        </div>
                    )}
                    {item.posterPhone && (
                        <div className="contact-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.75 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span>{item.posterPhone}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function PostLFForm({ onSubmit, loading, defaultType = 'lost' }) {
    const [form, setForm] = useState({
        type: defaultType, itemName: '', category: 'other', description: '',
        location: '', dateLostFound: new Date().toISOString().split('T')[0],
        posterName: '', posterEmail: '', posterPhone: ''
    })
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.itemName || !form.description || !form.location || !form.posterName) {
            toast.error('Please fill in all required fields'); return
        }
        onSubmit(form)
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Type toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button type="button" className={`btn btn-sm ${form.type === 'lost' ? 'btn-amber' : 'btn-ghost'}`} onClick={() => set('type', 'lost')}>🔍 I Lost Something</button>
                <button type="button" className={`btn btn-sm ${form.type === 'found' ? 'btn-green' : 'btn-ghost'}`} onClick={() => set('type', 'found')}>✅ I Found Something</button>
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Item Name <span className="required">*</span></label>
                    <input className="form-input" placeholder="e.g. Blue Backpack" value={form.itemName} onChange={e => set('itemName', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                    </select>
                </div>
                <div className="form-group full">
                    <label className="form-label">Description <span className="required">*</span></label>
                    <textarea className="form-textarea" rows={3} placeholder="Describe the item, distinguishing features..." value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Location <span className="required">*</span></label>
                    <input className="form-input" placeholder="e.g. Library, 2nd floor" value={form.location} onChange={e => set('location', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" type="date" value={form.dateLostFound} onChange={e => set('dateLostFound', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Your Name <span className="required">*</span></label>
                    <input className="form-input" placeholder="Full name" value={form.posterName} onChange={e => set('posterName', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="you@university.edu" value={form.posterEmail} onChange={e => set('posterEmail', e.target.value)} />
                </div>
                <div className="form-group full">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+91 98765 43210" value={form.posterPhone} onChange={e => set('posterPhone', e.target.value)} />
                </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="submit" className={`btn ${form.type === 'lost' ? 'btn-amber' : 'btn-green'}`} disabled={loading}>
                    {loading ? 'Posting...' : <><Plus size={16} /> Post Item</>}
                </button>
            </div>
        </form>
    )
}

export default function LostFoundPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [showModal, setModal] = useState(false)
    const [typeFilter, setType] = useState('all')
    const [catFilter, setCat] = useState('all')
    const [search, setSearch] = useState('')

    const fetchItems = useCallback(async () => {
        setLoading(true)
        try {
            const params = { status: 'all' }
            if (typeFilter !== 'all') params.type = typeFilter
            if (catFilter !== 'all') params.category = catFilter
            if (search) params.search = search
            const res = await getLostFound(params)
            setItems(res.data.data)
        } catch { toast.error('Failed to load items') }
        finally { setLoading(false) }
    }, [typeFilter, catFilter, search])

    useEffect(() => { fetchItems() }, [fetchItems])

    useEffect(() => {
        const handler = (e) => { if (e.detail === 'lostfound') setModal(true) }
        window.addEventListener('open-post', handler)
        return () => window.removeEventListener('open-post', handler)
    }, [])

    const handlePost = async (data) => {
        setPosting(true)
        try {
            await createLostFound(data)
            toast.success('Item posted! 🙌')
            setModal(false)
            fetchItems()
        } catch { toast.error('Failed to post item') }
        finally { setPosting(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return
        try { await deleteLostFound(id); toast.success('Deleted'); fetchItems() }
        catch { toast.error('Failed to delete') }
    }

    const handleResolve = async (id) => {
        try { await updateLFStatus(id, 'resolved'); toast.success('Marked as resolved ✅'); fetchItems() }
        catch { toast.error('Failed to update') }
    }

    return (
        <main className="page-section">
            <div className="container">
                <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div className="section-badge amber"><Search size={13} /> Lost &amp; Found</div>
                        <h1 className="section-title">Lost &amp; Found Board</h1>
                        <p className="section-sub">Help reunite people with their belongings — report lost or found items.</p>
                    </div>
                    <button className="btn btn-amber" onClick={() => setModal(true)}><Plus size={16} /> Post Item</button>
                </div>

                <div className="toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." />
                    </div>
                    <div className="filter-group">
                        {['all', 'lost', 'found'].map(t => (
                            <button key={t} onClick={() => setType(t)}
                                className={`filter-chip ${typeFilter === t ? (t === 'lost' ? 'active-amber' : t === 'found' ? 'active-green' : 'active') : ''}`}>
                                {t === 'all' ? 'All' : t === 'lost' ? '🔍 Lost' : '✅ Found'}
                            </button>
                        ))}
                    </div>
                    <div className="filter-group">
                        {CATEGORIES.slice(0, 6).map(c => (
                            <button key={c} className={`filter-chip${catFilter === c ? ' active' : ''}`} onClick={() => setCat(c)}>
                                {c === 'all' ? 'All Categories' : CAT_LABELS[c]}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-grid">{Array(6).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}</div>
                ) : items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Search size={32} /></div>
                        <h3>Nothing here yet</h3>
                        <p>Help the community — post a lost or found item!</p>
                        <button className="btn btn-amber" onClick={() => setModal(true)}><Plus size={16} /> Post Item</button>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {items.map(item => <LFCard key={item._id} item={item} onDelete={handleDelete} onResolve={handleResolve} />)}
                    </div>
                )}
            </div>

            {showModal && (
                <Modal title="📦 Post Lost or Found Item" onClose={() => setModal(false)}>
                    <PostLFForm onSubmit={handlePost} loading={posting} />
                </Modal>
            )}
        </main>
    )
}
