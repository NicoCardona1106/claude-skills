---
name: probar-en-celular
description: "Banco de pruebas en el celular REAL de Nicolas (S26, Chrome Android) por USB: adb forward a CDP + adb reverse para que el teléfono abra una rama del PC sin desplegar, medir alto/filas, registrar teclas del IME y capturar. Usar en cualquier arreglo de teclado, Gboard, alto con teclado abierto, toques o foco en móvil (NCT2, Nexo, NPersonal web), cuando Nicolas diga 'pruébalo en mi celular', 'míralo en el S26', '/probar-en-celular', o antes de dar por hecho un arreglo móvil que solo pasó en emulación."
---

# /probar-en-celular — la emulación no ve Gboard

Por qué existe: el 19-nov dos arreglos del Ctrl pasaron todas las pruebas emuladas y fallaron en el S26. Con este banco se
vio la causa en minutos (Gboard deja la letra en una composición abierta, ver [[gboard-composicion-abierta]]) y se midió el
alto real con el teclado abierto (6 → 30 filas). Herramientas en `nc-workspace/herramientas/celular/` (repo nc-herramientas).

## 1 · Nicolas (en el teléfono)
1. Desactiva el **Bloqueador automático** de Samsung: corta la depuración USB a los ~30 min y hay que repetirlo.
2. Conecta el cable y acepta «Permitir depuración USB». Deja el teléfono desbloqueado y con Chrome abierto.

## 2 · Conectar (Git Bash)
`bash herramientas/celular/conectar.sh [4200]`: hace `adb forward tcp:9333` al CDP del Chrome del teléfono y
`adb reverse tcp:4200` (el teléfono abre `http://127.0.0.1:4200` = el PC). `adb` vive en
`%LOCALAPPDATA%\Android\Sdk\platform-tools` y no está en el PATH. Si dice «CDP sin respuesta», el teléfono está bloqueado
o Chrome está cerrado.

## 3 · Servir la rama (NCT2)
- `powershell -File herramientas/celular/nucleo-rama.ps1 -Worktree <worktree> -Compilar`.
  - Usa :4200-4202, datos en `temporales/nct2-prueba-ctrl` y un clon de nc-memoria **sin remoto**.
  - Crea un token tipo `pc` en `token.txt`: WebAuthn no acepta 127.0.0.1, así que nada de huella.
  - Se para con `Stop-Process -Id <PID>`. El núcleo real (:4100) no se toca.
- Ese núcleo NO tiene `NCT_MILO_CENTRO`: aprobar por Milo no funciona en el banco. No copies el token que decide a un
  núcleo de prueba. Milo se prueba en producción.
- Tras recompilar, `node herramientas/celular/cdp.mjs medir recargar` actualiza el service worker; si no, sirve la
  compilación vieja.
- Para otra app (Nexo, NPersonal web): su servidor de desarrollo en un puerto y `conectar.sh <puerto>`.

## 4 · Medir y mirar (`node herramientas/celular/cdp.mjs …`)
- `pestanas` · `medir [recargar]` (filas de xterm y alto de cada zona) · `captura <png>` · `evaluar "<js>"`.
- `instalar` → Nicolas prueba → `leer`: registrador pasivo de keydown, beforeinput, composition*, foco, bytes que salen
  por el WS y visualViewport.
- `abrir-rama.mjs <token.txt>` abre la rama en su Chrome y pega el token (`LIMPIAR=1` borra antes la IndexedDB `nct2`).
- `PAGINA=<parte de la URL>` elige la pestaña. En una pestaña de fondo `click()` falla («not visible»): usa
  `evaluar` / `requestSubmit()`.
- Pide a Nicolas los estados que solo él produce, uno por mensaje («abre una sesión», «deja el teclado abierto y dime
  teclado»), y mide en ese momento.

## 5 · Cerrar
Parar el núcleo de prueba por PID. Anotar en el resumen las cifras medidas en el teléfono real, separadas de las de
emulación. Lo que en el teléfono falle se convierte en una prueba visual que falle contra el código viejo antes de
arreglarlo.

---
© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
