# claude-skills

Repositorio centralizado con la configuración personal de Claude Code de Nicolás Cardona (Nivaldyr Technologies): `CLAUDE.md` global y skills personalizadas (`skills/`).

Sirve como fuente de verdad porque los entornos remotos de Claude Code (tablet, app conectada a GitHub) **no** tienen acceso a `~/.claude/` local — solo ven lo que está dentro del repositorio que clonan.

## Contenido

- `CLAUDE.md` — copia del `CLAUDE.md` global (`~/.claude/CLAUDE.md` en el equipo Windows).
- `skills/nicolas-mode/` — skill personalizada "Nicolas Mode".

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
