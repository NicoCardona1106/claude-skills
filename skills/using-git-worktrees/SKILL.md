---
name: using-git-worktrees
description: Usar al empezar trabajo de una función que necesita aislarse del workspace actual, o antes de ejecutar planes de implementación — asegura que exista un workspace aislado vía herramientas nativas o, si no hay, git worktree como respaldo
---

# Usando Git Worktrees

## Resumen

Asegura que el trabajo ocurra en un workspace aislado. Prefiere las herramientas nativas de worktree de tu plataforma. Recurre a git worktree manual solo cuando no haya ninguna herramienta nativa disponible.

**Principio núcleo:** Detecta primero si ya hay aislamiento. Después usa herramientas nativas. Después recurre a git. Nunca pelees contra el harness.

**Anuncia al empezar:** "Estoy usando la skill using-git-worktrees para preparar un workspace aislado."

## Paso 0: Detectar aislamiento existente

**Antes de crear nada, revisa si ya estás en un workspace aislado.**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Guard de submódulos:** `GIT_DIR != GIT_COMMON` también da verdadero dentro de submódulos de git. Antes de concluir "ya estoy en un worktree", verifica que no estés en un submódulo:

```bash
# Si esto devuelve una ruta, estás en un submódulo, no en un worktree — trátalo como repo normal
git rev-parse --show-superproject-working-tree 2>/dev/null
```

**Si `GIT_DIR != GIT_COMMON` (y no es un submódulo):** Ya estás en un worktree enlazado. Salta al Paso 2 (Configuración del proyecto). NO crees otro worktree.

Reporta con el estado de la rama:
- En una rama: "Ya en workspace aislado en `<ruta>` en la rama `<nombre>`."
- HEAD desprendido (detached HEAD): "Ya en workspace aislado en `<ruta>` (detached HEAD, gestionado externamente). Hace falta crear rama al finalizar."

**Si `GIT_DIR == GIT_COMMON` (o estás en un submódulo):** Estás en un checkout de repo normal.

¿El usuario ya indicó su preferencia sobre worktrees en tus instrucciones? Si no, pide consentimiento antes de crear un worktree:

> "¿Quieres que prepare un worktree aislado? Protege tu rama actual de los cambios."

Respeta cualquier preferencia ya declarada sin volver a preguntar. Si el usuario rechaza, trabaja en el sitio actual y salta al Paso 2.

## Paso 1: Crear el workspace aislado

**Tienes dos mecanismos. Pruébalos en este orden.**

Si tus instrucciones fijan una carpeta de worktrees (p. ej. `temporales/` en nc-workspace), usa `git worktree add` en esa carpeta aunque haya herramienta nativa, e instala dependencias con `npm ci`.

### 1a. Herramientas nativas de worktree (preferido)

El usuario ya dio su consentimiento (Paso 0) para un workspace aislado. ¿Ya tienes una forma de crear un worktree? Puede ser una herramienta con un nombre como `EnterWorktree`, `WorktreeCreate`, un comando `/worktree`, o una bandera `--worktree`. Si la tienes, úsala y salta al Paso 2.

Las herramientas nativas manejan la ubicación del directorio, la creación de rama y la limpieza automáticamente. Usar `git worktree add` cuando ya tienes una herramienta nativa crea estado fantasma que tu harness no puede ver ni gestionar.

Avanza al Paso 1b solo si no tienes ninguna herramienta nativa de worktree disponible.

### 1b. Git worktree como respaldo

**Usa esto solo si el Paso 1a no aplica** — no tienes ninguna herramienta nativa de worktree disponible. Crea un worktree manualmente con git.

#### Selección de directorio

Sigue este orden de prioridad. La preferencia explícita del usuario siempre gana sobre el estado observado del filesystem.

1. **Revisa tus instrucciones en busca de una preferencia declarada de directorio de worktree.** Si el usuario ya especificó una, úsala sin preguntar.

2. **Revisa si ya existe un directorio de worktree local del proyecto:**
   ```bash
   ls -d .worktrees 2>/dev/null     # Preferido (oculto)
   ls -d worktrees 2>/dev/null      # Alternativa
   ```
   Si lo encuentras, úsalo. Si existen ambos, gana `.worktrees`.

3. **Si no hay ninguna otra guía disponible**, usa por defecto `.worktrees/` en la raíz del proyecto.

#### Verificación de seguridad (solo directorios locales del proyecto)

**DEBES verificar que el directorio esté ignorado antes de crear el worktree:**

```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

**Si NO está ignorado:** Agrégalo a .gitignore, commitea el cambio, y luego procede.

**Por qué es crítico:** Evita commitear por accidente el contenido del worktree al repositorio.

#### Crear el worktree

```bash
# Determina la ruta según la ubicación elegida
path="$LOCATION/$BRANCH_NAME"

git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**Respaldo de sandbox:** Si `git worktree add` falla con un error de permisos (denegación del sandbox), dile al usuario que el sandbox bloqueó la creación del worktree y que vas a trabajar en el directorio actual en su lugar. Luego corre la configuración y las pruebas base en el sitio.

## Paso 2: Configuración del proyecto

Autodetecta y corre la configuración apropiada:

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

## Paso 3: Verificar una base limpia

Corre las pruebas para asegurar que el workspace arranca limpio:

```bash
# Usa el comando apropiado del proyecto
npm test / cargo test / pytest / go test ./...
```

**Si las pruebas fallan:** Reporta los fallos, pregunta si continuar o investigar.

**Si las pruebas pasan:** Reporta que está listo.

### Reporte

```
Worktree listo en <ruta-completa>
Pruebas pasando (<N> pruebas, 0 fallos)
Listo para implementar <nombre-de-la-función>
```

## Referencia rápida

| Situación | Acción |
|-----------|--------|
| Ya en un worktree enlazado | Saltar creación (Paso 0) |
| En un submódulo | Tratar como repo normal (guard del Paso 0) |
| Herramienta nativa de worktree disponible | Usarla (Paso 1a) |
| Sin herramienta nativa | Git worktree como respaldo (Paso 1b) |
| `.worktrees/` existe | Usarlo (verificar que esté ignorado) |
| `worktrees/` existe | Usarlo (verificar que esté ignorado) |
| Ambos existen | Usar `.worktrees/` |
| Ninguno existe | Revisar archivo de instrucciones, luego usar por defecto `.worktrees/` |
| Directorio no ignorado | Agregar a .gitignore + commitear |
| Error de permisos al crear | Respaldo de sandbox, trabajar en el sitio |
| Pruebas fallan durante la línea base | Reportar fallos + preguntar |
| Sin package.json/Cargo.toml | Saltar instalación de dependencias |

## Racionalizaciones comunes

| Excusa | Realidad |
|--------|----------|
| "Obviamente no estoy en un worktree — no hace falta revisar" | Corre el Paso 0. El aislamiento creado por el harness y los submódulos engañan a simple vista; los comandos de detección lo resuelven. |
| "`git worktree add` es más rápido que buscar una herramienta nativa" | Una herramienta nativa (ej. `EnterWorktree`) se encarga de la ubicación, la rama y la limpieza. Saltársela es el error #1 — crea estado fantasma que tu harness no puede ver ni gestionar. |
| "Seguro el directorio de worktree ya está ignorado" | Corre `git check-ignore`. Un directorio de worktree no ignorado commitea todo el árbol al repositorio. |
| "Cualquier nombre de directorio sirve" | Las instrucciones explícitas ganan sobre un directorio local del proyecto ya existente, que a su vez gana sobre el default `.worktrees/`. |
| "El workspace está fresco — las pruebas base pueden esperar" | Una línea base sucia vuelve ambiguo cualquier fallo posterior. Corre las pruebas ahora; seguir adelante pasando por encima de fallos es decisión de tu compañero humano. |

---

Adaptado de obra/superpowers — MIT License, © 2025 Jesse Vincent. https://github.com/obra/superpowers
