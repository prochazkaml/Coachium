var htmllang = {};

var jslang = {};

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
			window.location.href = ".?lang=" + id;
		};
	})(language.id);

	get_win_el_tag(WINDOWID_LANGUAGE_SELECTOR, "select").appendChild(option);
}

const params = new URLSearchParams(window.location.search);

var lang = params.get("lang");

if(!lang) lang = "cs";

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
	}

	document.body.appendChild(script_fallback);
}

document.body.appendChild(script);
