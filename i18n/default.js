/*
 * Coachium - i18n/default.js
 * - applies the translation on startup & contains the default English strings
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

const DEFAULT_LANGUAGE = "cs";

var htmllang = {
	// Homepage text

	"HOMEPAGE_ABOUT_LINK": "What is Coachium?",
	"HOMEPAGE_PRIVACY_POLICY_LINK": "Privacy policy",
	"HOMEPAGE_COMMIT_CHECKING": "Checking version...",
	"TITLE_HOMEPAGE_ABOUT": "About Coachium...",

	// Button descriptions

	"BUTTON_CONNECT": "Connect to device",
	"BUTTON_START_GUEST": "Start in guest mode",
	"BUTTON_CLOSE": "Close",
	"BUTTON_START": "Start",
	"BUTTON_START_CONDITIONAL": "Conditional capture...",
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
	"TITLE_FIT_FUNCTION": "Fit function to captured data [F]",
	"TITLE_REMOVE_CAPTURE": "Delete this capture [Delete]",
	"TITLE_PREVIOUS_CAPTURE": "Show the previous capture [← or PageUp]",
	"TITLE_SHOW_AS_TABLE": "Display capture data as a table [T]",
	"TITLE_SHOW_AS_CHART": "Display capture data as a chart [T]",
	"TITLE_NEXT_CAPTURE": "Show the next capture [→ or PageDown]",
	"TITLE_CHART_ZOOM_IN": "Zoom into the chart [+]",
	"TITLE_CHART_ZOOM_DATA": "Zoom to data [=]",
	"TITLE_CHART_ZOOM_RESET": "Reset the zoom on the chart [-]",
	"TITLE_CAPTURE_MGMT": "Manage captures [M]",
	"TITLE_CAPTURE_INFO": "Display this capture's details [I]",

	// Port popup window buttons

	"PORT_CONNECT": "Connect a sensor",
	"PORT_DISCONNECT": "Disconnect this sensor",
	"PORT_ZERO_OUT": "Zero out the value",
	"PORT_RESET": "Reset the original zero value",

	// Window contents

	"WINDOW0_TITLE": "Coachium alpha",
	"WINDOW0_PAR0": "Copyright (C) Michal Procházka, 2021–2022.",
	"WINDOW0_PAR1":
		"Based on my work of reverse-engineering the communication<br>" +
		"protocol between the CMA €Lab interface and CMA Coach.",
	"WINDOW0_PAR2": "See more here (in Czech):",
	"WINDOW0_PAR3":
		"This program is free software, distributed under<br>" +
		"the <a href=\"https://www.gnu.org/licenses/gpl-3.0.en.html\" target=\"_blank\">GNU General Public License version 3</a>.",
	"WINDOW0_PAR4":
		"Most of the used icons come from the <a href=\"https://fontawesome.com/\">FontAwesome</a> project.<br>" +
		"Some parts of this application use the <a href=\"https://github.com/bevacqua/dragula\">Dragula</a> library.",

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

	"WINDOW7_TITLE": "<span id='w7titleapi'></span> error",
	"WINDOW7_PAR0":
		"It seems that your web browser does not support<br>" +
		"<span id='w7parapi'></span>, so it is impossible to connect to your device.",
	"WINDOW7_PAR1":
		"Please try updating your browser, or trying<br>" +
		"a different one (Google Chrome has very good<br>" +
		"support of these new modern features).<br>",

	"WINDOW8_TITLE": "Something went wrong.",
	"WINDOW8_PAR0": "Error verifying the device.",
	"WINDOW8_PAR1":
		"The device's checksum does not match the expected value.",
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

	"WINDOW13_TITLE": "Capture management",

	"WINDOW15_TITLE": "Language error",
	"WINDOW15_PAR0":
		"Error loading the requested language.<br>" +
		"English will be now used as a fallback.",
	"WINDOW15_PAR1": "We apologize for the inconvenience.",

	"WINDOW17_TITLE": "Capture properties",

	"WINDOW18_TITLE": "Device selection",

	"WINDOW19_TITLE": "Fit function",
	"WINDOW19_FUN_LINEAR": "Linear (y = ax + b)",
	"WINDOW19_FUN_QUADRATIC": "Quadratic (y = ax² + bx + c)",
	"WINDOW19_CHECKBOX": "Show this function on the graph",

	"WINDOW20_TITLE": "Device open error",
	"WINDOW20_PAR0":
		"An error has occured when trying to access<br>" +
		"the selected device. Please make sure you<br>" +
		"have the permission to access the device.",

	"WINDOW21_TITLE": "Watchdog barked",
	"WINDOW21_PAR0": "An error has occured while communicating with the interface.",
	"WINDOW21_PAR1": "Do you want to restart the interface?",

	// "About" window text

	"ABOUT_TITLE": "What is Coachium?",
	"ABOUT_BODY":
		"<p>Coachium serves as an alternative to the Coach software developed by CMA Amsterdam, which is used to communicate with interfaces and sensors made by the same company (currently, Coachium only supports the €Lab interface and intelligent sensors), which aid you in measuring different physical quantities and capturing measured data into a graph.</p>" +
		"<p>Coachium is attempting to be as easy-to-use as possible (compared to the relatively complex CMA Coach), making it available for everyone. CMA Coach is in fact a highly extensive piece of software, which also means that even the simplest operations still require the user to have some prerequisite knowledge about using the software (eg. if you want to start a capture into a graph, first, you have to create a graph panel and configure it, then configure the capture and finally start the capture), without which you will not simply get by.</p>" +
		"<p>Thanks to the simple user interface of Coachium, everything makes sense, all operations which you might wish to perform are easily available in the panel of icons, which are all comprehensively labelled, nothing is ever hidden here.</p>" +
		"<p>That is why Coachium has to slightly differ to the way the old CMA Coach was used. Coachium operates on a \"workbook\" principle, meaning that if the user opens Coachium, they can create as many captures and graphs as they wish and then save it all as a single \"workbook\" file (ie. if you are performing current–voltage characteristics of several components, you don't have to save each component as an individual file). Of course, there is still the option (and it is highly recommended) to name each capture, so that the teacher could make sense of your handed in workbook.</p>" +
		"<p>Moreover, since Coachium is being developed in the 21st century, it has some modern \"tricks\" up its sleeve. Mainly, you are able to save your workbook of captures directly to your Google Drive with a single click, from where you can instantly hand it in to your teacher in Google Classroom.</p>" +
		"<p>We strongly hope that we have introduced to you what Coachium actually is, and we also hope that you will enjoy working with it!</p>",

	// "Privacy policy" window text

	"PP_TITLE": "Privacy policy",
	"PP_BODY":
		"<p>When the \"Save the capture workbook to Google Drive\" on the top panel is pressed, this application will contact Google Services in order to save the capture workbook file to your Google Account's Google Drive.</p>" +
		"<p>This is the only reason why this app might need access to your Google Account. We do not read <i>any</i> data from your account (other than your public full name for naming the saved file), we do not store any information about you on our server, we do not log any activity, we are only saving your capture file to your account, but only if you press said button.</p>" +
		"<p>If you do not wish to allow us to access your Google Account, you always have the option to download the capture workbook file directly to your computer and then manually upload it to Google Drive. We only provide the feature for your convenience.</p>" +
		"<b>" +
			"<p>We do not access any of your Google user data.</p>" +
			"<p>We do not store or share with anyone any of your Google user data.</p>" +
		"</b>",
};

var jslang = {
	// mainwindow.js

	"MAINWIN_NO_CAPTURES_1": "No captures have been created yet.",
	"MAINWIN_NO_CAPTURES_2": "You can either create a new capture, or load another workbook file.",

	"CAPTURE_FMT": "Capture {0} out of {1}: {2}",

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

	"STATUS_CAPTURE_RUNNING": "Capture in progress... ({0} samples, {1} seconds)",
	"STATUS_CAPTURE_FINISHED": "Capture finished.",

	// ui.js

	"HOMEPAGE_COMMIT_OK": "👍 Latest version ({0})",
	"HOMEPAGE_COMMIT_OLD": "👎 Outdated version, please update! ({0} installed, {1} available)",
	"HOMEPAGE_COMMIT_ERR": "😕 Error verifying the latest version",

	"BUTTON_DISCONNECT": "Disconnect from device",
	"STATUS_WELCOME": "Welcome to Coachium!",
	"STATUS_DISCONNECTED": "Device disconnected.",
	"STATUS_NO_DEVICE_SELECTED": "No device was selected!",
	"STATUS_FORCE_DISCONNECTED": "Device was forcefully disconnected!",

	"SENSOR_NONE_PRESENT": "There are no capture ports available. Please connect a compatible device.",
	"SENSOR_LOADING": "Loading intelligent sensor data...",
	"SENSOR_DISCONNECTED": "Sensor not connected",
	"SENSOR_INTELLIGENT": "Intelligent sensor",

	"SETUP_CLOSEST_USABLE_FREQ": "The closest usable frequency<br>is {0} Hz.",
	"SETUP_REDUCED_RUNTIME": "The capture will run for only<br>{0} seconds.",
	"SETUP_SENSOR_ERR": "These sensors are not connected.",

	"STATUS_ZOOM_IN_REQUEST": "Select the zoom region.",
	"STATUS_ZOOM_IN_CONFIRM": "The selected region was zoomed in.",
	"STATUS_ZOOM_IN_CANCEL": "Zoom region select canceled.",
	"STATUS_ZOOM_DATA": "Zoomed into the data region.",
	"STATUS_ZOOM_DATA_ERROR": "Error zooming into the data region.",
	"STATUS_ZOOM_RESET": "The zoom on the chart has been reset.",

	"CONNECT_BUTTON_TEXT": "Connect to {0} {1}",

	"INFO_WINDOW_CONTENTS":
		"<p><b>{0}</b> total samples captured<br>" +
		"({1} captured by each sensor)</p>" +
		"<p>Capture frequency: <b>{2} Hz</b></p>" +
		"<p>Set capture duration: <b>{3} second(s)</b></p>" +
		"<p>Actual capture duration: <b>{4} second(s)</b></p>",

	"INFO_WINDOW_SENSOR":
		"<p><b>Sensor {0} – {1}</b></p>" +
		"<p>Range: <b>{2} – {3} {4}</b></p>",
};

const languages = [
	{ "id": "en", "name": "🇬🇧 English", "title": "Select a language" },
	{ "id": "cs", "name": "🇨🇿 Čeština (Czech)", "title": "Vyberte jazyk" },
	{ "id": "de", "name": "🇩🇪 Deutsch (German)", "title": "Sprache auswählen" },
	{ "id": "fr", "name": "🇫🇷 Français (French)", "title": "Choisissez une langue" },
	{ "id": "pl", "name": "🇵🇱 Polski (Polish)", "title": "Wybierz język" },
	{ "id": "sk", "name": "🇸🇰 Slovenčina (Slovak)", "title": "Vyberte jazyk" },
];

var language_win_anim_cycle = 0;
var language_win_anim_timeout1 = null, language_win_anim_timeout2 = null;

function language_win_anim() {
	if(get_win(WINDOWID_LANGUAGE_SELECTOR).style.display == "none") return;
	get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "h1").style.opacity = 1;
	get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "h1").innerHTML = languages[language_win_anim_cycle].title;
	
	language_win_anim_timeout1 = setTimeout(() => {
		if(get_win(WINDOWID_LANGUAGE_SELECTOR).style.display == "none") return;
		get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "h1").style.opacity = 0;
	}, 2900);

	language_win_anim_cycle++;
	if(language_win_anim_cycle >= languages.length) language_win_anim_cycle = 0;

	language_win_anim_timeout2 = setTimeout(language_win_anim, 4000);
}

function start_language_win() {
	if(language_win_anim_timeout1) clearTimeout(language_win_anim_timeout1);
	if(language_win_anim_timeout2) clearTimeout(language_win_anim_timeout2);

	popup_window(WINDOWID_LANGUAGE_SELECTOR);

	language_win_anim_cycle = 0;
	language_win_anim();
}

for(var language of languages) {
	var option = document.createElement("option");

	option.innerHTML = language.name;

	((id) => {
		option.onclick = () => {
			document.cookie = "lang=" + id;
			location.reload();
		};
	})(language.id);

	get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "select").appendChild(option);
}

const params = new URLSearchParams(window.location.search);

var lang = read_cookie("lang");

if(lang == "") {
	lang = DEFAULT_LANGUAGE;
	document.cookie = "lang=" + lang;
}

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

script.onerror = () => {
	var script_fallback = document.createElement("script");
	script_fallback.src = "i18n/en.js";
	script_fallback.onload = () => {
		script.onload();
		popup_window(WINDOWID_LANGUAGE_ERROR);
		document.cookie = "lang=en";
	}

	document.body.appendChild(script_fallback);
}

document.body.appendChild(script);
