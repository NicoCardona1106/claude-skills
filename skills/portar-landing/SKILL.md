---
name: portar-landing
description: "Porta una landing del banco 2026-09 de nc-design (o un artefacto .dc.html de Claude Design, un artefacto HTML de claude.ai, o una plantilla HTML de terceros) a HTML plano o a un componente Next/React. Usar cuando Nicolas diga 'porta esta landing', 'pásala a Next', 'conviértela a HTML', o /portar-landing. Cubre convertir.mjs, el catálogo de efectos fx.js, la disciplina de useEffect/cleanup y el reparto en paralelo a agentes portador con contrato de 4 campos."
---

# Portar landing — de .dc.html al stack real

Una exportación `.dc.html` de Claude Design NO es HTML plano: lleva `<x-dc>`,
`<sc-for>`, `{{ }}`, `style-hover`, `<image-slot>` y corre sobre React/Babel
cargado desde unpkg vía `support.js`. No se puede pegar directo en un
proyecto Next — hay que portarla.

## Entradas admitidas

1. **`.dc.html` de Claude Design** — banco `references/landings/landings/`
   de nc-design, o cualquier export `<x-dc>`/`<helmet>`/`<script
   type="text/x-dc">` equivalente.
2. **Artefacto HTML de claude.ai** (sin `<x-dc>`) — directo a Salida B, sin
   pasar por `convertir.mjs`.
3. **Plantilla HTML de terceros** (Figma export, tema comprado) — directo a
   Salida B; locks de nc-design y catálogo de tells aplican igual.

## Salida A: HTML plano

Solo entradas tipo 1. Úsala para **copiar markup, estilos o estructura** sin
runtime — revisar en navegador, extraer un fragmento, o paso intermedio
antes de portar a componente.

Las 26 versiones planas (25 landings + galería `00 Galeria`) ya existen y
están verificadas en navegador (2026-09-05). Solo re-ejecutar si cambió una
`.dc.html` fuente — el script no acepta argumentos, **sobrescribe las 26** de
una vez. Lo corre el director, nunca un agente `portador`: el banco
(`references/landings/landings/`) es zona prohibida para ellos.

```
cd "C:\Users\NICO-C\.claude\skills\nc-design\references\landings\landings" && node convertir.mjs
```

Qué hace `convertir.mjs` (leído completo): extrae `<helmet>` + `<script
type="text/x-dc">` + root del `<x-dc>`; evalúa el componente en Node con un
shim `DCLogic` (`setState` no-op) y saca `renderVals()` en **español**;
expande `<sc-for list="{{ ... }}" as="...">` recursivo; `ref="{{ this.x }}"`
→ `data-fx-ref="x"` y quita los `on*="{{ ... }}"` (la interactividad de
estado no viaja al HTML plano); `<x-import ... image-slot>` → `<img>` con
placeholder SVG; `style-hover` → clase `.hv-N:hover`; al final inyecta un
`<script type="module">` que reconstruye la instancia y llama a su
`componentDidMount` real, dejando montados los efectos de `fx.js`.

Límites: el toggle ES/EN y demás interactividad de estado queda **congelada
en español** (`setState` no-op, sin flag de idioma); formularios con
`setState` no funcionan en la versión plana; es HTML de referencia (sin
bundler, sin minificar), no de producción. Revisar a mano: comparar
visualmente con el `.dc.html` original y que el texto de cada placeholder
SVG describa bien la imagen real antes de producción.

## Salida B: componente Next/React

Cuando el destino es un proyecto Next.js + React (el stack de Nicolas).
Partir de la versión plana si existe (Salida A); si no, del `.dc.html` o del
artefacto de entrada directamente.

Estructura: una landing = una carpeta bajo `components/landing/<nombre>/` o
`app/<ruta>/`, con `index.tsx` (composición + hooks de fx.js), `data.ts`
(contenido) y `fx.ts` (fx.js portado a TS si el proyecto lo pide).

Paso a paso:

1. **Fuentes con `next/font`**: las landings usan Google Fonts vía `<link>`
   (ej. Cormorant Garamond + Manrope) — portar a `next/font/google`, evita
   el flash de fuente.
2. **`<image-slot>` → `next/image` o `<img>`**: con imagen real, `next/image`
   con `fill` + `sizes` (los slots ya son `position:absolute;inset:0`); si
   sigue placeholder, `<img>` con el mismo SVG data-URI que genera
   `convertir.mjs` — no vale `next/image` para un placeholder.
3. **Estilos: `@keyframes` a CSS global, el resto inline** — las landings
   son 100% inline (`style="..."`); solo los `@keyframes` (no se pueden
   inline) van a `globals.css`, más fiel y rápido que migrar a Tailwind.
4. **Efectos de `fx.js` en `useEffect` con su cleanup** (cada función
   devuelve un cleanup, o `() => {}` si `reducedMotion` está activo):

   ```tsx
   useEffect(() => {
     const cleanups = [fx.parallax(rootRef.current, { max: 28 }), fx.reveal(rootRef.current), fx.magnetic(rootRef.current)];
     return () => cleanups.forEach((c) => c());
   }, []);
   ```

   Exports confirmados de `fx.js` (import dinámico en Node): `counters,
   cursorBlend, cursorFollow, dotWave, flip, fog, hoverDistort, imageTrail,
   isMobile, magnetic, marqueeVelocity, mobileCount, noiseOverlay, parallax,
   particles, preloader, reducedMotion, reveal, ring3d, scramble,
   scrollProgress, scrollScrub, smoothScroll, splitText, streaks, tilt,
   typewriter, waves`.
5. **Hidratación y `'use client'`**: toda sección con `ref` + `useEffect`
   va en componente cliente (`'use client'` al tope); solo secciones 100%
   estáticas pueden quedarse server component.
6. **Contenido separado del markup**: `copy = { es: {...}, en: {...} }` y
   las listas de `sc-for` van a `data.ts` tipado — nunca strings en el JSX.

## Reglas de nc-design que se conservan al portar

- **Locks de consistencia**: un solo acento de color, un solo sistema de
  radios, un solo tema por página — el placeholder o el recorte no rompen
  el lock original.
- **"El banco manda"**: si algo del banco (ej. `scroll` pasivo + rAF en
  `fx.js` en vez de ScrollTrigger) choca con el catálogo de tells de IA de
  nc-design, gana el banco — no "corregir" el efecto durante el porte.
- **DPR cap ~1.5 y mitad de partículas en móvil**: resuelto en `fx.js`
  (`mobileCount`, dibujo a 1x CSS px) — solo respetar el redimensionado real.
- **`prefers-reduced-motion`**: 19 funciones de `fx.js` ya hacen `if
  (reducedMotion) return () => {}`, se auto-desactivan solas; `reducedMotion`
  es constante evaluada al importar (SSR siempre `false`), no usarla como
  fuente de verdad reactiva.
- **Checklist de 8 pasos de Atlas** si la pieza es premium (preloader, split
  text, scroll inercial, cursor con label, un fondo continuo, micro-
  interacciones, grano, sección sticky "wow") — cita literal en
  `nc-design/references/efectos.md:97-105`; solo si Nicolas pidió showcase.

## Verificar

- Verificación visual (1440 y 390, consola limpia, sin overflow horizontal,
  `fullPage`): la define la skill **verificacion-visual**; el agente
  `verificador-visual` la ejecuta contra la DoD.
- Salida A: `node --check` no acepta `.html` — abrirlo por http local y
  revisar consola limpia; para chequear solo el JS, extraer el `<script>` a
  un `.mjs` temporal y correrle `node --check`.
- Salida B: `next build` si hay proyecto Next a mano; si no, `npx tsc
  --noEmit --jsx preserve <archivo>.tsx` (`node --check` falla siempre con
  `ERR_UNKNOWN_FILE_EXTENSION` en `.tsx`, verificado en Node 24).

## En paralelo

El banco tiene 25 landings + la galería índice (`00 Galeria`), 26 archivos.
Repartir las 25 landings a agentes **portador** (sonnet), una por landing,
en el mismo turno, cada uno con contrato de 4 campos (ENTREGABLE / FORMATO /
ACEPTACIÓN / PROHIBIDO) — sin contrato el director solo opina, no rechaza:

```
ENTREGABLE: app/landing/hotel-aurora/index.tsx, .../data.ts
FORMATO: componente Next 'use client' que reproduce "01 Hotel Aurora" (hero
con canvas de polvo dorado, nav ES/EN, CTA magnetic); fuentes vía
next/font/google; copy en data.ts; fx.js (parallax, reveal, magnetic) en
un useEffect con cleanup.
ACEPTACIÓN: next build sin errores; verificacion-visual en 1440 y 390 sin
errores de consola ni overflow; el CTA reacciona al hover.
PROHIBIDO: tocar archivos fuera de app/landing/hotel-aurora/; tocar el
banco en nc-design/references/landings/; ejecutar git.
```

El director abre los 25 entregables uno por uno contra su contrato (el
resumen del agente no es evidencia) y pasa los que fallan al agente
`verificador-visual` antes de cerrar el lote.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
