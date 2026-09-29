#!/usr/bin/env python3
"""Exporta banners HTML a PNG al tamaño exacto con Chrome headless (sin dependencias).

Uso:
  python export.py banner.html 1500x500 [-o salida.png] [--escala 2] [--espera 3]
  python export.py carpeta/ 1080x1080          # exporta cada .html de la carpeta

El tamaño es el del lienzo en CSS px; --escala 2 produce el PNG al doble (retina).
"""
import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

RUTAS_CHROME = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]


def buscar_chrome():
    for nombre in ("chrome", "google-chrome", "chromium", "msedge"):
        ruta = shutil.which(nombre)
        if ruta:
            return ruta
    for ruta in RUTAS_CHROME:
        if os.path.exists(ruta):
            return ruta
    sys.exit("No encontré Chrome ni Edge; instala uno o pasa la ruta con --chrome.")


def exportar(chrome, html, ancho, alto, salida, escala, espera):
    salida.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
        f"--window-size={ancho},{alto}", f"--force-device-scale-factor={escala}",
        f"--virtual-time-budget={int(espera * 1000)}",
        f"--screenshot={salida.resolve()}", html.resolve().as_uri(),
    ]
    subprocess.run(cmd, check=True, capture_output=True, timeout=120)
    if not salida.exists():
        sys.exit(f"Chrome no produjo {salida}")
    mb = salida.stat().st_size / 1e6
    aviso = "  (mas de 5 MB: comprime antes de subir a redes)" if mb > 5 else ""
    print(f"OK {salida}  {ancho * escala}x{alto * escala}px  {mb:.2f} MB{aviso}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("entrada", help="archivo .html o carpeta con .html")
    p.add_argument("tamano", help="ANCHOxALTO en px, p. ej. 1500x500")
    p.add_argument("-o", "--salida", help="PNG de salida (solo con un archivo); por defecto junto al .html")
    p.add_argument("--escala", type=int, default=1, help="factor de píxeles (2 = retina)")
    p.add_argument("--espera", type=float, default=3, help="segundos para que carguen fuentes e imágenes")
    p.add_argument("--chrome", help="ruta al ejecutable de Chrome/Edge")
    a = p.parse_args()

    ancho, alto = (int(x) for x in a.tamano.lower().split("x"))
    chrome = a.chrome or buscar_chrome()
    entrada = Path(a.entrada)
    archivos = sorted(entrada.glob("*.html")) if entrada.is_dir() else [entrada]
    if not archivos:
        sys.exit(f"No hay .html en {entrada}")
    for html in archivos:
        salida = Path(a.salida) if (a.salida and len(archivos) == 1) else html.with_name(f"{html.stem}-{ancho}x{alto}.png")
        exportar(chrome, html, ancho, alto, salida, a.escala, a.espera)


if __name__ == "__main__":
    main()
