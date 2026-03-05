const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
        type: String,
        enum: ['announcement', 'event', 'academic', 'sports', 'cultural', 'other'],
        default: 'other'
    },
    authorName: { type: String, required: true, trim: true },
    authorEmail: { type: String, trim: true, lowercase: true },
    authorPhone: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
