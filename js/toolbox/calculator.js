/*
 * Coachium - js/toolbox/calculator.js
 * - calculator toolbox app
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

var calcobj = new BigEval();

/*
 * toolbox_calculator()
 * 
 * Initializes and starts the calculator app.
 */

function toolbox_calculator() {
	close_popup();

	get_win_el_tag(WINDOWID_TOOLBOX_CALCULATOR, "input").onkeydown = (e) => {
		if(e.key && (e.key == "Enter" || e.key == "=")) {
			toolbox_calculator_submit();
			e.preventDefault();
		}
	}

	toolbox_calculator_update_angle_units();

	popup_window(WINDOWID_TOOLBOX_CALCULATOR);
}

/*
 * toolbox_calculator_submit()
 * 
 * Evaluates the input expression, appends it to the history
 * and returns its result.
 */

function toolbox_calculator_submit() {
	var input = get_win_el_tag(WINDOWID_TOOLBOX_CALCULATOR, "input");
	var select = get_win_el_tag(WINDOWID_TOOLBOX_CALCULATOR, "select");
	
	var str = input.value;

	if(str.length && str != "ERROR") {
		// Perform the calculation
		
		var retval = calcobj.exec(str.replaceAll(decimal_separator, "."));

		if(typeof(retval) == "number") {
			retval = localize_num(round_fixed_digits(retval, 10));
		}

		// Output the result

		input.value = retval;

		// Append the input to the history

		var opt = document.createElement("option");
		opt.innerText = str;
		opt.onclick = () => {
			input.value = str;
			input.select();
		}
		select.appendChild(opt);

		// If the calculation completed successfully, append the result as well

		if(retval != "ERROR") {
			opt = document.createElement("option");
			opt.innerText = retval;
			opt.style.textAlign = "right";
			opt.onclick = () => {
				input.value = retval
				input.select();
			}
			select.appendChild(opt);
		}

		// Select the text (so the user can immediately start typing)

		input.select();

		// Scroll all the way down

		select.scroll({
			top: select.scrollHeight,
			left: 0,
			behavior: "smooth"
		});
	}
}

/*
 * toolbox_calculator_update_angle_units()
 * 
 * Updates the angle units from the selection.
 */

function toolbox_calculator_update_angle_units() {
	calcobj.ANGLEMODE = Number(get_win_el_tag(WINDOWID_TOOLBOX_CALCULATOR, "select", 1).value);
}
