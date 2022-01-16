
const alt_htmllang = {
	// Homepage text

	"HOMEPAGE_VERSION": "Verze 0.1 pre-alpha",
	"HOMEPAGE_ABOUT_LINK": "Co je to Coachium?",
	"HOMEPAGE_PRIVACY_POLICY_LINK": "Privacy policy",

	// Button descriptions

	"BUTTON_CONNECT": "Připojit se k zařízení",
	"BUTTON_START_GUEST": "Spustit v režimu hosta",
	"BUTTON_CLOSE": "Zavřít",
	"BUTTON_START": "Spustit",
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
	"TITLE_RENAME_CAPTURE": "Přejmenovat tento záznam [R]",
	"TITLE_REMOVE_CAPTURE": "Odstranit tento záznam ze sešitu [Delete]",
	"TITLE_PREVIOUS_CAPTURE": "Zobrazit předchozí záznam v sešitě [← nebo PageUp]",
	"TITLE_SHOW_AS_TABLE": "Zobrazit záznam jako tabulku [T]",
	"TITLE_SHOW_AS_CHART": "Zobrazit záznam jako graf [T]",
	"TITLE_NEXT_CAPTURE": "Zobrazit následující záznam v sešitě [→ nebo PageDown]",
	"TITLE_CHART_ZOOM_IN": "Přiblížit pohled na graf [+]",
	"TITLE_CHART_ZOOM_RESET": "Obnovit pohled na graf [=]",
	"TITLE_ABOUT": "O programu Coachium...",

	// Window contents

	"WINDOW0_TITLE": "Coachium v0.1 pre-alpha",
	"WINDOW0_PAR0": "Vytvořil Michal Procházka, 2021–2022.",
	"WINDOW0_PAR1":
		"Založeno na mé práci reverzního inženýrství komunikace<br>" +
		"mezi rozhraním CMA €Lab a softwarem CMA Coach.",
	"WINDOW0_PAR2": "Viz zde:",

	"WINDOW1_TITLE": "Interní chyba aplikace",
	"WINDOW1_PAR0": "V aplikaci nastala neočekávaná chyba.",
	"WINDOW1_PAR1": "Omlouváme se za způsobené nepříjemnosti.",

	"WINDOW2_TITLE": "Nastavení záznamu",
	"WINDOW2_PAR0": "Název záznamu",
	"WINDOW2_PAR1": "Parametry záznamu",
	"WINDOW2_HZ": "Hz",
	"WINDOW2_SECONDS": "sekund",
	"WINDOW2_PAR2": "Z čeho zaznamenávat?",
	"WINDOW2_SETUP_BOTH": "Z obou čidel najednou",
	"WINDOW2_SETUP_FIRST": "Jen z čidla 1",
	"WINDOW2_SETUP_SECOND": "Jen z čidla 2",

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

	"WINDOW7_TITLE": "Chyba WebHID",
	"WINDOW7_PAR0":
		"Zdá se, že Váš prohlížeč nedpodporuje WebHID,<br>" +
		"tudíž není možné se k žádnému zařízení připojit.",
	"WINDOW7_PAR1":
		"Pokud používáte prohlížeč na bázi Chromium<br>" +
		"(Google Chrome, Brave, Microsoft Edge, Opera...),<br>" +
		"pokuste se prohlížeč aktualizovat. WebHID je<br>" + 
		"poměrně nový standard, proto nemusí být ve vaší<br>" +
		"starší verzi podporován.",
	"WINDOW7_PAR2":
		"Mozilla Firefox (a jeho deriváty) a Apple Safari<br>" +
		"WebHID <b>nepodporují</b>.",

	"WINDOW8_TITLE": "Něco se pokazilo.",
	"WINDOW8_PAR0": "Chyba ověřování zařízení.",
	"WINDOW8_PAR1":
		"Kontrolní suma ověřovací pakety (<span id=\"receivedsum\"></span>)<br>" +
		"nesouhlasí očekávané hodnotě (3754).",
	"WINDOW8_PAR2":
		"Doporučujeme restartovat aplikaci<br>" +
		"a zkusit znovu.",
	"WINDOW8_PAR3":
		"Dále doporučujeme vypojit veškerá čidla,<br>" +
		"odpojit a znovu připojit samotné zařízení<br>" +
		"a zkusit znovu.",
	"WINDOW8_PAR4":
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

	"WINDOW13_TITLE": "Jak se bude tento záznam jmenovat?"
};

const alt_jslang = {
	// mainwindow.js
	
	"MAINWIN_NO_CAPTURES_1": "Zatím nebyl vytvořen žádný záznam.",
	"MAINWIN_NO_CAPTURES_2": "Buď můžete spustit nový záznam, nebo otevřít jiný sešit záznamu.",

	"CAPTURE_FMT": "Záznam {0} z {1}: {2}",

	"INTERVAL": "Interval (s)",
	"SENSOR_1": "Čidlo 1 ({0})",
	"SENSOR_2": "Čidlo 2 ({0})",

	// gdrive_interface.js

	"DEFAULT_FILENAME": "{0} – Laboratorní práce – {1}",
	
	// file.js

	"DEFAULT_USERNAME": "Jan Novák",
	"STATUS_FILE_LOADED": "Soubor načten.",
	"STATUS_FILE_SAVED": "Soubor připraven k uložení.",
	"STATUS_CAPTURE_REMOVED": "Měření {0} odstraněno.",
	"STATUS_ALL_REMOVED": "Všechna měření odstraněna.",

	"UNTITLED_CAPTURE": "Záznam bez názvu",

	// elab.js

	"SENSOR_LOADING": "Načítání inteligentního čidla...",
	"SENSOR_DISCONNECTED": "Čidlo nepřipojeno",
	"SENSOR_INTELLIGENT": "Inteligentní čidlo",

	"STATUS_CAPTURE_RUNNING": "Záznam právě běží... ({0} vzorků, {1} sekund)",
	"STATUS_CAPTURE_FINISHED": "Záznam skončil.",

	"STATUS_NO_DEVICE_SELECTED": "Nebylo vybráno žádné zařízení!",
	"STATUS_DEVICE_DISCONNECTED": "Zařízení {0} násilně odpojeno!",

	// ui.js

	"CHECKSUM_NOT_RESPONDING": "nereaguje",
	"BUTTON_DISCONNECT": "Odpojit se od zařízení",
	"STATUS_WELCOME": "Vítejte v aplikaci Coachium!",
	"STATUS_DISCONNECTED": "Zařízení odpojeno.",

	"SETUP_CLOSEST_USABLE_FREQ": "Nejbližší použitelná frekvence je<br>{0} Hz.",
	"SETUP_REDUCED_RUNTIME": "Záznam poběží pouze {0} sekund.",
	"SETUP_SENSOR_ERR": "Vybraná čidla nejsou připojena.",

	"STATUS_ZOOM_IN_REQUEST": "Vyberte oblast, kterou chcete přiblížit.",
	"STATUS_ZOOM_IN_CONFIRM": "Vybraná oblast úspěšně přiblížena.",
	"STATUS_ZOOM_IN_CANCEL": "Výběr oblasti pro přiblížení zrušen.",
	"STATUS_ZOOM_RESET": "Pohled na graf obnoven.",
};

const decimal_separator = ",";
