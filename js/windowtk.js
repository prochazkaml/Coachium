/*
 * Coachium - js/windowtk.js
 * - window management toolkit
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

var open_window = -1, window_stack = [], zindex = 10, closetimeoutids = [];

// General windows

const WINDOWID_ABOUT = 0;
const WINDOWID_JS_ERR = 1;

// Capture/file management windows

const WINDOWID_CAPTURE_SETUP = 2;
const WINDOWID_FILE_IMPORT_ERR = 9;
const WINDOWID_IMPORT_OVERWRITE_WARN = 10;
const WINDOWID_REMOVE_CAPTURE_WARN = 11;
const WINDOWID_NUKE_EVERYTHING_WARN = 12;
const WINDOWID_CAPTURE_MANAGEMENT = 13;
const WINDOWID_LOCAL_SAVE_NAME = 16;
const WINDOWID_CAPTURE_INFO = 17;
const WINDOWID_FIT_FUNCTION = 19;
const WINDOWID_NOTE_MANAGER = 23;
const WINDOWID_RENAME_CAPTURE = 26;

// Google Drive windows

const WINDOWID_GDRIVE_SAVE_OK = 3;
const WINDOWID_GDRIVE_SAVE_ERR = 4;
const WINDOWID_GDRIVE_GENERIC_ERR = 5;
const WINDOWID_GDRIVE_NAME = 6;
const WINDOWID_GDRIVE_SUBSYS_ERR = 24;

// Driver/hardware windows

const WINDOWID_DRIVER_SELECTOR = 18;
const WINDOWID_DRIVER_INITIALIZING = 25;

const WINDOWID_LLAPI_UNAVAILABLE = 7;
const WINDOWID_DEVICE_VERIFY_ERROR = 8;
const WINDOWID_DEVICE_OPEN_ERROR = 20;
const WINDOWID_WATCHDOG_ERROR = 21;
const WINDOWID_CAPTURE_START_ERROR = 22;

// Language windows

const WINDOWID_LANGUAGE_SELECTOR = 14;
const WINDOWID_LANGUAGE_ERROR = 15;

/*
 * get_win(win_id)
 * get_win_el_class(win_id, el_class, index)
 * get_win_el_tag(win_id, el_tag, index)
 *
 * Returns the entire window's DOM object or an element contained within
 * (by class name or tag name). Useful for manipulating with the windows.
 * 
 * If the function accepts the parameter "index" and it is not explicitly
 * stated, the function will assume 0 as the default.
 * 
 * With get_win_el_*, if the index is null, then an array is returned
 * with all of the matching elements.
 */

function get_win_overlay(win_id) {
	return get_id("window" + win_id + "overlay");
}

function get_win(win_id) {
	return get_win_overlay(win_id).get_class("popupwindow");
}

function get_win_el_class(win_id, el_class, index = 0) {
	return get_win(win_id).get_class(el_class, index);
}

function get_win_el_tag(win_id, el_tag, index = 0) {
	return get_win(win_id).get_tag(el_tag, index);
}

/*
 * popup_window(id)
 *
 * Pops up a window according to the given ID.
 * 
 * For all possible window IDs, see the top of common.js.
 */

function popup_window(id) {
	if(!(open_window >= 0 && window_stack[open_window] == id)) {
		if(closetimeoutids[id]) clearTimeout(closetimeoutids[id]);

		open_window++;

		window_stack[open_window] = id;

		get_win_overlay(id).style.zIndex = zindex++;

		if(!get_win_overlay(id).classList.contains("windowoverlayclear"))
			get_win_overlay(id).style.pointerEvents = "auto";
		else
			get_win(id).style.pointerEvents = "auto";
		
		get_win_overlay(id).style.opacity = 1;
		get_win(id).style.transform = "scale(1)";
	}
}

/*
 * close_window(id)
 *
 * Closes the currently open window or the one specified by an ID.
 */

function close_window(id = undefined) {
	if(open_window >= 0) {
		var win;

		if(id == undefined) {
			win = window_stack[open_window];
		} else {
			if(!window_stack.includes(id)) return;

			win = id;

			// Remove the specified window from the stack, could be anywhere

			const index = window_stack.indexOf(id);
			if(index > -1) window_stack.splice(index, 1);
		}

		window_stack.length = open_window--;

		get_win_overlay(win).style.pointerEvents = "";
		get_win_overlay(win).style.opacity = "";
		get_win(win).style.transform = "";
		get_win(win).style.pointerEvents = "";

		closetimeoutids[win] = setTimeout(() => {
			get_win_overlay(win).style.zIndex = "";
		}, 500);
	}
}

/*
 * confirm_window()
 *
 * Presses the first button in the window, which always means
 * to confirm something (if it is not disabled).
 */

function confirm_window() {
	if(open_window >= 0) {
		const butt = get_win_el_class(window_stack[open_window], "windowbutton")

		if(!butt.classList.contains("windowbuttondisabled")) butt.click();
	}
}

