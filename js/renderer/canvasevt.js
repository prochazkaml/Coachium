/*
 * Coachium - js/renderer/canvasevt.js
 * - handles all mouse events on the canvas
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

var mouseX = 0, mouseY = 0, oldmouseX = -1, oldmouseY = -1, lock = false, mouse_over_canvas = false, has_moved = false;

var mousepositions = [[-1, -1], [-1, -1]];

/*
 * canvasmousemovehandler(e)
 * 
 * Callback, when the mouse moves over the canvas.
 */

function canvasmousemovehandler(e) {
	if(lock) return;
	lock = true;

	mouse_over_canvas = true;

	var x = e.offsetX, y = e.offsetY;

	if(x < graph_margin_left) x = graph_margin_left;
	if(x > (canvas.width - graph_margin_right)) x = canvas.width - graph_margin_right;

	if(y < graph_margin_top) y = graph_margin_top;
	if(y > (canvas.height - graph_margin_bottom)) y = canvas.height - graph_margin_bottom;

	mouseX = x;
	mouseY = y;

	if(mouseX != oldmouseX || mouseY != oldmouseY) {
		mousepositions[0][0] = mouseX;
		mousepositions[0][1] = mouseY;

		oldmouseX = mouseX;
		oldmouseY = mouseY;

		if(zoom_move_request) {
			has_moved = true;

			var pw = canvas.width - graph_margin_left - graph_margin_right,
				ph = canvas.height - graph_margin_top - graph_margin_bottom,
				vw = zoom.x2 - zoom.x1,
				vh = zoom.y2 - zoom.y1;

			var dx =  (mouseX - mousepositions[1][0]) / pw * vw,
				dy = -(mouseY - mousepositions[1][1]) / ph * vh;

			if(zoom.x1 - dx < 0)
				dx = zoom.x1;

			if(zoom.y1 - dy < 0)
				dy = zoom.y1;

			if(zoom.x2 - dx > 1)
				dx = zoom.x2 - 1;

			if(zoom.y2 - dy > 1)
				dy = zoom.y2 - 1;

			zoom.x1 -= dx;
			zoom.y1 -= dy;
			zoom.x2 -= dx;
			zoom.y2 -= dy;

			mousepositions[1][0] = mouseX;
			mousepositions[1][1] = mouseY;

			canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
		} else if(zoom_request_progress || note_placement_progress) {
			canvas_reset(CANVAS_EVENT_CROSSHAIR_MOVE);
		} else if(captures.length > 0) {
			canvas_reset(CANVAS_EVENT_CURSOR_MOVE);
		}
	}

	lock = false;
}

/*
 * canvasmousemovehandler(e)
 * 
 * Callback, when the mouse leaves the canvas.
 */

function canvasmouseleavehandler() {
	mouse_over_canvas = false;

	if(!zoom_request_progress && !note_placement_progress)
		ovctx.clearRect(0, 0, overlay.width, overlay.height);
}

/*
 * canvasmousechangehandler(status)
 * 
 * Callback, when the mouse button is clicked/released above the canvas.
 * 
 * status: true = clicked, false = released
 */

function canvasmousechangehandler(status) {
	if(lock) return;
	lock = true;

	if(note_placement_progress && !status && !has_moved) {
		var mx = (mouseX - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right),
			my = (mouseY - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom);
		
		mx = (zoom.x1 + mx * (zoom.x2 - zoom.x1));
		my = (zoom.y2 + my * (zoom.y1 - zoom.y2));

		zoom_move_request = false; // Just in case the user was dragging
		note_placement_progress = 0;
		canvas.style.cursor = "auto";

		const note = capture.notes[note_id];

		note.x = mx; note.y = my;

		update_button_validity();
		get_id("statusmsg").innerHTML = jslang.STATUS_PLACE_NOTE_DONE;

		canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
	} else switch(zoom_request_progress) {
		case 0:
			if(zoomed_in() && status) {
				mousepositions[1][0] = mousepositions[0][0];
				mousepositions[1][1] = mousepositions[0][1];

				has_moved = false;
				zoom_move_request = true;
				canvas.style.cursor = "move";
			} else {
				zoom_move_request = false;
				canvas.style.cursor = note_placement_progress ? "crosshair" : "auto";
			}

			break;

		case 1:
			mousepositions[1][0] = mousepositions[0][0];
			mousepositions[1][1] = mousepositions[0][1];

			zoom_request_progress = 2;

			canvas_reset(CANVAS_EVENT_CROSSHAIR_MOVE);
			break;

		case 2:
			if(mousepositions[1][0] != mousepositions[0][0] &&
			   mousepositions[1][1] != mousepositions[0][1]) {

				var x1 = mousepositions[1][0];
				var y1 = mousepositions[1][1];
				var x2 = mousepositions[0][0];
				var y2 = mousepositions[0][1];

				var _x1 = (((x1 < x2) ? x1 : x2) - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right);
				var _y1 = 1 - (((y1 < y2) ? y2 : y1) - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom);
				var _x2 = (((x1 < x2) ? x2 : x1) - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right);
				var _y2 = 1 - (((y1 < y2) ? y1 : y2) - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom);

				var x = zoom.x2 - zoom.x1, y = zoom.y2 - zoom.y1;

				zoom.x2 = zoom.x1 + _x2 * x;
				zoom.x1 += _x1 * x;
				zoom.y2 = zoom.y1 + _y2 * y;
				zoom.y1 += _y1 * y;

				zoom_request_progress = 0;

				canvas.style.cursor = "auto";

				update_button_validity();
				get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_IN_CONFIRM;

				canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
			}

			break;
	}

	lock = false;
}

/*
 * canvasmousewheelhandler(e)
 * 
 * Callback, when the scroll wheel position changes over the canvas.
 */

function canvasmousewheelhandler(event) {
	var scale = event.deltaY * -0.001,
		mousex = (mousepositions[0][0] - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right),
		mousey = (mousepositions[0][1] - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom);

	// Figure out the selected point in the zoomed in region

	const xl = (zoom.x2 - zoom.x1) * mousex, yt = (zoom.y2 - zoom.y1) * mousey;
	const xr = (zoom.x2 - zoom.x1) * (1 - mousex), yb = (zoom.y2 - zoom.y1) * (1 - mousey);

	if(scale > 0) {
		// Zoom in

		if(scale > 0.5) scale = 0.5;

		if(!event.altKey) {
			zoom.y1 += yb * scale;
			zoom.y2 -= yt * scale;
		}

		if(!event.shiftKey) {
			zoom.x1 += xl * scale;
			zoom.x2 -= xr * scale;
		}
	} else {
		// Zoom out

		if(scale < -0.5) scale = -0.5;

		if(!event.altKey) {
			zoom.y1 += yb * scale;
			zoom.y2 -= yt * scale;
		}

		if(!event.shiftKey) {
			zoom.x1 += xl * scale;
			zoom.x2 -= xr * scale;
		}

		// Handling for when the zoomed out region is temporarily off-screen

		if(zoom.x1 < 0) {
			zoom.x2 -= zoom.x1; zoom.x1 = 0;
			if(zoom.x2 > 1) zoom.x2 = 1;
		}

		if(zoom.x2 > 1) {
			zoom.x1 -= (zoom.x2 - 1); zoom.x2 = 1;
			if(zoom.x1 < 0) zoom.x1 = 0;
		}

		if(zoom.y1 < 0) {
			zoom.y2 -= zoom.y1; zoom.y1 = 0;
			if(zoom.y2 > 1) zoom.y2 = 1;
		}

		if(zoom.y2 > 1) {
			zoom.y1 -= (zoom.y2 - 1); zoom.y2 = 1;
			if(zoom.y1 < 0) zoom.y1 = 0;
		}
	}

	update_button_validity();
	canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
}
