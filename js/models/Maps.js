var Maps = new function () {
	//http://eu.wargaming.net/developers/api_reference/wot/globalwar/maps/
	this.data = {};

	this.load = function (callback) {
		WG_API.getClanWarsMaps(function (data) {
			console.log('Maps: loaded');
			for (var i = 0; i < data.data.length; i++) {
				Maps.data[i + 1] = data.data[i];
			}

			callback();
		});
	};

	this.getMapUrl = function (map_id) {
		if (this.data.hasOwnProperty(map_id)) {
			return this.data[map_id].map_url;
		} else {
			return null;
		}
	}
};

