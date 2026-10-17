---
name: verificacion-visual
description: "Verificación visual de cualquier UI web antes de entregarla (parte de la DoD de nc-design/nicolas-mode): prueba en 1440 y 390, consola limpia, cero overflow horizontal, formularios y estados, captura fullPage. Usar cuando Nicolas diga 'verifica la landing', 'revisa visualmente', '/verificacion-visual', o antes de cerrar cualquier tarea que toque UI. Es el checklist técnico de entrega, no una auditoría UX ni de accesibilidad (eso es impeccable) ni un rediseño (nc-design)."
---

# Verificación visual

Ninguna pieza de UI se entrega "a ojo". Se prueba en navegador, en dos
anchos, y se reporta con una tabla de Criterio/Estado donde los ❌ no se
esconden (regla de nicolas-mode).

## Cuándo

Cualquier UI web (landing, dashboard, artefacto HTML) antes de entregarla o
cerrar la tarea. Es parte de la Definition of Done: no se muestra el
resultado a Nicolas sin haber pasado por aquí.

## Procedimiento

1. **Servir si es local.** Nunca `file://` con el Playwright MCP (no lo
   abre) ni de forma confiable con `page.pdf()`/certificados: sirve la
   carpeta con `python -m http.server 8080` o `npx serve` y navega a
   `http://localhost:8080`. Arráncalo en segundo plano, anota su PID y
   ciérralo al final SOLO por ese PID (ver «Servidor local por PID»).
2. **Dos viewports obligatorios: 1440 y 390.** Repite todo el procedimiento
   en cada uno.
3. **Consola limpia.** Captura errores/warnings de consola en cada viewport.
4. **Cero overflow horizontal.** Se detecta con
   `document.documentElement.scrollWidth > document.documentElement.clientWidth`.
5. **Captura `fullPage`.** Si la pieza tiene reveals en `opacity:0` (animación
   de entrada), una captura recortada a la ventana los muestra como si
   faltaran — la captura SIEMPRE debe ser `fullPage`.
6. **`reducedMotion`.** Emula `prefers-reduced-motion: reduce` para
   confirmar que la pieza no depende de la animación para ser legible.
7. **Formularios y estados.** Rellena y envía cada formulario, dispara los
   estados de error y de éxito, revisa hover/focus si son parte del diseño.
8. **Dónde quedan las capturas.** Con el MCP, caen en el cwd de la sesión
   activa salvo que el servidor arranque con `--output-dir <ruta>`. Con el
   script propio, en la carpeta de salida que le pases (por defecto
   `capturas-visual/`).

## Servidor local por PID

**El servidor se cierra por su PID, nunca por nombre.** Arráncalo en segundo
plano, anota su PID y ciérralo SOLO por ese PID al terminar:

```bash
python -m http.server 8080 >/dev/null 2>&1 &   # segundo plano
echo $!                                          # anota este PID
# ... verificar ...
kill <PID>                                       # cierra SOLO ese servidor
```

En PowerShell:

```powershell
$srv = Start-Process python -ArgumentList '-m','http.server','8080' -PassThru -WindowStyle Hidden
$srv.Id                      # anota este PID
Stop-Process -Id <PID>       # cierra SOLO ese servidor
```

NUNCA `taskkill /IM python.exe`, `Stop-Process -Name python` ni
equivalentes por nombre: matan Mempalace (servidor MCP en Python) y el
gateway de Hermes (incidente real del 2026-10-17). Si el puerto está
ocupado, usa otro puerto; no mates lo que lo ocupa.

## Con el Playwright MCP

Herramientas: `mcp__playwright__browser_navigate`, `browser_resize`,
`browser_snapshot`, `browser_take_screenshot`, `browser_console_messages`,
`browser_evaluate`, `browser_click`, `browser_wait_for`, `browser_close`,
`browser_network_requests`, `browser_run_code_unsafe` (esta última la tiene
el agente `verificador-visual`).

Límites verificados contra `@playwright/mcp` 0.0.80 instalado:

- No abre `file://` ni tiene `require` — sirve el HTML por http local primero.
- **Certificados autofirmados**: los rechaza (`ERR_CERT_AUTHORITY_INVALID`)
  con la configuración actual, sin flags. Se arregla arrancando el servidor
  MCP con `--ignore-https-errors`; si no se puede tocar esa configuración,
  usa el script propio.
- **PDF**: no expuesto con la configuración actual. Existe
  `browser_pdf_save` con `--caps=pdf`, pero llama a `page.pdf()` sin
  `printBackground` ni `format` — para un PDF de presentación usa la skill
  `exportar-pdf`, no esta herramienta.
- **Overlays de primera visita** (tour, saludo, banner de bienvenida): no
  hay herramienta de `addInitScript` por llamada, pero el servidor acepta
  `--init-script <archivo>` al arrancar. Sin ese flag, siembra
  `localStorage` con `browser_evaluate` justo después de navegar y recarga.
- **`prefers-reduced-motion`** SÍ se puede emular, pero no con una
  herramienta dedicada: usa `mcp__playwright__browser_run_code_unsafe` con
  `async (page) => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload(); }`.
  Si esa herramienta no está disponible en tu sesión, el script propio es
  el plan B.
- **Dónde caen las capturas**: en el cwd de la sesión, salvo que el MCP
  arranque con `--output-dir <ruta>`.

## Con script propio

Playwright no está instalado globalmente — vive en la caché de npx en
`C:\Users\NICO-C\AppData\Local\npm-cache\_npx\86170c4cd1c5da32\node_modules`
(verifica con `ls` que existe; si hay varios hashes, cualquiera con
`node_modules/playwright` sirve). Los binarios de Chromium no están
descargados, así que se lanza con `channel: 'chrome'` (usa el Chrome
instalado). Se ejecuta con:

```
NODE_PATH="C:\Users\NICO-C\AppData\Local\npm-cache\_npx\86170c4cd1c5da32\node_modules" node verificar.cjs http://localhost:8080 1440,390 capturas-visual
```

Script completo (`verificar.cjs`):

```js
#!/usr/bin/env node
// Verificación visual: consola limpia, overflow horizontal, fullPage, reduced motion.
// Uso: NODE_PATH="<ruta-cache-npx>/node_modules" node verificar.cjs <url> [anchos] [carpeta-salida]

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const url = process.argv[2];
const anchos = (process.argv[3] || '1440,390').split(',').map(Number);
const salida = process.argv[4] || 'capturas-visual';

if (!url) {
  console.error('Uso: node verificar.cjs <url> [anchos separados por coma] [carpeta-salida]');
  process.exit(1);
}

const ALTURAS = { 1440: 900, 390: 844 };

// Ruido conocido que no es un fallo real (favicon 404, estado local de dev tools).
const RUIDO = /favicon|\.image-slots\.state\.json/;

async function verificarViewport(browser, ancho) {
  const alto = ALTURAS[ancho] || 900;
  const context = await browser.newContext({
    viewport: { width: ancho, height: alto },
    ignoreHTTPSErrors: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  const consola = [];
  page.on('console', (msg) => {
    const tipo = msg.type();
    if (tipo !== 'error' && tipo !== 'warning') return;
    // El 404 de favicon.ico NO trae "favicon" en msg.text() (solo un genérico
    // "Failed to load resource..."), pero sí en msg.location().url — hay que
    // revisar los dos campos o el filtro nunca coincide.
    if (RUIDO.test(msg.text()) || RUIDO.test(msg.location().url)) return;
    consola.push(`[${tipo}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => consola.push(`[error] ${err}`));

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );

  fs.mkdirSync(salida, { recursive: true });
  const archivo = path.join(salida, `${ancho}.png`);
  await page.screenshot({ path: archivo, fullPage: true });

  await context.close();

  return { ancho, consolaLimpia: consola.length === 0, errores: consola, overflow, archivo };
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const resultados = [];
    for (const ancho of anchos) {
      resultados.push(await verificarViewport(browser, ancho));
    }

    console.log('\n=== Resumen verificación visual ===');
    for (const r of resultados) {
      console.log(`\nViewport ${r.ancho}px`);
      console.log(`  Consola limpia: ${r.consolaLimpia ? 'OK' : 'FALLO'}`);
      if (!r.consolaLimpia) r.errores.forEach((e) => console.log(`    - ${e}`));
      console.log(`  Overflow horizontal: ${r.overflow ? 'FALLO (hay overflow)' : 'OK'}`);
      console.log(`  Captura: ${r.archivo}`);
    }

    const huboFallo = resultados.some((r) => !r.consolaLimpia || r.overflow);
    process.exitCode = huboFallo ? 1 : 0;
  } finally {
    await browser.close();
  }
})();
```

El script cubre consola (errores y warnings, filtrando el ruido conocido de
favicon y `.image-slots.state.json`), overflow, `fullPage` y `reducedMotion`
de forma automática. `reducedMotion` va como opción de `browser.newContext`,
no de `page` — `emulateMedia` para reduced motion solo existe en `Page`, no
en `BrowserContext`. Formularios y estados (paso 7) siguen siendo manuales:
agrega `page.click(...)` / `page.fill(...)` antes de la captura de cada
viewport según lo que tenga la pieza.

## Reporte

Tabla por viewport, ejemplo:

| Criterio (1440px) | Estado |
|---|---|
| Consola limpia | ✅ |
| Sin overflow horizontal | ✅ |
| Formularios funcionan | ✅ |
| Estado de error visible | ❌ (el mensaje no aparece al enviar vacío) |

| Criterio (390px) | Estado |
|---|---|
| Consola limpia | ✅ |
| Sin overflow horizontal | ❌ (tabla de precios se sale 40px) |
| Formularios funcionan | ✅ |
| Estado de error visible | ❌ |

Los ❌ se reportan siempre, con la causa concreta — nunca se ocultan ni se
suavizan. El script filtra de la consola el ruido conocido (favicon 404,
`.image-slots.state.json`) para que no cuente como fallo falso; el 404 de
favicon no trae la palabra "favicon" en `msg.text()` (verificado: Chrome solo
dice "Failed to load resource..."), así que el filtro revisa también
`msg.location().url`, donde sí aparece. Si aparece otro mensaje repetitivo
sin relación con el bug real, dilo en el reporte en vez de silenciarlo a mano.

## Ciclo corregir → volver a verificar (tope de 3 vueltas)

Un ❌ no se entrega como «casi listo»: se corrige y se vuelve a correr la
verificación COMPLETA en los dos anchos (un arreglo a 390 suele romper
1440). Una vuelta = corregir + verificar + tabla nueva.

- **Vueltas 1 y 2:** corregir la causa concreta de cada ❌ y repetir el
  procedimiento entero, no solo el punto que falló.
- **Vuelta 3 con ❌:** parar. Entregar la última tabla con los ❌ que quedan,
  qué se intentó en cada vuelta y por qué no cierra (depende de contenido
  real, de un componente de terceros, de una decisión de diseño). Decide el
  director o Nicolas; no hay cuarta vuelta automática.
- Si verifica el agente `verificador-visual` (no edita), el ciclo lo lleva
  el director: el arreglo va al constructor, la re-verificación vuelve al
  verificador y el director cuenta las vueltas (ciclo de `orquesta`).
- Formularios y flujos se prueban con cuentas y datos de prueba, nunca con
  cuentas reales de Nicolas o de un cliente: un envío de prueba es un envío
  real.

## Delegar

Si existe el agente `verificador-visual` en `~/.claude/agents/`, delégale
esta verificación en vez de gastar contexto propio en capturas. Pásale: la
URL (ya servida), los viewports (`1440,390`), y los criterios de aceptación
de la tarea (qué formularios, qué estados, qué overlays sembrar). El agente
debe devolver la tabla de Criterio/Estado, no solo las capturas.

El perfil vive en `~/.claude/agents/verificador-visual.md` (creado
2026-09-06). Si en otro equipo no está, sigue tú el procedimiento anterior
con el MCP o el script propio.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
