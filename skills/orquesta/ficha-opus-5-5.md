# Ficha Opus 5.5 — qué cambia en el reparto (investigado 2026-09-22)

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
  hasta que tenga su propia entrada. Director: la sesión principal (Opus 5.5 o
  Fable); Fable 5.1 como subagente solo en los casos de la tabla de reparto.
- **Benchmarks (Anthropic):** gana a Fable 5.1 en código agéntico
  (Terminal-Bench 4.0 66.4 vs 55.8; FrontierCode 54.4 vs 50.3; CursorBench
  57.8 vs 51.8), trabajo de conocimiento (GDPval-AA 1846 vs 1735 Elo),
  computer use (OSWorld 81.8 vs 80.7) y gráficas (Chartography 89.0 vs 88.4).
  Contra Opus 5 (verificado en tododeia 2026-09-28): Terminal-Bench 66.4 vs
  52.3, FrontierCode 54.4 vs 48.0, CursorBench 57.8 vs 46.6, GDPval 1846 vs
  1708, OSWorld 81.8 vs 74.0, Chartography 89.0 vs 83.4.
- **Tips de uso:** Ctrl+O en Claude Code muestra el razonamiento (gris, en
  cursiva) para auditar por qué decidió algo. Para leer gráficas o capturas,
  pasar la imagen en la mejor resolución disponible y recortada a lo que
  importa, no la pantalla entera.
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
  que pedir "piensa menos" por prompt. Perfiles propios: `redactor-cliente`,
  `disenador-landing` y `auditor-tells` en `effort: high`; `revisor` y la
  talacha con opus, en `medium`.
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
  condición, un conflicto entre documentos o no resuelve un bug → `model: fable`
  como subagente puntual. `sonnet` sigue para lo acotado y repetitivo (cuota
  más barata en el plan).
- **Cuota del plan:** Anthropic no publica pesos por modelo. Medido por
  terceros: Opus consume ~5× más rápido que Sonnet a igual tarea y Fable tiene
  tope del 50 % semanal en Max. De 5.5 no hay dato propio todavía: medir con la
  statusline en las primeras sesiones antes de mover talacha de sonnet a opus.
