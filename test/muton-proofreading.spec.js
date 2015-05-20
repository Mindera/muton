'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var victim = require('../src/muton');

describe('When proof reading instructions', function () {

    it('should toggle off when toggle instruction is invalid', function () {

        var instructions = {
            feature1: {
                toggle: 2,
                buckets: ['bucket1, bucket2', 'bucket3'],
                throttle: "100%"
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should toggle off when toggle alone instruction is invalid', function () {

        var instructions = {
            feature1: {
                toggle: 2
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should toggle off when bucket instruction is invalid', function () {

        var instructions = {
            feature1: {
                toggle: true,
                buckets: ""
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should toggle off when throttle instruction is invalid', function () {

        var instructions = {
            feature1: {
                toggle: true,
                buckets: [],
                throttle: "10"
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should toggle off when toggle instruction is invalid with properties', function () {

        var instructions = {
            feature1: {
                property1: {
                    'a': {
                        toggle: true,
                        throttle: "10"
                    }
                }
            }
        };

        var userProperties = {
            property1 : 'a'
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });
});