---
name: ordenar
description: Ordena el Escritorio de Nicolas y nc-workspace cada ~3 días: propone una lista de movimientos (PDFs y APK viejos, carpetas de prueba generadas, worktrees de temporales\ ya fusionados, respaldos sueltos), hace un zip de respaldo y SOLO mueve con su sí; nunca borra. Usar cuando Nicolas diga 'ordena', 'organiza el escritorio', 'limpia temporales', '/ordenar', o cuando el aviso de inicio diga «toca ordenar».
---

# Ordenar Escritorio y nc-workspace

Regla madre: **nada se borra**. Se mueve a un archivo con fecha, con zip de respaldo antes, y solo con el «sí» de
Nicolas a la lista. (Incidente 2026-09-11: un subagente borró sin respaldo.)

## Dónde se mira

| Zona | Qué suele sobrar | Destino propuesto |
|---|---|---|
| `C:\Users\NICO-C\Desktop` (solo el nivel de arriba) | PDFs de SRS/blueprints/propuestas con versión vieja, APK de NPersonal reemplazados, carpetas de prueba (`prueba-*`), capturas sueltas, imágenes de WhatsApp ya usadas | `nc-workspace\archivo\escritorio\<AAAA-MM-DD>\` |
| `C:\Users\NICO-C\Desktop\Entregas` | Todo lo ya aprobado, usado o reemplazado por una versión nueva (regla de Nicolas 2026-10-25: solo queda lo que espera algo de él: leer, aprobar, probar, enviar). Para decidir, mirar el estado en SEMANA.md | `nc-workspace\archivo\entregas\<AAAA-MM-DD>\` |
| `nc-workspace\temporales\` | worktrees cuya rama ya está fusionada o borrada, carpetas de orquesta de rondas cerradas, respaldos `.zip`/`.tar.gz` de más de 14 días | worktrees: `git worktree remove` + `prune` (sin `--force` si hay cambios: entonces se pregunta); lo demás a `nc-workspace\archivo\temporales\<AAAA-MM-DD>\` |
| raíz de `nc-workspace` | archivos sueltos que no son AGENTS/CLAUDE/GEMINI/SEMANA | a su proyecto o a `archivo\` |

No tocar nunca: carpetas personales del Escritorio (`Documentos personales`, `Trabajo`, `TRABAJOS`, `IA`, `Juegos`,
`Videos`, `Stream y contenido`, `NU`, `Partidos.Fotos`), accesos directos `.lnk`, `desktop.ini`, el último PDF
vigente de cada documento, el APK más nuevo de cada app, nada que tenga cambios sin commit en un worktree.

## Pasos

1. **Inventario (solo lectura).** Lista cada zona con tamaño y fecha. Para cada worktree de `temporales\`:
   `git -C <wt> status --porcelain` y si su rama está en `origin` fusionada (`git branch -r --merged origin/<main>`).
2. **Propuesta.** Una tabla: archivo/carpeta · por qué sobra · destino. Agrupa por zona. Marca con ⚠️ lo dudoso
   (cambios sin commit, rama sin fusionar, archivo de hoy) y déjalo fuera por defecto.
3. **Espera el sí.** Nicolas puede quitar filas. Nada se mueve antes.
4. **Respaldo.** Zip de todo lo que se va a mover en `nc-workspace\archivo\respaldos\orden-<AAAA-MM-DD>.zip`
   (`Compress-Archive`); comprueba que el zip abre y cuántos archivos tiene.
5. **Mover** con `Move-Item` (o `git worktree remove` + `git -C <repo> worktree prune` para worktrees limpios).
   Nunca `Remove-Item` sobre lo de Nicolas. Recuerda: ningún worktree lleva junction a `node_modules`
   (`worktree remove --force` seguiría la junction).
6. **Cierre.** Escribe la fecha de hoy en `~/.claude/orden-ultima.txt` (formato `AAAA-MM-DD`), reporta qué se movió,
   cuánto espacio quedó libre en `temporales\` y dónde está el zip.

## Pasada «Limpieza de la configuración de Claude»

Idea de `config-gc` (ECC, MIT), adaptada. Solo `~/.claude`, `~/.claude.json` y tareas programadas propias; nunca
código, historial de chat ni la memoria (la memoria es de nc-memoria: aquí solo se REPORTAN contradicciones o
huérfanas para la próxima `/cosecha --review`). Se corre aparte o con «ordena la config», más o menos cada 30 días.

**Canales (solo lectura):**
1. Skills de `~/.claude/skills`: `SKILL.md` roto o vacío, nombres/descripciones solapadas, nunca disparadas. Ojo:
   Codex y agy las comparten por junction; corre antes
   `node C:/Users/NICO-C/Desktop/nc-workspace/herramientas/claude-skills/sync.cjs --check` y no muevas una skill
   que otro CLI use.
2. Hooks de `~/.claude/settings.json`: comando que apunta a un script que no existe, y scripts de
   `~/.claude/hooks/` que ningún hook registra.
3. Permisos (`permissions.allow`): duplicados y los tapados por un comodín.
4. Servidores MCP que fallan al conectar (real, 2026-11-22: `magic` de 21st.dev, sin autenticación). Se propone
   reautenticar o desactivar, no borrar.
5. Tareas programadas de Windows propias cuyo script ya no existe.
6. Cachés grandes y viejas (>30 días): `~/.claude/file-history`, `shell-snapshots`, `logs`, `cache`.

**Reglas de la pasada:**
- Tabla numerada ordenada por confianza (roto/huérfano = alta; solo viejo = baja), máximo ~20 por corrida.
- Confirmar **uno por uno**: no hay «sí a todo». Lo dudoso va fuera por defecto.
- Nunca borrar: renombrar a `.disabled` o mover a `nc-workspacerchivo\config-claude\<AAAA-MM-DD>\`, con el zip
  de respaldo del paso 4 de arriba. Antes de tocar un JSON, copia `.bak` al lado.
- Registrar en `nc-workspacerchivo\config-claude\<AAAA-MM-DD>\LEEME.md` qué se hizo y cómo deshacerlo
  (ruta de origen, comando inverso). Reportar a Nicolas el mismo resumen.

## Rutina

El hook de inicio `~/.claude/hooks/orden-aviso.cjs` avisa cuando pasaron 3 días o más desde la fecha de
`orden-ultima.txt`. El aviso solo propone; si Nicolas está en otra cosa, se deja para después.

---
© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
