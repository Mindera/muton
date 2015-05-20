'use strict';

/**
 * This module match-reads feature properties against user properties.
 */
if (typeof define !== 'function') {
    /*jshint -W003*/
    var define = require('amdefine')(module);
}

define(function (require) {

    var _ = require('lodash');
    var regexMatcher = require('./matchers/regex');
    var numericMatcher = require('./matchers/numeric-quantifier');

    var defaultMatcher = {
        matchesPropertyValue: function(userPropertyValue, propertyKey) {
            return userPropertyValue === propertyKey;
        }
    };

    function pickMatcher(userPropertyValue, propertyKey) {
        if (regexMatcher.isRegex(propertyKey)) {
            return regexMatcher;
        } else if (numericMatcher.isNumber(userPropertyValue) &&
            numericMatcher.isNumericQuantifier(propertyKey)) {
            return numericMatcher;
        } else {
            return defaultMatcher;
        }
    }

    return {
        getMatchedProperties: function(userPropertyValue, featureProperty) {
            return _.findLast(featureProperty, function (propertyValue, propertyKey) {
                var matcher = pickMatcher(userPropertyValue, propertyKey);
                return matcher.matchesPropertyValue(userPropertyValue, propertyKey);
            });
        }
    };
});