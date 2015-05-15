'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var victim = require('../src/muton');

describe('When using special property matchers', function () {

    it('it should support regular expressions', function () {

        var instructions = {
            feature1: {
                property1: {
                    "/www\\.google\\..*/" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "www.google.com"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should throw SyntaxError with invalid regular expression', function () {

        var instructions = {
            feature1: {
                property1: {
                    "/www\\.google\\.(.*/" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "www.google.com"
        };

        expect(victim.getFeatureMutations.bind(victim, userProperties, instructions)).to.throw(SyntaxError);
    });

    it('it should ignore regex expression without ending delimiter', function () {

        var instructions = {
            feature1: {
                property1: {
                    "/www\\.google\\..*" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "www.google.com"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('it should ignore regex expression without starting delimiter', function () {

        var instructions = {
            feature1: {
                property1: {
                    "www\\.google\\..*/" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "www.google.com"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('it should match number greater than a value', function () {

        var instructions = {
            feature1: {
                property1: {
                    ">10" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "11"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should match number greater than or equal to a value', function () {

        var instructions = {
            feature1: {
                property1: {
                    ">=10" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "10"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should match number equal to a value', function () {

        var instructions = {
            feature1: {
                property1: {
                    "10" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "10"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should match number lesser than a value', function () {

        var instructions = {
            feature1: {
                property1: {
                    "<10" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "9"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should match number lesser than or equal to a value', function () {

        var instructions = {
            feature1: {
                property1: {
                    "<=10" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "10"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should match negative numbers', function () {

        var instructions = {
            feature1: {
                property1: {
                    "<=-10" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "-11"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should match double numbers', function () {

        var instructions = {
            feature1: {
                property1: {
                    "<=10.0" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "9.0"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('it should ignore invalid numeric comparisons', function () {

        var instructions = {
            feature1: {
                property1: {
                    "<=10.0" : {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "a"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });
});