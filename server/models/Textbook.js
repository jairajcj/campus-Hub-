const mongoose = require('mongoose');

const textbookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: ['engineering', 'science', 'mathematics', 'computer-science', 'arts-humanities', 'business', 'medicine', 'law', 'social-science', 'other'],
        default: 'other'
    },
    edition: { type: String, trim: true },
    condition: {
        type: String,
        enum: ['like-new', 'good', 'fair', 'poor'],
        required: true
    },
    price: { type: Number, required: true, min: 0 },
    negotiable: { type: Boolean, default: true },
    description: { type: String },
    sellerName: { type: String, required: true, trim: true },
    sellerEmail: { type: String, trim: true, lowercase: true },
    sellerPhone: { type: String, trim: true },
    imageUrl: { type: String },
    sold: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Textbook', textbookSchema);
