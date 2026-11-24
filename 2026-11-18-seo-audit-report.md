# SEO-аудит #2: лендинг после исправлений

**URL:** https://mzvgvit.github.io/ALEXtur/index.html
**Дата:** 2026-11-18 (после деплоя коммита `801518f`)
**Метод:** headless Chromium (Playwright 1.49 — движок Playwright MCP; сервер добавлен в конфиг в этой сессии, его инструменты подхватятся в новой сессии). Десктоп 1280×800, мобайл 375×812 (DPR 2), + 9 страниц и 3 сэмпла блога по живому DOM, + HTTP-проверки robots/sitemap/WebP.

Фотографии: [`img/seo-audit/2026-11-18-desktop-viewport.png`](img/seo-audit/2026-11-18-desktop-viewport.png), [`img/seo-audit/2026-11-18-mobile-full.png`](img/seo-audit/2026-11-18-mobile-full.png), [`img/seo-audit/2026-11-18-retreat-mobile-full.png`](img/seo-audit/2026-11-18-retreat-mobile-full.png). Сырые данные аудита — в `/tmp/alextur-seo-audit/audit2-result.json`, `desktop-data.json`, `mobile-data.json`.

## 1. До / после (первый аудит — утром 18.11, второй — после деплоя)

| Критерий | До | После | Статус |
|---|---|---|---|
| robots.txt | 404 | **200**, `Sitemap:` указан | ✅ |
| sitemap.xml | 404 | **200**, 54 URL (9 страниц + 45 статей) | ✅ |
| canonical | 0 из 9 страниц | есть на всех 9 + все 45 блог-страниц; article.html → noindex,follow | ✅ |
| OG-теги | 0 из 9 (у retreat — 2, с битым относительным og:image) | 6–11 тегов на каждой странице, og:image абсолютные | ✅ |
| Twitter cards | 0 | `summary_large_image` везде | ✅ |
| JSON-LD | 0 | TravelAgency+WebSite (index), FAQPage (faq), TravelAgency+Review×3 (reviews), Event (retreat с датами 08–15.06.2027 и ценой €1490), Article ×45 (блог), валиден на живом DOM | ✅ |
| Description главной | 176 симв. (обрезался) | **150 симв.** с УТП «от €35» и «под ключ» | ✅ |
| Блог: URL статей | 1 шаблон `article.html?i=slug` из JS | 45 статических страниц `blog/<slug>.html` с предрендеренным текстом, перелинковка из блога и стран | ✅ |
| Вес страницы (десктоп, распакованный) | ~530 КБ | **~316 КБ** (−40%) | ✅ |
| Oversized-картинки | 1280px в слот 375px | нет — `srcset` + `-640.webp` (hero 190→34 КБ, Колизей 261→50 КБ) | ✅ |

## 2. Живые метрики после деплоя

| Метрика | Десктоп | Мобайл | Порог | Вердикт |
|---|---|---|---|---|
| TTFB | 330 мс | — | ≤800 мс | ✅ |
| FCP | 600 мс | — | ≤1,8 с | ✅ |
| LCP (`IMG.hero__img`) | **735 мс** | **458 мс** | ≤2,5 с | ✅ (десктоп — холодный кэш CDN: WebP/JPG обе ветки srcset при первом прогоне) |
| CLS | 0,05 | 0,00 | ≤0,1 | ✅ |
| Запросов | 7 | 7 | — | ✅ |
| Консоль/битые картинки | 0 | 0 | — | ✅ |

Проверки в браузере: горизонтального скролла нет ни на главной, ни в блог-статьях; у статей шапка/подвал (`../index.html`) и canonical работают; ноль JS-ошибок.

## 3. Состав деплоя (коммит `801518f`, 78 файлов добавлено, 18 изменено)

- `robots.txt`, `sitemap.xml` (генератор — `tools/build-blog-pages.mjs`, перезапуск: `node tools/build-blog-pages.mjs`)
- `blog/<slug>.html` ×45 — статические страницы с canonical/OG/Article, предрендеренным H1, текстом и советами; `article.html` остался как шаблон с `noindex,follow` и canonical на блог
- `shared.js` — ROOT-префикс для страниц в подпапке (`data-sub="blog"`), `blog.js` и `countries.html` — ссылки на статические страницы; `blog.html` — предрендер дневной подборки (7–8 карточек в статике, JS обновляет тем же селектом)
- `index.html` — canonical, OG/Twitter, JSON-LD, сокращённая description, `srcset`/`fetchpriority=high`/`width×height`; `img/italy/*-640.webp`
- `faq.html`/`reviews.html`/`retreat/index.html` — canonical, OG, FAQPage/Review/Event; ретритный og:image теперь абсолютный
- Заодно опубликованы ранее не закоммиченные изменения ретрита (сжатые версии картинок, `-640`), `img/blog/italy-640.jpg`, правки `.gitignore`/`SPEC.md`/`data/`

## 4. Что осталось (не блокирует, на следующий проход)

1. **Языки ru/en/it** — переключение по-прежнему клиентское, отдельные URL + `hreflang` нет (для en/it-трафика).
2. **Тизеры 25 стран** в блоге пустые — записи без поля `d` (Мексика, США...); тексты-тизеры нужно дописать (копирайтинг, не автоматика).
3. **CLS 0,05 на десктопе** — мелкий сдвиг до первого рендера; можно задать `min-height` блоку отзывов.
4. **LCP десктоп 735 мс** — норма, но при росте CDN-нагрузки можно добавить `<link rel="preload" as="image">` на hero.
5. **Отзывы** — разметка `Review` добавлена без `aggregateRating`: «4,98 / 158 525 отзывов» на главной остаётся текстовым заявлением без внешнего источника — в структурированные данные брать нельзя.

## Итог (1–2 строки)
Все 7 пунктов дорожки закрыты и залиты на GitHub Pages: robots/sitemap (54 URL), canonical+OG+Twitter на всех 16 типах страниц, JSON-LD пятью схемами, 45 статических блог-страниц, WebP/srcset — вес главной −40%, LCP ≤735 мс, CLS ≤0,05. Отчёт и скриншоты — в корне проекта и `img/seo-audit/`.
