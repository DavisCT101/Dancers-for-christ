/* ===== CONFIG: edit these ===== */
const ADMIN={user:'admin',pass:'dfc2026'}; // demo only: front-end credentials are visible in source
const HERO_IMAGES=["assets/images/img1.jpg", "assets/images/img2.jpg","assets/images/img3.jpg","assets/images/img4.jpg","assets/images/img5.jpg","assets/images/img6.jpg","assets/images/img7.jpg","assets/images/img8.jpg","assets/images/img9.jpg","assets/images/img10.jpg","assets/images/img11.jpg","assets/images/img12.jpg","assets/images/img13.jpg","assets/images/img14.jpg",]; // paste direct image URLs here (Google Photos share links can't be hotlinked; export or upload the photos and use their file URLs)
const VERSES=[["Let them praise his name in the dance.","Psalm 149:3"],["Praise him with the timbrel and dance.","Psalm 150:4"],["Thou hast turned for me my mourning into dancing.","Psalm 30:11"],["David danced before the Lord with all his might.","2 Samuel 6:14"],["A time to weep, and a time to laugh; a time to mourn, and a time to dance.","Ecclesiastes 3:4"],["Then shall the virgin rejoice in the dance.","Jeremiah 31:13"],["The Lord thy God will rejoice over thee with singing.","Zephaniah 3:17"],["This is the day which the Lord hath made; we will rejoice and be glad in it.","Psalm 118:24"],["O sing unto the Lord a new song.","Psalm 96:1"],["Whatsoever ye do, do it heartily, as to the Lord.","Colossians 3:23"]];
const $=s=>document.querySelector(s);
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let updates=store.get('dfc_u',[{t:'Prayer Kesha',d:'Friday, 7pm, Mainhall',i:'assets/updates/sun.jpeg'},{t:'The Fruit of the spirit',d:'Wednesday, 5:50pm, LH 24', i:'assets/updates/sun1.jpeg'},{t:'Evangelism',d:'Friday, 6:50pm, Pavilion', i:'assets/updates/sun4.jpeg'},{t:'Intercessory Prayers',d:'Sunday, 7am, Mainhall', i:'assets/updates/sun3.jpeg'}]);
let albums=store.get('dfc_a',[{t:'Creative Night',i:'assets/images/img15.jpg',g:'https://photos.app.goo.gl/YNw3VYgW5zLePnJZ9'}]);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 safe=u=>/^(https?:\/\/[^\s'"()]+|[\w\-./%]+)$/.test(u||'')?u:''; // allows web links or files in the images/ folder
/* Scripture of the day */
const day=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5),v=VERSES[day%VERSES.length];
$('#vt').textContent='“'+v[0]+'”';$('#vr').textContent=v[1];
/* Hero diagonal grid: columns 1 & 3 move up, 2 & 4 move down */
(function(){const g=$('#grid'),pal=['#7a1f2b','#f5a30a','#3b1020','#c46a00','#5a1a2a','#e08a00'];
 for(let c=0;c<5;c++){const col=document.createElement('div');col.className='col';const tr=document.createElement('div');tr.className='track';
  let h='';for(let r=0;r<2;r++)for(let i=0;i<6;i++){const k=c*6+i,img=safe(HERO_IMAGES[k%Math.max(HERO_IMAGES.length,1)]);
   h+=img?`<div class="tile" style="background-image:url('${img}')"></div>`:`<div class="tile ph" style="background:linear-gradient(${120+k*25}deg,${pal[k%6]},${pal[(k+2)%6]})"></div>`}
  tr.innerHTML=h;col.appendChild(tr);g.appendChild(col)}})();
/* Updates carousel */
let idx=0,timer,pv=3;
function renderUpdates(){const ct=$('#ct');
 if(!updates.length){ct.innerHTML='<div class="empty" style="width:100%">No updates yet. Check back soon.</div>';$('#dots').innerHTML='';return}
 ct.innerHTML=updates.map(u=>`<div class="sl"><div class="im" style="${safe(u.i)?`background-image:url('${esc(u.i)}')`:''}"></div><h3>${esc(u.t)}</h3><p>${esc(u.d||'')}</p></div>`).join('');
 pv=innerWidth<640?1:innerWidth<1000?2:3;ct.style.setProperty('--pv',pv);go(0)}
function go(i){const n=Math.max(updates.length-pv+1,1);idx=(i+n)%n;$('#ct').style.transform=`translateX(${-idx*100/pv}%)`;
 $('#dots').innerHTML=Array.from({length:n},(_,k)=>`<button class="${k===idx?'on':''}" aria-label="Slide ${k+1}" data-i="${k}"></button>`).join('')}
function auto(){clearInterval(timer);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)timer=setInterval(()=>go(idx+1),4200)}
$('#dots').onclick=e=>{if(e.target.dataset.i){go(+e.target.dataset.i);auto()}};
let sx=null;const car=$('#car');
car.addEventListener('pointerdown',e=>{sx=e.clientX});
car.addEventListener('pointerup',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>40){go(idx+(e.clientX<sx?1:-1));auto()}sx=null});
addEventListener('resize',renderUpdates);
function renderAlbums(){const a=$('#albums');
 a.innerHTML=albums.length?albums.map(x=>`<a class="al" href="${esc(safe(x.g)||'#')}" target="_blank" rel="noopener"><div class="im" style="${safe(x.i)?`background-image:url('${esc(x.i)}')`:''}"></div><div class="t"><h3>${esc(x.t)}</h3><span>View album</span></div></a>`).join(''):'<div class="empty">No albums yet.</div>'}
renderUpdates();renderAlbums();auto();
/* Nav */
$('#burger').onclick=()=>{const o=$('#links').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
$('#links').onclick=()=>$('#links').classList.remove('open');
$('#theme').onclick=()=>{const r=document.documentElement,l=r.dataset.theme==='light'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme:light)').matches);r.dataset.theme=l?'dark':'light'};
const secs=['home','updates','contact'].map(i=>document.getElementById(i));
addEventListener('scroll',()=>{let cur='home';secs.forEach(s=>{if(s.getBoundingClientRect().top<200)cur=s.id});document.querySelectorAll('.links a').forEach(a=>a.classList.toggle('on',a.hash==='#'+cur))},{passive:true});
$('#cf').onsubmit=e=>{e.preventDefault();$('#cm').textContent='Message ready. Connect this form to your email service to send it.';e.target.reset()};
/* Admin: no visible button. Triple-click the logo or visit #admin */
let clicks=0,ct0;$('#logo').onclick=()=>{clicks++;clearTimeout(ct0);ct0=setTimeout(()=>clicks=0,600);if(clicks>=3){clicks=0;openAdmin()}};
function isAdmin(){try{return sessionStorage.getItem('dfc_admin')==='1'}catch(e){return window._ad===true}}
function setAdmin(v){try{sessionStorage.setItem('dfc_admin',v?'1':'0')}catch(e){window._ad=v}document.body.classList.toggle('admin',v)}
function openAdmin(){isAdmin()?openPanel():$('#loginOv').classList.add('open')}
function openPanel(){listAdmin();$('#panelOv').classList.add('open')}
if(location.hash==='#admin')openAdmin();addEventListener('hashchange',()=>{if(location.hash==='#admin')openAdmin()});
setAdmin(isAdmin());$('#adminChip').onclick=openPanel;
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('.ov').classList.remove('open'));
$('#lf').onsubmit=e=>{e.preventDefault();if($('#lu').value===ADMIN.user&&$('#lp').value===ADMIN.pass){setAdmin(true);$('#loginOv').classList.remove('open');$('#lp').value='';$('#lm').textContent='';openPanel()}else $('#lm').textContent='Wrong username or password.'};
$('#out').onclick=()=>{setAdmin(false);$('#panelOv').classList.remove('open')};
function listAdmin(){$('#ul').innerHTML=updates.map((u,i)=>`<div class="row"><span>${esc(u.t)}</span><button data-u="${i}">Delete</button></div>`).join('');
 $('#al').innerHTML=albums.map((u,i)=>`<div class="row"><span>${esc(u.t)}</span><button data-a="${i}">Delete</button></div>`).join('')}
$('#panelOv').addEventListener('click',e=>{const d=e.target.dataset;if(d.u!==undefined)updates.splice(+d.u,1);else if(d.a!==undefined)albums.splice(+d.a,1);else return;save()});
function save(){store.set('dfc_u',updates);store.set('dfc_a',albums);listAdmin();renderUpdates();renderAlbums()}
$('#uf').onsubmit=e=>{e.preventDefault();updates.unshift({t:$('#ut').value,d:$('#ud').value,i:$('#ui').value});e.target.reset();save()};
$('#af').onsubmit=e=>{e.preventDefault();albums.unshift({t:$('#at').value,i:$('#ai').value,g:$('#ag').value});e.target.reset();save()};
addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.ov.open').forEach(o=>o.classList.remove('open'))});
