const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    persona: { type: String, required: true },
    confidence: { type: Number, required: true },
    scores: { type: Object, required: true },
    normalized: { type: Object },
    marketSegment: { type: String },
    recommendation: { type: String },
    metadata: { type: Object },
    payload: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
