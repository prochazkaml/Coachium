/*
 * Coachium - funfit.js
 * - contains functions for fitting input points onto various functions
 * 
 * Made by Michal Procházka, 2021-2022.
 */

// List of all available fitting algorithms

const fitting_algos = [
	function_fit_linear
];

/*
 * fit_function()
 * 
 * Prepares the fit function dialog with calculated values.
 */

function fit_function() {
	if(get_id("fitfunctionbutton").style.filter) return;

	const select = get_win_el_tag(WINDOWID_FIT_FUNCTION, "select");
	const checkbox = get_win_el_tag(WINDOWID_FIT_FUNCTION, "input");
	const capture = captures[selectedcapture];

	// Automatically update the values when the selected function is changed
	
	select.onchange = () => {
		const algo_output = fitting_algos[select.selectedIndex](capturecache.values);

		// Update the info dialog

		var string = "";

		for (const [key, value] of Object.entries(algo_output.output)) {
			string += "<b>" + key + "</b>: " + localize_num(value) + "<br>";
		}

		get_win_el_tag(WINDOWID_FIT_FUNCTION, "p", 1).innerHTML = string;

		// Handle the check box

		if(!captures[selectedcapture].functions)
			checkbox.checked = false;
		else
			checkbox.checked = algo_output.type in captures[selectedcapture].functions;

		checkbox.onchange = () => {
			if(!captures[selectedcapture].functions) {
				if(checkbox.checked) {
					captures[selectedcapture].functions = {
						[algo_output.type]: algo_output.output
					};
				}
			} else {
				if(checkbox.checked) {
					captures[selectedcapture].functions[algo_output.type] = algo_output.output;
				} else {
					delete captures[selectedcapture].functions[algo_output.type];
				}
			}

			main_window_reset(false, false);
		}
	}

	select.onchange();

	// Now, ask all of the algorithms for their output

	popup_window(WINDOWID_FIT_FUNCTION);
}

/*
 * function_fit_linear(points)
 * 
 * Fits all input points onto a linear function (y = ax + b),
 * returning the 2 coefficients.
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

	return {
		"type": "linear",
		"output": {
			"a": a,
			"b": b
		}
	};
}
