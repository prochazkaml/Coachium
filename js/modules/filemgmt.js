/*
 * Coachium - js/modules/filemgmt.js
 * - handles file loading/saving
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

/*
 * new_file(are_you_sure)
 * 
 * Removes all captures from the current workbook.
 */

function new_file(are_you_sure) {
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
					var data = JSON.parse(LZString.decompressFromUint8Array(new Uint8Array(x.target.result)));

					// Detect "version 0" files

					if(Array.isArray(data)) {
						captures = data;
					} else {
						captures = data.captures;
					}

					change_selected_capture(0, 0);

					get_id("statusmsg").innerHTML = jslang.STATUS_FILE_LOADED;
				} catch(e) {
					console.log(e);
					popup_window(WINDOWID_FILE_IMPORT_ERR);
				}
			};

			reader.readAsArrayBuffer(element.files[0]);
		};

		element.click();
	}
}

/*
 * generate_save_data()
 * 
 * Returns a Uint8Array containing binary data for saving.
 */

function generate_save_data() {
	return LZString.compressToUint8Array(JSON.stringify({
		coachium_version: 1,
		captures: captures
	}));
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

		save_file(
			generate_save_data(),
			inputfield.value + ".coachium",
			"application/octet-stream"
		);

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
 * save_file(data, name, type)
 * 
 * Saves a file, which will contain supplied data.
 */

function save_file(data, name, type) {
	var element = document.createElement("a");
	element.setAttribute("href", window.URL.createObjectURL(new Blob([ data ], { type: type })));
	element.setAttribute("download", name);
	element.click();
}
