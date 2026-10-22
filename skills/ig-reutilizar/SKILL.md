---
name: ig-reutilizar
description: "Convierte UN material largo de Nicolas (una sesión de trabajo con Claude Code, un commit grande, un video de YouTube, una nota de voz, un post de bitácora, una reunión propia) en una semana de posts para su feed: reels, carruseles y cuadros de story, sin resumir. Extrae afirmaciones, cifras, historias, mecanismos, errores y frases citables, y asigna formato y gancho a cada una. Usar cuando diga 'reutiliza esto', 'conviértelo en reels', 'tengo esta transcripción', 'qué puedo sacar de la sesión de hoy'."
---

# ig-reutilizar

Adaptado de `ig-repurpose` de https://github.com/Jakeschincariol/instagram-agent-skill (MIT, (c) 2026 Jake Schincariol), en español y pensado para
el material que Nicolas ya genera: sesiones con Claude Code, bitácora (SEMANA.md), commits, notas.

Un buen material largo contiene 4 a 6 posts. Casi todos sacan uno.

## Entrada
Transcripción, texto, `git log`/diff resumido, nota de voz transcrita o bitácora. Lee TODO antes de extraer.
Si es video suyo, pide el archivo: un reel con su propia grabación gana al mismo texto releído.
**Confidencialidad primero**: no extraer nada de clientes (Co-Axis, Reflexcam, barbería, OCTPEI, etc.), claves, precios pactados ni capturas con datos reales
sin que Nicolas lo autorice. Lo marcado como privado en `voz-nicolas.md` («Fuera de límites») se descarta.

## Extraer, no resumir
| Sacar | Qué es |
|---|---|
| Afirmaciones | frases que empezarían una discusión |
| Cifras | horas, costos, minutos, porcentajes, líneas de código |
| Historias | momento con persona, escena y costo |
| Mecanismos | «la forma en que esto de verdad funciona es...» |
| Errores | todo lo que salió mal (lo que más conecta) |
| Frases citables | oraciones que ya sirven tal cual |

Lista lo encontrado, con conteos, antes de escribir. Si salen menos de 4, el material es flaco y se dice.

## Formato por hallazgo
- Afirmación, error, historia: **reel** (necesitan voz y cara).
- Mecanismo, lista numerada: **carrusel** (se relee; lo renderiza `herramientas/carrusel`).
- Frase citable: **cuadro de story** (ver `ig-story`), no post.

## Armar la semana
Cada post se sostiene solo: quien lo ve no vio el material de origen. Prohibido «como dije en mi último video».
Varía el gancho (5 posts con la misma forma es una fábrica; ver `ig-hook-extractor`). Orden: afirmación más fuerte primero, historia a mitad de semana, mecanismo al final.

## Salida
```
MATERIAL: sesión del 22-oct (3 h, bot de Valentina)
ENCONTRADO: 3 afirmaciones, 6 cifras, 2 historias, 2 mecanismos, 2 errores, 4 frases
SEMANA
MAR REEL     error      «Tres horas buscando un punto y coma» (usa el clip de la pantalla del log)
MIÉ CARRUSEL mecanismo  «Cómo dejo que Claude revise su propio código en 4 pasos»
VIE REEL     afirmación «No culpes a la IA primero»
DOM STORY    frase      ...
Di «escribe el martes» y lo redacto.
```
Se redacta uno por uno (si no, todos suenan igual), cada uno con `ig-hook-extractor` para el gancho y `ig-humano` al final. Nada se publica.
