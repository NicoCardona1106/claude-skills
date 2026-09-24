---
name: orquesta
description: "Orquestación multi-agente estilo director para Nicolas: documenta, contrata entregables, reparte trabajo entre subagentes (Sonnet/Opus/Haiku según la tarea) o lanza un Workflow, y revisa contra contrato. Usar cuando Nicolas diga /orquesta, 'orquesta esto', 'reparte este trabajo', 'usa workflow' o pida coordinar varias tareas o una semana de trabajo."
---

# /orquesta — El director reparte y revisa

Principio: **no construyas, reparte y revisa.** Tú (Fable) eres el director:
documentas, contratas, repartes, supervisas y revisas. El código y los
entregables los producen los subagentes. Esta skill ES la autorización explícita
de Nicolas para usar la herramienta Workflow cuando la escala lo amerite.

Aplica también las reglas de `nicolas-mode` (sección ORQUESTACIÓN Y SUBAGENTES).

## El router no ejecuta

Quien reparte —el director, o cualquier agente/skill que solo clasifica y reenvía— mantiene su instrucción delgada: una dispatch table de menos de 40 líneas, sin lógica de negocio adentro. Si duda entre dos destinos, pregunta en vez de decidir a ciegas. Las tareas compuestas ("revisa esto y avísame de aquello") se parten en turnos, un destino por turno.

## Fase 1 — El documento

No se delega lo que no está escrito.

- Si Nicolas pasó un archivo de plan (ej: `SEMANA.md`), léelo y valida que cada
  tarea tenga los 5 elementos: entregable con ruta, fecha, qué existe vs qué es
  nuevo, zona prohibida, criterio de aceptación verificable.
- Si NO hay documento: entrevístalo — UNA pregunta a la vez, repregunta lo vago —
  y escribe el archivo (default `SEMANA.md` en la raíz del proyecto) con esos 5
  campos por tarea.
- Señala qué tareas están mal planteadas o son el mayor riesgo, sin proponer
  soluciones todavía.

## Fase 2 — El reparto (tabla, sin construir)

Propón en una tabla y ESPERA aprobación de Nicolas antes de lanzar nada:

| Agente | Perfil/modelo | Razón del modelo | Tareas | Archivos propios | Prohibido | ¿Paralelo? |

- Perfiles predefinidos en `~/.claude/agents/`: `implementador` (sonnet),
  `mantenedor` (sonnet), `revisor` (opus), `redactor-cliente` (opus). Para UI
  (añadidos 2026-09-06): `verificador-visual` (sonnet, solo Playwright: capturas,
  consola, overflow — barato, no gasta contexto del director), `portador`
  (sonnet, ejecuta la skill `portar-landing` archivo por archivo, ideal para
  repartir 25 landings), `disenador-landing` (opus, pieza completa bajo
  nc-design, verifica antes de entregar) y `auditor-tells` (opus, solo lectura,
  PASA/NO PASA por sección contra los locks y tells de nc-design). Si ningún
  perfil calza, usa el Agent tool genérico con `model` explícito.
- **Perfil externo `agy` (Antigravity, Gemini)** — verificado 2026-08-23 en el
  Panel Agéntico. Cuándo: segunda opinión de OTRO modelo (revisión cruzada de
  diffs), tareas masivas baratas de solo-lectura, resúmenes/explicaciones.
  Cómo: `agy -p "<prompt>" --output-format json [--json-schema <ruta>]
  [--effort low|medium|high]` — el wrapper JSON trae `response`,
  `structured_output` (si hay schema) y `usage` con tokens. Límites duros:
  en modo print el prompt viaja como argumento (tope ~25k chars; `--input-format
  stream-json` sí lee NDJSON por stdin, un turno por línea)
  por el límite de línea de comandos de Windows; desde PowerShell 5.1 los
  argumentos con comillas se rompen — invocarlo desde Node/execFile); no
  garantiza herramientas de lectura en modo print → embebe el contexto en el
  prompt. REGLA v1: agy solo lee y opina, nunca escribe en repos. Contrato de
  4 campos textual en el prompt, igual que con cualquier subagente.
- **Hermes NO es delegable por velocidad** (medido 2026-08-24): su modo no
  interactivo (`hermes -z`) tardó 92.7s en responder "ok". CAUSA: corre
  qwen3.6 LOCAL vía Ollama en el PC de Nicolas (dato de Nicolas) — es
  GRATIS (solo electricidad) pero lento en su hardware. Usarlo interactivo
  (terminal de N-Coterminal) o para sus agentes (whatsapp/gateway); como
  motor de opinión solo si algún día corre con API rápida.
- **Perfil externo `codex`** (OpenAI Codex CLI, verificado 2026-08-23,
  hoy CLI 0.154.0, default gpt-5.6-sol; tabla de modelos más abajo). Desde 2026-09-06 Nicolas PAGA el plan de OpenAI (~81.000 COP/mes): codex
  ya no es "con moderación" — vale para tercera opinión, revisión cruzada de
  diffs y tareas de código/redacción acotadas; lo masivo de solo-lectura sigue
  yendo a agy (Google AI Pro, ventana enorme). Cómo:
  `<prompt por stdin> | codex exec - --color never [-m modelo] [-C dir]
  [-s read-only] [--output-schema <ruta.json>] [-o <archivo_salida>]` —
  SÍ lee stdin (sin el límite de argumentos que sufre agy), `--json` emite
  eventos JSONL, `-o` escribe la respuesta final a archivo. Para revisión:
  `codex exec review` revisa el repo actual. Desde 2026-09-06 codex SÍ
  puede ESCRIBIR, pero solo en un worktree aislado (skill
  `using-git-worktrees`): `codex exec - -C <carpeta> --approve-for-me --skip-git-repo-check --color never -o <salida.md>`
  (verificado 2026-09-24 con codex-cli 0.156.1: `--approve-for-me` ya implica
  el sandbox workspace-write y NO se puede combinar con `-s`; `--full-auto` no
  existe en exec; `--skip-git-repo-check` si la carpeta no es un repo). El plugin `codex-companion.mjs
  task --write` falló ese día con «CreateProcess: Rejected ... setup refresh
  had errors» sin tocar archivos: si pasa, usar `codex exec` directo. Nunca sobre master ni fuera del worktree; el diff
  pasa por `revisor` (o por el director) antes de fusionar, igual que un
  implementador de Claude. Para opinar sin tocar nada sigue `-s read-only`.

### Reparto natural entre Claude, agy y codex (decidir solo, sin preguntar)

**Regla de Nicolas (2026-09-24): esta tabla se aplica SIEMPRE, tarea por tarea, aunque sobre cuota de Claude y sin que él lo pida.** Antes de cada `Agent(...)` preguntarse «¿esto es de Codex?»; si es mecánico con contrato, va a Codex y el director solo revisa. En el informe final, una columna «a quién fue».

| Tarea | Va a | Por qué |
|---|---|---|
| Leer o resumir muchos archivos, un repo entero, un PDF largo, un video | **agy** | ventana enorme, gratis con Google AI Pro; embebe el contexto en el prompt |
| Dato actual (precio, versión, noticia) con búsqueda | **agy** | busca en tiempo real |
| Segunda opinión de OTRO modelo sobre un diff o un plan | **agy** (rápida) o **codex** (a fondo) | evita el sesgo del mismo modelo |
| Código acotado con contrato (endpoint, script, refactor pequeño, tests) | **codex** en worktree | plan pago, escribe bien código; libera plan de Claude |
| Talacha mecánica que antes iba a `implementador` (sonnet): refactor guiado, tests de una función, mover código sin criterio nuevo | **plugin Codex** `/codex:rescue --background` en worktree | corre en la cuota de ChatGPT, no en la de Claude; hilo reanudable con `--resume`; el diff lo revisa `revisor` igual que siempre |
| Redacción técnica acotada (README, doc, guía) | **codex** | redacta bien; salida por `-o` |
| Pieza que exige criterio, arquitectura, seguridad, texto que ve un cliente | **subagente Claude opus** | contexto y doctrina de Nicolas |
| Ejecución con muchas reglas propias (nc-design, nicolas-mode, skills) | **subagente Claude sonnet** | codex y agy no cargan las skills |
| Revisión final contra contrato | **revisor (opus)** | siempre Claude: es quien conoce el contrato; Opus 5.5 caza más bugs con menos falsos positivos que Opus 5 |
| Leer gráficas, diagramas o capturas densas (valores, qué conecta una flecha, qué cambió entre dos versiones) | **subagente Claude opus** (5.5) con `effort: low` | en `low` lee mejor que Opus 5 en `max` con ~1/10 de los tokens; lotes masivos de imágenes siguen en agy |
| Auditoría o migración de un repo entero que dura horas | **subagente Claude opus** (5.5) con checklist en archivo y señal de tiempo | sostiene trabajo autónomo largo mejor que Opus 5 (ficha abajo) |
| Hermes | interactivo en N-Coterminal | ~90 s por respuesta, no delegable |

**Plugin oficial de OpenAI `codex@openai-codex` (instalado 2026-09-09, v1.0.6; Codex CLI 0.154.0).** Comandos: `/codex:rescue [--background|--wait] [--resume|--fresh] <contrato>` (Codex ESCRIBE en el repo actual, sin sandbox → usarlo dentro de un worktree, nunca sobre master), `/codex:review [--base rama]`, `/codex:adversarial-review <foco>` (segunda voz de otro modelo para diseños delicados), `/codex:status`, `/codex:result`, `/codex:cancel`, `/codex:transfer` (pasa esta sesión de Claude a un hilo de Codex CLI: `codex resume <id>`). Desde Bash, el mismo motor: `node "$CLAUDE_PLUGIN_ROOT/scripts/codex-companion.mjs" task --write -C <worktree> "<contrato>"` (probado 2026-09-09: tarea de 3 archivos + tests en 1 min 31, aprobada por revisión). Review gate del plugin SIEMPRE apagado (revisa cada turno con Codex y vacía la cuota de ChatGPT). Regla de los dos fallos: si Codex falla dos veces la misma tarea, vuelve a Claude. Modelo por defecto gpt-5.6-sol desde 2026-09-15 (config.toml de Codex; astra vaciaba la cuota en 2 lotes → reservarlo con `--model gpt-6-astra` para diagnósticos y revisión adversaria; gpt-5.4-mini ya no existe en el catálogo); exige CLI ≥ 0.154.

Reglas: (1) el contrato de 4 campos va textual en el prompt sea quien sea;
(2) agy nunca escribe; codex escribe solo en worktree; (3) lo que devuelven
agy/codex es texto o un diff — el director lo lee y lo revisa, nunca lo
fusiona a ciegas; (4) si la tarea necesita las skills de Nicolas, va a Claude.
Registro: cada delegación externa se anota (qué, a quién, tokens de Claude
que evitó) para medir el ahorro — pendiente de la lista general.

### Modelos de agy y Codex — el director los elige, sin preguntar (verificado 2026-09-22)

Igual que con `opus`/`sonnet`/`haiku`, cada delegación externa lleva modelo
explícito. Regla común: el modelo más barato que cumpla el contrato; subir
solo cuando falle.

**agy** (`agy models` lista 14; default **Gemini 3.8 Flash**; en modo print
`agy -p "..." --model <id>` funciona — probado: `gemini-3.8-flash-low`
respondió en 2,4 s con 0 tokens de pensamiento):

| id | para qué |
|---|---|
| `gemini-3.8-flash-low` | DEFAULT para talacha: leer/resumir muchos archivos, extracción con `--json-schema`, clasificar, verificar URLs, lotes de imágenes (`--add-dir`) |
| `gemini-3.8-flash-high` | segunda opinión rápida, resúmenes donde importa el criterio, capturas densas |
| `gemini-3.1-pro-high` (o `-low`) | opinión seria de OTRO modelo sobre un plan, un diseño o un diff grande; documentos largos con criterio |
| `gpt-oss-120b-medium` | tercera voz gratis de un modelo abierto; no para código serio |
| `claude-sonnet-4-6`, `claude-opus-4-6-thinking` | NO usar: son Claude 4.6 vía Google (viejos); gastan la cuota de Google sin ganar nada frente a los subagentes propios |
| `gemini-3.6-*`, `gemini-3.7-*` | generaciones anteriores; sin motivo para elegirlas |

**Codex** (catálogo en `~/.codex/models_cache.json`, CLI 0.154.0; default en
`~/.codex/config.toml` = `gpt-5.6-sol` con effort `medium`; se cambia por
tarea con `-m <slug>` en `codex exec` o `--model <slug>` en
`codex-companion.mjs task`; el effort del catálogo por defecto es `low` en
astra y sol, `medium` en terra y luna):

| slug | para qué |
|---|---|
| `gpt-5.6-luna` | rápido y barato: rondas de revisión, tests de una función, refactors mecánicos, redacción corta. Sustituye a `gpt-5.4-mini` (ya no existe). Candidato para la 5.ª tarea del día: PROBAR cuánta cuota gasta |
| `gpt-5.6-sol` | DEFAULT: lotes de código con contrato (caben ~4/día) |
| `gpt-5.6-terra` | equilibrado; alternativa si sol falla dos veces la misma tarea antes de devolverla a Claude |
| `gpt-6-astra` | el más capaz; solo revisión adversaria (`/codex:adversarial-review`) y diagnóstico difícil: vacía la cuota en 2 lotes |
| `gpt-5.5` | generación anterior; solo si un modelo nuevo regresa |
| `gpt-reserve`, `codex-auto-review` | ocultos/internos; no elegir |

Desde N-Coterminal: `node herramientas/delegar.cjs <agy|codex> "tarea"
--de=claude --modelo=<id>` pasa el modelo (agy `--model`, codex `-m`).
- Elección de modelo (alias de Claude Code; `opus` = **Opus 5.5** desde el
  2026-09-22 con Claude Code ≥ 2.1.280): opus = criterio abierto, texto para
  cliente, revisión de código, seguridad, debugging difícil, gráficas y
  capturas densas, auditorías o migraciones largas de un repo; sonnet =
  ejecución acotada, repetición, mantenimiento (default); haiku = búsquedas
  masivas y mecánica trivial. Effort SIEMPRE explícito con opus (su default
  es `medium`). Ficha completa de Opus 5.5 al final de esta skill.
- Por cada tarea, el contrato de 4 campos (ENTREGABLE, FORMATO, ACEPTACIÓN,
  PROHIBIDO) va dentro del prompt del agente, textual.
- **Quinto campo OBLIGATORIO cuando la tarea incluya acciones destructivas o
  irreversibles** (delete, `rm`, `push --force`, migraciones, borrado de
  memorias, envíos a terceros). Va textual en el prompt:

  > Si el clasificador de permisos te bloquea, DETENTE y reporta qué
  > intentabas hacer. NUNCA reintentes una acción denegada.

  Un bloqueo del clasificador NO es un error transitorio: es una decisión.
  Sin esta línea, un contrato del tipo "si algo falla, anótalo y sigue" hace
  que el agente clasifique la denegación como fallo y reintente hasta pasar.
  Ocurrió el 2026-08-31 con DOS subagentes a la vez en la poda del palacio:
  4 borrados irreversibles se colaron así. La forma correcta de superar una
  denegación es que Nicolas la autorice, no insistir.

## Fase 3 — Ejecutar

- **Pocas tareas (≤ ~6)**: Agent tool. Las independientes se lanzan EN PARALELO
  en el mismo turno. Tú no escribes código: si una tarea parece "rápida de hacer
  yo mismo", igual va a un subagente salvo que sea trivial (una línea).

### Cuándo NO paralelizar
El paralelo solo es más rápido si los dominios son de verdad independientes.
Antes de lanzar el turno con varios Agent a la vez, verifica las cuatro:

- ¿Los fallos son independientes, o arreglar uno podría arreglar los otros?
  Si sospechas causa compartida, va UN solo agente a investigarlos juntos.
- ¿Cada problema se entiende sin el contexto de los demás?
- ¿Tocan archivos distintos? Dos agentes editando el mismo archivo se pisan.
- ¿Ya sabes qué está roto? La exploración a ciegas no se reparte: se hace
  primero y después se reparte lo encontrado.

Si alguna respuesta es no, van en secuencia o en un solo agente.

Los cuatro errores del prompt repartido, cada uno cuesta una ronda entera:
alcance demasiado amplio ("arregla las pruebas"), sin contexto (pega los
mensajes de error y los nombres exactos), sin PROHIBIDO (el agente
refactoriza de más), y sin formato de salida (no sabes qué cambió).

- **Decenas de tareas** (migraciones, sweeps, revisión exhaustiva): herramienta
  Workflow con script determinista — `model` y `effort` por cada `agent()`
  según la tabla; anuncia el tamaño del fan-out (nº de agentes) antes de lanzar.
- Detén temprano al agente que va mal: dos minutos errados cuestan menos que un
  trabajo terminado errado.

### Investigación repartida (/investiga)

Para un tema que exige buscar y contrastar: 5 subagentes en paralelo, timebox explícito, una sola pasada por subagente — fuentes académicas/primarias, prensa de los últimos 12 meses, discurso en redes de los últimos 90 días, documentos primarios y datasets, y la vista contraria (los 3 críticos más fuertes y qué argumentan). Sonnet para la lectura de cada subagente; opus effort low para la síntesis final solo si el tema exige criterio. El director sintetiza con fuentes y fecha — nunca cierra el tema con lo que devuelve un solo subagente.

## La bitácora del director (sobrevive a la compactación)

Tu memoria de conversación NO sobrevive a un compact. El fallo más caro
observado es un director que perdió el hilo y volvió a repartir tareas que
ya estaban terminadas.

Abre un archivo de bitácora por trabajo (ej. `.orquesta/<plan>/bitacora.md`)
cuya PRIMERA línea nombre el documento que estás ejecutando, y escribe ahí,
no solo en los todos:

- `Tarea N: completa (commits <base7>..<head7>, veredicto PASA)`
- `Tarea N: ronda de arreglo R/3 (X resueltos, Y abiertos: <una línea c/u>)`
- `Decisión: <qué decidí> — <por qué> — <qué cuesta si me equivoco>`

Al reanudar: una tarea con línea "completa" NO se vuelve a repartir; se
retoma en la primera sin ella. Si la primera línea nombra otro documento, es
la bitácora de otro trabajo — déjala quieta y abre la tuya. Después de un
compact, la bitácora y `git log` mandan sobre tu recuerdo.

Y al cerrar: junta TODAS las líneas `Decisión:` en el informe final de la
Fase 5. Lo que decidiste en nombre de Nicolas solo le llega por ahí; una
decisión que muere con el archivo se tomó a escondidas.

## Fase 4 — El bucle de revisión

- ABRE cada archivo entregado y compáralo contra su contrato. Los resúmenes de
  los agentes NO son evidencia. Para entregables críticos, manda además al
  `revisor` (opus) como verificación independiente.

### El diff viaja como archivo, no por tu contexto
Tú diriges: revisar el diff tú mismo dentro de la sesión quema el contexto
que necesitas para seguir dirigiendo. Empaqueta y delega:

1. Fija el rango: `BASE=$(git rev-parse HEAD)` ANTES de lanzar al agente y
   `HEAD=$(git rev-parse HEAD)` al recibirlo. Nunca uses `HEAD~1`: si la
   tarea dejó varios commits, se pierden todos menos el último, en silencio.
2. Vuelca el paquete a un archivo (`git log --oneline`, `git diff --stat` y
   `git diff -U10` del rango, redirigidos a un archivo con nombre único) y
   pásale al revisor la RUTA. El diff nunca entra a tu contexto; solo
   vuelven los hallazgos.
3. El prompt del revisor lleva: qué se construyó, el contrato de 4 campos de
   la tarea, la ruta del paquete y las restricciones globales textuales.
4. Revisión de solo lectura: el revisor no mueve HEAD, no toca el índice y
   no despacha subagentes propios (un revisor que abre otro revisor duplica
   el asiento y su veredicto no vale).
5. Plantilla base para invocar a `revisor`: "Revisa los cambios de [rama/PR/archivos] como lo haría una persona con experiencia que tiene que aprobarlos." Opus 5.5 en `effort low` caza más errores que Opus 5 en `effort high` (72 % vs 56 % de errores conocidos, cifra del fabricante) — el `revisor` corre en `medium` desde 2026-09-23 (Fable sigue de director: decisión reconfirmada ese día con las guías de Opus 5.5).

Nunca le digas al revisor qué NO marcar. Si crees que un hallazgo será falso
positivo, deja que lo levante y adjudícalo tú: "no marques X" es prejuzgar
para ahorrarte una ronda.

- Veredicto por entregable: **PASA** o **NO PASA** con el punto concreto.
- Lo rechazado vuelve al MISMO agente con: criterio incumplido + hallazgo + qué
  cambiar exactamente.
- Dos fallos por el mismo motivo = el contrato está mal; corrígelo tú y reenvía.
- Gate entre fases (adoptado del Agents Orchestrator, 2026-08-20): una tarea de
  la que dependen otras NO habilita a sus dependientes hasta tener veredicto
  PASA — nunca construyas encima de un entregable sin revisar.
- Tope de reintentos: máximo 3 idas y vueltas por tarea. Al tope, DETENTE y
  escala a Nicolas con el diagnóstico (qué se intentó, por qué falla, opciones)
  en vez de quemar tokens en círculos.

## Fase 5 — Informe final

Un solo informe estilo nicolas-mode: resultado primero, tabla de tareas con
veredicto final, hallazgos relevantes, qué quedó pendiente y siguiente paso.
Actualiza Mempalace/bitácora según las reglas de nicolas-mode y prepara el
commit esperando autorización.

## Ficha Opus 5.5 — qué cambia en el reparto (investigado 2026-09-22)

Fuentes: anuncio de Anthropic, docs de la plataforma (overview, what's new,
guía de prompting de Opus 5.5), CHANGELOG de Claude Code 2.1.280, VentureBeat,
TechCrunch y el hilo de Hacker News del lanzamiento.

- **Qué es:** sucesor de Opus 5 en la línea Opus. API `claude-opus-5-5`,
  $4/$20 por MTok (Opus 5: $5/$25; Fable 5.1: $10/$50), cache read $0.20,
  1M de contexto, 128K de salida, corte de conocimiento junio 2026. Más de
  30 % más rápido que Opus 5 y termina la misma tarea con menos tokens
  (Anthropic: ~40 % menos costo por tarea típica).
- **En Claude Code:** desde 2.1.280 es el modelo del alias `opus` y el DEFAULT
  en Pro y Team; los perfiles de `~/.claude/agents/` con `model: opus` ya lo
  usan solos. Un `/effort` guardado antes NO se le aplica: arranca en `medium`
  hasta que tenga su propia entrada. Fable 5.1 sigue siendo el modelo principal
  de Nicolas (settings.json) y el director.
- **Benchmarks (Anthropic):** gana a Fable 5.1 en código agéntico
  (Terminal-Bench 4.0 66.4 vs 55.8; FrontierCode 54.4 vs 50.3; CursorBench
  57.8 vs 51.8), trabajo de conocimiento (GDPval-AA 1846 vs 1735 Elo),
  computer use (OSWorld 81.8 vs 80.7) y gráficas (Chartography 89.0 vs 88.4).
  Pierde con GPT-6 Astra en AutomationBench (40.0 vs 41.4) y en
  Terminal-Bench-Science (58.7 vs 64.6). HN: la crítica es al discurso de
  "pacing", no al modelo; "medium de 5.5 rinde como Opus 5 a 1/6 del costo".
- **En qué es bueno (para repartir):** (1) código agéntico multi-paso en un
  repo real hasta que pasan los tests, con menos pasos y ~la mitad de tokens;
  (2) revisión de código: más bugs y menos falsas alarmas que Opus 5 → el
  `revisor` gana; (3) trabajo de conocimiento: casi no inventa cifras ni
  fuentes, mejor en modelos financieros y en cazar detalles de entradas largas
  (fecha en el día de la semana equivocado, gráfica que no cuadra con la
  tabla); (4) gráficas, diagramas y capturas sin herramientas; (5) informes de
  trabajo agéntico más claros (qué hizo, qué encontró, qué necesita); (6)
  resiste mejor la inyección indirecta por resultados de herramientas y
  páginas web.
- **Effort:** default `medium` (Opus 5: `high`). `medium` de 5.5 iguala o
  supera `high` de Opus 5 en código y conocimiento; `low` se acerca en varios
  evals de código con mucho menos costo. A igual nivel piensa MÁS que Opus 5
  (sobre todo `xhigh`/`max`): un effort heredado da turnos más largos. Ponerlo
  SIEMPRE explícito en el `agent()` o en el frontmatter; bajar el effort antes
  que pedir "piensa menos" por prompt. Los perfiles propios siguen en
  `effort: high` (revisión y texto de cliente: calidad primero); para talacha
  con opus, `medium`.
- **Cambios que rompen (solo en API/SDK, no en los subagentes de Claude
  Code):** el thinking no se puede apagar; `tool_choice` `any`/`tool` da 400
  (usar `auto` + `strict: true` o structured outputs); los bloques de thinking
  quedan atados al modelo y a la conversación (historial append-only);
  computer use solo con `computer_toolset_20260801`. Nuevos clasificadores de
  biología y `reasoning_extraction`; ante refusal cae solo a Opus 5 (bio) o a
  Opus 4.8 (ciber). Fast mode $8/$40 solo en la API.
- **Contratos con Opus 5.5 (de la guía de prompting oficial):**
  - Trabajo largo sin supervisión: darle las partes en un checklist o archivo;
    si cierra el turno con ítems abiertos y sin bloqueo declarado, NO terminó →
    reenviar "tu lista aún tiene abiertos X e Y; continúa; si algo bloquea, di
    qué". Máximo 2–3 continuaciones automáticas, luego escalar.
  - Equipos de agentes: reacciona a señales de tiempo. Dar un presupuesto
    (`transcurrido 340s / 1200s`, algo por encima de lo que se quiere gastar)
    o la frase "Time matters here: do not spend time that can be avoided, and
    the earlier a correct result is obtained, the better." → termina antes con
    la misma calidad; menor effort reduce el trabajo, el presupuesto reparte.
  - Multi-app (correo, hojas, CRM): "Before taking any action, explore broadly
    with tool calls: list and open the ... that could be relevant, including
    ones the task does not explicitly mention, and use what you find."
  - Frontend sin dirección de arte: NO sirve "evita el look genérico de IA";
    nombrar los patrones concretos prohibidos (fondo crema, cursivas de
    acento, etiquetas 01/02/03, monospace, botones píldora). nc-design ya lo
    hace con sus locks y tells: mantenerlos textuales en el contrato.
  - Quitar de los prompts "piensa con cuidado antes de responder" (arranca más
    lento sin ganar calidad) y las reglas de sobre-verificación escritas para
    Opus 5; re-probar cada una en vez de heredarlas.
- **Cuando NO basta:** si en `high`/`xhigh` sigue pasando por alto una
  condición, un conflicto entre documentos o no resuelve un bug → Fable 5.1
  (el director) o `model: fable` como subagente puntual. Sonnet 5 sigue para
  lo acotado y repetitivo (cuota más barata en el plan).
- **Cuota del plan:** Anthropic no publica pesos por modelo. Medido por
  terceros: Opus consume ~5× más rápido que Sonnet a igual tarea y Fable tiene
  tope del 50 % semanal en Max. De 5.5 no hay dato propio todavía: medir con la
  statusline en las primeras sesiones antes de mover talacha de sonnet a opus.

---

Técnicas adaptadas de obra/superpowers (MIT, © 2025 Jesse Vincent) — https://github.com/obra/superpowers

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills

**Donde viven los worktrees:** SIEMPRE en `C:\Users\NICO-C\Desktop\nc-workspace\temporales\<repo>-<bloque>`, nunca al lado del repo. Dependencias con `npm ci` dentro del worktree (nunca junction a `node_modules`); al terminar, borrar la carpeta y `git -C <repo> worktree prune`. Regla completa en el CLAUDE.md de nc-workspace.
