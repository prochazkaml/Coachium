/*
 * Coachium - js/navfuns.js
 * - handles stuff related to the nav bar + reacts to all capture-related buttons
 *   and manages their dialogs
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

	capture_setup_check();
}

/*
 * capture_setup_check()
 *
 * Check the validity of all input parameters for initializing the capture.
 */

function capture_setup_check() {
	var startbutt = get_win_el_class(WINDOWID_CAPTURE_SETUP, "windowbutton");

	startbutt.classList.add("windowbuttondisabled");

	const freq = Number(get_id("cs_freq").get_tag("input").value);
	const dur = Number(get_id("cs_duration").get_tag("input").value);

	var err = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetuperror");

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

	// Check if there was a trigger sensor assigned

	const trig = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 2);
	const ts = get_id("cs_trigger_setup");

	if(trig.children.length != 0) {		
		ts.style.display = "";

		const trigport = driver.ports[trig.children[0].getAttribute("name").substring(6)];
		const target = Number(ts.get_tag("input").value);

		if(target < trigport.min) {
			err.innerHTML = format(jslang.SETUP_TRIG_TOO_LOW, trigport.min);
			return;
		}

		if(target > trigport.max) {
			err.innerHTML = format(jslang.SETUP_TRIG_TOO_HIGH, trigport.max);
			return;
		}

		get_id("cs_trigger_unit").innerText = trigport.unit;

		
	} else {
		ts.style.display = "none";
	}
	
	// Check the capture mode and the assigned sensors

	const xy_mode = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodeheader").children[0].classList.contains("capturesetupmodeheaderinactive");

	var portlist = [];

	if(xy_mode) {
		// X-Y mode, check if both sensors have been assigned

		const x = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 0);
		const y = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 1);

		if(x.children.length == 0 || y.children.length == 0) {
			err.innerHTML = jslang.SETUP_SENSOR_ERR_XY;
			return;
		}

		portlist = [
			x.children[0].getAttribute("name").substring(6),
			y.children[0].getAttribute("name").substring(6)
		];
	} else {
		// Standard mode, check if at least one sensor has been assigned

		const list = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodydropzone");

		if(list.children.length == 0) {
			err.innerHTML = jslang.SETUP_SENSOR_ERR_STD;
			return;
		}

		for(const port of list.children) {
			portlist.push(port.getAttribute("name").substring(6));
		}
	}

	// Parse info through the driver

	const parsed = driver.verifycapture({
		ports: portlist,
		freq: freq,
		length: dur
	});

	if(parsed === undefined) {
		err.innerHTML = jslang.SETUP_SENSOR_TOO_MUCH;
		return;
	}

	err.innerHTML = "";
	startbutt.classList.remove("windowbuttondisabled");

	if(parsed.freq != freq) {
		err.innerHTML += format(jslang.SETUP_CLOSEST_USABLE_FREQ, localize_num(parsed.freq)) + " ";
	}

	if(parsed.length != dur) {
		err.innerHTML += format(jslang.SETUP_REDUCED_RUNTIME, localize_num(round(parsed.length, 3))) + " ";
	}
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