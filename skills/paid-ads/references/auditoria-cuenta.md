# Auditoría de cuenta de pauta (Ads Health Score)

Producto de entrada para vender auditorías de pauta a negocios locales en Colombia.
Cruza con el servicio de auditoría de redes. Método absorbido de claude-ads (MIT):
los checklists, el scoring y el schema de salida están en esta misma carpeta.

## Archivos

| Archivo | Qué es |
|---|---|
| `meta-audit.md` | 50 checks Meta (Pixel/CAPI 30%, Creativo 30%, Estructura 20%, Audiencias 20%) |
| `google-audit.md` | 80 checks Google (Conversion Tracking 25%, Wasted Spend 20%, Estructura 15%, Keywords/QS 15%, Ads & Assets 15%, Settings 10%) |
| `tiktok-audit.md` | 28 checks TikTok (Creativo 30%, Técnico 25%, Puja 20%, Estructura 15%, Performance 10%) |
| `scoring-system.md` | Fórmula del Health Score 0-100, severidades, grados A-F, quick wins, agregado multiplataforma |
| `audit-output-schema.json` | JSON de salida estable (sirve para pasar el reporte a `exportar-pdf`) |
| `plantilla-negocio-local.md` | Plantilla de plan para negocio local, con adaptación a Colombia arriba |

## Proceso (7 pasos)

1. **Recoger datos.** Sin API ni MCP: pedir exports CSV/JSON del Ads Manager, capturas de
   pantalla o cifras pegadas a mano. Anotar la fuente en `data_source`
   (`export | screenshot | manual | mixed`). Mínimo útil: últimos 30 días de campañas,
   conjuntos/grupos y anuncios; configuración de Pixel/etiqueta de conversión; términos
   de búsqueda (Google).
2. **Leer el checklist de la plataforma** (`<plataforma>-audit.md`).
3. **Benchmarks.** Los del checklist son de mercado estadounidense en USD. Usarlos como
   orientación, nunca como veredicto; ver "Ajustes para Colombia".
4. **Evaluar cada check** como `PASS`, `WARNING`, `FAIL` o `N/A`. `N/A` solo cuando el dato
   no se pudo obtener, nunca para esconder un fallo. Cada `N/A` lleva su motivo.
5. **Calcular el score** con `scoring-system.md`: severidad Critical 5 / High 3 / Medium 1.5 /
   Low 0.5; WARNING vale 50%; N/A se excluye. Grados: A 90+, B 75+, C 60+, D 40+, F.
6. **Quick wins**: checks Critical o High con arreglo de 15 minutos o menos, ordenados por impacto.
7. **Salida doble**: JSON validando `audit-output-schema.json` + informe en markdown
   (score, desglose por categoría, tabla por check, quick wins, plan de 30 días). El
   informe que ve el cliente va en español y pasa por `exportar-pdf`.

## Ajustes para Colombia

- **Moneda.** Los umbrales en USD (ej. G16 "> $10 spend", M17 presupuesto ≥ $10/día,
  M-ST1 presupuesto ≥ 5×CPA, mínimos de $1.500/mes) están sin recalibrar. Hasta que
  Nicolas los valide con cuentas reales, tratarlos como WARNING en vez de FAIL cuando el
  único motivo sea la cifra en dólares, y decirlo en el informe.
- **No aplican (marcar N/A con motivo "no disponible en Colombia"):** G45 Consent Mode v2
  (obligación EEA/UK; en Colombia aplica Ley 1581 vía `legal-web-co`), G-CTV1 (CTV
  Floodlight), Google Local Services Ads (LSA no existe en Colombia; en la plantilla local
  su presupuesto va a Search + Google Business Profile).
- **Conversión principal de un negocio local:** clic a WhatsApp (click-to-chat) y llamada,
  no formulario. Verificar que el Pixel/etiqueta registre el clic a `wa.me` como conversión;
  si no, es FAIL en la categoría de tracking aunque el Pixel esté instalado.
- **Google Business Profile** cuenta como activo de pauta local: sin ficha verificada y con
  reseñas, la campaña de Search local rinde menos. Revisarlo aunque no sea un check del
  catálogo.

## Entregable comercial

- Diagnóstico express de solo lectura: score + 5 quick wins en 1 página. Es el gancho.
- Auditoría completa: informe PDF con las tres plataformas que use el cliente, plan de
  30 días y propuesta de gestión mensual.
- Precio y empaquetado: pendiente de definir con la auditoría de redes (SEMANA.md).
