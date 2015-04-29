'use strict';

if (typeof define !== 'function') {
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