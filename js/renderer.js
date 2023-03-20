/*
 * Coachium - js/renderer.js
 * - draws the middle bit of the screen where the graph or table is
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
 * main_window_reset(reset_zoom, reset_layout)
 * 
 * Resets all values in the main window.
 */

function main_window_reset(reset_zoom, reset_layout) {
	if(get_class("canvasstack").style.display != "none") {
		zoom_request_progress = 0;

		if(reset_zoom || zoomed_in == false) {
			zoomed_in = false;
			zoomx1 = zoomy1 = 0;
			zoomx2 = zoomy2 = 1;
			update_capture_zoom();
		}

		if(reset_layout)
			canvas_reset(CANVAS_EVENT_RECALCULATE_STYLES);
		else
			canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
	} else {
		table_reset();
	}

	update_button_validity();
}
