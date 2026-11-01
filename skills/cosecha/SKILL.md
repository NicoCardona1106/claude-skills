---
name: cosecha
description: "Cosecha de memoria para nc-memoria (reemplaza a Mempalace, 2026-10-31) con confirmación humana (flujo A→E estilo Aprende): escanea la sesión, propone candidatos con confianza, deduplica contra el palacio y SOLO escribe lo que Nicolas apruebe. Usar cuando Nicolas diga /cosecha, 'guarda lo aprendido', 'cosecha la sesión', 'cierra la sesión', con --review para la poda mensual del palacio, y SIEMPRE al llegar al 40-45 % del contexto (resumen en notas/sesiones, SEMANA al día y pedir sesión nueva)."
---

# /cosecha — Guardar lo aprendido, con confirmación

Destino único (Nicolas 2026-10-31): **nc-memoria**. La carpeta de memoria de Claude de cada equipo es una unión a
`nc-memoria/hechos/legado`, así que escribir ahí es escribir en nc-memoria; `sync.cjs` lo valida, hace commit y lo
sube (hook de cierre o `node nc-memoria/herramientas/sync.cjs --stop`). **Mempalace ya no se escribe** (queda solo
lectura hasta la migración P2 del plan de nc-memoria).

Regla de oro: **nada se escribe a la memoria antes del paso D.** Mejor un falso
negativo que cristalizar una regla equivocada. Tú propones, Nicolas decide.

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
- **Destino**: archivo de hecho en la memoria (`<proyecto>.md` existente o uno nuevo con frontmatter
  name/description/type) y su línea en `MEMORY.md`
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

`check_duplicate` solo detecta textos casi iguales. Un hecho que CAMBIA (versión,
horario, estado, decisión revertida) casi nunca se parece al viejo, y por eso
el palacio acumulaba versiones contradictorias. Por cada candidato:

1. **Obligatorio:** busca por el TEMA, no por el texto, con
   `node nc-memoria/herramientas/nc-memoria.cjs buscar "<tema>"` (palabras + significado si el equipo tiene modelo)
   y con grep en `memory/*.md`, `MEMORY.md` y `SEMANA.md`. Si hay solape: `⚠ solapa con [archivo]: [diferencia]`.
2. Lista cada línea que el candidato **contradice o deja viejo**: `↺ reemplaza a [archivo:línea]: [qué decía]`.

Nicolas decide si es duplicado, actualización o algo nuevo. Aprobar un candidato
con `↺` aprueba también retirar lo que reemplaza (salvo `keep N`).

## Paso D — Confirmar

Presenta la lista numerada (candidato, categoría, destino, confianza, solapes)
y espera la respuesta. Acepta: números (`1,3,5`), rangos (`1-4`), `all`, `none`,
`edit N: <texto>`, `drop low` (descarta confianza baja), `skip N`,
`keep N` (guarda N sin retirar lo que marcó con ↺).

## Paso E — Ejecutar

Solo lo aprobado, todo en nc-memoria (la carpeta de memoria):

- Hecho de un proyecto → su archivo; se REEMPLAZA el bloque «Estado actual», no se apila.
- Preferencia o lección nueva → archivo propio con frontmatter (`type: feedback` con **Why:** y **How to apply:**),
  y su línea en `MEMORY.md` (índice: una línea corta por hecho).
- Por cada `↺` aprobado → corregir o quitar la línea vieja en el MISMO paso. Si el rastro importa, dejarla como
  `[RETIRADA <fecha>: <motivo>]` dentro del archivo, nunca borrar el archivo.
- Resumen de la sesión → `nc-workspace/notas/sesiones/<AAAA-MM-DD>-<tema>.md` (reemplaza al diario de Mempalace).
- **Verificación final:** repetir la búsqueda del paso C por cada tema tocado; solo una versión viva de cada hecho.
- Cerrar con `node nc-memoria/herramientas/sync.cjs --stop` (valida, commit y push) o dejarlo al hook de cierre, y
  reportar el resultado.
- Confirma cada escritura con una línea, incluidas las retiradas («retirada X → Y»).

## Modo `--review` (poda mensual)

> Pendiente (P2 del plan de nc-memoria): este modo todavía describe Mempalace. Hasta migrarlo, la poda mensual se
> hace sobre `memory/*.md` con `nc-memoria.cjs salud` y las mismas reglas de retirar, no borrar.

1. `mempalace_get_taxonomy` + `mempalace_graph_stats` para ver el estado.
2. Detectar: rooms duplicados (ej. español/inglés), wings duplicadas por
   nombre, drawers obsoletas o contradictorias, rooms inflados por imports.
   Para las contradicciones, recorre cada wing con `mempalace_list_drawers`
   agrupando por tema: dos drawers vivas que den valores distintos de lo mismo
   (versión, estado, horario, precio) son una contradicción, aunque
   `check_duplicate` no las marque. Deja viva la más reciente y confírmala contra
   el repo o la memoria local.
3. Proponer en lista numerada: fusiones (mover drawers al room canónico en
   español), retiros y correcciones. Mismo flujo de confirmación del paso D.
4. Ejecutar solo lo aprobado. Fusiones grandes (>20 drawers) → delegarlas a un
   subagente sonnet con contrato, según las reglas de orquestación de nicolas-mode.

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
  `nc-workspace/notas/sesiones/<AAAA-MM-DD>-<tema>.md` (qué se hizo, estado con rutas y
  shas, pendientes numerados, siguiente paso, cuota al cierre); (2) dejar SEMANA.md y el
  «Estado actual» de cada proyecto tocado al día; (3) ofrecer esta cosecha; (4) pedir a
  Nicolas abrir una sesión nueva que arranque leyendo ese resumen. No esperar a que la
  sesión se compacte sola: se pierde agilidad y calidad.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
