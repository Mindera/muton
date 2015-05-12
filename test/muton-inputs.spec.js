'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var victim = require('../src/muton');

describe('When entering user properties and feature instructions', function () {

    it('should ignore null user properties', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var features = victim.getFeatureMutations(null, instructions);

        return expect(features).to.eventually.have.property('feature1').that.equals(true);
    });

    it('should ignore undefined user properties', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var features = victim.getFeatureMutations(undefined, instructions);

        return expect(features).to.have.eventually.property('feature1').that.equals(true);
    });

    it('should ignore empty user properties', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        return expect(features).to.have.eventually.property('feature1').that.equals(true);
    });

    it('should ignore invalid user properties', function () {

        var instructions = {
            feature1: {
                toggle: true
            }
        };

        var features = victim.getFeatureMutations([1, 2], instructions);

        return expect(features).to.have.eventually.property('feature1').that.equals(true);
    });

    it('should return empty on empty instructions', function () {

        var features = victim.getFeatureMutations({}, {});

        /*jshint -W030 */
        return expect(features).to.eventually.be.empty;
    });

    it('should return empty on undefined instructions', function () {

        var features = victim.getFeatureMutations({});

        /*jshint -W030 */
        return expect(features).to.eventually.be.empty;
    });

    it('should return empty on null instructions', function () {

        var features = victim.getFeatureMutations({}, null);

        /*jshint -W030 */
        return expect(features).to.eventually.be.empty;
    });

    it('should return empty on undefined arguments', function () {

        var features = victim.getFeatureMutations();

        /*jshint -W030 */
        return expect(features).to.eventually.be.empty;
    });

    it('should throw error on invalid feature instructions', function () {
        return expect(victim.getFeatureMutations.bind(victim, {}, [1, 2])).to.throw(Error);
    });
});