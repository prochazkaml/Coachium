/*
 * Coachium - js/popup.js
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

var curr_popup = null, popup_mode = null, allowed_region = null, popup_timeout = null;

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

	popup_mode = mode;

	switch(mode) {
		case 0:
			win.style.left = (tx - winrect.width - 29) + "px";
			win.style.top = (ty - winrect.height / 2) + "px";
			win.style.marginLeft = "16px";
			break;
		
		case 1:
			win.style.left = (tx - winrect.width / 2) + "px";
			win.style.top = (ty + 19) + "px";
			win.style.marginTop = "0px";
			break;	
	}

	win.style.opacity = 1;
	win.style.pointerEvents = "auto";

	curr_popup = win;

	window.addEventListener("mousedown", close_popup_listener);
}

/*
 * enable_popup_button(htmlid, active)
 * 
 * Sets a particular button in any popup as active/inactive.
 */

function enable_popup_button(htmlid, active) {
	if(active)
		get_id(htmlid).classList.remove("popupitemdisabled");
	else
		get_id(htmlid).classList.add("popupitemdisabled");
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
	if(curr_popup === null) return;

	curr_popup.style.opacity = "";
	curr_popup.style.transform = "";
	curr_popup.style.pointerEvents = "none";

	switch(popup_mode) {
		case 0:
			curr_popup.style.marginLeft = "";
			break;

		case 1:
			curr_popup.style.marginTop = "";
			break;
	}

	popup_timeout = setTimeout(() => {
		curr_popup.style.display = "";
		popup_timeout = null;
		curr_popup = null;
		popup_mode = null;
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
		enable_popup_button("portpopup_zeroout", false);
		enable_popup_button("portpopup_reset", false);
	} else {
		enable_popup_button("portpopup_zeroout", true);
		enable_popup_button("portpopup_reset", driver.ports[id].zero_offset != null);
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

	if(get_id("portpopup_zeroout").classList.contains("popupitemdisabled")) return;

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

	if(get_id("portpopup_reset").classList.contains("popupitemdisabled")) return;

	close_popup();

	driver.ports[port_popup_port_id].zero_offset = null;
}

/*
 * =============================================================================
 * ADVANCED FEATURES POPUP EXCLUSIVE FUNCTIONS FOLLOW
 * =============================================================================
 */

/*
 * initialize_note_placement()
 * 
 * Pops up the popup containing extra advanced features.
 */

function show_advanced_stuff() {
	if(get_id("advancedbutton").classList.contains("navbuttondisabled")) return;

	const buttonrect = get_id("advancedbutton").getBoundingClientRect();

	if(capture_running || captures.length == 0) {
		enable_popup_button("advancedpopup_fitfunction", false);
		enable_popup_button("advancedpopup_notemgr", false);
	} else {
		enable_popup_button("advancedpopup_fitfunction", true);
		enable_popup_button("advancedpopup_notemgr", get_class("canvasstack").style.display != "none");
	}

	init_popup("advancedpopup", buttonrect.x + buttonrect.width / 2, buttonrect.y + buttonrect.height, 1);

	allowed_region = buttonrect;
}
