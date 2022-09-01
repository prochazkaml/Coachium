/*
 * Coachium - js/i18n/cs.js
 * - Czech internationalization data
 * 
 * Copyright (C) 2021-2022 Michal Procházka
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

const htmllang = {
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
	"TITLE_FIT_FUNCTION": "Fitovat funkci na naměřená data [F]",
	"TITLE_NOTE_MANAGER": "Správce poznámek [N]",
	"TITLE_REMOVE_CAPTURE": "Odstranit tento záznam ze sešitu [Delete]",
	"TITLE_PREVIOUS_CAPTURE": "Zobrazit předchozí záznam v sešitě [← nebo PageUp]",
	"TITLE_SHOW_AS_TABLE": "Zobrazit záznam jako tabulku [T]",
	"TITLE_SHOW_AS_CHART": "Zobrazit záznam jako graf [T]",
	"TITLE_NEXT_CAPTURE": "Zobrazit následující záznam v sešitě [→ nebo PageDown]",
	"TITLE_CHART_ZOOM_IN": "Přiblížit pohled na graf [+]",
	"TITLE_CHART_ZOOM_DATA": "Přiblížit na data [=]",
	"TITLE_CHART_ZOOM_RESET": "Obnovit pohled na graf [-]",
	"TITLE_CAPTURE_MGMT": "Spravovat záznamy [M]",
	"TITLE_CAPTURE_INFO": "Zobrazit podrobnosti tohoto záznamu [I]",

	// Port popup window buttons

	"PORT_CONNECT": "Připojit čidlo",
	"PORT_DISCONNECT": "Odpojit toto čidlo",
	"PORT_ZERO_OUT": "Vynulovat hodnotu",
	"PORT_RESET": "Obnovit původní nulovou hodnotu",

	// Window contents

	"WINDOW0_TITLE": "Coachium alpha",
	"WINDOW0_PAR0": "Copyright (C) Michal Procházka, 2021–2022.",
	"WINDOW0_PAR1":
		"Založeno na mé práci reverzního inženýrství komunikace<br>" +
		"mezi rozhraním CMA €Lab a softwarem CMA Coach.",
	"WINDOW0_PAR2": "Viz zde:",
	"WINDOW0_PAR3":
		"Tento program je svobodný software, distribuován pod<br>" +
		"licencí <a href=\"https://www.gnu.org/licenses/gpl-3.0.en.html\" target=\"_blank\">GNU General Public License verze 3</a>.",
	"WINDOW0_PAR4":
		"Většina použitých ikon pochází z projektu <a href=\"https://fontawesome.com/\">FontAwesome</a>.<br>" +
		"V některých částech aplikace je využívána knihovna <a href=\"https://github.com/bevacqua/dragula\">Dragula</a>.",

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

	"WINDOW22_TITLE": "Chyba spouštění záznamu",
	"WINDOW22_PAR0":
		"Zkuste prosím odpojit a opět zapojit všechna<br>" +
		"použitá čidla a spustit záznam znovu.",

	"WINDOW23_TITLE": "Správce poznámek",
	"WINDOW23_BUTTON_ADD": "Vytvořit poznámku",
	"WINDOW23_BUTTON_EDIT": "Uložit změny",
	"WINDOW23_BUTTON_MOVE": "Přesunout poznámku...",
	"WINDOW23_BUTTON_REMOVE": "Odstranit poznámku",

	"WINDOW24_TITLE": "Chyba služeb Google",
	"WINDOW24_PAR0": "Chyba načítání podsystému řídící služby Google.",
	"WINDOW24_PAR1": "Přejete si ho znovu načíst?",
	"WINDOW24_PAR2":
		"(Kliknutím na \"Pokračovat\" se toto okno zavře<br>" +
		"a Coachium se pokusí znovu podsystém načíst.<br>" +
		"Pokud uspěje, objeví se zanedlouho přihlašovací<br>" +
		"okno Google.)",

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
			"<p>Nepoužíváme žádná data z Vašeho Google účtu.</p>" +
			"<p>Neukládáme si a nesdílíme s nikým žádná data z Vašeho Google účtu.</p>" +
		"</b>",
};

const jslang = {
	// mainwindow.js

	"MAINWIN_NO_CAPTURES_1": "Zatím nebyl vytvořen žádný záznam.",
	"MAINWIN_NO_CAPTURES_2": "Buď můžete spustit nový záznam, nebo otevřít jiný sešit záznamu.",

	"CAPTURE_FMT": "Záznam {0} z {1}: {2}",

	"TABLE_INTERVAL": "Interval ({0})",
	"TABLE_SENSOR": "Čidlo {0} ({1})",

	// gdrive_interface.js

	"DEFAULT_FILENAME": "{0} – Laboratorní práce – {1}",

	// file.js

	"DEFAULT_USERNAME": "Jan Novák",
	"STATUS_FILE_LOADED": "Soubor načten.",
	"STATUS_FILE_SAVED": "Soubor připraven k uložení.",
	"STATUS_CAPTURE_REMOVED": "Měření {0} odstraněno.",
	"STATUS_ALL_REMOVED": "Všechna měření odstraněna.",

	"UNTITLED_CAPTURE": "Záznam bez názvu",

	// ui.js

	"HOMEPAGE_COMMIT_OK": "👍 Nejnovější verze ({0})",
	"HOMEPAGE_COMMIT_OLD": "👎 Zastaralá verze, prosím aktualizujte! ({0} nainstalovaná, {1} dostupná)",
	"HOMEPAGE_COMMIT_ERR": "😕 Chyba ověřování nejnovější verze",
	"HOMEPAGE_COMMIT_LOCALHOST": "Na localhostu je kontrola verze zakázána.",

	"BUTTON_DISCONNECT": "Odpojit se od zařízení",
	"STATUS_WELCOME": "Vítejte v aplikaci Coachium!",
	"STATUS_DISCONNECTED": "Zařízení odpojeno.",
	"STATUS_NO_DEVICE_SELECTED": "Nebylo vybráno žádné zařízení!",
	"STATUS_FORCE_DISCONNECTED": "Zařízení násilně odpojeno!",

	"SENSOR_NONE_PRESENT": "Nenalezeny žádné vstupy. Prosím připojte kompatibilní zařízení.",
	"SENSOR_LOADING": "Načítání inteligentního čidla...",
	"SENSOR_DISCONNECTED": "Čidlo nepřipojeno",
	"SENSOR_INTELLIGENT": "Inteligentní čidlo",

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

	"INFO_WINDOW_CONTENTS":
		"<p>Celkem naměřeno <b>{0}</b> vzorků<br>" +
		"({1} každým čidlem)</p>" +
		"<p>Rychlost záznamu: <b>{2} Hz</b></p>" +
		"<p>Doba záznamu: <b>{3} s</b></p>",

	"INFO_WINDOW_SENSOR":
		"<p><b>Čidlo {0} – {1}</b></p>" +
		"<p>Rozsah: <b>{2} – {3} {4}</b></p>",
};

const decimal_separator = ",";
