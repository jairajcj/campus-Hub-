const express = require('express');
const router = express.Router();
const News = require('../models/News');

// GET all news (with optional category & search filters)
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;
        const query = {};
        if (category && category !== 'all') query.category = category;
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
        ];
        const total = await News.countDocuments(query);
        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ success: true, data: news, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single news post
router.get('/:id', async (req, res) => {
    try {
        const post = await News.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create news
router.post('/', async (req, res) => {
    try {
        const post = await News.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE news post
router.delete('/:id', async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
