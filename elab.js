/*
 * send_report()
 *
 * Odešle HID report podle pole outreport[8].
 */

function send_report() {
	console.log(outreport);

	return device.sendReport(0, new Uint8Array(outreport));
}

/*
 * input_report_callback(event)
 * 
 * Funkce, která je zavolána vždy, když přijde paketa od zařízení v klidovém režimu.
 */

function input_report_callback(event) {
	if(!connected) return;

	if(!capturerunning) switch(outreport[0]) {
		case 0x3:
			// Přijata hodnota ze vstupního portu

			var val = event.data.getUint8(0) * 64 + event.data.getUint8(1);

			switch(outreport[1]) {
				case 0x1: case 0x2:
					// Port 1

					get_id("port1value").innerHTML = prettyprint_value(0, val);
					break;

				case 0x4: case 0x5:
					// Port 2

					get_id("port2value").innerHTML = prettyprint_value(1, val);
					break;
			}
			break;

		case 0x4:
			var checksum = 0;

			for(var i = 0; i < 0x31; i++) {
				checksum += event.data.getUint8(i);
			}

			if(checksum != 3754) {
				get_id("receivedsum").innerHTML = checksum;

				popup_window(WINDOWID_INVALID_CHECKSUM);
			}

			verified = true;
			
			break;

		case 0x14:
			if(!ports[outreport[1]].intelligent) return; // Ignorujeme neinteligentní čidla

			// Čtení paměti EEPROM

			if(event.data.getUint8(0) == 0) {
				// Paměť úspešně přečtena!

				if(!ports[outreport[1]].connected || (outreportaddress == 0 && ports[outreport[1]].raw_eeprom[0] != event.data.getUint8(1))) {
					// Buď ještě není přečtené celé čidlo, nebo je již připojeno, ale data se záhadně změnila...

					ports[outreport[1]].connected = false;
					get_id("port" + ports[outreport[1]].id).style.backgroundColor = "";
					capture_setup_check();

					// Uložit hodnotu ze současné adresy do mezipaměti

					ports[outreport[1]].raw_eeprom[outreportaddress] = event.data.getUint8(1);

					get_id("port" + ports[outreport[1]].id + "status").innerHTML =
						jslang.SENSOR_LOADING + "<br><progress value=\"" + outreportaddress + "\" max=\"" + (eeprom_length - 1) + "\"></progress>";

					get_id("port" + ports[outreport[1]].id + "value").innerHTML = "...";

					// Požádat o další hodnotu, pokud již nejsme hotovi

					if(++outreportaddress < eeprom_length) {
						outreport[2] = eeprom_addresses[outreportaddress];
						send_report();
						return;
					}
				}
			} else {
				// Chyba čtení, čidlo je odpojeno

				get_id("port" + ports[outreport[1]].id + "status").innerHTML = jslang.SENSOR_DISCONNECTED;
				get_id("port" + ports[outreport[1]].id).style.backgroundColor = "";
				
				ports[outreport[1]].connected = false;

				capture_setup_check();
			}

			if(outreportaddress == eeprom_length) {
				// Čidlo už jsme celé přečetli, teď je čas ta data zpracovat!

				// Název čidla

				ports[outreport[1]].name = "";

				for(var i = 1; i < 21; i++) {
					var val = ports[outreport[1]].raw_eeprom[i];

					if(val)
						ports[outreport[1]].name += String.fromCharCode(val);
					else
						break;
				}

				// Jednotka

				ports[outreport[1]].unit = "";

				for(var i = 37; i < 42; i++) {
					var val = ports[outreport[1]].raw_eeprom[i];

					if(val && val != 41) // Pravá závorka = konec
						ports[outreport[1]].unit += String.fromCharCode(val);
					else
						break;
				}

				// OVERRIDE SPECIÁLNĚ KVŮLI TERMOČLÁNKU: CMA JSOU KOKOTI A ZAPOMNĚLI TAM DÁT ZNAK STUPNĚ!

				if(ports[outreport[1]].name.startsWith("Thermocouple") && ports[outreport[1]].unit == "C")
					ports[outreport[1]].unit = "°" + ports[outreport[1]].unit;

				// Převést hodnoty z bajtové formy do floatů

				var buffer = new ArrayBuffer(4);
				var bytes = new Uint8Array(buffer);
				var float = new Float32Array(buffer);

				// Minimální hodnota

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[21 + i];

				ports[outreport[1]].min_value = float[0];

				// Maximální hodnota

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[25 + i];

				ports[outreport[1]].max_value = float[0];

				// Koeficient a

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[29 + i];

				ports[outreport[1]].coeff_a = float[0];

				// Koeficient b

				for(var i = 0; i < 4; i++)
					bytes[i] = ports[outreport[1]].raw_eeprom[33 + i];

				ports[outreport[1]].coeff_b = float[0];

				// Určení vysokého/nízkého napětí

				ports[outreport[1]].high_voltage = (ports[outreport[1]].raw_eeprom[42] == 0x21);

				// Hotovo!

				get_id("port" + ports[outreport[1]].id + "status").innerHTML =
					jslang.SENSOR_INTELLIGENT + ": " + ports[outreport[1]].name + " (" + ports[outreport[1]].min_value +
					" – " + ports[outreport[1]].max_value + " " + ports[outreport[1]].unit + ")";

				get_id("port" + ports[outreport[1]].id).style.backgroundColor = ports[outreport[1]].color;
				ports[outreport[1]].connected = true;
				
				capture_setup_check();
			}

			// Pokud bylo čidlo odpojeno, nebo už skončil přenos a proces na pozadí neběží, resetovat adresu

			if(event.data.getUint8(0) != 0 || outreportaddress >= eeprom_length)
				outreportaddress = 0;

			break;
	} else {
//		console.log("Received response " + receivedcapture.length);

		for(var i = 0; i < capturesetuppacketsize; i++) {
//			console.log(event.data.getUint8(0 + i * 2), event.data.getUint8(1 + i * 2));

			receivedcapture[receivedsofar++] = (((event.data.getUint8(0 + i * 2) & 0x3F) << 6) | event.data.getUint8(1 + i * 2));
//			receivedcapture.push(event.data.getUint8(0 + i * 2));
//			receivedcapture.push(event.data.getUint8(1 + i * 2));

			if(receivedsofar >= capturesetupsamples) break;
		}

		if(receivedsofar >= capturesetupsamples) deinitialize_capture();
	}

	// Umožnit background_tasku zase pokračovat v práci

	transfer_in_progress = false;
}

/*
 * capture_redraw()
 * 
 * Funkce, která vyžádá znovuvykreslení hlavního okna a zavolá sebe sama znovu za 16 ms.
 */

function capture_redraw() {
	get_id("statusmsg").innerHTML = format(jslang.STATUS_CAPTURE_RUNNING, receivedsofar, (receivedsofar / capturesetupsamplesize * captures[captures.length - 1].interval / 10000).toFixed(2));

	main_window_reset();

	if(capturerunning)
		setTimeout(capture_redraw, 16);
	else
		get_id("statusmsg").innerHTML = jslang.STATUS_CAPTURE_FINISHED;
}

/*
 * async initialize_capture()
 * 
 * Inicializuje rozhraní na vysokorychlostní režim podle parametrů od uživatele.
 */

async function initialize_capture() {
	requestcapture = false;

	capturesetupmode = get_id("capturesetupsensors").selectedIndex;
	
	// Zjistit interval vzorkovací frekvence záznamu

	var speed = round(10000 / get_id("capturesetuphz").value);

	if(!capturesetupmode && speed < 2) speed = 2;

	if(speed == 0)
		capturesetupspeed = 0.25; // 40 kHz
	else
		capturesetupspeed = speed;

	// Zjistit celkový počet vzorků

	capturesetupsamplesize = (capturesetupmode ? 1 : 2)
	
	var samples = Math.floor(get_id("capturesetupsecs").value * 10000 / speed) + 1;
	samples *= capturesetupsamplesize;

	if(samples > 0x3FFF) samples = 0x3FFF;

	capturesetupsamples = samples;

	// Inicializovat informace o záznamu

	var capture = Object.assign({}, fresh_capture);

	if(get_id("capturesetupname").value != "")
		capture.title = get_id("capturesetupname").value;
	else
		capture.title = jslang.UNTITLED_CAPTURE;

	capture.seconds = get_id("capturesetupsecs").value;
	capture.samples = samples;
	capture.interval = capturesetupspeed;
	capture.sensorsetup = capturesetupmode;
	capture.port_a = JSON.parse(JSON.stringify(ports[0]));
	capture.port_a.raw_eeprom = undefined;
	capture.port_b = JSON.parse(JSON.stringify(ports[1]));
	capture.port_b.raw_eeprom = undefined;

	receivedcapture = new Array(samples);
	receivedsofar = 0;

	captures[selectedcapture = captures.length] = capture;

	// Teď nastavit samotný €Lab

	for(var i = 0; i < 8; i++) outreport[i] = 0;

	var samples_per_packet = Math.ceil(get_id("capturesetuphz").value / 60);

	if((samples_per_packet * capturesetupsamplesize) > 32) samples_per_packet = Math.floor(32 / capturesetupsamplesize);

	if(samples_per_packet < 1) samples_per_packet = 1;

	outreport[0] = 0x05;	// Příkaz na inicializaci záznamu
	outreport[1] = samples_per_packet;	// Počet vzorků na paketu
	
	await send_report(outreport);

	outreport[0] = outreport[3] = 0;
	
	outreport[1] = speed & 0xFF;
	outreport[2] = speed >> 8;

	outreport[4] = outreport[6] = samples & 0xFF;
	outreport[5] = outreport[7] = samples >> 8;

	await send_report(outreport);

	for(var i = 0; i < 8; i++) outreport[i] = 0;

	switch(capturesetupmode) {
		case 0:
			outreport[1] = ports[1].high_voltage ? 5 : 4;
			// break tu chybí naschvál

		case 1:
			outreport[0] = ports[0].high_voltage ? 2 : 1;
			break

		case 2:
			outreport[0] = ports[1].high_voltage ? 5 : 4;
			break
	}

	capturerunning = true;

	capturesetuppacketsize = capturesetupsamplesize * samples_per_packet;

	await send_report(outreport);

	update_button_validity();
	capture_redraw();
}

/*
 * async deinitialize_capture()
 * 
 * Zastaví vysokorychlostní režim rozhraní.
 */

async function deinitialize_capture() {
	for(var i = 0; i < 8; i++) outreport[i] = 0;

	outreport[0] = 0xFF;

	await device.sendReport(0, new Uint8Array(outreport));

	captures[captures.length - 1].captureddata = receivedcapture;

	capturerunning = false;
	requestcapture = false;

	update_button_validity();
}

/*
 * background_task()
 * 
 * Funkce, která je periodicky (8x za vteřinu) volána na pozadí.
 * Čte hodnoty z každého portu a kontroluje inteligentní čidla.
 */

function background_task() {
	if(!connected) {
		clearInterval(background_task_handle);
		return;
	}

	if(!capturerunning) {
		if(transfer_in_progress || !verified) return;

		transfer_in_progress = true;

		if(requestcapture) {
			initialize_capture();
		} else {
			background_task_cycle++;
			background_task_cycle %= 4;

			if(!(background_task_cycle & 1)) {
				// Detekce připojených/odpojených čidel každý lichý cyklus

				outreport[0] = 0x14; // Příkaz na čtení paměti EEPROM
				outreport[2] = eeprom_addresses[outreportaddress = 0]; // Adresa, ze které budeme číst

				if(!(background_task_cycle & 2)) {
					// Port 1
					if(!ports[0].intelligent) return;	// Pokud není čidlo inteligentní, zakázat autodetekci
					outreport[1] = 0x00;
				} else {
					// Port 2
					if(!ports[1].intelligent) return;
					outreport[1] = 0x01;
				}
			} else {
				// Čtení hodnot každý sudý cyklus

				outreport[0] = 0x03; // Příkaz na čtení hodnot ze vstupního portu
				outreport[2] = 0;

				if(!(background_task_cycle & 2)) {
					// Port 1

					if(ports[0].high_voltage)
						outreport[1] = 0x02;
					else
						outreport[1] = 0x01;

				} else {
					// Port 2

					if(ports[1].high_voltage)
						outreport[1] = 0x05;
					else
						outreport[1] = 0x04;
				}	
			}

			send_report();
		}
	} else {
		if(requestcapture) {
			deinitialize_capture();
		}
	}
}

/*
 * async webhid_connect()
 * 
 * Vyskočí okénko s výběrem zařízení a připojí se k němu pomocí WebHID.
 */

async function webhid_connect() {
	if(!('hid' in navigator)) {
		popup_window(WINDOWID_WEBHID_UNAVAILABLE);
		return;
	}

	var devices = await navigator.hid.requestDevice({
		filters: [{ vendorId: 0x1126 }] // CMA Amsterdam – snad za to nepůjdu sedět 😁
	});

	if(devices.length == 0) {
		if(get_id("introerrmsg")) {
			header.style.height = "13.5em";
			get_id("introerrmsg").innerHTML = jslang.STATUS_NO_DEVICE_SELECTED;
			get_id("introerrmsg").style.opacity = 1;
		} else {
			get_id("statusmsg").innerHTML = jslang.STATUS_NO_DEVICE_SELECTED;
		}
			
		return;
	}

	device = devices[0];
	
	navigator.hid.addEventListener('disconnect', ({device}) => {
		if(connected) {
			webhid_disconnect();

			get_id("statusmsg").innerHTML = format(jslang.STATUS_DEVICE_DISCONNECTED, device.productName);

			nav.style.backgroundColor = "#FAA";
			header.style.backgroundColor = "#F00";
			footer.style.backgroundColor = "#F00";
		}
	});

	device.addEventListener("inputreport", input_report_callback);

	await device.open();
	await send_report();
	await send_report(); // €Lab potřebuje počáteční příkaz 2x 🤷

	connected = true;

	ui_connect(true);

	background_task_handle = setInterval(background_task, 125);

	console.log(device);
}

/*
 * async webhid_disconnect()
 * 
 * Zastaví veškeré operace s rozhraním.
 */

async function webhid_disconnect() {
	connected = false;
	verified = false;

	get_id("capturestartbutton").style.display = "";
	get_id("capturestopbutton").style.display = "none";

	capturerunning = false;
	requestcapture = false;

	ui_disconnect();

	await device.close();

	for(var i = 0; i < ports.length; i++) {
		ports[i].connected = false;
		ports[i].intelligent = true;
	}

	outreport = [ 0x04, 0x01, 0x0B, 0x80, 0x0C, 0x33, 0x0B, 0x00 ];
	outreportaddress = 0;
	background_task_cycle = -1;
	transfer_in_progress = false;
}
