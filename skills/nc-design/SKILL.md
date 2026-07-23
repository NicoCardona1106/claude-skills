---
name: nc-design
description: >
  Estándar de diseño UI web premium de Nicolas Cardona, destilado de su banco de
  landings (julio 2026). Usar SIEMPRE que se diseñe o construya interfaz web con
  intención visual: landing pages, heroes, portadas, secciones de marketing,
  dashboards o SaaS que deban verse premium, portafolios, páginas de producto o
  lanzamiento — aunque Nicolas no diga "premium" explícitamente. También al
  revisar o mejorar el aspecto visual de una UI existente ("hazla más pro",
  "que se vea mejor", "nivel showcase"). Complementa a nicolas-mode e
  impeccable; esta skill aporta el lenguaje visual propio de Nicolas.
---

# NC-Design — lenguaje visual premium de Nicolas Cardona

(Prefijo NC = Nicolas Cardona: marca las skills creadas por/para él.)

Destilado de su banco de landings (`Desktop/Claude Code/landing pages/`, ~15
piezas, julio 2026) y de sus 4 favoritas: **morpho, plata, cattleya y cafeto**.
De las cuatro, **cattleya y cafeto son la vara máxima** — las piezas más
premium que ha hecho: ante la duda de nivel, dirección o acabado, compararse
contra esas dos. El objetivo no es decorar: es que cada pieza tenga concepto,
oficio y detalle de nivel showcase (referencia de vara: horizonx.so).

## Principios (en orden de importancia)

1. **Concepto antes que decoración.** Cada pieza nace de UNA idea rectora que
   gobierna todo (en cafeto todo "cae"; en morpho la tipografía vive detrás de
   una vitrina de vidrio; en plata el producto se demuestra solo). Si no puedes
   nombrar el concepto en una frase, aún no hay diseño.

2. **Una técnica estrella por pieza.** Cada proyecto tiene UN mecanismo
   memorable (sándwich tipográfico, altímetro ligado al scroll, teléfono vivo
   en CSS) y el resto lo acompaña sin competir. Diez efectos medianos < un
   efecto inolvidable bien ejecutado.

3. **Dirección de arte propia, nunca reciclada.** Paleta nueva en OKLCH por
   proyecto (no repetir la del anterior), pareja tipográfica display+body con
   carácter. Inter está vetada por sobreusada. Bodoni Moda, Cormorant,
   Italiana, Newsreader, Gabarito, Big Shoulders, Bricolage Grotesque son
   precedentes del banco — buscar ese nivel de intención, no copiarlas siempre.

4. **Motion como lenguaje, no como adorno.** El movimiento deriva del concepto:
   dirección, easing y stagger cuentan la misma historia en toda la página.
   Stack probado: GSAP + ScrollTrigger + Lenis (CDN jsdelivr en piezas
   estáticas). Animar solo transform/opacity (lección vertigo: nunca animar
   width/height — usar scale).

5. **Resiliencia y accesibilidad no se negocian.** Texto decorativo gigante con
   `aria-hidden` + heading real oculto accesible; clase `.js` en `<html>` para
   que sin JavaScript nada quede atrapado; `prefers-reduced-motion` respetado;
   cursor custom y hovers solo bajo `hover:hover and (pointer: fine)`;
   `aria-live` en resultados dinámicos.

6. **Performance con presupuesto.** DPR cap ~1.5 en canvas/WebGL, menos
   partículas en móvil (regla del banco: ~la mitad), efectos pesados apagados
   donde no aportan. Premium lento no es premium.

7. **Verificado, no supuesto.** Toda pieza se prueba en 1440 y 390 (Playwright
   si está disponible): consola limpia, cero overflow horizontal, formularios y
   estados funcionando. Las decisiones visuales finas (recorte de foto, blend,
   contraste) se prueban en navegador con variantes reales antes de fijarlas —
   en el banco se probaron 3-5 candidatas por decisión difícil.

## Flujo de trabajo

1. **Concepto** — proponer 2-3 conceptos rectores con nombre y frase; Nicolas
   elige (o elegir el más fuerte si pidió autonomía).
2. **Dirección de arte** — paleta OKLCH + pareja tipográfica + referencia del
   banco más cercana (leer `references/favoritas.md`).
3. **Técnica estrella** — elegir UNA del catálogo (`references/tecnicas.md`) o
   inventar una nueva al mismo nivel; definir las técnicas de soporte.
4. **Construir** — pieza completa, no mockup: contenido real o verosímil,
   estados de formulario, responsive.
5. **Verificar** — principio 7 completo antes de mostrar.
6. **Registrar** — actualizar Mempalace (wing del proyecto o `landing-pages`
   si es del banco) con concepto, técnicas y lecciones, según nicolas-mode.

## Referencias (leer según necesidad)

- `references/favoritas.md` — las 4 favoritas en detalle (patrones, cuándo usar
  cada una, y las secundarias veta/vertigo). Leer SIEMPRE antes de proponer
  dirección de arte para un proyecto real.
- `references/tecnicas.md` — catálogo de técnicas del banco completo
  (preloaders, heroes tipográficos, glass, scroll, WebGL, micro-interacciones,
  conversión) + lecciones aprendidas con el porqué. Leer al elegir la técnica
  estrella o al depurar un efecto.

## Skills aliadas — invocarlas sin pedir permiso

Esta skill define el QUÉ (el lenguaje visual de Nicolas); las skills de diseño
ya instaladas aportan el CÓMO. Invocarlas automáticamente cuando apliquen, sin
preguntar antes:

- **impeccable** — revisión/pulido de la interfaz, jerarquía, motion,
  accesibilidad. Usarla siempre en la fase de verificación.
- **ui-ux-pro-max** — paletas, parejas tipográficas, guidelines UX y patrones
  por tipo de producto, al definir la dirección de arte.
- **frontend-design** — dirección estética e intención al construir UI nueva.
- **emil-design-eng** — decisiones finas de animación y polish de componentes.
- **ui-styling** — shadcn/ui + Tailwind cuando el proyecto usa ese stack.
- **dataviz** — SIEMPRE antes de cualquier gráfica, chart o dashboard.
- **animation-vocabulary** — para nombrar con precisión un efecto buscado.

## Fuentes de inspiración — navegar antes de diseñar

Al arrancar la fase de concepto/dirección de arte, visitar (WebFetch o
Playwright) al menos una de estas fuentes para tomar ideas de composición,
tipografía y motion actuales — extraer PATRONES, nunca copiar una plantilla:

- https://figma-templates-en.vercel.app/ — galería de plantillas Figma que
  Nicolas usa como referencia de nivel.
- https://horizonx.so/explore — showcase de referencia histórica del banco.

Si Nicolas comparte un link nuevo de inspiración, añadirlo a esta lista
(quitando parámetros de tracking) y registrarlo en Mempalace.

## Al proponer para proyectos reales

Proponer primero patrones de las 4 favoritas (regla vigente desde 2026-07-23:
cattleya y cafeto reemplazaron a veta y vertigo). Presentar como propuesta con
beneficio/impacto/esfuerzo antes de implementar — nunca imponer un rediseño no
pedido (regla de alcance de razonamiento).

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
