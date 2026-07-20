---
name: legal-web-co
description: Cumplimiento legal colombiano para sitios web, e-commerce y SaaS de Nicolas Cardona Carrillo y sus clientes. Usar al lanzar o revisar una página, tienda o app que opere en Colombia; al redactar política de privacidad, tratamiento de datos personales (habeas data), términos y condiciones, aviso de cookies, derecho de retracto o textos de checkout; o cuando pidan "checklist legal", "textos legales del sitio" o "¿esto es legal en Colombia?".
---

# Legal Web CO — cumplimiento colombiano para sitios web

Genera los textos y checklists legales que un sitio que opera en Colombia
necesita. **No reemplaza a un abogado**: todo entregable termina con la nota
de que requiere revisión profesional antes de publicarse, y las normas citadas
deben verificarse vigentes en suin-juriscol.gov.co o sic.gov.co — este
material se escribió en julio de 2026 y las normas cambian.

## Flujo

1. **Clasifica el sitio** — determina cuáles obligaciones aplican:
   - ¿Recolecta datos personales? (formularios, cuentas, cookies con datos,
     chatbots) → habeas data. Lee `references/habeas-data.md`.
   - ¿Vende a distancia? (e-commerce, SaaS de pago) → protección al
     consumidor. Lee `references/ecommerce-consumidor.md`.
   - ¿Vende a la Unión Europea o usa herramientas que rastrean usuarios de
     allá? → además GDPR (fuera del alcance de esta skill; señalarlo).
2. **Genera los documentos que falten** — según la clasificación:

   | Documento | Obligatorio si... |
   |-----------|-------------------|
   | Política de tratamiento de datos personales | Recolecta cualquier dato personal (Ley 1581/2012) |
   | Aviso de privacidad + autorización expresa en formularios | Ídem — checkbox NO premarcado |
   | Términos y condiciones | Siempre recomendado; obligatorio en la práctica para e-commerce/SaaS |
   | Información de retracto y reversión de pago en checkout | Vende a distancia (Ley 1480/2011) |
   | Aviso de cookies | Cookies que recolectan datos personales o perfilan |
   | Identificación del comercio (razón social, NIT, contacto) | E-commerce — visible en el sitio |

3. **Corre el checklist** — `references/checklist-lanzamiento.md` antes de
   publicar. Reporta el resultado como tabla ✅/❌ (formato DoD de
   nicolas-mode).
4. **Cierra con los pendientes humanos**: revisión de abogado, registro en
   RNBD si aplica, y estado de facturación electrónica DIAN (esta skill no
   cubre lo tributario en detalle — solo lo señala).

## Reglas

- Redactar en español claro, sin copiar plantillas genéricas de internet: los
  textos nombran a la empresa real, sus finalidades reales de tratamiento y
  sus canales reales de contacto. Un documento legal con placeholders sin
  llenar es peor que no tenerlo.
- Nunca inventar números de ley, artículos ni umbrales. Si un dato normativo
  no está en las referencias de esta skill, decir que hay que verificarlo —
  no completarlo de memoria.
- Los textos de autorización de datos van ANTES del botón de envío del
  formulario, con checkbox propio, no enterrados en los T&C.
- Si el sitio es de un cliente, los documentos van a nombre del
  cliente (responsable del tratamiento), no de Nicolas.

---

© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
