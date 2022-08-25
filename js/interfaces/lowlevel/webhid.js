/*
 * Coachium - js/interfaces/lowlevel/webhid.js
 * - manages low level device functions using WebHID
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

const WebHID = {
	name: "WebHID",

	/*
	 * async WebHID.init(driverclass, disconnectcallback)
	 * 
	 * Creates an instance of a WebHID driver and verifies the device at the other end.
	 * 
	 * If the device ends up being disconneced, the disconnectcallback will be fired.
	 * 
	 * Return values:
	 *   (object) = Success, returned initialized driver instance
	 *   1 = WebHID not supported by the browser
	 *   2 = No device selected
	 *   3 = Error opening device (insufficient permissions?)
	 *   4 = Device selected, but did not verify properly
	 */

	init: async (driverclass, disconnectcallback) => {
		if(!('hid' in navigator)) return 1;

		var instance = new driverclass;

		var devices = await navigator.hid.requestDevice({
			filters: [{
				vendorId: instance.properties.vendorID,
				productId: instance.properties.productID
			}]
		});

		if(devices.length != 1) return 2;

		var device = devices[0];

		try {
			await device.open();
		} catch(e) {
			return 3;
		}

		navigator.hid.ondisconnect = () => {
			instance.deinit();
			disconnectcallback(instance);
		}

		return (await instance.init(device)) ? 4 : instance;
	},

	/*
	 * async WebHID.transfer(device, packet, timeout)
	 * 
	 * Sends a packet to a device and awaits for a response, with
	 * an optional timeout (in ms), in which case, null is returned
	 * instead of the response.
	 */

	transfer: async (device, packet, timeout) => {
		return new Promise((resolve) => {
			var tid;
			
			if(timeout !== undefined) {
				tid = setTimeout(() => {
					resolve(undefined);
				}, timeout)
			}
			
			device.oninputreport = (event) => {
				if(timeout !== undefined) clearTimeout(tid);
				resolve(event.data);
			}

			if(packet !== undefined) WebHID.send(device, packet);
		});
	},

	/*
	 * async WebHID.send(device, packet)
	 * 
	 * Sends a packet (array) to the device. Returns a Promise.
	 */

	send: async (device, packet) => {
		return device.sendReport(0, new Uint8Array(packet));
	},

	/*
	 * async WebHID.receive(device, timeout)
	 * 
	 * Waits for a device's response with an optional timeout (in ms),
	 * in which case, null is returned instead of the response.
	 */

	receive: async (device, timeout) => {
		return WebHID.transfer(device, undefined, timeout);
	}
};
