'use strict';

var matrix = require( 'dstructs-matrix' ),
	lasso = require( './../lib' ),
	randomNormal = require( 'distributions-normal-random' ),
	data,
	x, y,
	i;

// Set seed of random number generator:
randomNormal.seed = 117;

data = randomNormal( 1000 );
x = matrix( data, [100,10] );

// Generate response variables
y = new Float64Array( 100 );
for ( i = 0; i < y.length; i++ ) {
	y[ i ] = 4 * x.get( i, 3 ) +
		2 * x.get( i, 5 ) -
		4 * x.get( i, 7 ) -
		2 * x.get( i, 9 ) +
		randomNormal();
}

console.log( lasso( y, x, 0.4 ) );
