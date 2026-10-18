# Asistente guiado (skill wizard). Se corre con:
#   powershell -ExecutionPolicy Bypass -File "<esta ruta>"
# Todo lo de arriba del marcador PASOS es la librería: no se edita. Los pasos van debajo.

$ErrorActionPreference = 'Stop'
$TotalPasos = 0
$script:Indice = 0
$script:Hecho = New-Object System.Collections.Generic.List[string]
$script:Saltado = New-Object System.Collections.Generic.List[string]
$EnvArchivo = if ($env:ENV_ARCHIVO) { $env:ENV_ARCHIVO } else { '.env' }

function Limpiar { try { Clear-Host } catch {} }
function Decir($t)   { Write-Host "  $t" }
function Paso_($t)   { Write-Host "  • " -ForegroundColor Cyan -NoNewline; Write-Host $t }
function Nota($t)    { Write-Host "  $t" -ForegroundColor DarkGray }
function Aviso($t)   { Write-Host "  ⚠ $t" -ForegroundColor Yellow }
function Bien($t)    { Write-Host "  ✓ $t" -ForegroundColor Green; $script:Hecho.Add($t) }

function Inicio($titulo) {
  Limpiar
  Write-Host "`n  $titulo" -ForegroundColor Cyan
  Nota "$TotalPasos pasos. Te digo qué hacer en cada uno; tú haces lo del navegador o la consola."
  Nota "Puedes parar con Ctrl+C y volver a correrlo: lo ya guardado se recuerda."
  Pausa 'Enter para empezar'
}

function Paso($nombre) {
  Limpiar
  $script:Indice++
  Write-Host "`n  ▸ Paso $($script:Indice)/$TotalPasos · $nombre`n" -ForegroundColor Cyan
}

function Pausa($msg = 'Enter para seguir') { Write-Host "  $msg " -ForegroundColor DarkGray -NoNewline; [void](Read-Host) }

function Confirmar($pregunta) {
  Write-Host "  ? $pregunta [s/N] " -ForegroundColor Yellow -NoNewline
  return ((Read-Host) -match '^[sSyY]')
}

function AbrirUrl($url) {
  Write-Host "  ↗ abriendo $url" -ForegroundColor Green
  try { Start-Process $url } catch { Aviso "No pude abrir el navegador; entra a mano: $url" }
}

function _Actual($clave) {
  if (-not (Test-Path $EnvArchivo)) { return $null }
  $l = Select-String -Path $EnvArchivo -Pattern "^$([regex]::Escape($clave))=" | Select-Object -Last 1
  if ($l) { return ($l.Line -split '=', 2)[1].Trim('"', "'") } else { return $null }
}

# Preguntar CLAVE "texto": valor visible; Enter conserva el que ya estaba en el .env.
function Preguntar($clave, $texto) {
  $actual = _Actual $clave
  $extra = if ($actual) { " [Enter conserva el actual]" } else { '' }
  $v = Read-Host "  $texto$extra"
  if (-not $v -and $actual) { $v = $actual }
  Set-Variable -Name $clave -Value $v -Scope Script
  return $v
}

# PreguntarSecreto CLAVE "texto": no se ve al escribir ni queda en el historial.
function PreguntarSecreto($clave, $texto) {
  $seguro = Read-Host "  $texto (no se ve al escribir)" -AsSecureString
  $v = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro))
  Set-Variable -Name $clave -Value $v -Scope Script
  return $v
}

# EscribirEnv CLAVE valor: crea o reemplaza la línea en el .env (respalda el archivo la primera vez).
function EscribirEnv($clave, $valor) {
  if ((Test-Path $EnvArchivo) -and -not $script:EnvRespaldado) {
    Copy-Item $EnvArchivo "$EnvArchivo.respaldo-$(Get-Date -Format yyyyMMdd-HHmmss)"; $script:EnvRespaldado = $true
  }
  $lineas = if (Test-Path $EnvArchivo) { @(Get-Content $EnvArchivo | Where-Object { $_ -notmatch "^$([regex]::Escape($clave))=" }) } else { @() }
  $lineas += "$clave=$valor"
  Set-Content -Path $EnvArchivo -Value $lineas -Encoding utf8
  Bien "$clave guardada en $EnvArchivo"
}

# Ejecutar "descripción" { comando } [-Esperado "texto"]: muestra, corre y comprueba. Si falla, pregunta si seguir.
function Ejecutar($descripcion, [scriptblock]$comando, $Esperado = $null) {
  Paso_ $descripcion
  $salida = & $comando 2>&1 | Out-String
  $ok = $? -and ($LASTEXITCODE -in $null, 0)
  if ($Esperado -and $salida -notmatch [regex]::Escape($Esperado)) { $ok = $false }
  $salida.TrimEnd().Split("`n") | Select-Object -Last 15 | ForEach-Object { Nota $_ }
  if ($ok) { Bien $descripcion; return $true }
  Aviso "Falló: $descripcion"
  $script:Saltado.Add($descripcion)
  if (-not (Confirmar '¿Seguir con el siguiente paso de todas formas?')) { Resumen; exit 1 }
  return $false
}

function Resumen {
  Limpiar
  Write-Host "`n  Resumen" -ForegroundColor Cyan
  foreach ($h in $script:Hecho) { Write-Host "  ✓ $h" -ForegroundColor Green }
  foreach ($s in $script:Saltado) { Write-Host "  ✗ $s" -ForegroundColor Yellow }
  if ($script:Saltado.Count -eq 0) { Write-Host "`n  LISTO: todo salió bien." -ForegroundColor Green }
  else { Write-Host "`n  Quedaron pasos sin hacer: pégale este resumen a Claude." -ForegroundColor Yellow }
}

# ───────────────────────────── PASOS ─────────────────────────────
# Ejemplo (bórralo y escribe los pasos reales):
$TotalPasos = 2
Inicio 'Ejemplo de asistente'

Paso 'Abrir el panel y copiar el token'
AbrirUrl 'https://example.com'
Paso_ 'Entra a Configuración → Tokens → Crear token y cópialo.'
[void](PreguntarSecreto 'TOKEN_EJEMPLO' 'Pega el token')
Nota 'Guárdalo también en Keeper.'
Pausa

Paso 'Comprobar la conexión'
[void](Ejecutar 'La página responde' { (Invoke-WebRequest 'https://example.com' -UseBasicParsing).StatusCode } -Esperado '200')

Resumen
