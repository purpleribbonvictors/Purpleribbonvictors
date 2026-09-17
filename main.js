// Purple Ribbon Victors — shared site behaviour

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mailto-powered forms: builds a mailto: link from the form fields
  // so messages open directly in the visitor's own email app.
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var to = form.getAttribute('data-mailto');
      var subjectBase = form.getAttribute('data-subject') || 'Message from the website';
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');

      var subject = subjectBase + (name && name.value ? ' — ' + name.value : '');
      var bodyLines = [];
      if (name && name.value) bodyLines.push('Name: ' + name.value);
      if (email && email.value) bodyLines.push('Email: ' + email.value);
      if (message && message.value) bodyLines.push('', message.value);

      var mailto = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;
    });
  });

});

// ---------- Anniversary celebration ----------
// Fires automatically every year on the same date, no manual edits needed.
// The year count is calculated from FOUNDING_YEAR, so the message updates itself too.
(function () {
  var FOUNDING_YEAR = 2025;
  var ANNIV_MONTH = 8; // September, 0-indexed (8 = September)
  var ANNIV_DAY = 17;

  var today = new Date();
  var isAnniversary = today.getMonth() === ANNIV_MONTH && today.getDate() === ANNIV_DAY;
  if (!isAnniversary) return;

  var years = today.getFullYear() - FOUNDING_YEAR;
  if (years < 1) return;

  function ordinal(n) {
    var v = n % 100;
    if (v >= 11 && v <= 13) return n + 'th';
    switch (n % 10) {
      case 1: return n + 'st';
      case 2: return n + 'nd';
      case 3: return n + 'rd';
      default: return n + 'th';
    }
  }
  var yearLabel = ordinal(years);

  document.addEventListener('DOMContentLoaded', function () {

    // Small badge next to the logo, shown all day, on every page
    var brand = document.querySelector('.nav .brand');
    if (brand) {
      var badge = document.createElement('span');
      badge.className = 'anniv-badge';
      badge.innerHTML = '\uD83C\uDF97\uFE0F ' + yearLabel + ' Anniversary';
      badge.title = yearLabel + ' Anniversary';
      brand.appendChild(badge);
    }

    // Full celebration, balloons, confetti, popup, once per visitor per year
    var seenKey = 'prv_anniv_seen_' + today.getFullYear();
    if (localStorage.getItem(seenKey)) return;
    try { localStorage.setItem(seenKey, '1'); } catch (e) {}

    var overlay = document.createElement('div');
    overlay.className = 'anniv-overlay';
    document.body.appendChild(overlay);

    var balloonColors = ['#601987', '#5E398F', '#251042', '#F5C767', '#FFFFFF'];
    var confettiColors = ['#601987', '#F5C767', '#C7A6E6', '#FFFFFF'];

    for (var i = 0; i < 18; i++) {
      var b = document.createElement('div');
      b.className = 'anniv-balloon';
      b.style.background = balloonColors[i % balloonColors.length];
      b.style.left = (Math.random() * 94) + 'vw';
      b.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      b.style.animationDuration = (7 + Math.random() * 4) + 's';
      b.style.animationDelay = (Math.random() * 4) + 's';
      b.style.transform = 'scale(' + (0.7 + Math.random() * 0.6) + ')';
      overlay.appendChild(b);
    }

    for (var j = 0; j < 36; j++) {
      var c = document.createElement('div');
      c.className = 'anniv-confetti';
      c.style.background = confettiColors[j % confettiColors.length];
      c.style.left = (Math.random() * 100) + 'vw';
      c.style.animationDuration = (3 + Math.random() * 2.5) + 's';
      c.style.animationDelay = (Math.random() * 3) + 's';
      overlay.appendChild(c);
    }

    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 13000);

    var backdrop = document.createElement('div');
    backdrop.className = 'anniv-modal-backdrop';
    backdrop.innerHTML =
      '<div class="anniv-modal">' +
        '<button class="anniv-modal-close" aria-label="Close">&times;</button>' +
        '<div class="emoji-row">\uD83C\uDF89\uD83C\uDF97\uFE0F\uD83C\uDF88</div>' +
        '<h3>Happy ' + yearLabel + ' Anniversary, Purple Ribbon Victors</h3>' +
        '<p>A year ago we started this with one simple belief, that no one living with epilepsy should have to face it alone. Thank you for being part of that with us.</p>' +
        '<button class="btn btn-primary anniv-modal-ok">Thank you, let&rsquo;s go</button>' +
      '</div>';
    document.body.appendChild(backdrop);

    function closeModal () { backdrop.remove(); }
    backdrop.querySelector('.anniv-modal-close').addEventListener('click', closeModal);
    backdrop.querySelector('.anniv-modal-ok').addEventListener('click', closeModal);
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
  });
})();
