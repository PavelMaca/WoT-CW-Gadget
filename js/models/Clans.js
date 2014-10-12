var Clans = new function () {
	// http://eu.wargaming.net/developers/api_reference/wot/clan/info/
	this.data = {};
	this.queue = {};
	
	this.NPC = '500004298';

	this.is = function (clan_id) {
		if(clan_id == null){
			clan_id = this.NPC;
		}
		return this.data.hasOwnProperty(clan_id);
	};

	this.get = function (clan_id) {
		if(clan_id == null){
			clan_id = this.NPC;
		}
		
		if (this.is(clan_id)) {
			return this.data[clan_id];
		} else {
			return null;
		}
	};
	
	this.set = function (clan_id, data) {
		this.data[clan_id] = data;
	};
	
	this.addToQueue = function (clan_id) {
		if(clan_id == null){
			clan_id = this.NPC;
		}
		
		this.queue[clan_id] = true;
	};

	this.loadQueue = function (callback) {
		console.log('Clans: processing queue');
		if (Object.keys(this.queue).length > 0) {
			var clans = '';
			for (var id in this.queue) {
				clans += id + ',';
			}
			WG_API.getClanDetail(clans, function (data) {
				console.log('Clans: loaded');
				for (var clan_id in data.data) {
					Clans.data[clan_id] = data.data[clan_id];
				}
				callback();
			});
		} else {
			callback();
		}
	};
	
	this.getUrl = function (clan_id, server) {
		if(clan_id == null){
			return null;
		}
		return 'http://worldoftanks.'+server+'/community/clans/'+clan_id;
	}

};

