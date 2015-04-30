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

    return {
        mutate: function (throttle) {
            var percentage = this.getPercentageDecimal(throttle);
            return Math.random() < percentage;
        },

        isThrottleValid: function (throttle) {
            return !_.isUndefined(throttle) && this.isPercentage(throttle);
        },

        isPercentage: function (value) {
            return value.match(/[0-100]%/);
        },

        getPercentageDecimal: function (percentage) {
            var value = percentage.substr(0, percentage.length - 2);
            return value / 10;
        }
    };
});