OVERRIDE({
	origin : EVENT_LOW,
	func : function(origin) {'use strict';

		/**
		 * Low event class (fix for IE.)
		 */
		global.EVENT_LOW = CLASS({

			preset : function(cls, params) {
				//REQUIRED: params
				//OPTIONAL: params.node
				//REQUIRED: params.name

				var
				// node
				node = params.node,

				// name
				name = params.name,

				// el
				el;

				if (node !== undefined) {
					el = node.getDom().getEl();
				} else if (global['on' + name] === undefined) {
					el = document;
				} else {
					el = global;
				}

				if (el.addEventListener === undefined) {
					el.addEventListener = function(name, func, b) {
						el.attachEvent('on' + name, func);
					};
				}

				return origin;
			},

			init : function(cls, inner, self, params, func) {
				//REQUIRED: params
				//OPTIONAL: params.node
				//REQUIRED: params.name
				//REQUIRED: func

				var
				// node
				node = params.node,

				// name
				name = params.name,

				// el
				el,

				// hash
				hash,

				// hashchange interval
				hashchangeInterval,

				// inner func.
				innerFunc = inner.innerFunc,

				// remove.
				remove;

				if (node !== undefined) {
					el = node.getDom().getEl();
				} else if (global['on' + name] === undefined) {
					el = document;
				} else {
					el = global;
				}

				// IE8 이하에서 캐시된 이미지일 경우 load 이벤트가 발생하지 않는 문제
				if (name === 'load' && el.complete !== undefined && IE.version <= 8) {

					RUN(function() {

						var
						// interval
						interval;

						interval = setInterval(RAR(function() {
							if (el.complete === true) {

								clearInterval(interval);

								try {
									innerFunc();
								} catch(e) {
									// ignore.
								}
							}
						}), 100);
					});
				}

				if (el.detachEvent !== undefined) {

					OVERRIDE({
						origin : self.remove,
						func : function(origin) {

							self.remove = remove = function() {

								if (name === 'hashchange' && global.onhashchange === undefined) {
									origin();
								} else {
									el.detachEvent('on' + name, innerFunc);
								}
							};
						}
					});
				}

				if (window.navigator.msPointerEnabled === true) {

					// disables system menu.
					el.addEventListener('contextmenu', function(e) {
						e.preventDefault();
					}, false);

					// disables block.
					el.addEventListener('selectstart', function(e) {
						e.preventDefault();
					}, false);

					if (name === 'touchstart') {
						el.style['-ms-touch-action'] = 'none';
						el.addEventListener('MSPointerDown', innerFunc);
					} else if (name === 'touchmove') {
						el.addEventListener('MSPointerMove', innerFunc);
					} else if (name === 'touchend') {
						el.addEventListener('MSPointerUp', innerFunc);
					}
				}

				if (name === 'hashchange' && IE.version <= 7) {

					hash = location.hash;
					hashchangeInterval = setInterval(function() {
						if (location.hash !== hash) {
							hash = location.hash;
							func(undefined, node);
						}
					}, 100);

					OVERRIDE({
						origin : self.remove,
						func : function(origin) {

							self.remove = remove = function() {
								clearInterval(hashchangeInterval);
							};
						}
					});
				}
			}
		});

	}
});
