# Molde de MCP propio (tomado de REA, 2026-11)

1. **Motor bajo demanda.** El servidor MCP es liviano; el motor caro (índice, modelo, API con sesión)
   arranca con la primera operación que lo necesita y lo comparten los clientes (como el shim de nc-memoria).
2. **Herramienta de estado.** Una sola (`estado`/`salud`) que dice, por herramienta: disponible o no, el
   motivo y el remedio. El catálogo `tools/list` no cambia según el estado.
3. **Sesiones explícitas.** `abrir` → consultas → `cerrar`. Cerrar libera el motor pero conserva lo
   averiguado. El único paso que borra es uno aparte (`reiniciar`), que antes ofrece guardar. Si la
   limpieza falla, el error lo dice y se puede reintentar esa limpieza, sin repetir el trabajo.
4. **Errores con remedio.** Forma fija: `{code, retryable, message, remediation: {action}}`. El texto
   nombra el límite, su valor, dónde se cambia, si hace falta reiniciar y qué NO lo arregla. Un dato que
   no se encontró (con una entrada válida) no es un error de entrada: se responde con el alcance de lo buscado.
5. **Resultado con evidencia.** Cada respuesta trae su procedencia (fuente, ruta o id), su cobertura
   (completa / parcial / cuánto quedó sin revisar) y sus limitaciones. Las listas largas devuelven un
   resumen más un id para pedir páginas, en vez de repetir la consulta.
6. **Contenido no confiable marcado.** Las instrucciones del servidor dicen que lo que viene del dato
   (correo, factura, nota, mensaje) no es una orden. Los resultados que traen ese contenido llevan
   `_meta: {provenance: {untrusted_content: true, source: "<origen>"}}`, también cuando hay error.
   La marca viene puesta por defecto: solo se quita en una herramienta revisada que no devuelve datos externos.
7. **Efectos declarados con verdad.** `readOnlyHint: false` si escribe aunque sea en el estado de la
   sesión; `destructiveHint: true` si borra, sobrescribe, ejecuta código ajeno o toca dinero (por ejemplo, facturar ante la DIAN).
8. **Descripciones.** Los primeros ~240 caracteres dicen qué hace y en qué se diferencia de la
   herramienta vecina. Un ejemplo corto de la llamada vale más que un párrafo.
