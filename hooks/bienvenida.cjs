#!/usr/bin/env node
// Hook SessionStart (startup): saludo + qué sigue de cada frente (SEMANA.md) + pendientes del último
// resumen de notas/sesiones/. systemMessage lo ve Nicolas al abrir, sin escribir nada (pedido 2026-10-31).
'use strict'
const fs = require('fs')
const path = require('path')
const HOME = process.env.USERPROFILE || process.env.HOME
// el workspace cambia de ruta entre PC/portátil (Windows) y nube (Linux)
const WS = [process.env.NC_WS, path.join(HOME, 'Desktop', 'nc-workspace'), path.join(HOME, 'nc-workspace')].find((d) => d && fs.existsSync(path.join(d, 'SEMANA.md'))) || ''
const corto = (s, n = 110) => (s = s.replace(/\*\*/g, '').trim()).length > n ? s.slice(0, n - 1) + '…' : s
const leer = (p) => { if (!WS) return ''; try { return fs.readFileSync(p, 'utf8') } catch { return '' } }

const ahora = new Date()
const h = Number(new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: 'numeric', hour12: false }).format(ahora))
const dia = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', hour12: true }).format(ahora)
const saludo = h < 5 ? 'Trasnochando' : h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
const lineas = [`👋 ${saludo}, Nicolas — ${dia}`]

// Frentes del FOCO: filas «| N · NOMBRE · … | … Siguiente: … | Quién |»
const semana = leer(path.join(WS, 'SEMANA.md'))
const foco = semana.split('## FOCO')[1]?.split(/\n## /)[0] || ''
const frentes = foco.split('\n').filter((l) => /^\|\s*\d+ ·/.test(l)).map((l) => {
  const [nombre, sigue, quien] = l.split('|').slice(1, 4).map((c) => c.trim())
  const sig = sigue.split('Siguiente:')[1]?.split(/ · |\. /)[0] || sigue
  return `  ${nombre.split(' · ').slice(0, 2).join(' · ')}: ${corto(sig)}${quien ? ` (${quien})` : ''}`
})
if (frentes.length) lineas.push('', '🎯 Frentes:', ...frentes)

// Pendientes del resumen más reciente
const dir = path.join(WS, 'notas/sesiones')
const ultimo = (() => { if (!WS) return null; try { return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort((a, b) => fs.statSync(path.join(dir, a)).mtimeMs - fs.statSync(path.join(dir, b)).mtimeMs).pop() } catch { return null } })()
if (ultimo) {
  const sec = leer(path.join(dir, ultimo)).split(/^## Pendientes.*$/m)[1]?.split(/\n## /)[0] || ''
  const pend = sec.split('\n').map((l) => l.match(/^(\d+[a-z]?\.)\s+(.*)/)).filter(Boolean).slice(0, 6)
    .map(([, n, t]) => `  ${n} ${corto(t.split(/: |\. (?=[A-ZÁÉÍÓÚ])/)[0], 100)}`)
  if (pend.length) lineas.push('', `📋 Pendientes (${ultimo}):`, ...pend)
}

const visible = lineas.join('\n')
process.stdout.write(JSON.stringify({
  systemMessage: visible,
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: `Nicolas ya vio este saludo al abrir la sesión:\n${visible}\nEn tu primera respuesta no lo repitas entero; si su mensaje es un saludo, propone el siguiente paso concreto.`,
  },
}))
