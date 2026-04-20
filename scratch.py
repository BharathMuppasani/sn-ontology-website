import rdflib

g = rdflib.Graph()
print("Loading master.owl...")
g.parse("models/master.owl", format="xml")
print("Loaded. Executing queries...")

queries = {
    "C1": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX core: <http://example.org/suryanamaskar/core#>
PREFIX base: <http://example.org/suryanamaskar/base-sn#>
SELECT ?pose
WHERE {
  ?pose rdf:type core:Pose ;
        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU .
}
ORDER BY ?pose""",
    "C2": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX core: <http://example.org/suryanamaskar/core#>
PREFIX base: <http://example.org/suryanamaskar/base-sn#>
SELECT (COUNT(?pose) AS ?count)
WHERE {
  ?pose rdf:type core:Pose ;
        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU .
}""",
    "C3": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX core: <http://example.org/suryanamaskar/core#>
PREFIX base: <http://example.org/suryanamaskar/base-sn#>
SELECT ?pose
WHERE {
  ?pose rdf:type core:Pose ;
        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;
        core:hasSupportType "StandingTwoFeet" .
}
ORDER BY ?pose""",
    "C4": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX core: <http://example.org/suryanamaskar/core#>
PREFIX base: <http://example.org/suryanamaskar/base-sn#>
SELECT ?pose ?repeatedPose
WHERE {
  ?pose rdf:type core:Pose ;
        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;
        core:repeatsPose ?repeatedPose .
  ?repeatedPose rdf:type core:Pose ;
                core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU .
}
ORDER BY ?pose""",
    "C5": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX core: <http://example.org/suryanamaskar/core#>
PREFIX base: <http://example.org/suryanamaskar/base-sn#>
SELECT ?pose ?inversePose
WHERE {
  ?pose rdf:type core:Pose ;
        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;
        core:hasInversePose ?inversePose .
  ?inversePose rdf:type core:Pose ;
               core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU .
}
ORDER BY ?pose""",
    "C6": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX core: <http://example.org/suryanamaskar/core#>
SELECT (COUNT(?variant) AS ?count)
WHERE {
  ?variant rdf:type core:Variant .
}""",
    "C7": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX core: <http://example.org/suryanamaskar/core#>
SELECT ?variant
WHERE {
  ?variant rdf:type core:Variant .
}
ORDER BY ?variant""",
    "C8": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX core: <http://example.org/suryanamaskar/core#>
SELECT ?asana (COUNT(DISTINCT ?variant) AS ?variantCount)
WHERE {
  ?pose core:hasAsana ?asana ;
        core:belongsToVariant ?variant .
}
GROUP BY ?asana
HAVING (COUNT(DISTINCT ?variant) > 1)
ORDER BY DESC(?variantCount)""",
    "C9": """
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX core: <http://example.org/suryanamaskar/core#>
PREFIX base: <http://example.org/suryanamaskar/base-sn#>
SELECT ?pose ?nextPose
WHERE {
  ?pose rdf:type core:Pose ;
        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;
        core:hasNextPose ?nextPose .
}
ORDER BY ?pose"""
}

with open('query_results.txt', 'w') as f:
    for q_id, query_str in queries.items():
        print(f"Executing {q_id}...")
        f.write(f"--- {q_id} ---\n")
        try:
            qres = g.query(query_str)
            for row in qres:
                f.write(str([str(x) for x in row]) + "\n")
        except Exception as e:
            f.write(f"Error: {e}\n")
print("Done.")
