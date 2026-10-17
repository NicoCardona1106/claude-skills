---
name: grill-me
description: "Entrevista dura ANTES de construir: preguntas una a una (o en bloques de 3) sobre usuarios, datos, casos borde, qué pasa si falla y qué NO se hace, hasta 10 preguntas como máximo, y cierra con un resumen de decisiones listo para pegar en el SRS. Usar cuando Nicolas diga 'grill me', 'entrevístame', 'hazme preguntas antes', 'pregúntame lo que necesites', o cuando un pedido de web, app, agente o módulo llegue vago (una línea, sin usuarios ni datos claros) y se vaya a hacer un SRS o un plan. Es el paso 0 opcional de `srs`; no reemplaza al SRS ni al blueprint."
---

# /grill-me — Entrevista antes de construir

Un SRS escrito sobre un pedido vago se rehace. Diez preguntas bien elegidas
antes de redactar cuestan dos minutos a Nicolas y ahorran una vuelta entera.
La entrevista es dura en el fondo (busca el hueco, no confirma lo obvio) y
corta en la forma: Nicolas suele responder desde el celular.

## Reglas de forma (celular)

- **Máximo 10 preguntas en total.** Si con 6 ya está claro, se para ahí.
- **Una a la vez, o bloques de 3** cuando las preguntas no dependen entre sí.
  Nunca un cuestionario de 10 de golpe.
- **Cada pregunta trae opciones numeradas y una recomendada**, para que pueda
  contestar «2» o «sí»:
  > 3/10 — Si el pago falla a mitad, ¿qué pasa con el pedido?
  > 1) queda pendiente y se reintenta (recomendado) · 2) se cancela · 3) otra
- Frases cortas, sin jerga innecesaria, sin preámbulo. Numerar `n/10` para
  que sepa cuánto falta.
- Si la respuesta es vaga («normal», «lo de siempre»), repreguntar UNA vez
  con un ejemplo concreto; si sigue vaga, anotar el supuesto y seguir.

## Antes de preguntar

Leer lo que ya existe (SEMANA.md, memoria del proyecto, Mempalace, docs del
cliente, el repo). **No se pregunta lo que se puede deducir**: cada pregunta
gastada en algo que ya estaba escrito es una pregunta menos para un hueco
real. Si algo se dedujo, se dice en el resumen como supuesto.

## Qué preguntar (ordenado por riesgo, no por plantilla)

Elegir de esta lista solo lo que esté abierto, empezando por lo que más caro
saldría equivocarse:

1. **Usuarios**: quién lo usa, cuántos, desde qué dispositivo, qué sabe hacer.
2. **Qué NO hace**: lo que queda fuera de esta versión (la pregunta que más
   ahorra; casi nunca está escrita).
3. **Datos**: qué se guarda, de dónde viene, quién lo ve, datos personales
   (habeas data), qué se borra y cuándo.
4. **Dinero y permisos**: cobros, saldos, quién puede hacer qué. Si aparece,
   va marcado para la revisión de Fable de `orquesta` (punto fijo 2).
5. **Si falla**: caída de un servicio externo (Meta, Supabase, IA), pago a
   medias, sin internet, error del usuario. Qué ve la persona y qué queda
   guardado.
6. **Casos borde**: duplicados, vacío, volumen alto, dos personas a la vez,
   zona horaria, moneda.
7. **Éxito**: cómo sabe Nicolas (o el cliente) que funcionó; una medida.
8. **Restricciones**: plazo, presupuesto, stack impuesto, plan gratis.

## Cierre: resumen de decisiones

Al terminar (o al llegar a 10), entregar este bloque, ya ordenado por las
secciones del SRS para pegarlo sin reescribir:

```markdown
## Decisiones de la entrevista (<fecha>)
- **Alcance (SRS 1.2):** hace … / NO hace …
- **Usuarios (2.3):** …
- **Funciones clave (3):** … (candidatas a RF «Debe»)
- **Si falla (3/5):** …
- **Datos (6):** …
- **No funcionales (5):** … (con medida)
- **Fuera de alcance (7):** …
- **Supuestos** (deducidos o sin respuesta clara): …
- **Dudas abiertas:** … (máx. 3)
```

Si sigue `srs`, el resumen es su insumo directo. Si la sesión es larga o
puede compactarse, guardarlo también en `docs/entrevista-<fecha>.md` del
proyecto.

## Qué no es

- No es el SRS: no redacta requisitos con ID ni criterio de aceptación.
- No es `fable-abogado-del-diablo` (critica un plan ya hecho); aquí todavía
  no hay plan.
- No se usa para arreglos o cambios chicos con requisitos claros.

---

Idea adaptada de «Grill Me» (mattpocock/skills), reescrita para Nicolas.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
