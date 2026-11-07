#!/usr/bin/env node
// Registra los hooks del repo en ~/.claude/settings.json de ESTE equipo (PC, portátil o nube), apuntando
// al archivo del repo: un `git pull` los actualiza sin copiar nada. Idempotente; respalda settings.json antes de escribir.
//   node instalar-hooks.cjs          -> aplica
//   node instalar-hooks.cjs --check  -> solo muestra qué cambiaría
'use strict'
const fs = require('fs')
const path = require('path')

const HOME = process.env.USERPROFILE || process.env.HOME
const SETTINGS = path.join(HOME, '.claude', 'settings.json')
const soloCheck = process.argv.includes('--check')
// evento, matcher y archivo de cada hook del repo
const HOOKS = [
  { evento: 'SessionStart', matcher: 'startup', archivo: 'bienvenida.cjs', timeout: 5, statusMessage: 'Saludo y pendientes' },
  { evento: 'PreToolUse', matcher: 'Agent', archivo: 'reparto-codex.cjs', timeout: 5, statusMessage: 'Reparto: ¿va a Codex?' },
]

const ajustes = fs.existsSync(SETTINGS) ? JSON.parse(fs.readFileSync(SETTINGS, 'utf8')) : {}
ajustes.hooks ??= {}
let cambios = 0
for (const h of HOOKS) {
  const comando = `node "${path.join(__dirname, 'hooks', h.archivo).replace(/\\/g, '/')}"`
  const grupos = (ajustes.hooks[h.evento] ??= [])
  // quita registros viejos del mismo hook con otra ruta (p. ej. la copia en ~/.claude/hooks)
  for (const g of grupos) {
    const antes = g.hooks?.length ?? 0
    g.hooks = (g.hooks || []).filter((x) => !(x.command?.includes(h.archivo) && x.command !== comando))
    if (g.hooks.length !== antes) { cambios++; console.log(`quita registro viejo de ${h.archivo}`) }
  }
  ajustes.hooks[h.evento] = grupos.filter((g) => g.hooks.length)
  if (!ajustes.hooks[h.evento].some((g) => g.hooks.some((x) => x.command === comando))) {
    cambios++; console.log(`registra ${h.evento}/${h.matcher}: ${comando}`)
    ajustes.hooks[h.evento].push({ matcher: h.matcher, hooks: [{ type: 'command', command: comando, timeout: h.timeout, statusMessage: h.statusMessage }] })
  }
}
if (cambios && !soloCheck) {
  if (fs.existsSync(SETTINGS)) fs.copyFileSync(SETTINGS, `${SETTINGS}.bak-${new Date().toISOString().slice(0, 10)}`)
  fs.writeFileSync(SETTINGS, JSON.stringify(ajustes, null, 2) + '\n')
}
console.log(`hooks: ${cambios} cambio(s)${soloCheck && cambios ? ' (solo check)' : ''}`)
