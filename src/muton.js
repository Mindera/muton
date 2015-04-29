'use strict';

/**
 * This is the Muton.js project - a feature toggle tool with support for feature throttling and Multivariance testing.
 *
 * Some notes on the chosen metaphor:
 * I'm perfectly aware that every developer should write readable code and choose the metaphors carefully. However, I
 * had a lot of fun writing the code this way. I tried to keep things readable and simple and and it was a challenge
 * to use the cell metaphor. Read the code, I think it's not that bad. :)
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
 *  If you want to get a little deeper, please have a look at:
 * http://www.nature.com/scitable/topicpage/cells-can-replicate-their-dna-precisely-6524830
 */

(function () {
    if (typeof define !== 'function') {
        var define = require('amdefine')(module);
    }

    var hasExports = typeof module !== 'undefined' && module.exports;

    define(function (require) {

        var _ = require('lodash');
        var helicase = require('./enzymes/helicase');
        var primase = require('./enzymes/primase');
        var polymerase = require('./enzymes/polymerase');

        var muton = {

            /**
             * Given a list of user properties and feature instructions, it returns a collections of features toggles.
             *
             * @param userProperties A collection of user properties
             * @param featureInstructions A collection of feature instructions which can be organized as a hierarchy of properties.
             * @returns An collection of feature toggles that are toggled on or off
             */
            getFeatureMutations: function (userProperties, featureInstructions) {
                var features = {};

                // TODO - add properties and instructions structure validation

                _.forEach(featureInstructions, function (feature, featureName) {
                    // Helicase will break the user properties and features apart into two different chains
                    var propertyChains = helicase.breakProperties(userProperties, feature);

                    // Read the chains and return a primer object that will contain a set of instructions
                    var primer = primase.preparePrimer(userProperties, feature, propertyChains, true);

                    // Pick the primer, proof-read the instructions and then assemble the collection of feature toggles
                    var resolvedFeatures = polymerase.assembleFeatures(featureName, primer);
                    _.merge(features, resolvedFeatures);
                });

                return features;
            }
        };

        // Exports section
        if (hasExports) {
            // Export to NodeJS
            module.exports = muton;
        } else {
            // Export to AMD
            this.muton = muton;
        }
    });
}).call(this);
