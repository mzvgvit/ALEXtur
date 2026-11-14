// ALEXtur — фолбэки картинок (шапка/меню/год/язык в shared.js)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      const ph = document.createElement('div');
      ph.className = 'img-fallback card__media';
      ph.style.cssText = img.classList.contains('hero__img') ? 'position:absolute;inset:0' : 'aspect-ratio:16/10;border-radius:14px 14px 0 0';
      ph.textContent = img.dataset.fallback;
      img.replaceWith(ph);
    });
  });
});
