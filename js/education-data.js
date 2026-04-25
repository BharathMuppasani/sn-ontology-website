(function (global) {
  'use strict';

  var PREFIX_BLOCK = [
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>',
    'PREFIX core: <http://example.org/suryanamaskar/core#>',
    'PREFIX base: <http://example.org/suryanamaskar/base-sn#>',
    'PREFIX v1: <http://example.org/suryanamaskar/variant01#>',
    'PREFIX v2: <http://example.org/suryanamaskar/variant02#>',
    'PREFIX v3: <http://example.org/suryanamaskar/variant03#>'
  ].join('\n');

  function withPrefixes(queryBody) {
    return PREFIX_BLOCK + '\n\n' + queryBody.trim();
  }

  function joinList(items) {
    var values = items.filter(Boolean);
    if (!values.length) {
      return '';
    }
    if (values.length === 1) {
      return values[0];
    }
    if (values.length === 2) {
      return values[0] + ' and ' + values[1];
    }
    return values.slice(0, -1).join(', ') + ', and ' + values[values.length - 1];
  }

  function unique(items) {
    return items.filter(function (item, index) {
      return items.indexOf(item) === index;
    });
  }

  function lowerFirst(value) {
    var text = String(value || '').trim();
    if (!text) {
      return '';
    }
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function poseSummary(pose) {
    return 'Pose ' + pose.poseNumber + ' (' + pose.asanaLabel + ')';
  }

  function makeEmptyAnswer(prompt, message) {
    return {
      prompt: prompt,
      narrative: message,
      facts: [],
      sections: [],
      table: null,
      visuals: []
    };
  }

  function createVisualTableCell(asana) {
    if (!asana || !asana.visual) {
      return '-';
    }

    return {
      kind: 'cyp-visual',
      src: asana.visual.src,
      alt: asana.visual.alt,
      asanaLabel: asana.label,
      caption: asana.visual.caption,
      page: asana.cypPage
    };
  }

  var QUESTIONS = [
    {
      id: 'sn-variants',
      title: 'SN Variants',
      prompt: 'What are the different variants of SN?',
      sparql: withPrefixes(
        'SELECT ?variantLabel (COUNT(DISTINCT ?pose) AS ?poseCount) (COUNT(DISTINCT ?asana) AS ?distinctAsanaCount)\n' +
        'WHERE {\n' +
        '  ?variant rdf:type core:Variant ;\n' +
        '           rdfs:label ?variantLabel .\n' +
        '  OPTIONAL {\n' +
        '    ?pose rdf:type core:Pose ;\n' +
        '          core:belongsToVariant ?variant ;\n' +
        '          core:hasAsana ?asana .\n' +
        '  }\n' +
        '}\n' +
        'GROUP BY ?variantLabel\n' +
        'ORDER BY ?variantLabel'
      ),
      run: function (model) {
        var variants = (model.variants || []).slice().sort(function (left, right) {
          return left.displayLabel.localeCompare(right.displayLabel);
        });

        if (!variants.length) {
          return makeEmptyAnswer(this.prompt, 'No Surya Namaskar variants were found in the loaded ontology.');
        }

        return {
          prompt: this.prompt,
          narrative: 'The ontology currently models ' + variants.length + ' Surya Namaskar variants: ' +
            joinList(variants.map(function (variant) {
              return variant.displayLabel;
            })) + '.',
          facts: [
            { label: 'Variants', value: String(variants.length) }
          ],
          table: {
            columns: ['Variant', 'Pose count', 'Distinct asanas'],
            rows: variants.map(function (variant) {
              var poses = model.getOrderedPosesForVariant(variant);
              var distinctAsanas = unique(poses.map(function (pose) {
                return pose.asanaLabel;
              }).filter(Boolean));

              return [
                variant.displayLabel,
                String(poses.length),
                String(distinctAsanas.length)
              ];
            })
          },
          sections: [
            {
              title: 'Variant list',
              items: variants.map(function (variant) {
                return variant.displayLabel;
              })
            }
          ],
          visuals: []
        };
      }
    },
    {
      id: 'base-sequence',
      title: 'Ordered Pose Sequence',
      prompt: 'What is the complete ordered sequence of poses in the Base Surya Namaskar variant?',
      sparql: withPrefixes(
        'SELECT ?poseNumber ?pose ?asanaLabel ?laterality ?supportType ?chakra ?mantra\n' +
        'WHERE {\n' +
        '  ?pose rdf:type core:Pose ;\n' +
        '        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;\n' +
        '        core:poseNumber ?poseNumber ;\n' +
        '        core:hasAsana ?asana ;\n' +
        '        core:hasLaterality ?laterality ;\n' +
        '        core:hasSupportType ?supportType ;\n' +
        '        core:hasChakra ?chakra ;\n' +
        '        core:hasMantra ?mantra .\n' +
        '  ?asana rdfs:label ?asanaLabel .\n' +
        '}\n' +
        'ORDER BY ?poseNumber'
      ),
      run: function (model) {
        var baseVariant = model.getBaseVariant();
        var poses = baseVariant ? model.getOrderedPosesForVariant(baseVariant) : [];
        var distinctAsanas;

        if (!baseVariant || !poses.length) {
          return makeEmptyAnswer(this.prompt, 'The Base SN variant could not be located in the loaded ontology.');
        }

        distinctAsanas = unique(poses.map(function (pose) {
          return pose.asanaLabel;
        }));

        return {
          prompt: this.prompt,
          narrative: baseVariant.displayLabel + ' is modeled as ' + poses.length + ' ordered poses: ' +
            poses.map(poseSummary).join(' -> ') + '.',
          facts: [
            { label: 'Variant', value: baseVariant.displayLabel },
            { label: 'Total poses', value: String(poses.length) },
            { label: 'Distinct asanas', value: String(distinctAsanas.length) }
          ],
          table: {
            columns: ['#', 'Asana', 'Laterality', 'Support', 'Chakra', 'Mantra'],
            rows: poses.map(function (pose) {
              return [
                String(pose.poseNumber),
                pose.asanaLabel,
                pose.laterality || '-',
                pose.supportType || '-',
                pose.chakra || '-',
                pose.mantra || '-'
              ];
            })
          },
          sections: [],
          visuals: model.collectVisualsFromPoses(poses)
        };
      }
    },
    {
      id: 'base-mantra-chakra',
      title: 'Mantra & Chakra Annotations',
      prompt: 'Which poses in the Base SN variant carry explicit mantra and chakra annotations?',
      sparql: withPrefixes(
        'SELECT ?poseNumber ?asanaLabel ?chakra ?mantra\n' +
        'WHERE {\n' +
        '  ?pose rdf:type core:Pose ;\n' +
        '        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;\n' +
        '        core:poseNumber ?poseNumber ;\n' +
        '        core:hasAsana ?asana ;\n' +
        '        core:hasChakra ?chakra ;\n' +
        '        core:hasMantra ?mantra .\n' +
        '  ?asana rdfs:label ?asanaLabel .\n' +
        '}\n' +
        'ORDER BY ?poseNumber'
      ),
      run: function (model) {
        var baseVariant = model.getBaseVariant();
        var allPoses = baseVariant ? model.getOrderedPosesForVariant(baseVariant) : [];
        var annotated = baseVariant ? model.getPosesWithMantraAndChakra(baseVariant) : [];
        var coverage;

        if (!baseVariant || !annotated.length) {
          return makeEmptyAnswer(this.prompt, 'No mantra/chakra annotations were found for the Base SN variant.');
        }

        coverage = annotated.length + ' / ' + allPoses.length;

        return {
          prompt: this.prompt,
          narrative: annotated.length === allPoses.length
            ? 'All ' + allPoses.length + ' Base SN poses carry both mantra and chakra annotations.'
            : annotated.length + ' of the ' + allPoses.length + ' Base SN poses carry both mantra and chakra annotations.',
          facts: [
            { label: 'Variant', value: baseVariant.displayLabel },
            { label: 'Coverage', value: coverage },
            { label: 'Unique chakras', value: String(unique(annotated.map(function (pose) { return pose.chakra; })).length) }
          ],
          table: {
            columns: ['#', 'Asana', 'Chakra', 'Mantra'],
            rows: annotated.map(function (pose) {
              return [
                String(pose.poseNumber),
                pose.asanaLabel,
                pose.chakra || '-',
                pose.mantra || '-'
              ];
            })
          },
          sections: [],
          visuals: model.collectVisualsFromPoses(annotated)
        };
      }
    },
    {
      id: 'base-repeats',
      title: 'Symmetrically Recurring Poses',
      prompt: 'Which poses in the Base Surya Namaskar sequence recur symmetrically in the second half?',
      sparql: withPrefixes(
        'SELECT ?pose ?repeatPose\n' +
        'WHERE {\n' +
        '  ?pose rdf:type core:Pose ;\n' +
        '        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;\n' +
        '        core:repeatsPose ?repeatPose .\n' +
        '  ?repeatPose core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU .\n' +
        '}\n' +
        'ORDER BY ?pose ?repeatPose'
      ),
      run: function (model) {
        var baseVariant = model.getBaseVariant();
        var pairs = baseVariant ? model.getRepeatedPosePairs(baseVariant) : [];

        if (!baseVariant || !pairs.length) {
          return makeEmptyAnswer(this.prompt, 'No repeated-pose pairs were found for the Base SN variant.');
        }

        return {
          prompt: this.prompt,
          narrative: 'Base SN marks ' + pairs.length + ' repeated-pose pairs on the return path: ' +
            joinList(pairs.map(function (pair) {
              return 'Pose ' + pair.firstPose.poseNumber + ' <-> Pose ' + pair.secondPose.poseNumber +
                ' (' + pair.firstPose.asanaLabel + ')';
            })) + '.',
          facts: [
            { label: 'Variant', value: baseVariant.displayLabel },
            { label: 'Repeated pairs', value: String(pairs.length) }
          ],
          table: {
            columns: ['Earlier pose', 'Later pose', 'Asana'],
            rows: pairs.map(function (pair) {
              return [
                'Pose ' + pair.firstPose.poseNumber,
                'Pose ' + pair.secondPose.poseNumber,
                pair.firstPose.asanaLabel
              ];
            })
          },
          sections: [],
          visuals: model.collectVisualsFromPoses(pairs.reduce(function (accumulator, pair) {
            return accumulator.concat([pair.firstPose, pair.secondPose]);
          }, []))
        };
      }
    },
    {
      id: 'base-inverses',
      title: 'Laterality Inverse Pairs',
      prompt: 'Which poses in the Base SN sequence exhibit explicit inverse left/right laterality pairings?',
      sparql: withPrefixes(
        'SELECT ?pose ?inversePose\n' +
        'WHERE {\n' +
        '  ?pose rdf:type core:Pose ;\n' +
        '        core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU ;\n' +
        '        core:hasInversePose ?inversePose .\n' +
        '  ?inversePose core:belongsToVariant base:BaseSN_SivanandaYogaVedantaCentre_UsedatIITBHU .\n' +
        '}\n' +
        'ORDER BY ?pose ?inversePose'
      ),
      run: function (model) {
        var baseVariant = model.getBaseVariant();
        var pairs = baseVariant ? model.getInversePosePairs(baseVariant) : [];

        if (!baseVariant || !pairs.length) {
          return makeEmptyAnswer(this.prompt, 'No inverse-pose pairs were found for the Base SN variant.');
        }

        return {
          prompt: this.prompt,
          narrative: 'Base SN has ' + pairs.length + ' inverse pose pair' + (pairs.length === 1 ? '' : 's') + ': ' +
            joinList(pairs.map(function (pair) {
              return 'Pose ' + pair.firstPose.poseNumber + ' (' + pair.firstPose.laterality + ') <-> Pose ' +
                pair.secondPose.poseNumber + ' (' + pair.secondPose.laterality + ') [' + pair.firstPose.asanaLabel + ']';
            })) + '.',
          facts: [
            { label: 'Variant', value: baseVariant.displayLabel },
            { label: 'Inverse pairs', value: String(pairs.length) }
          ],
          table: {
            columns: ['Pose A', 'Pose B', 'Asana', 'Laterality'],
            rows: pairs.map(function (pair) {
              return [
                'Pose ' + pair.firstPose.poseNumber,
                'Pose ' + pair.secondPose.poseNumber,
                pair.firstPose.asanaLabel,
                pair.firstPose.laterality + ' / ' + pair.secondPose.laterality
              ];
            })
          },
          sections: [],
          visuals: model.collectVisualsFromPoses(pairs.reduce(function (accumulator, pair) {
            return accumulator.concat([pair.firstPose, pair.secondPose]);
          }, []))
        };
      }
    },
    {
      id: 'shared-asanas',
      title: 'Cross-Variant Shared Asanas',
      prompt: 'Which asanas appear across two or more Surya Namaskar variants?',
      sparql: withPrefixes(
        'SELECT ?asanaLabel (COUNT(DISTINCT ?variant) AS ?variantCount)\n' +
        'WHERE {\n' +
        '  ?pose rdf:type core:Pose ;\n' +
        '        core:hasAsana ?asana ;\n' +
        '        core:belongsToVariant ?variant .\n' +
        '  ?asana rdfs:label ?asanaLabel .\n' +
        '}\n' +
        'GROUP BY ?asanaLabel\n' +
        'HAVING (COUNT(DISTINCT ?variant) > 1)\n' +
        'ORDER BY DESC(?variantCount) ?asanaLabel'
      ),
      run: function (model) {
        var entries = model.getSharedAsanas(2);

        if (!entries.length) {
          return makeEmptyAnswer(this.prompt, 'No shared asanas were found across variants.');
        }

        return {
          prompt: this.prompt,
          narrative: entries.length + ' asanas appear in more than one variant: ' +
            joinList(entries.map(function (entry) {
              return entry.asana.label + ' (' + entry.variants.length + ' variants)';
            })) + '.',
          facts: [
            { label: 'Shared asanas', value: String(entries.length) },
            { label: 'Max coverage', value: String(entries[0].variants.length) + ' variants' }
          ],
          table: {
            columns: ['Asana', 'Variant count', 'Variants'],
            rows: entries.map(function (entry) {
              return [
                entry.asana.label,
                String(entry.variants.length),
                entry.variants.map(function (variant) {
                  return variant.displayLabel;
                }).join(', ')
              ];
            })
          },
          sections: [],
          visuals: model.collectVisualsFromAsanas(entries.map(function (entry) {
            return entry.asana;
          }))
        };
      }
    },
    {
      id: 'same-asana-equivalences',
      title: 'Asana Identity Equivalences',
      prompt: 'Which asana equivalence pairs are explicitly linked via the sameAsanaAs relation?',
      sparql: withPrefixes(
        'SELECT ?asanaLabel ?sameLabel\n' +
        'WHERE {\n' +
        '  ?asana rdf:type core:Asana ;\n' +
        '         core:sameAsanaAs ?sameAsana ;\n' +
        '         rdfs:label ?asanaLabel .\n' +
        '  ?sameAsana rdfs:label ?sameLabel .\n' +
        '  FILTER (STR(?asana) < STR(?sameAsana))\n' +
        '}\n' +
        'ORDER BY ?asanaLabel ?sameLabel'
      ),
      run: function (model) {
        var pairs = model.getEquivalentAsanaPairs();

        if (!pairs.length) {
          return makeEmptyAnswer(this.prompt, 'No sameAsanaAs equivalence pairs were found.');
        }

        return {
          prompt: this.prompt,
          narrative: 'The ontology records ' + pairs.length + ' sameAsanaAs equivalence pair' +
            (pairs.length === 1 ? '' : 's') + ': ' +
            joinList(pairs.map(function (pair) {
              return pair.primary.label + ' = ' + pair.secondary.label;
            })) + '.',
          facts: [
            { label: 'Equivalence pairs', value: String(pairs.length) }
          ],
          table: {
            columns: ['Asana A', 'Asana B'],
            rows: pairs.map(function (pair) {
              return [pair.primary.label, pair.secondary.label];
            })
          },
          sections: [],
          visuals: model.collectVisualsFromAsanas(pairs.reduce(function (accumulator, pair) {
            return accumulator.concat([pair.primary, pair.secondary]);
          }, []))
        };
      }
    },
    {
      id: 'cyp-visual-references',
      title: 'CYP Visual References',
      prompt: 'Which asanas are grounded with visual references from the Common Yoga Protocol (CYP)?',
      sparql: withPrefixes(
        'SELECT ?asanaLabel ?cypPage\n' +
        'WHERE {\n' +
        '  ?asana rdf:type core:Asana ;\n' +
        '         rdfs:label ?asanaLabel ;\n' +
        '         core:hasCYPPage ?cypPage .\n' +
        '}\n' +
        'ORDER BY ?cypPage ?asanaLabel'
      ),
      run: function (model) {
        var asanas = model.getAsanasWithVisuals();
        var distinctPages;

        if (!asanas.length) {
          return makeEmptyAnswer(this.prompt, 'No CYP-linked asanas were found in the ontology.');
        }

        distinctPages = unique(asanas.map(function (asana) {
          return asana.cypPage;
        }));

        return {
          prompt: this.prompt,
          narrative: 'The ontology links ' + asanas.length + ' asanas across ' + distinctPages.length +
            ' distinct CYP page reference' + (distinctPages.length === 1 ? '' : 's') + ': ' +
            joinList(asanas.map(function (asana) {
              return asana.label + ' (page ' + asana.cypPage + ')';
            })) + '.',
          facts: [
            { label: 'Asanas with visuals', value: String(asanas.length) },
            { label: 'Distinct CYP pages', value: distinctPages.join(', ') }
          ],
          table: {
            columns: ['Asana', 'CYP page', 'Image'],
            rows: asanas.map(function (asana) {
              return [
                asana.label,
                asana.cypPage,
                createVisualTableCell(asana)
              ];
            })
          },
          sections: [],
          visuals: model.collectVisualsFromAsanas(asanas)
        };
      }
    },
    {
      id: 'base-pose-7-guidance',
      title: 'Bhujangasana Guidance Model',
      prompt: 'What posture rules, biomechanical constraints, documented errors, and corrections are modeled for Bhujangasana (Pose 7)?',
      sparql: withPrefixes(
        'SELECT ?category ?detail\n' +
        'WHERE {\n' +
        '  BIND(base:BaseSN_Pose07 AS ?pose)\n' +
        '  {\n' +
        '    ?pose core:hasRule ?rule .\n' +
        '    ?rule core:ruleDescription ?detail .\n' +
        '    BIND("Rule" AS ?category)\n' +
        '  }\n' +
        '  UNION\n' +
        '  {\n' +
        '    ?pose core:hasConstraint ?constraint .\n' +
        '    ?constraint core:constraintDescription ?detail .\n' +
        '    BIND("Constraint" AS ?category)\n' +
        '  }\n' +
        '  UNION\n' +
        '  {\n' +
        '    ?pose core:hasPossibleError ?error .\n' +
        '    ?error core:errorDescription ?detail .\n' +
        '    BIND("Error" AS ?category)\n' +
        '  }\n' +
        '  UNION\n' +
        '  {\n' +
        '    ?pose core:hasPossibleError ?error .\n' +
        '    ?error core:hasCorrection ?correction .\n' +
        '    ?correction core:correctionText ?detail .\n' +
        '    BIND("Correction" AS ?category)\n' +
        '  }\n' +
        '  UNION\n' +
        '  {\n' +
        '    ?pose core:involvesBodyPart ?bodyPart .\n' +
        '    ?bodyPart rdfs:label ?detail .\n' +
        '    BIND("Body part" AS ?category)\n' +
        '  }\n' +
        '}\n' +
        'ORDER BY ?category ?detail'
      ),
      run: function (model) {
        var guidance = model.getPoseGuidance('BaseSN_Pose07');
        var pose;
        var rows;

        if (!guidance) {
          return makeEmptyAnswer(this.prompt, 'BaseSN_Pose07 could not be resolved in the ontology.');
        }

        pose = guidance.pose;
        rows = []
          .concat(guidance.rules.map(function (rule) {
            return ['Rule', rule.description || rule.label];
          }))
          .concat(guidance.constraints.map(function (constraint) {
            return ['Constraint', constraint.description || constraint.label];
          }))
          .concat(guidance.errors.map(function (error) {
            return ['Error', error.description || error.label];
          }))
          .concat(guidance.corrections.map(function (correction) {
            return ['Correction', correction.text || correction.label];
          }))
          .concat(guidance.bodyParts.map(function (bodyPart) {
            return ['Body part', bodyPart.label];
          }));

        return {
          prompt: this.prompt,
          narrative: 'The ontology links Base Pose ' + pose.poseNumber + ' (' + pose.asanaLabel +
            ') to ' + guidance.rules.length + ' rule' + (guidance.rules.length === 1 ? '' : 's') + ', ' +
            guidance.constraints.length + ' constraint' + (guidance.constraints.length === 1 ? '' : 's') + ', and ' +
            guidance.errors.length + ' modeled error' + (guidance.errors.length === 1 ? '' : 's') + '.',
          facts: [
            { label: 'Pose', value: 'Pose ' + pose.poseNumber },
            { label: 'Asana', value: pose.asanaLabel },
            { label: 'Rules', value: String(guidance.rules.length) },
            { label: 'Constraints', value: String(guidance.constraints.length) },
            { label: 'Errors', value: String(guidance.errors.length) },
            { label: 'Corrections', value: String(guidance.corrections.length) }
          ],
          table: rows.length ? {
            columns: ['Category', 'Detail'],
            rows: rows
          } : null,
          sections: [],
          visuals: guidance.visuals
        };
      }
    }
  ];

  global.SNEducationData = {
    PREFIX_BLOCK: PREFIX_BLOCK,
    QUESTIONS: QUESTIONS
  };
}(window));
