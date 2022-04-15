/*
 * Coachium - js/elab.js
 * - handles all communications with the €Lab interface
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

var outreport = [ 0x04, 0x01, 0x0B, 0x80, 0x0C, 0x33, 0x0B, 0x00 ];
var outreportaddress = 0;

var watchdog_received = 0, watchdog_acknowledged = -1, watchdog_triggered = 0;
var watchdog_handle;

var background_task_cycle = -1;
var background_task_handle;
var transfer_in_progress = false;

const eeprom_addresses = [
	// For automatic detection of changes (quick replug of another sensor, range switch change)
	0x04,

	// Sensor name
	0x08, 0x09, 0x0A, 0x0B, 
	0x0C, 0x0D, 0x0E, 0x0F, 
	0x10, 0x11, 0x12, 0x13, 
	0x14, 0x15, 0x16, 0x17, 
	0x18, 0x19, 0x1A, 0x1B,

	// Minimal value
	0x3B, 0x3C, 0x3D, 0x3E, 

	// Maximal value
	0x3F, 0x40, 0x41, 0x42, 

	// Coefficient a
	0x4A, 0x4B, 0x4C, 0x4D,
	
	// Coefficient b
	0x46, 0x47, 0x48, 0x49,

	// Unit name
	0x53, 0x54, 0x55, 0x56, 0x57,

	// High/low voltage detection
	0x01
];

const eeprom_length = eeprom_addresses.length;

var ports = [
	{
		"id": "1",
		"color": "#8F8",
		"connected": false,
		"intelligent": true,
		"name": "",
		"unit": "",
		"min_value": 0,
		"max_value": 0,
		"coeff_a": 0,
		"coeff_b": 0,
		"high_voltage": false,
		"raw_eeprom": new Uint8Array(eeprom_length),
		"zero_offset": null
	}, {
		"id": "2",
		"color": "#FF6",
		"connected": false,
		"intelligent": true,
		"name": "",
		"unit": "",
		"min_value": 0,
		"max_value": 0,
		"coeff_a": 0,
		"coeff_b": 0,
		"high_voltage": false,
		"raw_eeprom": new Uint8Array(eeprom_length),
		"zero_offset": null
	}
];

var capturesetupsamples, capturesetupmode, capturesetupspeed, capturesetuppacketsize, capturesetupsamplesize;

/*
 * send_report()
 * 
 * Send a HID report based on the outreport[] array.
 */

function send_report() {
	return device.sendReport(0, new Uint8Array(outreport));
}

/*
 * input_report_callback(event)
 * 
 * Callback, when a packet is received from the device.
 */

function input_report_callback(event) {
	if(!connected) return;

	watchdog_received++;

	if(!capturerunning) switch(outreport[0]) {
		case 0x3:
			// Value read from an input port

			var val = event.data.getUint8(0) * 64 + event.data.getUint8(1);

			switch(outreport[1]) {
				case 0x1: case 0x2:
					// Port 1

					get_id("port1value").innerHTML = prettyprint_value(0, val);
					break;

				case 0x4: case 0x5:
					// Port 2

					get_id("port2value").innerHTML = prettyprint_value(1, val);
					break;
			}
			break;

		case 0x4:
			// Device check

			var checksum = 0;

			for(var i = 0; i < 0x31; i++) {
				checksum += event.data.getUint8(i);
			}

			if(checksum != 3754) {
				get_id("receivedsum").innerHTML = checksum;

				popup_window(WINDOWID_INVALID_CHECKSUM);
			}

			verified = true;
			
			break;

		case 0x14:
			if(!ports[outreport[1]].intelligent) return; // Ignore non-intelligent sensors

			// EEPROM data read

			if(event.data.getUint8(0) == 0) {
				// Read successful!

				if(!ports[outreport[1]].connected || (outreportaddress == 0 && ports[outreport[1]].raw_eeprom[0] != event.data.getUint8(1))) {
					// Either the whole sensor is not read yet, or it is connected, but the value has mysteriously changed...

					ports[outreport[1]].connected = false;
					get_id("port" + ports[outreport[1]].id).style.backgroundColor = "";
					update_port_popup();
					capture_setup_check();

					// Save the currently read value into the port's read cache

					ports[outreport[1]].raw_eeprom[outreportaddress] = event.data.getUint8(1);

					get_id("port" + ports[outreport[1]].id + "status").innerHTML =
						jslang.SENSOR_LOADING + "<br><progress value=\"" + outreportaddress + "\" max=\"" + (eeprom_length - 1) + "\"></progress>";

					get_id("port" + ports[outreport[1]].id + "value").innerHTML = "...";

					// Ask for the next value, if we are not done yet

					if(++outreportaddress < eeprom_length) {
						outreport[2] = eeprom_addresses[outreportaddress];
						send_report();
						return;
					}
				}
			} else {
				// Read error

				get_id("port" + ports[outreport[1]].id + "status").innerHTML = jslang.SENSOR_DISCONNECTED;
				get_id("port" + ports[outreport[1]].id).style.backgroundColor = "";
				
				ports[outreport[1]].connected = false;

				update_port_popup();
				capture_setup_check();
			}

			if(outreportaddress == eeprom_length) {
				// We've read the entire sensor's EEPROM, now we should process tha data!

				// Sensor name

				ports[outreport[1]].name = "";

				for(var i = 1; i < 21; i++) {
					var val = ports[outreport[1]].raw_eeprom[i];

					if(val)
						ports[outreport[1]].name += String.fromCharCode(val);
					else
						break;
				}

				// Unit name

				ports[outreport[1]].unit = "";

				for(var i = 37; i < 42; i++) {
					var val = ports[outreport[1]].raw_eeprom[i];

					if(val && val != 41) // Right bracket = terminator
						ports[outreport[1]].unit += String.fromCharCode(val);
					else
						break;
				}

				// OVERRIDE FOR THE THERMOCOUPLE: CMA IS FULL OF DUMBASSES AND THEY FORGOT TO PUT THE DEGREE SYMBOL IN THE UNIT!

				if(ports[outreport[1]].name.startsWith("Thermocouple") && ports[outreport[1]].unit == "C")
					ports[outreport[1]].unit = "°" + ports[outreport[1]].unit;

				// Convert the byte values to floats

				var buffer = new ArrayBuffer(4);
				var bytes = new Uint8Array(buffer);
				var float = new Float32Array(buffer);

				// Minimal value

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[21 + i];

				ports[outreport[1]].min_value = float[0];

				// Maximal value

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[25 + i];

				ports[outreport[1]].max_value = float[0];

				// Coefficient a

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[29 + i];

				ports[outreport[1]].coeff_a = float[0];

				// Coefficient b

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[33 + i];

				ports[outreport[1]].coeff_b = float[0];

				// High/low voltage detection

				ports[outreport[1]].high_voltage = (ports[outreport[1]].raw_eeprom[42] == 0x21);

				// Done!

				ports[outreport[1]].zero_offset = null;

				get_id("port" + ports[outreport[1]].id + "status").innerHTML =
					jslang.SENSOR_INTELLIGENT + ": " + ports[outreport[1]].name + " (" + ports[outreport[1]].min_value +
					" – " + ports[outreport[1]].max_value + " " + ports[outreport[1]].unit + ")";

				get_id("port" + ports[outreport[1]].id).style.backgroundColor = ports[outreport[1]].color;
				ports[outreport[1]].connected = true;
				
				update_port_popup();
				capture_setup_check();
			}

			// If the sensor was disconnected, or the the read process was finished, reset the read address

			if(event.data.getUint8(0) != 0 || outreportaddress >= eeprom_length)
				outreportaddress = 0;

			break;
	} else {
		for(var i = 0; i < capturesetuppacketsize; i++) {
			receivedcapture[receivedsofar++] = (((event.data.getUint8(0 + i * 2) & 0x3F) << 6) | event.data.getUint8(1 + i * 2));

			if(receivedsofar >= capturesetupsamples) break;
		}

		if(receivedsofar >= capturesetupsamples) deinitialize_capture();
	}

	// Allow the background_task to work again

	transfer_in_progress = false;
}

/*
 * capture_redraw()
 * 
 * Function for redrawing the main window while the capture is running.
 * 
 * It will call itself again after 16 ms, which should roughly match the 60 Hz refresh rate.
 */

function capture_redraw() {
	if(receivedsofar) {
		get_id("statusmsg").innerHTML = format(jslang.STATUS_CAPTURE_RUNNING, receivedsofar, localize_num(((receivedsofar / capturesetupsamplesize - 1) * captures[captures.length - 1].interval / 10000).toFixed(2)));

		switch(capturesetupmode) {
			case 0:
				get_id("port1value").innerHTML = prettyprint_value(0, receivedcapture[receivedsofar - 2]);
				get_id("port2value").innerHTML = prettyprint_value(1, receivedcapture[receivedsofar - 1]);
				break;

			case 1:
				get_id("port1value").innerHTML = prettyprint_value(0, receivedcapture[receivedsofar - 1]);
				get_id("port2value").innerHTML = "–";
				break;

			case 2:
				get_id("port1value").innerHTML = "–";
				get_id("port2value").innerHTML = prettyprint_value(1, receivedcapture[receivedsofar - 1]);
				break;
		}
	}

	if(receivedsofar / capturesetupsamplesize > capturecache.values.length) {
		generate_cache(receivedcapture, capturecache.values.length * capturesetupsamplesize, receivedsofar);
	}

	main_window_reset(true, false);

	if(capturerunning)
		setTimeout(capture_redraw, 16);
	else
		get_id("statusmsg").innerHTML = jslang.STATUS_CAPTURE_FINISHED;
}

/*
 * async initialize_capture()
 * 
 * Sets up the interface's fast mode according to the input parameters.
 */

async function initialize_capture() {
	requestcapture = false;

	capturesetupmode = get_id("capturesetupsensors").selectedIndex;
	
	// Get the interval of the input frequency

	var speed = round(10000 / get_id("capturesetuphz").value);

	if(!capturesetupmode && speed < 2) speed = 2;

	if(speed == 0)
		capturesetupspeed = 0.25; // 40 kHz
	else
		capturesetupspeed = speed;

	// Get the total number of samples

	capturesetupsamplesize = (capturesetupmode ? 1 : 2)
	
	var samples = Math.floor(get_id("capturesetupsecs").value * 10000 / speed) + 1;

	if(samples > (0x4000 / capturesetupsamplesize - 1)) samples = 0x4000 / capturesetupsamplesize - 1;

	capturesetupsamples = samples * capturesetupsamplesize;

	// Create an empty capture

	var capture = Object.assign({}, fresh_capture);

	if(get_id("capturesetupname").value != "")
		capture.title = get_id("capturesetupname").value;
	else
		capture.title = jslang.UNTITLED_CAPTURE;

	capture.seconds = get_id("capturesetupsecs").value;
	capture.samples = capturesetupsamples;
	capture.interval = capturesetupspeed;
	capture.sensorsetup = capturesetupmode;
	capture.port_a = JSON.parse(JSON.stringify(ports[0]));
	capture.port_a.raw_eeprom = undefined;
	capture.port_b = JSON.parse(JSON.stringify(ports[1]));
	capture.port_b.raw_eeprom = undefined;
	capture.captureddata = [];

	receivedcapture = new Array(capturesetupsamples);
	receivedsofar = 0;

	captures[captures.length] = capture;

	change_selected_capture(0, Infinity);

	// Set up the interface

	for(var i = 0; i < 8; i++) outreport[i] = 0;

	var samples_per_packet = Math.ceil(get_id("capturesetuphz").value / 60);

	if((samples_per_packet * capturesetupsamplesize) > 32) samples_per_packet = Math.floor(32 / capturesetupsamplesize);

	if(samples_per_packet < 1) samples_per_packet = 1;

	outreport[0] = 0x05;	// Command for initializing fast mode
	outreport[1] = samples_per_packet;	// Number of samples per packet
	
	await send_report(outreport);

	outreport[0] = outreport[3] = 0;
	
	outreport[1] = speed & 0xFF;
	outreport[2] = speed >> 8;

	outreport[4] = outreport[6] = samples & 0xFF;
	outreport[5] = outreport[7] = samples >> 8;

	await send_report(outreport);

	for(var i = 0; i < 8; i++) outreport[i] = 0;

	switch(capturesetupmode) {
		case 0:
			outreport[1] = ports[1].high_voltage ? 5 : 4;
			// break is missing here intentionally

		case 1:
			outreport[0] = ports[0].high_voltage ? 2 : 1;
			break

		case 2:
			outreport[0] = ports[1].high_voltage ? 5 : 4;
			break
	}

	capturerunning = true;

	capturesetuppacketsize = capturesetupsamplesize * samples_per_packet;

	await send_report(outreport);

	update_button_validity();
	capture_redraw();
}

/*
 * async deinitialize_capture()
 * 
 * Stops the interface's fast mode.
 */

async function deinitialize_capture() {
	for(var i = 0; i < 8; i++) outreport[i] = 0;

	outreport[0] = 0xFF;

	await device.sendReport(0, new Uint8Array(outreport));

	captures[captures.length - 1].captureddata = receivedcapture;

	capturerunning = false;
	requestcapture = false;

	change_selected_capture(0, Infinity);

	update_button_validity();
}

/*
 * background_task()
 * 
 * A background task (executed 8 times per second), which continuously
 * reads the ports' values and checks for their presence.
 */

function background_task() {
	if(!capturerunning) {
		if(transfer_in_progress || !verified) return;

		transfer_in_progress = true;

		if(requestcapture) {
			initialize_capture();
		} else {
			background_task_cycle++;
			background_task_cycle %= 4;

			if(!(background_task_cycle & 1)) {
				// Detection for (dis)connected sensors every odd cycle

				outreport[0] = 0x14; // Command for reading the sensor's EEPROM
				outreport[2] = eeprom_addresses[outreportaddress = 0]; // EEPROM read address

				if(!(background_task_cycle & 2)) {
					// Port 1
					if(!ports[0].intelligent) return; // If the sensor is not intelligent, do not perform autodetection
					outreport[1] = 0x00;
				} else {
					// Port 2
					if(!ports[1].intelligent) return;
					outreport[1] = 0x01;
				}
			} else {
				// Reading value every even cycle

				outreport[0] = 0x03; // Command for reading the sensor's current value
				outreport[2] = 0;

				if(!(background_task_cycle & 2)) {
					// Port 1

					if(ports[0].high_voltage)
						outreport[1] = 0x02;
					else
						outreport[1] = 0x01;

				} else {
					// Port 2

					if(ports[1].high_voltage)
						outreport[1] = 0x05;
					else
						outreport[1] = 0x04;
				}	
			}

			send_report();
		}
	} else {
		if(requestcapture) {
			deinitialize_capture();
		}
	}
}

/*
 * watchdog_task()
 * 
 * A background task (executed every second), which continuously
 * monitors device activity. If no packet has been received within
 * the last 3 seconds, it throws up a warning dialog.
 */

function watchdog_task() {
	if(!capturerunning) {
		if(watchdog_received > watchdog_acknowledged) {
			watchdog_triggered = 0;

			close_window(WINDOWID_WATCHDOG_ERROR);
		} else {
			if(watchdog_triggered == 3) {
				get_id("watchdogmsg").innerHTML = "";
				popup_window(WINDOWID_WATCHDOG_ERROR);
			}

			watchdog_triggered++;
		}

		watchdog_acknowledged = watchdog_received;
	}
}

var watchdog_timeout = null;

function watchdog_restart() {
	if(connected && watchdog_timeout == null) {
		get_id("watchdogmsg").innerHTML = jslang.WATCHDOG_MSG;

		webhid_disconnect();
		watchdog_timeout = setTimeout(() => {webhid_connect(); watchdog_timeout = null;}, 1000);
	}
}

/*
 * async webhid_select()
 * 
 * Pops up a window to select a device and connects to it with WebHID.
 */

async function webhid_select() {
	if(!('hid' in navigator)) {
		popup_window(WINDOWID_WEBHID_UNAVAILABLE);
		return;
	}

	var devices = await navigator.hid.requestDevice({
		filters: [{ vendorId: 0x1126 }] // CMA Amsterdam – hopefully, that won't land me in jail 😁
	});

	if(devices.length == 0) {
		if(get_id("introerrmsg")) {
			header.style.height = "13.5em";
			get_id("introerrmsg").innerHTML = jslang.STATUS_NO_DEVICE_SELECTED;
			get_id("introerrmsg").style.opacity = 1;
		} else {
			get_id("statusmsg").innerHTML = jslang.STATUS_NO_DEVICE_SELECTED;
		}
			
		return;
	}

	device = devices[0];	
	webhid_connect();
}

/*
 * async webhid_connect()
 * 
 * Connects to the previously selected device.
 */

async function webhid_connect() {
	navigator.hid.addEventListener('disconnect', ({device}) => {
		if(connected) {
			webhid_disconnect();

			get_id("statusmsg").innerHTML = format(jslang.STATUS_DEVICE_DISCONNECTED, device.productName);

			nav.style.backgroundColor = "#FAA";
			header.style.backgroundColor = "#F00";
			footer.style.backgroundColor = "#F00";
		}
	});

	device.addEventListener("inputreport", input_report_callback);

	try {
		await device.open();
		await send_report();
		await send_report(); // €Lab needs to receive the initial command twice 🤷

		connected = true;

		ui_connect(true);

		background_task_handle = setInterval(background_task, 125);
		watchdog_handle = setInterval(watchdog_task, 1000);

		console.log(device);
	} catch (error) {
		popup_window(WINDOWID_DEVICE_OPEN_ERROR);		
	}
}

/*
 * async webhid_disconnect()
 * 
 * Disconnects the interface.
 */

async function webhid_disconnect() {
	clearInterval(background_task_handle);
	clearInterval(watchdog_handle);

	connected = false;
	verified = false;

	get_id("capturestartbutton").style.display = "";
	get_id("capturestopbutton").style.display = "none";

	capturerunning = false;
	requestcapture = false;

	ui_disconnect();

	await device.close();

	for(var i = 0; i < ports.length; i++) {
		ports[i].connected = false;
		ports[i].intelligent = true;
	}

	outreport = [ 0x04, 0x01, 0x0B, 0x80, 0x0C, 0x33, 0x0B, 0x00 ];
	outreportaddress = 0;
	background_task_cycle = -1;
	transfer_in_progress = false;

	watchdog_received = 0;
	watchdog_acknowledged = -1;
	watchdog_triggered = 0;
}
