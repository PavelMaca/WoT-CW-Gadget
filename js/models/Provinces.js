var Provinces = new function () {

	//http://eu.wargaming.net/developers/api_reference/wot/globalwar/provinces/
	this.data = {};

	this.queue = {};

	this.is = function (province_id) {
		return this.data.hasOwnProperty(province_id);
	};

	this.get = function (province_id) {
		if (this.is(province_id)) {
			return this.data[province_id];
		} else {
			return null;
		}
	};

	this.set = function (province_id, data) {
		this.data[province_id] = data;
	};

	this.addToQueue = function (province_id) {
		this.queue[province_id] = true;
	};

	this.loadQueue = function (map_id, callback) {
		console.log('Provinces: processing queue');
		if (Object.keys(this.queue).length > 0) {
			var provinces = '';
			for (var id in this.queue) {
				provinces += id + ',';
			}
			WG_API.getClanWarsProvinces(map_id, provinces, function (data) {
				console.log('Provinces: loaded');
				for (var province_id in data.data) {
					Provinces.data[province_id] = data.data[province_id];
					
					var clan_id = data.data[province_id].clan_id;
					if(!Clans.is(clan_id)){
						Clans.addToQueue(clan_id);
					}
				}
				
				Clans.loadQueue(callback);
			});
		} else {
			callback();
		}
	};

	this.getUrl = function (map_id, province_id) {
		return Maps.getMapUrl(map_id) + '?province=' + province_id;
	}
};

