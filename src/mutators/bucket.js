'use strict';

/**
 * The Bucket mutator manipulates the features by introducing small random mutations by picking a random
 * bucket from the list, allowing multivariance testing.
 */
var _ = require('lodash');

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
