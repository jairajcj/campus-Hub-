import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div style={{ marginBottom: '1.25rem', fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>ðŸŽ“ CampusHub</div>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/news" className="nav-link">News</Link>
                    <Link to="/lostfound" className="nav-link">Lost & Found</Link>
                    <Link to="/textbooks" className="nav-link">Textbooks</Link>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Â© {new Date().getFullYear()} CampusHub. The all-in-one digital hub for students.
                </p>
            </div>
        </footer>
    )
}

// Optimized for CampusHub 1.0
