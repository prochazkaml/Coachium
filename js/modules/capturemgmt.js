/*
 * Coachium - js/modules/capturemgmt.js
 * - handles all of the stuff regarding capture management
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
 * change_selected_capture(interval)
 * 
 * Changes the currently selected capture for another one.
 */

function change_selected_capture(interval, absolute = undefined) {
	if(interval < 0 && get_id("viewpreviousbutton").classList.contains("navbuttondisabled")) return;
	if(interval > 0 && get_id("viewnextbutton").classList.contains("navbuttondisabled")) return;

	if(captures.length > 0) {
		if(absolute != undefined && absolute != Infinity)
			selected_capture = absolute;
		else if(absolute == Infinity)
			selected_capture = captures.length - 1;
		else
			selected_capture += interval;

		if(selected_capture < 0)
			selected_capture = 0;
		else if(selected_capture >= captures.length)
			selected_capture = captures.length - 1;

		capture = captures[selected_capture];

		if(!capture.zoom) {
			capture.zoom = {
				x1: 0,
				y1: 0,
				x2: 1,
				y2: 1
			};
		}

		zoom = capture.zoom;

		capture_cache.values = [];

		const keys = Object.keys(capture.ports);

		// Time "sensor"

		capture_cache.ports = [
			{
				id: jslang.TIME_SENSOR,
				unit: "s",
				min: 0,
				max: capture.length / 1000
			}
		];
		
		// Copy the actual sensors over

		for(var i = 0; i < keys.length; i++) {
			capture_cache.ports[i + 1] = {
				id: keys[i],
				unit: capture.ports[keys[i]].unit,
				min: capture.ports[keys[i]].min,
				max: capture.ports[keys[i]].max,
				proportion: 1 // Sane default
			}
		}

		capture_cache.xy_mode = capture.xy_mode;

		// If not in X-Y mode, calculate the proportions of each curve (if there are multiple)

		if(!capture.xy_mode) for(var i = 2; i < capture_cache.ports.length; i++) {
			// If the first sensor only has positive values, ignore the negative part of the rest

			if(capture_cache.ports[1].min >= 0) {
				capture_cache.ports[i].proportion = capture_cache.ports[1].max / capture_cache.ports[i].max;
			}

			// If the first sensor only has negative values, ignore the positive part of the rest

			if(capture_cache.ports[1].max <= 0) {
				capture_cache.ports[i].proportion = capture_cache.ports[1].min / capture_cache.ports[i].min;
			}

			// If the first sensor has both negative and positive values, calculate whatever will fit

			if(capture_cache.ports[1].max > 0 && capture_cache.ports[1].min < 0) {
				// Calculate the proportion of the minimums and maximums
				
				var min = capture_cache.ports[1].min / capture_cache.ports[i].min;
				var max = capture_cache.ports[1].max / capture_cache.ports[i].max;

				// If both values are negative, skip, there's nothing we can do

				if(min < 0 && max < 0) continue;

				// If any of them are negative, ignore them

				if(min < 0) min = Infinity;
				if(max < 0) max = Infinity;

				// Choose whichever is smallest

				capture_cache.ports[i].proportion = (min < max) ? min : max;
			}
		}

		// Generate the cache data

		generate_cache(0, Math.floor(capture.data.length / keys.length));
	} else {
		capture_cache.values = [];

		selected_capture = 0;

		capture = null;
	}

	main_window_reset(false, false);

	if(window_stack.includes(WINDOWID_FIT_FUNCTION)) fit_function();
}

/*
 * change_capture_view()
 * 
 * Changes the view on the current capture. Switches between a table or a graph.
 */

function change_capture_view() {
	const c_visible = get_class("canvasstack").style.display != "none";

	if(c_visible) {
		get_class("canvasstack").style.display = "none";
		table.style.display = "";
		get_class("maindisplay").style.overflowY = "scroll";

		get_id("viewastablebutton").style.display = "none";
		get_id("viewasgraphbutton").style.display = "";
	} else {
		get_class("canvasstack").style.display = "";
		table.style.display = "none";
		get_class("maindisplay").style.overflowY = "hidden";

		get_id("viewastablebutton").style.display = "";
		get_id("viewasgraphbutton").style.display = "none";
	}

	main_window_reset(false, true);
}

/*
 * create_capture()
 * 
 * Pops up the dialog for initializing a new capture.
 * 
 * Automatically selects the most ideal configuration based on connected sensors.
 */

function create_capture() {
	if(get_id("capturestartbutton").classList.contains("navbuttondisabled")) return;

	capture_setup_check();

	setTimeout(() => {
		get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupname").get_tag("input").select();
	}, 100);

	popup_window(WINDOWID_CAPTURE_SETUP);
}

/*
 * remove_capture(are_you_sure)
 * 
 * Deletes the currently selected capture from the workbook.
 */

function remove_capture(are_you_sure) {
	if(get_id("removecapturebutton").classList.contains("navbuttondisabled")) return;

	if(!are_you_sure) {
		// Better ask the user if they are sure to delete the current capture

		popup_window(WINDOWID_REMOVE_CAPTURE_WARN);
	} else {
		// Well, it's on you.

		var oldselected = selected_capture;

		captures.splice(selected_capture, 1);

		change_selected_capture(0);

		get_id("statusmsg").innerHTML = format(jslang.STATUS_CAPTURE_REMOVED, oldselected + 1);
	}
}

/*
 * rename_capture(name_decided)
 * 
 * Pops up a dialog for renaming the current capture, if possible.
 */

function rename_capture(name_decided) {
	if(get_id("renamecapturebutton").classList.contains("navbuttondisabled")) return;

	if(!name_decided) {
		get_win_el_tag(WINDOWID_RENAME_CAPTURE, "input").value = capture.title;

		popup_window(WINDOWID_RENAME_CAPTURE);

		setTimeout(() => {
			get_win_el_tag(WINDOWID_RENAME_CAPTURE, "input").select();
		}, 100);
	} else {
		const newtitle = get_win_el_tag(WINDOWID_RENAME_CAPTURE, "input").value

		if(newtitle != "")
			capture.title = newtitle;
		else
			capture.title = jslang.UNTITLED_CAPTURE;

		main_window_reset();
	}
}

/*
 * capture_management()
 * 
 * Initializes the data for the capture manager and opens it.
 */

function capture_management() {
	if(get_id("capturemgmtbutton").classList.contains("navbuttondisabled")) return;

	const w = WINDOWID_CAPTURE_MANAGEMENT;
	const select = get_win_el_tag(w, "select");
	const input = get_win_el_tag(w, "input");

	select.innerHTML = "";

	for(var i = 0; i < captures.length; i++) {
		var option = document.createElement("option");
		option.innerText = (i + 1) + ") " + captures[i].title;

		select.appendChild(option);
	}

	select.onchange = () => {
		input.value = captures[select.selectedIndex].title;
		get_win_el_class(w, "windowbutton").style.backgroundColor = "rgba(0, 0, 0, .1)";
		change_selected_capture(0, select.selectedIndex);
	}

	input.oninput = () => {
		get_win_el_class(w, "windowbutton").style.backgroundColor =
			(input.value == capture.title) ? "rgba(0, 0, 0, .1)" : "";
	}

	get_win_el_class(w, "windowbutton", 0).onclick = () => {
		capture.title = input.value;
		capture_management();
	}

	get_win_el_class(w, "windowbutton", 1).onclick = () => {
		if(selected_capture > 0) {
			const capture = captures[selected_capture];
			captures[selected_capture] = captures[selected_capture - 1];
			captures[selected_capture - 1] = capture;

			change_selected_capture(-1);

			capture_management();
		}
	}

	get_win_el_class(w, "windowbutton", 2).onclick = () => {
		if((selected_capture + 1) < captures.length) {
			const capture = captures[selected_capture];
			captures[selected_capture] = captures[selected_capture + 1];
			captures[selected_capture + 1] = capture;

			change_selected_capture(1);

			capture_management();
		}
	}

	get_win_el_tag(w, "option", selected_capture).selected = true;
	select.onchange();

	popup_window(w);
}

