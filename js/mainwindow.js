/*
 * Coachium - js/mainwindow.js
 * - draws the middle bit of the screen where the graph or table is
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
const CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE = 1;
const CANVAS_EVENT_GRAPH_MOVE = 2;
const CANVAS_EVENT_RECALCULATE_STYLES = 3;
const CANVAS_EVENT_CURSOR_MOVE = 4;

// These variables control the zoomed in region. All of them range from 0 to 1.

var zoomx1 = 0, zoomy1 = 0, zoomx2 = 1, zoomy2 = 1;

/*
 * main_window_reset(reset_zoom, reset_layout)
 * 
 * Resets all values in the main window.
 */

function main_window_reset(reset_zoom, reset_layout) {
	if(get_class("canvasstack").style.display != "none") {
		zoom_request_progress = 0;

		if(reset_zoom) zoomed_in = false;
		
		if(reset_layout)
			canvas_reset(CANVAS_EVENT_RECALCULATE_STYLES);
		else
			canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
	} else {
		table_reset();
	}

	update_button_validity();
}

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
	console.log(event);

	// Redraw again, if necessary

	if((event != CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE && event != CANVAS_EVENT_CURSOR_MOVE) || drawcache == null) {
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
		
			x_unit_name = capture_cache.x.unitname;
			x_int_min = x_min = capture_cache.x.min;
			x_int_max = x_max = capture_cache.x.max;

			y_unit_name = capture_cache.y.unitname;
			y_int_min = y_min = capture_cache.y.min;
			y_int_max = y_max = capture_cache.y.max;

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
				x = x_actual_offset + capture_cache.values[i][0] * x_unit_in_px;
				y = y_actual_offset - capture_cache.values[i][1] * y_unit_in_px;

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

				for (const [type, output] of Object.entries(capture.functions)) {
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
	
			if(driver !== null && driver.capture.running && selected_capture == (captures.length - 1) && x != null && y != null) {
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

	if(event == CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE) {
		ovctx.clearRect(0, 0, overlay.width, overlay.height);

		var x = mouseX, y = mouseY;

		switch(zoom_request_progress) {
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
			draw_crosshair(mouseX, mouseY, "rgba(0, 0, 255, .5)");

			var mx = (mouseX - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right),
				my = (mouseY - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom),
				uw = Math.abs(capture_cache.x.max - capture_cache.x.min),
				uh = Math.abs(capture_cache.y.max - capture_cache.y.min);

			uw = uw * (zoomx1 + mx * (zoomx2 - zoomx1)) + capture_cache.x.min;
			uh = uh * (zoomy2 + my * (zoomy1 - zoomy2)) + capture_cache.y.min;

			ovctx.textBaseline = "middle";
			ovctx.textAlign = "right";
			ovctx.font = "16px Ubuntu";
			ovctx.fillStyle = "black";
			ovctx.fillText(
				"X = " + localize_num(ideal_round_fixed(uw, capture_cache.x.max)) + " " + capture_cache.x.unitname,
				overlay.width - graph_margin_right, graph_margin_top / 2 - 10);

			ovctx.fillText(
				"Y = " + localize_num(ideal_round_fixed(uh, capture_cache.y.max)) + " " + capture_cache.y.unitname, 
				overlay.width - graph_margin_right, graph_margin_top / 2 + 10);
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

/*
 * table_reset()
 * 
 * Updates the table and its values.
 */

function table_reset() {
	var out = document.createElement("div");
	const capture = captures[selected_capture];	

	if(captures.length > 0) {
		out.style.marginLeft = graph_margin_left + "px";
		out.style.marginTop = ((graph_margin_top - 16) / 2 - 2) + "px";
		out.style.marginBottom = "16px";

		var title = document.createElement("b");
		title.innerText = format(jslang.CAPTURE_FMT, selected_capture + 1, captures.length, capture.title);
		out.appendChild(title);

		var tbl = document.createElement("table");
		var tr = document.createElement("tr");

		var th = document.createElement("th");
		th.innerText = jslang.INTERVAL;
		tr.appendChild(th);

		switch(capture.sensorsetup) {
			case 0:
				th = document.createElement("th");
				th.innerText = format(jslang.SENSOR_1, capture.port_a.unit);
				tr.appendChild(th);

				th = document.createElement("th");
				th.innerText = format(jslang.SENSOR_2, capture.port_b.unit);
				tr.appendChild(th);
				break;

			case 1:
				th = document.createElement("th");
				th.innerText = format(jslang.SENSOR_1, capture.port_a.unit);
				tr.appendChild(th);
				break;

			case 2:
				th = document.createElement("th");
				th.innerText = format(jslang.SENSOR_2, capture.port_b.unit);
				tr.appendChild(th);
				break;
		}

		tbl.appendChild(tr);

		var td;

		if(capture.sensorsetup) {
			// Single sensor

			for(var i = 0; i < capture_cache.values.length; i++) {
				tr = document.createElement("tr");
				
				td = document.createElement("td");
				td.innerText = localize_num(i * capture.interval / 10000);
				tr.appendChild(td);

				td = document.createElement("td");
				td.innerText = localize_num(capture_cache.values[i][1]);
				tr.appendChild(td);

				tbl.appendChild(tr);
			}
		} else {
			// Both sensors

			for(var i = 0; i < capture_cache.values.length; i++) {
				tr = document.createElement("tr");
				
				td = document.createElement("td");
				td.innerText = localize_num(i * capture.interval / 10000);
				tr.appendChild(td);

				td = document.createElement("td");
				td.innerText = localize_num(capture_cache.values[i][0]);
				tr.appendChild(td);

				td = document.createElement("td");
				td.innerText = localize_num(capture_cache.values[i][1]);
				tr.appendChild(td);

				tbl.appendChild(tr);
			}				
		}
		
		out.appendChild(tbl);
	} else {
		out.className = "infomsg";
		out.innerHTML = "<h2>" + jslang.MAINWIN_NO_CAPTURES_1 + "</h2><h3>" + jslang.MAINWIN_NO_CAPTURES_2 + "</h3>";
	}

	table.innerHTML = "";
	table.appendChild(out);
}

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

			canvas_reset(CANVAS_EVENT_GRAPH_MOVE);
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
