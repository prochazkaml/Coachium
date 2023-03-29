/*
 * Coachium - js/toolbox/converter.js
 * - unit converter toolbox app
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

// Unit lookup table with encoders and decoders

const toolbox_converter_units = [
	{ id: "LENGTH", types: [
		// default unit: metre
		{ id: "NM",   enc: (i) => (i / 1000000000),    dec: (i) => (i * 1000000000) },
		{ id: "UM",   enc: (i) => (i / 1000000),       dec: (i) => (i * 1000000) },
		{ id: "MM",   enc: (i) => (i / 1000),          dec: (i) => (i * 1000) },
		{ id: "CM",   enc: (i) => (i / 100),           dec: (i) => (i * 100) },
		{ id: "DM",   enc: (i) => (i / 10),            dec: (i) => (i * 10) },
		{ id: "M",    enc: (i) => (i),                 dec: (i) => (i), default: "src" },
		{ id: "KM",   enc: (i) => (i * 1000),          dec: (i) => (i / 1000) },
		{ id: "IN",   enc: (i) => (i * .0254),         dec: (i) => (i / .0254), default: "dest" },
		{ id: "FT",   enc: (i) => (i * .3048),         dec: (i) => (i / .3048) },
		{ id: "YD",   enc: (i) => (i * .9144),         dec: (i) => (i / .9144) },
		{ id: "MI",   enc: (i) => (i * 1609.34),       dec: (i) => (i / 1609.34) },
	]},
	{ id: "AREA", types: [
		// default units: square metre
		{ id: "NM",   enc: (i) => (i / (10 ** 18)),    dec: (i) => (i * (10 ** 18)) },
		{ id: "UM",   enc: (i) => (i / (10 ** 12)),    dec: (i) => (i * (10 ** 12)) },
		{ id: "MM",   enc: (i) => (i / 1000000),       dec: (i) => (i * 1000000) },
		{ id: "CM",   enc: (i) => (i / 10000),         dec: (i) => (i * 10000) },
		{ id: "DM",   enc: (i) => (i / 100),           dec: (i) => (i * 100) },
		{ id: "M",    enc: (i) => (i),                 dec: (i) => (i), default: "src" },
		{ id: "KM",   enc: (i) => (i * 1000000),       dec: (i) => (i / 1000000) },
		{ id: "AR",   enc: (i) => (i * 100),           dec: (i) => (i / 100) },
		{ id: "HA",   enc: (i) => (i * 10000),         dec: (i) => (i / 10000) },
		{ id: "IN",   enc: (i) => (i * .00064516),     dec: (i) => (i / .00064516) },
		{ id: "FT",   enc: (i) => (i / 10.764),        dec: (i) => (i * 10.764) },
		{ id: "YD",   enc: (i) => (i / 1.196),         dec: (i) => (i * 1.196) },
		{ id: "AC",   enc: (i) => (i * 4046.86),       dec: (i) => (i / 4046.86), default: "dest" },
		{ id: "MI",   enc: (i) => (i * 2590000),       dec: (i) => (i / 2590000) },		
	]},
	{ id: "VOLUME", types: [
		// default units: cubic metre
		{ id: "NM",   enc: (i) => (i / (10 ** 27)),    dec: (i) => (i * (10 ** 27)) },
		{ id: "UM",   enc: (i) => (i / (10 ** 18)),    dec: (i) => (i * (10 ** 18)) },
		{ id: "MM",   enc: (i) => (i / (10 ** 9)),     dec: (i) => (i * (10 ** 9)) },
		{ id: "CM",   enc: (i) => (i / 1000000),       dec: (i) => (i * 1000000) },
		{ id: "DM",   enc: (i) => (i / 1000),          dec: (i) => (i * 1000) },
		{ id: "M",    enc: (i) => (i),                 dec: (i) => (i), default: "src" },
		{ id: "KM",   enc: (i) => (i * (10 ** 9)),     dec: (i) => (i / (10 ** 9)) },
		{ id: "ML",   enc: (i) => (i / 1000000),       dec: (i) => (i * 1000000) },
		{ id: "CL",   enc: (i) => (i / 100000),        dec: (i) => (i * 100000) },
		{ id: "DL",   enc: (i) => (i / 10000),         dec: (i) => (i * 10000) },
		{ id: "L",    enc: (i) => (i / 1000),          dec: (i) => (i * 1000), default: "dest" },
		{ id: "HL",   enc: (i) => (i / 10),            dec: (i) => (i * 10) },
		{ id: "IN",   enc: (i) => (i * .0000163871),   dec: (i) => (i / .0000163871) },
		{ id: "FT",   enc: (i) => (i * .0283168),      dec: (i) => (i / .0283168) },
		{ id: "YD",   enc: (i) => (i * .764555),       dec: (i) => (i / .764555) },
		{ id: "MI",   enc: (i) => (i * (10**6)*4168),  dec: (i) => (i / (10**6)*4168) },
	]},
	{ id: "MASS", types: [
		// default units: kilogram
		{ id: "UG",   enc: (i) => (i / (10 ** 9)),     dec: (i) => (i * (10 ** 9)) },
		{ id: "MG",   enc: (i) => (i / 1000000),       dec: (i) => (i * 1000000) },
		{ id: "G",    enc: (i) => (i / 1000),          dec: (i) => (i * 1000) },
		{ id: "DKG",  enc: (i) => (i / 100),           dec: (i) => (i * 100) },
		{ id: "KG",   enc: (i) => (i),                 dec: (i) => (i), default: "src" },
		{ id: "T",    enc: (i) => (i * 1000),          dec: (i) => (i / 1000) },
		{ id: "OZ",   enc: (i) => (i * .0283495),      dec: (i) => (i / .0283495) },
		{ id: "LB",   enc: (i) => (i * .453592),       dec: (i) => (i / .453592), default: "dest" },
		{ id: "ST",   enc: (i) => (i * 6.35029),       dec: (i) => (i / 6.35029) },
	]},
	{ id: "SPEED", types: [
		// default units: metre per second
		{ id: "KMPH", enc: (i) => (i / 3.6),           dec: (i) => (i * 3.6), default: "dest" },
		{ id: "MPS",  enc: (i) => (i),                 dec: (i) => (i), default: "src" },
		{ id: "MIPH", enc: (i) => (i / 2.237),         dec: (i) => (i * 2.237) },
		{ id: "FTPS", enc: (i) => (i * .3048),         dec: (i) => (i / .3048) },
		{ id: "KN",   enc: (i) => (i * 0.514444),      dec: (i) => (i / 0.514444) },
	]},
	{ id: "TEMPERATURE", types: [
		{ id: "C",    enc: (i) => (i + 273.15),        dec: (i) => (i - 273.15), default: "src" },
		{ id: "K",    enc: (i) => (i),                 dec: (i) => (i),          default: "dest" },
		{ id: "F",    enc: (i) => ((i-32)*5/9+273.15), dec: (i) => ((i-273.15)*9/5+32) },
	]},
	{ id: "TIME", types: [
		{ id: "NS",   enc: (i) => (i / 1000000000),    dec: (i) => (i * 1000000000) },
		{ id: "US",   enc: (i) => (i / 1000000),       dec: (i) => (i * 1000000) },
		{ id: "MS",   enc: (i) => (i / 1000),          dec: (i) => (i * 1000) },
		{ id: "S",    enc: (i) => (i),                 dec: (i) => (i), default: "src" },
		{ id: "M",    enc: (i) => (i * 60),            dec: (i) => (i / 60) },
		{ id: "H",    enc: (i) => (i * 3600),          dec: (i) => (i / 3600), default: "dest" },
		{ id: "D",    enc: (i) => (i * 86400),         dec: (i) => (i / 86400) },
	]},
	{ id: "PLANE_ANGLE", types: [
		{ id: "DEG",  enc: (i) => (i * Math.PI / 180), dec: (i) => (i / Math.PI * 180), default: "src" },
		{ id: "RAD",  enc: (i) => (i),                 dec: (i) => (i), default: "dest" },
		{ id: "GON",  enc: (i) => (i * Math.PI / 200), dec: (i) => (i / Math.PI * 200) },
	]},
];

/*
 * toolbox_converter()
 * 
 * Initializes and starts the converter app.
 */

function toolbox_converter() {
	close_popup();

	var typeselector = get_id("conv_unit_type");
	
	if(typeselector.children.length != toolbox_converter_units.length) {
		typeselector.innerHTML = "";

		for(var i = 0; i < toolbox_converter_units.length; i++) {
			const type = toolbox_converter_units[i];
			var opt = document.createElement("option");
			opt.innerText = jslang.TOOLBOX_CONVERTER_UNITS[type.id].NAME;
			opt.value = i;
			typeselector.appendChild(opt);
		}

		toolbox_converter_type_update();
	}

	popup_window(WINDOWID_TOOLBOX_CONVERTER);
}

/*
 * toolbox_converter_type_update()
 * 
 * Initializes default values for a given unit type
 * and populates the unit lists.
 */

function toolbox_converter_type_update() {
	const tsval = get_id("conv_unit_type").value;
	
	var srcunitselector = get_id("conv_src_unit");
	var destunitselector = get_id("conv_dest_unit");

	srcunitselector.innerHTML = "";
	destunitselector.innerHTML = "";

	if(tsval >= 0 && tsval < toolbox_converter_units.length) {
		const type = toolbox_converter_units[tsval];

		for(var i = 0; i < type.types.length; i++) {
			const unit = type.types[i];

			// Create an option element for each list selector

			var srcopt = document.createElement("option");
			var destopt = document.createElement("option");
			
			destopt.innerText = srcopt.innerText = jslang.TOOLBOX_CONVERTER_UNITS[type.id].TYPES[unit.id][0];
			destopt.title = srcopt.title = jslang.TOOLBOX_CONVERTER_UNITS[type.id].TYPES[unit.id][1];
			destopt.value = srcopt.value = i;
			srcunitselector.appendChild(srcopt);
			destunitselector.appendChild(destopt);

			// Select the currently generated option if it is supposed to be the default

			if(unit.default == "src") srcunitselector.value = i;
			if(unit.default == "dest") destunitselector.value = i;
		}
	}
}

/*
 * toolbox_converter_value_update()
 * 
 * Recalculates the destination value based on the given parameters.
 */

function toolbox_converter_value_update() {
	const tsval = get_id("conv_unit_type").value;

	var srcunitselector = get_id("conv_src_unit");
	var destunitselector = get_id("conv_dest_unit");
	var srcval = get_id("conv_src_val");
	var destval = get_id("conv_dest_val");

	if(tsval >= 0 && tsval < toolbox_converter_units.length) {
		const type = toolbox_converter_units[tsval];

		if(srcunitselector.value >= 0 && srcunitselector.value < type.types.length &&
		   destunitselector.value >= 0 && destunitselector.value < type.types.length) {
			
			var val = srcval.value.replaceAll(decimal_separator, ".");

			if(isNaN(val)) {
				destval.value = "";
			} else {
				destval.value = localize_num(type.types[destunitselector.value].dec(type.types[srcunitselector.value].enc(val)));
			}
		}
	}
}
