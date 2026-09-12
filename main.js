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
