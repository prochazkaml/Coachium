/*
 * Coachium - js/main.js
 * - main JS file of the program, handles UI & device (de)init
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

var driver = null;

// Separate capture_running variable here, which also tracks of waiting for trigger

var request_capture = false, capture_running = false;

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
 * ui_connect()
 *
 * Does the fancy initial animation when the interface is selected.
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

		header.style.height = "";
		header.style.padding = "";

		get_id("navcontents").style.display = "flex";

		get_id("introerrmsg").remove();

		get_id("headercontents").style.opacity = 0;

		nav.style.height = "";

		setTimeout(() => {
			get_id("connectbuttonguest").remove();

			get_id("introimg").style.height = "48px";
			get_id("connectbutton").style.margin = "0";
			get_id("connectbutton").style.width = "calc(907 / 200 * 48px - 16px)";
			if(actually_connect) get_id("connectbutton").innerHTML = jslang.BUTTON_DISCONNECT;

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

		footer.style.backgroundColor = "#FAA";
		header.style.backgroundColor = "#F00";
		nav.style.backgroundColor = "#F00";
	}

	ui_hardware_change_trigger();
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

	popup_window(WINDOWID_DRIVER_INITIALIZING);
	const response = await lldriver.init(device.driver, () => { ui_disconnect(true) });
	close_window(WINDOWID_DRIVER_INITIALIZING);

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
						// Run auto-detection

						const status = await driver.autodetect(port, (status) => {
							switch(status.type) {
								case "load":
									get_id("port" + port + "status").innerHTML = jslang.SENSOR_LOADING;
									get_id("port" + port + "value").innerText = round(status.progress * 100) + " %";
									get_id("port" + port + "unit").innerHTML = "<progress value='" + round(status.progress * 1000) + "' max='1000'></progress>";
									break;

								case "change":
									const pobj = driver.ports[port];

									if(pobj.connected) {
										get_id("port" + port + "intelligenticon").style.display = pobj.autodetect ? "" : "none";

										get_id("port" + port + "status").innerHTML = pobj.name
										get_id("port" + port + "unit").innerHTML = pobj.min + "–" + pobj.max + " " + pobj.unit;

										get_id("port" + port).style.backgroundColor = pobj.color;
									} else {
										get_id("port" + port + "intelligenticon").style.display = "none";

										get_id("port" + port + "status").innerHTML = jslang.SENSOR_DISCONNECTED;
										get_id("port" + port + "unit").innerHTML = "";
										get_id("port" + port).style.backgroundColor = "";
									}

									ui_hardware_change_trigger();
									break;
							}
						});

						if(status == 1 && driver !== null) popup_window(WINDOWID_WATCHDOG_ERROR);

						// Read the port's value

						const pobj = driver.ports[port];
						const val = await driver.getval(port);

						if(val !== undefined) {
							get_id("port" + port + "value").innerText = localize_num(ideal_round_fixed(val, pobj.max)) + " " + pobj.unit;
							get_id("port" + port + "cornername").style.display = "";
						} else {
							get_id("port" + port + "value").innerText = port;
							get_id("port" + port + "cornername").style.display = "none";
						}
					}
				} catch(e) {
					// Stop in case the device gets disconnected

					console.log(e);
					return;
				}

				// Check for capture requests

				if(request_capture) {
					request_capture = false;

					if(capture_running) {
						// Capture stop requested

						await driver.stopcapture();

						capture_running = false;

						ui_hardware_change_trigger();
					} else {
						// Capture start requested, verify the parameters

						const params = capture_setup_get_params();

						const parsed = driver.verifycapture({
							freq: params.freq,
							length: params.length,
							ports: params.ports
						});

						if(parsed !== undefined) {
							// Clear the ports' displayed values

							for(const port in driver.ports) {
								get_id("port" + port + "value").innerText = port;
								get_id("port" + port + "cornername").style.display = "none";
							}

							capture_running = true;
							ui_hardware_change_trigger();

							// All good, check if there is a trigger condition

							if(params.trigger !== undefined) {
								const trig = params.trigger;

								get_id("statusmsg").innerText = jslang.STATUS_WAITING_FOR_TRIGGER;

								const pobj = driver.ports[trig.port];

								trigger_wait_loop: while(1) {
									if(request_capture) {
										capture_running = false;
										request_capture = false;
										break trigger_wait_loop;
									}

									const val = await driver.getval(trig.port);

									if(val === undefined) break trigger_wait_loop;

									get_id("port" + trig.port + "cornername").style.display = "none";
									get_id("port" + trig.port + "value").innerText = localize_num(ideal_round_fixed(val, pobj.max)) + " " + pobj.unit;

									switch(trig.cond) {
										case "eq":
											if(val >= (trig.target - trig.tol) && val <= (trig.target + trig.tol))
												break trigger_wait_loop;

											break;

										case "ne":
											if(val < (trig.target - trig.tol) || val > (trig.target + trig.tol))
												break trigger_wait_loop;

											break;

										case "lt":
											if(val < trig.target) break trigger_wait_loop;
											break;

										case "gt":
											if(val > trig.target) break trigger_wait_loop;
											break;
									}
								}
							}

							// Trigger condition finished (if there even was one), start the capture

							if(capture_running) {
								const capstatus = await driver.startcapture({
									freq: params.freq,
									length: params.length,
									ports: params.ports
								});

								if(capstatus !== undefined) {
									// Create a new capture in the GUI

									var title = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupname").get_tag("input").value;

									if(!title) title = jslang.UNTITLED_CAPTURE;

									var ports = {};

									console.log(capstatus);

									for(var i = 0; i < params.ports.length; i++) {
										ports[params.ports[i]] = JSON.parse(JSON.stringify(capstatus.ports[i])); // Holy shit
									}
									
									var capture = {
										title: title,
										length: params.length,
										ports: ports,
										interval: capstatus.interval,
										xy_mode: params.xy_mode,
										data: []
									};

									captures.push(capture);

									// Start rendering the incoming data

									change_selected_capture(0, Infinity);
									capture_display_thread(parsed.freq, 0);
								} else {
									capture_running = false;
									popup_window(WINDOWID_CAPTURE_START_ERROR);

									get_id("statusmsg").innerText = jslang.STATUS_CAPTURE_FINISHED;
									ui_hardware_change_trigger();
								}
							} else {
								// Capture was cancelled during the trigger waiting phase

								get_id("statusmsg").innerText = jslang.STATUS_CAPTURE_FINISHED;
								ui_hardware_change_trigger();
							}
						}
					}
				}

				await delay_ms(200);
			}

			break;
	}
}

/*
 * capture_display_thread(freq)
 * 
 * Displays info about the currently running capture. Automatically calls itself repeatedly, until the capture is stopped.
 */

function capture_display_thread(freq, processed) {
	if(driver !== null) {
		const samples = Math.floor(driver.capture.received / driver.capture.ports.length);

		if(capture_running && driver.capture.running) {
			get_id("statusmsg").innerText = format(jslang.STATUS_CAPTURE_RUNNING, samples, localize_num((samples / freq).toFixed(2)));

			setTimeout(capture_display_thread, 16, freq, samples); // Close enough to 60 Hz
		} else {
			get_id("statusmsg").innerText = jslang.STATUS_CAPTURE_FINISHED;

			capture_running = false;
			ui_hardware_change_trigger();
		}

		captures[captures.length - 1].data = driver.capture.data;
		generate_cache(processed, samples);
	} else {
		get_id("statusmsg").innerText = jslang.STATUS_CAPTURE_FINISHED;

		capture_running = false;
		ui_hardware_change_trigger();
	}

	main_window_reset(false, false);
}

/*
 * The page has loaded, hooray!
 */

function window_onload() {
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

	// Initialize capture setup window

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
				return target.querySelector("div.sensorblock:not(.gu-transit)") == null;
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

	var startbutt = get_win_el_class(WINDOWID_CAPTURE_SETUP, "windowbutton");

	startbutt.onclick = () => {
		if(!startbutt.classList.contains("windowbuttondisabled")) {
			request_capture = true;
			close_window();
		}
	};

	// Initialize all the callbacks on the canvas

	canvas.onmousemove = canvasmousemovehandler;
	canvas.onmousedown = () => { canvasmousechangehandler(1); };
	canvas.onmouseup = () => { canvasmousechangehandler(0); };
	canvas.onmouseleave = canvasmouseleavehandler;
	canvas.onwheel = canvasmousewheelhandler;

	if(location.hostname != "localhost") {
		// Check the current git commit version against GitHub

		var github_request = new XMLHttpRequest();

		github_request.onreadystatechange = () => {
			if(github_request.readyState == 4) {
				if(github_request.status == 200) {
					var sha1 = JSON.parse(github_request.responseText)["sha"];

					if(sha1 == undefined) {
						get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
					} else {
						var local_request = new XMLHttpRequest();

						local_request.onreadystatechange = () => {
							if(local_request.readyState == 4) {
								if(local_request.status == 200) {
									var sha2 = local_request.responseText;

									if(sha1.substring(0, 7) == sha2.substring(0, 7)) {
										get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML =
											format(jslang.HOMEPAGE_COMMIT_OK, sha1.substring(0, 7));
									} else {
										get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML =
											format(jslang.HOMEPAGE_COMMIT_OLD, sha2.substring(0, 7), sha1.substring(0, 7));
									}
								} else {
									get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
								}
							}
						}

						local_request.open("GET", "./.git/refs/heads/master?t=" + new Date().getTime(), true); // true for asynchronous
						local_request.send(null);
					}
				} else {
					get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
				}
			}
		}

		if(typeof DEFAULT_LANGUAGE_OVERRIDE != "undefined") {
			get_id("repolink").href = "https://github.com/prochazkaml/CoachiumCached";
			github_request.open("GET", "https://api.github.com/repos/prochazkaml/CoachiumCached/commits/master", true);
		} else {
			get_id("repolink").href = "https://github.com/prochazkaml/Coachium";
			github_request.open("GET", "https://api.github.com/repos/prochazkaml/Coachium/commits/master", true);
		}
	
		github_request.send(null);
	} else {
		get_class("L18N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_LOCALHOST;
	}

	// Load the Google Drive subsystem

	gdrive_reload();

	window.onhashchange();
}

window.onload = window_onload;

/*
 * Keyboard callback for handling keyboard shortcuts.
 */

document.addEventListener('keydown', (event) => {
	const key = event.key.toLowerCase();

	if(key == "tab") event.preventDefault(); // No.

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

			case "n":
				note_manager();
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
