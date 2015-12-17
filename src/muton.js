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

    if (typeof define !== 'function') {
        /*jshint -W003*/
        var define = require('amdefine')(module);
    }

    var hasExports = typeof module !== 'undefined' && module.exports;

    /*jshint -W038*/
    define(function (require) {

        var _ = require('lodash');
        var helicase = require('./enzymes/helicase');
        var primase = require('./enzymes/primase');
        var polymerase = require('./enzymes/polymerase');
        var proofReading = require('./reactions/proof-reading');

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

        // Exports section
        if (hasExports) {
            // Export to NodeJS
            module.exports = muton;
        } else {
            // Export to Global
            this.muton = muton;
        }

        return muton;
    });
}).call(this);
