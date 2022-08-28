/*
 * Coachium - js/ui.js
 * - handles most UI stuff
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

var closetimeoutids = [];

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
 * popup_window(id)
 *
 * Pops up a window according to the given ID.
 * 
 * For all possible window IDs, see the top of common.js.
 */

function popup_window(id) {
	if(!(open_window >= 0 && window_stack[open_window] == id)) {
		if(closetimeoutids[id]) clearTimeout(closetimeoutids[id]);

		open_window++;

		window_stack[open_window] = id;

		get_win_overlay(id).style.zIndex = zindex++;
		get_win_overlay(id).style.pointerEvents = "auto";
		get_win_overlay(id).style.opacity = 1;
		get_win(id).style.transform = "scale(1)";
	}
}

/*
 * close_window(id)
 *
 * Closes the currently open window or the one specified by an ID.
 */

function close_window(id = undefined) {
	if(open_window >= 0) {
		var win;
		
		if(id == undefined) {
			win = window_stack[open_window];
		} else {
			if(!window_stack.includes(id)) return;

			win = id;

			// Remove the specified window from the stack, could be anywhere

			const index = window_stack.indexOf(id);
			if(index > -1) window_stack.splice(index, 1);
		}

		window_stack.length = open_window--;

		get_win_overlay(win).style.pointerEvents = "";
		get_win_overlay(win).style.opacity = "";
		get_win(win).style.transform = "";

		closetimeoutids[win] = setTimeout(() => {
			get_win_overlay(win).style.zIndex = "";
		}, 500);
	}
}

/*
 * confirm_window()
 *
 * Presses the first button in the window, which always means
 * to confirm something.
 */

function confirm_window() {
	if(open_window >= 0) {
		get_win_el_class(window_stack[open_window], "windowbutton").click();
	}
}

/*
 * port_popup(id)
 * 
 * Pops up the port configuration popup next to the requesting port.
 */

var port_popup_timeout = null, port_popup_port_id = null;

function port_popup(id) {
	if(driver === null) return;

	const win = get_class("portpopup");
	const port = get_id("port" + (port_popup_port_id = id));

	if(port_popup_timeout) {
		clearTimeout(port_popup_timeout);
		port_popup_timeout = null;
	}

	update_port_popup();

	win.style.display = "initial";

	const portrect = port.getBoundingClientRect(), winrect = win.getBoundingClientRect();

	win.style.left = (portrect.x + (portrect.width - winrect.width) / 2) + "px";
	win.style.top = (portrect.y - winrect.height) + "px";

	win.style.opacity = 1;
	win.style.pointerEvents = "auto";

	win.style.marginTop = (portrect.height / 4) + "px";

	window.addEventListener("mousedown", close_port_popup_listener);
}

/*
 * update_port_popup()
 * 
 * Updates each entry's validity in the port configuration popup.
 */

function update_port_popup() {
	if(driver === null) {
		close_port_popup_listener({"force": true});
		return;
	}

	const id = port_popup_port_id;

	if(id == null) return;

	if(!driver.ports[id].connected || driver.capture.running) {
		enable_port_popup_button("L18N_PORT_ZERO_OUT", false);
		enable_port_popup_button("L18N_PORT_RESET", false);
	} else {
		enable_port_popup_button("L18N_PORT_ZERO_OUT", true);
		enable_port_popup_button("L18N_PORT_RESET", driver.ports[id].zero_offset != null);
	}
}

/*
 * enable_port_popup_button(htmlclass, active)
 * 
 * Sets a particular button in the port configuration popup as active/inactive.
 */

function enable_port_popup_button(htmlclass, active) {
	get_class(htmlclass).classList.remove(active ? "portpopupitemdisabled" : "portpopupitem");
	get_class(htmlclass).classList.add(active ? "portpopupitem" : "portpopupitemdisabled");
}

/*
 * close_port_popup_listener(event)
 * 
 * Event listener for the entire window, listens for mouse down events.
 * 
 * Only active when the port popup is displayed, and is used for
 * closing it when the user clicks away from the popup.
 */

function close_port_popup_listener(event) {
	const win = get_class("portpopup");

	if(port_popup_timeout || win.style.display == "") return;

	const winrect = win.getBoundingClientRect();

	const portrect = get_id("port" + port_popup_port_id).getBoundingClientRect();

	if(event.force ||
	  (event.x < winrect.x || event.x > (winrect.x + winrect.width) ||
	   event.y < winrect.y || event.y > (winrect.y + winrect.height)) &&
	 !(event.x > portrect.x && event.x < (portrect.x + portrect.width) &&
	   event.y > portrect.y && event.y < (portrect.y + portrect.height))) {

		close_port_popup();
	}
}

/*
 * close_port_popup()
 * 
 * Closes the currently open port configuration popup.
 */

function close_port_popup() {
	const win = get_class("portpopup");

	win.style.opacity = "";
	win.style.transform = "";
	win.style.pointerEvents = "none";

	win.style.marginTop = "0px";

	port_popup_timeout = setTimeout(() => {
		win.style.display = "";
		port_popup_timeout = null;
	}, 500);

	window.removeEventListener("mousedown", close_port_popup_listener);
}

/*
 * zero_out_sensor()
 * 
 * If allowed, zeroes out the sensor.
 */

function zero_out_sensor() {
	if(driver === null) return;

	const id = port_popup_port_id;

	if(get_class("L18N_PORT_ZERO_OUT").classList.contains("portpopupitemdisabled")) return;

	close_port_popup();

	if(driver.ports[id].zero_offset == null) driver.ports[id].zero_offset = 0;

	driver.ports[id].zero_offset += driver.ports[id].value;
}

/*
 * reset_sensor_zero_point()
 * 
 * Closes the currently open port configuration popup.
 */

function reset_sensor_zero_point() {
	if(driver === null) return;

	if(get_class("L18N_PORT_RESET").classList.contains("portpopupitemdisabled")) return;

	close_port_popup();

	driver.ports[port_popup_port_id].zero_offset = null;
}

/*
 * get_win(win_id)
 * get_win_el_class(win_id, el_class, index)
 * get_win_el_tag(win_id, el_tag, index)
 *
 * Returns the entire window's DOM object or an element contained within
 * (by class name or tag name). Useful for manipulating with the windows.
 * 
 * If the function accepts the parameter "index" and it is not explicitly
 * stated, the function will assume 0 as the default.
 */

function get_win_overlay(win_id) {
	return get_id("window" + win_id + "overlay");
}

function get_win(win_id) {
	return get_win_overlay(win_id).get_class("popupwindow");
}

function get_win_el_class(win_id, el_class, index = 0) {
	return get_win(win_id).get_class(el_class, index);
}

function get_win_el_tag(win_id, el_tag, index = 0) {
	return get_win(win_id).get_tag(el_tag, index);
}

/*
 * ui_connect()
 *
 * Does the fancy initial animation when the interface is selected.
 */

var launched = 0;

function ui_connect(actually_connect) {
	ui_hardware_change_trigger();

	launched = 1;

	if(get_id("introerrmsg")) {
		get_id("initialheader").style.flex = "0";
		get_id("initialheader").innerHTML = "";

		header.style.height = "48px";
		header.style.padding = "8px 16px";
		
		get_id("navcontents").style.display = "flex";

		get_id("introerrmsg").remove();
	
		get_id("headercontents").style.opacity = 0;
	
		nav.style.height = "40px";
		footer.style.height = "96px";

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
				close_port_popup_listener({"force": true});
			}, false);

			window.addEventListener('deviceorientation', () => {
				main_window_reset(false, true);
				close_port_popup_listener({"force": true});
			}, false);

			main_window_reset(true, true);
		}, 350);
	} else {
		get_id("statusmsg").innerHTML = jslang.STATUS_WELCOME;
		get_id("connectbutton").innerHTML = jslang.BUTTON_DISCONNECT;
		nav.style.backgroundColor =
		header.style.backgroundColor =
		footer.style.backgroundColor = "";
	}

	const plist = get_id("footercontents");

	if(driver !== null && Object.keys(driver.ports).length > 0) {
		// Create port <div>s

		plist.innerHTML = "";

		for(const port in driver.ports) {
			plist.innerHTML +=
				"<div id='port" + port + "' class='port' onclick='port_popup(\"" + port + "\");'>" +
					"<div class='portlabel'>" + port + "</div>" +
					"<div class='portstatus' id='port" + port + "status'>" + jslang.SENSOR_DISCONNECTED + "</div>" +
					"<div class='portvalue' id='port" + port + "value'>–</div>" +
				"</div>";
		}
	} else {
		// No ports available
		
		plist.innerHTML = "<b>" + jslang.SENSOR_NONE_PRESENT + "</b>";
	}

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
 * capture_setup_change_mode()
 *
 * Changes the capture mode that is displayed in the capture setup window.
 */

function capture_setup_change_mode(mode) {
	var hdr = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodeheader").children;

	hdr[mode].classList.remove("capturesetupmodeheaderinactive");
	hdr[mode ^ 1].classList.add("capturesetupmodeheaderinactive");

	var bodies = get_win(WINDOWID_CAPTURE_SETUP).getElementsByClassName("capturesetupmodebody");

	bodies[mode].style.display = "";
	bodies[mode ^ 1].style.display = "none";
}

/*
 * capture_setup_check()
 *
 * Check the validity of all input parameters for initializing the capture.
 */

function capture_setup_check() {
	// Clear the sensor source list and update it

	if(driver === null) return;

	var srclist = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupsensorsrc");

	srclist.innerHTML = "";
	
	const ports = Object.keys(driver.ports);

	for(const port of ports) {
		const pobj = driver.ports[port];

		if(pobj.connected) {
			srclist.innerHTML +=
				"<div class='capturesetupsensorblock' style='background-color: " + pobj.color + "' name='block_" + port + "'>" +
					"<div>" + port + ": " + pobj.unit + "</div>" +
					"<div>" + pobj.name + "</div>" +
					"<div>" + pobj.min + "–" + pobj.max + " " + pobj.unit + "</div>" +
				"</div>";
		}
	}

	// Delete all sensor blocks that are not in the current list

	var blocks = document.querySelectorAll("[name^='block_']");

	for(var i = 0; i < blocks.length; i++) {
		const port = blocks[i].getAttribute("name").substring(6);

		if(driver.ports[port] === undefined || !driver.ports[port].connected) {
			blocks[i].remove();
		}
	}
}

/*
 * capture_setup_top_section_change()
 *
 * Recalculates the period and number of samples based on
 * the input frequency and duration.
 */

function capture_setup_top_section_change() {

}

/*
 * capture_setup_bottom_section_change()
 *
 * Recalculates the frequency and duration based on
 * the input period and number of samples.
 */

function capture_setup_bottom_section_change() {

}

/*
 * change_selected_capture(interval)
 * 
 * Changes the currently selected capture for another one.
 */

function change_selected_capture(interval, absolute = undefined) {
	if(interval < 0 && get_id("viewpreviousbutton").classList.contains("navbuttondisabled")) return; 
	if(interval > 0 && get_id("viewnextbutton").classList.contains("navbuttondisabled")) return; 

	if(captures.length > 0) {
		if(absolute != undefined && absolute != Infinity)
			selected_capture = absolute;
		else if(absolute == Infinity)
			selected_capture = captures.length - 1;
		else
			selected_capture += interval;

		if(selected_capture < 0)
			selected_capture = 0;
		else if(selected_capture >= captures.length)
			selected_capture = captures.length - 1;

		const capture = captures[selected_capture];
	
		capture_cache.values = [];

		if(capture.sensorsetup) {
			// Only one sensor was used
			
			const sensor = (capture.sensorsetup == 1) ? capture.port_a : capture.port_b;

			// X axis parameters

			capture_cache.x.unitname = "s";
			capture_cache.x.min  = 0;
			capture_cache.x.max = capture.seconds;

			// Y axis parameters

			capture_cache.y.unitname = sensor.unit;
			capture_cache.y.min = sensor.min_value;
			capture_cache.y.max = sensor.max_value;
		} else {
			// Both sensors were used

			const sensor_a = capture.port_a, sensor_b = capture.port_b;

			// X axis parameters

			capture_cache.x.unitname = sensor_b.unit;
			capture_cache.x.min = sensor_b.min_value;
			capture_cache.x.max = sensor_b.max_value;

			// Y axis parameters

			capture_cache.y.unitname = sensor_a.unit;
			capture_cache.y.min = sensor_a.min_value;
			capture_cache.y.max = sensor_a.max_value;
		}

		generate_cache(capture.captureddata, 0, capture.samples);
	} else {
		capture_cache.values = [];

		selected_capture = 0;
	}

	main_window_reset(true, false);
}

/*
 * change_capture_view()
 * 
 * Changes the view on the current capture. Switches between a table or a graph.
 */

function change_capture_view() {
	const c_visible = get_class("canvasstack").style.display != "none";

	if(c_visible) {
		get_class("canvasstack").style.display = "none";
		table.style.display  = "";
		main.style.overflowY = "scroll";

		get_id("viewastablebutton").style.display = "none";
		get_id("viewasgraphbutton").style.display = "";
	} else {
		get_class("canvasstack").style.display = "";
		table.style.display  = "none";
		main.style.overflowY = "hidden";

		get_id("viewastablebutton").style.display = "";
		get_id("viewasgraphbutton").style.display = "none";
	}

	main_window_reset(true, true);
}

/*
 * request_zoom_in()
 * 
 * Prompts the user to select a region, or aborts the current zoom request.
 */

function request_zoom_in() {
	if(get_id("zoominbutton").classList.contains("navbuttondisabled")) return;

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
 * zoom_to_data()
 * 
 * Automatically determines the zoom region based on the captured data.
 */

function zoom_to_data() {
	if(get_id("zoomdatabutton").classList.contains("navbuttondisabled")) return;

	canvas.style.cursor = "auto";

	var min_x = 1, min_y = 1, max_x = 0, max_y = 0;

	for(var i = 0; i < capture_cache.values.length; i++) {
		var x = (capture_cache.values[i][0] - capture_cache.x.min) / (capture_cache.x.max - capture_cache.x.min);
		var y = (capture_cache.values[i][1] - capture_cache.y.min) / (capture_cache.y.max - capture_cache.y.min);

		if(x > max_x) max_x = x;
		if(x < min_x) min_x = x;

		if(y > max_y) max_y = y;
		if(y < min_y) min_y = y;
	}

	if(min_x < max_x && min_y < max_y) {
		const w = max_x - min_x, h = max_y - min_y;

		min_x -= w * .1; min_y -= h * .1;
		max_x += w * .1; max_y += h * .1;
	
		if(min_x < 0) min_x = 0;
		if(min_y < 0) min_y = 0;
		if(max_x > 1) max_x = 1;
		if(max_y > 1) max_y = 1;
	
		get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_DATA;
		zoom_request_progress = 0;
		zoomed_in = true;

		zoomx1 = min_x; zoomy1 = min_y;
		zoomx2 = max_x; zoomy2 = max_y;
	
		update_button_validity();
		main_window_reset(false, false); // Not needed, since we've done it already	
	}
}

/*
 * zoom_reset()
 * 
 * Resets the zoom on the graph.
 */

function zoom_reset() {
	if(get_id("zoomresetbutton").classList.contains("navbuttondisabled")) return;

	get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_RESET;
	zoom_request_progress = 0;
	zoomed_in = false;

	update_button_validity();
	main_window_reset(false, false); // Not needed, since we've done it already
}

/*
 * info_generate_sensor(sensor)
 * 
 * Generates a HTML description for a sensor object.
 */

function info_generate_sensor(sensor) {
	var out = "<div style=\"padding:8px;margin:16px 0;background-color:" + sensor.color + "\">";

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
	if(get_id("captureinfobutton").classList.contains("navbuttondisabled")) return;

	const capture = captures[selected_capture];

	var str = format(jslang.INFO_WINDOW_CONTENTS,
		capture.samples,
		capture.samples / (capture.sensorsetup ? 1 : 2),
		localize_num(round(10000 / capture.interval, 2)),
		capture.seconds,
		(capture_cache.values.length - 1) * capture.interval / 10000
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
	if(get_id("capturemgmtbutton").classList.contains("navbuttondisabled")) return;

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
		change_selected_capture(0, select.selectedIndex);
		main_window_reset(true, false);
	}
	
	input.oninput = () => {
		get_win_el_class(w, "windowbutton").style.backgroundColor =
			(input.value == captures[selected_capture].title) ? "rgba(0, 0, 0, .1)" : "";
	}

	get_win_el_class(w, "windowbutton", 0).onclick = () => {
		captures[selected_capture].title = input.value;
		capture_management();
	}

	get_win_el_class(w, "windowbutton", 1).onclick = () => {
		if(selected_capture > 0) {
			const capture = captures[selected_capture];
			captures[selected_capture] = captures[selected_capture - 1];
			captures[selected_capture - 1] = capture;

			change_selected_capture(-1);

			capture_management();
		}
	}

	get_win_el_class(w, "windowbutton", 2).onclick = () => {
		if((selected_capture + 1) < captures.length) {
			const capture = captures[selected_capture];
			captures[selected_capture] = captures[selected_capture + 1];
			captures[selected_capture + 1] = capture;

			change_selected_capture(1);

			capture_management();
		}
	}

	get_win_el_tag(w, "option", selected_capture).selected = true;
	select.onchange();

	popup_window(w);
}

/*
 * device_select()
 * 
 * Initializes the driver list and pops up the device selection dialog.
 */

function device_select() {
	const w = WINDOWID_DRIVER_SELECTOR;
	const vendorlist = get_win_el_tag(w, "select", 0);
	const devicelist = get_win_el_tag(w, "select", 1);
	const connectbutton = get_win_el_class(w, "windowbutton", 0);

	vendorlist.innerHTML = "";

	for(const vendor in driverindex) {
		var option = document.createElement("option");
		option.innerText = vendor;
	
		vendorlist.appendChild(option);
	}

	vendorlist.onchange = () => {
		devicelist.innerHTML = "";

		for(const device in driverindex[vendorlist.value]) {
			var option = document.createElement("option");
			option.innerText = device;
		
			devicelist.appendChild(option);	
		}

		devicelist.selectedIndex = 0;
		devicelist.onchange();
	}

	devicelist.onchange = () => {
		connectbutton.innerText = format(jslang.CONNECT_BUTTON_TEXT, devicelist.value);
	}

	devicelist.ondblclick = () => {
		connectbutton.click();
	}

	vendorlist.selectedIndex = 0;
	vendorlist.onchange();

	popup_window(w);
}

/*
 * async driver_start()
 * 
 * Initializes a selected device driver as well as the device.
 * If successful, it maintains the main operating thread until
 * the device is disconnected.
 */

async function driver_start() {
	const w = WINDOWID_DRIVER_SELECTOR;
	const vendorlist = get_win_el_tag(w, "select", 0);
	const devicelist = get_win_el_tag(w, "select", 1);

	const device = driverindex[vendorlist.value][devicelist.value];

	const lldriver = lldrivers[device.method];
	const response = await lldriver.init(device.driver, () => { ui_disconnect(true) });

	switch(response) {
		case 1:
			get_id("w7titleapi").innerText = lldriver.name;
			get_id("w7parapi").innerText = lldriver.name;
			popup_window(WINDOWID_LLAPI_UNAVAILABLE);
			break;

		case 2:
			if(get_id("introerrmsg")) {
				header.style.height = "216px";
				get_id("introerrmsg").innerHTML = jslang.STATUS_NO_DEVICE_SELECTED;
				get_id("introerrmsg").style.opacity = 1;
			} else {
				get_id("statusmsg").innerHTML = jslang.STATUS_NO_DEVICE_SELECTED;
			}
			break;

		case 3:
			popup_window(WINDOWID_DEVICE_OPEN_ERROR);
			break;

		case 4:
			popup_window(WINDOWID_DEVICE_VERIFY_ERROR);
			break;

		default:
			// Success, save the driver for later use
		
			driver = response;

			// Update the UI to reflect the fact that we are connected

			ui_connect(true);

			// Main application thread (lol)
			
			while(driver !== null) {
				// Iterate over each input port and wait 200 ms until disconnection

				try {
					for(const port in driver.ports) {
						// TODO - handle errors on autodetect
						
						// Run auto-detection

						await driver.autodetect(port, (status) => {
							switch(status.type) {
								case "load":
									get_id("port" + port + "status").innerHTML =
										jslang.SENSOR_LOADING + "<br><progress value=\"" + round(status.progress * 1000) + "\" max=\"1000\"></progress>";
		
									get_id("port" + port + "value").innerText = round(status.progress * 100) + " %";
									break;

								case "change":
									const pobj = driver.ports[port];

									if(pobj.connected) {
										get_id("port" + port + "status").innerHTML =
											(pobj.autodetect ? (jslang.SENSOR_INTELLIGENT + ": ") : "") +
											pobj.name + " (" + pobj.min + "–" + pobj.max + " " + pobj.unit + ")";

										get_id("port" + port).style.backgroundColor = pobj.color;		
									} else {
										get_id("port" + port + "status").innerHTML = jslang.SENSOR_DISCONNECTED;
										get_id("port" + port).style.backgroundColor = "";			
									}

									ui_hardware_change_trigger();
									break;
							}
						});

						// Read the port's value

						const pobj = driver.ports[port];
						const val = await driver.getval(port);

						if(val !== undefined) {
							get_id("port" + port + "value").innerText = localize_num(ideal_round_fixed(val, pobj.max)) + " " + pobj.unit;
						} else {
							get_id("port" + port + "value").innerText = "–";
						}
					}
				} catch(e) {
					// Stop in case the device gets disconnected

					console.log(e);
					return;
				}

				await delay_ms(200);
			}

			break;
	}
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

	if(driver !== null && driver.capture.running) {
		get_id("capturestopbutton").style.display = "";
		get_id("capturestartbutton").style.display = "none";

		get_id("removeeverythingbutton").classList.add("navbuttondisabled");
		get_id("openbutton").classList.add("navbuttondisabled");
		get_id("savebutton").classList.add("navbuttondisabled");
		get_id("savegdrivebutton").classList.add("navbuttondisabled");

		get_id("removecapturebutton").classList.add("navbuttondisabled");
		get_id("capturemgmtbutton").classList.add("navbuttondisabled");
		get_id("fitfunctionbutton").classList.add("navbuttondisabled");

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
			get_id("removecapturebutton").classList.add("navbuttondisabled");
			get_id("capturemgmtbutton").classList.add("navbuttondisabled");
			get_id("fitfunctionbutton").classList.add("navbuttondisabled");
			get_id("savebutton").classList.add("navbuttondisabled");
			get_id("savegdrivebutton").classList.add("navbuttondisabled");
			get_id("viewpreviousbutton").classList.add("navbuttondisabled");
			get_id("viewnextbutton").classList.add("navbuttondisabled");
			get_id("zoominbutton").classList.add("navbuttondisabled");
			get_id("zoomdatabutton").classList.add("navbuttondisabled");
			get_id("zoomresetbutton").classList.add("navbuttondisabled");
			get_id("captureinfobutton").classList.add("navbuttondisabled");
		} else {
			get_id("removeeverythingbutton").classList.remove("navbuttondisabled");
			get_id("removecapturebutton").classList.remove("navbuttondisabled");
			get_id("capturemgmtbutton").classList.remove("navbuttondisabled");
			get_id("fitfunctionbutton").classList.remove("navbuttondisabled");
			get_id("savebutton").classList.remove("navbuttondisabled");
			get_id("savegdrivebutton").classList.remove("navbuttondisabled");
			get_id("captureinfobutton").classList.remove("navbuttondisabled");

			if(get_class("canvasstack").style.display != "none") {
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

/*
 * The page has loaded, hooray!
 */

window.onload = () => {
	get_tag("html").style.opacity = 1;

	// Initialize constants for making the code simpler

	header = get_tag("header");
	nav = get_tag("nav");
	main = get_tag("main");
	footer = get_tag("footer");
	canvas = get_id("maincanvas");
	ctx = canvas.getContext("2d");
	overlay = get_id("overlaycanvas");
	ovctx = overlay.getContext("2d");
	table = get_id("table");
	
	// Initialize the connect button

	get_id("connectbutton").onclick = () => {
		if(driver === null) {
			device_select();
		} else {
			driver.deinit();
			ui_disconnect(false);
		}
	};

	// Initialize capture setup window (TODO)

	var sensorsrc = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupsensorsrc");
	var sensordrop = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodydropzone");
	var sensordropx = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 0);
	var sensordropy = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 1);
	var sensordroptrig = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 2);

	var drake = dragula([sensorsrc, sensordrop, sensordropx, sensordropy, sensordroptrig], {
		copy: (el, source) => {
			return source === sensorsrc;
		},
		accepts: (el, target) => {
			if(target === sensorsrc) return false;

			if(target === sensordropx || target === sensordropy || target === sensordroptrig) {
				return target.querySelector("div.capturesetupsensorblock:not(.gu-transit)") == null;
			} else {
				return true;
			}
		},
		direction: (el, target) => {
			return (target == sensordrop) ? "horizontal" : "vertical";
		},
		removeOnSpill: true
	});

	drake.on("dragend", capture_setup_check);

	capture_setup_top_section_change();

	get_win_el_class(WINDOWID_CAPTURE_SETUP, "windowbutton").onclick = () => { close_window() };

	// Initialize all the callbacks on the canvas

	canvas.onmousemove = canvasmousemovehandler;
	canvas.onmousedown = () => { canvasmousechangehandler(1); };
	canvas.onmouseup = () => { canvasmousechangehandler(0); };
	canvas.onmouseleave = canvasmouseleavehandler;
	canvas.onwheel = canvasmousewheelhandler;

	if(location.hostname != "localhost") {
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
}

/*
 * Keyboard callback for handling keyboard shortcuts.
 */

document.addEventListener('keydown', (event) => {
	const key = event.key.toLowerCase();

	if(open_window >= 0) {
		switch(key) {
			case "escape":
				window.location.hash = '';
				close_window();
				break;
	
			case "enter":
				confirm_window();
				break;
		}
	} else {
		if(!launched) return;

		if(event.ctrlKey) switch(key) {
			case "o":
				event.preventDefault();
				load_file_local(false);
				break;

			case "s":
				event.preventDefault();

				if(event.shiftKey)
					popup_gdrive_window();
				else
					save_file_local(false);

				break;

		} else switch(key) {
			case " ":
				event.preventDefault();
				
				if(driver !== null) {
					if(!driver.capture.running)
						create_capture();
					else
						request_capture = 1;
				}

				break;

			case "t":
				change_capture_view();
				break;

			case "i":
				show_capture_info();
				break;

			case "f":
				fit_function();
				break;

			case "m":
				capture_management();
				break;

			case "arrowleft":
			case "pageup":
				event.preventDefault();
				change_selected_capture(-1);
				break;

			case "arrowright":
			case "pagedown":
				event.preventDefault();
				change_selected_capture(1);
				break;

			case "delete":
				event.preventDefault();
				remove_capture(false);
				break;

			case "escape":
				event.preventDefault();
				if(zoom_request_progress) request_zoom_in();
				break;

			case "+":
				request_zoom_in();
				break;

			case "-":
				zoom_reset();
				break;

			case "=":
				zoom_to_data();
				break;
		}
	}
});

/*
 * Callback when the URL hash changes
 */

window.onhashchange = () => {
	const hash = new URL(document.URL).hash;

	close_window("about");
	close_window("pp");

	if(hash == "#about") popup_window("about");
	if(hash == "#privacy-policy") popup_window("pp");
}

/*
 * Error handler for the entire application
 */

window.onerror = (msg, file, line) => {
	get_win_el_tag(WINDOWID_JS_ERR, "textarea").value =
		"\"" + file + "\" @ " + line + ":\n\n" + msg;

	popup_window(WINDOWID_JS_ERR);
	return false;
}
