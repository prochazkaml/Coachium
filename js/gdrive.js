/*
 * Coachium - js/gdrive.js
 * - handles communication with gdrive.html
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

var gdrive_response;
var gdrive_loaded = false;
var gdrive_load_cb = null;

/*
 * popup_gdrive_window()
 *
 * If the new file name has not been generated yet, perform just that.
 */

function popup_gdrive_window() {
	if(get_id("savegdrivebutton").classList.contains("navbuttondisabled")) return;

	if(!gdrive_loaded) {
		// Google Drive subsystem failed to load (in time, or at all)

		popup_window(WINDOWID_GDRIVE_SUBSYS_ERR);
	} else if(get_win_el_tag(WINDOWID_GDRIVE_NAME, "input").value == "񂁩MISSING") {
		// First attempt to communicate with the GDrive subsystem, generate an access token and get the username

		get_id("gdrive_iframe").contentWindow.postMessage("_gdriveinterface{\"cmd\":\"get_token\"}", "*");
	} else {
		setTimeout(() => {
			get_win_el_tag(WINDOWID_GDRIVE_NAME, "input").select();
		}, 100);

		popup_window(WINDOWID_GDRIVE_NAME);
	}
}

/*
 * gdrive_reload()
 * 
 * Reloads the Google Drive subsystem iframe.
 */

function gdrive_reload() {
	if(get_id("gdrive_iframe")) get_id("gdrive_iframe").remove();

	var iframe = document.createElement("iframe");
	iframe.style.display = "none";
	iframe.id = "gdrive_iframe";
	iframe.src = "https://coachium.prochazka.ml/gdrive.html";

	document.body.append(iframe);
}

/*
 * gdrive_save()
 *
 * Initializes access to Google Drive, if necessary, and saves the file.
 */

var gdrive_requested = false;

function gdrive_save() {
	gdrive_requested = true;

	var filename = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input").value;

	get_id("gdrive_iframe").contentWindow.postMessage("_gdriveinterface" + JSON.stringify({
		"cmd": "save_file_to_Drive",
		"name": filename,
		"data": Array.from(LZString.compressToUint8Array(JSON.stringify(captures)))
	}), "*");
}

/*
 * Callback for accepting messages from gdrive.html
 */

window.addEventListener('message', (response) => {
	if(response.data && response.data.source === 'gdrive_iframe') {
		gdrive_response = response.data.message[0];

		console.log(gdrive_response);

		if(gdrive_response == "loaded") {
			gdrive_loaded = true;

			if(gdrive_load_cb) gdrive_load_cb();
		} else if(gdrive_response && gdrive_response.startsWith("name:")) {
			inputfield = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input");

			if(inputfield.value == "񂁩MISSING") {
				var d = new Date();
				var str = d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
				inputfield.value = format(jslang.DEFAULT_FILENAME, gdrive_response.substring(5), str);
			}

			setTimeout(() => {
				inputfield.select();
				inputfield.selectionStart = 0;
				inputfield.selectionEnd = gdrive_response.substring(5).length;
			}, 100);

			popup_window(WINDOWID_GDRIVE_NAME);
		} else {
			if(gdrive_response && gdrive_response.includes("error")) {
				if(gdrive_requested) {
					get_win_el_tag(WINDOWID_GDRIVE_SAVE_ERR, "textarea").value = gdrive_response;
					popup_window(WINDOWID_GDRIVE_SAVE_ERR);
					gdrive_requested = false;
				} else {
					get_win_el_tag(WINDOWID_GDRIVE_GENERIC_ERR, "textarea").value = gdrive_response;
					popup_window(WINDOWID_GDRIVE_GENERIC_ERR);
				}
			} else {
				if(gdrive_requested && typeof(gdrive_response) == "string") {
					get_win_el_tag(WINDOWID_GDRIVE_SAVE_OK, "a").href = "https://drive.google.com/file/d/" + gdrive_response;
					popup_window(WINDOWID_GDRIVE_SAVE_OK);
					gdrive_requested = false;
				} else {
					get_win_el_tag(WINDOWID_GDRIVE_GENERIC_ERR, "textarea").value = gdrive_response;
					popup_window(WINDOWID_GDRIVE_GENERIC_ERR);
				}
			}
		}
	}
});
