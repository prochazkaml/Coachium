/*
 * Coachium - js/interfaces/index.js
 * - index of all available drivers (unsurprisingly)
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

const lldrivers = {
	"hid": WebHID
}

const driverindex = {
	"CMA": {
		"€Lab": {
			method: "hid",
			driver: CMA_ELab_driver
		},
		"CoachLab II+": {
			method: "usb",
			driver: CMA_CoachLabIIP_driver
		}
	}
};
