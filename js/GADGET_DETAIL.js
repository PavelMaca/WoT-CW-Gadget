var GADGET_DETAIL = new function () {
	this.battle = false;
	this.clan = false;
	this.province = false;

	this.showInfo = function () {
		console.log('showInfo()');
		var data = $(System.Gadget.document).find('#list .row.selected').attr('data');
		if (!data) {
			console.log('no data');
			return;
		}
		data = JSON.parse(data);
		

		$('.type').text(data.type);
		
		$('.map').text(data.area.name);
		$('.map').attr('href', MaptacticProxy.getMapUrl(data.area.id, 'map'));

		$('.battleTime').text(data.battleTime);
		
		$('.province').text(data.province.name);
		$('.province').attr('href', data.province.url);
		
		$('.owner .tag').text(data.owner.tag);
		$('.owner').attr('href', data.owner.url);
		$('.owner .logo').attr('src', data.owner.logo);
		
		$('.income').text(data.income);
		
		var minimap =  MaptacticProxy.getMapUrl(data.area.id, 'thumb');
		if(minimap){
			var img = $('<img />');
			img.attr('src', MaptacticProxy.getMapUrl(data.area.id, 'thumb'));
			img.attr('height', 168);
			img.attr('width', 168);
			$('.mapImage').append(img);;
		}
		
		GADGET.setBodyHeight();

	};

	this.refreshInfo = function () {

	};

};