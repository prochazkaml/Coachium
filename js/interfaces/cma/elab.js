/*
 * Coachium - js/interfaces/cma/elab.js
 * - driver for the CMA €Lab interface
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

class CMA_ELab_driver {
	properties = {
		vendorID: 0x1126,
		productID: 0x0002,
		samplememory: 16384,
	};

	ports = {
		"A1": {
			autodetect: true,
			connected: false,
			color: "#8F8",
			_internal_channel_ids: [ 1, 2, 3, 0 ] // Low voltage (0..5 V), High voltage (-10..10 V), Auto-ID, EEPROM channel
		},
		"A2": {
			autodetect: true,
			connected: false,
			color: "#FF6",
			_internal_channel_ids: [ 4, 5, 6, 1 ]
		}

		/*
		 * Connected port example:
		 * 
		 * "1": {
		 *   autodetect: true,
		 *   connected: true,
		 *   color: "#8F8",
		 *   name: "Thermocouple 110",
		 *   unit: "°C",
		 *   value: 29.48483243242,
		 *   min: -20,
		 *   max: 110,
		 *   coeff_a: 29.093,
		 *   coeff_b: -26.33,
		 *   mode: 0, // Indicates whether a high-voltage (-10..10 V) ADC input is used (instead of the 0..5 V one)
		 *   zero_offset: either null or a value which is then subtracted from the read value
		 * }
		 */
	};

	capture = {
		running: false
	};

	/*
	 * async driver.init(device)
	 * 
	 * Initializes the driver and verifies the connected device.
	 * 
	 * Return codes:
	 *   0 = Success
	 *   1 = Device verification error
	 */
	
	async init(device) {
		this.device = device;

		const verifycmd = [ 4, 1, 0, 0, 0, 0, 0, 0 ];

		// The €Lab, after powerup, ignores the first command (for some reason),
		// so send it twice just in case and ignore the output of the first one

		await WebHID.send(this.device, verifycmd);
		await delay_ms(100); // Just in case
		const key = await WebHID.transfer(this.device, verifycmd, 1000);

		// Clear the port buffer

		for(const i in this.ports) {
			this.ports[i].connected = false;
			this.ports[i].autodetect = true;
		}

		this.capture.running = false;

		// Verify the response

		if(key === null || key.buffer === undefined || key.buffer.byteLength != 64) return 1;

		// Meh, this is definitely not a 100%-bulletproof verification, but it'll do the job

		var checksum = 0;

		for(var i = 0; i < 0x31; i++) checksum += key.getUint8(i);

		if(checksum != 3754) {
			this.device.close();
			return 1;
		} else {
			return 0;
		}
	}

	/*
	 * async driver.deinit()
	 * 
	 * Deinitializes the driver.
	 */

	async deinit() {
		await this.stopcapture();
		await this.device.close();
	}

	/*
	 * driver._12bit_to_correct_units(val, port)
	 * 
	 * Converts a 12-bit raw value to a real value according to the port's configuration.
	 */

	_12bit_to_correct_units(val, port) {
		const off = (port.zero_offset !== null) ? port.zero_offset : 0;

		if(port.mode) {
			// High voltage (-10..10 V) mode

			return port.coeff_a * (val / 4095 * 20 - 10) * 1.0130 + port.coeff_b - off;
		} else {
			// Low voltage (0..5 V) mode

			return port.coeff_a * (val / 4095 * 5) * 1.0114 + port.coeff_b - off;
		}
	}

	/*
	 * async driver.getval(portname)
	 * 
	 * Gets the current value of a given port.
	 * Returns undefined if the port is not connected or if an error occurs.
	 */

	async getval(portname) {
		if(this.capture.running) {
			// TODO: read the latest capture data

			return undefined;
		} else {
			// Perform an immediate port read

			const port = this.ports[portname];
			
			if(!port.connected) return undefined;
			
			const response = await WebHID.transfer(this.device, [ 3, port._internal_channel_ids[port.mode], 0, 0, 0, 0, 0, 0 ], 1000);
			
			if(response === undefined) return undefined;
			
			return port.value = this._12bit_to_correct_units(((response.getUint8(0) & 0x3F) << 6) | (response.getUint8(1) & 0x3F), port);
		}
	}

	/*
	 * async driver.autodetect(portname, updatecb)
	 * 
	 * Performs autodetection on a given port, if it is enabled.
	 * Returns 0 on success, 1 on error.
	 * 
	 * updatecb should be a function with accepts the following object:
	 * 
	 * {
	 *   "type": "change" or "load",
	 *   "progress": value from 0 to 1 (only present if "type" is "load")
	 * }
	 */

	async autodetect(portname, updatecb) {
		if(this.capture.running) return 0;

		const port = this.ports[portname];

		if(!port.autodetect) return 0;

		// Initiate an EEPROM read

		const response = await WebHID.transfer(this.device, [ 20, port._internal_channel_ids[3], CMA_Sensor_Lib.eeprom_addresses[0], 0, 0, 0, 0, 0 ], 1000);

		if(response === undefined) return 1;

		if(response.getUint8(0) == 0) {
			// EEPROM read successful, check if it is a fresh connect or if the ID value has changed

			if((!port.connected) || (port._eeprom_id != response.getUint8(1))) {
				// Store the new ID and read the rest

				port._eeprom_id = response.getUint8(1);

				var eeprom = [ port._eeprom_id ];

				for(var i = 1; i < CMA_Sensor_Lib.eeprom_addresses.length; i++) {
					const eeread = await WebHID.transfer(this.device, [ 20, port._internal_channel_ids[3], CMA_Sensor_Lib.eeprom_addresses[i], 0, 0, 0, 0, 0 ], 1000);

					if(eeread.getUint8(0) != 0) break;

					eeprom.push(eeread.getUint8(1));

					updatecb({
						type: "load",
						progress: (i + 1) / CMA_Sensor_Lib.eeprom_addresses.length
					});
				}

				// Only process the data if the entire EEPROM has been read

				if(eeprom.length == CMA_Sensor_Lib.eeprom_addresses.length) {
					CMA_Sensor_Lib.eepromparse(eeprom, (key, val) => {
						this.ports[portname][key] = val;
					});

					port.zero_offset = null;
					port.value = 0;
					port.connected = true;
				} else {
					port.connected = false;
				}

				// Notify the caller about the change

				updatecb({ type: "change" });
			}
		} else {
			// EEPROM read error, port is disconnected

			// If the port was freshly disconnected, notify the caller about the change

			const prev_conn = port.connected;

			port.connected = false;

			if(prev_conn) updatecb({ type: "change" });
		}

		return 0;
	}

	/*
	 * driver._processcapturesetup(setup)
	 * 
	 * Converts the setup settings to machine-compatible format.
	 * 
	 * If an incompatible amount of capture ports is passed, undefined is returned instead of an object.
	 * 
	 * Input object format:
	 * 
	 * {
	 *   "ports": [ "1", ... ]
	 *   "length": number (milliseconds)
	 *   "freq": number (Hz)
	 * }
	 * 
	 * Output object format:
	 * 
	 * {
	 *   "ports": [ "1", ... ]
	 *   "samples": number of samples
	 *   "limited": bool whether the number of samples has been limited (either from the top or bottom)
	 *   "units": number of 10000ths of a seconds per sample
	 *   "spp": number of samples per packet
	 * }
	 */
	
	_processcapturesetup(setup) {
		var output = { ports: setup.ports, limited: false };

		// Convert the frequency to "units" - 10000ths of a second

		var units = round(10000 / setup.freq);
		var maxsamples, maxspp = Math.floor(0x20 / setup.ports.length);

		// Limit unit count from the bottom

		switch(setup.ports.length) {
			case 1:
				// Single-port capture - up to 10 kHz
				if(units < 1) units = 1;
				maxsamples = 0x3FFF; // 16k samples
				break;

			case 2:
				// Dual-port capture - up to 5 kHz
				if(units < 2) units = 2;
				maxsamples = 0x1FFF; // 8k stereo samples
				break;

			default:
				return undefined;
		}

		// Limit unit count from the top (max 0xFFFF - uint16 limit)

		if(units > 0xFFFF) units = 0xFFFF;

		output.units = units;

		// Check the capture length against the interface's available memory

		var len = Math.floor(setup.length * 10 / units) + 1; // 1 initial sample is enforced

		if(len < 2) {
			// Minimum of 2 samples, to at least produce a line

			len = 2;
			output.limited = true;
		}

		if(len > maxsamples) {
			len = maxsamples;
			output.limited = true;	
		}

		output.samples = len;

		// Calculate the number of samples per packet

		var spp = Math.ceil(setup.freq / 60);

		if(spp > maxspp) spp = maxspp;

		if(spp < 1) spp = 1;

		output.spp = spp;

		return output;
	}

	/*
	 * driver.verifycapture(setup)
	 * 
	 * Verifies the desired capture settings and corrects them, if necessary.
	 * 
	 * Input/output object format:
	 * 
	 * {
	 *   "ports": [ "1", ... ]
	 *   "length": number (milliseconds)
	 *   "freq": number (Hz)
	 * }
	 * 
	 * The "length" parameter will only be updated if it was limited.
	 * If an incompatible amount of capture ports is passed, undefined is returned instead of an object. 
	 */

	verifycapture(setup) {
		const p = this._processcapturesetup(setup);

		if(p == undefined) return p;

		// Convert the processed values back to being human-readable

		setup.freq = 10000 / p.units;

		if(p.limited) setup.length = (p.samples - 1) * p.units / 10;

		return setup;
	}

	/*
	 * async driver.startcapture(setup)
	 * 
	 * Starts a capture on this device based on the desired settings.
	 * Returns corrected settings.
	 * 
	 * Returns 0 on success, 1 on invalid settings (selected ports are not connected).
	 */

	async startcapture(setup) {
		var p = this._processcapturesetup(setup);

		if(p == undefined) return 1;

		// Initialize the last init packet

		var startpacket = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
		var ports = [];

		for(var i = 0; i < p.ports.length; i++) {
			const port = this.ports[p.ports[i]];

			if(!port.connected) return 1;

			ports.push(port);

			startpacket[i] = port._internal_channel_ids[port.mode];
		}

		// Get ready for receiving data

		this.device.oninputreport = (event) => {
			// Process the captured data

			var ptr = 0;

			for(var i = 0; i < p.spp; i++) {
				for(var j = 0; j < ports.length; j++) {
					this.capture.data.push(
						this._12bit_to_correct_units(
							((event.data.getUint8(ptr) & 0x3F) << 6) | (event.data.getUint8(ptr + 1) & 0x3F),
							ports[j]
						)
					);
					
					ptr += 2;
				}

				// Check if we've run out of samples

				if(--p.samples <= 0) {
					this.stopcapture();
					break;
				}
			}
		}

		// Initialize the capture data

		this.capture.running = true;
		this.capture.data = [];

		// Send over the initialization commands

		await WebHID.send(this.device, [ 5, p.spp, 0, 0, 0, 0, 0, 0 ]);
		await WebHID.send(this.device, [ 0, 
			p.units & 0xFF, (p.units >> 8) & 0xFF, 0,
			p.samples & 0xFF, (p.samples >> 8) & 0xFF,
			p.samples & 0xFF, (p.samples >> 8) & 0xFF
		]);
		await WebHID.send(this.device, startpacket);

		return 0;
	}

	/*
	 * async driver.stopcapture()
	 * 
	 * Stops the current capture.
	 */

	async stopcapture() {
		// Clear the input event listener

		this.device.oninputreport = () => {};

		// Tell the hardware to stop the capture

		if(this.capture.running) {
			this.capture.running = false;

			try {
				await WebHID.send(this.device, [ 0xFF, 0, 0, 0, 0, 0, 0, 0 ]);
			} catch(e) {
				// Nothing, but do not raise an exception if the device was disconnected
			}
		}
	}
};
