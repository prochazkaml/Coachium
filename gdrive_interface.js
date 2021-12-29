/*
 * popup_gdrive_window()
 *
 * Pokud ještě nebyl vygenerován název nového souboru, učiň tak.
 */

function popup_gdrive_window() {
	if(captures.length == 0) return;

	if(get_win_el_tag(WINDOWID_GDRIVE_NAME, "input").value == "񂁩MISSING")
		get_id("gdrive_iframe").contentWindow.get_user_name();
	else
		popup_window(WINDOWID_GDRIVE_NAME);
}

/*
 * gdrive_save()
 *
 * Inicializuje přístup k Google Disku, pokud je to potřeba, a uloží soubor záznamu.
 */

var gdrive_requested = false;

function gdrive_save() {
	gdrive_requested = true;

	var filename = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input").value;

	get_id("gdrive_iframe").contentWindow.save_file_to_Drive(
		filename, xml_export(filename));
}

/*
 * Callback na přijímání zpráv od google.html
 */

window.addEventListener('message', (response) => {
	if(response.data && response.data.source === 'gdrive_iframe') {
		gdrive_response = response.data.message[0];

		console.log(gdrive_response);

		if(gdrive_response.startsWith("username:")) {
			gdrive_response = gdrive_response.substr(9);

			if(gdrive_response.includes("error")) {
				get_win_el_tag(WINDOWID_GDRIVE_GENERIC_ERR, "textarea").value = gdrive_response;
				popup_window(WINDOWID_GDRIVE_GENERIC_ERR);
			} else {
				inputfield = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input");

				if(inputfield.value == "񂁩MISSING") {
					var d = new Date();
					var str = d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
					inputfield.value = gdrive_response + " - Laboratorní práce " + str;
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
