var Tournaments = new function () {
	//https://eu.wargaming.net/developers/api_reference/wot/globalwar/tournaments/
	this.data = {};

	this.load = function (callback) {
		WG_API.getClanWarsTournaments(province_id, map_id, function (data) {
			console.log('Tournaments: loaded');
			for (var i = 0; i < data.data.length; i++) {
				Maps.data[data.data[i].map_id] = data.data[i];
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

