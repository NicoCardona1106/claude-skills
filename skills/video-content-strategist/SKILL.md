---
name: video-content-strategist
description: >
  This skill should be used when the user asks to "plan video content", "create a video
  calendar", "optimize video SEO", "analyze thumbnail performance", "improve video titles",
  "schedule video production", or "build a YouTube strategy". Incluye prompts de
  ejecución visual, el stack de Reflexcam (CapCut Pro + Higgsfield, sin Veo), la guía de
  CapCut (texto a voz, subtítulos, exportar) y el flujo de carrusel sin Canva.
license: MIT + Commons Clause
metadata:
  version: 1.0.0
  author: borghei
  category: marketing
  domain: video
  updated: 2026-04-02
  tags: [video, youtube, content-calendar, thumbnail, seo, video-strategy]
---
# Video Content Strategist Skill

## Overview

Production-ready video content strategy toolkit for planning content calendars, analyzing thumbnail effectiveness, and optimizing video metadata for platform SEO. Designed for content creators, marketing teams, and video producers managing consistent video output across YouTube, TikTok, LinkedIn, and other platforms.

## Clarify First

Before planning, confirm these inputs. If any is unknown or vague, ASK — do not assume:

- [ ] **Platform(s)** — YouTube, TikTok, LinkedIn, or Instagram — sets optimal video length and SEO approach
- [ ] **Deliverable** — content calendar, thumbnail analysis, or SEO metadata optimization — selects the tool and workflow
- [ ] **Audience & content pillars** — who it's for and the pillar mix/ratios — drives calendar topics and formats
- [ ] **Posting frequency** — videos per week and planning horizon — sets the production schedule

Stop rule: ask only the 2-3 that most change the output. If the user says "just draft it," proceed and list your assumptions at the top of the artifact.

## Quick Start

```bash
# Plan a video content calendar from topics and audience data
python scripts/video_content_planner.py topics.json --weeks 8 --frequency 3

# Analyze thumbnail text and composition patterns
python scripts/thumbnail_analyzer.py thumbnails.csv

# Optimize video titles, descriptions, and tags for SEO
python scripts/video_seo_optimizer.py video_data.json --platform youtube
```

## Tools Overview

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `video_content_planner.py` | Content calendar generation | JSON with topics/audience | Weekly calendar + production schedule |
| `thumbnail_analyzer.py` | Thumbnail pattern analysis | CSV with thumbnail data | Optimization recommendations |
| `video_seo_optimizer.py` | Video metadata SEO | JSON with video details | Optimized titles, descriptions, tags |

## Workflows

### Workflow 1: Monthly Video Strategy

1. Define audience personas and content pillars in topics JSON
2. Run `video_content_planner.py` to generate 4-week calendar
3. For each planned video, run `video_seo_optimizer.py` for metadata
4. After publishing, collect thumbnail data and run `thumbnail_analyzer.py`
5. Feed learnings back into next month's planning cycle

### Workflow 2: YouTube Channel Optimization

1. Export existing video data (titles, descriptions, tags, performance)
2. Run `video_seo_optimizer.py` on underperforming videos to identify metadata gaps
3. Run `thumbnail_analyzer.py` on top vs bottom performers
4. Apply optimizations to existing videos and use patterns for new content

### Workflow 3: Multi-Platform Video Strategy

1. Create topics JSON with platform-specific audience data
2. Run `video_content_planner.py` with `--platforms youtube,tiktok,linkedin`
3. Get platform-adapted content recommendations
4. Optimize each platform's metadata with `video_seo_optimizer.py`

## Reference Documentation

See `references/video-strategy-guide.md` for comprehensive frameworks covering:
- Content pillar strategy
- Platform-specific best practices
- Thumbnail design principles
- Video SEO fundamentals
- Production workflow optimization

## Common Patterns

### Pattern: Topics JSON Format
```json
{
  "channel": "TechStartupTV",
  "audience": {
    "primary": "SaaS founders, 25-45",
    "interests": ["startup growth", "fundraising", "product development"],
    "pain_points": ["scaling teams", "finding product-market fit", "managing burn rate"]
  },
  "content_pillars": [
    {"name": "Founder Stories", "ratio": 0.3, "format": "interview", "avg_length_min": 25},
    {"name": "Tactical Guides", "ratio": 0.4, "format": "tutorial", "avg_length_min": 12},
    {"name": "Industry Analysis", "ratio": 0.2, "format": "commentary", "avg_length_min": 8},
    {"name": "Behind the Scenes", "ratio": 0.1, "format": "vlog", "avg_length_min": 5}
  ],
  "topics": [
    {"title": "How We Hit $1M ARR", "pillar": "Founder Stories", "priority": "high"},
    {"title": "5 Pricing Strategies That Work", "pillar": "Tactical Guides", "priority": "high"},
    {"title": "AI in SaaS: 2026 Trends", "pillar": "Industry Analysis", "priority": "medium"}
  ]
}
```

### Pattern: Thumbnail CSV Format
```csv
video_id,title,views,ctr_pct,has_face,has_text,text_words,colors_dominant,emotion
V001,How to Scale,15000,8.2,yes,yes,3,red-yellow,surprise
V002,Tech Review,8500,4.1,no,yes,5,blue-white,neutral
```

### Platform Video Length Guidelines

| Platform | Optimal Length | Max Recommended |
|----------|---------------|-----------------|
| YouTube (standard) | 8-15 min | 25 min |
| YouTube Shorts | 30-60 sec | 60 sec |
| TikTok | 30-90 sec | 3 min |
| LinkedIn | 1-3 min | 10 min |
| Instagram Reels | 15-60 sec | 90 sec |

## Prompts de ejecución visual (listos para pegar)

El guion y la estrategia los escribe Claude, sin costo extra dentro del plan que Nicolas ya paga. Estos prompts son para la EJECUCIÓN visual (imagen o video real): se pegan en Higgsfield (MCP en Claude Code o la web higgsfield.ai), en CapCut/Dreamina, o en Meta AI / Gemini app para imagen gratis.

### Higgsfield — de una foto a banco de piezas

**1. Packshot de catálogo** — cuándo: primera pieza de un producto nuevo, fondo limpio para ficha o catálogo. Herramienta: Higgsfield.
```
Con esta foto de mi producto: packshot de catálogo. El producto centrado sobre
fondo [HUESO / BLANCO ROTO / GRIS CLARO] liso, luz de estudio uniforme, sin
sombras duras, listo para ficha de producto.
```

**2. Escena de estilo de vida** — cuándo: mostrar el producto en contexto real. Herramienta: Higgsfield.
```
Ponlo sobre [SUPERFICIE: mesa de madera / mostrador / mesón de barbería] con
luz de [MOMENTO DEL DÍA] entrando por [LADO]. Sombras largas y cálidas,
ambiente [ESTILO: cálido / minimalista / urbano].
```

**3. Animar imagen 5 s en 9:16** — cuándo: convertir una foto fija en reel sin filmar. Herramienta: Higgsfield.
```
Con esta imagen: anímala cinco segundos, formato 9:16 para Instagram/TikTok.
Movimiento suave: [LA CÁMARA SE ACERCA POCO / PANEO LATERAL LENTO], sin
deformar el producto ni la cara.
```

**4. Clip con inicio y fin fijos** — cuándo: el video debe empezar en una toma y terminar en otra (ej. antes → después). Herramienta: Higgsfield.
```
Haz un clip de cinco segundos que empiece exactamente en la primera imagen y
termine exactamente en la segunda. Transición [SUAVE / CORTE SECO], formato
9:16.
```

**5. Anuncio de 12 s con gancho** — cuándo: pieza paga o reel de venta directa. Herramienta: Higgsfield.
```
Anuncio de doce segundos, formato 9:16. El gancho: [QUÉ PASA EN EL PRIMER
SEGUNDO, una frase]. Después muestra [BENEFICIO PRINCIPAL] y cierra con
[LLAMADO A LA ACCIÓN].
```

**6. UGC reseña de 8 s** — cuándo: falta un testimonio real y se necesita una pieza tipo reseña. Herramienta: Higgsfield.
```
Video de una creadora hablando a cámara sobre este producto, de ocho segundos,
formato 9:16. Tono [CERCANO / ENTUSIASTA], menciona [UN DETALLE CONCRETO DEL
PRODUCTO O SERVICIO].
```

### Guion antes de generar imagen (tododeia)

**7. Extrae tu fórmula** — cuándo: hay 2-3 guiones o reels que ya funcionaron y se quiere repetir el patrón. Herramienta: Claude.
```
Te voy a pegar 3 guiones de contenido que me funcionaron bien: [PEGA LOS 3
GUIONES]. Analízalos y dime: ¿cuál es la estructura que se repite (gancho,
desarrollo, cierre)? Dame la fórmula en pasos.
```

**8. B-roll desde el guion** — cuándo: ya hay guion escrito y faltan las imágenes/clips de apoyo. Herramienta: Claude para listar escenas, Higgsfield/Meta AI/Gemini para generarlas.
```
Lee este guión: [PEGA EL GUION]. Quiero imágenes de apoyo (b-roll) para
ilustrarlo. Dame una lista de [N] escenas concretas, una por cada punto del
guion, listas para generar como imagen o clip corto.
```

**9. Mega-prompt de flujo completo** — cuándo: producir una pieza de principio a fin en una sola sesión, con revisión en cada paso. Herramienta: Claude.
```
Vamos a crear una pieza de contenido de principio a fin. Trabaja por pasos:
1) tema y gancho, 2) guion, 3) lista de b-roll, 4) prompts de Higgsfield para
cada pieza visual. Espera mi visto bueno antes de pasar al siguiente paso.
```

### Ejemplo relleno — Reflexcam (producto de un cliente)
```
Con esta foto de mi producto: packshot de catálogo. El producto (crema facial
de [CLIENTE]) centrado sobre fondo blanco roto, luz de estudio uniforme, sin
sombras duras, listo para ficha de producto e Instagram.
```

### Ejemplo relleno — barbería (antes/después de un corte)
```
Haz un clip de cinco segundos que empiece exactamente en la foto del cliente
con el corte anterior y termine exactamente en la foto con el corte nuevo.
Transición suave tipo "swipe", formato 9:16 para Reels.
```

## Stack de producción Reflexcam (2026-09)

Fuente: `notas/investigacion-capcut-higgsfield-2026-09-22.md` (Playwright + WebFetch, 2026-09-22).

| Pieza | Herramienta | Costo |
|---|---|---|
| Edición base, subtítulos automáticos, quitafondos, plantillas, 4K, uso comercial | CapCut Pro | precio solo visible logueado; agregadores citan USD 8-20/mes — confirmar en capcut.com logueado |
| Imagen y video IA (Nano Banana Pro, Kling 3.0, Seedance) | Higgsfield Plus (anual) | USD 39/mes, 1.000 créditos/mes |
| Imagen de producto/catálogo gratis | Meta AI o Gemini app | gratis |
| Voz para el guion | Texto a voz de CapCut (incluido en Pro) | incluido |
| Carrusel de Instagram | `herramientas/carrusel/carrusel.py` | gratis (herramienta propia) |

**Regla explícita: sin Veo.** Decisión de Nicolas (2026-09-22): no usar Veo de Google, aunque Higgsfield lo reexponga en su catálogo de modelos — ignorarlo.

Créditos en Higgsfield: Nano Banana Pro = 2 créditos/imagen; Kling 3.0 ≈ 14 créditos por clip de 8 s. El MCP consume créditos normales, sin los perks "ilimitado 7 días" (eso solo aplica en higgsfield.ai, no en MCP/CLI).
Instalar el MCP en Claude Code:
```
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp
```
Nota: los prompts y las imágenes que se suban viajan a la infraestructura de Higgsfield, que reenvía a los proveedores de cada modelo (ByteDance, Kuaishou, Google, etc.).

Costo combinado estimado: USD 47-59/mes ≈ COP 188.000-236.000/mes (TRM referencial ~4.000, verificar la TRM del día antes de presupuestar con el cliente).

## CapCut paso a paso (lo que Nicolas no sabe usar)

### a. Texto a voz

Fuente: [capcut.com/tools/text-to-speech](https://www.capcut.com/tools/text-to-speech) (fuente primaria, leída 2026-09-22).

En CapCut Desktop: 1) "Text" > "Add Text" y escribe o pega el guion. 2) Abre el panel "Text to speech" (Texto a voz) y elige una voz. 3) Filtra por idioma en el selector de voz y elige español. 4) "Generate speech" — el audio queda como pista de audio aparte, separada del texto en pantalla. 5) Ajusta velocidad y volumen desde el panel de audio.
En CapCut Web: "AI tools" > "Text to speech" > escribe el texto > elige voz, tono e idioma > previsualiza 5 segundos > "Generate" > descarga o úsalo directo en el proyecto.

Voces en español: la página confirma más de 200 voces IA y que el listado de idiomas incluye español, pero **no nombra las voces en español latino una por una** — no se pudo verificar cuáles son con esta fuente; hay que abrir el selector de voz dentro de la app y escuchar las opciones filtradas por idioma.
Uso comercial: la ayuda oficial confirma que el audio generado con texto a voz de CapCut sí se puede usar en publicidad, YouTube y promoción de marca, cumpliendo los términos de uso de CapCut.

### b. Subtítulos automáticos

Fuente: [capcut.com/help/auto-captions](https://www.capcut.com/help/auto-captions) (fuente primaria, leída 2026-09-22).

En CapCut Web y Desktop: selecciona el clip con audio > "Captions" > "Auto Captions" (Autosubtítulos) > elige el idioma correcto (español) > "Generate" y espera a que procese.
En CapCut Mobile: abre el proyecto > toca "Captions" en el menú inferior > elige idioma y plantilla > espera la generación y previsualiza.

Para corregir y dar estilo: toca cada línea del subtítulo generado para editar el texto, y usa el panel de estilo de texto (fuente, color, tamaño) igual que con cualquier texto de CapCut. Si falla: la ayuda oficial recomienda audio claro sin ruido de fondo, conexión estable y tener la app actualizada.

### c. Quitar fondo

Fuente: [capcut.com/tools/video-background-remover](https://www.capcut.com/tools/video-background-remover) (fuente primaria, leída 2026-09-22).

En PC: "Create project" > importar video > "Video" > "Remove BG" > "Auto removal" (espera unos segundos) > reemplaza el fondo con una imagen de IA o de la librería de CapCut > "Export".
En CapCut Web: selecciona el clip > "Smart tools" > "Remove background" > "Auto removal" (o "Chroma key" si es fondo verde/azul) > reemplaza por color, imagen o video > "Export" > "Download".

### d. Formato 9:16 y exportar 1080p/4K

Fuente: [capcut.com/tools/video-resizer](https://www.capcut.com/tools/video-resizer) (fuente primaria, leída 2026-09-22). No se encontró una página de ayuda dedicada solo a "exportar 1080p" — los pasos de exportación salen de esta misma página de resize; no se pudo verificar una página distinta.
1. "Create new" y elige el lienzo 9:16 (o el preset de Instagram/TikTok).
2. Sube el video e impórtalo al proyecto.
3. Ajusta el encuadre; si sobra espacio, rellena con color, blur o imagen de fondo.
4. "Export": elige resolución (720p/1080p/2K/4K), formato y calidad.
5. Exporta y descarga, o comparte directo a TikTok/Instagram.

### e. Reel de 15-30 s en 8 pasos (flujo mínimo)

1. Importar los clips a la línea de tiempo.
2. Recortar cada clip a lo esencial.
3. Escribir el guion como texto y generar la voz con texto a voz, o grabar voz propia.
4. Generar subtítulos con "Auto Captions" en español.
5. Corregir y dar estilo a los subtítulos.
6. Añadir música de la librería de CapCut.
7. Revisar el formato 9:16 y exportar en 1080p.
8. Subir a Reels y a TikTok.

## Carrusel sin Canva

1. Planear la estructura con la skill `ig-carousel-planner` (ya instalada): gancho, slides de valor y slide de cierre.
2. Escribir el resultado en un archivo `.md`, una diapositiva por bloque separado con `---`.
3. Generar los PNG con la identidad de Reflexcam:
```
python herramientas/carrusel/carrusel.py entrada.md
```
   Genera PNG de 1080×1350. Uso completo en `herramientas/carrusel/README.md`; el ejemplo `ejemplo.md` sale en 1,5 s.
4. Subir a Instagram en orden (01.png, 02.png, ...) y usar la skill `ig-hashtag-strategist` para los hashtags.
