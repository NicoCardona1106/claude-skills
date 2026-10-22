#!/usr/bin/env python3
"""
humanizar.py - limpia un borrador de huellas de IA en español y lo puntúa.
Local, Python estándar, sin red. Idea y estructura adaptadas de ig-human
(instagram-agent-skill, MIT, (c) 2026 Jake Schincariol); el lexicón en español y los
chequeos de puntaje son propios.

Uso
  python humanizar.py borrador.txt                 # imprime el texto limpio
  python humanizar.py borrador.txt --informe       # + cambios, banderas, puntaje
  python humanizar.py borrador.txt -o limpio.txt   # guarda y da el informe
  python humanizar.py borrador.txt --puntuar       # solo el puntaje 0-100
  python humanizar.py --prueba                     # autoprueba
Con --puntuar sale con código 0 si el veredicto es PASA, 1 si no.
"""
import argparse, json, os, re, statistics, sys, unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
LEX = os.path.join(AQUI, "muletillas-es.json")
PROTEGIDO = re.compile(r"https?://\S+|www\.\S+|\S+@\S+\.\S+|[#@]\w+")
PALABRA = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+")
FRASE = re.compile(r"[^.!?\n]+[.!?]*")
PERSONA = re.compile(r"\b(yo|me|mi|mis|conmigo|nos|nuestro|nuestra|tú|te|tu|tus|contigo)\b", re.I)
NUMEROS = re.compile(r"\b\d[\d.,]*%?|\$\s?\d")


def cargar(ruta=LEX):
    with open(ruta, encoding="utf-8") as f:
        return json.load(f)


def proteger(t):
    guardado = []

    def f(m):
        guardado.append(m.group(0))
        return f"\x00{len(guardado) - 1}\x00"
    return PROTEGIDO.sub(f, t), guardado


def devolver(t, guardado):
    return re.sub(r"\x00(\d+)\x00", lambda m: guardado[int(m.group(1))], t)


def inicio_de_frase(antes):
    return re.search(r"(^|[.!?\n]\s*)$", antes) is not None


def limpiar(texto, lex):
    cambios = []
    # 1) caracteres invisibles y espacios raros
    n = sum(1 for c in texto if unicodedata.category(c) == "Cf")
    texto = "".join(c for c in texto if unicodedata.category(c) != "Cf")
    raros = sum(texto.count(c) for c in "   ")
    for c in "   ":
        texto = texto.replace(c, " ")
    if n or raros:
        cambios.append(f"{n} caracteres invisibles y {raros} espacios raros quitados")
    # 2) tipografía
    texto, c1 = re.subn(r"(?<=\S)[ \t]*—[ \t]*(?=\S)", ", ", texto)
    texto, c2 = re.subn(r"[“”]", '"', texto)
    texto, c3 = re.subn(r"[‘’]", "'", texto)
    texto, c4 = re.subn(r"…", "...", texto)
    for k, nombre in ((c1, "rayas largas a coma"), (c2 + c3, "comillas curvas a rectas"),
                      (c4, "puntos suspensivos a tres puntos")):
        if k:
            cambios.append(f"{k} {nombre}")
    # 3) lexicón seguro (auto); hashtags, @ y URLs quedan protegidos
    texto, guardado = proteger(texto)
    for e in lex["auto"]:
        rx = re.compile(r"\b" + re.escape(e["find"]) + r",?[ \t]*", re.I)
        pos, veces = 0, 0
        while True:
            m = rx.search(texto, pos)
            if not m:
                break
            cabeza, cola, por = texto[:m.start()], texto[m.end():], e["por"]
            if por == "":
                if inicio_de_frase(cabeza) and cola:
                    cola = cola[0].upper() + cola[1:]
            else:
                if m.group(0)[0].isupper():
                    por = por[0].upper() + por[1:]
                por += ", " if m.group(0).rstrip().endswith(",") else " "
            texto = cabeza + por + cola
            pos = len(cabeza) + len(por)
            veces += 1
        if veces:
            cambios.append(f"«{e['find']}» -> «{e['por'] or '(quitado)'}» x{veces}")
    texto = re.sub(r"[ \t]{2,}", " ", texto)
    texto = re.sub(r" +([,.;!?])", r"\1", texto)
    return devolver(texto, guardado), cambios


def banderas(texto, lex):
    """Lo que NO se arregla solo: hay que reescribirlo a mano."""
    t, _ = proteger(texto)
    out = []
    for grupo in ("frases", "palabras"):
        for e in lex["avisar"][grupo]:
            pat = r"\b" + e["find"] + (r"\b" if grupo == "palabras" else "")
            for m in re.finditer(pat, t, re.I):
                out.append(("muletilla", m.group(0), e["sugerencia"]))
    for s in lex["estructuras"]:
        for m in re.finditer(s["regex"], texto, re.I if s["id"] != "gritos" else 0):
            out.append(("estructura", m.group(0).strip()[:60], s["nota"]))
    return out


def esc(v, humano, maquina):
    if humano == maquina:
        return 50.0
    return max(0.0, min(100.0, (v - maquina) / (humano - maquina) * 100))


def puntuar(texto, lex):
    pal = PALABRA.findall(texto)
    frases = [s.strip() for s in FRASE.findall(texto) if len(s.split()) > 2]
    fl = banderas(texto, lex)
    r = {}
    lens = [len(s.split()) for s in frases]
    if len(lens) < 4:
        r["RITMO"] = 50.0
    else:
        r["RITMO"] = esc(statistics.pstdev(lens) / statistics.mean(lens), 0.70, 0.22)
    if len(pal) < 25:
        r["CONCRECION"] = r["VOZ"] = 50.0
    else:
        caps = sum(1 for s in frases for w in PALABRA.findall(s)[1:] if w[0].isupper() and len(w) > 2)
        r["CONCRECION"] = esc((len(NUMEROS.findall(texto)) + caps) * 100 / len(pal), 6.0, 0.5)
        persona = len(PERSONA.findall(texto)) * 100 / len(pal)
        tells = sum(1 for k, _, _ in fl if k == "estructura")
        r["VOZ"] = esc(persona, 8.0, 1.0) * 0.6 + max(0, 100 - tells * 25) * 0.4
    r["MULETILLAS"] = esc(sum(1 for k, _, _ in fl if k == "muletilla") * 100 / max(len(pal), 1), 0.0, 4.0)
    huella = (sum(1 for c in texto if unicodedata.category(c) == "Cf") * 4
              + texto.count("—") * 2 + sum(texto.count(c) for c in "“”‘’…"))
    r["HUELLA"] = esc(huella * 1000 / max(len(texto), 1), 0.0, 12.0)
    vals = list(r.values())
    # el chequeo más débil pesa 40 %: a un detector le basta una señal
    total = statistics.mean(vals) * 0.6 + min(vals) * 0.4
    veredicto = "PASA" if total >= 70 and min(vals) >= 55 else ("REVISAR" if total >= 50 else "MARCADO")
    return r, total, veredicto


def mostrar(r, total, veredicto):
    for k, v in r.items():
        print(f"  {k:<11} {'#' * round(v / 100 * 24):.<24} {v:5.1f}", file=sys.stderr)
    print(f"  {'TOTAL':<11} {'#' * round(total / 100 * 24):.<24} {total:5.1f}  {veredicto}", file=sys.stderr)
    if veredicto != "PASA":
        print(f"  Lo más débil: {min(r, key=r.get)}. Arregla eso primero.", file=sys.stderr)


def prueba():
    lex = cargar()
    t, _ = limpiar("Es importante destacar que esto es “robusto” — y lo mejor de todo, rápido. #robusto", lex)
    assert t.startswith("Esto es") and "—" not in t and '"robusto"' in t and "lo mejor, rápido" in t, t
    assert t.endswith("#robusto")  # el hashtag queda protegido
    assert any("robusto" in m for k, m, _ in banderas(t, lex) if k == "muletilla")
    assert any(banderas("No es solo una app, es un ecosistema.", lex))
    sucio = ("En el mundo actual, es fundamental aprovechar al máximo una solución robusta. "
             "Sin lugar a dudas, este ecosistema potencia tu productividad. "
             "En conclusión, es un game changer para tu mindset.")
    humano = ("Ayer a las 11 pm se me cayó el bot de Valentina. Tres horas buscando. "
              "Era un punto y coma en un JSON, en serio. Hoy lo arreglé en 4 minutos y me quedó una regla: "
              "primero leo el log, después culpo a Claude.")
    assert puntuar(sucio, lex)[1] < puntuar(humano, lex)[1], "el humano debe puntuar más alto"
    assert puntuar(humano, lex)[2] != "MARCADO"
    print("prueba OK")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("archivo", nargs="?", default="-")
    ap.add_argument("-o", "--salida")
    ap.add_argument("--informe", action="store_true")
    ap.add_argument("--puntuar", action="store_true")
    ap.add_argument("--prueba", action="store_true")
    ap.add_argument("--lexicon", default=LEX)
    a = ap.parse_args()
    for s in (sys.stdout, sys.stderr, sys.stdin):
        s.reconfigure(encoding="utf-8")
    if a.prueba:
        return prueba()
    lex = cargar(a.lexicon)
    original = sys.stdin.read() if a.archivo == "-" else open(a.archivo, encoding="utf-8").read()
    if a.puntuar:
        r, total, v = puntuar(original, lex)
        mostrar(r, total, v)
        sys.exit(0 if v == "PASA" else 1)
    limpio, cambios = limpiar(original, lex)
    if a.salida:
        open(a.salida, "w", encoding="utf-8").write(limpio)
    else:
        print(limpio)
    if a.informe or a.salida:
        err = sys.stderr
        print("\n--- CAMBIOS ---", file=err)
        for c in cambios or ["ninguno"]:
            print("  " + c, file=err)
        fl = banderas(limpio, lex)
        print(f"--- A REESCRIBIR A MANO ({len(fl)}) ---", file=err)
        for k, m, s in fl:
            print(f"  [{k}] «{m}»  ->  {s}", file=err)
        r0, t0, v0 = puntuar(original, lex)
        r1, t1, v1 = puntuar(limpio, lex)
        print(f"--- PUNTAJE --- antes {t0:.1f} {v0}  ->  ahora {t1:.1f} {v1}", file=err)
        mostrar(r1, t1, v1)


if __name__ == "__main__":
    main()
