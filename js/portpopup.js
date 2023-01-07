/*
 * Coachium - js/portpopup.js
 * - manages popups & their functions
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

var curr_popup = null, allowed_region = null, popup_timeout = null;

/*
 * init_popup(id, tx, ty, mode)
 * 
 * Pops up a requested popup pointing to a specific location.
 * If mode = 0, then the arrow points to the right. If 1, it points to the top instead.
 */

function init_popup(id, tx, ty, mode) {
	const win = get_id(id);

	if(popup_timeout) {
		clearTimeout(popup_timeout);
		popup_timeout = null;
	}

	win.style.display = "initial";

	const winrect = win.getBoundingClientRect();

	switch(mode) {
		case 0:
			win.style.left = (tx - winrect.width - 32) + "px";
			win.style.top = (ty - winrect.height / 2) + "px";
			break;
	}

	win.style.opacity = 1;
	win.style.pointerEvents = "auto";

	win.style.marginLeft = "16px";

	curr_popup = win;

	window.addEventListener("mousedown", close_popup_listener);
}

/*
 * enable_popup_button(htmlclass, active)
 * 
 * Sets a particular button in any popup as active/inactive.
 */

function enable_popup_button(htmlclass, active) {
	get_class(htmlclass).classList.remove(active ? "popupitemdisabled" : "popupitem");
	get_class(htmlclass).classList.add(active ? "popupitem" : "popupitemdisabled");
}

/*
 * close_popup_listener(event)
 * 
 * Event listener for the entire window, listens for mouse down events.
 * 
 * Only active when the popup is displayed, and is used for
 * closing it when the user clicks away from the popup.
 */

function close_popup_listener(event) {
	if(curr_popup === null) return;

	if(popup_timeout || curr_popup.style.display == "") return;

	const winrect = curr_popup.getBoundingClientRect();

	if(event.force ||
	  (event.x < winrect.x || event.x > (winrect.x + winrect.width) ||
	   event.y < winrect.y || event.y > (winrect.y + winrect.height)) &&
	 ((allowed_region === null) ||
	 !(event.x > allowed_region.x && event.x < (allowed_region.x + allowed_region.width) &&
	   event.y > allowed_region.y && event.y < (allowed_region.y + allowed_region.height)))) {

		close_popup();
	}
}

/*
 * close_popup()
 * 
 * Closes the currently open popup.
 */

function close_popup() {
	curr_popup.style.opacity = "";
	curr_popup.style.transform = "";
	curr_popup.style.pointerEvents = "none";

	curr_popup.style.marginLeft = "0px";

	popup_timeout = setTimeout(() => {
		curr_popup.style.display = "";
		popup_timeout = null;
		curr_popup = null;
		allowed_region = null;
	}, 500);

	window.removeEventListener("mousedown", close_popup_listener);
}

/*
 * =============================================================================
 * PORT POPUP EXCLUSIVE FUNCTIONS FOLLOW
 * =============================================================================
 */

var port_popup_port_id = null;

/*
 * port_popup(id)
 * 
 * Pops up the port configuration popup next to the requesting port.
 */

function port_popup(id) {
	if(driver === null) return;

	const portrect = get_id("port" + (port_popup_port_id = id)).getBoundingClientRect();

	init_popup("portpopup", portrect.x + 8, portrect.y + portrect.height / 2, 0);

	update_port_popup();

	allowed_region = portrect;
}

/*
 * update_port_popup()
 * 
 * Updates each entry's validity in the port configuration popup.
 */

function update_port_popup() {
	if(driver === null) {
		close_popup_listener({"force": true});
		return;
	}

	const id = port_popup_port_id;

	if(id == null) return;

	if(!driver.ports[id].connected || driver.capture.running) {
		enable_popup_button("L18N_PORT_ZERO_OUT", false);
		enable_popup_button("L18N_PORT_RESET", false);
	} else {
		enable_popup_button("L18N_PORT_ZERO_OUT", true);
		enable_popup_button("L18N_PORT_RESET", driver.ports[id].zero_offset != null);
	}
}

/*
 * zero_out_sensor()
 * 
 * If allowed, zeroes out the sensor.
 */

function zero_out_sensor() {
	if(driver === null) return;

	const id = port_popup_port_id;

	if(get_class("L18N_PORT_ZERO_OUT").classList.contains("popupitemdisabled")) return;

	close_popup();

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

	if(get_class("L18N_PORT_RESET").classList.contains("popupitemdisabled")) return;

	close_popup();

	driver.ports[port_popup_port_id].zero_offset = null;
}
