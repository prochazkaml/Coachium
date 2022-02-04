/*
 * Coachium - funfit.js
 * - contains functions for fitting input points onto various functions
 * 
 * Made by Michal Procházka, 2021-2022.
 */

/*
 * function_fit_linear(points)
 * 
 * Fits all input points onto a linear function, returning the 2 coefficients.
 */

function function_fit_linear(points) {
	// Taken from here: https://www.varsitytutors.com/hotmath/hotmath_help/topics/line-of-best-fit

	var mx = 0, my = 0;

	for(var i = 0; i < points.length; i++) {
		mx += points[i][0];
		my += points[i][1];
	}
	
	mx /= points.length;
	my /= points.length;
	
	var k = 0, l = 0;
	
	for(var i = 0; i < points.length; i++) {
		k += (points[i][0] - mx) * (points[i][1] - my);
		l += (points[i][0] - mx) * (points[i][0] - mx);
	}
	
	a = k / l;
	b = my - a * mx;

	console.log("y = " + a + "x + " + b);

	return {
		"a": a,
		"b": b
	};
}
