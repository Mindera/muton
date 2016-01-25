'use strict';

var _ = require('lodash');

function findWithPartialName(featureNames, partialName) {
    return _.filter(featureNames, function (featureName) {
        return featureName.indexOf(partialName) === 0;
    });
}

function hasPartialName(featureNames, partialName) {
    return findWithPartialName(featureNames, partialName).length > 0;
}

function containTogglesPair(genes, featureName) {
    return hasPartialName(_.keys(genes.toggles), featureName);
}

function containBucketsPair(genes, featureName) {
    return hasPartialName(genes.buckets, featureName);
}

function containThrottlesPair(genes, featureName) {
    return hasPartialName(genes.throttles, featureName);
}

function getBucketNameFromFeatureName(featureName) {
    var dotIndex = featureName.indexOf('.');
    return dotIndex >= 0 ? featureName.substring(dotIndex + 1) : '';
}

function getMatchingBucket(genes, featureName) {
    var matchedFeatures = findWithPartialName(genes.buckets, featureName);
    var matched = _.find(matchedFeatures, function (matchedBucket) {
            return genes.toggles[matchedBucket];
        });
    return _.isString(matched) ? getBucketNameFromFeatureName(matched) : '';
}

module.exports = {
    pairGene: function (genes, featureName) {
        var gene = {};
        if (containTogglesPair(genes, featureName)) {
            var type = 'toggle';
            var name = genes.toggles[featureName];
            if (containBucketsPair(genes, featureName)) {
                type = 'bucket';
                name = getMatchingBucket(genes, featureName);
            } else if (containThrottlesPair(genes, featureName)) {
                type = 'throttle';
            }

            gene['toggle'] = name;
            gene['type'] = type;
        }
        return gene;
    }
};
