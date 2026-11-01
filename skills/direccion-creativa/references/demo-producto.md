# Video de demo del producto (oficio propio de Nicolas)

Para mostrar cómo funciona una app, un boceto o una web, se **graba la pantalla real**: es gratis, es fiel y no
inventa nada. La IA solo entra para planos de ambiente (la persona recibiendo el aviso, el casillero abriéndose),
y eso pasa por los oficios de campaña.

## 1. Guion antes de grabar
- Sale de los flujos del SRS del proyecto: un video = un flujo (p. ej. Nexo: suscribirse → dirección → aviso →
  retiro con QR; portero: registrar en 4 toques).
- Gancho de 3 s con el resultado («Tu paquete, avisado en segundos»), luego los pasos, cierre con la marca.
- Duración: 15-30 s para reel; 45-90 s para la demo comercial.

## 2. Grabación con Playwright
Servir por http local (nunca `file://`) y grabar con el Playwright del caché de npx
(`%LOCALAPPDATA%\npm-cache\_npx\86170c4cd1c5da32\node_modules`, no limpiarlo):

```js
// grabar-demo.cjs — NODE_PATH apuntando al caché de npx de arriba
const { chromium } = require('playwright')
;(async () => {
  const ancho = 1080, alto = 1920 // 9:16 para reel; 1920x1080 para demo horizontal
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: ancho / 2, height: alto / 2 }, deviceScaleFactor: 2,
    recordVideo: { dir: 'trabajo/video', size: { width: ancho, height: alto } } })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:8800/index.html#c-inicio')
  await page.waitForTimeout(1500)            // pausas largas: el ojo necesita leer
  await page.click('[data-go="c-retirar"]')  // un paso del guion por acción
  await page.waitForTimeout(2500)
  await ctx.close(); await browser.close()  // el .webm queda en trabajo/video
})()
```
- Movimiento del puntero lento; nada de clics seguidos sin pausa.
- Si el boceto tiene vista de presentación (guía, llamadas), grabar solo el teléfono con `locator.screenshot` o
  recortando en CapCut.

## 3. Edición en CapCut Pro
Recorte a la pantalla, zoom suave a lo que importa, subtítulos con la tipografía de la marca, música sin derechos,
voz en off (de Nicolas o TTS del proveedor, declarada), cierre con logo y llamada a la acción. Exportar 1080p.

## 4. Revisión
- Todo lo que aparece existe o se rotula «prototipo».
- Sin datos reales de clientes ni precios sin aprobar.
- Se ve premium: nada cortado, sin cursores perdidos, ritmo pausado.

## Modo «solo la app» (lo que Nicolas prefiere, 2026-10-31)
Para videos de guía y de marketing se graba **solo la pantalla de la app**, vertical 1080×1920, sin marco, notas ni
presentación. En el boceto de Nexo es `index.html?grabar=1#<pantalla>`: oculta todo menos la app y la escala al ancho
de la ventana. Script de ejemplo: `sociedad/maxxsuite/nexo/trabajo/2026-10-31-demo-producto-boceto/grabar-guias.cjs`
(un clip por tarea; se unen con `ffmpeg -f concat`). Lecciones:
- `chromium.launch({ channel: 'chrome' })`: el caché de npx no trae navegadores; el ffmpeg de Playwright se instala con
  `node <cache>/playwright/cli.js install ffmpeg` (0,1 MB).
- `viewport` y `recordVideo.size` iguales, o el video sale con la página en una esquina y fondo gris.
- Fijar el scroll de la página en modo grabación: los clics de Playwright la corren y se pierde la barra de estado.
- Pantallas con temporizadores (QR que se renueva) pueden estirar la duración del webm: recortar con `-t`.
- Convertir a MP4 para CapCut: `ffmpeg -i x.webm -c:v libx264 -pix_fmt yuv420p -crf 18 -r 30 -movflags +faststart x.mp4`.
