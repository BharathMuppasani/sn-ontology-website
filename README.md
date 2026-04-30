# Surya Namaskar Ontology

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmansidodiya01.github.io%2Fsn-ontology-website%2F&label=Interactive+Website)](https://mansidodiya01.github.io/sn-ontology-website/)

An open-source Semantic Web project that formally models **Surya Namaskar (Sun Salutation)** yoga sequences. This ontology provides a structured, queryable knowledge base using interconnected concepts such as Asanas, Poses, and regional Variants.

🌐 **[Explore the Interactive Ontology Website](https://mansidodiya01.github.io/sn-ontology-website/)**

## Overview

The ontology systematically separates **Asanas** (the physical yoga postures) from **Poses** (their specific numbered occurrence within a sequence) and maps them across different traditional **Variants**. 

It features an advanced Pose Correction Layer designed for the Base Surya Namaskar sequence followed at IIT (BHU). This layer models body parts, breathing patterns, safety notes, common pose errors, and corresponding correction instructions, enabling structured movement analysis and supporting automated coaching applications.

## Key Features

- **Semantic Separation:** Decouples sequence order (Pose) from the actual posture (Asana).
- **Variant Mapping:** Consistently structures and maps multiple global Surya Namaskar traditions (e.g., Sivananda Yoga Vedanta Centre, Krishnamacharya Vinyasa, Bihar School of Yoga, Swami Vivekananda Kendra).
- **Correction Layer:** Encodes pose errors and correction instructions along with body parts, breathing patterns, and safety notes.
- **Rich Metadata:** Captures nuanced traditional details including associated Mantras, Chakras, Support Types, and Inverse/Repeated relationships.
- **SPARQL Ready:** Easily queryable to compare variants, identify shared asanas, or extract specific flow transitions.

## Repository Resources

- **`models/`**: Contains the core ontology files (`.owl`), WebVOWL exports, and schema diagrams representing the ontology hierarchy.
- **`source/`**: The raw source files and tools utilized in the project's development pipeline.
- **`docs/`**: Documentation and comprehensive ontology reports (like those generated via pyLODE).
- **`query_results.txt`**: Example output logs from the SPARQL competency queries.
- **`images/`**: High-resolution image exports of the ontology structure and relationship diagrams.
- **`css/` & `js/`**: Styling and interactive scripts powering the visualization website.
- **`index.html`**: The main entry point for the interactive web portal.

## Technical Details
- **Format:** OWL (RDF/XML)
- **Namespaces:** `http://example.org/suryanamaskar#`
- **Tooling:** Built and visualized using Protégé, SPARQL, and WebVOWL.

## License
This project is licensed under the MIT License.

---

**Author:** Mansi Dodiya  
**Institution:** IIT (BHU), Varanasi
