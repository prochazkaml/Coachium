/*
 * Coachium - js/main.js
 * - main JS file of the program, handles UI & device (de)init
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

var driver = null;

// Separate capture_running variable here, which also tracks of waiting for trigger

var request_capture = false, capture_running = false;

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

	const response = await lldriver.init(
		device.driver,
		() => { ui_disconnect(true); },
		() => { popup_window(WINDOWID_DRIVER_INITIALIZING); },
		() => { close_window(WINDOWID_DRIVER_INITIALIZING); }
	);

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

			main_thread();

			break;
	}
}

/*
 * main_thread()
 * 
 * Runs the main operating thread of the application until
 * a fatal error occurs or the device gets disconnected.
 */

async function main_thread() {
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
		} catch(e) {
			// Stop in case the device gets disconnected

			console.log(e);

			// Wait for a bit, if a non-disconnection issue occured, pop up the appropriate error window

			await delay_ms(1000);
			if(driver !== null) {
				driver.deinit();
				ui_disconnect(false);
				get_win_el_tag(WINDOWID_JS_ERR, "textarea").value = e;
				popup_window(WINDOWID_JS_ERR);
			}
			return;
		}

		await delay_ms(200);
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
