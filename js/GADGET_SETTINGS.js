var GADGET_SETTINGS = new function () {
	this.init = function () {
		this.setBodyHeight();
		
		Settings.init();
		
		this.createSelect($('#server'), Settings.servers,  Settings.getServer());
		this.createSelect($('#language'), Settings.languages,  Settings.getLanguage());

		$('#server').on('change', function () {
			Settings.setServer($(this).val());
			
			GADGET_SETTINGS.initApi();
		});

		$('#language').on('change', function () {
			Settings.setLanguage($(this).val());
			
			GADGET_SETTINGS.initApi();
		});
		
		this.initApi();
		
		var clan_id = Settings.getClanId();
		if(clan_id !== null){
			WG_API.getClanDetail(clan_id, function (data) {
				if(data.count === 1){
					for (var clan_id in data.data) {
						var use = {
							'id': clan_id,
							'logo': data.data[clan_id].emblems.small,
							'tag': data.data[clan_id].abbreviation
						};
						GADGET_SETTINGS.setSelectedClan(use);
					}
				}
			});
		}

		System.Gadget.onSettingsClosed = this.onSettingClose;
	};
	
	this.initApi = function(){
		var server = Settings.getServer();
		var application_id = Settings.servers[server]['api'];
		var language = Settings.getLanguage();
		
		WG_API.init(application_id, server, language);
	};

	this.onSettingClose = function (event) {
		// Save the settings if the user clicked OK.
		if (event.closeAction === event.Action.commit)
		{
			Settings.saveFile();
			System.Gadget.document.parentWindow.GADGET.loadSettings();
		}
	};

	this.createSelect = function (el, values, selected) {
		for (var key in values) {
			var option = $('<option>');
			option.val(key);

			var value = '';
			if (values[key] instanceof Object) {
				value = values[key]['name'];
			} else {
				value = values[key];
			}

			option.text(value);
			if (key === selected) {
				option.attr('selected', 'selected');
			}
			el.append(option);
		}
	};

	this.updateClan = function (el) {
		try {
			var value = $(el).val();
			if (value.length < 3) {
				return;
			}

			$('#clanlist').html('');

			if (value.length > 5 && value.match(/[0-9]+/g)) {
				if (value.length == 9) {
					console.log('loading clan by ID...');
					WG_API.getClanDetail(value, function (data) {
						for (var clan_id in data.data) {
							GADGET_SETTINGS.addClanToList(data.data[clan_id]);
						}
						this.setBodyHeight();
					});
				}
			} else {
				console.log('searching clan..');
				WG_API.searchClan(value, 5, function (data) {
					for (var i = 0; i < data.data.length; i++) {
						GADGET_SETTINGS.addClanToList(data.data[i]);
					}
					this.setBodyHeight();
				});
			}
		} catch (e) {
			console.log(e.message);
		}

	};

	this.changeClan = function () {
		try {
			$('#searchClan input').val('');
			$('#clanlist').html('');

			$(".search").show();
			$("input[name=clan]").focus();
			this.setBodyHeight();
		} catch (e) {
			console.log(e.message);
		}
	};

	this.addClanToList = function (data) {
		var a = $('<a>');
		var use = {
			'id': data.clan_id,
			'logo': data.emblems.small,
			'tag': data.abbreviation
		};
		a.text(use.tag);
		a.attr('data', JSON.stringify(use));

		$('#clanlist').append(a);
		a.on('click', function () {
			var data = JSON.parse($(this).attr('data'));
			GADGET_SETTINGS.setSelectedClan(data);
			Settings.setClanId(data.id);
		});
	};
	
	this.setSelectedClan = function(data){
		var el = $("#selectedClan");
		console.log(data.logo);
		el.find('.logo').attr('src', data.logo);
		el.find('.logo').show();
		el.find('.tag').text(data.tag);
		el.find('.id').text(data.id);
		el.show();
		
		$(".search").hide();
		
		this.setBodyHeight();
	};

	// Sets the height of the body
	this.setBodyHeight = function () {
		var debug = $('#debug').innerHeight();
		var settings = $('table').innerHeight();

		var height = Number(settings) + Number(debug);
		$('body').height(height + 'px');
	}
};