'use strict';

/**
 * The Helicase enzyme in real life breaks the double helix and separates the DNA strands.
 * This module picks the user properties collection and the features collection and break them apart into two strands of
 * names.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function (require) {

    var chemicalReactions = require('./../reactions/chemical.js');

    return {
        /**
         * Returns an object containing two strands: one containing the user properties names and the other containing
         * the features names.
         *
         * @param userProperties a dictionary with user properties
         * @param feature a dictionary with features instructions
         * @returns An object that contains user property names and features names
         */
        breakProperties: function (userProperties, feature) {
            return chemicalReactions.separateProperties(userProperties, feature);
        }
    };
});
