'use strict';

if (typeof define !== 'function') {
    /*jshint -W003*/
    var define = require('amdefine')(module);
}

define(function () {

    var regexDelimiters = /^\/.+\/$/;

    function sanitizeRegexStr(regexStr) {
        return regexStr.substring(1, regexStr.length - 1);
    }

    return {
        isRegex: function (value) {
            return regexDelimiters.test(value);
        },

        matchesPropertyValue: function(propertyValue, regexStr) {
            var sanitisedRegex = sanitizeRegexStr(regexStr);
            var regex = new RegExp('^' + sanitisedRegex + '$');
            return regex.test(propertyValue);
        }
    };
});