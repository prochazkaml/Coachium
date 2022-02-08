/*
 * Coachium - mainwindow.js
 * - draws the middle bit of the screen where the graph or table is
 * 
 * Made by Michal Procházka, 2021-2022.
 */

const CANVAS_EVENT_REDRAW_ENTIRE = 0;
const CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE = 1;
const CANVAS_EVENT_GRAPH_MOVE = 2;

// These variables control the zoomed in region. All of them range from 0 to 1.

var zoomx1, zoomy1, zoomx2, zoomy2;

/*
 * main_window_reset(reset_zoom)
 * 
 * Resets all values in the main window.
 */

function main_window_reset(reset_zoom) {
	if(canvas.style.display != "none") {
		zoom_request_progress = 0;

		if(reset_zoom) zoomed_in = false;
		
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
	// Redraw again, if necessary

	if(event != CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE || drawcache == null) {
		if(canvas.style.display == "none") return;
		
		// Reset canvas parameters

		canvas.width = 0;
		canvas.height = 0;
		canvas.style.width = "100%";
		canvas.style.height = "100%";

		// Change the drawing size

		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		// Reset the CSS

		canvas.style.width = "";
		canvas.style.height = "";

		// Set the default ctx values

		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px Ubuntu";

		if(captures.length > 0) {
			const capture = captures[selectedcapture];	

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
		
			// Calculate the above described values depending on whether the capture ran with a single sensor or both
		
			if(capture.sensorsetup) {
				// Only one sensor was used
		
				const sensor = capture[(capture.sensorsetup == 1) ? "port_a" : "port_b"];
		
				// X axis parameters
		
				x_unit_name = "s";
				x_int_min = x_min = 0;
				x_int_max = x_max = capture.seconds;

				// Y axis parameters

				y_unit_name = sensor.unit;
				y_int_min = y_min = sensor.min_value;
				y_int_max = y_max = sensor.max_value;
			} else {
				// Both sensors were used
	
				const sensor_a = capture.port_a;
				const sensor_b = capture.port_b;
	
				// X axis parameters
		
				x_unit_name = sensor_b.unit;
				x_int_min = x_min = sensor_b.min_value;
				x_int_max = x_max = sensor_b.max_value;

				// Y axis parameters
		
				y_unit_name = sensor_a.unit;
				y_int_min = y_min = sensor_a.min_value;
				y_int_max = y_max = sensor_a.max_value;
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
			
			var captureddata = (capturerunning && selectedcapture == (captures.length - 1)) ? receivedcapture : capture.captureddata;
			var capturedsofar = (capturerunning && selectedcapture == (captures.length - 1)) ? receivedsofar : captureddata.length;
	
			var x, last_x = null, y, last_y = null;
	
			if(capture.sensorsetup) {
				// Single sensor
	
				const sensor = capture[(capture.sensorsetup == 1) ? "port_a" : "port_b"];
		
				for(var i = 0; i < capturedsofar; i++) {
					x = x_actual_offset + x_unit_in_px * i * capture.interval / 10000;
					y = y_actual_offset - convert_12bit_to_real(captureddata[i], sensor.coeff_a,
						sensor.coeff_b, sensor.high_voltage) * y_unit_in_px;
		
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
			} else {
				// Both sensors
	
				const sensor_a = capture.port_a;
				const sensor_b = capture.port_b;
	
				for(var i = 0; i < capturedsofar; i += 2) {
					x = x_actual_offset + convert_12bit_to_real(captureddata[i + 1], sensor_b.coeff_a,
						sensor_b.coeff_b, sensor_b.high_voltage) * x_unit_in_px;
					y = y_actual_offset - convert_12bit_to_real(captureddata[i], sensor_a.coeff_a,
						sensor_a.coeff_b, sensor_a.high_voltage) * y_unit_in_px;
	
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
	
			ctx.textBaseline = "top";
			ctx.textAlign = "left";
			ctx.font = "bold 16px Ubuntu";
			ctx.fillText(format(jslang.CAPTURE_FMT, selectedcapture + 1, captures.length, capture.title), graph_margin_left, (graph_margin_top - 16) / 2);
	
			// If the capture is currently running, display a "crosshair"
	
			if(capturerunning && selectedcapture == (captures.length - 1) && x != null && y != null) {
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

		drawcache = ctx.getImageData(0, 0, canvas.width, canvas.height);
	}

	if(event == CANVAS_EVENT_ZOOM_CROSSHAIR_MOVE) {
		ctx.putImageData(drawcache, 0, 0);

		var x = mouseX, y = mouseY;

		switch(zoom_request_progress) {
			case 1:
				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
	
				draw_crosshair(x, y);
				break;

			case 2:
				ctx.fillStyle = "rgba(0, 0, 0, 0.29289)"; // (1 - x) * (1 - x) = 0,5

				if(mousepositions[1][1] < y) {
					ctx.fillRect(0, 0, canvas.width, mousepositions[1][1]);
					ctx.fillRect(0, y, canvas.width, canvas.height);
				} else {
					ctx.fillRect(0, 0, canvas.width, y);
					ctx.fillRect(0, mousepositions[1][1], canvas.width, canvas.height);
				}
	
				if(mousepositions[1][0] < x) {
					ctx.fillRect(0, 0, mousepositions[1][0], canvas.height);
					ctx.fillRect(x, 0, canvas.width, canvas.height);
				} else {
					ctx.fillRect(0, 0, x, canvas.height);
					ctx.fillRect(mousepositions[1][0], 0, canvas.width, canvas.height);
				}
	
				draw_crosshair(mousepositions[1][0], mousepositions[1][1]);
				draw_crosshair(x, y);
				break;
		}
	}
}

function draw_crosshair(x, y) {
	ctx.beginPath();
	ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";

	ctx.moveTo(x, graph_margin_top);
	ctx.lineTo(x, canvas.height - graph_margin_bottom);

	ctx.moveTo(graph_margin_left, y);
	ctx.lineTo(canvas.width - graph_margin_right, y);

	ctx.stroke();
}

/*
 * table_reset()
 * 
 * Updates the table and its values.
 */

function table_reset() {
	var out = "";
	const capture = captures[selectedcapture];	

	if(captures.length > 0) {
		out = "<div style='margin-left:" + graph_margin_left + "px;margin-top:" + ((graph_margin_top - 16) / 2 - 2) + "px;margin-bottom:1em'><b>" + 
		format(jslang.CAPTURE_FMT, selectedcapture + 1, captures.length, tags_encode(capture.title)) + "</b>";
		
		switch(capture.sensorsetup) {
			case 0:
				out += "<table><tr><th>" + jslang.INTERVAL + "</th><th>" + format(jslang.SENSOR_1, capture.port_a.unit) + "</th><th>" + format(jslang.SENSOR_2, capture.port_b.unit) + "</th></tr>";
				break;

			case 1:
				out += "<table><tr><th>" + jslang.INTERVAL + "</th><th>" + format(jslang.SENSOR_1, capture.port_a.unit) + "</th></tr>";
				break;

			case 2:
				out += "<table><tr><th>" + jslang.INTERVAL + "</th><th>" + format(jslang.SENSOR_2, capture.port_b.unit) + "</th></tr>";
				break;
		}

		var captureddata = (capturerunning && selectedcapture == (captures.length - 1)) ? receivedcapture : capture.captureddata;
		var capturedsofar = (capturerunning && selectedcapture == (captures.length - 1)) ? receivedsofar : captureddata.length;

		if(capture.sensorsetup) {
			// Single sensor

			const sensor = capture[(capture.sensorsetup == 1) ? "port_a" : "port_b"];

			for(var i = 0; i < capturedsofar; i++) {
				out += "<tr><td>" + localize_num(i * capture.interval / 10000) + "</td><td>" +
					convert_12bit_to_string(captureddata[i], sensor.coeff_a,
						sensor.coeff_b, sensor.high_voltage, sensor.max_value) + "</td></tr>";
			}				
		} else {
			// Both sensors

			const sensor_a = capture.port_a, sensor_b = capture.port_b;

			for(var i = 0; i < capturedsofar; i += 2) {
				out += "<tr><td>" + localize_num(i * capture.interval / 20000) + "</td><td>" +
					convert_12bit_to_string(captureddata[i], sensor_a.coeff_a,
						sensor_a.coeff_b, sensor_a.high_voltage, sensor_a.max_value) + "</td><td>" + 
					convert_12bit_to_string(captureddata[i + 1], sensor_b.coeff_a,
						sensor_b.coeff_b, sensor_b.high_voltage, sensor_b.max_value) + "</td></tr>";
			}				
		}

		out += "</table></div>";
	} else {
		out = "<div class='infomsg'><h2>" + jslang.MAINWIN_NO_CAPTURES_1 + "</h2><h3>" + jslang.MAINWIN_NO_CAPTURES_2 + "</h3></div>";
	}

	table.innerHTML = out;
}

var mouseX = 0, mouseY = 0, oldmouseX = -1, oldmouseY = -1, lock = false;

var mousepositions = [[-1, -1], [-1, -1]];

/*
 * canvasmousemovehandler(e)
 * 
 * Callback, when the mouse moves over the canvas.
 */

function canvasmousemovehandler(e) {
	if(lock) return;
	lock = true;

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
		}
	}

	lock = false;
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
			}

			canvas_reset(CANVAS_EVENT_REDRAW_ENTIRE);
			break;
	}
	
	lock = false;
}

/*
 * canvasmousemovehandler(e)
 * 
 * Callback, when the scroll wheel position changes over the canvas.
 */

function canvasmousewheelhandler(event) {
	const scale = event.deltaY * -0.001,
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

		if(scale > 1) scale = 1;

		zoomx1 += xl * scale;
		zoomy1 += yb * scale;

		zoomx2 -= xr * scale;
		zoomy2 -= yt * scale;
	} else {
		// Zoom out

		if(scale < -1) scale = -1;

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
