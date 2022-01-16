/*
 * round_to_level(num, level)
 * 
 * Podle vrácené hodnoty funkce get_optimal_unit_steps optimálně zaokrouhlí hodnotu.
 */

function round_to_level(num, level) {
	return round(num, -Math.floor(level / 3));
}

/*
 * get_optimal_unit_steps(level)
 * 
 * Převede hodnotu vrácenou funkcí get_optimal_unit_steps na skutečný počet jednotek na interval.
 */

function get_optimal_unit_steps(level) {
	return [ 1, 2, 5 ][((level % 3) + 3) % 3] * Math.pow(10, Math.floor(level / 3));
}

/*
 * get_optimal_unit_steps(maxunits, displaysize, limit)
 * 
 * Zjistí podle maximální hodnoty na ose, jaký by měl být ideální interval mezi čárkami na dané ose.
 * 
 * Vrací hodnotu, kterou lze poté použít s funkcemi get_optimal_unit_steps a round_to_level.
 */

function get_optimal_round_level(maxunits, displaysize, limit) {
	var level = -9;
	
	while(displaysize / (maxunits / get_optimal_unit_steps(level)) < limit) {
		level++;
	}
	
	return level;
}

/*
 * canvas_reset(redraw_chart)
 * 
 * Znovu nastaví rozměry canvasu tak, aby seděly vůči zbytku UI.
 * Pak vykreslí canvas podle současného stavu záznamu.
 * 
 * Pokud je parametr redraw_chart = true, pak se vykreslí obraz
 * odznova, jinak bude použita mezipaměť pro zvýšení výkonu.
 */

const graph_margin_top    = 72;
const graph_margin_bottom = 40;
const graph_margin_left   = 48;
const graph_margin_right  = 48;

var drawcache = null;

function canvas_reset(redraw_chart) {
	// Znovu vykreslit, pokud je potřeba

	if(redraw_chart || drawcache == null) {
		if(canvas.style.display == "none") return;
		
		// Resetovat parametry canvasu

		canvas.width = 0;
		canvas.height = 0;
		canvas.style.width = "100%";
		canvas.style.height = "100%";

		// Změnit velikost

		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		// Resetovat CSS

		canvas.style.width = "";
		canvas.style.height = "";

		// Nastavit výchozí parametry kontextu

		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.font = "16px Ubuntu";

		if(captures.length > 0) {
			ctx.lineWidth = 2;
			ctx.strokeStyle = "black";
		
			/*
			 * a_unit_name = název jednotky dané osy (řetězec – např. "s" = sekundy, "°C" = stupně Celsia atd.)
			 * a_total_units = počet jednotek dané jednotky na dané ose (např. rozsah -20–110 °C = 130 jednotek)
			 * a_min = minimální hodnota osy (např. -20)
			 * a_max = maximální hodnota osy (např. 110)
			 * a_unit_in_px = převod hodnoty jednotky dané osy na vzdálenost v pixelech
			 * a_actual_offset = bod 0 na ose
			 * a_offset = pozice na obrazovce *té druhé osy*
			 *   např. x_offset = 20 → osa Y se vykreslí 20 pixelů zleva (určuje pozici X)
			 *         y_offset = 50 → osa X se vykreslí 50 pixelů shora (určuje pozici Y)
			 * a_round_level = hodnota vykalkulovaná funkcí get_optimal_round_level()
			 * a_optimal_unit_steps = hodnota vykalkulovaná funkcí get_optimal_unit_steps()
			 */
		
			var x_unit_name, x_total_units, x_min, x_max, x_unit_in_px, x_offset, x_actual_offset, x_round_level, x_optimal_unit_steps,
				y_unit_name, y_total_units, y_min, y_max, y_unit_in_px, y_offset, y_actual_offset, y_round_level, y_optimal_unit_steps;
		
			// Vykalkulovat výše popsané hodnoty podle toho, zda měření proběhlo s jedním čidlem nebo s oběma
		
			if(captures[selectedcapture].sensorsetup) {
				// Bylo použito jen jedno čidlo
		
				const sensor = captures[selectedcapture][(captures[selectedcapture].sensorsetup == 1) ? "port_a" : "port_b"];
		
				// Parametry osy X
		
				x_unit_name = "s";
				x_min = 0;
				x_max = captures[selectedcapture].seconds;

				if(zoomed_in) {
					var x1 = (((zoomx1 < zoomx2) ? zoomx1 : zoomx2) - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right);
					var x2 = (((zoomx1 < zoomx2) ? zoomx2 : zoomx1) - graph_margin_left) / (canvas.width - graph_margin_left - graph_margin_right);

					x_total_units = Math.abs(x_max - x_min);

					x_max = x_min + x2 * x_total_units;		
					x_min += x1 * x_total_units;

					console.log(x_min, x_max);
				}

				x_total_units = Math.abs(x_max - x_min);

				if(x_min < 0 && x_max < 0) {
					x_offset = canvas.width - graph_margin_right;
				} else if(x_min < 0 && x_max >= 0) {
					x_offset = graph_margin_left - (canvas.width - graph_margin_left - graph_margin_right) * x_min / x_total_units;
				} else if(x_min >= 0 && x_max >= 0) {
					x_offset = graph_margin_left;
				}

				x_actual_offset = graph_margin_left - (canvas.width - graph_margin_left - graph_margin_right) * x_min / x_total_units;
		
				x_unit_in_px = (canvas.width - graph_margin_left - graph_margin_right) / x_total_units;
				x_round_level = get_optimal_round_level(x_total_units, canvas.width - graph_margin_left - graph_margin_right, 40);
				x_optimal_unit_steps = get_optimal_unit_steps(x_round_level);
	
				// Parametry osy Y
		
				y_unit_name = sensor.unit;
				y_min = sensor.min_value;
				y_max = sensor.max_value;

				if(zoomed_in) {
					var y1 = 1 - (((zoomy1 < zoomy2) ? zoomy2 : zoomy1) - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom);
					var y2 = 1 - (((zoomy1 < zoomy2) ? zoomy1 : zoomy2) - graph_margin_top) / (canvas.height - graph_margin_top - graph_margin_bottom);
	
					y_total_units = Math.abs(y_max - y_min);

					y_max = y_min + y2 * y_total_units;
					y_min += y1 * y_total_units;
	
					console.log(y_min, y_max);
				}

				y_total_units = Math.abs(y_max - y_min);

				if(y_min < 0 && y_max < 0) {
					y_offset = graph_margin_top;
				} else if(y_min < 0 && y_max >= 0) {
					y_offset = canvas.height - graph_margin_bottom + (canvas.height - graph_margin_bottom - graph_margin_top) * y_min / y_total_units;
				} else if(y_min >= 0 && y_max >= 0) {
					y_offset = canvas.height - graph_margin_bottom;
				}

				y_actual_offset = canvas.height - graph_margin_bottom + (canvas.height - graph_margin_bottom - graph_margin_top) * y_min / y_total_units;

				y_unit_in_px = (canvas.height - graph_margin_bottom - graph_margin_top) / y_total_units;
				y_round_level = get_optimal_round_level(y_total_units, canvas.height - graph_margin_bottom - graph_margin_top, 24);
				y_optimal_unit_steps = get_optimal_unit_steps(y_round_level);
			} else {
				// Byla použita dvě čidla
	
				const sensor_a = captures[selectedcapture].port_a;
				const sensor_b = captures[selectedcapture].port_b;
	
				// Parametry osy X
		
				x_unit_name = sensor_b.unit;
				x_min = sensor_b.min_value;
				x_max = sensor_b.max_value;

				x_total_units = Math.abs(x_max - x_min);

				if(x_min < 0 && x_max < 0) {
					x_offset = canvas.width - graph_margin_right;
				} else if(x_min < 0 && x_max >= 0) {
					x_offset = graph_margin_left - (canvas.width - graph_margin_left - graph_margin_right) * x_min / x_total_units;
				} else if(x_min >= 0 && x_max >= 0) {
					x_offset = graph_margin_left;
				}

				x_actual_offset = graph_margin_left - (canvas.width - graph_margin_left - graph_margin_right) * x_min / x_total_units;
			
				x_unit_in_px = (canvas.width - graph_margin_left - graph_margin_right) / x_total_units;
				x_round_level = get_optimal_round_level(x_total_units, canvas.width - graph_margin_left - graph_margin_right, 40);
				x_optimal_unit_steps = get_optimal_unit_steps(x_round_level);
		
				// Parametry osy Y
		
				y_unit_name = sensor_a.unit;
				y_min = sensor_a.min_value;
				y_max = sensor_a.max_value;
		
				y_total_units = Math.abs(y_max - y_min);

				if(y_min < 0 && y_max < 0) {
					y_offset = graph_margin_top;
				} else if(y_min < 0 && y_max >= 0) {
					y_offset = canvas.height - graph_margin_bottom + (canvas.height - graph_margin_bottom - graph_margin_top) * y_min / y_total_units;
				} else if(y_min >= 0 && y_max >= 0) {
					y_offset = canvas.height - graph_margin_bottom;
				}

				y_actual_offset = canvas.height - graph_margin_bottom + (canvas.height - graph_margin_bottom - graph_margin_top) * y_min / y_total_units;

				y_unit_in_px = (canvas.height - graph_margin_bottom - graph_margin_top) / y_total_units;
				y_round_level = get_optimal_round_level(y_total_units, canvas.height - graph_margin_bottom - graph_margin_top, 24);
				y_optimal_unit_steps = get_optimal_unit_steps(y_round_level);
			}
		
			// Nakreslit mřížku
		
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
	
			// Nakreslit graf
		
			ctx.beginPath();
			ctx.strokeStyle = "red";
			
			var captureddata = (capturerunning && selectedcapture == (captures.length - 1)) ? receivedcapture : captures[selectedcapture].captureddata;
			var capturedsofar = (capturerunning && selectedcapture == (captures.length - 1)) ? receivedsofar : captureddata.length;
	
			var x = null, y = null;
	
			if(captures[selectedcapture].sensorsetup) {
				// Jedno čidlo
	
				const sensor = captures[selectedcapture][(captures[selectedcapture].sensorsetup == 1) ? "port_a" : "port_b"];
		
				for(var i = 0; i < capturedsofar; i++) {
					x = x_actual_offset + x_unit_in_px * i * captures[selectedcapture].interval / 10000;
					y = y_actual_offset - convert_12bit_to_real(captureddata[i], sensor.coeff_a,
						sensor.coeff_b, sensor.high_voltage) * y_unit_in_px;
		
					if(i == 0)
						ctx.moveTo(x, y);
					else
						ctx.lineTo(x, y);
						ctx.moveTo(x, y);
				}
			} else {
				// Obě čidla
	
				const sensor_a = captures[selectedcapture].port_a;
				const sensor_b = captures[selectedcapture].port_b;
	
				for(var i = 0; i < capturedsofar; i += 2) {
					x = x_actual_offset + convert_12bit_to_real(captureddata[i + 1], sensor_b.coeff_a,
						sensor_b.coeff_b, sensor_b.high_voltage) * x_unit_in_px;
					y = y_actual_offset - convert_12bit_to_real(captureddata[i], sensor_a.coeff_a,
						sensor_a.coeff_b, sensor_a.high_voltage) * y_unit_in_px;
	
					if(i == 0)
						ctx.moveTo(x, y);
					else
						ctx.lineTo(x, y);
						ctx.moveTo(x, y);
				}			
			}
		
			ctx.stroke();			
	
			// Nakreslit osy
		
			ctx.beginPath();
			ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
			
			// Nakreslit osu Y (offset na ose X)
		
			ctx.moveTo(x_offset, graph_margin_top);
			ctx.lineTo(x_offset, canvas.height - graph_margin_bottom);
		
			// Nakreslit osu X (offset na ose Y)
		
			ctx.moveTo(graph_margin_left, y_offset);
			ctx.lineTo(canvas.width - graph_margin_right, y_offset);
		
			// Nakreslit + popsat čárky s hodnotami na ose Y
		
			ctx.textAlign = "right";
			ctx.textBaseline = "middle";
		
			for(var i = y_optimal_unit_steps; i <= y_max; i = round_to_level(i + y_optimal_unit_steps, y_round_level)) {
				if(i >= y_min) {
					ctx.moveTo(x_offset - 4, y_actual_offset - i * y_unit_in_px);
					ctx.lineTo(x_offset + 4, y_actual_offset - i * y_unit_in_px);
					ctx.fillText(localize_num(i), x_offset - 8, y_actual_offset - i * y_unit_in_px);
				}
			}
		
			for(var i = -y_optimal_unit_steps; i >= y_min; i = round_to_level(i - y_optimal_unit_steps, y_round_level)) {
				if(i <= y_max) {
					ctx.moveTo(x_offset - 4, y_actual_offset - i * y_unit_in_px);
					ctx.lineTo(x_offset + 4, y_actual_offset - i * y_unit_in_px);
					ctx.fillText(localize_num(i), x_offset - 8, y_actual_offset - i * y_unit_in_px);
				}
			}
		
			// Nakreslit + popsat čárky s hodnotami na ose X
		
			ctx.textAlign = "center";
			ctx.textBaseline = "top";
		
			for(var i = x_optimal_unit_steps; i <= x_max; i = round_to_level(i + x_optimal_unit_steps, x_round_level)) {
				if(i >= x_min) {
					ctx.moveTo(x_actual_offset + i * x_unit_in_px, y_offset - 4);
					ctx.lineTo(x_actual_offset + i * x_unit_in_px, y_offset + 4);
					ctx.fillText(localize_num(i), x_actual_offset + i * x_unit_in_px, y_offset + 16);
				}
			}
		
			for(var i = -x_optimal_unit_steps; i >= x_min; i = round_to_level(i - x_optimal_unit_steps, x_round_level)) {
				if(i <= x_max) {
					ctx.moveTo(x_actual_offset + i * x_unit_in_px, y_offset - 4);
					ctx.lineTo(x_actual_offset + i * x_unit_in_px, y_offset + 4);
					ctx.fillText(localize_num(i), x_actual_offset + i * x_unit_in_px, y_offset + 16);
				}
			}
		
			// Popsat jednotky obou os
		
			ctx.textBaseline = "bottom";
			ctx.textAlign = "center";
			ctx.fillText(y_unit_name, x_offset, graph_margin_top - 8);
		
			ctx.textBaseline = "middle";
			ctx.textAlign = "left";
			ctx.fillText(x_unit_name, canvas.width - graph_margin_right + 8, y_offset);
		
			// Dokončit vykreslování! Hurá!
		
			ctx.stroke();
	
			// Napsat název grafu
	
			ctx.textBaseline = "top";
			ctx.font = "bold 16px Ubuntu";
			ctx.fillText(format(jslang.CAPTURE_FMT, selectedcapture + 1, captures.length, captures[selectedcapture].title), graph_margin_left, (graph_margin_top - 16) / 2);
	
			// Pokud právě běží záznam, ukážeme "crosshair"
	
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

	if(zoom_request_progress) {
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

				if(zoomy1 < y) {
					ctx.fillRect(0, 0, canvas.width, zoomy1);
					ctx.fillRect(0, y, canvas.width, canvas.height);
				} else {
					ctx.fillRect(0, 0, canvas.width, y);
					ctx.fillRect(0, zoomy1, canvas.width, canvas.height);
				}
	
				if(zoomx1 < x) {
					ctx.fillRect(0, 0, zoomx1, canvas.height);
					ctx.fillRect(x, 0, canvas.width, canvas.height);
				} else {
					ctx.fillRect(0, 0, x, canvas.height);
					ctx.fillRect(zoomx1, 0, canvas.width, canvas.height);
				}
	
				draw_crosshair(zoomx1, zoomy1);
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
 * Obnoví hodnoty zobrazené v tabulce.
 */

function table_reset() {
	var out = "";
	const capture = captures[selectedcapture];	

	if(captures.length > 0) {
		out = "<div style='margin-left:" + graph_margin_left + "px;margin-top:" + ((graph_margin_top - 16) / 2 - 2) + "px;margin-bottom:1em'><b>" + 
		format(jslang.CAPTURE_FMT, selectedcapture + 1, captures.length, tags_encode(captures[selectedcapture].title)) + "</b>";
		
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
			// Jen jedno čidlo

			const sensor = capture[(capture.sensorsetup == 1) ? "port_a" : "port_b"];

			for(var i = 0; i < capturedsofar; i++) {
				out += "<tr><td>" + localize_num(i * capture.interval / 10000) + "</td><td>" +
					convert_12bit_to_string(captureddata[i], sensor.coeff_a,
						sensor.coeff_b, sensor.high_voltage, sensor.max_value) + "</td></tr>";
			}				
		} else {
			// Obě čidla

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

var mousepositions = [[-1, -1], [-1, -1], [-1, -1]];

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
		canvas_reset(false);

		mousepositions[zoom_request_progress][0] = mouseX;
		mousepositions[zoom_request_progress][1] = mouseY;

		oldmouseX = mouseX;
		oldmouseY = mouseY;
	}

	lock = false;
}

function canvasmousechangehandler() {
	if(lock) return;
	lock = true;

	switch(zoom_request_progress) {
		case 1:
			zoomx1 = mousepositions[zoom_request_progress][0];
			zoomy1 = mousepositions[zoom_request_progress][1];

			zoom_request_progress = 2;

			mousepositions[zoom_request_progress][0] = zoomx1;
			mousepositions[zoom_request_progress][1] = zoomy1;

			canvas_reset(false);
			break;

		case 2:
			if(mousepositions[zoom_request_progress][0] != mousepositions[zoom_request_progress - 1][0] &&
			   mousepositions[zoom_request_progress][1] != mousepositions[zoom_request_progress - 1][1]) {

				zoomx2 = mousepositions[zoom_request_progress][0];
				zoomy2 = mousepositions[zoom_request_progress][1];

				zoom_request_progress = 0;
				zoomed_in = true;

				update_button_validity();
				get_id("statusmsg").innerHTML = jslang.STATUS_ZOOM_IN_CONFIRM;
			}

			canvas_reset(true);
			break;
	}
	
	lock = false;
}
