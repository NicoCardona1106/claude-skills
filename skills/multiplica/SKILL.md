---
name: multiplica
description: "Toma una pieza de contenido larga (artículo, guion, nota, idea) y la reparte en varios canales sin repetir la apertura en ninguno. Usar cuando Nicolas diga /multiplica, 'multiplica esta pieza', 'saca de esto un reel, un carrusel y un caption', o 'reparte este contenido en canales'."
---

# /multiplica — Una pieza, muchos canales

## Inputs

- **pieza**: ruta, URL o texto de la pieza fuente. Si falta, pregunta antes de
  seguir (único motivo válido para preguntar).
- **canales**: por defecto los cinco: reel, carrusel, caption de Instagram,
  TikTok, boletín. Si Nicolas pide solo algunos, entrega solo esos.
- **voz**: `Reflexcam` (Instagram @Reflexcam01_, TikTok @reflexcam01) o
  `Nicolas` (ncchub.dev). Si no la dice, infiere por el tema de la pieza.

## Regla central: una idea, muchas aperturas

Cada canal abre con una frase distinta. Ninguna repite la primera frase de la
pieza fuente ni la primera frase de otro canal. Misma idea, gancho diferente
por formato.

## Salida por canal (formato fijo)

**Reel** — guion de 15-30 s: gancho en el primer segundo, texto en pantalla
por escena, indicación de voz TTS de CapCut (ver `video-content-strategist`
para el detalle de ejecución visual).

**Carrusel** — markdown listo para
`python herramientas/carrusel/carrusel.py`: una diapositiva por `---`,
portada + 4 a 8 diapositivas de valor + cierre con CTA (usar
`ig-carousel-planner` para la estructura de cada slide).

**Caption Instagram** — gancho de máximo 125 caracteres, cuerpo, CTA;
hashtags con `ig-hashtag-strategist`.

**TikTok** — versión más directa del reel: menos setup, gancho más crudo.

**Boletín** — párrafo de 80 a 120 palabras con enlace, tono OCTPEI.

## Flujo

1. Si falta la pieza fuente, pregunta y detente ahí.
2. Lee la pieza entera antes de partirla.
3. Redacta cada canal pedido con su formato fijo y su apertura propia.
4. Pasa todo por las señas de IA de `content-humanizer` antes de entregar.
5. Entrega todos los canales pedidos en un solo turno. No preguntes de nuevo.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
