import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Search, Plus, BookOpen, IndianRupee, User, Phone, Mail, Trash2, CheckSquare } from 'lucide-react'
import { getTextbooks, createTextbook, deleteTextbook, markSold } from '../api'
import Modal from '../components/Modal'

const CATEGORIES = ['all', 'engineering', 'science', 'mathematics', 'computer-science', 'arts-humanities', 'business', 'medicine', 'law', 'social-science', 'other']
const CAT_LABELS = {
    'engineering': 'Engineering', 'science': 'Science', 'mathematics': 'Mathematics',
    'computer-science': 'Comp. Science', 'arts-humanities': 'Arts & Humanities',
    'business': 'Business', 'medicine': 'Medicine', 'law': 'Law', 'social-science': 'Social Science', 'other': 'Other'
}
const CONDITIONS = ['all', 'like-new', 'good', 'fair', 'poor']
const COND_LABELS = { 'like-new': 'Like New', 'good': 'Good', 'fair': 'Fair', 'poor': 'Poor' }
const COND_CLASS = { 'like-new': 'condition-like-new', 'good': 'condition-good', 'fair': 'condition-fair', 'poor': 'condition-poor' }

function ContactModal({ book, onClose }) {
    return (
        <Modal title={`Contact Seller — ${book.sellerName}`} onClose={onClose}>
            <div className="contact-modal-content">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Reach out directly to the seller for <strong style={{ color: 'var(--text)' }}>{book.title}</strong> by {book.author}.
                </p>
                {book.sellerEmail && (
                    <div className="contact-info-block">
                        <div className="contact-icon-wrap primary"><Mail size={18} /></div>
                        <div>
                            <h4>Email</h4>
                            <p><a href={`mailto:${book.sellerEmail}`} style={{ color: 'var(--primary-light)' }}>{book.sellerEmail}</a></p>
                        </div>
                    </div>
                )}
                {book.sellerPhone && (
                    <div className="contact-info-block">
                        <div className="contact-icon-wrap green"><Phone size={18} /></div>
                        <div>
                            <h4>Phone / WhatsApp</h4>
                            <p>{book.sellerPhone}</p>
                        </div>
                    </div>
                )}
                {!book.sellerEmail && !book.sellerPhone && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No contact info provided by the seller.</p>
                )}
            </div>
        </Modal>
    )
}

function TextbookCard({ book, onDelete, onMarkSold, onContact }) {
    return (
        <div className="card fade-in" style={{ position: 'relative' }}>
            {book.sold && (
                <div className="book-sold-overlay">
                    <div className="sold-badge">SOLD</div>
                </div>
            )}
            <div className="card-header">
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className={`tag ${COND_CLASS[book.condition]}`}>{COND_LABELS[book.condition]}</span>
                    <span className="tag tag-gray">{CAT_LABELS[book.category] || book.category}</span>
                </div>
                <button className="btn btn-icon btn-ghost" style={{ color: 'var(--rose)', opacity: 0.7 }}
                    onClick={() => onDelete(book._id)} title="Delete"><Trash2 size={14} /></button>
            </div>
            <div className="card-body">
                <h3 className="card-title" style={{ marginBottom: '0.2rem' }}>{book.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>by {book.author}</p>
                {book.edition && <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginBottom: '0.5rem' }}>Edition: {book.edition}</p>}
                {book.description && <p className="card-desc">{book.description}</p>}
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="price-tag">₹{book.price}</span>
                    {book.negotiable && <span className="tag tag-cyan">Negotiable</span>}
                </div>
            </div>
            <div className="card-footer">
                <span className="card-meta"><User size={12} />{book.sellerName}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!book.sold && (
                        <>
                            <button className="btn btn-green btn-sm" onClick={() => onContact(book)}>
                                <Phone size={13} /> Contact
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => onMarkSold(book._id)} title="Mark as sold">
                                <CheckSquare size={13} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function PostTextbookForm({ onSubmit, loading }) {
    const [form, setForm] = useState({
        title: '', author: '', subject: '', category: 'other', edition: '',
        condition: 'good', price: '', negotiable: true, description: '',
        sellerName: '', sellerEmail: '', sellerPhone: ''
    })
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.title || !form.author || !form.subject || !form.price || !form.sellerName) {
            toast.error('Please fill in all required fields'); return
        }
        onSubmit({ ...form, price: Number(form.price) })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-grid">
                <div className="form-group full">
                    <label className="form-label">Book Title <span className="required">*</span></label>
                    <input className="form-input" placeholder="e.g. Introduction to Algorithms" value={form.title} onChange={e => set('title', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Author <span className="required">*</span></label>
                    <input className="form-input" placeholder="e.g. Thomas H. Cormen" value={form.author} onChange={e => set('author', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Subject / Course <span className="required">*</span></label>
                    <input className="form-input" placeholder="e.g. Data Structures" value={form.subject} onChange={e => set('subject', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Edition</label>
                    <input className="form-input" placeholder="e.g. 3rd Edition" value={form.edition} onChange={e => set('edition', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Condition <span className="required">*</span></label>
                    <select className="form-select" value={form.condition} onChange={e => set('condition', e.target.value)}>
                        {CONDITIONS.filter(c => c !== 'all').map(c => <option key={c} value={c}>{COND_LABELS[c]}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Price (₹) <span className="required">*</span></label>
                    <input className="form-input" type="number" min="0" placeholder="e.g. 250" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div className="form-group" style={{ justifyContent: 'flex-end', paddingTop: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={form.negotiable} onChange={e => set('negotiable', e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                        Price is negotiable
                    </label>
                </div>
                <div className="form-group full">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" rows={2} placeholder="Condition details, notes, highlights, etc." value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Your Name <span className="required">*</span></label>
                    <input className="form-input" placeholder="Full name" value={form.sellerName} onChange={e => set('sellerName', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="you@university.edu" value={form.sellerEmail} onChange={e => set('sellerEmail', e.target.value)} />
                </div>
                <div className="form-group full">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="+91 98765 43210" value={form.sellerPhone} onChange={e => set('sellerPhone', e.target.value)} />
                </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-green" disabled={loading}>
                    {loading ? 'Listing...' : <><Plus size={16} /> List Textbook</>}
                </button>
            </div>
        </form>
    )
}

const MOCK_BOOKS = [
    { _id: '1', title: 'Data Structures and Algorithms', author: 'Cormen et al.', category: 'computer-science', condition: 'good', price: 450, negotiable: true, sellerName: 'Amit Shah', sold: false, createdAt: new Date().toISOString() },
    { _id: '2', title: 'Calculus: Early Transcendentals', author: 'James Stewart', category: 'mathematics', condition: 'like-new', price: 800, negotiable: false, sellerName: 'Sneha R.', sold: false, createdAt: new Date().toISOString() },
    { _id: '3', title: 'Engineering Circuit Analysis', author: 'Hayt & Kemmerly', category: 'engineering', condition: 'poor', price: 200, negotiable: true, sellerName: 'John Doe', sold: true, createdAt: new Date().toISOString() }
]

export default function TextbooksPage() {
    const [books, setBooks] = useState(MOCK_BOOKS)
    const [loading, setLoading] = useState(false)
    const [posting, setPosting] = useState(false)
    const [showModal, setModal] = useState(false)
    const [contactBook, setContact] = useState(null)
    const [category, setCategory] = useState('all')
    const [condition, setCond] = useState('all')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('newest')

    const fetchBooks = useCallback(async () => {
        try {
            const params = { sort }
            if (category !== 'all') params.category = category
            if (condition !== 'all') params.condition = condition
            if (search) params.search = search
            const res = await getTextbooks(params)
            if (res.data?.data && res.data.data.length > 0) {
                setBooks(res.data.data)
            }
        } catch { console.log('Using offline Books data') }
    }, [category, condition, search, sort])

    useEffect(() => { fetchBooks() }, [fetchBooks])

    useEffect(() => {
        const handler = (e) => { if (e.detail === 'textbook') setModal(true) }
        window.addEventListener('open-post', handler)
        return () => window.removeEventListener('open-post', handler)
    }, [])

    const handlePost = async (data) => {
        setPosting(true)
        try {
            await createTextbook(data)
            toast.success('Book listed successfully! 📚')
            setModal(false)
            fetchBooks()
        } catch {
            const newBook = { ...data, _id: Date.now().toString(), sold: false, createdAt: new Date().toISOString() }
            setBooks(prev => [newBook, ...prev])
            toast.success('Book listed! (Demo Mode) 📚')
            setModal(false)
        }
        finally { setPosting(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Remove this listing?')) return
        try { await deleteTextbook(id); toast.success('Listing removed'); fetchBooks() }
        catch {
            setBooks(prev => prev.filter(b => b._id !== id))
            toast.success('Removed (Demo Mode)')
        }
    }

    const handleMarkSold = async (id) => {
        try { await markSold(id); toast.success('Marked as sold!'); fetchBooks() }
        catch {
            setBooks(prev => prev.map(b => b._id === id ? { ...b, sold: true } : b))
            toast.success('Marked SOLD (Demo Mode)')
        }
    }

    return (
        <main className="page-section">
            <div className="container">
                <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div className="section-badge green"><BookOpen size={13} /> Textbooks</div>
                        <h1 className="section-title">Used Textbook Market</h1>
                        <p className="section-sub">Buy and sell used textbooks with fellow students. Filter by subject, category, and condition.</p>
                    </div>
                    <button className="btn btn-green" onClick={() => setModal(true)}><Plus size={16} /> Sell a Book</button>
                </div>

                <div className="toolbar">
                    <div className="search-box">
                        <Search size={16} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, author, subject..." />
                    </div>
                    <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                    </select>
                </div>

                {/* Category filter */}
                <div className="filter-group" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', display: 'flex', gap: '0.4rem' }}>
                    {CATEGORIES.map(c => (
                        <button key={c} className={`filter-chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>
                            {c === 'all' ? 'All Categories' : CAT_LABELS[c]}
                        </button>
                    ))}
                </div>

                {/* Condition filter */}
                <div className="filter-group" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', display: 'flex', gap: '0.4rem' }}>
                    {CONDITIONS.map(c => (
                        <button key={c} className={`filter-chip${condition === c ? ' active' : ''}`} onClick={() => setCond(c)}>
                            {c === 'all' ? 'All Conditions' : COND_LABELS[c]}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-grid">{Array(6).fill(0).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}</div>
                ) : books.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><BookOpen size={32} /></div>
                        <h3>No textbooks listed yet</h3>
                        <p>Be the first to sell a used textbook on campus!</p>
                        <button className="btn btn-green" onClick={() => setModal(true)}><Plus size={16} /> List a Book</button>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {books.map(b => (
                            <TextbookCard key={b._id} book={b}
                                onDelete={handleDelete}
                                onMarkSold={handleMarkSold}
                                onContact={setContact} />
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <Modal title="📚 List a Used Textbook" onClose={() => setModal(false)}>
                    <PostTextbookForm onSubmit={handlePost} loading={posting} />
                </Modal>
            )}

            {contactBook && <ContactModal book={contactBook} onClose={() => setContact(null)} />}
        </main>
    )
}
