const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  category: { type: String, enum: ['Puzzle', 'Action', 'Adventure', 'Strategy', 'Casual', 'Educational'], default: 'Casual' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Extreme'], default: 'Medium' },
  avgPlayTime: { type: Number, default: 0 }, // in minutes
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  tags: [String],
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);