var Settings = new function () {
	/**
	 * List of servers and API keys
	 */
	this.servers = {
		'eu': {
			'name': '[EU] Europe', 
			'api': '074e2be687a9e965d9ae51d748840bd7'
		},
		'ru':{
			'name': '[RU] Россия', 
			'api': ''
		},
		'na':{
			'name': '[NA] America', 
			'api': ''
		},
		'asia':{
			'name': '[ASIA] Asia', 
			'api': ''
		},
		'kr':{
			'name': '[KR] 대한민국', 
			'api': ''
		}
	};
	
	/**
	 * List of availible laguages of API
	 */
	this.languages = {
		'en': 'English',
		'ru': 'Русский',
		'pl': 'Polski',
		'de': 'Deutsch',
		'fr': 'Français',
		'es': 'Español',
		'zh-cn': '简体中文',
		'tr': 'Türkçe',
		'cs': 'Čeština',
		'th': 'ไทย',
		'vi': 'Tiếng Việt',
		'ko': '한국어'
	};
	
	/**
	 * Default setting
	 */
	this.DEFAULT = {
		'server': 'eu',
		'language': 'en',
		'clan_id': null
	};
	

	this.init = function(){
		SettingsManager.loadFile();
	};
	
	/** @private */
	this.read = function(key){
		return SettingsManager.getValue('g', key, this.DEFAULT[key]);
	};
	
	/** @private */
	this.write = function(key, value){
		SettingsManager.setValue('g', key, value);
	};
	
	this.saveFile = function(){
		SettingsManager.saveFile();
	};
	
	this.getServer = function(){
		return this.read('server');
	};
	
	this.setServer = function(value){
		this.write('server', value);
	};
	
	this.getLanguage = function(){
		return this.read('language');
	};
	
	this.setLanguage = function(value){
		this.write('language', value);
	};
	
	this.getClanId = function(){
		return this.read('clan_id');
	};
	
	this.setClanId = function(value){
		this.write('clan_id', value);
	};
}


