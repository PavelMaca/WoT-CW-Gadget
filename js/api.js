var WG_API = new function () {

	this.application_id = null;
	this.url = null;
	this.language = null;

	this.init = function (application_id, server, language) {
		this.application_id = application_id;
		this.url = "https://api.worldoftanks." + server + "/wot/";
		this.language = language;

		//Set jQuery tu support cross domain reguests
		$.support.cors = true;
	};

	/**
	 * @param {string} section
	 * @param {object} params
	 * @param {object} callback
	 */
	this.callApi = function (section, params, callback) {
		params.application_id = this.application_id;

		var success = function (data) {
			if (data.status === 'ok') {
				callback(data);
			} else {
				console.log(data);
			}
		}
		$.getJSON(this.url + section, params, success);

		return;
	};


	this.getClanWarsBattles = function (clan_id, map_id, callback) {
		this.callApi('globalwar/battles/', {
			'clan_id': clan_id,
			'map_id': map_id
		}, callback);
		return;
	};

	this.getClanWarsProvinces = function (map_id, province_id, callback) {
		this.callApi('globalwar/provinces/', {
			'map_id': map_id,
			'province_id': province_id,
			'language': this.language
		}, callback);
		return;
	};

	this.getClanDetail = function (clan_id, callback) {
		this.callApi('clan/info/', {
			'clan_id': clan_id
		}, callback);
		return;
	};

	this.getClanWarsMaps = function (callback) {
		this.callApi('globalwar/maps/', {}, callback);
		return;
	};
};

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
				}
				callback();
			});
		} else {
			callback();
		}
	};

	this.getUrl = function (map_id, province_id) {
		return Maps.getMapUrl(map_id) + '?province=' + province_id;
	}
};

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


var GADGET = new function () {

	/** WG_API variables */
	this.application_id = '074e2be687a9e965d9ae51d748840bd7';
	this.server = 'eu';
	this.language = 'cs';

	/** Clan setting */
	this.clan_id = '500035588';
	this.map_id = '1';

	/**
	 * @var int Refrash rate for CW info in secunds
	 */
	this.refrashRate = 60;

	/**
	 * @var Array List areas_id to be loaded
	 */
	this.provinceQueue = {};

	this.init = function () {
		console.log('GADGET.init()');
		//System.Gadget.Flyout.onShow = this.handleFlyoutShow;
		
		WG_API.init(this.application_id, this.server, this.language);
	};
	
	this.loadBattles = function(fn){
		Maps.load(function () {
			//setTimeout(this.reloadData, this.refrashRate * 1000);
			Battles.reload(GADGET.clan_id, GADGET.map_id, function () {
				fn();
			});
		});
	};

	this.refreshInfo = function () {
		console.log('refreshInfo()');
		for (var i = 0; i < Battles.data.length; i++) {
			this.createRow(Battles.data[i]);
		}
		console.log('refreshInfo() - done');
	};

	// řádek v tabulce s bitvami
	this.createRow = function (battle) {
		// show only battles older then (now - 15 minutes)
		var now = new Date();
		if (battle.time * 1000 < now.getTime() - 900000) { // battle time < now - 15min
		//	return;
		}

		var row = $('#rowTamplate').clone();

		//time
		var battle_time_text;
		if (battle.time > 0) {
			var battle_time = new Date(battle.time * 1000);
			battle_time_text = battle_time.getHours() + ':' + battle_time.getMinutes();
		} else {
			battle_time_text = '--:--';
		}

		row.find('.battleTime').text(battle_time_text);

		//map name
		row.find('.map').text(battle.arenas[0]['name_i18n']);

		//province
		var province = Provinces.get(battle.provinces[0]);
		if (province) {
			row.find('.province').text(province.province_i18n);

			//url
			var map_url = Provinces.getUrl(this.map_id, province.province_id);
			row.find('.url').attr('href', map_url);
		}
		
		row.attr('data-battle', JSON.stringify(battle));

		$('table tbody').append(row);
		row.show()();
	};
	
	this.onFlyoutHide = function(){
		$('tr.selected').removeClass('selected');
	};
	
	this.toggleDetail = function(obj){
		if($(obj).hasClass('selected')){
			this.hideDetail(obj);
		}else{
			this.showDetail(obj);
		}
	};
	
	this.showDetail = function(obj){
		//remove .selected from all rows
		$('tr.selected').removeClass('selected');
		
		System.Gadget.Flyout.file = "detail.html";
		System.Gadget.Flyout.onHide = this.onFlyoutHide;
		System.Gadget.Flyout.show = true;
		
		$(obj).on('click', this.toggleDetail);
		$(obj).addClass('selected');
	};
	
	this.hideDetail = function(obj){
		$(obj).removeClass('selected');
		System.Gadget.Flyout.show = false;
	};
};

var GADGET_DETAIL = new function(){
	this.showInfo = function(){
		var data = $(System.Gadget.document).find('tr.selected').attr('data-battle');
		var battle = JSON.parse(data);
		
		$('.type').text(battle.type);

		$('.map').text(battle.arenas[0]['name_i18n']);
		
		var battle_time_text;
		if (battle.time > 0) {
			var battle_time = new Date(battle.time * 1000);
			battle_time_text = battle_time.getHours() + ':' + battle_time.getMinutes();
		} else {
			battle_time_text = '--:--';
		}
		$('.battleTime').text(battle_time_text);
		
		//console.log(JSON.stringify(data));
		/*
		var province_id = data.provinceId;
		for (var i = 0; i < Battles.data.length; i++) {
			console.log(Battles.data[i].provinces[0].province_id);
			console.log(province_id);
			if(Battles.data[i].provinces[0].province_id == province_id){
				
				
			}
		}*/
	};
	
};