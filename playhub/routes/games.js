const express = require('express');
const multer = require('multer');
const path = require('path');
const Game = require('../models/Game');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/games/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// List games
router.get('/', async (req, res) => {
  const games = await Game.find().populate('uploadedBy', 'username');
  res.render('games/index', { games, user: req.session.user });
});

// Upload game
router.get('/upload', requireAuth, (req, res) => {
  res.render('games/upload', { user: req.session.user });
});

router.post('/upload', requireAuth, upload.single('gameFile'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const game = new Game({
      title,
      description,
      uploadedBy: req.session.user._id,
      filePath: req.file.filename,
    });
    await game.save();
    req.flash('success', 'Game uploaded successfully!');
    res.redirect('/games');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/games/upload');
  }
});

// Play game
router.get('/:id/play', async (req, res) => {
  const game = await Game.findById(req.params.id).populate('uploadedBy', 'username');
  if (!game) return res.status(404).send('Game not found');
  res.render('games/play', { game, user: req.session.user });
});

// Delete game
router.delete('/:id/delete', requireAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.uploadedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Game.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit game routes
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).send('Game not found');
    if (game.uploadedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }
    res.render('games/edit', { game, user: req.session.user });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id/edit', requireAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.uploadedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const { title, description } = req.body;
    await Game.findByIdAndUpdate(req.params.id, { title, description });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;