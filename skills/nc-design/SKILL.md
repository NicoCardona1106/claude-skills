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

Destilado de su banco de landings (`Desktop/Claude Code/personal/landing
pages/`, ~15 piezas, julio 2026) y de sus 4 favoritas: **morpho, plata, cattleya y cafeto**.
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

4. **Materia, luz y profundidad — nunca "paredes pintadas".** Un fondo de
   color plano con texto encima no es premium por buena que sea la paleta
   (feedback directo de Nicolas, 2026-07-23). Cada viewport necesita capas:
   (a) *luz ambiental* — glows direccionales, gradientes que implican una
   fuente de luz, glare sobre superficies; (b) *textura* — grano/ruido sutil
   (feTurbulence como data-URI), polvo de luz o partículas en canvas, patrones
   finos; (c) *profundidad* — elementos que se solapan (la imagen atraviesa la
   palabra, tarjetas glass flotando sobre el hero), vidrio con reflejo,
   sombras coloreadas, parallax de capas. Las favoritas lo cumplen todas.
   Si el encargo permite fotografía, elegir UNA imagen protagonista de calidad
   e integrarla con mask/brightness (patrón morpho/cattleya); si la pieza debe
   ser 100% autocontenida, construir la atmósfera con canvas y CSS. Test
   rápido antes de entregar: pausa en cada sección — si parece una pared
   pintada con texto pegado, falta materia.

5. **Motion como lenguaje, no como adorno.** El movimiento deriva del concepto:
   dirección, easing y stagger cuentan la misma historia en toda la página.
   Stack probado: GSAP + ScrollTrigger + Lenis (CDN jsdelivr en piezas
   estáticas). Animar solo transform/opacity (lección vertigo: nunca animar
   width/height — usar scale).

6. **Resiliencia y accesibilidad no se negocian.** Texto decorativo gigante con
   `aria-hidden` + heading real oculto accesible; clase `.js` en `<html>` para
   que sin JavaScript nada quede atrapado; `prefers-reduced-motion` respetado;
   cursor custom y hovers solo bajo `hover:hover and (pointer: fine)`;
   `aria-live` en resultados dinámicos.

7. **Performance con presupuesto.** DPR cap ~1.5 en canvas/WebGL, menos
   partículas en móvil (regla del banco: ~la mitad), efectos pesados apagados
   donde no aportan. Premium lento no es premium.

8. **Verificado, no supuesto.** Toda pieza se prueba en 1440 y 390 (Playwright
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
5. **Verificar** — principio 8 completo antes de mostrar, incluyendo el test
   de "pared pintada" del principio 4 sección por sección.
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

## Cuando Nicolas entrega una foto

Si el encargo incluye una fotografía, la foto ES el punto de partida de todo:

1. **Leerla de verdad** (visión): sujeto, temperatura de color, luz (dirección
   y dureza), texturas, mood. El concepto rector sale del sujeto, no de un
   template.
2. **Paleta derivada**: construir la paleta OKLCH desde los colores reales de
   la imagen (dominante como ground, un secundario como acento) — nunca una
   paleta genérica pegada al lado de la foto.
3. **Protagonista, no decoración**: integrarla con los patrones del banco —
   vitrina (morpho), sándwich tipográfico (cattleya), mask-image +
   brightness() (colibri). La palabra y la foto se entrelazan.
4. **Probar variantes reales**: recorte, máscara y blend se deciden viendo la
   foto en el navegador (lección cattleya: 5 variantes; sujeto claro sobre
   fondo claro se lava — ajustar ground o tratamiento antes que forzar).
5. La tipografía y el motion siguen el carácter del sujeto (un pomerania no
   pide lo mismo que una esmeralda).

## Al proponer para proyectos reales

Proponer primero patrones de las 4 favoritas (regla vigente desde 2026-07-23:
cattleya y cafeto reemplazaron a veta y vertigo). Presentar como propuesta con
beneficio/impacto/esfuerzo antes de implementar — nunca imponer un rediseño no
pedido (regla de alcance de razonamiento).

## Ideas adoptadas de taste-skill (2026-08-20)

Del repo público `Leonxlnx/taste-skill` (anti "AI slop" en frontends).
Reglas concretas que el banco no tenía explícitas; complementan los
principios de arriba, no los reemplazan.

1. **Lectura del brief en una línea.** Antes de proponer conceptos, declarar:
   "Leo esto como: [tipo de página] para [audiencia], con lenguaje [vibe]".
   La audiencia elige la estética, no el gusto propio; sectores regulados o
   de confianza-primero (salud, legal, gobierno, pagos) anulan la
   preferencia estética.

2. **Tres diales de calibración**, declarados al arrancar cada pieza:
   - VARIANZA (1 = simetría perfecta, 10 = asimetría artística)
   - MOTION (1 = estático, 10 = cinematográfico)
   - DENSIDAD (1 = galería de arte, 10 = cabina de mando)
   Guías: minimal/editorial 5-6 / 3-4 / 2-3 · premium consumer 7-8 / 5-7 /
   3-4 · agencia/experimental 9-10 / 8-10 / 3-4 · confianza/regulado 3-4 /
   2-3 / 4-5. Regla dura: si MOTION > 4, la página debe moverse de verdad;
   si no alcanza el tiempo para construirlo bien, bajar el dial y entregar
   estática limpia — nunca motion a medias.

3. **Locks de consistencia** (auditar sección por sección antes de entregar):
   - UN acento de color para toda la página; nada de un CTA azul en la
     sección 7 de una página cálida.
   - UN sistema de radios de esquina (todo recto, todo suave, o una regla
     documentada tipo "botones pill, tarjetas 16px") aplicado en todo.
   - UN tema: ninguna sección invierte a claro en una página oscura (o
     viceversa) salvo como recurso deliberado, máximo una vez.

4. **Disciplina de hero.** Máximo 4 elementos de texto: eyebrow O marca
   (uno o ninguno), headline ≤ 2 líneas, subtexto ≤ 20 palabras, CTAs
   (1 primario + máx 1 secundario). CTA visible sin scroll. El logo wall de
   confianza va SIEMPRE debajo del hero, nunca dentro. Headline de más de
   6 palabras no arranca en tamaño gigante: un titular de 4 líneas es error
   de font-size, no de copy.

5. **Anti-repetición de layouts.** Una familia de layout (3 tarjetas,
   cita full-width, split imagen+texto…) aparece máximo 1 vez por página;
   una página de 8 secciones usa al menos 4 familias distintas. Máximo 2
   zigzags imagen+texto seguidos. Máximo 1 marquee por página. Eyebrows
   (labels uppercase con tracking sobre el título de sección): máximo 1 por
   cada 3 secciones — chequeo mecánico: contar instancias de
   `uppercase` + `tracking` sobre headlines.

6. **CTAs sin duplicar intención.** "Contáctanos" + "Hablemos" +
   "Escríbenos" son la misma intención → UNA etiqueta usada en nav, hero y
   footer. Texto de botón en una sola línea (primario: máx 3 palabras).

7. **Catálogo de tells de IA a vetar** (se suman a Inter y a las "paredes
   pintadas"):
   - Datos: "Juan Pérez", "Acme", números perfectos (99.99%, 1234567) →
     nombres verosímiles del contexto local y datos orgánicos (47.2%). Los
     números fake-precisos sin fuente se marcan como mock o se eliminan.
   - Screenshots falsos hechos con divs (dashboard/terminal/lista de tareas
     de mentira) → screenshot real, imagen generada, o nada.
   - Micro-decoración: numeración de secciones ("001 · Capacidades"),
     pills sobre fotos, créditos de foto inventados ("Plate 03 · archivo"),
     cues de scroll ("Scroll para explorar"), puntos de color decorativos,
     strips de ciudad/clima/hora, footers con versión (v1.4.2), etiquetas
     poéticas ("Field notes", "Desde el taller") → etiqueta funcional o
     ninguna.
   - Paletas cliché de LLM: morado IA con glow, y el combo beige + latón +
     espresso como default de toda marca "artesanal/premium" → solo con
     justificación de marca real (la regla de paleta OKLCH nueva por
     proyecto ya lo empuja; esto nombra los clichés concretos).

8. **Oficio tipográfico fino:**
   - Para enfatizar una palabra dentro de un titular, usar itálica o bold
     de la MISMA fuente — nunca inyectar una serif suelta en un titular
     sans (ni al revés) solo por interés visual.
   - Itálicas en display con descendentes (y g j p q): `line-height` mínimo
     1.1 + reserva de padding inferior, o el trazo se recorta. Auditar cada
     palabra en itálica antes de entregar.

9. **Estados completos, no solo el caso feliz.** Skeletons con la forma del
   layout final (no spinners genéricos), empty states compuestos que
   indican cómo poblarse, errores inline en formularios, feedback táctil en
   `:active` (`scale(0.98)`).

10. **Auditoría de copy antes de entregar.** Releer cada string visible
    (titulares, botones, captions, alt text, footer): reescribir lo
    gramaticalmente roto, los juegos de palabras cute-pero-confusos y la
    falsa humildad poética. Copy aburrido y claro > copy IA ingenioso.

11. **Mecánica:** `min-h-[100dvh]` en vez de `h-screen` (la barra de iOS
    Safari rompe el layout); nunca `window.addEventListener('scroll')` —
    usar ScrollTrigger, IntersectionObserver o scroll-driven animations.

## Skills complementarias (instaladas 2026-08-20 — invocarlas, no reinventar)

Esta skill define el CRITERIO visual; las siguientes aportan la TÉCNICA.
Cárgalas con la herramienta Skill cuando la tarea lo pida:

- **Animación web** (scroll, timelines, micro-interacciones): cargar
  `gsap-core` + la que aplique (`gsap-scrolltrigger` para scroll,
  `gsap-timeline` para secuencias, `gsap-react` si es React/Next.js,
  `gsap-performance` antes de entregar). Son las skills oficiales de
  GreenSock — su API manda sobre lo que recuerdes de memoria.
- **Objetos/productos 3D en páginas** (modelo de producto girando en el
  hero, escenas 3D): cargar `threejs-fundamentals` + `threejs-loaders`
  (modelos GLTF) + `threejs-lighting`; `threejs-interaction` si el usuario
  manipula el objeto. Precedente propio: showcase 3D de Reflexcam.
- **"Quiero algo como tal sitio"** (clonar el look de una referencia que el
  cliente señala): cargar `design-dna` para extraer tokens, estilo y efectos
  de la referencia — y luego filtrar el resultado con los principios y los
  AI-tells de ESTA skill: design-dna extrae, nc-design decide qué se queda.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
