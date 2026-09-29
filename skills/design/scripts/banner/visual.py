#!/usr/bin/env python3
"""Genera un visual de fondo para un banner con Gemini (opcional).

Solo el visual: el texto, el CTA y el logo van encima en el HTML, así que el
prompt debe pedir "no text, no letters, no words".

Uso:
  python visual.py "prompt" --ratio 16:9 [--modelo flash|pro] [-o carpeta/archivo.png]

Requiere `pip install google-genai` y GEMINI_API_KEY (de un proyecto con
facturación activa: el tier gratis puede entrenar con los datos). Los modelos
son los mismos de scripts/cip/generate.py.
"""
import argparse
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "cip"))
from generate import MODELS  # noqa: E402  (una sola fuente para los IDs de modelo)

RATIOS = {"1:1", "16:9", "9:16", "3:4", "4:3", "2:3", "3:2"}


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("prompt")
    p.add_argument("--ratio", default="16:9", help="proporción más cercana al banner: " + ", ".join(sorted(RATIOS)))
    p.add_argument("--modelo", default="flash", choices=sorted(MODELS), help="flash = rápido (fondos); pro = detalle (ilustraciones)")
    p.add_argument("-o", "--salida", default="visual.png")
    a = p.parse_args()
    if a.ratio not in RATIOS:
        sys.exit(f"Proporción no soportada: {a.ratio}. Usa la más cercana de {sorted(RATIOS)}.")

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        sys.exit("Falta google-genai: pip install google-genai (o usa foto real / fondo CSS).")
    clave = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not clave:
        sys.exit("Falta GEMINI_API_KEY en el entorno (o usa foto real / fondo CSS).")

    r = genai.Client(api_key=clave).models.generate_content(
        model=MODELS[a.modelo],
        contents=a.prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"], image_config=types.ImageConfig(aspect_ratio=a.ratio)
        ),
    )
    for parte in (r.candidates[0].content.parts if r.candidates else []):
        if getattr(parte, "inline_data", None):
            salida = Path(a.salida)
            salida.parent.mkdir(parents=True, exist_ok=True)
            salida.write_bytes(parte.inline_data.data)
            print(f"OK {salida} ({MODELS[a.modelo]}, {a.ratio})")
            return
    sys.exit("Gemini no devolvió imagen; ajusta el prompt.")


if __name__ == "__main__":
    main()
