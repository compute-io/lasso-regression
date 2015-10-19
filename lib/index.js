'use strict';

// MODULES //

var incrspace = require( 'compute-incrspace' ),
	matrix = require( 'dstructs-matrix' ),
	subtract = require( 'compute-subtract' ),
	divide = require( 'compute-divide' ),
	sign = require( 'compute-signum' ),
	transpose = require( 'compute-transpose' ),
	toMatrix = require( 'compute-to-matrix' ),
	isArrayArray = require( 'validate.io-array-array' ),
	isMatrixLike = require( 'validate.io-matrix-like' ),
	isNumber = require( 'validate.io-number-primitive' ),
	isArrayLike = require( 'validate.io-array-like' );


// CONSTANTS //

var PRECISION = 1e-9;


// FUNCTIONS //

var abs = Math.abs,
	dotm = require( './dotm.js' ),
	dotv = require( './dotv.js' ),
	mmult = require( './mmult.js' ),
	softThresholding = require( './softThresholding.js' );


// FIT //

/*
* FUNCTION: LassoFit( y, x, lambda )
*	Lasso object to fit regression.
*
* @constructor
* @returns {LassoFit} instance
*/
function LassoFit( y, x, lambda ) {

	var self = this;

	this.y = y;
	this.x = x;
	this.lambda = lambda;

	this.N = x.shape[ 0 ];
	this.p = x.shape[ 1 ];

	// Initialize model parameters to zero:
	this.beta = new Float64Array( this.p );
	this.betast = new Float64Array( this.p );

	// Initialize active set to all predictors:
	this.active = incrspace( 0, this.beta.length, 1 );
	this.nonactive = [];

	// Matrix holding partial residuals:
	this.presid = matrix( x.shape );
	// Residual vector
	this.resid = new Float64Array( this.N );

	this.init = function init() {
		self.iterate();
	};

	this.init();
} // end FUNCTION LassoFit()


/**
* Method: testKKT()
*	Checks the Karush-Khun-Tucker (KKT) conditions for an optimal solution.
*
* @returns {Boolean} returns true if optimal conditions are satisfied, false otherwise
*/
LassoFit.prototype.testKKT = function testKKT() {
	var beta = this.beta,
		N = this.N,
		x = this.x,
		y = this.y,
		ymxb,
		G,
		lambda = this.lambda,
		i;

		ymxb = subtract( y, mmult( x, beta ) );
		G = divide( mmult( transpose(x), ymxb ), N );
		for ( i = 0; i < beta.length; i++ ) {
			if ( beta[ i ] === 0 ) {
				if ( abs( G[i] ) > lambda + PRECISION ) {
					return false;
				}
			} else if ( beta[ i ] > 0 ) {
				if ( G[i] - lambda * sign( beta[i] )  > PRECISION ) {
					return false;
				}
			}
		}
		return true;
}; // end METHOD testKKT()


/**
* Method: testActiveSet()
*	Exclusion test for all predictors not in active set.
*	If one or more predictors fail the test, they are included in
*	the active set.
*
* @returns {Boolean} returns true if active set was changed, false otherwise
*/
LassoFit.prototype.testActiveSet = function testActiveSet() {

	var j, jVal,
		xj,
		changed = false;

	// Calculate model results
	this.resid = this.calcResiduals();

	// See whether non-active variables all pass exclusion test:
	for ( j = 0; j < this.nonactive.length; j++ ) {
		jVal = this.nonactive[ j ];
		xj = this.x.mget( null, [jVal] ).data;
		if ( abs( dotv( xj, this.resid ) ) / this.N > this.lambda ) {
			// Test failed: include predictor in active set -> iterate again
			this.active.push( jVal );
			this.nonactive.splice( j, 1 );
			changed = true;
		}
	}
	return changed;
}; // end METHOD testActiveSet()


/**
* Method: iterate()
*	Iterate over the active set of predictors and perform coordinate descent until convergence.
*
* @returns {Void}
*/
LassoFit.prototype.iterate = function iterate() {
	var self = this,
		active = this.active,
		nonactive = this.nonactive,
		beta = this.beta,
		betast = this.betast,
		N = this.N,
		p = this.p,
		x = this.x,
		y = this.y,
		lambda = this.lambda,
		presid = this.presid,
		betaOld, betaNew,
		converged,
		i, j, jVal, k,
		rval;

	converged = true;
	for ( j = 0; j < this.active.length; j++ ) {
		jVal = this.active[ j ];
		for ( i = 0; i < N; i++ ) {
			rval = y[ i ];
			for ( k = 0; k < p; k++ ) {
				rval -= ( jVal !== k ) ? x.get( i, k ) * beta[ k ] : 0;
			}
			presid.set( i, jVal, rval );
		}
		betast[ jVal ] = (1/N) * dotm( x, presid, jVal );
		betaOld = beta[ jVal ];
		betaNew = softThresholding( betast[ jVal ], lambda );
		if ( abs( betaNew - betaOld ) > PRECISION ) {
			converged = false;
		}
		beta[ jVal ] = betaNew;
	}
	// Recompute active set:
	for ( j = active.length - 1; j >= 0; j-- ) {
		jVal = active[ j ];
		if ( abs( beta[ jVal ] ) < PRECISION ) {
			active.splice( j, 1 );
			nonactive.push( jVal );
		}
	}
	if ( converged === false ) {
		self.iterate();
	} else {
		if ( self.testActiveSet() === true ){
			self.iterate();
		}
		return;
	}
}; // end METHOD iterate()


/**
* Method: calcResiduals()
*	Calculates the current model residuals (e = y - yhat ).
*
* @returns {Float64Array} array of residuals
*/
LassoFit.prototype.calcResiduals = function calcResiduals() {
	var y = this.y,
		x = this.x,
		beta = this.beta,
		xhat = mmult( x, beta ),
		out = new Float64Array( this.N ),
		i;
	for ( i = 0; i < this.N; i++ ) {
		out[ i ] = y[ i ] - xhat[ i ];
	}
	return out;
}; // end METHOD calcResiduals()


// LASSO //

/**
* FUNCTION: lasso( y, x, lambda )
*	Fit lasso regression via coordinate descent.
*
* @param {Matrix|Array} x - design matrix
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} y - response vector
* @param {Number} lambda - L1 penalty value
* @returns {Object} regression output
*/
function lasso( x, y, lambda ) {

	var ret,
		fit,
		msg;

	if ( !isNumber ) {
		throw new TypeError( 'lasso()::invalid input argument. The third argument must be a number primitive. Value: `' + lambda + '`' );
	}

	if ( !isArrayLike( y ) ) {
		throw new TypeError( 'lasso()::invalid input argument. The second argument must be array-like. Value: `' + y + '`' );
	}

	if ( isArrayArray( x ) ) {
		x = toMatrix( x );
	} else if ( !isMatrixLike( x ) ) {
		msg = 'lasso()::invalid input argument. The first argument must be a matrix or an array-of-arrays. Value: `' + x + '`';
		throw new TypeError( msg );
	}

	fit = new LassoFit( y, x, lambda );

	ret = {};
	ret.beta = fit.beta;
	ret.residuals = fit.calcResiduals();
	ret.optimumFound = fit.testKKT();

	return ret;
} // end FUNCTION lasso()


// EXPORTS //

module.exports = lasso;
