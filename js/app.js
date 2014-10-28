// Global varialbes
var DEBUG = true;
var IS_SIDEBAR = typeof (System) != "undefined";

// Setup enviroment
if (IS_SIDEBAR) {
	var console = {
		log: function (str) {
			$('#debug').prepend('<p>' + str + '</p>');
		}
	};
	// Fuck IE7
	if (typeof (Object.keys) == 'undefined') {
		Object.keys = function (obj) {
			var keys = [];

			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					keys.push(i);
				}
			}

			return keys;
		};
	}
}

if (DEBUG !== true) {
	var console = {
		log: function () {
			return;
		}
	};
}

function init() {
	console.log('init()');

	if (IS_SIDEBAR) {
		System.Gadget.settingsUI = "settings.html";
	}

	GADGET.init();
}

function initDetail() {
	console.log('initDetail()');
	GADGET_DETAIL.showInfo();
}

function initSettings() {
	GADGET_SETTINGS.init();
}

function settingsHaveChanged(){
	console.log('setting changed');
}

// Init application
$(document).ready(function () {
	try {
		if (!DEBUG) {
			$("#debug").remove();
		}
		if ($('body').is('#detail')) {
			initDetail();
		} else if ($('body').is('#settings')) {
			initSettings();
		} else {
			init();
		}
	} catch (e) {
		console.log(e.message);
	}
});