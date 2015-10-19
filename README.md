LASSO Regression
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Performs regularized least-squares regression with L1 penalty.

Given a response variable `Y` and a vector of predictors `X`, a linear regression model is defined as

<div class="equation" align="center" data-raw-text="\mathbb{E}\left[ Y \mid X = x \right ] = \beta_0 + \beta^\intercal xm" data-equation="eq:linear_model">
	<img src="path" alt="Linear Regression Function">
	<br>
</div>

where `beta_0` is the intercept coefficient and `beta` a vector of predictor coefficients. Given data points `(x_1,y_1),...,(x_N,y_N)`, this package estimates the regression coefficients using the LASSO. This L1 penalized regression penalizes non-zero coefficients and its fit is obtained by solving the following problem:

<div class="equation" align="center" data-raw-text="\min_{\beta_0,\beta} \frac{1}{2N} \sum_{i=1}^N \left( y_i - \beta_0 - \beta^\intercal x_i \right)^2 + \lambda ||\beta||_1" data-equation="eq:lasso_problem">
	<img src="path" alt="LASSO problem">
	<br>
</div>

The `lambda` parameter determines the size of the penalty placed on the L1 norm of the `beta` vector. When `lambda = 0`, the problem reduces to multiple linear regression, whereas `lambda -> ∞` will result in an intercept-only model.

As we observe, for non-zero penalties the LASSO shrinks coefficient estimates to zero, which makes the LASSO perform model selection: Increasing `lambda`, predictors that do not contribute much in explaining `Y` will tend to get removed from the model.

## Installation

``` bash
$ npm install compute-lasso-regression
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var lasso = require( 'compute-lasso-regression' );
```

#### lasso( x, y, lambda )

Fits a regularized regression for inputs `x` and `y`. `x` is expected to be a [`matrix`](https://github.com/dstructs/matrix) with `N` rows and `p` columns, each row representing one observation and each column one predictor variable. `y` has to be an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) or [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) of `N` response values.

## References

- Tibshirani, R. (1994). Regression Selection and Shrinkage via the Lasso. Journal of the Royal Statistical Society B. doi:10.2307/2346178

- Friedman, J., Hastie, T., & Tibshirani, R. (2010). Regularization Paths for Generalized Linear Models via Coordinate Descent. Journal of Statistical Software, 33(1), 1–22. doi:10.1359/JBMR.0301229

## Examples

``` javascript
var lasso = require( 'compute-lasso-regression' ),
	randomNormal = require( 'distributions-normal-random' ),
	x, y,
	out,
	i;

// Set seed of random number generator:
randomNormal.seed = 117;

// Create a 100 x 10 matrix of standard normal variates
x = randomNormal( [100,10], {
	'dtype':'float64'
});

// Generate response variables
y = new Float64Array( 100 );
for ( i = 0; i < y.length; i++ ) {
	y[ i ] = 4 * x.get( i, 3 ) +
		2 * x.get( i, 5 ) -
		4 * x.get( i, 7 ) -
		2 * x.get( i, 9 ) +
		randomNormal();
}

out = lasso( x, y, 0.4 );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/compute-lasso-regression.svg
[npm-url]: https://npmjs.org/package/compute-lasso-regression

[travis-image]: http://img.shields.io/travis/compute-io/lasso-regression/master.svg
[travis-url]: https://travis-ci.org/compute-io/lasso-regression

[codecov-image]: https://img.shields.io/codecov/c/github/compute-io/lasso-regression/master.svg
[codecov-url]: https://codecov.io/github/compute-io/lasso-regression?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/lasso-regression.svg
[dependencies-url]: https://david-dm.org/compute-io/lasso-regression

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/lasso-regression.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/lasso-regression

[github-issues-image]:  http://img.shields.io/github/issues/compute-io/lasso-regression.svg
[github-issues-url]: https://github.com/compute-io/lasso-regression/issues
