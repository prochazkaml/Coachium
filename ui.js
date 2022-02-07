/*
 * Coachium - ui.js
 * - handles most UI stuff
 * 
 * Made by Michal Procházka, 2021-2022.
 */

/*
 * popup_window(id)
 *
 * Pops up a window according to the given ID.
 * 
 * For all possible window IDs, see the top of common.js.
 */

function popup_window(id) {
	if(!(openwindow >= 0 && windowstack[openwindow] == id)) {
		console.log("Requested " + id);
		openwindow++;

		windowstack[openwindow] = id;

		get_win_overlay(id).style.zIndex = zindex++;
		get_win_overlay(id).style.pointerEvents = "auto";
		get_win_overlay(id).style.opacity = 1;
		get_win(id).style.transform = "scale(1)";
	}
}

/*
 * close_window()
 *
 * Closes the currently open window.
 */

function close_window() {
	if(openwindow >= 0) {
		var win = windowstack[openwindow];
		openwindow--;

		get_win_overlay(win).style.pointerEvents = "";
		get_win_overlay(win).style.opacity = "";
		get_win(win).style.transform = "";
	}
}

/*
 * confirm_window()
 *
 * Presses the first button in the window, which always means
 * to confirm something.
 */

function confirm_window() {
	if(openwindow >= 0) {
		get_win_el_class(windowstack[openwindow], "windowbutton").click();
	}
}

/*
 * get_win(win_id)
 * get_win_el_id(win_id, el_id)
 * get_win_el_class(win_id, el_class, index)
 * get_win_el_tag(win_id, el_tag, index)
 *
 * Returns the entire window's DOM object or an element contained within
 * (by id, class name or tag name). Useful for manipulating with the windows.
 * 
 * If the function accepts the parameter "index" and it is not explicitly
 * stated, the function will assume 0 as the default.
 */

function get_win_overlay(win_id) {
	return get_id("window" + win_id + "overlay");
}

function get_win(win_id) {
	return get_win_overlay(win_id).getElementsByClassName("popupwindow")[0];
}

function get_win_el_id(win_id, el_id) {
	return get_win(win_id).getElementById(el_id);
}

function get_win_el_class(win_id, el_class, index = 0) {
	return get_win(win_id).getElementsByClassName(el_class)[index];
}

function get_win_el_tag(win_id, el_tag, index = 0) {
	return get_win(win_id).getElementsByTagName(el_tag)[index];
}

/*
 * ui_connect()
 *
 * Does the fancy initial animation when the interface is selected.
 */

var launched = 0;

function ui_connect(actually_connect) {
	launched = 1;

	if(actually_connect) {
		setTimeout(() => {
			if(!verified) {
				get_id("receivedsum").innerHTML = jslang.CHECKSUM_NOT_RESPONDING;
				popup_window(WINDOWID_INVALID_CHECKSUM);
			}
		}, 300);
	}

	if(get_id("introerrmsg")) {
		get_id("initialheader").style.flex = "0";
		get_id("initialheader").innerHTML = "";

		header.style.height = "3em";
		header.style.padding = ".5em 1em";
		
		get_id("navcontents").style.display = "flex";

		get_id("introerrmsg").remove();
	
		get_id("headercontents").style.opacity = 0;
	
		nav.style.height = "2.5em";
		footer.style.height = "6em";

		setTimeout(() => {
			get_id("connectbuttonguest").remove();

			get_id("introimg").style.height = "3em";
			get_id("connectbutton").style.margin = "0";
			get_id("connectbutton").style.width = "calc(907 / 200 * 3em - 1em)";
			if(actually_connect) get_id("connectbutton").innerHTML = jslang.BUTTON_DISCONNECT;

			header.style.height = "auto";
			nav.style.height = "auto";
			main.style.opacity = 1;
			footer.style.height = "auto";

			get_id("statusmsg").innerHTML = jslang.STATUS_WELCOME;

			get_id("headercontents").style.flexDirection = "row";

			get_id("navcontents").style.opacity =
			get_id("headercontents").style.opacity =
			get_id("footercontents").style.opacity = 1;

			// Automatically resizes the canvas when the window is resized

			window.addEventListener('resize', main_window_reset, false);
			window.addEventListener('deviceorientation', main_window_reset, false);

			main_window_reset();
		}, 350);
	} else {
		get_id("statusmsg").innerHTML = jslang.STATUS_WELCOME;
		get_id("connectbutton").innerHTML = jslang.BUTTON_DISCONNECT;
		nav.style.backgroundColor =
		header.style.backgroundColor =
		footer.style.backgroundColor = "";
	}

	get_id("port1").style.backgroundColor =
	get_id("port2").style.backgroundColor = "";

	get_id("port1status").innerHTML = 
	get_id("port2status").innerHTML = jslang.SENSOR_DISCONNECTED;

	get_id("port1value").innerHTML = 
	get_id("port2value").innerHTML = "–";

	// Show that popup dialog when the user tries to leave the size

	if(location.hostname != "localhost") window.onbeforeunload = () => {
		return true;
	};
}

/*
 * ui_disconnect()
 *
 * Makes the connect button appear again. Yay.
 */

function ui_disconnect() {
	get_id("statusmsg").innerHTML = jslang.STATUS_DISCONNECTED;
	get_id("connectbutton").innerHTML = htmllang.BUTTON_CONNECT;
}

/*
 * capture_setup_check()
 *
 * Check the validity of all input parameters for initializing the capture
 */

function capture_setup_check() {
	var string = "";

	var oldfreq = get_id("capturesetuphz").value;
	var units = round(10000 / oldfreq);

	var newfreq;

	if(get_id("capturesetupsensors").selectedIndex) {
		if(units)
			newfreq = 10000 / units;
		else
			newfreq = 40000;
	} else {
		if(units < 2) units = 2;

		newfreq = 10000 / units;
	}

	if(round(oldfreq, 2) != round(newfreq, 2)) string += "<p>" + format(jslang.SETUP_CLOSEST_USABLE_FREQ, round(newfreq, 2)) + "</p>";

	var samples = round(newfreq * get_id("capturesetupsecs").value);

	if(samples > (get_id("capturesetupsensors").selectedIndex ? 16383 : 8191)) {
		if(get_id("capturesetupsensors").selectedIndex)
			string += "<p>" + format(jslang.SETUP_REDUCED_RUNTIME, round(16383 / newfreq, 2)) + "</p>";
		else
			string += "<p>" + format(jslang.SETUP_REDUCED_RUNTIME, round(8191 / newfreq, 2)) + "</p>";
	}

	get_id("capturesetuperr").innerHTML = string;

	var sensors_err = false;

	switch(get_id("capturesetupsensors").selectedIndex) {
		case 0:
			if(!ports[1].connected)
				sensors_err = true;
				
			// break is missing here on purpose

		case 1:
			if(!ports[0].connected)
				sensors_err = true;

			break;

		case 2:
			if(!ports[1].connected)
				sensors_err = true;

			break;
	}

	get_id("capturesetupsensorserr").innerHTML = sensors_err ? ("<p>" + jslang.SETUP_SENSOR_ERR + "</p>") : "";
	
	const startbutton = get_win_el_class(WINDOWID_CAPTURE_SETUP, "windowbutton");

	startbutton.style.backgroundColor = sensors_err ? "rgba(0, 0, 0, .1)" : "";
	startbutton.onclick = sensors_err ? (() => {}) : (() => { close_window(); requestcapture = 1; });

	return sensors_err;
}

/*
 * change_selected_capture(interval)
 * 
 * Changes the currently selected capture for another one.
 */

function change_selected_capture(interval) {
	if(interval < 0 && get_id("viewpreviousbutton").style.filter) return; 
	if(interval > 0 && get_id("viewnextbutton").style.filter) return; 

	if(captures.length > 0) {
		selectedcapture += interval;

		if(selectedcapture < 0)
			selectedcapture = 0;
		else if(selectedcapture >= captures.length)
			selectedcapture = captures.length - 1;
	}

	main_window_reset();
}

/*
 * change_capture_view()
 * 
 * Changes the view on the current capture. Switches between a table or a graph.
 */

function change_capture_view() {
	const c_visible = canvas.style.display != "none";

	if(c_visible) {
		canvas.style.display = "none";
		table.style.display  = "";
		main.style.overflowY = "scroll";

		get_id("viewastablebutton").style.display = "none";
		get_id("viewasgraphbutton").style.display = "";
	} else {
		canvas.style.display = "block";
		table.style.display  = "none";
		main.style.overflowY = "hidden";

		get_id("viewastablebutton").style.display = "";
		get_id("viewasgraphbutton").style.display = "none";
	}

	main_window_reset();
	update_button_validity();
}

/*
 * request_zoom_in()
 * 
 * Prompts the user to select a region, or aborts the current zoom request.
 */

function request_zoom_in() {
	if(get_id("zoominbutton").style.filter) return;

	if(!zoom_request_progress) {
		get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_IN_REQUEST;
		zoom_request_progress = 1;
		zoom_move_request = false;
		canvas.style.cursor = "crosshair";
		canvas_reset(CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE);
	} else {
		get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_IN_CANCEL;
		zoom_request_progress = 0;
		zoom_move_request = false;
		canvas.style.cursor = "auto";
		canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
	}
}

/*
 * zoom_reset()
 * 
 * Resets the zoom on the graph.
 */

function zoom_reset() {
	if(get_id("zoomresetbutton").style.filter) return;

	get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_RESET;
	zoom_request_progress = 0;
	zoomed_in = false;

	update_button_validity();
	main_window_reset();
}

/*
 * info_generate_sensor(sensor)
 * 
 * Generates a HTML description for a sensor object.
 */

function info_generate_sensor(sensor) {
	var out = "<div style=\"padding:.5em;margin:1em 0;background-color:" + sensor.color + "\">";

	out += format(jslang.INFO_WINDOW_SENSOR,
		sensor.id,
		sensor.name,
		localize_num(round(sensor.min_value, 2)),
		localize_num(round(sensor.max_value, 2)),
		sensor.unit
	);
	
	out += "</div>";

	return out;
}

/*
 * show_capture_info()
 * 
 * If possible, show the information about the currently selected capture.
 */

function show_capture_info() {
	if(get_id("captureinfobutton").style.filter) return;

	const capture = captures[selectedcapture];

	var str = format(jslang.INFO_WINDOW_CONTENTS,
		capture.samples,
		capture.samples / (capture.sensorsetup ? 1 : 2),
		localize_num(round(10000 / capture.interval, 2)),
		capture.seconds
	);

	switch(capture.sensorsetup) {
		case 0:
			str += info_generate_sensor(capture.port_a);
			// break is, again, missing here on purpose
		
		case 2:
			str += info_generate_sensor(capture.port_b);
			break;

		case 1:
			str += info_generate_sensor(capture.port_a);
			break;
	}

	get_win_el_tag(WINDOWID_CAPTURE_INFO, "div").innerHTML = str;

	popup_window(WINDOWID_CAPTURE_INFO);
}

/*
 * capture_management()
 * 
 * Initializes the data for the capture manager and opens it.
 */

function capture_management() {
	if(get_id("capturemgmtbutton").style.filter) return;

	const w = WINDOWID_CAPTURE_MANAGEMENT;
	const select = get_win_el_tag(w, "select");
	const input = get_win_el_tag(w, "input");

	select.innerHTML = "";

	for(var i = 0; i < captures.length; i++) {
		var option = document.createElement("option");
		option.innerHTML = (i + 1) + ") " + captures[i].title;
	
		select.appendChild(option);
	}

	select.onchange = () => {
		input.value = captures[select.selectedIndex].title;
		get_win_el_class(w, "windowbutton").style.backgroundColor = "rgba(0, 0, 0, .1)";
		selectedcapture = select.selectedIndex;
		main_window_reset();
	}
	
	input.oninput = () => {
		get_win_el_class(w, "windowbutton").style.backgroundColor =
			(input.value == captures[selectedcapture].title) ? "rgba(0, 0, 0, .1)" : "";
	}

	get_win_el_class(w, "windowbutton", 0).onclick = () => {
		captures[selectedcapture].title = input.value;
		capture_management();
	}

	get_win_el_class(w, "windowbutton", 1).onclick = () => {
		if(selectedcapture > 0) {
			const capture = captures[selectedcapture];
			captures[selectedcapture] = captures[selectedcapture - 1];

			selectedcapture--;
			captures[selectedcapture] = capture;

			capture_management();
		}
	}

	get_win_el_class(w, "windowbutton", 2).onclick = () => {
		if((selectedcapture + 1) < captures.length) {
			const capture = captures[selectedcapture];
			captures[selectedcapture] = captures[selectedcapture + 1];

			selectedcapture++;
			captures[selectedcapture] = capture;

			capture_management();
		}
	}

	get_win_el_tag(w, "option", selectedcapture).selected = true;
	select.onchange();

	popup_window(w);
}

/*
 * update_button_validity()
 * 
 * Checks each (influenceble) button on the top bar if it is currently valid or not.
 */

function update_button_validity() {
	if(capturerunning) {
		get_id("capturestopbutton").style.display = "";
		get_id("capturestartbutton").style.display = "none";

		get_id("removeeverythingbutton").style.filter = "contrast(0)";
		get_id("openbutton").style.filter = "contrast(0)";
		get_id("savebutton").style.filter = "contrast(0)";
		get_id("savegdrivebutton").style.filter = "contrast(0)";

		get_id("removecapturebutton").style.filter = "contrast(0)";
		get_id("capturemgmtbutton").style.filter = "contrast(0)";

		get_id("viewpreviousbutton").style.filter = "contrast(0)";
		get_id("viewnextbutton").style.filter = "contrast(0)";
		get_id("zoominbutton").style.filter = "contrast(0)";
		get_id("zoomresetbutton").style.filter = "contrast(0)";

		get_id("captureinfobutton").style.filter = "contrast(0)";
	} else {
		get_id("capturestartbutton").style.display = "";
		get_id("capturestopbutton").style.display = "none";	

		get_id("openbutton").style.filter = "";

		if(captures.length == 0) {
			get_id("removeeverythingbutton").style.filter = "contrast(0)";
			get_id("removecapturebutton").style.filter = "contrast(0)";
			get_id("capturemgmtbutton").style.filter = "contrast(0)";
			get_id("savebutton").style.filter = "contrast(0)";
			get_id("savegdrivebutton").style.filter = "contrast(0)";
			get_id("viewpreviousbutton").style.filter = "contrast(0)";
			get_id("viewnextbutton").style.filter = "contrast(0)";
			get_id("zoominbutton").style.filter = "contrast(0)";
			get_id("zoomresetbutton").style.filter = "contrast(0)";
			get_id("captureinfobutton").style.filter = "contrast(0)";
		} else {
			get_id("removeeverythingbutton").style.filter = "";
			get_id("removecapturebutton").style.filter = "";
			get_id("capturemgmtbutton").style.filter = "";
			get_id("savebutton").style.filter = "";
			get_id("savegdrivebutton").style.filter = "";
			get_id("captureinfobutton").style.filter = "";

			if(canvas.style.display != "none") {
				get_id("zoominbutton").style.filter = "";

				if(zoomed_in)
					get_id("zoomresetbutton").style.filter = "";
				else
					get_id("zoomresetbutton").style.filter = "contrast(0)";

			} else {
				get_id("zoominbutton").style.filter = "contrast(0)";
				get_id("zoomresetbutton").style.filter = "contrast(0)";
			}

			if(selectedcapture == 0)
				get_id("viewpreviousbutton").style.filter = "contrast(0)";
			else
				get_id("viewpreviousbutton").style.filter = "";

			if(selectedcapture >= (captures.length - 1))
				get_id("viewnextbutton").style.filter = "contrast(0)";
			else
				get_id("viewnextbutton").style.filter = "";
		}
	}
}

/*
 * The page has loaded, hooray!
 */

window.onload = () => {
	document.getElementsByTagName("html")[0].style.opacity = 1;

	// Initialize constants for making the code simpler

	header = document.getElementsByTagName("header")[0];
	nav = document.getElementsByTagName("nav")[0];
	main = document.getElementsByTagName("main")[0];
	footer = document.getElementsByTagName("footer")[0];
	canvas = document.getElementsByTagName("canvas")[0];
	ctx = canvas.getContext("2d");
	table = get_id("table");
	
	// Initialize the connect button

	get_id("connectbutton").onclick = () => {
		if(!connected) {
			webhid_connect();
		} else {
			webhid_disconnect();
		}
	};

	get_id("connectbuttonguest").onclick = () => { ui_connect(false); }

	// Initialize all the callbacks on the canvas

	canvas.addEventListener("mousemove", canvasmousemovehandler);
	canvas.addEventListener("mousedown", () => { canvasmousechangehandler(1); });
	canvas.addEventListener("mouseup", () => { canvasmousechangehandler(0); });

	// Check the current git commit version against GitHub

	var github_request = new XMLHttpRequest();

    github_request.onreadystatechange = function() { 
        if (github_request.readyState == 4) {
			if(github_request.status == 200) {
				var sha1 = JSON.parse(github_request.responseText)["sha"];

				if(sha1 == undefined) {
					if(get_class("L18N_HOMEPAGE_COMMIT_CHECKING"))
						get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
				} else {
					var local_request = new XMLHttpRequest();
		
					local_request.onreadystatechange = function() { 
						if (local_request.readyState == 4) {
							if(local_request.status == 200) {
								var sha2 = local_request.responseText;

								if(sha1.substring(0, 7) == sha2.substring(0, 7)) {
									if(get_class("L18N_HOMEPAGE_COMMIT_CHECKING"))
										get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = 
											format(jslang.HOMEPAGE_COMMIT_OK, sha1.substring(0, 7));
								} else {
									if(get_class("L18N_HOMEPAGE_COMMIT_CHECKING"))
										get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = 
											format(jslang.HOMEPAGE_COMMIT_OLD, sha2.substring(0, 7), sha1.substring(0, 7));
								}
							} else {
								if(get_class("L18N_HOMEPAGE_COMMIT_CHECKING"))
									get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
							}
						} 
					}
		
					local_request.open("GET", "./.git/refs/heads/master", true); // true for asynchronous 
					local_request.send(null);
				}
			} else {
				if(get_class("L18N_HOMEPAGE_COMMIT_CHECKING"))
					get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
			}
		} 
    }

    github_request.open("GET", "https://api.github.com/repos/prochazkaml/Coachium/commits/master", true);
    github_request.send(null);
}

/*
 * Keyboard callback for handling keyboard shortcuts.
 */

document.addEventListener('keydown', (event) => {
	if(!launched) return;

	console.log(event.key);
	
	if(openwindow >= 0) {
		switch(event.key) {
			case "Escape":
				close_window();
				break;
	
			case "Enter":
				confirm_window();
				break;
		}
	} else {
		if(event.ctrlKey) switch(event.key) {
			case "o":
				event.preventDefault();
				load_file_local(false);
				break;

			case "s":
				event.preventDefault();
				save_file_local(false);
				break;

			case "S":
				event.preventDefault();
				popup_gdrive_window();
				break;

		} else switch(event.key) {
			case " ":
				event.preventDefault();
				
				if(!capturerunning)
					create_capture();
				else
					requestcapture = 1;

				break;

			case "t":
				change_capture_view();
				break;

			case "i":
				show_capture_info();
				break;

			case "m":
				capture_management();
				break;

			case "ArrowLeft":
			case "PageUp":
				event.preventDefault();
				change_selected_capture(-1);
				break;

			case "ArrowRight":
			case "PageDown":
				event.preventDefault();
				change_selected_capture(1);
				break;

			case "Delete":
				event.preventDefault();
				remove_capture(false);
				break;

			case "Escape":
				event.preventDefault();
				if(zoom_request_progress) request_zoom_in();
				break;

			case "+":
				request_zoom_in();
				break;

			case "=":
				zoom_reset();
				break;
		}
	}
});

/*
 * Error handler for the entire application
 */

window.onerror = (msg, file, line) => {
	get_win_el_tag(WINDOWID_JS_ERR, "textarea").value =
		"\"" + file + "\" @ " + line + ":\n\n" + msg;

	popup_window(WINDOWID_JS_ERR);
	return false;
}

