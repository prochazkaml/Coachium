/*
 * Coachium - js/modules/zoom.js
 * - handles dedicated graph zooming (i.e. no scroll wheel)
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
 * update_capture_zoom()
 * 
 * Updates the zoom values stored in the capture object, so the zoom can be preserved.
 */

function update_capture_zoom() {
	// TODO - get rid of this, just assign capture.zoom to zoom on load

	if(capture)	capture.zoom = {
		x1: zoom.x1,
		y1: zoom.y1,
		x2: zoom.x2,
		y2: zoom.y2
	};
}

/*
 * request_zoom_in()
 * 
 * Prompts the user to select a region, or aborts the current zoom request.
 */

function request_zoom_in() {
	if(get_id("zoominbutton").classList.contains("navbuttondisabled")) return;

	if(!note_placement_progress) {
		if(!zoom_request_progress) {
			get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_IN_REQUEST;
			zoom_request_progress = 1;
			zoom_move_request = false;
			canvas.style.cursor = "crosshair";
			canvas_reset(CANVAS_EVENT_CROSSHAIR_MOVE);
		} else {
			get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_IN_CANCEL;
			zoom_request_progress = 0;
			zoom_move_request = false;
			canvas.style.cursor = "auto";
			canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
		}
	}
}

/*
 * zoom_to_data()
 * 
 * Automatically determines the zoom region based on the captured data.
 */

function zoom_to_data() {
	if(get_id("zoomdatabutton").classList.contains("navbuttondisabled")) return;

	canvas.style.cursor = "auto";

	var min_x = 1, min_y = 1, max_x = 0, max_y = 0;

	for(var i = 0; i < capture_cache.values.length; i++) {
		var x, y;

		if(capture_cache.xy_mode) {
			x = (capture_cache.values[i][1] - capture_cache.ports[1].min) / (capture_cache.ports[1].max - capture_cache.ports[1].min);
			y = (capture_cache.values[i][2] - capture_cache.ports[2].min) / (capture_cache.ports[2].max - capture_cache.ports[2].min);

			if(y > max_y) max_y = y;
			if(y < min_y) min_y = y;
		} else {
			x = (capture_cache.values[i][0] - capture_cache.ports[0].min) / (capture_cache.ports[0].max - capture_cache.ports[0].min);

			for(var j = 1; j < capture_cache.ports.length; j++) {
				y = (capture_cache.values[i][j] - capture_cache.ports[j].min) / (capture_cache.ports[j].max - capture_cache.ports[j].min)

				if(y > max_y) max_y = y;
				if(y < min_y) min_y = y;
			}
		}

		if(x > max_x) max_x = x;
		if(x < min_x) min_x = x;
	}

	if(min_x < max_x && min_y < max_y) {
		const w = max_x - min_x, h = max_y - min_y;

		min_x -= w * .1; min_y -= h * .1;
		max_x += w * .1; max_y += h * .1;

		if(min_x < 0) min_x = 0;
		if(min_y < 0) min_y = 0;
		if(max_x > 1) max_x = 1;
		if(max_y > 1) max_y = 1;

		get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_DATA;
		zoom_request_progress = 0;

		zoom.x1 = min_x; zoom.y1 = min_y;
		zoom.x2 = max_x; zoom.y2 = max_y;

		update_capture_zoom();
		update_button_validity();
		main_window_reset(false, false); // Not needed, since we've done it already
	}
}

/*
 * zoom_reset()
 * 
 * Resets the zoom on the graph.
 */

function zoom_reset() {
	if(get_id("zoomresetbutton").classList.contains("navbuttondisabled")) return;

	get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_RESET;
	zoom_request_progress = 0;
	zoom.x1 = zoom.y1 = 0;
	zoom.x2 = zoom.y2 = 1;

	update_capture_zoom();
	update_button_validity();
	main_window_reset(false, false); // Not needed, since we've done it already
}

/*
 * zoomed_in()
 * 
 * Checks whether zoom is applied on the graph.
 */

function zoomed_in() {
	return !(zoom.x1 == 0 && zoom.y1 == 0 && zoom.x2 == 1 && zoom.y2 == 1);
}