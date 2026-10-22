---
name: hazlo-tuyo
description: Construir la versión propia de una herramienta de pago para el uso diario de Nicolas, solo con lo que él usa de verdad, sin copiar código ni romper licencias. Usar cuando Nicolas diga 'hazlo tuyo', 'quiero mi propia versión de X', 'no quiero pagar por X si solo uso esto', 'cómo hace X para…', o cuando una suscripción cobre por mucho más de lo que él usa (como pasó con NConvertir frente a los conversores de pago). También para entender cómo está hecha una función de una web o app que le gustó y hacer la suya.
---

# Hazlo tuyo

Nicolas no quiere pagar de más por herramientas que usa al 20 %. Esta skill convierte «quiero mi
versión de X» en una herramienta propia, pequeña y adaptada a su forma de trabajar. Ejemplo ya hecho:
NConvertir (clic derecho en Windows: PDF escaneado → Word con fotos) en vez de un conversor de pago.

## Límite (no negociable)

Se construye una versión **propia**: se estudia QUÉ hace la herramienta (su comportamiento visible,
su documentación pública, sus formatos) y se implementa desde cero con piezas libres. Nunca:
- romper o saltarse una licencia, activación, DRM o pago (cracks, keygens, parches, «Pro gratis»);
- copiar código, binarios, plantillas, efectos, fuentes o assets propietarios de la herramienta;
- usar cuentas o APIs privadas de la herramienta fuera de sus términos.
Si el pedido solo se logra así, decirlo claro y proponer la alternativa propia o libre. Que sea para
uso personal no cambia esto.

## Pasos

1. **Inventario de uso real.** Preguntar (máximo 5 preguntas) qué funciones usa de verdad, con qué
   frecuencia, en qué equipo y qué le molesta de la herramienta. Resultado: lista corta «lo que sí
   uso / lo que nunca toco». Si lo que usa está en el plan gratis de la herramienta, decirlo y parar:
   lo más barato es no construir nada.
2. **Cómo funciona (sin código ajeno).** Por cada función: qué entra, qué sale y qué técnica pública
   la hace posible (p. ej. subtítulos automáticos = reconocimiento de voz + archivo SRT; quitar fondo
   = segmentación). Fuentes: documentación pública, formatos abiertos, papers, proyectos libres. Para
   una web, leer su HTML/JS público para aprender la técnica, nunca para copiarlo (ver la página
   «viva» de moahu en nc-design: leer el JS directo enseñó más que una herramienta de ingeniería
   inversa).
3. **Piezas libres primero** (ladder de ponytail): ¿ya existe en su máquina o en una herramienta
   propia (NConvertir, N-Coterminal, carrusel)? ¿Lo resuelve una librería libre con licencia
   compatible (ffmpeg, whisper.cpp, ImageMagick, Tesseract, rembg, Playwright…)? Anotar licencia y
   versión verificada en el registro real (npm, PyPI, GitHub releases).
4. **Comparar antes de construir.** Tabla corta: herramienta de pago (precio real verificado en vivo)
   vs. alternativa libre ya hecha vs. versión propia (horas estimadas, mantenimiento). Recomendar una.
   Si conviene pagar, decirlo.
5. **Construir lo mínimo** que cubre la lista «lo que sí uso», en el stack de Nicolas y con SRS si es
   una app (skill `srs`); para utilidades pequeñas basta un contrato de `orquesta`. Integrado a donde
   ya trabaja: clic derecho de Windows, N-Coterminal, widget de la Xeneon, NPersonal o un `.cmd` en el
   Escritorio.
6. **Probar con sus archivos reales** y dejar una prueba que falle si se rompe. Entregar con el
   paso a paso de uso en `Escritorio\Entregas`.

## Ideas ya detectadas
- Video (frente a CapCut Pro): recortar, subtítulos automáticos en español, quitar silencios, exportar
  9:16, música libre — ffmpeg + whisper.cpp + una interfaz mínima. Antes: verificar el precio real de
  CapCut Pro y qué trae el plan gratis.
- Conversión de documentos: NConvertir (hecho; v2 con menú circular pendiente).

---
© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
