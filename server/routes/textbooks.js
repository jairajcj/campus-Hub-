const express = require('express');
const router = express.Router();
const Textbook = require('../models/Textbook');

// GET all textbooks
router.get('/', async (req, res) => {
    try {
        const { category, condition, search, minPrice, maxPrice, sold, sort = 'newest', page = 1, limit = 12 } = req.query;
        const query = {};
        if (category && category !== 'all') query.category = category;
        if (condition && condition !== 'all') query.condition = condition;
        if (sold !== undefined) query.sold = sold === 'true';
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
        ];

        const sortOption = sort === 'price-asc' ? { price: 1 }
            : sort === 'price-desc' ? { price: -1 }
                : { createdAt: -1 };

        const total = await Textbook.countDocuments(query);
        const books = await Textbook.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ success: true, data: books, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single textbook
router.get('/:id', async (req, res) => {
    try {
        const book = await Textbook.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create textbook listing
router.post('/', async (req, res) => {
    try {
        const book = await Textbook.create(req.body);
        res.status(201).json({ success: true, data: book });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PATCH mark as sold
router.patch('/:id/sold', async (req, res) => {
    try {
        const book = await Textbook.findByIdAndUpdate(req.params.id, { sold: true }, { new: true });
        res.json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE textbook
router.delete('/:id', async (req, res) => {
    try {
        await Textbook.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
