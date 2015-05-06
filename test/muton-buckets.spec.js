'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var victim = require('../src/muton');
var sinon = require('sinon');

describe('When using bucket instructions', function () {

    /*jshint -W117 */
    before(function () {
        // Will always pick the first bucket
        sinon.stub(Math, 'random').returns(0);
    });

    it('should ignore on empty buckets', function () {

        var instructions = {
            feature1: {
                toggle: true,
                buckets: []
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('should override by toggle instructions', function () {

        var instructions = {
            feature1: {
                buckets: ['bucket1', 'bucket2'],
                toggle: false
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should override by throttle instructions', function () {

        var instructions = {
            feature1: {
                buckets: ['bucket1', 'bucket2'],
                throttle: '0%',
                toggle: true
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should add new toggles to the list of features', function () {
        var instructions = {
            feature1: {
                toggle: true,
                buckets: ['bucket1', 'bucket2']
            }
        };

        var features = victim.getFeatureMutations({}, instructions);
        expect(features).to.have.property('feature1.bucket1').that.equals(true);
    });

    it('should add new toggles to the list of features', function () {
        var instructions = {
            feature1: {
                toggle: true,
                buckets: ['bucket1', 'bucket2']
            }
        };

        var features = victim.getFeatureMutations({}, instructions);
        expect(features).to.have.property('feature1.bucket1').that.equals(true);
    });

    it('should not pick undefined', function () {
        var instructions = {
            feature1: {
                toggle: true,
                buckets: ['bucket1', 'bucket2']
            }
        };

        var i;
        for (i = 0; i < 10; i++) {
            var features = victim.getFeatureMutations({}, instructions);
            expect(features).to.not.have.property('feature1.undefined').that.equals(true);
        }
    });
});