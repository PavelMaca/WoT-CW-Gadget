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