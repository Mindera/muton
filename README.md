Muton
=========

[![NPM version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/Mindera/muton.svg?branch=master)](https://travis-ci.org/Mindera/muton)

  This is the Muton project - a feature toggle tool with support for feature throttling and multivariance testing.
  
  You can engineer the genes of your application by meticulously choose what are the best features and create an organic result. With artificial manipulation, or even by random mutations, you will natural select the best version of your application.
  
    ___  ___      _              
    |  \/  |     | |             
    | .  . |_   _| |_ ___  _ __  
    | |\/| | | | | __/ _ \| '_ \ 
    | |  | | |_| | || (_) | | | |
    \_|  |_/\__,_|\__\___/|_| |_|
    
    O       o O       o O       o
    | O   o | | O   o | | O   o |
    | | O | | | | O | | | | O | |
    | o   O | | o   O | | o   O |
    o       O o       O o       O
    
  
  In real life, cells replicate DNA using an enzyme called polymerase. During the process, it checks for replication errors doing proof-reading on the fly. But sometimes a random mutation occur... that's life trying to evolve. This tool works in a similar way: random mutations may occur while processing the instructions to toggle features on and off. That's your application trying to evolve.

## Installation

### NPM

  npm install muton --save

### Bower

  bower install muton --save

## Usage

  Muton just decides what features to mutate, activate or deactivate and it doesn't store the features anywhere. You should integrate Muton with code that persists the features per user, like using cookies or other mechanism you prefer.

### Basic usage

  Currently, you can use Muton as a Node module or an AMD module. To include as an AMD module, please require the `muton-amd.min.js` file.
    
  You can use in the following way:
  
```javascript
var features = muton.getMutations(userProperties, featureInstructions);
```

Where `userProperties` is a dictionary containing user properties, something like this:

```javascript
var userProperties = {
  'location' : 'PT',
  'age' : '24'
}
```

And where `featureInstructions` is a dictionary of features containing specific instructions, which must follow a specific format. It can be something like this:
 
```javascript
var featureInstructions = {
  'superCoolFeature' : {
    'toggle' : true,
    'location' : {
      'PT' : {
        'toggle' : true
      },
      'FR' : {
        'toggle' : false
      }
    }
  }
}
```

A Muton valid response would be:

```javascript
var featureInstructions = {
  'toggles': {
    'superCoolFeature' : true,
    'anotherCoolFeature' : false
  }
``` 

### Instructions format

  The instructions must contain one of the following elements: `toggle`, `throttle` and `bucket` and they can be placed behind every property inside the feature object, and even placed directly under the feature object. Muton will look for a path in the instructions and aggregate all of them that matches the user properties. When no matches are found, it will assume the general instructions.
  
#### Toggle

  The `toggle` instruction activates or deactivates toggles. The default value is false and can be overridden by the `throttle` and `bucket` instructions. The exception to this is when the `toggle` instruction is placed directly under the feature object and it's value is set to false. This allows to deactivate a feature completely.
  
#### Throttle

  The `throttle` instruction will activate or deactivate a toggle based on a percentage. In Muton terms, this is called a mutation. For example, you might want to have 50% of your users to have access to a feature and this instruction is perfect for that.
  
  For example, if you want to have 50% of your Portugal users to see a feature but 100% of the users of the remaining countries to see it (except for France), you could do something like:
  
```javascript
var featureInstructions = {
  'superCoolFeature' : {
    'toggle' : true,
    'location' : {
      'PT' : {
        'throttle' : '50%'
      },
      'FR' : {
        'toggle' : false
      }
    }
  }
}
```
A valid response for a portuguese user could be:

```javascript
var featureInstructions = {
  'toggles' : {
    'superCoolFeature' : true,
  },
  'throttles': ['superCoolFeature']
}
```

#### Buckets (A/B testing, multivariant testing)

  The `bucket` instruction is perfect for A/B testing and it resources to mutations like the `throttle` instruction. This instruction can be written like the following:
  
```javascript
var featureInstructions = {
  'superCoolFeature' : {
    'toggle' : true,
    'location' : {
      'PT' : {
        'throttle' : '50%'
      },
      'FR' : {
        'buckets' : ['bigRedButton', 'mediumSizeButton', 'smallButton']
      }
    }
  }
}
```
 
 The above snippet would allow you to have your France users to access three different buckets for testing, let's say, three different buttons on a form and test which of them your users react best.
 
 A valid response for a french user could be:
 
```javascript
var featureInstructions = {
  'toggles' : {
    'superCoolFeature' : true,
    'superCoolFeature.smallButton' : true
  },
  'buckets': ['superCoolFeature.smallButton']
}
```

### Matchers

  Muton supports non-trivial user properties matching. For example, you might want to toggle a feature on when the user bought over 10000 books in your store. Or even to activate a feature for users whose referral site belongs to a specific domain.

#### Regular expressions

  To have user properties being matched by regexes, you must enclose the regex inside two '/'. The above example referral example with Google can be written like this:

```javascript
  var featureInstructions = {
    'superCoolFeature' : {
      'referral' : {
        '/.*\.google\..{2,4}/' : {
          'toggle' : 'true'
        }
      }
    }
  }
```

#### Numeric quantifiers

  Numeric user properties can be matched against an expression. The property value must start with one of the following operators: '>', '<', '>=', '<='.
  
  Picking the bookstore example, a user with over 10000 bought books would have a special feature toggle on:
  
```javascript
  var featureInstructions = {
    'superCoolFeature' : {
      'boughtBooks' : {
        '>=10000' : {
          'toggle' : 'true'
        }
      }
    }
  }
```

### Gene inheritance

  To inherit properties from previous mutations, you can use gene inheritance. This is useful when you want to maintain the same users on the same buckets or throttles to guarantee consistency in your features when the context changes.
  This is only applied to instructions that are subject to mutations, namely 'buckets' and 'throttles'. Inherited mutations from ancestors will only work when the new instructions and ancestor genes have the same kind of mutations (e.g.: Ancestor and predecessor have a throttle on the same feature). For plain toggles, ancestor genes will be ignored.
  
#### Throttle inheritance 
    
  For example, to inherit throttles, one could pass a set of instructions and a set of ancestor genes:
  
```javascript
  var featureInstructions = {
    'superCoolFeature' : {
      'toggle' : true,
      'location' : {
        'PT' : {
          'throttle' : '50%'
        }
      }
    }
  }
```
  You can use a previous Muton output to feed new mutations and inherit mutations from ancestors. The default behaviour is to inherit previous throttles. In the bellow example, Muton will always return true for the 'superCoolFeature' throttle, because the previous throttle was enabled.

```javascript
  var ancestorGenes = {
      'toggles' : {
          'superCoolFeature' : true
      },
      'throttles' : ['superCoolFeature']
  };
```
  If you choose to force mutations when inheriting throttles on a specific context, you can create a throttle object instead of a percentage and pass a 'mutate' property and ignore the ancestor gene. You must specify it in the instructions:
  
```javascript
  var featureInstructions = {
    'superCoolFeature' : {
      'toggle' : true,
      'location' : {
        'PT' : {
          'throttle' : '50%',
          'mutate': 'force'
        }
      }
    }
  }
```

#### Bucket inheritance

  To inherit buckets, you can pass a set of ancestor genes to Muton containing buckets:
  
```javascript
  var featureInstructions = {
    'superCoolFeature' : {
      'toggle' : true,
      'location' : {
        'PT' : {
          'buckets' : ['bigRedButton', 'mediumSizeButton', 'smallButton']
        }
      }
    }
  }
```

  The ancestor genes (a previous Muton output) could be passed to Muton and the predecessor will inherit the ancestor bucket. However, if the ancestor gene contains a bucket that is not defined in the predecessor instructions, then a bucket mutation will occur and a random bucket from the instructions will be picked up.
  
```javascript
  var ancestorGenes = {
      'toggles' : {
          'superCoolFeature.bigRedButton' : true
      },
      'buckets' : ['superCoolFeature.bigRedButton']
  };
```

## Build
  
  grunt clean && grunt

## Tests

  npm test
  
## Future work

  * Support other exports besides Node and AMD
  * Adding support for pattern matching inside the feature properties

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

  * 0.0.1
    - Initial release
  * 0.0.2
    - Fixing bucket choice bug
  * 0.1.0
    - Adding support for regex and numeric matchers
    - Adding support for gene inheritance

[npm-url]: https://npmjs.org/package/muton
[npm-image]: https://badge.fury.io/js/muton.svg
