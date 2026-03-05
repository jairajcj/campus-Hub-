require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const newsRoutes = require('./routes/news');
const lostFoundRoutes = require('./routes/lostfound');
const textbookRoutes = require('./routes/textbooks');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/lostfound', lostFoundRoutes);
app.use('/api/textbooks', textbookRoutes);

// Stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const News = require('./models/News');
        const LostFound = require('./models/LostFound');
        const Textbook = require('./models/Textbook');
        const [newsCount, lostCount, foundCount, textbookCount] = await Promise.all([
            News.countDocuments(),
            LostFound.countDocuments({ type: 'lost', status: 'active' }),
            LostFound.countDocuments({ type: 'found', status: 'active' }),
            Textbook.countDocuments({ sold: false }),
        ]);
        res.json({ success: true, data: { newsCount, lostCount, foundCount, textbookCount } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Connect DB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });
