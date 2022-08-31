/*
 * Coachium - js/workbook.js
 * - handles all workbook related stuff and file loading/saving
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

var captures = [], selected_capture = 0;

var capture_cache = {
	"ports": [], // first one is always { min: 0, max: set capture length, unit: "s"/"ms"/whatever you want }
	"values": [],
	"x1": 0, // Min x value
	"y1": 0, // Min y value
	"x2": 1, // Max x value
	"y2": 1, // Max y value
	"xy_mode": false
};

/*
 * load_file_local(are_you_sure)
 * 
 * Loads a JSON file from local storage and processes it.
 * 
 * For extra safety, it throws a warning, since loading another file
 * will erase all current work.
 */

function load_file_local(are_you_sure) {
	if(get_id("openbutton").classList.contains("navbuttondisabled")) return;

	if(captures.length > 0 && !are_you_sure) {
		// Let's not risk if we have some captures in memory

		popup_window(WINDOWID_IMPORT_OVERWRITE_WARN);
	} else {
		var element = document.createElement("input");

		element.type = "file";
		element.accept = ".coachium"

		element.onchange = () => {
			reader = new FileReader();

			reader.onload = (x) => {
				try {
					captures = JSON.parse(LZString.decompressFromUint8Array(new Uint8Array(x.target.result)));
					change_selected_capture(0, 0);

					get_id("statusmsg").innerHTML = jslang.STATUS_FILE_LOADED;
				} catch(e) {
					popup_window(WINDOWID_FILE_IMPORT_ERR);
				}
			};

			reader.readAsArrayBuffer(element.files[0]);
		};

		element.click();
	}
}

/*
 * save_file_local(name_chosen)
 * 
 * Exports a JSON file to local storage.
 */

function save_file_local(name_chosen) {
	if(get_id("savebutton").classList.contains("navbuttondisabled")) return;

	var inputfield = get_win_el_tag(WINDOWID_LOCAL_SAVE_NAME, "input");

	if(name_chosen) {
		// Generate a fictional "a" element for saving the file

		var element = document.createElement("a");
		element.setAttribute("href", window.URL.createObjectURL(new Blob([ LZString.compressToUint8Array(JSON.stringify(captures)) ], { type: "application/octet-stream" })));
		element.setAttribute("download", inputfield.value + ".coachium");
		element.click();

		get_id("statusmsg").innerHTML = jslang.STATUS_FILE_SAVED;
	} else {
		if(inputfield.value == "񂁩MISSING") {
			var d = new Date();
			var str = d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
			inputfield.value = format(jslang.DEFAULT_FILENAME, jslang.DEFAULT_USERNAME, str);

			setTimeout(() => {
				inputfield.select();
				inputfield.selectionStart = 0;
				inputfield.selectionEnd = jslang.DEFAULT_USERNAME.length;
			}, 100);
		} else {
			setTimeout(() => {
				inputfield.select();
			}, 100);
		}

		popup_window(WINDOWID_LOCAL_SAVE_NAME);
	}
}

/*
 * create_capture()
 * 
 * Pops up the dialog for initializing a new capture.
 * 
 * Automatically selects the most ideal configuration based on connected sensors.
 */

function create_capture() {
	if(get_id("capturestartbutton").classList.contains("navbuttondisabled")) return;

	zoom_reset();
	capture_setup_check();

	setTimeout(() => {
		get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupname").get_tag("input").select();
	}, 100);

	popup_window(WINDOWID_CAPTURE_SETUP);
}

/*
 * remove_capture(are_you_sure)
 * 
 * Deletes the currently selected capture from the workbook.
 */

function remove_capture(are_you_sure) {
	if(get_id("removecapturebutton").classList.contains("navbuttondisabled")) return;

	if(!are_you_sure) {
		// Better ask the user if they are sure to delete the current capture

		popup_window(WINDOWID_REMOVE_CAPTURE_WARN);
	} else {
		// Well, it's on you.

		var oldselected = selected_capture;

		captures.splice(selected_capture, 1);

		change_selected_capture(0);

		get_id("statusmsg").innerHTML = format(jslang.STATUS_CAPTURE_REMOVED, oldselected + 1);

		main_window_reset(true, false);
	}
}

/*
 * remove_all_captures(are_you_sure)
 * 
 * Removes all captures from the current workbook.
 */

function remove_all_captures(are_you_sure) {
	if(get_id("removeeverythingbutton").classList.contains("navbuttondisabled")) return;

	if(!are_you_sure) {
		// Better ask the user if they are sure to nuke literally everything

		popup_window(WINDOWID_NUKE_EVERYTHING_WARN);
	} else {
		// Well, it's on you.

		captures = [];
		change_selected_capture(0, 0);

		get_id("statusmsg").innerHTML = jslang.STATUS_ALL_REMOVED;
	}
}
