/*
 * Coachium - js/navbar.js
 * - updates the nav bar button status whenever necessary
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

/*
 * update_button_validity()
 * 
 * Checks each (influenceble) button on the top bar if it is currently valid or not.
 */

function update_button_validity() {
	if(driver === null || Object.keys(driver.ports).length == 0) {
		get_id("capturestartbutton").classList.add("navbuttondisabled");
		get_id("capturestopbutton").classList.add("navbuttondisabled");
	} else {
		get_id("capturestartbutton").classList.remove("navbuttondisabled");
		get_id("capturestopbutton").classList.remove("navbuttondisabled");
	}

	if(capture_running) {
		get_id("capturestopbutton").style.display = "";
		get_id("capturestartbutton").style.display = "none";

		get_id("removeeverythingbutton").classList.add("navbuttondisabled");
		get_id("openbutton").classList.add("navbuttondisabled");
		get_id("savebutton").classList.add("navbuttondisabled");
		get_id("savegdrivebutton").classList.add("navbuttondisabled");

		get_id("removecapturebutton").classList.add("navbuttondisabled");
		get_id("capturemgmtbutton").classList.add("navbuttondisabled");
		get_id("advancedbutton").classList.add("navbuttondisabled");

		get_id("viewpreviousbutton").classList.add("navbuttondisabled");
		get_id("viewnextbutton").classList.add("navbuttondisabled");
		get_id("zoominbutton").classList.add("navbuttondisabled");
		get_id("zoomdatabutton").classList.add("navbuttondisabled");
		get_id("zoomresetbutton").classList.add("navbuttondisabled");

		get_id("captureinfobutton").classList.add("navbuttondisabled");
	} else {
		get_id("capturestartbutton").style.display = "";
		get_id("capturestopbutton").style.display = "none";

		get_id("openbutton").classList.remove("navbuttondisabled");

		if(captures.length == 0) {
			get_id("removeeverythingbutton").classList.add("navbuttondisabled");
			get_id("removecapturebutton").classList.add("navbuttondisabled");
			get_id("capturemgmtbutton").classList.add("navbuttondisabled");
			get_id("advancedbutton").classList.add("navbuttondisabled");
			get_id("savebutton").classList.add("navbuttondisabled");
			get_id("savegdrivebutton").classList.add("navbuttondisabled");
			get_id("viewpreviousbutton").classList.add("navbuttondisabled");
			get_id("viewnextbutton").classList.add("navbuttondisabled");
			get_id("zoominbutton").classList.add("navbuttondisabled");
			get_id("zoomdatabutton").classList.add("navbuttondisabled");
			get_id("zoomresetbutton").classList.add("navbuttondisabled");
			get_id("captureinfobutton").classList.add("navbuttondisabled");
		} else {
			get_id("removeeverythingbutton").classList.remove("navbuttondisabled");
			get_id("removecapturebutton").classList.remove("navbuttondisabled");
			get_id("capturemgmtbutton").classList.remove("navbuttondisabled");
			get_id("advancedbutton").classList.remove("navbuttondisabled");
			get_id("savebutton").classList.remove("navbuttondisabled");
			get_id("savegdrivebutton").classList.remove("navbuttondisabled");
			get_id("captureinfobutton").classList.remove("navbuttondisabled");

			if(get_class("canvasstack").style.display != "none") {
				if(note_placement_progress)
					get_id("zoominbutton").classList.add("navbuttondisabled");
				else
					get_id("zoominbutton").classList.remove("navbuttondisabled");

				get_id("zoomdatabutton").classList.remove("navbuttondisabled");

				if(zoomed_in)
					get_id("zoomresetbutton").classList.remove("navbuttondisabled");
				else
					get_id("zoomresetbutton").classList.add("navbuttondisabled");

			} else {
				get_id("zoominbutton").classList.add("navbuttondisabled");
				get_id("zoomdatabutton").classList.add("navbuttondisabled");
				get_id("zoomresetbutton").classList.add("navbuttondisabled");
			}

			if(selected_capture == 0)
				get_id("viewpreviousbutton").classList.add("navbuttondisabled");
			else
				get_id("viewpreviousbutton").classList.remove("navbuttondisabled");

			if(selected_capture >= (captures.length - 1))
				get_id("viewnextbutton").classList.add("navbuttondisabled");
			else
				get_id("viewnextbutton").classList.remove("navbuttondisabled");
		}
	}
}
