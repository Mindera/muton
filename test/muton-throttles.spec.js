'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var victim = require('../src/muton');

describe('When using throttle instructions', function () {
    it('should have the ability to throttle on', function () {

        var instructions = {
            feature1: {
                throttle: '100%'
            },
            feature2: {
                throttle: '0%'
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        return expect(features).to.eventually.have.property('feature1').that.equals(true);
    });

    it('should have the ability to throttle off', function () {

        var instructions = {
            feature1: {
                throttle: '100%'
            },
            feature2: {
                throttle: '0%'
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        return expect(features).to.eventually.have.property('feature2').that.equals(false);
    });

    xit('should throttle based on percentage', function () {
        var instructions = {
            feature1: {
                throttle: '10%'
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.eventually.have.property('feature1').that.equals(true);
    });

    it('should not override toggle instruction', function () {

        var instructions = {
            feature1: {
                toggle: false,
                throttle: '100%'
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        return expect(features).to.eventually.have.property('feature1').that.equals(false);
    });

    it('should throttle with deep properties', function () {

        var instructions = {
            feature1: {
                property1 : {
                    "b": {
                        property2: {
                            "c": {
                                throttle: '0%'
                            }
                        }
                    }
                }
            }
        };

        var userProperties = {
            property1: "b",
            property2: "c"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        return expect(features).to.eventually.have.property('feature1').that.equals(false);
    });

    it('should return top level toggle when not matched', function () {

        var instructions = {
            feature1: {
                toggle: true,
                property1 : {
                    "b": {
                        property2: {
                            "c": {
                                throttle: '0%'
                            }
                        }
                    }
                }
            }
        };

        var userProperties = {
            property1: "c",
            property2: "b"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        return expect(features).to.eventually.have.property('feature1').that.equals(true);
    });

    it('should not throttle with partial matching', function () {

        var instructions = {
            feature1: {
                toggle: true,
                property1 : {
                    "b": {
                        throttle: '0%',
                        property2: {
                            "c": {
                                throttle: '100%'
                            }
                        }
                    }
                }
            }
        };

        var userProperties = {
            property1: "b",
            property2: "b"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        return expect(features).to.eventually.have.property('feature1').that.equals(false);
    });

    it('should throttle off override other instructions', function () {

        var instructions = {
            feature1: {
                toggle: true,
                throttle: "0%"
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        return expect(features).to.eventually.have.property('feature1').that.equals(false);
    });
});