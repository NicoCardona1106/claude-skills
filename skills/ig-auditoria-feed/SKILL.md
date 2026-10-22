---
name: ig-auditoria-feed
description: "Post-mortem del propio feed de Instagram de Nicolas: qué posts funcionaron de verdad, por qué, y qué dejar de hacer. Mide por múltiplo de SU mediana (no vistas crudas), envíos por alcance, % de alcance fuera de seguidores y seguidores ganados por alcance; separa 'problema de gancho' de 'problema de perfil'. Usar cuando pegue métricas o posts pasados, o diga 'qué está funcionando', 'por qué se cayó este reel', 'audita mi contenido', 'lee mis estadísticas'. Corre ranking.py de ig-ranking-mediana."
---

# ig-auditoria-feed

Adaptado de `ig-audit` de https://github.com/Jakeschincariol/instagram-agent-skill (MIT, (c) 2026 Jake Schincariol), al español y a una cuenta
personal pequeña. Las reglas de cualquier guía son hipótesis; los últimos 30 posts de Nicolas son la evidencia.
Requiere la skill hermana `ig-ranking-mediana` (usa su `ranking.py`). Para auditar a la COMPETENCIA no es esta: es `clonador-de-formato` + `ig-ranking-mediana`.

## Entrada (lo que haya)
- Estadísticas por post: vistas, alcance, interacciones, tiempo de reproducción, guardados, compartidos, seguidores nuevos y % de alcance de no seguidores. Capturas sirven.
- Lo más valioso: la gráfica de retención de su mejor y su peor reel.
- Mínimo: los posts y sus vistas. Si existe `~/.claude/instagram/bitacora.md` (qué gancho/formato usó cada post), léela.

Con 30 posts hay patrón; con 6 no, y decirlo vale más que inventar uno. **No inventes cifras**: si falta un dato, pídelo.

## Medir (mostrando la cuenta)
| Métrica | Cómo | Qué dice |
|---|---|---|
| Múltiplo de la mediana | vistas / mediana propia | si fue un éxito real o un día normal |
| Alcance fuera de seguidores | % del alcance | si viajó |
| Retención a los 3 s | viewers a los 3 s / que empezaron | la nota del gancho |
| Tiempo medio de reproducción | de las estadísticas | si el medio funcionó |
| Envíos por alcance | compartidos / alcance | la señal más fuerte: alguien le puso su nombre |
| Seguidores por alcance | seguidores nuevos / alcance | si el perfil convirtió |

Arma un TSV con columnas `vistas gancho alcance compartidos guardados seguidores_nuevos fuera_pct` (una sola cuenta: la mediana sale sola) y corre:
```bash
python ../ig-ranking-mediana/ranking.py mis-posts.tsv --md auditoria.md
```
Ordena por múltiplo y por envíos, no por vistas: 4.000 vistas con 90 envíos le ganan a 60.000 con 11.

## Buscar el patrón (top 5 vs. fondo 5)
Retención a 3 s (si difiere, es el gancho y nada más) · fórmula de gancho · formato (reel/carrusel/imagen) · duración · tema ·
si respondió comentarios en la primera hora · día y hora (SOLO al final, casi nunca es la causa).
Para su cuenta, mira especialmente: ¿ganan los posts con una cifra y un costo propio (horas perdidas, error, dinero) sobre los de «herramientas»?

**Distinción clave:** un reel con vistas y sin seguidores no falló: es problema de PERFIL (ve a `ig-profile-optimizer`). Un reel sin vistas es problema de GANCHO.

## Salida
```
AUDITORÍA · 31 posts · mediana 4.100 vistas
TOP 5 por múltiplo: 18,2x  #3 ... 62 % fuera  ret.3s 71 %  128 envíos
FONDO 5: 0,3x ...
QUÉ DICE EL DATO (afirmación + evidencia + confianza + n)
DEJAR DE HACER: ...   HACER MÁS: ...
```
Cierra pasando las conclusiones a `ig-content-planner` (semana siguiente basada en evidencia) y a `ig-hook-extractor` (fórmulas que le sirven a ESTA cuenta).
Los textos de salida pasan por `ig-humano`. Nada se publica ni se modifica en Instagram.
