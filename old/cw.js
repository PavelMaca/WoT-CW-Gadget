var jsonResult, displayCounter = 0, server = "eu";

function initSettings() {
	var settingsName = "Settings";

	function loadFromStorage(storageKey, settingsKey) {
		System.Gadget.Settings.write(settingsKey, SettingsManager.getValue(settingsName, storageKey));
	}

	if (isSidebar) {
	    SettingsManager.loadFile();
		loadFromStorage("timeZone", "settingsTimeZone");
		loadFromStorage("clanId", "settingsClanId");
		loadFromStorage("soundVolume", "settingsSoundVolume");
		loadFromStorage("sound1Enabled", "settingsSound1Enabled");
		loadFromStorage("sound1Time", "settingsSound1Time");
		loadFromStorage("sound1File", "settingsSound1File");
		loadFromStorage("sound2Enabled", "settingsSound2Enabled");
		loadFromStorage("sound2Time", "settingsSound2Time");
		loadFromStorage("sound2File", "settingsSound2File");
		loadFromStorage("sound3Enabled", "settingsSound3Enabled");
		loadFromStorage("sound3Time", "settingsSound3Time");
		loadFromStorage("sound3File", "settingsSound3File");
		loadFromStorage("server", "settingsElemServer");

		server = System.Gadget.Settings.read("settingsElemServer");
	}

	initScrollPane();
}

function initScrollPane() {
	$('#innerContent').slimscroll({
		size: '7px',
		height: 'auto',
		alwaysVisible: false,
		color: '#D1F567',
		distance: '4px'
	});
}


function getTimeZoneValue() {
	if (isSidebar) {
		return parseInt(System.Gadget.Settings.read("settingsTimeZone") * 3600);
	} else {
		return -3600;
	}
}

function isTrue(input) {
	if (typeof input == 'string') {
		return input.toLowerCase() == 'true';
	}
	return !!input;
}

function getClanIdValue() {
	if (isSidebar) {
		return System.Gadget.Settings.read("settingsClanId");
	} else {
		return "123";
	}
}

function getData() {
	if (isDebug) {
		debugElem2.html("getting data");
	}
	$('#data').html("");

	jQuery.support.cors = true;
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "http://worldoftanks." + server + "/community/clans/" + getClanIdValue() + "/battles/list/?order_by=time",
		headers: {
			"If-Modified-Since": "Sat, 1 Jan 2000 00:00:00 GMT",
			"Cache-Control": "no-cache",
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36",
			"Accept-Encoding": "gzip,deflate,sdch",
			"X-Requested-With": "XMLHttpRequest"
		},
		success: function (data) {
			if (isDebug) {
				debugElem2.html("success ");
				debugElem2.html("got data: " + JSON.stringify(data));
			}
			jsonResult = data;
			display();
		}
	});
}

function display() {
	var battlesPlanned = jsonResult.request_data.total_count;
	if (isDebug) {
		debugElem1.html("battles planned: " + battlesPlanned);
	}
	var data = $("#data");
	data.html("");

	for (var i = 0; i < battlesPlanned; i++) {
		var content = '<div class="left">' + getTimeFromTimestamp(jsonResult.request_data.items[i].time) + '<div class="countdown" id="time' + i + '" ></div></div>' +
			'<div class="middle">' + jsonResult.request_data.items[i].arenas[0].name + '<div class="provinceName" id="provinceName' + i + '"></div></div>' +
			'<div class="map" id="map' + i + '"></div>';
		var newdiv = $('<div class="separator">' + content + '</div>');
		data.append(newdiv);
	}
}

function getTimeFromTimestamp(timestamp, showSeconds) {
	if (timestamp == 0) {
		return "--:--";
	}

	var date = new Date(timestamp * 1000);
	var hours = date.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	var seconds = date.getSeconds();
	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	var formattedTime;
	if (showSeconds == true) {
		formattedTime = hours + ':' + minutes + ':' + seconds;
	} else {
		formattedTime = hours + ':' + minutes;
	}

	return formattedTime;
}

function getCountDown() {
	var dateNow = Math.round((new Date()).getTime() / 1000);

	if (isDebug) {
		debugElem1.html("getCountDown: datenow: " + dateNow + "<br>");
	}

	var diff;
	var battlesPlanned = jsonResult.request_data.total_count;

	for (var i = 0; i < battlesPlanned; i++) {
		if (! ($("#time" + i).length > 0) || jsonResult.request_data.items[i] === undefined) {
			return;
		}

		$("#provinceName" + i).html(jsonResult.request_data.items[i].provinces[0].name);
		$("#map" + i).html('<a href="http://worldoftanks.' + server + '/clanwars/maps/globalmap/?province=' + jsonResult.request_data.items[i].provinces[0].id +'">' + '<img src="img/globalMap.png"/>' + '</a>');
		if (jsonResult.request_data.items[i].time > 0) {
			diff = jsonResult.request_data.items[i].time - dateNow;
			if (isDebug) {
				debugElem1.html(debugElem1.html() + "diff: " + diff + " | type: " + typeof(diff) + "<br/>");
			}

			if (diff > 0) {
				if (isDebug) {
					debugElem1.html(debugElem1.html() + "<br> writing time: " + getTimeFromTimestamp(diff + getTimeZoneValue(), true));
				}

				$("#time" + i).html(getTimeFromTimestamp(diff + getTimeZoneValue(), true));
			} else {
				var spaces = "";
				for (var j = 0; j < displayCounter; j++) {
					spaces = spaces + " .";
				}
				$("#time" + i).html(spaces);
				if (isDebug) {
					debugElem1.html(debugElem1.html() + "displayCounter: " + displayCounter + " | spaces" + spaces + "|<br/>");
				}
			}

			if (isSidebar) {
				if (diff == parseInt(System.Gadget.Settings.read("settingsSound1Time")) && isTrue(System.Gadget.Settings.read("settingsSound1Enabled"))) {
					playSound(System.Gadget.Settings.read("settingsSound1File"), System.Gadget.Settings.read("settingsSoundVolume"));
				}
				if (diff == parseInt(System.Gadget.Settings.read("settingsSound2Time")) && isTrue(System.Gadget.Settings.read("settingsSound2Enabled"))) {
					playSound(System.Gadget.Settings.read("settingsSound2File"), System.Gadget.Settings.read("settingsSoundVolume"));
				}
				if (diff == parseInt(System.Gadget.Settings.read("settingsSound3Time")) && isTrue(System.Gadget.Settings.read("settingsSound3Enabled"))) {
					playSound(System.Gadget.Settings.read("settingsSound3File"), System.Gadget.Settings.read("settingsSoundVolume"));
				}
			}

			if (diff > 900) {
				document.getElementById("time" + i).className = "countdown greenTime";
			} else {
				if (diff > 300) {
					document.getElementById("time" + i).className = "countdown yellowTime";
				} else {
					if (diff > 0) {
						document.getElementById("time" + i).className = "countdown redTime";
					}
					if (diff == 0) {
						setTimeout("getData()", 1000000);
						setTimeout("getData()", 750000);
						setTimeout("getData()", 500000);
					}
					if (diff < 0) {
						document.getElementById("time" + i).className = "countdown";
					}
				}
			}
		}
	}
	displayCounter = (displayCounter + 1) % 4;
}

function loadGadget() {
	if (isDebug) {
		enableDebug();
	}

	if (isMockAjax) {
		mockAjaxRequest();
	}

	initSettings();
	getData();

	setTimeout("display()", 1000);
	setInterval("getCountDown()", 1000);
	setInterval("getData()", 1000000);
}

CheckDockState = function() {
	var oBackground = document.getElementById("background");
	oBackground.style.width = 0;
	var body = document.body.style;

	if(System.Gadget.docked){
		$('body').removeClass("large");
		oBackground.src = "url(img/background.png)";

		body.width = 130;
		body.height = 115;
		initScrollPane();
	}
	else {
		oBackground.src = "url(img/bg_undocked.png)";
		$('body').addClass("large");
		body.width = 195;
		body.height = 215;
		initScrollPane();
	}
};