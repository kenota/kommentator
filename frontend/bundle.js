/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, attributes /*, ...rest*/) {
  var node;
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) {
    rest.push(arguments[length]);
  }while (rest.length) {
    if ((node = rest.pop()) && node.pop /* Array? */) {
        for (length = node.length; length--;) {
          rest.push(node[length]);
        }
      } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(attributes || {}, children) : {
    nodeName: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  };
}

function app(state, actions, view, container) {
  var renderLock;
  var invokeLaterStack = [];
  var rootElement = container && container.children[0] || null;
  var oldNode = rootElement && toVNode(rootElement, [].map);
  var globalState = clone(state);
  var wiredActions = clone(actions);

  scheduleRender(wireStateToActions([], globalState, wiredActions));

  return wiredActions;

  function toVNode(element, map) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : toVNode(element, map);
      })
    };
  }

  function render() {
    renderLock = !renderLock;

    var next = view(globalState, wiredActions);
    if (container && !renderLock) {
      rootElement = patch(container, rootElement, oldNode, oldNode = next);
    }

    while (next = invokeLaterStack.pop()) {
      next();
    }
  }

  function scheduleRender() {
    if (!renderLock) {
      renderLock = !renderLock;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var obj = {};

    for (var i in target) {
      obj[i] = target[i];
    }for (var i in source) {
      obj[i] = source[i];
    }return obj;
  }

  function set(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] = path.length > 1 ? set(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }
    return value;
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]];
    }
    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          if (typeof (data = action(data)) === "function") {
            data = data(get(path, globalState), actions);
          }

          if (data && data !== (state = get(path, globalState)) && !data.then // Promise
          ) {
              scheduleRender(globalState = set(path, clone(state, data), globalState));
            }

          return data;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = state[key] || {}, actions[key] = clone(actions[key]));
    }
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function setElementProp(element, name, value, isSVG, oldValue) {
    if (name === "key") {} else if (name === "style") {
      for (var i in clone(oldValue, value)) {
        element[name][i] = value == null || value[i] == null ? "" : value[i];
      }
    } else {
      if (typeof value === "function" || name in element && !isSVG) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSVG) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSVG = isSVG || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);

    if (node.attributes) {
      if (node.attributes.oncreate) {
        invokeLaterStack.push(function () {
          node.attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG));
      }

      for (var name in node.attributes) {
        setElementProp(element, name, node.attributes[name], isSVG);
      }
    }

    return element;
  }

  function updateElement(element, oldProps, attributes, isSVG) {
    for (var name in clone(oldProps, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldProps[name])) {
        setElementProp(element, name, attributes[name], isSVG, oldProps[name]);
      }
    }

    if (attributes.onupdate) {
      invokeLaterStack.push(function () {
        attributes.onupdate(element, oldProps);
      });
    }
  }

  function removeChildren(element, node, attributes) {
    if (attributes = node.attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node, cb) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    if (node.attributes && (cb = node.attributes.onremove)) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (node === oldNode) {} else if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element);
    } else if (node.nodeName && node.nodeName === oldNode.nodeName) {
      updateElement(element, oldNode.attributes, node.attributes, isSVG = isSVG || node.nodeName === "svg");

      var oldElements = [];
      var oldKeyed = {};
      var newKeyed = {};

      for (var i = 0; i < oldNode.children.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElements[i], oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < node.children.length) {
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKey(oldChild);
        var newKey = getKey(newChild);

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey == null) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChild, newChild, isSVG);
            j++;
          }
          i++;
        } else {
          var recyledNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, recyledNode[0], recyledNode[1], newChild, isSVG);
            i++;
          } else if (recyledNode[0]) {
            patch(element, element.insertBefore(recyledNode[0], oldElements[i]), recyledNode[1], newChild, isSVG);
          } else {
            patch(element, oldElements[i], null, newChild, isSVG);
          }

          j++;
          newKeyed[newKey] = newChild;
        }
      }

      while (i < oldNode.children.length) {
        var oldChild = oldNode.children[i];
        if (getKey(oldChild) == null) {
          removeElement(element, oldElements[i], oldChild);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[oldKeyed[i][1].key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    } else if (node.nodeName === oldNode.nodeName) {
      element.nodeValue = node;
    } else {
      element = parent.insertBefore(createElement(node, isSVG), nextSibling = element);
      removeElement(parent, nextSibling, oldNode);
    }
    return element;
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	AUTHOR_COOKIE_NAME: 'k-comm-author',
	RECAPTCHA_CALLBACK: '__recaptcha_done',
	STATE: {
		LOADED: "loaded",
		LOADING: "loading",
		UNKNOWN: "unknown"
	},
	RECAPTCHA_SCRIPT_NAME: "recaptcha_script",
	RECAPTCHA_DIV_PREFIX: "recaptcha_reply_"
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * (c) https://github.com/fend25/strg.js
 * License: MIT
 */
exports.default = {
	s: document.cookie,
	type: 'cookie',
	set: function set(name, value, expires, path, secure) {
		if (value !== undefined && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") var valueToUse = JSON.stringify(value);else var valueToUse = encodeURIComponent(value);

		document.cookie = name + "=" + valueToUse + (expires ? "; expires=" + new Date(expires).toUTCString() : '') + "; path=" + (path || '/') + (secure ? "; secure" : '');
	},
	get: function get(name) {
		var cookies = this.getAllRawOrProcessed(false);
		if (cookies.hasOwnProperty(name)) return this.processValue(cookies[name]);else return undefined;
	},
	processValue: function processValue(value) {
		if (value.substring(0, 1) == "{") {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		}
		if (value == "undefined") return undefined;
		return decodeURIComponent(value);
	},
	getAllRawOrProcessed: function getAllRawOrProcessed(process) {
		//process - process value or return raw value
		var cookies = document.cookie.split('; '),
		    s = {};
		if (cookies.length === 1 && cookies[0] === '') return s;
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].split('=');
			if (process) s[cookie[0]] = this.processValue(cookie[1]);else s[cookie[0]] = cookie[1];
		}
		return s;
	},
	getAll: function getAll() {
		return this.getAllRawOrProcessed(true);
	},
	remove: function remove(name) {
		this.set(name, "", -1);
	},
	removeAll: function removeAll() {
		var cookies = this.getAll();
		for (var i in cookies) {
			this.remove(i);
		}
		return this.getAll();
	}
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRecaptchaCallbackName = getRecaptchaCallbackName;
exports.getRecaptchaDivId = getRecaptchaDivId;

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRecaptchaCallbackName(commentId) {
    if (typeof commentId === 'undefined') {
        commentId = 'root';
    }

    return _const2.default.RECAPTCHA_CALLBACK + "_" + commentId;
}
function getRecaptchaDivId(commentId) {
    if (typeof commentId === 'undefined') {
        commentId = 'root';
    }
    return _const2.default.RECAPTCHA_DIV_PREFIX + commentId;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _hyperapp = __webpack_require__(0);

var _const = __webpack_require__(11);

var _const2 = _interopRequireDefault(_const);

var _util = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Conditionally renders reply form


var blankReply = {
	show: false,
	body: ""
};

exports.default = function (_ref) {
	var comment = _ref.comment,
	    author = _ref.author,
	    updateReply = _ref.updateReply,
	    sendReply = _ref.sendReply,
	    updateAuthor = _ref.updateAuthor,
	    settings = _ref.settings;

	var reply = comment.reply ? comment.reply : blankReply;
	var name = author && author.name ? author.name : "";
	var email = author && author.email ? author.email : "";
	var recaptchaDivId = (0, _util.getRecaptchaDivId)(comment.id);
	var loader = comment.postingReply ? (0, _hyperapp.h)(
		"div",
		{ "class": "loader-container" },
		(0, _hyperapp.h)("div", { "class": "loader" }),
		" "
	) : "";

	if (!reply.show) {
		return null;
	}

	return (0, _hyperapp.h)(
		"div",
		{ "class": "reply-form" },
		loader,
		(0, _hyperapp.h)(
			"textarea",
			{ placeholder: "What do you think?",
				oninput: function oninput(e) {
					return e.preventDefault() || updateReply({ comment: comment, field: "body", value: e.target.value });
				} },
			reply.body || ''
		),
		(0, _hyperapp.h)("input", { type: "text", placeholder: "Name", oninput: function oninput(e) {
				return e.preventDefault() || updateAuthor({ field: "name", value: e.target.value });
			}, value: name }),
		(0, _hyperapp.h)("input", { type: "text", placeholder: "Email (not published)", oninput: function oninput(e) {
				return e.preventDefault() || updateAuthor({ field: "email", value: e.target.value });
			}, value: email }),
		(0, _hyperapp.h)("div", { id: recaptchaDivId, "class": "g-recaptcha" }),
		(0, _hyperapp.h)(
			"button",
			{
				"class": "bttn-material-flat bttn-sm bttn-primary bttn-no-outline",
				onclick: function onclick(e) {
					return e.preventDefault() || sendReply({ comment: comment });
				} },
			"Send"
		)
	);
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(6);
module.exports = __webpack_require__(15);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _hyperapp = __webpack_require__(0);

var _actions = __webpack_require__(7);

var _actions2 = _interopRequireDefault(_actions);

var _state = __webpack_require__(9);

var _state2 = _interopRequireDefault(_state);

var _CommentList = __webpack_require__(10);

var _CommentList2 = _interopRequireDefault(_CommentList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {

	for (var _iterator = document.getElementsByClassName("k-comments")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var i = _step.value;

		//
		var localState = Object.assign({}, _state2.default);

		(0, _hyperapp.app)(localState, _actions2.default, _CommentList2.default, i).load({
			server: i.dataset.kServer,
			uri: i.dataset.kUri
		});
	}
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

var _cookies = __webpack_require__(2);

var _cookies2 = _interopRequireDefault(_cookies);

var _loadjs = __webpack_require__(8);

var _loadjs2 = _interopRequireDefault(_loadjs);

var _util = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// fetchPostCommon specifies default settings which are used with every fetch (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
// post request
var fetchPostCommon = {
	method: 'post',
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	},
	mode: 'cors'
};

function getAuthorCookieExpireTime() {
	return new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 5;
}

// Actions specifies a HyperApp actions which are responsible for updating the state based on events
// Note that are only allowed modify state if you just return an object with some fields in your action. If you want to do some async work,
// you need to execute another action to update your state
var actions = {
	// sendReply given the comment submits reply to server
	sendReply: function sendReply(_ref) {
		var comment = _ref.comment;
		return async function (state, actions) {
			comment.postingReply = true;
			actions.setNewState({ commentMap: state.commentMap });

			actions.withRecaptchaScript(function () {
				if (typeof comment.recaptcha !== 'undefined') {
					console.log('reseting recaptcha with widget id ', comment.recaptcha);
					grecaptcha.reset(comment.recaptcha);
				}

				var cbId = (0, _util.getRecaptchaCallbackName)(comment.id);
				var divId = (0, _util.getRecaptchaDivId)(comment.id);

				comment.recaptcha = grecaptcha.render(divId, {
					sitekey: state.settings.recaptcha.sitekey,
					size: 'invisible',
					callback: cbId,
					'error-callback': function errorCallback(e) {
						console.log("error recaptcha ", e);
					},
					'expired-callback': function expiredCallback(e) {
						console.log('expired-callback', e);
					}
				});
				console.log("loaded new recaptcha widget with id ", comment.recaptcha);
				window[cbId] = async function () {
					delete window[cbId];
					await actions.postReplyToServer({ comment: comment });
					// we need to reload updated comment
					var updated = state.commentMap[comment.id].postingReply = false;
					actions.setNewState({ commentMap: state.commentMap });
				};

				actions.setNewState({ commentMap: state.commentMap });

				grecaptcha.execute(comment.recaptcha);
			});

			return {};
		};
	},

	// postReplyToServer makes actual request to server and assumes that reply has all fields populated and all checks
	// are completed
	postReplyToServer: function postReplyToServer(_ref2) {
		var comment = _ref2.comment;
		return async function (state, actions) {

			var response = fetch(state.server + "api/v1/comment", Object.assign({}, fetchPostCommon, {
				body: JSON.stringify({
					body: comment.reply.body,
					email: state.author.email,
					author: state.author.name,
					uri: state.uri,
					parent: comment._isRootComment ? undefined : comment.id,
					recaptcha: "temp"
				})
			})).then(function (reply) {
				return reply.json();
			}).then(function (newComment) {
				state.commentMap[newComment.id] = newComment;
				if (comment._isRootComment) {
					state.rootComment.reply = {};
					state.commentOrderList.push(newComment.id);
				} else if (typeof state.commentMap[comment.id] !== 'undefined') {
					state.commentMap[comment.id].replies.push(newComment);
					state.commentMap[comment.id].reply = {};
				}

				comment.postingReply = false;
				actions.setNewState({ rootComment: state.rootComment, commentMap: state.commentMap, commentOrderList: state.commentOrderList });
			});
		};
	},

	// Update reply updates one field in the reply for specified comment
	updateReply: function updateReply(_ref3) {
		var comment = _ref3.comment,
		    field = _ref3.field,
		    value = _ref3.value;
		return function (state, actions) {
			if (typeof comment.reply === 'undefined') {
				comment.reply = {};
			}

			comment.reply[field] = value;

			if (comment._isRootComment) {
				return { rootComment: comment };
			}

			state.commentMap[comment.id] = comment;

			return { commentMap: state.commentMap };
		};
	},

	// updateAuthor updates specific field inside state.author path
	updateAuthor: function updateAuthor(_ref4) {
		var field = _ref4.field,
		    value = _ref4.value;
		return function (state, actions) {
			state.author[field] = value;
			_cookies2.default.set(_const2.default.AUTHOR_COOKIE_NAME, state.author, getAuthorCookieExpireTime());
			return {
				author: state.author
			};
		};
	},

	// setScriptLoaded makres scriptName as being loaded
	setScriptLoaded: function setScriptLoaded(scriptName) {
		return function (state, actions) {
			state.loadedScripts[scriptName] = true;

			return { loadedScripts: state.loadedScripts };
		};
	},

	// withRecaptchaScript checks if recaptcha script is loaded and then executes func. Note that func can not
	// return new state, but should use another action method to do that
	withRecaptchaScript: function withRecaptchaScript(func) {
		return function (state, actions) {
			if (state.loadedScripts[_const2.default.RECAPTCHA_SCRIPT_NAME]) {
				console.log("not loading recaptcha");
				setTimeout(func, 0);
			} else {
				console.log("loading recaptcha");
				actions.setNewState({ loadingScript: true });
				window[_const2.default.RECAPTCHA_CALLBACK] = function () {
					state.loadedScripts[_const2.default.RECAPTCHA_SCRIPT_NAME] = true;
					actions.setNewState({ loadingScript: false, loadedScripts: state.loadedScripts });
					delete window[_const2.default.RECAPTCHA_CALLBACK];

					func();
				};
				(0, _loadjs2.default)(["https://www.google.com/recaptcha/api.js?onload=" + _const2.default.RECAPTCHA_CALLBACK + "&render=explicit"]);
			}

			return {};
		};
	},

	// reacts sends reaction to specified comment, currently reaction of 'like' and 'dislike' are only one which are supported
	react: function react(_ref5) {
		var comment = _ref5.comment,
		    reaction = _ref5.reaction;
		return async function (state, actions) {
			var path = void 0;
			if (typeof comment === 'undefined' || typeof comment.id === 'undefined') {
				console.log("react(): comment or comment id are not present");
				return;
			}
			if (reaction === "dislike") {
				path = "dislike";
			} else if (reaction === "like") {
				path = "like";
			} else {
				console.log("unexpected reaction: ", reaction);
				return;
			}

			//TODO: error handling
			var res = await fetch(state.server + "api/v1/" + path, Object.assign({}, fetchPostCommon, {
				body: JSON.stringify({
					id: comment.id
				})
			}));

			state.commentMap[comment.id][path + 's']++;
			actions.setNewState({ commentMap: state.commentMap });
		};
	},

	// ToggleReplyForm toggles display of the reply form for specified comment
	toggleReplyForm: function toggleReplyForm(comment) {
		return function (state, actions) {
			if (typeof comment.reply === 'undefined') {
				comment.reply = {};
			}
			comment.reply.show = !comment.reply.show;
			// We need to update different structures depending if the reply to root comment or to some other comment
			if (comment._isRootComment) {
				return {
					rootComment: comment
				};
			}

			state.commentMap[comment.id] = comment;
			return {
				commentMap: state.commentMap
			};
		};
	},

	// setNewState allows to change any state fields to new values as a per supplied args.
	setNewState: function setNewState(args) {
		return args;
	},

	// Load is an entry point to application. Once called, app will save server and uri values to local config for future use
	// and loads comments from server
	// TODO: Error handling
	load: function load(_ref6) {
		var server = _ref6.server,
		    uri = _ref6.uri;
		return async function (state, actions) {
			var comments = await fetch(server + "api/v1/comments?uri=" + encodeURIComponent(uri)).then(function (resp) {
				return resp.json();
			}).then(function (data) {
				var commentMap = [];
				var list = [];

				var visitReplies = function visitReplies(map, comments) {
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = comments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var comment = _step.value;

							commentMap[comment.id] = comment;
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				};

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = data.comments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var comment = _step2.value;

						commentMap[comment.id] = comment;
						list.push(comment.id);

						visitReplies(commentMap, comment.replies);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				return {
					state: 'loaded',
					list: list,
					map: commentMap
				};
			});

			actions.setNewState({
				commentOrderList: comments.list,
				commentMap: comments.map,
				state: _const2.default.STATE.LOADED,
				server: server,
				uri: uri
			});
		};
	}

};

exports.default = actions;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.loadjs = factory();
  }
})(undefined, function () {
  /**
   * Global dependencies.
   * @global {Object} document - DOM
   */

  var devnull = function devnull() {},
      bundleIdCache = {},
      bundleResultCache = {},
      bundleCallbackQueue = {};

  /**
   * Subscribe to bundle load event.
   * @param {string[]} bundleIds - Bundle ids
   * @param {Function} callbackFn - The callback function
   */
  function subscribe(bundleIds, callbackFn) {
    // listify
    bundleIds = bundleIds.push ? bundleIds : [bundleIds];

    var depsNotFound = [],
        i = bundleIds.length,
        numWaiting = i,
        fn,
        bundleId,
        r,
        q;

    // define callback function
    fn = function fn(bundleId, pathsNotFound) {
      if (pathsNotFound.length) depsNotFound.push(bundleId);

      numWaiting--;
      if (!numWaiting) callbackFn(depsNotFound);
    };

    // register callback
    while (i--) {
      bundleId = bundleIds[i];

      // execute callback if in result cache
      r = bundleResultCache[bundleId];
      if (r) {
        fn(bundleId, r);
        continue;
      }

      // add to callback queue
      q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
      q.push(fn);
    }
  }

  /**
   * Publish bundle load event.
   * @param {string} bundleId - Bundle id
   * @param {string[]} pathsNotFound - List of files not found
   */
  function publish(bundleId, pathsNotFound) {
    // exit if id isn't defined
    if (!bundleId) return;

    var q = bundleCallbackQueue[bundleId];

    // cache result
    bundleResultCache[bundleId] = pathsNotFound;

    // exit if queue is empty
    if (!q) return;

    // empty callback queue
    while (q.length) {
      q[0](bundleId, pathsNotFound);
      q.splice(0, 1);
    }
  }

  /**
   * Execute callbacks.
   * @param {Object or Function} args - The callback args
   * @param {string[]} depsNotFound - List of dependencies not found
   */
  function executeCallbacks(args, depsNotFound) {
    // accept function as argument
    if (args.call) args = { success: args };

    // success and error callbacks
    if (depsNotFound.length) (args.error || devnull)(depsNotFound);else (args.success || devnull)(args);
  }

  /**
   * Load individual file.
   * @param {string} path - The file path
   * @param {Function} callbackFn - The callback function
   */
  function loadFile(path, callbackFn, args, numTries) {
    var doc = document,
        async = args.async,
        maxTries = (args.numRetries || 0) + 1,
        beforeCallbackFn = args.before || devnull,
        isCss,
        e;

    numTries = numTries || 0;

    if (/(^css!|\.css$)/.test(path)) {
      isCss = true;

      // css
      e = doc.createElement('link');
      e.rel = 'stylesheet';
      e.href = path.replace(/^css!/, ''); // remove "css!" prefix
    } else {
      // javascript
      e = doc.createElement('script');
      e.src = path;
      e.async = async === undefined ? true : async;
    }

    e.onload = e.onerror = e.onbeforeload = function (ev) {
      var result = ev.type[0];

      // Note: The following code isolates IE using `hideFocus` and treats empty
      // stylesheets as failures to get around lack of onerror support
      if (isCss && 'hideFocus' in e) {
        try {
          if (!e.sheet.cssText.length) result = 'e';
        } catch (x) {
          // sheets objects created from load errors don't allow access to
          // `cssText`
          result = 'e';
        }
      }

      // handle retries in case of load failure
      if (result == 'e') {
        // increment counter
        numTries += 1;

        // exit function and try again
        if (numTries < maxTries) {
          return loadFile(path, callbackFn, args, numTries);
        }
      }

      // execute callback
      callbackFn(path, result, ev.defaultPrevented);
    };

    // add to document (unless callback returns `false`)
    if (beforeCallbackFn(path, e) !== false) doc.head.appendChild(e);
  }

  /**
   * Load multiple files.
   * @param {string[]} paths - The file paths
   * @param {Function} callbackFn - The callback function
   */
  function loadFiles(paths, callbackFn, args) {
    // listify paths
    paths = paths.push ? paths : [paths];

    var numWaiting = paths.length,
        x = numWaiting,
        pathsNotFound = [],
        fn,
        i;

    // define callback function
    fn = function fn(path, result, defaultPrevented) {
      // handle error
      if (result == 'e') pathsNotFound.push(path);

      // handle beforeload event. If defaultPrevented then that means the load
      // will be blocked (ex. Ghostery/ABP on Safari)
      if (result == 'b') {
        if (defaultPrevented) pathsNotFound.push(path);else return;
      }

      numWaiting--;
      if (!numWaiting) callbackFn(pathsNotFound);
    };

    // load scripts
    for (i = 0; i < x; i++) {
      loadFile(paths[i], fn, args);
    }
  }

  /**
   * Initiate script load and register bundle.
   * @param {(string|string[])} paths - The file paths
   * @param {(string|Function)} [arg1] - The bundleId or success callback
   * @param {Function} [arg2] - The success or error callback
   * @param {Function} [arg3] - The error callback
   */
  function loadjs(paths, arg1, arg2) {
    var bundleId, args;

    // bundleId (if string)
    if (arg1 && arg1.trim) bundleId = arg1;

    // args (default is {})
    args = (bundleId ? arg2 : arg1) || {};

    // throw error if bundle is already defined
    if (bundleId) {
      if (bundleId in bundleIdCache) {
        throw "LoadJS";
      } else {
        bundleIdCache[bundleId] = true;
      }
    }

    // load scripts
    loadFiles(paths, function (pathsNotFound) {
      // execute callbacks
      executeCallbacks(args, pathsNotFound);

      // publish bundle load event
      publish(bundleId, pathsNotFound);
    }, args);
  }

  /**
   * Execute callbacks when dependencies have been satisfied.
   * @param {(string|string[])} deps - List of bundle ids
   * @param {Object} args - success/error arguments
   */
  loadjs.ready = function ready(deps, args) {
    // subscribe to bundle load event
    subscribe(deps, function (depsNotFound) {
      // execute callbacks
      executeCallbacks(args, depsNotFound);
    });

    return loadjs;
  };

  /**
   * Manually satisfy bundle dependencies.
   * @param {string} bundleId - The bundle id
   */
  loadjs.done = function done(bundleId) {
    publish(bundleId, []);
  };

  /**
   * Reset loadjs dependencies statuses
   */
  loadjs.reset = function reset() {
    bundleIdCache = {};
    bundleResultCache = {};
    bundleCallbackQueue = {};
  };

  /**
   * Determine if bundle has already been defined
   * @param String} bundleId - The bundle id
   */
  loadjs.isDefined = function isDefined(bundleId) {
    return bundleId in bundleIdCache;
  };

  // export
  return loadjs;
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cookies = __webpack_require__(2);

var _cookies2 = _interopRequireDefault(_cookies);

var _const = __webpack_require__(1);

var _const2 = _interopRequireDefault(_const);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// State represents the state of the comment list
exports.default = {
	// Server specifies the url of the Kommentator server
	server: "initial",
	// Uri specifies the URI of the page to which comments belongs to
	uri: "",
	// Author is used to stre information about current author
	author: _cookies2.default.get(_const2.default.AUTHOR_COOKIE_NAME) || {
		name: '',
		email: ''
	},
	// State defines current state of the comment list (loaded, error, loading, etc)
	state: _const2.default.STATE.UNKNOWN,
	// CommentMap is commentId => comment map of the loaded comments
	commentMap: {},
	// CommentOrderList specifices a list of ids of top-level comments and in the order they need to be displayed
	commentOrderList: [],
	// RootComment is a virtual comment which is used when replying is happening to the post itself, since it does not have any parent
	rootComment: {
		_isRootComment: true
	},

	// Settings hold system settings
	settings: {
		recaptcha: {
			sitekey: '6LfPnjMUAAAAAJDZP70cFhHl_68jbL-GhB2DWn5H'
		}
	},

	// loadedScripts contains a map of on-demand script names which are already loaded
	loadedScripts: {},
	// loadingScript indicatse if app is currently loading some external script
	loadingScript: false
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _hyperapp = __webpack_require__(0);

var _replyform = __webpack_require__(4);

var _replyform2 = _interopRequireDefault(_replyform);

var _Comment = __webpack_require__(12);

var _Comment2 = _interopRequireDefault(_Comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This is top-level component to render main list of comments and top-level reply form
exports.default = function (state, actions) {
	var body;

	return (0, _hyperapp.h)(
		'div',
		{ style: { width: "100%" } },
		(0, _hyperapp.h)(
			'a',
			{ href: '', onclick: function onclick(e) {
					return e.preventDefault() || actions.toggleReplyForm(state.rootComment);
				} },
			'Post comment'
		),
		(0, _hyperapp.h)('br', null),
		(0, _hyperapp.h)(_replyform2.default, { comment: state.rootComment, updateReply: actions.updateReply, sendReply: actions.sendReply, updateAuthor: actions.updateAuthor, author: state.author }),
		(0, _hyperapp.h)(
			'ul',
			null,
			state.commentOrderList.map(function (id) {
				return (0, _hyperapp.h)(_Comment2.default, { comment: state.commentMap[id], toggleReplyForm: actions.toggleReplyForm, updateReply: actions.updateReply, sendReply: actions.sendReply, updateAuthor: actions.updateAuthor, author: state.author, react: actions.react, settings: state.settings });
			})
		)
	);
};

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = ({
	AUTHOR_COOKIE_NAME: 'k-comm-author',
	RECAPTCHA_CALLBACK: '__recaptcha_done',
});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _hyperapp = __webpack_require__(0);

var _timeago = __webpack_require__(13);

var _timeago2 = _interopRequireDefault(_timeago);

var _replyform = __webpack_require__(4);

var _replyform2 = _interopRequireDefault(_replyform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeFormatter = (0, _timeago2.default)();

var Comment = function Comment(_ref) {
	var comment = _ref.comment,
	    toggleReplyForm = _ref.toggleReplyForm,
	    updateReply = _ref.updateReply,
	    sendReply = _ref.sendReply,
	    author = _ref.author,
	    updateAuthor = _ref.updateAuthor,
	    react = _ref.react,
	    settings = _ref.settings;

	var children = comment.replies.length === 0 ? (0, _hyperapp.h)('div', null) : (0, _hyperapp.h)(
		'ul',
		{ 'class': 'children' },
		comment.replies.map(function (c) {
			return (0, _hyperapp.h)(Comment, { comment: c, updateReply: updateReply, sendReply: sendReply, toggleReplyForm: toggleReplyForm, updateAuthor: updateAuthor, author: author, react: react, settings: settings });
		})
	);
	var replyForm = void 0;
	if (typeof comment.reply !== 'undefined' && comment.reply.show) {
		replyForm = (0, _hyperapp.h)(_replyform2.default, { comment: comment, updateReply: updateReply, sendReply: sendReply, updateAuthor: updateAuthor, author: author, settings: settings });
	} else {
		replyForm = (0, _hyperapp.h)('div', null);
	}

	return (0, _hyperapp.h)(
		'li',
		{ 'class': 'comment' },
		(0, _hyperapp.h)(
			'div',
			{ 'class': 'k__avatar' },
			(0, _hyperapp.h)('img', { src: 'https://www.gravatar.com/avatar/' + comment.email + '?s=48' })
		),
		(0, _hyperapp.h)(
			'div',
			null,
			(0, _hyperapp.h)(
				'div',
				{ 'class': 'comment-body' },
				(0, _hyperapp.h)(
					'div',
					{ 'class': 'comment-header' },
					(0, _hyperapp.h)(
						'div',
						{ 'class': 'comment-author' },
						(0, _hyperapp.h)(
							'b',
							null,
							comment.author ? comment.author : 'Anonymous'
						),
						' \u2022 ',
						(0, _hyperapp.h)(
							'span',
							{ 'class': 'time' },
							timeFormatter.format(comment.created)
						)
					)
				),
				(0, _hyperapp.h)(
					'p',
					null,
					comment.body
				)
			)
		),
		(0, _hyperapp.h)(
			'div',
			{ 'class': 'comment-footer' },
			(0, _hyperapp.h)(
				'ul',
				null,
				(0, _hyperapp.h)(
					'li',
					{ 'class': 'like' },
					(0, _hyperapp.h)(
						'a',
						{ href: '', onclick: function onclick(e) {
								return e.preventDefault() || react({ comment: comment, reaction: 'like' });
							} },
						(0, _hyperapp.h)('i', { 'class': 'icon-thumbs-up' }),
						comment.likes
					)
				),
				(0, _hyperapp.h)(
					'li',
					{ 'class': 'dislike' },
					(0, _hyperapp.h)(
						'a',
						{ href: '', onclick: function onclick(e) {
								return e.preventDefault() || react({ comment: comment, reaction: 'dislike' });
							} },
						(0, _hyperapp.h)('i', { 'class': 'icon-thumbs-down' }),
						comment.dislikes
					)
				),
				(0, _hyperapp.h)(
					'li',
					{ 'class': 'reply' },
					(0, _hyperapp.h)(
						'a',
						{ href: '', onclick: function onclick(e) {
								return e.preventDefault() || toggleReplyForm(comment);
							} },
						'Reply'
					)
				)
			)
		),
		replyForm,
		children
	);
};

exports.default = Comment;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (t, e) {
  "object" == ( false ? "undefined" : _typeof(module)) && module.exports ? (module.exports = e(), module.exports.default = module.exports) : t.timeago = e();
}("undefined" != typeof window ? window : undefined, function () {
  function t(t) {
    return t instanceof Date ? t : isNaN(t) ? /^\d+$/.test(t) ? new Date(e(t)) : (t = (t || "").trim().replace(/\.\d+/, "").replace(/-/, "/").replace(/-/, "/").replace(/(\d)T(\d)/, "$1 $2").replace(/Z/, " UTC").replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"), new Date(t)) : new Date(e(t));
  }function e(t) {
    return parseInt(t);
  }function n(t, n, r) {
    n = l[n] ? n : l[r] ? r : "en";for (var o = 0, i = t < 0 ? 1 : 0, a = t = Math.abs(t); t >= p[o] && o < h; o++) {
      t /= p[o];
    }return t = e(t), o *= 2, t > (0 === o ? 9 : 1) && (o += 1), l[n](t, o, a)[i].replace("%s", t);
  }function r(e, n) {
    return ((n = n ? t(n) : new Date()) - t(e)) / 1e3;
  }function o(t) {
    for (var e = 1, n = 0, r = Math.abs(t); t >= p[n] && n < h; n++) {
      t /= p[n], e *= p[n];
    }return r %= e, r = r ? e - r : e, Math.ceil(r);
  }function i(t) {
    return a(t, "data-timeago") || a(t, "datetime");
  }function a(t, e) {
    return t.getAttribute ? t.getAttribute(e) : t.attr ? t.attr(e) : void 0;
  }function u(t, e) {
    return t.setAttribute ? t.setAttribute(m, e) : t.attr ? t.attr(m, e) : void 0;
  }function c(t, e) {
    this.nowDate = t, this.defaultLocale = e || "en";
  }function d(t, e) {
    return new c(t, e);
  }var f = "second_minute_hour_day_week_month_year".split("_"),
      s = "秒_分钟_小时_天_周_月_年".split("_"),
      l = { en: function en(t, e) {
      if (0 === e) return ["just now", "right now"];var n = f[parseInt(e / 2)];return t > 1 && (n += "s"), [t + " " + n + " ago", "in " + t + " " + n];
    }, zh_CN: function zh_CN(t, e) {
      if (0 === e) return ["刚刚", "片刻后"];var n = s[parseInt(e / 2)];return [t + n + "前", t + n + "后"];
    } },
      p = [60, 60, 24, 7, 365 / 7 / 12, 12],
      h = 6,
      m = "data-tid",
      w = {};return c.prototype.doRender = function (t, e, i) {
    var a,
        c = r(e, this.nowDate),
        d = this;t.innerHTML = n(c, i, this.defaultLocale), w[a = setTimeout(function () {
      d.doRender(t, e, i), delete w[a];
    }, Math.min(1e3 * o(c), 2147483647))] = 0, u(t, a);
  }, c.prototype.format = function (t, e) {
    return n(r(t, this.nowDate), e, this.defaultLocale);
  }, c.prototype.render = function (t, e) {
    void 0 === t.length && (t = [t]);for (var n = 0, r = t.length; n < r; n++) {
      this.doRender(t[n], i(t[n]), e);
    }
  }, c.prototype.setLocale = function (t) {
    this.defaultLocale = t;
  }, d.register = function (t, e) {
    l[t] = e;
  }, d.cancel = function (t) {
    var e;if (t) (e = a(t, m)) && (clearTimeout(e), delete w[e]);else {
      for (e in w) {
        clearTimeout(e);
      }w = {};
    }
  }, d;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);