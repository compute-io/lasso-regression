'use strict';

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


// EXPORTS //

module.exports = softThresholding;
