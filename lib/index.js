'use strict';

// MODULES //

var incrspace = require( 'compute-incrspace' ),
	matrix = require( 'dstructs-matrix' );


// CONSTANTS //

var PRECISION = 1e-9;


// FUNCTIONS //

var abs = Math.abs;

/**
* FUNCTION: dot( x, y, j )
*	Calculates the dot product between j-th column vectors of the two input
*	matrices skipping zero elements.
*
* @param {Matrix} x - first input matrix
* @param {Matrix} y - second input matrix
* @param {Number} j - column index
* @returns {Number} dot product value
*/
function dot( x, y, j) {
	var i,
		nRows,
		xVal, yVal,
		ret = 0;

	nRows = x.shape[ 0 ];
	for ( i = 0; i < nRows; i++ ) {
		xVal = x.get( i, j );
		yVal = y.get( i, j );
		if ( xVal !== 0 && yVal !== 0 ) {
			ret += xVal * yVal;
		}
	}
	return ret;
} // end FUNCTION dot()


/**
* FUNCTION: softThresholding( x, t )
*	Soft-Thresholding operator.
*
* @param {Number} x - input value
* @param {Number} t - threshold value
* @returns {Number} return value
*/
function softThresholding( x, t ) {
	if ( x > t ) {
		return x - t;
	} else if ( x < -t ) {
		return x + t;
	}
	return 0;
} // end FUNCTION softThresholding()


// LASSO //

/**
* FUNCTION: lasso( x, y, lambda )
*	Fit lasso regression via coordinate descent.
*
* @param {Matrix} x - design matrix
* @param {Array} y - output vector
* @param {Number} lambda - L1 penalty value
* @returns {Object} regression output
*/
function lasso( x, y, lambda ) {
	var active,
		beta,
		betast,
		betaOld, betaNew,
		converged,
		N = x.shape[ 0 ],
		p = x.shape[ 1 ],
		i, j, jVal, k,
		presid = matrix( x.shape ),
		rval,
		ret;

	// Initialize model parameters to zero:
	beta = new Float64Array( p );
	betast = new Float64Array( p );

	// Initialize active set to all predictors:
	active = incrspace( 0, beta.length, 1 );

	// Cycle over predictors and update parameters until convergence:
	do {
		converged = true;
		for ( j = 0; j < active.length; j++ ) {
			jVal = active[ j ];
			for ( i = 0; i < N; i++ ) {
				rval = y[ i ];
				for ( k = 0; k < p; k++ ) {
					rval -= ( jVal !== k ) ? x.get( i, k ) * beta[ k ] : 0;
				}
				presid.set( i, jVal, rval );
			}
			betast[ jVal ] = (1/N) * dot( x, presid, jVal );
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
			}
		}
	} while ( converged === false );

	// One more iteration to see whether active set has changed:
	for ( j = 0; j < active.length; j++ ) {
		jVal = active[ j ];
		for ( i = 0; i < N; i++ ) {
			rval = y[ i ];
			for ( k = 0; k < p; k++ ) {
				rval -= ( jVal !== k ) ? x.get( i, k ) * beta[ k ] : 0;
			}
			presid.set( i, jVal, rval );
		}
		betast[ jVal ] = (1/N) * dot( x, presid, jVal );
		beta[ jVal ] = softThresholding( betast[ jVal ], lambda );
	}
	
	ret = {};
	ret.beta = beta;

	return ret;
} // end FUNCTION lasso()

// EXPORTS //

module.exports = lasso;
