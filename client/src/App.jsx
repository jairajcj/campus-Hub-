import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import NewsPage from './pages/NewsPage'
import LostFoundPage from './pages/LostFoundPage'
import TextbooksPage from './pages/TextbooksPage'

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/lostfound" element={<LostFoundPage />} />
                <Route path="/textbooks" element={<TextbooksPage />} />
            </Routes>
            <Footer />
        </>
    )
}
