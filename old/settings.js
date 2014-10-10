window.attachEvent("onload", settingsLoad);
var isSidebar = false;

//called when the options dialog is about to close
function settingsClose(p_event) {
	if (p_event.closeAction == p_event.Action.commit) {
		if (isSidebar) {
			SettingsManager.loadFile();

			var settingsElemTimeZone = $("#timeZone");
			SettingsManager.setValue("Settings", "timeZone", settingsElemTimeZone.val());
			System.Gadget.Settings.write("settingsTimeZone", settingsElemTimeZone.val());

			var settingsElemServer = $("#server");
			SettingsManager.setValue("Settings", "server", settingsElemServer.val());
			System.Gadget.Settings.write("settingsServer", settingsElemServer.val());

			var settingsElemClanId = $("#clanId");
			SettingsManager.setValue("Settings", "clanId", settingsElemClanId.val());
			System.Gadget.Settings.write("settingsClanId", settingsElemClanId.val());

			//Sound settings
			var settingsElemSound1Enabled = $("#sound1Enabled");
			var settingsElemSound1Time = $("#sound1Time");
			var settingsElemSound1File = $("#sound1File");
			SettingsManager.setValue("Settings", "sound1Enabled", settingsElemSound1Enabled.prop('checked'));
			SettingsManager.setValue("Settings", "sound1Time", settingsElemSound1Time.val());
			SettingsManager.setValue("Settings", "sound1File", settingsElemSound1File.val());
			System.Gadget.Settings.write("settingsSound1Enabled", settingsElemSound1Enabled.prop('checked'));
			System.Gadget.Settings.write("settingsSound1Time", settingsElemSound1Time.val());
			System.Gadget.Settings.write("settingsSound1File", settingsElemSound1File.val());

			var settingsElemSound2Enabled = $("#sound2Enabled");
			var settingsElemSound2Time = $("#sound2Time");
			var settingsElemSound2File = $("#sound2File");
			SettingsManager.setValue("Settings", "sound2Enabled", settingsElemSound2Enabled.prop('checked'));
			SettingsManager.setValue("Settings", "sound2Time", settingsElemSound2Time.val());
			SettingsManager.setValue("Settings", "sound2File", settingsElemSound2File.val());
			System.Gadget.Settings.write("settingsSound2Enabled", settingsElemSound2Enabled.prop('checked'));
			System.Gadget.Settings.write("settingsSound2Time", settingsElemSound2Time.val());
			System.Gadget.Settings.write("settingsSound2File", settingsElemSound2File.val());

			var settingsElemSound3Enabled = $("#sound3Enabled");
			var settingsElemSound3Time = $("#sound3Time");
			var settingsElemSound3File = $("#sound3File");
			SettingsManager.setValue("Settings", "sound3Enabled", settingsElemSound3Enabled.prop('checked'));
			SettingsManager.setValue("Settings", "sound3Time", settingsElemSound3Time.val());
			SettingsManager.setValue("Settings", "sound3File", settingsElemSound3File.val());
			System.Gadget.Settings.write("settingsSound3Enabled", settingsElemSound3Enabled.prop('checked'));
			System.Gadget.Settings.write("settingsSound3Time", settingsElemSound3Time.val());
			System.Gadget.Settings.write("settingsSound3File", settingsElemSound3File.val());

			var settingsElemVolume = $("#volume");
			SettingsManager.setValue("Settings", "soundVolume", settingsElemVolume.val());
			System.Gadget.Settings.write("settingsSoundVolume", settingsElemVolume.val());


			SettingsManager.saveFile();
		}
	}
}

function settingsUnload() {
	window.detachEvent("onunload", settingsUnload);
}

// called when the options window loads
function settingsLoad() {
	if (isSidebar) {
		window.detachEvent("onload", settingsLoad);
		window.attachEvent("onunload", settingsUnload);

		System.Gadget.onSettingsClosing = settingsClose;
		SettingsManager.loadFile();

		var timeZone = SettingsManager.getValue("Settings", "timeZone");
		var settingsElemTimeZone = $("#timeZone");
		settingsElemTimeZone.val(timeZone);

		var server = SettingsManager.getValue("Settings", "server");
		var settingsElemServer = $("#server");
		settingsElemServer.val(server);

		setClanSearchLink(server);

		var clanId = SettingsManager.getValue("Settings", "clanId");
		var settingsElemClanId = $("#clanId");
		settingsElemClanId.val(clanId);

		//Sound settings
		var sound1Enabled = SettingsManager.getValue("Settings", "sound1Enabled");
		var sound1Time = SettingsManager.getValue("Settings", "sound1Time");
		var sound1File = SettingsManager.getValue("Settings", "sound1File");
		var settingsElemSound1Enabled = $("#sound1Enabled");
		var settingsElemSound1Time = $("#sound1Time");
		var settingsElemSound1File = $("#sound1File");

		settingsElemSound1Enabled.prop("checked", (sound1Enabled == "true"));
		settingsElemSound1Time.val(sound1Time);
		settingsElemSound1File.val(sound1File);

		var sound2Enabled = SettingsManager.getValue("Settings", "sound2Enabled");
		var sound2Time = SettingsManager.getValue("Settings", "sound2Time");
		var sound2File = SettingsManager.getValue("Settings", "sound2File");
		var settingsElemSound2Enabled = $("#sound2Enabled");
		var settingsElemSound2Time = $("#sound2Time");
		var settingsElemSound2File = $("#sound2File");

		settingsElemSound2Enabled.prop("checked", (sound2Enabled == "true"));
		settingsElemSound2Time.val(sound2Time);
		settingsElemSound2File.val(sound2File);

		var sound3Enabled = SettingsManager.getValue("Settings", "sound3Enabled");
		var sound3Time = SettingsManager.getValue("Settings", "sound3Time");
		var sound3File = SettingsManager.getValue("Settings", "sound3File");
		var settingsElemSound3Enabled = $("#sound3Enabled");
		var settingsElemSound3Time = $("#sound3Time");
		var settingsElemSound3File = $("#sound3File");

		settingsElemSound3Enabled.prop("checked", (sound3Enabled == "true"));
		settingsElemSound3Time.val(sound3Time);
		settingsElemSound3File.val(sound3File);

		var volume = SettingsManager.getValue("Settings", "soundVolume");
		var settingsElemVolume = $("#volume");
		settingsElemVolume.simpleSlider("setValue", volume);

		SettingsManager.saveFile();
	}

	$('#volume').bind("slider:changed", function (event, data) {
		playSound("ding.mp3", data.value);
	});
}

function setSoundFilePath(inputElem) {
	var input = $('#' + inputElem);
	var path = System.Shell.chooseFile(true, "Sound File:*.mp3;*.wav::", System.Gadget.path + "\\sound", "").path;
	input.val(path);
	playSound(path, 5);
}

function setClanSearchLink(server) {
	$("#clanSearch").attr("href", "http://worldoftanks."+server+"/community/clans/");
}

$(function() {
	$('#server').on('change', function (e) {
		var selection = $("#server option:selected").val();
		setClanSearchLink(selection);
	});
});
