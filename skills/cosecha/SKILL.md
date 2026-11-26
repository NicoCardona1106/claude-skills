---
name: cosecha
description: "Cosecha de memoria para nc-memoria (reemplaza a Mempalace, 2026-10-31) con confirmación humana (flujo A→E estilo Aprende): escanea la sesión, propone candidatos con confianza, deduplica contra nc-memoria y SOLO propone a su bandeja lo que Nicolas apruebe (se vuelve memoria al aprobarlo en NCT2). Usar cuando Nicolas diga /cosecha, 'guarda lo aprendido', 'cosecha la sesión', 'cierra la sesión', con --review para la poda mensual de la memoria, y SIEMPRE al llegar al 40-45 % del contexto (resumen en notas/sesiones, SEMANA al día y pedir sesión nueva)."
---

# /cosecha — Guardar lo aprendido, con confirmación

Destino único (Nicolas 2026-10-31): **nc-memoria**. Desde F4-2 (RF-50 y D-F3-8 del SRS de nc-memoria) la cosecha
**propone, no escribe**: cada candidato aprobado en el chat va a `nc-memoria/bandeja/` con
`nc-memoria.cjs proponer` (autor `claude`), y solo se vuelve memoria cuando Nicolas lo aprueba en la bandeja de
N-Coterminal (NCT2), que es el único que aplica. **Nunca edites `hechos/legado/*.md` ni `MEMORY.md`**: el índice
`MEMORY.md` lo genera nc-memoria solo (`herramientas/memory-md.cjs`) tras cada commit. Lo único que se escribe
directo es el resumen de sesión en `hechos/sesiones/` (no es memoria que se apruebe). **Mempalace ya no se escribe.**

Regla de oro: **nada sale a la bandeja antes del paso D.** Mejor un falso
negativo que cristalizar una regla equivocada. Tú propones, Nicolas decide (dos veces: en el chat y en NCT2).

## Paso A — Escanear

Relee la sesión completa en silencio marcando 5 señales:

1. Correcciones explícitas de Nicolas ("no, así no", "prefiero que...")
2. Secuencias error → arreglo (qué falló y cómo se resolvió de verdad)
3. Reintentos repetidos del mismo tipo (patrón de fricción)
4. Explicaciones de Nicolas sobre su razonamiento o contexto de negocio
5. Workflows paso a paso que se descubrieron o definieron

## Paso B — Generar candidatos (máximo 15)

Por cada señal, un candidato con:

- **Categoría**: `preferencia` | `lección` | `hecho` | `workflow` | `decisión`
- **Título** corto
- **Destino**: la clave de la propuesta = nombre del archivo en `hechos/legado/` sin `.md` (`<proyecto>` existente →
  `editar`; uno nuevo con frontmatter name/description/type y `metadata.project` de `hechos/_proyectos.txt` → `crear`).
  No hay línea de `MEMORY.md` que proponer: se genera sola.
- **Confianza**: alta | media | baja
- **Contenido propuesto** (1-4 líneas)

Las **lecciones** van SIEMPRE en formato Reflexion:

```
QUÉ PASÓ: [el error o fricción concreta]
POR QUÉ: [la causa real, no el síntoma]
CÓMO EVITARLO: [la regla accionable]
SEÑAL DE DETECCIÓN: [cómo darse cuenta a tiempo la próxima vez]
```

## Paso C — Deduplicar y buscar lo que queda viejo

Un hecho que CAMBIA (versión, horario, estado, decisión revertida) casi nunca se parece al viejo, así que se busca
por TEMA, no por texto. Por cada candidato:

1. **Obligatorio:** `node nc-memoria/herramientas/nc-memoria.cjs dedupe "<tema>" [--tipo estado --proyecto <slug>]`
   (RF-49: palabras + significado) y copia sus líneas «↺ reemplaza a [id]» tal cual; las que dicen «probable» se
   presentan como duda («confírmalo»). Complemento: grep en `nc-memoria/hechos/legado/*.md` y `SEMANA.md`. Si hay solape:
   `⚠ solapa con [archivo]: [diferencia]`.
2. Lista cada línea que el candidato **contradice o deja viejo**: `↺ reemplaza a [archivo:línea]: [qué decía]` (esta forma
   es para lo que encuentre el grep, p. ej. SEMANA; lo de `dedupe` va con su `↺ reemplaza a [id]` tal cual).
3. Si el candidato toca una memoria que ya existe o un estado de proyecto,
   `node nc-memoria/herramientas/nc-memoria.cjs comprobar` con `--hecho legado/<clave>` y/o `--proyecto <slug>` muestra si hoy
   ya hay dos versiones vivas de lo mismo (código 1): arréglalo en la misma propuesta. El id es `legado/<clave>`, no el
   id de la propuesta. (No se corre al final: lo propuesto no está aplicado hasta que Nicolas lo aprueba en NCT2.)

Nicolas decide si es duplicado, actualización o algo nuevo. Aprobar un candidato
con `↺` aprueba también marcar como `[RETIRADA]` las líneas que reemplaza (salvo `keep N`).

## Paso D — Confirmar

Presenta la lista numerada (candidato, categoría, destino, confianza, solapes)
y espera la respuesta. Acepta: números (`1,3,5`), rangos (`1-4`), `all`, `none`,
`edit N: <texto>`, `drop low` (descarta confianza baja), `skip N`,
`keep N` (guarda N sin retirar lo que marcó con ↺).

## Paso E — Proponer

Solo lo aprobado, una propuesta por archivo de destino. `proponer --texto` lleva el archivo COMPLETO como debe
quedar (la propuesta reemplaza el archivo entero al aprobarse):

```
# 1. Arma el texto completo en un archivo temporal (scratchpad), partiendo del archivo vigente si existe.
# 2. Propón (crear = archivo nuevo, editar = existente; sustituye los marcadores y elige una acción):
# Una sola línea funciona en PowerShell y Bash; conserva las comillas de las rutas con espacios.
node nc-memoria/herramientas/nc-memoria.cjs proponer --accion crear|editar --clave <nombre-sin-.md> --autor claude --motivo "<candidato N: por qué>" --texto "<archivo-temporal>"
# Retirar un archivo entero (raro: casi siempre es editar con [RETIRADA]):
node nc-memoria/herramientas/nc-memoria.cjs retirar --clave <nombre> --autor claude --motivo "<por qué>"
```

(Con el MCP de nc-memoria conectado, la herramienta `proponer` hace lo mismo.)

- Hecho de un proyecto → `editar` su archivo; en el texto se REEMPLAZA el bloque «Estado actual», no se apila.
- Preferencia o lección nueva → `crear` con frontmatter (`type: feedback` con **Why:** y **How to apply:**).
- Por cada `↺` aprobado → la corrección va en la MISMA propuesta del archivo viejo (`editar`). Si el rastro
  importa, dejar la línea como `[RETIRADA <fecha>: <motivo>]` dentro del archivo, nunca retirar el archivo entero.
- Varios candidatos sobre el mismo archivo → UNA propuesta con todos (dos `editar` del mismo archivo chocan por
  `hash_antes` y NCT2 rechaza la segunda).
- Las rutas `nc-memoria/herramientas/...` son relativas a `nc-workspace` (corre desde ahí).
- Si `proponer` falla (`tope:`, `clave:`; `editar` de una clave que solo tiene un `crear` pendiente en la bandeja
  da «no existe»: avisa a Nicolas que apruebe o reemplace esa en NCT2) o sale con código 2 (datos sensibles →
  cuarentena, no se sube), muéstralo tal cual; no escribas el archivo a mano como salida alternativa.
- Resumen de la sesión → `nc-workspace/notas/sesiones/<AAAA-MM-DD>-<HHMM>-<equipo>-<tema>.md` (reemplaza al diario de
  Mempalace). Desde 2026-11-04 `notas/sesiones` es un enlace a `nc-memoria/hechos/sesiones` (script
  `herramientas/unir-sesiones.cjs`, una vez por equipo): los resúmenes VIAJAN entre equipos con la sincronización.
  Sin correos de terceros (el guardia los manda a cuarentena). Hora con `date`.
  `MEMORY.md` ya le dice a cada sesión nueva que lea el resumen más reciente de esa carpeta: no hay que tocarlo.
- **Verificación final:** cada propuesta quedó en `nc-memoria/bandeja/` (la salida de `proponer` da su id) y
  ningún archivo de `hechos/legado/` cambió (`git -C nc-memoria status --short hechos/legado` sin líneas tuyas).
- Cerrar con `node nc-memoria/herramientas/sync.cjs --stop` (valida, commit y push) o dejarlo al hook de cierre, y
  reportar el resultado.
- Confirma cada propuesta con una línea («propuesta <id> · editar X» / «crear Y») y recuerda a Nicolas que las
  aprueba en la bandeja de NCT2; hasta entonces no son memoria.

## Modo `--review` (poda mensual)

1. Estado de la memoria, en este orden (todo de solo lectura):
   - `node nc-memoria/herramientas/nc-memoria.cjs revision` (RF-54): estados sin verificar, bifurcaciones, enlaces
     rotos y lecciones para retirar.
   - `node nc-memoria/herramientas/nc-memoria.cjs salud` (RF-34/RF-19): índice al día, conflictos y el grafo de notas:
     **huérfanas** (nota que ninguna otra enlaza con `[[x]]`) y **huecos** (tema enlazado desde 2 o más notas que no
     tiene nota propia). Pega sus conteos en la lista numerada del paso 2.
2. Proponer en lista numerada, con el mismo flujo de confirmación del paso D:
   - cada estado sin verificar: si sigue vigente, `nc-memoria.cjs verificar <id>` (anota sin tocar el hecho); si no,
     reescribirlo con `proponer --accion editar`;
   - resolver bifurcaciones y enlaces rotos (propuesta `editar`);
   - huérfanas: enlazarlas desde su proyecto (propuesta `editar` del archivo que debe enlazarla) o retirarlas;
   - huecos: crear la nota que falta (`proponer --accion crear`, pasa por el paso C) o corregir los enlaces;
   - contradicciones: dos notas vivas con valores distintos del mismo hecho (versión, estado, horario, precio); se
     buscan por tema con `dedupe` como en el paso C y queda viva la más reciente, confirmada contra el repo;
   - retirar lecciones (`[RETIRADA <fecha>: <motivo>]` dentro del archivo con `editar`, o `retirar` si es el archivo entero).
3. Proponer (paso E) solo lo aprobado; **nunca edites `nc-memoria/hechos/legado/*.md` a mano.** Lotes grandes (>20 propuestas; la bandeja acepta hasta 30 por autor y hora) →
   delegarlos a un subagente sonnet con contrato, según la skill `orquesta`.

Idea de huérfanas y huecos tomada de claude-obsidian (AgriciDaniel, MIT).

## Cuándo se activa

- Nicolas la invoca: `/cosecha`, `/cosecha --review`, o frases como "guarda lo
  aprendido" / "cosecha la sesión".
- nicolas-mode la OFRECE (no la ejecuta sola) cuando detecta cierre de sesión:
  despedida, "cerramos por hoy", commit final de la jornada — si hubo
  correcciones, decisiones o errores resueltos en la sesión.
- No existe señal técnica de "fin de sesión" que permita conversar (los hooks
  de SessionEnd no pueden preguntar), por eso el disparo es contextual o manual.
- **Por tamaño de la sesión (regla de Nicolas 2026-10-31):** al llegar al **40-45 % del
  contexto** (muchas lecturas grandes, más de ~100 intercambios o el primer aviso de
  compactación), detenerse y en UN mensaje: (1) guardar el resumen de la sesión en
  `nc-workspace/notas/sesiones/<AAAA-MM-DD>-<HHMM>-<equipo>-<tema>.md` (qué se hizo, estado con rutas y
  shas, pendientes numerados, siguiente paso, cuota al cierre); (2) dejar SEMANA.md al día y
  proponer (paso E) el «Estado actual» de cada proyecto tocado; (3) ofrecer esta cosecha; (4) pedir a
  Nicolas abrir una sesión nueva que arranque leyendo ese resumen. No esperar a que la
  sesión se compacte sola: se pierde agilidad y calidad.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
