---
name: fable-fixer
description: Arreglo de bugs al estilo Fable 5. Usar cuando haya un bug o error que arreglar, cuando algo "arreglado" siga fallando, o cuando pidan verificar que un arreglo de verdad quedó.
---

# Fixer — arreglar como Fable 5 (con prueba en mano)

"Debería funcionar" está prohibido. Un bug está arreglado cuando hay
evidencia de que ya no pasa — no cuando el código "se ve bien".

## Paso 1 — Reproduce primero
Antes de tocar nada, haz que el bug pase frente a ti: el comando, el click,
el dato exacto que lo dispara. Si no puedes reproducirlo, todavía no lo
entiendes — y arreglar lo que no entiendes es reacomodar el problema.

## Paso 2 — Causa raíz, no síntoma
Pregunta "¿por qué?" hacia atrás hasta llegar al código que DECIDE, no al
que muestra el error. El error visible casi nunca vive donde nació.
Verifica la causa: predice qué pasaría si tu teoría es cierta, y compruébalo
antes de escribir el arreglo.

## Paso 2.5 — Evidencia por capas y la regla del tercer intento
Cuando el sistema tiene varias piezas encadenadas (formulario → API →
Supabase → webhook), no adivines cuál falla: instrumenta cada frontera antes
de proponer un arreglo. Por cada límite entre piezas, registra qué dato
entra, qué dato sale y si la configuración llegó. Una sola corrida te dice
DÓNDE se rompe; recién ahí investigas esa pieza.

Y lleva la cuenta de los intentos:

- Intento 1 o 2 fallido → vuelve al Paso 1 con la información nueva. Una
  hipótesis por vez, un cambio por vez.
- **Tres arreglos fallidos = el problema no es el bug, es la arquitectura.**
  La señal: cada arreglo destapa un problema nuevo en otro lado, o exige "un
  refactor grande" para caber. Deténte, dilo, y discútelo con Nicolas antes
  del cuarto intento. Eso no es una hipótesis fallida: es un diseño
  equivocado, y seguir parchando es gastar sin avanzar.

## Paso 3 — El arreglo mínimo
Arregla la causa, no maquilles el síntoma. Y nada de refactors oportunistas:
el "ya que estamos aquí" es la forma clásica en que un arreglo rompe otras
dos cosas.

## Paso 4 — Prueba con evidencia
- Corre el caso exacto que fallaba y muestra el output de que ya pasa.
- Corre también lo vecino: lo que tocaste puede haber roto al lado.
- Si el proyecto tiene pruebas, córrelas; si no las tiene, deja escrita la
  receta manual de verificación que usaste.

### El ciclo rojo-verde del arreglo
Una prueba de regresión que nunca viste fallar no prueba nada: pudo estar
pasando desde siempre y no cubrir el bug.

1. Escribe el caso que reproduce el bug y **córrelo con el arreglo
   deshecho**: tiene que fallar, y fallar por el motivo correcto (no por un
   typo ni por un import roto).
2. Restaura el arreglo y córrelo otra vez: ahora pasa.
3. Corre la vecindad: lo que tocaste puede haber roto al lado.

Sin haber visto el rojo, no digas "agregué una prueba de regresión" — di
"agregué una prueba". Si el proyecto no tiene runner, el mismo ciclo vale a
mano: deshacer, ver el fallo, rehacer, ver el éxito, y dejar escritos los
dos outputs.

## Contra el "ya quedó"
Cuando otro modelo (o una sesión anterior) diga que algo ya está arreglado:
pide la evidencia. ¿Qué comando corrió? ¿Qué output dio? ¿Se ejercitó el
caso que fallaba? Sin evidencia, trátalo como no arreglado y verifícalo tú.

## Las reglas de Fable
- Reporte fiel: si la prueba falla, se dice con el output completo — no se
  esconde, no se suaviza, no se promete que "es un detalle".
- Un arreglo sin caso de verificación es una hipótesis con buen marketing.
- Si después de dos intentos serios la causa sigue sin aparecer, se dice
  honestamente y se documenta lo que ya se descartó — eso también es avance.

---

Técnicas adaptadas de obra/superpowers (MIT, © 2025 Jesse Vincent) — https://github.com/obra/superpowers

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
