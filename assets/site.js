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

// A new visit starts in Arabic. Once the visitor picks a language it is kept while they move between the
// pages (this browser tab / session); a fresh visit starts in Arabic again. ?lang=en / ?lang=ar opens that
// language directly.
var SN_LANG_KEY = 'sn_site_lang';
function snSavedLang() {
  var m = /[?&]lang=(ar|en)\b/.exec(location.search);
  if (m) return m[1];
  try { var v = sessionStorage.getItem(SN_LANG_KEY); if (v === 'ar' || v === 'en') return v; } catch (e) { /* storage blocked */ }
  return 'ar';
}
(function () {
  var plain = setLang;
  setLang = function (lang) { plain(lang); try { sessionStorage.setItem(SN_LANG_KEY, lang); } catch (e) { /* storage blocked */ } };
})();
setLang(snSavedLang());
