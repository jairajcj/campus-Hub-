import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, X, Plus, Newspaper, Search, BookOpen } from 'lucide-react'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => { setMenuOpen(false) }, [location])

    return (
        <nav className="navbar">
            <div className="container nav-inner">
                <NavLink to="/" className="nav-logo">
                    🎓 CampusHub
                </NavLink>

                <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
                    <li><NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>Home</NavLink></li>
                    <li><NavLink to="/news" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>News</NavLink></li>
                    <li><NavLink to="/lostfound" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Lost & Found</NavLink></li>
                    <li><NavLink to="/textbooks" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Textbooks</NavLink></li>
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
                        <Plus size={15} /> Create Post
                    </button>
                    <button className="nav-toggle btn" style={{ marginLeft: '12px', display: 'none' }} onClick={() => setMenuOpen(o => !o)}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}
