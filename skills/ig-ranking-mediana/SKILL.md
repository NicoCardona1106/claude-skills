---
name: ig-ranking-mediana
description: "Ordena publicaciones de Instagram (de la competencia, de cuentas de referencia o las propias) por cuántas veces superaron la mediana de SU cuenta, no por vistas crudas, para encontrar formatos copiables. Usar cuando Nicolas diga 'qué está funcionando en mi nicho', 'arma un swipe file', 'por qué le fue tan bien a este reel', 'rankea estos posts', o antes de decidir qué grabar. Lee solo lo que Nicolas pega o captura él mismo; no raspa Instagram. Alimenta a clonador-de-formato e ig-hook-extractor."
---

# ig-ranking-mediana

Adaptado de `ig-viral` + `swipe.py` de https://github.com/Jakeschincariol/instagram-agent-skill (MIT, (c) 2026 Jake Schincariol). Se dejó solo el
ranking; la clasificación de ganchos ya la hace `ig-hook-extractor` y el desmontaje del formato `clonador-de-formato`.

## La idea
Las vistas crudas no son evidencia: 400.000 vistas en una cuenta de 2 M fue un martes flojo; en una de 4.000 seguidores es un hallazgo.
Se rankea por **múltiplo = vistas / mediana de esa cuenta**. >3x es señal; <1.5x es el día normal de esa cuenta.
Toma cuentas dentro de ~10x del tamaño de la de Nicolas: lo que funciona a 2 M a menudo funciona porque ya tiene 2 M.

## Reglas (no negociables)
- **Nunca** inicies sesión en Instagram por Nicolas ni pidas su contraseña. Lo que se capture lo pega o lo ve él en SU navegador.
- **Leer, no raspar**: 6 a 12 cuentas, ~12 reels cada una, a ritmo humano. Nada de crawlers, servicios de scraping ni bucles en segundo plano (viola los términos de uso y banean cuentas).
- Para research de competencia con IA, el stack acordado es Meta AI conversacional (ver `content-strategy`). No uses Agent Reach/OpenCLI/Composio con cuentas de clientes.
- **Copia la fórmula, nunca el video**: forma del gancho, estructura, duración; no su guion, voz ni edición. Cada fila lleva la cuenta de origen.

## Pasos
1. Elige cuentas: 4 directas (mismo nicho, un poco adelante: devs y «vibe coders» en español), 4 adyacentes (otro nicho, misma audiencia), 2 a 4 enormes (solo formato).
   Pídele también su colección de Guardados, ya filtrada por su gusto.
2. Por reel, anotar en un TSV con encabezado (columnas separadas por tabulador):
   `cuenta  mediana  vistas  gancho` (gancho = primera frase textual, hablada o en pantalla). Sin la mediana vuelve el ranking por seguidores; si falta, el script la calcula con los reels del archivo.
3. Correr:
   ```bash
   python ranking.py capturados.tsv --md swipe.md
   ```
4. Reportar solo tres cosas: qué fórmulas se repiten en el tercio superior (con conteos), qué tienen en común estructuralmente (largo del gancho, payoff visual, dónde está el pedido),
   y los ganchos que no encajan en ninguna fórmula conocida (léelos a mano: ahí hay formatos nuevos).
5. Decir tamaño de muestra y confianza. 12 reels no muestran nada; 40 en 6 cuentas sí.
6. Para las 3 mejores fórmulas, escribir «la versión de Nicolas» con SU historia y SU cifra (pasar por `clonador-de-formato` e `ig-hook-extractor`), y revisar con `ig-humano`.

Nada se publica, sigue ni comenta desde aquí.

## Salida de ejemplo
```
RANKING - 38 posts - 7 cuentas
 38,4x HIT  @cuenta_a   412.000 vistas   "nadie te dice que tus primeros 30 reels son para fallar"
 11,2x HIT  @cuenta_c   180.000 vistas
```
