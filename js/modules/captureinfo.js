/*
 * Coachium - js/modules/captureinfo.js
 * - handles the capture info dialog
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
 * info_generate_sensor(name, sensor)
 * 
 * Generates a HTML description for a sensor object.
 */

function info_generate_sensor(name, sensor) {
	var out = "<div style=\"padding:8px;margin:16px 0;background-color:" + sensor.color + "\">";

	out += format(jslang.INFO_WINDOW_SENSOR,
		name,
		sensor.name,
		localize_num(round(sensor.min, 2)),
		localize_num(round(sensor.max, 2)),
		sensor.unit
	);

	out += "</div>";

	return out;
}

/*
 * show_capture_info()
 * 
 * If possible, show the information about the currently selected capture.
 */

function show_capture_info() {
	if(get_id("captureinfobutton").classList.contains("navbuttondisabled")) return;

	const capture = captures[selected_capture];
	const keys = Object.keys(capture.ports);

	var str = format(jslang.INFO_WINDOW_CONTENTS,
		capture_cache.values.length,
		capture_cache.values.length * keys.length,
		localize_num(round(1000000 / capture.interval, 2)),
		capture.length / 1000,
		(capture_cache.values.length - 1) * capture.interval / 10000
	);

	for(const key of keys) {
		str += info_generate_sensor(key, capture.ports[key]);
	}

	get_win_el_tag(WINDOWID_CAPTURE_INFO, "div").innerHTML = str;

	popup_window(WINDOWID_CAPTURE_INFO);
}
