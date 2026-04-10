# Surya Namaskar Ontology

## About
The Surya Namaskar Ontology represents Surya Namaskar using three main concepts: **Asana**, **Pose**, and **Variant**.  
An **Asana** represents the yoga posture itself, a **Pose** represents its numbered occurrence within a sequence, and a **Variant** represents a specific Surya Namaskar tradition.  

The ontology supports semantic querying of:
- sequence order of poses
- repeated and inverse poses
- support type and laterality
- mantra and chakra information
- common asanas across variants

## Ontology Overview

### Classes
- Pose
- Asana
- Variant

### Object Properties
- hasAsana
- belongsToVariant
- hasNextPose
- hasPreviousPose
- repeatsPose
- hasInversePose
- sameAsanaAs

### Datatype Properties
- poseNumber
- hasMantra
- hasChakra
- hasSupportType
- hasLaterality
- hasCYPPage
- hasAlternateName

## Competency Questions
- C1: What are the poses in Surya Namaskar?
- C2: How many poses are in Base Surya Namaskar?
- C3: Which poses are performed standing?
- C4: Which poses are repeated?
- C5: Which poses have inverse relationships?
- C6: How many variants exist?
- C7: What are the different variants of Surya Namaskar represented in the ontology?
- C8: Which asanas are shared across multiple variants of Surya Namaskar?
- C9: What is the sequence order of poses in BaseSN?

## Author
Mansi Dodiya 
IIT (BHU), Varanasi
