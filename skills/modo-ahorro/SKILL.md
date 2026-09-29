---
name: modo-ahorro
description: "Modo de trabajo con contexto/plan de Claude limitado (viajes, poco plan restante). Usar cuando Nicolas diga 'modo ahorro', 'tengo poco plan', 'queda poco contexto' o /modo-ahorro; nicolas-mode lo OFRECE (no lo activa solo) cuando el tee de la statusline muestre five_hour.used_percentage > 70. Estima el gasto de cada tarea antes de empezar, recorta lecturas y verificación de forma visible (❌ anotado, nunca oculta) y cierra la sesión antes de agotar el plan. No aplica a 'poco tiempo' ni a ahorrar dinero: solo al plan y contexto de Claude."
---

# Modo ahorro — trabajar con plan de Claude limitado

Modo temporal sobre nicolas-mode para cuando el plan de Claude es limitado; no lo reemplaza.

## Cuándo entra y cuándo sale

Entra cuando: Nicolas lo pide explícitamente ("modo ahorro", "tengo poco
plan", "queda poco contexto", `/modo-ahorro`), o cuando nicolas-mode ve
`five_hour.used_percentage > 70` en el tee de la statusline y lo **ofrece**
(nunca lo activa solo — es Nicolas quien decide entrar).

Sale cuando: Nicolas lo dice explícitamente ("modo normal", "ya tengo plan"),
o al cerrar la sesión con el cierre anticipado de abajo. No se reactiva solo
en la siguiente sesión.

## Al arrancar

1. **Leer el presupuesto**: el modelo no ve su propia barra de estado —
   leerlo del tee que escribe la statusline (skill `statusline`):
   `cat ~/.claude/panel-status/<session_id>.json` → `rate_limits.five_hour
   .used_percentage` y `rate_limits.seven_day.used_percentage` (son % **usado**,
   no restante). Si Nicolas dice el número de la barra, es ese mismo dato. Si
   el JSON no tiene `rate_limits`, pedírselo a Nicolas.
2. **Estimar el % que se llevará cada tarea ANTES de empezarla** y decirlo.
   Heurística de gasto (de más barato a más caro):
   - `grep`/`sed -n` sobre archivos puntuales → barato.
   - Leer un archivo completo grande, o varios → medio.
   - Capturas de Playwright y salidas largas de comandos sin filtrar → caro
     (una captura ≈ mucho más contexto que un `grep`).
3. **Priorizar lo que deja valor aunque se corte la sesión**: la tarea que,
   si el plan se agota a la mitad, deja algo usable — no la que solo tiene
   sentido completa.
4. **Decir el plan de gasto en 3 líneas** antes de arrancar, ej.:
   - "Plan 5h al 66% usado (queda 34%) / semana al 39% usado."
   - "Esta tarea: ~8% — 2 lecturas puntuales con grep, sin Playwright."
   - "Prioridad: dejar el fix funcionando antes que la verificación visual."

## Mientras se trabaja

- **Agrupar comandos en un solo Bash** en vez de varias llamadas sueltas:
  `cat a.js; grep -n "foo" b.js; git status` en una sola invocación, no tres.
- **Leer con `grep`/`sed -n` en vez de archivos enteros**: `grep -n "useEffect" componente.tsx` o `sed -n '1,40p' archivo.md` antes de un `Read`
  completo de un archivo de cientos de líneas.
- **No releer lo ya leído** en la misma sesión — si el contenido está en el
  historial de la conversación, usarlo de ahí.
- **Delegar lecturas masivas a haiku o a `agy`** (Antigravity, gratis con
  Google AI Pro): "delega a agy: lee estos 12 archivos de config y resume
  las rutas que usan env vars". Opiniones baratas (segunda mirada rápida,
  sanity check) también a `agy`.
- **Gráficas, capturas o diagramas puntuales → subagente `opus` (Opus 5.5)
  con `effort: low`**: lee valores y flechas mejor que Opus 5 en `max` con
  ~1/10 de los tokens y no mete imágenes en el contexto del director. Lotes
  grandes de imágenes siguen en `agy`.
- **Modelo explícito en cada delegación externa** (tabla en `orquesta`):
  agy `--model gemini-3.8-flash-low` para talacha y `gemini-3.1-pro-high`
  solo para opinar con criterio; Codex `gpt-5.6-luna` para rondas y tests,
  `gpt-5.6-sol` (default) para lotes, `gpt-6-astra` solo revisión adversaria.
- **Delegar a `codex` lo acotado** con el plugin (`/codex:rescue` en worktree, cuota de ChatGPT, no de Claude; ver skill orquesta) o por stdin (plan pago desde 2026-09-06: código y
  redacción puntual) y **nunca a
  `hermes`** (~90s por respuesta, modelo local vía Ollama) mientras el plan
  esté bajo — son más caros en tiempo o cuota ajena, no en plan propio, pero
  no resuelven el problema de plan de Claude.

## Lo que NO se recorta

- **Validación en fronteras** (inputs de usuario, datos externos, parseo) y
  **seguridad** — el modo ahorro recorta contexto leído, nunca robustez del
  código entregado.
- **La tabla DoD honesta**: si algo no se verificó, se anota como ❌ con el
  motivo — nunca se oculta ni se marca ✅ por optimismo. Ejemplo de fila:

  | Criterio | Estado |
  |----------|--------|
  | Verificación visual en navegador | ❌ no verificado por modo ahorro (sin captura Playwright para ahorrar contexto) |

  Esta es la misma lección de nicolas-mode ("Documentación obligatoria"): los
  ❌ se muestran, nunca se ocultan. La tabla DoD **se entrega siempre**, aunque
  toda la verificación se haya saltado por modo ahorro.
- **Memoria del proyecto**: si hubo una decisión o corrección real, se
  actualiza igual — es barato (unas líneas) y evita repetir el error la
  próxima sesión, con o sin plan.

## Puente a Codex y agy (guardia de cuota, 2026-09-09)

El hook `~/.claude/hooks/cuota-guardia.cjs` (UserPromptSubmit, registrado en settings.json)
lee el tee de la statusline en cada mensaje de Nicolas y, según lo que QUEDA del plan:

| Queda | Qué inyecta | Qué hace Claude |
|---|---|---|
| ≤ 20 % (5 h o semana) | aviso | Ofrecer modo ahorro y delegar lo mecánico a Codex (`/codex:rescue` en worktree) o lecturas a agy. Nicolas decide. |
| ≤ 20 % de Fable (semana) | director alterno | Dirigir desde una sesión `/model opus` (Opus 5.5) y no usar Fable como subagente hasta que se reinicie su cuota; lo que exige criterio sigue en Claude, no pasa a Codex. Mantener un PENDIENTES.md con lo abierto. |
| ≤ 6 % | puente | NO arrancar trabajo nuevo. Resumir estado en 3 líneas, dejar memoria y commit preparados, y proponer: `/codex:transfer` (seguir esta misma sesión en Codex CLI) o `/codex:rescue --background` con contrato para la tarea concreta, o agy para lecturas. Si Nicolas acepta, ejecutar el traspaso y detenerse. |

Umbrales editables al inicio del hook (`PUENTE`, `AVISO`). El hook nunca bloquea el prompt: solo añade contexto. Sin datos de cuota, calla.

## Cierre anticipado

Cerrar ANTES de agotar el plan, en este orden:

1. Actualizar la memoria del proyecto (Mempalace o el archivo de memoria que
   use el proyecto) con lo decidido/corregido en la sesión.
2. Ofrecer `/cosecha` si hubo correcciones, decisiones o errores resueltos
   (regla de cierre de sesión de nicolas-mode).
3. Dejar el commit preparado (resumen + archivos) y pedir autorización —
   nunca pushear sin que Nicolas lo confirme, ni siquiera con poco plan.

## Umbrales y avisos

| Umbral (plan 5h usado) | Qué se recorta | Qué se avisa |
|---|---|---|
| `used_percentage` > 70% | Capturas de Playwright solo si son imprescindibles (no para chequeos rutinarios); lecturas completas se cambian por `grep`/`sed -n`. | "Plan 5h al [X]% usado, ya en modo ahorro: recortando capturas y lecturas completas." |
| `used_percentage` > 80% | Se prioriza dejar UNA cosa terminada y verificada por texto (build/lint) sobre avanzar varias a medias; verificación visual se marca ❌ pendiente salvo que Nicolas insista. | "Plan 5h al [X]% usado: voy a cerrar [tarea] y dejar memoria + commit listos antes de seguir." |
| `used_percentage` > 90% | Solo cierre: memoria, `/cosecha` si aplica, commit preparado. No se arrancan tareas nuevas. | "Plan 5h al [X]% usado: cerrando sesión — memoria actualizada, commit preparado, pendiente tu autorización." |

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
