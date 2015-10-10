'use strict';

/**
* FUNCTION: dotm( x, y, j )
*	Calculates the dot product between j-th column vectors of the two input
*	matrices skipping zero elements.
*
* @param {Matrix} x - first input matrix
* @param {Matrix} y - second input matrix
* @param {Number} j - column index
* @returns {Number} dot product value
*/
function dotm( x, y, j) {
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
} // end FUNCTION dotm()


// EXPORTS //

module.exports = dotm;
