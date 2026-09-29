---
name: release-ncoterminal
description: "Publica una versión nueva de N-Coterminal (la estación de trabajo de Nicolas): sube la versión, empaqueta el instalador NSIS, crea el release en el repo público N-Coterminal-releases y redespliega version.json en Vercel; las apps instaladas se actualizan solas. Usar cuando Nicolas diga 'saca la release', 'publica la versión', 'sube N-Coterminal a v0.x', o /release-ncoterminal."
---

# /release-ncoterminal — publicar una versión

Verificado de punta a punta el 2026-09-06 (v0.2.0 y v0.2.1: la app instalada
de Nicolas se actualizó sola). Repo privado: `Desktop\nc-workspace\propios\N Coterminal`
(GitHub `NicoCardona1106/N-Coterminal`). Binarios públicos:
`NicoCardona1106/N-Coterminal-releases`. Guía larga: `docs/INSTALAR.md`.

## Antes

- Todo commiteado y pusheado en master (`git status -sb` limpio).
- Sin procesos `N-Coterminal.exe` ni `electron` vivos (el servidor node de
  :3000 y las terminales del panel NO estorban). Si queda uno, el build falla con EBUSY.
- `gh auth status` y `npx vercel whoami` autenticados.
- **Toda dependencia que use server.js/electron-main en tiempo de ejecución va en
  `dependencies`, nunca en `devDependencies`**: electron-builder solo empaqueta las de
  producción. Síntoma si falla: `Cannot find module` en panel-data/server.log de la
  app instalada.
  Comprobar: `grep -A20 '"dependencies"' package.json`.
- Los archivos nuevos del repo que carga el servidor (p. ej. `lib/`) deben estar en
  `build.files` de package.json.

## Pasos

1. **Versión** (mismo número en los dos sitios):
   ```
   npm version 0.2.2 --no-git-tag-version
   ```
   y en `deploy-vercel/version.json`: `version` + `notas` (una línea con lo nuevo; sale en el banner).
2. **Instalador** (2-3 min, correr en segundo plano):
   ```
   npm run dist
   ```
   Deja en `dist-app/`: `N-Coterminal-Setup.exe` (~175 MB), `N-Coterminal-Setup.exe.blockmap`, `latest.yml`.
   Comprobar `version:` en `dist-app/latest.yml`.
   **Probar el paquete, no el repo** (la prueba de humo desde el repo tiene node_modules
   completo y no detecta dependencias faltantes): desde `dist-app/win-unpacked`,
   ```
   ELECTRON_RUN_AS_NODE=1 PANEL_PORT=3100 PANEL_DATA_DIR=<temp> ./N-Coterminal.exe resources/app/server.js
   curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/   # 200 = arranca
   ```
   y mirar que no haya `Cannot find module` en la salida.
3. **Release** (la subida del Setup tarda; timeout largo):
   ```
   gh release create v0.2.2 dist-app/N-Coterminal-Setup.exe dist-app/latest.yml dist-app/N-Coterminal-Setup.exe.blockmap --repo NicoCardona1106/N-Coterminal-releases --title "N-Coterminal v0.2.2" --notes "..."
   ```
4. **version.json en Vercel**: el push a master lo despliega solo (integración
   git, Root Directory = `deploy-vercel`). Si se quiere a mano, desde la RAÍZ
   del repo (desde `deploy-vercel/` falla con "Root Directory does not exist"):
   ```
   npx vercel --prod --yes
   ```
5. **Commit + push** del bump (`chore(release): v0.2.2 — ...`), sin trailers de coautoría.

## Verificar

- `gh release view v0.2.2 --repo NicoCardona1106/N-Coterminal-releases --json assets --jq '.assets[].name'` → los 3 archivos.
- `curl -s https://n-coterminal.vercel.app/version.json` → la versión nueva (el CDN puede tardar unos segundos; añadir `?t=<epoch>`).
- Nicolas abre la app instalada: detecta la versión al arrancar o cada 6 h, descarga y pide reiniciar. Al reiniciar mata su servidor en segundo plano (se pierden las terminales abiertas).

## Registrar

Memoria local del proyecto (`panel-agentico.md`) y Mempalace wing `panel-agentico`
(drawer "WORKFLOW — publicar una versión"). Mejora anotada sin construir:
GitHub Action que compile en `windows-latest` al subir un tag `v*` y publique en
el repo de releases con un token en secrets → publicar = `git tag v0.3.0 && git push --tags`.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
