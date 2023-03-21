/*
 * Coachium - js/modules/fitfun.js
 * - contains functions for fitting input points onto various functions
 * 
 * Copyright (C) 2021-2023 Michal Procházka
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// List of all available fitting algorithms

const fitting_algos = [
	function_fit_linear,
	function_fit_quadratic,
	function_fit_cubic,
	function_fit_exponential,
	function_fit_logarithmic,
	function_fit_power
];

/*
 * fit_function()
 * 
 * Prepares the fit function dialog with calculated values.
 */

function fit_function() {
	if(get_id("advancedbutton").classList.contains("navbuttondisabled")) return;

	if(get_id("advancedpopup_fitfunction").classList.contains("popupitemdisabled")) return;

	close_popup();

	const select = get_win_el_tag(WINDOWID_FIT_FUNCTION, "select");
	const checkbox = get_win_el_tag(WINDOWID_FIT_FUNCTION, "input");
	select.selectedIndex = 0;

	// Automatically update the values when the selected function is changed

	select.onchange = () => {
		var data = [];

		for(var i = 0; i < capture_cache.values.length; i++) {
			const sample = capture_cache.values[i];

			if(capture_cache.xy_mode) {
				data[i] = [ sample[1], sample[2] ];
			} else {
				// TODO

				data[i] = [ sample[0], sample[1] ];
			}
		}

		const algo_output = fitting_algos[select.selectedIndex](data);

		// Update the info dialog

		var string = "", invalid_val = false;

		for(const [key, value] of Object.entries(algo_output.output)) {
			if(isNaN(value)) invalid_val = true;
			string += "<b>" + key + "</b>: " + localize_num(value) + "<br>";
		}

		get_win_el_tag(WINDOWID_FIT_FUNCTION, "p", 1).innerHTML = invalid_val ? jslang.INVALID_FIT : string;

		get_id("fitfunctioncheckbox").style.display = invalid_val ? "none" : "";

		// Handle the check box

		if(!captures[selected_capture].functions)
			checkbox.checked = false;
		else
			checkbox.checked = algo_output.type in captures[selected_capture].functions;

		checkbox.onchange = () => {
			if(!captures[selected_capture].functions) {
				if(checkbox.checked) {
					captures[selected_capture].functions = {
						[algo_output.type]: algo_output.output
					};
				}
			} else {
				if(checkbox.checked) {
					captures[selected_capture].functions[algo_output.type] = algo_output.output;
				} else {
					delete captures[selected_capture].functions[algo_output.type];
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
 * function_fit_xxx(points)
 * 
 * Fits an array of points to a given function.
 */

function function_fit_linear(points) {
	var retval = libregression.methods.linear(points, { precision: 10 });

	return {
		"type": "linear",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}

function function_fit_quadratic(points) {
	var retval = libregression.methods.polynomial(points, { precision: 10, order: 2 });

	return {
		"type": "quadratic",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1],
			"c": retval.equation[2]
		}
	};
}

function function_fit_cubic(points) {
	var retval = libregression.methods.polynomial(points, { precision: 10, order: 3 });

	return {
		"type": "cubic",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1],
			"c": retval.equation[2],
			"d": retval.equation[3]
		}
	};
}

function function_fit_exponential(points) {
	var retval = libregression.methods.exponential(points, { precision: 10 });

	return {
		"type": "exponential",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}

function function_fit_logarithmic(points) {
	var retval = libregression.methods.logarithmic(points, { precision: 10 });

	return {
		"type": "logarithmic",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}

function function_fit_power(points) {
	var retval = libregression.methods.power(points, { precision: 10 });

	return {
		"type": "power",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}
