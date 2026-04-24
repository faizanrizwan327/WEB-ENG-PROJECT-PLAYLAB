const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true });

favoriteSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
