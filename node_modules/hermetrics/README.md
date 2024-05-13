![](https://res.cloudinary.com/dlacw28m9/image/upload/v1583255567/hermetrics.js_wmbdhh.png)


Javascript library for distance and similarity metrics. Javascript translation from [hermetrics.py](https://github.com/kampamocha/hermetrics).

![Build Status](https://travis-ci.com/weylermaldonado/hermetricsjs.svg?branch=master)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/03f72b3394744c8bb5a874d4b1156350)](https://app.codacy.com/manual/weylermaldonado/hermetricsjs?utm_source=github.com&utm_medium=referral&utm_content=weylermaldonado/hermetricsjs&utm_campaign=Badge_Grade_Dashboard)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


# Content

* [Installation](#installation)
* [Usage](#usage)
* [Metrics](#metrics)
  * [Levenshtein](#levenshtein)
  * [Jaro](#jaro)
  * [Jaro-Winkler](#jaro-winkler)
  * [Jaccard](#jaccard)
  * [Metric comparator](#mc)
  * [Hamming](#hamming)
  * [Damerau-Levenshtein](#dl)
  * [Dice](#dice)
  * [OSA](#osa)

# Installation <a name="installation"></a>

From npm

```bash
$ npm i hermetrics --save
```


# Usage <a name="usage"></a>

Require the package and import the desired class:
```javascript
const { Levenshtein } = require('hermetrics');

const levenshtein = new Levenshtein();

levenshtein.distance('start', 'end');
levenshtein.maxDistance('start', 'end');
```

Using [custom](#custom) operation costs:

```javascript
const { Levenshtein } = require('hermetrics');

const levenshtein = new Levenshtein();

const opts = {
  deletionCost: 3,
  insertionCost: 5,
  substitutionCost: 2
};

levenshtein.distance('start', 'end', opts);
levenshtein.maxDistance('start', 'end', opts);
```

# Metrics <a name="metrics"></a>

## Overview

Hermetrics is a library designed for use in experimentation with string metrics. The library features a base class Metric which is highly configurable and can be used to implement custom metrics.

Based on Metric are some common string metrics already implemented to compute the distance between two strings. Some common edit distance metrics such as Levenshtein can be parametrized with different costs for each edit operation, althought have been only thoroughly tested with costs equal to 1. Also, the implemented metrics can be used to compare any iterable in addition to strings, but more tests are needed.

A metric has three main methods: distance, normalizeDistance and similarity. In general the distance method computes the absolute distance between two strings, whereas normalizeDistance can be used to scale the distance to a particular range, usually (0,1), and the similarity method being normally defined as (1-normalizeDistance).

The normalization of the distance can be customized overriding the auxiliary methods for its computation. Those methods are maxDistance, minDistance and normalize.

## *Metric* class

Metric is a base class that contains six specific functions to be used as methods for the metric being implemented. 

If you want customize any function, for now, there are two available ways:

You could modify the class `prototype` 

``` javascript
const { Levenshtein } = require('hermetrics');

function foo() {
  console.log('foo');
}

Levenshtein.prototype.distance = foo;

// or

Levenshtein.prototype.distance = function() {
  console.log('foo');
}


const levenshtein = new Levenshtein();

levenshtein.distance() // foo
```

You could extend the `Metric` base class

```javascript
const { Metric } = require('hermetrics');

class MyAwesomeMetric extends Metric {

  constructor(name = 'MyAwesomeMetric') {
    super(name);
  }

  distance() {
    console.log('bar');
  }
}

const myAwesomeMetric = new MyAwesomeMetric();

myAwesomeMetric.distance(); //bar


```

## Default methods <a name="custom"></a>

Description of default methods for the Metric class.

In general a method of a metric receives three parameters:

- *source:* The source string or iterable to compare.
- *target:* The target string or iterable to compare.
- *costs:* An *optional* object that contains the insertion, deletion and substitution custom value. By default the value is **1**.

|Method | Description |
|--------|-------------|
|Distance| The distance method computes the total cost of transforming the source string on the target string. The default method just return 0 if the strings are equal and 1 otherwise.|
|maxDistance| Returns the maximum value of the distance between source and target given a specific cost for edit operations. The default method just return 1 given source and target don't have both length=0, in that case just return 0. |
|minDistance| Return 0.|
| normalize | This method is used to scale a value between two limits, usually those obtained by maxDistance and minDistance, to the (0,1) range. Unlike the other methods, normalize doesn't receive the usual arguments (source, target and cost), instead receive the following: x. The value to be normalized. low=0. The minimum value for the normalization, usually obtained with minDistance method. high=1. The maximum value for the normalization, usually obtained with maxDistance method. |
| normalize distance | Scale the distance between source and target for specific cost to the (0,1) range using maxDistance, minDistance and normalize. | 
| similarity | Computes how similar are source and target given a specific cost. By default defined as 1 - normalizedDistance so the result is also in the (0,1) range. |

## Levenshtein metric  <a name="levenshtein"></a>
Levenshtein distance is usually known as "the" edit distance. It is defined as the minimum number of edit operations (deletion, insertion and substitution) to transform the source string into the target string. The algorithm for distance computation is implemented using the dynamic programming approach with the full matrix construction, althought there are optimizations for time and space complexity those are not implemented here.

## Jaro metric <a name="jaro"></a>
Jaro distance is based on the matching characters present on two strings and the number of transpositions between them. A matching occurs when a character of a string is present on the other string but in a position no further away that certain threshold based on the lenght of the strings. The Jaro distance is normalized.

## Jaro-Winkler <a name="jaro-winkler"></a>
Extension of Jaro distance with emphasis on the first characters of the strings, so strings that have matching characters on the beginning have more similarity than those that have matching characters at the end. This metric depends on an additional parameter p (with 0<=p<=0.25 and default p=0.1) that is a weighting factor for additional score obtained for matching characters at the beginning of the strings..

## Jaccard <a name="jaccard"></a>
The Jaccard index considers the strings as a bag-of-characters set and computes the cardinality of the intersection over the cardinality of the union. The distance function for Jaccard index is already normalized.


## Metric comparador <a name="mc"></a>
This is a class useful to compare the result of various metrics when applied on the same strings. For example, to see the difference between OSA and Damerau-Levenshtein you can pass those two metrics on a list to a MetricComparator instance and compute the similarity between the same two strings.

By default the MetricComparator class use the 8 metrics implemented on the library, so you can compare all of them on the same two strings. Currently the similarity is the only measure implemented on the class.

## Hamming <a name="hamming"></a>
The Hamming distance count the positions where two strings differ. Normally the Hamming distance is only defined for strings of equal size but in this implementation strings of different size can be compared counting the difference in size as part of the distance.

## Damerau-Levenshtein <a name="dl"></a>
The Damerau-Levenshtein distance is like OSA but without the restriction on the number of transpositions for the same substring.

## Dice (Sorenson-Dice) <a name="dice"></a>
Is related to Jaccard index in the following manner:

![](https://camo.githubusercontent.com/6f6c1b8e56a22ecf6b762a72e45b2801fcf3e959/68747470733a2f2f6c617465782e636f6465636f67732e636f6d2f7376672e6c617465783f5c4c617267652673706163653b443d5c667261637b324a7d7b312b4a7d)

## OSA (Optimal String Alignment) <a name="osa"></a>
The OSA distance is based on the Levenshtein distance but counting the transposition as a valid edit operation with the restriction that no substring can be transposed more than once.

## Contributors

-  [Juan Negron](https://github.com/juan-negron)
-  [Diego Campos](https://github.com/kampamocha)