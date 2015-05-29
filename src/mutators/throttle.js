'use strict';

/**
 * The Throttle mutator manipulates the features by introducing small random mutations by randomly activate
 * or deactivate feture toggles.
 */
if (typeof define !== 'function') {
    /*jshint -W003*/
    var define = require('amdefine')(module);
}

define(function (require) {
    var _ = require('lodash');

    function getPercentageDecimal(throttle) {
        var percentage = extractPercentage(throttle);
        var value = percentage.substr(0, percentage.length - 2);
        return value / 10;
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

    function isThrottleValid(throttle) {
        return isThrottleNode(throttle) || isPercentage(throttle);
    }

    function isThrottleNode(throttle) {
        return _.isPlainObject(throttle) && _.isString(throttle['value']) && isPercentage(throttle['value']);
    }

    function isPercentage(value) {
        return !_.isUndefined(value) && _.isString(value) && value.match(/[0-100]%/);
    }

    function isThrottleGene(gene) {
        return !_.isEmpty(gene) && gene.type === 'throttle';
    }

    function shouldMutate(throttle) {
        return !_.isUndefined(throttle['mutate']) && throttle['mutate'] === 'force';
    }

    return {
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
});