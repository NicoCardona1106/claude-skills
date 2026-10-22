---
name: ig-story
description: "Arma la secuencia de Stories del día para el feed personal de Nicolas (vibe coder construyendo con Claude Code): 3 a 7 cuadros con apertura, contenido, UN sticker de interacción en el cuadro 4 y cierre, más qué hacer con las respuestas. Usar cuando diga 'qué subo en historias', 'secuencia de stories', 'idea de encuesta', 'no tengo qué contar hoy', o quiera mostrar el día a día sin hacer un post. Convierte lo que pasó hoy (commit, bug, build) en cuadros. No publica nada."
---

# ig-story

Adaptado de `ig-story` de https://github.com/Jakeschincariol/instagram-agent-skill (MIT, (c) 2026 Jake Schincariol), llevado al español
y al contenido de Nicolas (día a día construyendo con Claude Code). Para DMs de clientes NO se usa esto: eso es AgentKit.

Las Stories no son un feed pequeño: el feed lo ven desconocidos; las Stories las ven quienes ya te siguen y deciden si eres alguien
a quien vale la pena escribirle. Aquí se gana profundidad, no alcance.

## Insumos
- `~/.claude/instagram/voz-nicolas.md` (tono, qué no se dice, qué cifras se pueden mostrar). Si falta, avísalo.
- Lo que Nicolas cuente de hoy; o, si autoriza, `git log --since=midnight` del proyecto que indique, para sacar hechos reales.
- Nunca mostrar: claves, URLs privadas, datos de clientes, pantallas de NccHUB/CRM con nombres. Pídele que difumine o usar datos de ejemplo.

## Forma del día (3 a 7 cuadros)
```
1  APERTURA   algo pasando hoy, con cara o mano / pantalla en movimiento
2-3 MEDIO     el contenido: el proceso, el resultado, el error
4  LA PREGUNTA  UN solo sticker
5  CIERRE     la respuesta, el desenlace o el gancho de mañana
```
La pregunta va en el 4, no en el 7: cada toque pierde gente.

## Stickers: para qué sirve cada uno
| Sticker | Sirve para | Úsalo cuando |
|---|---|---|
| Encuesta | volumen de respuesta barato | quieres que reaccionen, no información |
| Caja de preguntas | sacar las palabras exactas de la audiencia | buscas ideas de posts y objeciones, textuales |
| Quiz | enseñar dejando que se equivoquen | hay un error común (ej. «¿cuál prompt es mejor?») |
| Deslizador | pulso de ánimo | casi nada importante |
| Enlace | único clic fuera de la bio | hay a dónde llevarlos (producto, repo, demo) |
| Cuenta regresiva | fecha de lanzamiento | un lanzamiento o un directo |
| Añade el tuyo | alcance fuera de seguidores, de vez en cuando | el reto lo puede responder cualquiera |

La caja de preguntas es la más subestimada: cada respuesta es un caption, un gancho de reel o una idea de carrusel en palabras de la audiencia.

## Reglas
- Cara o mano en el primer cuadro; el texto sobre fondo plano se salta.
- Una idea por cuadro; nadie lee párrafos en una story.
- Texto en el centro: en 1080x1920, nada arriba de y=250 ni debajo de y=1600.
- Habla a UNA persona («tú»).
- No republiques tu propio post sin decir qué pasó en los comentarios.
- Para venderle algo, 3 cuadros de contexto + 1 de oferta + 1 de prueba funciona mejor que un post sobre lo mismo.
- Si respondieron a la encuesta, responde tú a cada persona: ellos actúan primero, tú contestas. Nada de DMs masivos a quien no interactuó.

## Salida
```
STORIES · martes · 5 cuadros
1 [selfie, caminando]   "Se me cayó el bot a las 11 pm. Era un punto y coma."
2 [grabación de pantalla] el log con la línea marcada
3 [hablando]            "Primero leo el log, después culpo a Claude."
4 [encuesta]            "¿Ustedes culpan primero a la IA o al código?"  A la IA / Al código
5 [texto sobre foto]    "Mañana les muestro cómo lo dejé para que no se repita."
Después: a todos los que votaron «A la IA» les respondes.
```
Pasa el texto por `ig-humano` antes de entregarlo. Nada se publica: lo sube Nicolas.
