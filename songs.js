/* songs.js: the songs section for the DFC website. Load it AFTER script.js. */
(() => {
    /* =====================================================================
       1) YOUR SONGS. Edit this list.
          t = title   a = artist   s = 'Friday' or 'Sunday'
          ap = Apple Music link (gives cover + 30s preview automatically)
          au = your own audio file   i = your own cover image   l = lyrics
       ===================================================================== */
    const DEMO = false; /* true = songs with no audio get a made-up test tune */
    const SONGS = [
        { t: 'You are good', a: 'ntokozo mambo', s: 'Friday', ap: 'https://music.apple.com/us/album/you-are-good/1885498087?i=1885498420', au: '', i: '', l: `` },
        { t: 'Good God', a: 'Minister GUc', s: 'Sunday', ap: 'https://music.apple.com/ke/song/good-god-feat-sunmisola-agbebi/1851888073', au: '', i: '', l: `` },
        { t: 'Niseme Nini', a: 'Dr ipyana', s: 'Sunday', ap: 'https://music.apple.com/ke/song/niseme-nini/1648016759', au: '', i: '', l: `` },
        { t: 'Umenipendelea', a: 'Henrick Mruma', s: 'Friday', ap: 'https://music.apple.com/ke/song/umenipendelea-feat-eliya-mwantondo/1841297776', au: '', i: '', l: `` },
        { t: 'Ninakuamini', a: 'Boaz Danken', s: 'Sunday', ap: 'https://music.apple.com/ke/song/ninakuamini-live/1851791954', au: '', i: '', l: `` },
        { t: 'Have you seen', a: 'Judikay', s: 'Sunday', ap: 'https://music.apple.com/us/music-video/have-you-seen/1839876935', au: '', i: '', l: `` },
        { t: 'I never seen any God like you', a: 'Emirate stixx', s: 'Sunday', ap: 'https://music.apple.com/ke/song/i-never-see-any-god-like-you/1769968016', au: '', i: '', l: `` },
        { t: 'This kind God another one no dey', a: 'Gabriel Eziashi', s: 'Sunday', ap: 'https://music.apple.com/ke/song/this-kind-god/1511641159', au: '', i: '', l: `` },
        { t: 'Mercy', a: 'Moses Bliss', s: 'Sunday', ap: 'https://music.apple.com/ke/song/mercy/1792850058', au: '', i: '', l: `` },
        { t: 'Eze ebube', a: 'Neon adejo', s: 'Sunday', ap: 'https://music.apple.com/ke/song/eze-ebube/1763136846', au: '', i: '', l: `` },
        { t: 'No one like you', a: 'Eben', s: 'Sunday', ap: '', au: 'songs/No One Like You - Ft Nathaniel Bassey.mp3', i: '', l: `` }
    ];

    /* =====================================================================
       2) HELPERS: made-up covers/tunes and the Apple Music lookup
       ===================================================================== */
    const PAL = [['#7a1f2b', '#f5a30a'], ['#10243d', '#3aa0ff'], ['#2a0f3a', '#ff5fa2'], ['#0e3b2e', '#f5c542'], ['#3b1020', '#ff8a3d'], ['#16213e', '#7fe3e3']];
    function makeCover(s, k) {
        const c = document.createElement('canvas'); c.width = c.height = 700; const x = c.getContext('2d'), [a, b] = PAL[k % PAL.length];
        const g = x.createLinearGradient(0, 0, 700, 700); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, 700, 700);
        x.globalAlpha = .18; x.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(120 + i * 140, 120 + ((i * 97 + k * 61) % 460), 70 + i * 22, 0, 7); x.fill() }
        x.globalAlpha = .25; x.fillStyle = '#000'; x.save(); x.translate(350, 350); x.rotate(-.5); x.fillRect(-600, -30, 1200, 60); x.restore(); x.globalAlpha = 1;
        x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = 'italic 64px "Playfair Display",Georgia,serif';
        let lines = [], l = ''; (s.t || '').split(' ').forEach(t => { if ((l + ' ' + t).trim().length > 12 && l) { lines.push(l); l = t } else l = (l + ' ' + t).trim() }); lines.push(l);
        lines.forEach((t, i) => x.fillText(t, 350, 330 - (lines.length - 1) * 34 + i * 74));
        x.font = '500 22px Outfit,sans-serif'; x.globalAlpha = .8; x.fillText('DANCERS FOR CHRIST  ·  ' + (s.s || '').toUpperCase(), 350, 640);
        return c.toDataURL('image/jpeg', .82)
    }
    function makeTune(k) {
        const sr = 16000, dur = 22, n = sr * dur, pcm = new Int16Array(n), beat = .42 + .05 * (k % 3);
        const prog = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]], rot = [0, 2, 5, 7, 9, 4][k % 6], mf = m => 440 * Math.pow(2, (m - 69 + rot) / 12);
        for (let i = 0; i < n; i++) {
            const t = i / sr, b = t / beat, ch = prog[Math.floor(b / 4) % 4], q = b * 2, ni = Math.floor(q) % 4, tn = q % 1, note = [ch[0], ch[1], ch[2], ch[1] + 12][ni];
            const env = Math.exp(-tn * 3.2) * Math.min(tn * 60, 1), arp = Math.sin(6.2832 * mf(note) * t) * env * .42, pad = (Math.sin(6.2832 * mf(ch[0] - 12) * t) + .6 * Math.sin(6.2832 * mf(ch[2] - 12) * t)) * .12;
            const fade = Math.min(t / .4, (dur - t) / .8, 1); pcm[i] = Math.max(-1, Math.min(1, (arp + pad) * fade)) * 30000
        }
        const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf), W = (o, s) => [...s].forEach((c, j) => v.setUint8(o + j, c.charCodeAt(0)));
        W(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); W(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); W(36, 'data'); v.setUint32(40, n * 2, true);
        new Int16Array(buf, 44).set(pcm); return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))
    }
    function jsonp(url) {
        return new Promise((ok, no) => {
            const cb = 'cb' + Math.random().toString(36).slice(2), s = document.createElement('script');
            window[cb] = d => { ok(d); s.remove(); delete window[cb] }; s.onerror = () => { no(); s.remove() }; s.src = url + '&callback=' + cb; document.head.appendChild(s)
        })
    }
    async function fromApple(link) {
        const id = (link.match(/[?&]i=(\d+)/) || link.match(/\/(\d+)(?:[?#]|$)/) || [])[1], cc = (link.match(/music\.apple\.com\/([a-z]{2})\//) || [])[1] || 'us';
        const d = await jsonp(`https://itunes.apple.com/lookup?id=${id}&entity=song&country=${cc}`);
        const t = d.results.find(r => r.previewUrl) || {}, c = d.results[0] || {};
        return { au: t.previewUrl || '', i: (c.artworkUrl100 || t.artworkUrl100 || '').replace('100x100bb', '800x800bb'), a: c.artistName || '', t: c.collectionName || t.trackName || '' }
    }

    /* =====================================================================
       3) THE PLAYER
          - Before Play is pressed the section is one screen long, so scrolling
            simply carries on down to the Albums.
          - After Play, the section pins and scrolling moves through the songs.
       ===================================================================== */
    const $ = s => document.querySelector(s), FADE = 1800;
    const sec = $('#songs'), stack = $('#sgStack'), bgs = $('#sgBgs'), now = $('#now');
    if (!sec) return;
    const P = [new Audio(), new Audio()]; P.forEach(a => a.preload = 'auto');
    let all = [], list = [], filt = 'all', cur = 0, on = false, unlocked = false, url0 = '', raf = 0, idx = -1, pi = 0, f = 0, vis = false, adv = false, recs = [], bgEls = [];
    const pad = n => String(n).padStart(2, '0'), clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    async function prepare() {
        all = await Promise.all(SONGS.map(async (s, k) => {
            const x = { ...s, t: s.t || '', a: s.a || '' };
            if (s.ap) { try { const r = await fromApple(s.ap); x.au = x.au || r.au; x.i = x.i || r.i; x.a = x.a || r.a; x.t = x.t || r.t } catch (e) { console.warn('Apple lookup failed for', s.t, e) } }
            return { ...x, i: x.i || makeCover(x, k), au: x.au || (DEMO ? makeTune(k) : '') }
        }))
    }
    function setHeight() { sec.style.height = unlocked ? `calc(100svh + ${Math.max(list.length - 1, 0) * 80}svh)` : '100svh'; sec.classList.toggle('live', unlocked) }
    function target() { const r = sec.getBoundingClientRect(), range = sec.offsetHeight - innerHeight; if (!unlocked || list.length < 2 || range <= 0) return 0; return clamp(-r.top / range, 0, 1) * (list.length - 1) }
    function build() {
        list = filt === 'all' ? all : all.filter(s => s.s === filt);
        stack.textContent = ''; bgs.textContent = '';
        recs = list.map((s, i) => { const d = document.createElement('div'); d.className = 'rec'; d.dataset.i = i; d.setAttribute('aria-label', s.t); if (s.i) d.style.backgroundImage = `url("${s.i}")`; stack.appendChild(d); return d });
        bgEls = list.map(s => { const d = document.createElement('div'); d.className = 'sg-bg'; if (s.i) d.style.backgroundImage = `url("${s.i}")`; bgs.appendChild(d); return d });
        setHeight();
        $('#sgCount').textContent = `This week's songs / ${list.length} ${list.length === 1 ? 'song' : 'songs'}`;
        const art = [...new Set(all.map(s => s.a).filter(Boolean))]; if (!art.length) art.push('DFC Worship Team');
        const mq = $('#sgMq'); mq.textContent = ''; for (let r = 0; r < 2; r++)art.forEach(a => { const s = document.createElement('span'); s.textContent = a; const b = document.createElement('b'); b.textContent = '✶'; mq.append(s, b) });
        idx = -1; f = target(); place()
    }
    function place() {
        const S = stack.offsetWidth, n = list.length;
        recs.forEach((r, i) => {
            const d = i - f, a = Math.abs(d), y = d < 0 ? d * S * 1.5 : Math.min(d, 2) * S * .95, sc = 1 - Math.min(a, 1) * .6, rot = clamp(d * 5, -10, 10), op = d < 0 ? clamp(1 + d * 1.5, 0, 1) : clamp(1 - d * .55, 0, 1);
            r.style.transform = `translate3d(0,${y}px,0) rotate(${rot}deg) scale(${sc})`; r.style.opacity = op; r.style.zIndex = 50 - Math.round(a * 10); r.style.pointerEvents = unlocked && op > .2 ? 'auto' : 'none';
            bgEls[i].style.opacity = clamp(1 - a, 0, 1) * .95
        });
        const act = n ? clamp(Math.round(f), 0, n - 1) : -1;
        if (act !== idx) { idx = act; ui(); if (on && idx >= 0) crossTo(idx) }
        $('#sgRing').style.strokeDashoffset = 1 - (n > 1 ? f / (n - 1) : 1)
    }
    function ui() {
        const s = list[idx], m = $('#sgMeta'); m.classList.remove('in'); void m.offsetWidth; m.classList.add('in');
        if (!s) { $('#sgYear').textContent = ''; $('#sgTitle').textContent = 'No songs yet'; $('#sgKind').textContent = 'Check back soon for this week’s songs.'; $('#sgNo').textContent = '00'; return pui() }
        $('#sgYear').textContent = s.s + ' service'; $('#sgTitle').textContent = s.t; $('#sgKind').textContent = (s.a || 'DFC Worship Team') + (s.au ? '' : ' · audio coming soon'); $('#sgNo').textContent = pad(idx + 1); $('#nowT').textContent = s.t;
        if ('mediaSession' in navigator && window.MediaMetadata) navigator.mediaSession.metadata = new MediaMetadata({ title: s.t, artist: s.a || 'DFC' }); pui()
    }
    function pui() { $('#sgPlay').textContent = on ? 'Pause ❚❚' : 'Play ▶'; $('#nowBtn').textContent = on ? 'Pause' : 'Play'; $('#wf').classList.toggle('playing', on); now.hidden = !(vis || on) }

    /* The crossfade: one player fades out while the other fades in */
    function crossTo(i) {
        const s = list[i]; if (!s) return; pi = i; $('#nowT').textContent = s.t; const url = s.au; if (url && url === url0) return;
        cancelAnimationFrame(raf); adv = false; const out = P[cur], inn = P[1 - cur], ov = out.volume, t0 = performance.now();
        if (url) { inn.src = url; inn.currentTime = 0; inn.volume = 0; inn.play().catch(() => { }); cur = 1 - cur } url0 = url;
        (function step(t) { const p = Math.min((t - t0) / FADE, 1); out.volume = ov * (1 - p); if (url) inn.volume = p; if (p < 1) raf = requestAnimationFrame(step); else out.pause() })(t0)
    }
    function toggle() {
        const s = list[idx]; if (!s) return;
        if (on) { on = false; P.forEach(a => a.pause()) }
        else {
            on = true;
            if (!unlocked) { unlocked = true; setHeight(); const r = sec.getBoundingClientRect(); if (Math.abs(r.top) > 4) scrollTo({ top: r.top + scrollY, behavior: 'smooth' }) } /* unlock scrolling through songs */
            if (s.au && s.au === url0) P[cur].play().catch(() => { }); else { url0 = ''; crossTo(idx) }
        }
        pui()
    }
    function goTo(i) {
        if (!unlocked || i < 0 || i >= list.length) return false; const r = sec.getBoundingClientRect(), range = sec.offsetHeight - innerHeight;
        scrollTo({ top: r.top + scrollY + (list.length > 1 ? i / (list.length - 1) * range : 0), behavior: 'smooth' }); return true
    }
    /* Move to the next song. If the visitor has scrolled away from this section, crossfade without yanking the page back. */
    function advance() { if (vis) return goTo(idx + 1); const n = pi + 1; if (n < list.length) { crossTo(n); return true } return false }

    P.forEach(a => {
        a.ontimeupdate = () => {
            if (a !== P[cur]) return; const d = a.duration || 0; $('#nowBar').style.width = d ? a.currentTime / d * 100 + '%' : '0';
            if (on && d && d - a.currentTime < FADE / 1000 + .3 && !adv) { adv = true; advance() }
        };
        a.onended = () => { if (a === P[cur] && !advance()) { on = false; pui() } }
    });
    $('#sgPlay').onclick = toggle; $('#nowBtn').onclick = toggle;
    $('#sgLyr').onclick = () => { const s = list[idx]; if (!s) return; $('#lyT').textContent = s.t; $('#lyB').textContent = s.l || 'Lyrics have not been added for this song yet.'; $('#lyOv').classList.add('open') };
    $('#lyX').onclick = () => $('#lyOv').classList.remove('open');
    $('#lyOv').onclick = e => { if (e.target.id === 'lyOv') e.target.classList.remove('open') };
    addEventListener('keydown', e => { if (e.key === 'Escape') $('#lyOv').classList.remove('open') });
    stack.onclick = e => { const r = e.target.closest('.rec'); if (r) goTo(+r.dataset.i) };
    $('#sgTabs').onclick = e => { const v = e.target.dataset.f; if (!v) return; filt = v; document.querySelectorAll('#sgTabs button').forEach(b => b.classList.toggle('on', b === e.target)); build() };
    new IntersectionObserver(es => { vis = es[0].isIntersecting; pui() }, { rootMargin: '120px' }).observe(sec);
    addEventListener('resize', place);
    function start() { prepare().then(() => { build(); (function tick() { requestAnimationFrame(tick); if (!vis) return; const t = target(); f += (t - f) * .14; if (Math.abs(t - f) < .001) f = t; place() })() }) }
    Promise.race([document.fonts ? document.fonts.load('italic 64px "Playfair Display"') : 0, new Promise(r => setTimeout(r, 1500))]).then(start, start);
})();