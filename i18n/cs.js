/*
 * Coachium - i18n/cs.js
 * - Czech internationalization data
 * 
 * Made by Michal Procházka, 2021-2022.
 */

const alt_htmllang = {
	// Homepage text

	"HOMEPAGE_ABOUT_LINK": "Co je to Coachium?",
	"HOMEPAGE_PRIVACY_POLICY_LINK": "Zásady ochrany osobních údajů",
	"HOMEPAGE_COMMIT_CHECKING": "Kontroluji verzi...",
	"TITLE_HOMEPAGE_ABOUT": "O programu Coachium...",

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
	"TITLE_FIT_FUNCTION": "Fitovat funkci na naměřená data [F]",
	"TITLE_REMOVE_CAPTURE": "Odstranit tento záznam ze sešitu [Delete]",
	"TITLE_PREVIOUS_CAPTURE": "Zobrazit předchozí záznam v sešitě [← nebo PageUp]",
	"TITLE_SHOW_AS_TABLE": "Zobrazit záznam jako tabulku [T]",
	"TITLE_SHOW_AS_CHART": "Zobrazit záznam jako graf [T]",
	"TITLE_NEXT_CAPTURE": "Zobrazit následující záznam v sešitě [→ nebo PageDown]",
	"TITLE_CHART_ZOOM_IN": "Přiblížit pohled na graf [+]",
	"TITLE_CHART_ZOOM_RESET": "Obnovit pohled na graf [=]",
	"TITLE_CAPTURE_MGMT": "Spravovat záznamy [M]",
	"TITLE_CAPTURE_INFO": "Zobrazit podrobnosti tohoto záznamu [I]",

	// Window contents

	"WINDOW0_TITLE": "Coachium pre-alpha",
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

	"WINDOW13_TITLE": "Správce záznamů",

	"WINDOW17_TITLE": "Podrobnosti záznamu",

	"WINDOW18_TITLE": "Chyba Google Služeb",
	"WINDOW18_PAR0":
		"Taková situace může nastat, když neudělíte této aplikaci<br>" +
		"dostatečná oprávnění k zápisu souborů na Váš Google Disk.",
	"WINDOW18_PAR1":
		"Pokud jste tak již učinili, prosím navštivte následující<br>" +
		"odkaz, tam v seznamu najděte Coachium, klikněte na<br>" +
		"<b>ODEBRAT PŘÍSTUP</b> a zkuste se přihlásit znovu.",

	"WINDOW19_TITLE": "Fit funkce",
	"WINDOW19_FUN_LINEAR": "Lineární (y = ax + b)",
	"WINDOW19_FUN_QUADRATIC": "Kvadratická (y = ax² + bx + c)",
	"WINDOW19_CHECKBOX": "Zobrazit tuto funkci na grafu",

	"WINDOW20_TITLE": "Chyba připojování zařízení",
	"WINDOW20_PAR0":
		"Nastala neočekávaná chyba při pokusu ke připojení k<br>" +
		"vybranému zařízení. Prosím ujistěte se, zda k němu<br>" +
		"máte dostatečná oprávnění.",

	"WINDOW21_TITLE": "Hlídací pes zaštěkal",
	"WINDOW21_PAR0": "Došlo k chybě při komunikaci s rozhraním.",
	"WINDOW21_PAR1": "Přejete si rozhraní restartovat?",

	// "About" window text

	"ABOUT_TITLE": "Co je to Coachium?",
	"ABOUT_BODY":
		"<p>Coachium slouží jako webová alternativa k softwaru Coach vyvíjený firmou CMA Amsterdam, který je určen ke komunikaci s rozhraními a čidly od téže firmy (momentálně je Coachiem podporovaný pouze €Lab a inteligentní čidla), se kterými lze provést měření různých fyzikálních veličin a zaznamenat jejich výsledky do grafu.</p>" +
		"<p>Coachium se rovněž snaží relativně komplexní software CMA Coach zjednodušit, aby mohl být jednoduše přístupný každému. CMA Coach je totiž velmi obsáhlý software, což ale znamená, že i ty nejjednodušší operace vyžadují po uživateli některé základní znalosti o používání tohoto softwaru (např. pokud si přejete provést měření do grafu, musíte nejprve vědět, že musíte nejdříve vytvořit panel grafu, nastavit ho, pak nakonfigurovat měření a teprve poté ho spustit), bez kterých se neobejdete.</p>" +
		"<p>Díky jednoduchému uživatelskému rozhraní v Coachiu vše dává smysl, veškeré operace, které byste si přáli provést, jsou dostupné na panelu s ikonkami, jejichž funkce jsou vždy srozumitelně popsané; nic není nikde zbytečně skryté.</p>" +
		"<p>Proto se Coachium od starého CMA Coache musí trochu lišit. Coachium funguje na principu „sešitu“, tj. když uživatel otevře Coachium, může vytvořit libovolný počet měření a grafů, která poté uloží jako jeden „sešit“ (např. pokud provádíte volt-ampérovou charakteristiku několika komponent, nemusíte každou komponentu ukládat jako samostatný soubor). Samozřejmě máte možnost (a je silně doporučeno) si každé měření pojmenovat, aby se v odevzdaném sešitu vyučující vyznal.</p>" +
		"<p>A navíc, jelikož je Coachium vyvíjen ve 21. století, obsahuje i některé moderní „vychytávky“, např. máte možnost si uložit svůj sešit měření přímo na Váš Google Disk s jediným kliknutím, odkud ho můžete ihned odevzdat vyučujícímu přímo na Google Učebnu.</p>" +
		"<p>Nyní pevně doufáme, že jsme Vás seznámili o tom, co to Coachium vlastně je, a zároveň doufáme, že si práci s ním užijete!</p>",

	// "Privacy policy" window text

	"PP_TITLE": "Zásady ochrany osobních údajů",
	"PP_BODY":
		"<p>Tato aplikace, při kliknutí na tlačítko „Uložit sešit záznamů na Google Disk“ na horním panelu, kontaktuje služby Google, aby mohla uložit soubor sešitu záznamů na Google Disk Vašeho Google účtu.</p>" +
		"<p>To je vše, kvůli čemu bychom potřebovali přístup k Vašemu Google účtu. Nečteme z Vašeho účtu <i>žádná</i> data (kromě vašeho jména pro správné pojmenování uloženého souboru), nic si o vás neukládáme na náš server, nezaznamenáváme žádnou aktivitu, pouze ukládáme Váš soubor záznamu, a to pouze tehdy, když stisknete dané tlačítko.</p>" +
		"<p>Pokud si nepřejete, abychom měli přístup k Vašemu Google Účtu, máte vždy možnost si soubor sešit záznamů stáhnout jako soubor přímo do Vašeho počítače a poté ho ručně nahrát na Google Disk. Tuto funkci Vám poskytujeme jen pro Vaše pohodlí.</p>" +
		"<b>" +
			"<p>Jediný údaj z Vašeho Google účtu, který čteme a používáme, je vaše veřejné jméno pro správné pojmenování souboru.</p>" +
			"<p>Neukládáme si a nesdílíme s nikým žádná data z Vašeho Google účtu.</p>" +
		"</b>",
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

	"WATCHDOG_MSG": "Vyčkejte prosím...",

	// ui.js

	"HOMEPAGE_COMMIT_OK": "👍 Nejnovější verze ({0})",
	"HOMEPAGE_COMMIT_OLD": "👎 Zastaralá verze, prosím aktualizujte! ({0} nainstalovaná, {1} dostupná)",
	"HOMEPAGE_COMMIT_ERR": "😕 Chyba ověřování nejnovější verze",

	"CHECKSUM_NOT_RESPONDING": "nereaguje",
	"BUTTON_DISCONNECT": "Odpojit se od zařízení",
	"STATUS_WELCOME": "Vítejte v aplikaci Coachium!",
	"STATUS_DISCONNECTED": "Zařízení odpojeno.",

	"SETUP_CLOSEST_USABLE_FREQ": "Nejbližší použitelná frekvence je<br>{0} Hz.",
	"SETUP_REDUCED_RUNTIME": "Záznam poběží pouze {0} sekund.",
	"SETUP_SENSOR_ERR": "Vybraná čidla nejsou připojena.",

	"STATUS_ZOOM_IN_REQUEST": "Vyberte oblast, kterou chcete přiblížit.",
	"STATUS_ZOOM_IN_CONFIRM": "Vybraná oblast přiblížena.",
	"STATUS_ZOOM_IN_CANCEL": "Výběr oblasti pro přiblížení zrušen.",
	"STATUS_ZOOM_RESET": "Pohled na graf obnoven.",

	"INFO_WINDOW_CONTENTS":
		"<p>Celkem naměřeno <b>{0}</b> vzorků<br>" +
		"({1} každým čidlem)</p>" +
		"<p>Rychlost záznamu: <b>{2} Hz</b></p>" +
		"<p>Nastavená doba záznamu: <b>{3} s</b></p>" +
		"<p>Skutečná doba záznamu: <b>{4} s</b></p>",

	"INFO_WINDOW_SENSOR":
		"<p><b>Čidlo {0} – {1}</b></p>" +
		"<p>Rozsah: <b>{2} – {3} {4}</b></p>",
};

const decimal_separator = ",";
