const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
