var GADGET = new function () {

	/** WG_API variables */
	this.application_id = '074e2be687a9e965d9ae51d748840bd7';
	this.server = 'eu';
	this.language = 'cs';

	/** Clan setting */
	this.clan_id = '500035588';
	this.map_id = '1'; //TODO: načíst podle clanu (nově k dispozici)

	/**
	 * @var int Refrash rate for CW info in secunds
	 */
	this.refrashRate = 60;


	this.init = function () {
		console.log('GADGET.init()');
		//System.Gadget.Flyout.onShow = this.handleFlyoutShow;

		WG_API.init(this.application_id, this.server, this.language);

		/** TODO udělat synchroně 
		 Clans.addToQueue(this.clan_id);
		 Clans.loadQueue(function(){
		 GADGET.clan = Clans.get(GADGET.clan_id);
		 });
		 */
	};

	this.loadBattles = function () {
		Maps.load(function () {
			//setTimeout(this.reloadData, this.refrashRate * 1000);
			Battles.reload(GADGET.clan_id, GADGET.map_id, function () {
				GADGET.refreshInfo();
			});
		});
	};

	this.refreshInfo = function () {
		console.log('refreshInfo()');
		
		console.log(Battles.data.length);

		var times = {};
		for (var i = 0; i < Battles.data.length; i++) {
			var time_array = Battles.getBattleTime(Battles.data[i]);
			var time = time_array[0] * 60 + parseInt(time_array[1]);
			if (!times.hasOwnProperty(time)) {
				times[time] = new Array();
			}
			times[time].push(i);
			console.log(time);
		}

		var keys = Object.keys(times);
		keys.sort();

		if(IS_SIDEBAR){
			System.Gadget.Flyout.show = false;
		}
		$('table .row').remove();
		
		var rows = 0;
		for (var time in times) {
			for (var i = 0; i < times[time].length; i++) {
				var result = this.createRow(Battles.data[times[time][i]]);
				if(result === true){
					rows++;
				}
			}
		}
		
		if(rows == 0){
			var tr = $('<tr>');
			tr.addClass('row');
			var td = $('<td>');
			td.attr('colspan', 3);
			td.text('No Clan Wars');
			tr.append(td);
			$('table').append(tr);
		}
		
		this.setBodyHeight();
		console.log('refreshInfo() - done');
	};

	// řádek v tabulce s bitvami
	this.createRow = function (battle) {
		// show only battles older then (now - 15 minutes)
		var now = new Date();
		if (battle.time > 0 && battle.time * 1000 < now.getTime() - 900000) { // battle time > 0 &&  battle time < now - 15min
			return false;
		}

		var row = $('#rowTamplate').clone();
		row.removeAttr('id');
		row.addClass('row');
		
		var data = {};

		//area name
		var area = battle.arenas[0];
		data.area = {};

		data.area.name = area['name_i18n'];
		row.find('.map').text(data.area.name);

		data.area.id = area.arena_id;

		//province
		var province = Provinces.get(battle.provinces[0]);
		if (province) {
			data.province = {};
			data.province.id = province.province_id;

			data.province.name = province.province_i18n;
			row.find('.province').text(data.province.name);

			//url
			var map_url = Provinces.getUrl(this.map_id, province.province_id);
			data.province.url = map_url;
			row.find('.url').attr('href', map_url);

			data.owner = {};
			data.owner.id = province.clan_id;
			data.owner.tag = Clans.get(province.clan_id).abbreviation;
			data.owner.logo = Clans.get(province.clan_id).emblems.small;
			data.owner.url = Clans.getUrl(province.clan_id, this.server);
			data.income = province.revenue;
		}

		var time_array = Battles.getBattleTime(battle);
		var battle_time_text = time_array[0] + ':' + time_array[1] + (time_array[2] == '+' ? '+' : '');
		row.find('.battleTime').text(battle_time_text);
		data.battleTime = battle_time_text;

		//battle type
		if (battle.type === 'for_province') {
			if (GADGET.clan_id == data.owner.id) {
				data.type = 'defend';
			} else {
				data.type = 'attack';
			}
		} else {
			data.type = battle.type;
		}

		row.attr('data', JSON.stringify(data));
		$('table tbody').append(row);
		row.show();
		
		return true;
	};

	this.onFlyoutHide = function () {
		$('tr.selected').removeClass('selected');
	};

	this.toggleDetail = function (obj) {
		if ($(obj).hasClass('selected')) {
			this.hideDetail(obj);
		} else {
			this.showDetail(obj);
		}
	};

	this.showDetail = function (obj) {
		//remove .selected from all rows
		$('tr.selected').removeClass('selected');

		if(IS_SIDEBAR){
			System.Gadget.Flyout.file = "detail.html";
			System.Gadget.Flyout.onHide = this.onFlyoutHide;
			System.Gadget.Flyout.show = true;
		}else{
			$.support.cors = true;
			$.get('detail.html', {}, function(data){
				$('body').append(data);
			});
		}

		$(obj).on('click', this.toggleDetail);
		$(obj).addClass('selected');
	};

	this.hideDetail = function (obj) {
		$(obj).removeClass('selected');
		System.Gadget.Flyout.show = false;
	};

	this.formatTime = function (timestamp, showSeconds) {
		if (showSeconds === undefined) {
			showSeconds = false;
		}
		var time = new Date(timestamp);
		return time.getHours() + ':' + time.getMinutes() + (showSeconds ? ':' + time.getSeconds() : '');
	};

	// Sets the height of the body
	this.setBodyHeight = function () {
		//	$('body').height(500+'px');
		//	return;
		var debug = $('#debug').height();
		var height = Number($('table').height()) + Number(debug);
		$('body').height(height+'px');
	}
};