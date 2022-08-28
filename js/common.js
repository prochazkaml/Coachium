/*
 * Coachium - js/common.js
 * - contains common constants, variables and functions for the program
 * 
 * Copyright (C) 2021-2022 Michal Procházka
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

// General windows

const WINDOWID_ABOUT = 0;
const WINDOWID_JS_ERR = 1;

// Capture/file management windows

const WINDOWID_CAPTURE_SETUP = 2;
const WINDOWID_FILE_IMPORT_ERR = 9;
const WINDOWID_IMPORT_OVERWRITE_WARN = 10;
const WINDOWID_REMOVE_CAPTURE_WARN = 11;
const WINDOWID_NUKE_EVERYTHING_WARN = 12;
const WINDOWID_CAPTURE_MANAGEMENT = 13;
const WINDOWID_LOCAL_SAVE_NAME = 16;
const WINDOWID_CAPTURE_INFO = 17;
const WINDOWID_FIT_FUNCTION = 19;

// Google Drive windows

const WINDOWID_GDRIVE_SAVE_OK = 3;
const WINDOWID_GDRIVE_SAVE_ERR = 4;
const WINDOWID_GDRIVE_GENERIC_ERR = 5;
const WINDOWID_GDRIVE_NAME = 6;

// Driver/hardware windows

const WINDOWID_DRIVER_SELECTOR = 18;

const WINDOWID_LLAPI_UNAVAILABLE = 7;
const WINDOWID_DEVICE_VERIFY_ERROR = 8;
const WINDOWID_DEVICE_OPEN_ERROR = 20;
const WINDOWID_WATCHDOG_ERROR = 21;

// Language windows

const WINDOWID_LANGUAGE_SELECTOR = 14;
const WINDOWID_LANGUAGE_ERROR = 15;

// Common variables

var open_window = -1, window_stack = [], zindex = 10;

var header, nav, main, footer, canvas, ctx, overlay, ovctx, table;

var driver = null;

var zoom_request_progress = 0, zoom_move_request = false, zoomed_in = false;

var request_capture = false;

var captures = [], selected_capture = 0;

var capture_cache = {
	"x": {
		"min": null,
		"max": null,
		"unitname": null,
	},
	"y": {
		"min": null,
		"max": null,
		"unitname": null,
	},
	"values": []
};

const fresh_capture = {
	"title": null,
	"seconds": null,
	"samples": null,
	"interval": null,
	"sensorsetup": null,
	"port_a": null,
	"port_b": null,
	"captureddata": null
};

/*
 * get_id(id, srcel = document)
 * 
 * Alias for document.getElementById (or any other element), because I really don't
 * want to type that function out all the time.
 */

function get_id(id, srcel = document) {
	var el = srcel.getElementById(id);

	if(el.getElementsByTagName) el.get_tag = (tagname, index = 0) => get_tag(tagname, index, el);
	if(el.getElementsByClassName) el.get_class = (tagname, index = 0) => get_class(tagname, index, el);

	return el;
}

/*
 * get_class(classname, index = 0, srcel = document)
 * 
 * Same as get_id(), but for searching by class name.
 */

function get_class(classname, index = 0, srcel = document) {
	var el = srcel.getElementsByClassName(classname)[index];

	if(el.getElementsByTagName) el.get_tag = (tagname, index = 0) => get_tag(tagname, index, el);
	if(el.getElementsByClassName) el.get_class = (tagname, index = 0) => get_class(tagname, index, el);

	return el;
}

/*
 * get_tag(tagname, index = 0, srcel = document)
 * 
 * Same as get_id(), but for searching by tag name.
 */

function get_tag(tagname, index = 0, srcel = document) {
	var el = srcel.getElementsByTagName(tagname)[index];

	if(el.getElementsByTagName) el.get_tag = (tagname, index = 0) => get_tag(tagname, index, el);
	if(el.getElementsByClassName) el.get_class = (tagname, index = 0) => get_class(tagname, index, el);

	return el;
}

/*
 * format(str, ...)
 * 
 * Formats the input string with parameters.
 * 
 * Example: format("Hello, {0}!", "Michal") returns "Hello, Michal!"
 * 
 * Let's not talk about how this function is implemented.
 * 
 * Taken from here: https://stackoverflow.com/a/4673436
 */

const format = function(format) {
	var args = Array.prototype.slice.call(arguments, 1);
	return format.replace(/{(\d+)}/g, function(match, number) { 
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

/*
 * round(num, digits)
 *
 * Rounds the input number to a set number of decimal digits.
 * 
 * Also accepts negative values to round to 10 (-1), 100 (-2) etc.
 */

function round(num, digits = 0) {
	return Math.round(Math.pow(10, digits) * num) / Math.pow(10, digits);
}

/*
 * ideal_round_fixed(num, max)
 * 
 * Rounds the input number to 4 valid digits according to
 * the maximum possible value and returns it as a string.
 */

function ideal_round_fixed(num, max) {
	const digits = 3 - Math.floor(Math.log10(max));

	return round(num, digits).toFixed(digits);
}

/*
 * localize_num(num)
 * 
 * Localizes a string containing a number (or an actual number,
 * which will be converted to string) by the selected language.
 */

function localize_num(num) {
	n = num + ""; // Convert to string if it is not already

	return n.replace(".", decimal_separator);
}

/*
 * convert_12bit_to_real(val, a, b, hv)
 * 
 * Converts a raw 12-bit value to an human-readable number of said unit.
 * You wouldn't believe how much pain it was to get the constants below
 * (1.013 and 1.0114), it took me like half a day to find them.
 * 
 * They are set so that the result value more or less corresponds to what
 * Coach would output (the deviation is about 1/100, which I'm fine with,
 * you also have to keep in mind that Coach is not perfect either. 🤷)
 */

function convert_12bit_to_real(val, a, b, hv) {
	var val;
	
	if(hv)
		val = a * (val / 4095 * 20 - 10) * 1.013 + b;
	else
		val = a * (val / 4095 * 5) * 1.0114 + b;

	return val;
}

/*
 * prettyprint_value(id)
 *'
 * Converts the sensor's current value to a human-readable string.
 */

function prettyprint_value(id) {
	if(ports[id].connected) {
		return localize_num(ideal_round_fixed(ports[id].value, ports[id].max_value)) + " " + ports[id].unit;
	} else {
		return "–";
	}
}

/*
 * tags_encode(s)
 * 
 * Generates tag escape characters for a given string.
 */

function tags_encode(s) {
	var el = document.createElement("div");
	el.innerText = el.textContent = s;
	return el.innerHTML;
}

/*
 * read_cookie(key)
 * 
 * Reads the cookie and finds the correct key value.
 * 
 * More or less taken from here: https://www.w3schools.com/js/js_cookies.asp
 */

function read_cookie(key) {
	const cookies = decodeURIComponent(document.cookie).split(';');

	for(let i = 0; i <cookies.length; i++) {
		var val = cookies[i];

		while(val.charAt(0) == ' ') {
			val = val.substring(1);
		}
	
		if (val.indexOf(key + "=") == 0) {
			return val.substring(key.length + 1, val.length);
		}
	}

	return "";
}

/*
 * generate_cache(values, start, end)
 * 
 * Generates the cache data required for rendering the main window
 * from the currently selected capture.
 */

function generate_cache(values, start, end) {
	const capture = captures[selected_capture];

	if(capture.sensorsetup) {
		// Only one sensor was used
		
		var sensor = (capture.sensorsetup == 1) ? capture.port_a : capture.port_b;

		if(!sensor.zero_offset) sensor.zero_offset = 0;

		for(var i = start; i < end; i++) {
			if(values[i] == null) break;

			capture_cache.values[i] = [
				capture.interval / 10000 * i,
				convert_12bit_to_real(values[i], sensor.coeff_a,
					sensor.coeff_b, sensor.high_voltage) - sensor.zero_offset
			];
		}
	} else {
		// Both sensors were used

		var sensor_a = capture.port_a, sensor_b = capture.port_b;

		if(!sensor_a.zero_offset) sensor_a.zero_offset = 0;
		if(!sensor_b.zero_offset) sensor_b.zero_offset = 0;

		for(var i = start / 2; i < end / 2; i++) {
			if(values[i * 2] == null) break;
			if(values[i * 2 + 1] == null) break;

			capture_cache.values[i] = [
				convert_12bit_to_real(values[i * 2 + 1], sensor_b.coeff_a,
					sensor_b.coeff_b, sensor_b.high_voltage) - sensor_b.zero_offset,
				convert_12bit_to_real(values[i * 2], sensor_a.coeff_a,
					sensor_a.coeff_b, sensor_a.high_voltage) - sensor_a.zero_offset
			];
		}
	}
}

/*
 * async delay_ms(ms)
 *
 * Waits for a specified number of milliseconds.
 */

async function delay_ms(ms) {
	await new Promise((r) => setTimeout(r, ms));
}
