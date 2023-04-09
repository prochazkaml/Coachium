/*
 * Coachium - js/modules/capturesetup.js
 * - handles the new capture setup dialog
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
 * capture_setup_change_mode()
 *
 * Changes the capture mode that is displayed in the capture setup window.
 */

function capture_setup_change_mode(mode) {
	var hdr = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodeheader").children;

	hdr[mode].classList.remove("capturesetupmodeheaderinactive");
	hdr[mode ^ 1].classList.add("capturesetupmodeheaderinactive");

	var bodies = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebody", null);

	bodies[mode].style.display = "";
	bodies[mode ^ 1].style.display = "none";

	capture_setup_check();
}

/*
 * capture_setup_get_params()
 *
 * Reads the parameters from the capture setup dialog. Returns:
 * 
 * {
 *   freq: number in Hz
 *   length: number of seconds
 *   ports: string array (["A1", ...])
 *   xy_mode: bool
 *   trigger: null if no trigger, otherwise {
 *     port: port name ("A1")
 *     cond: "eq", "ne", "lt", "gt"
 *     target: number (target value)
 *     tol: number (target value tolerance, only valid if cond = "eq" or "ne")
 *   }
 * }
 */

function capture_setup_get_params() {
	if(driver === null) return undefined;

	// Check the capture mode and the assigned sensors

	const xy_mode = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodeheader").children[0].classList.contains("capturesetupmodeheaderinactive");

	var portlist = [];

	if(xy_mode) {
		// X-Y mode, check if both sensors have been assigned

		const x = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 0).children;
		const y = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 1).children;

		if(x.length != 0) portlist.push(x[0].getAttribute("name").substring(6));
		if(y.length != 0) portlist.push(y[0].getAttribute("name").substring(6));
	} else {
		// Standard mode, check if at least one sensor has been assigned

		const list = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodydropzone").children;

		for(const port of list) {
			portlist.push(port.getAttribute("name").substring(6));
		}
	}

	// Check if there was a trigger sensor assigned

	var trigger = undefined;

	const trig = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 2).children;
	const ts = get_id("cs_trigger_setup");

	if(trig.length != 0) {
		trigger = {
			port: trig[0].getAttribute("name").substring(6),
			cond: ts.get_tag("select").value,
			target: Number(ts.get_tag("input", 0).value),
			tol: Number(ts.get_tag("input", 1).value)
		}
	}

	// Get the length multiplier

	var multiplier = 1;

	switch(get_id("cs_duration").get_tag("select").value) {
		case "h":
			multiplier *= 60;

		case "m":
			multiplier *= 60;

		case "s":
			multiplier *= 1000;

		case "ms":
			break;

		default:
			return undefined;
	}

	// Generate the output object

	return {
		freq: Number(get_id("cs_freq").get_tag("input").value),
		length: Number(get_id("cs_duration").get_tag("input").value) * multiplier,
		ports: portlist,
		xy_mode: xy_mode,
		trigger: trigger
	};
}

/*
 * capture_setup_check()
 *
 * Check the validity of all input parameters for initializing the capture.
 */

var capture_setup_check_old_trig_status = false;

function capture_setup_check() {
	var startbutt = get_win_el_class(WINDOWID_CAPTURE_SETUP, "windowbutton");

	startbutt.classList.add("windowbuttondisabled");

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
				"<div class='sensorblock' style='background-color: " + pobj.color + "' name='block_" + port + "'>" +
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

	// Load the parameters given

	const params = capture_setup_get_params();

	if(params === undefined) return;

	// Check if there was a trigger sensor assigned

	const ts = get_id("cs_trigger_setup");

	if(params.trigger !== undefined) {
		ts.style.display = "";

		// Check whether tolerances are needed

		if(params.trigger.cond == "eq" || params.trigger.cond == "ne") {
			get_id("cs_trigger_tol_sign").style.display = "";
			ts.get_tag("input", 1).style.display = "";
		} else {
			get_id("cs_trigger_tol_sign").style.display = "none";
			ts.get_tag("input", 1).style.display = "none";
		}

		// Set up a default tolerance if the port was just assigned - +/- 10 %

		const trigport = driver.ports[params.trigger.port];

		if(!capture_setup_check_old_trig_status) {
			ts.get_tag("input", 1).value = (trigport.max - trigport.min) / 20;
		}

		// Check whether the condition is in a valid range

		if(params.trigger.target < trigport.min) {
			err.innerHTML = format(jslang.SETUP_TRIG_TOO_LOW, trigport.min);
			return;
		}

		if(params.trigger.target > trigport.max) {
			err.innerHTML = format(jslang.SETUP_TRIG_TOO_HIGH, trigport.max);
			return;
		}

		get_id("cs_trigger_unit").innerText = trigport.unit;

		capture_setup_check_old_trig_status = true;
	} else {
		ts.style.display = "none";

		capture_setup_check_old_trig_status = false;
	}
	
	// Check the capture mode and the assigned sensors

	if(params.xy_mode) {
		if(params.ports.length != 2) {
			err.innerHTML = jslang.SETUP_SENSOR_ERR_XY;
			return;
		}
	} else {
		if(params.ports.length == 0) {
			err.innerHTML = jslang.SETUP_SENSOR_ERR_STD;
			return;
		}
	}

	// Parse info through the driver

	const parsed = driver.verifycapture({
		freq: params.freq,
		length: params.length,
		ports: params.ports
	});

	if(parsed === undefined) {
		err.innerHTML = jslang.SETUP_SENSOR_TOO_MUCH;
		return;
	}

	err.innerHTML = "";
	startbutt.classList.remove("windowbuttondisabled");

	if(parsed.freq != params.freq) {
		err.innerHTML += format(jslang.SETUP_CLOSEST_USABLE_FREQ, localize_num(parsed.freq)) + " ";
	}

	if(parsed.length != params.length) {
		err.innerHTML += format(jslang.SETUP_REDUCED_RUNTIME, localize_num(round(parsed.length / 1000, 3))) + " ";
	}
}
