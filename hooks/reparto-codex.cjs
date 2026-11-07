#!/usr/bin/env node
// PreToolUse/Agent: antes de lanzar un subagente de Claude, recuerda la tabla de reparto de `orquesta`.
// Nicolas 24-sep y 7-nov: «nunca usas Codex». La regla en memoria no bastó; este aviso llega en cada lanzamiento.
let entrada = ''
process.stdin.on('data', (d) => (entrada += d)).on('end', () => {
  let tipo = ''
  try { tipo = JSON.parse(entrada).tool_input?.subagent_type || '' } catch {}
  // Lecturas y revisiones son de Claude por diseño; el recordatorio es para quien construye.
  if (['Explore', 'revisor', 'auditor-tells', 'verificador-visual', 'web-fetch', 'claude-code-guide', 'Plan'].includes(tipo)) return
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext:
    'REPARTO (regla de Nicolas): ¿esta tarea es mecánica con contrato (tests, páginas o ajustes acotados, scripts, rondas de arreglo)? ' +
    'Entonces va a Codex (`codex exec -s workspace-write -C <worktree en temporales/>`), no a un subagente de Claude. ' +
    'Si la mandas a Claude, di en una línea por qué (criterio, seguridad, texto de cliente o skills).' } }))
})
