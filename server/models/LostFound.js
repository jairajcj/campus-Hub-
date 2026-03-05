const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    type: { type: String, enum: ['lost', 'found'], required: true },
    itemName: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: ['electronics', 'id-cards', 'keys', 'bags', 'books', 'clothing', 'jewelry', 'sports', 'stationery', 'other'],
        default: 'other'
    },
    description: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    dateLostFound: { type: Date, required: true },
    posterName: { type: String, required: true, trim: true },
    posterEmail: { type: String, trim: true, lowercase: true },
    posterPhone: { type: String, trim: true },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);
