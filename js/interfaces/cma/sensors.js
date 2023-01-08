/*
 * Coachium - js/interfaces/cma/sensors.js
 * - CMA sensor library
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

const CMA_Sensor_Lib = {
	eeprom_addresses: [
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
	],

	/*
	 * CMA_Sensor_Lib.eepromparse(eeprom, writecb)
	 * 
	 * Parses the EEPROM array (which was read in the exact order as the addresses above).
	 * Storing the parsed information is done with a callback function.
	 * 
	 * writecb should be a function with accepts the following parameters:
	 * 
	 * key = parameter name [ name, unit, min, max, coeff_a, coeff_b, mode ]
	 * val = value of the given parameter
	 */

	eepromparse: (eeprom, writecb) => {
		// Sensor name

		var name = "";

		for(var i = 1; i < 21; i++) {
			var val = eeprom[i];

			if(val)
				name += String.fromCharCode(val);
			else
				break;
		}

		writecb("name", name);

		// Unit name

		var unit = "";

		for(var i = 37; i < 42; i++) {
			var val = eeprom[i];

			if(val && val != 41) // Right bracket = terminator
				unit += String.fromCharCode(val);
			else
				break;
		}

		// OVERRIDE FOR THE THERMOCOUPLE: THEY FORGOT TO PUT THE DEGREE SYMBOL IN THE UNIT!

		if(name.startsWith("Thermocouple") && unit == "C")
			unit = "°" + unit;

		writecb("unit", unit);

		// Convert the byte values to floats

		var buffer = new ArrayBuffer(4);
		var bytes = new Uint8Array(buffer);
		var float = new Float32Array(buffer);

		// Minimal value

		for(var i = 0; i < 4; i++)
			bytes[i] = eeprom[21 + i];

		writecb("min", float[0]);

		// Maximal value

		for(var i = 0; i < 4; i++)
			bytes[i] = eeprom[25 + i];

		writecb("max", float[0]);

		// Coefficient a

		for(var i = 0; i < 4; i++)
			bytes[i] = eeprom[29 + i];

		writecb("coeff_a", float[0]);

		// Coefficient b

		for(var i = 0; i < 4; i++)
			bytes[i] = eeprom[33 + i];

		writecb("coeff_b", float[0]);

		// High/low voltage detection

		writecb("mode", (eeprom[42] == 0x21) ? 1 : 0);
	}
};
