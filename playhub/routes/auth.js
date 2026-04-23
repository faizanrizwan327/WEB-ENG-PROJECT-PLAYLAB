const express = require('express');
const User = require('../models/User');
const Game = require('../models/Game');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Register
router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    req.session.user = user;
    req.flash('success', 'Registration successful! Welcome to PlayHub.');
    res.redirect('/');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/auth/register');
  }
});

// Login
router.get('/login', (req, res) => {
  const logoutMessage = req.query.logout === '1' ? 'You have logged out successfully.' : null;
  res.render('auth/login', { logoutMessage });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }
    req.session.user = user;
    req.flash('success', `Welcome back, ${user.username}!`);
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/auth/login');
  }
});

// Profile
router.get('/profile', requireAuth, async (req, res) => {
  const userGames = await Game.find({ uploadedBy: req.session.user._id });
  res.render('auth/profile', { userGames });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login?logout=1');
  });
});

module.exports = router;