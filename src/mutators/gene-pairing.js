'use strict';

if (typeof define !== 'function') {
    /*jshint -W003*/
    var define = require('amdefine')(module);
}

define(function (require) {

    var _ = require('lodash');

    function containTogglesPair(genes, featureName) {
        return _.has(genes.toggles, featureName);
    }

    function containBucketsPair(genes, featureName) {
        return _.contains(genes.buckets, featureName);
    }

    function containThrottlesPair(genes, featureName) {
        return _.contains(genes.throttles, featureName);
    }
    return {
        pairGene: function (genes, featureName) {
            var gene = {};
            if (containTogglesPair(genes, featureName)) {
                var type = 'toggle';
                if (containBucketsPair(genes, featureName)) {
                    type = 'bucket';
                } else if (containThrottlesPair(genes, featureName)) {
                    type = 'throttle';
                }

                gene['toggle'] = genes.toggles[featureName];
                gene['type'] = type;
            }
            return gene;
        }
    };
});