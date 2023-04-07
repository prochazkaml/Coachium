/*
 * Coachium - js/l10n/cs.js
 * - Czech internationalization data
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

const cs = {
	html: {
		// Homepage text

		"HOMEPAGE_ABOUT_LINK": "Co je to Coachium? (Index nápovědy)",
		"HOMEPAGE_PRIVACY_POLICY_LINK": "Zásady ochrany osobních údajů",
		"HOMEPAGE_COMMIT_CHECKING": "Kontroluji verzi...",
		"TITLE_HOMEPAGE_ABOUT": "O programu Coachium...",

		// Button descriptions

		"BUTTON_CONNECT": "Připojit se k zařízení",
		"BUTTON_START_GUEST": "Spustit v režimu hosta",
		"BUTTON_CLOSE": "Zavřít",
		"BUTTON_START": "Spustit",
		"BUTTON_START_CONDITIONAL": "Podmíněný záznam...",
		"BUTTON_TRYAGAIN": "Zkusit znovu",
		"BUTTON_SAVE": "Uložit",
		"BUTTON_RESTART": "Restartovat",
		"BUTTON_GOAHEAD": "Pokračovat",
		"BUTTON_RENAME": "Přejmenovat",

		// Button titles on the top bar

		"TITLE_NEW_FILE": "Zahodit všechny záznamy a vytvořit nový sešit záznamů",
		"TITLE_OPEN_FILE": "Nahrát sešit záznamů z počítače [Ctrl+O]",
		"TITLE_SAVE_FILE": "Uložit sešit záznamů do počítače [Ctrl+S]",
		"TITLE_SAVE_GDRIVE": "Uložit sešit záznamů na Google Disk [Ctrl+Shift+S]",
		"TITLE_NEW_CAPTURE": "Přidat nový záznam do sešitu [Mezerník]",
		"TITLE_STOP_CAPTURE": "Zastavit záznam [Mezerník]",
		"TITLE_REMOVE_CAPTURE": "Odstranit tento záznam ze sešitu [Delete]",
		"TITLE_RENAME_CAPTURE": "Přejmenovat tento záznam [R]",
		"TITLE_PREVIOUS_CAPTURE": "Zobrazit předchozí záznam v sešitě [← nebo PageUp]",
		"TITLE_SHOW_AS_TABLE": "Zobrazit záznam jako tabulku [T]",
		"TITLE_SHOW_AS_CHART": "Zobrazit záznam jako graf [T]",
		"TITLE_NEXT_CAPTURE": "Zobrazit následující záznam v sešitě [→ nebo PageDown]",
		"TITLE_CHART_ZOOM_IN": "Přiblížit pohled na graf [+]",
		"TITLE_CHART_ZOOM_DATA": "Přiblížit na data [=]",
		"TITLE_CHART_ZOOM_RESET": "Obnovit pohled na graf [-]",
		"TITLE_CAPTURE_MGMT": "Spravovat záznamy [M]",
		"TITLE_CAPTURE_INFO": "Zobrazit podrobnosti tohoto záznamu [I]",
		"TITLE_ADVANCED_FEATURES": "Pokročilé možnosti",
		"TITLE_TOOLBOX": "Ostatní nástroje",

		// Popup window buttons

		"PORT_CONNECT": "Připojit čidlo",
		"PORT_DISCONNECT": "Odpojit toto čidlo",
		"PORT_ZERO_OUT": "Vynulovat hodnotu",
		"PORT_RESET": "Obnovit původní nulovou hodnotu",

		"ADVANCED_FIT_FUNCTION": "Proložit funkci [F]",
		"ADVANCED_NOTE_MANAGER": "Správce poznámek [N]",
		"ADVANCED_EXPORT_TABLE": "Exportovat tabulku (.csv)",
		"ADVANCED_EXPORT_IMAGE": "Exportovat graf (.svg)",

		"TOOLBOX_CALCULATOR": "Kalkulačka",
		"TOOLBOX_CONVERTER": "Převodník jednotek",
		"TOOLBOX_HELP": "Nápověda",
		"TOOLBOX_ABOUT": "O programu Coachium...",

		// Window contents

		"WINDOW0_TITLE": "Coachium beta",
		"WINDOW0_PAR0": "Copyright © Michal Procházka, 2021–2023.",
		"WINDOW0_PAR1":
			"Založeno na mé práci reverzního inženýrství komunikace<br>" +
			"mezi rozhraním CMA €Lab a softwarem CMA Coach.",
		"WINDOW0_PAR2": "Viz zde:",
		"WINDOW0_PAR3":
			"Tento program je svobodný software, distribuován pod<br>" +
			"licencí <a href=\"https://www.gnu.org/licenses/gpl-3.0.en.html\" target=\"_blank\">GNU General Public License verze 3</a>.",
		"WINDOW0_PAR4": "Většina použitých ikon pochází z projektu <a href=\"https://fontawesome.com/\">FontAwesome</a>.",
		"WINDOW0_PAR5":
			"Tato aplikace využívá následujícího svobodného softwaru:",
		"WINDOW0_PAR_LIST":
			"<li><a href=\"https://github.com/bevacqua/dragula\">Dragula - Drag and drop so simple it hurts</a></li>" +
			"<li><a href=\"https://github.com/pieroxy/lz-string\">lz-string - LZ-based compression algorithm for JavaScript</a></li>" +
			"<li><a href=\"https://github.com/gliffy/canvas2svg\">canvas2svg - Translates HTML5 Canvas draw commands to SVG</a></li>" +
			"<li><a href=\"https://github.com/aviaryan/BigEval.js\">BigEval.js - Fully featured mathematical expression solving library</a></li>" +
			"<li><a href=\"https://github.com/Tom-Alexander/regression-js\">regression-js - Curve Fitting in JavaScript</a></li>",

		"WINDOW1_TITLE": "Interní chyba aplikace",
		"WINDOW1_PAR0": "V aplikaci nastala neočekávaná chyba.",
		"WINDOW1_PAR1": "Omlouváme se za způsobené nepříjemnosti.",

		"WINDOW2_TITLE": "Nastavení záznamu",
		"WINDOW2_CAPTURE_NAME": "Název:",
		"WINDOW2_AVAILABLE_SENSORS": "Dostupná čidla",
		"WINDOW2_MODE_STD": "Normální režim",
		"WINDOW2_MODE_XY": "Režim X-Y",
		"WINDOW2_MODE_STD_DESC":
			"V normálním režimu lze vybrat libovolné množství čidel (v rámci schopností hardwaru), " +
			"které budou zaznamenávány zároveň a budou zobrazeny na ose Y v závislosti na čase. Je však i možné " +
			"si později zobrazit jen některá čidla, nebo si vygenerovat X-Y graf se dvěma vybranými čidly.",
		"WINDOW2_MODE_XY_DESC":
			"V režimu X-Y si můžete vybrat právě 2 čidla, jedno pro každou osu (X, Y). " +
			"Užitečné pro porovnávání různých veličin, kde není potřeba zobrazovat čas " +
			"(např. voltampérová charakteristika součástky).",
		"WINDOW2_X": "X",
		"WINDOW2_Y": "Y",
		"WINDOW2_PARAMS": "Parametry záznamu",
		"WINDOW2_FREQ": "Frekvence:",
		"WINDOW2_FREQ_UNIT": "Hz",
		"WINDOW2_LENGTH": "Délka:",
		"WINDOW2_PERIOD": "Perioda:",
		"WINDOW2_SAMPLES": "vzorků",

		"CSSATTR_WINDOW2_STD_DROPZONE": "Prosím přetáhněte sem čidla ze seznamu nalevo.",
		"CSSATTR_WINDOW2_XY_DROPZONE": "Prosím přetáhněte sem čidlo ze seznamu nalevo.",
		"CSSATTR_WINDOW2_TRIG_DROPZONE": "Pro podmíněný záznam sem přetáhněte čidlo ze seznamu nalevo.",

		"WINDOW3_TITLE": "Sešit uložen!",
		"WINDOW3_LINK": "Zde je odkaz na uložený soubor sešitu záznamů na Vašem Google Disku.",

		"WINDOW4_TITLE": "Něco se pokazilo.",
		"WINDOW4_PAR0": "Chyba ukládání sešitu záznamu na Google Disk:",

		"WINDOW5_TITLE": "Něco se pokazilo.",
		"WINDOW5_PAR0": "Chyba připojování ke službám Google:",
		"WINDOW5_PAR1":
			"Funkce uložení sešitu záznamu na Google Disk proto<br>" +
			"s největší pravděpodobností fungovat nebude.",
		"WINDOW5_PAR2": "Omlouváme se za způsobené nepříjemnosti.",

		"WINDOW6_TITLE": "Jak se bude uložený sešit jmenovat?",

		"WINDOW7_TITLE": "Chyba <span id='w7titleapi'></span>",
		"WINDOW7_PAR0":
			"Zdá se, že Váš prohlížeč nedpodporuje <span id='w7parapi'></span>,<br>" +
			"tudíž není možné se k tomuto zařízení připojit.",
		"WINDOW7_PAR1":
			"Pokuste se prosím Váš prohlížeč aktualizovat,<br>" +
			"nebo nainstalovat jiný (Google Chrome má velmi<br>" +
			"dobrou podporu těchto moderních vymožeností).",

		"WINDOW8_TITLE": "Něco se pokazilo.",
		"WINDOW8_PAR0": "Chyba ověřování zařízení.",
		"WINDOW8_PAR1":
			"Doporučujeme restartovat aplikaci<br>" +
			"a zkusit znovu.",
		"WINDOW8_PAR2":
			"Dále doporučujeme vypojit veškerá čidla,<br>" +
			"odpojit a znovu připojit samotné zařízení<br>" +
			"a zkusit znovu.",
		"WINDOW8_PAR3":
			"Případně vyměňte zařízení za jiné.",

		"WINDOW9_TITLE": "Chyba otevírání souboru",
		"WINDOW9_PAR0":
			"Zdá se, že nahraný soubor sešitu záznamu<br>" +
			"je poškozen a není platný.",
		"WINDOW9_PAR1": "Omlouváme se za způsobené nepříjemnosti.",

		"WINDOW10_TITLE": "Jste si jisti?",
		"WINDOW10_PAR0": "<b>Snažíte se otevřít jiný soubor sešitu záznamů.</b>",
		"WINDOW10_PAR1":
			"Máte rozpracovaná měření, a otevřením jiného sešitu<br>" +
			"ztratíte všechny změny, pokud je již nemáte uloženy!",
		"WINDOW10_PAR2": "Jste si skutečně jisti, že si přejete pokračovat?",

		"WINDOW11_TITLE": "Jste si jisti?",
		"WINDOW11_PAR0": "<b>Snažíte se odstranit tento záznam ze svého sešitu.</b>",
		"WINDOW11_PAR1":
			"Ujistěte se, že skutečně odstraňujete ten pravý,<br>" +
			"tato operace je nevratná!",
		"WINDOW11_PAR2": "Jste si skutečně jisti, že si přejete pokračovat?",

		"WINDOW12_TITLE": "Jste si jisti?",
		"WINDOW12_PAR0": "<b>Snažíte se odstranit celý svůj sešit záznamů.</b>",
		"WINDOW12_PAR1":
			"Ujistěte se, že máte všechnu důležitou práci uloženou,<br>" +
			"tato operace je nevratná!",
		"WINDOW12_PAR2": "Jste si skutečně jisti, že si přejete pokračovat?",

		"WINDOW13_TITLE": "Správce záznamů",

		"WINDOW17_TITLE": "Podrobnosti záznamu",

		"WINDOW18_TITLE": "Výběr zařízení",

		"WINDOW19_TITLE": "Proložit funkci",
		"WINDOW19_FUN_LINEAR": "Lineární: y = ax + b",
		"WINDOW19_FUN_QUADRATIC": "Kvadratická: y = ax² + bx + c",
		"WINDOW19_FUN_CUBIC": "Kubická: y = ax³ + bx² + cx + d",
		"WINDOW19_FUN_EXPONENTIAL": "Exponenciální: y = a * e^(bx)",
		"WINDOW19_FUN_LOGARITHMIC": "Logaritmická: y = a + b * ln(x)",
		"WINDOW19_FUN_POWER": "Mocninná: y = ax^b",
		"WINDOW19_FUN_SINE": "Goniometrická: y = a * sin(bx + c) + d",
		"WINDOW19_CHECKBOX": "Zobrazit tuto funkci na grafu",

		"WINDOW20_TITLE": "Chyba připojování zařízení",
		"WINDOW20_PAR0":
			"Nastala neočekávaná chyba při pokusu ke připojení k<br>" +
			"vybranému zařízení. Prosím ujistěte se, zda k němu<br>" +
			"máte dostatečná oprávnění.",

		"WINDOW21_TITLE": "Hlídací pes zaštěkal",
		"WINDOW21_PAR0": "Došlo k chybě při komunikaci s rozhraním.",
		"WINDOW21_PAR1": "Přejete si rozhraní restartovat?",

		"WINDOW22_TITLE": "Chyba spouštění záznamu",
		"WINDOW22_PAR0":
			"Zkuste prosím odpojit a opět zapojit všechna<br>" +
			"použitá čidla a spustit záznam znovu.",

		"WINDOW23_TITLE": "Správce poznámek",
		"WINDOW23_BUTTON_ADD": "Vytvořit poznámku",
		"WINDOW23_BUTTON_EDIT": "Uložit změny",
		"WINDOW23_BUTTON_MOVE": "Přesunout poznámku...",
		"WINDOW23_BUTTON_REMOVE": "Odstranit poznámku",
		"PLACEHOLDER_WINDOW23_TIP": "Sem můžete napsat svou poznámku. Kliknutím na tlačítko níže ji budete moci umístit do svého záznamu.",

		"WINDOW24_TITLE": "Chyba služeb Google",
		"WINDOW24_PAR0": "Chyba načítání podsystému řídící služby Google.",
		"WINDOW24_PAR1": "Přejete si ho znovu načíst?",
		"WINDOW24_PAR2":
			"(Kliknutím na \"Pokračovat\" se toto okno zavře<br>" +
			"a Coachium se pokusí znovu podsystém načíst.<br>" +
			"Pokud uspěje, objeví se zanedlouho přihlašovací<br>" +
			"okno Google.)",

		"WINDOW25_MSG": "Prosím vyčkejte, připravuji zařízení...",

		"WINDOW26_TITLE": "Jak se bude tento záznam jmenovat?",

		"WINDOW27_TITLE": "Export tabulky",
		"WINDOW27_DECIMAL_SEPARATOR": "Desetinná značka",
		"WINDOW27_FUN_CHECKBOX": "Exportovat proložené funkce",

		"WINDOW28_TITLE": "Export grafu",
		"WINDOW28_RESOLUTION": "Výsledné rozlišení",
		"WINDOW28_RESOLUTION_SEPARATOR": "x",
		"WINDOW28_FUN_CHECKBOX": "Exportovat proložené funkce",
		"WINDOW28_NOTE_CHECKBOX": "Exportovat poznámky",

		"WINDOW29_DEG": "Stupně",
		"WINDOW29_RAD": "Radiány",
		"WINDOW29_GON": "Grady",

		// "Privacy policy" window text

		"PP_TITLE": "Zásady ochrany osobních údajů",
		"PP_BODY":
			"<p>Tato aplikace, při kliknutí na tlačítko „Uložit sešit záznamů na Google Disk“ na horním panelu, kontaktuje služby Google, aby mohla uložit soubor sešitu záznamů na Google Disk Vašeho Google účtu.</p>" +
			"<p>To je vše, kvůli čemu bychom potřebovali přístup k Vašemu Google účtu. Nečteme z Vašeho účtu <i>žádná</i> data, nic si o vás neukládáme na náš server, nezaznamenáváme žádnou aktivitu, pouze ukládáme Váš soubor záznamu, a to pouze tehdy, když stisknete dané tlačítko.</p>" +
			"<p>Pokud si nepřejete, abychom měli přístup k Vašemu Google Účtu, máte vždy možnost si soubor sešit záznamů stáhnout jako soubor přímo do Vašeho počítače a poté ho ručně nahrát na Google Disk. Tuto funkci Vám poskytujeme jen pro Vaše pohodlí.</p>" +
			"<b>" +
				"<p>Nepoužíváme žádná data z Vašeho Google účtu.</p>" +
				"<p>Neukládáme si a nesdílíme s nikým žádná data z Vašeho Google účtu.</p>" +
			"</b>",
	},
	js: {
		"MAINWIN_NO_CAPTURES_1": "Zatím nebyl vytvořen žádný záznam.",
		"MAINWIN_NO_CAPTURES_2": "Buď můžete spustit nový záznam, nebo otevřít jiný sešit záznamu.",
		"MAINWIN_HELP_START": "Kliknutím na toto tlačítko spustíte nový záznam.",
		"MAINWIN_HELP_DRAG": "Posun grafu",
		"MAINWIN_HELP_SCROLL": "Přiblížení a oddálení grafu",
		"MAINWIN_HELP_ALT_SCROLL": "Přiblížení a oddálení na ose X",
		"MAINWIN_HELP_SHIFT_SCROLL": "Přiblížení a oddálení na ose Y",

		"CAPTURE_FMT": "Záznam {0} z {1}: {2}",

		"TIME_SENSOR": "Čas",

		"FIT_FUN_XY_MODE": "Režim X-Y: {0} ({1}) / {2} ({3})",
		"FIT_FUN_TIME_MODE": "Normální režim: {0} ({1}) / {2} ({3})",

		"TABLE_INTERVAL": "Interval ({0})",
		"TABLE_SENSOR": "Čidlo {0} ({1})",
		"TABLE_FUN_UNKNOWN_TYPE": "Funkce ({0})",
		"TABLE_FUN_FITTED": "{0} funkce, proložená ({1})",
		"TABLE_FUN": "{0} funkce ({1})",
		"TABLE_FUN_LINEAR": "Lineární",
		"TABLE_FUN_QUADRATIC": "Kvadratická",
		"TABLE_FUN_CUBIC": "Kubická",
		"TABLE_FUN_EXPONENTIAL": "Exponenciální",
		"TABLE_FUN_LOGARITHMIC": "Logaritmická",
		"TABLE_FUN_POWER": "Mocninná",

		"DEFAULT_FILENAME": "{0} – Laboratorní práce – {1}",
		"DEFAULT_USERNAME": "Jan Novák",

		"STATUS_FILE_LOADED": "Soubor načten.",
		"STATUS_FILE_SAVED": "Soubor připraven k uložení.",
		"STATUS_CAPTURE_REMOVED": "Měření {0} odstraněno.",
		"STATUS_ALL_REMOVED": "Všechna měření odstraněna.",

		"UNTITLED_CAPTURE": "Záznam bez názvu",

		"HOMEPAGE_COMMIT_OK": "👍 Nejnovější verze ({0})",
		"HOMEPAGE_COMMIT_OLD": "👎 Zastaralá verze, prosím aktualizujte! ({0} nainstalovaná, {1} dostupná)",
		"HOMEPAGE_COMMIT_ERR": "😕 Chyba ověřování nejnovější verze",
		"HOMEPAGE_COMMIT_LOCALHOST": "Na localhostu je kontrola verze zakázána.",

		"BUTTON_DISCONNECT": "Odpojit se od zařízení",
		"STATUS_WELCOME": "Vítejte v aplikaci Coachium!",
		"STATUS_DISCONNECTED": "Zařízení odpojeno.",
		"STATUS_NO_DEVICE_SELECTED": "Nebylo vybráno žádné zařízení!",
		"STATUS_FORCE_DISCONNECTED": "Zařízení násilně odpojeno!",

		"SENSOR_LOADING": "Načítání...",
		"SENSOR_DISCONNECTED": "Čidlo nepřipojeno",
		"SENSOR_INTELLIGENT": "Inteligentní čidlo, jeho vlastnosti byly načteny automaticky",
		"SENSOR_PORT_CONNECTED": "Toto čidlo je připojeno do portu {0}",

		"SETUP_CLOSEST_USABLE_FREQ": "Nejbližší použitelná frekvence je {0} Hz.",
		"SETUP_REDUCED_RUNTIME": "Záznam poběží pouze {0} sekund.",
		"SETUP_SENSOR_ERR_STD": "Prosím přiřaďte alespoň jedno čidlo.",
		"SETUP_SENSOR_ERR_XY": "V režimu X-Y musíte přiřadit právě dvě čidla.",
		"SETUP_SENSOR_TOO_MUCH": "Je přiřazeno příliš mnoho čidel. Prosím nějaká odstraňte.",
		"SETUP_TRIG_TOO_LOW": "Čidlo používané jako podmínka nemůže nabýt hodnoty pod {0}. Prosím zvyšte požadovanou hodnotu.",
		"SETUP_TRIG_TOO_HIGH": "Čidlo používané jako podmínka nemůže nabýt hodnoty nad {0}. Prosím snižte požadovanou hodnotu.",

		"STATUS_WAITING_FOR_TRIGGER": "Podmíněný záznam je připraven, čeká na splnění podmínky...",
		"STATUS_CAPTURE_RUNNING": "Záznam právě běží... ({0} vzorků, {1} sekund)",
		"STATUS_CAPTURE_FINISHED": "Záznam skončil.",

		"NOTE_MANAGER_ADD": "+ Přidat novou poznámku",
		"STATUS_PLACE_NOTE": "Vyberte bod, kde bude umístěna tato poznámka.",
		"STATUS_PLACE_NOTE_DONE": "Poznámka umístěna.",

		"STATUS_ZOOM_IN_REQUEST": "Vyberte oblast, kterou chcete přiblížit.",
		"STATUS_ZOOM_IN_CONFIRM": "Vybraná oblast přiblížena.",
		"STATUS_ZOOM_IN_CANCEL": "Výběr oblasti pro přiblížení zrušen.",
		"STATUS_ZOOM_DATA": "Přiblížena oblast s daty.",
		"STATUS_ZOOM_DATA_ERROR": "Chyba přibližování do oblasti s daty.",
		"STATUS_ZOOM_RESET": "Pohled na graf obnoven.",

		"CONNECT_BUTTON_TEXT": "Připojit se k {0}",

		"INVALID_FIT": "Ze vstupních dat nelze proložit<br>danou funkci.",

		"INFO_WINDOW_CONTENTS":
			"<p>Celkem naměřeno <b>{0}</b> vzorků<br>" +
			"({1} každým čidlem)</p>" +
			"<p>Rychlost záznamu: <b>{2} Hz</b></p>" +
			"<p>Doba záznamu: <b>{3} s</b></p>",

		"INFO_WINDOW_SENSOR":
			"<p><b>Čidlo {0} – {1}</b></p>" +
			"<p>Rozsah: <b>{2} – {3} {4}</b></p>",

		"EXPORT_CSV_NAME": "Export dat záznamu {0}.csv",
		"EXPORT_SVG_NAME": "Export grafu záznamu {0}.svg",

		"HELP_LOAD_ERROR": "<h1>Chyba načítání nápovědy.</h1>",
		
		"TOOLBOX_CONVERTER_UNITS": {
			"LENGTH": {
				"NAME": "Délka",
				"TYPES": {
					"NM": [ "nm", "nanometr" ],
					"UM": [ "µm", "mikrometr" ],
					"MM": [ "mm", "milimetr" ],
					"CM": [ "cm", "centimetr" ],
					"DM": [ "dm", "decimetr" ],
					"M": [ "m", "metr" ],
					"KM": [ "km", "kilometr" ],
					"IN": [ "in", "palec" ],
					"FT": [ "ft", "stopa" ],
					"YD": [ "yd", "yard" ],
					"MI": [ "mi", "míle" ],
					"NMI": [ "nmi", "námořní míle" ],
				}
			},
			"AREA": {
				"NAME": "Plocha",
				"TYPES": {
					"NM": [ "nm²", "nanometr čtvereční" ],
					"UM": [ "µm²", "mikrometr čtvereční" ],
					"MM": [ "mm²", "milimetr čtvereční" ],
					"CM": [ "cm²", "centimetr čtvereční" ],
					"DM": [ "dm²", "decimetr čtvereční" ],
					"M": [ "m²", "metr čtvereční" ],
					"KM": [ "km²", "kilometr čtvereční" ],
					"AR": [ "ar", "ar" ],
					"HA": [ "ha", "hektar" ],
					"IN": [ "in²", "palec čtvereční" ],
					"FT": [ "ft²", "stopa čtvereční" ],
					"YD": [ "yd²", "yard čtvereční" ],
					"AC": [ "ac", "akr" ],
					"MI": [ "mi²", "míle čtvereční" ],
				}
			},
			"VOLUME": {
				"NAME": "Objem",
				"TYPES": {
					"NM": [ "nm³", "nanometr krychlový" ],
					"UM": [ "µm³", "mikrometr krychlový" ],
					"MM": [ "mm³", "milimetr krychlový" ],
					"CM": [ "cm³", "centimetr krychlový" ],
					"DM": [ "dm³", "decimetr krychlový" ],
					"M": [ "m³", "metr krychlový" ],
					"KM": [ "km³", "kilometr krychlový" ],
					"ML": [ "ml", "mililitr" ],
					"CL": [ "cl", "centilitr" ],
					"DL": [ "dl", "decilitr" ],
					"L": [ "l", "litr" ],
					"HL": [ "hl", "hektolitr" ],
					"IN": [ "in³", "palec krychlový" ],
					"FT": [ "ft³", "stopa krychlová" ],
					"YD": [ "yd³", "yard krychlový" ],
					"MI": [ "mi³", "míle krychlová" ],
				}
			},
			"MASS": {
				"NAME": "Hmotnost",
				"TYPES": {
					"UG": [ "µg", "mikrogram" ],
					"MG": [ "mg", "miligram" ],
					"G": [ "g", "gram" ],
					"DKG": [ "dkg", "dekagram" ],
					"KG": [ "kg", "kilogram" ],
					"T": [ "t", "tuna" ],
					"OZ": [ "oz", "unce" ],
					"LB": [ "lb", "libra" ],
					"ST": [ "st", "kámen" ],
				}
			},
			"SPEED": {
				"NAME": "Rychlost",
				"TYPES": {
					"KMPH": [ "km/h", "kilometr za hodinu" ],
					"MPS": [ "m/s", "metr za sekundu" ],
					"MIPH": [ "mi/h", "míle za hodinu" ],
					"FTPS": [ "ft/s", "stopa za sekundu" ],
					"KN": [ "kn", "uzel" ],
				}
			},
			"TEMPERATURE": {
				"NAME": "Teplota",
				"TYPES": {
					"C": [ "°C", "stupeň Celsia" ],
					"F": [ "°F", "stupeň Fahrenheita" ],
					"K": [ "K", "kelvin" ],
				}
			},
			"TIME": {
				"NAME": "Čas",
				"TYPES": {
					"NS": [ "ns", "nanosekunda" ],
					"US": [ "µs", "nanosekunda" ],
					"MS": [ "ms", "milisekunda" ],
					"S": [ "s", "sekunda" ],
					"M": [ "min", "minuta" ],
					"H": [ "h", "hodina" ],
					"D": [ "d", "den" ],
				}
			},
			"PLANE_ANGLE": {
				"NAME": "Rovinný úhel",
				"TYPES": {
					"DEG": [ "deg", "stupeň" ],
					"RAD": [ "rad", "radián" ],
					"GON": [ "gon", "grad" ],
				}
			},
		},
	},
	ds: ","
};
