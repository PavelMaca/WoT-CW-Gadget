function playSound(path, vol) {
	var newPath;
	if (path == "" || path == undefined) {
		return;
	}
	if (path.indexOf('\\') < 0) {
		newPath = System.Gadget.path + "\\sound\\" + path;
	}
	Player.URL = newPath;
	Player.Settings.volume = vol;
	Player.controls.play();
}
