import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="nav-logo" style={{ marginBottom: '0.5rem' }}>
                            <div className="logo-icon"><GraduationCap size={18} color="#fff" /></div>
                            Campus<span className="logo-accent">Hub</span>
                        </div>
                        <p>Your digital campus community — connecting students through news, lost &amp; found, and textbook exchanges.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Navigate</h4>
                        <Link to="/">Home</Link>
                        <Link to="/news">Campus News</Link>
                        <Link to="/lostfound">Lost &amp; Found</Link>
                        <Link to="/textbooks">Textbooks</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Community</h4>
                        <Link to="/news">Post News</Link>
                        <Link to="/lostfound">Report Lost Item</Link>
                        <Link to="/lostfound">Post Found Item</Link>
                        <Link to="/textbooks">Sell a Textbook</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} CampusHub. Built by students, for students. ❤️</p>
                </div>
            </div>
        </footer>
    )
}
