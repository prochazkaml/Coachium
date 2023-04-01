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
	function_fit_power,
	function_fit_sine
];

/*
 * get_fun_calc(fundef)
 * 
 * Returns a JS function for quick calculation of a given function.
 */

function get_fun_calc(fundef) {
	const output = fundef.params;

	var fun = null;

	switch(fundef.fun) {
		case "linear":
			fun = (x) => output.a * x + output.b;
			break;

		case "quadratic":
			fun = (x) => output.a * (x ** 2) + output.b * x + output.c;
			break;

		case "cubic":
			fun = (x) => output.a * (x ** 3) + output.b * (x ** 2) + output.c * x + output.d;
			break;

		case "exponential":
			fun = (x) => output.a * (Math.E ** (output.b * x));
			break;

		case "logarithmic":
			fun = (x) => output.a + output.b * Math.log(x);
			break;

		case "power":
			fun = (x) => output.a * (x ** output.b);
			break;

		case "sine":
			fun = (x) => output.a * Math.sin(x * output.b + output.c) + output.d;
			break;
	}

	return fun;
}

/*
 * fit_function()
 * 
 * Prepares the fit function dialog with calculated values.
 */

function fit_function() {
	if(get_id("advancedbutton").classList.contains("navbuttondisabled") ||
	   get_id("advancedpopup_fitfunction").classList.contains("popupitemdisabled")) {

		close_window(WINDOWID_FIT_FUNCTION);
		return;
	}

	close_popup();

	const sensorselect = get_win_el_tag(WINDOWID_FIT_FUNCTION, "select", 0);
	const select = get_win_el_tag(WINDOWID_FIT_FUNCTION, "select", 1);
	const checkbox = get_win_el_tag(WINDOWID_FIT_FUNCTION, "input");
	select.selectedIndex = 0;

	// Populate the sensor selector

	sensorselect.innerHTML = "";

	if(capture_cache.xy_mode) {
		// X-Y mode - only one possible option

		var option = document.createElement("option");
		
		option.innerText = format(
			jslang.FIT_FUN_XY_MODE,
			capture_cache.ports[2].id,
			capture_cache.ports[2].unit,
			capture_cache.ports[1].id,
			capture_cache.ports[1].unit
		);
		option.value = 0;

		sensorselect.appendChild(option);
		sensorselect.value = 0;
	} else {
		for(var i = 1; i < capture_cache.ports.length; i++) {
			var option = document.createElement("option");

			option.innerText = format(
				jslang.FIT_FUN_TIME_MODE,
				capture_cache.ports[i].id,
				capture_cache.ports[i].unit,
				capture_cache.ports[0].id,
				capture_cache.ports[0].unit
			);
			option.value = i;

			sensorselect.appendChild(option);
		}

		sensorselect.value = 1;
	}

	// Automatically update the values when the selected function is changed

	select.onchange = sensorselect.onchange = () => {
		var data = [];

		const sensor_x = capture_cache.xy_mode ? 1 : 0;
		const sensor_y = capture_cache.xy_mode ? 2 : sensorselect.value;

		for(var i = 0; i < capture_cache.values.length; i++) {
			const sample = capture_cache.values[i];

			if(sample[sensor_x] === undefined || sample[sensor_y] === undefined) break;

			data[i] = [ sample[sensor_x], sample[sensor_y] ];
		}

		// Assume algorithm error by default

		var algo_output = { fdjaslfhsdhf: null };

		try {
			algo_output = fitting_algos[select.selectedIndex](data);
		} catch(e) {
			// Stop in case the device gets disconnected

			console.log(e);
		}

		// Update the info dialog

		var string = "", invalid_val = false;

		for(const [key, value] of Object.entries(algo_output.output)) {
			if(isNaN(value)) invalid_val = true;
			string += "<b>" + key + "</b>: " + localize_num(value) + "<br>";
		}

		get_win_el_tag(WINDOWID_FIT_FUNCTION, "p", 2).innerHTML = invalid_val ? jslang.INVALID_FIT : string;

		get_id("fitfunctioncheckbox").style.display = invalid_val ? "none" : "";

		// Handle the check box

		checkbox.checked = false;

		if(!Array.isArray(capture.functions)) capture.functions = [];

		var funs = capture.functions;

		for(var i = 0; i < funs.length; i++) {
			if(funs[i].fun == algo_output.fun && funs[i].type == "fit" &&
				funs[i].sensor_x == sensor_x && funs[i].sensor_y == sensor_y) checkbox.checked = true;
		}

		checkbox.onchange = () => {
			if(checkbox.checked) {
				funs.push({
					fun: algo_output.fun,
					type: "fit",
					params: algo_output.output,
					sensor_x: sensor_x,
					sensor_y: sensor_y
				});
			} else {
				for(var i = 0; i < funs.length; i++) {
					if(funs[i].fun == algo_output.fun && funs[i].type == "fit" &&
						funs[i].sensor_x == sensor_x && funs[i].sensor_y == sensor_y) funs.splice(i, 1);
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
		"fun": "linear",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}

function function_fit_quadratic(points) {
	var retval = libregression.methods.polynomial(points, { precision: 10, order: 2 });

	return {
		"fun": "quadratic",
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
		"fun": "cubic",
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
		"fun": "exponential",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}

function function_fit_logarithmic(points) {
	var retval = libregression.methods.logarithmic(points, { precision: 10 });

	return {
		"fun": "logarithmic",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}

function function_fit_power(points) {
	var retval = libregression.methods.power(points, { precision: 10 });

	return {
		"fun": "power",
		"output": {
			"a": retval.equation[0],
			"b": retval.equation[1]
		}
	};
}

function function_fit_sine(points) {
	// As much as I would have liked to find a sine regression algorithm,
	// I instead had to cobble together my own.

	var retobj = {
		"fun": "sine",
		"output": {
			"a": undefined,
			"b": undefined,
			"c": undefined,
			"d": undefined
		}
	};

	// Determine min/max value

	var min = Infinity;
	var max = -Infinity;

	for(var i = 0; i < points.length; i++) {
		if(points[i][1] > max) max = points[i][1];
		if(points[i][1] < min) min = points[i][1];
	}

	if(min == Infinity || max == -Infinity) return retobj;

	// Calculate DC offset

	const dc_off = (min + max) / 2;

	retobj.output.d = round(dc_off, 10);

	// Find cross-over points

	var crosspts = [];

	for(var i = 0; i < points.length - 1; i++) {
		// Rising edge (phi = 0)

		if(points[i][1] < dc_off && points[i + 1][1] >= dc_off)
			crosspts.push([
				0,
				points[i][0] + (points[i + 1][0] - points[i][0]) * (points[i][1] - dc_off) / (points[i][1] - points[i + 1][1])
			]);

		// Falling edge (phi = pi)

		if(points[i][1] >= dc_off && points[i + 1][1] < dc_off)
			crosspts.push([
				1,
				points[i][0] + (points[i + 1][0] - points[i][0]) * (dc_off - points[i][1]) / (points[i + 1][1] - points[i][1])
			]);
	}

	if(crosspts.length < 2) return retobj;

	// Calculate the angular velocity

	var avg_t = 0;

	for(var i = 0; i < crosspts.length - 1; i++) {
		avg_t += crosspts[i + 1][1] - crosspts[i][1];
	}

	avg_t /= (crosspts.length - 1);

	retobj.output.b = round(Math.PI / avg_t, 10);

	// Figure out the phase offset (according to the first crossover point)

	var ph_off = crosspts[0][1] * (Math.PI / avg_t);

	if(crosspts[0][0] == 1) ph_off += Math.PI;

	ph_off = 2 * Math.PI - ph_off;

	while(ph_off < 0) ph_off += 2 * Math.PI;

	retobj.output.c = round(ph_off, 10);

	// Calculate amplitude

	retobj.output.a = round(max - dc_off, 10);

	return retobj;
}
