'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var victim = require('../src/muton');

describe('When using simple toggles instructions', function () {
    it('should return toggled features', function () {

        var instructions = {
            feature1: {
                toggle: true
            },
            feature2: {
                toggle: false
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
        expect(features).to.have.property('feature2').that.equals(false);
    });

    it('should toggled off features override other instructions', function () {

        var instructions = {
            feature1: {
                throttle: "100%",
                toggle: false
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should default to false', function () {

        var instructions = {
            feature1: {},
            feature2: {}
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
        expect(features).to.have.property('feature2').that.equals(false);
    });
});

describe('When using chained toggles instructions', function () {
    it('should ignore toggle when property is not matched', function () {

        var instructions = {
            feature1: {
                property1: {
                    toggle: true
                },
                property2: {
                    toggle: true
                }
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should match top level toggle when not matched', function () {

        var instructions = {
            feature1: {
                property1: {
                    toggle: false
                },
                property2: {
                    toggle: false
                },
                toggle: true
            }
        };

        var features = victim.getFeatureMutations({}, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('should match parent level toggle when not matched', function () {

        var instructions = {
            feature1: {
                property1: {
                    toggle: false,
                    "b": {
                        toggle: true
                    }
                },
                property2: {
                    "b": {
                        toggle: true
                    }
                },
                toggle: true
            }
        };

        var userProperties = {
            property1: "a"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should not ignore top level toggle when child is matched', function () {

        var instructions = {
            feature1: {
                property1: {
                    "b": {
                        toggle: true
                    }
                },
                toggle: false
            },
            feature2: {
                property2: {
                    "b": {
                        toggle: true
                    }
                }
            }
        };

        var userProperties = {
            property1: "b",
            property2: "b"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
        expect(features).to.have.property('feature2').that.equals(false);
    });

    it('should not match deep property when parent is not matched', function () {

        var instructions = {
            feature1: {
                property1: {
                    "a": {
                        property2: {
                            "b": {
                                toggle: false
                            }
                        }
                    }
                },
                toggle: true
            }
        };

        var userProperties = {
            property2: "b"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(true);
    });

    it('should match last property when multiple properties collide', function () {

        var instructions = {
            feature1: {
                toggle: true,
                property1: {
                    "b": {
                        toggle: true
                    }
                },
                property2: {
                    "b": {
                        toggle: false
                    }
                }
            }
        };

        var userProperties = {
            property1: "b",
            property2: "b"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should match multiple chained properties', function () {

        var instructions = {
            feature1: {
                property1: {
                    "b": {
                        property2: {
                            "c": {
                                toggle: false
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

        expect(features).to.have.property('feature1').that.equals(false);
    });

    it('should disable feature completely', function () {

        var instructions = {
            feature1: {
                toggle: false,
                property1: {
                    toggle: true,
                    "b": {
                        toggle: true,
                        property2: {
                            "c": {
                                toggle: true
                            }
                        }
                    }
                },
                property2: {
                    toggle: true
                }
            }
        };

        var userProperties = {
            property1: "b",
            property2: "c"
        };

        var features = victim.getFeatureMutations(userProperties, instructions);

        expect(features).to.have.property('feature1').that.equals(false);
    });
});