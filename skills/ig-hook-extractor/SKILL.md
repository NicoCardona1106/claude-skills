---
name: ig-hook-extractor
description: "Reverse-engineer the hook from a viral Instagram Reel or carousel, given a URL or a pasted caption. Identifies which of the 10 canonical 2026 formulas it uses (number-first, contrarian, relatable, confession, listicle, before/after, myth-buster, framework, pattern-interrupt Reel, how-I Reel), explains why it worked, names the primary goal, and returns a blank template mapped to your topic. Use to learn from a post you admire. Not for writing your own (use ig-caption-writer or ig-carousel-planner)."
---

# Instagram Hook Extractor

Paste a viral Reel or carousel URL (or the caption text). Get back: which hook
formula it uses, the exact structure, why it worked, the primary goal it chased,
and a blank template you can fill with your own voice.

## When to use

- User finds a viral Reel or carousel they want to study
- User wants to replicate a specific creator's pattern
- Before `ig-caption-writer` or `ig-carousel-planner`, to seed a draft with a
  proven shape

## Input

An Instagram URL (`/p/`, `/reel/`, or a profile) or pasted caption + slide text.
This bundle has no built-in Instagram reader, so for a URL the skill asks the
user to paste the caption (and the on-image slide text for a carousel, or a quick
description of the Reel's first 3 seconds).

## Output

- **Formula identified** (IG1-IG10 from `references/hook-formulas.md`) with a
  confidence score
- **Surface:** single image, carousel, or Reel, and why that surface fit the idea
- **Structural breakdown:**
  - The hook (caption first 125 chars / carousel slide 1 / Reel first 3 seconds)
  - Body architecture (per-slide roles for a carousel; beat order for a Reel)
  - The close (what earns the save, send, or follow)
  - Reaction-triggering devices (numbers, named entities, the open loop)
- **Primary goal** the original chased (saves / shares / comments / follows)
- **Why it worked** psychologically and algorithmically
- **Blank template** with `{slot}` markers matched to the original, ready for the
  user's topic
- **Cautions:** anything in the original that would fail a 2026 audit (em
  dashes over the cap, an AI-vocab cluster, 30 hashtags, mixed media)

## Contexto antes de crear y porqué estratégico

*Origen: idea 5 del juicio del 2026-09-28 (formato de "social media manager" visto en IG, adaptado).*

1. **Contexto antes de crear.** Antes de producir la plantilla en blanco, confirmar: nicho, audiencia,
   objetivo, plataforma/formato, monetización y estilo/voz (para llenar la plantilla con SU tema, no el del original). PRIMERO buscarlo en lo que
   ya existe: la conversación, el vault/notas del cliente, Mempalace si está disponible y las
   fichas de `clonador-de-formato`. Preguntar SOLO lo que falte, en un único mensaje con máximo
   4 preguntas. Si el usuario pide ir directo, asumir y declarar los supuestos en una línea.
2. **El porqué estratégico.** Cada análisis entregado lleva 1-2 líneas de por qué: qué objetivo persigue el gancho, a quién le habla
   y qué métrica se espera si el usuario lo replica; sin eso, la plantilla no se entrega.
   Prohibido lo genérico sin intención: si no se puede decir qué mueve, no se entrega.

## Steps

1. **Parse the URL.** `lib.url_parser.parse_instagram_url(url)` returns
   `username`, `shortcode`, `url_type`.
2. **Get the content.** Ask the user to paste the caption, and for a carousel the
   slide text, or for a Reel the first 3 seconds (on-screen text + opening line).
   (If they later wire an Apify Instagram actor, read it automatically.)
3. **Detect the surface.** Single image, carousel, or Reel.
4. **Classify against the 10 formulas** using features:
   - Caption: an odd-precision result (IG1)? a contrarian claim (IG2)? a
     relatable moment (IG3)? a first-person confession (IG4)?
   - Carousel: a numbered teaching list (IG5)? a before/after (IG6)? a
     myth/truth structure (IG7)? a named framework (IG8)?
   - Reel: a pattern interrupt in the first seconds (IG9)? a "how I" teardown
     (IG10)?
5. **Score confidence.** If two formulas fit, return the top 2 with fit scores.
6. **Extract structure.** Label each part by its role. For a carousel, map slide
   1 (the loop), the front-loaded value, and the payoff slide.
7. **Name the primary goal** the original optimized for.
8. **Generate a blank template** with `{slot}` markers matched to the original
   shape and the user's topic.
   If you also fill the hook for the user's topic: 12 words max (sayable in
   3 seconds), it must work on its own without context, and no cheap clickbait
   ("you won't believe..."), agency vocabulary, emojis, or promised money or
   results. Read it aloud: if it sounds like a template or a guru, rewrite it.
9. **Audit the source.** Flag any AI tells so the user does not copy them.

## Example

See `references/examples.md` for worked teardowns.

## Formulas reference

See `references/hook-formulas.md` for the 10 canonical Instagram formulas
with full skeletons and goal tags.

## Files

- `SKILL.md` - this file
- `references/classification-rules.md` - feature extraction + scoring heuristics
- `references/examples.md` - worked teardowns (caption, carousel, Reel)

## Related skills

- `ig-caption-writer` - use the extracted caption template to draft your own
- `ig-carousel-planner` - use the extracted carousel template
- `ig-humanizer --mode audit` - audit your draft before shipping
