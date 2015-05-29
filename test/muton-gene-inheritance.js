'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var victim = require('../src/muton');

describe('When inheriting genes from previous features', function () {

    it('should work without ancestor genes', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var features = victim.inheritMutations({}, instructions, {});

        expect(features.toggles).to.have.property('feature1').that.equals(true);
    });

    it('should not inherit standard toggles from ancestor', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1' : false
            }
        };

        var features = victim.inheritMutations({}, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1').that.equals(true);
    });

    it('should not cross plain toggle gene with throttle gene ', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1' : false
            },
            'throttles' : ['feature1']
        };

        var features = victim.inheritMutations({}, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1').that.equals(true);
    });

    it('should not cross plain toggle gene with bucket gene', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1.bucket1' : false
            },
            'buckets' : ['feature1.bucket1']
        };

        var features = victim.inheritMutations({}, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1').that.equals(true);
    });

    it('should transmit throttle genes to child when properties match', function () {

        var userProperties = {
            'location' : 'PT'
        };

        var instructions = {
            feature1: {
                location: {
                    'PT': {
                        throttle: '0%'
                    }
                }
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1' : true
            },
            'throttles' : ['feature1']
        };

        var features = victim.inheritMutations(userProperties, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1').that.equals(true);
    });

    it('should transmit throttle genes to child as default behaviour', function () {

        var instructions = {
            feature1: {
                throttle: '0%'
            },
            feature2 : {
                throttle: '100%'
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1' : true,
                'feature2' : false
            },
            'throttles' : ['feature1', 'feature2']
        };

        var features = victim.inheritMutations({}, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1').that.equals(true);
        expect(features.toggles).to.have.property('feature2').that.equals(false);
    });

    it('should not transmit throttle genes when forcing mutation', function () {

        var instructions = {
            feature1 : {
                throttle: {
                    value: '100%',
                    mutate: 'force' // default is 'inherit'
                }
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1' : false
            },
            'throttles' : ['feature1']
        };

        var features = victim.inheritMutations({}, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1').that.equals(true);
    });

    it('should transmit bucket genes to child', function () {

        var instructions = {
            feature1: {
                toggle: true,
                buckets: ['bucket1', 'bucket2']
            },
            feature2 : {
                toggle: true,
                buckets: ['bucket1', 'bucket2']
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1.bucket2' : true,
                'feature2.bucket2' : true
            },
            'buckets' : ['feature1.bucket2', 'feature2.bucket2']
        };

        var features = victim.inheritMutations({}, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1.bucket2').that.equals(true);
        expect(features.toggles).to.have.property('feature2.bucket2').that.equals(true);
    });

    it('should mutate bucket when ancestor gene is not available in child', function () {

        var instructions = {
            feature1: {
                toggle: true,
                buckets: ['bucket1', 'bucket2']
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1.bucket3' : true
            },
            'buckets' : ['feature1.bucket3']
        };

        var features = victim.inheritMutations({}, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1.bucket1').that.equals(true);
    });

    it('should transmit bucket genes to child when properties match', function () {

        var userProperties = {
            'location' : 'PT'
        };

        var instructions = {
            feature1: {
                toggle: true,
                location: {
                    'PT': {
                        buckets: ['bucket1', 'bucket2', 'bucket3']
                    }
                }
            }
        };

        var ancestorGenes = {
            'toggles' : {
                'feature1.bucket3' : true
            },
            'buckets' : ['feature1.bucket3']
        };

        var features = victim.inheritMutations(userProperties, instructions, ancestorGenes);

        expect(features.toggles).to.have.property('feature1.bucket3').that.equals(true);
    });
});