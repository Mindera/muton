'use strict';

/**
 * This module contains multiple chemical reactions for use freely.
 */
var keys = require('lodash/object/keys');

module.exports = {
    separateProperties: function (userProperties, feature) {
        return {
            userPropertyNames: keys(userProperties),
            featurePropertyNames: keys(feature)
        };
    }
};
