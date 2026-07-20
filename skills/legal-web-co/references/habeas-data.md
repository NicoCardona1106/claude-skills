# Habeas data — protección de datos personales en Colombia

Marco: **Ley 1581 de 2012** (régimen general) y **Decreto 1377 de 2013**
(reglamentario, hoy compilado en el Decreto 1074 de 2015). Autoridad:
Superintendencia de Industria y Comercio (SIC). Verificar vigencia y cambios
en suin-juriscol.gov.co antes de citar en un documento final.

## Cuándo aplica

Siempre que el sitio recolecte, almacene, use o circule datos personales de
personas naturales: formularios de contacto, registro de cuentas, checkout,
newsletters, cookies que identifican al usuario, chatbots que guardan
conversaciones, analítica con identificadores.

## Obligaciones del responsable (la empresa dueña del sitio)

1. **Autorización previa, expresa e informada** del titular ANTES de
   recolectar. En la práctica web: checkbox NO premarcado junto al
   formulario, con enlace a la política. Debe informarse la finalidad
   concreta ("enviarte la cotización", no "fines comerciales" a secas).
2. **Política de tratamiento de datos personales** publicada. Contenido
   mínimo (Decreto 1377):
   - Identificación del responsable: razón social, NIT, dirección, correo,
     teléfono.
   - Tratamientos y finalidades específicas de cada tipo de dato.
   - Derechos del titular y cómo ejercerlos.
   - Canal y procedimiento para consultas y reclamos.
   - Fecha de entrada en vigencia y período de vigencia de las bases.
3. **Aviso de privacidad**: versión corta que se muestra en el punto de
   recolección cuando no cabe la política completa, con enlace a ella.
4. **Datos sensibles** (salud, biometría, orientación, creencias): la
   autorización debe ser explícita, informar que responder es facultativo, y
   evitar recolectarlos salvo necesidad real.
5. **Menores de edad**: tratamiento excepcional — solo datos de naturaleza
   pública o con autorización del representante legal, respetando el interés
   superior del menor.
6. **Seguridad y confidencialidad**: medidas técnicas razonables (TLS,
   control de acceso, no exponer datos en URLs ni logs públicos).
7. **Encargados** (proveedores que procesan datos por cuenta de la empresa:
   hosting, CRM, pasarela, email marketing): contrato o cláusulas de
   tratamiento de datos con cada uno.

## Derechos del titular (arts. 8, 14 y 15, Ley 1581)

Conocer, actualizar, rectificar y suprimir sus datos, y revocar la
autorización. Plazos de respuesta: **consultas, máximo 10 días hábiles**
(prorrogables 5 más informando); **reclamos, máximo 15 días hábiles**
(prorrogables 8 más). El canal para ejercerlos debe existir de verdad y
estar en la política.

## RNBD — Registro Nacional de Bases de Datos

Registro ante la SIC de las bases de datos personales. El Decreto 090 de
2018 limitó la obligación a sociedades y entidades sin ánimo de lucro con
activos totales superiores a 100.000 UVT, y a las personas jurídicas de
naturaleza pública. **Verificar el umbral vigente en sic.gov.co antes de
afirmar si un cliente está obligado** — la mayoría de pymes quedó exenta,
pero el deber de cumplir la ley sigue aplicando a todas.

## Transferencia internacional

Enviar datos a servidores fuera de Colombia (Supabase, Vercel, Google, etc.)
es transferencia/transmisión internacional. Procede con autorización del
titular o hacia países con nivel adecuado de protección según la
Circular de la SIC (la lista de países la publica la SIC — verificarla).
En la práctica: mencionarlo en la política y nombrar los proveedores o
categorías de proveedores.

## Sanciones

La SIC puede imponer multas de hasta 2.000 SMMLV, además de suspensión o
cierre de operaciones de tratamiento. El riesgo real más frecuente para un
sitio pyme: reclamo de un titular no respondido a tiempo.

## Cookies

Colombia no tiene una "ley de cookies" específica tipo ePrivacy europea:
las cookies que recolectan datos personales o perfilan caen bajo el régimen
general de habeas data (autorización + información). Práctica recomendada:
banner con aceptación/rechazo de cookies no esenciales + sección de cookies
en la política. Si el sitio vende o dirige servicios a personas en la UE,
aplica además GDPR — señalarlo, está fuera del alcance de esta skill.
