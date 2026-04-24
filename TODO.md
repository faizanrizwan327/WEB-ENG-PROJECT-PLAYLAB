# TODO - Comprehensive Fixes & New Functionalities

## Plan Progress
- [ ] Fix CSS bugs in `public/css/style.css`
  - [ ] Fix broken `.floating-label-group label` rule
  - [ ] Add missing `.fade-in`, `.slide-up`, `.stagger-*` animation classes
  - [ ] Add dark mode CSS variables and overrides
  - [ ] Add fullscreen, share, copy-link button styles
  - [ ] Fix `.game-frame-container` responsive height
- [ ] Add new JavaScript functionalities to `public/js/features.js`
  - [ ] Dark mode toggle with localStorage persistence
  - [ ] Fullscreen mode for game iframe
  - [ ] Copy game link to clipboard
  - [ ] Social share buttons (Twitter/X, Facebook, WhatsApp, native share)
  - [ ] Keyboard shortcuts (F=fullscreen, ?=help, ESC=exit)
- [ ] Fix defensive checks in templates
  - [ ] `views/games/index.ejs` - typeof checks for user, messages
  - [ ] `views/games/favorites.ejs` - typeof checks for user, messages
- [ ] Update `views/games/play.ejs` with new features
  - [ ] Fullscreen button
  - [ ] Copy link button
  - [ ] Share buttons
  - [ ] Keyboard shortcuts help modal
  - [ ] Dark mode toggle in navbar
- [ ] Update `views/index.ejs` with dark mode toggle
- [ ] Restart server and test all features

