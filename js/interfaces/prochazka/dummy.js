/*
 * Coachium - js/interfaces/prochazka/dummy.js
 * - dummy driver
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

class Prochazka_Dummy_driver {
	properties = {};

	ports = {
		"A1": {
			autodetect: true,
			connected: true,
			name: "Dummy sensor 1",
			unit: "W",
			value: 0,
			min: -20,
			max: 20,
			zero_offset: null,
			detected: false,
			_speed: 500
		},
		"A2": {
			autodetect: true,
			connected: true,
			name: "Dummy sensor 2",
			unit: "X",
			value: 0,
			min: -20,
			max: 20,
			zero_offset: null,
			detected: false,
			_speed: 475
		},
		"A3": {
			autodetect: true,
			connected: true,
			name: "Dummy sensor 3",
			unit: "Y",
			value: 0,
			min: -20,
			max: 20,
			zero_offset: null,
			detected: false,
			_speed: 450
		},
		"A4": {
			autodetect: true,
			connected: true,
			name: "Dummy sensor 4",
			unit: "Z",
			value: 0,
			min: -20,
			max: 20,
			zero_offset: null,
			detected: false,
			_speed: 543
		}
	};

	capture = {
		running: false,
		callback: null
	};

	// driver.init is not necessary here

	/*
	 * async driver.deinit()
	 * 
	 * Deinitializes the driver.
	 */
	
	async deinit() {}

	/*
	 * async driver.getval(portname)
	 * 
	 * Gets the current value of a given port.
	 * Returns undefined if the port is not connected or if an error occurs.
	 */

	_getval(portname, phase = null) {
		if(phase === null) phase = window.performance.now();

		const keys = Object.keys(driver.ports);

		if(this.ports[portname].connected)
			return this.ports[portname].value = Math.sin(phase / this.ports[portname]._speed + 2 * Math.PI / keys.length * keys.indexOf(portname)) * 10 - this.ports[portname].zero_offset;
		else
			return undefined;
	}

	async getval(portname) {
		if(this.capture.running) {
			const pindex = this.capture.ports.indexOf(portname)

			if(pindex >= 0 && this.capture.received > 0) {
				return this.ports[portname].value = this.capture.data[(Math.floor(this.capture.received / this.capture.ports.length) - 1) * this.capture.ports.length + pindex];
			} else {
				return undefined;
			}
		} else {
			return this._getval(portname);
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
		if(!this.ports[portname].detected) {
			this.ports[portname].detected = true;
			updatecb({ type: "change" });
		}

		return 0;
	};

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
		if(setup.ports.length < 1 || setup.ports.length > 2) return undefined;

		const units = round(1000 / setup.freq);

		setup.freq = units ? (1000 / units) : 1000;
		
		return setup;
	}

	/*
	 * async driver.startcapture(setup)
	 * 
	 * Starts a capture on this device based on the desired settings.
	 * 
	 * Returns undefined on invalid settings (selected ports are not connected),
	 * object on success:
	 * 
	 * {
	 *   ports: {
	 *     "A1": {
	 *       name: "Thermocouple",
	 *       min, max, unit, ...
	 *     }, ...
	 *   },
	 *   interval: number of us
	 * }
	 */

	async startcapture(setup) {
		if(setup.ports.length < 1 || setup.ports.length > 2) return undefined;

		var units = round(1000 / setup.freq);
		units = units ? units : 1; // Make sure the unit count > 0

		setup.freq = 1000 / units;

		var ports = [];

		for(var i = 0; i < setup.ports.length; i++) {
			const port = this.ports[setup.ports[i]];

			if(!port || !port.connected) return undefined;

			ports.push(port);
		}

		const samples = Math.floor(setup.length / units) + 1;

		// Initialize the capture data

		this.capture.running = true;
		this.capture.data = new Array(samples * ports.length);
		this.capture.received = 0;
		this.capture.ports = setup.ports;

		// Get ready for receiving data

		var phase = window.performance.now();

		this.capture.callback = setInterval(async () => {
			var destphase = window.performance.now();

			for(; phase <= destphase; phase += units) {
				for(var j = 0; j < this.capture.ports.length; j++) {
					this.capture.data[this.capture.received++] = this._getval(this.capture.ports[j], phase);
				}

				// Check if we've finished

				if(this.capture.received >= samples * ports.length) {
					this.stopcapture();
				}
			}
		}, 10);

		console.log(ports);

		return {
			interval: units * 1000, // us
			ports: ports
		};
	}

	/*
	 * async driver.stopcapture()
	 * 
	 * Stops the current capture.
	 */

	async stopcapture() {
		if(this.capture.callback !== null) {
			clearInterval(this.capture.callback);
			this.capture.callback = null;
		}

		if(this.capture.running) {
			this.capture.running = false;
		}
	}
};
