import csv
from rdflib import Graph, URIRef, Literal, RDFS

FILES = {
    "core.owl": "core_withlabels.owl",
    "base-sn.owl": "base-sn_withlabels.owl",
    "variant01.owl": "variant01_withlabels.owl",
    "variant02.owl": "variant02_withlabels.owl",
    "variant03.owl": "variant03_withlabels.owl",
}

CSV_FILE = "SN_YO_labels_combined.csv"

PREFIXES = {
    "core": "http://example.org/suryanamaskar/core#",
    "base": "http://example.org/suryanamaskar/base-sn#",
    "v1": "http://example.org/suryanamaskar/variant01#",
    "v2": "http://example.org/suryanamaskar/variant02#",
    "v3": "http://example.org/suryanamaskar/variant03#",
}

def expand(subject):
    if subject.startswith("http"):
        return URIRef(subject)
    prefix, local = subject.split(":", 1)
    return URIRef(PREFIXES[prefix] + local)

# Load graphs
graphs = {}
for f in FILES:
    g = Graph()
    g.parse(f)
    graphs[f] = g

# REMOVE ALL OLD LABELS
for g in graphs.values():
    for s, p, o in list(g.triples((None, RDFS.label, None))):
        g.remove((s, p, o))

# ADD CLEAN LABELS FROM CSV
with open(CSV_FILE, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        file_name = row["file"].strip()
        subject = expand(row["subject"].strip())
        value = row["value"].strip()
        lang = row["language"].strip()

        graphs[file_name].add((subject, RDFS.label, Literal(value, lang=lang)))

# Save
for f, out in FILES.items():
    graphs[f].serialize(destination=out, format="xml")
    print(f"Clean file saved: {out}")
