/*
 * Coachium - js/modules/gdrive.js
 * - handles communication with gdrive.html
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

// Google OAuth token client

var token_client;

// Flags for initialization of each loaded component

var gapi_inited = false;
var gis_inited = false;

// Requested access token and its validity

var access_token = null;
var token_validity = null;

// Views for Google 

var gdrive_docs_view = null;
var gdrive_picker = null;

// Google error class

class GoogleServicesError extends Error {
	constructor(message) {
		super(message);
		this.name = "GoogleServicesError";
	}
}

/*
 * gapi_init()
 * 
 * Initializes the Google API when it is loaded.
 */

function gapi_init() {
	gapi.load('client:picker', async () => {
		await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
		gapi_inited = true;
		gdrive_ready();
	});
}

/*
 * gapi_init()
 * 
 * Initializes the Google Identity Services when they are loaded.
 */

function gis_init() {
	token_client = google.accounts.oauth2.initTokenClient({
		client_id: '883835263732-tlmcuubn46btmrprh474vtqsfls1ccg9.apps.googleusercontent.com',
		scope: 'https://www.googleapis.com/auth/drive.file',
	});

	gis_inited = true;
	gdrive_ready();
}

/*
 * gdrive_ready()
 * 
 * Checks whether GAPI & GIS have both loaded correctly.
 * If the Google Services were reloaded in case of error,
 * the last performed operation will also be retried.
 */

var gdrive_ready_cb = null;

function gdrive_ready() {
	if(gapi_inited && gis_inited) {
		if(gdrive_ready_cb !== null) {
			gdrive_ready_cb(true); // Will be a file operation which has already been confirmed
			gdrive_ready_cb = null;
		}
	}
}

/*
 * gdrive_get_token(succ_cb)
 * 
 * Returns true if the current access token is valid.
 * If not, it will try to get one. If it succeeds,
 * it will call the provided callback.
 */

function gdrive_get_token(succ_cb) {
	if(access_token === null || token_validity < window.performance.now()) {
		token_client.callback = (response) => {
			access_token = response.access_token;
			token_validity = window.performance.now() + (response.expires_in - 60) * 1000; // Subtract a minute, to be safe
			succ_cb(true);
		}

		token_client.requestAccessToken();

		return false;
	} else {
		return true;
	}
}

/*
 * gdrive_is_loaded(succ_cb)
 * 
 * Returns whether Google Services were successfully loaded.
 * If not, it also pops up an error dialog with an option
 * to attempt to reload them.
 * 
 * If they manage to load again, the callback will be called
 * with a single parameter - true.
 */

function gdrive_is_loaded(succ_cb) {
	if(!gapi_inited || !gis_inited) {
		gdrive_ready_cb = succ_cb;

		popup_window(WINDOWID_GDRIVE_SUBSYS_ERR);

		return false;
	}

	return true;
}

/*
 * gdrive_save_file(name_chosen)
 * 
 * If the Google Services were successfully loaded,
 * pops up the name dialog, saves the file
 * and displays a link to it.
 */

function gdrive_save_file(name_chosen) {
	if(get_id("savegdrivebutton").classList.contains("navbuttondisabled")) return;

	if(gdrive_is_loaded(gdrive_save_file) && gdrive_get_token(gdrive_save_file)) {
		// Thank you, kind stranger: https://stackoverflow.com/a/35182924

		if(!name_chosen) {
			// TODO - consolidate this into a file save single dialog

			inputfield = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input");

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

			popup_window(WINDOWID_GDRIVE_NAME);
		} else {
			popup_window(WINDOWID_GDRIVE_WORKING);
			
			var name = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input").value;

			var metadata = {
				'name': name + ".coachium",
				'mimeType': 'application/octet-stream'
			};

			var payload = new FormData();
			payload.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
			payload.append('file', new Blob([new Uint8Array(Array.from(generate_save_data()))]));

			xhr = new XMLHttpRequest();
			xhr.responseType = 'json';
			xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
			xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
			xhr.onloadend = () => {
				close_window(WINDOWID_GDRIVE_WORKING);

				if(!xhr.response.id) {
					throw new GoogleServicesError(xhr.response);
				} else {
					get_win_el_tag(WINDOWID_GDRIVE_SAVE_OK, "a").href = "https://drive.google.com/file/d/" + xhr.response.id;
					popup_window(WINDOWID_GDRIVE_SAVE_OK);				
				}
			};
			xhr.send(payload);
		}
	}
}

/*
 * gdrive_load_file(are_you_sure)
 * 
 * If the Google Services were successfully loaded,
 * pops up a Google Drive Picker and if a file is selected,
 * it is loaded.
 * 
 * For extra safety, it throws a warning, since loading another file
 * will erase all current work.
 */

function gdrive_load_file(are_you_sure) {
	if(get_id("opengdrivebutton").classList.contains("navbuttondisabled")) return;

	if(can_safely_load(gdrive_load_file, are_you_sure) && gdrive_is_loaded(gdrive_load_file) && gdrive_get_token(gdrive_load_file)) {
		if(gdrive_docs_view === null) {
			gdrive_docs_view = new google.picker.DocsView();
			gdrive_docs_view.setMimeTypes("application/octet-stream");
			gdrive_docs_view.setMode(google.picker.DocsViewMode.LIST);
			gdrive_docs_view.setQuery("*.coachium");	
		}

		if(gdrive_picker === null) {
			gdrive_picker = new google.picker.PickerBuilder()
				.enableFeature(google.picker.Feature.NAV_HIDDEN)
				.setDeveloperKey("AIzaSyDs-Sd-vYMoCDzZG4m4vzisNjBJzRimQ5s")
				.setAppId("883835263732")
				.setOAuthToken(access_token)
				.addView(gdrive_docs_view)
				.addView(new google.picker.DocsUploadView())
				.setCallback(async (data) => {
					if(data.action === google.picker.Action.PICKED && data[google.picker.Response.DOCUMENTS][0].id) {
						var id = data[google.picker.Response.DOCUMENTS][0].id;

						popup_window(WINDOWID_GDRIVE_WORKING);

						xhr = new XMLHttpRequest();
						xhr.responseType = "arraybuffer";
						xhr.open('get', 'https://www.googleapis.com/drive/v3/files/' + id + '?alt=media');
						xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
						xhr.onloadend = () => {
							close_window(WINDOWID_GDRIVE_WORKING);

							if(!xhr.response) {
								throw new GoogleServicesError(JSON.stringify(xhr, null, 2));
							} else {
								parse_loaded_data(xhr.response);
							}
						};
						xhr.send(null);
					}
				})
				.setLocale(lang)
				.build();	
		}

		gdrive_picker.setVisible(true);
	}
}

/*
 * gdrive_reload()
 * 
 * Attempts to reload the Google Services.
 */

function gdrive_reload() {
	// Unload Google Services' scripts

	var gapi = get_id("gdrive_script_gapi");
	var gis = get_id("gdrive_script_gis");

	if(gapi) gapi.remove();
	if(gis) gis.remove();

	// Reset all GDrive variables to their default

	gapi_inited = false;
	gis_inited = false;

	access_token = null;
	token_validity = null;

	gdrive_docs_view = null;
	gdrive_picker = null;

	// Load the Google API

	gapi = document.createElement("script");
	gapi.id = "gdrive_script_gapi";
	gapi.async = true;
	gapi.defer = true;
	gapi.onload = () => { gapi_init(); }
	gapi.src = "https://apis.google.com/js/api.js";

	document.body.appendChild(gapi);

	// Load the Google Identity Services

	gis = document.createElement("script");
	gis.id = "gdrive_script_gis";
	gis.async = true;
	gis.defer = true;
	gis.onload = () => { gis_init(); }
	gis.src = "https://accounts.google.com/gsi/client";

	document.body.appendChild(gis);
}
