// Professional JavaScript for PlayHub

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeAnimations();
  initializeFormValidation();
  initializeLoadingStates();
  initializeScrollEffects();
  initializeAlerts();
});

// Animation initialization
function initializeAnimations() {
  // Add fade-in animation to elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe elements that should animate in
  document.querySelectorAll('.card, .alert, .hero h1, .hero p, .hero .btn').forEach(el => {
    observer.observe(el);
  });
}

// Form validation
function initializeFormValidation() {
  // Registration form validation
  const registerForm = document.querySelector('form[action="/auth/register"]');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const password = document.getElementById('password').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;

      // Username validation
      if (username.length < 3) {
        e.preventDefault();
        showAlert('Username must be at least 3 characters long.', 'danger');
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        e.preventDefault();
        showAlert('Please enter a valid email address.', 'danger');
        return false;
      }

      // Password validation
      if (password.length < 6) {
        e.preventDefault();
        showAlert('Password must be at least 6 characters long.', 'danger');
        return false;
      }
    });
  }

  // Login form validation
  const loginForm = document.querySelector('form[action="/auth/login"]');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        e.preventDefault();
        showAlert('Please fill in all fields.', 'warning');
        return false;
      }
    });
  }

  // Upload form validation
  const uploadForm = document.querySelector('form[action="/games/upload"]');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
      const title = document.getElementById('title').value;
      const file = document.getElementById('gameFile').files[0];

      if (!title.trim()) {
        e.preventDefault();
        showAlert('Please enter a game title.', 'warning');
        return false;
      }

      if (!file) {
        e.preventDefault();
        showAlert('Please select a game file.', 'warning');
        return false;
      }

      if (!file.name.endsWith('.html')) {
        e.preventDefault();
        showAlert('Please select an HTML file.', 'danger');
        return false;
      }
    });
  }
}

// Loading states
function initializeLoadingStates() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';

        // Re-enable after 10 seconds as fallback
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 10000);
      }
    });
  });
}

// Scroll effects
function initializeScrollEffects() {
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow on scroll
    if (scrollTop > 10) {
      navbar.classList.add('shadow-sm');
    } else {
      navbar.classList.remove('shadow-sm');
    }

    lastScrollTop = scrollTop;
  });
}

// Alert system
function initializeAlerts() {
  // Auto-dismiss alerts after 5 seconds
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    });
  }, 5000);
}

// Custom alert function
function showAlert(message, type = 'info') {
  const alertContainer = document.createElement('div');
  alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  alertContainer.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  document.body.appendChild(alertContainer);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertContainer.parentNode) {
      alertContainer.remove();
    }
  }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add loading animation to page transitions
window.addEventListener('beforeunload', function() {
  document.body.style.opacity = '0.5';
});

// Game iframe handling
const gameIframe = document.querySelector('.game-iframe');
if (gameIframe) {
  gameIframe.addEventListener('load', function() {
    // Add loading complete indicator
    this.style.opacity = '1';
  });

  // Add loading state
  gameIframe.style.opacity = '0';
  gameIframe.style.transition = 'opacity 0.3s ease';
}

// Form field enhancements
document.querySelectorAll('.form-control').forEach(input => {
  // Add focus effects
  input.addEventListener('focus', function() {
    this.parentNode.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    this.parentNode.classList.remove('focused');
  });

  // Auto-resize textareas
  if (input.tagName === 'TEXTAREA') {
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = e.offsetX + 'px';
    ripple.style.top = e.offsetY + 'px';
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K for search (if search exists)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Escape to close modals
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      bootstrap.Modal.getInstance(modal).hide();
    });
  }
});

// Performance optimization - lazy load images if any
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// Service worker registration for PWA features (if needed)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Register service worker for offline functionality (future enhancement)
    // navigator.serviceWorker.register('/sw.js');
  });
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
  showAlert('An unexpected error occurred. Please refresh the page.', 'danger');
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
  showAlert('An unexpected error occurred. Please refresh the page.', 'danger');
});