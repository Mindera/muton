;(function() {
var reactions_chemicaljs, enzymes_helicase, reactions_matchers_regex, reactions_matchers_numeric_quantifier, reactions_match_readingjs, enzymes_primase, mutators_bucket, mutators_throttle, mutators_gene_pairing, reactions_proof_reading, enzymes_polymerase, muton;
'use strict';
/**
 * This module contains multiple chemical reactions for use freely.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
reactions_chemicaljs = function (require) {
  var _ = lodash;
  return {
    separateProperties: function (userProperties, feature) {
      return {
        userPropertyNames: _.keys(userProperties),
        featurePropertyNames: _.keys(feature)
      };
    }
  };
}({});
'use strict';
/**
 * The Helicase enzyme in real life breaks the double helix and separates the DNA strands.
 * This module picks the user properties collection and the features collection and break them apart into two strands of
 * names.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
enzymes_helicase = function (require) {
  var chemicalReactions = reactions_chemicaljs;
  return {
    /**
     * Returns an object containing two strands: one containing the user properties names and the other containing
     * the features names.
     *
     * @param userProperties a dictionary with user properties
     * @param feature a dictionary with features instructions
     * @returns An object that contains user property names and features names
     */
    breakProperties: function (userProperties, feature) {
      return chemicalReactions.separateProperties(userProperties, feature);
    }
  };
}({});
'use strict';
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
reactions_matchers_regex = function () {
  var regexDelimiters = /^\/.+\/$/;
  function sanitizeRegexStr(regexStr) {
    return regexStr.substring(1, regexStr.length - 1);
  }
  return {
    isRegex: function (value) {
      return regexDelimiters.test(value);
    },
    matchesPropertyValue: function (propertyValue, regexStr) {
      var sanitisedRegex = sanitizeRegexStr(regexStr);
      var regex = new RegExp('^' + sanitisedRegex + '$');
      return regex.test(propertyValue);
    }
  };
}();
'use strict';
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
reactions_matchers_numeric_quantifier = function () {
  var numberRegex = /-?\d+(\.\d{1,2})?/;
  var operatorRegex = /[><]=?/;
  var numericQuantifierRegex = new RegExp(operatorRegex.source + numberRegex.source);
  var validExpressionRegex = new RegExp(numberRegex.source + operatorRegex.source + numberRegex.source);
  function isExpressionValid(expression) {
    return validExpressionRegex.test(expression);
  }
  return {
    isNumber: function (value) {
      return numberRegex.test(value);
    },
    isNumericQuantifier: function (value) {
      return numericQuantifierRegex.test(value);
    },
    matchesPropertyValue: function (propertyValue, numericQuantifierStr) {
      var expression = propertyValue + numericQuantifierStr;
      if (!isExpressionValid(expression)) {
        // Just to catch eventual issues with eval
        return false;
      }
      /*jshint -W061*/
      return eval(expression);
    }
  };
}();
'use strict';
/**
 * This module match-reads feature properties against user properties.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
reactions_match_readingjs = function (require) {
  var _ = lodash;
  var regexMatcher = reactions_matchers_regex;
  var numericMatcher = reactions_matchers_numeric_quantifier;
  var defaultMatcher = {
    matchesPropertyValue: function (userPropertyValue, propertyKey) {
      return userPropertyValue === propertyKey;
    }
  };
  function pickMatcher(userPropertyValue, propertyKey) {
    if (regexMatcher.isRegex(propertyKey)) {
      return regexMatcher;
    } else if (numericMatcher.isNumber(userPropertyValue) && numericMatcher.isNumericQuantifier(propertyKey)) {
      return numericMatcher;
    } else {
      return defaultMatcher;
    }
  }
  return {
    getMatchedProperties: function (userPropertyValue, featureProperty) {
      return _.findLast(featureProperty, function (propertyValue, propertyKey) {
        var matcher = pickMatcher(userPropertyValue, propertyKey);
        return matcher.matchesPropertyValue(userPropertyValue, propertyKey);
      });
    }
  };
}({});
'use strict';
/**
 * The Primase enzyme in real life prepares the strand for the replication, this is called the primer.
 * This module takes the user properties and feature properties strands, analyses it and returns a primer object
 * containing instructions regarding the features to activate or deactivate.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
enzymes_primase = function (require) {
  var _ = lodash;
  var chemicalReactions = reactions_chemicaljs;
  var matchReading = reactions_match_readingjs;
  function mergeProperties(primer, feature) {
    var properties = getFeatureProperties(feature);
    _.merge(primer, properties);
  }
  function isFeatureDisabled(primer, root) {
    var toggle = _.get(primer, 'toggle');
    return root && toggle === false;
  }
  function getFeatureProperties(feature) {
    return _.pick(feature, [
      'toggle',
      'throttle',
      'buckets'
    ]);
  }
  function containsFeatureProperties(obj) {
    return _.has(obj, 'toggle') || _.has(obj, 'throttle') || _.has(obj, 'buckets');
  }
  function getPropertiesNode(userProperties, featurePropertyName, feature) {
    // Explode the current node to check if there are properties
    var featureProperty = feature[featurePropertyName];
    var userPropertyValue = userProperties[featurePropertyName];
    var properties = matchReading.getMatchedProperties(userPropertyValue, featureProperty);
    return pickMatchedProperties(properties, featureProperty);
  }
  function pickMatchedProperties(childProperties, parentProperties) {
    return !_.isUndefined(childProperties) ? childProperties : parentProperties;
  }
  function bindPrimer(primerInstructions, childPrimer) {
    _.merge(primerInstructions, childPrimer);
  }
  return {
    /**
     * Returns a primer collection containing instructions to toggle on or off a feature,
     * matched against the user properties.
     *
     * @param userProperties The user properties to match the features
     * @param feature The feature being processed
     * @param propertyStrands An object with the strands containing user and features properties names
     * @param root A flag to indicate if the features tree is being processed in the root
     * @returns A collection of primer instructions matched against the user properties
     */
    preparePrimer: function (userProperties, feature, propertyStrands, root) {
      var self = this;
      var primerInstructions = {};
      var userPropertyNames = propertyStrands.userPropertyNames;
      var featurePropertyNames = propertyStrands.featurePropertyNames;
      // If are feature properties on the current node, it merges with the final result
      if (containsFeatureProperties(feature)) {
        mergeProperties(primerInstructions, feature);
      }
      if (!isFeatureDisabled(primerInstructions, root)) {
        featurePropertyNames.forEach(function (featurePropertyName) {
          if (_.contains(userPropertyNames, featurePropertyName)) {
            var propertiesNode = getPropertiesNode(userProperties, featurePropertyName, feature);
            // Process the child node
            var childStrands = chemicalReactions.separateProperties(userProperties, propertiesNode);
            var childPrimer = self.preparePrimer(userProperties, propertiesNode, childStrands);
            bindPrimer(primerInstructions, childPrimer);
          }
        });
      }
      return primerInstructions;
    }
  };
}({});
'use strict';
/**
 * The Bucket mutator manipulates the features by introducing small random mutations by picking a random
 * bucket from the list, allowing multivariance testing.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
mutators_bucket = function (require) {
  var _ = lodash;
  function pickOneElement(array) {
    if (!_.isArray(array)) {
      throw 'Not an array!';
    }
    var index = Math.floor(Math.random() * array.length);
    return array[index];
  }
  function isBucketGene(gene) {
    return !_.isEmpty(gene) && gene.type === 'bucket';
  }
  function containsGene(featureProperties, gene) {
    return _.includes(featureProperties.buckets, gene.toggle);
  }
  return {
    mutate: function (featureProperties, gene) {
      if (isBucketGene(gene) && containsGene(featureProperties, gene)) {
        return gene.toggle;
      } else {
        return pickOneElement(featureProperties.buckets);
      }
    },
    containsMultivariant: function (featureProperties) {
      return this.isBucketListValid(featureProperties.buckets);
    },
    isBucketListValid: function (bucketList) {
      return _.isArray(bucketList) && bucketList.length >= 0;
    }
  };
}({});
'use strict';
/**
 * The Throttle mutator manipulates the features by introducing small random mutations by randomly activate
 * or deactivate feture toggles.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
mutators_throttle = function (require) {
  var _ = lodash;
  function getPercentageDecimal(throttle) {
    var percentage = extractPercentage(throttle);
    var value = percentage.substr(0, percentage.length - 2);
    return value / 10;
  }
  function extractPercentage(throttle) {
    var percentage;
    if (isThrottleNode(throttle)) {
      percentage = throttle['value'];
    } else {
      percentage = throttle;
    }
    return percentage;
  }
  function isThrottleValid(throttle) {
    return isThrottleNode(throttle) || isPercentage(throttle);
  }
  function isThrottleNode(throttle) {
    return _.isPlainObject(throttle) && _.isString(throttle['value']) && isPercentage(throttle['value']);
  }
  function isPercentage(value) {
    return !_.isUndefined(value) && _.isString(value) && value.match(/[0-100]%/);
  }
  function isThrottleGene(gene) {
    return !_.isEmpty(gene) && gene.type === 'throttle';
  }
  function shouldMutate(throttle) {
    return !_.isUndefined(throttle['mutate']) && throttle['mutate'] === 'force';
  }
  return {
    mutate: function (throttle, gene) {
      if (!shouldMutate(throttle) && isThrottleGene(gene)) {
        return gene.toggle;
      } else {
        var percentage = getPercentageDecimal(throttle);
        return Math.random() < percentage;
      }
    },
    isThrottleValid: function (throttle) {
      return isThrottleValid(throttle);
    }
  };
}({});
'use strict';
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
mutators_gene_pairing = function (require) {
  var _ = lodash;
  function containTogglesPair(genes, featureName) {
    return hasPartialName(_.keys(genes.toggles), featureName);
  }
  function containBucketsPair(genes, featureName) {
    return hasPartialName(genes.buckets, featureName);
  }
  function containThrottlesPair(genes, featureName) {
    return hasPartialName(genes.throttles, featureName);
  }
  function hasPartialName(featureNames, partialName) {
    return findWithPartialName(featureNames, partialName).length > 0;
  }
  function findWithPartialName(featureNames, partialName) {
    return _.filter(featureNames, function (featureName) {
      return featureName.indexOf(partialName) === 0;
    });
  }
  function getMatchingBucket(genes, featureName) {
    var matchedFeatures = findWithPartialName(genes.buckets, featureName);
    var matched = _.find(matchedFeatures, function (matchedBucket) {
      return genes.toggles[matchedBucket];
    });
    return _.isString(matched) ? getBucketNameFromFeatureName(matched) : '';
  }
  function getBucketNameFromFeatureName(featureName) {
    var dotIndex = featureName.indexOf('.');
    return dotIndex >= 0 ? featureName.substring(dotIndex + 1) : '';
  }
  return {
    pairGene: function (genes, featureName) {
      var gene = {};
      if (containTogglesPair(genes, featureName)) {
        var type = 'toggle';
        var name = genes.toggles[featureName];
        if (containBucketsPair(genes, featureName)) {
          type = 'bucket';
          name = getMatchingBucket(genes, featureName);
        } else if (containThrottlesPair(genes, featureName)) {
          type = 'throttle';
        }
        gene['toggle'] = name;
        gene['type'] = type;
      }
      return gene;
    }
  };
}({});
'use strict';
/**
 * This module checks for errors and proof-reads the molecules.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
reactions_proof_reading = function (require) {
  var _ = lodash;
  var bucketMutator = mutators_bucket;
  var throttleMutator = mutators_throttle;
  return {
    areInstructionsValid: function (featureInstructions) {
      var toggle = _.get(featureInstructions, 'toggle');
      var throttle = _.get(featureInstructions, 'throttle');
      var buckets = _.get(featureInstructions, 'buckets');
      return this.isToggleValid(toggle) && this.isThrottleValid(throttle) && this.areBucketsValid(buckets);
    },
    isToggleValid: function (toggle) {
      return _.isUndefined(toggle) || _.isBoolean(toggle);
    },
    isThrottleValid: function (throttle) {
      return _.isUndefined(throttle) || throttleMutator.isThrottleValid(throttle);
    },
    areBucketsValid: function (buckets) {
      return _.isUndefined(buckets) || bucketMutator.isBucketListValid(buckets);
    },
    checkFeatureInstructions: function (featureInstructions) {
      var valid = _.isUndefined(featureInstructions) || _.isNull(featureInstructions) || !_.isArray(featureInstructions) && _.isObject(featureInstructions);
      if (!valid) {
        throw new Error('Invalid feature instructions!');
      }
    }
  };
}({});
'use strict';
/**
 * The Polymerase enzyme in real life assembles a new DNA strand on top of the existing one. During the process, it
 * check for replication errors doing proof-reading on the fly. But sometimes a random mutation occur... that's life
 * trying to evolve.
 * This module takes the primer feature instructions, does proof-reading over them to make sure no errors
 * are found and then it assembles a collection of resolved feature toggles.
 *
 * In the process, even if the instructions are considered valid, random mutations occur. Those are caused by the
 * Bucket and Throttle mutators. That's your application trying to evolve.
 */
if (true) {
  /*jshint -W003*/
  var define = amdefine(module);
}
enzymes_polymerase = function (require) {
  var _ = lodash;
  var bucketMutator = mutators_bucket;
  var throttleMutator = mutators_throttle;
  var genePairing = mutators_gene_pairing;
  var proofReader = reactions_proof_reading;
  function addToFeatures(features, featureName, toggle) {
    return features.push(_.merge({ name: featureName }, toggle));
  }
  function processFeatureInstructions(featureProperties, gene) {
    var toggle = {
      type: 'toggle',
      toggle: false
    };
    if (featureProperties.toggle !== false) {
      if (throttleMutator.isThrottleValid(featureProperties.throttle)) {
        toggle.toggle = throttleMutator.mutate(featureProperties.throttle, gene);
        toggle.type = 'throttle';
      } else if (featureProperties.toggle === true) {
        toggle.toggle = true;
      }
    }
    return toggle;
  }
  function containsBuckets(toggle, featureInstructions) {
    return toggle.toggle && bucketMutator.containsMultivariant(featureInstructions);
  }
  function addBucketToFeatures(features, featureName, featureInstructions, toggle, gene) {
    var bucketName = bucketMutator.mutate(featureInstructions, gene);
    var bucketToggle = {
      toggle: toggle.toggle,
      type: 'bucket'
    };
    addToFeatures(features, featureName + '.' + bucketName, bucketToggle);
  }
  return {
    /**
     * Returns a resolved feature toggle, with the information indicating whether it's active or not. If the
     * feature mutates to a bucket, it also can contain the corresponding feature toggle.
     *
     * @param featureName The feature name being processed
     * @param primerInstructions The primer instructions to process
     * @returns A resolved feature toggle, which may mutate to a bucket feature toggle
     * @param ancestorGenes An object containing 'genes' to inherit, this only applies to throttles and buckets
     */
    assembleFeatures: function (featureName, primerInstructions, ancestorGenes) {
      var features = [];
      if (proofReader.areInstructionsValid(primerInstructions)) {
        // Get the ancestor gene based on name to be able to copy it to the descendant
        var gene = genePairing.pairGene(ancestorGenes, featureName);
        var toggle = processFeatureInstructions(primerInstructions, gene);
        addToFeatures(features, featureName, toggle);
        if (containsBuckets(toggle, primerInstructions)) {
          addBucketToFeatures(features, featureName, primerInstructions, toggle, gene);
        }
      } else {
        addToFeatures(features, featureName, {
          toggle: false,
          type: 'toggle'
        });
      }
      return features;
    }
  };
}({});
/**
 * This is the Muton.js project - a feature toggle tool with support for feature throttling and Multivariance testing.
 *
 * Some notes on the chosen metaphor:
 * I'm perfectly aware that every developer should write readable code and choose the metaphors carefully. However, it
 * was a lot of fun writing the code this way. It was a challenge to use the cell metaphor. :)
 *
 * To make things easier, read the following resume.
 *
 * DNA replication consists on three steps:
 *  1) Opening the double helix and separation of the DNA strands
 *  2) The priming of the template strand, or laying the foundation for the new DNA
 *  3) Assembly of the new DNA segment, which includes proof-reading the DNA strand.
 *
 * Here are the enzymes responsible for each step:
 *  Step 1) is executed by the Helicase enzyme
 *  Step 2) is executed by the Primase enzyme
 *  Step 3) is executed by the Polymerase enzyme
 *
 *  That's it.
 *
 * If you want to get a little deeper, please have a look at:
 * http://www.nature.com/scitable/topicpage/cells-can-replicate-their-dna-precisely-6524830
 */
(function () {
  if (true) {
    /*jshint -W003*/
    var define = amdefine(module);
  }
  var hasExports = typeof module !== 'undefined' && module.exports;
  muton = function (require) {
    var _ = lodash;
    var helicase = enzymes_helicase;
    var primase = enzymes_primase;
    var polymerase = enzymes_polymerase;
    var proofReading = reactions_proof_reading;
    function joinToggles(features, resolvedFeatures) {
      features.toggles = _.reduce(resolvedFeatures, function (result, elem) {
        result[elem.name] = elem.toggle;
        return result;
      }, features.toggles);
    }
    function joinThrottles(features, resolvedFeatures) {
      var buckets = _.chain(resolvedFeatures).filter({ type: 'bucket' }).pluck('name').value();
      features.buckets = features.buckets.concat(buckets);
    }
    function joinBuckets(features, resolvedFeatures) {
      var throttles = _.chain(resolvedFeatures).filter({ type: 'throttle' }).pluck('name').value();
      features.throttles = features.throttles.concat(throttles);
    }
    function joinMutations(features, resolvedFeatures) {
      joinToggles(features, resolvedFeatures);
      joinThrottles(features, resolvedFeatures);
      joinBuckets(features, resolvedFeatures);
    }
    var muton = {
      /**
       * Given a list of user properties and feature instructions, it returns a collection of features toggles.
       *
       * @deprecated use getMutations or inheritMutations instead
       *
       * @param userProperties (optional) A collection of user properties
       * @param featureInstructions A collection of feature instructions which can be organized as a hierarchy of properties.
       * @returns An collection of feature toggles
       */
      getFeatureMutations: function (userProperties, featureInstructions) {
        return this.getMutations(userProperties, featureInstructions).toggles;
      },
      /**
       * Given a list of user properties and feature instructions, it returns a collection of features toggles.
       *
       * @param userProperties (optional) A collection of user properties
       * @param featureInstructions A collection of feature instructions which can be organized as a hierarchy of properties.
       * @returns {{toggles: {}, buckets: Array, throttles: Array}} An collection of feature toggles
       */
      getMutations: function (userProperties, featureInstructions) {
        return this.inheritMutations(userProperties, featureInstructions, {});
      },
      /**
       * Given a list of user properties and feature instructions, it returns a collection of features toggles. If specified,
       * it can inherit ancestor genes for buckets and throttle mutations
       *
       * @param userProperties (optional) A collection of user properties
       * @param featureInstructions A collection of feature instructions which can be organized as a hierarchy of properties.
       * @param ancestorGenes (optional) The ancestor genes, which is the output of previous mutations from Muton
       * @returns {{toggles: {}, buckets: Array, throttles: Array}} An collection of feature toggles
       */
      inheritMutations: function (userProperties, featureInstructions, ancestorGenes) {
        var features = {
          toggles: {},
          buckets: [],
          throttles: []
        };
        proofReading.checkFeatureInstructions(featureInstructions);
        _.forEach(featureInstructions, function (feature, featureName) {
          // Helicase will break the user properties and features apart into two different chains
          var propertyChains = helicase.breakProperties(userProperties, feature);
          // Read the chains and return a primer object that will contain a set of instructions
          var primer = primase.preparePrimer(userProperties, feature, propertyChains, true);
          // Pick the primer, proof-read the instructions and then assemble the collection of feature toggles
          var resolvedFeatures = polymerase.assembleFeatures(featureName, primer, ancestorGenes);
          // Join all the mutations
          joinMutations(features, resolvedFeatures);
        });
        return features;
      }
    };
    // Exports section
    if (hasExports) {
      // Export to NodeJS
      exports = muton;
    } else {
      // Export to AMD
      this.muton = muton;
    }
  }({});
}.call(this));
}());