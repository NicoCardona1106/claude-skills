# claude-skills

Repositorio centralizado con la configuración personal de Claude Code de Nicolás Cardona (Nivaldyr Technologies): `CLAUDE.md` global y skills personalizadas (`skills/`).

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
