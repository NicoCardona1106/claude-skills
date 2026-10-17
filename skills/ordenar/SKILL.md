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

## Rutina

El hook de inicio `~/.claude/hooks/orden-aviso.cjs` avisa cuando pasaron 3 días o más desde la fecha de
`orden-ultima.txt`. El aviso solo propone; si Nicolas está en otra cosa, se deja para después.

---
© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
