const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, maxlength: 1000 },
    categories: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ordered: { type: Boolean, default: false },
    listedAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Item', itemSchema);