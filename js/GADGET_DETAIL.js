var GADGET_DETAIL = new function(){
	this.battle = false;
	this.clan = false;
	this.province = false;
	
	this.showInfo = function(){
		var dataBattle = $(System.Gadget.document).find('tr.selected').attr('data-battle');
		if(dataBattle){
			this.battle = JSON.parse(dataBattle);

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
		}
		
		var dataProvince = $(System.Gadget.document).find('tr.selected').attr('data-province');
		if(dataProvince){
			this.province = JSON.parse(dataProvince);
		}
		
	};
	
	this.refreshInfo = function(){
		
	};
	
};