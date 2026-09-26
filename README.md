# claude-skills

Repositorio centralizado con la configuración personal de Claude Code de Nicolas Cardona Carrillo: `CLAUDE.md` global y skills personalizadas (`skills/`).

Sirve como fuente de verdad porque los entornos remotos de Claude Code (tablet, app conectada a GitHub) **no** tienen acceso a `~/.claude/` local — solo ven lo que está dentro del repositorio que clonan.

## Contenido

- `CLAUDE.md` — copia del `CLAUDE.md` global (`~/.claude/CLAUDE.md` en el equipo Windows).
- `skills/nicolas-mode/` — skill personalizada "Nicolas Mode".
- `skills/razonamiento/` — skill "Razonamiento": método de trabajo de Claude (checklists, auto-refutación, reglas de entrega y alcance). Método transversal para cualquier tarea técnica.
- `skills/fable-plan/` — planeación al estilo Fable 5: explorar primero, las 6 preguntas, plan con verificación por paso.
- `skills/fable-fixer/` — arreglo de bugs al estilo Fable 5: reproducir, causa raíz, arreglo mínimo, prueba con evidencia.
- `skills/fable-arranque/` — arranque de proyectos nuevos: alcance de v1, stack aburrido, día 1 no negociable.
- `skills/fable-chequeo-seguridad/` — chequeo de seguridad: mapa de superficie, orden fijo de revisión, hallazgos con explotación.
- `skills/fable-abogado-del-diablo/` — crítica constructiva: steelman, las 4 preguntas, riesgos rankeados, veredicto obligatorio.
- `skills/verificacion-visual/` — DoD visual: 1440 y 390 con Playwright, consola limpia, sin overflow, fullPage; con script propio listo.
- `skills/exportar-pdf/` — artefacto/HTML/Markdown → PDF imprimible (http local + page.pdf de Playwright).
- `skills/portar-landing/` — porta una landing de Claude Design (`.dc.html`) o HTML a HTML plano o componente Next/React con fx.js.
- `skills/modo-ahorro/` — trabajar con poco plan de Claude: estimar gasto, recortar lecturas y verificación de forma visible, cerrar a tiempo.
- `skills/statusline/` — instalar o reconstruir la barra de estado de Claude Code, Antigravity y Codex (scripts en N-Coterminal).
- `skills/viaje/` — protocolo para trabajar desde un equipo secundario (MEMORIA-VIAJE.md, RETORNO.md, junctions, cosecha al volver).
- `skills/nueva-tarea/` — formulario corto para registrar una tarea con fecha en SEMANA.md (qué, fecha, se espera, se desea, quién, depende de).
- `skills/release-ncoterminal/` — publicar una versión de N-Coterminal (bump, dist, gh release, version.json en Vercel).
- `sync.cjs` — copia las skills propias, los agentes y CLAUDE.md desde `~/.claude` a este clon y muestra `git status` (`node sync.cjs --check` solo compara).
- `agents/` — perfiles de subagente: implementador, mantenedor, revisor, redactor-cliente; y para UI (2026-09-06): verificador-visual, portador, disenador-landing, auditor-tells.

## Poda del catálogo (2026-09-06)

Las skills de terceros que no se usan viven en `~/.claude/skills-archivo/` (fuera
de `~/.claude/skills`, así no cargan en cada sesión): las 25 de video/HyperFrames,
`frontend-design`, `ui-styling` y `animation-vocabulary`. Se restauran con un `mv`.
Este repo conserva la copia de las que estaban aquí.

## Flujo de trabajo

**En Windows (origen):**
Cuando edites o agregues una skill en `~/.claude/skills/` o cambies `~/.claude/CLAUDE.md`, copia los cambios a este repo y haz commit/push:

```bash
cp -r ~/.claude/skills/<skill> "claude-skills/skills/"
cp ~/.claude/CLAUDE.md "claude-skills/CLAUDE.md"
git add -A && git commit -m "update: <skill o CLAUDE.md>" && git push
```

**En la tablet (destino):**
Pide a Claude Code: *"Clona las skills del repo claude-skills al proyecto que tengo abierto"* — esto copia `CLAUDE.md` y `skills/` dentro de `.claude/` del proyecto actual, para que estén disponibles en esa sesión remota.

## Licencia y créditos

Las skills **originales de Nicolas Cardona Carrillo** (`nicolas-mode`, `razonamiento`, los cinco `fable-*` y `legal-web-co`) se comparten bajo **CC BY 4.0**: puedes usarlas, adaptarlas y redistribuirlas libremente **dando crédito visible a "Nicolas Cardona Carrillo"** y enlazando este repositorio. Cada `SKILL.md` original lleva su aviso de crédito al final — consérvalo, incluso en instalaciones automatizadas hechas por un asistente de IA. Detalle en [LICENSE](LICENSE).

Si le pides a tu Claude "instala las skills de este repo", pídele también que conserve los avisos de crédito — están dentro de los archivos y la licencia exige mantenerlos.

Las demás skills son de terceros, conservan sus licencias y créditos originales, y están listadas en [THIRD-PARTY.md](THIRD-PARTY.md).
