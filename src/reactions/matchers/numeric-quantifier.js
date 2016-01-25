'use strict';

var numberRegex = /-?\d+(\.\d{1,2})?/;
var operatorRegex = /[><]=?/;

var numericQuantifierRegex = new RegExp(operatorRegex.source + numberRegex.source);
var validExpressionRegex = new RegExp(numberRegex.source + operatorRegex.source + numberRegex.source);

function isExpressionValid(expression) {
    return validExpressionRegex.test(expression);
}

module.exports = {

    isNumber: function (value) {
        return numberRegex.test(value);
    },

    isNumericQuantifier: function (value) {
        return numericQuantifierRegex.test(value);
    },

    matchesPropertyValue: function(propertyValue, numericQuantifierStr) {
        var expression = propertyValue + numericQuantifierStr;

        if (!isExpressionValid(expression)) {
            // Just to catch eventual issues with eval
            return false;
        }

        /*jshint -W061*/
        return eval(expression);
    }
};
