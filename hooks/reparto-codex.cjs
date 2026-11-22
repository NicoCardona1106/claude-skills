#!/usr/bin/env node
// PreToolUse/Agent: un subagente de Claude que CONSTRUYE queda bloqueado salvo que el encargo justifique por qué no va a Codex.
// Nicolas 24-sep y 7-nov: «nunca usas Codex»; 22-nov: «endurecer la regla». El recordatorio solo no bastó.
// Salida: escribir «SIN-CODEX: <motivo>» en el prompt (criterio, dinero/seguridad, texto de cliente, Flutter en Windows, skills).
let entrada = ''
process.stdin.on('data', (d) => (entrada += d)).on('end', () => {
  let tipo = ''
  let prompt = ''
  try {
    const ti = JSON.parse(entrada).tool_input || {}
    tipo = ti.subagent_type || 'general-purpose'
    prompt = ti.prompt || ''
  } catch { return }
  // Lecturas, revisiones e investigación son de Claude/agy por diseño; Codex ya es Codex; fork es el propio director.
  const libres = ['Explore', 'revisor', 'auditor-tells', 'verificador-visual', 'web-fetch', 'claude-code-guide', 'Plan', 'fork', 'codex:codex-rescue']
  if (libres.includes(tipo)) return
  if (/SIN-CODEX:\s*\S/.test(prompt)) return
  console.log(JSON.stringify({ hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason:
      'REPARTO (regla dura de Nicolas, 22-nov): lo mecánico con contrato va a Codex ' +
      '(`codex exec -s workspace-write -C <worktree en temporales/>`), la investigación web a agy (Codex no tiene red). ' +
      'Si de verdad va a un subagente de Claude, relanza con la línea «SIN-CODEX: <motivo>» en el prompt ' +
      '(criterio, dinero/seguridad, texto de cliente, Flutter en Windows o skills).' } }))
})
