/* ===== CONFIG: edit these ===== */
const HERO_IMAGES = ["assets/images/img1.jpg", "assets/images/img2.jpg", "assets/images/img3.jpg", "assets/images/img4.jpg", "assets/images/img5.jpg", "assets/images/img6.jpg", "assets/images/img7.jpg", "assets/images/img8.jpg", "assets/images/img9.jpg", "assets/images/img10.jpg", "assets/images/img11.jpg", "assets/images/img12.jpg", "assets/images/img13.jpg", "assets/images/img14.jpg",];
const VERSES = [["Let them praise his name in the dance.", "Psalm 149:3"], ["Praise him with the timbrel and dance.", "Psalm 150:4"], ["Thou hast turned for me my mourning into dancing.", "Psalm 30:11"], ["David danced before the Lord with all his might.", "2 Samuel 6:14"], ["A time to weep, and a time to laugh; a time to mourn, and a time to dance.", "Ecclesiastes 3:4"], ["Then shall the virgin rejoice in the dance.", "Jeremiah 31:13"], ["The Lord thy God will rejoice over thee with singing.", "Zephaniah 3:17"], ["This is the day which the Lord hath made; we will rejoice and be glad in it.", "Psalm 118:24"], ["O sing unto the Lord a new song.", "Psalm 96:1"], ["Whatsoever ye do, do it heartily, as to the Lord.", "Colossians 3:23"]];
const $ = s => document.querySelector(s);
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d } catch (e) { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } } };

let updates = store.get('dfc_u', [ { t: 'Bible Study', d: 'Monday, 7:00-8:00, Lh32', i: 'assets/updates/t5.jpeg' },
  { t: 'Inreach Evangelism', d: 'Wednesday, 6:50pm-8:00, Pavilion', i: 'assets/updates/t1.jpeg' },
  { t: 'Annual General Meeting', d: 'Sunday, 4:00pm-6:00, Mainhall', i: 'assets/updates/t4.jpeg' },
  { t: 'Being the doers of the word', d: 'Wenesday, 7pm, Mainhall', i: 'assets/updates/t7.jpeg' },
  { t: 'The wells of salvation', d: 'Wensday, 5:50pm, Mainhall', i: 'assets/updates/t6.jpeg' },
  { t: 'Intercessory Prayers', d: 'Sunday, 7am, Mainhall', i: 'assets/updates/sun3.jpeg' },
  { t: 'Congratulations to our new leaders', d: 'Grace, wisdom and persevirance be upon them', i: 'assets/updates/t.jpeg' }]);

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safe = u => /^(https?:\/\/[^\s'"()]+|[\w\-./%]+)$/.test(u || '') ? u : '';

/* Scripture of the day */
const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5), v = VERSES[day % VERSES.length];
$('#vt').textContent = '“' + v[0] + '”'; $('#vr').textContent = v[1];

/* Hero diagonal grid */
(function () {
  const g = $('#grid'), pal = ['#7a1f2b', '#f5a30a', '#3b1020', '#c46a00', '#5a1a2a', '#e08a00'];
  for (let c = 0; c < 5; c++) {
    const col = document.createElement('div'); col.className = 'col'; const tr = document.createElement('div'); tr.className = 'track';
    let h = ''; for (let r = 0; r < 2; r++)for (let i = 0; i < 6; i++) {
      const k = c * 6 + i, img = safe(HERO_IMAGES[k % Math.max(HERO_IMAGES.length, 1)]);
      h += img ? `<div class="tile" style="background-image:url('${img}')"></div>` : `<div class="tile ph" style="background:linear-gradient(${120 + k * 25}deg,${pal[k % 6]},${pal[(k + 2) % 6]})"></div>`
    }
    tr.innerHTML = h; col.appendChild(tr); g.appendChild(col)
  }
})();

/* Updates carousel */
let idx = 0, timer, pv = 3;
function renderUpdates() {
  const ct = $('#ct');
  if (!updates.length) { ct.innerHTML = '<div class="empty" style="width:100%">No updates yet. Check back soon.</div>'; $('#dots').innerHTML = ''; return }
ct.innerHTML = updates.map(u => {
  const imgSrc = safe(u.i);
  const styleAttr = imgSrc ? `style="--bg-img: url('${esc(imgSrc)}')"` : '';
  const imgTag = imgSrc ? `<img src="${esc(imgSrc)}" alt="${esc(u.t)}">` : '';
  return `<div class="sl"><div class="im" ${styleAttr}>${imgTag}</div><h3>${esc(u.t)}</h3><p>${esc(u.d || '')}</p></div>`;
}).join('');
  pv = innerWidth < 640 ? 1 : innerWidth < 1000 ? 2 : 3; ct.style.setProperty('--pv', pv); go(0)
}
function go(i) {
  const n = Math.max(updates.length - pv + 1, 1); idx = (i + n) % n; $('#ct').style.transform = `translateX(${-idx * 100 / pv}%)`;
  $('#dots').innerHTML = Array.from({ length: n }, (_, k) => `<button class="${k === idx ? 'on' : ''}" aria-label="Slide ${k + 1}" data-i="${k}"></button>`).join('')
}
function auto() { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) timer = setInterval(() => go(idx + 1), 4200) }
$('#dots').onclick = e => { if (e.target.dataset.i) { go(+e.target.dataset.i); auto() } };
let sx = null; const car = $('#car');
car.addEventListener('pointerdown', e => { sx = e.clientX });
car.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 40) { go(idx + (e.clientX < sx ? 1 : -1)); auto() } sx = null });
addEventListener('resize', renderUpdates);

function renderAlbums() {
  const a = $('#albums');
  a.innerHTML = albums.length ? albums.map(x => `<a class="al" href="${esc(safe(x.g) || '#')}" target="_blank" rel="noopener"><div class="im" style="${safe(x.i) ? `background-image:url('${esc(x.i)}')` : ''}"></div><div class="t"><h3>${esc(x.t)}</h3><span>View album</span></div></a>`).join('') : '<div class="empty">No albums yet.</div>'
}

renderUpdates(); renderAlbums(); auto();

/* Nav */
$('#burger').onclick = () => { const o = $('#links').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o) };
$('#links').onclick = () => $('#links').classList.remove('open');
$('#theme').onclick = () => { const r = document.documentElement, l = r.dataset.theme === 'light' || (!r.dataset.theme && matchMedia('(prefers-color-scheme:light)').matches); r.dataset.theme = l ? 'dark' : 'light' };
const secs = ['home', 'updates', 'songs', 'contact'].map(i => document.getElementById(i));
addEventListener('scroll', () => { let cur = 'home'; secs.forEach(s => { if (s.getBoundingClientRect().top < 200) cur = s.id }); document.querySelectorAll('.links a').forEach(a => a.classList.toggle('on', a.hash === '#' + cur)) }, { passive: true });
// $('#cf').onsubmit = e => { e.preventDefault(); $('#cm').textContent = 'Message ready. Connect this form to your email service to send it.'; e.target.reset() };
/* Contact Form AJAX submission with on-page confirmation */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = $('#cf');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault(); // 100% stops page reload/redirect
      
      const msgBox = $('#cm');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      
      msgBox.textContent = 'Sending message...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          msgBox.textContent = '✅ Success! Your message has been sent.';
          contactForm.reset(); // Clears the inputs
        } else {
          msgBox.textContent = '❌ ' + (data.message || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        msgBox.textContent = '❌ Network error. Please check your connection.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});