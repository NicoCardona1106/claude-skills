---
name: comparar-n
description: "Mismo encargo a 2-3 implementadores en worktrees separados dentro de nc-workspace\\temporales\\, un revisor compara los resultados contra el contrato y se fusiona el mejor (idea de Orca). Usar cuando Nicolas diga 'compáralos', 'que lo hagan dos y elegimos', 'dame varias versiones', '/comparar-n', o cuando una decisión de diseño o de algoritmo tenga varias salidas buenas y equivocarse cueste más que pagar la cuota dos o tres veces (hero de una landing, modelo de datos, flujo de UX, algoritmo con compromisos). NO usar para trabajo mecánico con una sola respuesta correcta, bugs, ni con la cuota baja: ahí va el reparto normal de `orquesta`."
---

# /comparar-n — N versiones, un ganador

Cada implementador cuesta una tarea completa: 3 versiones son 3 veces la
cuota. Se paga solo cuando la diferencia entre una buena salida y la mejor se
nota de verdad. Es un modo de `orquesta` (mismas reglas de contrato, bitácora
y revisión), no una doctrina aparte.

## ¿Vale la pena?

| Sí | No |
|---|---|
| Diseño con varias salidas buenas (hero, dirección visual, layout) | Mecánico con contrato: hay una sola respuesta correcta |
| Modelo de datos o API pública difícil de cambiar después | Bug: va a `fable-fixer` / un solo agente que investigue |
| Algoritmo con compromisos (precisión vs. costo, latencia) | Cambios de migraciones, producción o estado compartido |
| Texto clave para un cliente (con `redactor-cliente`) | Cuota 5 h > 70 % usada, guardia ≤ 20 %, o Codex sin tareas del día |

**N = 2 por defecto, 3 como máximo.** Antes de lanzar, decir a Nicolas el
costo estimado («2 implementadores ≈ 2 tareas de Codex + una revisión
opus»). Si duda, se hace con uno.

**Diversidad sobre repetición:** mezclar motores rinde más que el mismo
modelo dos veces. Combinaciones típicas: Codex `gpt-6.1-sol` + subagente
Claude (sonnet u opus según el criterio que pida); para UI, dos
`disenador-landing` con el mismo contrato. Si son del mismo modelo, el
contrato puede pedir a cada uno una dirección distinta, dicho en el informe.

## Flujo

1. **Contrato único** (ENTREGABLE, FORMATO, ACEPTACIÓN, PROHIBIDO, y el
   quinto campo si hay acciones destructivas). Va textual e idéntico a todos;
   lo único que cambia es la carpeta. Añadir los **criterios de comparación**
   que usará el revisor (p. ej. legibilidad, peso, fidelidad a nc-design,
   casos borde cubiertos).
2. **Worktrees en `temporales/`** (regla del CLAUDE.md de nc-workspace), uno
   por implementador, sufijo de letra en el bloque:
   ```bash
   WS="C:/Users/NICO-C/Desktop/nc-workspace"
   BASE=$(git -C <repo> rev-parse HEAD)
   git -C <repo> worktree add "$WS/temporales/<repo>-<bloque>-a" -b comparar/<bloque>-a
   git -C <repo> worktree add "$WS/temporales/<repo>-<bloque>-b" -b comparar/<bloque>-b
   ```
   Dentro de cada uno, `npm ci` (si hay `package.json`). **Nunca una junction
   a `node_modules`**: `git worktree remove --force` la sigue y borra el
   `node_modules` del repo real. Si hace falta `.env.local`, se COPIA (no se
   enlaza) y nunca se commitea.
3. **Lanzar en paralelo**, cada uno con su carpeta y nada más. Codex:
   `codex exec - -C <worktree> --approve-for-me --skip-git-repo-check --color never -o <salida.md>`
   con un Monitor de `herramientas/vigilar-delegado.sh` (regla de arranque).
   Subagentes Claude: la ruta del worktree en el prompt como única zona
   permitida.
4. **Empaquetar cada resultado como archivo** (`git -C <worktree> diff $BASE`
   + `git status` a `temporales/comparar-<bloque>/<letra>.diff`). Los diffs no
   pasan por el contexto del director.
5. **Un solo revisor compara** (`revisor`, opus, effort medium; para UI,
   además `verificador-visual` o `auditor-tells` por candidato, cada uno
   servido en su propio puerto y cerrado por su PID). Recibe el contrato, los
   criterios y las rutas de los paquetes, y devuelve:
   - veredicto PASA / NO PASA por candidato contra el contrato;
   - tabla candidato × criterio con evidencia (archivo:línea o captura);
   - ganador y por qué; qué pieza puntual de un perdedor vale injertar (solo
     si es pequeña y se nombra exacta).
   Ninguno pasa → no se elige «el menos malo»: vuelve al ciclo de `orquesta`
   con el mejor como base.
6. **Decidir**: si lo verá un cliente, la tabla va a Nicolas y elige él. Si
   es interno, decide el director y deja la línea `Decisión:` en la bitácora.
7. **Fusionar el ganador** por el flujo de git de siempre: se prepara el
   merge o el commit de la rama ganadora, se muestran los cambios y se
   espera la autorización de Nicolas para ese commit.
8. **Limpiar**: borrar las carpetas de los worktrees y luego
   `git -C <repo> worktree prune`. Las ramas perdedoras se dejan hasta que
   Nicolas diga (no cuestan nada y guardan la alternativa).

## Bitácora

```
comparar-n <bloque>: a=<motor> b=<motor> [c=<motor>] · base <BASE7>
Ganador: <letra> — <criterio que decidió> — injerto: <nada | pieza>
```

---

Idea de Orca (stablyai/orca, vía tododeia 2026-10): el mismo prompt en
varios worktrees y quedarse con el mejor diff.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
