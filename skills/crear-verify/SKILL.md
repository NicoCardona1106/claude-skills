---
name: crear-verify
description: "Crea la skill `verify` DENTRO del repo de un proyecto (`.claude/skills/verify/SKILL.md`): cómo arrancarlo, cómo usarlo como persona según su stack y qué evidencia mostrar. Claude Code la corre sola antes de cada commit. Usar cuando Nicolas diga 'crea la skill verify', 'configura verify en este proyecto', '/crear-verify', al arrancar un proyecto nuevo, o cuando un proyecto en el que se va a hacer commit no tenga `.claude/skills/verify/`."
---

# /crear-verify: que cada proyecto sepa probarse solo

Por qué existe: desde Claude Code v2.1.286 (aquí corre 2.1.330), si al abrir la sesión hay una skill
llamada exactamente `verify` (de proyecto o personal), las instrucciones de commit le dicen a Claude
que la corra justo antes de cada commit, salvo cambios solo de docs o pruebas. No cuenta si tiene
`disable-model-invocation: true`, si viene de un plugin, ni si se apagó `includeGitInstructions`.
Una `verify` por proyecto convierte el "ya lo probé" en un paso fijo.

## 1. Inspeccionar antes de preguntar

Deducir del repo, sin preguntar lo que ya está escrito:
- `package.json` (scripts `dev`, `build`, `test`, `lint`), `pubspec.yaml`, `Cargo.toml`,
  `tauri.conf.json`, `pyproject.toml`, `docker-compose.yml`.
- `README.md`, `CLAUDE.md`, `AGENTS.md`, `docs/` (SRS, guías de pruebas, puertos).
- Carpetas de pruebas existentes y CI (`.github/workflows/`): qué corre hoy de verdad.
- `.env.example`: qué servicios locales necesita (Supabase local, base, claves de prueba).
- Si ya existe `.claude/skills/verify/`, leerla y proponer cambios en vez de reescribirla.

Preguntar a Nicolas solo lo que no se pueda deducir: cuál es el flujo principal que un usuario
real hace, credenciales de prueba, o un servicio externo que no se puede levantar en local.

## 2. Qué lleva la `verify` del proyecto

Frontmatter con `name: verify` y una `description` corta. **Sin** `disable-model-invocation`.
Cuerpo, en este orden:

1. **Arrancar**: comandos exactos, copiables (instalar, servicios, servidor) y cómo saber que
   ya arrancó (URL, puerto, línea del log). Y cómo apagarlo al final: ningún proceso vivo al
   terminar (cerrar por PID, nunca por nombre).
2. **Usarla como persona**, según el stack:
   | Stack | Pasos |
   |---|---|
   | Web Next.js (hub-crm, NPersonal web) | `npm run build` + pruebas; luego la skill `verificacion-visual` sobre el flujo principal a 1440 y 390, consola limpia |
   | Flutter (app móvil de NPersonal) | `flutter analyze` + `flutter test`; si el cambio toca UI, la skill `probar-en-celular` |
   | API / servicio | levantarlo en local y hacer peticiones reales (curl o script) al flujo principal, revisando código HTTP y cuerpo |
   | Rust / Tauri (isla-dinamica, si aplica) | `cargo test` + compilar y abrir el exe, recorrer el flujo principal |
   | Script / CLI (nconvertir) | correrlo sobre un archivo de ejemplo y comparar la salida |
3. **Evidencia que se muestra**: salida del runner con número de pruebas, capturas (con ruta),
   el paso exacto que falló si falla. Esto es lo que va en la línea `Verificado:` del commit
   (regla de `nicolas-mode`).
4. **Qué NO hace**: no despliega, no toca producción ni datos reales, no edita pruebas.

Opcional: si el proyecto tiene `docs/mapa-de-funciones.md` (lista de funciones y pantallas),
la `verify` lo usa como lista de qué revisar según lo que cambió el commit.

## 3. Rápida y estable

- Debe tardar poco: lo justo para el flujo principal, no la suite de horas. Lo largo va al CI.
- Estable: correrla **3 veces seguidas sin cambiar nada** y comprobar que da lo mismo. Si una
  corrida falla y otra no, hay una prueba inestable: se arregla la causa antes de guardar la
  `verify` (ver REGLAS DE VERIFICACIÓN en `razonamiento`), nunca con `sleep` ni reintentos.
- Sin dependencias del PC de Nicolas que no estén en el repo (pensar en Windows y en nube).

## 4. Guardar

1. Mostrarle a Nicolas el texto completo de la `verify` antes de escribirla.
2. Con su sí, escribir `.claude/skills/verify/SKILL.md` en la raíz del repo del proyecto
   (no en `~/.claude/skills/`: una `verify` personal correría en todos los proyectos).
3. Correrla una vez de verdad y mostrar la evidencia.
4. Commit aparte, solo con la skill (flujo de git de `nicolas-mode`, con su línea `Verificado:`).
5. Avisar que Claude Code solo la detecta **al iniciar sesión**: hace falta una sesión nueva.

Proyectos de Nicolas: `C:/Users/NICO-C/Desktop/nc-workspace/propios/` (npersonal, hub-crm,
N Coterminal, isla-dinamica, nconvertir...). Al 2026-11-22 ninguno tiene todavía su `verify`.

Inspirada en la guía de tododeia de @soyenriquerocha («5 reglas del equipo de Claude Code»,
basada en un post de Addy Osmani en el blog de Claude, 16-nov-2026) y en la documentación oficial
de skills de Claude Code (code.claude.com/docs/en/skills, «Run your checks before each commit»).

Autor: Nicolas Cardona Carrillo. Licencia CC BY 4.0
Origen: https://github.com/NicoCardona1106/claude-skills
