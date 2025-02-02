const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    stars: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, maxlength: 1000 },
});

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    contact: { type: String, required: true },
    password: {type: String, required: true },
    cart_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    reviews: [reviewSchema]
});

module.exports = mongoose.model('User', userSchema);