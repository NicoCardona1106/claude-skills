---
name: explicador-ui
description: "Video explicador vertical 9:16 (Reels/TikTok/Stories) hecho con interfaz animada propia: objeto 3D de vidrio de arranque, una tarjeta por paso con chip, cursor que hace clic, anillos, A/B, tarjetas apiladas y subtítulo palabra por palabra con una palabra clave en color. Gratis y determinista (HTML + GSAP + Playwright + ffmpeg, herramienta herramientas/video-propio). Usar cuando Nicolas diga 'video explicador', 'reel de cómo funciona en 3 pasos', 'explícalo en video', 'video tipo interfaz animada', 'motion de la app sin grabarla', '/explicador-ui', o cuando haga falta un reel de producto y no haya app real que grabar. NO para grabar la app real (eso es direccion-creativa → demo-producto.md) ni para piezas con IA generativa."
---

# Explicador de interfaz (9:16)

Un reel de 15-40 s que explica un producto en pasos, con una interfaz dibujada a la medida y la marca del proyecto.
Se construye con `C:\Users\NICO-C\Desktop\nc-workspace\herramientas\video-propio\` (leer su `README.md`: campos del
`video.json`, comandos y reglas del motor). Esta skill pone la receta y el criterio.

**Se apoya en, sin repetirlas:**
- `direccion-creativa` → pilares (decide antes, gancho en 3 s, poco movimiento gana), lectura de `marca/marca.json`,
  dónde se entrega y las reglas de verdad (lo que se muestra existe, sin precios ni datos reales, sin testimonios).
- `direccion-creativa/references/demo-producto.md` → si la app o el boceto **ya existen**, grabarlos es más fiel.
  Este explicador sirve cuando no hay pantalla que grabar, cuando la real es fea o lenta, o como pieza de campaña.
  Se pueden mezclar: explicador para el gancho y el cierre, grabación real en el medio (unir en CapCut).
- `video-content-strategist` → guía de CapCut (texto a voz, subtítulos, exportar) y calendario.

## Cuándo sí / cuándo no
| Sí | No |
|---|---|
| «Cómo funciona X en 3 pasos», onboarding, lanzamiento de función | Testimonios o personas (eso es `direccion-creativa` → ugc, declarado) |
| Producto sin app terminada (rotular «prototipo» si se muestra UI que no existe aún) | Mostrar funciones que el producto no tendrá |
| Pieza que debe tener la marca exacta y salir igual cada vez | Video largo > 60 s o con mucha narración: grabación + CapCut |

HyperFrames es caro para Nicolas y Veo no se usa: este flujo es la opción por defecto para motion de producto.

## La receta
**Estructura:** gancho → 3 a 5 pasos → cierre con llamada. Un paso = una idea = una escena.

| Bloque | Plantilla | Duración | Qué pasa |
|---|---|---|---|
| Gancho | `intro-vidrio` | 3-4 s | Objeto de vidrio con el ícono de la marca, red de nodos, la cámara se acerca. El subtítulo dice el **resultado** para el usuario, no el nombre del producto. |
| Paso (×3-5) | `paso` | 4-5 s | Tarjeta: eyebrow «Paso N» + título (≤ 4 palabras, verbo) + sub (≤ 8 palabras) + chip («quién hace qué ahora») + contenido + 1 clic del cursor. |
| Cierre | `cierre` | 3-4 s | Logo, una frase, botón de llamada que el cursor toca. Sin precio ni URL que el dueño no haya aprobado. |

Total recomendado: 15-25 s para reel (3 pasos ≈ 21 s). Ritmo 3-5 s por idea; el subtítulo de cada escena se termina
de escribir antes de la mitad y queda quieto el resto para que se lea.

**Qué contenido para cada paso** (elige por lo que se quiere que el ojo entienda):
- `apilado` → cosas que llegan o se acumulan (paquetes, pedidos, clientes, «escalando»). Contador con check.
- `lista-anillos` → un proceso que se completa en etapas (registro → foto → aviso; visitas → carrito → compra).
- `ab` → elegir entre dos caminos o comparar dos propuestas. El cursor elige una; la otra se apaga.
No repetir el mismo contenido en dos pasos seguidos: el cambio de forma es lo que mantiene la atención.

## Lenguaje visual tokenizado (toma la marca del proyecto)
1. Leer `<proyecto>/marca/marca.json` (y la sección Diseño del `CLAUDE.md` del proyecto si existe).
2. Llenar `marca` en `video.json`:
   - `fondo` = color de marca más oscuro (si la marca es clara, oscurecerla: el explicador se lee mejor en fondo
     oscuro con tarjeta un tono más clara), `fondo2` = color de marca principal, `tarjeta`/`tarjeta2` = 1-2 pasos
     más claros que el fondo.
   - `acento` = color de la palabra clave y eyebrow; debe pasar 4,5:1 sobre el fondo (el render lo revisa).
     `acento2` = botón y chip. `exito` = checks (si el verde de marca es oscuro, subirlo un paso y anotarlo en `_nota`).
   - Fuentes de la marca vía `@fontsource` (nada de Google Fonts por red). Radios = radio de la app × 2,75.
   - Logo para fondo oscuro, ícono claro para el vidrio y un ícono blanco para el chip. Derivar del logo oficial sin
     cambiar forma ni colores (dejar comentario en el SVG de dónde sale).
3. Lo que la marca prohíbe (neón, brillos de color, etc.) manda sobre el estilo de referencia.

## Del guion a la tabla de escenas
Escribir primero la tabla (es el guion y el `video.json` a la vez) y mostrarla a Nicolas antes de renderizar si la
pieza va a un cliente:

| # | Plantilla | Dur. | Título / contenido | Clic | Subtítulo (palabra *clave*) |
|---|---|---|---|---|---|
| 1 | intro-vidrio | 3,6 | ícono de la marca | — | Tus paquetes, *recibidos* aunque no estés |
| 2 | paso · apilado | 4,6 | Recibe tu correspondencia | tarjeta del frente | Lo *recibimos* por ti en portería |
| 3 | paso · lista-anillos | 4,6 | Te avisamos | fila 3 | Te *avisamos* por WhatsApp en segundos |
| 4 | paso · ab | 4,8 | Retiras con QR | opción A | Muestras tu *QR* y listo |
| 5 | cierre | 3,4 | Tu dirección Nexo + «Pide la tuya» | botón | Pide tu dirección *Nexo* |

Reglas del subtítulo: una frase por escena, ≤ 7 palabras por línea, **exactamente una** palabra clave, voz de la marca
(español de Colombia, frases cortas). La palabra clave es el verbo o el beneficio, no un artículo. Nada de relleno de
IA («revoluciona», «sin esfuerzo», «potencia», «descubre», «en un mundo donde»): si la frase sirve para cualquier
producto, se reescribe. Los datos de ejemplo (horas, pesos, nombres de cosas) son inventados, creíbles y sin marcas
de terceros. Para el pulido del texto, `ig-humano`.

Ejemplo completo y probado: `herramientas/video-propio/ejemplos/nexo-3-pasos/video.json`.

## Hacerlo
```bash
cd C:/Users/NICO-C/Desktop/nc-workspace/herramientas/video-propio
node render.mjs <carpeta> --revisar        # checklist automática en 1 s; corregir hasta «sin avisos»
node render.mjs <carpeta> --ver            # mirar el ritmo en el navegador
node render.mjs <carpeta> --salida "<Revisiones o trabajo/...>" --png <un segundo por escena>
```
La carpeta del video va en `<proyecto>/trabajo/<AAAA-MM-DD>-explicador-<slug>/` (regla de `direccion-creativa`);
lo que espera revisión de Nicolas se copia a `Escritorio\Revisiones` o `Escritorio\Entregas`.

## Checklist de calidad (antes de entregar)
La automática (`--revisar`) cubre contraste, palabra clave, texto cortado, zona segura y red. Además, mirando los PNG:
- [ ] **Legible a 360 px**: abrir un PNG al 33 % (o en el celular). Nada menor a 30 px en el lienzo.
- [ ] **Zona segura de Reels**: nada importante en el 14 % de arriba (0-269 px) ni en el 20 % de abajo (1536-1920 px).
      El subtítulo queda dentro (1296-1496 px) y nada importante pegado al borde derecho (botones de Reels).
- [ ] Gancho entendible en 3 s sin sonido; cada paso entendible solo con el título y el contenido.
- [ ] Una palabra en acento por subtítulo, visible; ≤ 7 palabras por línea.
- [ ] Lo que se muestra existe en el producto (o se rotula «prototipo»); sin precios ni datos reales.
- [ ] El cursor no tapa el texto que toca (ajustar `en` del clic) y nunca queda flotando sobre nada.
- [ ] `ffprobe`: 1080×1920, 30 fps, h264, yuv420p, duración en rango (lo imprime el render). Dos renders = misma huella.
- [ ] Premium = detalle (`direccion-creativa`): si algo se ve plano, se corrige antes de mostrarlo.

## Terminar en CapCut (cuando haga falta voz o música)
El MP4 sale mudo a propósito. En CapCut Pro (pasos de la interfaz en `video-content-strategist` → «CapCut paso a paso»):
1. Importar el MP4 (lienzo 9:16) y el `.srt` del render: trae el texto y los tiempos de cada escena.
2. **Voz:** texto a voz con el texto del `.srt`, una pista por escena, alineada al inicio de cada línea; voz en
   español elegida escuchando. Si la voz dura más que la escena, subir `duracion` en `video.json` y volver a renderizar
   (no estirar el video en CapCut). Declarar que la voz es sintética si la plataforma lo pide.
3. **No** activar los subtítulos automáticos: el video ya los trae; duplicarlos tapa la tarjeta.
4. **Música:** de la biblioteca con licencia comercial de CapCut, a -18/-20 dB bajo la voz, con fundido al final.
5. Exportar 1080p, 30 fps. Nada se publica sin que Nicolas lo pida.

## Límites
Sin audio propio, QR ilustrativo (no se lee), render de un hilo (~1 min por cada 20 s de video). Plantillas nuevas:
seguir las reglas del motor del README (todo en la línea de GSAP, nada aleatorio sin semilla).

Autor: Nicolas Cardona Carrillo. Licencia CC BY 4.0
Origen: https://github.com/NicoCardona1106/claude-skills
