const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }],
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    otp: { type: String, required: true }, // or number, may change later
    PlacedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);