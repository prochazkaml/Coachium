/*
 * Coachium - common.js
 * - the main skeleton of the program, contains global constants, variables & common functions
 * 
 * Made by Michal Procházka, 2021-2022.
 */

const WINDOWID_ABOUT = 0;
const WINDOWID_JS_ERR = 1;
const WINDOWID_CAPTURE_SETUP = 2;
const WINDOWID_GDRIVE_SAVE_OK = 3;
const WINDOWID_GDRIVE_SAVE_ERR = 4;
const WINDOWID_GDRIVE_GENERIC_ERR = 5;
const WINDOWID_GDRIVE_NAME = 6;
const WINDOWID_WEBHID_UNAVAILABLE = 7;
const WINDOWID_INVALID_CHECKSUM = 8;
const WINDOWID_FILE_IMPORT_ERR = 9;
const WINDOWID_IMPORT_OVERWRITE_WARN = 10;
const WINDOWID_REMOVE_CAPTURE_WARN = 11;
const WINDOWID_NUKE_EVERYTHING_WARN = 12;
const WINDOWID_CAPTURE_MANAGEMENT = 13;
const WINDOWID_LANGUAGE_SELECTOR = 14;
const WINDOWID_LANGUAGE_ERROR = 15;
const WINDOWID_LOCAL_SAVE_NAME = 16;
const WINDOWID_CAPTURE_INFO = 17;
// WINDOWID 18 is free!
const WINDOWID_FIT_FUNCTION = 19;
const WINDOWID_DEVICE_OPEN_ERROR = 20;
const WINDOWID_WATCHDOG_ERROR = 21;

var openwindow = -1, windowstack = [], zindex = 10;

var header, nav, main, footer, canvas, ctx, table;

var device, connected = false, verified = false;

var zoom_request_progress = 0, zoom_move_request = false, zoomed_in = false;

var requestcapture = false, capturerunning = false, receivedcapture, receivedsofar;

var captures = [], selectedcapture = 0;

var capturecache = {
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

const fresh_port_spec = {
	"id": null,
	"color": null,
	"connected": null,
	"intelligent": null,
	"name": null,
	"unit": null,
	"min_value": null,
	"max_value": null,
	"coeff_a": null,
	"coeff_b": null,
	"high_voltage": null
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
 * get_id(id)
 * 
 * Alias for document.getElementById, because I really don't
 * want to type that function out all the time.
 */

function get_id(id) {
	return document.getElementById(id);
}

/*
 * get_class(classname, index = 0)
 * 
 * Same as get_id(), but for searching by class name.
 */

function get_class(classname, index = 0) {
	return document.getElementsByClassName(classname)[index];
}

/*
 * get_tag(tagname, index = 0)
 * 
 * Same as get_id(), but for searching by tag name.
 */

function get_tag(tagname, index = 0) {
	return document.getElementsByTagName(tagname)[index];
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
 * convert_12bit_to_string(val, a, b, hv, max)
 * 
 * Converts a raw 12-bit value to a string containing a human-readable number
 * of a given unit. The value is rounded to 4 valid digits, same as Coach.
 */

function convert_12bit_to_string(val, a, b, hv, max) {
	var digits = 3 - Math.floor(Math.log10(max));

	if(isNaN(val))
		return "–";
	else
		return localize_num(round(convert_12bit_to_real(val, a, b, hv), digits).toFixed(digits));
}

/*
 * prettyprint_value(id, val)
 *
 * Converts a raw 12-bit value from a sensor to a human-readable string.
 */

function prettyprint_value(id, val) {
	if(ports[id].connected) {
		var converted = convert_12bit_to_string(val, ports[id].coeff_a, ports[id].coeff_b, ports[id].high_voltage, ports[id].max_value);

		return converted + " " + ports[id].unit;
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
	const capture = captures[selectedcapture];

	if(capture.sensorsetup) {
		// Only one sensor was used
		
		const sensor = (capture.sensorsetup == 1) ? capture.port_a : capture.port_b;

		for(var i = start; i < end; i++) {
			if(isNaN(values[i])) break;

			capturecache.values[i] = [
				capture.interval / 10000 * i,
				convert_12bit_to_real(values[i], sensor.coeff_a,
					sensor.coeff_b, sensor.high_voltage)
			];
		}
	} else {
		// Both sensors were used

		const sensor_a = capture.port_a, sensor_b = capture.port_b;

		for(var i = start / 2; i < end / 2; i++) {
			if(isNaN(values[i * 2])) break;
			if(isNaN(values[i * 2 + 1])) break;

			capturecache.values[i] = [
				convert_12bit_to_real(values[i * 2 + 1], sensor_b.coeff_a,
					sensor_b.coeff_b, sensor_b.high_voltage),
				convert_12bit_to_real(values[i * 2], sensor_a.coeff_a,
					sensor_a.coeff_b, sensor_a.high_voltage)
			];
		}
	}
}