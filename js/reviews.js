// Отзывы: витринные — на языке клиента (оригинал, не переводим);
// форма и свежие отзывы — по языку сайта через I18N.
const SITE_REVIEWS = [
 {n:'Ксения',c:'Санкт-Петербург',t:'«Рим в 15:15 в мини-группе»',d:'октябрь 2025',x:'Прилетели утром, к 15:15 доехали до площади Венеции — и правильно сделали: после прогулки с Ириной мы уже сами бегали по Риму, как местные. Идеальное первое свидание с городом!'},
 {n:'Паоло и Джулия',c:'Милан',t:'«Россия целиком»',d:'декабрь 2024',x:'Мечтали увидеть снег и Красную площадь в декабре. ALEXtur сам получил нам визы, забронировал поезд Москва—Питер и нашёл ресторан, где нас научили правильно есть пельмени. Возвращаемся летом — теперь на Байкал.'},
 {n:'Семья Коваленко',c:'Новосибирск',t:'Италия на любой кошелёк',d:'сентябрь 2025',x:'Собрали поездку на пятерых: мы, двое детей и бабушка. Пешком, на региональных поездах, в недорогих и очень вкусных местах — уложились в сумму на 40% меньше, чем просило первое встречное агентство.'},
 {n:'Роберто',c:'Турин',t:'«Италия от края до края»',d:'август 2025',x:'Мне, итальянцу, было уже стыдно не видеть собственную страну. Составили маршрут Милан—Палермо на две недели: горные перевалы и Сицилия в одном путешествии. Как будто заново открыл себя.'},
 {n:'Елена',c:'Москва',t:'«Рим в 15:15» Красный маршрут',d:'октябрь 2025',x:'Красный маршрут с Анной — 30 лет в городе чувствуется в каждом слове. Знала дворик, где фонтан Треви виден в отражении и без толпы. Лучшие фото поездки.'},
 {n:'Илья',c:'Казань',t:'«Персональная прогулка» Синий маршрут',d:'май 2025',x:'Брали индивидуально, чтобы муж-фотограф не торопил группу. Анастасия подстроила темп буквально под наш затвор. Синий маршрут — это Рим, которого нет на открытках.'}
,{n:'Ольга',c:'Екатеринбург',t:'«X15 | Рим»',d:'сентябрь 2025',x:'Я в Риме уже в четвёртый раз и думала, что знаю город. X15 сломал это мнение за два часа: задания, запахи, детали, скрытый двор у Кампо деи Фьори. Настя — волшебница.'},
 {n:'Марта',c:'Тренто, Италия',t:'«Рим со вкусом»',d:'июнь 2025',x:'С непереносимостью глютена боялась гастровыхода. Позвонила — и за неделю перестроили маршрут вокруг моей диеты. Безглютеновая пицца в Трастевере оказалась вкуснее обычной.'},
 {n:'Екатерина',c:'Нижний Новгород',t:'Визы и поддержка',d:'апрель 2025',x:'Шенген оформили без единой стрессовой минуты: проверили анкету, записали в визовый центр и страховку подобрали под маршрут. В Италии встретили уже у выхода из аэропорта.'},
 {n:'Лючия',c:'Неаполь',t:'Мир для итальянцев',d:'ноябрь 2024',x:'Дубай со всей семьёй: перелёты, отель, экскурсия на дюнах — однажды я просто легла спать, а утром всё было решено. Впервые отдыхала без ноутбука с планировщиком.'},
 {n:'Алексей',c:'Владивосток',t:'Италия ↔ Россия',d:'июль 2025',x:'Понял ALEXtur в Риме — и через год они же собрали свадебную поездку по Золотому кольцу для наших итальянских друзей. Расстояние им не помеха.'}
];
const KEY='alextur-reviews';
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
const store=a=>{try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}};
function card(r){
  const dir=r.t&&/^d[123]$/.test(r.t)?I18N.t('reviews.'+r.t):r.t;
  return '<figure><blockquote class="rev"><p>«'+esc(r.x)+'»</p><figcaption>'+
   '<span class="stars">'+'★'.repeat(r.s||5)+'</span> '+esc(r.n)+
   (r.c?' · '+esc(r.c):'')+(dir?' · '+esc(dir):'')+(r.d?' · '+esc(r.d):'')+
   (r.mod?' <span class="tag tag--soon">'+I18N.t('reviews.moderation')+'</span>':'')+'</figcaption></blockquote></figure>';
}
function renderAll(){
  const list=document.getElementById('reviews-list');
  if(!list) return;
  list.innerHTML=SITE_REVIEWS.map(card).join('');
  const mine=load(), wrap=document.getElementById('mine-wrap');
  if(wrap){
    wrap.hidden=!mine.length;
    const box=document.getElementById('reviews-mine');
    if(box) box.innerHTML=mine.map(r=>card({...r,mod:true})).join('');
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  renderAll();
  const form=document.getElementById('review-form');
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const err=document.getElementById('form-err');
    const name=form.name.value.trim(), mail=form.email.value.trim(),
          text=form.text.value.trim(), dir=form.dir.value,
          rating=Number(form.querySelector('input[name="rating"]:checked')?.value||5);
    if(name.length<2){err.textContent=I18N.t('reviews.errname');return}
    if(!/^\S+@\S+\.\S+$/.test(mail)){err.textContent=I18N.t('reviews.errmail');return}
    if(text.length<20){err.textContent=I18N.t('reviews.errtext');return}
    if(!form.consent.checked){err.textContent=I18N.t('reviews.errconsent');return}
    err.textContent='';
    // TODO: подключить бэкенд (Formspree/Telegram-бот) — сейчас демо-хранилище
    const all=load();
    all.unshift({n:name,t:dir,s:rating,x:text,d:new Date().toLocaleDateString(I18N.lang()==='en'?'en-GB':'ru-RU'),status:'mod'});
    store(all); form.reset();
    const r5=form.querySelector('input[name="rating"][value="5"]'); if(r5) r5.checked=true;
    const ok=document.getElementById('form-ok'); if(ok) ok.hidden=false;
    renderAll();
    if(ok) ok.scrollIntoView({block:'center'});
  });
});
// при смене языка перевыставляем форму и свежие отзывы
window.addEventListener('alextur:lang',()=>{
  const ok=document.getElementById('form-ok');
  if(ok) ok.hidden=true;
  renderAll();
});
