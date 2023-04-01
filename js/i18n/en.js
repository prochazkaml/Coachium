/*
 * Coachium - js/i18n/en.js
 * - English internationalization data
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

const en = {
	html: {
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
		"TITLE_REMOVE_CAPTURE": "Delete this capture [Delete]",
		"TITLE_RENAME_CAPTURE": "Rename this capture [R]",
		"TITLE_PREVIOUS_CAPTURE": "Show the previous capture [← or PageUp]",
		"TITLE_SHOW_AS_TABLE": "Display capture data as a table [T]",
		"TITLE_SHOW_AS_CHART": "Display capture data as a chart [T]",
		"TITLE_NEXT_CAPTURE": "Show the next capture [→ or PageDown]",
		"TITLE_CHART_ZOOM_IN": "Zoom into the chart [+]",
		"TITLE_CHART_ZOOM_DATA": "Zoom to data [=]",
		"TITLE_CHART_ZOOM_RESET": "Reset the zoom on the chart [-]",
		"TITLE_CAPTURE_MGMT": "Manage captures [M]",
		"TITLE_CAPTURE_INFO": "Display this capture's details [I]",
		"TITLE_ADVANCED_FEATURES": "Advanced features",
		"TITLE_TOOLBOX": "Other tools",

		"TOOLBOX_CALCULATOR": "Calculator",
		"TOOLBOX_CONVERTER": "Unit converter",
		"TOOLBOX_HELP": "Help",
		"TOOLBOX_ABOUT": "About Coachium...",

		// Popup window buttons

		"PORT_CONNECT": "Connect a sensor",
		"PORT_DISCONNECT": "Disconnect this sensor",
		"PORT_ZERO_OUT": "Zero out the value",
		"PORT_RESET": "Reset the original zero value",

		"ADVANCED_FIT_FUNCTION": "Fit function [F]",
		"ADVANCED_NOTE_MANAGER": "Note manager [N]",
		"ADVANCED_EXPORT_TABLE": "Sheet export (.csv)",
		"ADVANCED_EXPORT_IMAGE": "Chart export (.svg)",

		// Window contents

		"WINDOW0_TITLE": "Coachium beta",
		"WINDOW0_PAR0": "Copyright © Michal Procházka, 2021–2023.",
		"WINDOW0_PAR1":
			"Based on my work of reverse-engineering the communication<br>" +
			"protocol between the CMA €Lab interface and CMA Coach.",
		"WINDOW0_PAR2": "See more here (in Czech):",
		"WINDOW0_PAR3":
			"This program is free software, distributed under<br>" +
			"the <a href=\"https://www.gnu.org/licenses/gpl-3.0.en.html\" target=\"_blank\">GNU General Public License version 3</a>.",
		"WINDOW0_PAR4": "Most of the used icons come from the <a href=\"https://fontawesome.com/\">FontAwesome</a> project.<br>",
		"WINDOW0_PAR5":
			"This application uses the following open source software:",
		"WINDOW0_PAR_LIST":
			"<li><a href=\"https://github.com/bevacqua/dragula\">Dragula - Drag and drop so simple it hurts</a></li>" +
			"<li><a href=\"https://github.com/pieroxy/lz-string\">lz-string - LZ-based compression algorithm for JavaScript</a></li>" +
			"<li><a href=\"https://github.com/gliffy/canvas2svg\">canvas2svg - Translates HTML5 Canvas draw commands to SVG</a></li>" +
			"<li><a href=\"https://github.com/aviaryan/BigEval.js\">BigEval.js - Fully featured mathematical expression solving library</a></li>" +
			"<li><a href=\"https://github.com/Tom-Alexander/regression-js\">regression-js - Curve Fitting in JavaScript</a></li>",
	
		"WINDOW1_TITLE": "Internal error",
		"WINDOW1_PAR0": "An unexpected error has occured.",
		"WINDOW1_PAR1": "We apologize for the inconvenience.",

		"WINDOW2_TITLE": "Capture setup",
		"WINDOW2_CAPTURE_NAME": "Name:",
		"WINDOW2_AVAILABLE_SENSORS": "Available sensors",
		"WINDOW2_MODE_STD": "Standard mode",
		"WINDOW2_MODE_XY": "X-Y mode",
		"WINDOW2_MODE_STD_DESC":
			"In standard mode, you may select any amount of sensors to capture simultaneously " +
			"(within the restrictions of the hardware). They will be displayed on the Y axis " +
			"and will be compared to time. You can later hide some sensors, or generate an X-Y graph " +
			"based on the data of any 2 captured sensors.",
		"WINDOW2_MODE_XY_DESC":
			"In X-Y mode, you can select precisely 2 sensors, one for each axis (X, Y). " +
			"Useful for comparing different quantities, where there is no need to display the time " +
			"(i.e. current-voltage characteristics).",
		"WINDOW2_X": "X",
		"WINDOW2_Y": "Y",
		"WINDOW2_PARAMS": "Capture parameters",
		"WINDOW2_FREQ": "Frequency:",
		"WINDOW2_FREQ_UNIT": "Hz",
		"WINDOW2_LENGTH": "Duration:",
		"WINDOW2_PERIOD": "Period:",
		"WINDOW2_SAMPLES": "samples",

		"CSSATTR_WINDOW2_STD_DROPZONE": "Please drag any sensors here from the list on the left.",
		"CSSATTR_WINDOW2_XY_DROPZONE": "Please drag any sensor here from the list on the left.",
		"CSSATTR_WINDOW2_TRIG_DROPZONE": "For triggering, drag any sensor here from the list on the left.",

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
			"We recommend restarting Coachium<br>" +
			"and trying again.",
		"WINDOW8_PAR2":
			"If that fails, try unplugging all of<br>" +
			"the connected sensors, then unplug the<br>" +
			"device, plug it back in again and try again.",
		"WINDOW8_PAR3":
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
		"WINDOW19_FUN_LINEAR": "Linear: y = ax + b",
		"WINDOW19_FUN_QUADRATIC": "Quadratic: y = ax² + bx + c",
		"WINDOW19_FUN_CUBIC": "Cubic: y = ax³ + bx² + cx + d",
		"WINDOW19_FUN_EXPONENTIAL": "Exponential: y = a * e^(bx)",
		"WINDOW19_FUN_LOGARITHMIC": "Logarithmic: y = a + b * ln(x)",
		"WINDOW19_FUN_POWER": "Power: y = ax^b",
		"WINDOW19_FUN_SINE": "Trigonometric: y = a * sin(bx + c) + d",
		"WINDOW19_CHECKBOX": "Show this function on the graph",

		"WINDOW20_TITLE": "Device open error",
		"WINDOW20_PAR0":
			"An error has occured when trying to access<br>" +
			"the selected device. Please make sure you<br>" +
			"have the permission to access the device.",

		"WINDOW21_TITLE": "Watchdog barked",
		"WINDOW21_PAR0": "An error has occured while communicating with the interface.",
		"WINDOW21_PAR1": "Do you want to restart the interface?",

		"WINDOW22_TITLE": "Capture start error",
		"WINDOW22_PAR0":
			"Please try unplugging and replugging all used<br>" +
			"sensors and start the capture again.",

		"WINDOW23_TITLE": "Note manager",
		"WINDOW23_BUTTON_ADD": "Create new note",
		"WINDOW23_BUTTON_EDIT": "Save changes",
		"WINDOW23_BUTTON_MOVE": "Move note...",
		"WINDOW23_BUTTON_REMOVE": "Remove note",
		"PLACEHOLDER_WINDOW23_TIP": "Start typing here to create your note. Press the button below to place it onto your capture.",

		"WINDOW24_TITLE": "Google Services error",
		"WINDOW24_PAR0": "The Google Drive subsystem failed to load.",
		"WINDOW24_PAR1": "Do you want to reload it?",
		"WINDOW24_PAR2":
			"(By clicking on \"Go ahead\", this window will close<br>" +
			"and Coachium will try to reload the subsystem.<br>" +
			"If it is successful, you will see the Google login<br>" +
			"screen shortly.)",
			
		"WINDOW25_MSG": "Please wait, initializing device...",

		"WINDOW26_TITLE": "How will this capture be called?",

		"WINDOW27_TITLE": "Sheet export",
		"WINDOW27_DECIMAL_SEPARATOR": "Decimal separator",
		"WINDOW27_FUN_CHECKBOX": "Export fitted functions",

		"WINDOW28_TITLE": "Chart export",
		"WINDOW28_RESOLUTION": "Output resolution",
		"WINDOW28_RESOLUTION_SEPARATOR": "x",
		"WINDOW28_FUN_CHECKBOX": "Export fitted functions",
		"WINDOW28_NOTE_CHECKBOX": "Export notes",

		"WINDOW29_DEG": "Degrees",
		"WINDOW29_RAD": "Radians",
		"WINDOW29_GON": "Gradians",

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
			"<p>This is the only reason why this app might need access to your Google Account. We do not read <i>any</i> data from your account, we do not store any information about you on our server, we do not log any activity, we are only saving your capture file to your account, but only if you press said button.</p>" +
			"<p>If you do not wish to allow us to access your Google Account, you always have the option to download the capture workbook file directly to your computer and then manually upload it to Google Drive. We only provide the feature for your convenience.</p>" +
			"<b>" +
				"<p>We do not access any of your Google user data.</p>" +
				"<p>We do not store or share with anyone any of your Google user data.</p>" +
			"</b>",
	},
	js: {
		"MAINWIN_NO_CAPTURES_1": "No captures have been created yet.",
		"MAINWIN_NO_CAPTURES_2": "You can either create a new capture, or load another workbook file.",
		"MAINWIN_HELP_START": "To create a new capture, press this button.",
		"MAINWIN_HELP_DRAG": "Pan around the chart",
		"MAINWIN_HELP_SCROLL": "Zoom in or out",
		"MAINWIN_HELP_ALT_SCROLL": "Zoom in or out along the X axis",
		"MAINWIN_HELP_SHIFT_SCROLL": "Zoom in or out along the Y axis",

		"CAPTURE_FMT": "Capture {0} out of {1}: {2}",

		"TIME_SENSOR": "Time",

		"FIT_FUN_XY_MODE": "X-Y mode: {0} ({1}) / {2} ({3})",
		"FIT_FUN_TIME_MODE": "Standard mode: {0} ({1}) / {2} ({3})",

		"TABLE_INTERVAL": "Interval ({0})",
		"TABLE_SENSOR": "Sensor {0} ({1})",
		"TABLE_FUN_UNKNOWN_TYPE": "Function ({0})",
		"TABLE_FUN_FITTED": "{0} function, fitted ({1})",
		"TABLE_FUN": "{0} function ({1})",
		"TABLE_FUN_LINEAR": "Linear",
		"TABLE_FUN_QUADRATIC": "Quadratic",
		"TABLE_FUN_CUBIC": "Cubic",
		"TABLE_FUN_EXPONENTIAL": "Exponential",
		"TABLE_FUN_LOGARITHMIC": "Logarithmic",
		"TABLE_FUN_POWER": "Power",

		"DEFAULT_FILENAME": "{0} – Laboratory work – {1}",
		"DEFAULT_USERNAME": "John Doe",

		"STATUS_FILE_LOADED": "File loaded.",
		"STATUS_FILE_SAVED": "File is ready to save.",
		"STATUS_CAPTURE_REMOVED": "Capture {0} removed.",
		"STATUS_ALL_REMOVED": "All captures removed.",

		"UNTITLED_CAPTURE": "Untitled capture",

		"HOMEPAGE_COMMIT_OK": "👍 Latest version ({0})",
		"HOMEPAGE_COMMIT_OLD": "👎 Outdated version, please update! ({0} installed, {1} available)",
		"HOMEPAGE_COMMIT_ERR": "😕 Error verifying the latest version",
		"HOMEPAGE_COMMIT_LOCALHOST": "On localhost, version checking is disabled.",

		"BUTTON_DISCONNECT": "Disconnect from device",
		"STATUS_WELCOME": "Welcome to Coachium!",
		"STATUS_DISCONNECTED": "Device disconnected.",
		"STATUS_NO_DEVICE_SELECTED": "No device was selected!",
		"STATUS_FORCE_DISCONNECTED": "Device was forcefully disconnected!",

		"SENSOR_LOADING": "Loading...",
		"SENSOR_DISCONNECTED": "Sensor not connected",
		"SENSOR_INTELLIGENT": "Intelligent sensor, its properties were fetched automatically",
		"SENSOR_PORT_CONNECTED": "This sensor is connected to port {0}",

		"SETUP_CLOSEST_USABLE_FREQ": "The closest usable frequency is {0} Hz.",
		"SETUP_REDUCED_RUNTIME": "The capture will run for only {0} seconds.",
		"SETUP_SENSOR_ERR_STD": "Please assign at least one sensor.",
		"SETUP_SENSOR_ERR_XY": "In X-Y mode, you must assign two sensors, no more, no less.",
		"SETUP_SENSOR_TOO_MUCH": "There are too many sensors assigned. Please remove some.",
		"SETUP_TRIG_TOO_LOW": "The sensor which is used as the trigger condition cannot reach a value below {0}. Please increase the target value.",
		"SETUP_TRIG_TOO_HIGH": "The sensor which is used as the trigger condition cannot reach a value above {0}. Please decrease the target value.",

		"STATUS_WAITING_FOR_TRIGGER": "Conditional capture is ready, waiting for the condition to fulfil...",
		"STATUS_CAPTURE_RUNNING": "Capture in progress... ({0} samples, {1} seconds)",
		"STATUS_CAPTURE_FINISHED": "Capture finished.",

		"NOTE_MANAGER_ADD": "+ Add new note",
		"STATUS_PLACE_NOTE": "Choose a point where the note will be placed.",
		"STATUS_PLACE_NOTE_DONE": "Note placed.",

		"STATUS_ZOOM_IN_REQUEST": "Select the zoom region.",
		"STATUS_ZOOM_IN_CONFIRM": "The selected region was zoomed in.",
		"STATUS_ZOOM_IN_CANCEL": "Zoom region select canceled.",
		"STATUS_ZOOM_DATA": "Zoomed into the data region.",
		"STATUS_ZOOM_DATA_ERROR": "Error zooming into the data region.",
		"STATUS_ZOOM_RESET": "The zoom on the chart has been reset.",

		"CONNECT_BUTTON_TEXT": "Connect to {0}",

		"INVALID_FIT": "It is not possible to fit this<br>function onto the input data.",

		"INFO_WINDOW_CONTENTS":
			"<p><b>{0}</b> total samples captured<br>" +
			"({1} captured by each sensor)</p>" +
			"<p>Capture frequency: <b>{2} Hz</b></p>" +
			"<p>Capture duration: <b>{3} second(s)</b></p>",

		"INFO_WINDOW_SENSOR":
			"<p><b>Sensor {0} – {1}</b></p>" +
			"<p>Range: <b>{2} – {3} {4}</b></p>",
		
		"EXPORT_CSV_NAME": "Data export from capture {0}.csv",
		"EXPORT_SVG_NAME": "Chart export from capture {0}.svg",

		"TOOLBOX_CONVERTER_UNITS": {
			"LENGTH": {
				"NAME": "Length",
				"TYPES": {
					"NM": [ "nm", "nanometre" ],
					"UM": [ "µm", "mikrometre" ],
					"MM": [ "mm", "milimetre" ],
					"CM": [ "cm", "centimetre" ],
					"DM": [ "dm", "decimetre" ],
					"M": [ "m", "metre" ],
					"KM": [ "km", "kilometre" ],
					"IN": [ "in", "inch" ],
					"FT": [ "ft", "foot" ],
					"YD": [ "yd", "yard" ],
					"MI": [ "mi", "mile" ],
					"NMI": [ "nmi", "nautical mile" ],
				}
			},
			"AREA": {
				"NAME": "Area",
				"TYPES": {
					"NM": [ "nm²", "square nanometre" ],
					"UM": [ "µm²", "square mikrometre" ],
					"MM": [ "mm²", "square milimetre" ],
					"CM": [ "cm²", "square centimetre" ],
					"DM": [ "dm²", "square decimetre" ],
					"M": [ "m²", "square metre" ],
					"KM": [ "km²", "square kilometre" ],
					"AR": [ "ar", "are" ],
					"HA": [ "ha", "hectare" ],
					"IN": [ "in²", "square inch" ],
					"FT": [ "ft²", "square foot" ],
					"YD": [ "yd²", "square yard" ],
					"AC": [ "ac", "acre" ],
					"MI": [ "mi²", "square mile" ],
				}
			},
			"VOLUME": {
				"NAME": "Volume",
				"TYPES": {
					"NM": [ "nm³", "cubic nanometre" ],
					"UM": [ "µm³", "cubic mikrometre" ],
					"MM": [ "mm³", "cubic milimetre" ],
					"CM": [ "cm³", "cubic centimetre" ],
					"DM": [ "dm³", "cubic decimetre" ],
					"M": [ "m³", "cubic metre" ],
					"KM": [ "km³", "cubic kilometre" ],
					"ML": [ "ml", "mililitre" ],
					"CL": [ "cl", "centilitre" ],
					"DL": [ "dl", "decilitre" ],
					"L": [ "l", "litre" ],
					"HL": [ "hl", "hectolitre" ],
					"IN": [ "in³", "cubic inch" ],
					"FT": [ "ft³", "cubic foot" ],
					"YD": [ "yd³", "cubic yard" ],
					"MI": [ "mi³", "cubic mile" ],
				}
			},
			"MASS": {
				"NAME": "Mass",
				"TYPES": {
					"UG": [ "µg", "mikrogram" ],
					"MG": [ "mg", "miligram" ],
					"G": [ "g", "gram" ],
					"DKG": [ "dkg", "dekagram" ],
					"KG": [ "kg", "kilogram" ],
					"T": [ "t", "tonne" ],
					"OZ": [ "oz", "ounce" ],
					"LB": [ "lb", "pound" ],
					"ST": [ "st", "stone" ],
				}
			},
			"SPEED": {
				"NAME": "Speed",
				"TYPES": {
					"KMPH": [ "km/h", "kilometre per hour" ],
					"MPS": [ "m/s", "metre per second" ],
					"MIPH": [ "mi/h", "mile per hour" ],
					"FTPS": [ "ft/s", "foor per second" ],
					"KN": [ "kn", "knot" ],
				}
			},
			"TEMPERATURE": {
				"NAME": "Temperature",
				"TYPES": {
					"C": [ "°C", "degree Celsius" ],
					"F": [ "°F", "degree Fahrenheit" ],
					"K": [ "K", "kelvin" ],
				}
			},
			"TIME": {
				"NAME": "Time",
				"TYPES": {
					"NS": [ "ns", "nanosecond" ],
					"US": [ "µs", "nanosecond" ],
					"MS": [ "ms", "milisecond" ],
					"S": [ "s", "second" ],
					"M": [ "min", "minute" ],
					"H": [ "h", "hour" ],
					"D": [ "d", "day" ],
				}
			},
			"PLANE_ANGLE": {
				"NAME": "Plane angle",
				"TYPES": {
					"DEG": [ "deg", "degree" ],
					"RAD": [ "rag", "radian" ],
					"GON": [ "gon", "gradian" ],
				}
			},
		},
	},
	ds: "."
};
