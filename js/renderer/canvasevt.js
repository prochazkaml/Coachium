/*
 * Coachium - js/renderer/canvasevt.js
 * - handles all mouse events on the canvas
 * 
 * Copyright (C) 2021-2022 Michal Procházka
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

var mouseX = 0, mouseY = 0, oldmouseX = -1, oldmouseY = -1, lock = false, mouse_over_canvas = false;

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
			var pw = canvas.width - graph_margin_left - graph_margin_right,
				ph = canvas.height - graph_margin_top - graph_margin_bottom,
				vw = zoomx2 - zoomx1,
				vh = zoomy2 - zoomy1;

			var dx =  (mouseX - mousepositions[1][0]) / pw * vw,
				dy = -(mouseY - mousepositions[1][1]) / ph * vh;

			if(zoomx1 - dx < 0)
				dx = zoomx1;

			if(zoomy1 - dy < 0)
				dy = zoomy1;

			if(zoomx2 - dx > 1)
				dx = zoomx2 - 1;

			if(zoomy2 - dy > 1)
				dy = zoomy2 - 1;

			zoomx1 -= dx;
			zoomy1 -= dy;
			zoomx2 -= dx;
			zoomy2 -= dy;

			mousepositions[1][0] = mouseX;
			mousepositions[1][1] = mouseY;

			canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
		} else if(zoom_request_progress) {
			canvas_reset(CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE);
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

	if(!zoom_request_progress) ovctx.clearRect(0, 0, overlay.width, overlay.height);	;
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

	switch(zoom_request_progress) {
		case 0:
			if(zoomed_in && status) {
				mousepositions[1][0] = mousepositions[0][0];
				mousepositions[1][1] = mousepositions[0][1];

				zoom_move_request = true;
				canvas.style.cursor = "move";
			} else {
				zoom_move_request = false;
				canvas.style.cursor = "auto";
			}

			break;

		case 1:
			mousepositions[1][0] = mousepositions[0][0];
			mousepositions[1][1] = mousepositions[0][1];

			zoom_request_progress = 2;

			canvas_reset(CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE);
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

				if(!zoomed_in) {
					zoomx1 = 0;
					zoomy1 = 0;
					zoomx2 = 1;
					zoomy2 = 1;
				}

				var x = zoomx2 - zoomx1, y = zoomy2 - zoomy1;

				zoomx2 = zoomx1 + _x2 * x;
				zoomx1 += _x1 * x;
				zoomy2 = zoomy1 + _y2 * y;
				zoomy1 += _y1 * y;

				zoom_request_progress = 0;
				zoomed_in = true;

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

//	console.log(scale);

	if(!zoomed_in) {
		zoomed_in = true;
		zoomx1 = zoomy1 = 0;
		zoomx2 = zoomy2 = 1;

		update_button_validity();
	}

	// Figure out the selected point in the zoomed in region

	const xl = (zoomx2 - zoomx1) * mousex, yt = (zoomy2 - zoomy1) * mousey;
	const xr = (zoomx2 - zoomx1) * (1 - mousex), yb = (zoomy2 - zoomy1) * (1 - mousey);

	if(scale > 0) {
		// Zoom in

		if(scale > 0.5) scale = 0.5;

		zoomx1 += xl * scale;
		zoomy1 += yb * scale;

		zoomx2 -= xr * scale;
		zoomy2 -= yt * scale;
	} else {
		// Zoom out

		if(scale < -0.5) scale = -0.5;

		zoomx1 += xl * scale;
		zoomy1 += yb * scale;

		zoomx2 -= xr * scale;
		zoomy2 -= yt * scale;

		// Handling for when the zoomed out region is temporarily off-screen

		if(zoomx1 < 0) {
			zoomx2 -= zoomx1; zoomx1 = 0;
			if(zoomx2 > 1) zoomx2 = 1;
		}

		if(zoomx2 > 1) {
			zoomx1 -= (zoomx2 - 1); zoomx2 = 1;
			if(zoomx1 < 0) zoomx1 = 0;
		}

		if(zoomy1 < 0) {
			zoomy2 -= zoomy1; zoomy1 = 0;
			if(zoomy2 > 1) zoomy2 = 1;
		}

		if(zoomy2 > 1) {
			zoomy1 -= (zoomy2 - 1); zoomy2 = 1;
			if(zoomy1 < 0) zoomy1 = 0;
		}
	}

	if(zoomx1 == 0 && zoomy1 == 0 && zoomx2 == 1 && zoomy2 == 1) {
		zoomed_in = false;
		update_button_validity();
	}

	canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
}