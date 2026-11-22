---
name: orquesta
description: "Orquestación multi-agente estilo director para Nicolas: documenta, contrata entregables, reparte trabajo entre subagentes (Sonnet/Opus/Haiku según la tarea) o lanza un Workflow, y revisa contra contrato. Usar cuando Nicolas diga /orquesta, 'orquesta esto', 'reparte este trabajo', 'usa workflow' o pida coordinar varias tareas o una semana de trabajo."
---

# /orquesta — El director reparte y revisa

**Regla de Nicolas (2026-09-24): el director SIEMPRE es Opus 5.5 o Fable.** Si la sesión corre en Sonnet o Haiku (lo dice la statusline y el hook `modelo-director.cjs` lo recuerda), no dirijas desde ahí: pide `/model opus` (o `/model fable`) antes de la Fase 2; si Nicolas no quiere cambiar, dirige por Workflow con `model: "opus"` en el agente que planifica y revisa, y deja a Sonnet solo ejecutando. Lo acotado y mecánico sigue en Sonnet o va a Codex.

**Fable como especialista (Nicolas, 2026-09-26).** La sesión en Opus 5.5 es director válido y rinde más la cuota; Fable 5.1 entra como SUBAGENTE (`model: "fable"`) solo donde el criterio pesa de verdad: arquitectura o diseño de un módulo nuevo, decisiones ambiguas con varias salidas razonables, y bugs complejos en los que Opus ya falló una vez. La revisión de código sigue en `revisor` (opus): Opus 5.5 caza más errores con menos falsos positivos. Delegar todo lo que pase de unas pocas líneas o lecturas; lo trivial (una línea en SEMANA.md, un dato puntual) lo hace el director. Revisar cada entrega contra su contrato: abrir los archivos entregados y la evidencia que cita el informe; el resumen del subagente solo orienta la revisión.

**Puntos fijos de Fable (Nicolas, 2026-10-16: en dos meses la cuota de Fable quedó en 0 porque «solo donde pesa» nunca se disparaba).** Sin preguntar, cada uno lleva un subagente `model: "fable"` de solo lectura:
1. **Todo SRS o blueprint antes de mandárselo a Nicolas:** revisión de arquitectura con veredicto, hallazgos y máximo 5 preguntas para él.
2. **Todo modelo de dinero o de permisos** (cálculos, saldos, cobros, reparto, quién puede qué): revisión adversarial de la lógica ANTES de escribir el contrato de construcción.
3. **Segunda caída:** cuando Codex falla dos veces la misma tarea o el `revisor` da NO PASA dos veces por el mismo motivo, Fable diagnostica antes de reescribir el contrato.
4. Fable no reemplaza al `revisor` (opus) en la revisión de diffs. Para dinero, seguridad y permisos el diff lleva además segundo revisor de otro modelo (ver «Doble revisión»).

**Vigilar a Codex y agy (se caen o nunca arrancan):** cada lanzamiento queda con un Monitor `bash herramientas/vigilar-delegado.sh <log> <codex.exe|agy.exe> [min]` (avisa NO ARRANCA, QUIETO o TERMINÓ). Si avisa NO ARRANCA o QUIETO dos veces, se corta y la tarea pasa a la siguiente opción de la tabla. **Dentro de una pty de NCT2** (hay `NCT_*` en el entorno; D-H5, 17-nov) se espera por evento en vez de vigilar procesos: `delegar.cjs <cli> "<tarea>" --de=claude --id=<uuid>` y, en otra llamada, `node nct2/herramientas/esperar-nct.cjs --delegacion <uuid>` (sale 0 ok · 1 fallo · 2 te espera · 3 plazo · 4 no existe · 5 sesión cerrada).

Principio: **no construyas, reparte y revisa.** Tú (Fable u Opus 5.5) eres el director:
documentas, contratas, repartes, supervisas y revisas. El código y los
entregables los producen los subagentes. Esta skill ES la autorización explícita
de Nicolas para usar la herramienta Workflow cuando la escala lo amerite.

Aplica también las reglas de `nicolas-mode` (sección ORQUESTACIÓN Y SUBAGENTES).

## El router no ejecuta

Quien reparte —el director, o cualquier agente/skill que solo clasifica y reenvía— mantiene su instrucción delgada: una dispatch table de menos de 40 líneas, sin lógica de negocio adentro. Si duda entre dos destinos, elige el de la tabla de reparto y anota la decisión en la bitácora. Las tareas compuestas ("revisa esto y avísame de aquello") se parten en turnos, un destino por turno.

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
- Si viene de `fable-plan` con `<proyecto>-tasks.json`, ese es el documento.
  Cada tarea pasa al contrato así: ENTREGABLE = `title` + `files`;
  ACEPTACIÓN = `acceptance` + los comandos de `verify` (pasa solo si todos
  salen 0); PROHIBIDO = los `files` de las otras tareas + las reglas
  globales. Se reparte la primera lista en el orden del arreglo, sin
  reordenar; en paralelo solo las que no cruzan `files`. Al anotar
  «completa» en la bitácora, `status: "done"` en el JSON.

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
- **Hermes** (~90 s por respuesta: qwen local vía Ollama, gratis pero lento)
  no entra en el reparto automático; se usa interactivo en N-Coterminal, para
  sus agentes, o cuando Nicolas diga «delega a hermes».
- **Perfil externo `codex`** (OpenAI Codex CLI, verificado 2026-08-23,
  default gpt-6.1-sol desde 2026-10-07; tabla de modelos más abajo). Desde 2026-09-06 Nicolas PAGA el plan de OpenAI (~81.000 COP/mes): codex
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
| Leer o resumir muchos archivos, un repo entero, un PDF largo, un video | **agy**, partido en tareas cortas (en una lectura larga de una sola vez devuelve vacío); si no se puede partir, subagente `haiku` | ventana enorme, gratis con Google AI Pro; embebe el contexto en el prompt |
| Dato actual (precio, versión, noticia) con búsqueda | **agy** | busca en tiempo real; la versión que se fija en un blueprint o manifest se lee del registro (`fable-plan`, Fase 4) |
| Investigación web, de GitHub o de documentación | **agy** SIEMPRE (`delegar.cjs agy`) | Codex NO tiene red en su sandbox (gh/curl fallan por proxy 127.0.0.1:9, comprobado 2026-11-22); Codex solo trabaja con archivos locales |
| Segunda opinión de OTRO modelo sobre un diff o un plan | **agy** (rápida) o **codex** (a fondo) | evita el sesgo del mismo modelo |
| Código acotado con contrato (endpoint, script, refactor pequeño, tests) | **codex** en worktree | plan pago, escribe bien código; libera plan de Claude |
| Talacha mecánica que antes iba a `implementador` (sonnet): refactor guiado, tests de una función, mover código sin criterio nuevo | **plugin Codex** `/codex:rescue --background` en worktree | corre en la cuota de ChatGPT, no en la de Claude; hilo reanudable con `--resume`; el diff lo revisa `revisor` igual que siempre |
| Redacción técnica acotada (README, doc, guía) | **codex** | redacta bien; salida por `-o` |
| Arquitectura de un módulo nuevo, decisión ambigua con varias salidas, bug complejo en el que Opus ya falló | **subagente Claude fable** (`model: "fable"`) | el criterio más fino; se paga caro, así que solo aquí (regla 2026-09-26) |
| Pieza que exige criterio, arquitectura, seguridad, texto que ve un cliente | **subagente Claude opus** | contexto y doctrina de Nicolas |
| Ejecución con muchas reglas propias (nc-design, nicolas-mode, skills) | **subagente Claude sonnet** | codex y agy no cargan las skills |
| Revisión final contra contrato | **revisor (opus)** | siempre Claude: es quien conoce el contrato; Opus 5.5 caza más bugs con menos falsos positivos que Opus 5 |
| Leer gráficas, diagramas o capturas densas (valores, qué conecta una flecha, qué cambió entre dos versiones) | **subagente Claude opus** (5.5) con `effort: low` | en `low` lee mejor que Opus 5 en `max` con ~1/10 de los tokens; lotes masivos de imágenes siguen en agy |
| Auditoría o migración de un repo entero que dura horas | **subagente Claude opus** (5.5) con checklist en archivo y señal de tiempo | sostiene trabajo autónomo largo mejor que Opus 5 (ficha abajo) |
| Hermes | interactivo en N-Coterminal | ~90 s por respuesta, no delegable |

**Hook `reparto-codex.cjs` y la marca `SIN-CODEX` (2026-11-22).** El hook NIEGA lanzar subagentes que construyen (`implementador`, `mantenedor`, `general-purpose`, `portador`) salvo que el prompt lleve `SIN-CODEX: <motivo>`. Motivos válidos: pieza que exige criterio, dinero o seguridad, texto de cliente, Flutter en Windows, redacción o edición de skills y agentes. «Es más rápido en Claude» o «sobra cuota» NO son motivo. Lo mecánico con contrato sigue yendo a Codex (solo archivos locales; la investigación con red va a agy).

**Doble revisión de modelos distintos (dinero, seguridad, permisos; idea `santa-loop` de ECC, MIT).** Además del punto fijo 2 de Fable (modelo, antes de construir), el DIFF de esas áreas lo revisan dos modelos distintos y deben PASAR los dos: `revisor` (Claude) y un segundo revisor de otro modelo, Codex `gpt-6-astra` en modo adversarial sobre archivos locales (`/codex:adversarial-review`) o, si ya está en los puntos fijos de esa tarea, Fable de solo lectura. Si uno da NO PASA, vuelve al constructor; el desacuerdo entre los dos lo adjudica el director, nunca se promedia.

**Nota fechada (2026-11-22):** Codex tiene reinicios de cuota gratis que vencen entre el 30-nov y el 5-dic-2026; esa semana priorizar lotes mecánicos a Codex (sin saltarse worktree ni revisión).

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

**Codex** (catálogo en `~/.codex/models_cache.json`, CLI 0.161.0, revisado 2026-10-07; default en
`~/.codex/config.toml` = `gpt-6.1-sol` con effort `medium`; se cambia por
tarea con `-m <slug>` en `codex exec` o `--model <slug>` en
`codex-companion.mjs task`; el effort del catálogo por defecto es `low` en
astra y 6.1-sol, `medium` en 6-sol y luna):

| slug | para qué |
|---|---|
| `gpt-6-luna` | rápido y barato (Plus: ~350-3.000 mensajes/5 h): rondas de revisión, tests de una función, refactors mecánicos, redacción corta, talacha como bumps de dependencias |
| `gpt-6.1-sol` | DEFAULT: lotes de código con contrato (Plus: ~15-160 mensajes/5 h) |
| `gpt-6-sol` | alternativa si 6.1-sol falla dos veces la misma tarea antes de devolverla a Claude |
| `gpt-6-astra` | el más capaz; solo revisión adversaria (`/codex:adversarial-review`) y diagnóstico difícil: vacía la cuota en 2 lotes |
| `gpt-5.6-sol/terra/luna` | generación anterior, aún en el catálogo; solo si un modelo 6.x regresa |
| `gpt-5.5` | oculto; sale de Codex con ChatGPT el 2026-10-14: no usar |
| `gpt-reserve`, `codex-auto-review` | ocultos/internos; no elegir |

Desde N-Coterminal: `node herramientas/delegar.cjs <agy|codex> "tarea"
--de=claude --modelo=<id>` pasa el modelo (agy `--model`, codex `-m`).
- Elección de modelo (alias de Claude Code; `opus` = **Opus 5.5** desde el
  2026-09-22 con Claude Code ≥ 2.1.280): opus = criterio abierto, texto para
  cliente, revisión de código, seguridad, debugging difícil, gráficas y
  capturas densas, auditorías o migraciones largas de un repo; sonnet =
  ejecución acotada, repetición, mantenimiento (default); haiku = búsquedas
  masivas y mecánica trivial; fable = especialista puntual (arquitectura, ambigüedad, bug donde opus falló). Effort SIEMPRE explícito con opus (su default
  es `medium`). Ficha completa de Opus 5.5 al final de esta skill.
- Por cada tarea, el contrato de 4 campos (ENTREGABLE, FORMATO, ACEPTACIÓN,
  PROHIBIDO) va dentro del prompt del agente, textual. Con código, ACEPTACIÓN
  lleva al menos un comando que sale 0 cuando la tarea está bien y un caso de error o
  borde; lo que solo juzga un humano (aspecto, tono) va aparte como revisión
  del director o de Nicolas, no como criterio que el agente se autocertifica.
- **Quinto campo OBLIGATORIO cuando la tarea incluya acciones destructivas o
  irreversibles** (delete, `rm`, `push --force`, migraciones, borrado de
  memorias, envíos a terceros). Va textual en el prompt:

  > Si el clasificador de permisos te bloquea, DETENTE y reporta qué
  > intentabas hacer. NUNCA reintentes una acción denegada.

  Un bloqueo del clasificador NO es un error transitorio: es una decisión.
  Sin esta línea, un contrato del tipo "si algo falla, anótalo y sigue" hace
  que el agente clasifique la denegación como fallo y reintente hasta pasar.
  La forma correcta de superar una
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
alcance demasiado amplio ("arregla las pruebas"; se parte con la regla de
tamaño de `fable-plan`), sin contexto (pega los
mensajes de error y los nombres exactos), sin PROHIBIDO (el agente
refactoriza de más), y sin formato de salida (no sabes qué cambió).

- **Decenas de tareas** (migraciones, sweeps, revisión exhaustiva): herramienta
  Workflow con script determinista — `model` y `effort` por cada `agent()`
  según la tabla; anuncia el tamaño del fan-out (nº de agentes) antes de lanzar.
- Detén temprano al agente que va mal: dos minutos errados cuestan menos que un
  trabajo terminado errado.
- **Varias salidas buenas** (diseño, modelo de datos, algoritmo con
  compromisos): skill `comparar-n` — el mismo contrato a 2-3 implementadores
  en worktrees de `temporales/` y el revisor elige. Cuesta N veces la cuota.

### Servidores locales: se cierran por su PID

Todo servidor que arranque el director o un subagente (`python -m
http.server`, `npx serve`, `next dev`) va en segundo plano con su PID
anotado y se cierra SOLO por ese PID (`kill <PID>` / `Stop-Process -Id
<PID>`). NUNCA `taskkill /IM python.exe`, `Stop-Process -Name python`,
`taskkill /IM node.exe` ni equivalentes por nombre: matan Mempalace
(servidor MCP en Python), el gateway de Hermes y las sesiones de Node
(incidente real del 2026-10-17). Si el puerto está ocupado, se usa otro.
Esta regla va textual en el PROHIBIDO de todo contrato que sirva páginas.

### Ningún subagente termina esperando a su propio proceso (2026-11-04)

Un subagente que deja `next dev`, `supabase start` o cualquier servidor como tarea en
segundo plano del harness se queda «esperando su propio trabajo» y NUNCA entrega el
informe; al detenerlo se cae el servidor (pasó 3 veces con PO-1 el 4-nov). Reglas:
1. El servidor que deba quedar levantado para otra etapa (auditoría, verificación) lo
   arranca EL DIRECTOR con un script en el scratchpad (`run_in_background`), no el subagente.
2. Si el subagente necesita un servidor para probar, lo arranca, prueba y lo APAGA por su
   PID antes de entregar. Nunca termina con tareas en segundo plano vivas.
3. Si no hay informe pero el aviso dice «waiting on its own background work»: el director
   no espera más; verifica el worktree él mismo, detiene al agente y relanza el servidor.
Esta regla va textual en el PROHIBIDO de todo contrato que pruebe en navegador o con base local.

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
5. Plantilla base para invocar a `revisor`: "Revisa los cambios de [rama/PR/archivos] como lo haría una persona con experiencia que tiene que aprobarlos." Opus 5.5 en `effort low` caza más errores que Opus 5 en `effort high` (72 % vs 56 % de errores conocidos, cifra del fabricante) — el `revisor` corre en `medium`.

Nunca le digas al revisor qué NO marcar. Si crees que un hallazgo será falso
positivo, deja que lo levante y adjudícalo tú: "no marques X" es prejuzgar
para ahorrarte una ronda.

- Veredicto por entregable: **PASA** o **NO PASA** con el punto concreto.
- Gate entre fases (adoptado del Agents Orchestrator, 2026-08-20): una tarea de
  la que dependen otras NO habilita a sus dependientes hasta tener veredicto
  PASA — nunca construyas encima de un entregable sin revisar.

### Ciclo constructor-revisor (tope de 3 vueltas)

Toda tarea con código o UI corre en ciclo: el constructor entrega con
evidencia (pruebas, `next build`, capturas de Playwright si hay UI), el
`revisor` da PASA o NO PASA, y lo rechazado vuelve al MISMO constructor.
Una vuelta = una entrega + su veredicto; cada una se anota en la bitácora
(`Tarea N: vuelta R/3 (X resueltos, Y abiertos: <una línea c/u>)`).

- **Vuelta 1 NO PASA:** vuelve al mismo agente con criterio incumplido +
  hallazgo + qué cambiar exactamente.
- **Vuelta 2 NO PASA por el mismo motivo:** el problema es el contrato, no el
  detalle. Fable diagnostica (punto fijo 3) y el director corrige el contrato
  antes de la vuelta 3. Si el constructor era Codex, ya son sus dos fallos
  (regla del CLAUDE.md): la vuelta 3 la hace Claude.
- **Vuelta 3 sin PASA:** se para; nunca hay cuarta vuelta automática. La
  tarea vuelve al director con un resumen de por qué no converge:
  ```
  Tarea N — no converge tras 3 vueltas
  Pedido: <criterio de aceptación que no se cumple>
  Vueltas: 1) <entrega → hallazgo>  2) …  3) …
  Patrón: <el hallazgo que se repite, o el que cambia cada vez>
  Por qué no converge: <contrato ambiguo | tarea muy grande | requisito imposible | modelo corto>
  Opciones: <partir la tarea | reescribir el contrato | otro modelo | decide Nicolas>
  ```
  El director elige la opción; si cambia alcance, dinero o lo que ve un
  cliente, escala a Nicolas con ese mismo resumen.

## Fase 5 — Informe final

Un solo informe estilo nicolas-mode: resultado primero, tabla de tareas con
veredicto final, hallazgos relevantes, qué quedó pendiente y siguiente paso.
Actualiza Mempalace/bitácora según las reglas de nicolas-mode y prepara el
commit esperando autorización.

## Opus 5.5 en el reparto

- **Effort explícito** en cada `agent()` o en el frontmatter; bajar el effort
  antes que pedir "piensa menos" por prompt. Perfiles propios:
  `redactor-cliente`, `disenador-landing` y `auditor-tells` en `effort: high`;
  `revisor` y la talacha con opus, en `medium`.
- **Cuando no basta:** si en `high`/`xhigh` sigue pasando por alto una
  condición, un conflicto entre documentos o no resuelve un bug → `model: fable`
  como subagente puntual. `sonnet` sigue para lo acotado y repetitivo.
- Benchmarks, precios, cambios de API y contratos de prompting: `ficha-opus-5-5.md`
  (leerla al decidir el reparto con un modelo nuevo).

---

Patrones adaptados de the-architect (Hainrixz, MIT) — https://github.com/Hainrixz/the-architect

Técnicas adaptadas de obra/superpowers (MIT, © 2025 Jesse Vincent) — https://github.com/obra/superpowers

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills

**Donde viven los worktrees:** SIEMPRE en `C:\Users\NICO-C\Desktop\nc-workspace\temporales\<repo>-<bloque>`, nunca al lado del repo. Dependencias con `npm ci` dentro del worktree (nunca junction a `node_modules`); al terminar, borrar la carpeta y `git -C <repo> worktree prune`. Regla completa en el CLAUDE.md de nc-workspace.
