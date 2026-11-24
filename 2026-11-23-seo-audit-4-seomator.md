# SEO-аудит ALEXtur #4 — 23.11.2026 (SEOmator CLI v8.0.1)

Два прохода: `seomator-4-raw.xml` (шумный, старт с `/ALEXtur/` → 301-артефакт краулера) и
`seomator-4b-raw.xml` (чистый, старт `…/ALEXtur/index.html`). Порог 284 отказов против 405 в шумном.

## Динамика

| Аудит | Дата | Оценка | Страниц | Примечание |
|---|---|---|---|---|
| #2 (c9b71d) | 21.11 | 90/A | 20 | после больших фиксов |
| #3 (cfb536) | 22.11 | 90/A | 12 | контраст AA = 0 … |
| #4 (4b2caf) | 23.11 | **92/A** | 24 | лимит страниц 12→50, `--cwv` |
| #4-858090 | 23.11 | **92/A** | 24 | повтор clean-прохода |

Худшие категории после фиксов: social 68 · geo 67 · security 86 (GitHub Pages ограничения) ·
прочее — в пределах B-A.

## Артефакты аудитора (не чинить)

1. **SEOmator 301-кроулер** (известный, аудиты #3–#4): нормализует стартовый URL →
   GET корня `mzvgvit.github.io/` → 301 от GitHub → ~120 ложных критических отказов.
   Лекарство: старт всегда `https://mzvgvit.github.io/ALEXtur/index.html`.
2. **GitHub-404 страницы**: `blog/index.html`, `blog/blog.html`, корень `https://mzvgvit.github.io/`
   помечены «нет viewport/canonical/…/контраст». Это собственная страница 404 GitHub,
   а не наш сайт.
3. **«Extremely thin content: 14 words» (23/24 страниц) — ложное срабатывание токенизатора
   аудитора на кириллице.** Ручной подсчёт по сырому HTML: index.html 245 слов
   (242 кириллических), countries.html 151, rome.html 336, faq.html 183. Правило
   «минимум 100 слов» фактически выполняется; seomator, вероятно, считает только латиницу.

## Реальные проблемы → исправлено в этом же дне

| Проблема | Объём | Фикс |
|---|---|---|
| Битые относительные ссылки в 45 статьях `blog/*.html` (`href="index.html"`, `href="blog.html"` → 404 на GitHub) | 135 ссылок | `../index.html`, `../blog.html` |
| `img/photo-credits.md` отдаётся GitHub Pages как `text/markdown` (свалено в корень без тегов, ссылка из retreat) | 1 | создан `img/photo-credits.html` (полная таблица 83 строк, шапка/header/OG/canonical), ссылка в retreat переключена на `.html` |
| Контраст WCAG (axe, реальная страница): `.tag` 4.24:1, `.rev-stat` 4.24:1, `.btn--ghost`, хлебные крошки, `code` — оливка #6C7330 на оливковом фоне #E9EDD2 | 19/24 стр. | `--olive-700` #6C7330 → **#5F6628** (4.76–5.12 на всех фонах, белый на ней 6.14) |
| Retreat-вёрстка: шапка до скролла прозрачная → axe не может посчитать контраст поверх фото (8 флагов: .brand, nav, #lang-switch) | 1 | `.topbar` непрозрачная #3A3E1D постоянно |
| `retreat/index.html`: нет `og:description`, нет `<main>` (a11y-main-landmark, 7/24) | 1 | добавлены оба |
| Мета-descriptions >1000px: index (144 симв.), blog/japan, thailand, portugal (152) | 4 | сокращены до 118/126/125/121 симв. (≈950px) |
| `blog.html`: 6 битых кавычек `data-fallback="Название width="1280"` → валидатор видел теги без width/height (images-dimensions ×4, oversized-delivery) | 1 | кавычки закрыты |
| geo: нет `llms.txt` (29/29, балл geo 67) | — | `llms.txt` с картой сайта и контактом |
| schema: Organization без `@id`, нет publisher у WebSite | 1 | `@graph` с `#organization`/`#logo`/`#website` + `publisher` (SearchAction не добавлен — поиска на сайте нет, врать schema.org нехорошо) |

## Осталось (требуют владельца / платформы / данных)

- **mzvgvit.github.io-репозиторий**: корневые `robots.txt` и `sitemap.xml` всё ещё 404 на
  `mzvgvit.github.io/robots.txt` — нужны отдельные репо (подтверждено 23.11). GitHub Pages
  не умеет `X-Frame-Options`/`nosniff`/HSTS — security 86 это потолок платформы.
- **social 68**: некуда вставить ссылки на соцсети — их пока нет у владельца; добавить при
  появлении профилей (schema sameAs + футер).
- **eeat**: вторая контактная точка на странице контактов (телефон) — вопрос владельца.
- **color-contrast-enhanced (AAA 7:1)** — на oливковых страницах ниже 7:1; AA (4.5:1) теперь
  выполняется, AAA для обычного контента не обязателен.
- Репо `ALEXtur` → переименовать в `alextur` (строчные) — аккуратнее URL, по желанию.

## Запуск аудита (копируемая команда)

```bash
cd ~/__cc/ALEXtur && seomator audit https://mzvgvit.github.io/ALEXtur/index.html \
  --crawl -m 50 --cwv --format llm -o seomator-Nb-raw.xml 2>&1 | tee seomator-Nb-run.log
seomator compare mzvgvit.github.io
```
