// ALEXtur — движок блога. Данные стран лежат в data/blog-data.js (window.BLOG_COUNTRIES).
const COUNTRIES=window.BLOG_COUNTRIES||[];

// Движок: ежедневная подборка + карточки со ссылками на статьи
function hash(str){let h=7;for(let k=0;k<str.length;k++)h=(h*31+str.charCodeAt(k))>>>0;return h}
function rng(seed){let s=seed>>>0;return function(){s=(s+0x6D2B79F5)|0;
 let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;
 return ((t^(t>>>14))>>>0)/4294967296}}
function takeRandom(rand){
 const idx=[...COUNTRIES.keys()];
 for(let i=idx.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
 return idx.slice(0,7+(Math.floor(rand()*2)?1:0));
}
function cardHTML(c){
 const T=window.I18N;
 return '<article class="card"><img class="card__media" loading="lazy" src="img/blog/'+c.i+
 '.jpg" alt="'+T.pick(c.n)+'" data-fallback="'+T.pick(c.n)+'"><div class="card__body"><h3>'+T.pick(c.n)+
 ' <span class="tag">'+T.pick(c.r)+'</span></h3><p>'+T.pick(c.d)+'</p>'+
 '<a class="btn btn--ghost" style="margin-top:auto;max-width:250px" href="article.html?i='+c.i+'">'+T.t('blog.card')+'</a></div></article>';
}
function bindFallbacks(scope){
 scope.querySelectorAll('img[data-fallback]').forEach(img=>{
  img.addEventListener('error',()=>{
   const d=document.createElement('div');
   d.className='img-fallback card__media';
   d.style.cssText='aspect-ratio:16/10;border-radius:14px 14px 0 0';
   d.textContent=img.dataset.fallback;
   img.replaceWith(d);
  });
 });
}
function renderBlog(){
 const grid=document.getElementById('blog-grid');
 if(!grid) return;
 const take=takeRandom(rng(hash(new Date().toDateString()+'blog')));
 grid.innerHTML=take.map(i=>cardHTML(COUNTRIES[i])).join('');
 bindFallbacks(grid);
}
document.addEventListener('DOMContentLoaded',()=>{
 renderBlog();
 const btn=document.getElementById('blog-reroll');
 if(btn) btn.addEventListener('click',()=>{
  const grid=document.getElementById('blog-grid');
  const take=takeRandom(rng(Math.floor(Math.random()*1e9)));
  grid.innerHTML=take.map(i=>cardHTML(COUNTRIES[i])).join('');
  bindFallbacks(grid);
 });
});
// при смене языка перевыборка карточек (та же дневная подборка, новые тексты)
window.addEventListener('alextur:lang',renderBlog);
