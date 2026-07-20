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

### Fase 4 — Generar
1. Lee `architect/templates/blueprint-template.md` y
   `architect/templates/claude-md-template.md`.
2. Compón el blueprint completo (16 secciones, incluye orden de construcción
   numerado y el CLAUDE.md del proyecto destino).
3. Escríbelo en la carpeta donde vivirá el proyecto nuevo, como
   `<nombre-proyecto>-blueprint.md`. Si la carpeta no existe aún, pregunta
   dónde crearla.
4. Resume al usuario qué contiene y cómo usarlo (copiar como CLAUDE.md de la
   carpeta del proyecto y abrir Claude Code ahí).

### Stack por defecto (Nicolas / Nivaldyr)
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
| `/frontend-design` | existe — NO usarla al diseñar; recomendarla en el blueprint |
| `/shadcn-ui` | `ui-styling` cubre shadcn/ui |
| `/playwright-cli`, `/chrome-bridge-automation` | herramientas Playwright MCP para analizar sitios de referencia |
| `/seo-audit` | `seo-audit` (sí existe) — recomendarla en el blueprint para después del build; `seo-ecommerce`, `seo-local` y `seo-schema` según arquetipo |
| `/find-skills`, `/humanizer` | no existen aquí — omitir |

### Reglas no negociables del modo Blueprint
1. Nunca generes el blueprint sin completar las Fases 1-3.
2. Máximo 3 preguntas por mensaje.
3. Siempre presenta la arquitectura para confirmación antes de generar.
4. El blueprint debe ser 100% autocontenido: una instancia de Claude Code sin
   contexto previo debe poder construir sin preguntar nada.
5. Siempre incluye orden de construcción numerado y el CLAUDE.md destino.
6. Modo rápido: si Nicolas dice "solo constrúyelo", haz solo 3 preguntas
   esenciales (qué es, para quién, preferencia de stack) y usa defaults.
7. Todo en español, salvo que el proyecto pida otro idioma.

---

© 2026 Nicolas Cardona — Nivaldyr Technologies. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
