/* ============================================
   ApexStack - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Header scroll effect ----
  const header = document.querySelector('.header');
  const scrollTop = document.querySelector('.scroll-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (scrollTop) {
      if (window.scrollY > 400) {
        scrollTop.classList.add('visible');
      } else {
        scrollTop.classList.remove('visible');
      }
    }
  });

  // ---- Scroll to top ----
  scrollTop?.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Mobile menu toggle ----
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  mobileToggle?.addEventListener('click', function () {
    this.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });

  // ---- Animate elements on scroll ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .case-card, .testimonial-card, .feature-card, .industry-card, .partner-card, .blog-card, .team-card, .job-card, .stat-item, .office-card').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add animate-in style
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ---- Counter animation for stats ----
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const target = entry.target;
        const text = target.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const end = parseInt(match[0]);
          const prefix = text.substring(0, text.indexOf(match[0]));
          const suffix = text.substring(text.indexOf(match[0]) + match[0].length);
          let current = 0;
          const increment = Math.ceil(end / 60);
          const timer = setInterval(function () {
            current += increment;
            if (current >= end) {
              current = end;
              clearInterval(timer);
            }
            target.textContent = prefix + current + suffix;
          }, 20);
        }
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    statsObserver.observe(el);
  });

  // ---- Newsletter form ----
  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = this.querySelector('.newsletter-input');
    if (input && input.value.trim()) {
      alert('Thank you for subscribing! We\'ll be in touch.');
      input.value = '';
    }
  });

  // ---- Contact form (Web3Forms) ----
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const form = this;
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING...';

    fetch(form.action, {
      method: form.method,
      body: new FormData(form)
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.success) {
        status.textContent = 'Thank you! Your message has been sent. We will get back to you within 24 hours.';
        status.style.display = 'block';
        status.style.color = '#0fd4b4';
        form.reset();
      } else {
        status.textContent = data.message || 'Something went wrong. Please try again.';
        status.style.display = 'block';
        status.style.color = '#e63946';
      }
    }).catch(function () {
      status.textContent = 'Something went wrong. Please try again.';
      status.style.display = 'block';
      status.style.color = '#e63946';
    }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SEND MESSAGE';
    });
  });

  // ---- Hero Slider ----
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDots = document.querySelectorAll('.hero-dot');
  var currentSlide = 0;
  var slideInterval = null;
  var slideCount = heroSlides.length;

  function goToSlide(index) {
    if (slideCount === 0) return;
    // Remove active from current
    heroSlides[currentSlide].classList.remove('active');
    heroSlides[currentSlide].classList.add('slide-exit');
    heroDots[currentSlide]?.classList.remove('active');

    currentSlide = index;

    // Add enter animation class
    heroSlides[currentSlide].classList.add('slide-enter');
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide]?.classList.add('active');

    // Clean up animation classes after transition
    setTimeout(function () {
      heroSlides.forEach(function (slide) {
        slide.classList.remove('slide-exit');
        slide.classList.remove('slide-enter');
      });
    }, 850);
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slideCount);
  }

  function startAutoplay() {
    if (slideCount <= 1) return;
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  // Dot click handlers
  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = parseInt(this.getAttribute('data-goto'));
      if (target !== currentSlide) {
        goToSlide(target);
        resetAutoplay();
      }
    });
  });

  // Start autoplay if there are slides
  if (slideCount > 1) {
    startAutoplay();
  }

  // ---- Set active nav link based on current page ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});
