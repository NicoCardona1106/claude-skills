---
name: exportar-pdf
description: "Exportar a PDF un artefacto de claude.ai, un HTML o un Markdown para enviarlo a un cliente o socio: HTML imprimible centrado y sin sidebar, servido por http local, PDF generado con Playwright (page.pdf). Usar cuando Nicolas diga 'pásame esto a PDF', 'genera el PDF de la propuesta', '/exportar-pdf', o pida el PDF de un artefacto, HTML o Markdown. Incluye comprobar el PDF resultante (páginas, cortes). Leer, unir o editar PDFs existentes es de la skill pdf."
---

# Exportar a PDF

Los artefactos para presentar van centrados y SIN sidebar — un PDF con la
navegación de la app pegada se ve a medio terminar.

## Cuándo

Un artefacto de claude.ai, un HTML o un Markdown que hay que convertir en PDF
para mandarlo a un cliente o socio (propuesta, cotización, reporte).

## Preparar el HTML imprimible

1. **Obtener el HTML.** Si es un artefacto de claude.ai, léelo con la acción
   `read` de la herramienta Artifact y guárdalo como archivo `.html` en
   disco (esa acción solo existe en sesiones de claude.ai/Claude Code con
   artefactos; si estás en el CLI local sin esa herramienta, guarda el HTML
   del artefacto a mano en disco).
2. **Quitar sidebar/navegación y centrar.** El PDF es un documento, no una
   app: elimina menús laterales, botones de navegación, headers fijos; el
   contenido va centrado en un contenedor con ancho máximo (ej.
   `max-width: 800px; margin: 0 auto;`).
3. **CSS de impresión:**

```css
@page {
  size: A4;
  margin: 18mm 16mm;
}

@media print {
  body { margin: 0; }
  .sidebar, .nav, nav, .no-print { display: none !important; }
  .tarjeta, .card, section { page-break-inside: avoid; }
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

body {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
```

- `page-break-inside: avoid` en tarjetas/secciones evita que una se corte a
  la mitad entre dos páginas.
- Fuentes con fallback del sistema (`Arial`, `Segoe UI`) por si la fuente
  original no carga al imprimir.
- `print-color-adjust: exact` es obligatorio o Chrome apaga fondos y
  colores de marca al imprimir.

## Servir por http local

No uses `file://`: Chrome headless con `channel: 'chrome'` puede rendirlo,
pero fuentes, rutas relativas y fetch de assets fallan silenciosamente sin
un origen http. Sirve la carpeta con `python -m http.server 8080` (o `npx
serve`) y apunta el script al `http://localhost:8080/archivo.html`.

## Generar el PDF

Playwright no está instalado globalmente — vive en la caché de npx en
`C:\Users\NICO-C\AppData\Local\npm-cache\_npx\86170c4cd1c5da32\node_modules`
(verifica con `ls` que existe; si hay varios hashes, cualquiera con
`node_modules/playwright` sirve). Los binarios de Chromium no están
descargados, así que se lanza con `channel: 'chrome'`. Se ejecuta con:

```
NODE_PATH="C:\Users\NICO-C\AppData\Local\npm-cache\_npx\86170c4cd1c5da32\node_modules" node exportar.cjs http://localhost:8080/propuesta.html propuesta.pdf A4
```

Script completo (`exportar.cjs`):

```js
#!/usr/bin/env node
// Genera un PDF desde una página servida por http local.
// Uso: NODE_PATH="<ruta-cache-npx>/node_modules" node exportar.cjs <url> <salida.pdf> [A4|Letter]

const { chromium } = require('playwright');

const url = process.argv[2];
const salida = process.argv[3] || 'salida.pdf';
const formato = process.argv[4] || 'A4';

if (!url) {
  console.error('Uso: node exportar.cjs <url> <salida.pdf> [A4|Letter]');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    const respuesta = await page.goto(url, { waitUntil: 'networkidle' });
    if (!respuesta || !respuesta.ok()) {
      throw new Error(`goto falló: status ${respuesta ? respuesta.status() : 'sin respuesta'} en ${url}`);
    }

    // page.pdf() ya renderiza con los estilos @media print — emulateMedia('print')
    // es redundante aquí, se deja comentado por si algún día se quiere previsualizar.
    // await page.emulateMedia({ media: 'print' });

    await page.pdf({
      path: salida,
      format: formato,
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
    });

    console.log(`PDF generado: ${salida}`);
  } finally {
    await browser.close();
  }
})();
```

`margin` va en `0` porque los márgenes ya los define el `@page` del CSS —
si se ponen en los dos lados se duplican. `ignoreHTTPSErrors: true` solo
hace falta si el http local corre en HTTPS con certificado propio.

## Verificar

1. Abre el PDF y revisa a ojo que no falte ninguna sección (los reveals con
   `opacity:0` en el HTML original a veces quedan invisibles si el CSS de
   impresión no los fuerza a `opacity:1`).
2. Extrae texto con `pdftotext -layout salida.pdf -` (viene con Git Bash;
   verificado que es xpdf 4.00, NO poppler — no trae `pdfinfo` ni `-bbox`,
   pero `-layout` sí funciona y está en el PATH tanto de Git Bash como de
   PowerShell). Para contar páginas sin `pdfinfo`, usa el salto de página
   (`\f`) que este `pdftotext` inserta al final de CADA página (incluida la
   última, verificado con un PDF de 3 páginas → 3 `\f`, no 2):
   `pdftotext salida.pdf - | grep -c $'\f'` (en Git Bash, sin `-layout`; el
   conteo da directo el número de páginas). Para algo más (merge, tablas,
   OCR, o contar páginas de forma más directa) usa la skill `pdf`.
3. Revisa que ninguna tarjeta o tabla se corte a la mitad entre dos páginas
   — si pasa, ajusta `page-break-inside: avoid` o el tamaño del contenedor.

## Dónde guardar

Junto al proyecto, en `docs/<nombre-del-proyecto>/<archivo>.pdf` (así se
hizo con la propuesta Reflexcam, 2026-09-04: HTML imprimible servido por
http local + `page.pdf()`). Registra el artefacto entregado en
memoria/Mempalace según el flujo de `/cosecha` de nicolas-mode si fue una
pieza relevante para el proyecto.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
