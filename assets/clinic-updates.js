/* Live Clinic Updates on the website.
   Staff post updates in the clinic app (Updates page); any marked "Also show
   on website" appear here automatically — no website edit needed.
   Source: the clinic app's public, read-only feed (active updates only, no
   personal data). If the feed can't be reached, nothing is shown and the
   page's normal content stays exactly as it is.

   NOTE: if the clinic app's backend address ever changes (e.g. custom
   domain), update FEED_URL below. */
(function () {
  var FEED_URL = 'https://clinic-emr-dev-backend.onrender.com/api/public/updates';

  var TYPE_LABELS = {
    availability: { en: 'Doctor Availability', ar: 'مواعيد الطبيب' },
    news: { en: 'Clinic News', ar: 'أخبار العيادة' },
    video: { en: 'New Video', ar: 'فيديو جديد' },
    other: { en: 'Announcement', ar: 'إعلان' }
  };
  var LINK_LABELS = {
    video: { en: 'Watch video', ar: 'شاهد الفيديو' },
    other: { en: 'Open link', ar: 'فتح الرابط' }
  };

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ar';
  }

  // A span that the site's AR/EN switch (setLang in site.js) can re-label.
  // Only ever filled with OUR fixed strings — never with update text.
  function i18nSpan(className, en, ar) {
    var el = document.createElement('span');
    el.className = (className ? className + ' ' : '') + 'i18n';
    el.setAttribute('data-en', en);
    el.setAttribute('data-ar', ar);
    el.textContent = currentLang() === 'ar' ? ar : en;
    return el;
  }

  function safeLink(url) {
    try {
      var u = new URL(url);
      return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : null;
    } catch (e) { return null; }
  }

  function formatDate(iso, lang) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    try {
      return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Cairo' });
    } catch (e) { return d.toISOString().slice(0, 10); }
  }

  function buildCard(u) {
    var card = document.createElement('article');
    card.className = 'update-card live-update';

    var meta = document.createElement('div');
    meta.className = 'update-meta';
    var t = TYPE_LABELS[u.type] || TYPE_LABELS.other;
    meta.appendChild(i18nSpan('update-tag ' + (TYPE_LABELS[u.type] ? u.type : 'other'), t.en, t.ar));
    meta.appendChild(i18nSpan('update-date', formatDate(u.postedAt, 'en'), formatDate(u.postedAt, 'ar')));
    card.appendChild(meta);

    // Staff-written text: textContent only (never HTML), and dir="auto" so
    // Arabic or English text each display the right way round.
    var p = document.createElement('p');
    p.setAttribute('dir', 'auto');
    p.className = 'live-update-text';
    p.textContent = u.text || '';
    card.appendChild(p);

    var href = u.link ? safeLink(u.link) : null;
    if (href) {
      var a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'live-update-link';
      var l = LINK_LABELS[u.type] || LINK_LABELS.other;
      a.appendChild(i18nSpan('', l.en + ' →', l.ar + ' ←'));
      card.appendChild(a);
    }
    return card;
  }

  function render(updates) {
    // Updates page: newest first, above the existing articles.
    var list = document.querySelector('[data-live-updates]');
    if (list && updates.length) {
      for (var i = updates.length - 1; i >= 0; i--) list.insertBefore(buildCard(updates[i]), list.firstChild);
    }
    // Home page: a small "Latest news" box with the newest 2.
    var home = document.querySelector('[data-home-latest]');
    if (home && updates.length) {
      var box = home.querySelector('[data-home-latest-list]');
      updates.slice(0, 2).forEach(function (u) { box.appendChild(buildCard(u)); });
      home.hidden = false;
    }
  }

  if (!window.fetch || (!document.querySelector('[data-live-updates]') && !document.querySelector('[data-home-latest]'))) return;
  var controller = window.AbortController ? new AbortController() : null;
  var timer = setTimeout(function () { if (controller) controller.abort(); }, 10000);
  fetch(FEED_URL, controller ? { signal: controller.signal } : {})
    .then(function (r) { return r.ok ? r.json() : { updates: [] }; })
    .then(function (data) { clearTimeout(timer); render(Array.isArray(data.updates) ? data.updates : []); })
    .catch(function () { clearTimeout(timer); /* feed unavailable — page stays as is */ });
})();
