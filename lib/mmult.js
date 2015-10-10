'use strict';

/**
* FUNCTION: mmult( A, b )
*	Computes a matrix product of a n x p matrix and
*	a column vector of length n.
*
* @param {Matrix} A - n x p matrix
* @param {Array} b - p x 1 column vector
* @returns {Array} result of matrix multiplication
*/
function mmult( A, b ) {
	var n = A.shape[ 0 ],
		p = A.shape[ 1 ],
		i, j,
		sum,
		ret;

	ret = new Float64Array( n );
	for ( i = 0; i < n; i++ ) {
			sum = 0;
			for ( j = 0; j < p; j++ ) {
				sum += A.get( i, j ) * b[ j ];
			}
			ret[ i ] = sum;
	}
	return ret;
} // end FUNCTION mmult()


// EXPORTS //

module.exports = mmult;
