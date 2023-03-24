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

		const data = table_gen(captures[selected_capture]);
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
