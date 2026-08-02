---
name: cosecha
description: "Cosecha de memoria para Mempalace con confirmación humana (flujo A→E estilo Aprende): escanea la sesión, propone candidatos con confianza, deduplica contra el palacio y SOLO escribe lo que Nicolas apruebe. Usar cuando Nicolas diga /cosecha, 'guarda lo aprendido', 'cosecha la sesión', 'cierra la sesión', o con --review para la poda mensual del palacio."
---

# /cosecha — Guardar lo aprendido, con confirmación

Regla de oro: **nada se escribe al palacio antes del paso D.** Mejor un falso
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
- **Destino**: wing/room del palacio (usa la taxonomía real: `mempalace_get_taxonomy`)
- **Confianza**: alta | media | baja
- **Contenido propuesto** (1-4 líneas)

Las **lecciones** van SIEMPRE en formato Reflexion:

```
QUÉ PASÓ: [el error o fricción concreta]
POR QUÉ: [la causa real, no el síntoma]
CÓMO EVITARLO: [la regla accionable]
SEÑAL DE DETECCIÓN: [cómo darse cuenta a tiempo la próxima vez]
```

## Paso C — Deduplicar (marcar, no descartar)

Por cada candidato: `mempalace_check_duplicate` y/o `mempalace_search`.
Si hay solape, NO lo elimines — márcalo: `⚠ solapa con [drawer]: [diferencia]`.
Nicolas decide si es duplicado, actualización o algo nuevo.

## Paso D — Confirmar

Presenta la lista numerada (candidato, categoría, destino, confianza, solapes)
y espera la respuesta. Acepta: números (`1,3,5`), rangos (`1-4`), `all`, `none`,
`edit N: <texto>`, `drop low` (descarta confianza baja), `skip N`.

## Paso E — Ejecutar

Solo lo aprobado:

- Drawers → `mempalace_add_drawer` en el wing/room del candidato
- Hechos de personas/proyectos → además `mempalace_kg_add`
- Si un candidato ACTUALIZA una drawer existente → `mempalace_update_drawer`
- Cierra con `mempalace_diary_write` resumiendo la sesión
- Confirma cada escritura con una línea

**Retirar, no borrar**: si una drawer quedó obsoleta, NO uses delete — antepon
`[RETIRADA <fecha>: <motivo>]` a su contenido con `mempalace_update_drawer`
(y `mempalace_kg_invalidate` si el hecho vive en el KG). El rastro de qué se
creyó y cuándo se corrigió es parte de la memoria.

## Modo `--review` (poda mensual)

1. `mempalace_get_taxonomy` + `mempalace_graph_stats` para ver el estado.
2. Detectar: rooms duplicados (ej. español/inglés), wings duplicadas por
   nombre, drawers obsoletas o contradictorias, rooms inflados por imports.
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
