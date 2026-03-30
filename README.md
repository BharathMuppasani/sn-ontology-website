# Surya Namaskar Ontology

## About
This ontology models Surya Namaskar as poses, sequence steps, and variants. It enables querying of sequence order, repeated steps, inverse relationships, support type, mantra, and chakra.

## Files
- models/combined.owl - Main OWL ontology file
- queries/competency_questions_and_sparql.txt - Competency Questions and SPARQL Queries
- metadata/ontology_metadata.txt - Ontology metadata

## Ontology Overview

### Classes
- Pose
- SequenceStep
- Variant

### Object Properties
- hasPose
- belongsToVariant
- hasNextStep
- hasPreviousStep
- repeatsStep
- hasInverseStep

### Datatype Properties
- stepNumber
- hasMantra
- hasChakra
- isStandingOnTwoFeet
- isStandingOnAtLeastOneFoot

## Competency Questions
- C1: What are the poses in Surya Namaskar?
- C2: How many poses are in Base Surya Namaskar?
- C3: Which poses are performed standing?
- C4: Which poses are repeated?
- C5: Which poses have inverse relationships?
- C6: How many variants exist?
- C7: Which poses are common across variants?
- C8: What is the sequence order of poses?

## Author
Mansi Dodiya  
IIT (BHU), Varanasi
