/*
 * Coachium - js/keyboard.js
 * - handles keyboard shortcuts
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
 * Keyboard callback for handling keyboard shortcuts.
 */

document.addEventListener('keydown', (event) => {
	const key = event.key.toLowerCase();

	if(open_window >= 0) {
		switch(key) {
			case "escape":
				window.location.hash = '';
				close_window();
				break;

			case "enter":
				confirm_window();
				break;
		}
	} else {
		close_popup();
	}

	if(open_window < 0 || win_can_pass_events(window_stack[open_window])) {
		if(event.ctrlKey) switch(key) {
			case "o":
				event.preventDefault();
				load_file_local(false);
				if(!launched) ui_connect(false);
				break;

			case "s":
				if(!launched) break;

				event.preventDefault();

				if(event.shiftKey)
					popup_gdrive_window();
				else
					save_file_local(false);

				break;

		} else if(launched) switch(key) {
			case " ":
				event.preventDefault();

				if(driver !== null) {
					if(get_id("capturestartbutton").style.display != "none")
						create_capture();
					else
						request_capture = 1;
				}

				break;

			case "t":
				change_capture_view();
				break;

			case "i":
				show_capture_info();
				break;

			case "f":
				fit_function();
				break;

			case "m":
				capture_management();
				break;

			case "n":
				note_manager();
				break;

			case "r":
				rename_capture(false);
				break;

			case "arrowleft":
			case "pageup":
				event.preventDefault();
				change_selected_capture(-1);
				break;

			case "arrowright":
			case "pagedown":
				event.preventDefault();
				change_selected_capture(1);
				break;

			case "delete":
				event.preventDefault();
				remove_capture(false);
				break;

			case "escape":
				event.preventDefault();
				if(zoom_request_progress) request_zoom_in();
				break;

			case "+":
				request_zoom_in();
				break;

			case "-":
				zoom_reset();
				break;

			case "=":
				zoom_to_data();
				break;
		}
	}
});
