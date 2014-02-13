require('./UPPERCASE/BOOT.js');

BOOT({
	CONFIG : {
		defaultBoxName : 'FlappyBug',
		isDevMode : true,
		
		Facebook : {
			appId : '663125710416253'
		}
	},
	SERVER_CONFIG : {
		isNotUsingDB : true
	},
	BROWSER_CONFIG : {
		isSupportHD : false
	}
});
