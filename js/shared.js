// ALEXtur — общая шапка и подвал всех страниц (язык — через I18N)
const LOGO='<svg width="30" height="33" viewBox="0 0 100 110" style="flex:none">'+
 '<path d="M50 6C28 6 10 24 10 46c0 26 40 58 40 58s40-32 40-58C90 24 72 6 50 6Z" fill="#383B1B" stroke="#A7AF4C" stroke-width="4"/>'+
 '<path d="M31 62 44 28h12l13 34" fill="none" stroke="#F4F6E8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'+
 '<path d="M37 50h26" stroke="#A7AF4C" stroke-width="6" stroke-linecap="round"/></svg>';
const NAV_ITEMS=[
 {f:'index.html',k:'nav.index'},
 {f:'mission.html',k:'nav.mission'},
 {f:'countries.html',k:'nav.countries'},
 {f:'blog.html',k:'nav.blog'},
 {f:'faq.html',k:'nav.faq'},
 {f:'reviews.html',k:'nav.reviews'},
 {f:'about.html',k:'nav.about'}
];
const LANGS=[['ru','RU','Русский'],['en','EN','English'],['it','IT','Italiano']];
// префикс путей для страниц в подпапках (blog/<slug>.html): ссылка от корня сайта
const ROOT=(document.body&&document.body.dataset.sub==='blog')?'../':'';
function renderSwitcher(){
 const l=I18N.lang();
 return '<select class="lang-switch" aria-label="'+I18N.t('lang.aria')+'">'+
  LANGS.map(([v,lab,native])=>'<option value="'+v+'"'+(v===l?' selected':'')+' title="'+native+'">'+lab+'</option>').join('')+
  '</select>';
}
function siteHeader(){
 const page=(location.pathname.split('/').pop()||'index.html');
 const items=NAV_ITEMS.map(it=>{
  const act=((page===it.f)||(page===''&&it.f==='index.html'))?' class="is-active" aria-current="page"':'';
  return '<li><a'+act+' href="'+ROOT+it.f+'">'+I18N.t(it.k)+'</a></li>';
 }).join('');
 return '<header class="site-header"><div class="container header-inner">'+
 '<a class="logo" href="'+ROOT+'index.html">'+LOGO+'<span class="logo__word">ALEX<em>tur</em></span></a>'+
 '<nav class="nav" id="site-nav" aria-label="'+I18N.t('nav.aria')+'"><ul>'+items+'</ul></nav>'+
 '<div class="header-tools">'+renderSwitcher()+
 '<button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">☰<span class="visually-hidden">'+I18N.t('menu.aria')+'</span></button>'+
 '</div></div></header>';
}
function siteFooter(){
 return '<footer class="site-footer"><div class="container"><div class="footer-grid">'+
 '<div><h4>ALEXtur</h4><p>'+I18N.t('footer.blurb')+'</p></div>'+
 '<div><h4>'+I18N.t('footer.contacts')+'</h4><p>booking@ALEXtour.com<br>+39-388-57-58059 (WhatsApp)</p></div>'+
 '<div><h4>'+I18N.t('footer.sections')+'</h4><p><a href="'+ROOT+'index.html">'+I18N.t('nav.index')+'</a> · <a href="'+ROOT+'mission.html">'+I18N.t('nav.mission')+'</a> · <a href="'+ROOT+'countries.html">'+I18N.t('nav.countries')+'</a> · <a href="'+ROOT+'blog.html">'+I18N.t('nav.blog')+'</a><br>'+
 '<a href="'+ROOT+'faq.html">'+I18N.t('nav.faq')+'</a> · <a href="'+ROOT+'reviews.html">'+I18N.t('nav.reviews')+'</a> · <a href="'+ROOT+'about.html">'+I18N.t('nav.about')+'</a><br><a href="'+ROOT+'retreat/index.html#retreats" style="color:#F2C977">'+I18N.t('footer.retreat')+' →</a></p></div>'+
 '</div><div class="copy"><span>© <span data-year>2025</span> ALEXtur</span><span>'+I18N.t('footer.tag')+'</span></div></div></footer>';
}
function mountChrome(){
 // после первой отрисовки хосты заменены самими шапкой/подвалом — меняем их напрямую
 const h=document.querySelector('.site-header')||document.getElementById('site-header-host');
 if(h){
  h.outerHTML=siteHeader();
  const toggle=document.querySelector('.menu-toggle'),header=document.querySelector('.site-header');
  toggle.addEventListener('click',()=>{
   const open=header.classList.toggle('nav-open');
   toggle.setAttribute('aria-expanded',open);
  });
  document.querySelectorAll('.nav a').forEach(a=>{
   a.addEventListener('click',()=>{header.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false')});
  });
 }
 const f=document.querySelector('.site-footer')||document.getElementById('site-footer-host');
 if(f){ f.outerHTML=siteFooter(); }
 const sel=document.querySelector('.lang-switch');
 if(sel) sel.addEventListener('change',()=>I18N.set(sel.value));
 document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
}
document.addEventListener('DOMContentLoaded',()=>mountChrome());
// при смене языка перерисовываем шапку/подвал с новыми подписями
window.addEventListener('alextur:lang',()=>mountChrome());
