'use strict';

/**
* FUNCTION: dotv( x, y )
*	Calculates the dot product between two arrays.
*
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} x - first vector
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} y - second vector
* @returns {Number} dot product
*/
function dotv( x, y ) {
	var len = x.length,
		sum = 0,
		i;
	for ( i = 0; i < len; i++ ) {
		sum += x[ i ] * y[ i ];
	}
	return sum;
} // end FUNCTION dotv()


// EXPORTS //

module.exports = dotv;
