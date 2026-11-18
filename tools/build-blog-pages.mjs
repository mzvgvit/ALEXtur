#!/usr/bin/env node
// ALEXtur — генератор SEO-статики: blog/<slug>.html, robots.txt, sitemap.xml,
// предрендер дневной подборки в blog.html. Запуск из корня репо: node tools/build-blog-pages.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://mzvgvit.github.io/ALEXtur/';
const src = readFileSync(join(ROOT, 'data/blog-data.js'), 'utf8');
const COUNTRIES = new Function('window', src + '\nreturn window.BLOG_COUNTRIES;')({});
if (!COUNTRIES || COUNTRIES.length !== 45) throw new Error('blog-data: ожидалось 45 стран, получено ' + (COUNTRIES && COUNTRIES.length));

const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const slugOf = c => c.n.en.toLowerCase().replace(/[^a-z]+/g, '-').replace(/(^-|-$)/g, '') || c.i;
// slug из поля i (латиница уже есть) — им и пользуемся
const urls = [];

// ---------- blog/<slug>.html ----------
mkdirSync(join(ROOT, 'blog'), { recursive: true });
const pageTpl = c => {
  const name = esc(c.n.ru);
  const story = String(c.s.ru).trim();
  const desc = (story.length > 152 ? story.replace(/\s+\S*$/, '').slice(0, 152) : story);
  const tips = c.t.ru.map(t => '<li>' + esc(t).replace(/^«|»$/g, '') + '</li>').join('\n     ');
  const imgAlt = esc(c.n.ru);
  return '<!DOCTYPE html>\n<html lang="ru">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>' + name + ' — блог | ALEXtur</title>\n<meta name="description" content="' + esc(desc) + '">\n<link rel="canonical" href="' + SITE + 'blog/' + c.i + '.html">\n<meta property="og:type" content="article">\n<meta property="og:site_name" content="ALEXtur">\n<meta property="og:url" content="' + SITE + 'blog/' + c.i + '.html">\n<meta property="og:title" content="' + name + ' — блог | ALEXtur">\n<meta property="og:description" content="' + esc(desc) + '">\n<meta property="og:image" content="' + SITE + 'img/blog/' + c.i + '.jpg">\n<meta property="og:locale" content="ru_RU">\n<meta name="twitter:card" content="summary_large_image">\n<link rel="icon" type="image/svg+xml" href="../img/logo/favicon.svg">\n<link rel="stylesheet" href="../css/style.css">\n<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: c.n.ru, description: desc, image: SITE + 'img/blog/' + c.i + '.jpg', inLanguage: 'ru', author: { '@type': 'Organization', name: 'ALEXtur', url: SITE }, publisher: { '@type': 'Organization', name: 'ALEXtur', logo: { '@type': 'ImageObject', url: SITE + 'img/logo/favicon.svg' } }, mainEntityOfPage: SITE + 'blog/' + c.i + '.html' }) + '</script>\n</head>\n<body data-page="article" data-sub="blog">\n<a class="skip-link" href="#main">Перейти к содержанию</a>\n<div id="site-header-host"></div>\n<main id="main">\n<nav class="breadcrumbs container" aria-label="Хлебные крошки">\n <ol><li><a href="index.html">Главная</a></li><li><a href="blog.html">Блог</a></li><li aria-current="page">' + name + '</li></ol>\n</nav>\n<section class="section">\n <div class="container" style="max-width:820px">\n  <h1>' + name + '</h1>\n  <div class="media" id="a-media" style="aspect-ratio:16/9"><img class="card__media" loading="lazy" src="../img/blog/' + c.i + '.jpg" alt="' + imgAlt + '" data-fallback="' + imgAlt + '"></div>\n  <p id="a-story" style="margin-top:22px;font-size:1.05rem">' + esc(story) + '</p>\n  <h3 style="margin-top:26px">Что знать перед поездкой</h3>\n  <ul class="chips" id="a-tips">\n     ' + tips + '\n  </ul>\n  <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap">\n   <a class="btn" href="https://wa.me/393885758059" rel="noopener" data-i18n="article.cta">Заказать тур по этой стране</a>\n   <a class="btn btn--ghost" href="mailto:booking@ALEXtour.com" data-i18n="article.mail">Написать на почту</a>\n   <a class="btn btn--ghost" href="blog.html" data-i18n="article.back">← Другие статьи</a>\n  </div>\n </div>\n</section>\n</main>\n<div id="site-footer-host"></div>\n<script src="../js/i18n.js"></script>\n<script src="../js/shared.js"></script>\n<script src="../js/main.js"></script>\n<script src="../data/blog-data.js"></script>\n</body>\n</html>\n';
};

let n = 0;
for (const c of COUNTRIES) {
  writeFileSync(join(ROOT, 'blog', c.i + '.html'), pageTpl(c));
  urls.push({ loc: SITE + 'blog/' + c.i + '.html', name: c.n.ru });
  n++;
}

// ---------- robots.txt ----------
writeFileSync(join(ROOT, 'robots.txt'),
`User-agent: *
Allow: /
Disallow: /tmp/

Sitemap: ${SITE}sitemap.xml
`);

// ---------- sitemap.xml ----------
const core = ['index.html', 'mission.html', 'countries.html', 'blog.html', 'faq.html', 'reviews.html', 'about.html', 'rome.html', 'retreat/index.html'];
const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  core.map(u => ' <url><loc>' + SITE + u + '</loc><lastmod>' + today + '</lastmod></url>').join('\n') +
  '\n' + urls.map(u => ' <url><loc>' + u.loc + '</loc><lastmod>' + today + '</lastmod></url>').join('\n') +
  '\n</urlset>\n';
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap);

// ---------- предрендер дневной подборки в blog.html ----------
function hash(str) { let h = 7; for (let k = 0; k < str.length; k++) h = (h * 31 + str.charCodeAt(k)) >>> 0; return h }
function rng(seed) { let s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
function takeRandom(rand) { const idx = [...COUNTRIES.keys()]; for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]] } return idx.slice(0, 7 + (Math.floor(rand() * 2) ? 1 : 0)) }
const take = takeRandom(rng(hash(new Date().toDateString() + 'blog')));
const gridHtml = take.map(i => { const c = COUNTRIES[i]; return '<article class="card"><img class="card__media" loading="lazy" src="img/blog/' + c.i + '.jpg" alt="' + esc(c.n.ru) + '" data-fallback="' + esc(c.n.ru) + '"><div class="card__body"><h3>' + esc(c.n.ru) + (c.r.ru ? ' <span class="tag">' + esc(c.r.ru) + '</span>' : '') + '</h3><p>' + (c.d && c.d.ru ? esc(c.d.ru) : '') + '</p><a class="btn btn--ghost" style="margin-top:auto;max-width:250px" href="blog/' + c.i + '.html">Читать статью →</a></div></article>' }).join('\n      ');
const blogPath = join(ROOT, 'blog.html');
if (existsSync(blogPath)) {
  const b = readFileSync(blogPath, 'utf8');
  if (b.includes('<!--SSR-GRID-START-->')) {
    writeFileSync(blogPath, b.replace(/<!--SSR-GRID-START-->[\s\S]*?<!--SSR-GRID-END-->/, '<!--SSR-GRID-START-->\n      ' + gridHtml + '\n      <!--SSR-GRID-END-->'));
  }
} else console.error('WARN: blog.html не найден, предрендер пропущен');

console.log('OK: сгенерировано', n, 'страниц blog/, robots.txt, sitemap.xml,', urls.length + core.length, 'URL в sitemap; предрендер grid:', take.length, 'карточек');
