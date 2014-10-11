var Battles = new function () {
	//http://eu.wargaming.net/developers/api_reference/wot/globalwar/battles/
	this.data = {};

	this.reload = function (clan_id, map_id, callback) {
		WG_API.getClanWarsBattles(clan_id, map_id, function (data) {
			console.log('Battles: loaded');
			Battles.data = data.data[GADGET.clan_id];

			//load additional info
			for (var i = 0; i < Battles.data.length; i++) {

				var provinces = Battles.data[i].provinces;
				for (var a = 0; a < provinces.length; a++) {
					console.log('ceck prov:' + provinces[a]);
					if (!Provinces.is(provinces[a])) {
						console.log('not loaded');
						Provinces.addToQueue(provinces[a]);
					}
				}
			}

			Provinces.loadQueue(map_id, callback);
		});
	};
};

