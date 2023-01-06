/*
 * Coachium - js/interfaces/prochazka/dummy.js
 * - dummy driver
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

class Prochazka_Dummy_driver {
	properties = {};

	ports = {
		"A1": {
			autodetect: true,
			connected: true,
			color: get_port_color(0),
			name: "Thermocouple 110",
			unit: "°C",
			value: 29.48483243242,
			min: -20,
			max: 110,
			coeff_a: 29.093,
			coeff_b: -26.33,
			mode: 0,
			zero_offset: null,
			detected: false
		},
		"A2": {
			autodetect: true,
			connected: true,
			color: get_port_color(1),
			name: "Thermocouple 110",
			unit: "°C",
			value: 29.48483243242,
			min: -20,
			max: 110,
			coeff_a: 29.093,
			coeff_b: -26.33,
			mode: 0,
			zero_offset: null,
			detected: false
		},
		"A3": {
			autodetect: true,
			connected: true,
			color: get_port_color(2),
			name: "Thermocouple 110",
			unit: "°C",
			value: 29.48483243242,
			min: -20,
			max: 110,
			coeff_a: 29.093,
			coeff_b: -26.33,
			mode: 0,
			zero_offset: null,
			detected: false
		},
		"A4": {
			autodetect: true,
			connected: true,
			color: get_port_color(3),
			name: "Thermocouple 110",
			unit: "°C",
			value: 29.48483243242,
			min: -20,
			max: 110,
			coeff_a: 29.093,
			coeff_b: -26.33,
			mode: 0,
			zero_offset: null,
			detected: false
		}
	};

	capture = {
		running: false
	};

	autodetect(portname, updatecb) {
		if(!this.ports[portname].detected) {
			this.ports[portname].detected = true;
			updatecb({ type: "change" });
		}

		return 0;
	};

	getval(port) {
		const keys = Object.keys(driver.ports);

		if(this.ports[port].connected)
			return this.ports[port].value = Math.sin(window.performance.now() / 500 + 2 * Math.PI / keys.length * keys.indexOf(port)) * 10 - this.ports[port].zero_offset;
		else
			return undefined;
	}

	deinit() {}

	verifycapture(setup) {
		if(setup.ports.length < 1 || setup.ports.length > 2) return undefined;

		setup.freq = round(setup.freq);
		
		if(setup.length / 1000 * setup.freq > 10000) setup.length = (10000 / setup.freq) * 1000;
		if(setup.length / 1000 * setup.freq < 2) setup.length = (2 / setup.freq) * 1000;

		return setup;
	}
};
