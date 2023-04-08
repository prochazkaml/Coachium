/*
 * Coachium - js/renderer/table.js
 * - renders the capture as a table
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
 * table_reset()
 * 
 * Updates the table and its values.
 */

function table_reset() {
	var out = document.createElement("div");

	if(captures.length > 0) {
		out.style.marginLeft = graph_margin_left_default + "px";
		out.style.marginTop = ((graph_margin_top - 16) / 2 - 2) + "px";
		out.style.marginBottom = "16px";

		var title = document.createElement("b");
		title.innerText = format(jslang.CAPTURE_FMT, selected_capture + 1, captures.length, capture.title);
		out.appendChild(title);

		const data = table_gen(capture, true, true);

		var tbl = document.createElement("table");
		var row, cell;

		for(var y = 0; y < data.data.length; y++) {
			row = document.createElement("tr");

			for(var x = 0; x < data.data[y].length; x++) {
				cell = document.createElement((y == 0) ? "th" : "td");
				cell.innerText = data.data[y][x];
				
				if(data.colors[x - 1])
					cell.style.backgroundColor = data.colors[x - 1] + ((y == 0) ? "" : "20");

				row.appendChild(cell);
			}

			tbl.appendChild(row);
		}

		out.appendChild(tbl);
	} else {
		out.className = "infomsg";
		out.innerHTML = "<h2>" + jslang.MAINWIN_NO_CAPTURES_1 + "</h2><h3>" + jslang.MAINWIN_NO_CAPTURES_2 + "</h3>";
	}

	table.innerHTML = "";
	table.appendChild(out);
}

/*
 * table_gen(capture, display_fns, enabled_colors)
 * 
 * Generates the table data, returns a 2D array containing cell values.
 * Can control whether functions are displayed as well or not,
 * or whether to return color data alongside the data.
 */

function table_gen(capture, display_fns, enabled_colors = false) {
	var fn_calcs = [], colors = [];

	const fns = capture.functions;

	if(fns) for(var i = 0; i < fns.length; i++) {
		fn_calcs[i] = get_fun_calc(fns[i]);
	}

	var rows = [];

	// Generate header

	var col = [ format(jslang.TABLE_INTERVAL, capture_cache.ports[0].unit) ];

	for(var i = 1; i < capture_cache.ports.length; i++) {
		col.push(format(jslang.TABLE_SENSOR, capture_cache.ports[i].id, capture_cache.ports[i].unit))

		if(enabled_colors) {
			const port = capture.ports[capture_cache.ports[i].id];

			colors.push((port.color && port.drawcolor) ? port.color : null);
		}
	}

	if(display_fns && fns) for(var i = 0; i < fns.length; i++) {
		const fn = fns[i];

		var unit = "???";
		var name = jslang["TABLE_FUN_" + fn.fun.toUpperCase()];

		if(fn.sensor_x !== undefined && fn.sensor_y !== undefined) {
			unit =
				capture_cache.ports[fn.sensor_y].unit + "/" +
				capture_cache.ports[fn.sensor_x].unit;

			if(enabled_colors) {
				const port = capture.ports[capture_cache.ports[fn.sensor_y].id];

				colors.push((port.color && port.drawcolor) ? port.color : null);
			}
		} else if(enabled_colors) {
			colors.push(null);
		}

		if(name) {
			if(fn.type == "fit")
				col.push(format(jslang.TABLE_FUN_FITTED, name, unit));
			else
				col.push(format(jslang.TABLE_FUN, name, unit));
		} else {
			col.push(format(jslang.TABLE_FUN_UNKNOWN_TYPE, unit));
		}
	}

	rows.push(col);

	for(var i = 0; i < capture_cache.values.length; i++) {
		col = [];

		for(var j = 0; j < capture_cache.ports.length; j++) {
			col.push(localize_num(capture_cache.values[i][j]));
		}

		if(display_fns && fns) for(var j = 0; j < fns.length; j++) {
			const fn = fns[j];

			if(fn.sensor_x !== undefined)
				col.push(localize_num(fn_calcs[j](capture_cache.values[i][fn.sensor_x])));
			else
				col.push("???");
		}

		rows.push(col);
	}

	return (!enabled_colors) ? rows : {
		data: rows,
		colors: colors
	};
}
