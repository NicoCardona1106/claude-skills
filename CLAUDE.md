# Nicolas Cardona — configuración personal de Claude Code

La identidad, perfil, reglas de veracidad, calidad, memoria/Mempalace, flujo de git y documentación obligatoria (antes documentados aquí como "NICOLAS MODE") viven ahora únicamente en la skill `nicolas-mode` (`~/.claude/skills/nicolas-mode/SKILL.md`), para no mantener dos copias sincronizadas a mano.

Si en una sesión nueva no tienes certeza de que la skill se activó, pregunta explícitamente "¿qué skills tienes disponibles?" o invócala con `/nicolas-mode`.

## Privacidad: mi correo nunca sale en peticiones

Nunca pongas mi correo (ni ningún dato mío de contacto) en el `User-Agent`, en cabeceras, en URLs ni en cuerpos de
peticiones a servicios de terceros, aunque el sitio lo pida «para contactar al bot» (p. ej. la política de Wikipedia,
Nominatim/OSM o APIs públicas). Usa un User-Agent genérico del proyecto (`NombreProyecto/1.0`) y, si el servicio
exige un contacto, pregúntame antes. Vale para scripts, crawlers, agentes y subagentes (Nicolas, 2026-11-06).
