/*
 * Coachium - js/i18n/default.js
 * - applies translation data on startup
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

script.src = "js/i18n/" + lang + ".js";
script.onload = () => {
	for(var key of Object.keys(htmllang)) {
		for(var el of document.getElementsByClassName("L18N_" + key)) {
			if(key.startsWith("TITLE_"))
				el.title = htmllang[key];
			else if(key.startsWith("CSSATTR_"))
				el.setAttribute("css-attr", htmllang[key]);
			else
				el.innerHTML = htmllang[key];
		}
	}
};

script.onerror = () => {
	var script_fallback = document.createElement("script");
	script_fallback.src = "js/i18n/en.js";
	script_fallback.onload = () => {
		script.onload();
		popup_window(WINDOWID_LANGUAGE_ERROR);
		document.cookie = "lang=en";
	}

	document.body.appendChild(script_fallback);
}

document.body.appendChild(script);
