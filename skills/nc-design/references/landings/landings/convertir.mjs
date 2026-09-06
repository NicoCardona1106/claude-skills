#!/usr/bin/env node
// Convierte las landings .dc.html (Claude Design) de esta carpeta a HTML plano
// sin runtime React: evalúa la plantilla con los datos en ESPAÑOL del propio
// componente, expande <sc-for>, vuelca style-hover a clases CSS y reemplaza
// <x-import image-slot> por <img> placeholder SVG. Los efectos de fx.js se
// montan reutilizando el componentDidMount ORIGINAL con un shim de DCLogic
// (setState = no-op → la interactividad de estado, como el toggle ES/EN,
// queda congelada en el estado inicial; el diseño y las animaciones quedan).
// Uso: node convertir.mjs   → escribe "<nombre>.html" junto a cada .dc.html
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));

// ── extracción de bloques ──
function extraer(src) {
  const helmet = src.match(/<helmet>([\s\S]*?)<\/helmet>/);
  const script = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);
  const rootStart = src.indexOf('</helmet>') + '</helmet>'.length;
  const rootEnd = src.indexOf('</x-dc>');
  if (!helmet || !script || rootEnd < 0) throw new Error('formato .dc.html inesperado');
  return { helmet: helmet[1].trim(), root: src.slice(rootStart, rootEnd).trim(), script: script[1] };
}

// ── evaluación del componente en Node ──
function evaluarComponente(scriptSrc) {
  const React = { createRef: () => ({ current: null }) };
  class DCLogic { constructor() { this.state = {}; this.props = {}; } setState() {} }
  const Component = new Function('DCLogic', 'React', `${scriptSrc}\nreturn Component;`)(DCLogic, React);
  const inst = new Component();
  return inst.renderVals ? inst.renderVals() : {};
}

function evalExpr(expr, ctx) {
  const keys = Object.keys(ctx);
  try {
    return new Function(...keys, `return (${expr});`)(...keys.map((k) => ctx[k]));
  } catch (e) {
    throw new Error(`evaluando "{{ ${expr} }}": ${e.message}`);
  }
}

// ── expansión recursiva de <sc-for> (soporta anidados) ──
function expandirFors(html, ctx) {
  let out = '';
  let i = 0;
  for (;;) {
    const open = html.indexOf('<sc-for', i);
    if (open < 0) { out += html.slice(i); break; }
    out += html.slice(i, open);
    const tagEnd = html.indexOf('>', open);
    const tag = html.slice(open, tagEnd + 1);
    // cierre emparejado (por si hay sc-for anidados)
    let depth = 1, j = tagEnd + 1;
    while (depth > 0) {
      const nextOpen = html.indexOf('<sc-for', j);
      const nextClose = html.indexOf('</sc-for>', j);
      if (nextClose < 0) throw new Error('sc-for sin cierre');
      if (nextOpen >= 0 && nextOpen < nextClose) { depth++; j = nextOpen + 7; }
      else { depth--; j = nextClose + '</sc-for>'.length; }
    }
    const inner = html.slice(tagEnd + 1, j - '</sc-for>'.length);
    const listExpr = tag.match(/list="\{\{([\s\S]*?)\}\}"/)?.[1]?.trim();
    const asName = tag.match(/as="(\w+)"/)?.[1];
    const list = evalExpr(listExpr, ctx) || [];
    for (let k = 0; k < list.length; k++) {
      out += expandirFors(inner, { ...ctx, [asName]: list[k], [asName + 'Index']: k });
    }
    i = j;
  }
  // sustituciones del nivel ya expandido
  return sustituir(out, ctx);
}

function sustituir(html, ctx) {
  // refs → data-fx-ref (el nombre del ref, para reconectarlo en el navegador)
  html = html.replace(/ref="\{\{\s*([\w.]+)\s*\}\}"/g, (_, name) => `data-fx-ref="${name.replace(/^this\./, '')}"`);
  // handlers on* → fuera (la interactividad de estado no viaja al HTML plano)
  html = html.replace(/\son[A-Z]\w*="\{\{[\s\S]*?\}\}"/g, '');
  // el resto de huecos {{ expr }} — solo los del nivel actual (los de sc-for internos ya se fueron)
  return html.replace(/\{\{([\s\S]*?)\}\}/g, (_, expr) => {
    const v = evalExpr(expr.trim(), ctx);
    return v == null ? '' : String(v);
  });
}

// ── image-slot → <img> placeholder SVG ──
function svgPlaceholder(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2a35"/><stop offset="1" stop-color="#16161d"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="50%" y="50%" fill="rgba(255,255,255,.35)" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">${label.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function reemplazarImageSlots(html) {
  return html.replace(/<x-import[^>]*component-from-global-scope="image-slot"[^>]*><\/x-import>/g, (tag) => {
    const attr = (n) => tag.match(new RegExp(`${n}="([^"]*)"`))?.[1] ?? '';
    const placeholder = attr('placeholder') || 'imagen';
    const style = attr('style');
    const radius = attr('radius');
    const extra = `object-fit:cover${radius ? `;border-radius:${radius}px` : ''}`;
    return `<img alt="${placeholder}" src="${svgPlaceholder(placeholder)}" style="${style}${style && !style.endsWith(';') ? ';' : ''}${extra}">`;
  });
}

// ── style-hover → clases CSS ──
function volcarHovers(html) {
  const reglas = [];
  html = html.replace(/style-hover="([^"]*)"/g, (_, css) => {
    const cls = `hv-${reglas.length}`;
    reglas.push(`.${cls}:hover{${css}}`);
    return `class="${cls}"`;
  });
  return { html, css: reglas.join('\n') };
}

// ── shim de montaje: reusa el componentDidMount original ──
function scriptMontaje(componentSrc) {
  return `<script type="module">
window.React = { createRef: () => ({ current: null }) };
class DCLogic { constructor() { this.state = {}; this.props = {}; } setState() {} }
${componentSrc}
const c = new Component();
document.querySelectorAll('[data-fx-ref]').forEach((el) => { const n = el.dataset.fxRef; if (c[n]) c[n].current = el; });
if (c.componentDidMount) c.componentDidMount();
</script>`;
}

// ── conversión de un archivo ──
function convertir(nombre) {
  const src = readFileSync(join(DIR, nombre), 'utf8');
  const { helmet, root, script } = extraer(src);
  const vals = evaluarComponente(script);
  let html = expandirFors(root, vals);
  html = reemplazarImageSlots(html);
  const hv = volcarHovers(html);
  const head = helmet.replace(/<script src="\.\/image-slot\.js"><\/script>\s*/g, '');
  const titulo = nombre.replace(/^\d+ /, '').replace('.dc.html', '');
  let doc = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
${head}
${hv.css ? `<style>\n${hv.css}\n</style>` : ''}
</head>
<body>
${hv.html}
${scriptMontaje(script.trim())}
</body>
</html>`;
  const destino = nombre.replace('.dc.html', '.html');
  if (nombre.startsWith('00 ')) doc = doc.replaceAll('.dc.html', '.html'); // la galería enlaza a las versiones planas
  writeFileSync(join(DIR, destino), doc);
  return destino;
}

const archivos = readdirSync(DIR).filter((f) => f.endsWith('.dc.html'));
let ok = 0;
for (const f of archivos) {
  try { console.log('✔', convertir(f)); ok++; }
  catch (e) { console.error('✖', f, '—', e.message); }
}
console.log(`\n${ok}/${archivos.length} convertidas`);
