---
name: lee-documento
description: "Lee un documento entero (contrato, propuesta, SRS, artículo largo) y saca tesis, claims con calidad de evidencia, gaps, contradicciones con el contexto propio, preguntas y veredicto de lectura. Usar cuando Nicolas diga /lee-documento, 'léeme este contrato', 'resume y evalúa este documento', '¿vale la pena leer esto?', o antes de firmar un contrato, revisar un SRS, una propuesta o un artículo largo."
---

# /lee-documento — Leer, evaluar, decidir si vale la pena

## Inputs

- **documento**: ruta local o URL del archivo a leer.
- **mi_contexto**: ruta a notas propias relacionadas (opcional, para detectar
  contradicciones o alineamientos).
- **profundidad**: `skim` | `review` | `deep`.

## Flujo

1. Lee el documento ENTERO antes de opinar. Si es una URL larga o paginada,
   hazlo en varias pasadas (no te quedes con el primer fragmento).
2. Si hay `mi_contexto`, léelo también antes de comparar.
3. Ajusta el esfuerzo a `profundidad`: `skim` = solo tesis y veredicto,
   `review` = salida completa, `deep` = salida completa + más detalle en
   claims y gaps.

## Salida (siempre estas seis secciones, en este orden)

```
## Tesis (1 línea)
## Claims clave (3-5 bullets, cada uno con calidad de evidencia)
## Inconsistencias / gaps
## Contradicciones o alineamientos con mi contexto (si hay mi_contexto)
## Q&A (5 preguntas)
## Veredicto: leer entero | skim | skip
```

Si el documento es un **contrato**, agrega al final:

```
## Cláusulas que cuestan dinero o son irreversibles
```

## Reglas

- Nada de opinión sin cita del documento: cada claim y cada cifra llevan su
  ubicación (página, sección o párrafo).
- No inventes cifras ni datos que no estén en el documento.
- Si una fuente requiere login o paywall y no se puede leer completa: dilo y
  exclúyela del análisis, no la completes de memoria.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
