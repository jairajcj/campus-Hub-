const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');

// GET all lost & found items
router.get('/', async (req, res) => {
    try {
        const { type, category, status = 'active', search, page = 1, limit = 12 } = req.query;
        const query = {};
        if (type && type !== 'all') query.type = type;
        if (category && category !== 'all') query.category = category;
        if (status && status !== 'all') query.status = status;
        if (search) query.$or = [
            { itemName: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
        ];
        const total = await LostFound.countDocuments(query);
        const items = await LostFound.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ success: true, data: items, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single item
router.get('/:id', async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create item
router.post('/', async (req, res) => {
    try {
        const item = await LostFound.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PATCH update status (resolve)
router.patch('/:id/status', async (req, res) => {
    try {
        const item = await LostFound.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE item
router.delete('/:id', async (req, res) => {
    try {
        await LostFound.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
