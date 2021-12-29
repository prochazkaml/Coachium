var htmllang = {
	// Homepage text

	"HOMEPAGE_VERSION": "Version 0.1 pre-alpha",
	"HOMEPAGE_ABOUT_LINK": "What is Coachium?",
	"HOMEPAGE_PRIVACY_POLICY_LINK": "Privacy policy",

	// Button descriptions

	"BUTTON_CONNECT": "Connect via USB",
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
		"protocel between the CMA €Lab interface and CMA Coach.",
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

for(var key of Object.keys(htmllang)) {
    for(var el of document.getElementsByClassName("L18N_" + key)) {
        if(key.startsWith("TITLE_"))
			el.title = htmllang[key];
		else
			el.innerHTML = htmllang[key];
    }
}
