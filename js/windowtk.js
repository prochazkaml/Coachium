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

// FREE IDs: 6

const WINDOWID_LAST_WINDOW = 30;

// General windows

const WINDOWID_ABOUT = 0;
const WINDOWID_JS_ERR = 1;
const WINDOWID_SIZE_WARNING = 5;

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
const WINDOWID_EXPORT_TABLE = 27;
const WINDOWID_EXPORT_CHART = 28;

// Toolbox tool windows

const WINDOWID_TOOLBOX_CALCULATOR = 29;
const WINDOWID_TOOLBOX_CONVERTER = 30;

// Google Drive windows

const WINDOWID_GDRIVE_SAVE_OK = 3;
const WINDOWID_GDRIVE_WORKING = 4;
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
	var overlay = get_win_overlay(win_id)

	return overlay ? overlay.get_class("popupwindow") : null;
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

		if(win_can_pass_events(id)) {
			// Window without background, allow events to pass through and set up window movement
			
			get_win(id).style.pointerEvents = "auto";
			set_window_drag(id, true);
		} else {
			// Static window with dimmed background, block events from passing through

			get_win_overlay(id).style.pointerEvents = "auto";
		}
		
		get_win_overlay(id).style.zIndex = zindex++;
		get_win_overlay(id).style.opacity = 1;
		get_win(id).style.visibility = "visible";
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
		set_window_drag(win, false);

		closetimeoutids[win] = setTimeout(() => {
			get_win(win).style.visibility = "";
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

/*
 * win_can_pass_events(id)
 * 
 * Returns whether a window can pass events through its
 * background parent layer (which is also completely
 * transparent).
 * 
 * If it can, it also checks whether any input box or
 * textarea inside such window currently has focus.
 */

function win_can_pass_events(id) {
	// Does the window have a *non*-transparent background layer?

	if(!get_win_overlay(id).classList.contains("windowoverlayclear")) return false;

	// Is an input or textarea currently active?

	if(document.activeElement.tagName == "INPUT" ||
		document.activeElement.tagName == "TEXTAREA") return false;

	// If not, this window can safely pass events

	return true;
}

/*
 * set_window_drag(id, enable)
 * 
 * Enables or disables the option of dragging a window around
 * by its title.
 */

function set_window_drag(id, enable) {
	var oldwinx, oldwiny, oldx, oldy;
	var win = get_win(id);
	var title = get_win_el_class(id, "windowtitlemoveable");

	if(title && title.onmousedown !== undefined) {
		title.onmousedown = enable ? _drag_mouse_down : null;
		win_force_bounds(win);
	}
	
	function _drag_mouse_down(e) {
		e = e || window.event;
		e.preventDefault();

		oldx = e.clientX;
		oldy = e.clientY;
		oldwinx = win.offsetLeft;
		oldwiny = win.offsetTop;

		get_win_overlay(id).style.zIndex = zindex++;

		document.onmouseup = _close_drag_element;
		document.onmousemove = _element_drag;
	}

	function _element_drag(e) {
		e = e || window.event;
		e.preventDefault();

		// Perform the translation and apply the new window's position

		win_force_bounds(win, {
			x: oldwinx + e.clientX - oldx,
			y: oldwiny + e.clientY - oldy
		});
	}

	function _close_drag_element() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

/*
 * win_force_bounds(win, data)
 * 
 * If the given window is draggable, make sure it stays
 * within its bounds.
 * 
 * data is an optional parameter ({x: ..., y: ...}),
 * which specifies the target window coordinates.
 * If this object is passed, this function will
 * consider these coordinates instead of the current
 * ones and will move the window there.
 */

function win_force_bounds(win, data = null) {
	var mainrect = get_class("maindisplay").getBoundingClientRect();
	var x, y;

	if(data === null) {
		x = win.offsetLeft;
		y = win.offsetTop;
	} else {
		x = data.x;
		y = data.y;
	}

	// Make sure the window does not go out of bounds

	if(x < mainrect.x) x = mainrect.x;

	if(y < mainrect.y) y = mainrect.y;

	if(x > (mainrect.width + mainrect.x - win.offsetWidth))
		x = mainrect.width + mainrect.x - win.offsetWidth;

	if(y > (mainrect.height + mainrect.y - win.offsetHeight))
		y = mainrect.height + mainrect.y - win.offsetHeight;

	// Apply the new window's position

	win.style.left = x + "px";
	win.style.top = y + "px";
	win.style.right = "";
	win.style.bottom = "";
}
