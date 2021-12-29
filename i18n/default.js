var htmllang = {
	// Homepage text

	"HOMEPAGE_VERSION": "Version 0.1 pre-alpha",
	"HOMEPAGE_ABOUT_LINK": "What is Coachium?",
	"HOMEPAGE_PRIVACY_POLICY_LINK": "Privacy policy",

	// Button descriptions

	"BUTTON_CONNECT": "Connect to interface",
	"BUTTON_START_GUEST": "Start in guest mode",
	"BUTTON_CLOSE": "Close",
	"BUTTON_START": "Start",
	"BUTTON_TRYAGAIN": "Try again",
	"BUTTON_SAVE": "Save",
	"BUTTON_RESTART": "Restart",
	"BUTTON_GOAHEAD": "Go ahead",
	"BUTTON_RENAME": "Rename",

	// Button titles on the top bar

	"TITLE_NEW_FILE": "Remove all captures and create a new workbook",
	"TITLE_OPEN_FILE": "Open a workbook file from your computer [Ctrl+O]",
	"TITLE_SAVE_FILE": "Save this workbook to your computer [Ctrl+S]",
	"TITLE_SAVE_GDRIVE": "Save this workbook to your Google Drive [Ctrl+Shift+S]",
	"TITLE_NEW_CAPTURE": "Add a new capture to your workbook [Space]",
	"TITLE_STOP_CAPTURE": "Stop the current capture [Space]",
	"TITLE_RENAME_CAPTURE": "Rename this capture [R]",
	"TITLE_REMOVE_CAPTURE": "Delete this capture [Delete]",
	"TITLE_PREVIOUS_CAPTURE": "Show the previous capture [← or PageUp]",
	"TITLE_SHOW_AS_TABLE": "Display capture data as a table [T]",
	"TITLE_SHOW_AS_CHART": "Display capture data as a chart [T]",
	"TITLE_NEXT_CAPTURE": "Show the next capture [→ or PageDown]",
	"TITLE_CHART_ZOOM_IN": "Zoom into the chart [+]",
	"TITLE_CHART_ZOOM_RESET": "Reset the zoom on the chart [=]",
	"TITLE_ABOUT": "About Coachium...",

	// Window contents

	"WINDOW0_TITLE": "Coachium v0.1 pre-alpha",
	"WINDOW0_PAR0": "Made by Michal Procházka, 2021.",
	"WINDOW0_PAR1":
		"Based on my work of reverse-engineering the communication<br>" +
		"protocol between the CMA €Lab interface and CMA Coach.",
	"WINDOW0_PAR2": "See more here:",

	"WINDOW1_TITLE": "Internal error",
	"WINDOW1_PAR0": "An unexpected error has occured.",
	"WINDOW1_PAR1": "We apologize for the inconvenience.",

	"WINDOW2_TITLE": "Capture setup",
	"WINDOW2_PAR0": "Capture name",
	"WINDOW2_PAR1": "Capture parameters",
	"WINDOW2_HZ": "Hz",
	"WINDOW2_SECONDS": "seconds",
	"WINDOW2_PAR2": "Capture from...",
	"WINDOW2_SETUP_BOTH": "Both sensors",
	"WINDOW2_SETUP_FIRST": "Only the first sensor",
	"WINDOW2_SETUP_SECOND": "Only the second sensor",

	"WINDOW3_TITLE": "Workbook saved!",
	"WINDOW3_LINK": "Here is the link to your saved workbook on your Google Drive.",

	"WINDOW4_TITLE": "Something went wrong.",
	"WINDOW4_PAR0": "Error saving the workbook to Google Drive:",
	
	"WINDOW5_TITLE": "Something went wrong.",
	"WINDOW5_PAR0": "Error connecting to Google services:",
	"WINDOW5_PAR1":
		"The ability to save to Google Drive will<br>" +
		"thus be highly unlikely to function.",
	"WINDOW5_PAR2": "We apologize for the inconvenience.",

	"WINDOW6_TITLE": "How will be the workbook called?",

	"WINDOW7_TITLE": "WebHID error",
	"WINDOW7_PAR0":
		"It seems that your web browser does not support<br>" +
		"WebHID, so it is impossible to connect to your device.",
	"WINDOW7_PAR1":
		"If you are using a Chromium-based web browser<br>" +
		"(Google Chrome, Brave, Microsoft Edge, Opera...),<br>" +
		"we suggest updating your browser. WebHID is<br>" + 
		"a relatively new standard, so it might not be<br>" +
		"implemented in your older version.",
	"WINDOW7_PAR2":
		"Mozilla Firefox (and its derivatives) and Apple Safari<br>" +
		"<b>do not</b> support WebHID.",

	"WINDOW8_TITLE": "Something went wrong.",
	"WINDOW8_PAR0": "Error verifying the device.",
	"WINDOW8_PAR1":
		"The device's packet checksum (<span id=\"receivedsum\"></span>)<br>" +
		"does not match the expected value (3754).",
	"WINDOW8_PAR2":
		"We recommend restarting Coachium<br>" +
		"and trying again.",
	"WINDOW8_PAR3":
		"If that fails, try unplugging all of<br>" +
		"the connected sensors, then unplug the<br>" +
		"device, plug it back in again and try again.",
	"WINDOW8_PAR4":
		"In the worst case, replace the device.",

	"WINDOW9_TITLE": "Error loading the file",
	"WINDOW9_PAR0":
		"It seems that the selected workbook file<br>" +
		"is corrupted or invalid.",
	"WINDOW9_PAR1": "We apologize for the inconvenience.",

	"WINDOW10_TITLE": "Are you sure?",
	"WINDOW10_PAR0": "<b>You are trying to open another workbook.</b>",
	"WINDOW10_PAR1":
		"If you have unsaved captures, by opening another<br>" +
		"workbook, all of your unsaved work will be lost!",
	"WINDOW10_PAR2": "Are you sure that you want to proceed?",

	"WINDOW11_TITLE": "Are you sure?",
	"WINDOW11_PAR0": "<b>You are remove this capture from your workbook.</b>",
	"WINDOW11_PAR1":
		"Make sure that you are removing the correct one,<br>" +
		"this operation is irreversible!",
	"WINDOW11_PAR2": "Are you sure that you want to proceed?",

	"WINDOW12_TITLE": "Are you sure?",
	"WINDOW12_PAR0": "<b>You are clear your entire workbook.</b>",
	"WINDOW12_PAR1":
		"Make sure that you have all important work saved,<br>" +
		"this operation is irreversible!",
	"WINDOW12_PAR2": "Are you sure that you want to proceed?",

	"WINDOW13_TITLE": "How will this capture be called?"
};

var jslang = {
	// mainwindow.js
	
	"MAINWIN_NO_CAPTURES_1": "No captures have been created yet.",
	"MAINWIN_NO_CAPTURES_2": "You can either create a new capture, or load another workbook file.",

	"CAPTURE_FMT": "Capture {0} from {1}: {2}",

	"INTERVAL": "Interval (s)",
	"SENSOR_1": "Sensor 1 ({0})",
	"SENSOR_2": "Sensor 2 ({0})",

	// gdrive_interface.js

	"DEFAULT_FILENAME": "{0} – Laboratory work – {1}",

	// file.js

	"DEFAULT_USERNAME": "John Doe",
	"STATUS_FILE_LOADED": "File loaded.",
	"STATUS_FILE_SAVED": "File is ready to save.",
	"STATUS_CAPTURE_REMOVED": "Capture {0} removed.",
	"STATUS_ALL_REMOVED": "All captures removed.",

	"UNTITLED_CAPTURE": "Untitled capture",

	// elab.js

	"SENSOR_LOADING": "Loading intelligent sensor data...",
	"SENSOR_DISCONNECTED": "Sensor not connected",
	"SENSOR_INTELLIGENT": "Intelligent sensor",

	"STATUS_CAPTURE_RUNNING": "Capture in progress... ({0} samples, {1} seconds)",
	"STATUS_CAPTURE_FINISHED": "Capture finished.",

	"STATUS_NO_DEVICE_SELECTED": "No device was selected!",
	"STATUS_DEVICE_DISCONNECTED": "{0} was forcefully disconnected!",

	// ui.js

	"CHECKSUM_NOT_RESPONDING": "not responding",
	"BUTTON_DISCONNECT": "Disconnect from interface",
	"STATUS_WELCOME": "Welcome to Coachium!",
	"STATUS_DISCONNECTED": "Device disconnected.",

	"SETUP_CLOSEST_USABLE_FREQ": "The closest usable frequency<br>is {0} Hz.",
	"SETUP_REDUCED_RUNTIME": "The capture will run for only<br>{0} seconds.",
	"SETUP_SENSOR_ERR": "These sensors are not connected.",
};

const languages = [
	{ "id": "en", "name": "🇬🇧 English", "title": "Choose a language" },
	{ "id": "cs", "name": "🇨🇿 Čeština", "title": "Vyberte jazyk" },
	{ "id": "fr", "name": "🇫🇷 Français", "title": "Choisissez votre langage" },
];

var language_win_anim_cycle = 0;

function language_win_anim() {
	get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "h1").style.opacity = 1;
	get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "h1").innerHTML = languages[language_win_anim_cycle].title;
	
	setTimeout(() => {
		get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "h1").style.opacity = 0;
	}, 2900);

	language_win_anim_cycle++;
	if(language_win_anim_cycle >= languages.length) language_win_anim_cycle = 0;

	setTimeout(language_win_anim, 4000);
}

function start_language_win() {
	language_win_anim_cycle = 0;
	language_win_anim();

	popup_window(WINDOWID_LANGUAGE_SELECTOR);
}

for(var language of languages) {
	var option = document.createElement("option");

	option.innerHTML = language.name;

	((id) => {
		option.onclick = () => {
			window.location.href = ".?lang=" + id;
		};
	})(language.id);

	get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "select").appendChild(option);
}

const params = new URLSearchParams(window.location.search);

var lang = params.get("lang");

if(!lang) lang = "en";

var script = document.createElement("script");

script.src = "i18n/" + lang + ".js";
script.onload = () => {
	for(var key of Object.keys(alt_htmllang))
		htmllang[key] = alt_htmllang[key];

	for(var key of Object.keys(alt_jslang))
		jslang[key] = alt_jslang[key];

	for(var key of Object.keys(htmllang)) {
		for(var el of document.getElementsByClassName("L18N_" + key)) {
			if(key.startsWith("TITLE_"))
				el.title = htmllang[key];
			else
				el.innerHTML = htmllang[key];
		}
	}
};

document.body.appendChild(script);
