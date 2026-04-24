// Additional Professional Features - Ratings, Favorites, Dark Mode, Fullscreen, Share

// ==================== DARK MODE ====================
function initializeDarkMode() {
  const savedTheme = localStorage.getItem('playhub-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateDarkModeIcon(true);
  }
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('playhub-theme', 'light');
    updateDarkModeIcon(false);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('playhub-theme', 'dark');
    updateDarkModeIcon(true);
  }
}

function updateDarkModeIcon(isDark) {
  const toggles = document.querySelectorAll('.dark-mode-toggle i');
  toggles.forEach(icon => {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  });
}

// ==================== FULLSCREEN ====================
function toggleFullscreen() {
  const container = document.querySelector('.game-frame-container');
  const iframe = document.querySelector('.game-iframe');
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen?.().then(() => {
      container.classList.add('fullscreen-active');
      if (iframe) iframe.style.minHeight = '100vh';
      showToast('Press ESC or F to exit fullscreen', 'info');
    }).catch(err => {
      console.error('Fullscreen error:', err);
    });
  } else {
    document.exitFullscreen?.();
    container.classList.remove('fullscreen-active');
    if (iframe) iframe.style.minHeight = '';
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
    const container = document.querySelector('.game-frame-container');
    const iframe = document.querySelector('.game-iframe');
    container?.classList.remove('fullscreen-active');
    if (iframe) iframe.style.minHeight = '';
  }
}

// ==================== COPY LINK ====================
function copyGameLink() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Game link copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Game link copied to clipboard!', 'success');
  } catch {
    showToast('Failed to copy link', 'error');
  }
  document.body.removeChild(textarea);
}

// ==================== SHARE BUTTONS ====================
function shareTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(document.title);
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(document.title);
  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function shareNative() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    }).catch(() => {});
  } else {
    copyGameLink();
  }
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  const iconClass = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
  toast.innerHTML = `
    <i class="fas ${iconClass}" style="font-size: 1.2rem;"></i>
    <span style="font-weight: 500;">${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== KEYBOARD SHORTCUTS ====================
function showShortcutsHelp() {
  const modalHtml = `
    <div class="modal fade" id="shortcutsModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold"><i class="fas fa-keyboard me-2"></i>Keyboard Shortcuts</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body shortcuts-modal">
            <div class="shortcut-row">
              <span>Toggle Fullscreen</span>
              <span class="shortcut-key">F</span>
            </div>
            <div class="shortcut-row">
              <span>Exit Fullscreen</span>
              <span class="shortcut-key">ESC</span>
            </div>
            <div class="shortcut-row">
              <span>Copy Game Link</span>
              <span class="shortcut-key">Ctrl + C</span>
            </div>
            <div class="shortcut-row">
              <span>Toggle Dark Mode</span>
              <span class="shortcut-key">Ctrl + D</span>
            </div>
            <div class="shortcut-row">
              <span>Show this Help</span>
              <span class="shortcut-key">?</span>
            </div>
            <div class="shortcut-row">
              <span>Focus Search</span>
              <span class="shortcut-key">Ctrl + K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  let modalEl = document.getElementById('shortcutsModal');
  if (!modalEl) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper.firstElementChild);
    modalEl = document.getElementById('shortcutsModal');
  }

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ignore if inside input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();

    // F = Fullscreen
    if (key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      toggleFullscreen();
      return;
    }

    // ESC = Exit fullscreen
    if (key === 'escape') {
      exitFullscreen();
      return;
    }

    // ? = Show shortcuts help
    if (key === '?' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      showShortcutsHelp();
      return;
    }

    // Ctrl+D = Dark mode
    if ((e.ctrlKey || e.metaKey) && key === 'd') {
      e.preventDefault();
      toggleDarkMode();
      return;
    }

    // Ctrl+Shift+C = Copy link
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'c') {
      e.preventDefault();
      copyGameLink();
      return;
    }
  });
}

// ==================== RATING SYSTEM ====================
function initializeRatingSystem() {
  // New interactive star rating system
  const stars = document.querySelectorAll('.star-rating');
  const ratingInput = document.getElementById('ratingInput');
  const ratingText = document.getElementById('ratingText');
  
  if (!stars.length) return;

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-rating');
      ratingInput.value = rating;
      
      // Update stars display
      stars.forEach((s, idx) => {
        if (idx < rating) {
          s.classList.add('active');
          s.querySelector('i').classList.remove('far');
          s.querySelector('i').classList.add('fas');
        } else {
          s.classList.remove('active');
          s.querySelector('i').classList.add('far');
          s.querySelector('i').classList.remove('fas');
        }
      });
      
      // Update text feedback
      const ratingTexts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      if (ratingText) {
        ratingText.textContent = `${ratingTexts[rating]} (${rating}/5)`;
        ratingText.style.color = '#fbbf24';
        ratingText.style.fontWeight = '600';
      }
    });

    // Hover effect
    star.addEventListener('mouseenter', () => {
      const rating = star.getAttribute('data-rating');
      stars.forEach((s, idx) => {
        if (idx < rating) {
          s.style.opacity = '1';
          s.style.transform = 'scale(1.2) rotate(-5deg)';
        } else {
          s.style.opacity = '0.4';
        }
      });
    });
  });

  // Reset on mouse leave
  const starsContainer = document.querySelector('.rating-stars-interactive');
  if (starsContainer) {
    starsContainer.addEventListener('mouseleave', () => {
      stars.forEach(s => {
        s.style.opacity = '1';
        if (!s.classList.contains('active')) {
          s.style.transform = 'scale(1)';
        }
      });
    });
  }

  // Legacy support for old rating-stars class
  const legacyStars = document.querySelectorAll('.rating-stars .star');
  const legacyRatingInput = document.getElementById('ratingInput');
  
  if (legacyStars.length) {
    legacyStars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = star.getAttribute('data-rating');
        legacyRatingInput.value = rating;
        legacyStars.forEach(s => {
          if (s.getAttribute('data-rating') <= rating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });
  }
}

// ==================== FAVORITE SYSTEM ====================
async function toggleFavorite(gameId) {
  try {
    const response = await fetch(`/games/${gameId}/favorite`, { method: 'POST' });
    const data = await response.json();
    
    if (response.ok) {
      const btn = document.querySelector('.favorite-btn');
      if (data.favorited) {
        btn.classList.add('favorited');
        btn.innerHTML = '<i class="fas fa-heart me-2"></i>Added to Favorites';
        showToast('Added to favorites!', 'success');
      } else {
        btn.classList.remove('favorited');
        btn.innerHTML = '<i class="fas fa-heart me-2"></i>Add to Favorites';
        showToast('Removed from favorites', 'info');
      }
    }
  } catch (err) {
    showToast('Error updating favorites: ' + err, 'error');
  }
}

// ==================== SUBMIT RATING ====================
async function submitRating(gameId) {
  try {
    const rating = document.getElementById('ratingInput').value;
    const review = document.getElementById('reviewInput').value;
    
    if (!rating) {
      showToast('Please select a rating', 'warning');
      return;
    }
    
    const response = await fetch(`/games/${gameId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, review })
    });
    
    const data = await response.json();
    if (response.ok) {
      showToast('Rating submitted successfully!', 'success');
      setTimeout(() => location.reload(), 1500);
    } else {
      showToast(data.error || 'Failed to submit rating', 'error');
    }
  } catch (err) {
    showToast('Error submitting rating: ' + err, 'error');
  }
}

// ==================== RATING DISTRIBUTION ====================
function initializeRatingDistribution(ratings) {
  if (!ratings || !ratings.length) return;
  const container = document.getElementById('ratingDistribution');
  if (!container) return;

  const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
  ratings.forEach(r => counts[r.rating]++);
  const total = ratings.length;

  let html = '';
  for (let i = 5; i >= 1; i--) {
    const pct = Math.round((counts[i] / total) * 100);
    html += `
      <div class="rating-bar">
        <span class="rating-bar-label">${i} <i class="fas fa-star" style="font-size:0.7rem; color:#fbbf24;"></i></span>
        <div class="rating-bar-track">
          <div class="rating-bar-fill" style="width: ${pct}%"></div>
        </div>
        <span class="rating-bar-count">${counts[i]}</span>
      </div>
    `;
  }
  container.innerHTML = html;
}

// ==================== INITIALIZE ALL ====================
document.addEventListener('DOMContentLoaded', function() {
  initializeDarkMode();
  initializeRatingSystem();
  initializeKeyboardShortcuts();

  // Init rating distribution if data available
  if (typeof window.gameRatings !== 'undefined') {
    initializeRatingDistribution(window.gameRatings);
  }
});

// ==================== EXPAND REVIEWS ====================
function expandReviews() {
  const reviewCards = document.querySelectorAll('.review-card');
  const expandBtn = event.target.closest('[onclick="expandReviews()"]');
  
  reviewCards.forEach((card, idx) => {
    if (idx >= 6) {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.5s ease';
    }
  });

  if (expandBtn) {
    expandBtn.style.display = 'none';
  }
}
