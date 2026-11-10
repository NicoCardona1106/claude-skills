---
name: design
description: "Comprehensive design skill: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini AI), corporate identity program (50 deliverables, CIP mockups), HTML presentations (Chart.js), banner design (22 styles, social/ads/web/print), icon design (15 styles, SVG, Gemini 3.1 Pro), social photos (HTML→screenshot, multi-platform). Actions: design logo, create CIP, generate mockups, build slides, design banner, generate icon, create social photos, social media images, brand identity, design system. Platforms: Facebook, Twitter, LinkedIn, YouTube, Instagram, Pinterest, TikTok, Threads, Google Ads."
argument-hint: "[design-type] [context]"
license: MIT
metadata:
  author: claudekit
  version: "2.1.0"
---

# Design

Unified design skill: brand, tokens, UI, logo, CIP, slides, banners, social photos, icons.

## When to Use

- Brand identity, voice, assets
- Design system tokens and specs
- UI styling with shadcn/ui + Tailwind
- Logo design and AI generation
- Corporate identity program (CIP) deliverables
- Presentations and pitch decks
- Banner design for social media, ads, web, print
- Social photos for Instagram, Facebook, LinkedIn, Twitter, Pinterest, TikTok

## Sub-skill Routing

| Task | Sub-skill | Details |
|------|-----------|---------|
| Brand identity, voice, assets | `brand` | External skill |
| Tokens, specs, CSS vars | `design-system` | External skill |
| shadcn/ui, Tailwind, code | `ui-styling` | External skill |
| Logo creation, AI generation | Logo (built-in) | `references/logo-design.md` |
| CIP mockups, deliverables | CIP (built-in) | `references/cip-design.md` |
| Presentations, pitch decks | Slides (built-in) | `references/slides.md` |
| Banners, covers, headers | Banner (built-in) | `references/banner-sizes-and-styles.md` |
| Social media images/photos | Social Photos (built-in) | `references/social-photos-design.md` |
| SVG icons, icon sets | Icon (built-in) | `references/icon-design.md` |

## Logo Design (Built-in)

55+ styles, 30 color palettes, 25 industry guides. Gemini Nano Banana models.

### Logo: UNICIDAD OBLIGATORIA (regla de Nicolas, 2026-11-09)

Un logo o una tipografía de marca que se parezca a otra existente se descarta, aunque sea «lo normal» para ese nombre.
El 9-nov el logo de Grupo NEXO (copiado de una imagen hecha con IA, palabra en Montserrat con la X destacada) resultó casi
igual al de NEXO 14, un edificio de Núcleo Constructora en la misma ciudad (Pereira). Pasos antes de entregar cualquier logo:

1. **Buscar lo que ya existe** con el mismo nombre o uno parecido: web (nombre + sector, nombre + ciudad del cliente,
   nombre + «logo»), proyectos inmobiliarios, apps en las tiendas y marcas registradas (SIC en Colombia). Mirar los logos
   encontrados, no solo los nombres, y guardar las capturas de los más cercanos.
2. **La palabra no va escrita tal cual en una fuente de catálogo** (Montserrat, Poppins, Inter, Lato, Gotham, Futura y
   parecidas): letras dibujadas o modificadas a propósito, con al menos un rasgo propio que no salga de la fuente.
3. **Nada de la jugada obvia** del nombre (la X cruzada de «nexo», la O como círculo, la hoja verde para «eco»…). Si la idea
   del concepto es la obvia, buscar la segunda o tercera lectura.
4. **Una referencia del cliente o una imagen de IA es un punto de partida, nunca el logo.** No se calca.
5. **Comparar antes de entregar:** una tabla con nuestra propuesta frente a las 2-3 marcas más cercanas (forma, letra,
   color y concepto) y una frase sobre por qué no se confunden. Si alguna se confunde, otra ronda.
6. Si el nombre ya está registrado en las clases del negocio, decirlo antes de invertir en el logo: el problema es el
   nombre y eso lo decide el cliente con su abogado.

### Logo: Generate Design Brief

```bash
python3 ~/.claude/skills/design/scripts/logo/search.py "tech startup modern" --design-brief -p "BrandName"
```

### Logo: Search Styles/Colors/Industries

```bash
python3 ~/.claude/skills/design/scripts/logo/search.py "minimalist clean" --domain style
python3 ~/.claude/skills/design/scripts/logo/search.py "tech professional" --domain color
python3 ~/.claude/skills/design/scripts/logo/search.py "healthcare medical" --domain industry
```

### Logo: Generate with AI

**ALWAYS** generate output logo images with white background.

```bash
python3 ~/.claude/skills/design/scripts/logo/generate.py --brand "TechFlow" --style minimalist --industry tech
python3 ~/.claude/skills/design/scripts/logo/generate.py --prompt "coffee shop vintage badge" --style vintage
```

**IMPORTANT:** When scripts fail, try to fix them directly.

After generation, **ALWAYS** ask user about HTML preview via `AskUserQuestion`. If yes, invoke `/ui-ux-pro-max` for gallery.

## CIP Design (Built-in)

50+ deliverables, 20 styles, 20 industries. Gemini Nano Banana (Flash/Pro).

### CIP: Generate Brief

```bash
python3 ~/.claude/skills/design/scripts/cip/search.py "tech startup" --cip-brief -b "BrandName"
```

### CIP: Search Domains

```bash
python3 ~/.claude/skills/design/scripts/cip/search.py "business card letterhead" --domain deliverable
python3 ~/.claude/skills/design/scripts/cip/search.py "luxury premium elegant" --domain style
python3 ~/.claude/skills/design/scripts/cip/search.py "hospitality hotel" --domain industry
python3 ~/.claude/skills/design/scripts/cip/search.py "office reception" --domain mockup
```

### CIP: Generate Mockups

```bash
# With logo (RECOMMENDED)
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo /path/to/logo.png --deliverable "business card" --industry "consulting"

# Full CIP set
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo /path/to/logo.png --industry "consulting" --set

# Pro model (4K text)
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TopGroup" --logo logo.png --deliverable "business card" --model pro

# Without logo
python3 ~/.claude/skills/design/scripts/cip/generate.py --brand "TechFlow" --deliverable "business card" --no-logo-prompt
```

Models: `flash` (default, `gemini-2.5-flash-image`), `pro` (`gemini-3-pro-image-preview`)

### CIP: Render HTML Presentation

```bash
python3 ~/.claude/skills/design/scripts/cip/render-html.py --brand "TopGroup" --industry "consulting" --images /path/to/cip-output
```

**Tip:** If no logo exists, use Logo Design section above first.

## Slides (Built-in)

Strategic HTML presentations with Chart.js, design tokens, copywriting formulas.

Load `references/slides-create.md` for the creation workflow.

### Slides: Knowledge Base

| Topic | File |
|-------|------|
| Creation Guide | `references/slides-create.md` |
| Layout Patterns | `references/slides-layout-patterns.md` |
| HTML Template | `references/slides-html-template.md` |
| Copywriting | `references/slides-copywriting-formulas.md` |
| Strategies | `references/slides-strategies.md` |

## Banner Design (Built-in)

22 art direction styles across social, ads, web, print. Everything needed lives in this skill: `references/banner-sizes-and-styles.md` (all sizes and styles), `scripts/banner/export.py` (HTML → PNG at exact size) and `scripts/banner/visual.py` (optional AI background).

### Banner: Workflow

1. **Requirements** — purpose (social cover, ad, web hero, print), platform or custom size, headline/subtext/CTA/logo, brand (look for `docs/brand-guidelines.md` or the project's tokens), style, how many options (default 3). Ask only what the request leaves open.
2. **Art direction** — pick 2-3 complementary styles from the reference; use `ui-ux-pro-max` for palettes and type pairings. For Nicolas's own brands (Co-Axis, Reflexcam, OCTPEI, NccHUB) follow their existing identity and `nc-design`'s tells. When references help, look them up (web search, or Pinterest through the Chrome extension) and cite what you took from each.
3. **Build** — one self-contained HTML file per option with `html, body` fixed to the exact canvas size and `overflow: hidden`. Name them `{style}-{width}x{height}.html` in `assets/banners/{campaign}/` (date prefix `YYMMDD-` for time-bound campaigns).
4. **Visuals** — in order of preference: a real photo from the client or a licensed stock photo (Unsplash); a CSS/SVG composition (gradients, shapes, type as image); an AI background only when it adds something the others can't:
   ```bash
   python scripts/banner/visual.py "<scene, style, light, palette>, no text, no letters, no words" --ratio 16:9 --modelo flash -o assets/banners/{campaign}/bg.png
   ```
   `flash` for backgrounds and patterns, `pro` for detailed illustrations. Supported ratios: 1:1, 16:9, 9:16, 3:4, 4:3, 2:3, 3:2 (use the closest and crop with `object-fit: cover`). Text, CTA and logo always go on top in HTML, never inside the generated image.
5. **Export** — Chrome headless, no extra dependencies:
   ```bash
   python scripts/banner/export.py assets/banners/{campaign}/ 1500x500            # every .html in the folder
   python scripts/banner/export.py banner.html 1080x1080 --escala 2 -o out.png  # single file, retina
   ```
   It warns when a PNG goes over 5 MB (compress before uploading to social networks).
6. **Check and present** — open every PNG and look at it before showing it: nothing cut at the edges, text inside the safe zone, contrast. Then show the options side by side with style name, one-line rationale, path and size, and iterate on feedback.

### Banner: Quick Size Reference

| Platform | Type | Size (px) |
|----------|------|-----------|
| Facebook | Cover | 820 x 312 |
| Twitter/X | Header | 1500 x 500 |
| LinkedIn | Personal | 1584 x 396 |
| YouTube | Channel art | 2560 x 1440 |
| Instagram | Story | 1080 x 1920 |
| Instagram | Post | 1080 x 1080 |
| Google Ads | Med Rectangle | 300 x 250 |
| Google Ads | Leaderboard | 728 x 90 |
| Website | Hero | 1920 x 600-1080 |

### Banner: Top Art Styles

| Style | Best For | Key Elements |
|-------|----------|--------------|
| Minimalist | SaaS, tech | White space, 1-2 colors, clean type |
| Bold Typography | Announcements | Oversized type as hero element |
| Gradient | Modern brands | Mesh gradients, chromatic blends |
| Photo-Based | Lifestyle, e-com | Full-bleed photo + text overlay |
| Geometric | Tech, fintech | Shapes, grids, abstract patterns |
| Retro/Vintage | F&B, craft | Distressed textures, muted colors |
| Glassmorphism | SaaS, apps | Frosted glass, blur, glow borders |
| Neon/Cyberpunk | Gaming, events | Dark bg, glowing neon accents |
| Editorial | Media, luxury | Grid layouts, pull quotes |
| 3D/Sculptural | Product, tech | Rendered objects, depth, shadows |

### Banner: Design Rules

- Safe zones: critical content in the central 70-80% (platforms crop covers differently on mobile)
- One CTA per banner, bottom-right, min 44px height, action verb
- Max 2 fonts, min 16px body, ≥32px headline, 4.5:1 contrast
- Text under 20% of the area for ads (Meta penalizes text-heavy images)
- Print: 300 DPI, CMYK, 3-5mm bleed

## Icon Design (Built-in)

15 styles, 12 categories. Gemini 3.1 Pro Preview generates SVG text output.

### Icon: Generate Single Icon

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "settings gear" --style outlined
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "shopping cart" --style filled --color "#6366F1"
python3 ~/.claude/skills/design/scripts/icon/generate.py --name "dashboard" --category navigation --style duotone
```

### Icon: Generate Batch Variations

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "cloud upload" --batch 4 --output-dir ./icons
```

### Icon: Multi-size Export

```bash
python3 ~/.claude/skills/design/scripts/icon/generate.py --prompt "user profile" --sizes "16,24,32,48" --output-dir ./icons
```

### Icon: Top Styles

| Style | Best For |
|-------|----------|
| outlined | UI interfaces, web apps |
| filled | Mobile apps, nav bars |
| duotone | Marketing, landing pages |
| rounded | Friendly apps, health |
| sharp | Tech, fintech, enterprise |
| flat | Material design, Google-style |
| gradient | Modern brands, SaaS |

**Model:** `gemini-3.1-pro-preview` — text-only output (SVG is XML text). No image generation API needed.

## Social Photos (Built-in)

Multi-platform social image design: HTML/CSS → screenshot export with `scripts/banner/export.py`. Uses the `ui-ux-pro-max`, `brand` and `design-system` skills.

Load `references/social-photos-design.md` for sizes, templates, best practices.

### Social Photos: Workflow

1. **Analyze** — Parse prompt: subject, platforms, style, brand context, content elements
2. **Ideate** — 3-5 concepts, present via `AskUserQuestion`
3. **Design** — `brand` for context, `design-system` for tokens, `ui-ux-pro-max` for palettes and type; one HTML per idea × size
4. **Export** — `python scripts/banner/export.py <folder-or-file> <W>x<H> --escala 2`
5. **Verify** — open every exported PNG and look at it; fix layout or styling issues and re-export
6. **Report** — the design decisions and where each file is

### Social Photos: Key Sizes

| Platform | Size (px) | Platform | Size (px) |
|----------|-----------|----------|-----------|
| IG Post | 1080×1080 | FB Post | 1200×630 |
| IG Story | 1080×1920 | X Post | 1200×675 |
| IG Carousel | 1080×1350 | LinkedIn | 1200×627 |
| YT Thumb | 1280×720 | Pinterest | 1000×1500 |

## Workflows

### Complete Brand Package

1. **Logo** → `scripts/logo/generate.py` → Generate logo variants
2. **CIP** → `scripts/cip/generate.py --logo ...` → Create deliverable mockups
3. **Presentation** → Load `references/slides-create.md` → Build pitch deck

### New Design System

1. **Brand** (brand skill) → Define colors, typography, voice
2. **Tokens** (design-system skill) → Create semantic token layers
3. **Implement** (ui-styling skill) → Configure Tailwind, shadcn/ui

## References

| Topic | File |
|-------|------|
| Design Routing | `references/design-routing.md` |
| Logo Design Guide | `references/logo-design.md` |
| Logo Styles | `references/logo-style-guide.md` |
| Logo Colors | `references/logo-color-psychology.md` |
| Logo Prompts | `references/logo-prompt-engineering.md` |
| CIP Design Guide | `references/cip-design.md` |
| CIP Deliverables | `references/cip-deliverable-guide.md` |
| CIP Styles | `references/cip-style-guide.md` |
| CIP Prompts | `references/cip-prompt-engineering.md` |
| Slides Create | `references/slides-create.md` |
| Slides Layouts | `references/slides-layout-patterns.md` |
| Slides Template | `references/slides-html-template.md` |
| Slides Copy | `references/slides-copywriting-formulas.md` |
| Slides Strategy | `references/slides-strategies.md` |
| Banner Sizes & Styles | `references/banner-sizes-and-styles.md` |
| Social Photos Guide | `references/social-photos-design.md` |
| Icon Design Guide | `references/icon-design.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/logo/search.py` | Search logo styles, colors, industries |
| `scripts/logo/generate.py` | Generate logos with Gemini AI |
| `scripts/logo/core.py` | BM25 search engine for logo data |
| `scripts/cip/search.py` | Search CIP deliverables, styles, industries |
| `scripts/cip/generate.py` | Generate CIP mockups with Gemini |
| `scripts/cip/render-html.py` | Render HTML presentation from CIP mockups |
| `scripts/cip/core.py` | BM25 search engine for CIP data |
| `scripts/icon/generate.py` | Generate SVG icons with Gemini 3.1 Pro |

## Prerequisites

**Python:** This skill uses Python scripts. On Windows, use `python` instead of `python3` (e.g., `python scripts/logo/search.py` instead of `python3 scripts/logo/search.py`).

Check if Python is installed:
```bash
python3 --version || python --version
```

## Setup

```bash
export GEMINI_API_KEY="your-key"  # https://aistudio.google.com/apikey
pip install google-genai pillow
```

> **Note for Windows:** Use `python` instead of `pip` where needed (e.g., `python -m pip install ...`).

## Integration

**External sub-skills:** brand, design-system, ui-styling
**Related Skills:** ui-ux-pro-max, nc-design (Nicolas's brands), impeccable (polish)
