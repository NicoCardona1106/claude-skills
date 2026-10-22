#!/usr/bin/env python3
"""
ranking.py - ordena publicaciones por cuántas veces superaron la mediana de SU
propia cuenta (no por vistas crudas). Local, Python estándar, sin red.
Idea adaptada de swipe.py (instagram-agent-skill, MIT, (c) 2026 Jake Schincariol).

Entrada: archivo TSV (separado por tabuladores) con encabezado. Columnas (nombres
en español o inglés, orden libre; solo 'vistas' es obligatoria):
  cuenta  mediana  vistas  gancho  alcance  compartidos  guardados  seguidores_nuevos  fuera_pct
- mediana: vistas típicas de esa cuenta (mediana de sus últimos ~12 posts).
  Si falta, se calcula con la mediana de las vistas de esa misma cuenta en el archivo.
- Con compartidos y alcance calcula "envíos por alcance" (la señal más fuerte).
- Una sola cuenta (la tuya) = modo auditoría propia.

Uso
  python ranking.py posts.tsv
  python ranking.py posts.tsv --md swipe.md     # además guarda un .md
  python ranking.py --prueba
"""
import argparse, re, statistics, sys

ALIAS = {"account": "cuenta", "median": "mediana", "views": "vistas", "hook": "gancho",
         "reach": "alcance", "shares": "compartidos", "saves": "guardados",
         "follows": "seguidores_nuevos", "nonfollower_pct": "fuera_pct"}
NUM = ("mediana", "vistas", "alcance", "compartidos", "guardados", "seguidores_nuevos", "fuera_pct")


def num(x):
    d = re.sub(r"\D", "", x or "")  # ponytail: solo enteros; "412.000" y "62%" valen, decimales no
    return float(d) if d else None


def leer(texto):
    lineas = [l for l in texto.splitlines() if l.strip() and not l.lstrip().startswith("#")]
    cab = [ALIAS.get(c.strip().lower(), c.strip().lower()) for c in lineas[0].split("\t")]
    filas = []
    for l in lineas[1:]:
        celdas = l.split("\t") + [""] * len(cab)
        r = dict(zip(cab, (c.strip() for c in celdas)))
        for k in NUM:
            r[k] = num(r.get(k, ""))
        r.setdefault("cuenta", "")
        if r["vistas"]:
            filas.append(r)
    return filas


def analizar(filas):
    por_cuenta = {}
    for r in filas:
        por_cuenta.setdefault(r["cuenta"], []).append(r["vistas"])
    for r in filas:
        base = r["mediana"] or statistics.median(por_cuenta[r["cuenta"]])
        r["base"] = base
        r["multiplo"] = r["vistas"] / base if base else None
        r["envios"] = (r["compartidos"] / r["alcance"] * 100) if r.get("compartidos") and r.get("alcance") else None
    orden = sorted(filas, key=lambda r: -(r["multiplo"] or 0))
    return orden, len(por_cuenta)


def mostrar(orden, n_cuentas, f=sys.stdout):
    print(f"\nRANKING  -  {len(orden)} posts  -  {n_cuentas} cuenta(s)  -  base: mediana de cada cuenta", file=f)
    print("=" * 78, file=f)
    for r in orden:
        m = f"{r['multiplo']:.1f}x" if r["multiplo"] else "?"
        e = f"  envios/alcance {r['envios']:.1f}%" if r["envios"] is not None else ""
        marca = "HIT " if (r["multiplo"] or 0) >= 3 else ("normal" if (r["multiplo"] or 0) >= 1.5 else "dia normal")
        print(f"  {m:>6}  {marca:<10} {r['cuenta'][:16]:<16} {int(r['vistas']):>9,} vistas{e}", file=f)
        if r.get("gancho"):
            print(f"          \"{r['gancho'][:100]}\"", file=f)
    n = len(orden)
    print("-" * 78, file=f)
    print("Lectura: >3x = señal copiable; <1.5x = día normal de esa cuenta.", file=f)
    if n < 12:
        print(f"CUIDADO: con {n} posts esto es anécdota, no patrón (mínimo ~30 propios o ~40 ajenos).", file=f)
    if n >= 6:
        t = max(1, n // 3)
        print(f"Top tercio: mediana {statistics.median(r['multiplo'] or 0 for r in orden[:t]):.1f}x  |  "
              f"fondo: {statistics.median(r['multiplo'] or 0 for r in orden[-t:]):.1f}x", file=f)
    print("", file=f)


def md(orden):
    out = ["# Ranking por múltiplo de la mediana", ""]
    for r in orden:
        m = f"{r['multiplo']:.1f}x" if r["multiplo"] else "?"
        out += [f"## {m}  {r['cuenta']}", f"- vistas: {int(r['vistas']):,}  base: {int(r['base']):,}",
                f"- gancho: \"{r.get('gancho', '')}\"", ""]
    return "\n".join(out)


def prueba():
    t = ("cuenta\tmediana\tvistas\tgancho\n"
         "@grande\t100000\t120000\tdia normal\n"
         "@chica\t1000\t9000\tese si\n"
         "@chica\t1000\t800\tflop\n")
    o, n = analizar(leer(t))
    assert n == 2 and o[0]["cuenta"] == "@chica" and abs(o[0]["multiplo"] - 9) < 1e-9, o
    # sin mediana: se calcula con las vistas del archivo
    o2, _ = analizar(leer("vistas\n100\n200\n300\n1500\n"))
    assert o2[0]["vistas"] == 1500 and o2[0]["multiplo"] > 5
    print("prueba OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("archivo", nargs="?")
    ap.add_argument("--md")
    ap.add_argument("--prueba", action="store_true")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    if a.prueba:
        return prueba()
    if not a.archivo:
        ap.error("falta el archivo TSV")
    filas = leer(open(a.archivo, encoding="utf-8").read())
    if not filas:
        sys.exit("sin filas útiles: se necesita encabezado y la columna 'vistas'")
    orden, n = analizar(filas)
    mostrar(orden, n)
    if a.md:
        open(a.md, "w", encoding="utf-8").write(md(orden))


if __name__ == "__main__":
    main()
