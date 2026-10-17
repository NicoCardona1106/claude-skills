# Formatos de la carpeta del tema

Plantillas para `/profesor`. Cortas a propósito: si un archivo pasa de una
pantalla, dejó de servir de brújula.

## mision.md

```md
# Misión: {Tema}

## Para qué
{1-3 frases: lo concreto que quiere poder hacer y qué cambia en su trabajo o su vida.}

## Tiempo
{Total y sesiones. Ej.: 4 h en 2 sesiones de 2 h (sábado y lunes).}

## Desde dónde parte
- {Lo que ya sabe y con qué profundidad. Ej.: JS/TS a diario; Python nunca.}

## Lo logré si
- {Algo observable que podrá hacer. Ej.: correr un script que lee gastos.csv y da el total por categoría.}

## Fuera de alcance
- {Lo que no se toca ahora.}

## Preferencias
- {Cómo quiere que se le enseñe. Ej.: desde el celular, opciones numeradas.}

## Supuestos
- {Lo deducido sin confirmar.}
```

## recursos.md

```md
# Recursos: {Tema}

## Fuente principal
- [Nombre](https://enlace-verificado) — qué cubre y cuándo usarla. (Verificado AAAA-MM-DD)

## Conocimiento
- [Nombre](https://...) — para qué sirve. (Verificado AAAA-MM-DD)

## Comunidad (práctica real)
- [Nombre](https://...) — para qué ir ahí.

## Huecos
- {Lo que la misión necesita y no tiene buena fuente todavía.}
```

Solo fuentes de alta confianza (oficiales, autores reconocidos, comunidades
moderadas). Marketing disfrazado de tutorial, fuera. Quitar lo que resultó
malo en vez de dejarlo enterrado.

## plan.md

```md
# Plan: {Tema} en {N} h

## Sesión 1 — {fecha o «día 1»} ({minutos} min)
| Hecho | Bloque | Min | Qué sale de aquí |
|---|---|---|---|
| [ ] | 0. Diagnóstico y entorno | 10 | {…} |
| [ ] | L1. {lección} | 30 | {victoria concreta} |
| [ ] | Pausa | 5 | |
| [ ] | Repaso por recuperación | 10 | {…} |

## Sesión 2 — …

**Total: {suma} min = {N} h** (tiene que dar exacto)
```

## lecciones/NNNN-slug.md

```md
# Lección N — {Título}

**Objetivo:** {una cosa que podrá hacer al terminar}. **Duración:** {min}.
**Viene de:** [Lección N-1](./NNNN-slug.md) · **Sigue:** [Lección N+1](./NNNN-slug.md)

## Lo mínimo que hay que saber
{Explicación corta con citas [así](https://...). Contraste con lo que ya sabe si ayuda.}

## Ejercicio (se ejecuta)
1. Crear `{archivo}` con: {código}
2. Correr: `{comando}`
3. Salida esperada (verificada con {versión}, {fecha}): {salida real}

**Reto:** {variación pequeña, sin solución a la vista}

## Errores comunes
- {Error real} → {mensaje real} → {arreglo}

## Quiz
{3-5 preguntas, mismas palabras por opción, clave de posiciones fijada antes}

<details><summary>Respuestas</summary>
{Respuesta + por qué, también por qué no las otras}
</details>

## Para leer después
[{Fuente principal, sección exacta}](https://...)

> Si algo no quedó claro, pregúntame: soy tu profesor para este tema.
```

## registro.md

```md
# Registro: {Tema}

## Aprendido (con evidencia)
- AAAA-MM-DD — {concepto}. Evidencia: {acertó 4/4 / resolvió el reto / lo explicó}.

## Saber previo declarado
- {Lo que dijo que ya sabe y con qué profundidad.}

## Errores corregidos
- AAAA-MM-DD — {creía X; ahora sabe Y}. Ojo en: {temas donde puede volver a salir}.

## Repasos pendientes
| Concepto | Lección | Próximo repaso | Intervalo | Resultado último |
|---|---|---|---|---|
| {…} | L1 | AAAA-MM-DD | +1 | — |
```

Intervalos: +1 → +3 → +7 días; fallo vuelve a +1; acierto en +7 sale de la tabla.
Si una idea anterior resulta mal entendida, se tacha y se escribe la nueva
debajo, sin borrar: cómo cambió el entendimiento también sirve.

## glosario.md (opcional)

```md
# Glosario: {Tema}

**{Término}**: {definición de 1-2 frases, qué ES}.
_Evitar_: {sinónimos que no se usan en este curso}
```

Un término entra cuando Nicolas ya lo usa bien, no antes. Las lecciones usan
estos términos y no otros.
