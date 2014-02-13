/**
 * FlappyBug pipe in game.
 */
FlappyBug('Game').Pipe = CLASS({

	init : function(cls, inner, self, params, onPass) {'use strict';
		//REQUIRED: params
		//REQUIRED: params.pipes
		//REQUIRED: params.bug
		//REQUIRED: onPass

		var
		//IMPORT: FlappyBug.Game.Bug
		Bug = FlappyBug.Game.Bug,

		// pipes
		pipes = params.pipes,

		// bug
		bug = params.bug,

		// pass sound
		passSound = SOUND({
			mp3 : FlappyBug.R_URI('pass.mp3'),
			ogg : FlappyBug.R_URI('pass.ogg')
		}),

		// is passed
		isPassed,

		// left
		left = FlappyBug.GameView.gameWidth + 100,

		// top
		top = Math.random() * 250 + 100,

		// move loop
		moveLoop,

		// layer
		layer,

		// upipe
		upipe,

		// dpipe
		dpipe,

		// append to.
		appendTo,

		// remove.
		remove,

		// remove move loop.
		removeMoveLoop;

		layer = USCREEN.LAYER({
			left : left,
			top : top,
			zIndex : 1
		});

		// upside pipe
		upipe = USCREEN.LAYER({
			img : IMG({
				src : FlappyBug.R('upipe.png')
			}),
			top : -470
		}).appendTo(layer);

		// downside pipe
		dpipe = USCREEN.LAYER({
			img : IMG({
				src : FlappyBug.R('dpipe.png')
			}),
			top : 30
		}).appendTo(layer);

		moveLoop = LOOP(function() {

			var
			// bug position
			bugPosition = bug.getPosition(),

			// bug left
			bugLeft = bugPosition.left,

			// bug top
			bugTop = bugPosition.top;

			// move pipe layer.
			left -= 2;
			layer.moveTo({
				left : left
			});

			// when touches this pipe.
			if (bugLeft - Bug.halfCollisionWidth < left + 40 && left < bugLeft + Bug.halfCollisionWidth && bugTop - Bug.halfCollisionHeight < top - 70 && top - 470 < bugTop + Bug.halfCollisionHeight) {
				bug.die();
			} else if (bugLeft - Bug.halfCollisionWidth < left + 40 && left < bugLeft + Bug.halfCollisionWidth && bugTop - Bug.halfCollisionHeight < top + 430 && top + 30 < bugTop + Bug.halfCollisionHeight) {
				bug.die();
			}

			// when pass this pipe.
			if (isPassed !== true && bugLeft - Bug.halfCollisionWidth >= left && left + 40 >= bugLeft + Bug.halfCollisionWidth) {
				onPass();
				isPassed = true;

				passSound.play();
			}

			// remove pipe.
			if (left < -100) {
				remove();
			}
		});

		// when remove layer.
		layer.addAfterRemoveProc(function() {
			if (moveLoop !== undefined) {
				moveLoop.remove();
			}

			REMOVE({
				data : pipes,
				value : self
			});
		});

		self.appendTo = appendTo = function(parent) {
			//REQUIRED: parent

			layer.appendTo(parent);

			return self;
		};

		self.remove = remove = function() {
			layer.remove();
		};

		self.removeMoveLoop = removeMoveLoop = function() {
			if (moveLoop !== undefined) {
				moveLoop.remove();
				moveLoop = undefined;
			}
		};
	}
});
