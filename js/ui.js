/*
 * Coachium - js/ui.js
 * - handles some important UI stuff
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
 * ui_hardware_change_trigger()
 * 
 * This function should be called whenever a following hardware change occurs:
 * - sensor/device gets connected/disconnected
 * - capture is started/stopped
 * 
 * Handles all UI changes when such change happens.
 */

function ui_hardware_change_trigger() {
	update_port_popup();
	capture_setup_check();
	update_button_validity();
}

/*
 * ui_connect(actually_connect)
 *
 * Does the fancy initial animation when an interface is selected
 * or the application enters guest mode.
 */

var launched = 0;

function ui_connect(actually_connect) {
	ui_hardware_change_trigger();

	launched = 1;

	const first_run = !!get_id("introerrmsg");

	const plist = get_id("footercontents");

	if(first_run) {
		get_id("initialheader").style.flex = "0";
		get_id("initialheader").innerHTML = "";

		header.style.height = "48px";
		header.style.padding = "8px 16px";

		get_id("navcontents").style.display = "flex";

		get_id("introerrmsg").remove();

		get_id("headercontents").style.opacity = 0;

		nav.style.height = "40px";

		setTimeout(() => {
			get_id("connectbuttonguest").remove();

			get_id("introimg").style.height = "48px";
			get_id("connectbutton").style.margin = "0";
			get_id("connectbutton").style.width = "calc(907 / 200 * 48px - 16px)";
			if(actually_connect) get_id("connectbutton").innerHTML = jslang.BUTTON_DISCONNECT;

			header.style.height = "auto";
			nav.style.height = "auto";
			main.style.opacity = 1;
//			footer.style.height = "auto";

			get_id("statusmsg").innerHTML = jslang.STATUS_WELCOME;

			get_id("headercontents").style.flexDirection = "row";

			get_id("navcontents").style.opacity =
			get_id("headercontents").style.opacity =
			get_id("footercontents").style.opacity = 1;

			// Automatically resizes the canvas when the window is resized

			window.addEventListener('resize', () => {
				main_window_reset(false, true);
				close_popup_listener({"force": true});

				for(var i = 0; i <= open_window; i++) {
					var win = get_win(window_stack[i]);

					if(win_can_pass_events(window_stack[i])) win_force_bounds(win);
				}
			}, false);

			window.addEventListener('deviceorientation', () => {
				main_window_reset(false, true);
				close_popup_listener({"force": true});
			}, false);

			plist.style.display = "";

			main_window_reset(true, true);
		}, 350);
	} else {
		get_id("statusmsg").innerHTML = jslang.STATUS_WELCOME;
		get_id("connectbutton").innerHTML = jslang.BUTTON_DISCONNECT;
		nav.style.backgroundColor =
		header.style.backgroundColor =
		footer.style.backgroundColor = "";
	}

	// Update footer

	plist.innerHTML = "";

	if(driver !== null && Object.keys(driver.ports).length > 0) {
		// Create port <div>s

		for(const port in driver.ports) {
			plist.innerHTML +=
				"<div id='port" + port + "' class='sensorblock port' onclick='port_popup(\"" + port + "\");'>" +
					"<div id='port" + port + "value'></div>" +
					"<div class='portstatus' id='port" + port + "status'>" + jslang.SENSOR_DISCONNECTED + "</div>" +
					"<div id='port" + port + "unit'></div>" +
					"<div class='portcorner'>" + 
						"<span id='port" + port + "cornername' title='" + format(jslang.SENSOR_PORT_CONNECTED, port) + "'>" + port + "</span> " +
						"<span class='portintelligenticon' id='port" + port + "intelligenticon' style='display: none;' title='" + jslang.SENSOR_INTELLIGENT + "'></span>" +
					"</div>" +
				"</div>";
		}

		footer.style.width = "";
	} else {
		footer.style.width = "0";
	}

	if(!first_run) main_window_reset(true, true);
	
	// Show that popup dialog when the user tries to leave the size

	if(location.hostname != "localhost") window.onbeforeunload = () => {
		return true;
	};
}

/*
 * ui_disconnect(forceful)
 *
 * Makes the connect button appear again. Yay.
 * 
 * Changes to a flashy red theme if forceful disconnection occured!
 */

function ui_disconnect(forceful) {
	driver = null;
	capture_running = false;
	request_capture = false;

	get_id("connectbutton").innerHTML = htmllang.BUTTON_CONNECT;

	if(!forceful) {
		get_id("statusmsg").innerHTML = jslang.STATUS_DISCONNECTED;
	} else {
		get_id("statusmsg").innerHTML = jslang.STATUS_FORCE_DISCONNECTED;

		nav.style.backgroundColor = "#FAA";
		header.style.backgroundColor = "#F00";
		footer.style.backgroundColor = "#F00";
	}

	ui_hardware_change_trigger();
}

/*
 * update_button_validity()
 * 
 * Checks each (influenceble) button on the top bar if it is currently valid or not.
 */

function update_button_validity() {
	if(driver === null || Object.keys(driver.ports).length == 0) {
		get_id("capturestartbutton").classList.add("navbuttondisabled");
		get_id("capturestopbutton").classList.add("navbuttondisabled");
	} else {
		get_id("capturestartbutton").classList.remove("navbuttondisabled");
		get_id("capturestopbutton").classList.remove("navbuttondisabled");
	}

	if(capture_running) {
		get_id("removeeverythingbutton").classList.add("navbuttondisabled");
		get_id("openbutton").classList.add("navbuttondisabled");
		get_id("savebutton").classList.add("navbuttondisabled");
		get_id("savegdrivebutton").classList.add("navbuttondisabled");

		get_id("capturestopbutton").style.display = "";
		get_id("capturestartbutton").style.display = "none";

		get_id("removecapturebutton").classList.add("navbuttondisabled");
		get_id("renamecapturebutton").classList.add("navbuttondisabled");
		get_id("capturemgmtbutton").classList.add("navbuttondisabled");
		get_id("advancedbutton").classList.add("navbuttondisabled");

		get_id("viewpreviousbutton").classList.add("navbuttondisabled");
		get_id("viewnextbutton").classList.add("navbuttondisabled");

		get_id("zoominbutton").classList.add("navbuttondisabled");
		get_id("zoomdatabutton").classList.add("navbuttondisabled");
		get_id("zoomresetbutton").classList.add("navbuttondisabled");

		get_id("captureinfobutton").classList.add("navbuttondisabled");
	} else {
		get_id("capturestartbutton").style.display = "";
		get_id("capturestopbutton").style.display = "none";

		get_id("openbutton").classList.remove("navbuttondisabled");

		if(captures.length == 0) {
			get_id("removeeverythingbutton").classList.add("navbuttondisabled");
			get_id("savebutton").classList.add("navbuttondisabled");
			get_id("savegdrivebutton").classList.add("navbuttondisabled");

			get_id("removecapturebutton").classList.add("navbuttondisabled");
			get_id("renamecapturebutton").classList.add("navbuttondisabled");
			get_id("capturemgmtbutton").classList.add("navbuttondisabled");
			get_id("advancedbutton").classList.add("navbuttondisabled");

			get_id("viewpreviousbutton").classList.add("navbuttondisabled");
			get_id("viewnextbutton").classList.add("navbuttondisabled");

			get_id("zoominbutton").classList.add("navbuttondisabled");
			get_id("zoomdatabutton").classList.add("navbuttondisabled");
			get_id("zoomresetbutton").classList.add("navbuttondisabled");

			get_id("captureinfobutton").classList.add("navbuttondisabled");
		} else {
			get_id("removeeverythingbutton").classList.remove("navbuttondisabled");
			get_id("savebutton").classList.remove("navbuttondisabled");
			get_id("savegdrivebutton").classList.remove("navbuttondisabled");

			get_id("removecapturebutton").classList.remove("navbuttondisabled");
			get_id("renamecapturebutton").classList.remove("navbuttondisabled");
			get_id("capturemgmtbutton").classList.remove("navbuttondisabled");
			get_id("advancedbutton").classList.remove("navbuttondisabled");

			get_id("captureinfobutton").classList.remove("navbuttondisabled");

			if(get_class("canvasstack").style.display != "none") {
				if(note_placement_progress)
					get_id("zoominbutton").classList.add("navbuttondisabled");
				else
					get_id("zoominbutton").classList.remove("navbuttondisabled");

				get_id("zoomdatabutton").classList.remove("navbuttondisabled");

				if(zoomed_in)
					get_id("zoomresetbutton").classList.remove("navbuttondisabled");
				else
					get_id("zoomresetbutton").classList.add("navbuttondisabled");

			} else {
				get_id("zoominbutton").classList.add("navbuttondisabled");
				get_id("zoomdatabutton").classList.add("navbuttondisabled");
				get_id("zoomresetbutton").classList.add("navbuttondisabled");
			}

			if(selected_capture == 0)
				get_id("viewpreviousbutton").classList.add("navbuttondisabled");
			else
				get_id("viewpreviousbutton").classList.remove("navbuttondisabled");

			if(selected_capture >= (captures.length - 1))
				get_id("viewnextbutton").classList.add("navbuttondisabled");
			else
				get_id("viewnextbutton").classList.remove("navbuttondisabled");
		}
	}
}
