'use strict';

/**
 * This module contains multiple chemical reactions for use freely.
 */

var _ = require('lodash');

module.exports = {
    separateProperties: function (userProperties, feature) {
        return {
            userPropertyNames: _.keys(userProperties),
            featurePropertyNames: _.keys(feature)
        };
    }
};
