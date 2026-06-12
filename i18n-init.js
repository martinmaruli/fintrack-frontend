let currentLang = localStorage.getItem('ft_lang') || 'en';

i18next
  .use(i18nextHttpBackend)
  .init({
    lng: currentLang,
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}.json'
    }
  }, function(err, t) {
    if (err) console.error('i18next init error:', err);
    updateDOMTexts();
    if (typeof render === 'function') render();
    if (typeof updateNavMetadata === 'function') updateNavMetadata();
  });

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ft_lang', lang);
  i18next.changeLanguage(lang, (err, t) => {
    if (err) console.error('i18next changeLanguage error:', err);
    updateDOMTexts();
    if (typeof render === 'function') render();
    if (typeof updateNavMetadata === 'function') updateNavMetadata();
  });
}

function t(key) {
  return i18next.t(key) || key;
}

function terr(errMsg) {
  return t('err_' + errMsg);
}

function updateDOMTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = i18next.t(key);
    if (translated && translated !== key) {
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = translated;
      } else if (el.hasAttribute('data-i18n-placeholder')) {
        el.placeholder = translated;
      } else {
        el.textContent = translated;
      }
    }
  });

  const titleKey = i18next.t('idx_title');
  if (titleKey && titleKey !== 'idx_title' && !window.location.pathname.includes('app.html')) {
    document.title = titleKey;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (i18next.isInitialized) updateDOMTexts();
});
