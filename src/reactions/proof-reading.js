'use strict';

/**
 * This module checks for errors and proof-reads the molecules.
 */
var get = require('lodash/object/get');
var isUndefined = require('lodash/lang/isUndefined');
var isBoolean = require('lodash/lang/isBoolean');
var isNull = require('lodash/lang/isNull');
var isArray = require('lodash/lang/isArray');
var isObject = require('lodash/lang/isObject');

var bucketMutator = require('../mutators/bucket');
var throttleMutator = require('../mutators/throttle');

module.exports = {
    areInstructionsValid: function (featureInstructions) {
        var toggle = get(featureInstructions, 'toggle');
        var throttle = get(featureInstructions, 'throttle');
        var buckets = get(featureInstructions, 'buckets');

        return this.isToggleValid(toggle) && this.isThrottleValid(throttle) && this.areBucketsValid(buckets);
    },

    isToggleValid: function (toggle) {
        return isUndefined(toggle) || isBoolean(toggle);
    },

    isThrottleValid: function(throttle) {
        return isUndefined(throttle) || throttleMutator.isThrottleValid(throttle);
    },

    areBucketsValid: function(buckets) {
        return isUndefined(buckets) || bucketMutator.isBucketListValid(buckets);
    },

    checkFeatureInstructions: function (featureInstructions) {
        var valid = isUndefined(featureInstructions) || isNull(featureInstructions) || !isArray(featureInstructions) && isObject(featureInstructions);

        if (!valid) {
            throw new Error('Invalid feature instructions!');
        }
    }
};
