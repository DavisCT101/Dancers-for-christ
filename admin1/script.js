/* ===== CONFIG: edit these ===== */
const HERO_IMAGES=DFC.get('hero',DFC.defaults.hero); // managed from admin.html
const VERSES=[["Let them praise his name in the dance.","Psalm 149:3"],["Praise him with the timbrel and dance.","Psalm 150:4"],["Thou hast turned for me my mourning into dancing.","Psalm 30:11"],["David danced before the Lord with all his might.","2 Samuel 6:14"],["A time to weep, and a time to laugh; a time to mourn, and a time to dance.","Ecclesiastes 3:4"],["Then shall the virgin rejoice in the dance.","Jeremiah 31:13"],["The Lord thy God will rejoice over thee with singing.","Zephaniah 3:17"],["This is the day which the Lord hath made; we will rejoice and be glad in it.","Psalm 118:24"],["O sing unto the Lord a new song.","Psalm 96:1"],["Whatsoever ye do, do it heartily, as to the Lord.","Colossians 3:23"]];
const $=s=>document.querySelector(s),esc=DFC.esc,safe=DFC.safe;
let updates=DFC.get('u',DFC.defaults.u),albums=DFC.get('a',DFC.defaults.a);
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
 ct.innerHTML=updates.map(u=>`<div class="sl"><div class="im" style="${safe(u.i)?`background-image:url('${safe(u.i)}')`:''}"></div><h3>${esc(u.t)}</h3><p>${esc(u.d||'')}</p></div>`).join('');
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
 a.innerHTML=albums.length?albums.map(x=>`<a class="al" href="${esc(safe(x.g)||'#')}" target="_blank" rel="noopener"><div class="im" style="${safe(x.i)?`background-image:url('${safe(x.i)}')`:''}"></div><div class="t"><h3>${esc(x.t)}</h3><span>View album</span></div></a>`).join(''):'<div class="empty">No albums yet.</div>'}
renderUpdates();renderAlbums();auto();
/* Nav */
$('#burger').onclick=()=>{const o=$('#links').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
$('#links').onclick=()=>$('#links').classList.remove('open');
$('#theme').onclick=()=>{const r=document.documentElement,l=r.dataset.theme==='light'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme:light)').matches);r.dataset.theme=l?'dark':'light'};
const secs=['home','updates','songs','contact'].map(i=>document.getElementById(i));
addEventListener('scroll',()=>{let cur='home';secs.forEach(s=>{if(s.getBoundingClientRect().top<200)cur=s.id});document.querySelectorAll('.links a').forEach(a=>a.classList.toggle('on',a.hash==='#'+cur))},{passive:true});
$('#cf').onsubmit=e=>{e.preventDefault();const f=e.target.elements,m=DFC.get('msgs',[]);m.unshift({n:f[0].value,e:f[1].value,m:f[2].value,t:Date.now(),r:false});DFC.set('msgs',m);$('#cm').textContent='Thank you! Your message has been sent to the DFC team.';e.target.reset()};
/* Admin lives in admin.html: triple-click the logo or open index.html#admin */
let clicks=0,ct0;$('#logo').onclick=()=>{clicks++;clearTimeout(ct0);ct0=setTimeout(()=>clicks=0,600);if(clicks>=3)location.href='admin.html'};
if(location.hash==='#admin')location.href='admin.html';
/* Join DFC: creates a pending member that the admin approves */
$('#joinBtn').onclick=e=>{e.preventDefault();$('#joinOv').classList.add('open')};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('.ov').classList.remove('open'));
$('#jf').onsubmit=e=>{e.preventDefault();const f=e.target.elements,M=DFC.get('members',[]);M.unshift({n:f[0].value,e:f[1].value,p:f[2].value,r:f[3].value,s:'pending',t:Date.now()});DFC.set('members',M);e.target.reset();$('#jm').textContent='Welcome to the family! The team will confirm your membership soon.'};
addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.ov.open').forEach(o=>o.classList.remove('open'))});
