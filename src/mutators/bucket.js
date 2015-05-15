'use strict';

/**
 * The Bucket mutator manipulates the features by introducing small random mutations by picking a random
 * bucket from the list, allowing multivariance testing.
 */
if (typeof define !== 'function') {
    /*jshint -W003*/
    var define = require('amdefine')(module);
}

define(function (require) {

    var _ = require('lodash');

    function pickOneElement(array) {
        if (!_.isArray(array)) {
            throw 'Not an array!';
        }

        var index = Math.floor(Math.random() * (array.length));
        return array[index];
    }

    return {
        mutate: function(featureProperties) {
            return pickOneElement(featureProperties.buckets);
        },

        containsMultivariant: function(featureProperties) {
            return this.isBucketListValid(featureProperties.buckets);
        },

        isBucketListValid: function(bucketList) {
            return _.isArray(bucketList) && bucketList.length >= 0;

        }
    };
});