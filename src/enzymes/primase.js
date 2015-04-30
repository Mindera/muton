'use strict';

/**
 * The Primase enzyme in real life prepares the strand for the replication, this is called the primer.
 * This module takes the user properties and feature properties strands, analyses it and returns a primer object
 * containing instructions regarding the features to activate or deactivate.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function (require) {
    var _ = require('lodash');
    var chemicalReactions = require('./../reactions/chemical.js');

    return {
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
                    if (_.contains(userPropertyNames, featurePropertyName)) {
                        var propertiesNode = getPropertiesNode(userProperties, featurePropertyName, feature);
                        // Process the child node
                        var childStrands = chemicalReactions.separateProperties(userProperties, propertiesNode);
                        var childPrimer = self.preparePrimer(userProperties, propertiesNode, childStrands);
                        _.merge(primerInstructions, childPrimer);
                    }
                });
            }

            return primerInstructions;
        }
    };

    function mergeProperties(primer, feature) {
        var properties = getFeatureProperties(feature);
        _.merge(primer, properties);
    }

    function isFeatureDisabled(primer, root) {
        var toggle = _.get(primer, 'toggle');
        return root && (_.isUndefined(toggle) || toggle === false);
    }

    function getFeatureProperties(feature) {
        return _.pick(feature, ['toggle', 'throttle', 'buckets']);
    }

    function containsFeatureProperties(obj) {
        return _.has(obj, 'toggle') || _.has(obj, 'throttle') || _.has(obj, 'buckets');
    }

    function getPropertiesNode(userProperties, featurePropertyName, feature) {
        var propertyName = featurePropertyName;
        // Explode the current node to check if there are properties
        var featureProperty = feature[propertyName];
        var properties = featureProperty[userProperties[propertyName]];
        return pickMatchedProperties(properties, featureProperty);
    }

    function pickMatchedProperties(childProperties, parentProperties) {
        return !_.isUndefined(childProperties) ? childProperties : parentProperties;
    }
});