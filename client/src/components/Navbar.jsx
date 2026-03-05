import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, X, Plus, Newspaper, Search, BookOpen } from 'lucide-react'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setMenuOpen(false) }, [location])

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <div className="container nav-inner">
                <NavLink to="/" className="nav-logo">
                    <div className="logo-icon"><GraduationCap size={18} color="#fff" /></div>
                    Campus<span className="logo-accent">Hub</span>
                </NavLink>

                <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
                    <li><NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>Home</NavLink></li>
                    <li><NavLink to="/news" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}><Newspaper size={14} />News</NavLink></li>
                    <li><NavLink to="/lostfound" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}><Search size={14} />Lost &amp; Found</NavLink></li>
                    <li><NavLink to="/textbooks" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}><BookOpen size={14} />Textbooks</NavLink></li>
                </ul>

                <div className="nav-actions">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                            const path = location.pathname
                            if (path === '/news') window.dispatchEvent(new CustomEvent('open-post', { detail: 'news' }))
                            else if (path === '/lostfound') window.dispatchEvent(new CustomEvent('open-post', { detail: 'lostfound' }))
                            else if (path === '/textbooks') window.dispatchEvent(new CustomEvent('open-post', { detail: 'textbook' }))
                            else window.dispatchEvent(new CustomEvent('open-post', { detail: 'news' }))
                        }}
                    >
                        <Plus size={15} /> Post
                    </button>
                    <button className="nav-toggle btn-icon btn-ghost" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}
