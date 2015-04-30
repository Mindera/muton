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

    return {
        mutate: function(featureProperties) {
            return this.pickOneElement(featureProperties.buckets);
        },

        containsMultivariant: function(featureProperties) {
            return this.isBucketListValid(featureProperties.buckets);
        },

        isBucketListValid: function(bucketList) {
            return _.isArray(bucketList) && bucketList.length >= 0;

        },

        pickOneElement: function(array) {
            if (!_.isArray(array)) {
                throw 'Not an array!';
            }

            var index = Math.floor(Math.random() * (array.length + 1));
            return array[index];
        }
    };
});