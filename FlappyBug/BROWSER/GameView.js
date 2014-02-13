/**
 * FlappyBug game view.
 */
FlappyBug.GameView = CLASS({

	statics : function(cls) {'use strict';

		// game screen size.
		cls.gameWidth = 360;
		cls.gameHeight = 480;
	},

	preset : function() {'use strict';
		return VIEW;
	},

	init : function(cls, inner, self) {'use strict';

		var
		// bgm
		bgm = SOUND({
			mp3 : FlappyBug.R_URI('bgm.mp3'),
			ogg : FlappyBug.R_URI('bgm.ogg'),
			isLoop : true
		}).play(),

		// score store
		scoreStore = FlappyBug.STORE('score'),

		// pass pipe count
		passPipeCount = 0,

		// is started
		isStarted,

		// is game over
		isGameOver,

		// create pipe interval
		createPipeInterval,

		// update canvas loop
		updateCanvasLoop,

		// keydown event
		keydownEvent,

		// resize event
		resizeEvent,

		// wrapper
		wrapper,

		// count panel
		countPanel,

		// start panel
		startPanel,

		// end modal
		endModal,

		// surface
		surface,

		// center
		center,

		// ground
		ground,

		// bug
		bug,

		// pipes
		pipes = [],

		// start game.
		startGame,

		// close.
		close;

		TITLE('FlappyBug :: Game');

		wrapper = DIV({
			style : {
				position : 'absolute',
				left : 0,
				top : 0,
				width : '100%',
				height : '100%'
			},
			childs : [

			// game surface
			surface = USCREEN.SURFACE({
				style : {
					position : 'absolute',
					left : 0,
					top : 0,
					backgroundColor : '#00C4D3'
				}
			}),

			// start panel
			startPanel = UUI.V_CENTER({
				wrapperStyle : {
					position : 'absolute',
					left : 0,
					top : 0,
					width : '100%',
					height : '100%'
				},
				childs : [UUI.PANEL({
					wrapperStyle : {
						width : 150,
						margin : 'auto',
						backgroundColor : '#73BE31',
						border : '5px solid #666'
					},
					contentStyle : {
						padding : 10
					},
					childs : [P({
						style : {
							fontSize : 12
						},
						childs : [BROWSER_CONFIG.USCREEN === undefined || BROWSER_CONFIG.USCREEN.isLayerOnCanvas === true ? 'HTML5 Canvas Mode' : 'DOM Mode']
					}), P({
						childs : ['BEST SCORE: ', (scoreStore.get('best') === undefined ? 0 : scoreStore.get('best'))]
					}), P({
						style : {
							fontSize : 12
						},
						childs : ['TOUCH or\nSPACE KEY/CLICK\nto START!']
					})]
				})]
			}),

			// pass pipe count panel
			countPanel = DIV({
				style : {
					position : 'absolute',
					left : 0,
					top : 0,
					textAlign : 'center',
					zIndex : 999,
					width : '100%',
					fontSize : 20,
					marginTop : 10,
				},
				childs : [0]
			})],

			on : {
				// when touch screen.
				touchstart : function(e) {

					// start game.
					if (isStarted !== true) {
						isStarted = true;
						startGame();
					}

					bug.jump();

					e.stop();
				}
			}
		}).appendTo(BODY);

		// show start panel.
		ANIMATE({
			dom : startPanel.getDom(),
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

		// init surface size.
		surface.setSize({
			width : cls.gameWidth,
			height : cls.gameHeight
		});

		// init stage center.
		center = USCREEN.LAYER().appendTo(surface);

		// create ground.
		ground = FlappyBug.Game.Ground().appendTo(center);

		// create bug.
		bug = FlappyBug.Game.Bug(

		// when game over.
		function() {

			var
			// modal
			modal,

			// button style
			buttonStyle;

			isGameOver = true;

			// stop bgm.
			bgm.stop();

			// remove move ground loop.
			ground.removeGroundLoop();

			// remove create pipe interval.
			clearInterval(createPipeInterval);

			// remove move pipe loops.
			EACH(pipes, function(pipe) {
				pipe.removeMoveLoop();
			});

			// save best score.
			if (scoreStore.get('best') === undefined || parseInt(scoreStore.get('best'), 10) < passPipeCount) {
				scoreStore.save({
					key : 'best',
					value : passPipeCount
				});
			}

			// create end modal.
			endModal = UUI.MODAL({
				wrapperStyle : {
					width : 200,
					margin : 'auto',
					backgroundColor : '#73BE31',
					border : '5px solid #666'
				},
				contentStyle : {
					padding : 10
				},
				isCannotClose : true,
				childs : [

				// scores
				P({
					childs : ['YOUR SCORE: ', passPipeCount]
				}), P({
					childs : ['BEST SCORE: ', scoreStore.get('best')]
				}),

				// home button
				UUI.BUTTON({
					style : buttonStyle = {
						marginTop : 10,
						padding : 10,
						backgroundColor : '#fff',
						color : '#666',
						borderRadius : 10
					},
					msg : 'HOME',
					onTap : function() {
						FlappyBug.GO('');
					}
				}),

				// restart button
				UUI.BUTTON({
					style : buttonStyle,
					msg : 'RESTART',
					onTap : function() {
						FlappyBug.GO('Restart');
					}
				}), P({
					style : {
						marginTop : 10,
						fontSize : 12
					},
					childs : ['or SPACE KEY to RESTART.']
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

			// hide end modal.
			ANIMATE({
				dom : endModal.getDom(),
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

		}).appendTo(center);

		startGame = function() {

			// hide start panel.
			ANIMATE({
				dom : startPanel.getDom(),
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
				startPanel.remove();
			});

			// init create pipe interval.
			createPipeInterval = setInterval(function() {

				// create pipe.
				pipes.push(FlappyBug.Game.Pipe({
					pipes : pipes,
					bug : bug
				}, function() {

					passPipeCount += 1;

					countPanel.removeAllChilds();
					countPanel.append(passPipeCount);

				}).appendTo(center));

			}, 2000);
		};

		// init keydown event.
		keydownEvent = EVENT({
			name : 'keydown'
		}, function(e) {

			// when keydown space key.
			if (e.getKeyCode() === 32) {

				// start game.
				if (isStarted !== true) {
					isStarted = true;
					startGame();
				}

				bug.jump();

				// restart game.
				if (isGameOver === true) {
					FlappyBug.GO('Restart');
				}

				e.stop();
			}
		});

		// init resize event.
		resizeEvent = EVENT({
			name : 'resize'
		}, RAR(function() {

			var
			// wrapper width
			wrapperWidth = wrapper.getWidth(),

			// wrapper height
			wrapperHeight = wrapper.getHeight(),

			// scale
			scale = wrapperWidth / cls.gameWidth < wrapperHeight / cls.gameHeight ? wrapperWidth / cls.gameWidth : wrapperHeight / cls.gameHeight,

			// size
			size = surface.setScale(scale);

			surface.addStyle({
				left : (wrapperWidth - size.width) / 2,
				top : (wrapperHeight - size.height) / 2
			});

			countPanel.addStyle({
				top : (wrapperHeight - size.height) / 2
			});

		}));

		// init update canvas loop.
		updateCanvasLoop = LOOP(function() {
			center.updateCanvas();
		});

		//OVERRIDE: self.close
		self.close = close = function(params) {

			TITLE(CONFIG.defaultTitle);

			// remove doms.
			wrapper.remove();

			if (endModal !== undefined) {

				ANIMATE({
					dom : endModal.getDom(),
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
					endModal.remove();
				});
			}

			// remove loops and intervals.
			updateCanvasLoop.remove();
			clearInterval(createPipeInterval);

			// remove events.
			keydownEvent.remove();
			resizeEvent.remove();

			// stop bgm.
			if (isGameOver !== true) {
				bgm.stop();
			}
		};
	}
});
