/*
 * Coachium - gdrive_interface.js
 * - handles communication with gdrive.html
 * 
 * Made by Michal Procházka, 2021-2022.
 */

var gdrive_response;

/*
 * popup_gdrive_window()
 *
 * If the new file name has not been generated yet, perform just that.
 */

function popup_gdrive_window() {
	if(get_id("savegdrivebutton").style.filter) return;

	if(get_win_el_tag(WINDOWID_GDRIVE_NAME, "input").value == "񂁩MISSING")
		get_id("gdrive_iframe").contentWindow.postMessage("_gdriveinterface{\"cmd\":\"get_user_name\"}", "*");
	else
		popup_window(WINDOWID_GDRIVE_NAME);
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
		"data": JSON.stringify(captures),
	}), "*");
}

/*
 * Callback for accepting messages from gdrive.html
 */

window.addEventListener('message', (response) => {
	if(response.data && response.data.source === 'gdrive_iframe') {
		gdrive_response = response.data.message[0];

		console.log(gdrive_response);

		if(!gdrive_response) {
			popup_window(WINDOWID_GOOGLE_SERVICES_ERR);
		} else if(gdrive_response.startsWith("username:")) {
			gdrive_response = gdrive_response.substr(9);

			if(gdrive_response.toLowerCase().includes("error")) {
				get_win_el_tag(WINDOWID_GDRIVE_GENERIC_ERR, "textarea").value = gdrive_response;
				popup_window(WINDOWID_GDRIVE_GENERIC_ERR);
			} else {
				inputfield = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input");

				if(inputfield.value == "񂁩MISSING") {
					var d = new Date();
					var str = d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
					inputfield.value = format(jslang.DEFAULT_FILENAME, gdrive_response, str);
				}
				
				setTimeout(() => {
					inputfield.select();
				}, 100);

				popup_window(WINDOWID_GDRIVE_NAME);
			}
		} else {
			if(gdrive_response.includes("error")) {
				if(gdrive_requested) {
					get_win_el_tag(WINDOWID_GDRIVE_SAVE_ERR, "textarea").value = gdrive_response;
					popup_window(WINDOWID_GDRIVE_SAVE_ERR);
				} else {
					get_win_el_tag(WINDOWID_GDRIVE_GENERIC_ERR, "textarea").value = gdrive_response;
					popup_window(WINDOWID_GDRIVE_GENERIC_ERR);
				}
			} else {
				if(gdrive_requested) {
					get_win_el_tag(WINDOWID_GDRIVE_SAVE_OK, "a").href = "https://drive.google.com/file/d/" + gdrive_response;
					popup_window(WINDOWID_GDRIVE_SAVE_OK);
				} else {
					get_win_el_tag(WINDOWID_GDRIVE_GENERIC_ERR, "textarea").value = gdrive_response;
					popup_window(WINDOWID_GDRIVE_GENERIC_ERR);
				}
			}
		}
	}
});
