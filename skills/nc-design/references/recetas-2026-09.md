# Recetas del banco 2026-09 — las 25 landings, una por una

Destilado el 2026-09-22 (pedido de Nicolas: «son importantes por las animaciones y
el detalle») leyendo el HTML plano de `references/landings/landings/NN Nombre.html`
y `fx.js`. Cada ficha trae valores REALES del archivo: paleta, tipografía, capas
del hero con sus tiempos, cada animación con su mecanismo, detalles de nav,
botones y vidrio, y para qué dominios reutilizarla. Complementa a `efectos.md`
(catálogo de fx.js y checklist de pulido) y a `tecnicas.md` (banco de julio).

## Cómo usar este archivo
1. Elegir por dominio en el índice de abajo (o por la técnica estrella).
2. Leer la ficha y abrir el HTML plano solo para copiar markup o estilos.
3. Al portar, aplicar las «Lecciones al portar» de abajo: son defectos reales
   del banco que NO hay que reproducir.

## Índice por dominio / técnica estrella
| Dominio | Landing | Técnica estrella |
|---|---|---|
| Hotel, hospitalidad, residencias | 01 Hotel Aurora · 20 Aurelia | slides 01/0N + polvo/estrellas canvas + barrido de luz |
| Automotriz, velocidad | 02 Velocità | speed streaks + grid 3D en perspectiva + switch de modelo |
| Joyería, lujo claro | 03 Primae | letras gigantes con parallax por profundidad + pétalos |
| Producto tech, hardware | 04 Nébula | anillos orbitando en 3D real + burbujas |
| Botánico, natural, spa | 05 Crystal Flora · 19 Verde Dental | cristales twinkle + niebla / olas + burbujas + isla 3D |
| Viajes, expediciones | 06 Terra | ken burns + nieve + niebla + itinerario sticky |
| Café, origen, artesanía | 07 Origen Café | split panel papel/oscuro + granos, ascuas y vapor |
| Agencia, estudio (claro) | 08 Studio Kōan | typewriter + cursor custom + malla de puntos |
| Inmobiliaria, portafolio | 09 Élan · 15 Forma | galería horizontal sticky + scramble / antes-después + preview al cursor |
| Ciberseguridad, B2B técnico | 10 Bluebird | radar + 3 pasos sticky que cambian imagen |
| Apps de salud, educación | 11 Synapse | tarjetas apiladas sticky + pricing |
| SaaS, dev tools | 12 Pulse | mockup 3D que se endereza al scroll + bento + beam |
| Perfumería, belleza oscura | 13 Noir Parfum | máscara clip-path que se abre con scroll + humo |
| Relojería, producto premium | 14 Chrono | reloj que rota/escala con scroll + specs pineadas (400vh) |
| Eventos, festivales | 16 Lumen Fest | tipografía cinética en 3 filas + countdown |
| Entretenimiento, sagas | 17 Veldrah | ascuas canvas + capítulos 01/04 + título blur-in |
| Editorial, revistas | 18 M. Magazine | pétalos + bokeh + busto glass + columnas |
| E-commerce, catálogo | 21 Orbe | anillo 3D de productos arrastrable + aurora |
| IA, deep tech | 22 Aether | esfera de partículas three.js con orbit |
| Deportes, outdoor | 23 Drift | olas + aurora + sol + widget de condiciones |
| Herramientas de diseño (claro) | 24 Prisma | cubo CSS 3D + gradient mesh + chips en órbita |
| Showcase / nivel superior | 25 Atlas | preloader, split text, scroll inercial, cursor blend, FLIP, scrub |

## Notas comunes a las 25 (verificadas en los archivos)
- **Sin `@media` en ningún archivo.** El banco no define breakpoints: el único
  recurso móvil es `fx.isMobile()` (`max-width: 768px`) y `mobileCount(n)` (mitad
  de partículas). Al portar, el responsive a 390 se diseña desde cero con las
  reglas de SKILL.md; lo que las fichas dicen en «Móvil» es lo que hay, no lo ideal.
- **`prefers-reduced-motion` solo lo maneja fx.js** (`reducedMotion`): no monta
  `parallax`, `magnetic`, `tilt`, `particles`, `streaks`, `waves`, `scrollProgress`
  ni `cursorFollow`; `reveal` y `counters` corren siempre y los `@keyframes` CSS
  también. Consecuencia: en 09, 10, 12-14 y 25 las secciones scroll-driven se
  quedan en su estado inicial con movimiento reducido (Atlas deja el marco
  recortado al 30 %). Al portar: dar a cada sección scroll-driven un estado final
  legible sin scroll.
- **En el HTML plano `setState()` es un no-op**: slides automáticos, toggles
  (mensual/anual, tamaño, día), typewriter (08), pasos (10), antes/después (15),
  countdown (16), FLIP y ES·EN quedan congelados en el estado inicial. El
  mecanismo está en el script y las fichas lo describen; la fuente `.dc.html`
  sí lo ejecuta.
- **Defaults de fx.js que las fichas dan por sabidos:** `parallax` max 28 px,
  lerp 0.08, mueve `[data-depth]` con `translate3d(-cx·max·d, -cy·max·d, 0)`;
  `reveal` y=36 px, 900 ms `cubic-bezier(.2,.7,.2,1)`, threshold .12,
  `data-reveal-delay` en ms; `magnetic` strength .35, entra .15s ease-out, sale
  .5s; `tilt` max por defecto 8°.

## Lecciones al portar (defectos reales del banco: no copiarlos)
- **`gap:clamp(14px,2vw,34px)px` en la nav** (02, 03, 06, 08, 10, 11, 13, 14,
  15, 18, 19, 20, 22, 23): CSS inválido por el `px` sobrante, el navegador lo
  ignora. Al portar, `gap: clamp(14px, 2vw, 34px)`.
- **`fx.parallax` pisa el `transform`** de los `[data-depth]` y ningún archivo
  usa `data-base-transform`: se pierde el centrado `translate(-50%,-50%)` (blob
  de 16, columna derecha de 18) y choca con animaciones CSS `both` sobre el mismo
  elemento (`fadeUp` del widget de 23, `kenBurns` de la imagen de 25). Regla:
  el elemento con `data-depth` es un wrapper propio, sin centrado ni keyframes.
- **Keyframes declarados y sin usar** (`lineGrow` en 02/06/14, `orbit` en 04,
  `wipe` en 06, `dash` en 10, `lineGrowY` en 14, `glow` en 17, `twinkle` en 20):
  no portarlos.
- **21 Orbe** tiene `data-tilt` en las tarjetas pero nunca llama `fx.tilt`.
- **16 Lumen** no tiene `<h1>` (el título son divs en marquee): al portar, h1
  real aunque sea visualmente oculto (regla de accesibilidad de SKILL.md).
- **Sin sticky ni scroll-driven en 01-08**: la colección 1 es hero + reveal;
  el «momento wow» a mitad de página (checklist de pulido, paso 8) hay que
  añadirlo.

---

### 01 Hotel Aurora — hotel de lujo / hospitalidad (oscuro)
- **Concepto:** «El arte de escapar»: foto de atardecer a sangre con polvo dorado flotando y un barrido de luz, texto editorial serif en tres líneas escalonadas.
- **Paleta:** fondo `#0b0a0c`; superficie de cards `#151316`; texto `#f4efe8` (y variantes `rgba(244,239,232,.4–.8)`); acento dorado `#e6c9a8` (hover de enlaces, eyebrows, palabra en itálica); vidrio `rgba(255,255,255,.08)` + borde `rgba(255,255,255,.18)`. **Tipografía:** display Cormorant Garamond (300, itálica 300/400), body Manrope 300–600, mono: no lo define. H1 `clamp(56px,7.2vw,112px)`, line-height .95, uppercase; H2 `clamp(40px,4.6vw,72px)`.
- **Hero:** (1) canvas de partículas z2; (2) barrido de luz: franja 26% ancho `linear-gradient(90deg,transparent,rgba(230,201,168,.22),transparent)` blur 30px; (3) rayos: `repeating-linear-gradient` dorado `.08` blur 18px, `mix-blend-mode:screen`; (4) imagen `inset:-6%` con `data-depth="0.25"`; (5) velo lateral `linear-gradient(90deg, rgba(11,10,12,.85) 0%, .35 45%, .1 100%)`; (6) velo vertical `.55 → transparent 30% → transparent 60% → .9`; (7) nav; (8) copy a la izquierda (left 56px, top 50%); (9) glass card, contador 01/04, redes, sello circular.
- **Secuencia de entrada:** imagen `zoomOut 2.4s cubic-bezier(.2,.7,.2,1)`; nav `fadeIn 1.2s .3s`; eyebrow `fadeUp 1s .5s`; H1 líneas `fadeUp 1.1s` a .7s / .85s / 1s; párrafo 1.2s; CTAs 1.4s; glass card `fadeUp 1.2s 1.6s`; redes `fadeIn 1.2s 1.6s`; contador `fadeIn 1.2s 1.8s`; sello scroll `fadeIn 1.2s 2s`. Todas con `both`.
- **Animaciones:**
  - `fadeUp`: `opacity 0; translate3d(0,40px,0)` → `none`. `fadeIn`: opacidad 0→1.
  - `zoomOut`: `scale(1.12)` → `scale(1)`, 2.4s una vez.
  - `sweepLight`: `translateX(-30%) rotate(8deg)` opacidad 0 → 30%: .35 → `translateX(130%)` opacidad 0; `12s 2s ease-in-out infinite`.
  - `rays`: `skewX(-12deg)`, opacidad .25↔.5 y `translateX(0↔3%)`; `9s ease-in-out infinite`.
  - `floatY`: translateY 0 → -12px → 0; `6s ease-in-out infinite` (miniatura de la glass card).
  - `lineGrow`: `scaleX(0→1)` con `transform-origin:left`; `6s linear infinite` (barra de progreso del slide, 64×1px).
  - `spin`: `rotate(360deg)`, `14s linear infinite` sobre SVG con `textPath` circular «SCROLL · DOWN ·».
  - `fx.particles(dustRef, { type:'ember', count:70, color:'230,201,168', speed:.35 })`: puntos que suben con `shadowBlur 12`.
  - `fx.parallax(root)` (max 28 por defecto); `data-depth`: imagen .25, glass card .6, cita .4.
  - `fx.reveal`, `fx.magnetic` (`data-magnetic` en Reservar y CTAs), `fx.tilt` (default 10°; `data-tilt` en cards de suites), `fx.counters` (62, 48, 3, 98%).
  - `setInterval(nextSlide, 6000)`: rota 4 slides y reinicia las animaciones `[data-hero-anim]` (`animation:none` → reflow → restaurar).
- **Detalles:** nav absoluta, padding `28px 56px`, sin altura fija; píldora central de enlaces con borde `rgba(244,239,232,.18)`, fondo `rgba(255,255,255,.05)`, `blur(12px)`, hover `rgba(255,255,255,.12)`; logo con monograma «A» en círculo de 26px y tracking .18em. Botón primario: píldora crema `#f4efe8` con texto oscuro y círculo interior oscuro de 38px con «→» (padding `8px 8px 8px 26px`). Link secundario subrayado con `border-bottom`. Glass card: `rgba(255,255,255,.08)`, borde `.18`, `blur(18px)`, radio 20px. Redes: círculos de 40px, `blur(8px)`, hover invierte a crema. Badges en cards: píldora `rgba(255,255,255,.1)`, `blur(8px)`. Numeración «01 — 04» con barra dorada. Cards de suites de 520px de alto, radio 22px, degradado inferior `.9`. Stats en 2 columnas con `border-top rgba(244,239,232,.15)`. CTA final con `radial-gradient` viñeta. Marquee y cursor: no lo define.
- **Móvil:** no define media queries (grids fijos de 3 y 2 columnas, left 56px). Solo aplica la regla común de fx.js (35 partículas en ≤768px).
- **Reutilizar para:** hotel boutique o resort, spa de lujo, restaurante de autor, inmobiliaria premium de costa.

### 02 Velocita — automotriz / superdeportivos (oscuro)
- **Concepto:** «Velocidad más allá de los límites»: coche entrando de lado sobre una rejilla synthwave en perspectiva, con estelas de velocidad y la marca gigante en contorno detrás.
- **Paleta:** fondo `#07060a`; halo del hero `radial-gradient(ellipse 70% 60% at 70% 60%, #2a0a3a 0%, #07060a 70%)`; texto `#f2eef7`; acento magenta `#ff2d6f` (CTA, unidades, rombos del marquee, bloque CTA); superficie `#100c16`; vidrio `rgba(255,255,255,.06)` + borde `.14`. **Tipografía:** display Unbounded (300 / 600 / 800), body Space Grotesk 300–600, mono: no lo define. H1 `clamp(34px,3.8vw,58px)` 300 + 800 en `<strong>`, uppercase; palabra de fondo `clamp(120px,19vw,300px)` 800, `letter-spacing:-.04em`.
- **Hero:** (1) fondo radial morado; (2) rejilla en suelo: contenedor `perspective:600px` (bottom 60%) y plano `rotateX(62deg)` con líneas `rgba(255,45,111,.22)` y `rgba(255,255,255,.08)` de 80px, `mask-image` que la desvanece arriba; (3) canvas de estelas z2; (4) resplandor magenta `radial-gradient rgba(255,45,111,.35)` blur 40px (`data-depth .15`); (5) nav z6; (6) palabra VELOCITÀ transparente con `-webkit-text-stroke:1px rgba(242,238,247,.16)` (`data-depth .1`); (7) coche centrado 62vw (máx 1100px) con sombra magenta `blur(20px)` debajo (`data-depth .45`); (8) copy abajo a la izquierda; (9) 3 spec cards abajo a la derecha (`data-depth .7`); (10) selector de modelos vertical a la izquierda; (11) «Desplázate —» rotado 90°.
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; palabra gigante `fadeIn 2s .3s`; coche `slideIn 1.4s .5s cubic-bezier(.2,.7,.2,1)`; H1 `fadeUp 1s .8s`; párrafo 1s; CTAs 1.2s; spec cards `fadeUp 1s` a 1.3s / 1.45s / 1.6s; selector `fadeIn 1s 1.4s`; texto vertical `fadeIn 1s 1.6s`.
- **Animaciones:**
  - `fadeUp`: `translate3d(0,50px,0)`, opacidad 0 → `none`.
  - `slideIn`: `opacity 0; translate3d(80px,0,0) scale(.96)` → `none`.
  - `glow`: opacidad .55 ↔ .95; `5s ease-in-out infinite` (halo magenta).
  - `gridMove`: `background-position 0 0 → 0 80px`; `1.4s linear infinite` (el suelo avanza en bucle, un periodo = una celda).
  - `marquee`: `translateX(0 → -50%)`; `26s linear infinite`, contenido duplicado ×2.
  - `lineGrow` definida pero sin uso en el markup.
  - `fx.streaks(streakRef, { count:46, color:'255,45,111', speed:1.2 })`: líneas horizontales de 80–420px con degradado a transparente, velocidad 6–22 px/frame × speed.
  - `fx.parallax(root, { max:40 })`; `fx.tilt(root, { max:6 })` en la imagen de detalle; `fx.reveal`, `fx.magnetic`, `fx.counters` (830 cv, 330 km/h, 1390 kg, 7 vel.).
  - 3D CSS: `perspective:600px` + `rotateX(62deg)` con `transform-origin:bottom`.
  - Selector de modelo (estado `model`): activo `opacity 1` y línea de 48px; inactivos `.4` y 18px, `transition: width .5s`; al elegir reinicia `[data-hero-anim]`. Sin setInterval.
- **Detalles:** nav absoluta, padding `28px 56px`, enlaces sueltos uppercase 13px (el `gap:clamp(14px,2vw,34px)px` tiene una «px» sobrante: la regla es inválida y no aplica). Botones con esquinas cortadas: `clip-path: polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)` (12px en el CTA grande); secundario con borde `rgba(242,238,247,.3)` recto; toggle de idioma radio 4px. Spec cards 150px, radio 12px, `blur(16px)`, unidad en magenta. Marquee con bordes arriba/abajo `rgba(242,238,247,.1)`, Unbounded 13px tracking .3em, separador «◆» magenta. Numeración 01/02/03 en el selector. Etiqueta de vidrio oscuro `rgba(7,6,10,.6)` `blur(12px)`. Grilla de galería `2fr 1fr 1fr` × 2 filas de 280px con bloque CTA magenta y botón circular de 72px. Cursor: no lo define.
- **Móvil:** no define media queries (coche en vw, H1 y cifras con clamp; el resto fijo). En ≤768px fx.js pinta 23 estelas.
- **Reutilizar para:** automotriz y motos, lanzamiento de hardware de alto rendimiento, esports o gaming, marca deportiva.

### 03 Primae — alta joyería (claro)
- **Concepto:** «Libera tu belleza interior»: un retrato que se revela con cortina vertical y el nombre PRIMAE en letras gigantes repartidas a lo ancho, cada una con su propia profundidad de parallax.
- **Paleta:** fondo `#f4f2ee`; texto `#17161a`; letras `#2b1a4a` (P, R, A, E) y `#6b2fb3` (I, M), que es también el hover y los eyebrows; lavanda `#c9a6ff` (pétalos y eyebrow sobre oscuro); superficie de producto `#e9e5df`; bloque oscuro `#17161a` con texto `#f4f2ee`; sombras `rgba(43,26,74,.12/.1/.25)`. **Tipografía:** display Italiana 400, body Jost 300–500, mono: no lo define. H1 (letras) `clamp(120px,22vw,340px)`, line-height 1; H2 de sección `clamp(44px,5vw,80px)`.
- **Hero:** (1) fondo liso; (2) imagen central `min(46vw,640px)` × `min(78vh,760px)` z2 (`data-depth .2`); (3) H1 con 6 `<span>` repartidos con `justify-content:space-between` y `padding:0 4vw`, `mix-blend-mode:multiply`, `perspective:900px`, `transform-style:preserve-3d`, `text-shadow:0 30px 60px rgba(43,26,74,.25)`, z3; (4) canvas de pétalos z4 (por encima de las letras); (5) nav z6 con logo centrado; (6) copy abajo a la izquierda (max 300px); (7) miniaturas de producto abajo a la derecha (`data-depth .6`); (8) «Otoño / Invierno 2026» rotado -90°.
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; imagen `revealClip 1.6s .4s cubic-bezier(.7,0,.2,1)`; letras `letterIn 1.2s cubic-bezier(.2,.7,.2,1)` con delay `0.5 + i*0.12` s (.5 → 1.1s); H2 del hero `fadeUp 1s 1.5s`; párrafo 1.7s; enlace 1.9s; miniaturas `fadeUp 1.2s 1.8s`; texto vertical `fadeIn 1s 2s`.
- **Animaciones:**
  - `letterIn`: `opacity 0; translate3d(0,60%,0) rotate(4deg)` → `none`.
  - `revealClip`: `clip-path: inset(0 0 100% 0)` → `inset(0 0 0 0)` (cortina de arriba abajo).
  - `fadeUp`: translateY 30px. `floatY`: 0 → -10px; `6s ease-in-out infinite`, segunda miniatura con delay 1s (desfase).
  - Parallax por letra: `data-depth = .15 + (i % 3) * .2` → .15 / .35 / .55 repetido; `fx.parallax(root, { max:24 })`.
  - `fx.particles(petalRef, { type:'petal', count:22, color:'201,166,255', speed:.5 })`: elipses de 6–14px que caen rotando.
  - `fx.tilt(root, { max:5 })` en las 4 cards de colección; `fx.reveal`, `fx.magnetic`, `fx.counters` (200h, 14, 100%).
  - Sin setInterval.
- **Detalles:** nav de tres zonas (enlaces izquierda / logo Italiana 26px tracking .3em centrado / enlaces + toggle derecha), padding `30px 56px`, enlaces uppercase 12px tracking .16em `rgba(23,22,26,.65)`; mismo `gap:…px` inválido que 02. CTA «Descubrir» como texto con círculo de 44px con borde `#17161a` y «→». Miniaturas blancas 120×140 radio 14px con sombra `0 20px 50px rgba(43,26,74,.12)`; iconos ◇ ◈ en cuadrados de 40px radio 12px. Colección en 4 columnas con cards de 420px y radio 6px, alternando `margin-top: 0 / 48px` (escalonado). Bloque «El oficio» oscuro dentro de márgenes de 56px, radio 6px. Newsletter: input sin caja, solo `border-bottom:1px solid #17161a`, botón «Unirse →». Vidrio, marquee y cursor: no lo define.
- **Móvil:** no define media queries (4 columnas y posiciones absolutas fijas; solo las letras y la imagen escalan con vw/vh). En ≤768px fx.js pinta 11 pétalos.
- **Reutilizar para:** joyería o relojería, moda de autor, perfumería o cosmética premium, marca personal editorial.

### 04 Nebula — hardware / dispositivo de IA (claro)
- **Concepto:** «Innovación & precisión»: render del producto flotando en el centro dentro de dos órbitas 3D inclinadas, con la marca fantasma en blanco detrás y tarjetas de vidrio claro alrededor.
- **Paleta:** fondo de página `linear-gradient(180deg, #e9eff7 0%, #cfdcee 100%)` (body `#dfe7f2`); texto `#0d1526`; acento azul `#1e5eff`; secundarios `#7aa2ff`, `#c9d6ea`, `#e3eaf5`; vidrio claro `rgba(255,255,255,.55–.6)` con borde `rgba(255,255,255,.8–.9)`; sombras `rgba(13,21,38,.06–.25)`. **Tipografía:** Sora en todo (300–700); display y mono: no lo define aparte. H1 `clamp(34px,3.6vw,54px)` 300 con «&» en 600 azul; marca fantasma `clamp(100px,17vw,260px)` 700, `letter-spacing:-.05em`.
- **Hero:** (1) degradado de página; (2) halo `radial-gradient(circle, rgba(30,94,255,.22), transparent 60%)` de 900px, blur 30px (`data-depth .1`); (3) órbitas: contenedor `min(80vh,820px)` con `perspective:1200px` y `transform-style:preserve-3d` (`data-depth .15`); anillo exterior borde `rgba(30,94,255,.35)` con punto azul de 14px y `box-shadow 0 0 24px`; anillo interior `inset 8%` discontinuo `rgba(13,21,38,.25)` con punto oscuro de 10px; (4) canvas de burbujas z1; (5) nav z6; (6) «NÉBULA» en `rgba(255,255,255,.75)` con `text-shadow 0 20px 60px rgba(30,94,255,.15)` (`data-depth .05`); (7) producto `min(40vw,520px)` × `min(66vh,620px)` z3 con `drop-shadow(0 50px 80px rgba(13,21,38,.25))` (`data-depth .35`); (8) copy abajo a la izquierda; (9) píldora «Usuarios activos +323» (`data-depth .7`); (10) 3 cards de vidrio abajo a la derecha (`data-depth .55`).
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; marca `fadeIn 1.6s .3s`; producto `popIn 1.4s .5s cubic-bezier(.2,.7,.2,1)`; H1 `fadeUp 1s .9s`; párrafo 1.1s; CTAs 1.3s; píldora 1.5s; cards `fadeUp 1s` a 1.5s / 1.65s / 1.8s.
- **Animaciones:**
  - `popIn`: `opacity 0; scale(.85) translateY(30px)` → `none`.
  - `floatY`: 0 → -14px; `7s ease-in-out infinite` (anidado dentro del popIn para no chocar transforms).
  - `pulse`: `scale(1)` opacidad .6 ↔ `scale(1.15)` .9; `8s ease-in-out infinite` (halo).
  - `orbit3d`: `rotateX(70deg) rotateZ(0 → 360deg)`; `26s linear infinite`.
  - `orbit3dB`: `rotateX(70deg) rotateY(20deg) rotateZ(0 → -360deg)`; `38s linear infinite` (sentido contrario y otra inclinación).
  - `orbit` definida pero sin uso.
  - `fx.particles(bubbleRef, { type:'bubble', count:20, color:'30,94,255', speed:.4 })`: círculos con trazo de 1px que suben.
  - `fx.parallax(root, { max:30 })`; `fx.tilt(root, { max:8 })` en las cards del hero y de características; `fx.reveal` (filas de specs cada 60 ms), `fx.magnetic`. No usa `counters`. Sin setInterval.
- **Detalles:** nav padding `24px 56px`; logo con cuadrado azul de 26px radio 8px; píldora de enlaces `rgba(255,255,255,.55)`, borde `.8`, `blur(14px)`, sombra `0 8px 30px rgba(13,21,38,.06)`, hover fondo `#fff`; CTA «Reservar» píldora `#0d1526`. Primario azul con círculo blanco de 34px y «→», sombra `0 12px 30px rgba(30,94,255,.35)`; secundario de vidrio `rgba(255,255,255,.6)` `blur(10px)`. Avatares apilados de 28px con `margin-left:-8px` y borde blanco de 2px. Cards 170px, radio 18px, `blur(16px)`, icono cuadrado de 36px radio 12px y «↗». Cards de características radio 24px, `min-height:360px`. Tabla de specs con `border-bottom rgba(13,21,38,.12)`. Marquee y cursor: no lo define.
- **Móvil:** no define media queries (producto y órbitas en vw/vh; grids de 3 y 2 columnas fijos). En ≤768px fx.js pinta 10 burbujas.
- **Reutilizar para:** lanzamiento de dispositivo o gadget, domótica o IoT, SaaS de IA con producto «físico», healthtech.

### 05 Crystal Flora — objeto de arte / cristalería (oscuro)
- **Concepto:** «Crystal Lotus»: una flor de cristal que florece desde el desenfoque en el centro, bajo nieve y estrellas titilantes, con un índice numerado de piezas a la izquierda.
- **Paleta:** fondo `#070d1a`; halo `radial-gradient(ellipse 60% 70% at 55% 50%, #1b3358 0%, #070d1a 70%)`; texto `#e8eef8`; acento hielo `#9cc4ff`; superficie de cards `#0f1a2e`; vidrio `rgba(255,255,255,.06)` + borde `.14`; retícula de puntos `rgba(156,196,255,.35)`. **Tipografía:** display Cormorant Garamond (300/400 + itálicas), body Manrope 300–600, mono: no lo define. H1 `clamp(48px,5.4vw,84px)` 300, line-height .95, uppercase, en dos líneas.
- **Hero:** (1) halo radial; (2) canvas `fogRef` z1 (nieve difusa); (3) retícula de puntos 64px, opacidad .35, `mask-image: radial-gradient(ellipse at center, black, transparent 70%)` (`data-depth .1`); (4) flor `min(52vw,760px)` × `min(80vh,780px)` z2 (`data-depth .3`) con glow interior `inset:20%` `rgba(156,196,255,.35)` blur 40px; (5) canvas `snowRef` z3 (estrellas); (6) nav z6; (7) copy + índice a la izquierda (centrado vertical); (8) 2 stat cards arriba a la derecha (`data-depth .6`); (9) card «Tallado en cristal» abajo a la derecha (`data-depth .5`); (10) sello circular de scroll.
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; flor `bloom 1.8s .4s cubic-bezier(.2,.7,.2,1)`; H1 `fadeUp 1.1s .7s`; párrafo `fadeUp 1s 1s`; botón 1.2s; stats `fadeUp 1s` a 1.3s / 1.45s; card inferior `fadeUp 1.1s 1.4s`; sello `fadeIn 1s 1.8s`. El índice no tiene animación de entrada.
- **Animaciones:**
  - `bloom`: `opacity 0; scale(.8); filter: blur(20px)` → `none; blur(0)`.
  - `shimmer`: opacidad .4 ↔ 1; `6s ease-in-out infinite` (glow de la flor).
  - `floatY`: 0 → -10px; `6s ease-in-out infinite` (miniatura).
  - `spin`: `16s linear infinite` sobre `textPath` «SCROLL · DOWN · SCROLL ·».
  - `fx.particles(snowRef, { type:'star', count:120, color:'156,196,255' })`: puntos estáticos (vy 0) de hasta 2.2px con titileo `.5 + .5*sin(t*2)`.
  - `fx.particles(fogRef, { type:'snow', count:60, color:'232,238,248', speed:.5 })`: copos con degradado radial que caen.
  - `fx.parallax(root, { max:30 })`; `fx.tilt(root, { max:6 })` en las 5 cards; `fx.reveal` (delays 0–400), `fx.magnetic` («Saber más»), `fx.counters` (1200°, 14h, 6).
  - Índice de flores (estado `flower`): activa `opacity 1`, resto `.4`, `transition: opacity .4s`; al elegir reinicia `[data-hero-anim]`. Sin setInterval.
- **Detalles:** nav padding `28px 56px`; logo Cormorant 20px tracking .24em; píldora de enlaces borde `rgba(232,238,248,.15)`, fondo `rgba(255,255,255,.04)`, `blur(12px)`, hover `rgba(255,255,255,.1)`; botón de menú circular de 40px «⋮⋮». Botón «Saber más» de vidrio: `rgba(255,255,255,.1)`, borde `.25`, `blur(10px)`, píldora. Stat cards 150px, radio 16px, `blur(16px)`, unidad en `#9cc4ff`. Numeración 01/02/03 en el índice y 01–05 en la esquina de cada card. Colección en carrusel horizontal: `display:flex; overflow-x:auto; scrollbar-width:none`, cards `flex:0 0 300px` de 420px, radio 20px, borde `rgba(255,255,255,.08)`. Marquee y cursor: no lo define.
- **Móvil:** no define media queries (el carrusel horizontal ya funciona con el dedo; lo demás es absoluto y fijo). En ≤768px fx.js pinta 60 estrellas y 30 copos.
- **Reutilizar para:** galería o artista de objetos, cristalería o cerámica de autor, floristería de lujo, perfume o producto «de invierno».

### 06 Terra — expediciones / viajes de aventura de lujo (oscuro)
- **Concepto:** paisaje épico a pantalla completa que "se asienta" (Ken Burns inverso) bajo nieve y niebla dorada; editorial de revista de viajes.
- **Paleta:** fondo `#0a0908`; texto `#f1ebe0` (secundario `rgba(241,235,224,.7/.6/.55/.45/.4)`); acento oro `#d4a95a`; card fondo `#141210`; badge "Extremo" `#8a2b1f`; badge claro `rgba(241,235,224,.9)`; reglas `rgba(241,235,224,.14/.15/.2)`; vidrio caption `rgba(10,9,8,.6)` + `blur(8px)`.
- **Tipografía:** display Playfair Display 400 (con `<em>` itálica en oro) / body Manrope 300-600 / mono: no lo define. H1 `clamp(52px,6.4vw,104px)`, line-height 1; H2 `clamp(40px,4.6vw,72px)`; CTA final `clamp(44px,6vw,92px)`.
- **Hero (100vh, min 760px), capas:** 1) imagen en wrapper `inset:-4%` con `data-depth="0.2"` + `kenBurns 3s cubic-bezier(.2,.7,.2,1) both`; 2) gradiente vertical `rgba(10,9,8,.7) 0% → .15 35% → .2 60% → .95 100%`; 3) canvas niebla (z 2); 4) canvas nieve (z 3); 5) bloque texto z 4 abajo (`bottom:130px`) en grid `1fr auto` (copy | 3 stats); 6) nav z 6; 7) barra inferior "Desplázate ↓ · Est. 2014 · ciudades".
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; eyebrow `fadeUp 1s .6s`; H1 línea 1 `fadeUp 1.1s .8s`, línea 2 `fadeUp 1.1s 1s`; botones `fadeUp 1s 1.3s`; stats `fadeUp 1s 1.5s`; barra inferior `fadeIn 1s 1.8s` (todas `both`).
- **Animaciones:**
  - `@keyframes kenBurns` `scale(1.15) translateY(-2%) → scale(1) translateY(0)`, 3s, una vez.
  - `@keyframes fadeUp` `opacity 0, translate3d(0,40px,0) → none`; `fadeIn` opacidad.
  - `@keyframes wipe` (`clip-path: inset(0 100% 0 0) → inset(0)`) y `lineGrow` (`scaleX 0→1`) están definidos pero no se usan.
  - `fx.particles(snowRef, { type:'snow', count:90, color:'241,235,224', speed:.6 })` — copos con gradiente radial, caen con vaivén `sin(t)·.3`.
  - `fx.fog(fogRef, { count:7, color:'212,169,90', alpha:.14, speed:.6 })` — blobs radiales de radio 15-35 % del ancho que derivan en x y reaparecen por la izquierda.
  - `fx.parallax(root, { max:20 })` sobre la imagen del hero (depth .2).
  - `fx.reveal(root)` con delays 0/100/200/300 (cards) y 0/80/160/240/320 (itinerario).
  - `fx.magnetic(root)` (strength .35 por defecto) en `[data-magnetic]`: CTA nav, "Explorar destinos", "Hablar con un experto".
  - `fx.counters(root)`: 47+ / 18 / 12.
  - Sección itinerario: imagen `position:sticky; top:80px; height:70vh; min-height:480px` en grid `1fr 1fr` mientras la lista de días hace scroll (sticky puro, sin progreso p).
- **Detalles:** nav absoluta sin fondo ni blur, `padding:28px 56px`; logo "TERRA & CO." Playfair 22px `letter-spacing:.1em`; links 12px uppercase `.16em` (su `gap:clamp(14px,2vw,34px)px` es CSS inválido: se ignora). Botones rectos sin radio: ghost borde oro → hover fondo `#d4a95a` texto `#0a0908`; primario sólido `#f1ebe0`; "Ver la película" con círculo 40px borde `rgba(241,235,224,.5)` e icono ▶. Stats separados por `border-left:1px solid rgba(241,235,224,.2)`, número Playfair 44px oro. Cards destino 4 columnas, 500px de alto, gradiente `transparent 45% → rgba(10,9,8,.92)`, badge de dificultad arriba, regla superior en el pie de la card. Numeración de días 01/03/06/09/12 en Playfair 30px oro con `border-top` entre filas. CTA con imagen al 50 % de opacidad y gradiente `#0a0908 → transparent 30%/70% → #0a0908`. Cursor: no lo define. Marquee: no lo define.
- **Móvil:** no define media queries (grids de 4 y 2 columnas y paddings de 56px fijos). Reduced-motion: solo el de `fx.js`.
- **Reutilizar para:** turismo de aventura/lujo, hoteles de montaña o ecolodges, fotografía de paisaje, documentales/expediciones.

### 07 Origen Cafe — café de especialidad / tostador (oscuro con panel claro)
- **Concepto:** hero partido "papel + foto": panel crema recortado en diagonal con el nombre en vertical letra por letra, frente a un panel oscuro con granos flotantes, brasas y vapor.
- **Paleta:** fondo `#1c120c`; texto `#f1e9df`; panel papel `#efe8dc` con texto `#1c120c` (secundario `rgba(28,18,12,.7/.6/.5)`); acento caramelo `#c98a3c`; card fondo `#2a1a10`; granos `linear-gradient(145deg,#8a5a34,#3a2114)`; vidrio card `rgba(28,18,12,.55)` + borde `rgba(241,233,223,.14)` + `blur(16px)`; reglas `rgba(241,233,223,.14)`.
- **Tipografía:** display Bebas Neue / body DM Sans 300-500 / mono: no lo define. H1 `clamp(90px,12.5vh,160px)` (en **vh**), line-height .86, apilado en columna; H2 proceso `clamp(56px,7vw,120px)`, H2 carta `clamp(48px,5vw,84px)`.
- **Hero (100vh, min 760px), grid `44% 56%`:** izquierda panel papel con `clip-path:polygon(0 0,100% 0,97% 100%,0 100%)` (nav, H1 vertical + texto, pie "Desplázate ↓ · Huila · 1.850 msnm"). Derecha: 1) imagen `inset:-4%` depth .2; 2) gradiente `90deg rgba(28,18,12,.5) → transparent 30%`; 3) canvas brasas y canvas vapor (z 1); 4) 7 granos CSS flotantes; 5) card vidrio "Lote 042" (depth .5) abajo-derecha; 6) links de nav arriba-derecha.
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; links derecha `fadeIn 1s .4s`; letras O-R-I-G-E-N `dropIn .9s cubic-bezier(.2,.7,.2,1)` con delays 0.3→0.8s (paso 0.1s); eyebrow `fadeUp 1s .9s`; párrafo 1.1s; CTA 1.3s; redes 1.5s; card `fadeUp 1.2s 1.6s`; pie `fadeIn 1s 1.8s`.
- **Animaciones:**
  - `@keyframes dropIn` `opacity 0, translate3d(0,-120%,0) rotate(-8deg) → none` (letras caen desde arriba).
  - `@keyframes floatBean` `0/100 % translate(0,0) rotate(var(--r))`, `50 % translate(6px,-18px) rotate(var(--r)+12deg)`; `ease-in-out infinite`, duración `5 + i·0.7 s` (5 → 9.2s), delay `-0.9·i s`; cada grano con `--r` propio (-20…60deg), tamaño 30-62px ancho × 1.35 alto, `border-radius:50%` y una ranura central de 2px rotada 6deg; `data-depth` .4-.9.
  - `@keyframes steam` `0 % opacity 0 → 30 % .5 → 100 % opacity 0 translateY(-60px) scaleX(1.6)`, `3s ease-out infinite` (segunda voluta delay 1.2s), manchas `rgba(241,233,223,.5)` con `blur(6px)` sobre la foto de la taza.
  - `@keyframes marquee` `translateX(0 → -50%)`, `30s linear infinite`, lista duplicada.
  - `fx.particles(emberRef, { type:'ember', count:50, color:'201,138,60', speed:.5 })` — suben desde abajo con `shadowBlur 12`.
  - `fx.fog(steamRef, { count:5, color:'241,233,223', alpha:.1, speed:.4 })`.
  - `fx.parallax(root, { max:26 })`, `fx.reveal(root)` (delays 0/120/240 y 0/60/…/240), `fx.magnetic(root)`, `fx.tilt(root, { max:5 })` en las 3 cards de proceso `[data-tilt]`.
- **Detalles:** nav dentro del panel papel (logo Bebas 26px `.14em`, botón idioma borde `rgba(28,18,12,.3)`); links a la derecha 12px uppercase. Botones rectos: CTA oscuro `#1c120c` con flecha →, "Pedir en línea" crema `#efe8dc`. Marquee banda sólida `#c98a3c`, Bebas 22px, separador ● con `margin-left:36px`, `gap:48px`. Cards de proceso 460px con numeración 01/02/03 Bebas 56px caramelo, gradiente `rgba(28,18,12,.3) → transparent 30% → .95`. Carta en filas `1fr auto` con precio Bebas 26px caramelo y `border-top`. Hover links: `#fff` (nav) y `#c98a3c` (global). Cursor: no lo define.
- **Móvil:** no define media queries (el grid 44/56 del hero y los grids de 3 y 2 columnas son fijos). Reduced-motion: solo `fx.js`; `floatBean`, `steam`, `dropIn` y `marquee` siguen corriendo.
- **Reutilizar para:** cafeterías y tostadores, chocolate/cacao de origen, panaderías artesanales, marcas agro de comercio directo.

### 08 Studio Koan — estudio creativo / agencia de diseño (claro)
- **Concepto:** portafolio de estudio juguetón: blobs pastel en malla, retícula de puntos ondulante, H1 con palabra tecleada, cursor naranja y grid de trabajos escalonado.
- **Paleta:** fondo `#f5f3ee`; texto `#111` (secundario `rgba(17,17,17,.7/.6/.55/.45)`); acento naranja `#ff5a1f`; blobs `#ffd6c2` y `#e4e0ff` (opacity .7, `blur(90px)`); fondos de proyecto `#1e5eff`, `#3a2114`, `#2b1a4a`, `#c5124d`; tags vidrio `rgba(245,243,238,.85)` + `blur(8px)`; CTA bloque `#111`; reglas `rgba(17,17,17,.12/.14)`.
- **Tipografía:** display Syne 600-800 / body DM Sans 300-500 / mono: no lo define. H1 Syne 700 `clamp(60px,8.4vw,136px)`, line-height .92, `letter-spacing:-.045em`; H2 `clamp(36px,4vw,64px)`; CTA `clamp(44px,5.6vw,92px)`.
- **Hero (min-height 100vh, flex columna):** 1) capa de blobs (`mesh1` arriba-derecha 60×80 %, `mesh2` abajo-izquierda 50×70 %); 2) canvas `dotWave` (z 0); 3) nav z 2; 4) grid `1fr 380px`: copy (eyebrow con punto naranja 8px, H1 de 3 líneas, 2 botones) | card showreel 460px `border-radius:24px` depth .4 con sello circular giratorio.
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; eyebrow `fadeUp 1s .5s`; H1 líneas `fadeUp 1.1s` a .7s / .9s / 1.1s; botones `fadeUp 1s 1.4s`; showreel `fadeUp 1.2s 1.2s`.
- **Animaciones:**
  - `@keyframes mesh1` `0/100 % translate(0,0) scale(1)`, `33 % translate(12%,-8%) scale(1.15)`, `66 % translate(-8%,10%) scale(.95)`; `18s ease-in-out infinite`. `mesh2` análogo (`scale 1.1 / .9 / 1.2`), `22s`.
  - `@keyframes blink` `0-49 % opacity 1 / 50-100 % 0`, `1s step-end infinite` — caret de `.06em × .8em` negro en la línea 2 del H1.
  - `fx.typewriter(['marcas','productos','experiencias','historias'], cb)` — defaults `speed 55ms`, `erase 28ms`, `hold 1600ms`, pausa 400 ms entre frases (setTimeout). En el HTML convertido el texto tecleado no se pinta (setState no-op): solo se ve el caret.
  - `@keyframes spin` `rotate(360deg)`, `12s linear infinite` sobre SVG `textPath` circular (r 38) "SHOWREEL · 2026 · PLAY ·", con botón ▶ naranja en `inset:30px`.
  - `@keyframes marquee` `translateX(0 → -50%)`, `32s linear infinite`, nombres de clientes Syne 600 22px `rgba(17,17,17,.5)`, `gap:80px`, entre reglas top/bottom.
  - `fx.dotWave(dotRef, { gap:36, color:'17,17,17', amp:5, speed:.8 })` — puntos cuyo radio y alfa siguen `sin(x·.02+t)+cos(y·.02+t·.8)` y se desplazan ±amp.
  - `fx.magnetic(root, { strength:.3 })` también en los links del nav; `fx.tilt(root, { max:4 })` en las 4 cards de trabajo; `fx.parallax(root, { max:18 })`; `fx.reveal(root)` (delays 0/80/160/240 y 0/120).
  - Cursor propio: `mousemove` en window mueve un punto fijo 14px `#ff5a1f`, `mix-blend-mode:multiply`, `transition:width .2s,height .2s`; crece a 44px sobre `a, button, [data-tilt]`; el root lleva `cursor:none`.
- **Detalles:** nav sin fondo, `padding:30px 0`; logo "KŌAN." Syne 800 con punto naranja. Botones píldora `999px`: primario `#111` con círculo interior 40px naranja y ↗ (padding `8px 8px 8px 24px`), secundario borde `rgba(17,17,17,.25)`. Servicios en filas `60px 1fr auto` con numeración 01-04 y círculo 44px ↗ (`transition:all .3s`; la inversión a `#111`/naranja al hover depende del estado, no se aplica en el HTML convertido). Trabajo: grid 2 col con alturas 520/420 y `margin-top` 0 / 100px / 0 / -100px (masonry escalonado), radio 20px, tags píldora vidrio, círculo ↗ crema. CTA bloque `border-radius:32px` con botón circular 180px naranja "Empecemos →".
- **Móvil:** no define media queries (grid `1fr 380px`, `1fr 1.4fr`, 2 columnas fijos; el cursor personalizado no tiene alternativa táctil). Reduced-motion: solo `fx.js`; `mesh1/2`, `blink`, `spin` y `marquee` siguen.
- **Reutilizar para:** estudios de diseño/branding, agencias web y motion, portafolios de freelancers creativos, productoras.

### 09 Elan — inmobiliaria de lujo (oscuro)
- **Concepto:** marca gigante que sube desde una máscara sobre una casa al anochecer con una línea de horizonte naranja; colección en carrusel horizontal guiado por el scroll.
- **Paleta:** fondo `#0e0f12`; texto `#f3f1ec` (secundario `rgba(243,241,236,.75/.7/.6/.55/.45)`); acento naranja `#ff7a33`; card `#17181d`; avatares `#ff7a33`, `#c9c4bb`, `#6b6f7a`, `#f3f1ec`; vidrio nav `rgba(14,15,18,.4)` + borde `rgba(243,241,236,.15)` + `blur(14px)`; vidrio stats `rgba(243,241,236,.08)` + borde `.16` + `blur(16px)`; reglas `rgba(243,241,236,.14)`.
- **Tipografía:** display Archivo Black / body Archivo 300-500 / mono: no lo define. Marca "ÉLAN" `clamp(140px,24vw,380px)`, `letter-spacing:-.04em`, line-height .8; H1 real (tagline) Archivo 300 uppercase `clamp(28px,3vw,44px)`; H2 `clamp(36px,4.6vw,72px)`; CTA `clamp(40px,5.4vw,88px)`.
- **Hero (100vh, min 760px), capas:** 1) imagen `inset:-4%` depth .2; 2) gradiente `rgba(14,15,18,.6) → transparent 30%/55% → .95`; 3) línea horizonte 2px a `bottom:24%` `linear-gradient(90deg,transparent,#ff7a33 30%,#ff7a33 70%,transparent)` con `blur(1px)`; 4) marca gigante en contenedor `overflow:hidden` (z 3) arriba-izquierda (`top:15%`) + subtítulo; 5) tagline + CTA abajo-izquierda; 6) 2 cards vidrio de stats (depth .6) y fila de avatares abajo-derecha; 7) nav z 6.
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; letras É-L-A-N `riseWord 1.2s cubic-bezier(.2,.7,.2,1)` delays .4/.5/.6/.7s; subtítulo `fadeUp 1s 1s`; H1 `fadeUp 1s 1.2s`; CTA `fadeUp 1s 1.4s`; stats `fadeUp 1s` a 1.4s y 1.55s; avatares `fadeUp 1s 1.8s`.
- **Animaciones:**
  - `@keyframes riseWord` `opacity 0, translate3d(0,110%,0) → none` (subida enmascarada por el `overflow:hidden` del contenedor).
  - `@keyframes glowLine` `0/100 % opacity .6, 50 % 1`, `3s ease-in-out infinite`.
  - Colección scroll-driven: sección `height:400vh`; hijo `position:sticky; top:0; height:100vh; overflow:hidden`; `fx.scrollProgress(hRef, cb, { sticky:true })` → p = recorrido / (alto − vh); el track (flex, `gap:24px`, `will-change:transform`) recibe `translate3d(-p·(scrollWidth − innerWidth + 56)px,0,0)` y una barra de 120×2px `transform:scaleX(p)` (`transform-origin:left`). 5 cards `flex:0 0 min(38vw,560px)`, `height:min(60vh,560px)`, radio 18px, + espaciador final `40vw`.
  - `fx.scramble(root)` sobre `[data-scramble]` ("250+", "42"): 1100 ms, revela de izquierda a derecha con caracteres `!<>-_\/[]{}—=+*^?#0123456789`, threshold .3.
  - `fx.cursorFollow(root)`: al pasar por cada fila `[data-follow="elan-fN"]` aparece `#elan-fN` (`position:fixed`, 260×180, radio 14px, sombra `0 30px 60px rgba(0,0,0,.5)`), `opacity 0→1` y `scale .8→1` (`transition .3s`), sigue al cursor con lerp .18 y rota `(x−cx)·.05deg`.
  - `fx.parallax(root, { max:24 })`, `fx.reveal(root)` (delays 0/80/160/240), `fx.magnetic(root)`, `fx.tilt(root, { max:4 })` en las cards del carrusel.
- **Detalles:** nav absoluta `padding:28px 56px`: logo cuadrado 38px con borde y "É", links en píldora de vidrio (cada link píldora, hover fondo `#f3f1ec` texto `#0e0f12`), botón idioma píldora. CTA hero píldora crema con círculo interior 36px oscuro ↗ (`padding:6px 6px 6px 22px`). Cards: numeración 01-05 en píldora vidrio `rgba(14,15,18,.55)` + `blur(8px)` arriba-izquierda, estado en píldora naranja arriba-derecha, precio Archivo Black 22px. Avatares apilados 44px con `margin-left:-10px` y borde 2px del color de fondo. Servicios en filas `50px 1fr auto` numeradas 01-04, hover texto naranja. CTA bloque naranja `border-radius:24px` con botón píldora oscuro. `overflow-x:clip` en el root (no rompe el sticky).
- **Móvil:** no define media queries (el carrusel ya usa `min(38vw,560px)` y `min(60vh,560px)`; grid de servicios `.8fr 1.2fr` fijo). Reduced-motion: `scrollProgress` no se monta en `fx.js` → el track horizontal queda en `translate 0` dentro de 400vh de scroll (sin carrusel); `riseWord` y `glowLine` siguen.
- **Reutilizar para:** inmobiliarias y desarrolladoras premium, arquitectura/interiorismo, hoteles boutique, concesionarios de lujo.

### 10 Bluebird — ciberseguridad con IA / SaaS B2B (claro)
- **Concepto:** radar que barre detrás de un wordmark serif gigante y un pájaro flotante; producto de seguridad explicado en tres capas con panel fijo que cambia por scroll.
- **Paleta:** fondo body `#dde9f5`, root `linear-gradient(180deg,#e6eff9,#cfdff0 60%,#e6eff9)`; texto navy `#0b1a2e` (secundario `rgba(11,26,46,.75/.65/.6/.45)`); acento azul `#1747ff`; azul claro `#7fa3ff`, `#c9d8ee`; wordmark `rgba(255,255,255,.85)` con `text-shadow:0 30px 80px rgba(23,71,255,.15)`; vidrio `rgba(255,255,255,.55)` / `.6` / `.7` + borde `#fff` + `blur(10-18px)`; sombras `rgba(11,26,46,.1/.12/.25)`; CTA `#0b1a2e` con halo `radial-gradient(circle,rgba(23,71,255,.5),transparent 60%)` `blur(40px)`.
- **Tipografía:** display Instrument Serif 400 (itálica en `<em>`) / body Geist 300-600 / mono: no lo define. H1 wordmark `clamp(120px,19vw,300px)`, line-height .9; H2 hero `clamp(34px,3.6vw,54px)`; H2 pasos `clamp(40px,4.4vw,68px)`; CTA `clamp(44px,5.6vw,92px)`.
- **Hero (100vh, min 760px), capas:** 1) radar centrado `min(90vh,900px)` al 50 % de opacidad, depth .1: 3 anillos (`inset` 0/16 %/32 %, borde `rgba(11,26,46,.15)`), barrido `conic-gradient(from 0deg,rgba(23,71,255,.35),transparent 60deg)`, 4 pings; 2) H1 "BLUEBIRD" centrado `top:14%` (z 1, `pointer-events:none`); 3) pájaro PNG `min(36vw,520px) × min(72vh,700px)` depth .35 con `drop-shadow(0 40px 60px rgba(11,26,46,.3))` (z 2); 4) copy abajo-izquierda; 5) 3 cards abajo-derecha (depth .6) y píldora de usuarios activos a `top:38%` (z 4); 6) nav z 6.
- **Secuencia de entrada:** nav `fadeIn 1s .2s`; letras `letter 1.2s cubic-bezier(.2,.7,.2,1)` con delays 0.3→0.86s (paso .08s); pájaro `fadeIn 1.6s .6s`; H2 `fadeUp 1s 1s`; párrafo 1.2s; botones 1.4s; cards 1.5 / 1.65 / 1.8s; píldora usuarios 1.9s.
- **Animaciones:**
  - `@keyframes letter` `opacity 0, translate3d(0,40%,0), blur(8px) → none, blur(0)`.
  - `@keyframes sweep` `rotate(360deg)`, `6s linear infinite` (barrido del radar).
  - `@keyframes ping` `scale(.3) opacity .9 → scale(2.6) opacity 0`, `2.4s ease-out infinite`, delays 0 / .8 / 1.6 / .4s; puntos 14px `#1747ff` con `box-shadow:0 0 0 3px rgba(23,71,255,.2)`.
  - `@keyframes floatY` `0/100 % 0, 50 % translateY(-12px)`, `8s ease-in-out infinite` (pájaro; anidado dentro del wrapper de parallax y del fadeIn para no pisar transforms).
  - `@keyframes dash` (`stroke-dashoffset:0`) definido pero no se usa.
  - Pasos scroll-driven: sección `height:320vh`; hijo `position:sticky; top:0; height:100vh` en grid `1fr 1fr`; `fx.scrollProgress(stepsRef, cb, { sticky:true })` → `step = min(2, floor(p·3))`; mapea estado: fila activa `opacity 1` (resto `.35`, `transition .4s`), número en círculo 36px `#1747ff`/blanco vs transparente; panel derecho `70vh` radio 28px con 3 imágenes apiladas `opacity 0↔1` y `scale(1.08)↔1` (`transition: opacity .6s, transform .8s cubic-bezier(.2,.7,.2,1)`) y etiqueta "01 / 03 · Detecta". En el HTML convertido queda fijo en el paso 01 (setState no-op).
  - `fx.parallax(root, { max:26 })`, `fx.reveal(root)` (delays 0/80/160/240), `fx.magnetic(root)`, `fx.tilt(root, { max:8 })` en las 3 cards del hero, `fx.counters(root)` (42 %, 4B, 12ms, 99.99 %, 340+).
- **Detalles:** nav absoluta `padding:26px 56px`, sin fondo; logo con pájaro hecho con `clip-path:polygon(0 50%,60% 0,100% 20%,70% 55%,100% 100%,40% 80%)` 28×18 azul; botón "Recursos" píldora vidrio blanco. CTA primario píldora azul con círculo blanco 34px y → y sombra `0 14px 30px rgba(23,71,255,.35)`; secundario píldora vidrio. Cards hero radio 20px: vidrio con icono en cuadrado 40px radio 14px navy + badge "Perfect Security"; card blanca sólida con esfera `radial-gradient(circle at 30% 30%,#7fa3ff,#1747ff)`; card contador Instrument Serif 56px. Avatares 26px apilados `margin-left:-8px` borde 2px blanco. Stats: 4 cards radio 24px `rgba(255,255,255,.6)` + borde `#fff`, número serif 64px azul. CTA bloque navy radio 32px con halo azul. Cursor: no lo define.
- **Móvil:** no define media queries (grid de pasos `1fr 1fr` y stats de 4 columnas fijos; el hero usa `min(36vw…)`/`min(90vh…)`). Reduced-motion: sin `scrollProgress` el paso queda en 01 durante los 320vh; `sweep`, `ping`, `floatY` y `letter` siguen.
- **Reutilizar para:** ciberseguridad y SaaS B2B de IA, monitoreo/observabilidad, fintech antifraude, logística o telemetría con "vigilancia" en tiempo real.

### 11 Synapse — entrenamiento cognitivo / edtech (claro)
- **Concepto:** «cerebro» 3D central con glow naranja pulsante rodeado de cards de vidrio flotantes con datos; hero tipo slider de 2 titulares.
- **Paleta:** fondo `#eef0f4` (hero con `radial-gradient(ellipse 50% 60% at 62% 50%,#fff 0%,#eef0f4 70%)`); texto `#15161c` y secundario `rgba(21,22,28,.6)`/`.62`/`.55`; acento `#ff5c3a` (hover de links, play, CTA Pro); segundo acento `#8c7ad6` (palabra `em` del H1, card 02); gris `#d9dce6`; vidrio `rgba(255,255,255,.55)`/`.6` + borde `1px solid #fff`.
- **Tipografía:** display Cormorant (300/400/500, mayúsculas) / body Figtree (300-600) / mono: no lo define. H1 `clamp(56px,6.6vw,104px)`, line-height .92, letter-spacing -.01em, uppercase; H2 `clamp(44px,5vw,80px)`; H3 cards `clamp(34px,3.6vw,56px)`.
- **Hero:** section `height:100vh; min-height:760px` → nav absoluta (z6) → bloque cerebro en `left:58%; top:52%`, `width:min(44vw,620px); height:min(76vh,720px)` (z2) con: glow `inset:20%` radial `rgba(255,92,58,.45)` + `blur(40px)`, imagen, botón play 84px → copy a la izquierda `left:56px; max-width:520px` (z4) → 3 cards glass (z4) → contador de slide + tagline «Tu mente, a otro nivel».
- **Entrada:** nav `fadeIn 1s .2s`; cerebro `fadeIn 1.6s .5s`; H1 por líneas `fadeUp 1.1s` a .6s / .75s / .9s; párrafo `fadeUp 1s 1.1s`; CTA 1.3s; card Insights 1.5s; pill avatares 1.6s; card gauge 1.7s; tagline 1.8s; contador `fadeIn 1s 1.9s`. Todas con `both`, sin easing explícito (ease por defecto). `fadeUp` = `translate3d(0,40px,0)`+opacity 0 → none.
- **Animaciones:**
  - `glowPulse` 4s ease-in-out infinite: opacity .5→.9, scale 1→1.08 en 50%.
  - `pulseRing` 2.2s ease-out infinite, dos anillos (el segundo con delay 1.1s): scale 1→2.2, opacity .7→0, borde `2px solid #ff5c3a`.
  - `wave` (sparkline SVG): `stroke-dasharray/offset 400` → 0, 2.4s, delay 1.8s, ease-out, forwards.
  - `lineGrow` 7s linear infinite: `scaleX(0→1)` origen left, barra de 60px del contador 02—01 (sincroniza con el slider).
  - `setInterval` 7000 ms: `slide = (slide+1)%2` y `replayHero()` reinicia animaciones de `[data-hero-anim]` (`animation='none'`, reflow `offsetWidth`, restaurar).
  - `fx.parallax(root,{max:24})` sobre `data-depth`: cerebro 0.3, card Insights 0.6, pill avatares 0.7, card gauge 0.5 (lerp .08).
  - `fx.reveal` (`data-reveal`, delays 0/100/200), `fx.magnetic` (play, CTAs; strength .35), `fx.tilt(root,{max:4})` en pricing, `fx.counters` (`data-count="345"`, 1400 ms easeOutCubic).
  - Stacked cards: 3 `article` con `position:sticky; top:80px / 100px / 120px`, `min-height:70vh`, `border-radius:28px`, `box-shadow:0 -20px 60px rgba(21,22,28,.08)`; el apilado es CSS puro, sin JS.
- **Detalles:** nav sin fondo ni blur, padding 26px 56px; logo = aro 22px con punto naranja 8px; toggle «ES · EN» pill; hamburguesa de 2 rayas (22×12px). CTA hero pill con icono circular negro 44px, `background:rgba(255,255,255,.6)`, `backdrop-filter:blur(10px)`. Cards glass: `blur(16px)` (pill `blur(14px)`), radius 18/20px, sombra `0 20px 50px rgba(21,22,28,.08)`. Gauge semicircular con `border-top/left-color:#ff5c3a` rotado -20deg. Avatares solapados `margin-left:-8px`. Numeración 01/02/03 en Cormorant 80px opacity .35. Pricing con alturas 480/540/480px alineadas `align-items:end` (el Pro, oscuro, sobresale). Sin marquee ni cursor custom.
- **Móvil:** no lo define (sin media queries; grids 1fr 1fr y 3 columnas fijas).
- **Reutilizar para:** apps de bienestar/salud mental, edtech o coaching, wearables/biometría, SaaS de IA con «producto héroe» central.

### 12 Pulse SaaS — analítica SaaS / dev tools (oscuro)
- **Concepto:** hero centrado estilo Linear/Vercel con un mockup de dashboard en perspectiva 3D que se endereza al hacer scroll.
- **Paleta:** fondo `#08090c`; mockup `#0e1015`; texto `#eef0f4`, secundario `rgba(238,240,244,.6)`/`.5`/`.4`; acento verde neón `#8cff6a`; secundario cian `#5ee2ff` (gradiente del H1 `linear-gradient(90deg,#8cff6a,#5ee2ff)` con background-clip text); superficies `rgba(238,240,244,.03)` + borde `rgba(238,240,244,.08)`; semáforo `#ff5f57 #febc2e #28c840`.
- **Tipografía:** display y body Geist (300-700) / mono Geist Mono (400/500, en KPIs, precios, numeración, `$ npm i`). H1 `clamp(48px,6.4vw,96px)`, weight 600, line-height .98, letter-spacing -.045em; H2 features `clamp(36px,4.2vw,64px)` -.04em; H2 precios `clamp(32px,3.6vw,54px)`.
- **Hero:** section `min-height:100vh` → grid de líneas 64×64px `rgba(238,240,244,.05)` con `mask-image:radial-gradient(ellipse at 50% 0%,black 20%,transparent 70%)` → glow `900×600px` en `top:-20%` radial `rgba(140,255,106,.22)` + `blur(60px)` → nav → badge «Nuevo… v4.0» → H1 → párrafo → 2 CTAs → mockup (`perspective:1600px` en wrapper).
- **Entrada:** nav `fadeIn 1s .2s`; badge `fadeUp 1s .4s`; H1 .6s; p .8s; CTAs 1s; mockup `fadeUp 1.4s 1.1s`; línea del chart `wave 2.6s 1.6s ease-out forwards` (dasharray 900); barras `bar 1s cubic-bezier(.2,.7,.2,1)` con delays 1.6s + i·0.08s (1.6→2.08s).
- **Animaciones:**
  - Mockup 3D scroll-driven: estado inicial `transform:rotateX(24deg) scale(.94); transform-origin:top center`. `fx.scrollProgress(mockWrapRef, p)` (sin sticky): `k = clamp((p-.15)/.35)` → `rotateX(24-24k deg) scale(.94+.06k)`.
  - `bar`: `scaleY(0→1)` con `transform-origin:bottom`; 7 barras de 42/68/55/80/62/92/74%, la 6.ª en `#8cff6a`.
  - `marquee` 36s linear infinite: `translateX(0→-50%)`, logos duplicados (6×2), gap 80px, `rgba(238,240,244,.4)`.
  - `blinkDot` 1.6s ease-in-out infinite: opacity 1→.2, punto del logo con `box-shadow:0 0 16px #8cff6a`.
  - `beam` 4s linear infinite: línea de 1px y 30% de ancho `linear-gradient(90deg,transparent,#8cff6a,transparent)` que recorre el borde superior de cada card bento (`translateX(-100%→400%)`), delays 0/100ms.
  - `fx.reveal`, `fx.magnetic`, `fx.tilt(root,{max:3})` en bento.
  - Toggle Mensual/Anual: precio `m*.8` en anual (queda en Mensual en el HTML plano).
- **Detalles:** nav relativa (no fija), links en cápsula `border 1px rgba(238,240,244,.12)`, `background rgba(238,240,244,.03)`, padding 4px; hover de link `background:rgba(238,240,244,.08)`. Botones radius 8-10px (no pill): primario `#8cff6a` con `box-shadow:0 10px 40px rgba(140,255,106,.3)`; secundario borde con prompt `$` en mono. Badge pill `border rgba(140,255,106,.3)` + fondo `.06` con chip «v4.0». Mockup: barra de ventana con semáforo + URL mono, sidebar 200px, KPIs y chart de área con gradiente `#8cff6a` .35→0. Bento 3 cols, `grid-auto-rows:280px`, spans 2/1/1/2, radius 20px, numeración 01-04 en mono, hover `border-color:rgba(140,255,106,.4)`. Plan «Growth» destacado: fondo `rgba(140,255,106,.05)`, borde `.4`, tag «Más popular» (en los otros planes el tag queda con opacity 0 para no mover el layout). Checks `✓` en verde. Sin cursor custom.
- **Móvil:** no lo define.
- **Reutilizar para:** SaaS B2B de datos/analítica, dev tools/APIs, fintech dashboards, lanzamientos de producto con mockup.

### 13 Noir Parfum — perfumería de lujo / e-commerce de producto único (oscuro)
- **Concepto:** frasco central con humo sobre un título gigante con brillo dorado, seguido de un reveal de imagen por máscara que se abre con el scroll.
- **Paleta:** fondo `#050505`; hero `radial-gradient(ellipse 40% 60% at 50% 60%,#2a1d0c 0%,#050505 70%)`; texto crema `#efe9df`, secundario `rgba(239,233,223,.6)`/`.5`/`.4`; acento oro `#c8a45c`; degradé del título `#3a2c14 → #c8a45c 45% → #f5e6c4 50% → #c8a45c 55% → #3a2c14`; humo `rgba(239,233,223,.5)`; sombra del frasco `rgba(200,164,92,.45)`; overlay de imagen `rgba(5,5,5,.35)`.
- **Tipografía:** display Bodoni Moda (400/500 + itálica 400, opsz 6..96) / body Jost (300/400/500) / mono: no lo define. H1 «Ombre» `clamp(110px,18vw,290px)`, line-height .9, letter-spacing .04em, uppercase; H2 reveal `clamp(44px,6vw,96px)`; H2 notas `clamp(40px,4.6vw,72px)`. Microtexto 10-11px con tracking .24-.34em.
- **Hero:** section `height:100vh; min-height:760px` → radial ámbar → nav absoluta 3 zonas (links / logo «NOIR» centrado tracking .34em / links + idioma) → H1 gigante `top:18%` (z1, detrás) → frasco `width:min(30vw,420px); height:min(78vh,760px)` (z2) con 4 volutas de humo + imagen + sombra elíptica dorada `blur(14px)` → copy izquierda `bottom:100px` → selector de tamaño + precio derecha → «Desplázate ↓».
- **Entrada:** nav `fadeIn 1s .2s`; H1 `fadeIn 1.4s .3s` + `shimmer 8s linear 1.6s infinite`; frasco `rise 1.8s .5s cubic-bezier(.2,.7,.2,1)` (`translate3d(0,120px,0) scale(.9)` → none); eyebrow `fadeUp 1s 1.1s`; H2 1.25s; p 1.4s; CTA 1.55s; bloque derecho 1.4s; «Desplázate» `fadeIn 1s 2s`.
- **Animaciones:**
  - `shimmer`: `background-size:200% auto`, `background-position:200% → -200% center`, texto con `background-clip:text`.
  - `smoke` 6s ease-out infinite, 4 manchas 60×90px `blur(18px)` en left 30/45/55/38%, delays 0/1.5/3/4.5s: opacity 0→.35 (20%)→0, `translateY(-160px) scale(1.8) translateX(30px)`.
  - Mask reveal scroll-driven: section `height:220vh`, hijo `position:sticky; top:0; height:100vh`; `fx.scrollProgress(maskWrapRef, cb, {sticky:true})`, easing `e = 1-(1-p)^2`, mapea `clip-path: inset(v% h% v% h% round r px)` con v 40→0, h 30→0, r 400→20. Texto encima con `mix-blend-mode:difference`.
  - `spin` 30s linear infinite: SVG 220px con `textPath` circular «DESCUBRE · MAISON NOIR · GRASSE ·», botón circular crema en `inset:60px`.
  - `fx.parallax(root,{max:22})`: frasco `data-depth="0.3"`, bloque de precio 0.6. `fx.reveal` (delays 0/120/240), `fx.magnetic`, `fx.tilt(root,{max:5})` en las imágenes de notas.
- **Detalles:** botones rectos (sin radius): «Añadir al carrito» crema sobre negro, tracking .24em; selector 30/50/100 ml con activo `#c8a45c` y `transition:all .3s` (precios € 120/190/320). CTA «Descubrir las notas» con círculo 44px borde oro. Timeline de 3 notas con regla horizontal `linear-gradient(90deg,transparent,rgba(200,164,92,.5),transparent)` en `top:44px` y medallones 48px con numeración romana I/II/III. Sin nav blur, sin marquee, sin cursor custom.
- **Móvil:** no lo define.
- **Reutilizar para:** perfumería/cosmética premium, licores y vinos, joyería, lanzamiento de un solo producto de lujo.

### 14 Chrono — relojería de lujo (oscuro)
- **Concepto:** hero fijado 400vh donde el reloj gira y crece con el scroll mientras el título se desvanece y aparecen 4 fichas técnicas por pasos.
- **Paleta:** fondo `#0a0a0b`; hero `radial-gradient(ellipse 50% 60% at 50% 50%,#1c1913 0%,#0a0a0b 70%)`; texto `#e9e7e2`, secundario `rgba(233,231,226,.6)`/`.55`/`.5`/`.4`; acento champán `#b9a27a`; cards `#0f0f11` con borde `rgba(233,231,226,.1)`; anillo `rgba(185,162,122,.2)`.
- **Tipografía:** display Cinzel (400/500/600) / body Outfit (200-500, sobre todo 300) / mono: no lo define. H1 «MERIDIAN» `clamp(90px,15vw,240px)`, letter-spacing .12em, `color:transparent; -webkit-text-stroke:1px rgba(233,231,226,.35)` (solo contorno); H2 manufactura `clamp(34px,3.6vw,54px)`; H2 colección `clamp(32px,3.4vw,52px)`.
- **Hero:** section `height:400vh` → hijo `position:sticky; top:0; height:100vh` con: nav absoluta → reloj centrado `width/height:min(60vh,640px)` (z2) con anillo fijo + anillo con `border-top` que gira → H1 contorneado centrado (z1, detrás) → copy abajo-izquierda → precio «CHF 48.500» abajo-derecha → 4 specs (z5) → barra de progreso «Explora ── 00 / 04».
- **Entrada:** nav `fadeIn 1s .2s`; reloj `fadeIn 1.6s .4s`; H1 `fadeIn 1.6s .6s`; eyebrow `fadeUp 1s 1s`; H2 1.15s; p 1.3s; precio 1.3s.
- **Animaciones:**
  - Pin scroll-driven `fx.scrollProgress(pinRef, cb, {sticky:true})`: reloj `rotate(p·180deg) scale(1+p·.25)`; título `opacity 1-4p` y `translateY(-50%) scale(1+p)`; copy `opacity 1-5p`, `translateY(p·60px)`; barra `scaleX(p)` (origen left, `#b9a27a`).
  - Pasos: `step = p<.12 ? 0 : min(4, 1+floor((p-.12)/.22))`; cada spec pasa de `opacity:0; translateY(30px)` a visible con `transition: opacity .6s, transform .8s cubic-bezier(.2,.7,.2,1)`. Posiciones: izq. `left:56px`, der. `left:calc(100% - 276px)`, filas `top:22%` y `58%`, ancho 220px, regla inferior degradada hacia el reloj.
  - `tick` 60s linear infinite: `rotate(360deg)` del anillo exterior `inset:-6%` con `border-top:1px solid #b9a27a` (segundero).
  - `fx.reveal` (delays 0/80/160/240 y 0/100/200), `fx.magnetic`, `fx.tilt(root,{max:4})` en imagen de manufactura y cards, `fx.counters` con sufijo (`data-count="14" data-suffix=" meses"`, 312, 72 h, 88).
  - Define `lineGrow` y `lineGrowY` pero no los usa.
- **Detalles:** nav sin fondo, padding 30px 56px; logo Cinzel tracking .3em; CTA «Solicitar cita» recto con borde `#b9a27a`, hover relleno `#b9a27a` + texto `#0a0a0b`. Stats en grid 2×2 separadas por `border-top 1px rgba(233,231,226,.12)`. Cards de colección `min-height:520px`, cabecera «Ref. 1962-P / 88 pzs» en 10px tracking .3em, precio en oro. Cabecera de sección con `border-bottom` como regla. Sin radius en ningún elemento, sin marquee ni cursor custom.
- **Móvil:** no lo define (el `left:calc(100% - 276px)` de las specs asume escritorio).
- **Reutilizar para:** relojería/joyería, autos y motos de lujo, gadgets premium con ficha técnica, audio high-end.

### 15 Forma — estudio de arquitectura / portafolio (claro)
- **Concepto:** plano técnico (grid de 56px y reglas que se dibujan) con tipografía editorial, comparador antes/después y lista de proyectos con imagen que sigue al cursor.
- **Paleta:** fondo papel `#f7f6f2`; texto `#161616`, secundario `rgba(22,22,22,.65)`/`.6`/`.5`; gris hover `#8a8a8a`; grid `rgba(22,22,22,.06)`; reglas `rgba(22,22,22,.25)` y `.2`; placeholders `#ddd`, `#c9c6bd`, `#ccc`; CTA invertido fondo `#161616` texto `#f7f6f2`.
- **Tipografía:** display Newsreader (300/400 + itálica 300, opsz 6..72) / body Space Grotesk (300/400/500) / mono: no lo define. H1 `clamp(56px,7.6vw,124px)`, weight 300, line-height .94, letter-spacing -.03em, 2.ª línea con `padding-left:12%` y `<em>`; H2 antes/después `clamp(36px,4vw,64px)`; nombres de proyecto `clamp(28px,3vw,44px)`; CTA `clamp(40px,5vw,84px)`.
- **Hero:** capa fija de grid `background-size:56px 56px` (z0) → 2 reglas verticales fijas en `left:56px` y `right:56px` (z1) → section `min-height:100vh` con nav → regla horizontal → grid `1.2fr .8fr`: H1 en 3 líneas + párrafo + 3 contadores / imagen `min-height:520px` con esquineros de 24px y etiqueta «Casa Umbra · 2025».
- **Entrada:** reglas verticales `drawY 1.6s` delays .3s / .5s `cubic-bezier(.7,0,.2,1)` (origen top); nav `fadeIn 1s .2s`; regla horizontal `drawX 1.4s .6s cubic-bezier(.7,0,.2,1)` (origen left); H1 `fadeUp 1.1s` a .8s / .95s / 1.1s (aquí `fadeUp` = 30px, no 40); p + stats `fadeUp 1s 1.4s`; imagen `wipeUp 1.6s .9s cubic-bezier(.7,0,.2,1)` (`clip-path: inset(100% 0 0 0) → inset(0)`).
- **Animaciones:**
  - `fx.parallax(root,{max:16})`: imagen del hero `data-depth="0.25"`.
  - `fx.cursorFollow(root)`: filas `data-follow="forma-f1…f5"` muestran `#forma-fN` (`position:fixed`, 300×220px, `opacity:0; scale:.8`, `transition:opacity .3s, scale .3s`, `box-shadow:0 30px 60px rgba(0,0,0,.25)`); lerp .18 y `rotate((x-cx)·.05deg)` según velocidad.
  - Antes/después: contenedor `height:70vh; min-height:480px; cursor:ew-resize`; capa «antes» con `clip-path:inset(0 50% 0 0)` y `filter:grayscale(1) contrast(1.1)`; divisor 1px con perilla 48px «◂ ▸». `setBa` limita 2-98 %; en el HTML plano no hay listener conectado (queda fijo al 50 %).
  - `fx.reveal` (delays 0/60/120/180/240), `fx.magnetic` (CTA), `fx.counters` (64 / 12 / 9).
- **Detalles:** nav sin fondo, padding 30px 32px, logo «Forma/Atelier» con barra gris, reloj de ciudad «Bogotá — 06:42» como detalle. Lista de proyectos en grid `70px 1fr 1fr auto` con numeración 01-05, separadores `border-top 1px rgba(22,22,22,.2)`, hover `padding-left:16px`. Esquineros de plano (border-left/top y right/bottom de 24px). Etiquetas «Antes»/«Después» en chips claro/oscuro. CTA en bloque negro con botón recto de borde claro y hover invertido (`background:#f7f6f2; color:#161616`). Sin radius, sin marquee, sin cursor custom (solo la imagen que sigue).
- **Móvil:** no lo define (grids 1.2fr/.8fr y 4 columnas fijas).
- **Reutilizar para:** arquitectura e interiorismo, constructoras/remodelaciones (antes/después), estudios de diseño o fotografía, inmobiliarias boutique.

### 16 Lumen Fest — festival de música (oscuro)
- **Concepto:** cartel de festival cinético: tres filas de tipografía gigante en marquee en sentidos opuestos + póster inclinado + cuenta regresiva.
- **Paleta:** fondo `#0d0b14`; texto `#f6f2ff` (secundario `rgba(246,242,255,.7/.55/.5)`); acento ácido `#d9ff3d`; rosa `#ff3d7f`; violeta `#7b3dff` (solo en el blob); fondo de póster `#1a1626`; bordes `rgba(246,242,255,.25/.3/.4)`. **Tipografía:** display Anton; body y mono Space Mono (400/700). Filas del hero `clamp(90px,14vw,220px)`, line-height .9; H2 Lineup `clamp(56px,8vw,140px)`; nombres de artista `clamp(26px,3vw,44px)`; precios `clamp(56px,6vw,96px)`. No hay `<h1>`.
- **Hero:** (1) blob `70vh×70vh` en left 55%, `linear-gradient(135deg,#ff3d7f,#7b3dff 50%,#d9ff3d)`, `blur(60px)`, opacity .55, `data-depth=0.15`; (2) nav absoluta z6; (3) 3 filas de texto a top 50% z2; (4) póster derecho `min(24vw,340px)×min(58vh,520px)`, borde 2px `#f6f2ff`, `rotate(3deg)`, `data-depth=0.5` + `data-tilt`, z3; (5) fecha + countdown abajo izquierda z4; (6) «Baja ↓ / 3 escenarios · 42 artistas» abajo derecha.
- **Entrada:** nav `fadeIn 1s .2s`; filas `slam 1s` a .4s / .6s / .8s `cubic-bezier(.2,.7,.2,1)`; póster `fadeUp 1.2s 1.2s`; fecha `fadeUp 1s 1.2s`; countdown `fadeUp 1s 1.4s`; texto derecho `fadeIn 1s 1.8s` (todas `both`).
- **Animaciones:**
  - `slam`: de `opacity:0; translate3d(0,-40%,0) skewY(-6deg) scale(1.2)` a `none`.
  - `marqueeL` (`translateX(0)`→`-50%`) y `marqueeR` (`-50%`→`0`), `linear infinite`: fila 1 L 18s (solo contorno: `color:transparent; -webkit-text-stroke:2px rgba(246,242,255,.7)`), fila 2 R 22s (relleno `#f6f2ff`), fila 3 L 26s (`#d9ff3d`); gap 60px, contenido duplicado ×2.
  - `blob`: morph de `border-radius` (`60% 40% 30% 70%/60% 30% 70% 40%` ↔ `30% 60% 70% 40%/50% 60% 30% 60%`) 12s `ease-in-out infinite`, combinado con `hue` (`filter:hue-rotate(360deg)`) 24s `linear infinite`.
  - `flicker` en el logo: 6s `linear infinite`, caídas de opacidad a .4 (93%) y .6 (97%).
  - `fadeUp` (`translate3d(0,40px,0)`→`none`) y `fadeIn`.
  - fx: `parallax({max:30})`, `reveal`, `magnetic`, `tilt({max:6})`.
  - Countdown: `setInterval` de 1000 ms contra `2026-11-13T18:00:00` (días/horas/min/seg con `padStart(2,'0')`).
- **Detalles:** nav sin altura fija, padding 24px 40px, sin blur, uppercase 12px; logo «LUMEN'26» Anton 26px con «'26» en ácido. Botón CTA rectangular sin radio, fondo `#d9ff3d`, texto `#0d0b14`, bold, `data-magnetic`. Hover de links → `#d9ff3d`; hover de celdas de lineup → fondo `#d9ff3d` + texto `#0d0b14`. Lineup: grilla 4 col con gap 2px sobre fondo `rgba(246,242,255,.15)` (líneas finas), celdas `aspect-ratio:1`, imagen a opacity .35, reveal con delay +40ms. Tabs de día: rectángulos con borde, activo relleno ácido, `transition:all .3s`. Cintilla marquee: fondo `#d9ff3d`, `rotate(-1.5deg)`, `margin:60px -20px`, Anton 28px, `marqueeL 20s`, separador «✦». Tickets: 3 cards con `rotate(-1deg / 0 / 1deg)`, `min-height:420px`, borde 2px, perforaciones laterales (círculos 24px color de fondo en left/right -12px), `data-tilt` + reveal 0/100/200. Contador: cajas con borde 1px `rgba(246,242,255,.25)`, cifra Anton 34px. Sin cursor custom, sin glass.
- **Móvil:** no lo define (sin media queries; grillas fijas de 4 y 3 columnas).
- **Reutilizar para:** festivales y conciertos, lanzamientos de evento con venta de boletas, marcas de streetwear/música, conferencias con tono juvenil.

### 17 Veldrah — saga de fantasía / lore (oscuro)
- **Concepto:** portada de saga épica: imagen con Ken Burns, brasas continuas y un título monumental que se «enfoca» desde blur con letter-spacing que se cierra.
- **Paleta:** fondo `#120a0e`; cards `#1d1116`; texto `#f6e9dc` (secundario `rgba(246,233,220,.72/.68/.65/.55/.5)`); acento ámbar `#ffb26b` (bordes `rgba(255,178,107,.3/.6/.2)`, text-shadow `rgba(255,178,107,.35)`); vidrio `rgba(18,10,14,.45)` + borde `rgba(246,233,220,.14)` + `blur(14px)`. **Tipografía:** display Cormorant Garamond 300 (incl. itálica); body EB Garamond. H1 `clamp(100px,17vw,270px)`, line-height .9, letter-spacing .1em, uppercase; H2 de sección `clamp(40px,4.6vw,72px)` y `clamp(36px,3.8vw,60px)`. Mono: no lo define.
- **Hero:** (1) imagen en `inset:-4%` con `kenBurns 4s cubic-bezier(.2,.7,.2,1)` y `data-depth=0.15`; (2) velo `linear-gradient(180deg,rgba(18,10,14,.55),transparent 30%,transparent 55%,rgba(18,10,14,.92))`; (3) canvas de brasas z2; (4) nav en grilla `1fr auto 1fr` con «✦» ámbar al centro, z6; (5) H1 centrado en top 34% z3; (6) bloque inferior en grilla `1.2fr .8fr`: capítulo (H2 itálica 38px + 3 columnas de texto) y, a la derecha (`data-depth=0.5`), miniatura de video 150×170 radio 14 con botón ▶ en vidrio `blur(6px)` + card glass horizontal.
- **Entrada:** nav `fadeIn 1.2s .3s`; H1 `titleIn 2.2s .6s cubic-bezier(.2,.7,.2,1)`; H2 capítulo `fadeUp 1s 1.4s`; columnas `fadeUp 1s 1.6s`; contador 01/04 `fadeIn 1s 1.9s`; cards derechas `fadeUp 1.2s 1.8s`.
- **Animaciones:**
  - `titleIn`: de `opacity:0; letter-spacing:.5em; filter:blur(14px)` a `opacity:1; letter-spacing:.1em; blur(0)`.
  - `kenBurns`: `scale(1.12)`→`scale(1)`, una sola vez.
  - `lineGrow`: `scaleX(0)`→`scaleX(1)`, `transform-origin:left`, 9s `linear infinite` en una barra de 60×1px (progreso del capítulo) con relleno `#ffb26b`.
  - `glow` (opacity .5↔1) está declarado pero no se usa.
  - fx: `parallax({max:20})`, `reveal`, `magnetic`, `tilt({max:5})`, `particles(emberRef,{type:'ember',count:110,color:'255,178,107'})` en el hero y `particles(ember2Ref,{type:'ember',count:40,color:'255,178,107',speed:.6})` sobre la imagen de reliquias (ember: sube desde abajo, `shadowBlur 12`).
  - `setInterval(nextCh, 9000)`: rota 4 capítulos y `replayHero()` reinicia las animaciones de `[data-hero-anim]` (`animation='none'` → reflow `offsetWidth` → restaurar). Mismo periodo que `lineGrow`.
- **Detalles:** nav padding 26px 56px, 13px, letter-spacing .14em, uppercase, sin blur; icono ⌂ en caja 30px con borde. Links hover → `#f6e9dc` (base .7). Numeración 01–04 en Cormorant 30px ámbar sobre cada card de capítulo; contador hero «01 / 04» (Cormorant 44px). Cards de capítulo: 460px alto, radio 14, velo `linear-gradient(180deg,rgba(18,10,14,.2),transparent 30%,rgba(18,10,14,.95))`, borde activo `rgba(255,178,107,.6)` / resto `rgba(246,233,220,.08)`, `data-tilt`, reveal 0/100/200/300. Eyebrows 11px, letter-spacing .34em, ámbar. Lista de reliquias con reglas `border-top:1px solid rgba(246,233,220,.14)` y glifos ✦ ◈ ◎. Imagen de reliquia 620px, radio 16, borde `rgba(255,178,107,.2)`. Sin marquee ni cursor custom.
- **Móvil:** no lo define (grillas fijas de 4 y 2 columnas, H1 con mínimo 100px).
- **Reutilizar para:** videojuegos y sagas literarias, lanzamientos de libro o serie, marcas de whisky/velas/fragancias oscuras, experiencias inmersivas o escape rooms.

### 18 M. Magazine — revista editorial / arte (oscuro)
- **Concepto:** portada de revista: figura central que «florece» desde blur, pétalos cayendo y un H1 escalonado en tres líneas con índice lateral.
- **Paleta:** fondo `#0d1b26`; hero `radial-gradient(ellipse 60% 70% at 55% 45%,#1d3a52 0%,#0d1b26 70%)`; texto `#eef2f4` (secundario `rgba(238,242,244,.7/.65/.62/.5/.4)`); acento rosa cerezo `#f4b8c4`; bokeh `rgba(244,184,196,.35/.3)` y `rgba(120,190,220,.22)`; vidrio de pie de foto `rgba(13,27,38,.7)` + `blur(8px)`. **Tipografía:** display Italiana; serif de acompañamiento Cormorant Garamond (300/400, itálica); body Karla (300/400/500). H1 `clamp(56px,7vw,112px)`, line-height .92, uppercase; H2 historia `clamp(36px,3.8vw,60px)`; cita `clamp(32px,4vw,64px)`.
- **Hero:** (1) fondo radial; (2) 3 blobs bokeh (120/90/160px, `blur(30/24/40px)`) con `drift`; (3) canvas de pétalos z3; (4) nav z6; (5) figura centrada `min(40vw,560px)×min(86vh,820px)` con tres envoltorios: `data-depth=0.3` → `bloom` → `floatY`; (6) título a la izquierda z4; (7) índice 01/02/03 abajo izquierda; (8) columna derecha (`data-depth=0.5`) con H2 34px + cita itálica sobre regla.
- **Entrada:** nav `fadeIn 1s .2s`; figura `bloom 2s .4s cubic-bezier(.2,.7,.2,1)`; líneas del H1 `lineIn 1.1s` a .6s / .75s / .9s (la 2.ª con `padding-left:.6em`); párrafo `fadeUp 1s 1.2s`; CTA `fadeUp 1s 1.4s`; columna derecha `fadeUp 1.2s 1.5s`; índice `fadeIn 1s 1.8s`.
- **Animaciones:**
  - `bloom`: de `opacity:0; scale(.92); blur(16px)` a `none`.
  - `lineIn`: de `opacity:0; translate3d(-40px,0,0)` a `none`.
  - `floatY`: `translateY(0)`↔`-14px`, 9s `ease-in-out infinite`.
  - `drift`: `translate(0,0) scale(1)` → `translate(40px,-30px) scale(1.1)` → inicio; 14s / 18s delay 3s `reverse` / 20s delay 6s, `ease-in-out infinite`.
  - fx: `parallax({max:22})`, `reveal`, `magnetic`, `tilt({max:4})`, `particles(petalRef,{type:'petal',count:34,color:'244,184,196',speed:.7})` (elipses 6–14px que caen y rotan).
  - Sin `setInterval`.
- **Detalles:** nav padding 28px 56px, sin blur; logo «M.» Italiana 22px letter-spacing .2em con punto rosa; links 12px letter-spacing .18em uppercase (el `gap` usa `clamp(14px,2vw,30px)px`, CSS inválido); etiqueta «Número 14 · Primavera». CTA rectangular `#eef2f4` sobre texto `#0d1b26`, 11px letter-spacing .2em, `data-magnetic`. Índice: número Cormorant 16px + regla 1px (activa 40px, resto 16px a opacity .4). Sección historia en grilla `200px 1fr 1fr` (columna de créditos 11px letter-spacing .24em), lead Cormorant 22px en rosa. Cita centrada max 900px. Galería de 3 figuras 460/380/460px con la del medio `margin-top:80px` (escalonado), `data-tilt`, pie en vidrio. Hover de links → `#f4b8c4`.
- **Móvil:** no lo define (grillas fijas de 3 columnas y columna de 200px).
- **Reutilizar para:** revistas y blogs editoriales, galerías y artistas, marcas de belleza/cosmética de nicho, lanzamientos de colección de moda.

### 19 Verde Dental — clínica dental / salud (oscuro en el hero, claro en el resto)
- **Concepto:** clínica como «respiro»: isla 3D flotando sobre olas y burbujas lima, con píldoras de vidrio para las cifras.
- **Paleta:** hero `linear-gradient(180deg,#0f2a3a 0%,#164a5a 60%,#1c6a70 100%)`; base `#0f2a3a`; texto claro `#f2f7f5` (secundario `rgba(242,247,245,.7/.65/.62/.55)`); acento lima `#c8f55a`; verde `#3aa77a`; menta `#9fd6c0`; secciones claras fondo `#f2f7f5`, texto `#0f2a3a`, cards `#fff`, fondo de imagen `#e4efe9`; vidrio oscuro `rgba(15,42,58,.45)` + borde `rgba(242,247,245,.15)` + `blur(14px)`; vidrio claro `rgba(255,255,255,.85)` + `blur(12px)`. **Tipografía:** una sola familia, Onest (300–700), para display y body. H1 600, `clamp(48px,6vw,92px)`, line-height .95, letter-spacing -.03em, uppercase; H2 servicios `clamp(36px,4.4vw,68px)`; H2 reserva `clamp(34px,3.8vw,58px)`. Mono: no lo define.
- **Hero:** (1) degradado vertical; (2) canvas de olas en el 60% inferior z1; (3) canvas de burbujas z2; (4) nav z6; (5) isla centrada `min(50vw,720px)×min(70vh,660px)` con `data-depth=0.3` → `rise` → `floatY` + `drop-shadow(0 60px 60px rgba(0,0,0,.45))`, z3; (6) copy izquierda z4; (7) bloque derecho (`data-depth=0.5`) con avatares apilados; (8) 3 píldoras de stats centradas abajo; (9) botón circular ↓ abajo izquierda.
- **Entrada:** nav `fadeIn 1s .2s`; isla `rise 1.8s .5s cubic-bezier(.2,.7,.2,1)`; eyebrow `fadeUp 1s .6s`; 4 líneas del H1 `fadeUp 1s` a .8s / .95s / 1.1s / 1.25s; párrafo 1.4s; botones 1.55s; bloque derecho `fadeUp 1.1s 1.5s`; stats `fadeUp 1s 1.9s`; flecha `fadeIn 1s 2s`.
- **Animaciones:**
  - `rise`: de `opacity:0; translate3d(0,80px,0) scale(.9)` a `none`.
  - `floatY`: `translateY(0) rotate(-1deg)` ↔ `translateY(-16px) rotate(1deg)`, 8s `ease-in-out infinite`.
  - `shine` en el CTA: franja 40% con `linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)`, `translateX(-120%)`→`220%` con `skewX(-20deg)`, 3s delay 2s `ease-in-out infinite`.
  - fx: `parallax({max:24})`, `reveal`, `magnetic`, `tilt({max:5})`, `counters` (`data-count="15|98|2"` + `data-suffix="+|%|K+"`, 1400ms ease-out cúbico, threshold .4), `waves(waveRef,{color:'200,245,90',amp:22,layers:3,speed:.8})` (3 capas de seno rellenas con alfa .12/.22/.32), `particles(bubbleRef,{type:'bubble',count:26,color:'200,245,90',speed:.5})` (círculos de trazo que suben).
  - Sin `setInterval`.
- **Detalles:** nav padding 26px 56px, sin blur; logo con ✿ en círculo de borde lima 2px; iconos sociales IG/FB/TK en círculos de 34px con borde; botón «Leer más» píldora con borde + chip circular lima de 22px con →. CTA principal píldora (`border-radius:999px`, padding `6px 6px 6px 22px`) lima con círculo interior de 34px `#0f2a3a` y →, más el brillo `shine`; secundario solo texto. Avatares de 34px apilados con `margin-left:-10px` y borde 2px `#164a5a`. Stats: píldoras de vidrio con icono en círculo `rgba(200,245,90,.15)`. Cards de servicio: radio 24, `box-shadow:0 20px 50px rgba(15,42,58,.06)`, imagen de 130px radio 16, eyebrow `#3aa77a`, reveal 0/80/160/240, `data-tilt`. Reserva: imagen de 600px radio 32 con tarjeta de doctora en vidrio claro; inputs radio 14; franjas horarias en píldoras (activa rellena `#0f2a3a`, `transition:all .25s`); CTA oscuro con círculo lima. Hover de links → `#fff`.
- **Móvil:** no lo define (grillas fijas de 4 y 2 columnas).
- **Reutilizar para:** clínicas dentales, estéticas y spas, marcas de bienestar o suplementos naturales, apps de salud con reserva de citas.

### 20 Aurelia — inmobiliaria de lujo (oscuro)
- **Concepto:** torre residencial al anochecer: Ken Burns, estrellas que titilan, barrido de luz dorada y un slider de frases con índice de rombos.
- **Paleta:** fondo `#0b1016`; cards `#0f161e`; texto `#efe9dd` (secundario `rgba(239,233,221,.7/.65/.6/.55/.5/.4)`); acento oro `#c9a96e`; reglas `rgba(239,233,221,.12/.2)`; velos `linear-gradient(90deg,rgba(11,16,22,.85) 0%,rgba(11,16,22,.4) 45%,rgba(11,16,22,.15) 100%)` y `linear-gradient(180deg,rgba(11,16,22,.4),transparent 25%,transparent 65%,rgba(11,16,22,.95))`. **Tipografía:** display Cormorant Garamond (300/400/500); body Inter Tight (300/400/500). H1 300, `clamp(48px,5.6vw,88px)`, line-height 1, letter-spacing .02em, uppercase; H2 `clamp(40px,4.6vw,72px)` y `clamp(36px,3.8vw,60px)`. Mono: no lo define.
- **Hero:** (1) imagen en `inset:-5%` con `kenBurns 5s cubic-bezier(.2,.7,.2,1)` y `data-depth=0.15`; (2) velo horizontal; (3) velo vertical; (4) canvas de estrellas z2; (5) barrido de luz: franja de 26% de ancho, `linear-gradient(90deg,transparent,rgba(201,169,110,.18),transparent)`, `blur(30px)`, z2; (6) nav z6; (7) H1 + subtítulo + 2 CTAs abajo izquierda (bottom 120px); (8) índice vertical 01–03 a la derecha; (9) contador «01 — 03» con barra; (10) franja inferior dirección · entrega (10px, letter-spacing .3em).
- **Entrada:** nav `fadeIn 1s .2s`; líneas del H1 `fadeUp 1.1s` a .6s / .8s; subtítulo `fadeUp 1s 1.1s`; CTAs `fadeUp 1s 1.3s`; índice `fadeIn 1s 1.6s`; contador `fadeIn 1s 1.8s`; franja inferior `fadeIn 1s 2s`.
- **Animaciones:**
  - `kenBurns`: `scale(1.1) translateY(2%)` → `scale(1) translateY(0)`, una vez.
  - `sweepLight`: `translateX(-30%) rotate(8deg)` opacity 0 → 30% opacity .35 → `translateX(130%) rotate(8deg)` opacity 0; 12s delay 2s `ease-in-out infinite`.
  - `lineGrow`: `scaleX(0→1)`, origin left, 8s `linear infinite` en barra 70×1px con relleno oro.
  - `twinkle` (opacity .2↔1) está declarado pero no se usa.
  - fx: `parallax({max:18})`, `reveal`, `magnetic`, `tilt({max:4})`, `particles(starRef,{type:'star',count:140,color:'239,233,221'})` en el hero y `particles(star2Ref,{type:'star',count:60,color:'201,169,110'})` sobre la imagen de la piscina (star: fijas, titilan con `.5+.5·sin(t·2)`).
  - `setInterval` de 8000 ms: rota 3 slides (texto del H1 y subtítulo) y `replayHero()` reinicia `[data-hero-anim]` y sus `> span`. Mismo periodo que `lineGrow`.
- **Detalles:** nav padding 28px 56px, sin blur; logo «AURELIA» Cormorant 24px letter-spacing .14em + «RESIDENCES» Inter Tight 9px letter-spacing .34em; link activo con `border-bottom:1px solid #c9a96e` (resto transparente), hover → `#efe9dd`; «Ingresar» en texto + CTA rectangular oro `#c9a96e` sobre `#0b1016`, 11px letter-spacing .18em, `data-magnetic`. CTA secundario: texto subrayado con `border-bottom` a .4. Índice: número Cormorant 20px + rombo de 10px (`rotate(45deg)`, borde oro, activo relleno), inactivos opacity .4 con `transition:opacity .4s`; «Desplázate» en `writing-mode:vertical-rl`. Cards de residencia: borde 1px `rgba(239,233,221,.12)`, sin radio, imagen de 300px, estado en oro 11px, specs (m², suites, pisos), regla superior + «Desde / USD 1.4M» en Cormorant 24px; `data-tilt`, reveal 0/100/200. Amenidades: grilla 2×3 con numeración 01–06 en oro y `border-top` de 1px, reveal +60ms; imagen de 640px con canvas de estrellas encima. Sin glass ni marquee ni cursor custom.
- **Móvil:** no lo define (grillas fijas de 3 y 2 columnas).
- **Reutilizar para:** proyectos inmobiliarios de lujo, hoteles y resorts, clubes privados o membresías, relojería y joyería de alta gama.

### 21 Orbe — e-commerce de objetos para el hogar (oscuro)
- **Concepto:** la colección como un carrusel 3D de 8 tarjetas en anillo que gira sola y se arrastra; la tarjeta de delante manda en el panel «En pantalla».
- **Paleta:** fondo `#0a0a0f`; texto `#f3f3f7` (secundario `rgba(243,243,247,.6)`, terciario `.45`); acento violeta `#a78bfa` (hover de enlaces, eyebrow, CTA); cian `rgba(56,189,248,.35)` en la aurora; fondo del CTA `#12121a`; fondos por producto `#2b2350 #0f2f3f #3a1f2b #1b2e22 #2a2a3a #3b2a12 #14283a #2f1b3a`. Vidrio de las tarjetas: `linear-gradient(160deg,rgba(243,243,247,.1),rgba(243,243,247,.02))`, borde `rgba(243,243,247,.18)`, `blur(10px)`, sombra `0 40px 80px rgba(0,0,0,.5)`.
- **Tipografía:** Sora 300/400/600/700 en todo (no hay mono ni display aparte). H1 `clamp(44px,5.6vw,84px)`, peso 600, line-height 1, letter-spacing -.04em; segunda línea peso 300 al 60 %. H2 `clamp(34px,4vw,60px)`; H2 del CTA `clamp(40px,5vw,80px)`, line-height .95.
- **Hero (100vh, min 760px), capas:** (1) aurora en `inset:-20%`: blob violeta `rgba(167,139,250,.45)` blur 60px + blob cian blur 70px; (2) retícula de puntos `radial-gradient(... 1px)` cada 32px con `mask-image` elíptica (20 %→70 %); (3) nav; (4) texto centrado al 15 % desde arriba; (5) escenario del anillo (alto 440px, `translateY(-38%)`, `perspective:1400px`) con el suelo: una elipse de 1100px con `rotateX(80deg)` y borde violeta; (6) panel del producto activo abajo a la izquierda; (7) pista «Arrastra para girar» abajo a la derecha.
- **Entrada:** nav `fadeIn 1s .2s`; eyebrow `fadeUp 1s .5s`; H1 `fadeUp 1s .7s`; anillo `fadeIn 1.4s 1s`; panel activo `fadeUp 1s 1.4s`; pista `fadeIn 1s 1.8s`. El easing es el de CSS por defecto (no lo define).
- **Animaciones:**
  - `auroraA` 16s ease-in-out infinite: translate(-10%,-10%) rotate(0) scale(1) → al 50 % translate(10%,5%) rotate(30deg) scale(1.2). En el CTA se reutiliza a 14s.
  - `auroraB` 20s ease-in-out infinite: translate(10%,10%) scale(1.1) → translate(-8%,-6%) rotate(-25deg) scale(.9).
  - `ringGlow` 4s ease-in-out infinite en la elipse del suelo: opacity .4 → .8 → .4.
  - `fx.ring3d(ringRef, { radius: 460, autoSpeed: .1, onIndex })`: coloca los 8 hijos con `rotateY(i·45deg) translateZ(460px)` y `backface-visibility:hidden`; en cada frame hace `rot += vel` y la velocidad vuelve a autoSpeed con lerp .02. Al arrastrar, 1px de mouse o dedo = 0,3°. La opacidad de cada tarjeta es `.35 + .65·max(0,cos(ángulo))` y el z-index sigue a cos·100. `onIndex` cambia `state.active`, que alimenta el panel «En pantalla · 0N / 08».
  - `fx.reveal(root)`: los `[data-reveal]` suben desde y = 36px en 900ms `cubic-bezier(.2,.7,.2,1)`. En la grilla, `data-reveal-delay` va en 0/80/160/240 (i%4·80).
  - `fx.magnetic(root)` con strength .35 por defecto: el botón sigue al cursor con `transform .15s ease-out` y al soltarlo vuelve con `.5s cubic-bezier(.2,.7,.2,1.4)`.
  - Las tarjetas llevan `data-tilt`, pero `fx.tilt` **no se llama**, así que el tilt no hace nada en esta pieza.
- **Detalles:** nav absoluta de 26px por 56px de padding, sin blur propio ni cambio al hacer scroll. Los enlaces van en una píldora de vidrio (`rgba(243,243,247,.03)`, borde `.12`, `blur(12px)`) y al hover toman fondo `rgba(243,243,247,.1)`. El logo es un punto con `conic-gradient(#a78bfa,#38bdf8,#a78bfa)`. Botón «Carrito» en píldora clara. El CTA del producto es una píldora violeta con un círculo interior de 34px en `#0a0a0f` que lleva el «+». Grilla de 4 columnas en `aspect-ratio:3/4`, radio 20px y velo `linear-gradient(180deg,transparent 55%,rgba(10,10,15,.9))`. El bloque CTA tiene radio 32px y aurora propia. Numeración «01 / 08».
- **Móvil:** no lo define. No hay media queries: la grilla se queda en 4 columnas y el anillo no cambia su radio de 460px. Con movimiento reducido, `ring3d` no se monta: las tarjetas quedan apiladas sin posicionar y no aparece el anillo.
- **Reutilizar para:** catálogo corto de e-commerce (6-10 productos), lanzamiento de una colección, portafolio de piezas físicas, selector de planes o servicios en carrusel.

### 22 Aether — plataforma de agentes de IA / dev-tool (oscuro)
- **Concepto:** una esfera de partículas three.js que se puede orbitar representa la «inteligencia a escala», con estética de terminal: mono, ticker en vivo y bloque de código.
- **Paleta:** fondo `#03060c`; texto `#e8eefc` (secundario `rgba(232,238,252,.65)`, terciario `.4-.5`); acento teal `#5eead4`; índigo `#7c8cff` en partículas y anillos; fondo del bloque de código `#070c16`. Sintaxis: `#c792ea` (keywords), `#82aaff` (funciones), `#5eead4` (strings). Semáforo `#ff5f57 #febc2e #28c840`. Vidrio del ticker: `rgba(3,6,12,.6)`, borde `rgba(232,238,252,.12)`, `blur(14px)`.
- **Tipografía:** display y body en Instrument Sans 400-700; mono en JetBrains Mono 400/500 (nav, badge, comando npm, stats, ticker, numeración). H1 `clamp(46px,5.8vw,88px)`, peso 600, line-height .98, -.04em; «a escala.» en teal. H2 `clamp(34px,4vw,60px)` y `clamp(32px,3.6vw,54px)`.
- **Hero (100vh, min 760px), capas:** (1) `glRef`, el canvas WebGL a pantalla completa (z1); (2) viñeta `radial-gradient(ellipse, transparent 30%, #03060c 85%)`; (3) franja de escaneo de 120px `rgba(94,234,212,.06)`; (4) nav (z6); (5) texto a la izquierda, centrado en vertical, max 560px; (6) card del ticker abajo a la derecha (320px, bottom 140px); (7) fila de stats y la pista «arrastra para orbitar».
- **Entrada:** nav `fadeIn 1s .2s`; badge `fadeUp 1s .5s`; H1 `.7s`; párrafo `.9s`; botones `1.1s`; ticker `fadeUp 1s 1.4s`; stats `fadeIn 1s 1.8s`.
- **Animaciones:**
  - three.js 0.160 (importmap): `PerspectiveCamera(50, aspect, .1, 100)` en z = 7,5; `WebGLRenderer` con antialias y alpha, pixelRatio de hasta 2. **6000 puntos** sobre una esfera de Fibonacci de radio 2,6 (±0,04 de ruido), color mezclado entre `#5eead4` y `#7c8cff`; `PointsMaterial` de tamaño .028 y opacidad .9. Encima, un `IcosahedronGeometry(2.62, 2)` en wireframe teal con opacidad .06 y dos `TorusGeometry(3.6, .006, 8, 200)` índigo al .5 con rotaciones x π/2,4 y π/1,7 (el segundo con y = .6). El grupo está desplazado a x = 1,6.
  - Loop: `t += .004`; `group.rotation.y = t + ry` y `rotation.x = rx·.6` con lerp .05 hacia el mouse (±.6 / ±.4). Al arrastrar, cada px suma .005. Los anillos giran en z a t·.7 y -t·.5 y los puntos «respiran» con `scale 1 + sin(3t)·.015`.
  - `scan` 9s linear infinite: translateY(-100%) → translateY(100vh).
  - `blink` 2s ease-in-out infinite en el punto del logo (opacity 1 → .15), con glow `0 0 14px #5eead4`.
  - `ticker` 14s linear infinite: translateY(0 → -50%) sobre una lista duplicada de 6 filas y 12 nodos. La ventana mide 160px con `mask-image` de negro al 70 % a transparente.
  - `fx.counters(root)` (1400ms, ease-out cúbico, umbral .4): `data-count` 12/48/99 con `data-suffix` "M"/"ms"/".98%".
  - `fx.reveal(root)` con delays de 0/80/160 en la grilla de 3; `fx.magnetic(root)`; `fx.tilt(root, { max: 3 })` sobre las 6 cards `data-tilt` (perspective 900px).
- **Detalles:** nav con 26px por 56px de padding y sin blur. El gap de los enlaces es `clamp(14px,2vw,30px)px`, que es CSS inválido, así que el gap no se aplica. Los botones son rectos, con radio 6px. El primario va en `#e8eefc`; el secundario es un comando `$ npm i @aether/sdk` en mono con borde `.15`. Badge con borde teal `.3`. Las cards de capacidades llevan fondo `rgba(232,238,252,.03)`, borde `.08`, radio 14px y min-height 220px, y al hover el borde pasa a `rgba(94,234,212,.4)`. Numeración 01-06 en mono; eyebrow `// capacidades`. Ventana de código con los tres puntos, el nombre `agent.ts` y `pre` a 13px con line-height 1,8. «● live» en teal.
- **Móvil:** no hay media queries. El único ajuste es JS: `resize` pone `group.position.x = w < 900 ? 0 : 1.6`, que centra la esfera por debajo de 900px. La grilla de 3 y el split 1fr 1fr no cambian. El WebGL ignora `prefers-reduced-motion`: sigue girando.
- **Reutilizar para:** SaaS de IA o infraestructura, dev-tools y SDKs, productos de datos u observabilidad, landing técnica de una API.

### 23 Drift — surf trips / turismo de aventura (oscuro, cálido)
- **Concepto:** atardecer en el Pacífico: cielo con auroras, sol que flota, olas en canvas y estrellas, con el surfista en parallax y un widget de condiciones en vivo.
- **Paleta:** fondo `#04121c`; degradado del hero `#04121c 0% → #0a3550 45% → #0e5a6e 70% → #0a3550 100%`; texto `#eaf6ff` (secundario `rgba(234,246,255,.7/.6)`); acento naranja-sol `#ffb547`; sol `radial-gradient(#ffd98a, #ffb547 60%, #ff7a3d)` con glow `0 0 120px rgba(255,181,71,.6)`; teal `#5eead4` / `rgba(94,234,212,.5)` en olas, barras y ubicación; índigo `rgba(124,140,255,.3)` en la aurora 2. Vidrio del widget: `rgba(4,18,28,.5)`, borde `rgba(234,246,255,.15)`, `blur(14px)`, radio 20px.
- **Tipografía:** Bricolage Grotesque (opsz 12..96; pesos 300/500/700/800) en todo. H1 `clamp(56px,8vw,128px)`, peso 800, line-height .9, -.05em; segunda línea peso 300 en itálica. H2 `clamp(40px,5vw,80px)` a 800 y `clamp(34px,4vw,60px)`.
- **Hero (100vh, min 760px), capas:** (1) degradado vertical de fondo; (2) aurora 1 (top 5 %, alto 40 %, teal→naranja, blur 50px); (3) aurora 2 (índigo, blur 60px); (4) sol de 180px al 28 %; (5) canvas de olas en el 62 % inferior (z1); (6) canvas de estrellas en la mitad superior; (7) nav; (8) texto abajo a la izquierda (bottom 100px, max 640px); (9) surfista a la derecha (`min(30vw,420px)` × `min(50vh,460px)`, `data-depth=0.4`, drop-shadow); (10) widget de condiciones arriba a la derecha (`data-depth=0.6`).
- **Entrada:** nav `fadeIn 1s .2s`; eyebrow `fadeUp .5s`; H1 `.7s`; párrafo `.9s`; botones `1.1s`; widget `fadeUp 1s 1.4s`.
- **Animaciones:**
  - `aurora1` 14s ease-in-out infinite: translateX(-10%) skewX(-10deg) ↔ translateX(10%) skewX(10deg).
  - `aurora2` 18s: translateX(8%) skewX(6deg) con opacidad .6 ↔ translateX(-12%) skewX(-8deg) con opacidad 1.
  - `sun` 8s ease-in-out: translateY(0 → -10px).
  - `bob` 6s ease-in-out en el surfista: translateY(0) rotate(-2deg) ↔ translateY(-8px) rotate(2deg).
  - `marquee` 24s linear infinite: translateX(0 → -50%), 5 destinos duplicados.
  - `fx.waves(waveRef, { color:'94,234,212', amp:30, layers:4, speed:1 })`: cada capa l sale de `h·(.55 + l·.12)` con dos senos y un fill alfa de `.12 + l·.1`.
  - `fx.waves(wave2Ref, { color:'255,181,71', amp:14, layers:2, speed:.8 })`: el 45 % inferior de la foto de la sección «Por qué».
  - `fx.particles(starRef, { type:'star', count:90, color:'234,246,255' })`: estrellas quietas (vy = 0) que titilan con `.5 + .5·sin(2t)`.
  - `fx.parallax(root, { max:24 })` sobre `[data-depth]` 0.4 y 0.6, con lerp .08. Ojo: el widget también tiene `animation: fadeUp … both`, que pisa el transform inline, así que es probable que su parallax no se vea.
  - `fx.tilt(root, { max:5 })` en las 3 cards de viajes; `fx.reveal` con delays 0/100/200 (viajes) y 0/80/160/240 (lista); `fx.magnetic`.
- **Detalles:** logo «drift~» con la tilde en naranja. Botones en píldora 999px: el primario en `#eaf6ff`, el secundario con borde `.3` y `blur(8px)`; «Reservar» en naranja. Nav de 26px por 56px, con el mismo gap `clamp(...)px` inválido. Widget: número de 44px a peso 800 y 7 barras de 30/45/60/80/65/50/40px (la cuarta en naranja). Cards de viaje de 520px de alto, radio 28px, badge de nivel en píldora naranja, velo `transparent 45% → rgba(4,18,28,.95)` y una regla superior de 1px `rgba(234,246,255,.15)` sobre los días y el precio. Lista «Por qué» con reglas `border-top rgba(234,246,255,.14)` e iconos en círculos de 40px con fondo `rgba(255,181,71,.15)`. La franja del marquee es naranja con texto `#04121c` a 20px y peso 800.
- **Móvil:** no hay media queries: la grilla de 3 y el split 1fr 1fr se quedan así. En ≤768px las estrellas bajan a 45 por `mobileCount`. Con movimiento reducido no se montan olas, estrellas, parallax ni tilt, pero siguen corriendo aurora, sol, bob y marquee.
- **Reutilizar para:** turismo o experiencias al aire libre, escuela deportiva (surf, buceo, kite), hotel u hostal de playa, marca de outdoor.

### 24 Prisma — herramienta de diseño 3D / SaaS creativo (claro)
- **Concepto:** «diseña en tres dimensiones» mostrado literalmente con un cubo CSS 3D de caras glass que gira y flota, y chips que orbitan sobre una malla pastel.
- **Paleta:** fondo `#f3f1ff`; texto `#14112b` (secundario `rgba(20,17,43,.65/.55)`); acento `#6d4aff`; rosa `#ff5fa2`; cian `#22c1e8`. Degradado del H1 `linear-gradient(90deg,#6d4aff,#ff5fa2,#22c1e8)` recortado al texto. Blobs de la malla `#c4b5ff`, `#ffc9e3`, `#b8f0ff` (blur 90px, opacidad .75-.8). Caras del cubo `rgba(230,220,255,.85)`, `rgba(255,217,236,.85)`, `rgba(212,244,255,.85)` y `rgba(255,255,255,.85)`, con borde `rgba(255,255,255,.7)`, `blur(6px)`, radio 18px y sombra `0 30px 60px rgba(109,74,255,.15)`. Bento: `#e6dcff`, `#14112b`, `#ffd9ec`, `#d4f4ff`.
- **Tipografía:** Manrope 300/400/600/800 en todo. H1 `clamp(48px,6vw,92px)`, peso 800, line-height .95, -.05em. H2 `clamp(36px,4.4vw,68px)`; CTA `clamp(40px,5vw,80px)`; cita `clamp(22px,2.4vw,34px)`.
- **Hero (100vh, min 760px), capas:** (1) malla de 3 blobs difusos; (2) nav; (3) grilla de 1fr 1fr: a la izquierda badge + H1 + párrafo + botones + stats; a la derecha el escenario de 560px con `perspective:1200px`: un wrapper con `floatY`, dentro el cubo de 260px (`preserve-3d`) con 6 caras `rotateY/rotateX(±90/180deg) translateZ(130px)` numeradas 01-06, y 3 chips en órbita.
- **Entrada:** nav `fadeIn 1s .2s`; badge `fadeUp .5s`; H1 `.7s`; párrafo `.9s`; botones `1.1s`; stats `fadeUp 1s 1.4s`; escenario del cubo `fadeIn 1.4s .8s`.
- **Animaciones:**
  - `mesh1` 18s ease-in-out: 0 → 33 % translate(12%,-8%) scale(1.15) → 66 % translate(-8%,10%) scale(.95).
  - `mesh2` 22s: scale(1.1) → 33 % translate(-14%,6%) scale(.9) → 66 % translate(10%,-10%) scale(1.2).
  - `mesh3` 20s: 50 % translate(-10%,-14%) scale(1.25). En el CTA oscuro se reutilizan `mesh1` a 16s y `mesh2` a 20s, con blobs `#6d4aff` y `#ff5fa2` a opacidad .6.
  - `spinCube` 22s linear infinite: rotateX(-20deg) rotateY(0 → 360deg).
  - `floatY` 7s ease-in-out: translateY(0 → -18px).
  - `orbit` linear infinite: `rotate(0) translateX(240px) rotate(0)` → `rotate(360deg) translateX(240px) rotate(-360deg)`. La contrarrotación mantiene el chip derecho. Duraciones de 16/20/24s con delays de 0/-6/-12s.
  - `fx.counters(root)`: 120 con «K», 4 con «.9», 38. `fx.tilt(root, { max:4 })` en el bento; `fx.reveal` (delays 0/100); `fx.magnetic`.
- **Detalles:** nav de 26px por 56px. Los enlaces van en una píldora glass clara (`rgba(255,255,255,.5)`, borde `.8`, `blur(14px)`) que al hover pone fondo `#fff`. El badge es una píldora con una etiqueta interior «Nuevo» en `#6d4aff`. El CTA primario es una píldora oscura con un círculo violeta de 36px y «→»; el secundario es glass blanco `.6` con `blur(8px)`. Chips blancos con un punto de color de 8px y sombra `0 12px 30px rgba(20,17,43,.12)`. Bento de 3 columnas con `grid-auto-rows:260px`, spans 2-1 / 1-2, radio 28px e iconos en cuadrado de 40px con radio 14px. El CTA final es un bloque oscuro con radio 36px, testimonio y H2.
- **Móvil:** no hay media queries: el split del hero, el cubo de 560px de escenario y la órbita de 240px no cambian. Con movimiento reducido se quitan solo tilt y magnetic; el cubo, la órbita y la malla siguen, porque son CSS.
- **Reutilizar para:** SaaS de diseño o creatividad, herramienta no-code, producto con 4-6 módulos para mostrar en las caras del cubo, lanzamiento de una versión mayor.

### 25 Atlas Showcase — estudio de diseño y motion / portafolio (oscuro, editorial)
- **Concepto:** un catálogo premium en una sola página: preloader, split text, scroll inercial, estela de imágenes, marquee por velocidad, FLIP grid↔lista, scrub por scroll, grano y cursor custom, sobre una estética editorial serif en B/N y arena.
- **Paleta:** fondo `#0e0e0e`; texto `#f2efe9` (secundario `rgba(242,239,233,.65/.5/.4)`); acento arena `#d8c7a0`; cards `#161616` con borde `rgba(242,239,233,.08)`; fondo de imagen `#1d1d1d`. Velo del hero `linear-gradient(180deg,rgba(14,14,14,.6),transparent 30%,transparent 60%,rgba(14,14,14,.95))`. Estela: `linear-gradient(135deg,#d8c7a0,#8a7a55)`, `(#3a3a3a,#161616)`, `(#6b5a3a,#d8c7a0)` y `(#f2efe9,#8a8a8a)`.
- **Tipografía:** display en Instrument Serif (normal/itálica); body en Instrument Sans 300-600; sin mono. H1 `clamp(56px,8.4vw,140px)`, peso 400, line-height .92, -.03em, max 1100px. Manifiesto `clamp(40px,5.6vw,92px)`; H2 del trabajo `clamp(36px,4.4vw,72px)`; CTA `clamp(48px,9vw,160px)`; contador del preloader `clamp(80px,14vw,200px)`; marquee `clamp(28px,4vw,64px)`.
- **Hero (100vh, min 760px), capas:** (0) canvas de grano fijo (z900, `mix-blend-mode:overlay`, opacidad .7) y cortina del preloader fija (z1000) con el contador «000»; (1) imagen en `inset:-4%` con `data-depth=0.15` y `kenBurns`; (2) velo degradado; (3) nav; (4) bloque de texto abajo (bottom 80px): eyebrow, H1 en `data-split="words"`, y una grilla `1fr auto` con el párrafo y el CTA; (5) sello circular SVG de 80px a la derecha con el textPath «MOVE · YOUR · MOUSE ·».
- **Entrada:** el preloader cuenta 1800ms (ease-out cúbico) y luego la cortina hace `translateY(-100%)` en 1s con `cubic-bezier(.76,0,.24,1)`; a los 1000ms se oculta y llama onDone. En paralelo: `kenBurns` 4s `cubic-bezier(.2,.7,.2,1)` (scale 1.1 → 1); nav `fadeIn 1s 2.6s`; eyebrow `fadeIn 1s 2.8s`; párrafo y CTA `fadeUp 1s 3.4s`; sello `fadeIn 1s 3.6s`. El H1 entra con `splitText` cuando onDone ya corrió.
- **Animaciones:**
  - `spin` 16s linear infinite en el sello SVG.
  - `fx.noiseOverlay(noiseRef, { alpha:.05 })`: 24 fps por defecto, canvas a la mitad de resolución, ruido gris por píxel.
  - `fx.parallax(root, { max:16 })`: el único `[data-depth]` es la imagen del hero (0.15). Ojo: `kenBurns` con `both` también anima transform, así que el parallax probablemente queda pisado.
  - `fx.cursorBlend(root, { color:'#f2efe9' })`: un punto fijo de 18px con `mix-blend-mode:difference` y lerp .2. Crece a 54px (size·3) sobre `a` y `button`, y a 84px mostrando el texto de `data-cursor` («→», «Ver», «Abrir», «✉»). Pone `cursor:none` en todo el root.
  - `fx.marqueeVelocity(marqueeRef, { base:.7 })`: boost .25 por defecto. El scroll suma `|dy|·.25·.05` a la velocidad, la dirección sigue el sentido del scroll y vuelve a base con lerp .06. La pista tiene 8 ítems duplicados con ✦ arena.
  - `fx.imageTrail(trailRef, [4 gradientes], { size:160 })`: cada 90ms, con vida de 900ms, crea un div de 160×200 con radio 12px, rotación de ±10° y scale .6 → 1 en .5s `cubic-bezier(.2,.7,.2,1)`, y sale con translateY(40px) scale(.8). Actúa en la sección Manifiesto (min-height 80vh, padding 160px).
  - `fx.scrollScrub(scrubRef, null, { onFrame })` sobre la sección **Proceso de 300vh** con un hijo `position:sticky; top:0; height:100vh`. El progreso p sale de scrollProgress en modo sticky. Con `k = min(1, p·1.6)` el marco (`min(60vw,820px)` × `min(70vh,600px)`) pasa de `clip-path: inset(30% …)` a `inset(0%)`. `frame = min(3, floor(p·4))` cambia el estado entre 4 imágenes que se cruzan por opacity con transition .3s, más la etiqueta y el contador «0N / 04» en serif de 64px.
  - `fx.splitText(root, { stagger:60 })`: duración 900ms, y = 110 %, con máscara `overflow:hidden` por palabra o carácter (H1 y manifiesto en `words`, CTA «Hablemos.» en `chars`), disparado a umbral .2.
  - `fx.smoothScroll({ ease:.1 })`: lerp de la rueda sobre window; se monta después del preloader.
  - `fx.flip(workRef, mutate)` a 700ms `cubic-bezier(.2,.7,.2,1)` al cambiar Grid/Lista (en el HTML plano los botones no tienen handler). La grilla pasa de `repeat(3,1fr)` a `1fr`, el ítem de `1fr` a `220px 1fr` y la imagen de 300px a 120px.
  - `fx.reveal(root)` y `fx.magnetic(root)` por defecto.
- **Detalles:** nav de 28px por 56px con enlaces a 13px y letter-spacing .04em. Los botones de la nav son **rectos** (sin radio): «Hablemos» en mayúsculas .1em. El CTA del hero es una píldora con borde `.3` y un círculo claro de 40px con «↓»; el CTA final es una píldora clara en mayúsculas. El logo lleva el punto en itálica arena. El marquee va entre reglas de 1px `rgba(242,239,233,.1)`. El selector Grid/Lista es recto, con borde `.15`, y el activo se invierte. Las cards de trabajo son rectas: `#161616`, título serif de 26px y año a la derecha. Footer en mayúsculas .14em.
- **Móvil:** no hay media queries: la grilla de trabajo se queda en 3 columnas. Solo escalan los `clamp` y los `min()` del marco del scrub. Con movimiento reducido no se montan grano, parallax, magnetic, cursor, marquee, estela, scrub (scrollProgress devuelve vacío y el marco queda recortado al 30 %) ni smoothScroll. El preloader y splitText sí corren.
- **Reutilizar para:** portafolio de estudio o agencia, showcase personal de motion o dev creativo, caso de estudio editorial, marca de lujo o arquitectura en B/N.
- **Orden real de montaje:** `noiseOverlay(noiseRef,{alpha:.05})` → `parallax(root,{max:16})` → `reveal(root)` → `magnetic(root)` → `cursorBlend(root,{color:'#f2efe9'})` → `marqueeVelocity(marqueeRef,{base:.7})` → `imageTrail(trailRef,[4 gradientes],{size:160})` → `scrollScrub(scrubRef,null,{onFrame})` → `preloader(curtainRef,counterRef,{duration:1800,onDone})`; dentro de onDone se añaden → `splitText(root,{stagger:60})` → `smoothScroll({ease:.1})`. `flip(workRef, …)` solo se usa en `setView`.
