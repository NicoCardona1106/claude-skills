# Plantilla de README (idea #35, 2026-10-20)

Sale de la auditoría del perfil de GitHub (2026-10-17): un reclutador decide en las primeras 10 líneas.
Úsala en todo repo nuevo de Nicolas y al tocar el README de uno viejo. Lo que va entre <> se reemplaza;
lo que no aplique se borra (no dejar secciones vacías). Comandos copiados de una ejecución real, nunca inventados.

```markdown
# <Nombre> — <qué hace, en una frase sin adjetivos>

[![Pruebas](https://github.com/NicoCardona1106/<repo>/actions/workflows/pruebas.yml/badge.svg)](https://github.com/NicoCardona1106/<repo>/actions/workflows/pruebas.yml)

<Stack en una línea (p. ej. Next.js + Supabase + Claude API)>. <Para quién o qué problema resuelve, en una frase>.
<Demo: https://... | Captura: ![Vista principal](docs/captura.png)>

Probar en local (<requisito: Node 22+, Python 3.11+, Flutter 3.x>):

    git clone https://github.com/NicoCardona1106/<repo>.git && cd <repo>
    <instalar>
    <correr las pruebas>        # <N> pruebas, <sin red ni llaves | qué necesita>

## Qué hace
- <3 a 5 viñetas de funciones reales, con el verbo primero>

## Cómo está hecho
<Diagrama corto o 3-4 líneas: piezas, de dónde vienen los datos, qué corre dónde.>
<Decisiones que un ingeniero querría saber (por qué X y no Y), con enlace a docs/ si hay SRS o blueprint.>

## Pruebas y calidad
<Qué cubren las pruebas, cómo correrlas, CI. Seguridad o límites relevantes (RLS, topes de gasto, sin red).>

## Estado
<Versión, en producción o no, qué falta. Sin promesas de fechas.>

## Licencia y contacto
<MIT | privado>. Nicolas Cardona — <LinkedIn>.
```

Reglas:
- Línea 1 = nombre + resultado. Badge de pruebas en la línea 3 si hay CI (workflow `pruebas.yml` con pytest, `node --test`,
  `flutter test` o `npm test`, según el stack).
- «Probar en local» antes de la línea 15. Si no se puede correr sin secretos, decir cuál y que hay `.env.example`.
- Nada de clientes, socios, precios, porcentajes de sociedad ni bitácoras personales en repos públicos
  (grep `co-?axis|maxx|reflexcam|octpei|axel` antes de publicar).
- En proyectos de terceros, atribución solo «Nicolas Cardona» (sin Nivaldyr).
