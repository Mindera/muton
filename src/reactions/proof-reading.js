'use strict';

/**
 * This module checks for errors and proof-reads the molecules.
 */
if (typeof define !== 'function') {
    /*jshint -W003*/
    var define = require('amdefine')(module);
}

define(function (require) {

    var _ = require('lodash');
    var bucketMutator = require('../mutators/bucket');
    var throttleMutator = require('../mutators/throttle');

    return {
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
});
