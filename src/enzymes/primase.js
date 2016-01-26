'use strict';

/**
 * The Primase enzyme in real life prepares the strand for the replication, this is called the primer.
 * This module takes the user properties and feature properties strands, analyses it and returns a primer object
 * containing instructions regarding the features to activate or deactivate.
 */
var get = require('lodash/object/get');
var pick = require('lodash/object/pick');
var merge = require('lodash/object/merge');
var has = require('lodash/object/has');
var isUndefined = require('lodash/lang/isUndefined');
var contains = require('lodash/collection/contains');

var chemicalReactions = require('../reactions/chemical.js');
var matchReading = require('../reactions/match-reading.js');

function getFeatureProperties(feature) {
    return pick(feature, ['toggle', 'throttle', 'buckets']);
}

function mergeProperties(primer, feature) {
    var properties = getFeatureProperties(feature);
    merge(primer, properties);
}

function isFeatureDisabled(primer, root) {
    var toggle = get(primer, 'toggle');
    return root && toggle === false;
}

function containsFeatureProperties(obj) {
    return has(obj, 'toggle') || has(obj, 'throttle') || has(obj, 'buckets');
}

function pickMatchedProperties(childProperties, parentProperties) {
    return !isUndefined(childProperties) ? childProperties : parentProperties;
}

function getPropertiesNode(userProperties, featurePropertyName, feature) {
    // Explode the current node to check if there are properties
    var featureProperty = feature[featurePropertyName];

    var userPropertyValue = userProperties[featurePropertyName];
    var properties = matchReading.getMatchedProperties(userPropertyValue, featureProperty);

    return pickMatchedProperties(properties, featureProperty);
}

function bindPrimer(primerInstructions, childPrimer) {
    merge(primerInstructions, childPrimer);
}

module.exports = {
    /**
     * Returns a primer collection containing instructions to toggle on or off a feature,
     * matched against the user properties.
     *
     * @param userProperties The user properties to match the features
     * @param feature The feature being processed
     * @param propertyStrands An object with the strands containing user and features properties names
     * @param root A flag to indicate if the features tree is being processed in the root
     * @returns A collection of primer instructions matched against the user properties
     */
    preparePrimer: function(userProperties, feature, propertyStrands, root) {
        var self = this;
        var primerInstructions = {};

        var userPropertyNames = propertyStrands.userPropertyNames;
        var featurePropertyNames = propertyStrands.featurePropertyNames;

        // If are feature properties on the current node, it merges with the final result
        if (containsFeatureProperties(feature)) {
            mergeProperties(primerInstructions, feature);
        }

        if (!isFeatureDisabled(primerInstructions, root)) {
            featurePropertyNames.forEach(function (featurePropertyName) {
                if (contains(userPropertyNames, featurePropertyName)) {
                    var propertiesNode = getPropertiesNode(userProperties, featurePropertyName, feature);
                    // Process the child node
                    var childStrands = chemicalReactions.separateProperties(userProperties, propertiesNode);
                    var childPrimer = self.preparePrimer(userProperties, propertiesNode, childStrands);

                    bindPrimer(primerInstructions, childPrimer);
                }
            });
        }

        return primerInstructions;
    }
};
