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
  NO lee stdin en modo print (el prompt viaja como argumento → tope ~25k chars
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
  v0.149.0, modelo gpt-5.6-terra). Desde 2026-09-06 Nicolas PAGA el plan de OpenAI (~81.000 COP/mes): codex
  ya no es "con moderación" — vale para tercera opinión, revisión cruzada de
  diffs y tareas de código/redacción acotadas; lo masivo de solo-lectura sigue
  yendo a agy (Google AI Pro, ventana enorme). Cómo:
  `<prompt por stdin> | codex exec - --color never [-m modelo] [-C dir]
  [-s read-only] [--output-schema <ruta.json>] [-o <archivo_salida>]` —
  SÍ lee stdin (sin el límite de argumentos que sufre agy), `--json` emite
  eventos JSONL, `-o` escribe la respuesta final a archivo. Para revisión:
  `codex exec review` revisa el repo actual. Desde 2026-09-06 codex SÍ
  puede ESCRIBIR, pero solo en un worktree aislado (skill
  `using-git-worktrees`): `codex exec - -C <worktree> -s workspace-write
  --approve-for-me --color never -o <salida.md>` (flags verificados en
  codex-cli 0.150.1; `--approve-for-me` resuelve las aprobaciones dentro del
  sandbox de escritura). Nunca sobre master ni fuera del worktree; el diff
  pasa por `revisor` (o por el director) antes de fusionar, igual que un
  implementador de Claude. Para opinar sin tocar nada sigue `-s read-only`.

### Reparto natural entre Claude, agy y codex (decidir solo, sin preguntar)

| Tarea | Va a | Por qué |
|---|---|---|
| Leer o resumir muchos archivos, un repo entero, un PDF largo, un video | **agy** | ventana enorme, gratis con Google AI Pro; embebe el contexto en el prompt |
| Dato actual (precio, versión, noticia) con búsqueda | **agy** | busca en tiempo real |
| Segunda opinión de OTRO modelo sobre un diff o un plan | **agy** (rápida) o **codex** (a fondo) | evita el sesgo del mismo modelo |
| Código acotado con contrato (endpoint, script, refactor pequeño, tests) | **codex** en worktree | plan pago, escribe bien código; libera plan de Claude |
| Redacción técnica acotada (README, doc, guía) | **codex** | redacta bien; salida por `-o` |
| Pieza que exige criterio, arquitectura, seguridad, texto que ve un cliente | **subagente Claude opus** | contexto y doctrina de Nicolas |
| Ejecución con muchas reglas propias (nc-design, nicolas-mode, skills) | **subagente Claude sonnet** | codex y agy no cargan las skills |
| Revisión final contra contrato | **revisor (opus)** | siempre Claude: es quien conoce el contrato |
| Hermes | interactivo en N-Coterminal | ~90 s por respuesta, no delegable |

Reglas: (1) el contrato de 4 campos va textual en el prompt sea quien sea;
(2) agy nunca escribe; codex escribe solo en worktree; (3) lo que devuelven
agy/codex es texto o un diff — el director lo lee y lo revisa, nunca lo
fusiona a ciegas; (4) si la tarea necesita las skills de Nicolas, va a Claude.
Registro: cada delegación externa se anota (qué, a quién, tokens de Claude
que evitó) para medir el ahorro — pendiente de la lista general.
- Elección de modelo: opus = criterio abierto, texto para cliente, revisión,
  seguridad; sonnet = ejecución acotada, repetición, mantenimiento (default);
  haiku = búsquedas masivas y mecánica trivial.
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

---

Técnicas adaptadas de obra/superpowers (MIT, © 2025 Jesse Vincent) — https://github.com/obra/superpowers

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
