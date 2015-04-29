'use strict';

if (typeof define !== 'function') {
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