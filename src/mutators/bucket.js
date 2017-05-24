'use strict';

/**
 * The Bucket mutator manipulates the features by introducing small random mutations by picking a random
 * bucket from the list, allowing multivariance testing.
 */
var isArray = require('lodash/isArray');
var isEmpty = require('lodash/isEmpty');
var includes = require('lodash/includes');

function pickOneElement(array) {
    if (!isArray(array)) {
        throw 'Not an array!';
    }

    var index = Math.floor(Math.random() * (array.length));
    return array[index];
}

function isBucketGene(gene) {
    return !isEmpty(gene) && gene.type === 'bucket';
}

function containsGene(featureProperties, gene) {
    return includes(featureProperties.buckets, gene.toggle);
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
        return isArray(bucketList) && bucketList.length >= 0;
    }
};
