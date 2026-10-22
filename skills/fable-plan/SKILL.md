---
name: fable-plan
description: Planeación al estilo Fable 5. Usar antes de construir una función nueva, hacer un cambio grande, o cuando pidan un plan para cualquier desarrollo. Incluye Modo Blueprint (The Architect) — usar cuando Nicolas quiera crear un proyecto, producto o app nueva desde cero, diseñar la arquitectura completa de algo, o pida un blueprint.
---

# Fable Plan — las preguntas antes de construir

Dos modos. Elige según el pedido:

- **Modo Cambio** — modificar o extender un proyecto que ya existe.
- **Modo Blueprint** — crear algo nuevo desde cero (un SaaS, una app, una API,
  un sitio). Diseña la arquitectura completa y genera un blueprint que otra
  instancia de Claude Code puede construir sin hacer preguntas.

---

## MODO CAMBIO

Nunca propongas sin explorar. El plan que se escribe sin leer el código es
ficción con formato.

### Paso 0 — Clasifica el pedido (antes de explorar)
Di en voz alta en qué carril entra, para que Nicolas pueda corregirte:

- **Sonda** — una pregunta de factibilidad ("¿se puede...?"). Su entregable
  es una respuesta, no código que se queda. Explica en 2-3 frases qué vas a
  probar, pide el visto bueno y averígualo lo más barato posible. Lo que
  construyas queda marcado como desechable.
- **Acotado** — un cambio bien delimitado sobre un flujo que YA existe y se
  puede leer en el repo. Las preguntas que importan, plan corto EN EL CHAT
  (unos párrafos), y para. Sin blueprint, sin documento.
- **Arquitectura** — proyecto nuevo, subsistema nuevo o cambio que reordena
  cómo encajan las piezas. Va el proceso completo (Modo Blueprint).

Entender el tipo de app NO lo vuelve acotado: acotado se mide por el repo,
no por tu familiaridad. Ante la duda entre dos carriles, toma el más pesado.
El trinquete es de una sola vía: si aparece complejidad escondida a mitad,
súbete de carril y dilo; nada baja de carril.

**Nada es "demasiado simple para necesitar aprobación".** Lo que se encoge
con la simplicidad es el documento, nunca el OK de Nicolas: un plan de dos
frases sigue siendo un plan que se presenta y se espera.

### Paso 1 — Explora primero
Lee el código relevante antes de opinar: cómo está hecho lo que ya existe,
qué convenciones sigue el proyecto y qué se puede reutilizar. Si vas a
proponer algo nuevo, primero demuestra que no existe ya.

### Paso 2 — Las preguntas de Fable (respóndelas todas)
1. ¿Cuál es el problema REAL detrás del pedido? Lo que piden y lo que
   necesitan no siempre coinciden.
2. ¿Qué es lo más pequeño que resuelve ese problema?
3. ¿Qué se rompe con este cambio? Busca los lugares que dependen de lo que
   vas a tocar — no asumas que ninguno.
4. ¿Cuáles son los casos límite? Vacío, enorme, duplicado, sin conexión,
   usuario sin permiso.
5. ¿Cómo verificamos que quedó? Nombra el comando, la prueba o el ojo humano
   que lo confirma. Un paso sin verificación no es un paso.
6. ¿Qué NO vamos a hacer, y por qué? Dejarlo escrito evita que regrese.

### Paso 3 — El plan
- Pasos pequeños y reversibles; cada paso con su verificación.
- Si una pregunta abierta CAMBIA el plan, se hace antes de escribirlo. Si no
  lo cambia, se decide y se anota la decisión tomada.
- El plan dice qué archivos se tocan y qué se reutiliza de lo existente.

### Regla de escritura del plan: cero rellenos
El plan se escribe para alguien que no conoce el proyecto. Estas frases son
fallas del plan, no de quien lo ejecuta — no se escriben nunca:

- "pendiente", "TBD", "se define después", "completar detalles"
- "agregar el manejo de errores apropiado" / "validar lo necesario"
- "escribir las pruebas de lo anterior" (sin decir cuáles)
- "igual que el paso 3" (repítelo: los pasos se leen desordenados)
- nombrar una función, tipo o endpoint que ningún paso define

Cuando un paso toca código que otro paso produce, el plan lleva dos líneas
explícitas:

- **Usa:** qué consume de pasos anteriores, con la firma exacta.
- **Entrega:** qué nombres y tipos van a depender de este paso.

Quien ejecuta un paso solo ve ese paso: ese bloque es su única forma de
conocer los nombres del vecino.

**Autorrevisión antes de presentar** (la haces tú, no un subagente): recorre
el objetivo punto por punto y señala qué paso lo cumple — lo que no tenga
paso es un hueco; y revisa que los nombres del paso 7 sean los mismos que
definiste en el paso 3. `limpiarCapas()` en uno y `limpiarCapasFull()` en
otro ya es un bug.

### Regla de cierre
Presenta el plan y espera el OK antes de tocar código. Un plan aprobado a
medias es un malentendido con cronograma.

---

## DEFINITION OF DONE Y CICLO DE EJECUCIÓN (ambos modos)

Todo plan termina en una **Definition of Done**: una lista de criterios que
se responden con Sí o No y que cualquier persona puede verificar. Sale
directo de la pregunta 5 ("¿cómo verificamos que quedó?") — un criterio que
no se puede verificar no entra a la lista, se reformula hasta que se pueda.
En Modo Blueprint, la DoD del proyecto va dentro del blueprint (sección de
reglas) para que el constructor la herede.

La DoD es el contrato de la tarea. Al ejecutar:

1. Tras cada implementación importante, revisa la DoD completa — no solo lo
   que acabas de tocar.
2. Corrige incumplimientos sin pedir aprobación por correcciones menores.
   La aprobación fue del plan; dentro del plan aprobado hay autonomía.
3. Repite construir → revisar → corregir hasta que todo esté en Sí, o hasta
   que dos iteraciones seguidas no mejoren nada — en ese caso, para y
   reporta qué quedó en No y por qué. Iterar sin mejorar es gastar sin
   avanzar.

La entrega final muestra la tabla de verificación (formato en nicolas-mode,
Documentación Obligatoria). Los ❌ se muestran, no se maquillan.

---

## MODO BLUEPRINT (The Architect)

Eres un arquitecto de software senior entrevistando a un cliente. No escribes
código en este modo: diseñas el sistema completo y produces un blueprint
autocontenido. Todo el material de apoyo vive en `architect/` dentro de esta
skill.

### Fase 0 — Repo existente (solo si ya hay código)
Se salta la Fase 1: el repo ya dice qué es el producto. Antes de preguntar,
lee manifest y lockfile, rutas y entrada, migraciones y esquema, tests,
CI/deploy y el CLAUDE.md/AGENTS.md del repo, e imprime un **Mapa del repo**:
stack, capa de datos, comandos de test/lint/build, destino de deploy y las
3-5 convenciones que el cambio debe respetar. Nicolas lo corrige antes de
seguir. Las preguntas son las del Paso 2 del Modo Cambio, sobre el delta.
El blueprint lleva estado actual, estado objetivo, delta por archivo e
interfaces que no se mueven (API, columnas, eventos, variables de entorno).
Las convenciones y versiones del repo (su lockfile) mandan sobre el stack
por defecto. Migración (framework, base, proveedor): nunca de golpe — lista
de paridad (todo lo que hace hoy, también lo no documentado), comando que
prueba que viejo y nuevo coinciden, cómo conviven, corte por pasos con su
vuelta atrás y el umbral que obliga a revertir.

### Fase 1 — Descubrimiento
Lee `architect/questions/phase-1-discovery.md`. Haz 2-3 preguntas
conversacionales (nunca todas de golpe). Clasifica el proyecto en un
arquetipo y lee su archivo en `architect/knowledge/archetypes/`:

| Arquetipo | Archivo |
|-----------|---------|
| SaaS / Web App | `saas-webapp.md` |
| Marketing / Landing | `marketing-site.md` |
| App móvil | `mobile-app.md` |
| API / Backend | `api-backend.md` |
| Herramienta interna | `internal-tool.md` |
| Plataforma de contenido | `content-platform.md` |
| E-commerce / Tienda | `ecommerce.md` |

### Fase 2 — Profundización
Lee la sección del arquetipo en `architect/questions/phase-2-branches.md`.
Haz 3-5 preguntas dirigidas. Consulta
`architect/knowledge/building-blocks/*.md` según la decisión (auth, base de
datos, deployment, API, testing, estilos, estado) y
`architect/knowledge/stack-compatibility.md` antes de combinar tecnologías.

### Fase 3 — Arquitectura
Lee `architect/questions/phase-3-confirmation.md`. Presenta el stack completo
con la razón de cada decisión. Sé opinionado: "esto es lo que yo construiría",
no un menú de opciones. Espera confirmación o ajustes antes de generar.

Antes de presentar, los dos gates de la skill `srs` (pasos 3 y 4):
- **Gate A:** cero `[NEEDS CLARIFICATION]`, también en las decisiones de
  arquitectura (tenant, borrado, quién tiene las claves, región). Los que
  sigan abiertos se preguntan en este mensaje; ninguno llega a la Fase 4.
- **Gate B:** con SRS aprobado ya corrió; se repiten solo ejecución y punto
  ciego sobre la arquitectura. Sin SRS (modo rápido o cambio), completo.
  El mensaje lleva los 2-3 riesgos principales con su mitigación.

### Fase 4 — Generar
1. Lee `architect/templates/blueprint-template.md` y
   `architect/templates/claude-md-template.md`.
2. Compón el blueprint completo (16 secciones, incluye orden de construcción
   numerado y el CLAUDE.md del proyecto destino). Cada paso del orden de
   construcción lleva cuatro campos:
   - **Hace:** qué construye y los archivos que crea o edita, con nombre.
   - **Listo cuando:** 2-6 criterios Sí/No en el formato del SRS («Dado …
     cuando … entonces …» con algo observable), al menos uno de error o
     borde. «El cobro funciona» es un defecto del blueprint.
   - **Verifica:** comandos que salen 0 cuando el paso está bien (si lo
     correcto es un error: `s=0; cmd || s=$?; test $s -eq 2`). Lo que solo
     decide un humano (aspecto visual, revisión de tienda, DNS) no es
     criterio: va a una checklist post-construcción del blueprint.
   - **Checkpoint:** `git commit` + `git tag paso-NN-<slug>`, el punto de
     vuelta atrás si el paso siguiente sale mal.

   Un paso = una sentada: si pasa de 6 criterios o de 5 archivos, se parte
   (datos → servidor → interfaz).
3. **Versiones:** ninguna sale de memoria ni de `architect/knowledge/` (es
   caché: ahí aún dice Next.js 15). Cada versión que se fija se lee del
   registro en esta sesión — `npm view <pkg> dist-tags peerDependencies
   --json`, `curl -s https://pub.dev/api/packages/<pkg>` (`latest.version`),
   `curl -s https://pypi.org/pypi/<pkg>/json` (`info.version`) — y se anota
   con su estado: VERIFICADA, PRERELEASE, VIEJA (>12 meses sin release),
   DEPRECADA o SIN VERIFICAR (nunca se rellena con una plausible). La más
   nueva no siempre es la usable: si el framework o el tooling no la acepta
   (`peerDependencies`), se fija la anterior con una línea de por qué. Los
   servicios (Supabase, Vercel, Stripe) no llevan versión.
4. Si el orden pasa de 11 pasos o se va a repartir con `orquesta`, además
   `<nombre-proyecto>-tasks.json` al lado del blueprint: un arreglo en orden
   de construcción (nadie lo reordena después) con, por paso, `id`, `title`,
   `dependencies` (solo las reales: ¿fallaría sin la otra?), `acceptance`,
   `verify` (siempre arreglo), `checkpoint` (el tag del paso), `files` y
   `status` (`pending`). Todo test o config que corra un `verify` está en
   `files` de esa tarea o de una anterior; dos tareas van en paralelo solo
   si sus `files` no se cruzan.
5. Escríbelo en la carpeta donde vivirá el proyecto nuevo, como
   `<nombre-proyecto>-blueprint.md`. Si la carpeta no existe aún, pregunta
   dónde crearla.
6. Resume al usuario qué contiene y cómo usarlo (copiar como CLAUDE.md de la
   carpeta del proyecto y abrir Claude Code ahí).

### Stack por defecto (Nicolas)
Salvo que el proyecto pida otra cosa: **Next.js + Supabase + Stripe +
Vercel**, con **Supabase Auth o Clerk** para autenticación (Clerk cuando se
necesiten organizaciones/equipos o UI de auth lista; Supabase Auth cuando
alcance con lo básico). Laravel + PHP + MySQL es el stack secundario para
proyectos legacy o cuando el cliente lo exija.

### Skills disponibles en este entorno
El material de `architect/` menciona skills que aquí se mapean así:

| Menciona | Usar en su lugar |
|----------|------------------|
| `/deep-research` | `deep-research` (sí existe) — comparar tecnologías |
| `/ui-ux-pro-max` | `ui-ux-pro-max` (sí existe) — sistema visual en Fase 3 |
| `/frontend-design` | archivada (`~/.claude/skills-archivo/`) — omitir |
| `/shadcn-ui` | sin skill instalada (`ui-styling` está archivada) — omitir |
| `/playwright-cli`, `/chrome-bridge-automation` | herramientas Playwright MCP para analizar sitios de referencia |
| `/seo-audit` | `seo-audit` (sí existe) — recomendarla en el blueprint para después del build; `seo-ecommerce`, `seo-local` y `seo-schema` según arquetipo |
| `/find-skills`, `/humanizer` | no existen aquí — omitir |

### Reglas no negociables del modo Blueprint
1. Nunca generes el blueprint sin completar las Fases 1-3 (0, 2 y 3 con repo
   existente).
2. Máximo 3 preguntas por mensaje.
3. Siempre presenta la arquitectura para confirmación antes de generar.
4. El blueprint debe ser 100% autocontenido: una instancia de Claude Code sin
   contexto previo debe poder construir sin preguntar nada.
5. Siempre incluye orden de construcción numerado y el CLAUDE.md destino.
6. Modo rápido: si Nicolas dice "solo constrúyelo", haz solo 3 preguntas
   esenciales (qué es, para quién, preferencia de stack) y usa defaults.
7. Todo en español, salvo que el proyecto pida otro idioma.

---

Patrones adaptados de the-architect (Hainrixz, MIT) — https://github.com/Hainrixz/the-architect

Técnicas adaptadas de obra/superpowers (MIT, © 2025 Jesse Vincent) — https://github.com/obra/superpowers

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
