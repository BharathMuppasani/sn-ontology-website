# Surya Namaskar Ontology

## About  
This ontology represents Surya Namaskar in a structured way using three main concepts: Asana, Pose, and Variant.  
Asana represents the yoga posture itself, Pose represents its numbered occurrence in a sequence, and Variant represents a specific Surya Namaskar tradition.  

Along with this, the ontology also includes a pose correction layer for the Base Surya Namaskar followed at IIT (BHU). This layer captures body parts involved, posture rules, constraints, possible errors, and their correction instructions.  

The aim is to make Surya Namaskar easy to query, compare across variants, and extend further if needed.

## Key Features  
Models Surya Namaskar sequences clearly using Pose and Asana separation.  
Supports multiple variants in a consistent structure.  
Captures sequence order, repeated poses, and inverse relationships.  
Includes mantra, chakra, and support type information.  
Provides a correction layer to improve pose understanding and accuracy.  
Designed in a way that can be extended later.

## Ontology Structure  

### Classes  
Pose  
Asana  
Variant  
BodyPart  
PostureRule  
PoseConstraint  
PoseError  
CorrectionInstruction  

### Object Properties  
hasAsana  
belongsToVariant  
hasNextPose  
hasPreviousPose  
repeatsPose  
hasInversePose  
sameAsanaAs  
involvesBodyPart  
hasRule  
hasConstraint  
hasPossibleError  
hasCorrection  

### Datatype Properties  
poseNumber  
hasMantra  
hasChakra  
hasSupportType  
hasLaterality  
hasCYPPage  
hasAlternateName  
ruleDescription  
constraintDescription  
errorDescription  
correctionText  

## Variants Represented  
BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU  
Variant01_KrishnamacharyaVinyasa  
Variant02_BiharSchoolOfYoga  
Variant03_SwamiVivekanandaKendra  

## Competency Questions  
C1: What are the poses in Base Surya Namaskar?  
C2: How many poses are in Base Surya Namaskar?  
C3: Which poses are performed standing on two feet?  
C4: Which poses are repeated in the sequence?  
C5: Which poses have inverse relationships?  
C6: How many variants exist?  
C7: What variants are represented in the ontology?  
C8: Which asanas are shared across variants?  
C9: What is the sequence order of poses?  

## Use Cases  
Comparing different Surya Namaskar variants  
Understanding sequence flow and transitions  
Identifying repeated and inverse poses  
Retrieving mantra and chakra details  
Analyzing posture and support types  
Supporting pose correction using rules and constraints  

## Technical Details  
Format: OWL (RDF/XML)  
Namespace: http://example.org/suryanamaskar#  
Tools used: Protégé, SPARQL, pyLODE, WebVOWL  

## Author  
Mansi Dodiya  
IIT (BHU), Varanasi  
