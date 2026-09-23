---
name: srs
description: "SRS (Especificación de Requisitos de Software) OBLIGATORIO antes de construir cualquier web, app, API o SaaS de Nicolas: documento completo en docs/SRS.md con checklist de aceptación, exportado a PDF, y aprobado por Nicolas antes de escribir código. Usar cuando arranque un proyecto nuevo, un módulo grande o cuando Nicolas diga /srs, 'haz el SRS', 'especificación de requisitos'. Complementa a fable-plan (Modo Blueprint = arquitectura) y a nicolas-mode."
---

# /srs — Especificación de Requisitos de Software

Regla de Nicolas (2026-09-22): **antes de hacer una web o cualquier app se
hace un SRS completo, es obligación**, para saber qué hará todo, y se sube a
un PDF con checklist. Sin SRS aprobado no se escribe código de un proyecto
nuevo (ni de un módulo grande: una fase entera, un portal, un agente nuevo).

Qué NO necesita SRS: un arreglo, una función pequeña con requisitos claros,
un ajuste visual. Ahí basta el plan de `nicolas-mode` → DESARROLLO.

## Flujo

1. **Entender antes de escribir.** Leer lo que exista (SEMANA.md, PLAN.md,
   memoria, Mempalace, documentos del cliente). Preguntar a Nicolas SOLO lo
   que no se pueda deducir; agrupar las preguntas en un solo mensaje.
2. **Escribir `docs/SRS.md`** en el repo del proyecto (si el repo no existe
   aún, en la carpeta del proyecto dentro de nc-workspace) con la plantilla
   de abajo. Todo requisito lleva ID (`RF-01`, `RNF-03`), prioridad
   (Debe / Debería / Podría) y criterio de aceptación verificable.
3. **Checklist final** dentro del mismo documento: una casilla por requisito
   «Debe» + las de calidad. Es la lista que se chulea al entregar.
4. **PDF**: `python <herramientas>/md-a-pdf.py docs/SRS.md --sin-internas`
   (Reflexcam: `sociedad/reflexcam/documentos/herramientas/md-a-pdf.py`;
   Nicolas persona natural o proyecto propio:
   `propios/documentos-nicolas/herramientas/md-a-pdf.py`). Si el proyecto no
   tiene identidad, la skill `exportar-pdf`. Abrir el PDF y comprobar cortes
   de página y tablas.
5. **Aprobación de Nicolas.** Presentar: alcance en 5 líneas, número de RF/RNF,
   lo que quedó fuera y las dudas abiertas. Se construye solo cuando diga que
   sí. Cambios posteriores de alcance → editar el SRS (sección 8, historial)
   y regenerar el PDF, no parchear de palabra.
6. **Al cerrar el proyecto**, chulear la checklist del SRS y dejar el PDF
   final junto al primero (`SRS-v1.pdf`, `SRS-final.pdf`).

Con `fable-plan` (Modo Blueprint): el SRS dice QUÉ y para QUIÉN; el blueprint
dice CÓMO (arquitectura, stack, carpetas). Orden: SRS → aprobación →
blueprint → código. No mezclar los dos documentos.

## Plantilla de `docs/SRS.md`

```markdown
# SRS — <Nombre del sistema>

Versión 1.0 · <fecha> · Autor: Nicolas Cardona (redactado con Claude)
Cliente / dueño: <quién> · Estado: BORRADOR | APROBADO <fecha>

## 1. Introducción
1.1 Propósito del documento y a quién va dirigido.
1.2 Alcance: qué es el sistema, qué hace y qué NO hace (lista explícita).
1.3 Definiciones y siglas (tenant, deal, kit…).
1.4 Referencias (propuesta, contrato, PLAN.md, documentos del cliente).

## 2. Descripción general
2.1 Perspectiva: sistema nuevo o parte de otro; con qué se integra
    (Supabase, Meta, Vercel, NccHUB…). Diagrama de contexto si aplica.
2.2 Funciones principales (5-10 líneas, sin detalle).
2.3 Usuarios y roles: quién, cuántos, qué sabe hacer, desde qué dispositivo.
2.4 Entorno: navegadores/dispositivos, hosting, dominios, límites de plan.
2.5 Restricciones: legales (habeas data, DIAN), presupuesto, plazos, stack
    impuesto, sin NIT, etc.
2.6 Supuestos y dependencias (lo que se da por cierto y de quién depende).

## 3. Requisitos funcionales
Uno por bloque. Formato:

| ID | Requisito | Prioridad | Criterio de aceptación |
|---|---|---|---|
| RF-01 | El sistema debe … | Debe | Dado … cuando … entonces … |

Agrupar por módulo (Autenticación, Cuentas, Pagos…). Cada RF con su
criterio verificable (qué se ve, qué responde, qué queda guardado).

## 4. Requisitos de interfaz
4.1 Interfaz de usuario: pantallas principales, navegación, móvil primero
    (390) y escritorio (1440), idioma, accesibilidad mínima.
4.2 Interfaces externas: APIs que consume y expone (auth, formato, límites).
4.3 Interfaces de hardware si aplica (NFC, impresoras, lectores).

## 5. Requisitos no funcionales
| ID | Tipo | Requisito | Medida |
|---|---|---|---|
| RNF-01 | Rendimiento | … | p95 < 1 s en menús |
Tipos: rendimiento, seguridad (RLS, secretos, validación en bordes),
disponibilidad, respaldo, escalabilidad, mantenibilidad, privacidad/legal,
observabilidad (logs, healthcheck), costos de operación (IA, mensajes).

## 6. Datos
6.1 Entidades principales y relaciones (cabecera + detalle, nunca JSON
    empaquetado). 6.2 Datos sensibles y su tratamiento. 6.3 Retención y
    respaldo. 6.4 Migración de datos existentes si los hay.

## 7. Fuera de alcance y futuro
Lo que se pidió o se pensó y NO entra en esta versión, con motivo.

## 8. Historial de cambios
| Versión | Fecha | Cambio | Quién aprobó |

## 9. Checklist de aceptación
- [ ] RF-01 … (uno por requisito «Debe»)
- [ ] RNF-… (los medibles)
- [ ] Verificación visual 390 / 1440 (Playwright), consola limpia
- [ ] Seguridad básica (RLS, secretos fuera de git, validación en bordes)
- [ ] Legal (privacidad, datos personales, cookies) si hay usuarios externos
- [ ] Documentación (README, CLAUDE.md, PLAN.md al día)
- [ ] Aprobación final de Nicolas (fecha)
```

## Criterios de un SRS bien hecho

- Cada requisito es **verificable** (si no se puede probar, no es requisito).
- Nada ambiguo: «rápido», «fácil», «seguro» se cambian por medidas.
- Sin diseño ni código dentro: el CÓMO va al blueprint.
- Lo que ve un cliente o socio (nombres, precios, plazos) validado con
  Nicolas antes de hornearlo en el PDF.
- Máximo útil: un SRS de 4-8 páginas para una app pequeña; más largo solo si
  el sistema lo exige.

---

Autor: Nicolas Cardona Carrillo. Licencia CC BY 4.0
Origen: https://github.com/NicoCardona1106/claude-skills
