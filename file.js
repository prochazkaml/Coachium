function tags_encode(s) {
	var el = document.createElement("div");
	el.innerText = el.textContent = s;
	return el.innerHTML;
}

/*
 * parse_object_to_xml()
 *
 * Zpracuje JavaScript objekt (včetně všech jeho hodnot) do formy XML.
 */

function parse_object_to_xml(object, prefix) {
	// Zjistit, co objekt vlastně obsahuje

	var xml = ""

	for(var key of Object.keys(object)) {
		// Zjistit, zda parametr je pole, objekt či prostá hodnota

		if(typeof object[key] === 'object' && !Array.isArray(object[key])) {
			// Parametr je další objekt
		
			xml += prefix + "<" + key + ">\n"
			xml += parse_object_to_xml(object[key], prefix + " ")
			xml += prefix + "</" + key + ">\n"
		} else if(Array.isArray(object[key])) {
			// Parametr je pole

			xml += prefix + "<" + key + ">\n"

			for(var val of object[key]) {
				xml += prefix + " <val>" + tags_encode(val) + "</val>\n";
			}

			xml += prefix + "</" + key + ">\n"
		} else {
			// Parametr je prostá hodnota

			xml += prefix + "<" + key + ">" + tags_encode(object[key]) + "</" + key + ">\n";
		}
	}

	return xml;
}

/*
 * xml_export(name)
 *
 * Vygeneruje XML soubor sešitu záznamů jako výstupní řetězec.
 */

function xml_export(name) {
	// Hlavička souboru

	xml = "<?xml version=\"1.0\"?>\n<coachium_file>\n\n<!--\n   " + name +
		"\n\n   Tento soubor sešitu záznamů byl vygenerován programem Coachium.\n\n   Pro jeho správné zobrazení navštivte:\n   https://coachium.prochazka.ml\n-->\n\n" + 
		" <version>1</version>\n";

	// Zpracovat jednotlivá měření

	for(var capture of captures) {
		xml += " <capture>\n";
		xml += parse_object_to_xml(capture, "  ")
		xml += " </capture>\n";
	}

	// Ukončení souboru

	return xml + "</coachium_file>\n";
}

/*
 * conv_val(val)
 * 
 * Pokud je vstupní hodnota prázdný řetězec, vrátí prázdný řetězec.
 * Pokud je vstupní hodnota bool ("true" nebo "false") v řetězci, převede řetězec na bool.
 * Pokud je vstupní hodnota číslo v řetězci, převede řetězec na číslo.
 * Jinak vrátí původní řetězec.
 */

function conv_val(val) {
	if(val == "") return val;

	if(val == "true")  return true;
	if(val == "false") return false;

	if(!isNaN(val))
		return val * 1;

	return val;
}

/*
 * xml_import(input)
 * 
 * Importuje XML soubor sešitu záznamů z parametru.
 */

function xml_import(input) {
	captures = [];

	// TODO: ověření platnosti vstupních dat!!!

	var xml = new DOMParser().parseFromString(input, "text/xml");

	// Zpracovat každé uložené měření

	try {
		var loaded_captures = xml.getElementsByTagName("capture");

		for(var i = 0; i < loaded_captures.length; i++) {
			var capture = Object.assign({}, fresh_capture);

			// Zjistit hodnoty všech parametrů daného měření z uložených dat

			for(var key of Object.keys(capture)) {
				var param = loaded_captures[i].getElementsByTagName(key)[0];

				var param_vals = param.childNodes;

				if(param_vals.length > 1) {
					if(param_vals[1].nodeName == "val") {
						// Parametr je pole

						capture[key] = [];

						var p = 0;

						for(var param_val of param_vals) {
							if(param_val.nodeName == "#text") continue;

							capture[key][p++] = conv_val(param_val.textContent);
						}	
					} else {
						// Parametr je objekt (popis portu)

						capture[key] = Object.assign({}, fresh_port_spec);

						for(var param_val of param_vals) {
							if(param_val.nodeName == "#text") continue;

							capture[key][param_val.nodeName] = conv_val(param_val.textContent);
						}	
					}
				} else {
					// Parametr je prostá hodnota

					capture[key] = conv_val(param_vals[0].textContent);
				}
			}

			captures[i] = capture;
		}
	} catch(e) {
		get_win_el_tag(WINDOWID_FILE_IMPORT_ERR, "textarea") = e.stack;
		popup_window(WINDOWID_FILE_IMPORT_ERR);
	}
}

/*
 * load_file_local(are_you_sure)
 * 
 * Importuje lokálně uložený soubor sešitu záznamu ve formátu XML.
 */

function load_file_local(are_you_sure) {
	if(captures.length > 0 && !are_you_sure) {
		// Pokud již máme načetlá nějaká měření, radši riskovat nebudeme

		popup_window(WINDOWID_IMPORT_OVERWRITE_WARN);
	} else {
		var element = document.createElement("input");

		element.type = "file";
		element.accept = ".coachium"

		element.onchange = () => {
			reader = new FileReader();

			reader.onload = (x) => {
				xml_import(x.target.result);
				selectedcapture = 0;
				main_window_reset();

				get_id("statusmsg").innerHTML = "Soubor načten.";
			};

			reader.readAsText(element.files[0]);
		};

		element.click();
	}
}

/*
 * save_file_local()
 * 
 * Lokálně uloží soubor sešitu záznamu ve formátu XML.
 */

function save_file_local() {
	if(captures.length == 0) return;

	var inputfield = get_win_el_tag(WINDOWID_GDRIVE_NAME, "input");

	var filename;

	if(inputfield.value == "񂁩MISSING") {
		var d = new Date();
		filename = "Pepa Novák - Laboratorní práce " + 
			d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear();
	} else filename = inputfield.value;

	// Vygeneruje element s daty, které se pak stáhnou

	var element = document.createElement("a");
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(xml_export(filename)));
	element.setAttribute("download", filename + ".coachium");
	element.click();

	get_id("statusmsg").innerHTML = "Soubor připraven k uložení.";
}

/*
 * create_capture()
 * 
 * Zobrazí dialog pro inicializaci záznamu. Zároveň vybere nejvhodnější konfiguraci čidel.
 */

function create_capture() {
	if(ports[0].connected && ports[1].connected) {
		// Budeme chtít zaznamenávat z obou čidel

		get_id("capturesetupsensors").selectedIndex = 0;
	} else if(ports[1].connected) {
		// Jen z druhého čidla

		get_id("capturesetupsensors").selectedIndex = 2;
	} else {
		// Jen z prvního čidla

		get_id("capturesetupsensors").selectedIndex = 1;
	}

	setTimeout(() => {
		get_id("capturesetupname").select();
	}, 100);

	popup_window(WINDOWID_CAPTURE_SETUP);
	capture_setup_check();
}

/*
 * rename_capture()
 * 
 * Zobrazí dialog pro přejmenování záznamu, pokud je to možné. Pak daný záznam přejmenuje.
 */

function rename_capture(name_decided) {
	if(captures.length == 0) return;

	if(!name_decided) {
		get_win_el_tag(WINDOWID_RENAME_CAPTURE, "input").value = captures[selectedcapture].title;

		popup_window(WINDOWID_RENAME_CAPTURE);

		setTimeout(() => {
			get_win_el_tag(WINDOWID_RENAME_CAPTURE, "input").select();
		}, 100);
	} else {
		const newtitle = get_win_el_tag(WINDOWID_RENAME_CAPTURE, "input").value

		if(newtitle != "")
			captures[selectedcapture].title = newtitle;
		else
			captures[selectedcapture].title = "Záznam bez názvu";

		main_window_reset();
	}
}

/*
 * remove_capture(are_you_sure)
 * 
 * Odstraní právě vybraný záznam ze sešitu.
 */

function remove_capture(are_you_sure) {
	if(captures.length == 0) return;

	if(!are_you_sure) {
		// Radši se zeptáme, jestli záznam opravdu chceme odstranit

		popup_window(WINDOWID_REMOVE_CAPTURE_WARN);
	} else {
		// No dobrá, jak myslíš.

		var oldselected = selectedcapture;

		captures.splice(selectedcapture, 1);

		if(captures.length > 0) {
			if(selectedcapture >= captures.length)
				selectedcapture = captures.length - 1;
		} else {
			selectedcapture = 0;
		}

		get_id("statusmsg").innerHTML = "Měření " + (oldselected + 1) + " odstraněno.";

		main_window_reset();
	}
}

/*
 * remove_all_captures(are_you_sure)
 * 
 * Odstraní všechny záznamy ze sešitu.
 */

function remove_all_captures(are_you_sure) {
	if(captures.length == 0) return;

	if(!are_you_sure) {
		// Radši se zeptáme, jestli opravdu chceme odstranit úplně všechny

		popup_window(WINDOWID_NUKE_EVERYTHING_WARN);
	} else {
		// No dobrá, jak myslíš.

		captures = [];
		selectedcapture = 0;

		get_id("statusmsg").innerHTML = "Všechna měření odstraněna.";

		main_window_reset();
	}
}
