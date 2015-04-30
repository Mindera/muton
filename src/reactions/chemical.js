'use strict';

/**
 * This module contains multiple chemical reactions for use freely.
 */
if (typeof define !== 'function') {
    /*jshint -W003*/
    var define = require('amdefine')(module);
}

define(function (require) {

    var _ = require('lodash');

    return {
        separateProperties: function (userProperties, feature) {
            return {
                userPropertyNames: _.keys(userProperties),
                featurePropertyNames: _.keys(feature)
            };
        }
    };
});