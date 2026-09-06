---
name: viaje
description: "Protocolo para trabajar en los proyectos de Nicolas desde un equipo secundario (portátil de viaje): qué llevar antes de salir, cómo instalar skills/MCP con junctions en PowerShell, cómo mantener RETORNO.md vivo durante el viaje y cómo cerrar al volver sin perder ni mezclar memoria. Usar cuando Nicolas diga 'me voy de viaje', 'voy a trabajar desde el portátil', '/viaje' o 'volví del viaje'."
---

# viaje — protocolo de equipo secundario

Basado en el viaje real del 2 al 5 de septiembre de 2026: se salió con
`MEMORIA-VIAJE.md` ya escrito, se alimentó `RETORNO.md` en cada cambio del
portátil (con verificación por paso), y al volver se ejecutó `RETORNO.md` en
orden marcando `[x]`. Esta skill es ese protocolo, generalizado.

## Antes de salir (PC principal)

Checklist — cada punto se marca solo si se verificó, no por darlo por hecho:

1. **Escribir `MEMORIA-VIAJE.md`** con lo que el portátil NO va a tener: la
   memoria persistente de Claude Code y los `PLAN.md`/`SEMANA.md` de cada
   repo. Resumen portable: agenda, proyectos con su estado real, reglas de
   trabajo, referencias rápidas. Verificación: releerlo y confirmar que
   alcanza para arrancar una sesión sin el PC — si hay que adivinar algo, falta.
2. **Push de todos los repos** que se vayan a tocar. Verificación:
   `git status` limpio y `git log origin/<rama> -1` = `git log -1` en cada uno.
3. **Lista de clones** a llevar (o clonar allá) y de qué skills, `agents/` y
   servidores MCP hacen falta para esos repos — no llevar lo que no se va a usar.
4. **Exportar la config de N-Coterminal**: ⚙ Ajustes → "Llevar a otro PC" →
   Exportar, y llevar también `dist-app/N-Coterminal-Setup.exe` para instalar
   el panel en el portátil sin clonar el repo. Verificación: el archivo
   exportado existe y el `Setup.exe` corre en el portátil sin pedir re-sembrar
   la config al primer arranque.

## En el portátil

- Skills: clonar `claude-skills` e instalar copiando (o con junction) las
  carpetas necesarias a `~/.claude/skills/`.
- Compartir esas mismas skills con Codex y Antigravity por **junction**, y
  hacerlo en **PowerShell**, no en Git Bash: `mklink` desde Git Bash mangla
  las rutas de Windows. Patrón real usado:
  - Codex (una junction por skill, sin pisar `.system` que es de Codex; el
    `if` evita reventar si la junction ya existe de un viaje anterior):
    ```powershell
    foreach ($d in Get-ChildItem ~/.claude/skills -Directory) {
      $p = "~/.codex/skills/$($d.Name)"
      if (-not (Test-Path $p)) { New-Item -ItemType Junction -Path $p -Target $d.FullName }
    }
    ```
  - Antigravity (una sola junction a toda la carpeta):
    `New-Item -ItemType Junction -Path ~/.gemini/config/skills -Target ~/.claude/skills`
- MCP en Codex y agy: `mempalace` y `playwright`. Ojo con `playwright`: usa
  `cmd /c npx -y @playwright/mcp@latest` (agy sin el `--` inicial) — pero si
  se escribe el comando desde **Git Bash**, el `/c` de `cmd /c` se convierte
  solo en `C:/`; revisar `config.toml` y `mcp_config.json` después y corregir
  a `/c` a mano si pasó.
- Instrucciones del proyecto para cada CLI: `AGENTS.md` (Codex) y `GEMINI.md`
  (Antigravity), copiados del resumen de `nicolas-mode` (< 3 KB; `GEMINI.md`
  tiene tope de 12.000 caracteres).
- **`RETORNO.md` es un documento vivo**: se crea al salir y cada cambio que se
  hace en el portátil deja ahí su propia línea, con cómo verificar que quedó
  bien — no se escribe de memoria al final, se alimenta en el momento.
- El Mempalace del portátil (si se instala) es **otro palacio**, no el del PC
  principal — nunca se fusiona a ciegas. Se descarta al volver; lo que valga
  la pena conservar se saca con `/cosecha` antes de cerrar cada sesión, no
  copiando la base de datos.

## Durante

- Con poco plan disponible: aplicar la skill `modo-ahorro` (existe desde
  2026-09-06 en `~/.claude/skills` — si aún no está en el clon `claude-skills`,
  cópiala ahí antes de salir para que viaje con las demás). Si en el equipo
  secundario no está, aplicar a mano lo mismo que hizo Nicolas en el
  viaje: estimar % de plan
  antes de arrancar una tarea, agrupar comandos en un solo bloque de bash,
  saltar verificación con Playwright y dejarla anotada como pendiente, cerrar
  la sesión con `/cosecha` en vez de dejarlo en la memoria de la conversación.
- Al cerrar cada día: `/cosecha` para no perder decisiones y lecciones del
  día en un palacio que se va a descartar.

## Al volver (PC principal)

1. `git pull` en **todos** los clones tocados. Verificar con `git log
   --oneline -3` que aparecen los commits del viaje.
2. Ejecutar `RETORNO.md` **en orden**, marcando cada punto `[x]` solo tras
   verificarlo en disco (no basta con que "debería estar").
3. `/cosecha` de las sesiones del portátil que no se cosecharon en el
   momento, para no perder lo que quedó sin bajar al palacio del PC.
4. Trasladar al palacio del PC lo que valga del wing/room que se creó en el
   Mempalace del portátil (sección del propio `RETORNO.md` lo detalla cajón
   por cajón) — y solo eso, el resto se descarta con el palacio del portátil.
5. Borrar credenciales sueltas que hayan quedado en el clon del portátil
   (ej. un `.env.download` con claves) **antes** de darlo por cerrado — nunca
   se suben a git, y tampoco deben quedar vivas sin necesidad.

## Plantillas

### `MEMORIA-VIAJE.md` (esqueleto mínimo)

```markdown
# Memoria de viaje — estado de todo (<fecha de salida>)

Resumen portable para trabajar sin el PC principal (<rango de fechas>).

## Agenda inmediata
- Viaje: <fecha inicio> → <fecha fin>.
- Al volver (en orden acordado): 1) git pull + /cosecha, 2) ...

## Proyectos — estado y pendientes
### <repo> — <una línea de qué es>
- Estado actual, qué se puede tocar desde el portátil, qué NO tocar.

## Reglas de trabajo
- Las que Claude debe seguir sin el CLAUDE.md largo del PC.

## Referencias rápidas
| Qué | Dónde |
|---|---|
```

### `RETORNO.md` (esqueleto mínimo)

```markdown
# RETORNO.md — poner el PC principal al día

> Documento vivo. Se alimenta durante el viaje y se ejecuta al volver, en orden.
> Regla: nada a ciegas; cada paso dice cómo verificar que quedó.

## 0. Antes de tocar nada
- [ ] git pull en todos los clones. Verificar: `git log --oneline -3`.

## 1. <tema, ej. Skills>
- [ ] <cambio hecho en el portátil>. Verificar: <comando o archivo a mirar>.

## N. Repos: qué se subió y qué falta
- [ ] <repo> rama <rama>: commit `<hash>`, subido el <fecha>.
```

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
