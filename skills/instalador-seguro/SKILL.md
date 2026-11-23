---
name: instalador-seguro
description: Usar al escribir o revisar un script que instala, registra o quita algo en la configuración de un CLI o del equipo (registrar MCP, hooks en settings.json, statusline, servicios systemd, tareas programadas, activar-pc.ps1). No usar para despliegues de apps (ver desplegar-nct2).
---
# Instalador seguro (reglas tomadas del setup de REA)

1. **Primero el plan.** Sin bandera, el script solo muestra qué haría (rutas exactas, qué agrega o reemplaza)
   y sale con código 0. Para aplicar hace falta `--aplicar`. Si se cancela, no cambia nada.
2. **Detectar no es tener permiso.** Si encuentra un CLI instalado, lo propone, pero no lo marca solo: los
   destinos se eligen con `--solo` o se confirman.
3. **Solo suma y se puede repetir.** Toca únicamente su propia entrada (la reconoce por un nombre o una ruta
   fijos). Correrlo dos veces deja lo mismo y no crea un respaldo nuevo.
4. **La primera copia de respaldo es sagrada.** El respaldo se crea con exclusión (`COPYFILE_EXCL`) y nunca se
   sobrescribe. Si el archivo cambió desde entonces, se guarda una segunda copia con fecha, sin pisar la primera.
5. **Escribir y comprobar.** Escribe en un temporal, lo renombra encima del original y lo vuelve a leer: si
   no quedó lo esperado, lo dice y nombra el respaldo para recuperarlo.
6. **Quitar limpio.** Todo instalador trae `--quitar`, que borra solo lo suyo, deja lo ajeno y también tiene plan.
7. **No instala lo que no le toca** (Node, Java, git…): si falta un requisito, lo reporta.
Prueba mínima: plan → aplicar → aplicar otra vez (sin cambios) → quitar, todo sobre un HOME de prueba.
