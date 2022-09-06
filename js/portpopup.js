/*
 * Coachium - js/portpopup.js
 * - manages port popups & their functions
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

/*
 * port_popup(id)
 * 
 * Pops up the port configuration popup next to the requesting port.
 */

var port_popup_timeout = null, port_popup_port_id = null;

function port_popup(id) {
	if(driver === null) return;

	const win = get_class("portpopup");
	const port = get_id("port" + (port_popup_port_id = id));

	if(port_popup_timeout) {
		clearTimeout(port_popup_timeout);
		port_popup_timeout = null;
	}

	update_port_popup();

	win.style.display = "initial";

	const portrect = port.getBoundingClientRect(), winrect = win.getBoundingClientRect();

	win.style.left = (portrect.x - winrect.width - 16 - 8) + "px";
	win.style.top = (portrect.y + (portrect.height - winrect.height) / 2) + "px";

	win.style.opacity = 1;
	win.style.pointerEvents = "auto";

	win.style.marginLeft = "16px";

	window.addEventListener("mousedown", close_port_popup_listener);
}

/*
 * update_port_popup()
 * 
 * Updates each entry's validity in the port configuration popup.
 */

function update_port_popup() {
	if(driver === null) {
		close_port_popup_listener({"force": true});
		return;
	}

	const id = port_popup_port_id;

	if(id == null) return;

	if(!driver.ports[id].connected || driver.capture.running) {
		enable_port_popup_button("L18N_PORT_ZERO_OUT", false);
		enable_port_popup_button("L18N_PORT_RESET", false);
	} else {
		enable_port_popup_button("L18N_PORT_ZERO_OUT", true);
		enable_port_popup_button("L18N_PORT_RESET", driver.ports[id].zero_offset != null);
	}
}

/*
 * enable_port_popup_button(htmlclass, active)
 * 
 * Sets a particular button in the port configuration popup as active/inactive.
 */

function enable_port_popup_button(htmlclass, active) {
	get_class(htmlclass).classList.remove(active ? "portpopupitemdisabled" : "portpopupitem");
	get_class(htmlclass).classList.add(active ? "portpopupitem" : "portpopupitemdisabled");
}

/*
 * close_port_popup_listener(event)
 * 
 * Event listener for the entire window, listens for mouse down events.
 * 
 * Only active when the port popup is displayed, and is used for
 * closing it when the user clicks away from the popup.
 */

function close_port_popup_listener(event) {
	const win = get_class("portpopup");

	if(port_popup_timeout || win.style.display == "") return;

	const winrect = win.getBoundingClientRect();

	const portrect = get_id("port" + port_popup_port_id).getBoundingClientRect();

	if(event.force ||
	  (event.x < winrect.x || event.x > (winrect.x + winrect.width) ||
	   event.y < winrect.y || event.y > (winrect.y + winrect.height)) &&
	 !(event.x > portrect.x && event.x < (portrect.x + portrect.width) &&
	   event.y > portrect.y && event.y < (portrect.y + portrect.height))) {

		close_port_popup();
	}
}

/*
 * close_port_popup()
 * 
 * Closes the currently open port configuration popup.
 */

function close_port_popup() {
	const win = get_class("portpopup");

	win.style.opacity = "";
	win.style.transform = "";
	win.style.pointerEvents = "none";

	win.style.marginLeft = "0px";

	port_popup_timeout = setTimeout(() => {
		win.style.display = "";
		port_popup_timeout = null;
	}, 500);

	window.removeEventListener("mousedown", close_port_popup_listener);
}

/*
 * zero_out_sensor()
 * 
 * If allowed, zeroes out the sensor.
 */

function zero_out_sensor() {
	if(driver === null) return;

	const id = port_popup_port_id;

	if(get_class("L18N_PORT_ZERO_OUT").classList.contains("portpopupitemdisabled")) return;

	close_port_popup();

	if(driver.ports[id].zero_offset == null) driver.ports[id].zero_offset = 0;

	driver.ports[id].zero_offset += driver.ports[id].value;
}

/*
 * reset_sensor_zero_point()
 * 
 * Closes the currently open port configuration popup.
 */

function reset_sensor_zero_point() {
	if(driver === null) return;

	if(get_class("L18N_PORT_RESET").classList.contains("portpopupitemdisabled")) return;

	close_port_popup();

	driver.ports[port_popup_port_id].zero_offset = null;
}
