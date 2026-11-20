---
name: desplegar-nct2
description: "Fusiona y despliega N-Coterminal 2 (NCT2): rama → master con OK de Nicolas, despliegue en nube (instalar-nube.sh con vuelta atrás automática) y actualización del núcleo del PC. Usar cuando Nicolas diga 'fusiona y despliega NCT2', 'sube NCT2 a nube', 'despliega la rama', '/desplegar-nct2', o tras su OK a una rama de NCT2. NO es release-ncoterminal (esa es el instalador NSIS de la v0.2.x)."
---

# /desplegar-nct2 — de la rama a nube y al PC

Repo `propios/N Coterminal` (PC) = `~/nc-workspace/propios/N-Coterminal` (nube); el código está en `nct2/`.
Guía para manejarlo sin IA: `nct2/deploy/NUBE.md`.

## 1 · Antes de fusionar (en serie, ver [[verificar-en-serie]])
- OK de Nicolas en el chat para ESA rama ([[aprobado-solo-con-respuesta]]).
- Puertas en el worktree:
  - `npm run typecheck`, `npm run lint`, `npm test` en Windows. La suite da ~425 con 5 omitidas en Windows; las
    omitidas son de Linux.
  - Las `tests/visual-*.ts` del área tocada, verdes y rojas contra el código viejo.
- Si son varias ramas: rama `integ/<x>` con las fusiones en orden ([[integrar-ramas-antes-de-fusionar]]).

## 2 · Fusionar
Avance directo si se puede (`git merge --ff-only <rama>` en master), push, y anotar el sha en SEMANA y en la memoria
`n-coterminal`. Commits sin Co-Authored-By.

## 3 · Nube (lo corre Nicolas, o yo por `ssh nube` si me lo pide)
```bash
cd ~/nc-workspace/propios/N-Coterminal && git pull --ff-only && cd nct2 && bash deploy/instalar-nube.sh
```
- Si el núcleo nuevo no responde con la versión del checkout en 30 s, el script vuelve solo al anterior.
- Verificar con `systemctl --user status nct2` y `curl -s http://127.0.0.1:4100/api/v1/salud` («listo»). Desde el
  celular: `https://nube.tail02ccac.ts.net:4443`.
- Volver atrás a mano: la orden está en `deploy/NUBE.md`.

## 4 · PC (lo arranca Nicolas, ver [[servidores-del-pc-los-arranca-nicolas]])
1. Parar su núcleo (Ctrl+C en su PowerShell). Comprobar que el 4100 quedó libre:
   `Get-NetTCPConnection -LocalPort 4100 -State Listen` sin salida.
2. Yo: `git pull` en el repo; `npm ci` solo si cambió el lock (nunca con el núcleo vivo) y `npm run build` en `nct2\`.
3. Nicolas, en `nct2\`: `$env:NCT_TAILNET='tail02ccac.ts.net'; npm start`. `NCT_DUENO` ya es variable de usuario
   persistente: sin ella, el PC da 403 `sin_identidad` en el tailnet.
4. Verificar desde nube: `curl` al PC por el tailnet = 200 «listo».

## 5 · Después
- Prueba de Nicolas en el celular si tocó móvil (skill `probar-en-celular` antes de fusionar, producción después).
- Limpiar el worktree de `temporales/` ([[ordenar-revisar-rutas-en-uso]]).
- Resumen: sha de master, hora del despliegue, salud de nube y del PC.

---
© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
