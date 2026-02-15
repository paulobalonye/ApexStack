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

  // Mobile dropdown toggle - tap to expand/collapse submenus
  document.querySelectorAll('.nav-item').forEach(function (item) {
    var link = item.querySelector('.nav-link');
    var dropdown = item.querySelector('.dropdown');

    if (link && dropdown) {
      link.addEventListener('click', function (e) {
        // Only toggle dropdown on mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          // Close other open dropdowns
          document.querySelectorAll('.nav-item.dropdown-open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('dropdown-open');
            }
          });
          item.classList.toggle('dropdown-open');
        }
      });
    } else if (link) {
      // Links without dropdowns close the menu
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          mobileToggle?.classList.remove('active');
          navMenu?.classList.remove('active');
        }
      });
    }
  });

  // Close mobile menu when a dropdown link is clicked
  document.querySelectorAll('.dropdown-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        mobileToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.querySelectorAll('.nav-item.dropdown-open').forEach(function (item) {
          item.classList.remove('dropdown-open');
        });
      }
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

  document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .platform-card, .industry-card, .partner-card, .blog-card, .team-card, .job-card, .stat-item, .office-card, .dash-stat-card').forEach(function (el) {
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

  // ---- Set active nav link based on current page ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});
