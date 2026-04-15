/* ============================================
   AI CRO Presentation — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const totalSlides = document.querySelectorAll('.swiper-slide').length;
  const slideCurrentEl = document.querySelector('.slide-current');
  const slideTotalEl = document.querySelector('.slide-total');
  const progressFill = document.querySelector('.progress-fill');

  // Set total slide count
  if (slideTotalEl) {
    slideTotalEl.textContent = String(totalSlides).padStart(2, '0');
  }

  // Restore last viewed slide from localStorage
  const savedSlide = parseInt(localStorage.getItem('presentation-slide') || '0', 10);

  // Initialize Swiper
  const swiper = new Swiper('.main-swiper', {
    direction: 'horizontal',
    speed: 600,
    spaceBetween: 0,
    allowTouchMove: true,
    grabCursor: true,
    initialSlide: savedSlide,

    // Keyboard navigation
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Mouse wheel (optional horizontal scroll)
    mousewheel: {
      enabled: true,
      forceToAxis: true,
    },

    // Pagination dots
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Events
    on: {
      init: function () {
        updateSlideNumber(this.activeIndex);
        updateProgress(this.activeIndex, totalSlides);
        animateSlide(this.activeIndex);
      },
      slideChange: function () {
        updateSlideNumber(this.activeIndex);
        updateProgress(this.activeIndex, totalSlides);
        animateSlide(this.activeIndex);
        localStorage.setItem('presentation-slide', this.activeIndex);
      },
    },
  });

  /**
   * Update slide number indicator
   */
  function updateSlideNumber(index) {
    if (slideCurrentEl) {
      slideCurrentEl.textContent = String(index + 1).padStart(2, '0');
    }
  }

  /**
   * Update progress bar
   */
  function updateProgress(index, total) {
    if (progressFill) {
      const percent = ((index + 1) / total) * 100;
      progressFill.style.width = percent + '%';
    }
  }

  /**
   * Animate elements within active slide
   */
  function animateSlide(index) {
    const slides = document.querySelectorAll('.swiper-slide');

    // Reset all slides' animations
    slides.forEach((slide, i) => {
      if (i !== index) {
        slide.querySelectorAll('.animate-item').forEach(item => {
          item.classList.remove('visible');
        });
      }
    });

    // Animate current slide
    const activeSlide = slides[index];
    if (!activeSlide) return;

    const items = activeSlide.querySelectorAll('.animate-item');
    items.forEach((item, i) => {
      // Small base delay + stagger
      const delay = parseInt(item.dataset.delay || '0', 10);
      const baseDelay = 100 + (delay * 150);

      setTimeout(() => {
        item.classList.add('visible');
      }, baseDelay);
    });

    // Trigger counter animation on slide 2
    if (index === 1) {
      startCounters(activeSlide);
    }
  }

  /**
   * Counter animation for stat numbers
   */
  function startCounters(slide) {
    const counters = slide.querySelectorAll('.stat-number[data-target]');

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const prefix = counter.dataset.prefix || '';
      const suffix = counter.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();

      // Reset
      counter.textContent = prefix + '0' + suffix;

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        counter.textContent = prefix + current.toLocaleString('ru-RU') + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      // Delay start slightly for visual effect
      setTimeout(() => {
        requestAnimationFrame(updateCounter);
      }, 600);
    });
  }

  // Re-trigger heartbeat animation when returning to slide 1
  const heartbeatLine = document.querySelector('.heartbeat-line');
  if (heartbeatLine) {
    swiper.on('slideChange', function () {
      if (this.activeIndex === 0) {
        heartbeatLine.style.animation = 'none';
        // Force reflow
        void heartbeatLine.offsetWidth;
        heartbeatLine.style.animation = '';
      }
    });
  }
});
