---
name: noche-nube
description: "Abre sesiones de Claude en nube (ssh + tmux, sesión `dia`) para que el trabajo siga mientras Nicolas apaga el PC o el portátil. Permiso PERMANENTE de Nicolas: no se pregunta ni se le deja a él. Usar SIEMPRE que diga 'voy a apagar el pc', 'me voy', 'avanza en nube', 'déjalo corriendo esta noche', 'sigue en la nube', '/noche-nube', o al cerrar una sesión con frentes que pueden avanzar solos."
---

# /noche-nube — el trabajo sigue en nube cuando se apaga el equipo

Nicolas ya dio permiso permanente para crear sesiones en nube. **Nunca** respondas «no tengo cómo llegar a la nube» ni le
pases la tarea a él: ListAgents sin Remote Control no ve nube, pero `ssh nube` sí llega. Solo si el ssh falla de verdad,
muestra el error y pide ayuda.

## 1 · Antes de que apague (lo urgente primero)
1. Todo lo que la nube necesite debe estar en GitHub: commit y push de las ramas de trabajo (nada a master sin su OK).
2. Resumen de sesión en `notas/sesiones/` con una sección **«Para la nube»**: por frente, qué se puede avanzar SIN el PC
   y qué NO (pruebas de Windows, celular por USB, cosas con Nicolas).
3. Para servidores que arrancaste en el PC: páralos por PID.

## 2 · Un encargo por frente
Prompt en el scratchpad (`PROMPT-<v>.txt`), uno por frente, sin cruzar archivos entre ventanas
(ver [[areas-paralelas-mismos-archivos]]). Cada uno lleva:
- Qué leer primero: el resumen de sesión y la memoria del proyecto.
- Repo, rama de partida y rama nueva. Trabajo en worktree dentro de `~/nc-workspace/temporales/<repo>-<bloque>`.
- Tareas numeradas y qué NO intentar (lo que necesita el PC o a Nicolas).
- Reglas fijas:
  - Director con `orquesta`: lo mecánico a Codex o a un implementador, revisor Opus, pruebas que fallen contra lo viejo.
  - Nada a master ni despliegues sin OK. Commits sin Co-Authored-By.
  - **Guarda de cuota:** si la semana baja de 8 % o la ventana de 5 h de 15 %, dejar `RETOMAR.md` y parar.
  - Al terminar, informe `~/nc-workspace/temporales/INFORME-<X>-<fecha>.md` y marca
    `~/nc-workspace/temporales/ENCARGO-TERMINADO-<X>-<fecha>`.

## 3 · Subir y abrir (desde Git Bash del PC/portátil)
```bash
ssh nube "cat > ~/nc-workspace/temporales/PROMPT-<v>.txt" < PROMPT-<v>.txt
ssh nube 'tmux has-session -t dia 2>/dev/null || tmux new-session -d -s dia -n base -c "$HOME/nc-workspace"; tmux new-window -d -t dia -n <v> -c "$HOME/nc-workspace" "bash -lic '"'"'claude \"\$(cat temporales/PROMPT-<v>.txt)\"'"'"'; exec bash"'
```
- Antes de abrir, mira si ya hay ventanas vivas del mismo frente con `tmux list-windows -t dia`. No dupliques agentes
  sobre un mismo worktree (ver [[sesion-caida-buscar-tmux]]).
- `claude` solo está en el PATH con `bash -lic`.

## 4 · Verificar y avisar
- A los ~40 s (en segundo plano, nunca `sleep` encadenado), `ssh nube "tmux capture-pane -p -t dia:<v> | tail -8"`.
  La ventana debe mostrar «esc to interrupt» o un worktree nuevo en la statusline.
- Para mandarle un mensaje a una ventana viva: `tmux send-keys -t dia:<v> -l "texto"`, `sleep 2` y después
  `tmux send-keys -t dia:<v> Enter`. Con un solo send-keys, el Enter se pierde.
- En el bloque final, dile a Nicolas:
  - qué ventanas quedaron y qué hace cada una;
  - cómo mirarlas: `ssh nube`, luego `tmux attach -t dia`, luego Ctrl+b y el número de ventana;
  - dónde quedan los informes;
  - qué hacer al volver: leer los `INFORME-*`, correr las suites de Windows y fusionar con su OK.

---
© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
