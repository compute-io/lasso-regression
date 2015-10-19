'use strict';

var lasso = require( './../lib' ),
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
console.dir( out );
