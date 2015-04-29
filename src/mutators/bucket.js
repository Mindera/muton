'use strict';

if (typeof define !== 'function') {
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
    }
});