!function(root,factory){"object"==typeof exports&&"object"==typeof module?module.exports=factory(require("lodash")):"function"==typeof define&&define.amd?define(["lodash"],factory):"object"==typeof exports?exports.muton=factory(require("lodash")):root.muton=factory(root.lodash)}(this,function(__WEBPACK_EXTERNAL_MODULE_1__){return function(modules){function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}var installedModules={};return __webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports,__webpack_require__){function joinToggles(features,resolvedFeatures){features.toggles=_.reduce(resolvedFeatures,function(result,elem){return result[elem.name]=elem.toggle,result},features.toggles)}function joinThrottles(features,resolvedFeatures){var buckets=_.chain(resolvedFeatures).filter({type:"bucket"}).pluck("name").value();features.buckets=features.buckets.concat(buckets)}function joinBuckets(features,resolvedFeatures){var throttles=_.chain(resolvedFeatures).filter({type:"throttle"}).pluck("name").value();features.throttles=features.throttles.concat(throttles)}function joinMutations(features,resolvedFeatures){joinToggles(features,resolvedFeatures),joinThrottles(features,resolvedFeatures),joinBuckets(features,resolvedFeatures)}var _=__webpack_require__(1),helicase=__webpack_require__(2),primase=__webpack_require__(4),polymerase=__webpack_require__(8),proofReading=__webpack_require__(12),muton={getFeatureMutations:function(userProperties,featureInstructions){return this.getMutations(userProperties,featureInstructions).toggles},getMutations:function(userProperties,featureInstructions){return this.inheritMutations(userProperties,featureInstructions,{})},inheritMutations:function(userProperties,featureInstructions,ancestorGenes){var features={toggles:{},buckets:[],throttles:[]};return proofReading.checkFeatureInstructions(featureInstructions),_.forEach(featureInstructions,function(feature,featureName){var propertyChains=helicase.breakProperties(userProperties,feature),primer=primase.preparePrimer(userProperties,feature,propertyChains,!0),resolvedFeatures=polymerase.assembleFeatures(featureName,primer,ancestorGenes);joinMutations(features,resolvedFeatures)}),features}};module.exports=muton},function(module,exports){module.exports=__WEBPACK_EXTERNAL_MODULE_1__},function(module,exports,__webpack_require__){"use strict";var chemicalReactions=__webpack_require__(3);module.exports={breakProperties:function(userProperties,feature){return chemicalReactions.separateProperties(userProperties,feature)}}},function(module,exports,__webpack_require__){"use strict";var _=__webpack_require__(1);module.exports={separateProperties:function(userProperties,feature){return{userPropertyNames:_.keys(userProperties),featurePropertyNames:_.keys(feature)}}}},function(module,exports,__webpack_require__){"use strict";function getFeatureProperties(feature){return _.pick(feature,["toggle","throttle","buckets"])}function mergeProperties(primer,feature){var properties=getFeatureProperties(feature);_.merge(primer,properties)}function isFeatureDisabled(primer,root){var toggle=_.get(primer,"toggle");return root&&toggle===!1}function containsFeatureProperties(obj){return _.has(obj,"toggle")||_.has(obj,"throttle")||_.has(obj,"buckets")}function pickMatchedProperties(childProperties,parentProperties){return _.isUndefined(childProperties)?parentProperties:childProperties}function getPropertiesNode(userProperties,featurePropertyName,feature){var featureProperty=feature[featurePropertyName],userPropertyValue=userProperties[featurePropertyName],properties=matchReading.getMatchedProperties(userPropertyValue,featureProperty);return pickMatchedProperties(properties,featureProperty)}function bindPrimer(primerInstructions,childPrimer){_.merge(primerInstructions,childPrimer)}var _=__webpack_require__(1),chemicalReactions=__webpack_require__(3),matchReading=__webpack_require__(5);module.exports={preparePrimer:function(userProperties,feature,propertyStrands,root){var self=this,primerInstructions={},userPropertyNames=propertyStrands.userPropertyNames,featurePropertyNames=propertyStrands.featurePropertyNames;return containsFeatureProperties(feature)&&mergeProperties(primerInstructions,feature),isFeatureDisabled(primerInstructions,root)||featurePropertyNames.forEach(function(featurePropertyName){if(_.contains(userPropertyNames,featurePropertyName)){var propertiesNode=getPropertiesNode(userProperties,featurePropertyName,feature),childStrands=chemicalReactions.separateProperties(userProperties,propertiesNode),childPrimer=self.preparePrimer(userProperties,propertiesNode,childStrands);bindPrimer(primerInstructions,childPrimer)}}),primerInstructions}}},function(module,exports,__webpack_require__){"use strict";function pickMatcher(userPropertyValue,propertyKey){return regexMatcher.isRegex(propertyKey)?regexMatcher:numericMatcher.isNumber(userPropertyValue)&&numericMatcher.isNumericQuantifier(propertyKey)?numericMatcher:defaultMatcher}var _=__webpack_require__(1),regexMatcher=__webpack_require__(6),numericMatcher=__webpack_require__(7),defaultMatcher={matchesPropertyValue:function(userPropertyValue,propertyKey){return userPropertyValue===propertyKey}};module.exports={getMatchedProperties:function(userPropertyValue,featureProperty){return _.findLast(featureProperty,function(propertyValue,propertyKey){var matcher=pickMatcher(userPropertyValue,propertyKey);return matcher.matchesPropertyValue(userPropertyValue,propertyKey)})}}},function(module,exports){"use strict";function sanitizeRegexStr(regexStr){return regexStr.substring(1,regexStr.length-1)}var regexDelimiters=/^\/.+\/$/;module.exports={isRegex:function(value){return regexDelimiters.test(value)},matchesPropertyValue:function(propertyValue,regexStr){var sanitisedRegex=sanitizeRegexStr(regexStr),regex=new RegExp("^"+sanitisedRegex+"$");return regex.test(propertyValue)}}},function(module,exports){"use strict";function isExpressionValid(expression){return validExpressionRegex.test(expression)}var numberRegex=/-?\d+(\.\d{1,2})?/,operatorRegex=/[><]=?/,numericQuantifierRegex=new RegExp(operatorRegex.source+numberRegex.source),validExpressionRegex=new RegExp(numberRegex.source+operatorRegex.source+numberRegex.source);module.exports={isNumber:function(value){return numberRegex.test(value)},isNumericQuantifier:function(value){return numericQuantifierRegex.test(value)},matchesPropertyValue:function(propertyValue,numericQuantifierStr){var expression=propertyValue+numericQuantifierStr;return isExpressionValid(expression)?eval(expression):!1}}},function(module,exports,__webpack_require__){"use strict";function addToFeatures(features,featureName,toggle){return features.push(_.merge({name:featureName},toggle))}function processFeatureInstructions(featureProperties,gene){var toggle={type:"toggle",toggle:!1};return featureProperties.toggle!==!1&&(throttleMutator.isThrottleValid(featureProperties.throttle)?(toggle.toggle=throttleMutator.mutate(featureProperties.throttle,gene),toggle.type="throttle"):featureProperties.toggle===!0&&(toggle.toggle=!0)),toggle}function containsBuckets(toggle,featureInstructions){return toggle.toggle&&bucketMutator.containsMultivariant(featureInstructions)}function addBucketToFeatures(features,featureName,featureInstructions,toggle,gene){var bucketName=bucketMutator.mutate(featureInstructions,gene),bucketToggle={toggle:toggle.toggle,type:"bucket"};addToFeatures(features,featureName+"."+bucketName,bucketToggle)}var _=__webpack_require__(1),bucketMutator=__webpack_require__(9),throttleMutator=__webpack_require__(10),genePairing=__webpack_require__(11),proofReader=__webpack_require__(12);module.exports={assembleFeatures:function(featureName,primerInstructions,ancestorGenes){var features=[];if(proofReader.areInstructionsValid(primerInstructions)){var gene=genePairing.pairGene(ancestorGenes,featureName),toggle=processFeatureInstructions(primerInstructions,gene);addToFeatures(features,featureName,toggle),containsBuckets(toggle,primerInstructions)&&addBucketToFeatures(features,featureName,primerInstructions,toggle,gene)}else addToFeatures(features,featureName,{toggle:!1,type:"toggle"});return features}}},function(module,exports,__webpack_require__){"use strict";function pickOneElement(array){if(!_.isArray(array))throw"Not an array!";var index=Math.floor(Math.random()*array.length);return array[index]}function isBucketGene(gene){return!_.isEmpty(gene)&&"bucket"===gene.type}function containsGene(featureProperties,gene){return _.includes(featureProperties.buckets,gene.toggle)}var _=__webpack_require__(1);module.exports={mutate:function(featureProperties,gene){return isBucketGene(gene)&&containsGene(featureProperties,gene)?gene.toggle:pickOneElement(featureProperties.buckets)},containsMultivariant:function(featureProperties){return this.isBucketListValid(featureProperties.buckets)},isBucketListValid:function(bucketList){return _.isArray(bucketList)&&bucketList.length>=0}}},function(module,exports,__webpack_require__){"use strict";function isPercentage(value){return!_.isUndefined(value)&&_.isString(value)&&value.match(/[0-100]%/)}function isThrottleNode(throttle){return _.isPlainObject(throttle)&&_.isString(throttle.value)&&isPercentage(throttle.value)}function extractPercentage(throttle){var percentage;return percentage=isThrottleNode(throttle)?throttle.value:throttle}function getPercentageDecimal(throttle){var percentage=extractPercentage(throttle),value=percentage.substr(0,percentage.length-2);return value/10}function isThrottleValid(throttle){return isThrottleNode(throttle)||isPercentage(throttle)}function isThrottleGene(gene){return!_.isEmpty(gene)&&"throttle"===gene.type}function shouldMutate(throttle){return!_.isUndefined(throttle.mutate)&&"force"===throttle.mutate}var _=__webpack_require__(1);module.exports={mutate:function(throttle,gene){if(!shouldMutate(throttle)&&isThrottleGene(gene))return gene.toggle;var percentage=getPercentageDecimal(throttle);return Math.random()<percentage},isThrottleValid:function(throttle){return isThrottleValid(throttle)}}},function(module,exports,__webpack_require__){"use strict";function findWithPartialName(featureNames,partialName){return _.filter(featureNames,function(featureName){return 0===featureName.indexOf(partialName)})}function hasPartialName(featureNames,partialName){return findWithPartialName(featureNames,partialName).length>0}function containTogglesPair(genes,featureName){return hasPartialName(_.keys(genes.toggles),featureName)}function containBucketsPair(genes,featureName){return hasPartialName(genes.buckets,featureName)}function containThrottlesPair(genes,featureName){return hasPartialName(genes.throttles,featureName)}function getBucketNameFromFeatureName(featureName){var dotIndex=featureName.indexOf(".");return dotIndex>=0?featureName.substring(dotIndex+1):""}function getMatchingBucket(genes,featureName){var matchedFeatures=findWithPartialName(genes.buckets,featureName),matched=_.find(matchedFeatures,function(matchedBucket){return genes.toggles[matchedBucket]});return _.isString(matched)?getBucketNameFromFeatureName(matched):""}var _=__webpack_require__(1);module.exports={pairGene:function(genes,featureName){var gene={};if(containTogglesPair(genes,featureName)){var type="toggle",name=genes.toggles[featureName];containBucketsPair(genes,featureName)?(type="bucket",name=getMatchingBucket(genes,featureName)):containThrottlesPair(genes,featureName)&&(type="throttle"),gene.toggle=name,gene.type=type}return gene}}},function(module,exports,__webpack_require__){"use strict";var _=__webpack_require__(1),bucketMutator=__webpack_require__(9),throttleMutator=__webpack_require__(10);module.exports={areInstructionsValid:function(featureInstructions){var toggle=_.get(featureInstructions,"toggle"),throttle=_.get(featureInstructions,"throttle"),buckets=_.get(featureInstructions,"buckets");return this.isToggleValid(toggle)&&this.isThrottleValid(throttle)&&this.areBucketsValid(buckets)},isToggleValid:function(toggle){return _.isUndefined(toggle)||_.isBoolean(toggle)},isThrottleValid:function(throttle){return _.isUndefined(throttle)||throttleMutator.isThrottleValid(throttle)},areBucketsValid:function(buckets){return _.isUndefined(buckets)||bucketMutator.isBucketListValid(buckets)},checkFeatureInstructions:function(featureInstructions){var valid=_.isUndefined(featureInstructions)||_.isNull(featureInstructions)||!_.isArray(featureInstructions)&&_.isObject(featureInstructions);if(!valid)throw new Error("Invalid feature instructions!")}}}])});