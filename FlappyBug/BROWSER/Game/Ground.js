/**
 * FlappyBug ground in game.
 */
FlappyBug('Game').Ground = CLASS({

	init : function(cls, inner, self) {'use strict';

		var
		// ground loop
		groundLoop,

		// layer
		layer,

		// append to.
		appendTo,

		// remove.
		remove,

		// remove ground loop.
		removeGroundLoop;

		layer = USCREEN.LAYER({
			zIndex : 2
		});

		EVENT({
			node : IMG({
				src : FlappyBug.R('ground.png')
			}),
			name : 'load'
		}, function(e, img) {

			var
			// left
			left;

			// generate ground layers.
			for ( left = 0; left < FlappyBug.GameView.gameWidth; left += img.getWidth()) {
				USCREEN.LAYER({
					img : img,
					left : left,
					top : 400
				}).appendTo(layer);
			}
			USCREEN.LAYER({
				img : img,
				left : left,
				top : 400
			}).appendTo(layer);

			// move ground loop
			left = 0;
			groundLoop = LOOP(function() {
				left -= 2;
				layer.moveTo({
					left : left
				});

				if (left <= -img.getWidth()) {
					left = 0;
				}
			});
		});

		// when remove layer.
		layer.addAfterRemoveProc(function() {
			if (groundLoop !== undefined) {
				groundLoop.remove();
			}
		});

		self.appendTo = appendTo = function(parent) {
			//REQUIRED: parent

			layer.appendTo(parent);

			return self;
		};

		self.remove = remove = function() {
			layer.remove();
		};

		self.removeGroundLoop = removeGroundLoop = function() {
			if (groundLoop !== undefined) {
				groundLoop.remove();
				groundLoop = undefined;
			}
		};
	}
});
