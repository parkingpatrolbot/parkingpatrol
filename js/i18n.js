let currentLang = localStorage.getItem('lang') || 'ru';
const translations = {};

async function loadLang(lang) {
  try {
    const res = await fetch(`lang/${lang}.json?v=3`);
    translations[lang] = await res.json();
    applyLang(lang);
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  } catch (e) {
    console.error("Language file not found:", lang);
  }
}

function applyLang(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) el.innerHTML = translations[lang][key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (translations[lang][key]) el.placeholder = translations[lang][key];
  });

  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.dataset.i18nHref;
    if (key === 'terms_link') el.href = `terms-${lang}.docx`;
    if (key === 'privacy_link') el.href = `privacy-${lang}.docx`;
  });

  document.querySelectorAll('[data-img]').forEach(img => {
    const src = img.dataset[`img-${lang}`] || img.dataset['img-ru'];
    if (src) img.src = src;
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function copyLink() {
  navigator.clipboard.writeText('https://t.me/ParkingPatrolBot');
  alert(translations[currentLang]?.copy_alert || 'Link copied!');
}

document.addEventListener('DOMContentLoaded', () => {
  const preferred = navigator.language.split('-')[0];
  currentLang = localStorage.getItem('lang') || (['sr','ru','en'].includes(preferred) ? preferred : 'ru');
  loadLang(currentLang);

  document.getElementById('lang-switcher').innerHTML = `
    <button class="lang-btn" data-lang="sr">SR</button>
    <button class="lang-btn" data-lang="ru">РУ</button>
    <button class="lang-btn" data-lang="en">EN</button>
  `;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang !== currentLang) {
        currentLang = lang;
        loadLang(lang);
      }
    });
  });
});
