# Catálogo de técnicas del banco de landings

Técnicas probadas en las ~15 piezas del banco (julio 2026). Elegir UNA como
estrella por proyecto; las demás son soporte. Cada entrada dice de qué pieza
viene, porque el detalle completo vive en Mempalace (wing `landing-pages`).

## Heroes tipográficos

- **Sándwich tipográfico** (cattleya): palabra en 2 capas, la frontal con
  `mask: linear-gradient(...)` para que la imagen la atraviese.
- **Vitrina de vidrio** (morpho, colibri): wordmark serif gigante detrás de un
  panel de vidrio con la foto protagonista; letras asomando a los lados. En
  colibri la integración foto-losa fue con `mask-image` radial +
  `brightness(.62)` — NO `mix-blend: screen` (ver lecciones).
- **Mezcla sólido/outline** (vertigo): headline con `-webkit-text-stroke` que
  se rellena al hover o al scroll.
- **Letras que caen** (cafeto): stagger `from: random` desde arriba; envolver
  palabras en `white-space: nowrap` para que no se partan.

## Preloaders e intros

- **Maison** (veta): wordmark letra a letra + barra/hilo `scaleX` inyectada por
  JS, cortina de opacidad; la intro del hero es un timeline `paused` que se
  dispara al cerrar el preloader.
- **Contador 0→100 con cortina clip-path** (vertigo). Visible solo con clase
  `.js` en `<html>` para no atrapar a quien navega sin JavaScript.

## Vidrio, luz y profundidad

- Glass cards flotantes con métricas, sheen y bob senoidal infinito + parallax
  de mouse (morpho, plata, colibri).
- Tilt 3D del elemento protagonista (morpho, plata, veta).
- Glare que sigue el cursor: `::after` con radial-gradient posicionado en
  `--gx/--gy` actualizados con el pointer (veta).
- Brillo periódico sobre vidrio: `::after` con keyframes (plata).
- Polvo de luz en canvas sobre fondo negro cálido (morpho).

## Scroll y narrativa

- **Secuencia cine** (veta): sección de 260svh con `position: sticky` interno;
  frame que crece de tarjeta `scale(0.42)` a full-bleed 100vw×100svh.
- **Galería horizontal pineada** (vertigo): con thumbnails que recuperan color
  al hover (desaturadas .25 en reposo).
- **Skew por velocidad de scroll** (vertigo): clamp ±4°, decay 0.9, sobre la
  velocidad de Lenis.
- **Scrolltelling físico** (cafeto): un indicador fixed (altímetro) ligado al
  progreso total con ScrollTrigger scrub; narrativa por tramos.
- **Phone sticky sincronizado** (plata): el mockup cambia de pantalla según la
  feature visible.
- Marquees tricolor con scrub / infinitos (vertigo, design system).
- Manifiesto word-scrub conservando spans de color (vertigo).

## Canvas y WebGL

- **Shader crudo sin Three.js** (vertigo): full-screen triangle + fragment
  shader fbm 4 octavas, aurora reactiva al mouse suavizado, DPR cap 1.5.
- **Morph de partículas GPU** (luciernaga, Three.js): atributos `aFrom/aTo` +
  uniform `uMix`; `setFormation` congela el estado interpolado como origen y
  tweenea `uMix` 0→1. Formaciones ligadas a secciones vía ScrollTrigger
  (`data-formation`): swarm, ring, sphere, text. 3200 partículas desktop /
  1600 móvil.
- **Física con estado persistente** (cafeto): partículas que aterrizan y se
  apilan (settledPile con máximo); canvas frontal cuando un elemento opaco
  taparía el trasero.

## Micro-interacciones

- Botones magnéticos: translate hacia el cursor, regreso `elastic.out`
  (vertigo).
- Cursor custom dot+ring con estados (hover, "VER"): tamaño FIJO escalado con
  `scale` — nunca animar width/height. Solo bajo
  `hover:hover and (pointer: fine)` y sin reduced-motion (vertigo).
- Scramble text con glyphs aleatorios en palabra rotativa y nav (vertigo).
- Tarjeta de vista previa que sigue el cursor con lerp en índices/listas
  (partida).
- Reloj en vivo de ciudad (`Intl.DateTimeFormat` con timeZone) (vertigo).
- Punto vivo con sonar en gráficas; subrayado animado `em::after scaleX`
  (plata).

## Conversión y producto

- **Demo viva auto-reproducible** (plata): el producto funcionando en
  HTML/CSS/JS con estado aritmético coherente — la prueba social es verla.
- Waitlist con submit interceptado, validación y confeti que se reinicia
  (plata).
- **Mapa de butacas SVG generado por JS** (estreno): 126 butacas en filas
  curvas trigonométricas, ocupación simulada con piso (nunca llega a 0),
  asignación real de butaca al reservar, `aria-live`.
- Toggle mensual/anual con radios en `fieldset` alimentando el CTA en vivo;
  precios en pesos colombianos (turno).
- "Escasez honesta": fecha real, replay 48h, motivo — nunca urgencia falsa
  (estreno).

## Lecciones aprendidas (el porqué importa)

- **`mix-blend: screen` falla con fotos de cielo/fondo claro** — usar
  `mask-image` + `brightness()` para integrar foto y vidrio (colibri; se
  probaron 3 candidatas en navegador).
- **Sujetos blancos sobre fondo claro se lavan** — probar variantes reales de
  foto/recorte/máscara antes de fijar (cattleya, 5 variantes).
- **El reset `* { margin: 0 }` rompe el centrado nativo de `<dialog>`** —
  devolverle `margin: auto`.
- **Nunca animar width/height** — transform only; refactor real del cursor de
  vertigo (36→64→82px pasó a tamaño fijo 82px con scale 0.44/0.78/1).
- **Inter está vetada** por sobreusada (veto de impeccable en el banco).
- **No repetir paleta entre piezas** — cada proyecto estrena la suya en OKLCH.
- **Clase `.js` en `<html>`** para que preloaders/intros no atrapen sin JS.
- **Verificación estándar del banco:** Playwright en 1440 y 390, consola
  limpia, cero overflow horizontal.
