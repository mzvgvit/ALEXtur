# SEO-аудит #3: seomator CLI (398 правил) и исправления

**URL:** https://mzvgvit.github.io/ALEXtur/
**Дата:** 2026-11-22 (аудит до коммита `8cc176a`, повторный — после)
**Инструмент:** `@seomator/seo-audit` — краул 15 страниц + `--cwv` (Playwright-рендер, Core Web Vitals), плюс axe-core напрямую для деталей контраста.

## Оценки

| Прогон | Оценка | Примечание |
|---|---|---|
| Было (аудит #2, до) | 90 / A | ручной Playwright-аудит |
| seomator до фиксов | **90 / A** (perf 90, schema 81) | |
| seomator после фиксов | **90 / A** (perf 93, schema 86) | потолок держат артефакты 404-страницы (см. ниже) |

## Исправлено (коммит 8cc176a)

| Правило | Фикс |
|---|---|
| `Article: datePublished` (45 стр.) | git-даты в JSON-LD всех статей |
| `perf-lazy-above-fold`, `perf-lcp-hints` | hero-карты: `loading="eager" fetchpriority="high"` (50 стр.) |
| `images-oversized-delivery` (~826 KiB) | srcset `-640.jpg` + `sizes` для 45+ карточек (45 новых файлов) |
| `cwv-cls` 0.944 (reviews) | предрендер 11 отзывов в HTML; JS перезаписывает идентично |
| `schema-review: itemReviewed` | `TravelAgency/ALEXtur` у каждого Review |
| `social-og-image-reachable` (france 540px) | ресайз до 600px |
| `content-description-pixel-width` (4 стр.) | descriptions 151→122–131 симв. |
| `geo-schema-drift` (retreat) | имя события дословно видно в kicker+schema |
| `img` вылезает на мобиле | CSS `height:auto` |

## Контраст (axe-core, отдельная выверка)

Было: 3 нарушения WCAG AA (serious): `em` в логотипе 2.9, `.tag--soon` 4.0 (×2).
Стало AA = **0**: `.logo em` → #CB6C37 (3.17), `.tag--soon`/`.price` → `--accent-deep` #A64B1C
(5.76/5.64), `.lang-switch` → olive-900 (11.61), retreat-кнопка/`--terra-deep` → #8A431B (7.24).
Остаток «12 enhanced» — уровень AAA (7:1), добровольный; ради него не гасим палитру.

## Ложные срабатывания (артефакт краулера, фиксировать нечего)

Краулер посетил `https://mzvgvit.github.io/ALEXtur` (301 → `/ALEXtur/`), спарсил относительные
ссылки до редиректа и получил GitHub-404 «Site not found» под корнем домена. Все критические
«no viewport / no canonical / no schema / 14 words / robots.txt 404» — про эти 404-страницы.
На живых страницах поля есть (проверено по всей выгрузке).

## Реальные остатки

1. **robots.txt/sitemap.xml на корне домена** — у проектной страницы GitHub недоступна без
   отдельного репо `mzvgvit.github.io` (создание — на пользователе).
2. **Uppercase `/ALEXtur/`** — лечится переименованием репо в `alextur`; GitHub 301-ит старый путь.
3. **Заголовки XFO/nosniff/HSTS** — GitHub Pages не даёт ставить кастомные http-заголовки (платформа).
