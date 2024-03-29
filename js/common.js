/*
 * Coachium - js/common.js
 * - contains common variables and functions for the program
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

// Common variables

var header, nav, main, footer, canvas, ctx, overlay, ovctx, table;

var captures = [], selected_capture = 0, capture, zoom;

var capture_cache = {
	"ports": [], // first one is always { min: 0, max: set capture length, unit: "s"/"ms"/whatever you want }
	"values": [],
	"xy_mode": false
};

/*
 * get_id(id, srcel)
 * 
 * Alias for document.getElementById (or any other element), because I really don't
 * want to type that function out all the time.
 */

function get_id(id, srcel = document) {
	var el = srcel.getElementById(id);

	if(el) {
		if(el.getElementsByTagName) el.get_tag = (tagname, index = 0) => get_tag(tagname, index, el);
		if(el.getElementsByClassName) el.get_class = (tagname, index = 0) => get_class(tagname, index, el);
	}

	return el;
}

/*
 * get_class(classname, index, srcel)
 * 
 * Same as get_id(), but for searching by class name.
 * 
 * If index is null, then all elements will be returned,
 * without the ability to chain more get_* calls.
 */

function get_class(classname, index = 0, srcel = document) {
	if(index === null) {
		return srcel.getElementsByClassName(classname);
	} else {
		var el = srcel.getElementsByClassName(classname)[index];

		if(el) {
			if(el.getElementsByTagName) el.get_tag = (tagname, index = 0) => get_tag(tagname, index, el);
			if(el.getElementsByClassName) el.get_class = (tagname, index = 0) => get_class(tagname, index, el);
		}

		return el;
	}
}

/*
 * get_tag(tagname, index, srcel)
 * 
 * Same as get_id(), but for searching by tag name.
 * 
 * If index is null, then all elements will be returned,
 * without the ability to chain more get_* calls.
 */

function get_tag(tagname, index = 0, srcel = document) {
	if(index === null) {
		return srcel.getElementsByTagName(tagname);
	} else {
		var el = srcel.getElementsByTagName(tagname)[index];

		if(el) {
			if(el.getElementsByTagName) el.get_tag = (tagname, index = 0) => get_tag(tagname, index, el);
			if(el.getElementsByClassName) el.get_class = (tagname, index = 0) => get_class(tagname, index, el);
		}

		return el;
	}
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
	if(digits >= 0)
		return Math.round(Math.pow(10, digits) * num) / Math.pow(10, digits);
	else
		return Math.round(num / Math.pow(10, -digits)) * Math.pow(10, -digits);
}

/*
 * ideal_round_fixed(num, max)
 * 
 * Rounds the input number to 4 valid digits according to
 * the maximum possible value and returns it as a string.
 */

function ideal_round_fixed(num, max) {
	var digits = 3 - Math.floor(Math.log10(max));

	if(digits < 0) digits = 0;

	return round(num, digits).toFixed(digits);
}

/*
 * round_fixed_digits(num, digits)
 * 
 * Rounds the input number to the number of given valid digits.
 * 
 * Example: round_fixed_digits(12345, 4) → 12350
 */

function round_fixed_digits(num, digits) {
	if(num === 0) return 0;

	var roundlevel = digits - 1 - Math.floor(Math.log10(Math.abs(num)));

	return round(num, roundlevel);
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

		if(val.indexOf(key + "=") == 0) {
			return val.substring(key.length + 1, val.length);
		}
	}

	return "";
}

/*
 * generate_cache(start, end)
 * 
 * Generates the cache data required for rendering the main window
 * from the currently selected capture. The start parameter is used
 * for skipping sections which have already been processed.
 */

function generate_cache(start, end) {
	const portnames = Object.keys(capture.ports);

	// Parse the input data

	for(var i = start; i < end; i++) {
		var entry = [];

		entry.push(i * capture.interval / 1000000);
		
		for(var j = 0; j < portnames.length; j++) {
			const data = capture.data[i * portnames.length + j];
			if(data === null) return;

			entry.push(data);
		}

		capture_cache.values[i] = entry;
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

/*
 * is_running_cached()
 * 
 * Returns whether Coachium is running in cached mode or not.
 */

function is_running_cached() {
	return typeof DEFAULT_LANGUAGE_OVERRIDE != "undefined";
}
