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
