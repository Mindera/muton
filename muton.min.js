(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash"], factory);
	else if(typeof exports === 'object')
		exports["muton"] = factory(require("lodash"));
	else
		root["muton"] = factory(root["lodash"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	var _ = __webpack_require__(1);
	var helicase = __webpack_require__(2);
	var primase = __webpack_require__(4);
	var polymerase = __webpack_require__(8);
	var proofReading = __webpack_require__(12);

	function joinToggles(features, resolvedFeatures) {
	    features.toggles = _.reduce(resolvedFeatures, function (result, elem) {
	        result[elem.name] = elem.toggle;
	        return result;
	    }, features.toggles);
	}

	function joinThrottles(features, resolvedFeatures) {
	    var buckets = _.chain(resolvedFeatures)
	        .filter({type : 'bucket'})
	        .pluck('name')
	        .value();
	    features.buckets = features.buckets.concat(buckets);
	}

	function joinBuckets(features, resolvedFeatures) {
	    var throttles = _.chain(resolvedFeatures)
	        .filter({type : 'throttle'})
	        .pluck('name')
	        .value();
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

	module.exports = muton;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * The Helicase enzyme in real life breaks the double helix and separates the DNA strands.
	 * This module picks the user properties collection and the features collection and break them apart into two strands of
	 * names.
	 */

	var chemicalReactions = __webpack_require__(3);

	module.exports = {
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * This module contains multiple chemical reactions for use freely.
	 */

	var _ = __webpack_require__(1);

	module.exports = {
	    separateProperties: function (userProperties, feature) {
	        return {
	            userPropertyNames: _.keys(userProperties),
	            featurePropertyNames: _.keys(feature)
	        };
	    }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * The Primase enzyme in real life prepares the strand for the replication, this is called the primer.
	 * This module takes the user properties and feature properties strands, analyses it and returns a primer object
	 * containing instructions regarding the features to activate or deactivate.
	 */
	var _ = __webpack_require__(1);
	var chemicalReactions = __webpack_require__(3);
	var matchReading = __webpack_require__(5);

	function getFeatureProperties(feature) {
	    return _.pick(feature, ['toggle', 'throttle', 'buckets']);
	}

	function mergeProperties(primer, feature) {
	    var properties = getFeatureProperties(feature);
	    _.merge(primer, properties);
	}

	function isFeatureDisabled(primer, root) {
	    var toggle = _.get(primer, 'toggle');
	    return root && toggle === false;
	}

	function containsFeatureProperties(obj) {
	    return _.has(obj, 'toggle') || _.has(obj, 'throttle') || _.has(obj, 'buckets');
	}

	function pickMatchedProperties(childProperties, parentProperties) {
	    return !_.isUndefined(childProperties) ? childProperties : parentProperties;
	}

	function getPropertiesNode(userProperties, featurePropertyName, feature) {
	    // Explode the current node to check if there are properties
	    var featureProperty = feature[featurePropertyName];

	    var userPropertyValue = userProperties[featurePropertyName];
	    var properties = matchReading.getMatchedProperties(userPropertyValue, featureProperty);

	    return pickMatchedProperties(properties, featureProperty);
	}

	function bindPrimer(primerInstructions, childPrimer) {
	    _.merge(primerInstructions, childPrimer);
	}

	module.exports = {
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
	    preparePrimer: function(userProperties, feature, propertyStrands, root) {
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * This module match-reads feature properties against user properties.
	 */

	var _ = __webpack_require__(1);
	var regexMatcher = __webpack_require__(6);
	var numericMatcher = __webpack_require__(7);

	var defaultMatcher = {
	    matchesPropertyValue: function(userPropertyValue, propertyKey) {
	        return userPropertyValue === propertyKey;
	    }
	};

	function pickMatcher(userPropertyValue, propertyKey) {
	    if (regexMatcher.isRegex(propertyKey)) {
	        return regexMatcher;
	    } else if (numericMatcher.isNumber(userPropertyValue) &&
	        numericMatcher.isNumericQuantifier(propertyKey)) {
	        return numericMatcher;
	    } else {
	        return defaultMatcher;
	    }
	}

	module.exports = {
	    getMatchedProperties: function(userPropertyValue, featureProperty) {
	        return _.findLast(featureProperty, function (propertyValue, propertyKey) {
	            var matcher = pickMatcher(userPropertyValue, propertyKey);
	            return matcher.matchesPropertyValue(userPropertyValue, propertyKey);
	        });
	    }
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var regexDelimiters = /^\/.+\/$/;

	function sanitizeRegexStr(regexStr) {
	    return regexStr.substring(1, regexStr.length - 1);
	}

	module.exports = {
	    isRegex: function (value) {
	        return regexDelimiters.test(value);
	    },

	    matchesPropertyValue: function(propertyValue, regexStr) {
	        var sanitisedRegex = sanitizeRegexStr(regexStr);
	        var regex = new RegExp('^' + sanitisedRegex + '$');
	        return regex.test(propertyValue);
	    }
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var numberRegex = /-?\d+(\.\d{1,2})?/;
	var operatorRegex = /[><]=?/;

	var numericQuantifierRegex = new RegExp(operatorRegex.source + numberRegex.source);
	var validExpressionRegex = new RegExp(numberRegex.source + operatorRegex.source + numberRegex.source);

	function isExpressionValid(expression) {
	    return validExpressionRegex.test(expression);
	}

	module.exports = {

	    isNumber: function (value) {
	        return numberRegex.test(value);
	    },

	    isNumericQuantifier: function (value) {
	        return numericQuantifierRegex.test(value);
	    },

	    matchesPropertyValue: function(propertyValue, numericQuantifierStr) {
	        var expression = propertyValue + numericQuantifierStr;

	        if (!isExpressionValid(expression)) {
	            // Just to catch eventual issues with eval
	            return false;
	        }

	        /*jshint -W061*/
	        return eval(expression);
	    }
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

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
	var _ = __webpack_require__(1);
	var bucketMutator = __webpack_require__(9);
	var throttleMutator = __webpack_require__(10);
	var genePairing = __webpack_require__(11);
	var proofReader = __webpack_require__(12);

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
	        toggle : toggle.toggle,
	        type : 'bucket'
	    };

	    addToFeatures(features, featureName + "." + bucketName, bucketToggle);
	}

	module.exports = {
	    /**
	     * Returns a resolved feature toggle, with the information indicating whether it's active or not. If the
	     * feature mutates to a bucket, it also can contain the corresponding feature toggle.
	     *
	     * @param featureName The feature name being processed
	     * @param primerInstructions The primer instructions to process
	     * @returns A resolved feature toggle, which may mutate to a bucket feature toggle
	     * @param ancestorGenes An object containing 'genes' to inherit, this only applies to throttles and buckets
	     */
	    assembleFeatures: function(featureName, primerInstructions, ancestorGenes) {
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
	            addToFeatures(features, featureName, { toggle: false, type: 'toggle' });
	        }
	        return features;
	    }
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * The Bucket mutator manipulates the features by introducing small random mutations by picking a random
	 * bucket from the list, allowing multivariance testing.
	 */
	var _ = __webpack_require__(1);

	function pickOneElement(array) {
	    if (!_.isArray(array)) {
	        throw 'Not an array!';
	    }

	    var index = Math.floor(Math.random() * (array.length));
	    return array[index];
	}

	function isBucketGene(gene) {
	    return !_.isEmpty(gene) && gene.type === 'bucket';
	}

	function containsGene(featureProperties, gene) {
	    return _.includes(featureProperties.buckets, gene.toggle);
	}

	module.exports = {
	    mutate: function(featureProperties, gene) {
	        if (isBucketGene(gene) && containsGene(featureProperties, gene)) {
	            return gene.toggle;
	        } else {
	            return pickOneElement(featureProperties.buckets);
	        }
	    },

	    containsMultivariant: function(featureProperties) {
	        return this.isBucketListValid(featureProperties.buckets);
	    },

	    isBucketListValid: function(bucketList) {
	        return _.isArray(bucketList) && bucketList.length >= 0;
	    }
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * The Throttle mutator manipulates the features by introducing small random mutations by randomly activate
	 * or deactivate feture toggles.
	 */

	var _ = __webpack_require__(1);

	function isPercentage(value) {
	    return !_.isUndefined(value) && _.isString(value) && value.match(/[0-100]%/);
	}

	function isThrottleNode(throttle) {
	    return _.isPlainObject(throttle) && _.isString(throttle['value']) && isPercentage(throttle['value']);
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

	function getPercentageDecimal(throttle) {
	    var percentage = extractPercentage(throttle);
	    var value = percentage.substr(0, percentage.length - 2);
	    return value / 10;
	}

	function isThrottleValid(throttle) {
	    return isThrottleNode(throttle) || isPercentage(throttle);
	}

	function isThrottleGene(gene) {
	    return !_.isEmpty(gene) && gene.type === 'throttle';
	}

	function shouldMutate(throttle) {
	    return !_.isUndefined(throttle['mutate']) && throttle['mutate'] === 'force';
	}

	module.exports = {
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(1);

	function findWithPartialName(featureNames, partialName) {
	    return _.filter(featureNames, function (featureName) {
	        return featureName.indexOf(partialName) === 0;
	    });
	}

	function hasPartialName(featureNames, partialName) {
	    return findWithPartialName(featureNames, partialName).length > 0;
	}

	function containTogglesPair(genes, featureName) {
	    return hasPartialName(_.keys(genes.toggles), featureName);
	}

	function containBucketsPair(genes, featureName) {
	    return hasPartialName(genes.buckets, featureName);
	}

	function containThrottlesPair(genes, featureName) {
	    return hasPartialName(genes.throttles, featureName);
	}

	function getBucketNameFromFeatureName(featureName) {
	    var dotIndex = featureName.indexOf('.');
	    return dotIndex >= 0 ? featureName.substring(dotIndex + 1) : '';
	}

	function getMatchingBucket(genes, featureName) {
	    var matchedFeatures = findWithPartialName(genes.buckets, featureName);
	    var matched = _.find(matchedFeatures, function (matchedBucket) {
	            return genes.toggles[matchedBucket];
	        });
	    return _.isString(matched) ? getBucketNameFromFeatureName(matched) : '';
	}

	module.exports = {
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * This module checks for errors and proof-reads the molecules.
	 */
	var _ = __webpack_require__(1);
	var bucketMutator = __webpack_require__(9);
	var throttleMutator = __webpack_require__(10);

	module.exports = {
	    areInstructionsValid: function (featureInstructions) {
	        var toggle = _.get(featureInstructions, 'toggle');
	        var throttle = _.get(featureInstructions, 'throttle');
	        var buckets = _.get(featureInstructions, 'buckets');

	        return this.isToggleValid(toggle) && this.isThrottleValid(throttle) && this.areBucketsValid(buckets);
	    },

	    isToggleValid: function (toggle) {
	        return _.isUndefined(toggle) || _.isBoolean(toggle);
	    },

	    isThrottleValid: function(throttle) {
	        return _.isUndefined(throttle) || throttleMutator.isThrottleValid(throttle);
	    },

	    areBucketsValid: function(buckets) {
	        return _.isUndefined(buckets) || bucketMutator.isBucketListValid(buckets);
	    },

	    checkFeatureInstructions: function (featureInstructions) {
	        var valid = _.isUndefined(featureInstructions) || _.isNull(featureInstructions) || !_.isArray(featureInstructions) && _.isObject(featureInstructions);

	        if (!valid) {
	            throw new Error('Invalid feature instructions!');
	        }
	    }
	};


/***/ }
/******/ ])
});
;