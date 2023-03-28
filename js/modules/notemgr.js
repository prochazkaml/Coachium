/*
 * Coachium - js/modules/notemgr.js
 * - handles user note management
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
 * note_manager()
 * 
 * Initializes the data for the note manager and opens it.
 */

function note_manager() {
	if(get_id("advancedbutton").classList.contains("navbuttondisabled")) return;

	if(get_id("advancedpopup_notemgr").classList.contains("popupitemdisabled")) return;

	close_popup();

	const w = WINDOWID_NOTE_MANAGER;
	const select = get_win_el_tag(w, "select");
	const textarea = get_win_el_tag(w, "textarea");

	const addbutton = get_win_el_class(w, "windowbutton", 1);
	const editbutton = get_win_el_class(w, "windowbutton", 2);
	const movebutton = get_win_el_class(w, "windowbutton", 3);
	const removebutton = get_win_el_class(w, "windowbutton", 4);

	select.innerHTML = "";

	// Initialize notes list, if it is present

	if(!capture.notes) capture.notes = [];

	// Add a "create note" button

	var option = document.createElement("option");
	option.innerHTML = jslang.NOTE_MANAGER_ADD;

	select.appendChild(option);

	for(var i = 0; i < capture.notes.length; i++) {
		option = document.createElement("option");
		option.innerHTML = (i + 1) + ") " + capture.notes[i].text;

		select.appendChild(option);
	}

	// Disable the add button by default, only enable it if there is content

	textarea.oninput = () => {
		if(textarea.value.length != 0)
			addbutton.classList.remove("windowbuttondisabled");
		else
			addbutton.classList.add("windowbuttondisabled");
	}

	addbutton.classList.add("windowbuttondisabled");

	// Auto-generate the UI based on the selection

	select.onchange = () => {
		if(select.selectedIndex == 0) {
			// "Add note" button selected

			addbutton.style.display = "";
			editbutton.style.display = "none";
			movebutton.style.display = "none";
			removebutton.style.display = "none";

			textarea.value = "";
		} else {
			// Existing note selected

			addbutton.style.display = "none";
			editbutton.style.display = "";
			movebutton.style.display = "";
			removebutton.style.display = "";

			// Update the actions on the buttons

			((id) => {
				editbutton.onclick = () => {
					capture.notes[id].text = textarea.value;
					main_window_reset(false, false);
					note_manager();
				}

				movebutton.onclick = () => {
					capture.notes[id].x = -1; // Essentially hide it
					note_id = id;
					initialize_note_placement();
					close_window();
				}

				removebutton.onclick = () => {
					capture.notes.splice(id, 1);
					main_window_reset(false, false);
					note_manager();
				}
			})(select.selectedIndex - 1);

			// Update the textarea

			textarea.value = capture.notes[select.selectedIndex - 1].text;
		}
	}

	// Set the default selected button to "add note" and update the UI

	get_win_el_tag(w, "option", 0).selected = true;
	select.onchange();

	popup_window(w);

	setTimeout(() => {
		textarea.select();
	}, 100);
}

/*
 * add_note()
 * 
 * Requests to add a note to a particular location and saves it.
 */

function add_note() {
	const textarea = get_win_el_tag(WINDOWID_NOTE_MANAGER, "textarea");

	capture.notes.push({
		text: textarea.value,
		x: -1, // I.e. do not render
		y: 0
	});

	note_id = capture.notes.length - 1;
	initialize_note_placement();
	close_window();
}

/*
 * initialize_note_placement()
 * 
 * Initializes the UI for note placement on the canvas.
 */

function initialize_note_placement() {
	zoom_request_progress = 0;
	zoom_move_request = false;
	note_placement_progress = 1;

	canvas.style.cursor = "crosshair";
	canvas_reset(CANVAS_EVENT_CROSSHAIR_MOVE);
	update_button_validity();

	get_id("statusmsg").innerHTML = jslang.STATUS_PLACE_NOTE;
}

