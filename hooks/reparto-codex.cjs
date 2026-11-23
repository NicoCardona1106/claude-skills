#!/usr/bin/env node
// PreToolUse/Agent: un subagente de Claude que CONSTRUYE queda bloqueado salvo que el encargo diga por qué no va a Codex.
// Nicolas 24-sep y 7-nov: «nunca usas Codex»; 22-nov: «endurecer la regla»; 23-nov: «dividir para optimizar, no todo
// a Codex; sin cuota o con varias cosas, abres tú; prioriza la calidad sin errores».
// Salida: escribir «SIN-CODEX: <motivo>» en el prompt.
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
      'REPARTO (Nicolas, 23-nov: dividir para optimizar, la calidad primero): ¿esto es mecánico con contrato y Codex ' +
      'tiene cuota? Entonces va a Codex (`codex exec -s workspace-write -C <worktree en temporales/>`); la investigación ' +
      'web va a agy. Si va a un subagente de Claude, relanza con «SIN-CODEX: <motivo>» en el prompt: criterio, ' +
      'dinero/seguridad, texto de cliente, Flutter en Windows, skills, Codex sin cuota o caído, o piezas en paralelo ' +
      '(la otra parte ya va a Codex).' } }))
})
