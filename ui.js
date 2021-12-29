/*
 * popup_window(id)
 *
 * Otevře popup okno podle ID. Seznam možných ID je úplně nahoře v tomto souboru, všechny začínají na WINDOWID.
 */

function popup_window(id) {
	if(openwindow < 0) {
		openwindow = id;

		if(close_window_timeout) {
			clearTimeout(close_window_timeout);
			close_window_timeout = null;
		}

		get_win(id).style.display = "";
		get_id("windowoverlay").style.pointerEvents = "auto";
		get_id("windowoverlay").style.opacity = 1;
		get_id("windowcontainer").style.transform = "scale(1)";
	}
}

/*
 * close_window()
 *
 * Zavře právě otevřené okno.
 */

var close_window_timeout = null;

function close_window() {
	if(openwindow >= 0) {
		var win = openwindow;
		openwindow = -1;

		get_id("windowoverlay").style.pointerEvents = "none";
		get_id("windowoverlay").style.opacity = 0;
		get_id("windowcontainer").style.transform = "";

		close_window_timeout = setTimeout(() => {
			get_win(win).style.display = "none";
			close_window_timeout = null;
		}, 300);
	}
}

/*
 * confirm_window()
 *
 * Uloží všechny hodnoty z okna a zavře ho.
 * 
 * To udělá tak, že virtuálně zmáčkne první tlačítko v daném okně.
 */

function confirm_window() {
	if(openwindow >= 0) {
		get_win_el_class(openwindow, "windowbutton").click();
	}
}

/*
 * get_win(win_id)
 * get_win_el_id(win_id, el_id)
 * get_win_el_class(win_id, el_class, index)
 * get_win_el_tag(win_id, el_tag, index)
 *
 * Vrátí HTML blok okna či samotný jeho element (podle id, class či názvu tagu).
 * Obecně užitečné zkratky pro manipulaci s okny.
 * 
 * Pokud funkce přijímá parametr index a není explicitně udán, jeho výchozí hodnota je 0.
 */

function get_win(win_id) {
	return get_id("window" + win_id);
}

function get_win_el_id(win_id, el_id) {
	return get_win(win_id).getElementById(el_id);
}

function get_win_el_class(win_id, el_class, index = 0) {
	return get_win(win_id).getElementsByClassName(el_class)[index];
}

function get_win_el_tag(win_id, el_tag, index = 0) {
	return get_win(win_id).getElementsByTagName(el_tag)[index];
}

/*
 * ui_connect()
 *
 * Dělá takové ty pěkné animace při připojení zařízení.
 */

var launched = 0;

function ui_connect(actually_connect) {
	launched = 1;

	if(actually_connect) {
		setTimeout(() => {
			if(!verified) {
				get_id("receivedsum").innerHTML = "nereaguje";
				popup_window(WINDOWID_INVALID_CHECKSUM);
			}
		}, 300);
	}

	if(get_id("introerrmsg")) {
		get_id("initialheader").style.flex = "0";
		get_id("initialheader").innerHTML = "";

		header.style.height = "3em";
		header.style.padding = ".5em 1em";
		
		get_id("navcontents").style.display = "flex";

		get_id("introerrmsg").remove();
	
		get_id("headercontents").style.opacity = 0;
	
		nav.style.height = "2.5em";
		footer.style.height = "6em";

		setTimeout(() => {
			get_id("connectbuttonguest").remove();

			get_id("introimg").style.height = "3em";
			get_id("connectbutton").style.margin = "0";
			get_id("connectbutton").style.width = "calc(907 / 200 * 3em - 1em)";
			if(actually_connect) get_id("connectbutton").innerHTML = "Odpojit se od zařízení";

			header.style.height = "auto";
			nav.style.height = "auto";
			main.style.opacity = 1;
			footer.style.height = "auto";

			get_id("statusmsg").innerHTML = "Vítejte v aplikaci Coachium!"

			get_id("headercontents").style.flexDirection = "row";

			get_id("navcontents").style.opacity =
			get_id("headercontents").style.opacity =
			get_id("footercontents").style.opacity = 1;

			// Funkce, která automaticky zvětší/zmenší canvas podle potřeby

			window.addEventListener('resize', canvas_reset, false);

			main_window_reset();
		}, 350);
	} else {
		get_id("statusmsg").innerHTML = "Vítejte v aplikaci Coachium!"
		get_id("connectbutton").innerHTML = "Odpojit se od zařízení";
		nav.style.backgroundColor =
		header.style.backgroundColor =
		footer.style.backgroundColor = "";
	}

	get_id("port1").style.backgroundColor =
	get_id("port2").style.backgroundColor = "";

	get_id("port1status").innerHTML = 
	get_id("port2status").innerHTML = "Čidlo nepřipojeno";

	get_id("port1value").innerHTML = 
	get_id("port2value").innerHTML = "–";

	// Ukázat takovej ten popup dialog, jestli opravdu chceš opustit stránku
/*
	window.onbeforeunload = function() {
		return true;
	};*/
}

/*
 * ui_disconnect()
 *
 * Zavře otevřené okno a změní nápis v headeru a na čudlíku.
 */

function ui_disconnect() {
	close_window();

	get_id("statusmsg").innerHTML = "Zařízení odpojeno.";
	get_id("connectbutton").innerHTML = "Připojit se k zařízení";
}

/*
 * main_window_reset()
 * 
 * Obnoví všechny hodnoty v hlavním okně (tam, kde je buď graf nebo tabulka).
 */

function main_window_reset() {
	if(canvas.style.display != "none")
		canvas_reset();
	else
		table_reset();

	update_button_validity();
}

/*
 * capture_setup_check()
 *
 * Zkontrolovat validitu vstupních parametrů k inicializaci záznamu.
 * 
 * Vrací platnost vybrané konfigurace čidel.
 */

function capture_setup_check() {
	var string = "";

	var oldfreq = get_id("capturesetuphz").value;
	var units = round(10000 / oldfreq);

	var newfreq;

	if(get_id("capturesetupsensors").selectedIndex) {
		if(units)
			newfreq = 10000 / units;
		else
			newfreq = 40000;
	} else {
		if(units < 2) units = 2;

		newfreq = 10000 / units;
	}

	if(round(oldfreq, 2) != round(newfreq, 2)) string += "<p>Nejbližší použitelná frekvence je<br>" + round(newfreq, 2) + " Hz.</p>";

	var samples = round(newfreq * get_id("capturesetupsecs").value);

	if(samples > (get_id("capturesetupsensors").selectedIndex ? 16383 : 8191)) {
		if(get_id("capturesetupsensors").selectedIndex)
			string += "<p>Záznam poběží pouze " + round(16383 / newfreq, 2) + " vteřin."
		else
			string += "<p>Záznam poběží pouze " + round(16383 / newfreq / 2, 2) + " vteřin."
	}

	get_id("capturesetuperr").innerHTML = string;

	var sensors_err = false;

	switch(get_id("capturesetupsensors").selectedIndex) {
		case 0:
			if(!ports[1].connected)
				sensors_err = true;
				
			// break tu chybí naschvál

		case 1:
			if(!ports[0].connected)
				sensors_err = true;

			break;

		case 2:
			if(!ports[1].connected)
				sensors_err = true;

			break;
	}

	get_id("capturesetupsensorserr").innerHTML = sensors_err ? "<p>Vybraná čidla nejsou připojena.</p>" : "";
	
	const startbutton = get_win_el_class(WINDOWID_CAPTURE_SETUP, "windowbutton");

	startbutton.style.backgroundColor = sensors_err ? "rgba(0, 0, 0, .1)" : "";
	startbutton.onclick = sensors_err ? (() => {}) : (() => { close_window(); requestcapture = 1; });

	return sensors_err;
}

/*
 * change_selected_capture(interval)
 * 
 * Vymění monentálně zobrazené měření na obrazovce za jiné.
 */

function change_selected_capture(interval) {
	if(captures.length > 0) {
		selectedcapture += interval;

		if(selectedcapture < 0)
			selectedcapture = 0;
		else if(selectedcapture >= captures.length)
			selectedcapture = captures.length - 1;
	}

	main_window_reset();
}

/*
 * change_capture_view()
 * 
 * Změní pohled na dané měření buď na graf nebo na tabulku, záleží, co je právě aktivní.
 */

function change_capture_view() {
	const c_visible = canvas.style.display != "none";

	if(c_visible) {
		canvas.style.display = "none";
		table.style.display  = "";
		main.style.overflowY = "scroll";

		get_id("viewastablebutton").style.display = "none";
		get_id("viewasgraphbutton").style.display = "";
	} else {
		canvas.style.display = "block";
		table.style.display  = "none";
		main.style.overflowY = "hidden";

		get_id("viewastablebutton").style.display = "";
		get_id("viewasgraphbutton").style.display = "none";
	}

	main_window_reset();
	update_button_validity();
}

/*
 * update_button_validity()
 * 
 * Zkontroluje, zda jsou všechna (ovlivnitelná) tlačítka na horním panelu platná.
 */

function update_button_validity() {
	if(captures.length == 0) {
		get_id("removeeverythingbutton").style.filter = "contrast(0)";
		get_id("renamecapturebutton").style.filter = "contrast(0)";
		get_id("removecapturebutton").style.filter = "contrast(0)";
		get_id("savebutton").style.filter = "contrast(0)";
		get_id("savegdrivebutton").style.filter = "contrast(0)";
		get_id("viewpreviousbutton").style.filter = "contrast(0)";
		get_id("viewnextbutton").style.filter = "contrast(0)";
		get_id("zoominbutton").style.filter = "contrast(0)";
		get_id("zoomoutbutton").style.filter = "contrast(0)";
	} else {
		get_id("removeeverythingbutton").style.filter = "";
		get_id("renamecapturebutton").style.filter = "";
		get_id("removecapturebutton").style.filter = "";
		get_id("savebutton").style.filter = "";
		get_id("savegdrivebutton").style.filter = "";

		if(canvas.style.display != "none") {
			get_id("zoominbutton").style.filter = "";
			get_id("zoomoutbutton").style.filter = "";
		} else {
			get_id("zoominbutton").style.filter = "contrast(0)";
			get_id("zoomoutbutton").style.filter = "contrast(0)";
		}

		if(selectedcapture == 0)
			get_id("viewpreviousbutton").style.filter = "contrast(0)";
		else
			get_id("viewpreviousbutton").style.filter = "";

		if(selectedcapture >= (captures.length - 1))
			get_id("viewnextbutton").style.filter = "contrast(0)";
		else
			get_id("viewnextbutton").style.filter = "";
	}
}

/*
 * Už se načetla stránka, hurá!
 */

window.onload = () => {
	// Ještě ale nemůžeme zobrazit stránku uživateli, pravděpodobně se ještě nenačetl obrázek na pozadí...
	// Proto ho můžeme načíst znovu jen pro nás, abychom viděli, jak dlouho to potrvá...

	var img = new Image();
	img.onload = () => {
		document.getElementsByTagName("html")[0].style.opacity = 1;
	}

	img.src = "misc/wallpaper.webp";
	if (img.complete) img.onload();

	// Inicializovat konstanty pro zrychlení běhu + zjednodušení kódu

	header = document.getElementsByTagName("header")[0];
	nav = document.getElementsByTagName("nav")[0];
	main = document.getElementsByTagName("main")[0];
	footer = document.getElementsByTagName("footer")[0];
	canvas = document.getElementsByTagName("canvas")[0];
	ctx = canvas.getContext("2d");
	table = get_id("table");
	
	// Inicializovat čudlíky

	get_id("connectbutton").onclick = () => {
		if(!connected) {
			webhid_connect();
		} else {
			webhid_disconnect();
		}
	};

	get_id("connectbuttonguest").onclick = () => { ui_connect(false); }
}

/*
 * Callback, když uživatel stiskne klávesu. Řídí klávesové zkratky.
 */

document.addEventListener('keydown', (event) => {
	if(!launched) return;

	console.log(event.key);
	
	if(openwindow >= 0) {
		switch(event.key) {
			case "Escape":
				close_window();
				break;
	
			case "Enter":
				confirm_window();
				break;
		}
	} else {
		if(event.ctrlKey) switch(event.key) {
			case "o":
				event.preventDefault();
				load_file_local(false);
				break;

			case "s":
				event.preventDefault();
				save_file_local();
				break;

			case "S":
				event.preventDefault();
				popup_gdrive_window();
				break;

		} else switch(event.key) {
			case " ":
				event.preventDefault();
				
				if(!capturerunning)
					popup_window(WINDOWID_CAPTURE_SETUP);
				else
					requestcapture = 1;

				break;

			case "r":
				rename_capture(false);
				break;

			case "t":
				change_capture_view();
				break;

			case "ArrowLeft":
			case "PageUp":
				event.preventDefault();
				change_selected_capture(-1);
				break;

			case "ArrowRight":
			case "PageDown":
				event.preventDefault();
				change_selected_capture(1);
				break;

			case "Delete":
				event.preventDefault();
				remove_capture(false);
				break;
		}
	}
});
