/**
 * FlappyBug home view.
 */
FlappyBug.HomeView = CLASS({

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(cls, inner, self) {'use strict';

		var
		// button style
		buttonStyle,

		// modal
		modal,

		// close.
		close;

		TITLE('FlappyBug :: Home');

		modal = UUI.MODAL({
			isCannotClose : true,
			wrapperStyle : {
				backgroundColor : '#73BE31',
				zIndex : 999
			},
			contentStyle : {
				padding : 20,
				paddingBottom : 15,
				textAlign : 'center'
			},
			children : [

			// title
			H1({
				children : [IMG({
					src : FlappyBug.R('logo.png')
				}), '\nbuilt with UPPERCASE']
			}),

			// html5 canvas start button
			UUI.BUTTON({
				style : buttonStyle = {
					marginTop : 10,
					padding : 10,
					backgroundColor : '#fff',
					color : '#666',
					borderRadius : 10
				},
				title : 'CANVAS START',
				onTap : function() {
					BROWSER_CONFIG.USCREEN = {
						isLayerOnCanvas : true
					};
					FlappyBug.GO('Game');
				}
			}),

			// dom start button
			UUI.BUTTON({
				style : buttonStyle,
				title : 'DOM START',
				onTap : function() {
					BROWSER_CONFIG.USCREEN = {
						isLayerOnCanvas : false
					};
					FlappyBug.GO('Game');
				}
			}),

			// get source code button.
			DIV({
				style : {
					marginTop : 10
				},
				children : [A({
					href : 'https://github.com/BTNcafe/FlappyBug',
					target : '_blank',
					children : ['SOURCE']
				}), ' · ', A({
					href : 'http://uppercase.io',
					target : '_blank',
					children : ['UPPERCASE.IO']
				})]
			}),

			// facebook like button
			Facebook.LikeButton({
				style : {
					marginTop : 10
				},
				href : 'http://flappybug.uppercase.io',
				layout : 'button_count'
			})]
		});

		ANIMATE({
			node : modal,
			keyframes : KEYFRAMES({
				from : {
					transform : 'scaleY(0)'
				},
				to : {
					transform : 'scaleY(100%)'
				}
			}),
			duration : 0.2,
			timingFunction : 'ease-out'
		});

		//OVERRIDE: self.close
		self.close = close = function(params) {

			TITLE(CONFIG.defaultTitle);

			ANIMATE({
				node : modal,
				keyframes : KEYFRAMES({
					from : {
						transform : 'scaleY(100%)'
					},
					to : {
						transform : 'scaleY(0)'
					}
				}),
				duration : 0.2,
				timingFunction : 'ease-in'
			}, function() {
				modal.remove();
			});
		};
	}
});
