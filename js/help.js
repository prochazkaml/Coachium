/*
 * Coachium - js/help.js
 * - handles the help system
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
 * async help_start()
 * 
 * Loads and starts the help system.
 */

async function help_start() {
	// Load the help index, if it hasn't already been loaded
	
	var index = get_id("helpindex");
	
	if(index.innerHTML == "" || index.innerHTML == jslang.HELP_LOAD_ERROR) {
		if(is_running_cached()) {
			// TODO
		} else {
			// TODO - show loading dialog

			var net = await fetch("./manual/" + lang + "/index.html");

			index.innerHTML = (net.status == 200) ? (await net.text()) : jslang.HELP_LOAD_ERROR;
		}

		await help_switch_page("about");
	}

	// Open the window

	popup_window("about");
}

/*
 * async help_switch_page(pagename)
 * 
 * Loads a given page from the help system and displays it.
 */

async function help_switch_page(pagename) {
	var page = get_id("helppage");

	if(is_running_cached()) {
		// TODO
	} else {
		// TODO - some sort of loading screen

		var net = await fetch("./manual/" + lang + "/" + pagename + "/index.html");

		page.innerHTML = (net.status == 200) ? (await net.text()) : jslang.HELP_LOAD_ERROR;
	}
}
