var WG_API = new function () {

	/** @private */
	this.application_id = null;
	
	/** @private */
	this.url = null;
	
	/** @private */
	this.language = null;
	
	this.init = function (application_id, server, language) {
		this.application_id = application_id;
		this.url = "https://api.worldoftanks." + server + "/wot/";
		this.language = language;

		//Set jQuery tu support cross domain reguests
		$.support.cors = true;
		
		//disable cache
		$.ajaxSetup({ cache: false });
	};

	/**
	 * @param {string} section
	 * @param {object} params
	 * @param {object} callback
	 * @private
	 */
	this.callApi = function (section, params, callback) {
		params.application_id = this.application_id;

		var success = function (data) {
			if (data.status === 'ok') {
				callback(data);
			} else {
				console.log(JSON.stringify(data));
			}
		}
		$.getJSON(this.url + section, params, success);
	};


	this.getClanWarsBattles = function (clan_id, map_id, callback) {
		this.callApi('globalwar/battles/', {
			'clan_id': clan_id,
			'map_id': map_id,
			'language': this.language
		}, callback);
	};

	this.getClanWarsProvinces = function (map_id, province_id, callback) {
		this.callApi('globalwar/provinces/', {
			'map_id': map_id,
			'province_id': province_id,
			'language': this.language
		}, callback);
	};

	this.getClanDetail = function (clan_id, callback) {
		this.callApi('clan/info/', {
			'clan_id': clan_id
		}, callback);
	};

	this.getClanWarsMaps = function (callback) {
		this.callApi('globalwar/maps/', {}, callback);
	};
	
	this.searchClan = function(search, limit, callback){
		this.callApi('clan/list/', {
			'search': search,
			'limit': limit
		}, callback);
	};
	
	this.getClanWarsTournaments = function (province_id, map_id, callback){
		this.callApi('globalwar/tournaments/', {
			'map_id': map_id,
			'province_id': province_id,
			'language': this.language
		}, callback);
	};
};