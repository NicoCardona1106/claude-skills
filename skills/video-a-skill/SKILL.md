---
name: video-a-skill
description: "Convierte un video o post tutorial (link de YouTube, reel, página de tododeia, hilo, o una transcripción pegada) en una skill propia o en una mejora de una existente: extrae el método, lo compara con las skills que Nicolas ya tiene, propone CREAR / MEJORAR / DESCARTAR y solo con su visto bueno escribe. Usar cuando Nicolas diga 'vuelve esto una skill', 'sácale la skill a este video', 'video a skill', 'mira este tutorial y dime si sirve', o pegue un link de tutorial de Claude Code, agentes o flujo de trabajo pidiendo aprovecharlo. Para clonar el formato de un post de redes (gancho, estructura) es `clonador-de-formato`, no esta."
---

# /video-a-skill — De tutorial a skill (o a descarte)

La mayoría de tutoriales repiten algo que Nicolas ya tiene con otro nombre.
El valor de esta skill está en el paso 3 (comparar) y en atreverse a
DESCARTAR: una skill duplicada es peor que ninguna, porque compite en el
disparo con la que ya funciona.

## 1. Conseguir el contenido (lo más barato que sirva)

| Entrada | Cómo |
|---|---|
| Transcripción pegada | usarla tal cual |
| Página web / post (tododeia, blog, README) | `WebFetch` |
| YouTube público | `agy` (Gemini lee el video por URL): `node "C:\Users\NICO-C\Desktop\nc-workspace\propios\N Coterminal\herramientas\delegar.cjs" agy "<pedido>" --de=claude --modelo=gemini-3.8-flash-high`. Pedido corto y concreto (en lecturas largas devuelve vacío): primero «pasos del método con minuto», luego un tramo si hace falta |
| Reel / TikTok / video privado | pedir a Nicolas la transcripción o los subtítulos; no adivinar |

El plugin Watch (bradautomates/claude-video) NO está instalado; si algún día
se instala, sirve para mirar un tramo con cuadros (`--start/--end`). Mientras
tanto, agy da el panorama.

## 2. Extraer el método (ficha)

Separar con disciplina:

- **Dicho vs. visto**: lo que el autor afirma y lo que se ve hacer en
  pantalla, con minuto (`[04:12]`). Una afirmación sin demostración se marca
  «sin verificar».
- **Quitar lo motivacional** («esto cambia todo», «10x»): no entra a la ficha.
- **Ficha**: problema que resuelve · pasos del método · herramientas y
  versiones · requisitos (plan, API, instalación) · qué ejecuta en la máquina
  (hooks, MCP, scripts, red) · límites o trampas que menciona · fuente con
  link.

## 3. Comparar con lo que ya existe

```bash
ls ~/.claude/skills ~/.claude/agents
grep -il "<palabra clave>" ~/.claude/skills/*/SKILL.md
```

`~/.claude/skills` es la fuente; `herramientas/claude-skills/skills` es su
copia versionada (la refresca `sync.cjs`). Leer el frontmatter de las 1-3
skills más parecidas y, si hace falta, su cuerpo. Mirar también reglas de
`orquesta`, `nicolas-mode` y `modo-ahorro`: muchas ideas ya viven como una
sección y no como skill.

## 4. Proponer y ESPERAR

Una tabla corta y una recomendación; no se escribe nada hasta que Nicolas
diga cuál:

| Opción | Qué sería | Por qué sí / por qué no |
|---|---|---|
| CREAR `<nombre>` | skill nueva | solo si nada existente cubre el método |
| MEJORAR `<skill>` | sección o pasos nuevos en una existente | lo más común: la idea cabe en 5-20 líneas |
| DESCARTAR | nada | duplicado, doctrina paralela (como gstack o Superpowers), o no aplica a su trabajo |

Si la idea exige instalar algo de terceros (plugin, MCP, hook, `npx skills
add`), la propuesta incluye antes la lectura del repo: qué ejecuta, qué hooks
registra, a dónde manda datos, qué permisos pide, licencia, último
mantenimiento. Nunca instalar dentro de esta skill: se propone y Nicolas
decide.

## 5. Escribir (con `skill-creator`)

- Cargar `skill-creator` para el formato y leer 2 skills propias de estilo
  parecido.
- **Nueva**: `~/.claude/skills/<nombre>/SKILL.md`, en español, description
  con disparadores reales, y el pie de crédito CC BY de Nicolas (sin él,
  `sync.cjs` no la reconoce como propia) más una línea con la fuente.
- **Mejora**: tocar solo la sección necesaria; no reescribir la skill.
- Las skills de terceros no se editan en su lugar (un update las
  sobrescribe): si hay que cambiarlas, copia con nombre propio.
- Dejar 3 frases que DEBEN disparar la skill y 3 parecidas que NO, para
  probar el disparo.
- Correr `node C:\Users\NICO-C\Desktop\nc-workspace\herramientas\claude-skills\sync.cjs`
  (copia al repo y enlaza Codex y agy) y mostrar su salida. El commit espera
  autorización de Nicolas.

## Entrega

Ficha del método (paso 2) + decisión tomada + ruta de lo escrito + salida de
`sync.cjs`. Si se descartó, la ficha sola y la razón en una línea, y anotar
la lectura en `notas/` para no volver a evaluarla.

---

Idea de «videos-a-skills» (tododeia, 2026-08) y la forja con skill-creator.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
