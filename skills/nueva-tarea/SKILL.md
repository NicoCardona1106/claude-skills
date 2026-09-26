---
name: nueva-tarea
description: Formulario corto para registrar una tarea con fecha en SEMANA.md (qué, para cuándo, qué se espera, qué se desea, quién, de qué depende), con formato fijo y presentable. Usar cuando Nicolas diga /nueva-tarea, "anota una tarea", "agrega esto para el <día>", "crea la tarea", o dicte un pendiente con fecha.
---

# /nueva-tarea — registrar una tarea con fecha

Objetivo: que cada tarea de `SEMANA.md` (raíz de nc-workspace, archivo CRLF) quede con lo mínimo para entenderla
sin contexto y saber cuándo está terminada. Nada más.

## 1. El formulario (7 campos)

| # | Campo | Obligatorio | Regla |
|---|---|---|---|
| 1 | **Tarea** | sí | Verbo + objeto, máx. ~10 palabras («Hacer la landing de Co-Axis Parking») |
| 2 | **Fecha** | sí | Absoluta `AAAA-MM-DD` con el día («Domingo 2026-09-27»); «antes del» si es límite. Convertir «mañana», «el domingo» con la fecha del hook |
| 3 | **Proyecto** | sí | Una sección existente de SEMANA.md (NCCHUB, CO-AXIS, REFLEXCAM…) |
| 4 | **Se espera** | sí | El entregable mínimo y verificable: qué existe o funciona al terminar |
| 5 | **Se desea** | no | Lo ideal si hay tiempo; se omite si no hay |
| 6 | **Quién** | sí | Nicolas / Claude / Nicolas + Claude / un tercero por su nombre |
| 7 | **Depende de** | no | Bloqueo externo (acceso, respuesta, pago); se omite si no hay |

## 2. Cómo llenarlo

1. Sacar del mensaje de Nicolas todo lo que ya esté (y de SEMANA.md / memoria el contexto del proyecto).
2. Preguntar **solo lo que falte de los obligatorios**, en UN mensaje corto y numerado. Si todo está, no preguntar.
3. Proponer «Se espera» a partir de lo que dijo si no lo dio explícito, y marcarlo como propuesto.
4. Una tarea por entregable: si dicta varias cosas distintas, varias tareas.

## 3. Formato en SEMANA.md

Con fecha → sección `## CON FECHA`, en orden cronológico:

```
- [ ] **Domingo 2026-09-27** · CO-AXIS · Hacer la landing de Co-Axis Parking
  - Se espera: …
  - Se desea: …
  - Quién: … · Depende de: …
```

Escribir con un script Python que respete CRLF (nunca Edit a ciegas). Mostrar a Nicolas el bloque tal como quedó.
Al cerrar la tarea: `[x]` + una línea `- Resultado: …` con commit/enlace/archivo.

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
