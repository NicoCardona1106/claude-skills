// fx.js — utilidades de animación compartidas por las landings (sin dependencias).
// Cada función devuelve un cleanup() para llamar en componentWillUnmount.

// --- Presupuesto de motion (parche nc-design 2026-09-04) ---
// reducedMotion: si el usuario pide menos movimiento, los efectos continuos/decorativos no se montan
// (devuelven un cleanup vacío y el contenido queda visible y estático). Los canvases dibujan a 1x CSS px
// (por debajo del cap de DPR 1.5 de la skill) y en móvil (<=768px) cargan la mitad de partículas.
export const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isMobile = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
export const mobileCount = (n) => (isMobile() ? Math.ceil(n / 2) : n);

// Parallax con el mouse: elementos con [data-depth="0.4"] se desplazan en proporción a la profundidad.
export function parallax(root, { max = 28 } = {}) {
  if (reducedMotion) return () => {};
  if (!root) return () => {};
  const els = () => root.querySelectorAll('[data-depth]');
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const onMove = (e) => {
    const r = root.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); };
  const tick = () => {
    raf = 0;
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    els().forEach((el) => {
      const d = parseFloat(el.dataset.depth) || 0;
      const base = el.dataset.baseTransform || '';
      el.style.transform = `${base} translate3d(${(-cx * max * d).toFixed(2)}px, ${(-cy * max * d).toFixed(2)}px, 0)`;
    });
    if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(tick);
  };
  root.addEventListener('mousemove', onMove);
  root.addEventListener('mouseleave', onLeave);
  return () => { root.removeEventListener('mousemove', onMove); root.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(raf); };
}

// Scroll reveal: elementos con [data-reveal] (opcional data-reveal-delay="120") aparecen al entrar en viewport.
// El estado oculto se aplica desde JS, así el contenido nunca queda invisible si el script no carga.
export function reveal(root, { y = 36, duration = 900 } = {}) {
  if (!root) return () => {};
  const els = [...root.querySelectorAll('[data-reveal]')];
  const vh = window.innerHeight;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const delay = parseInt(el.dataset.revealDelay || '0', 10);
      el.style.transition = `opacity ${duration}ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(.2,.7,.2,1) ${delay}ms`;
      el.style.opacity = '1';
      el.style.transform = 'none';
      io.unobserve(el);
    });
  }, { threshold: 0.12 });
  els.forEach((el) => {
    if (el.getBoundingClientRect().top > vh * 0.9) {
      el.style.opacity = '0';
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    }
    io.observe(el);
  });
  return () => io.disconnect();
}

// Hover magnético: botones con [data-magnetic] siguen suavemente al cursor.
export function magnetic(root, { strength = 0.35 } = {}) {
  if (reducedMotion) return () => {};
  if (!root) return () => {};
  const handlers = [];
  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transition = 'transform .15s ease-out';
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => { el.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1.4)'; el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave);
    handlers.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); });
  });
  return () => handlers.forEach((h) => h());
}

// Tilt 3D: tarjetas con [data-tilt] rotan hacia el cursor.
export function tilt(root, { max = 10 } = {}) {
  if (reducedMotion) return () => {};
  if (!root) return () => {};
  const handlers = [];
  root.querySelectorAll('[data-tilt]').forEach((el) => {
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform .12s ease-out';
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
    };
    const leave = () => { el.style.transition = 'transform .6s cubic-bezier(.2,.7,.2,1)'; el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'; };
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave);
    handlers.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); });
  });
  return () => handlers.forEach((h) => h());
}

// Máquina de escribir: escribe y borra frases en bucle. onTick(textoActual).
export function typewriter(phrases, onTick, { speed = 55, erase = 28, hold = 1600 } = {}) {
  if (reducedMotion) { onTick(phrases[0] || ''); return () => {}; }
  let i = 0, len = 0, dir = 1, t = 0, alive = true;
  const step = () => {
    if (!alive) return;
    const p = phrases[i % phrases.length];
    len += dir;
    onTick(p.slice(0, len));
    let wait = dir > 0 ? speed : erase;
    if (dir > 0 && len >= p.length) { dir = -1; wait = hold; }
    else if (dir < 0 && len <= 0) { dir = 1; i++; wait = 400; }
    t = setTimeout(step, wait);
  };
  t = setTimeout(step, 400);
  return () => { alive = false; clearTimeout(t); };
}

// Progreso de scroll: cb(p) con p∈[0,1] mientras `el` cruza el viewport (0 = entra por abajo, 1 = sale por arriba).
// Con {sticky:true} mide el recorrido de un contenedor alto cuyo hijo es sticky (p = fracción recorrida).
export function scrollProgress(el, cb, { sticky = false } = {}) {
  if (reducedMotion) return () => {};
  if (!el) return () => {};
  let raf = 0;
  const tick = () => {
    raf = 0;
    const r = el.getBoundingClientRect(); const vh = window.innerHeight;
    const p = sticky ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
    cb(Math.min(1, Math.max(0, p)), r);
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
  tick();
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
}

// Scramble de texto: [data-scramble] se descifra letra a letra al entrar al viewport.
export function scramble(root, { duration = 1100, chars = '!<>-_\\/[]{}—=+*^?#0123456789' } = {}) {
  if (reducedMotion) return () => {};
  if (!root) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; const final = el.dataset.scramble || el.textContent; const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration); const n = Math.floor(final.length * p);
        el.textContent = final.slice(0, n) + final.slice(n).split('').map((c) => (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])).join('');
        if (p < 1) requestAnimationFrame(tick); else el.textContent = final;
      };
      requestAnimationFrame(tick); io.unobserve(el);
    });
  }, { threshold: 0.3 });
  root.querySelectorAll('[data-scramble]').forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// Imagen que sigue al cursor: al pasar sobre [data-follow="id"] se muestra #id (position:fixed) siguiendo el mouse.
export function cursorFollow(root) {
  if (reducedMotion) return () => {};
  if (!root) return () => {};
  const handlers = [];
  root.querySelectorAll('[data-follow]').forEach((el) => {
    const target = () => root.querySelector('#' + el.dataset.follow);
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, on = false;
    const loop = () => { const t = target(); if (!t) return; cx += (x - cx) * .18; cy += (y - cy) * .18; t.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%) rotate(${(x - cx) * .05}deg)`; if (on || Math.abs(x - cx) > .5) raf = requestAnimationFrame(loop); };
    const move = (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(loop); };
    const enter = (e) => { on = true; cx = x = e.clientX; cy = y = e.clientY; const t = target(); if (t) { t.style.opacity = '1'; t.style.scale = '1'; } };
    const leave = () => { on = false; const t = target(); if (t) { t.style.opacity = '0'; t.style.scale = '.8'; } };
    el.addEventListener('mouseenter', enter); el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave);
    handlers.push(() => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); cancelAnimationFrame(raf); });
  });
  return () => handlers.forEach((h) => h());
}

// Partículas continuas en un <canvas> que llena su contenedor. type: 'ember' | 'star' | 'petal' | 'bubble' | 'snow'
export function particles(canvas, { type = 'ember', count = 90, color = '255,170,80', speed = 1 } = {}) {
  if (reducedMotion) return () => {};
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, raf = 0, ps = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const spawn = (p = {}) => Object.assign(p, { x: rnd(0, w), y: type === 'bubble' || type === 'ember' ? rnd(h, h + 100) : rnd(-100, h), s: rnd(type === 'petal' ? 6 : 1, type === 'petal' ? 14 : type === 'star' ? 2.2 : 4), vx: rnd(-.3, .3) * speed, vy: (type === 'bubble' || type === 'ember' ? -rnd(.3, 1.2) : type === 'star' ? 0 : rnd(.4, 1.4)) * speed, a: rnd(.2, .9), r: rnd(0, Math.PI * 2), vr: rnd(-.02, .02), t: rnd(0, 100) });
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); w = canvas.width = r.width; h = canvas.height = r.height; if (!ps.length) ps = Array.from({ length: mobileCount(count) }, () => spawn()); };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of ps) {
      p.t += .02; p.x += p.vx + Math.sin(p.t) * .3; p.y += p.vy; p.r += p.vr;
      const tw = type === 'star' ? .5 + .5 * Math.sin(p.t * 2) : 1;
      ctx.globalAlpha = p.a * tw; ctx.fillStyle = `rgb(${color})`;
      if (type === 'petal') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .55, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      else if (type === 'bubble') { ctx.strokeStyle = `rgb(${color})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 2, 0, Math.PI * 2); ctx.stroke(); }
      else if (type === 'snow') { const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 2.2); g.addColorStop(0, `rgba(${color},${p.a})`); g.addColorStop(1, `rgba(${color},0)`); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 2.2, 0, Math.PI * 2); ctx.fill(); }
      else { if (type === 'ember') { ctx.shadowBlur = 12; ctx.shadowColor = `rgb(${color})`; } ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; }
      if (p.y < -60 || p.y > h + 120 || p.x < -60 || p.x > w + 60) spawn(p);
    }
    ctx.globalAlpha = 1; raf = requestAnimationFrame(draw);
  };
  resize(); const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); draw();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

// Olas sinusoidales continuas (varias capas) en un canvas que llena su contenedor.
export function waves(canvas, { layers = 3, color = '80,160,255', amp = 28, speed = 1 } = {}) {
  if (reducedMotion) return () => {};
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, raf = 0, t = 0;
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); w = canvas.width = r.width; h = canvas.height = r.height; };
  const draw = () => {
    t += .008 * speed; ctx.clearRect(0, 0, w, h);
    for (let l = 0; l < layers; l++) {
      ctx.beginPath(); ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 6) { const y = h * (.55 + l * .12) + Math.sin(x * .004 + t * (1 + l * .4) + l) * amp * (1 + l * .3) + Math.sin(x * .011 - t * 1.6) * amp * .4; ctx.lineTo(x, y); }
      ctx.lineTo(w, h); ctx.closePath(); ctx.fillStyle = `rgba(${color},${.12 + l * .1})`; ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  resize(); const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); draw();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

// Anillo 3D: distribuye los hijos de `ring` en un círculo (rotateY + translateZ), gira solo y responde al arrastre.
export function ring3d(ring, { radius = 420, autoSpeed = .12, onIndex } = {}) {
  if (reducedMotion) return () => {};
  if (!ring) return () => {};
  const items = Array.from(ring.children); const n = items.length; const step = 360 / n;
  let rot = 0, vel = autoSpeed, dragging = false, lastX = 0, raf = 0, lastIdx = -1;
  items.forEach((el, i) => { el.style.position = 'absolute'; el.style.left = '50%'; el.style.top = '50%'; el.style.transform = `translate(-50%,-50%) rotateY(${i * step}deg) translateZ(${radius}px)`; el.style.backfaceVisibility = 'hidden'; });
  const loop = () => {
    if (!dragging) { rot += vel; vel += (autoSpeed - vel) * .02; }
    ring.style.transform = `rotateY(${rot}deg)`;
    const idx = ((Math.round(-rot / step) % n) + n) % n; if (idx !== lastIdx) { lastIdx = idx; onIndex && onIndex(idx); }
    items.forEach((el, i) => { const a = ((rot + i * step) % 360 + 360) % 360; const front = Math.cos(a * Math.PI / 180); el.style.opacity = String(.35 + .65 * Math.max(0, front)); el.style.zIndex = String(Math.round(front * 100)); });
    raf = requestAnimationFrame(loop);
  };
  const down = (e) => { dragging = true; lastX = e.clientX ?? e.touches[0].clientX; };
  const move = (e) => { if (!dragging) return; const x = e.clientX ?? e.touches[0].clientX; const d = (x - lastX) * .3; rot += d; vel = d; lastX = x; };
  const up = () => { dragging = false; };
  const par = ring.parentElement; par.style.cursor = 'grab'; par.addEventListener('mousedown', down); par.addEventListener('touchstart', down, { passive: true });
  window.addEventListener('mousemove', move); window.addEventListener('touchmove', move, { passive: true }); window.addEventListener('mouseup', up); window.addEventListener('touchend', up);
  loop();
  return () => { cancelAnimationFrame(raf); par.removeEventListener('mousedown', down); par.removeEventListener('touchstart', down); window.removeEventListener('mousemove', move); window.removeEventListener('touchmove', move); window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
}

// Líneas de velocidad (speed streaks) que cruzan horizontalmente en canvas.
export function streaks(canvas, { count = 40, color = '255,45,111', speed = 1 } = {}) {
  if (reducedMotion) return () => {};
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, raf = 0, ls = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const spawn = (l = {}) => Object.assign(l, { x: rnd(-w * .5, w), y: rnd(0, h), len: rnd(80, 420), v: rnd(6, 22) * speed, a: rnd(.05, .5), t: rnd(1, 2.5) });
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); w = canvas.width = r.width; h = canvas.height = r.height; if (!ls.length) ls = Array.from({ length: mobileCount(count) }, () => spawn()); };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const l of ls) {
      l.x += l.v; const g = ctx.createLinearGradient(l.x, 0, l.x + l.len, 0); g.addColorStop(0, `rgba(${color},0)`); g.addColorStop(1, `rgba(${color},${l.a})`);
      ctx.strokeStyle = g; ctx.lineWidth = l.t; ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.x + l.len, l.y); ctx.stroke();
      if (l.x > w + 50) { spawn(l); l.x = -l.len - rnd(0, w * .4); }
    }
    raf = requestAnimationFrame(draw);
  };
  resize(); const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); draw();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

// Niebla: manchas blandas que derivan lentamente por el canvas.
export function fog(canvas, { count = 8, color = '255,255,255', speed = 1, alpha = .12 } = {}) {
  if (reducedMotion) return () => {};
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, raf = 0, bs = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); w = canvas.width = r.width; h = canvas.height = r.height; if (!bs.length) bs = Array.from({ length: mobileCount(count) }, () => ({ x: rnd(0, w), y: rnd(h * .3, h), r: rnd(w * .15, w * .35), vx: rnd(.1, .4) * speed, a: rnd(alpha * .5, alpha) })); };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const b of bs) {
      b.x += b.vx; if (b.x - b.r > w) b.x = -b.r;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); g.addColorStop(0, `rgba(${color},${b.a})`); g.addColorStop(1, `rgba(${color},0)`);
      ctx.fillStyle = g; ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }
    raf = requestAnimationFrame(draw);
  };
  resize(); const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); draw();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

// Malla de puntos ondulante (dot grid wave) en canvas.
export function dotWave(canvas, { gap = 34, color = '17,17,17', amp = 6, speed = 1 } = {}) {
  if (reducedMotion) return () => {};
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, raf = 0, t = 0;
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); w = canvas.width = r.width; h = canvas.height = r.height; };
  const draw = () => {
    t += .015 * speed; ctx.clearRect(0, 0, w, h);
    for (let x = gap / 2; x < w; x += gap) for (let y = gap / 2; y < h; y += gap) {
      const d = Math.sin(x * .02 + t) + Math.cos(y * .02 + t * .8); const r = 1 + (d + 2) * .6; const a = .15 + (d + 2) * .12;
      ctx.fillStyle = `rgba(${color},${a})`; ctx.beginPath(); ctx.arc(x + Math.sin(y * .01 + t) * amp, y + Math.cos(x * .01 + t) * amp, r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };
  resize(); const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); draw();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

// ─── NIVEL PREMIUM ───────────────────────────────────────────────────────────

// Scroll inercial (lerp) sobre window: suaviza el scroll nativo tipo Lenis. Respeta teclado/anclas.
export function smoothScroll({ ease = .09 } = {}) {
  if (reducedMotion) return () => {};
  let target = window.scrollY, cur = target, raf = 0, active = true;
  document.documentElement.style.scrollBehavior = 'auto';
  const clamp = () => { target = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, target)); };
  const onWheel = (e) => { if (e.ctrlKey) return; e.preventDefault(); target += e.deltaY * (e.deltaMode === 1 ? 16 : 1); clamp(); if (!raf) raf = requestAnimationFrame(loop); };
  const onScroll = () => { if (Math.abs(window.scrollY - cur) > 2 && !raf) { target = cur = window.scrollY; } };
  const loop = () => { cur += (target - cur) * ease; if (Math.abs(target - cur) < .5) { cur = target; raf = 0; } else raf = requestAnimationFrame(loop); window.scrollTo(0, cur); };
  window.addEventListener('wheel', onWheel, { passive: false }); window.addEventListener('scroll', onScroll, { passive: true });
  return () => { active = false; cancelAnimationFrame(raf); window.removeEventListener('wheel', onWheel); window.removeEventListener('scroll', onScroll); document.documentElement.style.scrollBehavior = ''; };
}

// Split text: [data-split="words"|"chars"] se divide y anima con máscara + stagger al entrar al viewport.
export function splitText(root, { stagger = 40, duration = 900, y = '110%' } = {}) {
  if (!root) return () => {};
  const els = [...root.querySelectorAll('[data-split]')];
  els.forEach((el) => {
    const mode = el.dataset.split || 'words'; const text = el.textContent; el.textContent = ''; el.style.whiteSpace = mode === 'chars' ? 'nowrap' : '';
    const parts = mode === 'chars' ? text.split('') : text.split(/(\s+)/);
    parts.forEach((p, i) => {
      if (/^\s+$/.test(p)) { el.appendChild(document.createTextNode(' ')); return; }
      const wrap = document.createElement('span'); wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.08em;margin-bottom:-.08em';
      const inner = document.createElement('span'); inner.textContent = p === ' ' ? '\u00a0' : p; inner.style.cssText = `display:inline-block;transform:translateY(${y});transition:transform ${duration}ms cubic-bezier(.2,.7,.2,1) ${i * stagger}ms;will-change:transform`;
      wrap.appendChild(inner); el.appendChild(wrap);
    });
  });
  const io = new IntersectionObserver((en) => en.forEach((e) => { if (!e.isIntersecting) return; e.target.querySelectorAll('span > span').forEach((s) => { s.style.transform = 'translateY(0)'; }); io.unobserve(e.target); }), { threshold: .2 });
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

// Estela de imágenes tras el cursor dentro de `zone`: `srcs` son URLs (o colores CSS si empiezan por '#'/'rgb').
export function imageTrail(zone, srcs, { every = 90, life = 900, size = 180 } = {}) {
  if (reducedMotion) return () => {};
  if (!zone || !srcs.length) return () => {};
  let last = 0, i = 0;
  const onMove = (e) => {
    const now = performance.now(); if (now - last < every) return; last = now;
    const r = zone.getBoundingClientRect(); const el = document.createElement('div'); const s = srcs[i++ % srcs.length];
    el.style.cssText = `position:absolute;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:${size}px;height:${size * 1.25}px;transform:translate(-50%,-50%) scale(.6) rotate(${(Math.random() - .5) * 20}deg);border-radius:12px;pointer-events:none;z-index:5;opacity:0;background:${/^(#|rgb|hsl|linear|radial)/.test(s) ? s : `url(${s}) center/cover`};transition:transform .5s cubic-bezier(.2,.7,.2,1),opacity .5s;box-shadow:0 30px 60px rgba(0,0,0,.35)`;
    zone.appendChild(el); requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = el.style.transform.replace('scale(.6)', 'scale(1)'); });
    setTimeout(() => { el.style.opacity = '0'; el.style.transform += ' translateY(40px) scale(.8)'; setTimeout(() => el.remove(), 500); }, life);
  };
  zone.addEventListener('mousemove', onMove);
  return () => zone.removeEventListener('mousemove', onMove);
}

// Marquee que acelera con la velocidad del scroll e invierte dirección. `track` debe contener el contenido duplicado.
export function marqueeVelocity(track, { base = .6, boost = .25 } = {}) {
  if (reducedMotion) return () => {};
  if (!track) return () => {};
  let x = 0, v = base, lastY = window.scrollY, raf = 0, dir = 1;
  const onScroll = () => { const dy = window.scrollY - lastY; lastY = window.scrollY; if (dy) dir = dy > 0 ? 1 : -1; v += Math.abs(dy) * boost * .05; };
  const loop = () => { v += (base - v) * .06; x -= v * dir; const half = track.scrollWidth / 2; if (x <= -half) x += half; if (x > 0) x -= half; track.style.transform = `translate3d(${x}px,0,0)`; raf = requestAnimationFrame(loop); };
  window.addEventListener('scroll', onScroll, { passive: true }); loop();
  return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
}

// Distorsión "liquid" al hover: dibuja la imagen `img` (HTMLImageElement cargada) en `canvas` con ondulación que sigue al cursor.
export function hoverDistort(canvas, img, { strength = 18, slices = 40 } = {}) {
  if (reducedMotion) return () => {};
  if (!canvas || !img) return () => {};
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, raf = 0, mx = .5, my = .5, amp = 0, t = 0, hover = false;
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); w = canvas.width = r.width; h = canvas.height = r.height; };
  const draw = () => {
    t += .05; amp += ((hover ? 1 : 0) - amp) * .08; ctx.clearRect(0, 0, w, h);
    const sw = img.naturalWidth / slices, dw = w / slices;
    for (let i = 0; i < slices; i++) { const p = i / slices; const dy = Math.sin(p * 8 + t + mx * 6) * strength * amp * (1 - Math.abs(p - mx)); ctx.drawImage(img, i * sw, 0, sw, img.naturalHeight, i * dw, dy, dw + 1, h); }
    raf = requestAnimationFrame(draw);
  };
  const move = (e) => { const r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; };
  const enter = () => { hover = true; }, leave = () => { hover = false; };
  const par = canvas.parentElement; par.addEventListener('mousemove', move); par.addEventListener('mouseenter', enter); par.addEventListener('mouseleave', leave);
  resize(); const ro = new ResizeObserver(resize); ro.observe(par); draw();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); par.removeEventListener('mousemove', move); par.removeEventListener('mouseenter', enter); par.removeEventListener('mouseleave', leave); };
}

// Preloader: cuenta 0→100 en `counterEl`, luego sube la cortina `curtain` y llama onDone. Devuelve cancel.
export function preloader(curtain, counterEl, { duration = 1600, onDone } = {}) {
  if (!curtain) return () => {};
  const t0 = performance.now(); let raf = 0, done = false;
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / duration); const e = 1 - Math.pow(1 - p, 3);
    if (counterEl) counterEl.textContent = String(Math.round(e * 100)).padStart(3, '0');
    if (p < 1) raf = requestAnimationFrame(tick);
    else if (!done) { done = true; curtain.style.transition = 'transform 1s cubic-bezier(.76,0,.24,1)'; curtain.style.transform = 'translateY(-100%)'; setTimeout(() => { curtain.style.display = 'none'; onDone && onDone(); }, 1000); }
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// Cursor custom con mix-blend-mode:difference y label contextual leído de [data-cursor="Ver"]. Devuelve cleanup.
export function cursorBlend(root, { size = 18, color = '#fff' } = {}) {
  if (reducedMotion) return () => {};
  if (!root) return () => {};
  const dot = document.createElement('div'); dot.style.cssText = `position:fixed;left:0;top:0;width:${size}px;height:${size}px;border-radius:50%;background:${color};pointer-events:none;z-index:9999;mix-blend-mode:difference;transform:translate(-50%,-50%);transition:width .3s,height .3s;display:grid;place-items:center;font:600 11px/1 system-ui;letter-spacing:.1em;text-transform:uppercase;color:#000;overflow:hidden;white-space:nowrap`;
  document.body.appendChild(dot); root.style.cursor = 'none'; root.querySelectorAll('a,button,[data-cursor]').forEach((el) => { el.style.cursor = 'none'; });
  let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
  const loop = () => { cx += (x - cx) * .2; cy += (y - cy) * .2; dot.style.left = cx + 'px'; dot.style.top = cy + 'px'; raf = requestAnimationFrame(loop); };
  const move = (e) => { x = e.clientX; y = e.clientY; const t = e.target.closest && e.target.closest('[data-cursor]'); const link = e.target.closest && e.target.closest('a,button'); if (t) { dot.textContent = t.dataset.cursor; dot.style.width = dot.style.height = '84px'; } else { dot.textContent = ''; dot.style.width = dot.style.height = (link ? size * 3 : size) + 'px'; } };
  window.addEventListener('mousemove', move); loop();
  return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', move); dot.remove(); root.style.cursor = ''; };
}

// FLIP: anima los hijos de `container` desde sus posiciones actuales a las nuevas tras ejecutar `mutate()` (p.ej. cambiar de grid a lista).
export function flip(container, mutate, { duration = 700 } = {}) {
  if (!container) return;
  const items = [...container.children]; const before = items.map((el) => el.getBoundingClientRect());
  mutate();
  requestAnimationFrame(() => {
    items.forEach((el, i) => {
      const a = before[i], b = el.getBoundingClientRect(); const dx = a.left - b.left, dy = a.top - b.top, sx = a.width / b.width, sy = a.height / b.height;
      el.style.transition = 'none'; el.style.transformOrigin = 'top left'; el.style.transform = `translate(${dx}px,${dy}px) scale(${sx},${sy})`;
      requestAnimationFrame(() => { el.style.transition = `transform ${duration}ms cubic-bezier(.2,.7,.2,1)`; el.style.transform = ''; });
    });
  });
}

// Scroll scrub: mapea el progreso de `wrap` (contenedor alto con hijo sticky) a `video.currentTime` o a un índice de frames via cb.
export function scrollScrub(wrap, video, { onFrame } = {}) {
  if (!wrap) return () => {};
  return scrollProgress(wrap, (p) => { if (video && video.duration) video.currentTime = p * video.duration; onFrame && onFrame(p); }, { sticky: true });
}

// Grano de película animado sobre `canvas` (overlay con mix-blend-mode:overlay recomendado).
export function noiseOverlay(canvas, { alpha = .06, fps = 24 } = {}) {
  if (reducedMotion) return () => {};
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d'); let w = 0, h = 0, raf = 0, last = 0;
  const resize = () => { const r = canvas.parentElement.getBoundingClientRect(); w = canvas.width = Math.floor(r.width / 2); h = canvas.height = Math.floor(r.height / 2); };
  const draw = (now) => { if (now - last > 1000 / fps) { last = now; const id = ctx.createImageData(w, h); const d = id.data; for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = alpha * 255; } ctx.putImageData(id, 0, 0); } raf = requestAnimationFrame(draw); };
  resize(); const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); raf = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

// Contador numérico animado: anima el textContent de [data-count="250"] cuando entra al viewport.
export function counters(root, { duration = 1400 } = {}) {
  if (!root) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; const target = parseFloat(el.dataset.count); const suffix = el.dataset.suffix || '';
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / duration); const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); io.unobserve(el);
    });
  }, { threshold: 0.4 });
  root.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
  return () => io.disconnect();
}
