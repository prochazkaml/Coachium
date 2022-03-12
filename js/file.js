/*
 * Coachium - file.js
 * - handles all workbook related stuff and file loading/saving
 * 
 * Made by Michal Procházka, 2021-2022.
 */

/*
 * load_file_local(are_you_sure)
 * 
 * Loads an XML file from local storage and processes it.
 * 
 * For extra safety, it throws a warning, since loading another file
 * will erase all current work.
 */

function load_file_local(are_you_sure) {
	if(get_id("openbutton").style.filter) return;

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
				captures = JSON.parse(x.target.result);
				change_selected_capture(0, 0);

				get_id("statusmsg").innerHTML = jslang.STATUS_FILE_LOADED;
			};

			reader.readAsText(element.files[0]);
		};

		element.click();
	}
}

/*
 * save_file_local(name_chosen)
 * 
 * Exports an XML file to local storage.
 */

function save_file_local(name_chosen) {
	if(get_id("savebutton").style.filter) return;

	var inputfield = get_win_el_tag(WINDOWID_LOCAL_SAVE_NAME, "input");

	if(name_chosen) {
		// Generate a fictional "a" element for saving the file

		var element = document.createElement("a");
		element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(captures)));
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
	zoom_reset();
	
	if(ports[0].connected && ports[1].connected) {
		// We are going to capture from both sensors

		get_id("capturesetupsensors").selectedIndex = 0;
	} else if(ports[1].connected) {
		// From only the first sensor

		get_id("capturesetupsensors").selectedIndex = 2;
	} else {
		// From only the second sensor

		get_id("capturesetupsensors").selectedIndex = 1;
	}

	setTimeout(() => {
		get_id("capturesetupname").select();
	}, 100);

	popup_window(WINDOWID_CAPTURE_SETUP);
	capture_setup_check();
}

/*
 * remove_capture(are_you_sure)
 * 
 * Deletes the currently selected capture from the workbook.
 */

function remove_capture(are_you_sure) {
	if(get_id("removecapturebutton").style.filter) return;

	if(!are_you_sure) {
		// Better ask the user if they are sure to delete the current capture

		popup_window(WINDOWID_REMOVE_CAPTURE_WARN);
	} else {
		// Well, it's on you.

		var oldselected = selectedcapture;

		captures.splice(selectedcapture, 1);

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
	if(get_id("removeeverythingbutton").style.filter) return;

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
