# Efectos y recetas del banco 2026-09 (25 landings premium)

Catálogo derivado del banco `references/landings/` (Nicolas, septiembre 2026,
hecho con Claude Design). Leer al elegir la técnica estrella, al aplicar el
checklist de pulido o al reutilizar `landings/fx.js`.

> **Formato de las landings, leer antes de copiar nada.** Los `*.dc.html` son
> exportaciones de Claude Design, NO HTML plano: usan `<x-dc>`, `<sc-for>`,
> `{{ t.clave }}`, `ref="{{ x }}"`, `style-hover`, y `support.js` carga React,
> ReactDOM y Babel desde unpkg en tiempo de ejecución (necesitan internet y
> abrirse vía HTTP; Playwright no abre `file://`). Se leen como PATRONES y se
> traducen al stack del proyecto; no se copian tal cual. **Pendiente
> (decisión 2026-09-04): convertir el banco a HTML plano en el PC principal
> para tenerlo listo para reutilizar.** `fx.js` sí es reutilizable directo
> (ES module sin dependencias; parcheado con `reducedMotion`, `isMobile` y
> `mobileCount`: canvases a 1x CSS px, mitad de partículas en móvil).

> **Regla "el banco manda" (Nicolas, 2026-09-04).** Donde estas landings
> choquen con el catálogo de tells de IA de SKILL.md (numeración de secciones
> 01/04, cues de scroll o de mouse, eyebrows uppercase en cada sección, Inter
> Tight en Atlas), gana el banco: son recursos válidos si están al servicio del
> concepto. Los tells siguen vigentes para todo lo que el banco no use.

---

## Cómo están construidas
- Un archivo por landing. Estilos **inline** (sin clases), fuentes de Google Fonts, `@keyframes` solo para entradas y loops CSS.
- Copy bilingüe en un objeto `copy = { es: {...}, en: {...} }` y un botón `ES · EN` en el nav. Al portar: el mismo diccionario sirve para i18n.
- Imágenes: `<image-slot>` (placeholders con drag&drop). Al portar: reemplazar por `<img>`/`next/image`.
- Toda la animación no-CSS vive en **`landings/fx.js`** (ES module, sin dependencias, cada función devuelve un cleanup). Es el archivo más valioso para reutilizar.

## Catálogo de efectos (fx.js)
| Función | Qué hace | Uso típico |
|---|---|---|
| `parallax(root,{max})` | Elementos `[data-depth="0.4"]` siguen al mouse | Capas del hero (imagen 0.2, tarjetas 0.6) |
| `reveal(root)` | `[data-reveal]` + `data-reveal-delay` aparecen al hacer scroll | Todas las secciones |
| `magnetic(root)` | `[data-magnetic]` botones imantados al cursor | CTAs |
| `tilt(root,{max})` | `[data-tilt]` tarjetas rotan hacia el cursor | Cards de producto |
| `typewriter(frases,onTick)` | Escribe/borra en bucle | Titulares (08 Kōan) |
| `scrollProgress(el,cb,{sticky})` | p∈[0,1] del recorrido; con sticky mide contenedor alto | Galería horizontal (09), pasos (10), mockup 3D (12), máscara (13), reloj (14) |
| `scramble(root)` | `[data-scramble]` texto descifrándose | Cifras (09) |
| `cursorFollow(root)` | `[data-follow="id"]` muestra #id siguiendo al mouse | Listas con preview (09, 15) |
| `counters(root)` | `[data-count="250"][data-suffix="+"]` cuenta al entrar | Stats |
| `particles(canvas,{type})` | Fondo continuo: ember · star · petal · bubble · snow | 17, 18, 20, 01, 03, 04, 05, 06, 07 |
| `waves(canvas)` | Olas sinusoidales en capas | 19, 23 |
| `streaks(canvas)` | Líneas de velocidad | 02 |
| `fog(canvas)` | Niebla derivando | 05, 06, 07 |
| `dotWave(canvas)` | Malla de puntos ondulante | 08 |
| `ring3d(ring,{radius,onIndex})` | Carrusel 3D circular arrastrable | 21 |
| `smoothScroll({ease})` | Scroll inercial tipo Lenis sobre window | 25 |
| `splitText(root,{stagger})` | `[data-split="words|chars"]` titulares con máscara + stagger | 25 |
| `imageTrail(zone,srcs)` | Estela de imágenes/tarjetas tras el cursor | 25 |
| `marqueeVelocity(track)` | Marquee que acelera e invierte con el scroll | 25 |
| `hoverDistort(canvas,img)` | Distorsión "liquid" de imagen al hover | (catálogo) |
| `preloader(curtain,counter,{onDone})` | Contador 0→100 + cortina | 25 |
| `cursorBlend(root)` | Cursor custom `difference` con label `[data-cursor]` | 25 |
| `flip(container,mutate)` | Transición FLIP entre layouts (grid↔lista) | 25 |
| `scrollScrub(wrap,video,{onFrame})` | Video/secuencia controlada por scroll | 25 |
| `noiseOverlay(canvas)` | Grano de película animado | 25 |

Patrón de montaje: `componentDidMount → import('./fx.js') → this.cleanups=[fx.x(...), ...]`; `componentWillUnmount → cleanups.forEach(c=>c())`. En React: mismo código dentro de `useEffect` devolviendo el cleanup.

## Las 25 landings
### Colección 01 · Hero cinematográfico (modernizada con fondos canvas)
01 Aurora — hotel · slides 01/04 auto, polvo dorado, barrido de luz, glass card
02 Velocità — supercar · switch de modelo, speed streaks, grid 3D en perspectiva, marquee
03 Primae — joyería (claro) · letras gigantes con parallax por profundidad, pétalos, clip reveal
04 Nébula — producto tech (claro) · anillos orbitando en 3D real, burbujas, glass cards
05 Cristalyne — botánico · índice 01/03, bloom, cristales twinkle + niebla, scroll horizontal
06 Terra — expediciones · ken burns, nieve + niebla, contadores, itinerario sticky
07 Origen — café · split panel papel/oscuro, letras cayendo, granos + ascuas + vapor, marquee
08 Kōan — agencia (claro) · typewriter, cursor custom, gradient mesh + malla de puntos

### Colección 02 · Scroll-driven
09 Élan — inmobiliaria · galería horizontal por scroll (sticky), scramble, imagen sigue cursor
10 Bluebird — ciberseguridad · radar animado, 3 pasos sticky que cambian imagen con scroll
11 Synapse — brain trainer · tarjetas apiladas sticky, slides, pricing
12 Pulse — SaaS · mockup 3D que se endereza al scroll, bento, toggle mensual/anual
13 Noir — perfumería · máscara clip-path que se abre con scroll, humo, selector de tamaño
14 Chrono — relojería · reloj rota/escala con scroll, specs que se pinean, 400vh
15 Forma — arquitectura · antes/después arrastrable, líneas blueprint, lista con preview
16 Lumen — festival · tipografía cinética en 3 filas, countdown live, lineup por día

### Colección 03 · 3D + fondos continuos
17 Veldrah — saga fantástica · ascuas canvas, capítulos 01/04, título con blur-in
18 M. Magazine — editorial · pétalos + bokeh, busto glass, columnas editoriales
19 Verde — dental wellness · olas + burbujas canvas, isla 3D flotante, booking con slots
20 Aurelia — residencias · estrellas twinkle, barrido de luz, slides 01/03
21 Orbe — e-commerce · anillo 3D de 8 productos arrastrable, aurora
22 Aether — IA · esfera de 6000 partículas three.js con orbit por mouse/drag, ticker live
23 Drift — surf · olas + aurora + sol, widget de condiciones, marquee
24 Prisma — herramienta de diseño (claro) · cubo CSS 3D girando, gradient mesh, chips en órbita

### Showcase · Catálogo premium completo
25 Atlas — estudio · preloader, split text, scroll inercial, cursor blend, marquee por velocidad, image trail, FLIP grid↔lista, secuencia scrub con máscara, grano. **Referencia de "nivel superior"**: úsala como checklist de pulido.

## Checklist de pulido superior (orden recomendado al portar)
1. Preloader con contador + cortina (evita el flash de contenido).
2. Split text en el H1 del hero; el resto entra con `reveal`.
3. Scroll inercial (o Lenis real) + `prefers-reduced-motion` para desactivarlo.
4. Cursor custom con label contextual solo en desktop (`pointer:fine`).
5. Un fondo continuo por hero (canvas o gradient mesh), nunca más de dos.
6. Micro-interacciones: magnetic en CTAs, tilt en cards, marquee por velocidad.
7. Grano de película al 4–6% en `mix-blend-mode:overlay`.
8. Una sección scroll-driven (sticky) como momento "wow" a mitad de página.

## Recetas rápidas (cómo se logran las cosas)
- **Hero cinematográfico**: imagen con `inset:-4%` + `kenBurns`/`zoomOut` 3–5s, dos gradientes (horizontal para legibilidad + vertical para fundir), titular por líneas con `fadeUp` escalonado (.6s, .8s, 1s), nav con `fadeIn .2s`.
- **Fondo continuo**: `<canvas>` absoluto dentro del hero con `pointer-events:none`; el canvas se redimensiona con ResizeObserver al contenedor. Nunca más de 2 canvases por hero.
- **Slides 01/0N**: estado `slide`, `setInterval` 6–9s, y `replayHero()` que reinicia las animaciones CSS de `[data-hero-anim]` (animation:none → reflow → restaurar).
- **Sticky scroll-driven**: sección de 300–400vh con hijo `position:sticky;top:0;height:100vh`; `scrollProgress(el, p=>..., {sticky:true})` mapea p a transform/clip-path/estado.
- **3D CSS**: contenedor con `perspective`, hijo con `transform-style:preserve-3d`; caras con `rotateY(n) translateZ(r)`. Para parallax + centrado, separar en dos wrappers (el centrado no debe llevar `data-depth`).
- **Glass**: `background:rgba(255,255,255,.06–.1); border:1px solid rgba(255,255,255,.14–.2); backdrop-filter:blur(14–18px)`.
- **Tipografías usadas**: Cormorant Garamond, Italiana, Bodoni Moda, Cinzel, Playfair, Newsreader, Instrument Serif (serif display) · Manrope, Sora, Geist, Onest, Syne, Unbounded, Archivo Black, Anton, Bricolage Grotesque (sans) · Space Mono, JetBrains Mono, Geist Mono (mono).
- **Botones**: pill con icono circular a la derecha (`padding:6px 6px 6px 22px`) es el patrón CTA recurrente.

## Checklist responsive (ya aplicado)
nav con `gap:24px` y links con `gap:clamp(14px,2vw,34px)`; `white-space:nowrap` en botones, tags y contadores; títulos con `clamp()`.
