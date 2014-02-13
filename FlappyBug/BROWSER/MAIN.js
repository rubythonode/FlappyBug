FlappyBug.MAIN = METHOD({

	run : function(m, params) {'use strict';

		// Home view.
		FlappyBug.MATCH_VIEW({
			uris : [''],
			target : FlappyBug.HomeView
		});

		// Game view.
		FlappyBug.MATCH_VIEW({
			uris : ['Game'],
			target : FlappyBug.GameView
		});

		// Restart view.
		FlappyBug.MATCH_VIEW({
			uris : ['Restart'],
			target : CLASS({

				preset : function() {
					return VIEW;
				},

				init : function(cls, inner, self) {
					FlappyBug.GO('Game');
				}
			})
		});
	}
});
