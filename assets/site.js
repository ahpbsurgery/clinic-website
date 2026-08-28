(function () {
  var year = new Date().getFullYear();
  document.querySelectorAll('#year-en, #year-ar').forEach(function (el) { el.textContent = year; });
  var footerSpan = document.querySelector('footer .i18n');
  if (footerSpan) {
    footerSpan.setAttribute('data-en', footerSpan.getAttribute('data-en').replace("<span id='year-en'></span>", year));
    footerSpan.setAttribute('data-ar', footerSpan.getAttribute('data-ar').replace("<span id='year-ar'></span>", year));
  }
})();

function setLang(lang) {
  var html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.i18n').forEach(function (el) {
    el.innerHTML = el.getAttribute(lang === 'ar' ? 'data-ar' : 'data-en');
  });
  if (typeof PAGE_TITLES !== 'undefined' && PAGE_TITLES[lang]) {
    document.title = PAGE_TITLES[lang];
  }
  var btnAr = document.getElementById('btn-lang-ar');
  var btnEn = document.getElementById('btn-lang-en');
  if (btnAr) btnAr.classList.toggle('active', lang === 'ar');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
}

// Every visitor lands on the Arabic version first, every time — no
// remembered preference from a previous visit or a prior toggle earlier
// in the same session. They can still switch to English with the AR/EN
// buttons above; it just resets to Arabic on the next page load.
setLang('ar');
