const express = require('express');
const multer = require('multer');
const path = require('path');
const Game = require('../models/Game');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Favorite = require('../models/Favorite');
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

// List games with search, filter, sort, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, sort = 'newest', page = 1 } = req.query;
    const limit = 9;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    let sortOrder = { createdAt: -1 };
    if (sort === 'popular') sortOrder = { views: -1 };
    if (sort === 'rating') sortOrder = { avgRating: -1 };

    const totalGames = await Game.countDocuments(filter);
    const games = await Game.find(filter)
      .populate('uploadedBy', 'username')
      .sort(sortOrder)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalGames / limit);

    res.render('games/index', {
      games,
      search: search || '',
      category: category || 'all',
      sort,
      page,
      totalPages,
      user: req.session.user
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/');
  }
});

// Upload game
router.get('/upload', requireAuth, (req, res) => {
  res.render('games/upload', { user: req.session.user });
});

router.post('/upload', requireAuth, upload.single('gameFile'), async (req, res) => {
  try {
    const { title, description, category, tags, difficulty, avgPlayTime } = req.body;
    const game = new Game({
      title,
      description,
      category: category || 'Casual',
      difficulty: difficulty || 'Medium',
      avgPlayTime: avgPlayTime ? parseInt(avgPlayTime) : 0,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      uploadedBy: req.session.user._id,
      filePath: req.file.filename,
    });
    await game.save();
    await User.findByIdAndUpdate(req.session.user._id, { $inc: { totalGamesUploaded: 1 } });
    req.flash('success', 'Game uploaded successfully!');
    res.redirect('/games');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/games/upload');
  }
});

// Play game (increment view count)
router.get('/:id/play', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploadedBy', 'username');

    if (!game) return res.status(404).send('Game not found');

    const ratings = await Rating.find({ game: req.params.id }).populate('user', 'username');
    const isFavorited = req.session.user ? await Favorite.findOne({ game: req.params.id, user: req.session.user._id }) : false;

    res.render('games/play', {
      game,
      ratings,
      isFavorited: !!isFavorited,
      user: req.session.user
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
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
    await Rating.deleteMany({ game: req.params.id });
    await Favorite.deleteMany({ game: req.params.id });
    await User.findByIdAndUpdate(req.session.user._id, { $inc: { totalGamesUploaded: -1 } });
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
    const { title, description, category, tags, difficulty, avgPlayTime } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category || 'Casual';
    if (difficulty !== undefined) updateData.difficulty = difficulty || 'Medium';
    if (avgPlayTime !== undefined) updateData.avgPlayTime = avgPlayTime ? parseInt(avgPlayTime) : 0;
    if (tags !== undefined) updateData.tags = tags ? tags.split(',').map(t => t.trim()) : [];
    await Game.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rate a game
router.post('/:id/rate', requireAuth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const existingRating = await Rating.findOne({
      game: req.params.id,
      user: req.session.user._id
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
    } else {
      const newRating = new Rating({
        game: req.params.id,
        user: req.session.user._id,
        rating,
        review
      });
      await newRating.save();
    }

    const allRatings = await Rating.find({ game: req.params.id });
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await Game.findByIdAndUpdate(req.params.id, {
      avgRating: Math.round(avgRating * 10) / 10,
      ratingCount: allRatings.length
    });

    res.json({ success: true, avgRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to favorites
router.post('/:id/favorite', requireAuth, async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      game: req.params.id,
      user: req.session.user._id
    });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      res.json({ favorited: false });
    } else {
      const favorite = new Favorite({
        game: req.params.id,
        user: req.session.user._id
      });
      await favorite.save();
      res.json({ favorited: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user favorites
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.session.user._id })
      .populate({
        path: 'game',
        populate: { path: 'uploadedBy', select: 'username' }
      })
      .sort({ addedAt: -1 });

    res.render('games/favorites', { favorites, user: req.session.user });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/games');
  }
});

module.exports = router;
