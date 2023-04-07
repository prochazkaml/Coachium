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

	if(location.hostname != "localhost") {
		// Check the current git commit version against GitHub

		var github_request = new XMLHttpRequest();

		github_request.onreadystatechange = () => {
			if(github_request.readyState == 4) {
				if(github_request.status == 200) {
					var sha1 = JSON.parse(github_request.responseText)["sha"];

					if(sha1 == undefined) {
						get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
					} else {
						var local_request = new XMLHttpRequest();

						local_request.onreadystatechange = () => {
							if(local_request.readyState == 4) {
								if(local_request.status == 200) {
									var sha2 = local_request.responseText;

									if(sha1.substring(0, 7) == sha2.substring(0, 7)) {
										get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML =
											format(jslang.HOMEPAGE_COMMIT_OK, sha1.substring(0, 7));
									} else {
										get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML =
											format(jslang.HOMEPAGE_COMMIT_OLD, sha2.substring(0, 7), sha1.substring(0, 7));
									}
								} else {
									get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
								}
							}
						}

						local_request.open("GET", "./.git/refs/heads/master?t=" + new Date().getTime(), true); // true for asynchronous
						local_request.send(null);
					}
				} else {
					get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_ERR;
				}
			}
		}

		if(is_running_cached()) {
			get_id("repolink").href = "https://github.com/prochazkaml/CoachiumCached";
			github_request.open("GET", "https://api.github.com/repos/prochazkaml/CoachiumCached/commits/master", true);
		} else {
			get_id("repolink").href = "https://github.com/prochazkaml/Coachium";
			github_request.open("GET", "https://api.github.com/repos/prochazkaml/Coachium/commits/master", true);
		}
	
		github_request.send(null);
	} else {
		get_class("L10N_HOMEPAGE_COMMIT_CHECKING").innerHTML = jslang.HOMEPAGE_COMMIT_LOCALHOST;
	}

	// Load the Google Drive subsystem

	gdrive_reload();

	window.onhashchange();
}

window.onload = window_onload;

/*
 * Callback when the URL hash changes
 */

window.onhashchange = () => {
	const hash = new URL(document.URL).hash;

	close_window("about");
	close_window("pp");

	if(hash == "#about") popup_window("about");
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
