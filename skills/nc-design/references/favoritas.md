# Las 4 favoritas — patrones canónicos

Vigentes desde 2026-07-23: **morpho, plata, cattleya, cafeto** ("las 2 últimas,
las más top que hemos hecho" — Nicolas). Cada una define un arquetipo completo:
concepto, paleta, tipografía, técnica estrella y casos de uso. Al proponer
dirección de arte para un proyecto real, partir de la más cercana al dominio.

## MORPHO — lujo editorial oscuro

Santuario de mariposas ficticio (Filandia, Quindío). Réplica del look "39
Animated Templates" de Framer.

- **Concepto:** la palabra vive detrás de una vitrina de vidrio con la imagen
  protagonista.
- **Hero:** wordmark Italiana gigante (clamp hasta 13.5rem, decorativo
  `aria-hidden`, h1 real oculto) DETRÁS de un panel de vidrio con la foto
  (borde blanco translúcido, reflejo de vitrina, glow azul); las letras asoman
  a los lados.
- **Soporte:** glass cards flotantes con métricas y sheen, parallax de mouse,
  tilt 3D, polvo de luz en canvas, fondo negro cálido.
- **Usar para:** hoteles, experiencias turísticas, restaurantes premium, spas —
  cualquier marca oscura con una imagen protagonista fuerte.

## PLATA (v2) — product launch claro

App ficticia de finanzas personales (Colombia), página de lanzamiento/waitlist.

- **Concepto:** el producto se demuestra solo — nada de screenshots.
- **Técnica estrella:** teléfono construido 100% en HTML/CSS (marco, notch,
  status bar, balance con contador animado, gráfica SVG que se dibuja con
  stroke-dashoffset, tab bar) con DEMO VIVA auto-reproducible: transacciones
  que vuelan hacia el teléfono, notificaciones, estado aritmético coherente.
- **Soporte:** teléfono sticky que cambia de pantalla sincronizado con el
  scroll de las features; tarjetas glass flotantes (anillo de progreso SVG con
  stroke-dasharray) con bob senoidal y parallax; tilt 3D; waitlist con confeti
  y validación real; brillo periódico sobre el vidrio; modo claro con blobs de
  gradiente y sombras cobalto.
- **Móvil:** el teléfono sticky se oculta (features en columna), la demo del
  hero sí corre.
- **Usar para:** cualquier app/SaaS en pre-lanzamiento, demos de producto sin
  screenshots.

## CATTLEYA — editorial de lujo en claro

Alta perfumería botánica de los Andes, ficticia. Nivel plantilla PRIMAE del
pack GRIGOLETTO; construida con la instrucción de superar a colibri.

- **Concepto:** porcelana y tinta — lujo editorial claro, botánico, silencioso.
- **Paleta:** porcelana + tinta + violeta orquídea (oklch hue 322).
- **Tipografía:** Bodoni Moda (display) + Albert Sans (body).
- **Técnica estrella:** sándwich tipográfico — la palabra CATTLEYA en 2 capas,
  la frontal `aria-hidden` con `mask: linear-gradient(100deg, transparent 55%,
  black 64%)`, de modo que la foto de la orquídea atraviesa la palabra.
- **Lección clave:** flores/objetos blancos sobre fondo claro se lavan — se
  probaron 5 variantes de foto/recorte/máscara en navegador antes de fijar
  valores. Nunca fijar un blend a ciegas.
- **Usar para:** perfumería, belleza, moda, marcas premium de fondo claro,
  editorial elegante.

## CAFETO — scrolltelling de origen

Café de origen. La pieza narrativa del banco.

- **Concepto:** TODO cae — el lenguaje de motion completo deriva de la
  gravedad y del descenso de la montaña a la taza.
- **Técnica estrella:** granos de café en canvas que caen, ATERRIZAN y se
  apilan sobre el borde del footer (pila persistente, máx ~110, dibujada en el
  canvas frontal porque el footer opaco tapa el trasero); la velocidad de
  scroll de Lenis acelera la caída (boost hasta 3.2x).
- **Soporte:** altímetro `fixed` que baja de 1.950 m a 0 m "sobre tu taza" con
  el progreso de la página (ScrollTrigger scrub sobre body); letras del hero
  caen desde arriba en orden aleatorio (stagger `from: random`, palabras en
  `white-space: nowrap` para no partirse); reveals con y negativo; clip-path
  que revela hacia abajo; hovers que bajan (+3px). Narrativa en 3 tramos de
  descenso: cosecha 1.950 msnm → tolva/tambor → taza a 0 m.
- **Usar para:** marcas de origen y producto artesanal, narrativas de scroll,
  cualquier historia con eje físico (altura, tiempo, profundidad).

## Secundarias (siguen disponibles, ya no son el default)

- **VETA** — maison de joyería oscura: preloader wordmark letra a letra + hilo
  de oro, glare del vidrio que sigue el cursor (`--gx/--gy` con el pointer),
  "secuencia cine" (sección 260svh con sticky interno: frame que crece de
  tarjeta scale(0.42) a full-bleed), precios bajo cita, verde + oro. Para
  joyería, moda de autor, inmobiliaria premium, vinos.
- **VERTIGO** — showcase de agencia: shader WebGL fbm de aurora reactivo al
  mouse (sin Three.js, full-screen triangle, DPR cap 1.5), preloader con
  contador, cursor custom dot+ring, botones magnéticos, scramble text, skew
  por velocidad de scroll, galería horizontal pineada, tipografía outline que
  se rellena. Para estudios, agencias, portafolios.
