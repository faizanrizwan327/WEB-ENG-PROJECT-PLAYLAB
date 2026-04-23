const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true }, // path to the game file
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Game', gameSchema);