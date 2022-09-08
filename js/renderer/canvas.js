/*
 * Coachium - js/renderer/canvas.js
 * - renders the capture in a canvas
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

const CANVAS_EVENT_REDRAW_ENTIRE = 0;
const CANVAS_EVENT_CROSSHAIR_MOVE = 1;
const CANVAS_EVENT_RECALCULATE_STYLES = 2;
const CANVAS_EVENT_CURSOR_MOVE = 3;

// These variables control the zoomed in region. All of them range from 0 to 1.

var zoomx1 = 0, zoomy1 = 0, zoomx2 = 1, zoomy2 = 1;

// Zoom control variables

var zoom_request_progress = 0, zoom_move_request = false, zoomed_in = false;

// Note placement variables

var note_placement_progress = 0, note_id;

/*
 * round_to_level(num, level)
 * 
 * Optimally rounds the value based on the round level.
 */

function round_to_level(num, level) {
	return round(num, -Math.floor(level / 3));
}

/*
 * fixed_to_level(num, level)
 * 
 * Optimally rounds the value (and converts it to string with a fixed
 * number of decimal digits) based on the round level.
 */

function fixed_to_level(num, level) {
	var i = -Math.floor(level / 3);

	if(i < 0) i = 0;

	return num.toFixed(i);
}

/*
 * get_optimal_unit_steps(level)
 * 
 * Converts the round level to an actual interval.
 * 
 * -3 → 0.1
 * -2 → 0.2
 * -1 → 0.5
 *  0 → 1
 *  1 → 2
 *  2 → 5
 *  3 → 10
 *      etc.
 */

function get_optimal_unit_steps(level) {
	return [ 1, 2, 5 ][((level % 3) + 3) % 3] * Math.pow(10, Math.floor(level / 3));
}

/*
 * get_optimal_round_level(maxunits, displaysize, limit)
 * 
 * Figures out the ideal spacing of values on a given axis.
 * 
 * The returned value can then be used with get_optimal_unit_steps,
 * round_to_level or fixed_to_level.
 */

function get_optimal_round_level(maxunits, displaysize, limit) {
	var level = -9;

	while(displaysize / (maxunits / get_optimal_unit_steps(level)) < limit) {
		level++;
	}

	return level;
}

/*
 * canvas_reset(event)
 * 
 * Sets the dimensions of the canvas so that it would fit the rest of the UI.
 * Then, it draws the canvas according to the current status.
 * 
 * The event parameter indicates which way should the canvas be redrawn.
 * For all possible event, see the top of this file.
 */

const graph_margin_top    = 72;
const graph_margin_bottom = 40;
const graph_margin_left   = 64;
const graph_margin_right  = 64;

var drawcache = null;

function canvas_reset(event) {
//	console.log(event);

	// Redraw again, if necessary

	if((event != CANVAS_EVENT_CROSSHAIR_MOVE && event != CANVAS_EVENT_CURSOR_MOVE) || drawcache == null) {
		if(event == CANVAS_EVENT_RECALCULATE_STYLES) {
			// Reset canvas parameters

			overlay.width = canvas.width = 0;
			overlay.height = canvas.height = 0;
			overlay.style.width = canvas.style.width = "100%";
			overlay.style.height = canvas.style.height = "100%";

			// Change the drawing size

			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;

			overlay.width = overlay.offsetWidth;
			overlay.height = overlay.offsetHeight;

			// Reset the CSS

			overlay.style.width = canvas.style.width = "";
			overlay.style.height = canvas.style.height = "";
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ovctx.clearRect(0, 0, overlay.width, overlay.height);

//		ovctx.fillStyle = "rgba(255, 0, 0, .5)";
//		ovctx.fillRect(0, 0, canvas.width, canvas.height);

		if(get_class("canvasstack").style.display == "none") return;

		// Set the default ctx values

		ctx.fillStyle = "black";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px Ubuntu";

		if(captures.length > 0) {
			const capture = captures[selected_capture];

			ctx.lineWidth = 2;
			ctx.strokeStyle = "black";

			/*
			 * a_unit_name = axis' unit name (string – e. g. "s" = seconds, "°C" = degrees Celsius etc.)
			 * a_total_units = total number of units on an axis (e. g. range -20–110 °C = 130 units)
			 * a_min = minimal value of an axis (e. g. -20)
			 * a_max = maximal value of an axis (e. g. 110)
			 * a_int_min, a_int_max = same as a_min/a_max, but don't have zoom applied to them
			 * a_unit_in_px = 1 unit converted to screen pixels
			 * a_actual_offset = the point where the axis meets with the other axis
			 * a_offset = same as a_actual_offset, but restricted to the screen dimensions
			 *   e. g. x_offset = 20 → Y axis will be drawn 20 px from the left
			 *         y_offset = 50 → Y axis will be drawn 20 px from the top
			 * a_round_level = value calculated by get_optimal_round_level()
			 * a_optimal_unit_steps = value calculated by get_optimal_unit_steps()
			 */

			var x_unit_name, x_total_units, x_min, x_max, x_int_min, x_int_max, x_unit_in_px, x_offset, x_actual_offset, x_round_level, x_optimal_unit_steps, x_legend_reverse = false,
				y_unit_name, y_total_units, y_min, y_max, y_int_min, y_int_max, y_unit_in_px, y_offset, y_actual_offset, y_round_level, y_optimal_unit_steps, y_legend_reverse = false;

			// Calculate the above described values

			if(capture_cache.xy_mode) {
				x_unit_name = capture_cache.ports[1].unit;
				x_int_min = x_min = capture_cache.ports[1].min;
				x_int_max = x_max = capture_cache.ports[1].max;

				y_unit_name = capture_cache.ports[2].unit;
				y_int_min = y_min = capture_cache.ports[2].min;
				y_int_max = y_max = capture_cache.ports[2].max;
			} else {
				// TODO

				x_unit_name = capture_cache.ports[0].unit;
				x_int_min = x_min = capture_cache.ports[0].min;
				x_int_max = x_max = capture_cache.ports[0].max;

				y_unit_name = capture_cache.ports[1].unit;
				y_int_min = y_min = capture_cache.ports[1].min;
				y_int_max = y_max = capture_cache.ports[1].max;
			}

			// Calculate the rest of the X axis parameters

			if(zoomed_in) {
				x_total_units = Math.abs(x_max - x_min);

				x_max = x_min + zoomx2 * x_total_units;
				x_min += zoomx1 * x_total_units;
			}

			x_total_units = Math.abs(x_max - x_min);

			if(x_min < 0 && x_max < 0) {
				x_offset = canvas.width - graph_margin_right;
				x_legend_reverse = true;
			} else if(x_min < 0 && x_max >= 0) {
				x_offset = graph_margin_left - (canvas.width - graph_margin_left - graph_margin_right) * x_min / x_total_units;
			} else if(x_min >= 0 && x_max >= 0) {
				x_offset = graph_margin_left;
			}

			x_actual_offset = graph_margin_left - (canvas.width - graph_margin_left - graph_margin_right) * x_min / x_total_units;

			x_unit_in_px = (canvas.width - graph_margin_left - graph_margin_right) / x_total_units;
			x_round_level = get_optimal_round_level(x_total_units, canvas.width - graph_margin_left - graph_margin_right, 40);
			x_optimal_unit_steps = get_optimal_unit_steps(x_round_level);

			// Calculate the rest of the Y axis parameters

			if(zoomed_in) {
				y_total_units = Math.abs(y_max - y_min);

				y_max = y_min + zoomy2 * y_total_units;
				y_min += zoomy1 * y_total_units;
			}

			y_total_units = Math.abs(y_max - y_min);

			if(y_min < 0 && y_max < 0) {
				y_offset = graph_margin_top;
				y_legend_reverse = true;
			} else if(y_min < 0 && y_max >= 0) {
				y_offset = canvas.height - graph_margin_bottom + (canvas.height - graph_margin_bottom - graph_margin_top) * y_min / y_total_units;
			} else if(y_min >= 0 && y_max >= 0) {
				y_offset = canvas.height - graph_margin_bottom;
			}

			y_actual_offset = canvas.height - graph_margin_bottom + (canvas.height - graph_margin_bottom - graph_margin_top) * y_min / y_total_units;

			y_unit_in_px = (canvas.height - graph_margin_bottom - graph_margin_top) / y_total_units;
			y_round_level = get_optimal_round_level(y_total_units, canvas.height - graph_margin_bottom - graph_margin_top, 24);
			y_optimal_unit_steps = get_optimal_unit_steps(y_round_level);

			// Draw the grid

			ctx.beginPath();
			ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";

			for(var i = y_optimal_unit_steps; i <= y_max; i = round_to_level(i + y_optimal_unit_steps, y_round_level)) {
				if(i >= y_min) {
					ctx.moveTo(graph_margin_left, y_actual_offset - i * y_unit_in_px);
					ctx.lineTo(canvas.width - graph_margin_right, y_actual_offset - i * y_unit_in_px);
				}
			}

			for(var i = -y_optimal_unit_steps; i >= y_min; i = round_to_level(i - y_optimal_unit_steps, y_round_level)) {
				if(i <= y_max) {
					ctx.moveTo(graph_margin_left, y_actual_offset - i * y_unit_in_px);
					ctx.lineTo(canvas.width - graph_margin_right, y_actual_offset - i * y_unit_in_px);
				}
			}

			for(var i = x_optimal_unit_steps; i <= x_max; i = round_to_level(i + x_optimal_unit_steps, x_round_level)) {
				if(i >= x_min) {
					ctx.moveTo(x_actual_offset + i * x_unit_in_px, graph_margin_top);
					ctx.lineTo(x_actual_offset + i * x_unit_in_px, canvas.height - graph_margin_bottom);
				}
			}

			for(var i = -x_optimal_unit_steps; i >= x_min; i = round_to_level(i - x_optimal_unit_steps, x_round_level)) {
				if(i <= x_max) {
					ctx.moveTo(x_actual_offset + i * x_unit_in_px, graph_margin_top);
					ctx.lineTo(x_actual_offset + i * x_unit_in_px, canvas.height - graph_margin_bottom);
				}
			}

			ctx.stroke();

			// Draw the graph data

			ctx.beginPath();
			ctx.strokeStyle = "red";

			var x, last_x = null, y, last_y = null;

			for(var i = 0; i < capture_cache.values.length; i++) {
				if(capture_cache.xy_mode) {
					x = x_actual_offset + capture_cache.values[i][1] * x_unit_in_px;
					y = y_actual_offset - capture_cache.values[i][2] * y_unit_in_px;
				} else {
					// TODO

					x = x_actual_offset + capture_cache.values[i][0] * x_unit_in_px;
					y = y_actual_offset - capture_cache.values[i][1] * y_unit_in_px;
				}

				if(i &&
					(last_x >= 0 || x >= 0) &&
					(last_x < canvas.width || x < canvas.width) &&
					(last_y >= 0 || y >= 0) &&
					(last_y < canvas.height || y < canvas.height)) {

					ctx.moveTo(last_x, last_y);
					ctx.lineTo(x, y);
				}

				last_x = x;
				last_y = y;
			}

			ctx.stroke();

			// Draw any fitted functions that were assigned to the capture

			if(capture.functions) {
				ctx.save();
				ctx.strokeStyle = "rgba(0, 0, 255, 1)";

				ctx.beginPath();

				for(const [type, output] of Object.entries(capture.functions)) {
					switch(type) {
						case "linear":
							ctx.moveTo(
								x_actual_offset + x_int_min * x_unit_in_px,
								y_actual_offset - (output.a * x_int_min + output.b) * y_unit_in_px
							);

							ctx.lineTo(
								x_actual_offset + x_int_max * x_unit_in_px,
								y_actual_offset - (output.a * x_int_max + output.b) * y_unit_in_px
							);
							break;
					}
				}

				ctx.stroke();
				ctx.restore();
			}

			// Draw any notes, if there are any

			ctx.save();

			if(capture.notes) for(var i = 0; i < capture.notes.length; i++) {
				const note = capture.notes[i];

				draw_note(
					ctx,
					graph_margin_left + (note.x - zoomx1) / (zoomx2 - zoomx1) * (canvas.width - graph_margin_left - graph_margin_right),
					canvas.height - graph_margin_bottom - (note.y - zoomy1) / (zoomy2 - zoomy1) * (canvas.height - graph_margin_top - graph_margin_bottom),
					i
				);
			}
			
			ctx.restore();

			// Slightly hide the parts of the graph which are not in the middle

			ctx.save();

			ctx.fillStyle = "rgba(255, 255, 255, 0.75)";

			ctx.fillRect(0, 0, canvas.width, graph_margin_top);
			ctx.fillRect(0, graph_margin_top, graph_margin_left, canvas.height - graph_margin_top - graph_margin_bottom);
			ctx.fillRect(canvas.width - graph_margin_right, graph_margin_top, graph_margin_right, canvas.height - graph_margin_top - graph_margin_bottom);
			ctx.fillRect(0, canvas.height - graph_margin_bottom, canvas.width, graph_margin_bottom);

			ctx.restore();

			// Draw the axes

			ctx.beginPath();
			ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";

			// Draw the Y axis (based on the X axis offset)

			ctx.moveTo(x_offset, graph_margin_top);
			ctx.lineTo(x_offset, canvas.height - graph_margin_bottom);

			// Draw the X axis (based on the Y axis offset)

			ctx.moveTo(graph_margin_left, y_offset);
			ctx.lineTo(canvas.width - graph_margin_right, y_offset);

			// Draw the dashes on the Y axis & add values to them

			ctx.textAlign = x_legend_reverse ? "left" : "right";
			ctx.textBaseline = "middle";

			for(var i = y_optimal_unit_steps; i <= y_max; i = round_to_level(i + y_optimal_unit_steps, y_round_level)) {
				if(i >= y_min) {
					ctx.moveTo(x_offset - 4, y_actual_offset - i * y_unit_in_px);
					ctx.lineTo(x_offset + 4, y_actual_offset - i * y_unit_in_px);
					ctx.fillText(localize_num(fixed_to_level(i, y_round_level)), x_offset + (x_legend_reverse ? 8 : (-8)), y_actual_offset - i * y_unit_in_px);
				}
			}

			for(var i = -y_optimal_unit_steps; i >= y_min; i = round_to_level(i - y_optimal_unit_steps, y_round_level)) {
				if(i <= y_max) {
					ctx.moveTo(x_offset - 4, y_actual_offset - i * y_unit_in_px);
					ctx.lineTo(x_offset + 4, y_actual_offset - i * y_unit_in_px);
					ctx.fillText(localize_num(fixed_to_level(i, y_round_level)), x_offset + (x_legend_reverse ? 8 : (-8)), y_actual_offset - i * y_unit_in_px);
				}
			}

			// Draw the dashes on the X axis & add values to them

			ctx.textAlign = "center";
			ctx.textBaseline = y_legend_reverse ? "bottom" : "top";

			for(var i = x_optimal_unit_steps; i <= x_max; i = round_to_level(i + x_optimal_unit_steps, x_round_level)) {
				if(i >= x_min) {
					ctx.moveTo(x_actual_offset + i * x_unit_in_px, y_offset - 4);
					ctx.lineTo(x_actual_offset + i * x_unit_in_px, y_offset + 4);
					ctx.fillText(localize_num(fixed_to_level(i, x_round_level)), x_actual_offset + i * x_unit_in_px, y_offset + (y_legend_reverse ? (-12) : 12));
				}
			}

			for(var i = -x_optimal_unit_steps; i >= x_min; i = round_to_level(i - x_optimal_unit_steps, x_round_level)) {
				if(i <= x_max) {
					ctx.moveTo(x_actual_offset + i * x_unit_in_px, y_offset - 4);
					ctx.lineTo(x_actual_offset + i * x_unit_in_px, y_offset + 4);
					ctx.fillText(localize_num(fixed_to_level(i, x_round_level)), x_actual_offset + i * x_unit_in_px, y_offset + (y_legend_reverse ? (-12) : 12));
				}
			}

			// Add the axes' units

			ctx.textBaseline = y_legend_reverse ? "top" : "bottom";
			ctx.textAlign = "center";
			ctx.fillText(y_unit_name, x_offset, y_legend_reverse ? (canvas.height - graph_margin_bottom + 8) : (graph_margin_top - 8));

			ctx.textBaseline = "middle";
			ctx.textAlign = x_legend_reverse ? "right" : "left";
			ctx.fillText(x_unit_name, x_legend_reverse ? (graph_margin_left - 8) : (canvas.width - graph_margin_right + 8), y_offset);

			// Done drawing! Hooray!

			ctx.stroke();

			// Capture name

			ctx.textBaseline = "middle";
			ctx.textAlign = "left";
			ctx.font = "bold 16px Ubuntu";
			ctx.fillText(format(jslang.CAPTURE_FMT, selected_capture + 1, captures.length, capture.title), graph_margin_left, graph_margin_top / 2);

			// If the capture is currently running, display a "crosshair"

			if(driver !== null && capture_running && selected_capture == (captures.length - 1) && x != null && y != null) {
				ctx.beginPath();
				ctx.strokeStyle = "rgba(0, 0, 255, 0.3)";

				ctx.moveTo(x, graph_margin_top);
				ctx.lineTo(x, canvas.height - graph_margin_bottom);

				ctx.moveTo(graph_margin_left, y);
				ctx.lineTo(canvas.width - graph_margin_right, y);

				ctx.stroke();
			}
		} else {
			ctx.fillText(jslang.MAINWIN_NO_CAPTURES_1, canvas.width / 2, canvas.height / 2 - 16);
			ctx.fillText(jslang.MAINWIN_NO_CAPTURES_2, canvas.width / 2, canvas.height / 2 + 16);
		}

		drawcache = null;
	}

	if(note_placement_progress || zoom_request_progress) {
		ovctx.clearRect(0, 0, overlay.width, overlay.height);

		var x = mouseX, y = mouseY;

		if(note_placement_progress) {
			ovctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ovctx.fillRect(0, 0, overlay.width, overlay.height);

			draw_crosshair(x, y, "#0000FF");
			draw_note(ovctx, x, y, note_id);
		} else switch(zoom_request_progress) {
			case 1:
				ovctx.fillStyle = "rgba(0, 0, 0, 0.5)";
				ovctx.fillRect(0, 0, overlay.width, overlay.height);

				draw_crosshair(x, y, "#0000FF");
				break;

			case 2:
				ovctx.fillStyle = "rgba(0, 0, 0, 0.29289)"; // (1 - x) * (1 - x) = 0,5

				if(mousepositions[1][1] < y) {
					ovctx.fillRect(0, 0, overlay.width, mousepositions[1][1]);
					ovctx.fillRect(0, y, overlay.width, overlay.height);
				} else {
					ovctx.fillRect(0, 0, overlay.width, y);
					ovctx.fillRect(0, mousepositions[1][1], overlay.width, overlay.height);
				}

				if(mousepositions[1][0] < x) {
					ovctx.fillRect(0, 0, mousepositions[1][0], overlay.height);
					ovctx.fillRect(x, 0, overlay.width, overlay.height);
				} else {
					ovctx.fillRect(0, 0, x, overlay.height);
					ovctx.fillRect(mousepositions[1][0], 0, overlay.width, overlay.height);
				}

				draw_crosshair(mousepositions[1][0], mousepositions[1][1], "#0000FF");
				draw_crosshair(x, y, "#0000FF");
				break;
		}
	} else if(captures.length > 0) {
		ovctx.clearRect(0, 0, overlay.width, overlay.height);

		if(mouse_over_canvas) {
			var max = [], min = [], unit = [];

			if(capture_cache.xy_mode) {
				max[0] = capture_cache.ports[1].max;
				max[1] = capture_cache.ports[2].max;
				min[0] = capture_cache.ports[1].min;
				min[1] = capture_cache.ports[2].min;
				unit[0] = capture_cache.ports[1].unit;
				unit[1] = capture_cache.ports[2].unit;
			} else {
				// TODO

				max[0] = capture_cache.ports[0].max;
				max[1] = capture_cache.ports[1].max;
				min[0] = capture_cache.ports[0].min;
				min[1] = capture_cache.ports[1].min;
				unit[0] = capture_cache.ports[0].unit;
				unit[1] = capture_cache.ports[1].unit;
			}

			draw_crosshair(mouseX, mouseY, "rgba(0, 0, 255, .5)");

			var mx = (mouseX - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right),
				my = (mouseY - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom),
				uw = Math.abs(max[0] - min[0]),
				uh = Math.abs(max[1] - min[1]);

			uw = uw * (zoomx1 + mx * (zoomx2 - zoomx1)) + min[0];
			uh = uh * (zoomy2 + my * (zoomy1 - zoomy2)) + min[1];

			ovctx.textBaseline = "middle";
			ovctx.textAlign = "right";
			ovctx.font = "16px Ubuntu";
			ovctx.fillStyle = "black";

			ovctx.fillText(
				"X = " + localize_num(ideal_round_fixed(uw, max[0])) + " " + unit[0],
				overlay.width - graph_margin_right - 150,
				graph_margin_top / 2
			);

			ovctx.fillText(
				"Y = " + localize_num(ideal_round_fixed(uh, max[1])) + " " + unit[1],
				overlay.width - graph_margin_right,
				graph_margin_top / 2
			);
		}
	}
}

function draw_crosshair(x, y, color) {
	ovctx.beginPath();
	ovctx.strokeStyle = color;

	ovctx.moveTo(x, graph_margin_top);
	ovctx.lineTo(x, canvas.height - graph_margin_bottom);

	ovctx.moveTo(graph_margin_left, y);
	ovctx.lineTo(canvas.width - graph_margin_right, y);

	ovctx.stroke();
}

function draw_note(ctx, x, y, id) {
	const note = captures[selected_capture].notes[id];

	ctx.font = "16px Ubuntu";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;

	var lines = note.text.split("\n");
	var w = 32; // At least, for the triangle

	for(const line of lines) {
		const wl = ctx.measureText(line).width;

		if(wl > w) w = wl;
	}
	
	y -= 16; // Triangle headroom
	const h = lines.length * 16 + 16; // Y margin

	w += 16; // X margin

	// Draw the message box

	ctx.fillStyle = "rgba(255, 255, 255, .5)";

	ctx.beginPath();
	ctx.moveTo(x, y + 16);
	ctx.lineTo(x + 16, y);
	ctx.lineTo(x + w / 2, y);
	ctx.lineTo(x + w / 2, y - h);
	ctx.lineTo(x - w / 2, y - h);
	ctx.lineTo(x - w / 2, y);
	ctx.lineTo(x - 16, y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();				

	ctx.fillStyle = "black";
	ctx.textBaseline = "top";
	ctx.textAlign = "center";

	for(var i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], x, y - h + 8 + i * 16);
	}
}
