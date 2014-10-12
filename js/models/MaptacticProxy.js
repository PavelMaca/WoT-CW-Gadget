var MaptacticProxy = new function(){
	this.areas = {
		'39_crimea': '3eb174e088051108064d3860730a925583b0a636',
		'02_malinovka': 'f76238c0b9769ce88a2cb5f0a45e5c9adf0fcfbe',
		'06_ensk': 'e5e2d236be49d0fee3369736e3215a5906f8744a'
		
	};
	
	
	this.getMapUrl = function(area_id, type){
		if(!this.areas[area_id]){
			return false;
		}
		return 'https://maptactic-production.s3.amazonaws.com/packs/maps/4881/'+type+'_'+this.areas[area_id]+'.jpg';
	};
};

