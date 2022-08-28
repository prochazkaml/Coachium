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
			color: "#8F8",
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
			color: "#FF8",
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
			color: "#FB8",
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
			color: "#BBF",
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
		return (this.ports[port].value = Math.sin(window.performance.now() / 500) * 10) - this.ports[port].zero_offset;
	}

	deinit() {}
};
