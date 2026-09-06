---
name: statusline
description: "Instala o reconstruye la barra de estado de Claude Code, Antigravity (agy) y Codex a partir de los scripts versionados en el repo N-Coterminal (ideas/panel-agentico/statuslines). Usar cuando Nicolas configure un equipo nuevo, la barra aparezca vacía o rota, haya perdido el tee que lee N-Coterminal, o diga 'instala la statusline', 'arregla la barra de estado', 'pon la barra en este PC'."
---

# statusline — instalar y reconstruir las barras de estado

Fuente de verdad: `Desktop\Claude Code\ideas\panel-agentico\statuslines\` (README.md
+ un script/config por CLI). Esta skill copia esos archivos a su destino real;
no reinventa el contenido de los scripts.

## Cuándo

- Equipo nuevo (PC principal recién formateado, portátil de viaje).
- La barra aparece vacía, con colores rotos, o volvió a mostrar costo en USD
  (Nicolas prefiere plan 5h / semana / por modelo, nunca dólares).
- N-Coterminal dejó de leer cuota o contexto (el tee de Claude se rompió).
- Frases: "instala la statusline", "arregla la barra de estado", "configura
  la barra en este PC".

## Qué barra tiene cada CLI

| CLI | Archivo en el repo | Destino en el usuario | Cómo se registra |
|---|---|---|---|
| Claude Code | `statuslines/claude/statusline.cjs` | `~/.claude/statusline.cjs` | `~/.claude/settings.json` → clave `statusLine` (hoy: `{"type":"command","command":"bash ~/.claude/statusline-command.sh"}`, y ese `.sh` solo hace `exec node ~/.claude/statusline.cjs` — la lógica vive toda en el `.cjs`, no toques el `.sh` a menos que falte) |
| Antigravity (agy) | `statuslines/agy/statusline.cjs` | `~/.gemini/antigravity-cli/statusline.cjs` | `~/.gemini/antigravity-cli/settings.json` → misma clave `statusLine` (hoy: `{"type":"command","command":"node C:\\Users\\NICO-C\\.gemini\\antigravity-cli\\statusline.cjs"}`); si no aparece tras copiar el archivo, dentro de agy: `/statusline node ~/.gemini/antigravity-cli/statusline.cjs` |
| Codex | `statuslines/codex/tui.toml` | — (no copia archivo, se pega el bloque) | `~/.codex/config.toml` → sección `[tui]` con `status_line = [...]` y `terminal_title = [...]` |
| Hermes | — | — | Hermes no tiene barra de estado configurable (revisado `hermes --help`, 2026-09-04) |

La barra de Claude además hace **tee** del JSON completo a
`~/.claude/panel-status/<session>.json` (uno por sesión, se borra solo a los
2 días). Ese archivo es lo que N-Coterminal lee para mostrar modelo, contexto
y cuota del plan — si se rompe el tee, el panel deja de ver esos datos aunque
la barra en la terminal se vea bien.

**Comparación hecha el 2026-09-06**: `~/.claude/statusline.cjs` (instalado)
y `statuslines/claude/statusline.cjs` (repo) son **byte a byte idénticos**
(`cmp` sin diferencias, 5444 bytes). El de `agy` instalado y el del repo
tienen el **mismo contenido**, solo difieren en fin de línea (el instalado
usa LF, el del repo CRLF) — no hace falta reinstalarlo, es cosmético.

## Instalar o reconstruir

### Claude Code
1. Backup: `cp ~/.claude/statusline.cjs ~/.claude/statusline.cjs.bak` (Git Bash)
   o `Copy-Item ~/.claude/statusline.cjs ~/.claude/statusline.cjs.bak` (PowerShell).
2. `cp "Desktop/Claude Code/ideas/panel-agentico/statuslines/claude/statusline.cjs" ~/.claude/statusline.cjs`
3. Verificar que `~/.claude/settings.json` tiene la clave `statusLine` apuntando
   (directo o vía `statusline-command.sh`) a ese archivo. Si no existe la clave,
   añadirla — **no** toques nada más de `settings.json`.
4. Probar: `echo '{}' | node ~/.claude/statusline.cjs` debe imprimir 2 líneas
   sin error. Abrir una sesión nueva y mirar la barra real.

### Antigravity (agy)
1. Backup igual que arriba sobre `~/.gemini/antigravity-cli/statusline.cjs`.
2. Copiar `statuslines/agy/statusline.cjs` al destino.
3. Confirmar la clave `statusLine` en `~/.gemini/antigravity-cli/settings.json`
   (mismo formato que Claude). Si agy no la recoge sola, usar `/statusline
   node ~/.gemini/antigravity-cli/statusline.cjs` dentro de una sesión de agy.
4. Probar: `echo '{}' | node ~/.gemini/antigravity-cli/statusline.cjs`.

### Codex
1. Backup: `cp ~/.codex/config.toml ~/.codex/config.toml.bak`.
2. Abrir `~/.codex/config.toml` y pegar/actualizar la sección `[tui]` con el
   contenido literal de `statuslines/codex/tui.toml`:
   `status_line = ["model-with-reasoning", "current-dir", "git-branch", "context-used", "used-tokens", "five-hour-limit", "weekly-limit", "task-progress"]`
   y `terminal_title = ["spinner", "project", "git-branch"]`.
3. `codex doctor` **no valida** estos identificadores (están verificados a
   mano contra el binario 0.153) — la única verificación real es abrir Codex
   y mirar que la barra tenga texto en vez de quedar en blanco.

## Reglas

- Conservar siempre el tee a `~/.claude/panel-status/` al tocar el script de
  Claude: N-Coterminal depende de ese archivo para modelo/contexto/cuota.
- Nunca mostrar costo en USD en ninguna barra — Nicolas quiere plan 5h /
  semana / por modelo (Fable, Sonnet, etc.), no dólares.
- Si N-Coterminal deja de mostrar la cuota del plan aunque la barra de la
  terminal se vea bien: el problema casi siempre es el tee, no el panel —
  revisar que `~/.claude/panel-status/<session-actual>.json` exista y tenga
  `rate_limits` con datos, no que N-Coterminal esté mal.
- Desde N-Coterminal, ⚙ Ajustes → "Barras de estado" instala estos mismos
  scripts con un clic, pero solo funciona corriendo el panel en este PC (no
  por LAN desde el celular). Ese botón (`registrarStatuslineJson`,
  `server.js:1082`) reescribe `statusLine.command` a `node "<ruta>"` directo y
  deja de usar el wrapper `bash ~/.claude/statusline-command.sh` — sigue
  funcionando igual y hace su propio `.bak`, pero no esperes ver el wrapper
  intacto después de usarlo.
- `statuslines/README.md` del repo documenta el registro de Claude como
  `node ~/.claude/statusline.cjs` directo; lo instalado hoy usa el wrapper
  `.sh`. Ambas formas son válidas (el wrapper solo hace `exec` del mismo
  `.cjs`) — el README quedó desactualizado, no lo tomes como señal de que algo
  está mal.

## Diagnóstico

- **Barra vacía o en blanco**: probar el script a mano con `echo '{}' | node
  <ruta>`; si truena, el JSON de stdin no es el problema — es un error de
  sintaxis o de ruta rota tras copiar el archivo.
- **"plan: sin datos de cuota todavía"**: es el fallback normal del script de
  Claude cuando `rate_limits` aún no llegó en el JSON (pasa en sesiones muy
  nuevas) — no es un bug, espera un turno más.
- **El JSON del tee no aparece en `~/.claude/panel-status/`**: confirmar que
  la carpeta existe y tiene permisos de escritura; si existe pero está vacía,
  revisar que `statusLine` en `settings.json` de verdad apunte al
  `statusline.cjs` correcto (no a una copia vieja fuera de `~/.claude`).
- **Codex sin barra tras editar `config.toml`**: TOML mal formado rompe la
  sección entera en silencio — comparar contra `statuslines/codex/tui.toml`
  carácter por carácter, y revisar que no haya quedado una segunda `[tui]`
  duplicada más abajo en el archivo.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
