---
name: juicio
description: "Juicio de ideas con 4 jueces en paralelo (Creyente, Escéptico, Ingeniero, Inversionista) y el director como Juez que verifica y dicta veredicto. Usar con '/juicio', 'haz un juicio', 'ponle juicio a esta idea', 'consejo', '¿esto tiene sentido?' o 'evalúa estas ideas'."
---

# Juicio de ideas

Antes de gastar horas en una idea, se la somete a 4 jueces con sesgos opuestos y el director
(Claude Opus) dicta el veredicto. Formato "consejo de 4 roles" visto en IG; aquí es un flujo
propio, sin nada copiado. Se juzga lo que ya se tiene: una idea que duplica algo existente se
dice así.

## Variante ligera

Si la idea es UNA y pequeña: solo Creyente + Escéptico + Juez (pasos 1, 2 sin Ingeniero ni
Inversionista, 4 y 5). Nada de Codex ni agy.

## Paso 1: armar el expediente

Crear `C:\Users\NICO-C\Desktop\nc-workspace\temporales\juicio-<tema>\expediente.md` con:

1. **Ideas numeradas**, cada una en 2-4 líneas y con su fuente.
2. **Lo que Nicolas YA tiene**: leer `C:\Users\NICO-C\.claude\projects\C--Users-NICO-C-Desktop-nc-workspace\memory\MEMORY.md`
   (y los archivos de proyecto que toquen las ideas). Incluir estado real, no supuesto.
3. **Formato de respuesta** de cada juez: por idea, veredicto de su escala + 2-4 líneas con
   números cuando haya; sin relleno; si duplica algo existente, decirlo.

## Paso 2: lanzar los jueces EN PARALELO (un solo mensaje)

Cada juez recibe la ruta del expediente y su escala. Ninguno edita archivos.

| Juez | Quién | Escala | Enfoque |
|---|---|---|---|
| Creyente | subagente Sonnet | FUERTE / VIABLE / NO LA DEFIENDO | La mejor versión de la idea y por qué funcionaría |
| Escéptico | subagente Opus, sin editar | MATAR / DEBILITAR / RESISTE | Dónde se rompe, qué se asumió sin probar |
| Ingeniero | Codex, solo lectura | FÁCIL / MEDIO / DIFÍCIL / NO VIABLE + horas | Costo real de construirla sobre lo existente |
| Inversionista | agy, con web | INVIERTO / TAL VEZ / NO INVIERTO | Retorno y precios; verifica hechos en la web y cita fuente específica |

Codex y agy se llaman con el delegador (no en cadena; agy y Codex tardan minutos):

```
node "C:\Users\NICO-C\Desktop\nc-workspace\propios\N Coterminal\herramientas\delegar.cjs" codex "<tarea>" --de=claude
node "C:\Users\NICO-C\Desktop\nc-workspace\propios\N Coterminal\herramientas\delegar.cjs" agy "<tarea>" --de=claude
```

La tarea incluye: ruta del expediente, el rol, la escala y "solo lectura, no edites nada".
Lanzarlos en segundo plano para que corran a la vez que los subagentes.

## Paso 3: comprobar que arrancaron

Codex y agy fallan en silencio: verificar proceso vivo (`Get-Process` o el log de la salida en
segundo plano) y reportar la evidencia. Si uno no arrancó, relanzar una vez; si falla otra vez,
seguir sin él y decirlo en el veredicto.

## Paso 4: el director es el Juez

Los jueces opinan, el Juez decide. Antes de dictar:

- Verificar las afirmaciones que deciden (permisos, precios, límites, "ya existe X") contra la
  memoria de Nicolas o la fuente primaria. Un dato sin fuente específica no cuenta.
- Corregir a los jueces cuando se equivoquen; el consenso no es evidencia.
- Recordar que Nicolas usa suscripción: cuenta la cuota, no el $/MTok.

Escribir `veredicto.md` en la misma carpeta:

1. Tabla `idea | Creyente | Escéptico | Ingeniero | Inversionista | VEREDICTO`, con el veredicto
   final en negrita: **ADOPTAR / PROBAR / POSTERGAR / DESCARTAR** y una condición corta si aplica
   (bloqueos, "primero X").
2. Sección **Correcciones del juez a los jueces**: cada error detectado y qué era lo cierto.

## Paso 5: recordar y convertir en tareas

- Guardar el veredicto en Mempalace (drawer en la wing del proyecto, o `decisiones` si es
  transversal) para que no se vuelva a juzgar lo mismo.
- Proponer las tareas resultantes (solo ADOPTAR y PROBAR) para `SEMANA.md`. NO escribirlas sin
  permiso de Nicolas.
- Resumen final corto: la tabla y las tareas propuestas.

---

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
