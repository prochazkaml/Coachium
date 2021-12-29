/*
 * Coachium - common.js
 * - taková hlavní kostra programu, obsahuje obecné konstanty, proměnné a funkce
 * 
 * Napsal Michal Procházka pro školu Randovka, 2021.
 * (ano, jsem turbošprt, já vím...)
 */

/*
 * Nazdar.
 *
 * Neměli byste se náhodou učit, než abyste se mi tu hrabali?
 * No dobře, dělám, jako bych to taky nikdy nedělal. Líbíte se mi. 🙂
 * 
 * Proto vám tu píšu komentáře v češtině (což většinou nedělám),
 * aby tento kód mohl sloužit i k výukovým účelům (kromě fyziky, samozřejmě).
 * Mám ale zlozvyk, že se někdy tak zažeru do psaní kódu, že na komentáře zapomenu.
 * 
 * No nic, tak si užijte zbytek hodiny fyziky/laborek/semináře.
 * 
 * Ale ne, že tu něco poserete! 😁
 */

// TODO: VYMĚNIT U ČÍSEL PŘEVEDENÝCH NA ŘETĚZCE TEČKY ZA ČÁRKY!
// TODO: ZABLOKOVAT NĚKTERÁ TLAČÍTKA, KDYŽ BĚŽÍ ZÁZNAM!
// TODO: PŘI ZÁZNAMU UKAZOVAT HODNOTY ČIDEL!

const WINDOWID_ABOUT = 0;
const WINDOWID_JS_ERR = 1;
const WINDOWID_CAPTURE_SETUP = 2;
const WINDOWID_GDRIVE_SAVE_OK = 3;
const WINDOWID_GDRIVE_SAVE_ERR = 4;
const WINDOWID_GDRIVE_GENERIC_ERR = 5;
const WINDOWID_GDRIVE_NAME = 6;
const WINDOWID_WEBHID_UNAVAILABLE = 7;
const WINDOWID_INVALID_CHECKSUM = 8;
const WINDOWID_FILE_IMPORT_ERR = 9;
const WINDOWID_IMPORT_OVERWRITE_WARN = 10;
const WINDOWID_REMOVE_CAPTURE_WARN = 11;
const WINDOWID_NUKE_EVERYTHING_WARN = 12;
const WINDOWID_RENAME_CAPTURE = 13;

var openwindow = -1;

var header, nav, main, footer, canvas, ctx, table;

var device, connected = false, verified = false;

var outreport = [ 0x04, 0x01, 0x0B, 0x80, 0x0C, 0x33, 0x0B, 0x00 ];
var outreportaddress = 0;

var background_task_cycle = -1;
var background_task_handle;
var transfer_in_progress = false;

var gdrive_response;

const eeprom_addresses = [
	// Na autodetekci změn v čidle (rychlé vypojení/zapojení, přepnutí přepínače rozsahu)
	0x04,

	// Jméno čidla
	0x08, 0x09, 0x0A, 0x0B, 
	0x0C, 0x0D, 0x0E, 0x0F, 
	0x10, 0x11, 0x12, 0x13, 
	0x14, 0x15, 0x16, 0x17, 
	0x18, 0x19, 0x1A, 0x1B,

	// Minimální hodnota
	0x3B, 0x3C, 0x3D, 0x3E, 

	// Maximální hodnota
	0x3F, 0x40, 0x41, 0x42, 

	// Koeficient a
	0x4A, 0x4B, 0x4C, 0x4D,
	
	// Koeficient b
	0x46, 0x47, 0x48, 0x49,

	// Text jednotky
	0x53, 0x54, 0x55, 0x56, 0x57,

	// Detekce vysokého/nízkého napětí
	0x01
];

const eeprom_length = eeprom_addresses.length;

var ports = [
	{
		"id": "1",
		"color": "#8F8",
		"connected": false,
		"intelligent": true,
		"name": "",
		"unit": "",
		"min_value": 0,
		"max_value": 0,
		"coeff_a": 0,
		"coeff_b": 0,
		"high_voltage": false,
		"raw_eeprom": new Uint8Array(eeprom_length)
	}, {
		"id": "2",
		"color": "#FF6",
		"connected": false,
		"intelligent": true,
		"name": "",
		"unit": "",
		"min_value": 0,
		"max_value": 0,
		"coeff_a": 0,
		"coeff_b": 0,
		"high_voltage": false,
		"raw_eeprom": new Uint8Array(eeprom_length)
	}
];

var capturesetupsamples, capturesetupmode, capturesetupspeed, capturesetuppacketsize;
var requestcapture = false, capturerunning = false, receivedcapture, receivedsofar;

var captures = [], selectedcapture = 0;

const fresh_port_spec = {
	"id": null,
	"color": null,
	"connected": null,
	"intelligent": null,
	"name": null,
	"unit": null,
	"min_value": null,
	"max_value": null,
	"coeff_a": null,
	"coeff_b": null,
	"high_voltage": null
};

const fresh_capture = {
	"title": null,
	"seconds": null,
	"samples": null,
	"interval": null,
	"sensorsetup": null,
	"port_a": null,
	"port_b": null,
	"captureddata": null
};

/*
 * get_id(id)
 * 
 * Alias pro funkci document.getElementById, protože se mi fakt nechce to pokaždé takhle rozepisovat.
 */

function get_id(id) {
	return document.getElementById(id);
}

/*
 * round(num, digits)
 *
 * Zaokrouhlí dané číslo na daný počet desetinných číslic.
 */

function round(num, digits = 0) {
	return Math.round(Math.pow(10, digits) * num) / Math.pow(10, digits);
}

/*
 * convert_12bit_to_real(val, a, b, hv)
 *
 * Převede 12-bitovou hodnotu na srozumitelné číslo dané veličiny.
 * Proboha, to bylo sraní, získat ty konstanty níže (1.013 a 1.0114), strávil jsem nad tím slušnou půlku dne.
 * 
 * Jsou nastavené tak, aby výsledná hodnota +/- seděla s Coachem
 * (odchylka často v řádech setin, takže jsem spokojen, navíc
 * Coach sám o sobě je docela nepřesný. 🤷)
 */

function convert_12bit_to_real(val, a, b, hv) {
	var val;
	
	if(hv)
		val = a * (val / 4095 * 20 - 10) * 1.013 + b;
	else
		val = a * (val / 4095 * 5) * 1.0114 + b;

	return val;
}

/*
 * convert_12bit_to_string(val, a, b, hv, max)
 * 
 * Převede 12-bitovou hodnotu na řetězec se srozumitelným číslem dané veličiny.
 * Hodnota je zaokrouhlena na 4 platné číslice podle max. hodnoty, stejně, jako Coach.
 */

function convert_12bit_to_string(val, a, b, hv, max) {
	if(isNaN(val))
		return "–";
	else
//		return round(convert_12bit_to_real(val, a, b, hv), 3 - Math.floor(Math.log10(max))).toString().replace(".", ",");
		return convert_12bit_to_real(val, a, b, hv).toFixed(3 - Math.floor(Math.log10(max))).replace(".", ",");
}

/*
 * prettyprint_value(id, val)
 *
 * Převede 12-bitovou hodnotu na čitelný řetězec.
 */

function prettyprint_value(id, val) {
	if(ports[id].connected) {
		var converted = convert_12bit_to_string(val, ports[id].coeff_a, ports[id].coeff_b, ports[id].high_voltage, ports[id].max_value);

		return converted + " " + ports[id].unit;
	} else {
		return "–";
	}
}

/*
 * truncate(str, maxlen)
 * 
 * Zkrátí řetězec na danou délku a přidá tři tečky, když je třeba.
 */

function truncate(str, maxlen) {
	if(str.length > maxlen)
		return str.substring(0, maxlen) + "&hellip;";
	else
		return str;
};

/*
 * Error handler pro celou aplikaci
 */

window.onerror = (msg, file, line) => {
	get_win_el_tag(WINDOWID_JS_ERR, "textarea").value =
		"\"" + file + "\" @ " + line + ":\n\n" + msg;

	popup_window(WINDOWID_JS_ERR);
	return false;
}
