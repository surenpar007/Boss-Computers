/* Boss Computers – site scripts */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var WA_NUMBER = '919884992199';

  // Year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky header shadow
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal, .speed-card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el, i) {
      // light stagger for siblings in grids
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(idx, 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Active nav link
  var sections = ['services', 'why', 'process', 'faq', 'contact'].map(function (id) { return document.getElementById(id); });
  var links = nav.querySelectorAll('a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) navIO.observe(s); });
  }

  // Enquiry form -> WhatsApp
  var form = document.getElementById('enquiry-form');
  if (form) {
    var F = form.elements;
    function setError(input, msgEl, msg) {
      msgEl.textContent = msg;
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = F.name.value.trim();
      var phone = F.phone.value.replace(/[^\d]/g, '');
      var ok = true;

      setError(F.name, document.getElementById('e-name'), name ? '' : 'Please enter your name.');
      if (!name) ok = false;

      var phoneValid = phone.length >= 10 && phone.length <= 13;
      setError(F.phone, document.getElementById('e-phone'), phoneValid ? '' : 'Please enter a valid 10-digit phone number.');
      if (!phoneValid) ok = false;

      if (!ok) {
        (name ? F.phone : F.name).focus();
        return;
      }

      var lines = [
        'Hi Boss Computers, I have an enquiry.',
        '',
        'Name: ' + name,
        'Phone: ' + F.phone.value.trim(),
        'Device: ' + F.device.value,
        F.brand.value.trim() ? 'Brand/Model: ' + F.brand.value.trim() : null,
        'Service: ' + F.service.value,
        F.message.value.trim() ? 'Problem: ' + F.message.value.trim() : null
      ].filter(function (l) { return l !== null; });

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }
})();
