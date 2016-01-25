'use strict';

/**
 * The Throttle mutator manipulates the features by introducing small random mutations by randomly activate
 * or deactivate feture toggles.
 */

var _ = require('lodash');

function isPercentage(value) {
    return !_.isUndefined(value) && _.isString(value) && value.match(/[0-100]%/);
}

function isThrottleNode(throttle) {
    return _.isPlainObject(throttle) && _.isString(throttle['value']) && isPercentage(throttle['value']);
}

function extractPercentage(throttle) {
    var percentage;
    if (isThrottleNode(throttle)) {
        percentage = throttle['value'];
    } else {
        percentage = throttle;
    }
    return percentage;
}

function getPercentageDecimal(throttle) {
    var percentage = extractPercentage(throttle);
    var value = percentage.substr(0, percentage.length - 2);
    return value / 10;
}

function isThrottleValid(throttle) {
    return isThrottleNode(throttle) || isPercentage(throttle);
}

function isThrottleGene(gene) {
    return !_.isEmpty(gene) && gene.type === 'throttle';
}

function shouldMutate(throttle) {
    return !_.isUndefined(throttle['mutate']) && throttle['mutate'] === 'force';
}

module.exports = {
    mutate: function (throttle, gene) {
        if (!shouldMutate(throttle) && isThrottleGene(gene)) {
            return gene.toggle;
        } else {
            var percentage = getPercentageDecimal(throttle);
            return Math.random() < percentage;
        }
    },

    isThrottleValid: function (throttle) {
        return isThrottleValid(throttle);
    }
};
