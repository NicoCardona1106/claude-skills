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
  `mantenedor` (sonnet), `revisor` (opus), `redactor-cliente` (opus). Si ningún
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
- **Hermes NO es delegable** (medido 2026-08-24): su modo no interactivo
  (`hermes -z`) tardó 92.7s en responder "ok" — carga todo su stack Python
  por llamada. Usarlo solo interactivo (terminal del Panel Agéntico) o para
  sus propios agentes (whatsapp/gateway), nunca como motor de opinión.
- **Perfil externo `codex`** (OpenAI Codex CLI, verificado 2026-08-23,
  v0.149.0, modelo gpt-5.6-terra). LIMITANTE: Nicolas NO paga plan de OpenAI
  (solo la cuota gratis) — usarlo con moderación, para tercera opinión
  puntual, nunca para tareas masivas (esas van a agy, que sí tiene Google AI
  Pro). Cómo:
  `<prompt por stdin> | codex exec - --color never [-m modelo] [-C dir]
  [-s read-only] [--output-schema <ruta.json>] [-o <archivo_salida>]` —
  SÍ lee stdin (sin el límite de argumentos que sufre agy), `--json` emite
  eventos JSONL, `-o` escribe la respuesta final a archivo. Para revisión:
  `codex exec review` revisa el repo actual. Regla igual que agy en v1:
  usarlo con `-s read-only` — solo lee y opina; escribir requiere decisión
  aparte de Nicolas.
- Elección de modelo: opus = criterio abierto, texto para cliente, revisión,
  seguridad; sonnet = ejecución acotada, repetición, mantenimiento (default);
  haiku = búsquedas masivas y mecánica trivial.
- Por cada tarea, el contrato de 4 campos (ENTREGABLE, FORMATO, ACEPTACIÓN,
  PROHIBIDO) va dentro del prompt del agente, textual.

## Fase 3 — Ejecutar

- **Pocas tareas (≤ ~6)**: Agent tool. Las independientes se lanzan EN PARALELO
  en el mismo turno. Tú no escribes código: si una tarea parece "rápida de hacer
  yo mismo", igual va a un subagente salvo que sea trivial (una línea).
- **Decenas de tareas** (migraciones, sweeps, revisión exhaustiva): herramienta
  Workflow con script determinista — `model` y `effort` por cada `agent()`
  según la tabla; anuncia el tamaño del fan-out (nº de agentes) antes de lanzar.
- Detén temprano al agente que va mal: dos minutos errados cuestan menos que un
  trabajo terminado errado.

## Fase 4 — El bucle de revisión

- ABRE cada archivo entregado y compáralo contra su contrato. Los resúmenes de
  los agentes NO son evidencia. Para entregables críticos, manda además al
  `revisor` (opus) como verificación independiente.
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
