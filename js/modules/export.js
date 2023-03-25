/*
 * Coachium - js/modules/export.js
 * - handles exporting to .csv or .svg
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
 * export_csv(confirm)
 * 
 * Exports the currently selected capture as .csv compliant data.
 */

function export_csv(confirm) {
	if(get_id("advancedbutton").classList.contains("navbuttondisabled")) return;

	if(get_id("advancedpopup_fitfunction").classList.contains("popupitemdisabled")) return;

	close_popup();

	if(confirm) {
		const old_decimal_separator = decimal_separator;
		decimal_separator = get_win_el_tag(WINDOWID_EXPORT_TABLE, "input").value;

		const data = table_gen(captures[selected_capture], get_id("csvallowfnscheckbox").checked);
		var output = "";

		for(var y = 0; y < data.length; y++) {
			if(y != 0) output += "\r\n"; // Just in case anyone is using Windows

			for(var x = 0; x < data[y].length; x++) {
				if(x != 0) output += ",";

				output += "\"" + data[y][x].replaceAll("\"", "\"\"") + "\""; // In case a quote mark slips in here
			}
		}

		decimal_separator = old_decimal_separator;

		save_file(output, format(jslang.EXPORT_CSV_NAME, captures[selected_capture].title));
	} else {
		get_win_el_tag(WINDOWID_EXPORT_TABLE, "input").value = decimal_separator;

		popup_window(WINDOWID_EXPORT_TABLE);
	}
}

/*
 * export_svg(confirm)
 * 
 * Exports the currently selected capture as .svg vector image.
 */

var export_svg_resolution_changed = false;

function export_svg(confirm) {
	if(get_id("advancedbutton").classList.contains("navbuttondisabled")) return;

	if(get_id("advancedpopup_fitfunction").classList.contains("popupitemdisabled")) return;

	close_popup();

	if(confirm) {
		const w = get_win_el_tag(WINDOWID_EXPORT_CHART, "input", 0).value;
		const h = get_win_el_tag(WINDOWID_EXPORT_CHART, "input", 1).value;

		var fakectx = new C2S(w, h);

		render_chart(
			fakectx, w, h,
			get_id("svgallowfnscheckbox").checked,
			get_id("svgallownotescheckbox").checked,
		);

		save_file(fakectx.getSerializedSvg(), format(jslang.EXPORT_SVG_NAME, captures[selected_capture].title), "image/svg+xml");
	} else {
		// Pre-fill resolution if it was not already changed

		if(!export_svg_resolution_changed) {
			get_win_el_tag(WINDOWID_EXPORT_CHART, "input", 0).value = canvas.width;
			get_win_el_tag(WINDOWID_EXPORT_CHART, "input", 1).value = canvas.height;
		}

		get_win_el_tag(WINDOWID_EXPORT_CHART, "input", 0).oninput =
		get_win_el_tag(WINDOWID_EXPORT_CHART, "input", 1).oninput = () => {
			export_svg_resolution_changed = true;
		};

		popup_window(WINDOWID_EXPORT_CHART);	
	}
}
