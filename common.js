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
const WINDOWID_GOOGLE_SERVICES_ERR = 18;
const WINDOWID_FIT_FUNCTION = 19;

var openwindow = -1, windowstack = [], zindex = 10;

var header, nav, main, footer, canvas, ctx, table;

var device, connected = false, verified = false;

var outreport = [ 0x04, 0x01, 0x0B, 0x80, 0x0C, 0x33, 0x0B, 0x00 ];
var outreportaddress = 0;

var background_task_cycle = -1;
var background_task_handle;
var transfer_in_progress = false;

var gdrive_response;

var zoom_request_progress = 0, zoom_move_request = false, zoomed_in = false, zoomx1, zoomy1, zoomx2, zoomy2

const eeprom_addresses = [
	// For automatic detection of changes (quick replug of another sensor, range switch change)
	0x04,

	// Sensor name
	0x08, 0x09, 0x0A, 0x0B, 
	0x0C, 0x0D, 0x0E, 0x0F, 
	0x10, 0x11, 0x12, 0x13, 
	0x14, 0x15, 0x16, 0x17, 
	0x18, 0x19, 0x1A, 0x1B,

	// Minimal value
	0x3B, 0x3C, 0x3D, 0x3E, 

	// Maximal value
	0x3F, 0x40, 0x41, 0x42, 

	// Coefficient a
	0x4A, 0x4B, 0x4C, 0x4D,
	
	// Coefficient b
	0x46, 0x47, 0x48, 0x49,

	// Unit name
	0x53, 0x54, 0x55, 0x56, 0x57,

	// High/low voltage detection
	0x01
];

const eeprom_length = eeprom_addresses.length;

var ports = [
	{
		"id": "1",
		"color": "#8F8",
		"connected": false,
		"intelligent": true,
		"name": "",
		"unit": "",
		"min_value": 0,
		"max_value": 0,
		"coeff_a": 0,
		"coeff_b": 0,
		"high_voltage": false,
		"raw_eeprom": new Uint8Array(eeprom_length)
	}, {
		"id": "2",
		"color": "#FF6",
		"connected": false,
		"intelligent": true,
		"name": "",
		"unit": "",
		"min_value": 0,
		"max_value": 0,
		"coeff_a": 0,
		"coeff_b": 0,
		"high_voltage": false,
		"raw_eeprom": new Uint8Array(eeprom_length)
	}
];

var capturesetupsamples, capturesetupmode, capturesetupspeed, capturesetuppacketsize, capturesetupsamplesize;
var requestcapture = false, capturerunning = false, receivedcapture, receivedsofar;

var captures = [], selectedcapture = 0;

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
