---
name: wizard
description: Genera un asistente guiado en PowerShell (wizard) que lleva a Nicolas paso a paso por lo que Claude NO puede hacer — entrar por SSH al VPS, crear claves o tokens, paneles con contraseña (Meta, Vercel, Supabase, Tailscale, Mercado Pago), migraciones o despliegues manuales —: abre cada página, dice qué hacer, corre cada comando mostrando el resultado, pide confirmación antes de lo irreversible y cierra con un resumen. Usar cuando el clasificador bloquee una acción y haya que dejársela a Nicolas, o cuando diga 'wizard', 'hazme el paso a paso', 'guíame', '/wizard'. No usar para lo que Claude sí puede hacer solo.
---

# Wizard (asistente guiado)

En vez de pegarle a Nicolas un bloque de comandos para copiar y que pegue la salida, se le deja un script que:
muestra **un paso a la vez** con el progreso (Paso 2/5), abre la URL que toca, dice exactamente qué hacer, corre el
comando y **comprueba** que salió bien, pide los valores que él copia (los secretos sin mostrarlos), los guarda donde
van, pide **confirmación antes de lo irreversible** y al final dice qué quedó hecho y qué no.

La plantilla [plantilla.ps1](plantilla.ps1) ya resuelve la experiencia: no se edita la parte de arriba del marcador
`PASOS`; solo se escriben los pasos.

## Proceso

1. **Delimitar.** Lista cada paso manual y cada valor que se captura. Lee antes el repo (`.env.example`, README,
   workflows, scripts de despliegue) en vez de preguntar en frío. Muéstrale a Nicolas la lista ordenada y espera su OK.
   Para cada valor: de dónde sale, dónde se guarda (`.env`, Keeper, en ningún lado) y si es secreto.
2. **Trazar el camino.** Por paso: URL exacta, qué clic, dónde aparece el valor, qué comando y qué salida significa
   «bien». Si no conoces la pantalla o el comando actual, dilo y verifícalo en la documentación: **nunca inventes pasos**.
3. **Escribirlo.** Copia `plantilla.ps1` a `nc-workspace\temporales\<tema>\asistente.ps1` (es desechable; solo va al
   repo si Nicolas quiere repetirlo). Un `Paso` por tarea, en orden de dependencia, y `$TotalPasos` igual al número de pasos.
   - Antes de tocar algo que ya existe (VPS, `.env`, iptables, base de datos): **respaldo primero** (`Ejecutar` con el
     comando de respaldo) y di dónde quedó.
   - `PreguntarSecreto` para claves y tokens: nunca se muestran ni se escriben en el log. Si van a Keeper, dilo.
   - `Confirmar` antes de lo irreversible (borrar, migrar, publicar, reiniciar un servicio con clientes).
   - `Ejecutar` comprueba el código de salida y, si le pasas `-Esperado`, que la salida contenga ese texto.
   - Nada de secretos en la línea de comandos que se muestra.
4. **Verificar y entregar.** Comprueba la sintaxis sin ejecutarlo:
   `powershell -NoProfile -Command "$null = [scriptblock]::Create((Get-Content -Raw '<ruta>'))"`.
   No lo corras tú (abre navegadores y espera a Nicolas). Recórrelo a mano: cada valor del paso 1 se captura y llega a
   donde debía. Dale a Nicolas UNA línea para correrlo:
   `powershell -ExecutionPolicy Bypass -File "<ruta>"`, y pídele que pegue el resumen final.

## Reglas de Nicolas que aplican

- Respaldo antes de reorganizar o sobrescribir; nunca borrar sin respaldo.
- Claves en Keeper, no en archivos sueltos.
- El clasificador bloquea a Claude el SSH al VPS, crear credenciales y tareas al inicio: justo para eso es esta skill.
- Nunca matar procesos por nombre en los pasos; solo por PID.

## Créditos

Adaptada de la skill `wizard` de Matt Pocock (github.com/mattpocock/skills, MIT): misma idea y mismo flujo; la
plantilla se reescribió para PowerShell en Windows y en español.

MIT License · Copyright (c) 2026 Matt Pocock. Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
following conditions: The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

---
© 2026 Nicolas Cardona Carrillo. Licencia CC BY 4.0:
puede usarse y adaptarse conservando este crédito.
Origen: https://github.com/NicoCardona1106/claude-skills
