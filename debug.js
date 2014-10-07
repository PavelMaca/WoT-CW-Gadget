var debugElem1,
	debugElem2,
	debugElem3;

function enableDebug() {
	var debugContainer = $('#debugContainer');
	debugContainer.append('<span id="debug1">debugger1</span>');
	debugElem1 = $("#debug1");

	debugContainer.append('<span id="debug2">debugger2</span>');
	debugElem2 = $("#debug2");

	debugContainer.append('<span id="debug3">debugger3</span>');
	debugElem3 = $("#debug3");
}

function mockAjaxRequest() {
	var dateNow = Math.round((new Date()).getTime() / 1000);
//	var mockResult = '{"request_data": {"items": [{"provinces": [{"id": "RU_06", "name": "Karelia"}], "started": false, "chips": null, "time": ' + (dateNow + 910) + ', "arenas": [{"id": "01_karelia", "name": "Karelia"}], "type": "for_province"}, {"provinces": [{"id": "RU_41", "name": "Arkhangelsk Region (East)"}], "started": false, "chips": null, "time": ' + (dateNow + 320) + ', "arenas": [{"id": "11_murovanka", "name": "Murovanka"}], "type": "for_province"}], "total_count": 2, "echo": 0, "offset": 0, "filtered_count": 2}, "result": "success"}';
	var mockResult = '{"request_data": {"items": [' +
		'{"provinces": [{"id": "RU_06", "name": "Karelia"}], "started": false, "chips": null, "time": ' + (dateNow + 40) + ', "arenas": [{"id": "01_karelia", "name": "Karelia"}], "type": "for_province"},' +
		'{"provinces": [{"id": "RU_41", "name": "Arkhangelsk Region (East)"}], "started": false, "chips": null, "time": ' + (dateNow + 320) + ', "arenas": [{"id": "11_murovanka", "name": "Murovanka"}], "type": "for_province"},' +
		'{"provinces": [{"id": "ES_07", "name": "Castile and Le\u00f3n"}], "started": false, "chips": null, "time": ' + (dateNow + 930) + ', "arenas": [{"id": "07_lakeville", "name": "Lakeville"}], "type": "for_province"},' +
		'{"provinces": [{"id": "ES_07", "name": "Castile and Le\u00f3n"}], "started": false, "chips": null, "time": ' + (dateNow + 2930) + ', "arenas": [{"id": "07_lakeville", "name": "Lakeville"}], "type": "for_province"},' +
		'{"provinces": [{"id": "ES_09", "name": "Basque Country"}], "started": false, "chips": null, "time": ' + (dateNow + 5000) + ', "arenas": [{"id": "03_campania", "name": "Province"}], "type": "for_province"}],' +
		' "total_count": 5, "echo": 0, "offset": 0, "filtered_count": 5}, "result": "success"}';


	getData = function () {
		jsonResult = JSON.parse(mockResult);
		display();
	}
}

function initDebug() {
	enableDebug();

	window.onerror = function(err) {
		debugElem3.html(debugElem3.html() + "error: " + err + "|<br/>");
		return true;
	}
}