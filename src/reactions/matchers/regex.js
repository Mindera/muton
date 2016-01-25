'use strict';

var regexDelimiters = /^\/.+\/$/;

function sanitizeRegexStr(regexStr) {
    return regexStr.substring(1, regexStr.length - 1);
}

module.exports = {
    isRegex: function (value) {
        return regexDelimiters.test(value);
    },

    matchesPropertyValue: function(propertyValue, regexStr) {
        var sanitisedRegex = sanitizeRegexStr(regexStr);
        var regex = new RegExp('^' + sanitisedRegex + '$');
        return regex.test(propertyValue);
    }
};
