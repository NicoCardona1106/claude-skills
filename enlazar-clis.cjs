#!/usr/bin/env node
// Mantiene las skills de Codex y agy IGUALES a las de Claude (la fuente principal es ~/.claude/skills):
// cada skill de Claude (salvo SOLO_CLAUDE) queda como junction en cada carpeta de otro CLI, y lo que ya no
// está en Claude (archivado o borrado) sale de ahí. Nada se borra: las copias reales se mueven a
// <carpeta>-archivo/<nombre>-<fecha>; solo se quitan junctions (no tienen contenido propio).
//   node enlazar-clis.cjs          -> aplica
//   node enlazar-clis.cjs --check  -> solo muestra qué cambiaría
// También lo llama sync.cjs.
const fs = require('fs')
const path = require('path')

const HOME = process.env.USERPROFILE || process.env.HOME
const CLAUDE = path.join(HOME, '.claude', 'skills')
const DESTINOS = [
  path.join(HOME, '.codex', 'skills'),                 // Codex
  path.join(HOME, '.agents', 'skills'),                // estándar compartido (Codex/agy leen de aquí)
  path.join(HOME, '.gemini', 'antigravity', 'skills'), // agy (Antigravity)
  path.join(HOME, '.gemini', 'skills'),                // Gemini CLI
]
// Manejan el entorno de Claude Code (statusline, cuota, releases, SEMANA.md): no aplican a otros CLI.
const SOLO_CLAUDE = new Set(['modo-ahorro', 'statusline', 'release-ncoterminal', 'viaje', 'nueva-tarea', 'synced'])

function enlazar(soloCheck = process.argv.includes('--check')) {
  const fecha = new Date().toISOString().slice(0, 10)
  const deseadas = new Set(fs.readdirSync(CLAUDE).filter((s) =>
    !SOLO_CLAUDE.has(s) && !s.startsWith('.') && fs.existsSync(path.join(CLAUDE, s, 'SKILL.md'))))
  let cambios = 0
  const hacer = (msg, fn) => { cambios++; console.log((soloCheck ? '[check] ' : '') + msg); if (!soloCheck) fn() }
  const archivar = (dir, nombre) => {
    const arch = dir + '-archivo'
    const dest = path.join(arch, `${nombre}-${fecha}`)
    hacer(`archiva copia real ${path.join(dir, nombre)} -> ${dest}`, () => {
      fs.mkdirSync(arch, { recursive: true }); fs.renameSync(path.join(dir, nombre), dest)
    })
  }

  for (const dir of DESTINOS) {
    if (!fs.existsSync(dir)) continue
    for (const nombre of fs.readdirSync(dir)) {
      if (nombre.startsWith('.')) continue // .system de Codex y similares
      const p = path.join(dir, nombre)
      const st = fs.lstatSync(p)
      if (st.isSymbolicLink()) {
        const destino = fs.readlinkSync(p)
        const bueno = deseadas.has(nombre) && path.resolve(destino) === path.join(CLAUDE, nombre) && fs.existsSync(p)
        if (!bueno) hacer(`quita junction ${p} (-> ${destino})`, () => fs.rmdirSync(p))
      } else if (st.isDirectory()) {
        archivar(dir, nombre) // copia real: se desactualiza sola; se guarda y se reemplaza por junction si aplica
      }
    }
    for (const nombre of deseadas) {
      const p = path.join(dir, nombre)
      if (!fs.existsSync(p)) hacer(`enlaza ${p} -> ${path.join(CLAUDE, nombre)}`, () =>
        fs.symlinkSync(path.join(CLAUDE, nombre), p, 'junction'))
    }
  }
  console.log(`CLIs: ${deseadas.size} skills compartidas en ${DESTINOS.filter((d) => fs.existsSync(d)).length} carpetas, ${cambios} cambio(s)${soloCheck ? ' (solo check)' : ''}`)
}

module.exports = { enlazar }
if (require.main === module) enlazar()
