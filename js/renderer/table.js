/*
 * Coachium - js/renderer/table.js
 * - renders the capture as a table
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