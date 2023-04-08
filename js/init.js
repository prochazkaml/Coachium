/*
 * Coachium - js/init.js
 * - initializes the UI, handles hash changes and application errors
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

/*
 * The page has loaded, hooray!
 */

function window_onload() {
	get_tag("html").style.opacity = 1;

	// Initialize constants for making the code simpler

	header = get_tag("header");
	nav = get_tag("nav");
	main = get_tag("main");
	footer = get_tag("footer");
	canvas = get_id("maincanvas");
	ctx = canvas.getContext("2d");
	overlay = get_id("overlaycanvas");
	ovctx = overlay.getContext("2d");
	table = get_id("table");

	// Initialize the connect button

	get_id("connectbutton").onclick = () => {
		if(driver === null) {
			device_select();
		} else {
			driver.deinit();
			ui_disconnect(false);
		}
	};

	// Initialize capture setup window

	var sensorsrc = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupsensorsrc");
	var sensordrop = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodydropzone");
	var sensordropx = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 0);
	var sensordropy = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 1);
	var sensordroptrig = get_win_el_class(WINDOWID_CAPTURE_SETUP, "capturesetupmodebodyxydropzone", 2);

	var drake = dragula([sensorsrc, sensordrop, sensordropx, sensordropy, sensordroptrig], {
		copy: (el, source) => {
			return source === sensorsrc;
		},
		accepts: (el, target) => {
			if(target === sensorsrc) return false;

			if(target === sensordropx || target === sensordropy || target === sensordroptrig) {
				return target.querySelector("div.sensorblock:not(.gu-transit)") == null;
			} else {
				return true;
			}
		},
		direction: (el, target) => {
			return (target == sensordrop) ? "horizontal" : "vertical";
		},
		removeOnSpill: true
	});

	drake.on("dragend", capture_setup_check);

	var startbutt = get_win_el_class(WINDOWID_CAPTURE_SETUP, "windowbutton");

	startbutt.onclick = () => {
		if(!startbutt.classList.contains("windowbuttondisabled")) {
			request_capture = true;
			close_window();
		}
	};

	// Initialize all the callbacks on the canvas

	canvas.onmousemove = canvasmousemovehandler;
	canvas.onmousedown = () => { canvasmousechangehandler(1); };
	canvas.onmouseup = () => { canvasmousechangehandler(0); };
	canvas.onmouseleave = canvasmouseleavehandler;
	canvas.onwheel = canvasmousewheelhandler;

	// Check the version

	check_version();

	// Load the Google Drive subsystem

	gdrive_reload();

	window.onhashchange();
}

window.onload = window_onload;

/*
 * check_version()
 * 
 * Check the installed version against the one available on GitHub.
 */

async function check_version() {
	if(location.hostname != "localhost") {
		// Check the current git commit version or timestamp against GitHub

		var str1, str2, succ; // 1 = error, 2 = old, 3 = good

		try {
			if(is_running_cached()) {
				var net1 = await fetch("https://raw.githubusercontent.com/prochazkaml/CoachiumCached/master/timestamp?t=" + new Date().getTime());
				var net2 = await fetch("./timestamp?t=" + new Date().getTime());

				if(net1.status == 200 && net2.status == 200) {
					str1 = await net1.text();
					str2 = await net2.text();

					succ = (str1 == str2) ? 3 : 2;
				} else {
					succ = 1;
				}
			} else {
				var net1 = await fetch("https://api.github.com/repos/prochazkaml/Coachium/commits/master?t=" + new Date().getTime());
				var net2 = await fetch("./.git/refs/heads/master?t=" + new Date().getTime());

				if(net1.status == 200 && net2.status == 200) {
					str1 = JSON.parse(await net1.text())["sha"].substring(0, 7);
					str2 = (await net2.text()).substring(0, 7);

					succ = (str1 == str2) ? 3 : 2;
				} else {
					succ = 1;
				}
			}
		} catch(e) {
			succ = 1;
		}

		switch(succ) {
			case 1:
				get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
				break;

			case 2:
				get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = format(jslang.HOMEPAGE_COMMIT_OLD, str2.trim(), str1.trim());
				break;

			case 3:
				get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = format(jslang.HOMEPAGE_COMMIT_OK, str1.trim());
				break;
		}
	} else {
		get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_LOCALHOST;
	}
}

/*
 * Callback when the URL hash changes
 */

window.onhashchange = () => {
	const hash = new URL(document.URL).hash;

	close_window("about");
	close_window("pp");

	if(hash == "#about") help_start();
	if(hash == "#privacy-policy") popup_window("pp");
}

/*
 * Error handler for the entire application
 */

window.onerror = (msg, file, line) => {
	get_win_el_tag(WINDOWID_JS_ERR, "textarea").value =
		"\"" + file + "\" @ " + line + ":\n\n" + msg;

	popup_window(WINDOWID_JS_ERR);
	return false;
}
