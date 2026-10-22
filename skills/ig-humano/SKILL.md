---
name: ig-humano
description: "Quita las huellas de IA de un borrador de Instagram en español (captions, guiones de reel, texto de carrusel, stories) y lo puntúa 0-100 con un lexicón propio de muletillas de IA en español latino: 'en el mundo actual', 'es importante destacar', 'no es solo X, es Y', 'desbloquea el poder', rayas largas, caracteres invisibles. Limpia solo lo seguro y MARCA lo demás para reescribirlo a mano. Usar cuando Nicolas diga 'humaniza esto', 'suena a IA', 'quítale lo ChatGPT', o SIEMPRE antes de mostrarle un caption o guion para su feed. Lee su voz en ~/.claude/instagram/voz-nicolas.md."
---

# ig-humano

Limpiador y puntuador de textos para el feed personal de Nicolas. Local: Python estándar, sin red.

Adaptado de `ig-human` de https://github.com/Jakeschincariol/instagram-agent-skill (MIT, (c) 2026 Jake Schincariol).
El lexicón en español (`muletillas-es.json`) y los chequeos de puntaje son propios, no una traducción.

## Antes de escribir o limpiar
1. Lee `~/.claude/instagram/voz-nicolas.md` si existe. Sus «palabras que sí uso» y «que nunca diría»
   mandan sobre el lexicón. Si está vacía, dilo y avisa que el resultado será genérico.
2. Si una muletilla del lexicón es de verdad de Nicolas, se borra de `muletillas-es.json` (no se pelea con ella).

## Uso
```bash
python humanizar.py borrador.txt -o limpio.txt     # limpia + informe (cambios, banderas, puntaje antes/después)
python humanizar.py borrador.txt --puntuar          # solo puntaje
python humanizar.py --prueba                        # autoprueba
```
(La ruta del script es la de esta carpeta, `~/.claude/skills/ig-humano/`. En Windows: `python`, no `python3`.)

## Qué hace solo (seguro)
- Quita caracteres invisibles (zero-width, BOM) y espacios raros.
- Raya larga `—` a coma; comillas curvas a rectas.
- Frases de relleno que se pueden borrar sin romper la gramática («es importante destacar que», «sin lugar a dudas», «en conclusión»...).
- Hashtags, @menciones y URLs quedan intactos.

## Qué NO hace solo (tú lo reescribes)
Todo lo que cambia la forma de la frase se marca, no se reescribe: «no es solo X, es Y», muletillas con
sugerencia (robusto, crucial, ecosistema, «lleva tu X al siguiente nivel»), preguntas retóricas sueltas,
viñetas de emoji, muro de hashtags, MAYÚSCULAS gritadas, «¿sabías que...?».
Reescríbelas con el dato real de Nicolas (cifra, nombre, herramienta, hora), luego vuelve a puntuar.

## Los 5 chequeos (0-100, más alto = más humano)
RITMO (variación de largo de frase) · CONCRECION (cifras y nombres propios) · MULETILLAS (densidad del lexicón) ·
HUELLA (invisibles, rayas, comillas curvas) · VOZ (primera/segunda persona y estructuras de plantilla).
Veredicto PASA con total ≥ 70 y ningún chequeo < 55; el más débil pesa 40 %.

## Orden de trabajo
1. `humanizar.py borrador.txt -o limpio.txt`
2. Reescribe a mano cada línea marcada, con material real de Nicolas.
3. `--puntuar` otra vez. Dos rondas es normal; cinco significa que el borrador es de fórmula y hay que cambiar de borrador.
4. Muestra a Nicolas el texto final Y el puntaje, nunca solo el puntaje.

## Honestidad
Son heurísticas locales; NO son GPTZero, Originality ni ningún detector real y no prometen su veredicto.
Nunca digas «es indetectable». Un puntaje alto no reemplaza que el texto sea verdad y tenga algo suyo:
**no inventes cifras, clientes ni resultados** que Nicolas no haya dado.
