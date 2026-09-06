#!/usr/bin/env node
// Sincroniza las skills y agentes PROPIOS de ~/.claude al clon claude-skills y
// muestra el estado de git. No hace commit: Nicolas autoriza.
//   node sync.cjs          -> copia + git status
//   node sync.cjs --check  -> solo muestra diferencias, no copia
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const HOME = process.env.USERPROFILE || process.env.HOME
const SRC = path.join(HOME, '.claude')
const DST = __dirname
const soloCheck = process.argv.includes('--check')
const CREDITO = 'Nicolas Cardona Carrillo. Licencia CC BY 4.0'

// propias = SKILL.md con el crédito CC BY de Nicolas; agentes = todos los .md de ~/.claude/agents
const skills = fs.readdirSync(path.join(SRC, 'skills')).filter((s) => {
  const p = path.join(SRC, 'skills', s, 'SKILL.md')
  return fs.existsSync(p) && fs.readFileSync(p, 'utf8').includes(CREDITO)
})
// agentes propios (los de agency-agents y otros terceros NO van al repo)
const AGENTES_PROPIOS = ['implementador', 'mantenedor', 'revisor', 'redactor-cliente',
  'verificador-visual', 'portador', 'disenador-landing', 'auditor-tells']
const agentes = AGENTES_PROPIOS.map((a) => a + '.md').filter((a) => fs.existsSync(path.join(SRC, 'agents', a)))

let cambios = 0
const iguales = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b))
const sincronizar = (de, a) => {
  if (iguales(de, a)) return
  cambios++
  console.log((soloCheck ? 'difiere ' : 'copiado ') + path.relative(DST, a))
  if (!soloCheck) { fs.mkdirSync(path.dirname(a), { recursive: true }); fs.copyFileSync(de, a) }
}
const recorrer = (de, a) => {
  for (const f of fs.readdirSync(de)) {
    const s = path.join(de, f)
    if (fs.statSync(s).isDirectory()) recorrer(s, path.join(a, f))
    else sincronizar(s, path.join(a, f))
  }
}

for (const s of skills) recorrer(path.join(SRC, 'skills', s), path.join(DST, 'skills', s))
for (const a of agentes) sincronizar(path.join(SRC, 'agents', a), path.join(DST, 'agents', a))
sincronizar(path.join(SRC, 'CLAUDE.md'), path.join(DST, 'CLAUDE.md'))

console.log(`${skills.length} skills propias, ${agentes.length} agentes, ${cambios} archivo(s) ${soloCheck ? 'distintos' : 'copiados'}`)
console.log(execSync('git status --short', { cwd: DST, encoding: 'utf8' }) || '(git limpio)')
