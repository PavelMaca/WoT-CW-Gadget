var Battles = new function () {
	//http://eu.wargaming.net/developers/api_reference/wot/globalwar/battles/
	this.data = {};

	this.reload = function (clan_id, map_id, callback) {
		WG_API.getClanWarsBattles(clan_id, map_id, function (data) {
			console.log('Battles: loaded');
			Battles.data = data.data[GADGET.clan_id];

			//load additional info
			for (var i = 0; i < Battles.data.length; i++) {
				console.log('battle: '+i);
				var provinces = Battles.data[i].provinces;
				for (var a = 0; a < provinces.length; a++) {
					if (!Provinces.is(provinces[a])) {
						console.log('Province '+provinces[a]+' not loaded.');
						Provinces.addToQueue(provinces[a]);
					}
				}
			}

			Provinces.loadQueue(map_id, callback);
		});
	};
	
	this.getBattleTime = function(battle){
		if(battle.time > 0){
			var time = new Date(battle.time * 1000);
			return [time.getHours(), time.getMinutes(), time.getSeconds()];
		}else{
			//use prime time
			var now = new Date()
			var offset = now.getTimezoneOffset() / 60;
			var province = Provinces.get(battle.provinces[0]);
			return [parseInt(province.prime_time) - offset, '00', '+'];
		}
	};
};

