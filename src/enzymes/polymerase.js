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
var merge = require('lodash/merge');

var bucketMutator = require('../mutators/bucket');
var throttleMutator = require('../mutators/throttle');
var genePairing = require('../mutators/gene-pairing');
var proofReader = require('../reactions/proof-reading');

function addToFeatures(features, featureName, toggle) {
    return features.push(merge({ name: featureName }, toggle));
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
