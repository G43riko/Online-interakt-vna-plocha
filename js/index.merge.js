"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LayersViewer = function () {
	function LayersViewer(element) {
		var _this = this;

		var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Layer_";

		_classCallCheck(this, LayersViewer);

		if (G.isDefined(LayersViewer.instance)) {
			alert("Nieje možné vytvoriť viac ako jednu inštanciu LayersViewera!!!!");
			return;
		}
		LayersViewer.instance = this;
		this._defaultName = defaultName;
		this._counter = 0;
		this._layers = {};
		this._activeLayer = "";
		this._existingLayers = 0;
		this._selectedLayer = null;
		this._layersViewer = this._createDiv();
		element.appendChild(this._layersViewer.first());

		if (G.isObject(Scene) && G.isDefined(Scene._layers)) {
			each(Scene._layers, function (e) {
				return _this.createLayer(e);
			}, this);
		}
	}

	_createClass(LayersViewer, [{
		key: "hover",
		value: function hover(x, y) {
			return false;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			return false;
		}
	}, {
		key: "_createDiv",
		value: function _createDiv() {
			this._layersBody = G("div", { attr: { id: "layersBody" } });
			return G("div", {
				attr: { id: "layersViewer", onclick: "LayersViewer.clickOnLayersViewer(event)" },
				cont: [G.createElement("div", { id: "layersHeader" }, [G.createElement("div", {
					class: "layersHeaderButton",
					id: "addLayerButton",
					onclick: "LayersViewer.createAnonymLayer()"
				}, "+"), G.createElement("div", {
					class: "layersHeaderButton",
					id: "removeLayerButton",
					onclick: "LayersViewer.removeActiveLayer()"
				}, "×"), G.createElement("div", {
					class: "layersHeaderButton",
					id: "toggleLayerButton",
					onclick: "G('#layersViewer').toggleClass('minimalized');"
				}, "-")]), this._layersBody.first()]
			});
		}
	}, {
		key: "_createLayerDiv",
		value: function _createLayerDiv(title) {
			return G("div", {
				attr: {
					class: "layer",
					id: title,
					onclick: "LayersViewer.makeSelected(this, event)" },
				cont: [G.createElement("div", { class: "visible true", onclick: "LayersViewer.changeVisibility(this, event)" }), G.createElement("div", { class: "title", ondblclick: "LayersViewer.changeName(this, event)" }, title), G.createElement("div", { class: "options", onclick: "LayersViewer.showOptions(this, event)" })]
			});
		}
	}, {
		key: "createLayer",
		value: function createLayer(layer) {
			this._counter++;
			this._existingLayers++;
			this._layers[layer.title] = {
				layer: layer,
				title: layer.title,
				div: this._createLayerDiv(layer.title)
			};
			this._layersBody.append(this._layers[layer.title].div);

			if (this._existingLayers === 1) {
				LayersViewer.makeSelected(this._layers[layer.title].div.first());
			}
		}
	}, {
		key: "onScreenResize",
		value: function onScreenResize() {}
	}, {
		key: "deleteLayer",
		value: function deleteLayer(title) {
			if (typeof title != "string" || title.length === 0) {
				title = this.activeLayerName;
			}

			var layer = this._layers[title].div;

			if (layer.hasClass("selected") && this._existingLayers > 1) {
				for (var i in this._layers) {
					if (i !== title && this._layers.hasOwnProperty(i)) {
						this._layers[i].div.addClass("selected");
						break;
					}
				}
			}
			layer.delete();
			delete this._layers[title];
			this._existingLayers--;
		}
	}, {
		key: "selectedLayer",
		set: function set(val) {
			this._selectedLayer = this._layers[val];
			if (!this._selectedLayer) {
				alert("nieje označenážiadna vrstva");
			}
		}
	}, {
		key: "activeLayerName",
		get: function get() {
			return this._selectedLayer.title;
		}
	}, {
		key: "activeLayer",
		get: function get() {
			return this._selectedLayer.layer;
		}
	}], [{
		key: "clickOnLayersViewer",
		value: function clickOnLayersViewer(e) {
			draw();
			if (!G(e.target).is(".options")) {
				G("#layerContextMenu").delete();
			}
		}
	}, {
		key: "setName",
		value: function setName(element) {
			var input = G(element);
			var oldName = input.parent().attr("oldName");
			var newName = input.first().value;
			if (G.isDefined(LayersViewer.instance._layers[newName])) {
				alert("vrstva " + newName + " už existuje");
			}

			element.onblur = element.onkeydown = null;

			if (Scene && Scene.createLayer) {
				Scene.renameLayer(oldName, newName);
			}
			LayersViewer.instance._layers[newName] = LayersViewer.instance._layers[oldName];
			LayersViewer.instance._layers[newName].title = newName;
			delete LayersViewer.instance._layers[oldName];

			input.parent().text(newName);
		}
	}, {
		key: "changeName",
		value: function changeName(element) {
			var textBox = G(element);
			var text = textBox.text();
			textBox.attr("oldName", text);
			var input = G.createElement("input", {
				class: "tmpLayerInput",
				type: "text",
				onblur: "LayersViewer.setName(this)",
				onkeydown: "if(event.keyCode === 13){LayersViewer.setName(this)}",
				value: text
			});
			textBox.text("").append(input);
			input.focus();
			input.select();
		}
	}, {
		key: "changeVisibility",
		value: function changeVisibility(element, e) {
			var layer = LayersViewer.instance._layers[G(element).parent().text()];
			if (layer) {
				layer.div.find(".visible.true").toggleClass("false");
				layer.layer.visible = !layer.layer.visible;
			}
		}
	}, {
		key: "showOptions",
		value: function showOptions(element, e) {
			var data = {
				"items": [{
					"key": "lockLayer",
					"type": "boolean",
					"attr": "locked",
					"label": "Zamknuta"
				}, {
					"key": "drawPaint",
					"attr": "drawPaint",
					"type": "boolean",
					"label": "Zobraziť malbu"
				}, {
					"key": "animatePaint",
					"type": "button",
					"label": "Prehrať malbu"
				}, {
					"key": "clearPaint",
					"type": "button",
					"label": "Vyčistiť malbu"
				}, {
					"key": "clearLayer",
					"type": "button",
					"label": "Vyčistiť vrstvu"
				}]
			};
			var pos = G.position(element);
			var size = G.size(element);
			G("#layerContextMenu").delete();

			var items = [];
			G.each(data.items, function (e) {
				var element = G.createElement("li", { onclick: "LayersViewer.clickOnContext(this, \"" + e.attr + "\")" }, G.createElement("a", {}, e.label));
				if (e.type === "boolean") {
					element.append(G.createElement("div", { class: "visible true", attr: e.attr }));
				}
				items.push(element);
			});

			LayersViewer.instance._layersViewer.append(G.createElement("nav", { id: "layerContextMenu" }, G.createElement("ul", {}, items), { top: pos.y + size.height + "px", right: window.innerWidth - pos.x - size.width + "px" }));
		}
	}, {
		key: "clickOnContext",
		value: function clickOnContext(element, key) {
			var el = G(element);
			var childrens = el.children(".visible");
			if (!childrens.isEmpty()) {
				LayersViewer.instance.activeLayer[key] = !LayersViewer.instance.activeLayer[key];
				childrens.class("/false");
			} else {
				G("#layerContextMenu").delete();
			}
			draw();
		}
	}, {
		key: "removeActiveLayer",
		value: function removeActiveLayer() {
			if (LayersViewer.instance._layersViewer.class("minimalized")) {
				return;
			}
			if (Scene && Scene.createLayer) {
				Scene.deleteLayer(LayersViewer.instance.activeLayerName);
			}
		}
	}, {
		key: "createAnonymLayer",
		value: function createAnonymLayer() {
			if (LayersViewer.instance._layersViewer.class("minimalized")) {
				return;
			}
			if (Scene && Scene.createLayer) {
				Scene.createLayer(LayersViewer.instance._defaultName + LayersViewer.instance._counter);
			}
		}
	}, {
		key: "makeSelected",
		value: function makeSelected(element) {
			var layer = new G(element);
			if (layer.hasClass("selected")) {
				return;
			}

			G("#layersViewer .layer").each(function () {
				G(this).removeClass("selected");
			});
			LayersViewer.instance.selectedLayer = layer.text();
			layer.addClass("selected");
		}
	}]);

	return LayersViewer;
}();

"use strict";

function initContextMenu(query) {
	var items = document.querySelectorAll(query);

	var menu = document.querySelector("#context-menu");
	document.addEventListener("click", function (e) {
		var target = e.target;

		do {
			if (target.getAttribute("id") === "context-menu") {
				return;
			}
		} while (target = target.parentElement);
		menu.classList.remove("active");
		menu.classList.remove("left");
	});
	var contextMenuListener = function contextMenuListener(el) {
		el.addEventListener("contextmenu", function (e) {
			e.preventDefault();
			showMenu(e);
			return false;
		});
	};

	var showMenu = function showMenu(e) {
		menu.classList.add("active");
		var contextMenuWidth = menu.querySelector("ul").offsetWidth;
		var contextMenuHeight = menu.querySelector("ul").offsetHeight;

		menu.style.top = Math.min(e.clientY, window.innerHeight - contextMenuHeight) + "px";
		menu.style.left = Math.min(e.clientX, window.innerWidth - contextMenuWidth) + "px";
		console.log(menu.style.left, window.innerWidth - (contexMenuWidth << 1));
		menu.classList.toggle("left", parseInt(menu.style.left.replace("px", "")) > window.innerWidth - (contexMenuWidth << 1));
	};
	for (var i = 0; i < items.length; i++) {
		contextMenuListener(items[i]);
	}
}

"use strict";

var G = function G() {
	var _this2 = this;

	if (!(this instanceof G)) {
		var inst = Object.create(G.prototype);
		G.apply(inst, arguments);
		return inst;
	}
	if (arguments.length === 0) {
		this.elements = [];
	} else if (arguments.length === 1) {
		if (G.isString(arguments[0])) {
			this.elements = G.find(arguments[0]);
		} else if (G.isArray(arguments[0])) {
			this.elements = [];
			G.each(arguments[0], function (e) {
				if (G.isElement(e)) {
					_this2.elements.push(e);
				}
			});
		} else if (G.isElement(arguments[0])) {
			this.elements = [arguments[0]];
		} else if (arguments[0] !== null && G.isDefined(arguments[0]) && G.isG(arguments[0])) {
			this.elements = arguments[0].elements;
		}
	} else if (arguments.length === 2 && G.isString(arguments[0]) && G.isObject(arguments[1])) {
		this.elements = [G.createElement(arguments[0], arguments[1].attr, arguments[1].cont, arguments[1].style)];
	}

	if (G.isUndefined(this.elements)) {
		G.warn("nepodarilo sa rozpoznať argumenty: ", arguments);
		this.elements = [];
	}
	if (!G.isArray(this.elements)) {
		G.error("elementy niesu pole ale " + G.typeOf(this.elements), arguments);
		this.elements = [];
	}
	this.size = this.length();
};

var tests = function tests(G) {
	var body = new G(document.body);

	body.empty();
	if (body.children().length() !== 0) {
		G.error("dlžka prazdneho objektu je: " + body.length());
	}

	body.append("<div id='idecko'>jupilajda</div>");
	body.append(new G("div", {
		attr: {
			class: "clasa"
		},
		cont: "toto je classsa"
	}));
	var elementP = document.createElement("p");
	elementP.appendChild(document.createTextNode("juhuuu toto je paragraf"));
	body.append(elementP);
	if (body.children().length() !== 3) {
		G.error("dlžka objektu s 2 detmi je: " + body.children().length());
	}

	var idecko = new G("#idecko");
	var clasa = new G(".clasa");
	var par = new G("p");

	if (G.isDefined(new G().first())) {
		G.error("pri prazdnom G to nevratilo ako prvý element null");
	}

	if (idecko.first() !== document.getElementById("idecko")) {
		G.error("nenašlo to spravny element podla id");
	}

	if (clasa.first() !== document.getElementsByClassName("clasa")[0]) {
		G.error("nenašlo to spravny element podla class");
	}

	if (par.first() !== document.getElementsByTagName("p")[0]) {
		G.error("nenašlo to spravny element podla tagu");
	}

	if (!G.isObject(idecko.css())) {
		G.error("css() nevratilo objekt");
	}

	idecko.css("color", "");
	if (idecko.css("color") !== "") {
		G.error("nenastavený css nieje prazdny");
	}

	idecko.css("color", "red");
	if (idecko.css("color") !== "red") {
		G.error("nesprávne to nastavilo css štýl");
	}

	idecko.css({ color: "blue", width: "200px" });

	if (idecko.css("color") !== "blue" || idecko.css("width") !== "200px") {
		G.error("nesprávne to nastavilo css štýl s objektu");
	}

	if (idecko.parent().first() !== body.first()) {
		G.error("parent nefunguje správne");
	}

	var a = { a: "aa" };
	var b = { b: "bb", c: "cc" };
	var c = { a: "aaa", c: "cccc" };

	var res = G.extend({}, a, b, c);

	if (res.a !== "aaa" || res.b !== "bb" || res.c !== "cccc") {
		G.error("nefunguje extendse pretože po zlučenie", a, b, c, " vzniklo: ", res, "a malo vzniknut: ", { a: "aaa", b: "bb", c: "cccc" });
	}

	G("div", { attr: { id: "container" }, cont: [G.createElement("nav", { id: "topMenu" }, G.createElement("ul", {}, [G.createElement("li", {}, G.createElement("a", { class: "firstLink", href: "stranka" })), G.createElement("li", {}, G.createElement("a", { class: "secondLink" }))])), G.createElement("div", { id: "wrapper", class: "wrappedDiv" }, G.createElement("nav", { id: "rightMenu" }, G.createElement("ul", { class: "secondUl" }, [G.createElement("li", { class: "firstLi" }, G.createElement("a", { class: "firstLink" })), G.createElement("li", { class: "middleLi disabled" }, G.createElement("a", { class: "secondLink" })), G.createElement("li", { class: "lastLi disabled" }, G.createElement("a", { class: "thirdLink" }))])))] }).appendTo(body);

	if (G("#topMenu").find(".firstLink").attr("href") !== "stranka") {
		console.log("zlihalo 1");
	}
	if (G(".thirdLink").parents("#wrapper").is(".wrappedDiv") !== true) {
		console.log("zlihalo 2");
	}
	if (G("#rightMenu").find("ul").children(":not(.disabled)").is(".firstLi") == false) {
		console.log("zlihalo 3");
	}
	if (G(".middleLi").prev().is(".firstLi") !== true) {
		console.log("zlihalo 4");
	}
	if (G(".middleLi").next().is(".lastLi") !== true) {
		console.log("zlihalo 5");
	}
	if (G(".secondUl").parent().is("#rightMenu") !== true) {
		console.log("zlihalo 6");
	}
	if (G("#wrapper").equal(new G(".wrappedDiv")) !== true) {
		console.log("zlihalo 7");
	}
	if (G("#wrapper").equal(G(".wrappedDiv").first()) !== true) {
		console.log("zlihalo 8");
	}

	G("#container").children().emptyAll();

	if (!G("#rightMenu").isEmpty()) {
		console.log("zlihalo 9");
	}
	if (!G("ul").isEmpty()) {
		console.log("zlihalo 10");
	}
};

G.ajax = function (url, options, dataType) {
	var start = 0;
	if (!window.XMLHttpRequest) {
		G.error("Lutujeme ale váš prehliadaš nepodporuje AJAX");
		return false;
	}

	var http = new XMLHttpRequest();

	if (G.isFunction(options)) {
		options = { success: options };
		if (G.isString(dataType)) {
			options.dataType = dataType;
		}
	} else if (!G.isObject(options)) {
		options = {};
	}

	if (!G.isString(url)) {
		G.error("url nieje string a je: ", url);
		return false;
	}

	options.method = options.method || "GET";
	options.async = options.async || true;

	if (G.isFunction(options.abort)) {
		http.onabort = options.abort;
	}
	if (G.isFunction(options.error)) {
		http.onerror = options.error;
	}
	if (G.isFunction(options.progress)) {
		http.onprogress = options.progress;
	}
	if (G.isFunction(options.timeout)) {
		http.ontimeout = options.timeout;
	}
	if (G.isFunction(options.loadEnd)) {
		http.onloadend = function () {
			return options.loadEnd(window.performance.now() - start);
		};
	}
	if (G.isFunction(options.loadStart)) {
		http.onloadstart = function () {
			options.loadStart();
			start = window.performance.now();
		};
	}

	if (G.isFunction(options.success)) {
		http.onreadystatechange = function () {
			if (http.readyState == 4 && http.status == 200) {
				switch (options.dataType) {
					case "json":
						options.success(JSON.parse(http.responseText));
						break;
					case "html":
						options.success(new DOMParser().parseFromString(http.responseText, "text/xml"));
						break;
					case "xml":
						options.success(new DOMParser().parseFromString(http.responseText, "text/xml"));
						break;
					default:
						options.success(http.responseText);
				}
			}
		};
	} else {
		G.error("nieje zadaná Succes funkcia");
	}
	http.open(options.method, url, options.async);
	http.send();
	return http;
};

G.byId = function (title) {
	return document.getElementById(title);
};

G.byClass = function (title) {
	return document.getElementsByClassName(title);
};

G.hasClass = function (element, className) {
	if (G.isElement(element) && G.isToStringable(className)) {
		return element.classList.contains(className);
	}
	G.error("argumenty musia byť (element, string) a sú ", G.typeOf(element), G.typeOf(className));
	return false;
};

G.byTag = function (title) {
	return document.getElementsByTagName(title);
};

G.error = function () {
	console.error.apply(console, arguments);
};

G.warn = function () {
	console.warn.apply(console, arguments);
};

G.log = function () {
	console.log.apply(console, arguments);
};

G.createElement = function (name, attr, cont, style) {
	var el;

	if (G.isObject(name)) {
		if (G.isString(name.name)) {
			G.createElement(name.name, name.attr || {}, name.cont || "", name.style || {});
		} else {
			return G.error("prví parameter funkcie[Object] musí obsahovať name[String] ale ten je: ", name.name);
		}
	}
	if (G.isString(name)) {
		el = document.createElement(name);
	} else {
		return G.error("prvý parameter(nazov elementu) musí byť string a je: ", name);
	}

	if (G.isObject(attr)) {
		G.each(attr, function (e, i) {
			return el.setAttribute(i, e);
		});
	}

	if (G.isObject(style)) {
		G.each(style, function (e, i) {
			return el.style[i] = e;
		});
	}

	if (G.isToStringable(cont)) {
		G.html(el, cont);
	} else if (G.isArray(cont)) {
		G.each(cont, function (e) {
			if (G.isObject(e)) {
				el.appendChild(e);
			}
		});
	} else if (G.isElement(cont)) {
		el.appendChild(cont);
	} else if (G.isG(cont)) {
		el.appendChild(cont.first());
	}

	return el;
};
G.typeOf = function (val) {
	return typeof val === "undefined" ? "undefined" : _typeof(val);
};
G.isFunction = function (val) {
	return G.typeOf(val) === "function";
};
G.isDefined = function (val) {
	return G.typeOf(val) !== "undefined";
};
G.isString = function (val) {
	return G.typeOf(val) === "string";
};
G.isObject = function (val) {
	return G.typeOf(val) === "object";
};
G.isNumber = function (val) {
	return G.typeOf(val) === "number";
};

G.isInt = function (val) {
	return G.isNumber(val) && val % 1 === 0;
};
G.isFloat = function (val) {
	return G.isNumber(val) && val % 1 !== 0;
};
G.isBool = function (val) {
	return G.typeOf(val) === "boolean";
};

G.isG = function (val) {
	return G.isObject(val) && Object.getPrototypeOf(val) === G.prototype;
};
G.isUndefined = function (val) {
	return !G.isDefined(val);
};
G.isArray = function (val) {
	return Array.isArray(val);
};
G.isToStringable = function (val) {
	return G.isNumber(val) || G.isString(val) || G.isBool(val);
};
G.isEmpty = function (val) {
	return val === {} || val === [] || val === "";
};

G.isElement = function (obj) {
	try {
		return obj instanceof HTMLElement;
	} catch (e) {
		return G.isObject(obj) && obj.nodeType === 1 && G.isObject(obj.style) && G.isObject(obj.ownerDocument);
	}
};

G.isIn = function (obj, data) {
	if (G.isArray(data)) {
		if (data.indexOf(obj) >= 0) {
			return true;
		}
	} else {
		for (var i = 1; i < arguments.length; i++) {
			if (arguments[i] === obj) {
				return true;
			}
		}
	}
	return false;
};

G.extend = function () {
	var target = arguments[0];
	var args = Array.from(arguments);
	args.splice(0, 1);
	if (G.isObject(target)) {
		G.each(args, function (e, i) {
			if (G.isObject(e)) {
				G.each(e, function (ee, key) {
					return target[key] = ee;
				});
			} else {
				G.error("args[" + i + "] ma byť object a je : ", e);
			}
		});
	} else {
		G.error("prvý argument musí byť objekt. teraz je: ", target);
	}
	return target;
};

G.each = function (obj, func, thisArg) {
	var i;
	if (G.isObject(obj) && G.isFunction(func)) {
		if (G.isArray(obj)) {
			if (G.isObject(thisArg)) {
				for (i = 0; i < obj.length; i++) {
					if (func.call(thisArg, obj[i], i, obj) === false) {
						break;
					}
				}
			} else {
				for (i = 0; i < obj.length; i++) {
					if (func(obj[i], i, obj) === false) {
						break;
					}
				}
			}
		} else {
			if (G.isObject(thisArg)) {
				for (i in obj) {
					if (obj.hasOwnProperty(i)) {
						if (func.call(thisArg, obj[i], i, obj) === false) {
							break;
						}
					}
				}
			} else {
				for (i in obj) {
					if (obj.hasOwnProperty(i)) {
						if (func(obj[i], i, obj) === false) {
							break;
						}
					}
				}
			}
		}
	} else {
		G.error("argumenty majú byť (object, function) a sú:", obj, func);
	}
};

G.find = function (queryString, parent) {
	var result = [];

	if (!G.isElement(parent)) {
		parent = document;
	}

	if (G.isString(queryString)) {
		var data = parent.querySelectorAll(queryString);
		G.each(data, function (e) {
			return result.push(e);
		});
	} else {
		G.error("argument funkcie musí byť string a je ", queryString);
	}

	return result;
};

G.parent = function (element) {
	if (G.isElement(element)) {
		return element.parentElement;
	}

	G.error("argument funcie musí byť element a teraz je: ", element);
	return null;
};

G.parents = function (element, condition) {
	if (G.isUndefined(condition) || !G.isString(condition) || G.isEmpty(condition)) {
		condition = "*";
	}
	var result = [];
	if (G.isElement(element)) {
		while (element = element.parentElement) {
			if (element.matches(condition)) {
				result.push(element);
			}
		}
		return result;
	}
	return [];
};

G.text = function (element, text, append) {
	if (G.isElement(element)) {
		if (G.isUndefined(text)) {
			return element.textContent;
		}

		if (G.isToStringable(text)) {
			if (append) {
				element.textContent += text;
			} else {
				element.textContent = text;
			}
		} else {
			G.error("druhý argument musí byť string a je: ", html);
		}
	} else {
		G.error("prvý argument musí byť objekt a je: ", element);
	}
	return element;
};

G.html = function (element, html, append) {
	if (G.isUndefined(append)) {
		append = false;
	}
	if (G.isElement(element)) {
		if (G.isUndefined(html)) {
			return element.innerHTML();
		}

		if (G.isToStringable(html)) {
			if (append) {
				element.innerHTML += html;
			} else {
				element.innerHTML = html;
			}
		} else {
			G.error("druhý argument musí byť string a je: ", html);
		}
	} else {
		G.error("prvý argument musí byť objekt a je: ", element);
	}
	return element;
};

G.next = function (element) {
	if (G.isElement(element)) {
		return element.nextSibling;
	}
	G.error("prvý argument musí byť element a je: ", element);
	return null;
};

G.prev = function (element) {
	if (G.isElement(element)) {
		return element.previousSibling;
	}
	G.error("prvý argument musí byť element a je: ", element);
	return null;
};

G.children = function (element, condition) {
	if (G.isUndefined(condition) || !G.isString(condition) || G.isEmpty(condition)) {
		condition = "*";
	}
	var result = [];
	if (G.isElement(element)) {
		var data = element.children;
		G.each(data, function (element) {
			if (result.indexOf(element) < 0) {
				if (element.matches(condition)) {
					result.push(element);
				}
			}
		});
	} else {
		G.error("argument funcie musí byť element a teraz je: ", element);
	}
	return result;
};

G.delete = function (element) {
	if (G.isElement(element)) {
		element.parentElement.removeChild(element);
	} else {
		G.error("argument funcie musí byť element a teraz je: ", element);
	}
};

G.prototype.parents = function () {
	var selectorString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "*";

	return new G(G.parents(this.first(), selectorString));
};

G.prototype.find = function (selectorString) {
	return new G(G.find(selectorString, this.first()));
};

G.prototype.is = function (selectorString) {
	if (this.isEmpty()) {
		return null;
	}
	try {
		return this.first().matches(selectorString);
	} catch (err) {
		return null;
	}
};

G.prototype.add = function () {
	var _this3 = this;

	G.each(arguments, function (e, i) {
		if (G.isElement(e)) {
			_this3.element.push(e);
		} else if (G.isString(e)) {
			_this3.elements.push.apply(_this3, G.find(e));
		} else {
			G.error("argumenty funkcie: (string[]), " + i + " -ty argument: ", e);
		}
	});
	return this;
};

G.prototype.remove = function () {
	var _this4 = this;

	var index;
	G.each(arguments, function (e) {
		if (G.isElement(e)) {
			index = _this4.elements.indexOf(e);
			if (index >= 0) {
				_this4.elements.splice(index, 1);
			}
		}
	});
	return this;
};

G.prototype.clear = function () {
	this.elements = [];
	return this;
};

G.prototype.contains = function (element) {
	if (G.isElement) {
		for (var i = 0; i < this.element.length; i++) {
			if (this.element[i] === element) {
				return true;
			}
		}
	} else {
		G.error("argument funkcie musí byť element a teraz je: ", element);
	}

	return false;
};

G.prototype.equal = function (element) {
	if (G.isG(element)) {
		return this.first() === element.first();
	} else if (G.isElement(element)) {
		return this.first() === element;
	} else {
		G.error("argument funkcie môže byť iba element alebo G objekt");
	}
	return false;
};

G.prototype.width = function () {
	if (this.isEmpty()) {
		return null;
	}
	return this.first().offsetWidth;
};

G.prototype.height = function () {
	if (this.isEmpty()) {
		return null;
	}
	return this.first().offsetHeight;
};

G.prototype.show = function () {
	return this.css("display", "block");
};

G.prototype.hide = function () {
	return this.css("display", "none");
};

G.prototype.toggle = function () {
	return this.css("display") === "none" ? this.show() : this.hide();
};

G.prototype.emptyAll = function () {
	G.each(this.elements, function (e) {
		return G.html(e, "");
	});
	return this;
};

G.prototype.empty = function () {
	return this.html("");
};

G.prototype.hasClass = function (className) {
	return this.class(className);
};

G.prototype.val = function () {
	return this.attr("value", arguments[0]);
};

G.prototype.addClass = function (className) {
	return this.class("+" + className);
};

G.prototype.removeClass = function (className) {
	return this.class("-" + className);
};

G.prototype.toggleClass = function (className) {
	return this.class("/" + className);
};

G.prototype.parent = function () {
	return new G(G.parent(this.first()));
};

G.prototype.next = function () {
	return new G(G.next(this.first()));
};

G.prototype.prev = function () {
	return new G(G.prev(this.first()));
};

G.prototype.children = function () {
	var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "*";

	return new G(G.children(this.first(), condition));
};

G.prototype.first = function () {
	return this.elements[0];
};

G.prototype.length = function () {
	return this.elements.length;
};

G.prototype.isEmpty = function () {
	return this.length() === 0;
};

G.prototype.each = function (func) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	if (G.isFunction(func)) {
		G.each(this.elements, function (e) {
			return func.apply(e, args);
		});
	} else {
		G.error("prvý parameter musí byť funkcia a je: ", func);
	}

	return this;
};

G.prototype.deleteAll = function () {
	G.each(this.elements, function (e) {
		return G.delete(e);
	});
	this.elements = [];
	return this;
};

G.prototype.prependTo = function (data) {
	if (this.isEmpty()) {
		return this;
	}

	if (G.isElement(data)) {
		data.parentElement.insertBefore(this.first(), data.parentElement.firstElementChild);
	} else if (G.isG(data) && !data.isEmpty()) {
		data.parent().first().insertBefore(this.first(), data.parent().first().firstElementChild);
	} else {
		G.error("argument funkcie musí byť element a je: ", data);
	}
	return this;
};

G.prototype.appendTo = function (data) {
	if (this.isEmpty()) {
		return this;
	}

	if (G.isElement(data)) {
		data.appendChild(this.first());
	} else if (G.isG(data) && !data.isEmpty()) {
		data.first().appendChild(this.first());
	} else {
		G.error("argument funkcie musí byť element a je: ", data);
	}

	return this;
};

G.prototype.prepend = function (data) {
	if (this.isEmpty()) {
		return this;
	}

	if (G.isElement(data)) {
		this.first().insertBefore(data, this.first().firstElementChild);
	} else if (G.isString(data)) {
		this.html(data + this.html());
	} else {
		G.error("argument funkcie musí byť element alebo string a teraz je: ", data);
	}
	return this;
};

G.prototype.append = function (data) {
	if (this.isEmpty()) {
		return this;
	}

	if (G.isElement(data)) {
		this.first().appendChild(data);
	} else if (G.isString(data)) {
		G.html(this.first(), data, true);
	} else if (G.isG(data) && !data.isEmpty()) {
		this.first().appendChild(data.first());
	} else {
		G.error("argument funkcie musí byť element alebo string a teraz je: ", data);
	}

	return this;
};

G.prototype.text = function (text, append) {
	if (G.isUndefined(append)) {
		append = false;
	}
	if (this.isEmpty()) {
		return this;
	}
	if (G.isUndefined(text)) {
		return G.text(this.first());
	}

	text[0] === "+" ? G.text(this.first(), text.substring(1), true) : G.text(this.first(), text);
	return this;
};

G.prototype.html = function (html) {
	if (this.isEmpty()) {
		return this;
	}

	if (G.isUndefined(html)) {
		return G.html(this.first());
	}
	if (G.isString(html)) {
		html[0] === "+" ? G.html(this.first(), html.substring(1), true) : G.html(this.first(), html);
	} else if (G.isElement(html)) {
		G.html(this.first(), "");
		this.append(html);
	}

	return this;
};

G.prototype.delete = function () {
	if (this.isEmpty()) {
		return this;
	}

	G.delete(this.first());
	if (G.isArray(this.elements)) {
		this.elements.splice(0, 1);
	}

	return this;
};

G.prototype.class = function (name, force) {
	var _this5 = this;

	if (this.isEmpty()) {
		return this;
	}
	var classes = this.first().classList;
	if (G.isArray(name)) {
		G.each(name, function (e) {
			return _this5.class(e);
		});
	} else if (G.isString(name)) {
		switch (name[0]) {
			case "+":
				classes.add(name.substring(1));
				break;
			case "-":
				classes.remove(name.substring(1));
				break;
			case "/":
				name = name.substring(1);
				G.isBool(force) ? classes.toggle(name, force) : classes.toggle(name);
				break;
			default:
				return classes.contains(name);
		}
	}
	return null;
};

G.prototype.css = function () {
	var _this6 = this;

	if (this.isEmpty()) {
		return this;
	}

	if (arguments.length === 0) {
		var result = {};
		var css = window.getComputedStyle(this.first());
		G.each(css, function (e) {
			if (css.getPropertyValue(e) !== "") {
				result[e] = css.getPropertyValue(e);
			}
		});
		return result;
	}

	if (G.isString(arguments[0])) {
		if (arguments.length == 2 && G.isToStringable(arguments[1])) {
			this.first().style[arguments[0]] = arguments[1];
		} else if (arguments[0][0] !== "-") {
			return this.first().style[arguments[0]];
		} else {
			this.first().style[arguments[0].substring(1)] = "";
		}
	} else if (G.isObject(arguments[0])) {
		G.each(arguments[0], function (e, i) {
			if (G.isString(i) && G.isToStringable(e)) {
				_this6.first().style[i] = e;
			}
		});
	}
	return this;
};

G.prototype.attr = function () {
	var _this7 = this;

	if (this.isEmpty()) {
		return this;
	}

	if (arguments.length === 0) {
		var result = {};
		G.each(this.first().attributes, function (e) {
			result[e.nodeName] = e.nodeValue;
		});
		return result;
	}

	if (G.isString(arguments[0])) {
		if (arguments.length == 2 && G.isToStringable(arguments[1])) {
			this.first().setAttribute(arguments[0], arguments[1]);
		} else if (arguments[0][0] !== "-") {
			return this.first().getAttribute(arguments[0]);
		} else {
			this.first().removeAttribute(arguments[0].substring(1));
		}
	} else if (G.isObject(arguments[0])) {
		G.each(arguments[0], function (e, i) {
			if (G.isString(i) && G.isToStringable(e)) {
				_this7.first().setAttribute(i, e);
			}
		});
	}
	return this;
};

G._modifyListener = function (element, listener, func, type) {
	var allowedListeners = ["click", "blur", "submit", "focus", "scroll", "keydown", "keyup", "dblclick"];
	if (G.isElement(element)) {
		if (G.isIn(listener, allowedListeners)) {
			if (G.isFunction(func)) {
				if (type === "unset") {
					element.removeEventListener(listener, displayDate);
				} else if (type === "set") {
					element.addEventListener(listener, displayDate);
				}
			} else {
				Logger.error("tretí parameter musí byť funkcia ale je", G.typeOf(func));
			}
		} else {
			Logger.error("druhý parameter nieje platný listenre");
		}
	} else {
		Logger.error("prví parameter musí byť element ale je", G.typeOf(element));
	}
	return eleelement;
};
G.prototype.unbind = function (listener, func) {
	if (this.isEmpty()) {
		return this;
	}
	G._modifyListener(this.first(), listener, func, "unset");
	return this;
};

G.prototype.bind = function (listener, func) {
	if (this.isEmpty()) {
		return this;
	}
	G._modifyListener(this.first(), listener, func, "set");
	return this;
};

G.prototype.blur = function (func) {
	return undefined.bind("blur", func);
};
G.prototype.keyup = function (func) {
	return undefined.bind("keyup", func);
};
G.prototype.click = function (func) {
	return undefined.bind("click", func);
};
G.prototype.focus = function (func) {
	return undefined.bind("focus", func);
};
G.prototype.submit = function (func) {
	return undefined.bind("submit", func);
};
G.prototype.scroll = function (func) {
	return undefined.bind("scroll", func);
};
G.prototype.keydown = function (func) {
	return undefined.bind("keydown", func);
};
G.prototype.dblclick = function (func) {
	return undefined.bind("dblclick", func);
};

G.position = function (element) {
	if (!G.isElement(element)) {
		G.warn("argument musí byť element");
		return null;
	}
	var top = 0,
	    left = 0;
	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while (element);
	return {
		y: top,
		x: left
	};
};
G.left = function (element) {
	if (!G.isElement(element)) {
		G.warn("argument musí byť element");
		return 0;
	}
	var left = 0;
	do {
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while (element);
	return left;
};
G.top = function (element) {
	if (!G.isElement(element)) {
		G.warn("argument musí byť element");
		return 0;
	}
	var top = 0;
	do {
		top += element.offsetTop || 0;
		element = element.offsetParent;
	} while (element);
	return top;
};

G.size = function (element) {
	var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	if (!G.isElement(element)) {
		G.warn("argument musí byť element");
		return null;
	}
	return {
		width: element.offsetWidth,
		height: element.offsetHeight
	};
};

G.width = function (element) {
	if (!G.isElement(element)) {
		G.warn("argument musí byť element");
		return 0;
	}
	return element.offsetWidth;
};

G.height = function (element) {
	if (!G.isElement(element)) {
		G.warn("argument musí byť element");
		return 0;
	}
	return element.offsetHeight;
};

var LogManager = function () {
	function LogManager() {
		_classCallCheck(this, LogManager);

		LogManager.LOGS = "logs";
		LogManager.WARNS = "warns";
		LogManager.ERRORS = "errors";

		this._logs = [];
		this._data = {};
		this._show = {};

		this._data[LogManager.LOGS] = {};
		this._data[LogManager.WARNS] = {};
		this._data[LogManager.ERRORS] = {};

		this._show[LogManager.LOGS] = this._show[LogManager.WARNS] = this._show[LogManager.ERRORS] = true;
	}

	_createClass(LogManager, [{
		key: "log",
		value: function log(msg, type) {
			this._logs.push([Date.now(), msg, type]);
		}
	}, {
		key: "notif",
		value: function notif(msg) {
			Alert.info(msg);
		}
	}, {
		key: "write",
		value: function write(msg) {
			this._data[LogManager.LOGS][Date.now()] = msg;
			if (this._show[LogManager.LOGS]) {
				console.log(msg);
			}
		}
	}, {
		key: "error",
		value: function error(msg, id) {
			Alert.danger(msg);
			this._data[LogManager.ERRORS][Date.now()] = msg;
			if (this._show[LogManager.ERRORS]) {
				if (id) {
					console.error(getErrorMessage(id) + msg);
				} else {
					console.error(typeof msg === "number" ? getErrorMessage(msg) : msg);
				}
			}
		}
	}, {
		key: "warn",
		value: function warn(msg) {
			this._data[LogManager.WARNS][Date.now()] = msg;
			if (this._show[LogManager.WARNS]) console.warn(msg);
		}
	}, {
		key: "showLogs",
		value: function showLogs() {
			var div = G("#showLogs");
			if (div.length() > 0) {
				div.empty().append(createTable(["Time", "Message", "Type"], this._logs));
				G("#showLogs").show();
				G("#modalWindow").show();
			}
		}
	}, {
		key: "data",
		get: function get() {
			return this_data;
		}
	}]);

	return LogManager;
}();

var getErrorMessage = function getErrorMessage(id) {
	switch (id) {
		case 0:
			return "Nezadaný parameter";
		case 1:
			return "Neznáma Input akcia: ";
		case 2:
			return "Neznáma Object akcia: ";
		case 3:
			return "Neznáma Paint akcia: ";
		default:
			return "Neznáma chyba";
	}
};
var Alert = {
	_closeParent: function _closeParent(el) {
		el.parentElement.style.opacity = 0;
		setTimeout(function () {
			if (el.parentElement.parentElement !== null) el.parentElement.parentElement.removeChild(el.parentElement);
		}, 300);
	},
	success: function success(text) {
		var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
		return Alert._showAlert(text, "success", time);
	},
	warning: function warning(text) {
		var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
		return Alert._showAlert(text, "warning", time);
	},
	danger: function danger(text) {
		var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
		return Alert._showAlert(text, "danger", time);
	},
	info: function info(text) {
		var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;
		return Alert._showAlert(text, "info", time);
	},
	_showAlert: function _showAlert(text) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "success";
		var time = arguments[2];

		if (typeof document === "undefined" || typeof document.body === "undefined") return false;
		var createElement = function createElement(name, params, text) {
			var el = document.createElement(name);
			if ((typeof params === "undefined" ? "undefined" : _typeof(params)) === "object") for (var i in params) {
				if (params.hasOwnProperty(i)) el.setAttribute(i, params[i]);
			}typeof text === "string" && el.appendChild(document.createTextNode(text));
			return el;
		};
		var div = createElement("div", { class: "alert alert-" + type });
		var a = createElement("a", {
			onclick: "Alert.removeEvent(event)",
			class: "close"
		}, "×");

		switch (type) {
			case "success":
				type = "success! ";
				break;
			case "info":
				type = "Info! ";
				break;
			case "warning":
				type = "Warning! ";
				break;
			case "danger":
				type = "Danger! ";
				break;
		}

		div.appendChild(createElement("strong", {}, type));
		div.appendChild(a);
		if (typeof text === "string") div.appendChild(document.createTextNode(text));else div.appendChild(text);
		document.body.appendChild(div);
		setTimeout(function () {
			return Alert.removeEvent({ target: a });
		}, time);
	},

	removeEvent: function removeEvent(event) {
		Alert._closeParent(event.target);
		return false;
	},
	show: function show() {
		Alert._showAlert("warningoš", "warning");
		Alert._showAlert("successoš", "success");
		Alert._showAlert("infoš", "info");
		Alert._showAlert("dangeroš", "danger");
	}
};
var LEFT_BUTTON = 0;
var RIGHT_BUTTON = 2;
var SHIFT_KEY = 16;
var L_CTRL_KEY = 17;
var L_ALT_KEY = 18;
var ESCAPE_KEY = 27;
var ENTER_KEY = 13;
var Z_KEY = 90;
var Y_KEY = 89;
var DELETE_KEY = 46;
var A_KEY = 65;
var KEY_NUM_1 = 49;
var KEY_NUM_2 = 50;
var KEY_NUM_3 = 51;
var KEY_NUM_4 = 52;
var KEY_NUM_5 = 53;
var KEY_NUM_6 = 54;
var KEY_NUM_7 = 55;
var KEY_NUM_8 = 56;
var KEY_NUM_9 = 57;

var FPS = 60;

var FONT_HALIGN_LEFT = "left";
var FONT_HALIGN_CENTER = "center";
var FONT_HALIGN_RIGHT = "right";

var FONT_VALIGN_MIDDLE = "middle";
var FONT_VALIGN_TOP = "top";
var FONT_VALIGN_ALPHA = "alphabetic";
var FONT_VALIGN_HANG = "hanging";
var FONT_VALIGN_IDEO = "ideographic";
var FONT_VALIGN_BOTT = "bottom";

var FONT_ALIGN_CENTER = 10;
var FONT_ALIGN_NORMAL = 11;

var FOLDER_IMAGE = "/img";
var FOLDER_JSON = "/js/json";

var SELECTOR_SIZE = 10;
var SELECTOR_COLOR = "orange";
var SELECTOR_BORDER_COLOR = "black";

var LINE_CAP_BUTT = "butt";
var LINE_CAP_ROUND = "round";
var LINE_CAP_SQUARE = "square";

var LINE_JOIN_MITER = "miter";
var LINE_JOIN_ROUND = "round";
var LINE_JOIN_BEVEL = "bevel";

var OPERATION_DRAW_RECT = 1000;
var OPERATION_DRAW_ARC = 1001;
var OPERATION_DRAW_PATH = 1002;
var OPERATION_DRAW_LINE = 1003;
var OPERATION_DRAW_JOIN = 1004;
var OPERATION_DRAW_IMAGE = 1005;
var OPERATION_RUBBER = 1006;
var OPERATION_AREA = 1007;

var JOIN_LINEAR = 2000;
var JOIN_BAZIER = 2001;
var JOIN_SEQUENCAL = 2002;

var LINE_STYLE_NORMAL = 2100;
var LINE_STYLE_STRIPPED = 2101;
var LINE_STYLE_FILLED = 2102;

var LIMIT_LAYERS_COUNT = 10;


var DEFAULT_BACKGROUND_COLOR = "#ffffff";
var DEFAULT_FONT = "Comic Sans MS";
var DEFAULT_FONT_SIZE = 22;
var DEFAULT_FONT_COLOR = "#000000";
var DEFAULT_SHADOW_COLOR = "#000000";
var DEFAULT_SHADOW_BLUR = 20;
var DEFAULT_SHADOW_OFFSET = 5;
var DEFAUL_STROKE_COLOR = "#000000";
var DEFAULT_STROKE_WIDTH = 2;
var DEFAULT_COLOR = "#000000";
var DEFAULT_FILL_COLOR = "#000000";
var DEFAULT_RADIUS = 5;
var DEFAULT_TEXT_OFFSET = 5;
var DEFAULT_FONT_HALIGN = FONT_HALIGN_LEFT;
var DEFAULT_FONT_VALIGN = FONT_VALIGN_TOP;
var DEFAULT_ROUND_VAL = 10;
var DEFAULT_BORDER_COLOR = "#000000";
var DEFAULT_BORDER_WIDTH = 2;
var DEFAULT_LINE_TYPE = JOIN_LINEAR;
var DEFAULT_LINE_STYLE = LINE_STYLE_NORMAL;
var DEFAULT_BRUSH_SIZE = 20;
var DEFAULT_BRUSH_TYPE = "line";
var DEFAULT_BRUSH_COLOR = "#000000";
var DEFAULT_LAYER_TITLE = "default";
var DEFAULT_USER_NAME = "DEFAULT_NAME";

var CONTEXT_MENU_LINE_HEIGHT = 40;
var CONTEXT_MENU_FONT_COLOR = DEFAULT_FONT_COLOR;
var CONTEXT_MENU_OFFSET = 10;
var CONTEXT_MENU_WIDTH = 240;
var CONTEXT_FILL_COLOR = "#1abc9c";
var CONTEXT_DISABLED_FILL_COLOR = "#abd6bb";
var CONTEXT_SELECTED_FILL_COLOR = "red";

var GRID_COLOR = "Black";
var GRID_WIDTH = 0.1;
var GRID_DIST = 10;
var GRID_NTH_BOLD = 5;

var TOUCH_DURATION = 500;
var TOUCH_VARIATION = 5;

var MENU_OFFSET = 10;
var MENU_RADIUS = 10;
var MENU_BORDER_WIDTH = 2;
var MENU_FONT_COLOR = "#000000";
var MENU_BORDER_COLOR = "#000000";
var MENU_WIDTH = 50;
var MENU_HEIGHT = 50;
var MENU_POSITION = MENU_OFFSET;
var MENU_BACKGROUND_COLOR = "#1abc9c";
var MENU_DISABLED_BG_COLOR = "#abd6bb";

var TABLE_BORDER_WIDTH = 1;
var TABLE_HEADER_COLOR = "#53cfff";
var TABLE_BODY_COLOR = "#5bf2ff";
var TABLE_LINE_HEIGHT = 40;
var TABLE_BORDER_COLOR = "#000000";
var TABLE_WIDTH = 300;
var TABLE_RADIUS = 10;
var TABLE_TEXT_OFFSET = 5;

var TIMELINE_HEIGHT = 60;
var TIMELINE_SLIDER_HEIGHT = 5;
var TIMELINE_SLIDER_COLOR = "purple";
var TIMELINE_SLIDER_OFFSET = 30;
var TIMELINE_BUTTON_SIZE = 20;
var TIMELINE_BUTTON_COLOR = "HotPink";
var TIMELINE_BUTTON_BORDER_COLOR = "IndianRed";

var ACCESS_PUBLIC = "+";
var ACCESS_PRIVATE = "-";
var ACCESS_PROTECTED = "#";

var ACTION_OBJECT_MOVE = 2310;
var ACTION_OBJECT_CREATE = 2311;
var ACTION_OBJECT_CHANGE = 2312;
var ACTION_OBJECT_DELETE = 2313;
var ACTION_PAINT_CLEAN = 2314;
var ACTION_PAINT_ADD_POINT = 2315;
var ACTION_PAINT_BREAK_LINE = 2316;
var ACTION_PAINT_CHANGE_BRUSH = 2317;
var ACTION_LAYER_CREATE = 2318;
var ACTION_LAYER_DELETE = 2319;
var ACTION_LAYER_CLEAN = 2320;
var ACTION_LAYER_VISIBLE = 2321;
var ACTION_LAYER_RENAME = 2322;

var PAINT_ACTION_BRUSH = 2400;
var PAINT_ACTION_LINE = 2401;

var KEYWORD_OBJECT = "object";
var KEYWORD_STRING = "string";
var KEYWORD_NUMBER = "number";
var KEYWORD_BOOLEAN = "boolean";
var KEYWORD_FUNCTION = "function";
var KEYWORD_UNDEFINED = "undefined";
var KEYWORD_TRANSPARENT = "transparent";
var PI2 = Math.PI * 2;

var IMAGE_FORMAT_JPG = "image/jpeg";
var IMAGE_FORMAT_PNG = "image/png";
var IMAGE_FORMAT_GIF = "image/gif";
var FORMAT_FILE_XML = "text/xml";

var ATTRIBUTE_FILL_COLOR = "fillColor";
var ATTRIBUTE_BORDER_COLOR = "borderColor";
var ATTRIBUTE_BORDER_WIDTH = "borderWidth";
var ATTRIBUTE_LINE_WIDTH = "lineWidth";
var ATTRIBUTE_FONT_SIZE = "fontSize";
var ATTRIBUTE_FONT_COLOR = "fontColor";
var ATTRIBUTE_LINE_TYPE = "lineType";
var ATTRIBUTE_LINE_STYLE = "lineStyle";
var ATTRIBUTE_BRUSH_SIZE = "brushSize";
var ATTRIBUTE_BRUSH_TYPE = "brushType";
var ATTRIBUTE_BRUSH_COLOR = "brushColor";
var ATTRIBUTE_RADIUS = "radius";

var INPUT_TYPE_CHECKBOX = "checkbox";
var INPUT_TYPE_RADIO = "radio";

var CHECKBOX_COLOR_TRUE = "green";
var CHECKBOX_COLOR_FALSE = "red";

var COMPONENT_DRAW = "a";
var COMPONENT_SHARE = "b";
var COMPONENT_WATCH = "c";
var COMPONENT_TOOLS = "d";
var COMPONENT_LOAD = "e";
var COMPONENT_SCREEN = "f";
var COMPONENT_CONTENT = "g";
var COMPONENT_EDIT = "h";
var COMPONENT_SAVE = "i";
var COMPONENT_LAYERS = "j";
var COMPONENT_TASK = "k";

var LAYERS_LINE_HEIGHT = 50;
var LAYERS_PANEL_WIDTH = 180;
var LAYERS_PANEL_OFFSET = 40;
var LAYERS_FONT_SIZE = 20;
var LAYERS_CHECKBOX_SIZE = 30;
var LAYERS_BUTTON_SIZE = 40;

var LOGGER_MENU_CLICK = 2600;
var LOGGER_CREATOR_CHANGE = 2601;
var LOGGER_CONTEXT_CLICK = 2602;
var LOGGER_OBJECT_CREATED = 2604;
var LOGGER_OBJECT_ADDED = 2605;
var LOGGER_OBJECT_CLEANED = 2609;
var LOGGER_COMPONENT_CREATE = 2606;
var LOGGER_PAINT_HISTORY = 2607;
var LOGGER_PAINT_ACTION = 2608;
var LOGGER_MOUSE_EVENT = 2610;
var LOGGER_KEY_EVENT = 2611;
var LOGGER_DRAW = 2612;
var LOGGER_CHANGE_OPTION = 2613;
var LOGGER_LAYER_CHANGE = 2603;
var LOGGER_LAYER_CLEANED = 2614;
var LOGGER_LAYER_RENAMED = 2615;
var LOGGER_LAYER_RASTERED = 2616;

var HIGHTLIGHT_CORRECT = 2700;
var HIGHTLIGHT_WRONG = 2701;

var LAYER_USER = 2710;
var LAYER_GUI = 2711;
var LAYER_TASK = 2712;

var STATUS_CONNECTED = 2720;
var STATUS_DISCONNECTED = 2721;

var OBJECT_ARC = "Arc";
var OBJECT_ARROW = "Arrow";
var OBJECT_CLASS = "Class";
var OBJECT_CONNECTOR = "Connector";
var OBJECT_IMAGE = "Image";
var OBJECT_JOIN = "Join";
var OBJECT_LINE = "Line";
var OBJECT_PAINT = "Paint";
var OBJECT_POLYGON = "Polygon";
var OBJECT_RECT = "Rect";
var OBJECT_TABLE = "Table";
var OBJECT_INPUT = "Input";
var OBJECT_TEXT = "Text";
var OBJECT_GRAPH = "Graph";
var OBJECT_RUBBER = "Rubber";
var OBJECT_AREA = "Area";

var CURSOR_POINTER = "pointer";
var CURSOR_DEFAULT = "default";
var CURSOR_NOT_ALLOWED = "not-allowed";

var OPTION_CHANGE_CURSOR = true;
var OPTION_MOVING_SILHOUETTE = false;
var OPTION_SHOW_SHADOWS = true;
var OPTION_CANVAS_BLUR = false;
var OPTION_SHOW_LAYERS_VIEWER = true;
var OPTION_SHOW_GRID = true;

var LINE_NONE = 2210;
var LINE_ARROW_CLASSIC = 2211;
var LINE_ARROW_CLOSED = 2212;
var LINE_ARROW_FILLED = 2213;
var LINE_DIAMOND_CLASSIC = 2214;
var LINE_DIAMOND_FILLED = 2215;

var ACTION_MOUSE_MOVE = 2318;
var ACTION_MOUSE_DOWN = 2319;
var ACTION_MOUSE_UP = 2320;
var ACTION_KEY_DOWN = 2321;
var ACTION_KEY_UP = 2322;
var ACTION_PAINT_ADD_PATH = 2323;
var ACTION_PAINT_REMOVE_PATH = 2324;

var CUT_OFF_AFTER_DISTANCE = 100;
var CUT_OFF_PATHS_AFTER = false;
var CUT_OFF_PATHS_BEFORE = false;
var CUT_OFF_BEFORE_DISTANCE = 100;

var MSG_DIVIDER = "########";

var MSG_CONN_RECONNECT = "Spojenie zo serverom bolo uspešne znovunadviazané";
var MSG_CONN_CONFIRM = "jupíííí spojenie bolo úspešné";
var MSG_CONN_FAILED = "Nepodarilo sa nadviazať spojenie zo serverom";
var MSG_CONN_ERROR = "Spojenie zo serverom bolo prerušené";
var MSG_CONN_DISCONNECT = "Spojenie zo serverom bolo úspešne ukončené";
var MSG_USER_CONNECT = "používatel " + MSG_DIVIDER + "[" + MSG_DIVIDER + "] sa pripojil";
var MSG_ANNONYM_FAILED = "Nepodarilo sa odoslať anonymné dáta o prehliadači";
var MSG_MISS_LESS_ID = "Nieje zadané 'less_id'";
var MSG_UNKNOW_ACTION = "neznáma akcia: " + MSG_DIVIDER;
var MSG_RECIEVED_UNKNOWN_ACTION = "bola prijatá neznáma akcia: " + MSG_DIVIDER;
var MSG_TRY_DRAW_EMPTY_POLYGON = "chce sa vykresliť Polygon bez pointov";
var MSG_TRY_DRAW_EMPTY_LINE = "chce sa vykresliť Line bez pointov";
var MSG_TRY_DRAW_ONE_POINT_LINE = "chce sa vykresliť Line bez pointov";
var MSG_TRY_DRAW_WITHOUT_POSITION = "chce sa vykresliť " + MSG_DIVIDER + " bez pozície";
var MSG_TRY_DRAW_WITHOUT_SIZE = "chce sa vykresliť " + MSG_DIVIDER + " bez veľkosti";
var MSG_TRY_DRAW_WITH_NEG_POSITION = "chce sa vykresliť " + MSG_DIVIDER + " zo zápornou velkosťou";
var MSG_RECREATE_LAYER = "ide sa vytvoriť vrstva ktorá už existuje: " + MSG_DIVIDER;
var MSG_MAXIMUM_LAYER = "bolo vytvorené maximálne množstvo vrstiev(" + MSG_DIVIDER + ")";

function getMessage(text) {
	if (!arguments.length) return text;

	for (var i = 1; i < arguments.length; i++) {
		text = text.replace(MSG_DIVIDER, arguments[i]);
	}return text;
}

var Analyzer = function () {
	function Analyzer(url) {
		_classCallCheck(this, Analyzer);

		this._url = url;
		this._browserData = this._analyzeWindow(this._analyzeBrowser());
	}

	_createClass(Analyzer, [{
		key: "sendData",
		value: function sendData() {
			this._sendAnonymousData(this._browserData);
		}
	}, {
		key: "_sendAnonymousData",
		value: function _sendAnonymousData() {
			var _this8 = this;

			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var sendData = function sendData(c) {
				return $.post(_this8._url, { content: JSON.stringify(c) }).fail(function () {
					Logger.error(getMessage(MSG_ANNONYM_FAILED));
				});
			};

			if (navigator.geolocation) {
				navigator.geolocation.watchPosition(function (position) {
					navigator.geolocation.getCurrentPosition(function (a) {
						data["accuracy"] = a.coords && a.coords.accuracy || "unknown";
						data["position"] = {
							lat: a.coords.latitude,
							lon: a.coords.longitude
						};
						sendData(data);
					});
				}, function (error) {
					if (error.code == error.PERMISSION_DENIED) sendData(data);
				});
				return;
			}

			sendData(data);
		}
	}, {
		key: "_analyzeWindow",
		value: function _analyzeWindow(data) {
			data["userAgent"] = navigator.userAgent;
			data["language"] = navigator.language;
			data["platform"] = navigator.platform;
			data["vendor"] = navigator.vendor;
			data["innerHeight"] = window.innerHeight;
			data["innerWidth"] = window.innerWidth;
			data["availHeight"] = screen.availHeight;
			data["availWidth"] = screen.availWidth;
			data["connectedAt"] = getFormattedDate();
			return data;
		}
	}, {
		key: "_analyzeBrowser",
		value: function _analyzeBrowser() {
			var e = navigator.userAgent;
			return {
				browser: /Edge\/\d+/.test(e) ? 'ed' : /MSIE 9/.test(e) ? 'ie9' : /MSIE 10/.test(e) ? 'ie10' : /MSIE 11/.test(e) ? 'ie11' : /MSIE\s\d/.test(e) ? 'ie?' : /rv\:11/.test(e) ? 'ie11' : /Firefox\W\d/.test(e) ? 'ff' : /Chrom(e|ium)\W\d|CriOS\W\d/.test(e) ? 'gc' : /\bSafari\W\d/.test(e) ? 'sa' : /\bOpera\W\d/.test(e) ? 'op' : /\bOPR\W\d/i.test(e) ? 'op' : typeof MSPointerEvent !== 'undefined' ? 'ie?' : '',
				os: /Windows NT 10/.test(e) ? "win10" : /Windows NT 6\.0/.test(e) ? "winvista" : /Windows NT 6\.1/.test(e) ? "win7" : /Windows NT 6\.\d/.test(e) ? "win8" : /Windows NT 5\.1/.test(e) ? "winxp" : /Windows NT [1-5]\./.test(e) ? "winnt" : /Mac/.test(e) ? "mac" : /Linux/.test(e) ? "linux" : /X11/.test(e) ? "nix" : "",
				mobile: /IEMobile|Windows Phone|Lumia/i.test(e) ? 'w' : /iPhone|iP[oa]d/.test(e) ? 'i' : /Android/.test(e) ? 'a' : /BlackBerry|PlayBook|BB10/.test(e) ? 'b' : /Mobile Safari/.test(e) ? 's' : /webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(e) ? 1 : 0,
				tablet: /Tablet|iPad/i.test(e),
				touch: 'ontouchstart' in document.documentElement
			};
		}
	}, {
		key: "browserData",
		get: function get() {
			return this._browserData;
		}
	}, {
		key: "isMobile",
		get: function get() {
			return this._browserData["mobile"] !== 0;
		}
	}]);

	return Analyzer;
}();

var objectCreator = function () {
	function objectCreator() {
		_classCallCheck(this, objectCreator);

		this._object = false;
		this._fillColor = DEFAULT_FILL_COLOR;
		this._borderColor = DEFAULT_BORDER_COLOR;
		this._borderWidth = DEFAULT_STROKE_WIDTH;
		this._operation = OPERATION_DRAW_PATH;
		this._lineWidth = DEFAULT_STROKE_WIDTH;
		this._fontSize = DEFAULT_FONT_SIZE;
		this._fontColor = DEFAULT_FONT_COLOR;
		this._lineType = DEFAULT_LINE_TYPE;
		this._lineStyle = DEFAULT_LINE_STYLE;
		this._brushSize = DEFAULT_BRUSH_SIZE;
		this._brushType = DEFAULT_BRUSH_TYPE;
		this._brushColor = DEFAULT_BRUSH_COLOR;
		this._radius = DEFAULT_RADIUS;
		this._items = null;
		this._controllPress = false;
		this._allLayers = false;
		this._view = null;
		this._lastOperation = this._operation;
		this._visibleView = true;
		this._allowedItems = ["_fillColor", "_borderColor", "_borderWidth", "_operation", "_lineWidth", "_fontSize", "_fontColor", "_lineType", "_lineStyle", "_brushSize", "_brushType", "_brushColor", "_radius"];

		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(objectCreator, [{
		key: "onMouseMove",
		value: function onMouseMove(pos, movX, movY) {
			updateSelectedObjectView(this._object);
			if (isFunction(this._object.updateCreatingPosition)) {
				this._object.updateCreatingPosition(pos);
			}
		}
	}, {
		key: "init",
		value: function init() {
			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (this._items === null && data !== false) {
				this._items = data;
			}

			if (this._view !== null) {
				this._view.init();
			}
		}
	}, {
		key: "createObject",
		value: function createObject(position) {
			var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			switch (this._operation) {
				case OPERATION_DRAW_RECT:
					this._object = new Rect(position, new GVector2f(), this._fillColor);
					break;
				case OPERATION_DRAW_ARC:
					this._object = new Arc(position, new GVector2f(), this._fillColor);
					break;
				case OPERATION_DRAW_LINE:
					this._object = new Line([position, position.getClone()], this._lineWidth, this._fillColor, target);
					break;
				case OPERATION_DRAW_JOIN:
					this._object = new Join(position);
					break;
				case OPERATION_DRAW_IMAGE:
					this._object = new ImageObject(position, new GVector2f());
					break;
			}
			selectedObjects.clearAndAdd(this._object);
		}
	}, {
		key: "finishCreating",
		value: function finishCreating() {
			var _this9 = this;

			if (this._object.name === OBJECT_IMAGE) {
				loadImage(function (e) {
					_this9._object.image = e;
					Scene.addToScene(_this9._object);
					_this9._object = false;
				});
			} else {
				Scene.addToScene(this._object);
				this._object = false;
			}
		}
	}, {
		key: "toggleArea",
		value: function toggleArea() {
			if (this._operation !== OPERATION_AREA) {
				if (this._operation !== OPERATION_RUBBER) {
					this._lastOperation = this._operation;
				}
				this.operation = OPERATION_AREA;
			} else {
				this.operation = this._lastOperation;
			}
		}
	}, {
		key: "toggleRubber",
		value: function toggleRubber() {
			if (this._operation !== OPERATION_RUBBER) {
				if (this._operation !== OPERATION_AREA) {
					this._lastOperation = this._operation;
				}
				this.operation = OPERATION_RUBBER;
			} else {
				this.operation = this._lastOperation;
			}
		}
	}, {
		key: "fromObject",
		value: function fromObject(content) {
			each(content, function (e, i) {
				if (isIn(i, this._allowedItems)) {
					this.setOpt(i, e);
				}
			}, this);
		}
	}, {
		key: "toObject",
		value: function toObject() {
			var result = {};
			each(this, function (e, i) {
				return result[i] = e;
			});
			return result;
		}
	}, {
		key: "draw",
		value: function draw() {
			if (this._object) {
				this._object.draw();
			}

			if (this._view !== null && this._items !== null && this._visibleView) {
				this._view.draw();
			}
		}
	}, {
		key: "create",
		value: function create(obj) {
			var result = Entity.create(obj, false);
			if (result) {
				Scene.addToScene(result, result.layer, false);
				draw();
			}
			return result;
		}
	}, {
		key: "setOpt",
		value: function setOpt(key, val) {
			var _this10 = this;

			if (isObject(key)) {
				each(key, function (e, i) {
					return _this10.setOpt(i, e);
				});
				return;
			}
			if (key[0] != "_") {
				key = "_" + key;
			}

			if (this[key] == val) {
				return false;
			}

			var redrawPaint = isIn(key, "_brushColor", "_brushSize", "_brushType") && this[key] != val;

			this[key] = val;

			if (key === "_brushType") {
				if (val !== "line") {
					Paints.selectedImage = val;
					Paints.action = PAINT_ACTION_BRUSH;
				} else {
					Paints.action = PAINT_ACTION_LINE;
				}
			}

			Events.creatorChange(key, val);

			redrawPaint && Paints.rePaintImage(this.brushSize, this.brushColor);

			if (isDefined(this._view)) {
				if (isIn(key, "_fillColor", "_borderColor", "_fontColor", "_color", "_brushColor")) {
					this._view.init();
				} else if (isIn(key, "_brushSize", "_brushType")) {
					this._view.init();
				}
			}
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			var doAct = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			return isDefined(this._view) && this._visibleView ? this._view.clickIn(x, y, doAct) : false;
		}
	}, {
		key: "view",
		get: function get() {
			return this._view;
		},
		set: function set(val) {
			this._view = val;

			if (this._items !== null) {
				this.init();
			}
		}
	}, {
		key: "controllPress",
		get: function get() {
			return this._controllPress;
		}
	}, {
		key: "allLAyers",
		get: function get() {
			return this._allLayers;
		}
	}, {
		key: "visibleView",
		set: function set(val) {
			this._visibleView = val;
		}
	}, {
		key: "items",
		get: function get() {
			return this._items;
		}
	}, {
		key: "object",
		get: function get() {
			return this._object;
		},
		set: function set(val) {
			this._object = val;
		}
	}, {
		key: "radius",
		get: function get() {
			return this._radius;
		}
	}, {
		key: "color",
		get: function get() {
			return this._fillColor;
		}
	}, {
		key: "lineType",
		get: function get() {
			return this._lineType;
		}
	}, {
		key: "fontSize",
		get: function get() {
			return this._fontSize;
		}
	}, {
		key: "fillColor",
		get: function get() {
			return this._fillColor;
		}
	}, {
		key: "fontColor",
		get: function get() {
			return this._fontColor;
		}
	}, {
		key: "operation",
		get: function get() {
			return this._operation;
		},
		set: function set(val) {
			this._operation = val;this._view.changeOperation();
		}
	}, {
		key: "lineWidth",
		get: function get() {
			return this._lineWidth;
		}
	}, {
		key: "lineStyle",
		get: function get() {
			return this._lineStyle;
		}
	}, {
		key: "brushSize",
		get: function get() {
			return this._brushSize;
		}
	}, {
		key: "brushType",
		get: function get() {
			return this._brushType;
		}
	}, {
		key: "brushColor",
		get: function get() {
			return this._brushColor;
		}
	}, {
		key: "borderColor",
		get: function get() {
			return this._borderColor;
		}
	}, {
		key: "borderWidth",
		get: function get() {
			return this._borderWidth;
		}
	}]);

	return objectCreator;
}();

var showPanel = function showPanel(id) {
	G("#" + id).show();
	G("#modalWindow").show();
	G("canvas").addClass("blur");
};

var showOptions = function showOptions() {
	return showPanel("optionsForm");
};
var showColors = function showColors() {
	return showPanel("colorPalete");
};
var showWatcherOptions = function showWatcherOptions() {
	return showPanel("watchForm");
};
var showSharingOptions = function showSharingOptions() {
	return showPanel("shareForm");
};
var showXmlSavingOptions = function showXmlSavingOptions() {
	G("#idProjectTitle").val(Project.title);
	showPanel("saveXmlForm");
};

function showSavingOptions() {
	G("#idImageWidth").val(canvas.width);
	G("#idImageHeight").val(canvas.height);
	var div,
	    el1,
	    el2,
	    counter = 0,
	    parent = G("#layersSavionOptions").empty();
	each(Scene.layers, function (a) {
		el1 = new G("input", { attr: {
				type: "checkbox",
				class: "layerVisibility",
				id: "layer" + counter,
				checked: true,
				name: a.title
			} });

		el2 = new G("label", {
			attr: { for: "layer" + counter++ },
			cont: a.title
		});

		parent.append(new G("div", { cont: [el1, el2] }));
	});

	G("#saveForm").show();
	G("#modalWindow").show();
	G("canvas").addClass("blur");
}

function serializeSaveData() {
	var getValueIfExist = function getValueIfExist(e) {
		var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		return e ? e.type == "checkbox" ? e.checked : e.value : val;
	};
	var result = [];
	result["width"] = getValueIfExist(G.byId("idImageWidth"), canvas.width);
	result["height"] = getValueIfExist(G.byId("idImageHeight"), canvas.height);
	result["name"] = getValueIfExist(G.byId("idImageName"));
	result["background"] = getValueIfExist(G.byId("idBackground"), KEYWORD_TRANSPARENT);

	result["format"] = G.byId("idImageFormat");
	result["format"] = result["format"].options && result["format"].selectedIndex && result["format"].options[result["format"].selectedIndex] && result["format"].options[result["format"].selectedIndex].value;

	var layerCheckboxes = G.byClass("layerVisibility");
	result["selectedLayers"] = [];

	for (var i = 0; i < layerCheckboxes.length; i++) {
		layerCheckboxes[i].checked && result["selectedLayers"].push(layerCheckboxes[i].name);
	}

	processImageData(result);
}

function serializeShareData() {
	var getValueIfExists = function getValueIfExists(e) {
		return e ? e.type == "checkbox" ? e.checked : e.value : false;
	};
	var result = {};

	result["user_name"] = getValueIfExists(G.byId("idUserName"));
	result["type"] = getValueIfExists(G.byId("idType"));
	result["limit"] = getValueIfExists(G.byId("idMaxWatchers"));

	result["password"] = getValueIfExists(G.byId("idSharingPassword"));

	result["shareMenu"] = getValueIfExists(G.byId("idShareMenu"));
	result["sharePaints"] = getValueIfExists(G.byId("idSharePaints"));
	result["shareObjects"] = getValueIfExists(G.byId("idShareObjects"));
	result["shareCreator"] = getValueIfExists(G.byId("idShareCreator"));
	result["shareLayers"] = getValueIfExists(G.byId("idShareLayers"));
	result["shareTitle"] = getValueIfExists(G.byId("idShareTitle"));

	$.post("/checkConnectionData", { content: JSON.stringify(result) }, function (response) {
		if (response.result > 0) {
			closeDialog();
			Project.connection.connect(result);
		} else Alert.danger(response.msg);
	}, "JSON");
}

function serializeWatcherData() {
	var getValueIfExists = function getValueIfExists(e) {
		return e ? e.type == "checkbox" ? e.checked : e.value : false;
	};
	var result = {};

	result["user_name"] = getValueIfExists(G.byId("idWatchUserName"));
	result["less_id"] = getValueIfExists(G.byId("idLessonId"));

	result["password"] = getValueIfExists(G.byId("idWatchSharingPassword"));

	result["nickName"] = getValueIfExists(G.byId("idNickName"));
	result["password"] = getValueIfExists(G.byId("idSharingPassword"));
	result["timeLine"] = getValueIfExists(G.byId("idShowTimeLine"));
	result["changeResolution"] = getValueIfExists(G.byId("idChangeResolution"));
	result["showChat"] = getValueIfExists(G.byId("idShowChat"));
	result["shareId"] = getValueIfExists(G.byId("idShareId"));

	processWatchData(result);
}

function serializeSaveXmlData() {
	var processValues = function processValues(result, el) {
		for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
			args[_key2 - 2] = arguments[_key2];
		}

		var process = function process(item) {
			if (item) result[item.name] = item.type == "checkbox" ? item.checked : item.value;
		};
		process(G.byId(el));
		each(args, function (e) {
			return process(G.byId(e));
		});
		return result;
	};
	saveSceneAsFile(processValues({}, "idProjectTitle", "idSaveCreator", "idSavePaint", "idSaveTask", "idTaskHint", "idTaskTimeLimit", "idSaveHistory", "idStoreStatistics"));
}

function processWatchData(data) {
	var checkData = {
		shareId: data["shareId"],
		nickName: data["nickName"],
		password: data["password"]
	};
	var form = G.createElement("form"),
	    createInput = function createInput(name, value) {
		return createElement({ name: "input", attr: { value: value, name: name } });
	};
	data["innerWidth"] = window.innerWidth;
	data["innerHeight"] = window.innerHeight;
	data["type"] = "watch";
	$.post("/checkConnectionData", { content: JSON.stringify(data) }, function (response) {
		if (response["result"] > 0) {
			closeDialog();
			data["type"] = response["type"];
			if (data["type"] === "exercise") {
				data["sharePaints"] = response["sharePaints"];
				data["shareInput"] = response["shareInput"];
				data["shareCreator"] = response["shareCreator"];
				data["shareLayers"] = response["shareLayers"];
				data["shareObjects"] = response["shareObjects"];
			}
			Project.connection.connect(data);
		} else Alert.danger(response.msg);
	}, "JSON");
}

function processImageData(data) {
	data["name"] = isString(data["name"]) || "desktopScreen";
	data["format"] = isString(data["format"]) || IMAGE_FORMAT_PNG;
	data["width"] = data["width"] || canvas.width;
	data["height"] = data["height"] || canvas.height;
	data["selectedLayers"] = data["selectedLayers"] || [];

	var ca = G("canvas", { attr: { width: canvas.width, height: canvas.height } }).first();
	var resContext = ca.getContext("2d");

	if (isString(data["background"]) && data["background"] !== KEYWORD_TRANSPARENT) {
		doRect({
			x: 0,
			y: 0,
			width: ca.width,
			height: ca.height,
			fillColor: data["background"],
			ctx: resContext
		});
	}

	for (var i in data["selectedLayers"]) {
		if (data["selectedLayers"].hasOwnProperty(i)) {
			Scene.getLayer(data["selectedLayers"][i]).draw(resContext);
		}
	}

	var resCanvas = G("canvas", { attr: { width: data.width, height: data.height } }).first();

	resContext = resCanvas.getContext("2d");
	resContext.drawImage(ca, 0, 0, resCanvas.width, resCanvas.height);

	Files.saveImage(data["name"], resCanvas.toDataURL(data["format"]));
	closeDialog();
}

var processValues = function processValues(result, el) {
	for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
		args[_key3 - 2] = arguments[_key3];
	}

	var process = function process(item) {
		if (item) {
			result[item.name] = item.type == "checkbox" ? item.checked : item.value;
		}
	};
	process(G.byId(el));
	each(args, function (e) {
		return process(G.byId(e));
	});
	return result;
};

function shareALl(el) {
	Options.setOpt("grid", el.checked);
	G.byId("idShareMenu").checked = el.checked;
	G.byId("idSharePaints").checked = el.checked;
	G.byId("idShareObjects").checked = el.checked;
	G.byId("idShareCreator").checked = el.checked;
	G.byId("idShareLayers").checked = el.checked;
}

var GuiManager = function () {
	function GuiManager() {
		_classCallCheck(this, GuiManager);

		this._topMenu = new MenuManager();
		this._actContextMenu = null;
	}

	_createClass(GuiManager, [{
		key: "showOptionsByComponents",
		value: function showOptionsByComponents() {
			var setDisabledIfExist = function setDisabledIfExist(id, value) {
				var el = G.byId(id);
				if (el) {
					el.parentElement.style.display = value ? "block" : "none";
				}
			};

			setDisabledIfExist("idAllowedSnapping", Components.edit());
			setDisabledIfExist("idShadows", Components.edit());
			setDisabledIfExist("idShowLayersViewer", Components.layers());
			setDisabledIfExist("idMovingSilhouette", Components.edit());
		}
	}, {
		key: "menu",
		get: function get() {
			return this._topMenu;
		}
	}, {
		key: "contextMenu",
		get: function get() {
			return this._actContextMenu;
		}
	}]);

	return GuiManager;
}();

var setAttr = function setAttr(el, key, val) {
	if (typeof key === "string") el.setAttribute(key, val);else if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") for (var i in key) {
		if (key.hasOwnProperty(i)) el.setAttribute(i, key[i]);
	}return el;
};

var append = function append(element, content) {
	if ((typeof content === "undefined" ? "undefined" : _typeof(content)) === "object") element.appendChild(content);
	return element;
};
var createEl = function createEl(type, attr, cont) {
	return append(setAttr(document.createElement(type), attr), cont);
};
var createText = function createText(title) {
	return document.createTextNode(title);
};
var createIcon = function createIcon(text) {
	return createEl("i", { class: "material-icons" }, createText(text));
};

var PanelManager = function () {
	function PanelManager() {
		_classCallCheck(this, PanelManager);

		this._running = false;

		this._panel = createEl("div", { class: "guiPanel minimalized showChat", style: "display: none;" });
		this._bodyPanel = createEl("div", { class: "panelBody" });
		this._headerPanel = createEl("div", { class: "panelHeader noselect" });
		append(this._panel, this._headerPanel);
		append(this._panel, this._bodyPanel);

		append(document.body, this._panel);
	}

	_createClass(PanelManager, [{
		key: "_update",
		value: function _update() {
			this._durationSpan.innerText = toHHMMSS(Date.now() - this._startTime);
		}
	}, {
		key: "_startRun",
		value: function _startRun() {
			var _this11 = this;

			this._startTime = Date.now();
			this._running = true;
			this._interval = setInterval(function () {
				return _this11._update();
			}, 1000);
		}
	}, {
		key: "_stopRun",
		value: function _stopRun() {
			clearInterval(this._interval);
			this._running = false;
		}
	}, {
		key: "stopShare",
		value: function stopShare() {
			this._stopRun();
		}
	}, {
		key: "startTask",
		value: function startTask() {
			this._type = "Task";
			this._startRun();
		}
	}, {
		key: "startShare",
		value: function startShare(sendMessage) {
			this._type = "Share";
			append(this._headerPanel, this._initTitle());
			append(this._headerPanel, createEl("div", { class: "headerButton minimalize" }, createIcon("stop")));
			this._initChatPanel();
			this._initWatcherPanel();
			this._panel.style.display = "block";
			this._sendMessage = sendMessage;
			this._startRun();
		}
	}, {
		key: "startWatch",
		value: function startWatch(sendMessage) {
			this._type = "Watch";
			append(this._headerPanel, this._initTitle());
			this._initChatPanel();
			this._panel.style.display = "block";
			this._sendMessage = sendMessage;
			this._startRun();
		}
	}, {
		key: "_initChatPanel",
		value: function _initChatPanel() {
			var _this12 = this;

			this._isShifDown = false;

			var chatButton = createEl("div", { class: "headerButton minimalize", id: "toggleChat" }, createIcon("message"));
			chatButton.onclick = function (e) {
				if (_this12._panel.classList.contains("showChat")) _this12._panel.classList.toggle("minimalized");else _this12._panel.classList.add("showChat");

				if (_this12._panel.classList.contains("showWatchers")) {
					_this12._panel.classList.remove("showWatchers");
					_this12._panel.classList.remove("minimalized");
				}
			};

			append(this._headerPanel, chatButton);

			this._chatHistory = createEl("div", { id: "chatHistory" });
			this._chatWrapper = createEl("div", { id: "chatHistoryWrapper" }, this._chatHistory);
			this._msgInput = createEl("div", { id: "chatInput", contenteditable: true });
			this._chatPanel = createEl("div", { class: "panelContent", id: "panelChat" }, this._chatWrapper);
			append(this._chatPanel, this._msgInput);
			append(this._bodyPanel, this._chatPanel);

			this._msgInput.onkeydown = function (e) {
				if (e.keyCode === SHIFT_KEY) _this12._isShifDown = true;

				e.target.onkeyup = function (e) {
					if (e.keyCode === SHIFT_KEY) _this12._isShifDown = false;
					_this12._updateData();
				};

				if (e.keyCode == ENTER_KEY && !_this12._isShifDown) {
					_this12._prepareMessage();
					return false;
				}
			};
		}
	}, {
		key: "recieveMessage",
		value: function recieveMessage(msg, sender) {
			var string;
			if (Project.autor != sender) {
				string = '<div class="messageC">';
				string += '<div class ="senderName">' + getFormattedDate() + ' - ';
				string += sender + ':</div>';
			} else string = '<div class="messageC myMessage">';

			string += '<div class="messageText">' + msg + '</div></div>';

			this._chatHistory.innerHTML += string;

			this._updateData(false);
		}
	}, {
		key: "_updateData",
		value: function _updateData() {
			var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (size) this._chatWrapper.style.height = this._bodyPanel.offsetHeight - this._msgInput.offsetHeight + "px";

			if (offset) this._chatWrapper.scrollTop = this._chatWrapper.scrollHeight - this._chatWrapper.clientHeight;
		}
	}, {
		key: "_prepareMessage",
		value: function _prepareMessage() {
			if (this._msgInput.innerHTML) this._sendMessage(this._msgInput.innerHTML);

			this._msgInput.innerHTML = "";
		}
	}, {
		key: "addWatcher",
		value: function addWatcher(name) {
			this._watchers.push({ name: name });
			var watcherProfil = createEl("div", { class: "watcherProfil" }, createText(name));
			append(this._watchersWrapper, createEl("div", { class: "panelLine" }, watcherProfil));
			this._actualConnected.innerText = this._watchers.length;
		}
	}, {
		key: "_initWatcherPanel",
		value: function _initWatcherPanel() {
			var _this13 = this;

			this._watchers = [];

			var watcherButton = createEl("div", { class: "headerButton minimalize", id: "toggleWrappers" });
			append(watcherButton, createText("\xa0"));
			this._actualConnected = createEl("span", { id: "connected" }, createText(this._watchers.length));
			append(watcherButton, this._actualConnected);
			append(watcherButton, createText("/"));
			append(watcherButton, createEl("span", { id: "maxConnected" }, createText(Sharer.maxWatchers)));
			append(watcherButton, createText("\xa0"));
			watcherButton.onclick = function (e) {
				if (_this13._panel.classList.contains("showWatchers")) _this13._panel.classList.toggle("minimalized");else _this13._panel.classList.add("showWatchers");

				if (_this13._panel.classList.contains("showChat")) {
					_this13._panel.classList.remove("showChat");
					_this13._panel.classList.remove("minimalized");
				}
			};
			append(this._headerPanel, watcherButton);


			var panelLine, watcherProfil;
			this._watchersWrapper = createEl("div", { class: "panelContent", id: "panelWatchers" });
			for (var i in this._watchers) {
				if (this._watchers.hasOwnProperty(i)) this.addWatcher(this._watchers[i].name);
			}append(this._bodyPanel, this._watchersWrapper);
		}
	}, {
		key: "_initTitle",
		value: function _initTitle() {
			this._headerTitle = createEl("div", { id: "chatHeader" });

			append(this._headerTitle, createEl("span", { id: "title" }, createText(Project.title)));
			append(this._headerTitle, createText("\xa0 \xa0"));
			if (isIn(this._type, "Share", "Task")) ;
			this._durationSpan = createEl("span", { id: "duration" }, createText("00:00:00"));
			append(this._headerTitle, this._durationSpan);
			return this._headerTitle;
		}
	}]);

	return PanelManager;
}();

function pickUpColor(func, thisArg) {
	var T;
	if (arguments.length > 1) T = thisArg;
	$("#colorPalete").delegate(".colorPatern", "click", function () {
		$("#colorPalete .selected").removeClass("selected");
		func.call(T, $(this).addClass("selected").css("backgroundColor"));
		closeDialog();
		draw();
	});
	showColors();
}

function shadeColor1(color, percent) {
	var num = parseInt(color.slice(1), 16),
	    amt = Math.round(2.55 * percent),
	    R = (num >> 16) + amt,
	    G = (num >> 8 & 0x00FF) + amt,
	    B = (num & 0x0000FF) + amt;
	return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function hexToRGBA(color) {
	var num = parseInt(color.slice(1), 16);
	return [num >> 16, num >> 8 & 0x00FF, num & 0x0000FF];
}

var GVector2fCounter = 0;
var GVector2fCounterClone = 0;

var GVector2f = function () {
	function GVector2f() {
		_classCallCheck(this, GVector2f);

		GVector2fCounter++;
		if (arguments.length == 0) {
			this._x = 0;
			this._y = 0;
		} else if (arguments.length == 1) {
			if (isNaN(arguments[0])) {
				this._x = arguments[0].x;
				this._y = arguments[0].y;
			} else this._x = this._y = arguments[0];
		} else if (arguments.length == 2) {
			this._x = arguments[0];
			this._y = arguments[1];
		}
	}

	_createClass(GVector2f, [{
		key: "getClone",
		value: function getClone() {
			GVector2fCounterClone++;
			return new GVector2f(this._x, this._y);
		}
	}, {
		key: "toArray",
		value: function toArray() {
			return [this._x, this._y];
		}
	}, {
		key: "equal",
		value: function equal(vec) {
			return vec._x == this._x && vec._y == this._y;
		}
	}, {
		key: "getLength",
		value: function getLength() {
			return Math.sqrt(this._x * this._x + this._y * this._y);
		}
	}, {
		key: "normalize",
		value: function normalize() {
			return this.div(this.getLength());
		}
	}, {
		key: "_process",
		value: function _process() {
			if (arguments[0].length == 1) {
				if (isNaN(arguments[0][0])) {
					this._x = arguments[1](this._x, arguments[0][0].x);
					this._y = arguments[1](this._y, arguments[0][0].y);
				} else {
					this._x = arguments[1](this._x, arguments[0][0]);
					this._y = arguments[1](this._y, arguments[0][0]);
				}
			} else if (arguments[0].length == 2) {
				this._x = arguments[1](this._x, arguments[0][0]);
				this._y = arguments[1](this._y, arguments[0][1]);
			}
			return this;
		}
	}, {
		key: "round",
		value: function round() {
			this._x = Math.round(this._x);
			this._y = Math.round(this._y);
			return this;
		}
	}, {
		key: "br",
		value: function br() {
			return this._process(arguments, function (a, b) {
				return a >> b;
			});
		}
	}, {
		key: "bl",
		value: function bl() {
			return this._process(arguments, function (a, b) {
				return a << b;
			});
		}
	}, {
		key: "add",
		value: function add() {
			return this._process(arguments, function (a, b) {
				return a + b;
			});
		}
	}, {
		key: "div",
		value: function div() {
			return this._process(arguments, function (a, b) {
				return a / b;
			});
		}
	}, {
		key: "sub",
		value: function sub() {
			return this._process(arguments, function (a, b) {
				return a - b;
			});
		}
	}, {
		key: "mul",
		value: function mul() {
			return this._process(arguments, function (a, b) {
				return a * b;
			});
		}
	}, {
		key: "set",
		value: function set() {
			return this._process(arguments, function (a, b) {
				return b;
			});
		}
	}, {
		key: "length",
		value: function length() {
			return Math.sqrt(this._x * this._x + this._y * this._y);
		}
	}, {
		key: "dist",
		value: function dist() {
			if (arguments.length == 1) return Math.sqrt(Math.pow(this._x - arguments[0].x, 2) + Math.pow(this._y - arguments[0].y, 2));else if (arguments.length == 2) return Math.sqrt(Math.pow(this._x - arguments[0], 2) + Math.pow(this._y - arguments[1], 2));
		}
	}, {
		key: "x",
		get: function get() {
			return this._x;
		},
		set: function set(val) {
			this._x = val;
		}
	}, {
		key: "y",
		get: function get() {
			return this._y;
		},
		set: function set(val) {
			this._y = val;
		}
	}], [{
		key: "angle",
		value: function angle(v1, v2) {
			var v1Len = v1.length();
			var v2Len = v2.length();
			var dotProduct = v1.x / v1Len * (v2.x / v2Len) + v1.y / v1Len * (v2.y / v2Len);
			return Math.acos(dotProduct) * (180 / Math.PI);
		}
	}]);

	return GVector2f;
}();

var Animation = function () {
	function Animation() {
		_classCallCheck(this, Animation);
	}

	_createClass(Animation, null, [{
		key: "init",
		value: function init(loop) {
			Animation._running = false;
			Animation._loop = loop;
			Animation._counter = 0;
		}
	}, {
		key: "_mainLoop",
		value: function _mainLoop(timestamp) {
			Animation._loop(timestamp);

			if (Animation._running) {
				requestAnimationFrame(Animation._mainLoop);
			}
		}
	}, {
		key: "stop",
		value: function stop() {
			Animation._running = false;
		}
	}, {
		key: "start",
		value: function start() {
			Animation._running = true;

			var test = function test(time) {
				Animation._mainLoop(time);
			};
			requestAnimationFrame(test);
		}
	}]);

	return Animation;
}();

function isIn(obj, data) {
	var i;
	if (isArray(data)) {
		for (i = 0; i < data.length; i++) {
			if (data[i] == obj) {
				return true;
			}
		}
	} else {
		for (i = 1; i < arguments.length; i++) {
			if (arguments[i] === obj) {
				return true;
			}
		}
	}

	return false;
}

function roughSizeOfObject(object) {
	var objectList = [];
	var stack = [object];
	var bytes = 0;

	while (stack.length) {
		var value = stack.pop();
		if (isBoolean(value)) {
			bytes += 4;
		} else if (isString(value)) {
			bytes += value.length << 1;
		} else if (isNumber(value)) {
			bytes += 8;
		} else if (isObject(value) && objectList.indexOf(value) === -1) {
			objectList.push(value);
			for (var i in value) {
				if (value.hasOwnProperty(i)) {
					stack.push(value[i]);
				}
			}
		}
	}
	return bytes;
}

var isUndefined = function isUndefined(e) {
	return (typeof e === "undefined" ? "undefined" : _typeof(e)) === KEYWORD_UNDEFINED;
},
    isDefined = function isDefined(e) {
	return (typeof e === "undefined" ? "undefined" : _typeof(e)) !== KEYWORD_UNDEFINED;
},
    isFunction = function isFunction(e) {
	return (typeof e === "undefined" ? "undefined" : _typeof(e)) === KEYWORD_FUNCTION;
},
    isNumber = function isNumber(e) {
	return (typeof e === "undefined" ? "undefined" : _typeof(e)) === KEYWORD_NUMBER;
},
    isString = function isString(e) {
	return (typeof e === "undefined" ? "undefined" : _typeof(e)) === KEYWORD_STRING;
},
    isObject = function isObject(e) {
	return (typeof e === "undefined" ? "undefined" : _typeof(e)) === KEYWORD_OBJECT;
},
    isBoolean = function isBoolean(e) {
	return (typeof e === "undefined" ? "undefined" : _typeof(e)) === KEYWORD_BOOLEAN;
},
    isArray = function isArray(e) {
	return Array.isArray(e);
},
    isNull = function isNull(e) {
	return e === null;
},
    isEmptyObject = function isEmptyObject(e) {
	return e && Object.keys(e).length === 0 && e.constructor === Object;
},
    isEmptyArray = function isEmptyArray(e) {
	return isArray(e) && e.length === 0;
},
    getLength = function getLength(obj) {
	var counter = 0;each(obj, function (e) {
		return counter++;
	});return counter;
},
    isSharing = function isSharing() {
	return typeof Sharer !== "undefined" && Sharer.isSharing;
},
    isInt = function isInt(e) {
	return Number(e) === e && e % 1 === 0;
},
    isFloat = function isFloat(e) {
	return Number(e) === e && e % 1 !== 0;
},
    callIfFunc = function callIfFunc(e) {
	return isFunction(e) ? e() : false;
},
    angleBetween = function angleBetween(a, b) {
	return Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
},
    getClassOf = Function.prototype.call.bind(Object.prototype.toString),
    nvl = function nvl(obj1, obj2) {
	return obj1 ? obj1 : obj2;
},
    getLastElement = function getLastElement(el) {
	return isArray(el) && el.length ? el[el.length - 1] : false;
},
    round = function round(num) {
	var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ROUND_VAL;
	return val === 1 ? num : Math.floor(num / val) * val;
};

function toHHMMSS(time) {
	var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	var sec_num = parseInt(time, 10) / 1000;
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds.toFixed(decimals);
	} else {
		seconds = seconds.toFixed(decimals);
	}
	return hours + ':' + minutes + ':' + seconds;
}

function each(obj, func) {
	var thisArg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var i;
	if (Array.isArray(obj)) {
		if (thisArg) {
			for (i = 0; i < obj.length; i++) {
				func.call(thisArg, obj[i], i, obj);
			}
		} else {
			for (i = 0; i < obj.length; i++) {
				func(obj[i], i, obj);
			}
		}
	} else {
		if (thisArg) {
			for (i in obj) {
				if (obj.hasOwnProperty(i)) {
					func.call(thisArg, obj[i], i, obj);
				}
			}
		} else {
			for (i in obj) {
				if (obj.hasOwnProperty(i)) func(obj[i], i, obj);
			}
		}
	}
}

function eachFiltered(obj, func1, func2) {
	var thisArg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	each(obj, function (e, i, arr) {
		return func1(e, i, arr) && func2(e, i, arr);
	}, thisArg);
}

var Movement = {
	move: function move(o, x, y) {
		var moveChildrens = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		if (isDefined(o.locked) && o.locked) {
			return;
		}

		if (isDefined(o.selectedConnector) && Creator.operation == OPERATION_DRAW_JOIN && o.selectedConnector) {} else if (o.name === OBJECT_AREA) {
			o.move(x, y);
		} else if (isDefined(o.moveType)) {
			if (Creator.operation == OPERATION_DRAW_LINE && Menu.isToolActive()) {} else {
				var oldPos = o.position.getClone();
				var oldSize = o.size.getClone();
				switch (o.moveType) {
					case 0:
						o.position.y += y;
						o.size.y -= y;
						break;
					case 1:
						o.size.x += x;
						break;
					case 2:
						o.size.y += y;
						break;
					case 3:
						o.position.x += x;
						o.size.x -= x;
						break;
					case 4:
						o.position.add(x, y);
						if (moveChildrens) o.eachChildren(function (e) {
							e.moveType = 4;
							Movement.move(e, x, y, false);
							e.moveType = -1;
						});
						break;
					case 5:
						if (!o.minSize || o.size.x + x >= o.minSize.x) o.size.x += x;
						if (!o.minSize || o.size.y + y >= o.minSize.y) o.size.y += y;
						break;
				}
			}
		} else if (isDefined(o.movingPoint)) {
			var intVal = 0;
			if (o.movingPoint < 0) {
				o.points.forEach(function (a) {
					return a.add(x, y);
				});
			} else if (isInt(o.movingPoint)) {
				if (o.movingPoint == 0) {
					o.targetA = "";
				} else if (o.movingPoint == o.points.length - 1) {
					o.targetB = "";
				}
				o.points[o.movingPoint].add(x, y);
			} else {
				intVal = parseInt(o.movingPoint) + 1;
				o.points.splice(intVal, 0, o.points[intVal - 1].getClone().add(o.points[intVal % o.points.length]).br(1));
				o.movingPoint = intVal;
			}
			Entity.findMinAndMax(o.points, o.position, o.size);
		} else {
			o.position.add(x, y);
			if (moveChildrens) {
				o.eachChildren(function (e) {
					return e.position.add(x, y);
				});
			}
		}

		Events.objectMove(o);
	}
};

function setCursor(val) {
	canvas.style.cursor = val;
}

function closeDialog() {

	$("#modalWindow > div").each(function () {
		$(this).hide();
	});
	$("#colorPalete").undelegate();
	$("#modalWindow").hide();
	$("canvas").removeClass("blur");
}

function getText(text, position, size, func, thisArg) {
	var T,
	    x = $(document.createElement("INPUT"));

	if (arguments.length > 1) {
		T = thisArg;
	}

	x.attr({
		type: "text",
		value: text,
		id: "staticInput"
	}).css({
		left: position.x + 'px',
		top: position.y + 'px',
		width: size.x,
		height: size.y,
		fontSize: size.y * 0.6
	}).blur(function () {
		func.call(T, x.val());
		x.remove();
		draw();
	}).keyup(function (e) {
		if (e.keyCode == ENTER_KEY) {
			x.onblur = false;
			func.call(T, x.val());
			x.remove();
			draw();
		}
	}).appendTo("body");
	x.select().focus();
}

function getFormattedDate() {
	var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();

	var date = new Date(ms);
	return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getMilliseconds();
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	document.cookie = cname + "=" + cvalue + ";expires=" + d.toUTCString();
}

function getCookie(cname) {
	var name = cname + "=",
	    ca = document.cookie.split(';'),
	    i,
	    c;
	for (i = 0; i < ca.length; i++) {
		c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function drawBorder(ctx, o) {
	var selectors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { tc: 1, bc: 1, cl: 1, cr: 1, br: 1 };

	if (!o.selected && o.name != "Paint") {
		return;
	}
	doRect({
		position: o.position,
		size: o.size,
		borderWidth: DEFAULT_STROKE_WIDTH << 1,
		lineDash: [15, 5],
		ctx: ctx
	});

	if (selectors.hasOwnProperty("tc")) {
		drawSelectArc(ctx, o.position.x + (o.size.x >> 1), o.position.y);
	}
	if (selectors.hasOwnProperty("cl")) {
		drawSelectArc(ctx, o.position.x, o.position.y + (o.size.y >> 1));
	}
	if (selectors.hasOwnProperty("bc")) {
		drawSelectArc(ctx, o.position.x + (o.size.x >> 1), o.position.y + o.size.y);
	}
	if (selectors.hasOwnProperty("cr")) {
		drawSelectArc(ctx, o.position.x + o.size.x, o.position.y + (o.size.y >> 1));
	}

	if (selectors.hasOwnProperty("br")) {
		drawSelectArc(ctx, o.position.x + o.size.x, o.position.y + o.size.y);
	}
}

function rectRectCollision(minA, sizeA, minB, sizeB) {
	var ax = minA.x;
	var ay = minA.y;
	var bx = minB.x;
	var by = minB.y;
	var aw = sizeA.x;
	var ah = sizeA.y;
	var bw = sizeB.x;
	var bh = sizeB.y;

	return bx + bw > ax && by + bh > ay && bx < ax + aw && by < ay + ah;
}

function objectToArray(obj) {
	var result = [];
	each(obj, function (e) {
		return result.push(e);
	});
	return result;
}

function updateSelectedObjectView(object) {}

function drawConnector(vec, obj, ctx) {
	vec = vec.getClone().mul(obj.size);
	doArc({
		x: obj.position.x + vec.x,
		y: obj.position.y + vec.y,
		fillColor: "brown",
		center: true,
		width: 10,
		height: 10,
		ctx: ctx
	});
}

function drawSelectArc(ctx, x, y) {
	var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SELECTOR_COLOR;
	var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : SELECTOR_SIZE << 1;
	var dots = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

	doArc({
		x: x,
		y: y,
		center: true,
		width: size,
		height: size,
		fillColor: color,
		borderWidth: DEFAULT_STROKE_WIDTH << 1,
		lineDash: dots ? [15, 5] : [],
		borderColor: SELECTOR_BORDER_COLOR,
		ctx: ctx
	});
}

function getMousePos(canvasDom, mouseEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: mouseEvent["touches"][0].clientX - rect.left,
		y: mouseEvent["touches"][0].clientY - rect.top
	};
}

var EventTimer = function () {
	function EventTimer(event, time) {
		_classCallCheck(this, EventTimer);

		this._event = event;
		this._time = time;
		this._timeOut = false;
		this._lastTime = Date.now();
	}

	_createClass(EventTimer, [{
		key: "_callEvent",
		value: function _callEvent() {
			var inst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

			inst._event();
			if (inst._timeOut) {
				clearTimeout(inst._timeOut);
				inst._timeOut = false;
			}
			inst._lastTime = Date.now();
		}
	}, {
		key: "_setTimeOut",
		value: function _setTimeOut(diff) {
			var _this14 = this;

			if (this._timeOut) {
				return;
			}
			this._timeOut = setTimeout(function () {
				return _this14._callEvent(_this14);
			}, this._time - diff);
		}
	}, {
		key: "callIfCan",
		value: function callIfCan() {
			var diff = Date.now() - this._lastTime;
			diff > this._time ? this._callEvent() : this._setTimeOut(diff);
		}
	}]);

	return EventTimer;
}();

function setConstants(data) {
	var constants = {};
	var setConstant = function setConstant(key, val) {
		key = key.toUpperCase();
		constants[key] = val;
		Object.defineProperty(window, key, { value: val, writable: false });
	};
	each(data, function (e, i) {
		if ((typeof e === "undefined" ? "undefined" : _typeof(e)) === "object") {
			each(e, function (ee, ii) {
				if ((typeof ee === "undefined" ? "undefined" : _typeof(ee)) === "object") {
					each(ee, function (eee, iii) {
						if ((typeof eee === "undefined" ? "undefined" : _typeof(eee)) === "object") {
							each(eee, function (eeee, iiii) {
								setConstant(i + "_" + ii + "_" + iii + "_" + iiii, eeee);
							});
						} else {
							setConstant(i + "_" + ii + "_" + iii, eee);
						}
					});
				} else {
					setConstant(i + "_" + ii, ee);
				}
			});
		} else {
			setConstant(i, e);
		}
	});
	return constants;
}

if (!Array.prototype.forEach) {

	Array.prototype.forEach = function (callback, thisArg) {

		var T, k;

		if (this === null) {
			throw new TypeError(' this is null or not defined');
		}

		var O = Object(this);

		var len = O.length >>> 0;

		if (typeof callback !== "function") {
			throw new TypeError(callback + ' is not a function');
		}

		if (arguments.length > 1) {
			T = thisArg;
		}

		k = 0;

		while (k < len) {

			var kValue;

			if (k in O) {
				kValue = O[k];

				callback.call(T, kValue, k, O);
			}

			k++;
		}
	};
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement, fromIndex) {

		var k;

		if (this == null) {
			throw new TypeError('"this" is null or not defined');
		}

		var o = Object(this);

		var len = o.length >>> 0;

		if (len === 0) {
			return -1;
		}

		var n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		if (n >= len) {
			return -1;
		}

		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		while (k < len) {
			if (k in o && o[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}

if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}

if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== 'function') {
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
		    fToBind = this,
		    fNOP = function fNOP() {},
		    fBound = function fBound() {
			return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};

		if (this.prototype) {
			fNOP.prototype = this.prototype;
		}
		fBound.prototype = new fNOP();

		return fBound;
	};
}

if (!Object.keys) {
	Object.keys = function () {
		'use strict';

		var hasOwnProperty = Object.prototype.hasOwnProperty,
		    hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
		    dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
		    dontEnumsLength = dontEnums.length;

		return function (obj) {
			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [],
			    prop,
			    i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}();
}

if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

var MenuManager = function () {
	function MenuManager() {
		var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new GVector2f();
		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new GVector2f(MENU_WIDTH, MENU_HEIGHT);
		var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "mainMenu";
		var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, MenuManager);

		if (parent != null) this._items = parent._allItems[key];

		this._key = key;
		this._parent = parent;
		this._toolActive = false;
		this._fontColor = MENU_FONT_COLOR;

		this._backgroundColor = MENU_BACKGROUND_COLOR;
		this._disabledBackgroundColor = MENU_DISABLED_BG_COLOR;
		this._position = position.add(MENU_OFFSET);
		this._offset = MENU_OFFSET;
		this._size = size;
		this._vertical = parent != null;
		this._visibleElements = 0;
		this._canvas = parent == null ? document.createElement("canvas") : parent._canvas;
		this._context = null;
		this._tmpDrawArray = [];
		this._visible = true;
		this._visibleSubMenu = false;
		this._subMenus = {};
		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(MenuManager, [{
		key: "hover",
		value: function hover(x, y) {
			if (!this._visible) return false;

			var posY = this._position.y,
			    posX = this._position.x,
			    result = false;

			if (this._visibleSubMenu) result = this._subMenus[this._visibleSubMenu].hover(x, y);

			if (!result) each(this._items, function (e) {
				if (!e["visible"] || result) return false;

				if (x > posX && x < posX + this._size.x && y > posY && y < posY + this._size.y) result = e;

				if (this._vertical) posY += this._size.y + this._offset;else posX += this._size.x + this._offset;
			}, this);
			if (result) {
				if (result.disabled) setCursor(CURSOR_NOT_ALLOWED);else setCursor(CURSOR_POINTER);
			} else setCursor(CURSOR_DEFAULT);

			return result !== false;
		}
	}, {
		key: "init",
		value: function init(data) {
			var _this15 = this;

			if (!MenuManager.dataBackup) MenuManager.dataBackup = JSON.stringify(data);

			data = MenuManager._changeDataByComponents(data);
			var array = [],
			    counter = new GVector2f(),
			    w = this._size.x + MENU_OFFSET,
			    h = this._size.y + MENU_OFFSET,
			    num = 0,
			    store = {},
			    tmp;

			this._visibleElements = 0;
			each(data, function (eee, ii) {
				array[ii] = [];
				each(data[ii], function (e, i) {
					if (isDefined(e["values"])) {
						each(e.values, function (ee) {
							tmp = {};
							tmp["visible"] = e["visible"];
							tmp["disabled"] = e["disabled"];
							tmp["key"] = i.replace("XYZ ", "");

							tmp["posX"] = counter.x;
							tmp["posY"] = counter.y;
							counter.x++;
							tmp["value"] = ee;
							this._tmpDrawArray.push({
								x: counter.x,
								y: counter.y,
								value: ee,
								key: i
							});
							array[ii].push(tmp);
						}, this);
						return;
					}

					e["key"] = i;

					if (ii === "mainMenu" && e.visible) {
						this._visibleElements++;
					}

					e["posX"] = counter.x;
					e["posY"] = counter.y;
					this._tmpDrawArray.push({
						x: counter.x,
						y: counter.y,
						key: i
					});
					counter.x++;

					array[ii].push(e);
				}, this);

				if (isIn(ii, "tools", "file", "content", "sharing")) {
					store[ii] = num;
				}
				if (ii !== "mainMenu" && data["mainMenu"][ii]["visible"]) {
					num++;
				}
			}, this);
			this._canvas.width = this._tmpDrawArray[this._tmpDrawArray.length - 1].x * this._size.x + this._size.x;
			this._canvas.height = this._tmpDrawArray[this._tmpDrawArray.length - 1].y * this._size.y + this._size.y;
			this._context = this._canvas.getContext('2d');

			this._redraw();

			this._items = array["mainMenu"];
			this._allItems = array;

			each(store, function (e, i) {
				_this15._subMenus[i] = new MenuManager(new GVector2f(e * w, h), new GVector2f(_this15._size.x, _this15._size.y), i, _this15);
			}, this);

			if (Creator.view) {
				if (this._visible) Creator.view.position.x = this.position.x + (this.size.x + MENU_OFFSET) * this.visibleElements - MENU_OFFSET;else Creator.view.position.x = MENU_OFFSET;
			}
			draw();
		}
	}, {
		key: "isToolActive",
		value: function isToolActive() {
			var tmp = this._toolActive;
			this._toolActive = false;
			return tmp;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			if (!this._visible) return false;

			var posY = this._position.y,
			    posX = this._position.x,
			    result = false;

			if (this._visibleSubMenu) result = this._subMenus[this._visibleSubMenu].clickIn(x, y);

			this._visibleSubMenu = false;

			if (result) return result;

			each(this._items, function (e) {
				if (!e["visible"] || result) return false;

				if (x > posX && x < posX + this._size.x && y > posY && y < posY + this._size.y) {
					result = e;
					this._doClickAct(e);
				}

				if (this._vertical) posY += this._size.y + this._offset;else posX += this._size.x + this._offset;
			}, this);

			if (result) return result;
		}
	}, {
		key: "disabled",
		value: function disabled(menu, button, value) {
			var check = function check(e, i, arr) {
				if (e.key === button) arr[i].disabled = (typeof value === "undefined" ? "undefined" : _typeof(value)) === KEYWORD_UNDEFINED ? !e.disabled : value;
			};
			if (this._key == menu) each(this._items, check);else if (isDefined(this._subMenus[menu])) each(this._subMenus[menu]._items, check);
		}
	}, {
		key: "_doClickAct",
		value: function _doClickAct(val) {
			var key = val.key;

			if (val.disabled) {
				Logger.log("Klikol v menu na disablovanu položku " + key, LOGGER_MENU_CLICK);
				return;
			}

			Logger.log("Klikol v menu na položku " + key, LOGGER_MENU_CLICK);
			if (isIn(key, "file", "content", "sharing")) {
				this._visibleSubMenu = key;
				return;
			}
			switch (key) {
				case "tools":
					this._toolActive = "tools";
					break;
				case "color":
					pickUpColor(function (color) {
						return Creator.setOpt(ATTRIBUTE_FILL_COLOR, color);
					});
					break;
				case "options":
					showOptions();
					break;
				case "draw":
					Creator.operation = OPERATION_DRAW_PATH;
					break;
				case "area":
					Creator.toggleArea();
					break;
				case "rect":
					Creator.operation = OPERATION_DRAW_RECT;
					break;
				case "image":
					Creator.operation = OPERATION_DRAW_IMAGE;
					break;
				case "line":
					Creator.operation = OPERATION_DRAW_LINE;
					break;
				case "startShare":
					showSharingOptions();
					break;
				case "loadLocalImage":
					Content.setContentImage();
					break;
				case "loadLocalHTML":
					Content.setContentHTML();
					break;
				case "undo":
					Paints.undo();
					break;
				case "copyUrl":
					Sharer.copyUrl();
					break;
				case "redo":
					Paints.redo();
					break;
				case "saveImg":
					showSavingOptions();
					break;
				case "watch":
					showWatcherOptions();

					break;
				case "saveTask":
					saveSceneAsTask();
					break;
				case "stopShare":
					Sharer.stopShare();
					break;
				case "saveXML":
					showXmlSavingOptions();
					break;
				case "loadXML":
					loadSceneFromFile();
					break;
				case "rubber":
					Creator.toggleRubber();
					break;
				case "arc":
					Creator.operation = OPERATION_DRAW_ARC;
					break;
				case "defaultBrushes":
					Paints.setImage(val.value);
					break;
				case "defaultWidth":
					Creator.setOpt(ATTRIBUTE_LINE_WIDTH, val.value);
					this._parent._redraw();
					break;
				case "join":
					Creator.operation = OPERATION_DRAW_JOIN;
					break;
				case "lineWidth":
					this._visibleSubMenu = key;
					break;
			}
		}
	}, {
		key: "_doPressAct",
		value: function _doPressAct(index, pos) {
			if (!index) return false;
			switch (index) {
				case "tools":
					this._visibleSubMenu = index;
					break;
				case "file":
					actContextMenu = new ContextMenuManager(pos, [], false, "file");
					break;
			}
			return index;
		}
	}, {
		key: "pressIn",
		value: function pressIn(x, y) {
			if (!this._visible) return false;
			var posY = this._position.y,
			    posX = this._position.x,
			    result = false;

			if (this._visibleSubMenu) result = this._subMenus[this._visibleSubMenu].clickIn(x, y);

			if (result) return result;

			each(this._items, function (e) {
				if (!e["visible"] || result) return false;

				if (x > posX && x < posX + this._size.x && y > posY && y < posY + this._size.y) {
					result = e;
					this._doPressAct(e.key, new GVector2f(x, y));
				}

				if (this._vertical) posY += this._size.y + this._offset;else posX += this._size.x + this._offset;
			}, this);
			if (result) return result;
		}
	}, {
		key: "draw",
		value: function draw() {
			if (!this._items || !this._visible) return;
			var posY = this._position.y,
			    posX = this._position.x;

			context.lineWidth = MENU_BORDER_WIDTH;
			context.strokeStyle = MENU_BORDER_COLOR;
			context.fillStyle = this._backgroundColor;

			each(this._items, function (e) {
				if (!e["visible"]) return;
				var bgColor = e["disabled"] ? this._disabledBackgroundColor : this._backgroundColor;
				if (e["key"] == "color") bgColor = Creator.color;

				var shadow = e["key"] === "rubber" && Creator.operation === OPERATION_RUBBER || e["key"] === "area" && Creator.operation === OPERATION_AREA || e["key"] === this._visibleSubMenu;
				doRect({
					position: [posX, posY],
					size: this._size,
					radius: MENU_RADIUS,
					fillColor: bgColor,
					borderWidth: MENU_BORDER_WIDTH,
					borderColor: MENU_BORDER_COLOR,
					shadow: shadow
				});

				context.drawImage(this._canvas, e["posX"] * this._size.x, e["posY"] * this._size.y, this._size.x, this._size.y, posX, posY, this._size.x, this._size.y);

				if (this._vertical) posY += this._size.y + this._offset;else posX += this._size.x + this._offset;
			}, this);

			if (this._visibleSubMenu) this._subMenus[this._visibleSubMenu].draw();
		}
	}, {
		key: "_redraw",
		value: function _redraw() {
			this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

			each(this._tmpDrawArray, function (e) {
				this._drawIcon(e, e.x * this._size.x, e.y * this._size.y, 5, this._size.x, this._size.y, this._fontColor);
			}, this);

			Logger.log("prekresluje sa " + this.constructor.name, LOGGER_DRAW);
		}
	}, {
		key: "_drawIcon",
		value: function _drawIcon(type, x, y) {
			var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5;
			var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this._size.x;
			var height = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : this._size.y;
			var strokeColor = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : DEFAUL_STROKE_COLOR;
			var strokeWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : DEFAULT_STROKE_WIDTH;

			var img;
			switch (type.key) {
				case "arc":
					doArc({
						position: [x + offset, y + offset],
						size: [width - (offset << 1), height - (offset << 1)],
						borderColor: strokeColor,
						borderWidth: strokeWidth,
						ctx: this._context
					});
					break;
				case "rect":
					doRect({
						position: [x + offset, y + offset],
						size: [width - (offset << 1), height - (offset << 1)],
						borderWidth: strokeWidth,
						borderColor: strokeColor,
						ctx: this._context
					});
					break;
				case "line":
					doLine({
						points: [new GVector2f(x + offset, y + offset), new GVector2f(x + width - (offset << 1), y + (height >> 1)), new GVector2f(x + offset, y + height - (offset << 1)), new GVector2f(x + width - (offset << 1), y + offset)],
						borderWidth: strokeWidth,
						borderColor: strokeColor,
						ctx: this._context
					});
					break;
				case "text":
					fillText("TEXT", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "ctrl":
					fillText("CTRL", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "file":
					fillText("FILE", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "content":
					fillText("CONT", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "undo":
					fillText("UNDO", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "redo":
					fillText("REDO", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "watch":
					fillText("JOIN", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "copyUrl":
					fillText("LINK", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "shareOptions":
					fillText("OPT", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "rubber":
					fillText("RUBB", x + (width >> 1), y + (height >> 1), height / 5, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "area":
					fillText("AREA", x + (width >> 1), y + (height >> 1), height / 5, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "stopShare":
					fillText("STOP", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "startShare":
					fillText("START", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "sharing":
					fillText("CONN", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "loadLocalImage":
					fillText("locImg", x + (width >> 1), y + (height >> 1), height / 6, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "loadLocalHTML":
					fillText("locHTML", x + (width >> 1), y + (height >> 1), height / 6, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "loadExternalImage":
					fillText("extImg", x + (width >> 1), y + (height >> 1), height / 6, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "loadExternalHTML":
					fillText("extHTML", x + (width >> 1), y + (height >> 1), height / 6, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "saveImg":
					fillText("SAVE IMG", x + (width >> 1), y + (height >> 1), height >> 3, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "saveXML":
					fillText("SAVE XML", x + (width >> 1), y + (height >> 1), height >> 3, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "saveTask":
					fillText("SAVE TASK", x + (width >> 1), y + (height >> 1), height >> 3, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "loadXML":
					fillText("LOAD XML", x + (width >> 1), y + (height >> 1), height >> 3, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "options":
					fillText("OPT", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "table":
					var lines = 4;
					var line = (height - (offset << 1)) / lines;
					var points = [[x + (width >> 1), y + offset, x + (width >> 1), y - offset + height]];
					for (var i = 1, data = line; i < lines; i++, data += line) {
						points.push([x + offset, y + offset + data, x - offset + width, y + offset + data]);
					}doRect({
						position: [x + offset, y + offset],
						size: [width - (offset << 1), height - (offset << 1)],
						borderWidth: strokeWidth,
						borderColor: strokeColor,
						ctx: this._context
					});

					doLine({
						points: points,
						borderWidth: strokeWidth,
						borderColor: strokeColor,
						ctx: this._context
					});

					break;
				case "class":
					fillText("CLASS", x + (width >> 1), y + (height >> 1), height / 5, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "image":
					fillText("IMG", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "tools":
					fillText("TOOLS", x + (width >> 1), y + (height >> 1), height / 5, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "polygon":
					fillText("POLY", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;

				case "help":
					fillText("HELP", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
				case "defaultWidth":
					doLine({
						points: [x + offset, y + (height >> 1), x + width - offset, y + (height >> 1)],
						borderWidth: type.value,
						borderColor: strokeColor,
						ctx: this._context
					});
					break;
				case "brushes":
					img = Paints.selectedImg;
					if (img == null) return;
					this._context.drawImage(img, 0, 0, img.width, img.height, x, y, width, height);
					break;
				case "lineWidth":
					doLine({
						points: [x + offset, y + (height >> 1), x + width - offset, y + (height >> 1)],
						borderWidth: Creator.lineWidth,
						borderColor: this._fontColor,
						ctx: this._context
					});

					break;
				case "defaultBrushes":
					Paints.addBrush(type.value);
					img = Paints.getBrush(type.value);
					this._context.drawImage(img, 0, 0, img.width, img.height, x, y, width, height);
					break;
				case "draw":
					drawQuadraticCurve([new GVector2f(x + offset, y + offset), [new GVector2f(x + offset, y + height - (offset << 1)), new GVector2f(x + width - (offset << 1), y + (height >> 1))], [new GVector2f(x + offset, y + offset), new GVector2f(x + offset, y + height - (offset << 1))], [new GVector2f(x + width - (offset << 1), y + (height >> 1)), new GVector2f(x + width - (offset << 1), y + offset)], [new GVector2f(x + offset, y + height - (offset << 1)), new GVector2f(x + offset, y + offset)]], strokeWidth, strokeColor, this._context);
					break;
				case "join":
					fillText("JOIN", x + (width >> 1), y + (height >> 1), height >> 2, strokeColor, 0, FONT_ALIGN_CENTER, this._context);
					break;
			}
		}
	}, {
		key: "position",
		get: function get() {
			return this._position;
		}
	}, {
		key: "size",
		get: function get() {
			return this._size;
		}
	}, {
		key: "visible",
		get: function get() {
			return this._visible;
		},
		set: function set(val) {
			this._visible = val;
			if (Creator.view) {
				if (this._visible) Creator.view.position.x = this.position.x + (this.size.x + MENU_OFFSET) * this.visibleElements - MENU_OFFSET;else Creator.view.position.x = MENU_OFFSET;
				draw();
			}
		}
	}, {
		key: "visibleElements",
		get: function get() {
			return this._visibleElements;
		}
	}], [{
		key: "_changeDataByComponents",
		value: function _changeDataByComponents(data) {
			if (!Components.tools() && Components.draw()) Creator.operation = OPERATION_DRAW_PATH;

			data["tools"]["draw"]["visible"] = data["tools"]["draw"]["visible"] && Components.draw();

			data["mainMenu"]["undo"]["visible"] = data["mainMenu"]["undo"]["visible"] && Components.draw();
			data["mainMenu"]["redo"]["visible"] = data["mainMenu"]["redo"]["visible"] && Components.draw();

			data["mainMenu"]["tools"]["visible"] = data["mainMenu"]["tools"]["visible"] && Components.tools();
			data["mainMenu"]["content"]["visible"] = data["mainMenu"]["content"]["visible"] && Components.content();
			data["mainMenu"]["sharing"]["visible"] = data["mainMenu"]["sharing"]["visible"] && Components.share();
			data["tools"]["image"]["visible"] = data["tools"]["image"]["visible"] && Components.load();

			if (!Components.load() && !Components.save() && !Components.screen() && !Components.task()) data["mainMenu"]["file"]["visible"] = data["mainMenu"]["file"]["visible"] && false;else {
				data["file"]["loadXML"]["visible"] = data["file"]["loadXML"]["visible"] && Components.load();
				data["file"]["saveXML"]["visible"] = data["file"]["saveXML"]["visible"] && Components.save();
				data["file"]["saveImg"]["visible"] = data["file"]["saveImg"]["visible"] && Components.screen();
				data["file"]["saveTask"]["visible"] = data["file"]["saveTask"]["visible"] && Components.task();
			}

			return data;
		}
	}]);

	return MenuManager;
}();

var Slider = function () {
	function Slider(position, size, value, onMove) {
		_classCallCheck(this, Slider);

		this._position = position;
		this._size = size;
		this._buttonSize = Math.min(size.x, size.y) / 4 * 3;
		this._buttonColor = "#FA1D2F";
		this._sliderWidth = this._buttonSize >> 2;
		this._sliderColor = "#FFADB9";
		this._backgroundColor = "#EEE0E5";
		this._value = value;
		this._onMove = onMove;

		if (size.x < size.y) {
			this._sliderOffset = (size.x - this._buttonSize >> 1) + (this._buttonSize >> 1);
			this._sliderA = new GVector2f(position.x + (size.x >> 1), position.y + this._sliderOffset);
			this._sliderB = new GVector2f(position.x + (size.x >> 1), position.y + size.y - this._sliderOffset);
		}
	}

	_createClass(Slider, [{
		key: "clickIn",
		value: function clickIn(x, y) {
			if (x < this._position.x || x > this._position.x + this._size.x || y < this._position.y || y > this._position.y + this._size.y) return false;
		}
	}, {
		key: "draw",
		value: function draw() {
			fillRect(this._position.x, this._position.y, this._size.x, this._size.y, this._backgroundColor);

			drawLine([this._sliderA, this._sliderB], this._sliderWidth, this._sliderColor);

			var sliderPos = this._sliderA.getClone().sub(this._sliderB).div(100).mul(this._value).add(this._sliderB);
			fillArc(sliderPos.x - (this._buttonSize >> 1), sliderPos.y - (this._buttonSize >> 1), this._buttonSize, this._buttonSize, this._buttonColor);
		}
	}, {
		key: "value",
		set: function set(val) {
			this._value = val;
			draw();
			this.draw();
		}
	}]);

	return Slider;
}();

var ChatViewer = function () {
	function ChatViewer(title, myName, sendMessage) {
		_classCallCheck(this, ChatViewer);

		this._myName = myName;
		this._title = title;
		this._createHTML();
		this._isShifDown = false;
		this._textC = document.getElementById("textC");
		this._histC = document.getElementById("histC");
		this._chatW = document.getElementById("chatW");
		this._histW = document.getElementById("hist");
		this._sendMessage = sendMessage;
		this._init(document.getElementById("headC"));
		this.hide();
		this.toggleChat();
	}

	_createClass(ChatViewer, [{
		key: "_createHTML",
		value: function _createHTML() {
			var result = '<div id="chatW"><div id="headC"><span id="chatTitle">';
			result += this._title + '</span><div class="headerButton" id="hideChat">×</div>';
			result += '<div class="headerButton" id="toggleChat">-</div>';
			result += '<div class="headerButton" id="clearChat">C</div></div>';
			result += '<div id="histC"><div id="hist"></div></div>';
			result += '<div id="textC" contenteditable="true"></div></div>';

			var el = document.createElement("div");
			el.innerHTML = result;
			document.body.appendChild(el.firstChild);
		}
	}, {
		key: "hide",
		value: function hide() {
			this._chatW.style.display = "none";

			if (typeof Project !== "undefined" && Project.isMobile) {
				var canvases = document.getElementsByClassName("canvas");
				for (var i in canvases) {
					canvas.classList.remove("offset");
				}
			}
		}
	}, {
		key: "show",
		value: function show() {
			this._chatW.style.display = "block";

			if (typeof Project !== "undefined" && Project.isMobile) {
				var canvases = document.getElementsByClassName("canvas");
				for (var i in canvases) {
					canvas.classList.add("offset");
				}
			}
		}
	}, {
		key: "_init",
		value: function _init(headC) {
			var _this16 = this;

			document.getElementById("chatTitle").innerHTML = this._title;
			document.getElementById("toggleChat").onclick = function () {
				return _this16.toggleChat();
			};
			document.getElementById("clearChat").onclick = function () {
				return _this16._histW.innerHTML = "";
			};
			document.getElementById("hideChat").onclick = function () {
				return _this16.hide();
			};
			headC.onmousedown = function (ee) {
				if (ee.target != headC) return false;
				var backup = window.onmousemove;
				window.onmousemove = function (e) {
					return _this16._check(e, ee, _this16._chatW);
				};
				window.onmouseup = function (e) {
					return window.onmousemove = backup;
				};
			};

			this._textC.onkeydown = function (e) {
				if (e.keyCode === SHIFT_KEY) _this16._isShifDown = true;

				e.target.onkeyup = function (e) {
					if (e.keyCode === SHIFT_KEY) _this16._isShifDown = false;
					_this16._updateData();
				};

				if (e.keyCode == ENTER_KEY && !_this16._isShifDown) {
					_this16._prepareMessage();
					return false;
				}
			};
		}
	}, {
		key: "_updateData",
		value: function _updateData() {
			var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (size) this._histC.style.height = this._chatW.offsetHeight - this._textC.offsetHeight - 30 + "px";

			if (offset) this._histC.scrollTop = this._histC.scrollHeight - this._histC.clientHeight;
		}
	}, {
		key: "_check",
		value: function _check(e, f, g) {
			var h = function h(a, b, c, d) {
				return Math.max(Math.min(a - b, c - d), 0) + "px";
			};
			g.style.top = h(e.clientY, f.offsetY, window.innerHeight, g.offsetHeight);

			g.style.left = h(e.clientX, f.offsetX, window.innerWidth, g.offsetWidth);
		}
	}, {
		key: "toggleChat",
		value: function toggleChat() {
			var _this17 = this;

			var toggle = function toggle(height, display) {
				_this17._chatW.style.height = height + "px";
				_this17._histC.style.display = display;
				_this17._textC.style.display = display;
			};
			this._chatW.style.height == "28px" ? toggle(404, "block") : toggle(28, "none");
		}
	}, {
		key: "recieveMessage",
		value: function recieveMessage(msg, sender) {
			var string;
			if (this._myName != sender) {
				string = '<div class="messageC">';
				string += '<div class ="senderName">' + getFormattedDate() + ' - ';
				string += sender + ':</div>';
			} else {
				string = '<div class="messageC myMessage">';
			}

			string += '<div class="messageText">' + msg + '</div></div>';

			this._histW.innerHTML += string;

			this._updateData(false);
		}
	}, {
		key: "_prepareMessage",
		value: function _prepareMessage() {
			var context = this._textC.innerHTML;
			this._sendMessage(context);

			this._textC.innerHTML = "";
		}
	}]);

	return ChatViewer;
}();

var ContextMenuManager = function () {
	function ContextMenuManager(position) {
		var titles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
		var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "undefined";

		_classCallCheck(this, ContextMenuManager);

		this._position = position;
		this._subMenu = false;
		this._parent = parent;
		this._key = key;
		this._textColor = CONTEXT_MENU_FONT_COLOR;
		this._fillColor = CONTEXT_FILL_COLOR;
		this._selectedObject = parent ? parent._selectedObject : selectedObjects.movedObject;
		this._titles = titles;

		if (this._titles.length == 0) {
			if (selectedObjects.movedObject) {
				if (isIn(selectedObjects.movedObject.name, OBJECT_RECT, OBJECT_POLYGON, OBJECT_ARC, OBJECT_LINE, OBJECT_TABLE, OBJECT_IMAGE, OBJECT_TEXT)) this._addFields("delete", "locked", "makeCopy", "changeLayer", "changeOpacity");

				if (isIn(selectedObjects.movedObject.name, OBJECT_RECT, OBJECT_POLYGON, OBJECT_TEXT, OBJECT_ARC)) this._addFields("changeFillColor", "changeBorderColor");

				if (isIn(selectedObjects.movedObject.name, OBJECT_RECT, OBJECT_POLYGON, OBJECT_TEXT, OBJECT_LINE)) this._addFields("radius");

				if (selectedObjects.movedObject.name == OBJECT_LINE) this._addFields("joinType", "lineCap", "lineStyle", "lineType", "lineWidth", "arrowEndType", "arrowStartType");else if (selectedObjects.movedObject.name == OBJECT_TABLE) this._addFields("editTable");else if (selectedObjects.movedObject.name == OBJECT_TEXT) this._addFields("verticalTextAlign", "horizontalTextAlign", "taskResult");else if (selectedObjects.movedObject.name == OBJECT_IMAGE) this._addFields("changeImage");else if (selectedObjects.movedObject.name == "LayerViewer") {
					this._addFields("visible", "lockLayer", "showPaint", "animatePaint", "clearPaint");
					if (!selectedObjects.movedObject.locked) this._addFields("deleteLayer", "renameLayer", "clearLayer");
				}
			} else if (!parent) {
				this._addFields("clearWorkspace");
			}
		}
		context.font = 30 - CONTEXT_MENU_OFFSET + "pt " + DEFAULT_FONT;

		var hasExtension = false;

		if (this._titles.length) {
			each(titles, function (e, i, arr) {
				if (e["type"] == INPUT_TYPE_RADIO) {
					hasExtension = true;
					arr[i]["value"] = this._selectedObject["_" + this._key] == e["name"];
				}

				if (e["type"] == INPUT_TYPE_CHECKBOX) {
					hasExtension = true;
					if (e["key"] == "locked") arr[i]["value"] = selectedObjects.movedObject.locked;else if (e["key"] == "visible") arr[i]["value"] = selectedObjects.movedObject.visible;else if (e["key"] == "showPaint") arr[i]["value"] = selectedObjects.movedObject.showPaint;else if (e["key"] == "taskResult") arr[i]["value"] = selectedObjects.movedObject.taskResult;
				}
			}, this);
		}
		this._menuWidth = getMaxWidth(this._titles.map(function (e) {
			return e["label"];
		})) + (CONTEXT_MENU_OFFSET << 1);

		if (hasExtension) this._menuWidth += 30;

		this._size = new GVector2f(this._menuWidth, this._titles.length * CONTEXT_MENU_LINE_HEIGHT);
		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(ContextMenuManager, [{
		key: "_addFields",
		value: function _addFields() {
			var _this18 = this;

			var res;

			each(objectToArray(arguments), function (e) {
				res = ContextMenuManager.items[e];
				if (res && res["visible"]) {
					res["key"] = e;
					_this18._titles.push(res);
				}
			}, this);
		}
	}, {
		key: "clickInBoundingBox",
		value: function clickInBoundingBox(x, y) {
			return x + SELECTOR_SIZE > this._position.x && x - SELECTOR_SIZE < this._position.x + this._menuWidth && y + SELECTOR_SIZE > this._position.y && y - SELECTOR_SIZE < this._position.y + this._titles.length * CONTEXT_MENU_LINE_HEIGHT;
		}
	}, {
		key: "draw",
		value: function draw() {
			if (this._position.x + this._menuWidth > canvas.width) this._position.x = canvas.width - this._menuWidth;

			if (this._position.y + this._titles.length * CONTEXT_MENU_LINE_HEIGHT > canvas.height) this._position.y = canvas.height - this._titles.length * CONTEXT_MENU_LINE_HEIGHT;

			var count = 0,
			    pX = this._position.x,
			    pY = this._position.y,
			    menuWidth = this._menuWidth,
			    posY = pY,
			    checkSize = 20,
			    offset = CONTEXT_MENU_LINE_HEIGHT - checkSize >> 1;

			doRect({
				position: [pX, pY],
				width: this._menuWidth,
				height: Object.keys(this._titles).length * CONTEXT_MENU_LINE_HEIGHT,
				radius: MENU_RADIUS,
				borderColor: this._borderColor,
				borderWidth: this._borderWidth,
				fillColor: this._fillColor,
				shadow: true,
				draw: true
			});
			each(this._titles, function (e) {
				context.fillStyle = DEFAULT_FONT_COLOR;
				posY = pY + count * CONTEXT_MENU_LINE_HEIGHT;
				if (count++) doLine({ points: [pX, posY, pX + menuWidth, posY], draw: true });

				if (e["disabled"] || this._subMenu && e["key"] == this._subMenu._key) {
					var firstRadius = this._titles[0] === e ? MENU_RADIUS : 0;
					var lastRadius = getLastElement(this._titles) === e ? MENU_RADIUS : 0;

					doRect({
						position: [pX, posY],
						width: this._menuWidth,
						height: CONTEXT_MENU_LINE_HEIGHT,
						radius: { tr: firstRadius, tl: firstRadius, br: lastRadius, bl: lastRadius },
						borderColor: this.borderColor,
						borderWidth: this.borderWidth,
						fillColor: e["disabled"] ? CONTEXT_DISABLED_FILL_COLOR : CONTEXT_SELECTED_FILL_COLOR,
						draw: true
					});
				}

				fillText(e["label"], pX, posY, 30 - CONTEXT_MENU_OFFSET, this._textColor, [CONTEXT_MENU_OFFSET, 0]);

				if (e["type"] == INPUT_TYPE_CHECKBOX) doRect({
					x: pX + menuWidth - offset - checkSize,
					y: posY + offset,
					size: checkSize,
					radius: 5,
					borderColor: this.borderColor,
					borderWidth: this.borderWidth,
					fillColor: e["value"] ? CHECKBOX_COLOR_TRUE : CHECKBOX_COLOR_FALSE,
					draw: true
				});else if (e["type"] == INPUT_TYPE_RADIO) doArc({
					x: pX + menuWidth - offset - checkSize,
					y: posY + offset,
					size: checkSize,
					borderColor: DEFAULT_FONT_COLOR,
					fillColor: DEFAULT_FONT_COLOR,
					draw: !e["value"],
					fill: e["value"]
				});else if (e["type"] == "widthValue") doLine({
					points: [pX + menuWidth - (checkSize << 2), posY + (CONTEXT_MENU_LINE_HEIGHT >> 1), pX + menuWidth - offset, posY + (CONTEXT_MENU_LINE_HEIGHT >> 1)],
					borderWidth: e["name"]
				});
			}, this);

			if (this._subMenu) this._subMenu.draw();
		}
	}, {
		key: "_doClickAct",
		value: function _doClickAct(opt) {
			var _this19 = this;

			var act = opt.key;
			if (opt.disabled) return false;

			Logger.log("Klikol v contextMenu na položku " + act, LOGGER_CONTEXT_CLICK);
			switch (act) {
				case "changeLayer":

					break;
				case "changeFillColor":
					pickUpColor(function (color) {
						return Entity.changeAttr(_this19._selectedObject, ATTRIBUTE_FILL_COLOR, color);
					}, this);
					actContextMenu = false;
					break;
				case "changeBorderColor":
					pickUpColor(function (color) {
						return Entity.changeAttr(_this19._selectedObject, ATTRIBUTE_BORDER_COLOR, color);
					}, this);
					actContextMenu = false;
					break;
				case "delete":
					if (this._selectedObject) Scene.remove(this._selectedObject);
					actContextMenu = false;
					break;
				case "locked":
					this._selectedObject.locked = !this._selectedObject.locked;
					ContextMenuManager.items["locked"].value = this._selectedObject.locked;
					actContextMenu = false;
					break;
				case "clearWorkspace":
					Scene.cleanUp();
					actContextMenu = false;
					break;
				case "taskResult":
					this._selectedObject.taskResult = !this._selectedObject.taskResult;
					actContextMenu = false;
					break;
				case "removeRow":
					this._selectedObject.removeRow(this._parent.position.y);
					actContextMenu = false;
					break;
				case "removeColumn":
					this._selectedObject.removeColumn(this._parent.position.x);
					actContextMenu = false;
					break;
				case "addRowBelow":
					this._selectedObject.addRow(this._parent.position.y, "below");
					actContextMenu = false;
					break;
				case "addRowAbove":
					this._selectedObject.addRow(this._parent.position.y, "above");
					actContextMenu = false;
					break;
				case "addColumnToRight":
					this._selectedObject.addColumn(this._parent.position.x, "right");
					actContextMenu = false;
					break;
				case "addColumnToLeft":
					this._selectedObject.addColumn(this._parent.position.x, "left");
					actContextMenu = false;
					break;
				case "clearRow":
					this._selectedObject.clear(this._parent.position.y, "row");
					actContextMenu = false;
					break;
				case "clearColumn":
					this._selectedObject.clear(this._parent.position.x, "column");
					actContextMenu = false;
					break;
				case "clearTable":
					this._selectedObject.clear(null, "table");
					actContextMenu = false;
					break;
				case "showPaint":
					this._selectedObject.toggleVisibilityOfPaint(this._position.y);
					actContextMenu = false;
					break;
				case "clearPaint":
					this._selectedObject.clearPaint(this._position.y);
					actContextMenu = false;
					break;
				case "visible":
					this._selectedObject.toggleVisibilityOfLayer(this._position.y);
					actContextMenu = false;
					break;
				case "clearLayer":
					this._selectedObject.clearLayer(this.position.y);
					actContextMenu = false;
					break;
				case "animatePaint":
					this._selectedObject.animateLayer(this.position.y);
					actContextMenu = false;
					break;
				case "renameLayer":
					this._selectedObject.renameLayer(this.position.y);
					actContextMenu = false;
					break;
				case "makeCopy":
					var obj = Entity.create(this._selectedObject);
					obj.position.add(this._selectedObject.size);
					Scene.addToScene(obj);
					actContextMenu = false;
					break;
				default:
					if (opt.group == "roundRadius") {
						Entity.changeAttr(this._selectedObject, ATTRIBUTE_RADIUS, opt.name);
						actContextMenu = false;
					} else if (opt.group == "lineCapValue") {
						this._selectedObject.lineCap = opt.name;
						actContextMenu = false;
					} else if (opt.group == "joinTypeValue") {
						this._selectedObject.joinType = opt.name;
						actContextMenu = false;
					} else if (opt.group == "lineStyleValue") {
						this._selectedObject.lineStyle = opt.name;
						actContextMenu = false;
					} else if (opt.group == "widthValue") {
						Entity.changeAttr(this._selectedObject, ATTRIBUTE_BORDER_WIDTH, opt.name);

						actContextMenu = false;
					} else if (opt.group == "arrowEndType") {
						this._selectedObject.arrowEndType = opt.name;
						actContextMenu = false;
					} else if (opt.group == "arrowStartType") {
						this._selectedObject.arrowStartType = opt.name;
						actContextMenu = false;
					} else if (opt.group == "valignValue") {
						this._selectedObject.verticalTextAlign = opt.name;
						actContextMenu = false;
					} else if (opt.group == "halignValue") {
						this._selectedObject.horizontalTextAlign = opt.name;
						actContextMenu = false;
					} else if (opt.group === "layerValue") {
						Project.scene.changeLayer(this._selectedObject, opt.name);
						actContextMenu = false;
						draw();
					}

			}
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			var _this20 = this;

			if (!this.clickInBoundingBox(x, y)) return this._subMenu ? this._subMenu.clickIn(x, y) : false;

			var i = parseInt((y - this._position.y) / CONTEXT_MENU_LINE_HEIGHT);

			if (isDefined(this._titles[i]) && this._titles[i].hasOwnProperty("fields")) {
				var pos = this._position.getClone().add(this._menuWidth, i * CONTEXT_MENU_LINE_HEIGHT);
				if (pos.x + this._menuWidth > canvas.width) pos.x -= this._menuWidth << 1;
				if (this._titles[i]["key"] === "changeLayer") {
					this._titles[i]["fields"] = [];
					each(Scene.layers, function (e) {
						_this20._titles[i]["fields"].push({
							group: "layerValue",
							name: e.title,
							label: e.title
						});
					});
				}
				this._subMenu = new ContextMenuManager(pos, objectToArray(this._titles[i]["fields"]), this, this._titles[i]["key"]);
			} else this._subMenu = false;

			this._doClickAct(this._titles[i]);

			return true;
		}
	}, {
		key: "position",
		get: function get() {
			return this._position;
		}
	}], [{
		key: "disabled",
		value: function disabled(val) {
			for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				args[_key4 - 1] = arguments[_key4];
			}

			var res = ContextMenuManager.items[args[0]];

			if (args[1]) res["fields"][args[1]].disabled = val;else res.disabled = val;
		}
	}, {
		key: "visibility",
		value: function visibility(val) {
			for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
				args[_key5 - 1] = arguments[_key5];
			}

			var res = ContextMenuManager.items[args[0]];

			if (args[1]) res["fields"][args[1]].visible = val;else res.visible = val;
		}
	}]);

	return ContextMenuManager;
}();

var FileManager = function () {
	function FileManager() {
		_classCallCheck(this, FileManager);

		this._input = document.createElement("input");
		this._input.setAttribute("type", "file");
		this._input.setAttribute("value", "files");
		this._input.setAttribute("class", "hide");

		this._link = document.createElement("a");
		this._link.setAttribute("class", "hide");
		this._link.setAttribute("href", "");
		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(FileManager, [{
		key: "saveFile",
		value: function saveFile(name, text) {
			var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "text/plain";

			this._link.href = URL.createObjectURL(new Blob([text], { type: type }));
			this._link.download = name;
			this._link.click();
		}
	}, {
		key: "saveImage",
		value: function saveImage(name, image) {
			this._link.href = typeof image === "string" ? image : image.src;
			this._link.download = name;
			this._link.click();
		}
	}, {
		key: "loadImage",
		value: function loadImage(func) {
			this._input.onchange = function (e) {
				var reader = new FileReader();
				reader.onload = function () {
					var image = new Image();
					image.src = reader.result;
					func(image);
				};
				reader.readAsDataURL(e.target.files[0]);
			};
			this._input.click();
		}
	}, {
		key: "loadFile",
		value: function loadFile(func) {
			this._input.onchange = function (e) {
				var reader = new FileReader();
				reader.onload = function () {
					return func(reader.result);
				};
				reader.readAsText(e.target.files[0]);
			};
			this._input.click();
		}
	}]);

	return FileManager;
}();

function saveFile(name, text, type) {
	if (typeof type === "undefined") type = "text/plain";
	var file = new Blob([text], { type: type }),
	    a = document.getElementById("fileLink");

	a.href = URL.createObjectURL(file);
	a.download = name;
	a.click();
}

function saveImage(name, image) {
	var a = document.getElementById("fileLink");
	a.href = image;
	a.download = name;
	a.click();
}

function loadImage(func) {
	var el = document.getElementById("fileInput");
	el.onchange = function (e) {
		var reader = new FileReader();
		reader.onload = function () {
			var image = new Image();
			image.src = reader.result;
			func(image);
		};
		reader.readAsDataURL(e.target["files"][0]);
	};
	el.click();
}

function loadFile(func) {
	var el = document.createElement("input");
	el.setAttribute("id", "fileInput");
	el.setAttribute("type", "file");
	el.setAttribute("value", "files");
	el.setAttribute("class", "hide");

	el.onchange = function (e) {
		var reader = new FileReader();
		reader.onload = function () {
			return func(reader.result);
		};
		reader.readAsText(e.target["files"][0]);
	};
	el.click();
}

function saveSceneAsFile() {
	var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { projectTitle: "scene_backup" };

	console.log(data);
	var data = {
		scene: Scene.toObject(),
		creator: Creator.toObject(),
		paints: Paints.toObject(),
		type: 2500
	};

	saveFile(data.projectTitle, JSON.stringify(data));
}

function saveSceneAsTask() {
	var fileName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default_task";

	var result = {};

	if (Scene.getTaskObject(result)) {
		var data = {
			scene: result["content"],
			results: result["results"],
			title: fileName,
			type: 2501
		};
		saveFile(fileName, JSON.stringify(data));
	} else Alert.warning(result.error);
}

function loadTask(scene, results, title) {
	if (Task) return Logger.error("načítava sa task ked už jeden existuje");

	var layer = Scene.createLayer(title, "task");
	each(scene, function (e) {
		e.layer = layer.title;
		Creator.create(e);
	});
	Task = new TaskManager(results, title, layer);
	Logger.notif("Task " + title + " bol úspešne vytvorený");
}

function loadSceneFromFile() {
	loadFile(function (content) {
		var data = JSON.parse(content);
		if (data["type"] && data["type"] === 2501) loadTask(data["scene"], data["results"], data["title"]);else {
			Scene.fromObject(data.scene);
			Creator.fromObject(data.creator);
			Paints.fromObject(data.paints);
		}
		draw();
	});
}

var OptionsManager = function () {
	function OptionsManager() {
		_classCallCheck(this, OptionsManager);

		this._options = {
			snapping: {
				id: "idAllowedSnapping",
				attr: "value",
				val: 0 },
			grid: {
				id: "idShowGrid",
				attr: "checked",
				val: OPTION_SHOW_GRID
			},
			showLayersViewer: {
				id: "idShowLayersViewer",
				attr: "checked",
				val: OPTION_SHOW_LAYERS_VIEWER
			},
			shadows: {
				id: "idShadows",
				attr: "checked",
				val: OPTION_SHOW_SHADOWS
			},
			movingSilhouette: {
				id: "idMovingSilhouette",
				attr: "checked",
				val: OPTION_MOVING_SILHOUETTE
			},
			changeCursor: {
				id: "idChangeCursor",
				attr: "checked",
				val: OPTION_CHANGE_CURSOR
			},
			canvasBlur: {
				id: "idCanvasBlur",
				attr: "checked",
				val: OPTION_CANVAS_BLUR
			}
		};
		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(OptionsManager, [{
		key: "_processAndSetValueIfExistById",
		value: function _processAndSetValueIfExistById(id, val, attr, value) {
			var _this21 = this;

			var e = document.getElementById(id);
			if (e) {
				e[attr] = value;
				e.onchange = function (ee) {
					return _this21.setOpt(val, ee.target[attr], false);
				};
			}
		}
	}, {
		key: "init",
		value: function init() {
			var _this22 = this;

			each(this._options, function (e, i) {
				return _this22._processAndSetValueIfExistById(e["id"], i, e["attr"], e["val"]);
			});
		}
	}, {
		key: "setOpt",
		value: function setOpt(key, val) {
			var setElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			var obj = this._options[key];
			if (setElement) {
				var e = document.getElementById(obj["id"]);
				if (e) e[obj["attr"]] = val;
			}

			if (key === "showLayersViewer") Entity.setAttr(Layers, "visible", val);

			Logger.log("nastavila sa možnosť " + key + " na hodnotu " + val, LOGGER_CHANGE_OPTION);
			obj["val"] = val;
			draw();
		}
	}, {
		key: "grid",
		get: function get() {
			return this._options["grid"]["val"];
		}
	}, {
		key: "shadows",
		get: function get() {
			return this._options["shadows"]["val"];
		}
	}, {
		key: "snapping",
		get: function get() {
			return this._options["snapping"]["val"];
		}
	}, {
		key: "canvasBlur",
		get: function get() {
			return this._options["canvasBlur"]["val"];
		}
	}, {
		key: "changeCursor",
		get: function get() {
			return this._options["changeCursor"]["val"];
		}
	}, {
		key: "showLayersViewer",
		get: function get() {
			return this._options["showLayersViewer"]["val"];
		}
	}, {
		key: "movingSilhouette",
		get: function get() {
			return this._options["movingSilhouette"]["val"];
		}
	}]);

	return OptionsManager;
}();

var InputManager = function () {
	function InputManager() {
		_classCallCheck(this, InputManager);

		this._keys = [];
		this._timer = false;
		this._buttons = [];
		this._pressPosition = new GVector2f();
		this._mousePos = new GVector2f();
		this._lastTouch = false;
		this._hist = {};
		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(InputManager, [{
		key: "_onResize",
		value: function _onResize() {
			Project.canvasManager.onResize();


			Scene.onScreenResize();

			if (isDefined(timeLine)) timeLine.onScreenResize();

			if (isDefined(Layers)) Layers.onScreenResize();

			draw();
		}
	}, {
		key: "_initWindowListeners",
		value: function _initWindowListeners() {
			var _this23 = this;

			window.onresize = this._onResize;

			window.orientationchange = this._onResize;

			window.onbeforeunload = function (event) {
				event.returnValue = "Nazoaj chceš odísť s tejto stránky???!!!";
			};
			window.onhashchange = Listeners.hashChange;

			window.onkeydown = function (e) {
				_this23._keyDown(e.keyCode);

				if (!e.target.onkeyup) e.target.onkeyup = function (e) {
					_this23._keyUp(e.keyCode);
					e.target.onkeyup = false;
				};
			};
		}
	}, {
		key: "initListeners",
		value: function initListeners(target) {
			var _this24 = this;

			this._initWindowListeners();

			target.onclick = function () {
				draw();
			};

			target.onmousepress = function (e) {
				return Listeners.mousePress(e.position.getClone(), e.button);
			};

			target.ondblclick = function (e) {
				Listeners.mouseDoubleClick(new GVector2f(e.offsetX, e.offsetY), e.button);
			};

			target.onmousedown = function (e) {
				_this24._buttonDown(e);
				Listeners.mouseDown(new GVector2f(e.offsetX, e.offsetY), e.button);

				e.target.onmouseup = function (ee) {

					if (!_this24.isButtonDown(ee.button)) return false;
					_this24._buttonUp(ee);

					if (!Options.changeCursor) ee.target.onmousemove = false;
					ee.target.onmouseup = false;

					Listeners.mouseUp(new GVector2f(ee.offsetX, ee.offsetY), ee.button);
				};
				e.target.onmousemove = function (ee) {
					_this24._mouseMove(ee);
					Listeners.mouseMove(new GVector2f(ee.offsetX, ee.offsetY), ee["movementX"], ee["movementY"]);
				};
			};

			$(target).bind('contextmenu', function () {
				return false;
			});

			target.addEventListener("touchstart", function (e) {
				e.preventDefault();
				_this24._lastTouch = getMousePos(target, e);
				Input._buttonDown({ button: LEFT_BUTTON, offsetX: _this24._lastTouch.x, offsetY: _this24._lastTouch.y });

				Listeners.mouseDown(new GVector2f(_this24._lastTouch.x, _this24._lastTouch.y), LEFT_BUTTON);

				e.target.addEventListener("touchmove", function (ee) {
					ee.preventDefault();
					Input._mouseMove({ offsetX: _this24._lastTouch.x, offsetY: _this24._lastTouch.y });
					var mov = getMousePos(target, ee);
					mov.x -= _this24._lastTouch.x;
					mov.y -= _this24._lastTouch.y;
					_this24._lastTouch = getMousePos(target, ee);
					Listeners.mouseMove(new GVector2f(_this24._lastTouch.x, _this24._lastTouch.y), mov.x, mov.y);
					draw();
				}, false);

				e.target.addEventListener("touchend", function (ee) {
					ee.preventDefault();
					if (!Input.isButtonDown(LEFT_BUTTON)) return false;
					Input._buttonUp({ button: LEFT_BUTTON, offsetX: _this24._lastTouch.x, offsetY: _this24._lastTouch.y });
					Listeners.mouseUp(new GVector2f(_this24._lastTouch.x, _this24._lastTouch.y), LEFT_BUTTON);
					draw();
				}, false);

				e.target.addEventListener("touchcancel", function (ee) {
					ee.preventDefault();
					if (!Input.isButtonDown(LEFT_BUTTON)) return false;
					Input._buttonUp({ button: LEFT_BUTTON, offsetX: _this24._lastTouch.x, offsetY: _this24._lastTouch.y });
					Listeners.mouseUp(new GVector2f(_this24._lastTouch.x, _this24._lastTouch.y), LEFT_BUTTON);
					draw();
				}, false);
			}, false);
		}
	}, {
		key: "_keyDown",
		value: function _keyDown(val) {
			this._keys[val] = true;
			Events.keyDown(val);
			Listeners.keyDown(val, this.isKeyDown(L_CTRL_KEY));
		}
	}, {
		key: "_keyUp",
		value: function _keyUp(val) {
			this._keys[val] = false;
			Events.keyUp(val);
			Listeners.keyUp(val, this.isKeyDown(L_CTRL_KEY));

			if (!this._hist[val]) this._hist[val] = 0;

			this._hist[val]++;
		}
	}, {
		key: "isKeyDown",
		value: function isKeyDown(val) {
			return this._keys[val];
		}
	}, {
		key: "_checkPress",
		value: function _checkPress(button) {
			if (SelectedText) return;
			var inst = this;
			this._buttons[button] = false;
			canvas.onmousepress({
				position: inst._pressPosition,
				button: button
			});
			Logger.log("podržané tlačítko myši ::" + button + "::" + inst._pressPosition.x + "::" + inst._pressPosition.y, LOGGER_MOUSE_EVENT);

			if (this._timer) {}
			this._clearTimer();
		}
	}, {
		key: "_clearTimer",
		value: function _clearTimer() {
			clearTimeout(this._timer);
			this._timer = false;
		}
	}, {
		key: "_mouseMove",
		value: function _mouseMove(val) {
			this._mousePos.set(val.offsetX, val.offsetY);
			Events.mouseMove(val.offsetX, val.offsetY);

			if (this._timer) if (this._pressPosition.dist(val.offsetX, val.offsetY) > TOUCH_VARIATION) this._clearTimer();
		}
	}, {
		key: "_buttonDown",
		value: function _buttonDown(val) {
			this._buttons[val.button] = true;
			Events.mouseDown(val.button, val.offsetX, val.offsetY);

			var t = this;
			if (this._timer) this._clearTimer();
			this._timer = setTimeout(function () {
				t._checkPress(val.button);
			}, TOUCH_DURATION);
			this._pressPosition.set(val.offsetX, val.offsetY);
		}
	}, {
		key: "_buttonUp",
		value: function _buttonUp(val) {
			if (this._timer) this._clearTimer();
			this._buttons[val.button] = false;
			Events.mouseUp(val.button, val.offsetX, val.offsetY);
		}
	}, {
		key: "isButtonDown",
		value: function isButtonDown(val) {
			return this._buttons[val];
		}
	}, {
		key: "mousePos",
		get: function get() {
			return this._mousePos;
		}
	}]);

	return InputManager;
}();

var MAIN_CANVAS = "mainCanvas";
var POINTER_CANVAS = "pointerCanvas";
var CANVAS_PREFIX = "canvas";

var CanvasManager = function () {
	function CanvasManager(sizeX, sizeY) {
		_classCallCheck(this, CanvasManager);

		this._sizeX = sizeX;
		this._sizeY = sizeY;
		this._canvases = {};
		this._canvases[MAIN_CANVAS] = new CanvasHandler("myCanvas", sizeX, sizeY);
		this._canvasCounter = 1;
	}

	_createClass(CanvasManager, [{
		key: "initPointerCanvas",
		value: function initPointerCanvas() {
			this._pointerCanvas = new CanvasHandler(this._sizeX, this._sizeY);
			this._canvasCounter++;
		}
	}, {
		key: "onResize",
		value: function onResize() {
			this._canvases[MAIN_CANVAS].setCanvasSize();
			if (this._canvases[POINTER_CANVAS]) {
				this._canvases[POINTER_CANVAS].setCanvasSize();
			}
		}
	}, {
		key: "createCanvas",
		value: function createCanvas(sizeX, sizeY, title) {
			title = title || CANVAS_PREFIX + this._canvasCounter;
			this._canvases[title] = new CanvasHandler(sizeX, sizeY);
			this._canvasCounter++;
			return this._canvases[title];
		}
	}, {
		key: "getCanvas",
		value: function getCanvas(title) {
			return this._canvases[title];
		}
	}, {
		key: "removeCanvas",
		value: function removeCanvas(title) {
			if (this._canvases[title]) delete this._canvases[title];
		}
	}, {
		key: "canvas",
		get: function get() {
			return this._canvases[MAIN_CANVAS];
		}
	}, {
		key: "pCanvas",
		get: function get() {
			return this._canvases[POINTER_CANVAS];
		}
	}]);

	return CanvasManager;
}();

function drawGrid() {
	var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GRID_WIDTH;
	var dist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : GRID_DIST;
	var nthBold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GRID_NTH_BOLD;
	var c = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : GRID_COLOR;

	var pointsNormal = [],
	    pointsBold = [],
	    boldCounter = 0,
	    i;

	for (i = 0; i < canvas.width; i += dist) {
		if (boldCounter++ % nthBold) pointsNormal.push([i, 0, i, canvas.height]);else pointsBold.push([i, 0, i, canvas.height]);
	}
	boldCounter = 0;

	for (i = 0; i < canvas.height; i += dist) {
		if (boldCounter++ % nthBold) pointsNormal.push([0, i, canvas.width, i]);else pointsBold.push([0, i, canvas.width, i]);
	}

	doLine({
		points: pointsNormal,
		borderWidth: width,
		borderColor: c
	});

	doLine({
		points: pointsBold,
		borderWidth: width * 3,
		borderColor: c
	});
}

function doPolygon(obj) {
	if (isUndefined(obj.points)) Logger.error(getMessage(MSG_TRY_DRAW_EMPTY_POLYGON));

	var res = $.extend(_initDef(obj), obj),
	    offX = obj.offset ? obj.offset.x : 0,
	    offY = obj.offset ? obj.offset.y : 0;

	res.ctx.beginPath();

	var drawLines = function drawLines(points) {
		var size = points.length;

		if (res.radius == 0 || isNaN(res.radius)) each(points, function (e, i) {
			return i ? res.ctx.lineTo(e.x + offX, e.y + offY) : res.ctx.moveTo(e.x + offX, e.y + offY);
		});else each(points, function (e, i) {
			var v1,
			    l1,
			    v2 = e.getClone().sub(points[size - 1]),
			    l2 = v2.getLength();
			v2.div(l2);

			if (i == 0) {
				v1 = points[i + 1].getClone().sub(e);
				l1 = v1.getLength();

				v1.div(l1);
				if (isNumber(res.radius)) {
					l1 >>= 1;
					l2 >>= 1;
				} else {
					res.radius.replace("px", "");
					l1 = l2 = 1;
					res.radius = parseInt(res.radius);
				}
				res.ctx.moveTo(points[size - 1].x + v2.x * l2 * res.radius + offX, points[size - 1].y + v2.y * l2 * res.radius + offY);
				res.ctx.quadraticCurveTo(e.x + offX, e.y + offY, e.x + v1.x * l1 * res.radius + offX, e.y + v1.y * l1 * res.radius + offY);
			} else {
				v1 = points[(i + 1) % size].getClone().sub(e);
				l1 = v1.getLength();
				v1.div(l1);
				if (isNumber(res.radius)) {
					l1 >>= 1;
					l2 >>= 1;
				} else {
					res.radius.replace("px", "");
					l1 = l2 = 1;
				}
				res.ctx.lineTo(e.x - v2.x * l2 * res.radius + offX, e.y - v2.y * l2 * res.radius + offY);
				res.ctx.quadraticCurveTo(e.x + offX, e.y + offY, e.x + v1.x * l1 * res.radius + offX, e.y + v1.y * l1 * res.radius + offY);
			}
		});
		res.ctx.closePath();
	};

	if (isArray(res.points[0])) each(res.points, drawLines);else drawLines(res.points);

	_process(res);
}

function doArc(obj) {
	var res = _remakePosAndSize(_checkPosAndSize(obj, "Arc"), obj);

	res.ctx.beginPath();
	res.ctx.ellipse(res.x + (res.width >> 1), res.y + (res.height >> 1), res.width >> 1, res.height >> 1, 0, 0, PI2);

	_process(res);
}

function doRect(obj) {
	var def = _checkPosAndSize(obj, OBJECT_RECT);

	if (isDefined(obj[ATTRIBUTE_RADIUS])) {
		if (isNumber(obj[ATTRIBUTE_RADIUS])) obj[ATTRIBUTE_RADIUS] = {
			tl: obj[ATTRIBUTE_RADIUS],
			tr: obj[ATTRIBUTE_RADIUS],
			br: obj[ATTRIBUTE_RADIUS],
			bl: obj[ATTRIBUTE_RADIUS] };else each(def[ATTRIBUTE_RADIUS], function (e, i) {
			return obj[ATTRIBUTE_RADIUS][i] = obj[ATTRIBUTE_RADIUS][i] || def[ATTRIBUTE_RADIUS][i];
		});
	}

	var res = _remakePosAndSize(def, obj);

	res.ctx.beginPath();
	res.ctx.moveTo(res.x + res[ATTRIBUTE_RADIUS].tl, res.y);
	res.ctx.lineTo(res.x + res.width - res[ATTRIBUTE_RADIUS].tr, res.y);
	res.ctx.quadraticCurveTo(res.x + res.width, res.y, res.x + res.width, res.y + res[ATTRIBUTE_RADIUS].tr);
	res.ctx.lineTo(res.x + res.width, res.y + res.height - res[ATTRIBUTE_RADIUS].br);
	res.ctx.quadraticCurveTo(res.x + res.width, res.y + res.height, res.x + res.width - res[ATTRIBUTE_RADIUS].br, res.y + res.height);
	res.ctx.lineTo(res.x + res[ATTRIBUTE_RADIUS].bl, res.y + res.height);
	res.ctx.quadraticCurveTo(res.x, res.y + res.height, res.x, res.y + res.height - res[ATTRIBUTE_RADIUS].bl);
	res.ctx.lineTo(res.x, res.y + res[ATTRIBUTE_RADIUS].tl);
	res.ctx.quadraticCurveTo(res.x, res.y, res.x + res[ATTRIBUTE_RADIUS].tl, res.y);
	res.ctx.closePath();

	_process(res);
}

function doLine(obj) {
	if (isUndefined(obj.points)) Logger.error(getMessage(MSG_TRY_DRAW_EMPTY_LINE));

	if (!isArray(obj.points[0]) && obj.points.length < 2) Logger.error(getMessage(MSG_TRY_DRAW_ONE_POINT_LINE));

	var res = $.extend(_initDef(obj), obj),
	    offX = obj.offset ? obj.offset.x : 0,
	    offY = obj.offset ? obj.offset.y : 0,
	    v1,
	    v2,
	    l1,
	    l2;
	res.ctx.beginPath();

	var drawLines = function drawLines(points) {
		if (isNaN(points[0])) {
			if (res.radius == 0 || isNaN(res.radius)) each(points, function (e, i) {
				return i ? res.ctx.lineTo(e.x + offX, e.y + offY) : res.ctx.moveTo(e.x + offX, e.y + offY);
			});else each(points, function (e, i) {
				if (i == 0) res.ctx.moveTo(e.x, e.y);else if (i + 1 < points.length) {
					v1 = points[i + 1].getClone().sub(e);
					v2 = e.getClone().sub(points[i - 1]);
					l1 = v1.getLength();
					l2 = v2.getLength();
					v2.div(l2);
					v1.div(l1);
					if (isNumber(res.radius)) {
						l1 >>= 1;
						l2 >>= 1;
					} else {
						res.radius.replace("px", "");
						l1 = l2 = 1;
					}
					res.ctx.lineTo(e.x - v2.x * l2 * res.radius + offX, e.y - v2.y * l2 * res.radius + offY);
					res.ctx.quadraticCurveTo(e.x + offX, e.y + offY, e.x + v1.x * l1 * res.radius + offX, e.y + v1.y * l1 * res.radius + offY);
				} else res.ctx.lineTo(e.x + offX, e.y + offY);
			});
		} else {
			res.ctx.moveTo(points[0] + offX, points[1] + offY);
			res.ctx.lineTo(points[2] + offX, points[3] + offY);
		}
	};

	if (isArray(res.points[0])) each(res.points, drawLines);else drawLines(res.points);

	res["fill"] = false;
	_process(res);
}

function drawQuadraticCurve(points) {
	var borderWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_STROKE_WIDTH;
	var borderColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAUL_STROKE_COLOR;
	var ctx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : context;

	if (points.length < 2) return;

	ctx.lineWidth = borderWidth;
	ctx.strokeStyle = borderColor;
	ctx.beginPath();

	each(points, function (e, i) {
		return i == 0 ? ctx.moveTo(e.x, e.y) : ctx.quadraticCurveTo(e[0].x, e[0].y, e[1].x, e[1].y);
	});
	ctx.stroke();
}

function fillText(text, x, y) {
	var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_FONT_SIZE;
	var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : DEFAULT_FONT_COLOR;
	var offset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	var align = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : FONT_ALIGN_NORMAL;
	var ctx = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : context;

	ctx.font = size + "pt " + DEFAULT_FONT;
	ctx.fillStyle = color;

	if (align == FONT_ALIGN_NORMAL) {
		ctx.textAlign = FONT_HALIGN_LEFT;
		ctx.textBaseline = FONT_VALIGN_TOP;
		if (isArray(offset)) ctx.fillText(text, x + offset[0], y + offset[1]);else ctx.fillText(text, x + offset, y + offset);
	} else if (align == FONT_ALIGN_CENTER) {
		ctx.textAlign = FONT_HALIGN_CENTER;
		ctx.textBaseline = FONT_VALIGN_MIDDLE;
		ctx.fillText(text, x, y);
	}
}

function getMaxWidth(val) {
	var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	if (isArray(val)) {
		each(val, function (e) {
			if (isArray(e)) {
				each(e, function (a) {
					return max = Math.max(calcTextWidth(a), max);
				});
			} else {
				max = Math.max(calcTextWidth(e), max);
			}
		});
	} else {
		return calcTextWidth(val);
	}
	return max;
}

function setShadow(variable) {
	if (variable) {
		CanvasHandler.setShadow(context, DEFAULT_SHADOW_OFFSET, DEFAULT_SHADOW_OFFSET, "black", DEFAULT_SHADOW_BLUR);
	} else {
		CanvasHandler.setShadow(context, 0, 0, "black", 0);
	}
}

function setLineDash(variable) {
	if (variable) {
		CanvasHandler.setLineDash(context, 15, 5);
	} else {
		CanvasHandler.setLineDash(context, 1);
	}
}

function canvasToImage(canvas) {
	return CanvasHandler.canvasToImage(canvas);
}

function imageToCanvas(image) {
	return CanvasHandler.imageToCanvas(image);
}

function calcTextWidth(value) {
	var font = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	return CanvasHandler.calcTextWidth(context, value, font);
}

function _initDef(obj) {
	var def = {
		borderWidth: DEFAULT_STROKE_WIDTH,
		borderColor: DEFAUL_STROKE_COLOR,
		ctx: context,
		fillColor: DEFAULT_BACKGROUND_COLOR,
		radius: { tl: 0, tr: 0, br: 0, bl: 0 },
		shadow: false,
		lineCap: LINE_CAP_BUTT,
		center: false,
		offset: null,
		joinType: LINE_JOIN_MITER,
		lineStyle: LINE_STYLE_NORMAL,
		lineType: JOIN_LINEAR,
		lineDash: [],
		bgImage: false
	};
	def["draw"] = isDefined(obj.borderColor) || isDefined(obj.borderWidth);
	def["fill"] = isDefined(obj.fillColor);

	return def;
}

function _checkPosAndSize(obj, name) {

	if ((isUndefined(obj["x"]) || isUndefined(obj["y"])) && isUndefined(obj["position"])) Logger.error(getMessage(MSG_TRY_DRAW_WITHOUT_POSITION, name));

	if ((isUndefined(obj["width"]) || isUndefined(obj["height"])) && isUndefined(obj["size"])) Logger.error(getMessage(MSG_TRY_DRAW_WITHOUT_SIZE, name));

	if (obj["width"] <= 0 || obj["height"] <= 0) Logger.error(getMessage(MSG_TRY_DRAW_WITH_NEG_POSITION, name));

	return _initDef(obj);
}

function _remakePosAndSize(def, obj) {
	var res = $.extend(def, obj);

	if (isDefined(res["size"])) {
		if (isNumber(res["size"])) {
			res["width"] = res["size"];
			res["height"] = res["size"];
		} else if (isArray(res["size"])) {
			res["width"] = res["size"][0];
			res["height"] = res["size"][1];
		} else {
			res["width"] = res["size"].x;
			res["height"] = res["size"].y;
		}
	}

	if (isDefined(res["position"])) {
		if (isNumber(res["position"])) {
			res["x"] = res["position"];
			res["y"] = res["position"];
		} else if (isArray(res["position"])) {
			res["x"] = res["position"][0];
			res["y"] = res["position"][1];
		} else {
			res["x"] = res["position"].x;
			res["y"] = res["position"].y;
		}
	}

	if (res["center"]) {
		res["x"] -= res["width"] >> 1;
		res["y"] -= res["height"] >> 1;
	}
	return res;
}

function saveCanvasAsFile() {
	saveImage("canvas_screen_shot", canvas.toDataURL());
}

function _process(res) {
	if (res.shadow && Options.shadows) setShadow(res.shadow);

	if (res.bgImage) {
		res.ctx.save();
		res.ctx.clip();
		if (res.bgImage instanceof HTMLImageElement) res.ctx.drawImage(res.bgImage, res.x, res.y, res.width, res.height);else res.ctx.drawImage(res.bgImage.img, res.bgImage.x, res.bgImage.y, res.bgImage.w, res.bgImage.h, res.x, res.y, res.width, res.height);

		res.ctx.restore();
	} else if (res.fill) {
		res.ctx.fillStyle = res.fillColor;
		res.ctx.fill();
	}

	if (res.shadow) setShadow(false);

	res.ctx.lineCap = res.lineCap;
	res.ctx.lineJoin = res.joinType;
	if (typeof res.ctx.setLineDash === "function") {
		res.ctx.setLineDash(res.lineDash);
	}

	if (res.draw) {
		res.ctx.lineWidth = res.borderWidth;
		res.ctx.strokeStyle = res.borderColor;
		res.ctx.stroke();
	}
}

var CanvasHandler = function () {
	function CanvasHandler(arg1, arg2, arg3) {
		_classCallCheck(this, CanvasHandler);

		if (typeof arg1 === "string") {
			this._canvas = document.getElementById(arg1);
			if (arg2 && arg3) CanvasHandler.setCanvasSize(this._canvas, arg2, arg3);
		} else if (arg1 instanceof HTMLImageElement) {
			this._canvas = CanvasHandler.imageToCanvas(arg1);
			CanvasHandler.setCanvasSize(this._canvas, arg1.width, arg1.height);
		} else {
			this._canvas = document.createElement("canvas");

			if (arg1 && arg2) {
				this.setCanvasSize(arg1, arg2);
			}
		}
		this._context = this._canvas.getContext("2d");
	}

	_createClass(CanvasHandler, [{
		key: "getImage",
		value: function getImage() {
			return CanvasHandler.canvasToImage(this._canvas);
		}
	}, {
		key: "setShadow",
		value: function setShadow(x, y, color, blur) {
			CanvasHandler.setShadow(this._context, x, y, color, blur);
		}
	}, {
		key: "show",
		value: function show() {
			var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "image/png";

			window.open(this._canvas.toDataURL(format), '_blank');
		}
	}, {
		key: "clearCanvas",
		value: function clearCanvas() {
			CanvasHandler.clearCanvas(this._context);
		}
	}, {
		key: "setLineDash",
		value: function setLineDash() {
			for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
				args[_key6] = arguments[_key6];
			}

			CanvasHandler.setLineDash(this._context, args);
		}
	}, {
		key: "setCanvasSize",
		value: function setCanvasSize() {
			var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.innerWidth;
			var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.innerHeight;

			CanvasHandler.setCanvasSize(this._canvas, width, height);
		}
	}, {
		key: "appendTo",
		value: function appendTo(element) {
			element.appendChild(this._canvas);
		}
	}, {
		key: "canvas",
		get: function get() {
			return this._canvas;
		}
	}, {
		key: "context",
		get: function get() {
			return this._context;
		}
	}], [{
		key: "clearCanvas",
		value: function clearCanvas(ctx) {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	}, {
		key: "setCanvasSize",
		value: function setCanvasSize(c, width, height) {
			c.width = width;
			c.height = height;
		}
	}, {
		key: "setShadow",
		value: function setShadow(ctx, x, y, color, blur) {
			ctx.shadowColor = color;
			ctx.shadowBlur = blur;
			ctx.shadowOffsetX = x;
			ctx.shadowOffsetY = y;
		}
	}, {
		key: "imageToCanvas",
		value: function imageToCanvas(image) {
			var canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			canvas.getContext("2d").drawImage(image, 0, 0);
			return canvas;
		}
	}, {
		key: "setLineDash",
		value: function setLineDash(ctx) {
			if (typeof ctx.setLineDash === "function") {
				for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
					args[_key7 - 1] = arguments[_key7];
				}

				ctx.setLineDash(args);
			}
		}
	}, {
		key: "calcTextWidth",
		value: function calcTextWidth(ctx, value) {
			var font = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			if (font) ctx.font = font;
			return ctx.measureText(value).width;
		}
	}, {
		key: "canvasToImage",
		value: function canvasToImage(canvas) {
			var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "image/png";

			var image = new Image();
			image.src = canvas.toDataURL(format);
			image.width = canvas.width;
			image.height = canvas.height;
			return image;
		}
	}]);

	return CanvasHandler;
}();

var ContentManager = function () {
	function ContentManager() {
		_classCallCheck(this, ContentManager);

		this._contentImage = null;
		this._contentHTML = null;
		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(ContentManager, [{
		key: "setContentImage",
		value: function setContentImage() {
			var _this25 = this;

			var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (this._contentImage === null) this._contentImage = document.getElementById("contentImage");

			if (src) this._contentImage.src = src;else {
				this._contentImage.src = "#";
				loadImage(function (img) {
					return _this25._contentImage.src = img.src;
				});
			}

			this._contentImage.classList.remove("hide");
		}
	}, {
		key: "setContentHTML",
		value: function setContentHTML() {
			var _this26 = this;

			if (this._contentHTML === null) this._contentHTML = document.getElementById("contentHTML");
			this._contentHTML.classList.remove("hide");
			loadFile(function (html) {
				return _this26._contentHTML.innerHTML = html;
			});
		}
	}, {
		key: "hideContent",
		value: function hideContent() {
			if (this._contentImage !== null) this._contentImage.classList.add("hide");
			if (this._contentHTML !== null) this._contentHTML.classList.add("hide");
		}
	}]);

	return ContentManager;
}();

var ObjectsManager = function () {
	function ObjectsManager() {
		_classCallCheck(this, ObjectsManager);

		this._movedObject = false;
		this._objects = [];
		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(ObjectsManager, [{
		key: "size",
		value: function size() {
			return this._objects.length;
		}
	}, {
		key: "onMouseMove",
		value: function onMouseMove(pos, movX, movY) {
			selectedObjects.forEach(function (e) {
				return Movement.move(e, movX, movY);
			});

			if (!this._movedObject.selected) Movement.move(this._movedObject, movX, movY);

			if (selectedObjects.size()) updateSelectedObjectView(selectedObjects.getLast());else if (this._movedObject) updateSelectedObjectView(this._movedObject);
		}
	}, {
		key: "deleteAll",
		value: function deleteAll() {
			each(this._objects, function (e) {
				return Scene.remove(e);
			});
		}
	}, {
		key: "selectAll",
		value: function selectAll() {
			var _this27 = this;

			Scene.forEach(function (e) {
				return _this27.add(e);
			});
		}
	}, {
		key: "add",
		value: function add(o) {
			if (isDefined(o.locked) && o.locked || !o || this._objects.indexOf(o) >= 0) return;
			this._objects.push(o);

			o.selected = true;

			updateSelectedObjectView(o);
		}
	}, {
		key: "get",
		value: function get(i) {
			return this._objects.hasOwnProperty(i) ? this._objects[i] : false;
		}
	}, {
		key: "getLast",
		value: function getLast() {
			return this._objects[this.size() - 1];
		}
	}, {
		key: "clear",
		value: function clear() {
			each(this._objects, function (e) {
				if (isDefined(e.moveType)) e.moveType = -1;
				e.selected = false;
			});
			this._objects = [];
		}
	}, {
		key: "clearAndAdd",
		value: function clearAndAdd(o) {
			this.clear();
			this.add(o);
		}
	}, {
		key: "forEach",
		value: function forEach(e) {
			each(this._objects, e);
		}
	}, {
		key: "firstObject",
		get: function get() {
			return this._objects[0];
		}
	}, {
		key: "movedObject",
		get: function get() {
			return this._movedObject;
		},
		set: function set(val) {
			this._movedObject = val;
		}
	}]);

	return ObjectsManager;
}();

var Layer = function () {
	function Layer(title) {
		var layerType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

		_classCallCheck(this, Layer);

		this._objects = {};
		this._visible = true;
		this._title = title;
		this._paint = null;
		this._locked = false;
		this._drawPaint = true;
		this._opacity = 1;
		this._raster = false;
		this._canvas = null;
		this._forRemove = [];
		this._layerType = layerType;
	}

	_createClass(Layer, [{
		key: "setForRemove",
		value: function setForRemove(el) {
			this._forRemove.push(el);
		}
	}, {
		key: "removeElements",
		value: function removeElements() {
			each(this._forRemove, function (e) {
				return Project.scene.remove(e);
			});
			this._forRemove = [];
		}
	}, {
		key: "cleanUp",
		value: function cleanUp() {
			this.forEach(function (e) {
				return callIfFunc(e.cleanUp);
			});
			this._objects = [];
			Paints.cleanUp(this._title);
			Events.layerCleanUp(this._title);
		}
	}, {
		key: "rename",
		value: function rename(title) {
			Events.layerRename(this._title, title);
			this._title = title;
		}
	}, {
		key: "makeRaster",
		value: function makeRaster() {
			this._raster = true;
		}
	}, {
		key: "getObject",
		value: function getObject(id) {
			return this._objects[id];
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			if (!this.visible) return;

			this.forEach(function (e) {
				return e.visible && e.draw(ctx);
			});

			if (this._drawPaint) this.paint.draw(ctx);
		}
	}, {
		key: "add",
		value: function add(element) {
			this._objects[element.id] = element;
		}
	}, {
		key: "remove",
		value: function remove(element) {
			delete this._objects[element.id];
		}
	}, {
		key: "forEach",
		value: function forEach(func) {
			each(this._objects, function (e) {
				return func(e);
			});
		}
	}, {
		key: "locked",
		get: function get() {
			return this._locked || this._layerType !== "";
		},
		set: function set(val) {
			locked = val === true ? true : false;
		}
	}, {
		key: "taskLayer",
		get: function get() {
			return this._layerType === LAYER_TASK;
		}
	}, {
		key: "guiLayer",
		get: function get() {
			return this._layerType === LAYER_GUI;
		}
	}, {
		key: "userLayer",
		get: function get() {
			return this._layerType === LAYER_USER;
		}
	}, {
		key: "drawPaint",
		get: function get() {
			return this._drawPaint;
		},
		set: function set(val) {
			this._drawPaint = val;
		}
	}, {
		key: "layerType",
		get: function get() {
			return this._layerType;
		}
	}, {
		key: "visible",
		get: function get() {
			return this._visible;
		},
		set: function set(val) {
			this._visible = val;
		}
	}, {
		key: "objects",
		get: function get() {
			return this._objects;
		},
		set: function set(val) {
			this._objects = val;
		}
	}, {
		key: "raster",
		get: function get() {
			return this._raster;
		}
	}, {
		key: "title",
		get: function get() {
			return this._title;
		},
		set: function set(val) {
			this._title = val;
		}
	}, {
		key: "paint",
		get: function get() {
			if (isNull(this._paint)) this._paint = new Paint();
			return this._paint;
		}
	}]);

	return Layer;
}();

var SceneManager = function () {
	function SceneManager() {
		_classCallCheck(this, SceneManager);

		this._layers = {};
		this._secondCanvas = null;
		this._layersCount = 0;
		this._creator = new objectCreator();
		this._objectManager = new ObjectsManager();

		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(SceneManager, [{
		key: "initSecondCanvas",
		value: function initSecondCanvas() {
			this._secondCanvas = new CanvasHandler();
		}
	}, {
		key: "forEach",
		value: function forEach(func) {
			each(this._layers, function (e) {
				return e.visible && e.forEach(func);
			});
		}
	}, {
		key: "cleanUp",
		value: function cleanUp() {
			var _this28 = this;

			each(this._layers, function (e) {
				e.cleanUp();
				if (e.title !== DEFAULT_LAYER_TITLE) _this28.deleteLayer(e.title);
			});

			Events.sceneCleanUp();
			Logger.log("Bol vyčistený objekt " + this.constructor.name, LOGGER_OBJECT_CLEANED);
		}
	}, {
		key: "onScreenResize",
		value: function onScreenResize() {
			each(this._layers, function (e) {
				return e.paint.onScreenResize();
			});
		}
	}, {
		key: "createLayer",
		value: function createLayer() {
			var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_LAYER_TITLE;
			var layerType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

			if (this._layers.hasOwnProperty(title)) {
				Logger.error(getMessage(MSG_RECREATE_LAYER, title));
				return null;
			}
			if (this.layersNumber == LIMIT_LAYERS_COUNT) {
				Logger.error(getMessage(MSG_MAXIMUM_LAYER, LIMIT_LAYERS_COUNT));
				return null;
			}
			this._layers[title] = new Layer(title, layerType);
			this._layersCount++;

			if (isDefined(Layers)) {
				Layers.createLayer(this._layers[title]);
			}

			Events.layerCreate(title, layerType);
			return this._layers[title];
		}
	}, {
		key: "getLayer",
		value: function getLayer(layer) {
			return this._layers[layer];
		}
	}, {
		key: "renameLayer",
		value: function renameLayer(oldTitle, newTitle) {
			if (this._layers[oldTitle] && !this._layers[newTitle]) {
				this._layers[newTitle] = this._layers[oldTitle];
				delete this._layers[oldTitle];
				this._layers[newTitle].rename(newTitle);
			}
		}
	}, {
		key: "deleteLayer",
		value: function deleteLayer(title) {
			if (!this._layers.hasOwnProperty(title)) Logger.error("ide sa vymazať vrstva ktorá už neexistuje: " + title);

			if (this._layers[title].guiLayer) {
				Logger.notif("nemože sa zmazať gui vrstva");
				return false;
			}

			this._layers[title].cleanUp();
			delete this._layers[title];

			this._layersCount--;

			if (isDefined(Layers)) Layers.deleteLayer(title);

			Events.layerDelete(title);
		}
	}, {
		key: "changeLayer",
		value: function changeLayer(object, newLayer) {
			var layer = Project.scene.getLayer(newLayer);
			if (layer) {
				var oldLayer = object.layer;
				layer.add(object);
				Entity.changeAttr(object, "layer", newLayer);
				Project.scene.getLayer(oldLayer).remove(object);
			}
		}
	}, {
		key: "getTaskObject",
		value: function getTaskObject(data) {

			data["error"] = data["error"] === "" ? data["error"] : "";
			data["results"] = isEmptyObject(data["results"]) ? data["results"] : {};
			data["content"] = isEmptyArray(data["content"]) ? data["content"] : [];

			each(this.layers, function (e, i) {
				if (e.visible) {
					e.forEach(function (e) {
						if (e === Layers) return;
						if (e.visible) {
							if (e.name === OBJECT_TEXT) {
								if (e.text === "") return;
								if (e.taskResult) {
									data["results"][e.id] = e.text;
									e.text = "";
									for (var i in data["results"][e.id]) {
										e.text += " ";
									}
								}
							}
							data["content"].push(e);
						}
					});
				}
			});

			var findAssignment = true;

			if (isEmptyObject(data["results"])) {
				data["error"] += "nieje zadaný žiadny text pre výsledok";
			}

			return data["error"] === "" && findAssignment;
		}
	}, {
		key: "addToScene",
		value: function addToScene(object) {
			var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Layers.activeLayerName;
			var resend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			if (!this._layers.hasOwnProperty(layer)) Logger.error("ide sa načítať neexistujúca vrstva: " + layer);

			object.layer = layer;
			this._layers[layer].add(object);

			Events.objectAdded(resend, object);

			if (!resend) object.selected = false;

			draw();
		}
	}, {
		key: "findObjectsForRemove",
		value: function findObjectsForRemove(x, y, radius) {
			each(Project.scene.layers, function (layer) {
				layer.forEach(function (object) {
					if (isFunction(object.isIn)) {
						if (object.isIn(x, y, radius)) {
							layer.setForRemove(object);
						}
					}
				});
				layer.removeElements();
			});
		}
	}, {
		key: "getObject",
		value: function getObject(layer, id) {
			return this._layers[layer].getObject(id);
		}
	}, {
		key: "draw",
		value: function draw() {
			each(this._layers, function (e) {
				return e.draw();
			});
		}
	}, {
		key: "remove",
		value: function remove(obj) {
			var layer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : obj.layer;
			var resend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			this._layers[layer].remove(obj);
			Events.objectDeleted(resend, obj);
		}
	}, {
		key: "toString",
		value: function toString() {
			return JSON.stringify(this.toObject());
		}
	}, {
		key: "fromObject",
		value: function fromObject(content) {
			each(content, function (e) {
				return Creator.create(e);
			});
		}
	}, {
		key: "fromObjectToSingleLayer",
		value: function fromObjectToSingleLayer(layer, content) {
			each(content, function (e) {
				e._layer = layer;
				Creator.create(e);
			});
		}
	}, {
		key: "toObject",
		value: function toObject() {
			var result = [];

			each(this._layers, function (e) {
				return e.forEach(function (ee) {
					if (ee.name != "LayerViewer") result.push(ee);
				});
			});
			return result;
		}
	}, {
		key: "creator",
		get: function get() {
			return this._creator;
		}
	}, {
		key: "objectManager",
		get: function get() {
			return this._objectManager;
		}
	}, {
		key: "layers",
		get: function get() {
			return this._layers;
		}
	}, {
		key: "paint",
		get: function get() {
			return Layers.activeLayer.paint;
		}
	}, {
		key: "layersNumber",
		get: function get() {
			return this._layersCount;
		}
	}, {
		key: "secondCanvas",
		get: function get() {
			return this._secondCanvas;
		}
	}]);

	return SceneManager;
}();

var EventManager = function () {
	function EventManager() {
		_classCallCheck(this, EventManager);

		this._history = [];
	}

	_createClass(EventManager, [{
		key: "paintAddPoint",
		value: function paintAddPoint(position, activeLayerName) {
			if (Project.connection) Project.connection.paint.addPoint(position, activeLayerName);
		}
	}, {
		key: "paintAddPath",
		value: function paintAddPath(activeLayerName, path) {}
	}, {
		key: "paintBreakLine",
		value: function paintBreakLine(activeLayerName) {
			if (Project.connection) Project.connection.paint.breakLine(activeLayerName);

			Logger.log("bola ukončená čiara vo vrstve " + activeLayerName, LOGGER_PAINT_ACTION);
		}
	}, {
		key: "paintCleanUp",
		value: function paintCleanUp(activeLayerName) {
			if (Project.connection) Project.connection.paint.clean(activeLayerName);

			Logger.log("Bol vyčistený objekt " + this.constructor.name, LOGGER_OBJECT_CLEANED);
		}
	}, {
		key: "paintBrushChange",
		value: function paintBrushChange(size, color, imageTitle) {
			Logger.log("Bol prekreslený štetec " + size + ", " + color + ", " + imageTitle, LOGGER_PAINT_HISTORY);
		}
	}, {
		key: "paintUndo",
		value: function paintUndo(layer) {
			Logger.log("bolo zavolane undo na vrstvu " + layer, LOGGER_PAINT_HISTORY);
		}
	}, {
		key: "paintRedo",
		value: function paintRedo(layer) {
			Logger.log("bolo zavolane redo na vrstvu " + layer, LOGGER_PAINT_HISTORY);
		}
	}, {
		key: "layerCreate",
		value: function layerCreate(title, type) {
			if (Project.connection) Project.connection.layer.create(title, type);
			Logger.log("Vytvorila sa vrstva: " + title + "typu: " + type, LOGGER_LAYER_CHANGE);
		}
	}, {
		key: "layerDelete",
		value: function layerDelete(title) {
			if (Project.connection) Project.connection.layer.delete(title);
			Logger.log("Vymazala sa vrstva: " + title, LOGGER_LAYER_CHANGE);
		}
	}, {
		key: "layerRaster",
		value: function layerRaster(title) {
			Logger.log("vrstva " + title + " bola rastrovaná", LOGGER_LAYER_RASTERED);
		}
	}, {
		key: "layerCleanUp",
		value: function layerCleanUp(title) {
			if (Project.connection) Project.connection.layer.clean(title);
			Logger.log("Bola vyčistená vrstva: " + title, LOGGER_LAYER_CLEANED);
		}
	}, {
		key: "layerRename",
		value: function layerRename(oldTitle, newTitle) {
			if (Project.connection) Project.connection.layer.rename(oldTitle, newTitle);
			Logger.log("Bola premenovaná vrstva: " + oldTitle + " na " + newTitle, LOGGER_LAYER_RENAMED);
		}
	}, {
		key: "creatorChange",
		value: function creatorChange(key, val) {
			if (Project.connection) Project.connection.creatorChange(key, val);

			Logger.log("Creatorovi sa nastavuje " + key + " na " + val, LOGGER_CREATOR_CHANGE);
		}
	}, {
		key: "objectAdded",
		value: function objectAdded(resend, object) {
			if (resend && Project.connection) Project.connection.object.create(object);
			Logger.log("Vytvára sa objekt ", LOGGER_OBJECT_CREATED);
		}
	}, {
		key: "objectChange",
		value: function objectChange(object, attribute) {
			if (Project.connection) Project.connection.object.change(object, attribute);
		}
	}, {
		key: "objectDeleted",
		value: function objectDeleted(resend, object) {
			if (resend && Project.connection) Project.connection.object.delete(object);
		}
	}, {
		key: "objectMove",
		value: function objectMove(object) {

			if (Project.connection) Project.connection.object.move(object);
		}
	}, {
		key: "sceneCleanUp",
		value: function sceneCleanUp() {}
	}, {
		key: "loadScene",
		value: function loadScene() {}
	}, {
		key: "keyDown",
		value: function keyDown(key) {
			if (Project.connection) Project.connection.input.keyDown(key);
			Logger.log("stlačené klavesa " + key, LOGGER_KEY_EVENT);
		}
	}, {
		key: "keyUp",
		value: function keyUp(key) {
			if (Project.connection) Project.connection.input.keyUp(key);
			Logger.log("pustená klavesa " + key, LOGGER_KEY_EVENT);
		}
	}, {
		key: "mouseMove",
		value: function mouseMove(x, y) {
			if (isSharing()) Sharer.mouseChange(x, y);
		}
	}, {
		key: "mouseDown",
		value: function mouseDown(key, x, y) {
			Logger.log("stlačené tlačítko myši ::" + key + "::" + x + "::" + y, LOGGER_MOUSE_EVENT);

			if (isSharing()) Sharer.mouseChange(key);
		}
	}, {
		key: "mouseUp",
		value: function mouseUp(key, x, y) {
			Logger.log("pustené tlačítko myši ::" + key + "::" + x + "::" + y, LOGGER_MOUSE_EVENT);
			if (isSharing()) Sharer.mouseChange(key);
		}
	}]);

	return EventManager;
}();

var TimeLine = function () {
	function TimeLine() {
		var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 75;
		var maxVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
		var minVal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

		_classCallCheck(this, TimeLine);

		this.onScreenResize();
		this._slideHeight = TIMELINE_SLIDER_HEIGHT;
		this._slideColor = TIMELINE_SLIDER_COLOR;
		this._sliderOffset = TIMELINE_SLIDER_OFFSET;
		this._buttonColor = TIMELINE_BUTTON_COLOR;
		this._buttonSize = TIMELINE_BUTTON_SIZE;
		this._buttonBorderColor = TIMELINE_BUTTON_BORDER_COLOR;
		this._maxVal = maxVal;
		this._minVal = minVal;
		this.value = val;

		this._sliderPosition = this._calcSliderPosition();

		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(TimeLine, [{
		key: "_clickInBoundingBox",
		value: function _clickInBoundingBox(x, y) {
			return x > this._position.x && x < this._position.x + this._size.x && y > this._position.y && y < this._position.y + this._size.y;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			if (!this._clickInBoundingBox(x, y, this)) return false;

			var pos = [this._sliderOffset + this._sliderPosition, this._position.y + (this._size.y >> 1)];

			return Math.sqrt(Math.pow(x - pos[0], 2) + Math.pow(y - pos[1], 2)) < this._buttonSize;
		}
	}, {
		key: "_calcSliderPosition",
		value: function _calcSliderPosition() {
			return (this._size.x - (this._sliderOffset << 1)) / (this._maxVal - this._minVal) * (this._val - this._minVal);
		}
	}, {
		key: "animateToVal",
		value: function animateToVal(goalVal) {
			var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
			var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000 / FPS;

			var offset = (goalVal - this._val) / frames,
			    inst = this,
			    counter = 0,
			    int = setInterval(function () {
				inst._val += offset;
				if (++counter == frames) clearInterval(int);
				draw();
			}, speed);
		}
	}, {
		key: "onScreenResize",
		value: function onScreenResize() {
			var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.innerWidth;
			var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.innerHeight;

			this._position = new GVector2f(0, window.innerHeight - TIMELINE_HEIGHT);
			this._size = new GVector2f(window.innerWidth, TIMELINE_HEIGHT);
		}
	}, {
		key: "onMouseMove",
		value: function onMouseMove(pos) {
			if (pos.x < this._position.x + this._sliderOffset) pos.x = this._position.x + this._sliderOffset;
			if (pos.x > this._position.x + this._size.x - this._sliderOffset) pos.x = this._position.x + this._size.x - this._sliderOffset;

			this._sliderPosition = pos.x - this._sliderOffset;
			this._val = (this._sliderPosition - this._position.x) / (this._size.x - (this._sliderOffset << 1)) * this._maxVal;
		}
	}, {
		key: "draw",
		value: function draw() {
			doRect({
				position: this._position,
				size: this._size,
				fillColor: "Lavender",
				borderColor: "LawnGreen",
				borderWidth: 1
			});

			doRect({
				x: this._position.x + this._sliderOffset,
				y: this._position.y + (this._size.y - this._slideHeight >> 1),
				width: this._size.x - (this._sliderOffset << 1),
				height: this._slideHeight,
				fillColor: this._slideColor
			});

			doArc({
				x: this._sliderOffset + this._sliderPosition,
				y: this._position.y + (this._size.y >> 1),
				width: this._buttonSize,
				center: true,
				height: this._buttonSize,
				fillColor: this._buttonColor,
				borderColor: this._buttonBorderColor
			});
		}
	}, {
		key: "value",
		set: function set(val) {
			this._val = val;
			this._sliderPosition = this._calcSliderPosition();
		}
	}]);

	return TimeLine;
}();

var REFRESH_TIME = 1000;
var RECONNECT_TRIES = 10;

var KEY_USER_NAME = "user_name";
var KEY_USER_ID = "user_id";
var KEY_LESS_ID = "less_id";
var KEY_TARGET = "target";
var KEY_TYPE = "type";
var KEY_LAYER = "layer";
var KEY_WATCH = "watch";
var KEY_SHARE = "share";
var KEY_TITLE = "title";
var KEY_VALUE = "value";
var KEY_TEACH = "teach";
var KEY_DATA = "data";
var KEY_EXERCISE = "exercise";

var ConnectionManager = function () {
	function ConnectionManager() {
		var _this29 = this;

		_classCallCheck(this, ConnectionManager);

		this._user_id = false;
		this._socket = false;
		this._user_name = DEFAULT_USER_NAME;
		this._connectedUsers = {};
		this.paint = {
			addPoint: function addPoint(pos, layer) {
				return _this29._paintAction(ACTION_PAINT_ADD_POINT, pos, layer);
			},
			breakLine: function breakLine(layer) {
				return _this29._paintAction(ACTION_PAINT_BREAK_LINE, layer);
			},
			clean: function clean(layer) {
				return _this29._paintAction(ACTION_PAINT_CLEAN, layer);
			},
			addPath: function addPath(layer, path) {
				return _this29._paintAction(ACTION_PAINT_ADD_PATH, layer, path);
			}
		};
		this.object = {
			move: function move(obj) {
				return _this29._objectAction(ACTION_OBJECT_MOVE, obj);
			},
			change: function change(obj, keys) {
				return _this29._objectAction(ACTION_OBJECT_CHANGE, obj, keys);
			},
			delete: function _delete(obj) {
				return _this29._objectAction(ACTION_OBJECT_DELETE, obj);
			},
			create: function create(obj) {
				return _this29._objectAction(ACTION_OBJECT_CREATE, obj);
			}
		};
		this.input = {
			mouseMove: function mouseMove(dir, pos) {
				return _this29._inputAction(ACTION_MOUSE_MOVE, dir, pos);
			},
			mouseDown: function mouseDown(key, pos) {
				return _this29._inputAction(ACTION_MOUSE_DOWN, key, pos);
			},
			mouseUp: function mouseUp(key, pos) {
				return _this29._inputAction(ACTION_MOUSE_UP, key, pos);
			},
			keyDown: function keyDown(key) {
				return _this29._inputAction(ACTION_KEY_DOWN, key);
			},
			keyUp: function keyUp(key) {
				return _this29._inputAction(ACTION_KEY_UP, key);
			}
		};
		this.layer = {
			create: function create(title, type) {
				return _this29._layerAction(ACTION_LAYER_CREATE, title, type);
			},
			delete: function _delete(title) {
				return _this29._layerAction(ACTION_LAYER_DELETE, title);
			},
			clean: function clean(title) {
				return _this29._layerAction(ACTION_LAYER_CLEAN, title);
			},
			visible: function visible(title, val) {
				return _this29._layerAction(ACTION_LAYER_VISIBLE, val);
			},
			rename: function rename(title, val) {
				return _this29._layerAction(ACTION_LAYER_RENAME, val);
			}
		};
		this._sharing = false;
		this._sender = new EventTimer(function (e) {
			return _this29._sendStack();
		}, REFRESH_TIME);
		this._buffer = [];
		var inst = this;
		$.post("/create", { content: JSON.stringify({ meno: "gabriel" }) }, function (data) {
			inst._user_id = data["cookies"][KEY_USER_ID];
		}, "json");

		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(ConnectionManager, [{
		key: "startShare",
		value: function startShare(data) {
			data[KEY_TYPE] = KEY_SHARE;
			this.connect(data);
		}
	}, {
		key: "startTeach",
		value: function startTeach(data) {
			data[KEY_TYPE] = KEY_TEACH;
			this.connect(data);
		}
	}, {
		key: "startWatch",
		value: function startWatch(data) {
			data[KEY_TYPE] = KEY_WATCH;

			if (isUndefined(data[KEY_LESS_ID])) {
				Logger.error(getMessage(MSG_MISS_LESS_ID));
				return false;
			}

			this.connect(data);
		}
	}, {
		key: "startExercise",
		value: function startExercise(data) {
			data[KEY_TYPE] = KEY_EXERCISE;

			if (isUndefined(data[KEY_LESS_ID])) {
				Logger.error(getMessage(MSG_MISS_LESS_ID));
				return false;
			}

			this.connect(data);
		}
	}, {
		key: "connect",
		value: function connect(data) {
			this._socket = io();
			this._startTime = Date.now();
			this._type = data[KEY_TYPE];
			this._user_name = data[KEY_USER_NAME] || this._user_name;
			data["resolution"] = window.innerWidth + "_" + window.innerHeight;
			var inst = this;
			inst.resetLives();

			this._sharePaints = data["sharePaints"];
			this._shareInput = data["shareInput"];
			this._shareCreator = data["shareCreator"];
			this._shareLayers = data["shareLayers"];
			this._shareObjects = data["shareObjects"];
			this._maximalWatchers = data["maxWatchers"];

			this._socket.on("connect_failed", function () {
				Logger.error(getMessage(MSG_CONN_FAILED));
			});

			this._socket.on("connect_error", function () {
				inst._lives === RECONNECT_TRIES && Logger.error(getMessage(MSG_CONN_ERROR));
				inst._lives--;
				if (inst._lives === 0) inst.disconnect();
			});

			this._socket.on("reconnect", function () {
				inst.resetLives();
				Logger.notif(getMessage(MSG_CONN_RECONNECT));
			});

			this._socket.on('confirmConnection', function (response) {
				inst._less_id = response[KEY_DATA][KEY_LESS_ID];
				inst._connectTime = Date.now();
				inst._messageTime = Date.now();
				if (inst._type === KEY_WATCH || inst._type === KEY_TEACH) {
					if (inst._type === KEY_WATCH) Scene.initSecondCanvas();

					inst._watching = true;
				} else {
					inst._sharing = true;
				}

				Logger.notif(getMessage(MSG_CONN_CONFIRM));
				if (isFunction(Menu.disabled)) {
					Menu.disabled("sharing", "watch");
					Menu.disabled("sharing", "stopShare");
					Menu.disabled("sharing", "shareOptions");
					Menu.disabled("sharing", "copyUrl");
					Menu.disabled("sharing", "startShare");
				}
			});

			this._socket.on('receivedBuffer', function (response) {

				inst._processStack(response);
			});

			this._socket.on('errorLog', function (response) {
				Logger.error(response.msg);
			});

			this._socket.on("notifLog", function (response) {
				Logger.notif(response.msg);
			});

			this._socket.emit("initConnection", data);
		}
	}, {
		key: "disconnect",
		value: function disconnect() {
			if (isFunction(Menu.disabled)) {
				Menu.disabled("sharing", KEY_WATCH);
				Menu.disabled("sharing", "stopShare");
				Menu.disabled("sharing", "shareOptions");
				Menu.disabled("sharing", "copyUrl");
				Menu.disabled("sharing", "startShare");
			}
			this._socket.disconnect();
			this._user_id = false;
			this._socket = false;
			this._sharing = false;
			this._watching = false;
			Logger.notif(getMessage(MSG_CONN_DISCONNECT));
			Panel.stopShare();
		}
	}, {
		key: "_processInputAction",
		value: function _processInputAction(data) {}
	}, {
		key: "_processStack",
		value: function _processStack(data) {
			console.log("prijaty buffer po: " + (Date.now() - this._messageTime));
			this._messageTime = Date.now();
			var inst = this;
			each(data.buffer, function (e) {
				switch (e["action"]) {
					case "requireAllData":
						Handler.processRequireAllData(inst, e[KEY_DATA]);
						break;
					case "sendAllData":
						Handler.processSendAllData(inst, e[KEY_DATA]);
						break;
					case "userDisconnect":
						Handler.processUserDisconnect(inst, e[KEY_DATA]);
						break;
					case "userConnect":
						Handler.processUserConnect(inst, e[KEY_DATA]);
						break;
					case "paintAction":
						Handler.processPaintAction(e[KEY_DATA], inst._type);
						break;
					case "layerAction":
						Handler.processLayerAction(e[KEY_DATA]);
						break;
					case "inputAction":
						inst._processInputAction(e[KEY_DATA]);
						break;
					case "creatorAction":
						Creator.setOpt(e[KEY_DATA]["key"], e[KEY_DATA][KEY_VALUE]);
						draw();
						break;
					case "objectAction":
						Handler.processObjectAction(e[KEY_DATA], inst._type);
						break;
					default:
						Logger.error(getMessage(MSG_UNKNOW_ACTION, e["action"]));
				}
			});
		}
	}, {
		key: "_sendStack",
		value: function _sendStack() {
			if (!this._socket || this._socket.disconnected) return;
			if (this._buffer.length === 0) {
				return false;
			}
			var result = {
				buffer: this._buffer,
				user_id: this._user_id
			};
			if (this._less_id) result[KEY_LESS_ID] = this._less_id;
			this._socket.emit("sendBuffer", result);
			this._buffer = [];
		}
	}, {
		key: "_sendMessage",
		value: function _sendMessage(action, data) {
			this._buffer.push({ action: action, time: Date.now(), data: data });
			this._sender.callIfCan();
		}
	}, {
		key: "resetLives",
		value: function resetLives() {
			this._lives = RECONNECT_TRIES;
		}
	}, {
		key: "creatorChange",
		value: function creatorChange(key, value) {
			if (!this._socket || !this._shareCreator || this.watching) return;

			var data = {
				key: key,
				value: value
			};
			this._sendMessage('creatorAction', data);
		}
	}, {
		key: "_layerAction",
		value: function _layerAction(type, arg1, arg2) {
			if (!this._socket || !this._shareLayers || this.watching) return;
			var data = {
				action: type
			};

			switch (type) {
				case ACTION_LAYER_CREATE:
					data[KEY_TITLE] = arg1;
					data[KEY_TYPE] = arg2;
					break;
				case ACTION_LAYER_DELETE:
					data[KEY_TITLE] = arg1;
					break;
				case ACTION_LAYER_CLEAN:
					data[KEY_TITLE] = arg1;
					break;
				case ACTION_LAYER_VISIBLE:
					data[KEY_TITLE] = arg1;
					data[KEY_VALUE] = arg2;
					break;
				case ACTION_LAYER_RENAME:
					data[KEY_TITLE] = arg1;
					data[KEY_VALUE] = arg2;
					break;
			}

			this._sendMessage('layerAction', data);
		}
	}, {
		key: "_objectAction",
		value: function _objectAction(type, object, keys) {
			if (!this._socket || !this._shareObjects || this.watching) return;
			var data = {
				action: type,
				user_name: this._user_name
			};
			switch (type) {
				case ACTION_OBJECT_MOVE:
					data["oId"] = object.id;
					data["oL"] = object.layer;
					data["oX"] = object.position.x;
					data["oY"] = object.position.y;
					data["oW"] = object.size.x;
					data["oH"] = object.size.y;
					break;
				case ACTION_OBJECT_CHANGE:
					data["oId"] = object.id;
					data["oL"] = object.layer;
					data["keys"] = {};
					each(keys, function (e, i) {
						return data.keys["i"] = object[i];
					});
					break;
				case ACTION_OBJECT_DELETE:
					data["oId"] = object.id;
					data["oL"] = object.layer;
					break;
				case ACTION_OBJECT_CREATE:
					data["o"] = object;
					break;
				default:
					Logger.error(type, 2);
					return;
			}
			this._sendMessage('objectAction', data);
		}
	}, {
		key: "_inputAction",
		value: function _inputAction(type, param1, param2) {
			if (!this._socket || !this._shareInput || this.watching) return false;

			var data = {
				type: type
			};

			switch (type) {
				case ACTION_KEY_DOWN:
					data["key"] = param1;
					break;
				case ACTION_KEY_UP:
					data["key"] = param1;
					break;
				case ACTION_MOUSE_DOWN:
					data["key"] = param1;
					data["position"] = param2;
					break;
				case ACTION_MOUSE_UP:
					data["key"] = param1;
					data["position"] = param2;
					break;
				case ACTION_MOUSE_MOVE:
					data["direction"] = param1;
					data["position"] = param2;
					break;
				default:
					Logger.error(type, 1);
			}
			this._sendMessage('inputAction', data);
		}
	}, {
		key: "_paintAction",
		value: function _paintAction(type, arg1, arg2) {
			if (!this._socket || !this._sharePaints || this.watching) return false;

			var data = {
				action: type,
				user_name: this._user_name
			};
			switch (type) {
				case ACTION_PAINT_ADD_POINT:
					data["pX"] = arg1.x;
					data["pY"] = arg1.y;
					data[KEY_LAYER] = arg2;
					break;
				case ACTION_PAINT_BREAK_LINE:
					data[KEY_LAYER] = arg1;
					break;
				case ACTION_PAINT_CLEAN:
					data[KEY_LAYER] = arg1;
					break;
				case ACTION_PAINT_ADD_PATH:
					data[KEY_LAYER] = arg1;
					data["path"] = arg2;
					break;
				case ACTION_PAINT_REMOVE_PATH:
					data[KEY_LAYER] = arg1;
					break;
				default:
					Logger.error(type, 3);
					return;
			}
			this._sendMessage('paintAction', data);
		}
	}, {
		key: "userId",
		get: function get() {
			return this._user_id;
		}
	}, {
		key: "sharing",
		get: function get() {
			return this._sharing;
		}
	}, {
		key: "watching",
		get: function get() {
			return this._watching;
		}
	}]);

	return ConnectionManager;
}();

var Handler = function () {
	function Handler() {
		_classCallCheck(this, Handler);
	}

	_createClass(Handler, null, [{
		key: "processUserDisconnect",
		value: function processUserDisconnect(inst, data) {
			Logger.notif("používatel " + data[KEY_USER_NAME] + "[ " + data[KEY_USER_ID] + "] sa odpojil");
			var user = inst._connectedUsers[data[KEY_USER_ID]];
			if (user) {
				user.status = STATUS_DISCONNECTED;
				lastConnectionTime = Date.now();
			}
		}
	}, {
		key: "processUserConnect",
		value: function processUserConnect(inst, data) {
			inst._connectedUsers[data[KEY_USER_ID]] = {
				user_name: data[KEY_USER_NAME],
				status: STATUS_CONNECTED,
				connectTime: Date.now()
			};
			if (inst._type === KEY_TEACH) {}

			Logger.notif(getMessage(MSG_USER_CONNECT, data[KEY_USER_NAME], data[KEY_USER_ID]));
		}
	}, {
		key: "processRequireAllData",
		value: function processRequireAllData(inst, data) {
			console.log("prijal som žiadosť o všetky udaje pre " + data[KEY_TARGET]);
			var result = {};
			if (inst._type === KEY_SHARE) {
				result = {
					msg: {
						scene: Scene.toObject(),
						creator: Creator.toObject(),
						paint: Paints.toObject(),
						user_name: inst._user_name
					},
					target: data[KEY_TARGET]
				};

				inst._sendMessage('sendAllData', result);
			} else if (inst._type === KEY_EXERCISE) {
				result = {
					msg: {
						scene: Scene.toObject(),
						paint: Paints.toObject(),
						user_name: inst._user_name
					},
					target: data[KEY_TARGET]
				};
				inst._sendMessage('sendAllData', result);
			}
		}
	}, {
		key: "processSendAllData",
		value: function processSendAllData(inst, data) {
			console.log("prijal som všetky udaje ");
			if (inst._type == KEY_WATCH) {
				var shareOptions = data.shareOptions;
				var watchOptions = data.watchOptions;

				if (shareOptions.share.objects) Scene.fromObject(data.scene);
				if (shareOptions.share.creator) Creator.fromObject(data.creator);
				if (shareOptions.share.paints) Paints.fromObject(data.paint);

				if (watchOptions.show.chat) {
					Panel.startWatch(sendMessage);
				}

				if (watchOptions.show.timeLine) timeLine = new TimeLine();

				Project.autor = watchOptions.nickName;

				console.log("nastavuje sa", data);
				Menu.visible = shareOptions.share.menu;
				Creator.visibleView = shareOptions.share.menu;
				Options.setOpt("showLayersViewer", shareOptions.share.layers);
			} else if (inst._type == KEY_TEACH) {
				if (Scene.getLayer(data[KEY_USER_NAME])) Scene.deleteLayer(data[KEY_USER_NAME]);
				Scene.createLayer(data[KEY_USER_NAME], LAYER_USER);
				Scene.fromObjectToSingleLayer(data[KEY_USER_NAME], data.scene);
				Paints.fromObjectToSingleLayer(data[KEY_USER_NAME], data.paint);
			}
			draw();
		}
	}, {
		key: "processObjectAction",
		value: function processObjectAction(data, type) {
			var obj,
			    layer = type === "teach" ? data["user_name"] : data["oL"];
			switch (data.action) {
				case ACTION_OBJECT_MOVE:
					obj = Scene.getObject(layer, data.oId);
					obj.position.set(data.oX, data.oY);
					obj.size.set(data.oW, data.oH);
					break;
				case ACTION_OBJECT_DELETE:
					Scene.remove(Scene.getObject(layer, data.oId), data.oL, false);
					break;
				case ACTION_OBJECT_CHANGE:
					obj = Scene.getObject(layer, data.oId);
					each(data.keys, function (e, i) {
						return obj[i] = e;
					});
					break;
				case ACTION_OBJECT_CREATE:
					data.o._layer = layer;
					Creator.create(data.o);
					break;
				default:
					Logger.error(getMessage(MSG_RECIEVED_UNKNOWN_ACTION, data.action));
			}
			draw();
		}
	}, {
		key: "processLayerAction",
		value: function processLayerAction(data) {
			var layer = Project.scene.getLayer(data[KEY_TITLE]);
			switch (data.action) {
				case ACTION_LAYER_CREATE:
					if (!layer) Project.scene.createLayer(data[KEY_TITLE], data[KEY_TYPE]);
					break;
				case ACTION_LAYER_DELETE:
					if (layer) Project.scene.deleteLayer(data[KEY_TITLE]);
					break;
				case ACTION_LAYER_CLEAN:
					if (layer) layer.cleanUp();
					break;
				case ACTION_LAYER_VISIBLE:
					if (layer) layer.visible = data[KEY_VALUE];
					break;
				case ACTION_LAYER_RENAME:
					if (layer) layer.rename(data[KEY_VALUE]);
					break;
			}
		}
	}, {
		key: "processPaintAction",
		value: function processPaintAction(data, type) {
			var layer = data[KEY_LAYER];
			if (type === KEY_TEACH) layer = data[KEY_USER_NAME];

			switch (data.action) {
				case ACTION_PAINT_ADD_POINT:
					Paints.addPoint(new GVector2f(data["pX"], data["pY"]), layer);
					break;
				case ACTION_PAINT_BREAK_LINE:
					Paints.breakLine(layer);
					break;
				case ACTION_PAINT_CLEAN:
					Paints.cleanUp(layer);
					break;
				case ACTION_PAINT_ADD_PATH:
					Paints.addPath(layer, data["path"]);
					break;
				default:
					Logger.error(getMessage(MSG_RECIEVED_UNKNOWN_ACTION, data.action));
			}
			draw();
		}
	}]);

	return Handler;
}();

function testExercise(lessId, name) {
	Project.connection.startExercise({
		user_name: name,
		less_id: lessId
	});
}

function testTeach() {
	var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "teacherName";

	Project.connection.startTeach({
		user_name: name,
		user_id: name
	});
}

function testWatch(lessId) {
	var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "watcherName";

	Project.connection.startWatch({
		user_name: name,
		less_id: lessId
	});
}

function testShare() {
	var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "SharerName";
	var watchers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

	Project.connection.startShare({
		user_name: name,
		sharePaints: true,
		shareCreator: true,
		shareObjects: true,
		shareLayers: true,
		maxWatchers: watchers });
}

var ProjectManager = function () {
	function ProjectManager(author) {
		var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "OIP Project";

		_classCallCheck(this, ProjectManager);

		this._createdAt = Date.now();
		this._title = title;
		this._autor = author;
		this._idCounter = 0;
		this._scene = new SceneManager();
		this._options = new OptionsManager();
		this._input = new InputManager();
		this._gui = new GuiManager();
		this._canvasManager = null;
		this._drawCounter = 0;
		this._connection = null;
		this._analyzer = new Analyzer("http://192.168.0.123:3000/anonymousData");

		try {
			if (typeof ConnectionManager === "function") {
				this._connection = new ConnectionManager();
			}
		} catch (e) {
			alert("Nastala chyba pri vytváraní pripojenia " + e);
		}

		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);

		this._analyzer.sendData();

		if (getCookie("send_data") === "") {
			setCookie("send_data", 1);
		}
	}

	_createClass(ProjectManager, [{
		key: "initCanvas",
		value: function initCanvas() {
			this._canvasManager = new CanvasManager(window.innerWidth, window.innerHeight);
		}
	}, {
		key: "generateId",
		value: function generateId() {
			var s = "000000000" + this._idCounter++;
			return (this._connection ? this._connection.userId : "") + s.substr(s.length - 6);
		}
	}, {
		key: "increaseDrawCounter",
		value: function increaseDrawCounter() {
			this._drawCounter++;
		}
	}, {
		key: "input",
		get: function get() {
			return this._input;
		}
	}, {
		key: "canvasManager",
		get: function get() {
			return this._canvasManager;
		}
	}, {
		key: "canvas",
		get: function get() {
			return this._canvasManager && this._canvasManager.canvas.canvas;
		}
	}, {
		key: "context",
		get: function get() {
			return this._canvasManager && this._canvasManager.canvas.context;
		}
	}, {
		key: "drawCounter",
		get: function get() {
			return this._drawCounter;
		}
	}, {
		key: "creator",
		get: function get() {
			return this._scene.creator;
		}
	}, {
		key: "scene",
		get: function get() {
			return this._scene;
		}
	}, {
		key: "gui",
		get: function get() {
			return this._gui;
		}
	}, {
		key: "topMenu",
		get: function get() {
			return this._gui.menu;
		}
	}, {
		key: "options",
		get: function get() {
			return this._options;
		}
	}, {
		key: "connection",
		get: function get() {
			return this._connection;
		}
	}, {
		key: "runOnMobile",
		get: function get() {
			return this._browserData.mobile > 0;
		}
	}, {
		key: "autor",
		set: function set(val) {
			this._autor = val;
		},
		get: function get() {
			return this._autor;
		}
	}, {
		key: "isMobile",
		get: function get() {
			return this._analyzer.isMobile;
		}
	}, {
		key: "title",
		get: function get() {
			return this._title;
		}
	}, {
		key: "time",
		get: function get() {
			return Date.now() - this._createdAt;
		}
	}]);

	return ProjectManager;
}();

var PaintManager = function () {
	function PaintManager() {
		_classCallCheck(this, PaintManager);

		this._brushes = [];
		this._selectedImage = null;
		this._selectedImageName = null;
		this._selectedBrush = null;
		this._action = PAINT_ACTION_LINE;
		this._paintHistory = [];
		this._undoHistory = [];

		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(PaintManager, [{
		key: "addPoint",
		value: function addPoint(position) {
			var activeLayerName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Layers.activeLayerName;

			Events.paintAddPoint(position, activeLayerName);
			var layer = Scene.getLayer(activeLayerName);
			if (layer) layer.paint.addPoint(position);
		}
	}, {
		key: "findPathsForRemove",
		value: function findPathsForRemove(position, radius) {
			var activeLayerName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Layers.activeLayerName;

			Scene.getLayer(activeLayerName).paint.findPathsForRemove(position, radius);
		}
	}, {
		key: "removeSelectedPaths",
		value: function removeSelectedPaths() {
			var activeLayerName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Layers.activeLayerName;

			Scene.getLayer(activeLayerName).paint.removeSelectedPaths();
		}
	}, {
		key: "cleanUp",
		value: function cleanUp() {
			var activeLayerName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Layers.activeLayerName;

			Events.paintCleanUp(activeLayerName);
			Scene.getLayer(activeLayerName).paint.cleanUp();
		}
	}, {
		key: "fromObject",
		value: function fromObject(content) {
			each(content, function (e, i) {
				var layer = Scene.getLayer(i);
				if (!layer) layer = Scene.createLayer(i);
				layer.paint.fromObject(e);
			});
		}
	}, {
		key: "fromObjectToSingleLayer",
		value: function fromObjectToSingleLayer(title, content) {
			var layer = Scene.getLayer(title);
			each(content, function (e) {
				layer.paint.fromObject(e, true);
			});
		}
	}, {
		key: "toObject",
		value: function toObject() {
			var result = {};

			each(Scene.layers, function (e) {
				return result[e.title] = e.paint.toObject();
			});
			return result;
		}
	}, {
		key: "addPath",
		value: function addPath(layer, path) {
			Scene.getLayer(layer).paint.addLine(path);
		}
	}, {
		key: "breakLine",
		value: function breakLine() {
			var activeLayerName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Layers.activeLayerName;

			this._paintHistory.push(activeLayerName);
			this._undoHistory = [];
			var newPath = Scene.getLayer(activeLayerName).paint.breakLine();
			Events.paintBreakLine(activeLayerName);


			this._setButtons();
		}
	}, {
		key: "addBrush",
		value: function addBrush(title) {
			var img = new Image();
			img.src = FOLDER_IMAGE + "/" + title;
			this._brushes[title] = img;

			if (isNull(this._selectedImage)) this.selectedImage = title;

			Logger.log("pridal sa nový štetec: " + title, LOGGER_PAINT_ACTION);
		}
	}, {
		key: "rePaintImage",
		value: function rePaintImage(size, col) {
			var c = document.createElement('canvas'),
			    ctx,
			    imgData,
			    data,
			    color,
			    i;
			c.width = size;
			c.height = size;
			ctx = c.getContext('2d');
			ctx.drawImage(this._selectedImage, 0, 0, size, size);
			imgData = ctx.getImageData(0, 0, size, size);
			data = imgData.data;
			color = col.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(", ").map(function (a) {
				return parseInt(a);
			});
			for (i = 3; i < data.length; i += 4) {
				if (data[i] == 0) continue;
				data[i - 3] = color[0];
				data[i - 2] = color[1];
				data[i - 1] = color[2];
			}
			ctx.putImageData(imgData, 0, 0);
			this._selectedBrush = c;

			Events.paintBrushChange(size, col, this._selectedImageName);
		}
	}, {
		key: "drawLine",
		value: function drawLine(ctx, pointA, pointB, brushSize, brushColor, action, brushType) {
			if (action == PAINT_ACTION_LINE) {
				ctx.lineCap = LINE_CAP_ROUND;
				ctx.lineWidth = brushSize;
				ctx.strokeStyle = brushColor;
				ctx.beginPath();
				ctx.moveTo(pointA.x, pointA.y);
				ctx.lineTo(pointB.x, pointB.y);
				ctx.stroke();
			} else if (action == PAINT_ACTION_BRUSH) {
				var dist = pointA.dist(pointB),
				    angle = Math.atan2(pointA.x - pointB.x, pointA.y - pointB.y);

				Creator.setOpt("brushColor", brushColor);
				Creator.setOpt("brushSize", brushSize);
				Creator.setOpt("brushType", brushType);

				for (var i = 0; i < dist; i++) {
					ctx.drawImage(Paints.selectedBrush, pointB.x + Math.sin(angle) * i - (brushSize >> 1), pointB.y + Math.cos(angle) * i - (brushSize >> 1), brushSize, brushSize);
				}
			}
		}
	}, {
		key: "undo",
		value: function undo() {
			if (this._paintHistory.length === 0) return false;
			var layer = this._paintHistory.pop();

			Scene.getLayer(layer).paint.undo();
			this._undoHistory.push(layer);

			Events.paintUndo(layer);
			console.log(this._paintHistory.length, this._undoHistory.length);
			this._setButtons();
			draw();
		}
	}, {
		key: "redo",
		value: function redo() {
			if (this._undoHistory.length === 0) return false;

			var layer = this._undoHistory.pop();
			Scene.getLayer(layer).paint.redo();
			this._paintHistory.push(layer);

			Events.paintRedo(layer);
			this._setButtons();
			draw();
		}
	}, {
		key: "_setButtons",
		value: function _setButtons() {
			Menu.disabled("mainMenu", "undo", this._paintHistory.length === 0);
			Menu.disabled("mainMenu", "redo", this._undoHistory.length === 0);
		}
	}, {
		key: "getBrush",
		value: function getBrush(title) {
			return this._brushes[title];
		}
	}, {
		key: "selectedImage",
		get: function get() {
			return this._selectedImage;
		},
		set: function set(title) {
			this._selectedImage = this._brushes[title];
			this._selectedImageName = title;
			Menu._redraw();
		}
	}, {
		key: "selectedBrush",
		get: function get() {
			return this._selectedBrush;
		}
	}, {
		key: "action",
		get: function get() {
			return this._action;
		},
		set: function set(val) {
			this._action = val;
		}
	}], [{
		key: "getId",
		value: function getId() {
			if (!PaintManager._idCounter) PaintManager._idCounter = 1;

			return PaintManager._idCounter++;
		}
	}]);

	return PaintManager;
}();

var ListenersManager = function () {
	function ListenersManager() {
		_classCallCheck(this, ListenersManager);

		this._movedObject = null;
		this._clickedOnObject = false;
	}

	_createClass(ListenersManager, [{
		key: "mouseDown",
		value: function mouseDown(position, button) {
			var _this30 = this;

			this._clickedOnObject = false;

			if ($(canvas).hasClass("blur")) {
				closeDialog();
				this._clickedOnObject = true;
				return false;
			}

			if (isDefined(timeLine) && timeLine.clickIn(position.x, position.y)) {
				this._movedObject = timeLine;
				this._clickedOnObject = true;
				return false;
			}

			if (!this._clickedOnObject && !actContextMenu && Creator.operation == OPERATION_AREA && area) {
				if (area.isReady && area.clickIn(position.x, position.y)) {
					selectedObjects.movedObject = area;
					area.moving = true;
					this._movedObject = selectedObjects;
				} else {
					area.startCreate(position);
				}
				this._clickedOnObject = true;
			}

			if (SelectedText) {
				var textArea = new G("#selectedEditor");
				if (!textArea.isEmpty()) {
					console.log("res: " + parseInt(window.getComputedStyle(textArea).fontSize, 10));
					SelectedText.text = textArea.text();
					textArea.delete();
				}
			}

			if (!Creator.clickIn(position.x, position.y, false) && (Menu.isToolActive() || Creator.controllPress) && !Creator.object) {
				Creator.createObject(position);
				this._movedObject = Creator;
				this._clickedOnObject = true;
				return false;
			}

			if (!this._clickedOnObject && button == LEFT_BUTTON && !actContextMenu) {
				Scene.forEach(function (o) {
					if (o.visible && !o.layer.userLayer && o.clickIn(position.x, position.y, button)) {
						if (Creator.operation === OPERATION_DRAW_LINE && Input.isKeyDown(L_CTRL_KEY) && o.selectedConnector) {
							Creator.createObject(position, o);
							_this30._movedObject = Creator;
						} else {
							o.moving = true;
							selectedObjects.movedObject = o;
							_this30._movedObject = selectedObjects;
						}
						_this30._clickedOnObject = true;
						return true;
					}
				});
			}
			draw();
		}
	}, {
		key: "hashChange",
		value: function hashChange() {
			setUpComponents();

			if (MenuManager.dataBackup) {
				Menu.init(JSON.parse(MenuManager.dataBackup));
			}

			if (Layers) {
				Entity.setAttr(Layers, "visible", Components.layers());
			}

			Gui.showOptionsByComponents();
			draw();
		}
	}, {
		key: "keyDown",
		value: function keyDown(key, isCtrlDown) {
			if (DELETE_KEY === key) {
				if (area.isReady) {
					area.removeSelected(isCtrlDown);
				}
			}
			draw();
		}
	}, {
		key: "keyUp",
		value: function keyUp(key, isCtrlDown) {
			if (isCtrlDown) {
				switch (key) {
					case Z_KEY:
						Paints.undo();
						break;
					case Y_KEY:
						Paints.redo();
						break;
					case A_KEY:
						selectedObjects.selectAll();
						draw();
						break;
				}
			} else {
				switch (key) {
					case DELETE_KEY:
						selectedObjects.deleteAll();
						draw();
						break;
					case ESCAPE_KEY:
						closeDialog();
						break;
					case KEY_NUM_1:
						Creator.operation = OPERATION_DRAW_PATH;
						draw();
						break;
					case KEY_NUM_2:
						Creator.operation = OPERATION_DRAW_RECT;
						draw();
						break;
					case KEY_NUM_3:
						Creator.operation = OPERATION_DRAW_LINE;
						draw();
						break;
					case KEY_NUM_4:
						Creator.operation = OPERATION_DRAW_ARC;
						draw();
						break;
					case KEY_NUM_5:
						Creator.operation = OPERATION_DRAW_IMAGE;
						draw();
						break;
				}
			}
		}
	}, {
		key: "mousePress",
		value: function mousePress(position) {
			if (Menu.pressIn(position.x, position.y)) {
				draw();
				return true;
			}

			Paints.breakLine();

			actContextMenu = new ContextMenuManager(position);

			if (selectedObjects.movedObject) {
				selectedObjects.movedObject.moving = false;
				selectedObjects.movedObject = false;
				this._movedObject = null;
			}

			draw();
			return false;
		}
	}, {
		key: "mouseDoubleClick",
		value: function mouseDoubleClick(position) {
			var result = false,
			    vec = new GVector2f(100, 40);

			Scene.forEach(function (e) {
				if (!result && isDefined(e.doubleClickIn) && e.doubleClickIn(position.x, position.y)) result = e;
			});

			if (!result) {
				getText("", position, vec, function (val) {
					return val.length && Scene.addToScene(new TextField(val, position, vec));
				});
			}

			draw();
			return true;
		}
	}, {
		key: "mouseUp",
		value: function mouseUp(position) {
			var possibleChild = null;
			if (selectedObjects.size() === 1) possibleChild = selectedObjects.firstObject;

			this._movedObject = null;

			var result = false;

			if (Creator.operation === OPERATION_RUBBER) {
				Paints.removeSelectedPaths();
			}

			if (Creator.operation == OPERATION_AREA && area) {
				if (area.isCreating) {
					area.endCreate(position);
				} else if (area.moving) {
					area.moving = false;
				}
			}

			if (actContextMenu) {
				if (!actContextMenu.clickIn(position.x, position.y)) {
					actContextMenu = false;
				} else {
					return false;
				}
			}

			if (Creator.object && Creator.object.name != OBJECT_LINE) {
				Creator.finishCreating(position);
				return false;
			}

			if (Creator.operation == OPERATION_DRAW_PATH && Components.draw()) {
				Paints.addPoint(position);
				Paints.breakLine();
			}

			if (Menu.clickIn(position.x, position.y)) {
				return;
			}

			if (Creator.clickIn(position.x, position.y)) {
				return;
			}

			closeDialog();

			var clickOnParent = false;
			var clickOnConnectorObject = null;
			Scene.forEach(function (o) {
				if (!result && o.clickIn(position.x, position.y)) {
					if (possibleChild) {
						if (possibleChild.parent === o) {
							clickOnParent = true;
						} else if (possibleChild !== o) {}
					}
					if (o.selectedConnector) {
						clickOnConnectorObject = o;
					}
					if (Creator.object) {
						if (o.selectedConnector) {
							console.log("teraz");
							Creator.object.targetB = o;
						}

						result = true;
						return;
					} else {
						Input.isKeyDown(L_CTRL_KEY) ? selectedObjects.add(o) : selectedObjects.clearAndAdd(o);
					}
					result = true;
				}
			});

			if (selectedObjects.movedObject) {
				if (clickOnConnectorObject && selectedObjects.movedObject.name === OBJECT_LINE) {
					selectedObjects.movedObject.setTarget(clickOnConnectorObject);
					console.log("teraz");
				}
				selectedObjects.movedObject.moving = false;
				selectedObjects.movedObject = false;
				this._movedObject = null;
			}

			if (possibleChild && !clickOnParent) {
				possibleChild.removeParent();
			}
			if (Creator.object) {
				Creator.finishCreating();
			}

			result || selectedObjects.clear();
		}
	}, {
		key: "mouseMove",
		value: function mouseMove(position, movX, movY) {
			if (Options.changeCursor) {
				var isHoverTrue = Menu.hover(position.x, position.y);

				if (!isHoverTrue && Creator.operation === OPERATION_AREA) {
					isHoverTrue = area.hover(position.x, position.y);
				}

				if (!isHoverTrue) {
					Scene.forEach(function (e) {
						if (isHoverTrue) {
							return;
						}
						isHoverTrue = e.hover(position.x, position.y);
					});
				}
			}

			if (Creator.operation == OPERATION_AREA && area && area.isCreating) {
				area.addPoint(position);
				this._clickedOnObject = true;
				return false;
			}

			if (Creator.operation === OPERATION_RUBBER && Input.isButtonDown(LEFT_BUTTON)) {
				Paints.drawLine(context, position, { x: position.x - movX, y: position.y - movY }, Creator.brushSize, "grey", PAINT_ACTION_LINE);
				Paints.findPathsForRemove(position, 1);
				Project.scene.findObjectsForRemove(position.x, position.y, 1);
				this._clickedOnObject = true;
				return false;
			}

			if (this._movedObject && isFunction(this._movedObject.onMouseMove)) {
				this._movedObject.onMouseMove(position, movX, movY);
				draw();
				this._clickedOnObject = true;
				return false;
			}

			if (Input.isButtonDown(LEFT_BUTTON) && Creator.operation == OPERATION_DRAW_PATH && Components.draw()) {
				var radius = 1;
				Paints.addPoint(radius === 1 ? position : position.div(radius).round().mul(radius));
				draw();
				this._clickedOnObject = true;
				return false;
			}
		}
	}]);

	return ListenersManager;
}();

"use strict";

var initTime = Date.now(),
    movedObject = false,
    Logger = new LogManager(),
    Project = new ProjectManager("Gabriel Csollei"),
    Scene = Project.scene,
    Creator = Project.creator,
    Input = Project.input,
    selectedObjects = Project.scene.objectManager,
    Menu = Project.topMenu,
    actContextMenu = false,
    Listeners = new ListenersManager(),
    Content = new ContentManager(),
    Files = new FileManager(),
    Paints = new PaintManager(),
    Task = null,
    Events = (typeof EventManager === "undefined" ? "undefined" : _typeof(EventManager)) !== KEYWORD_UNDEFINED ? new EventManager() : null,
    SelectedText = null,
    Gui = Project.gui,
    Options = Project.options,
    drawEvent = new EventTimer(realDraw, 1000 / FPS),
    area = null,
    Panel = null,
    Forms = null,
    Connection = Project.connection,
    draw = function draw() {
	return drawEvent.callIfCan();
},
    components,
    drawMousePos,
    Layers,
    canvas,
    context,
    chatViewer,
    timeLine;

function setUpComponents() {
	components = {
		draw: window.location.hash.indexOf(COMPONENT_DRAW) >= 0 || typeof Watcher !== "undefined",
		share: window.location.hash.indexOf(COMPONENT_SHARE) >= 0 || typeof Watcher !== "undefined",
		watch: window.location.hash.indexOf(COMPONENT_WATCH) >= 0 || typeof Watcher !== "undefined",
		tools: window.location.hash.indexOf(COMPONENT_TOOLS) >= 0 || typeof Watcher !== "undefined",
		save: window.location.hash.indexOf(COMPONENT_SAVE) >= 0 || typeof Watcher !== "undefined",
		load: window.location.hash.indexOf(COMPONENT_LOAD) >= 0 || typeof Watcher !== "undefined",
		screen: window.location.hash.indexOf(COMPONENT_SCREEN) >= 0 || typeof Watcher !== "undefined",
		content: window.location.hash.indexOf(COMPONENT_CONTENT) >= 0 || typeof Watcher !== "undefined",
		edit: window.location.hash.indexOf(COMPONENT_EDIT) >= 0 || typeof Watcher !== "undefined",
		layers: window.location.hash.indexOf(COMPONENT_LAYERS) >= 0 || typeof Watcher !== "undefined",
		task: window.location.hash.indexOf(COMPONENT_TASK) >= 0 || typeof Watcher !== "undefined"
	};
}

var Components = {
	draw: function draw() {
		return isDefined(components) && isDefined(components["draw"]) && components["draw"] === true;
	},
	share: function share() {
		return isDefined(components) && isDefined(components["share"]) && components["share"] === true;
	},
	watch: function watch() {
		return isDefined(components) && isDefined(components["watch"]) && components["watch"] === true;
	},
	tools: function tools() {
		return isDefined(components) && isDefined(components["tools"]) && components["tools"] === true;
	},
	save: function save() {
		return isDefined(components) && isDefined(components["save"]) && components["save"] === true;
	},
	load: function load() {
		return isDefined(components) && isDefined(components["load"]) && components["load"] === true;
	},
	screen: function screen() {
		return isDefined(components) && isDefined(components["screen"]) && components["screen"] === true;
	},
	content: function content() {
		return isDefined(components) && isDefined(components["content"]) && components["content"] === true;
	},
	layers: function layers() {
		return isDefined(components) && isDefined(components["layers"]) && components["layers"] === true;
	},
	task: function task() {
		return isDefined(components) && isDefined(components["task"]) && components["task"] === true;
	},
	edit: function edit() {
		return isDefined(components) && isDefined(components["edit"]) && components["edit"] === true;
	}
};

function sendMessage(message) {
	if (typeof Watcher !== "undefined") {
		Watcher.sendMessage(message, Project.autor);
	}

	if (typeof Sharer !== "undefined" && Sharer.isSharing) {
		Sharer.sendMessage(message, Project.autor);
	}

	Panel.recieveMessage(message, Project.autor);
}

function ajax(url, options, dataType) {
	if (isFunction(options)) {
		options = { success: options };
		if (isString(dataType)) {
			options["dataType"] = dataType;
		}
	} else if (!isObject(options)) {
		options = {};
	}

	options["method"] = options["method"] || "GET";
	options["async"] = options["async"] || true;

	var start = 0;
	var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

	if (isFunction(options["abort"])) {
		xhttp.onabort = options["abort"];
	}
	if (isFunction(options["error"])) {
		xhttp.onerror = options["error"];
	}
	if (isFunction(options["progress"])) {
		xhttp.onprogress = options["progress"];
	}
	if (isFunction(options["timeout"])) {
		xhttp.ontimeout = options["timeout"];
	}
	if (isFunction(options["loadEnd"])) {
		xhttp.onloadend = function () {
			return options["loadEnd"](Date.now() - start);
		};
	}
	if (isFunction(options["loadStart"])) {
		xhttp.onloadstart = function () {
			options["loadStart"]();
			start = Date.now();
		};
	}
	if (isFunction(options["success"])) {
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200 && isFunction(options["success"])) {
				switch (options["dataType"]) {
					case "json":
						options["success"](JSON.parse(xhttp.responseText));
						break;
					case "html":
						options["success"](new DOMParser().parseFromString(xhttp.responseText, FORMAT_FILE_XML));
						break;
					case "xml":
						options["success"](new DOMParser().parseFromString(xhttp.responseText, FORMAT_FILE_XML));
						break;
					default:
						options["success"](xhttp.responseText);
				}
			}
		};
	}

	xhttp.open(options["method"], url, options["async"]);
	xhttp.send();
}
ajax(FOLDER_JSON + "/context.json", function (data) {
	return ContextMenuManager.items = data;
}, "json");

$.getJSON(FOLDER_JSON + "/attributes.json", function (data) {
	return Entity.attr = data;
});

function init() {
	Project.scene.addToScene(new Rect(new GVector2f(800, 50), new GVector2f(100, 100), "#ff0000"));

	Project.scene.addToScene(new Line([new GVector2f(10, 400), new GVector2f(300, 450)], 5, "#66CCCC"));

	Project.scene.addToScene(new Arc(new GVector2f(600, 300), new GVector2f(50, 50), "#66CCCC"));

	Project.scene.addToScene(new Rect(new GVector2f(800, 50), new GVector2f(100, 100), "#ff0000"));
	Project.scene.addToScene(new Rect(new GVector2f(250, 250), new GVector2f(100, 100), "#00ff00"));

	Project.scene.addToScene(new Polygon([new GVector2f(1200, 100), new GVector2f(1150, 150), new GVector2f(1250, 150)], "#ff69b4"));
	Project.scene.addToScene(new Table(new GVector2f(800, 250), new GVector2f(200, 800), [["meno", "vek"], ["gabo", 21], ["maros", 35]]), "test2");

	loadImage(function (e) {
		return Project.scene.addToScene(new ImageObject(new GVector2f(300, 400), new GVector2f(300, 400), e));
	});

	var methods = {
		getArea: {
			name: "getArea",
			retType: "number",
			access: ACCESS_PUBLIC,
			args: "void"
		},
		getPosition: {
			name: "getPosition",
			retType: "GVector2f",
			access: ACCESS_PROTECTED,
			args: "void"
		}
	};

	var attrs = {
		x: {
			name: "x",
			access: ACCESS_PROTECTED,
			type: "number"
		},
		y: {
			name: "y",
			access: ACCESS_PROTECTED,
			type: "number"
		},
		width: {
			name: "width",
			access: ACCESS_PROTECTED,
			type: "number"
		},
		height: {
			name: "height",
			access: ACCESS_PROTECTED,
			type: "number"
		}
	};
	Project.scene.addToScene(new Class(new GVector2f(500, 150), new GVector2f(250, 250), "Rectange", attrs, methods));

	draw();
}

function setVisibilityData(data) {
	Project.topMenu.visible = data.showTopMenu;
}

ajax(FOLDER_JSON + "/forms.json", function (data) {
	Forms = new FormManager(data);
	var formList = {
		shareForm: "sharingForm",
		optionsForm: "optionsForm",
		watchForm: "watchForm",
		saveXmlForm: "saveXmlForm",
		saveForm: "saveImgForm"
	};
	each(formList, function (e, i) {
		var form = document.getElementById(i);
		if (form) form.appendChild(Forms.createForm(e));
	});

	Project.options.init();
}, "json");

$.ajax({
	dataType: "json",
	url: "/js/json/config_user.json",

	success: function success(data) {
		console.log("constants: ", setConstants(data.environmentOptions));
		setVisibilityData(data.visibilityOptions);
	}
});

var loading = function loading() {
	Listeners.hashChange();
	area = new Area();
	Project.initCanvas();

	canvas = Project.canvas;
	context = Project.context;

	Project._connection = new ConnectionManager();

	$.getJSON(FOLDER_JSON + "/menu.json", function (data) {
		Project.topMenu.init(data);
		$.getJSON(FOLDER_JSON + "/creator.json", function (data2) {
			Creator.init(data2);
			Paints.rePaintImage(Creator.brushSize, Creator.brushColor);
			draw();
		});
	});
	Panel = new PanelManager();

	Project.scene.createLayer();
	Project.scene.createLayer("rightMenu", "gui");
	Project.scene.createLayer("test2");

	Project.context.shadowColor = DEFAULT_SHADOW_COLOR;
	Project.input.initListeners(Project.canvas);

	if (typeof Sharer !== "undefined") {
		chatViewer = new ChatViewer(Project.title + "'s chat", Project.autor, sendMessage);
	}

	Layers = new LayersViewer(G.byId("layerViewerPlaceholder"));
	Project.scene.addToScene(Layers, "rightMenu");
	var xOffset = Project.topMenu.position.x + (Project.topMenu.size.x + MENU_OFFSET) * Project.topMenu.visibleElements - MENU_OFFSET;
	Creator.view = new CreatorViewer(new GVector2f(Project.topMenu.visible ? xOffset : MENU_OFFSET, Project.topMenu.position.y - MENU_OFFSET));

	console.log("stranka sa nacítala za: ", Date.now() - initTime + " ms");
	console.log("to by malo byť: " + Date.now() + " ms");

	draw();
};

$(loading);

function realDraw() {
	if ((typeof Watcher === "undefined" ? "undefined" : _typeof(Watcher)) !== KEYWORD_UNDEFINED && !Watcher.connected || !Project.context || !isObject(Project.context)) {
		return;
	}
	Project.increaseDrawCounter();
	drawMousePos = new Date().getMilliseconds();
	CanvasHandler.clearCanvas(Project.context);
	if (Project.options.grid) {
		drawGrid();
	}

	if (Creator.operation == OPERATION_AREA && area) {
		area.draw();
	}

	Project.scene.draw();
	Creator.draw();
	Project.topMenu.draw();
	if (actContextMenu) {
		actContextMenu.draw();
	}
	Logger.log("kreslí sa všetko", LOGGER_DRAW);
	if ((typeof timeLine === "undefined" ? "undefined" : _typeof(timeLine)) !== KEYWORD_UNDEFINED && timeLine) {
		timeLine.draw();
	}

	Project.context.font = "30px Comic Sans MS";
	Project.context.fillStyle = "red";
	Project.context.fillText("draw(ms): " + (new Date().getMilliseconds() - drawMousePos), window.innerWidth - 100, 15);
}

var Entity = function () {
	function Entity(name) {
		var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new GVector2f();
		var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new GVector2f();
		var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, Entity);

		this._position = position;
		this._size = size;
		this._name = name;

		this._drawCounter = -1;
		this._selected = false;
		this._visible = true;
		this._moving = false;
		this._locked = false;
		this._minSize = false;
		this._selectedConnector = false;

		this._layer = "default";

		this._parent = null;
		this._childrens = [];

		Entity.changeAttr(this, data);

		if (isUndefined(this._connectors)) this._connectors = [new GVector2f(0.5, 0), new GVector2f(0.5, 1), new GVector2f(0, 0.5), new GVector2f(1, 0.5)];

		if (isUndefined(this._id)) this._id = Project.generateId();

		if (isUndefined(this._borderWidth)) this._borderWidth = Creator.borderWidth;

		if (isUndefined(this._radius)) this._radius = Creator.radius;

		if (isUndefined(this._fillColor)) this._fillColor = Creator.color;

		if (isUndefined(this._borderColor)) this._borderColor = Creator.borderColor;
	}

	_createClass(Entity, [{
		key: "isIn",
		value: function isIn(x, y) {
			var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			return x + radius > this._position.x && x - radius < this._position.x + this._size.x && y + radius > this._position.y && y - radius < this._position.y + this._size.y;
		}
	}, {
		key: "removeChildren",
		value: function removeChildren(element) {
			var index = this._childrens.indexOf(element);
			if (index >= 0) {
				this._childrens.splice(index, 1);
				element._parent = null;
			}
			return element;
		}
	}, {
		key: "removeParent",
		value: function removeParent() {
			if (this._parent) this._parent.removeChildren(this);

			return this;
		}
	}, {
		key: "addChildren",
		value: function addChildren(element) {
			if (element._parent !== this && this._parent !== element) {
				var index = this._childrens.indexOf(element);
				if (index < 0) {
					this._childrens.push(element);
					element._parent = this;
				}
			}
			return element;
		}
	}, {
		key: "eachChildren",
		value: function eachChildren(func) {
			each(this._childrens, function (e) {
				func(e);
			});
		}
	}, {
		key: "addConnector",
		value: function addConnector() {
			var _this31 = this;

			objectToArray(arguments).forEach(function (e) {
				return _this31._connectors.push(e);
			}, this);
		}
	}, {
		key: "clickInBoundingBox",
		value: function clickInBoundingBox(x, y) {
			var obj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

			return x + SELECTOR_SIZE > obj._position.x && x - SELECTOR_SIZE < obj._position.x + obj._size.x && y + SELECTOR_SIZE > obj._position.y && y - SELECTOR_SIZE < obj._position.y + obj._size.y;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {

			if (!this.clickInBoundingBox(x, y)) return false;
			return this._clickIn(x, y);
		}
	}, {
		key: "_clickIn",
		value: function _clickIn(x, y) {
			return false;
		}
	}, {
		key: "hover",
		value: function hover(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;
			return this._hover(x, y);
		}
	}, {
		key: "_hover",
		value: function _hover(x, y) {
			return false;
		}
	}, {
		key: "pressIn",
		value: function pressIn(x, y) {
			return false;
		}
	}, {
		key: "cleanUp",
		value: function cleanUp() {}
	}, {
		key: "_draw",
		value: function _draw() {}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			if (this._drawCounter === Project.drawCounter) return;
			this._drawCounter = Project.drawCounter;

			if (!this.visible) return;

			this._draw(ctx);

			for (var e in this._childrens) {
				this._childrens[e].draw(ctx);
			}
		}
	}, {
		key: "checkConnectors",
		value: function checkConnectors(vec) {
			var _this32 = this;

			this._selectedConnector = false;

			each(this._connectors, function (e, i) {
				if (_this32._selectedConnector) return;
				var d = e.getClone().mul(_this32.size);
				if (vec.dist(_this32.position.x + d.x, _this32.position.y + d.y) < SELECTOR_SIZE) {
					_this32._selectedConnector = i;
				}
			});
		}
	}, {
		key: "getConnectorPosition",
		value: function getConnectorPosition(i) {
			var conn = this._connectors[i];
			if (conn) {
				return this._position.getClone().add(this._size.getClone().mul(conn));
			}
		}
	}, {
		key: "parent",
		get: function get() {
			return this._parent;
		}
	}, {
		key: "selectedConnector",
		get: function get() {
			return this._selectedConnector;
		},
		set: function set(val) {
			this._selectedConnector = val;
		}
	}, {
		key: "id",
		get: function get() {
			return this._id;
		}
	}, {
		key: "name",
		get: function get() {
			return this._name;
		}
	}, {
		key: "size",
		get: function get() {
			return this._size;
		}
	}, {
		key: "layer",
		get: function get() {
			return this._layer;
		},
		set: function set(val) {
			this._layer = val;
		}
	}, {
		key: "radius",
		get: function get() {
			return this._radius;
		}
	}, {
		key: "locked",
		get: function get() {
			return this._locked;
		},
		set: function set(val) {
			this._locked = val;
		}
	}, {
		key: "minSize",
		get: function get() {
			return this._minSize;
		},
		set: function set(val) {
			this._minSize = val;
		}
	}, {
		key: "visible",
		get: function get() {
			return this._visible;
		}
	}, {
		key: "selected",
		get: function get() {
			return this._selected;
		},
		set: function set(val) {
			this._selected = val;
		}
	}, {
		key: "position",
		get: function get() {
			return this._position;
		}
	}, {
		key: "fillColor",
		get: function get() {
			return this._fillColor;
		}
	}, {
		key: "borderWidth",
		get: function get() {
			return this._borderWidth;
		}
	}, {
		key: "borderColor",
		get: function get() {
			return this._borderColor;
		}
	}], [{
		key: "getId",
		value: function getId() {
			if (isUndefined(Entity._actId)) Entity._actId = 0;
			return Entity._actId++;
		}
	}, {
		key: "setAttr",
		value: function setAttr(obj, attr, val) {
			if (isUndefined(Entity["attr"]) || isDefined(Entity["attr"]["Entity"][attr]) || isDefined(Entity["attr"][obj.name][attr])) obj["_" + attr] = val;else Logger.error("k objektu " + obj.name + " sa snaží priradiť neplatný atribút: " + attr);

			Events.objectChange(obj, attr, val);
			return obj;
		}
	}, {
		key: "changeAttr",
		value: function changeAttr(obj, data, val) {
			if (isObject(data)) each(data, function (e, i) {
				return Entity.setAttr(obj, i, e);
			});else Entity.setAttr(obj, data, val);
			return obj;
		}
	}, {
		key: "findMinAndMax",
		value: function findMinAndMax(points, position, size) {
			position.set(points[0]);
			size.set(points[0]);
			points.forEach(function (e, i) {
				if (i) {
					position.x = Math.min(points[i].x, position.x);
					position.y = Math.min(points[i].y, position.y);
					size.x = Math.max(points[i].x, size.x);
					size.y = Math.max(points[i].y, size.y);
				}
			});

			size.sub(position);
		}
	}, {
		key: "drawConnectors",
		value: function drawConnectors(obj, ctx) {
			if (Creator.operation != OPERATION_DRAW_JOIN && (Creator.operation != OPERATION_DRAW_LINE || !Input.isKeyDown(L_CTRL_KEY))) {
				return;
			}

			obj._connectors.forEach(function (e) {
				return drawConnector(e, obj, ctx);
			});
		}
	}, {
		key: "animateMove",
		value: function animateMove(obj, targetPos) {
			var fps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : FPS;

			var vec = targetPos.getClone().sub(obj.position).div(fps),
			    counter = 0,
			    int = setInterval(function () {
				obj.position.add(vec);
				draw();
				if (++counter == fps) {
					clearInterval(int);
					obj.position.set(targetPos);
				}
			}, 1000 / fps);
		}
	}, {
		key: "setMoveType",
		value: function setMoveType(obj, vec) {
			if (vec.dist(obj.position.x + (obj.size.x >> 1), obj.position.y) < SELECTOR_SIZE) obj.moveType = 0;else if (vec.dist(obj.position.x + obj.size.x, obj.position.y + (obj.size.y >> 1)) < SELECTOR_SIZE) obj.moveType = 1;else if (vec.dist(obj.position.x + (obj.size.x >> 1), obj.position.y + obj.size.y) < SELECTOR_SIZE) obj.moveType = 2;else if (vec.dist(obj.position.x, obj.position.y + (obj.size.y >> 1)) < SELECTOR_SIZE) obj.moveType = 3;else if (vec.dist(obj.position.x + obj.size.x, obj.position.y + obj.size.y) < SELECTOR_SIZE) obj.moveType = 5;else if (vec.x > obj.position.x && vec.y > obj.position.y && vec.x < obj.position.x + obj.size.x && vec.y < obj.position.y + obj.size.y) obj.moveType = 4;
		}
	}, {
		key: "createInstance",
		value: function createInstance(obj) {
			var type = isString(obj) ? obj : obj._name;
			switch (type) {
				case OBJECT_RECT:
					return new Rect();
				case OBJECT_ARC:
					return new Arc();
				case OBJECT_TABLE:
					return new Table();
				case OBJECT_TEXT:
					return new TextField("");
				case OBJECT_POLYGON:
					return new Polygon([0, 0, 0]);
				case OBJECT_LINE:
					return new Line([0, 0, 0]);
				case OBJECT_CLASS:
					return new Class();
				default:
					Logger.error("snažíš sa vložiť objekt s neznámym menom: " + obj._name);
					return null;
			}
		}
	}, {
		key: "create",
		value: function create(obj) {
			var generateId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			if (isString(obj)) obj = JSON.parse(obj);

			var result = Entity.createInstance(obj);

			if (result) {
				each(obj, function (e, i) {
					if (e && isDefined(e["_x"]) && _typeof(isDefined(e["_y"]))) result[i] = new GVector2f(e._x, e._y);else if (i == "data") result[i] = e.map(function (ee) {
						return ee.map(function (eee) {
							return eee;
						});
					});else if (i == "points") result[i] = e.map(function (ee) {
						return new GVector2f(ee._x, ee._y);
					});else if (i == "_id" && generateId) result[i] = Project.generateId();else result[i] = e;
				});
				Logger.notif("objekt bol úspešne vytvorený");
				Logger.log("Vytvoril sa objekt " + (result.name || "Neznámy"), LOGGER_OBJECT_CREATED);
			}
			return result;
		}
	}]);

	return Entity;
}();

function testAnimation() {
	var obj = [];
	for (var i = 0; i < 100; i++) {
		obj.push(new Rect(new GVector2f(Math.random() * canvas.width, Math.random() * canvas.height), new GVector2f(50, 50), "blue"));
		Scene.addToScene(obj[obj.length - 1]);
		Entity.animateMove(obj[obj.length - 1], new GVector2f(300, 300));
	}
}

var CreatorViewer = function (_Entity) {
	_inherits(CreatorViewer, _Entity);

	function CreatorViewer() {
		var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new GVector2f(100, 100);
		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new GVector2f(400, 40);
		var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, CreatorViewer);

		var _this33 = _possibleConstructorReturn(this, (CreatorViewer.__proto__ || Object.getPrototypeOf(CreatorViewer)).call(this, "CreatorViewer", position, size, data));

		_this33._items = [];
		_this33._canvas = document.createElement("canvas");
		_this33._context = _this33._canvas.getContext('2d');

		Entity.changeAttr(_this33, {
			fillColor: MENU_BACKGROUND_COLOR,
			borderColor: MENU_BORDER_COLOR,
			borderWidth: MENU_BORDER_WIDTH,
			radius: MENU_RADIUS
		});
		Logger.log("Bol vytvorený objekt " + _this33.constructor.name, LOGGER_COMPONENT_CREATE);
		return _this33;
	}

	_createClass(CreatorViewer, [{
		key: "init",
		value: function init() {
			this.size.x = (MENU_WIDTH + MENU_OFFSET) * getLength(Creator.items) + MENU_OFFSET;
			this.size.y = MENU_HEIGHT + (MENU_OFFSET << 1);

			this._canvas.width = this._size.x;
			this._canvas.height = MENU_HEIGHT << 4;
			this._context = this._canvas.getContext('2d');

			var counter = 0;
			var posY = 0;
			each(Creator.items, function (e, i, arr) {
				posY = 0;
				arr[i]["offset"] = counter;

				doRect({
					x: counter,
					y: posY,
					width: MENU_WIDTH,
					height: MENU_HEIGHT,
					radius: this._radius,
					borderColor: this._borderColor,
					fillColor: this._fillColor,
					borderWidth: this._borderWidth,
					ctx: this._context
				});

				if (isDefined(e["values"])) {
					each(e["values"], function (ee, ii) {
						if (posY > 0) {
							doRect({
								x: counter,
								y: posY,
								width: MENU_WIDTH,
								height: MENU_HEIGHT,
								radius: this._radius,
								borderColor: this._borderColor,
								fillColor: this._fillColor,
								borderWidth: this._borderWidth,
								ctx: this._context
							});
						}
						if (ee == Creator[i]) {
							arr[i]["selectedIndex"] = ii;
						}

						this._drawIcon(i, ee, counter, posY);
						posY += MENU_HEIGHT;
					}, this);
				} else if (e["type"] === "bool") {
					arr[i]["selectedIndex"] = 0;
					this._drawIcon(i, e["value"], counter, posY);
				} else if (i == ATTRIBUTE_FONT_COLOR) {
					fillText("Abc", counter + (MENU_WIDTH >> 1), posY + (MENU_HEIGHT >> 1), DEFAULT_FONT_SIZE, Creator.fontColor, 0, FONT_ALIGN_CENTER, this._context);
				} else {
					arr[i]["selectedIndex"] = 0;
					this._drawIcon(i, Creator[i], counter, posY);
				}
				counter += MENU_WIDTH;
			}, this);
			this.changeOperation();
		}
	}, {
		key: "_drawBool",
		value: function _drawBool(value, posX, posY, width, height, offset) {
			var center = posY + height >> 1;

			if (value) {
				doLine({
					points: [new GVector2f(posX + offset, center), new GVector2f(posX + offset + width / 4, center + offset * 3), new GVector2f(posX + width - offset, center - offset * 2)],
					borderWidth: MENU_BORDER_WIDTH << 2,
					borderColor: CHECKBOX_COLOR_TRUE,
					ctx: this._context
				});
			} else {
				doLine({
					points: [[new GVector2f(posX + offset, posY + offset), new GVector2f(posX + width - offset, posY + height - offset)], [new GVector2f(posX + offset, posY + height - offset), new GVector2f(posX + width - offset, posY + offset)]],
					borderWidth: MENU_BORDER_WIDTH << 2,
					borderColor: CHECKBOX_COLOR_FALSE,
					ctx: this._context
				});
			}
		}
	}, {
		key: "_drawIcon",
		value: function _drawIcon(key, value, posX, posY) {
			var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : MENU_WIDTH;
			var height = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : MENU_HEIGHT;
			var offset = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 5;

			switch (key) {
				case "allLayers":
					this._drawBool(value, posX, posY, width, height, offset);
					break;
				case "controll":
					this._drawBool(value, posX, posY, width, height, offset);
					break;
				case ATTRIBUTE_LINE_WIDTH:
					doLine({
						points: [posX + offset, posY + (height >> 1), posX + width - offset, posY + (height >> 1)],
						borderWidth: value,
						borderColor: MENU_BORDER_COLOR,
						ctx: this._context
					});
					break;
				case ATTRIBUTE_RADIUS:
					doRect({
						position: [posX + (offset << 1), posY + (offset << 1)],
						size: [width - (offset << 2), height - (offset << 2)],
						borderWidth: 5,
						borderColor: MENU_BORDER_COLOR,
						radius: value,
						ctx: this._context
					});
					break;
				case ATTRIBUTE_FILL_COLOR:
					doRect({
						position: [posX + (offset << 1), posY + (offset << 1)],
						size: [width - (offset << 2), height - (offset << 2)],
						borderWidth: 5,
						borderColor: MENU_BORDER_COLOR,
						fillColor: Creator[ATTRIBUTE_FILL_COLOR],
						ctx: this._context
					});
					break;
				case ATTRIBUTE_BRUSH_TYPE:
					if (value === "line") doArc({
						position: [posX + (offset << 1), posY + (offset << 1)],
						size: [width - (offset << 2), height - (offset << 2)],
						fillColor: MENU_BORDER_COLOR,
						ctx: this._context
					});else doRect({
						position: [posX, posY],
						size: [width, height],
						bgImage: Paints.getBrush(value),
						ctx: this._context
					});
					break;
				case ATTRIBUTE_BRUSH_COLOR:
					doArc({
						position: [posX + (offset << 1), posY + (offset << 1)],
						size: [width - (offset << 2), height - (offset << 2)],
						fillColor: Creator[ATTRIBUTE_BRUSH_COLOR],
						ctx: this._context
					});
					break;
				case ATTRIBUTE_BRUSH_SIZE:
					doArc({
						position: [posX + (width >> 1), posY + (height >> 1)],
						size: [value, value],
						center: true,
						fillColor: MENU_BORDER_COLOR,
						ctx: this._context
					});
					break;
				case ATTRIBUTE_BORDER_COLOR:
					doRect({
						position: [posX + (offset << 1), posY + (offset << 1)],
						size: [width - (offset << 2), height - (offset << 2)],
						borderWidth: 5,
						borderColor: Creator[ATTRIBUTE_BORDER_COLOR],
						ctx: this._context
					});
					break;
				case ATTRIBUTE_BORDER_WIDTH:
					doRect({
						position: [posX + (offset << 1), posY + (offset << 1)],
						size: [width - (offset << 2), height - (offset << 2)],
						borderWidth: value,
						borderColor: MENU_BORDER_COLOR,
						ctx: this._context
					});
					break;
				case ATTRIBUTE_FONT_SIZE:
					fillText("Abc", posX + (width >> 1), posY + (height >> 1), value, MENU_BACKGROUND_COLOR, 0, FONT_ALIGN_CENTER, this._context);
					break;
				default:
					fillText(key, posX + (width >> 1), posY + (height >> 1), 7, MENU_FONT_COLOR, 0, FONT_ALIGN_CENTER, this._context);
			}
		}
	}, {
		key: "_clickOn",
		value: function _clickOn(x, y) {
			if (y < this.position.y || x < this.position.x || x > this.position.x + this.size.x) return false;
			var counter = this.position.x + MENU_OFFSET,
			    click = null,
			    num;
			each(this._items, function (e, i, arr) {
				if (!click && x > counter && x < counter + MENU_WIDTH) {
					if (y < this.position.y + MENU_OFFSET + MENU_HEIGHT) {
						click = e;
					} else if (e["itemsSelected"]) {
						num = this.position.y + MENU_OFFSET;
						if (isDefined(e["item"]["values"])) {
							each(e["item"]["values"], function (ee, ii) {
								num += MENU_HEIGHT + MENU_OFFSET;
								if (!click && y > num && y < num + MENU_HEIGHT) {
									click = e;
									e["item"]["selectedIndex"] = ii;
								}
							});
						}
					}
				} else if (e["itemsSelected"]) {
					arr[i]["itemsSelected"] = false;
				}

				counter += MENU_OFFSET + MENU_WIDTH;
			}, this);
			return click;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			var doAct = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

			var inst = this,
			    e = this._clickOn(x, y);
			if (!e) {
				return false;
			}
			if (!doAct && e) {
				return true;
			}
			if (isDefined(e["item"]["values"])) {
				Creator.setOpt(e["key"], e["item"]["values"][e["item"]["selectedIndex"]]);
				e["itemsSelected"] = !e["itemsSelected"];
			} else if (e["item"]["type"] == "color") {
				pickUpColor(function (color) {
					return Creator.setOpt(e["key"], color);
				});
			} else if (e["item"]["type"] == "bool") {
				e["item"]["value"] = !e["item"]["value"];
				if (e["key"] === "controll") {
					Creator._controllPress = e["item"]["value"];
				}
				if (e["key"] === "allLayers") {
					Creator._allLayers = e["item"]["value"];
				}
				inst.init();
				draw();
			}
			return true;
		}
	}, {
		key: "changeOperation",
		value: function changeOperation() {
			this._items = [];
			each(Creator.items, function (e, i) {
				if (!CreatorViewer.allowedOption(Creator.operation, e["allowedFor"])) {
					return;
				}

				this._items.push({
					item: e,
					key: i,
					itemsSelected: false
				});
			}, this);
		}
	}, {
		key: "draw",
		value: function draw() {
			var counter = MENU_OFFSET;

			each(this._items, function (e) {
				doRect({
					bgImage: {
						x: e["item"]["offset"],
						y: e["item"]["selectedIndex"] * MENU_HEIGHT,
						w: MENU_WIDTH,
						h: MENU_HEIGHT,
						img: this._canvas
					},
					x: this.position.x + counter,
					y: this.position.y + MENU_OFFSET,
					width: MENU_WIDTH,
					height: MENU_HEIGHT,
					radius: this._radius,
					borderColor: this._borderColor,
					borderWidth: this._borderWidth
				});

				fillText(e["key"], this.position.x + counter + (MENU_WIDTH >> 1), this.position.y + MENU_OFFSET + (MENU_HEIGHT >> 1), 7, MENU_FONT_COLOR, 0, FONT_ALIGN_CENTER);

				if (e["itemsSelected"] && isDefined(e["item"]["values"])) {
					var num = this.position.y + MENU_OFFSET;

					each(e["item"]["values"], function (ee, ii) {
						num += MENU_OFFSET + MENU_WIDTH;
						doRect({
							bgImage: {
								x: e["item"]["offset"],
								y: ii * MENU_HEIGHT,
								w: MENU_WIDTH,
								h: MENU_HEIGHT,
								img: this._canvas
							},
							x: this.position.x + counter,
							y: num,
							width: MENU_WIDTH,
							height: MENU_HEIGHT,
							radius: this._radius,
							borderColor: this._borderColor,
							borderWidth: this._borderWidth
						});
					}, this);
				}

				counter += MENU_WIDTH + MENU_OFFSET;
			}, this);
		}
	}], [{
		key: "allowedOption",
		value: function allowedOption(operation, allowed) {
			switch (operation) {
				case 1000:
					return isIn(OBJECT_RECT, allowed);
				case 1001:
					return isIn(OBJECT_ARC, allowed);
				case 1002:
					return isIn(OBJECT_PAINT, allowed);
				case 1003:
					return isIn(OBJECT_LINE, allowed);
				case 1004:
					return isIn(OBJECT_JOIN, allowed);
				case 1006:
					return isIn(OBJECT_RUBBER, allowed);
				case 1007:
					return isIn(OBJECT_AREA, allowed);
			}
			return false;
		}
	}]);

	return CreatorViewer;
}(Entity);

var TextField = function (_Entity2) {
	_inherits(TextField, _Entity2);

	function TextField(text, position, size) {
		var fontColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_FONT_COLOR;

		_classCallCheck(this, TextField);

		var _this34 = _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).call(this, "Text", position, size, { fillColor: DEFAULT_BACKGROUND_COLOR, radius: DEFAULT_RADIUS }));

		_this34._text = text || "";
		_this34._textColor = fontColor;
		_this34._fontSize = DEFAULT_FONT_SIZE;
		_this34._moveType = -1;
		_this34._taskResult = false;
		_this34._hightlight = false;
		_this34.size.x = calcTextWidth(text, _this34._fontSize + "pt " + DEFAULT_FONT) + (DEFAULT_TEXT_OFFSET << 1);
		_this34.minSize = _this34.size.getClone();
		_this34._verticalTextAlign = FONT_VALIGN_TOP;
		_this34._horizontalTextAlign = FONT_HALIGN_LEFT;
		_this34._fontOffset = DEFAULT_TEXT_OFFSET;
		_this34._link = false;
		_this34.addConnector(new GVector2f(0, 0), new GVector2f(1, 0), new GVector2f(0, 1), new GVector2f(1, 1));
		return _this34;
	}

	_createClass(TextField, [{
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			var pos = this.position.getClone();

			doRect({
				shadow: this.moving && !this.locked,
				position: this.position,
				size: this.size,
				radius: this.radius,
				fillColor: this.fillColor,
				borderWidth: this._borderWidth,
				borderColor: !this._hightlight ? DEFAUL_STROKE_COLOR : this._hightlight == HIGHTLIGHT_CORRECT ? "green" : "red",
				draw: true,
				fill: true,
				ctx: ctx
			});

			ctx.textAlign = this._horizontalTextAlign;
			ctx.textBaseline = this._verticalTextAlign;
			ctx.fillStyle = this._textColor;
			ctx.font = this._fontSize + "pt " + DEFAULT_FONT;

			if (this._horizontalTextAlign == FONT_HALIGN_LEFT) pos.x += this._fontOffset;else if (this._horizontalTextAlign == FONT_HALIGN_CENTER) pos.x += this.size.x >> 1;else if (this._horizontalTextAlign == FONT_HALIGN_RIGHT) pos.x += this.size.x - this._fontOffset;

			if (this._verticalTextAlign == FONT_VALIGN_MIDDLE) pos.y += this.size.y >> 1;else if (this._verticalTextAlign == FONT_VALIGN_BOTT) pos.y += this.size.y - this._fontOffset;

			ctx.fillText(this._text, pos.x, pos.y);

			drawBorder(ctx, this);
			Entity.drawConnectors(this, ctx);
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;

			var pos = this.position,
			    vec = new GVector2f(x, y);

			this.checkConnectors(vec);
			if (this._selectedConnector) return true;

			if (vec.dist(pos.x + (this.size.x >> 1), pos.y) < SELECTOR_SIZE) this._moveType = 0;else if (vec.dist(pos.x + this.size.x, pos.y + (this.size.y >> 1)) < SELECTOR_SIZE) this._moveType = 1;else if (vec.dist(pos.x + (this.size.x >> 1), pos.y + this.size.y) < SELECTOR_SIZE) this._moveType = 2;else if (vec.dist(pos.x, pos.y + (this.size.y >> 1)) < SELECTOR_SIZE) this._moveType = 3;else if (vec.dist(pos.x + this.size.x, pos.y + this.size.y) < SELECTOR_SIZE) this._moveType = 5;else if (x > this.position.x && y > this.position.y && x < this.position.x + this.size.x && y < this.position.y + this.size.y) this._moveType = 4;
			return this._moveType >= 0;
		}
	}, {
		key: "doubleClickIn",
		value: function doubleClickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;

			getText(this._text, new GVector2f(x, y), this._size.getClone().sub(4), function (val) {
				if (val.length == 0) Scene.remove(this);
				this._text = val;
				this._size.x = calcTextWidth(val) + (DEFAULT_TEXT_OFFSET << 1);

				if (Task && this.taskResult) this._hightlight = Task.checkResult(this) ? HIGHTLIGHT_CORRECT : HIGHTLIGHT_WRONG;
			}, this);

			return true;
		}
	}, {
		key: "moveType",
		get: function get() {
			return this._moveType;
		},
		set: function set(val) {
			this._moveType = val;
		}
	}, {
		key: "text",
		get: function get() {
			return this._text;
		},
		set: function set(val) {
			this._text = val;
			this._size.x = calcTextWidth(val) + (DEFAULT_TEXT_OFFSET << 1);
		}
	}, {
		key: "taskResult",
		get: function get() {
			return this._taskResult;
		},
		set: function set(val) {
			this._taskResult = val;
		}
	}, {
		key: "verticalTextAlign",
		set: function set(val) {
			this._verticalTextAlign = val;
		}
	}, {
		key: "horizontalTextAlign",
		set: function set(val) {
			this._horizontalTextAlign = val;
		}
	}]);

	return TextField;
}(Entity);

var Table = function (_Entity3) {
	_inherits(Table, _Entity3);

	function Table(position, size) {
		var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [[]];

		_classCallCheck(this, Table);

		var _this35 = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, OBJECT_TABLE, position, size, { borderColor: shadeColor1(TABLE_HEADER_COLOR, -20), radius: TABLE_RADIUS }));

		_this35.data = data;
		_this35._headerColor = TABLE_HEADER_COLOR;
		_this35.moveType = -1;
		_this35._bodyColor = TABLE_BODY_COLOR;
		_this35._textOffset = TABLE_TEXT_OFFSET;
		_this35._columnWidth = _this35._size.x / _this35.data[0].length;
		_this35._lineHeight = TABLE_LINE_HEIGHT;

		_this35._fontSize = DEFAULT_FONT_SIZE;

		_this35.size.set(_this35._size.x, data.length * _this35._lineHeight);
		_this35._calcMaxTextWidth();
		return _this35;
	}

	_createClass(Table, [{
		key: "clear",
		value: function clear(pos, type) {
			if (type == "row") {
				var row = parseInt((pos - this._position.y) / this._lineHeight);
				this.data[row].forEach(function (e, i) {
					this.data[row][i] = "";
				}, this);
			} else if (type == "column") {
				var column = parseInt((pos - this._position.x) / this._columnWidth);
				this.data.forEach(function (e) {
					e[column] = "";
				});
			} else if (type == "table") {
				this.data.forEach(function (e) {
					e.forEach(function (ee, i) {
						e[i] = "";
					}, this);
				}, this);
			}
		}
	}, {
		key: "addRow",
		value: function addRow(y, type) {
			var row = parseInt((y - this._position.y) / this._lineHeight),
			    offset = 0;

			if (type == "below") offset++;

			var newRow = [];
			this.data[0].forEach(function () {
				newRow.push([""]);
			});
			this.data.splice(row + offset, 0, newRow);
			this._size.y = this.data.length * this._lineHeight;
			this._checkSize();
		}
	}, {
		key: "addColumn",
		value: function addColumn(x, type) {
			var column = parseInt((x - this._position.x) / this._columnWidth),
			    offset = 0;
			if (type == "right") offset++;

			this.data.forEach(function (e) {
				e.splice(column + offset, 0, [""]);
			});

			this._columnWidth = this._size.x / this.data[0].length;
			this._checkSize();
		}
	}, {
		key: "removeRow",
		value: function removeRow(y) {
			var row = parseInt((y - this._position.y) / this._lineHeight);

			if (row > 0) this.data.splice(row, 1);else Logger.error("nemožeš vymazať hlavičku tabulky");
			this._size.y = this.data.length * this._lineHeight;
			this._calcMaxTextWidth();

			if (this.data.length == 0) Scene.remove(this);
		}
	}, {
		key: "removeColumn",
		value: function removeColumn(x) {
			var column = parseInt((x - this._position.x) / this._columnWidth);

			this.data.forEach(function (e) {
				e.splice(column, 1);
			});
			this._columnWidth = this._size.x / this.data[0].length;
			this._calcMaxTextWidth();

			if (this.data[0].length == 0) Scene.remove(this);
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;

			var pos = this.position,
			    vec = new GVector2f(x, y);

			if (vec.dist(pos.x + (this.size.x >> 1), pos.y) < SELECTOR_SIZE) this.moveType = 0;else if (vec.dist(pos.x + this.size.x, pos.y + (this.size.y >> 1)) < SELECTOR_SIZE) this.moveType = 1;else if (vec.dist(pos.x + (this.size.x >> 1), pos.y + this.size.y) < SELECTOR_SIZE) this.moveType = 2;else if (vec.dist(pos.x, pos.y + (this.size.y >> 1)) < SELECTOR_SIZE) this.moveType = 3;else if (vec.dist(pos.x + this.size.x, pos.y + this.size.y) < SELECTOR_SIZE) this.moveType = 5;else if (x > this.position.x && y > this.position.y && x < this.position.x + this.size.x && y < this.position.y + this.size.y) this.moveType = 4;
			return this.moveType >= 0;
		}
	}, {
		key: "_calcMaxTextWidth",
		value: function _calcMaxTextWidth(value) {
			var w;
			context.font = this._fontSize + "pt " + DEFAULT_FONT;
			if (isString(value)) {
				w = context.measureText(value).width + (this._textOffset << 1);
				if (w > this._maxTextWidth) {
					this._maxTextWidth = w;
					return;
				}
			}
			this._maxTextWidth = 0;
			this.data.forEach(function (e) {
				e.forEach(function (ee) {
					var w = context.measureText(ee).width + (this._textOffset << 1);
					if (w > this._maxTextWidth) this._maxTextWidth = w;
				}, this);
			}, this);
		}
	}, {
		key: "_checkSize",
		value: function _checkSize() {
			if (this.size.y < this._fontSize * 2 * this.data.length) this.size.y = this._fontSize * 2 * this.data.length;

			this._lineHeight = this.size.y / this.data.length;
			this._columnWidth = Math.max(this.size.x / this.data[0].length, this._maxTextWidth);
			this.size.x = this._columnWidth * this.data[0].length;
		}
	}, {
		key: "doubleClickIn",
		value: function doubleClickIn(x, y) {
			if (!this.clickInBoundingBox(x, y) || this.locked) return false;

			var row = parseInt((y - this._position.y) / this._lineHeight),
			    column = parseInt((x - this._position.x) / this._columnWidth),
			    posY = this._position.y + row * this._lineHeight + 1,
			    posX = this._position.x + column * this._columnWidth + 1,
			    w = this._columnWidth;

			getText(this.data[row][column], new GVector2f(posX, posY), new GVector2f(w, this._lineHeight).sub(4), function (val) {
				this.data[row][column] = val;
				this._calcMaxTextWidth(val);
				this._checkSize();
			}, this);

			return true;
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			var i,
			    j,
			    posX = this._position.x,
			    posY = this._position.y,
			    points = [];

			if (this.moveType >= 0) this._checkSize();

			doRect({
				position: this._position,
				width: this._size.x,
				height: this._lineHeight,
				radius: { tr: this.radius, tl: this.radius },
				fillColor: this._headerColor,
				shadow: this.moving && !this.locked,
				ctx: ctx
			});

			doRect({
				x: this._position.x,
				y: this._position.y + this._lineHeight,
				width: this._size.x,
				height: this._lineHeight * (this.data.length - 1),
				radius: { br: this.radius, bl: this.radius },
				fillColor: this._bodyColor,
				shadow: this.moving && !this.locked,
				ctx: ctx
			});

			doRect({
				position: this._position,
				size: this._size,
				radius: this.radius,
				borderColor: this.borderColor,
				borderWidth: this.borderWidth,
				ctx: ctx
			});

			for (i = 0; i < this.data[0].length; i++) {
				if (i > 0) points.push([posX, this._position.y, posX, this._position.y + this.data.length * this._lineHeight]);
				fillText(this.data[0][i], posX + (this._columnWidth >> 1), this._position.y + (this._lineHeight >> 1), this._fontSize, DEFAULT_FONT_COLOR, 0, FONT_ALIGN_CENTER);
				posX += this._columnWidth;
			}

			for (i = 1; i < this.data.length; i++) {
				posX = this._position.x;
				posY += this._lineHeight;
				if (i > 0) points.push([this._position.x, posY, this._position.x + this._size.x, posY]);
				for (j = 0; j < this.data[i].length; j++) {
					fillText(this.data[i][j], posX + (this._columnWidth >> 1), posY + (this._lineHeight >> 1), this._fontSize, DEFAULT_FONT_COLOR, 0, FONT_ALIGN_CENTER);
					posX += this._columnWidth;
				}
			}

			doLine({
				points: points,
				borderWidth: this.borderWidth,
				borderColor: this.borderColor,
				ctx: ctx
			});

			drawBorder(ctx, this);
		}
	}]);

	return Table;
}(Entity);

var Class = function (_Table) {
	_inherits(Class, _Table);

	function Class(position, size, title) {
		var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		var methods = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
		var access = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : ACCESS_PUBLIC;

		_classCallCheck(this, Class);

		var _this36 = _possibleConstructorReturn(this, (Class.__proto__ || Object.getPrototypeOf(Class)).call(this, position, size, [[]]));

		_this36._name = OBJECT_CLASS;
		_this36._title = title;
		_this36._access = access;
		_this36._methods = methods;
		_this36._attr = attributes;
		_this36._fontSize = 15;
		_this36._lineHeight = 30;
		_this36._headerColor = "#24D330";
		_this36._bodyColor = "#CCFFCC";
		Entity.changeAttr(_this36, ATTRIBUTE_BORDER_COLOR, shadeColor1(_this36._headerColor, -20));

		_this36._makeData();

		_this36.size.set(_this36._size.x, _this36.data.length * _this36._lineHeight);
		_this36._calcMaxTextWidth();
		_this36._checkSize();
		return _this36;
	}

	_createClass(Class, [{
		key: "addMethod",
		value: function addMethod(name) {
			var returnType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "void";
			var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "void";
			var access = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ACCESS_PUBLIC;

			this._methods[name] = {
				name: name,
				retType: returnType,
				access: access,
				args: args
			};
			this._makeData();
		}
	}, {
		key: "addAttribute",
		value: function addAttribute(name, type) {
			var access = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ACCESS_PUBLIC;

			this._attr[name] = {
				name: name,
				type: type,
				access: access
			};
			this._makeData();
		}
	}, {
		key: "_makeData",
		value: function _makeData() {
			var _this37 = this;

			this.data = [[this._title]];
			each(this._attr, function (e) {
				return _this37.data.push([Class._attributeToString(e)]);
			});
			each(this._methods, function (e) {
				return _this37.data.push([Class._methodToString(e)]);
			});
		}
	}, {
		key: "getJavaSource",
		value: function getJavaSource() {
			var result = Class.toAccess(this._access) + " class " + this._title + "{\n\t";

			result += $.map(this._attr, function (e) {
				return Class.toAccess(e.access) + " " + e.type + " " + e.name + ";\n";
			}).join("\t");

			result += $.map(this._methods, function (e) {
				var args = Array.isArray(e.args) ? e.args.map(function (e) {
					return e[1] + " " + e[0];
				}).join(", ") : "",
				    subRes = "\n\t" + Class.toAccess(e.access) + " " + e.retType + " ";
				subRes += e.name + "(" + args + "){\n\t\tTODO auto generated body\n\t}\n";
				return subRes;
			}).join("\t");
			result += "}";

			return result;
		}
	}], [{
		key: "_parseAttribute",
		value: function _parseAttribute(string) {
			var tmp = string.replace(/ /g, '').split(":");
			return {
				type: tmp[1],
				access: tmp[0][0],
				name: tmp[0].slice(1, tmp[0].length)
			};
		}
	}, {
		key: "_parseMethod",
		value: function _parseMethod(string) {
			var tmp = string.replace(/ /g, '').split(")"),
			    tmp2 = tmp[0].split("("),
			    args = tmp2[1].split(",").map(function (a) {
				return a.split(":");
			});
			if (args[0][0] == "void") args = "void";
			return {
				returnType: tmp[1].replace(":", ""),
				access: tmp[0][0],
				name: tmp2[0].slice(1, tmp2[0].length),
				args: args
			};
		}
	}, {
		key: "toAccess",
		value: function toAccess(access) {
			switch (access) {
				case ACCESS_PUBLIC:
					return "public";
				case ACCESS_PRIVATE:
					return "private";
				case ACCESS_PROTECTED:
					return "protected";
				default:
					return "";
			}
		}
	}, {
		key: "_methodToString",
		value: function _methodToString(e) {
			var args = Array.isArray(e.args) ? e.args.map(function (e) {
				return e[0] + ": " + e[1];
			}).join(", ") : e.args;
			return e.access + " " + e.name + "(" + args + "): " + e.retType;
		}
	}, {
		key: "_attributeToString",
		value: function _attributeToString(e) {
			return e.access + " " + e.name + ": " + e.type;
		}
	}]);

	return Class;
}(Table);

var Polygon = function (_Entity4) {
	_inherits(Polygon, _Entity4);

	function Polygon(points, color) {
		_classCallCheck(this, Polygon);

		var _this38 = _possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, OBJECT_POLYGON, new GVector2f(), new GVector2f(), { fillColor: color }));

		_this38.points = points;
		_this38.movingPoint = -1;
		if (points.length < 3) {
			Logger.warn("vytvoril sa polygon ktory mal menej ako 3 body a tak sa maže");
			Scene.remove(_this38);
		}

		Entity.findMinAndMax(_this38.points, _this38.position, _this38.size);
		return _this38;
	}

	_createClass(Polygon, [{
		key: "doubleClickIn",
		value: function doubleClickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;

			this.points.forEach(function (e, i) {
				if (new GVector2f(x, y).dist(e) < SELECTOR_SIZE) {
					this.points.splice(i, 1);
					Entity.findMinAndMax(this.points, this.position, this.size);
				}
			}, this);

			if (this.points.length < 3) Scene.remove(this);

			return true;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;

			this.movingPoint = -1;
			var vec = new GVector2f(x, y);
			this.points.forEach(function (e, i, points) {
				if (this.movingPoint >= 0) return true;
				if (vec.dist(e) < SELECTOR_SIZE) this.movingPoint = i;else if (i < points.length && vec.dist(e.x + points[(i + 1) % points.length].x >> 1, e.y + points[(i + 1) % points.length].y >> 1) < SELECTOR_SIZE) this.movingPoint = parseFloat(i) + 0.5;
			}, this);

			if (this.movingPoint >= 0) return true;

			return Polygon.determineClick(this.points, x, y);
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			doPolygon({
				shadow: this.moving && !this.locked,
				points: this.points,
				fillColor: this.fillColor,
				borderColor: this.borderColor,
				borderWidth: this.borderWidth,
				radius: this.radius,
				ctx: ctx
			});
			if (this.selected) {
				drawBorder(ctx, this, {});
				for (var i = 0; i < this.points.length; i++) {
					var min = i - 1;
					if (i == 0) min = this.points.length - 1;
					drawSelectArc(ctx, this.points[i].x, this.points[i].y);
					drawSelectArc(ctx, this.points[i].x + this.points[min].x >> 1, this.points[i].y + this.points[min].y >> 1);
				}
			}
		}
	}], [{
		key: "determineClick",
		value: function determineClick(points, x, y) {
			for (var i = 0; i < points.length; i++) {
				var big = i + 1;
				var less = i - 1;
				if (i == 0) less = points.length - 1;
				if (i == points.length - 1) big = 0;

				var vec1 = points[i].getClone().sub(points[less]);
				var vec2 = points[big].getClone().sub(points[i]);
				var toMouse = new GVector2f(x, y).sub(points[i]);
				if (angleBetween(vec1, vec2) < angleBetween(vec1, toMouse)) return false;
			}

			return true;
		}
	}]);

	return Polygon;
}(Entity);

var Join = function (_Entity5) {
	_inherits(Join, _Entity5);

	function Join(obj1) {
		var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : JOIN_LINEAR;

		_classCallCheck(this, Join);

		var _this39 = _possibleConstructorReturn(this, (Join.__proto__ || Object.getPrototypeOf(Join)).call(this, OBJECT_JOIN));

		_this39._obj1 = obj1;
		_this39._obj1_connector = obj1.selectedConnector;
		_this39._obj2 = null;
		_this39._obj2_connector = null;
		_this39._lineType = type;
		Entity.changeAttr(_this39, { borderColor: "blue", borderWidth: 5 });

		_this39._tmpPos = obj1.position.getClone();
		return _this39;
	}

	_createClass(Join, [{
		key: "updateCreatingPosition",
		value: function updateCreatingPosition(pos) {
			this._tmpPos.set(pos);
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			if (this._obj1.position == null) {
				Logger.warn("ide sa kresliť join ktorý nemá potrebné udaje");
				Scene.remove(this);
				return;
			}

			var obj1pos = this._obj1.position.getClone().add(this._obj1.size.getClone().mul(this._obj1_connector)),
			    obj2pos,
			    array = [];

			if (this._obj2 != null) obj2pos = this._obj2.position.getClone().add(this._obj2.size.getClone().mul(this._obj2_connector));else obj2pos = this._tmpPos;

			array.push(obj1pos);

			if (this._lineType != JOIN_LINEAR) {
				var center = obj1pos.getClone().add(obj2pos).br(1),
				    diff = obj1pos.getClone().sub(obj2pos);

				diff.x = Math.abs(diff.x);
				diff.y = Math.abs(diff.y);

				if (diff.x > diff.y) {
					if (this._lineType == JOIN_SEQUENCAL) {
						array.push(new GVector2f(center.x, obj1pos.y));
						array.push(new GVector2f(center.x, obj2pos.y));
						array.push(obj2pos);
					} else if (this._lineType == JOIN_BAZIER) array.push([new GVector2f(center.x, obj1pos.y), new GVector2f(center.x, obj2pos.y), obj2pos]);
				} else if (diff.x <= diff.y) {
					if (this._lineType == JOIN_SEQUENCAL) {
						array.push(new GVector2f(obj1pos.x, center.y));
						array.push(new GVector2f(obj2pos.x, center.y));
						array.push(obj2pos);
					} else if (this._lineType == JOIN_BAZIER) array.push([new GVector2f(obj1pos.x, center.y), new GVector2f(obj2pos.x, center.y), obj2pos]);
				}
			} else array.push(obj2pos);

			if (this._lineType == JOIN_BAZIER) drawBazierCurve(array, this.borderWidth, this.borderColor);else doLine({ points: array, borderWidth: this.borderWidth, borderColor: this.borderColor, ctx: ctx });
		}
	}, {
		key: "obj2",
		set: function set(val) {
			this._obj2 = val;
			this._obj2_connector = val.selectedConnector;
			this._obj1.selectedConnector = false;
			this._obj2.selectedConnector = false;
		}
	}, {
		key: "type",
		set: function set(val) {
			this._lineType = val;
			draw();
		}
	}]);

	return Join;
}(Entity);

var Rect = function (_Entity6) {
	_inherits(Rect, _Entity6);

	function Rect(position, size, fillColor) {
		_classCallCheck(this, Rect);

		var _this40 = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, OBJECT_RECT, position, size, { fillColor: fillColor }));

		_this40.moveType = -1;
		_this40.minSize = new GVector2f(SELECTOR_SIZE);
		_this40.addConnector(new GVector2f(0, 0), new GVector2f(1, 0), new GVector2f(0, 1), new GVector2f(1, 1));
		return _this40;
	}

	_createClass(Rect, [{
		key: "updateCreatingPosition",
		value: function updateCreatingPosition(pos) {
			this.size.x = pos.x - this.position.x;
			this.size.y = pos.y - this.position.y;
		}
	}, {
		key: "_hover",
		value: function _hover(x, y) {
			if (this.clickInBoundingBox(x, y)) {
				if (this._locked) setCursor(CURSOR_NOT_ALLOWED);else setCursor(CURSOR_POINTER);
				return true;
			}

			setCursor(CURSOR_DEFAULT);
			return false;
		}
	}, {
		key: "_clickIn",
		value: function _clickIn(x, y) {
			var vec = new GVector2f(x, y);
			this.moveType = -1;
			if (Input.isKeyDown(L_CTRL_KEY)) {
				this.checkConnectors(vec);
				if (this._selectedConnector) return true;
			}

			Entity.setMoveType(this, vec);

			return this.moveType >= 0;
		}
	}, {
		key: "_checkRadius",
		value: function _checkRadius() {
			var minRadius = Math.min(this.size.x, this.size.y) >> 1;
			return this._radius > minRadius ? minRadius : this._radius;
		}
	}, {
		key: "_draw",
		value: function _draw(ctx) {
			doRect({
				position: this.position,
				size: this.size,
				fillColor: this.fillColor,
				shadow: this.moving && !this.locked,
				borderWidth: this.borderWidth,
				borderColor: this.borderColor,
				radius: this._checkRadius(),
				ctx: ctx
			});
			Entity.drawConnectors(this, ctx);

			drawBorder(ctx, this);
		}
	}]);

	return Rect;
}(Entity);

var Paint = function (_Entity7) {
	_inherits(Paint, _Entity7);

	function Paint() {
		_classCallCheck(this, Paint);

		var _this41 = _possibleConstructorReturn(this, (Paint.__proto__ || Object.getPrototypeOf(Paint)).call(this, OBJECT_PAINT, new GVector2f(), new GVector2f()));

		_this41._points = [Paint.defArray()];
		_this41._count = 0;

		_this41._canvas = Project.canvasManager.createCanvas(Project.canvas.width, Project.canvas.height, "canvas" + Project.generateId());
		_this41.onScreenResize();
		_this41._editBackup = [];
		return _this41;
	}

	_createClass(Paint, [{
		key: "onScreenResize",
		value: function onScreenResize() {
			this._canvas.setCanvasSize(canvas.width, canvas.height);
			this.redraw(this._points);
		}
	}, {
		key: "animate",
		value: function animate() {
			var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;
			var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._points.length - 1;

			var points = this._points,
			    i = 0,
			    ii = 0,
			    inst = this;
			this.cleanUp();

			var interval = setInterval(function () {
				if (i >= limit || i >= points.length - 1) {
					clearInterval(interval);
					return;
				}

				Creator.setOpt(ATTRIBUTE_BRUSH_COLOR, points[i]["color"]);
				Creator.setOpt(ATTRIBUTE_BRUSH_SIZE, points[i]["size"]);
				Creator.setOpt(ATTRIBUTE_BRUSH_TYPE, points[i]["type"]);
				inst.addPoint(points[i]["points"][ii]);

				if (ii++ == points[i]["points"].length - 1) {
					inst.breakLine();
					i++;
					ii = 0;
				}
				draw();
			}, speed);
		}
	}, {
		key: "redraw",
		value: function redraw(points) {
			var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : points.length - 1;

			this.cleanUp();
			var res = [];
			points.forEach(function (e, i) {
				if (i > limit || isNull(e["color"])) return;
				res.push(e);

				e["points"].forEach(function (ee, ii, arr) {
					if (ii) Paints.drawLine(this._canvas.context, ee, arr[ii - 1], e["size"], e["color"], e["action"], e["type"]);
				}, this);
			}, this);
			this._points = res;
			if (points.length > 0 && points[points.length - 1]["points"].length) this.breakLine();
			if (!points[points.length - 1]["points"].length) {
				this._points.push(Paint.defArray());
			}
			Logger.log("prekresluje sa " + this.constructor.name, LOGGER_DRAW);
		}
	}, {
		key: "undo",
		value: function undo() {
			if (this._points.length === 1) return false;

			if (isNull(this._points[this._points.length - 1]["color"])) this._points.pop();

			this._editBackup.push(this._points.pop());

			this.redraw(this._points);
			if (this._points.length === 0) this._points.push(Paint.defArray());
		}
	}, {
		key: "redo",
		value: function redo() {
			if (this._editBackup.length == 0) return false;

			if (isNull(this._points[this._points.length - 1]["color"])) this._points.pop();
			this._points.push(this._editBackup.pop());
			this.redraw(this._points);
		}
	}, {
		key: "addLine",
		value: function addLine(line) {
			console.log("prijala sa line: ", line);
		}
	}, {
		key: "addPoint",
		value: function addPoint(point) {
			if (this._points.length === 0) this._points.push(Paint.defArray());

			var lastArr = this._points[this._points.length - 1],
			    arr = lastArr["points"];

			if (CUT_OFF_PATHS_BEFORE && arr.length > 2) {
				var p1 = arr[arr.length - 2].getClone().sub(arr[arr.length - 1]);
				var p2 = arr[arr.length - 1].getClone().sub(point);
				var angle = GVector2f.angle(p1, p2) * p2.length();
				if (angle < CUT_OFF_BEFORE_DISTANCE) return;
			}

			this._editBackup = [];
			this._count++;

			if (isNull(lastArr["color"])) {
				lastArr["color"] = Creator.brushColor;
				lastArr["action"] = Paints.action;
				lastArr["type"] = Creator.brushType;
				lastArr["size"] = Creator.brushSize;
				lastArr["min"] = point.getClone();
				lastArr["max"] = point.getClone();
			}

			if (arr.length) Paints.drawLine(this._canvas.context, arr[arr.length - 1], point, Creator.brushSize, Creator.brushColor, Paints.action, Creator.brushType);
			lastArr["min"].x = Math.min(lastArr["min"].x, point.x);
			lastArr["min"].y = Math.min(lastArr["min"].y, point.y);
			lastArr["max"].x = Math.max(lastArr["max"].x, point.x);
			lastArr["max"].y = Math.max(lastArr["max"].y, point.y);
			arr.push(point);
		}
	}, {
		key: "fromObject",
		value: function fromObject(content) {
			var concat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			each(content, function (ee) {
				each(ee["points"], function (e, i, arr) {
					arr[i] = new GVector2f(e._x, e._y);
				});
			});
			this.redraw(concat ? content.concat(this._points) : content);
		}
	}, {
		key: "toObject",
		value: function toObject() {
			return this._points;
		}
	}, {
		key: "cleanUp",
		value: function cleanUp() {
			this._points = [Paint.defArray()];
			this._points[this._actColor] = [[]];
			this._count = 0;
			this._canvas.context.clearRect(0, 0, canvas.width, canvas.height);
			Logger.log("Bol vyčistený objekt " + this.constructor.name, LOGGER_OBJECT_CLEANED);
		}
	}, {
		key: "breakLine",
		value: function breakLine() {
			if (this._points.length === 0) {
				this._points.push(Paint.defArray());
			} else if (this._points[this._points.length - 1].points.length < 2) {
				this._points[this._points.length - 1] = Paint.defArray();
			} else {
				this._points.push(Paint.defArray());
				if (CUT_OFF_PATHS_AFTER) {
					Paint.roundPath(this._points[this._points.length - 2], CUT_OFF_AFTER_DISTANCE);
					this.redraw(this._points);
				}
				return this._points[this._points.length - 2];
			}
			return false;
		}
	}, {
		key: "findPathsForRemove",
		value: function findPathsForRemove(pos, radius) {
			var _this42 = this;

			var pointsToRemove = [];
			each(this._points, function (e, i) {
				if (!e["forRemove"] && e["min"] && e["max"]) {
					var offset = (Creator.brushSize >> 1) + (e["size"] >> 1);
					if (pos.x + offset > e["min"].x - e["size"] && pos.y + offset > e["min"].y && pos.x - offset < e["max"].x + e["size"] && pos.y - offset < e["max"].y) {
						each(e["points"], function (ee) {
							if (!e["forRemove"] && ee.dist(pos) < Creator.brushSize) {
								e["forRemove"] = true;
								pointsToRemove.push({
									line: e,
									points: [],
									lineIndex: i
								});
							}
						});
					}
				}
			});
			return false;
			if (pointsToRemove.length) {
				console.log(pointsToRemove);
				each(pointsToRemove, function (e) {
					var line1Points = [];
					var line2Points = [];
					each(e.line.points, function (ee) {
						if (ee.dist(pos) < Creator.brushSize) e.points.push(ee);else {
							if (e.points) line1Points.push(ee);else line2Points.push(ee);
						}
					});

					console.log(e.line.points, e.points, line1Points, line2Points);
					_this42._points.splice(e.lineIndex, 1);

					var line1 = {};
					line1["action"] = e.line["action"];
					line1["color"] = e.line["color"];
					line1["forRemove"] = false;

					line1["points"] = line1Points;
					line1["size"] = e.line["size"];
					line1["type"] = e.line["type"];
					_this42._points.push(line1);
					_this42.redraw(_this42._points);
				});
			}
		}
	}, {
		key: "removeSelectedPaths",
		value: function removeSelectedPaths() {
			var i = this._points.length;
			while (i--) {
				if (this._points[i]["forRemove"]) this._points.splice(i, 1);
			}
			this.redraw(this._points);
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			if (!this.visible) return;
			ctx.drawImage(this._canvas.canvas, 0, 0);
		}
	}, {
		key: "points",
		get: function get() {
			return this._points;
		}
	}], [{
		key: "defArray",
		value: function defArray() {
			return {
				id: PaintManager.getId(),
				color: null,
				action: null,
				size: null,
				type: null,
				points: [],
				min: null,
				max: null,
				forRemove: false
			};
		}
	}, {
		key: "roundPath",
		value: function roundPath(path, maxDist) {
			for (var i = path.points.length - 3; i--; i > 0) {
				var p1 = path.points[i],
				    p2 = path.points[i + 1],
				    p3 = path.points[i + 2];
				var angle = GVector2f.angle(p2.getClone().sub(p1), p3.getClone().sub(p1));
				var b = p2.getClone().sub(p3).length();
				var height = b * angle;
				if (height < maxDist) {
					path.points.splice(i + 1, 1);
				}
			}
		}
	}]);

	return Paint;
}(Entity);

var Line = function (_Entity8) {
	_inherits(Line, _Entity8);

	function Line(points, width, fillColor) {
		var targetA = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
		var targetB = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

		_classCallCheck(this, Line);

		var _this43 = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this, OBJECT_LINE, new GVector2f(), new GVector2f(), { fillColor: fillColor, borderWidth: width }));

		_this43._points = points;
		_this43.movingPoint = -1;
		_this43._lineCap = LINE_CAP_BUTT;
		_this43._joinType = LINE_JOIN_MITER;
		_this43._lineStyle = LINE_STYLE_NORMAL;
		_this43._lineType = JOIN_LINEAR;
		_this43._arrow = new Image();
		_this43._arrow.src = "img/arrow.png";
		_this43._arrowEndType = 0;
		_this43._arrowStartType = 0;
		_this43.targetA = targetA;
		_this43.targetB = targetB;

		_this43._startText = null;

		_this43._text_A = "začiatok 10%";
		_this43._text_B = "koniec 90%";

		if (points.length < 2) {
			Logger.warn("vytvoril sa line ktory mal menej ako 2 body a tak sa maže");
			Scene.remove(_this43);
		}
		Entity.findMinAndMax(_this43._points, _this43.position, _this43.size);
		return _this43;
	}

	_createClass(Line, [{
		key: "setStartText",
		value: function setStartText(text) {
			var dist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var angle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var ctx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : context;

			if (arguments.length === 0 || !isString(text) || text.length === 0) {
				this._startText = null;
				return;
			}
			var fontSize = 10;
			this._startText = {
				text: text,
				dist: dist,
				fontSize: fontSize,
				angle: angle,
				textWidth: CanvasHandler.calcTextWidth(ctx, text, fontSize + "pt Comic Sans MS")
			};

			if (this._startText.dist === 0) {
				this._startText.dist = this._startText.textWidth;
			}
		}
	}, {
		key: "doubleClickIn",
		value: function doubleClickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;

			this._points.forEach(function (e, i) {
				if (new GVector2f(x, y).dist(e) < SELECTOR_SIZE) {
					this._points.splice(i, 1);
					Entity.findMinAndMax(this._points, this.position, this.size);
				}
			}, this);

			if (this._points.length < 2) {
				Scene.remove(this);
			}

			return true;
		}
	}, {
		key: "_clickIn",
		value: function _clickIn(x, y) {
			this.movingPoint = -1;

			if (this._startText !== null) {
				var final = this._points[this._points.length - 1].getClone();
				var semiFinal = this._points[this._points.length - 2].getClone();
				var vector = semiFinal.sub(final).normalize();
				var angle = this._startText.angle;
				var newVector = new GVector2f(vector.x * Math.cos(angle) - vector.y * Math.sin(angle), vector.x * Math.sin(angle) + vector.y * Math.cos(angle));
				var position = final.add(newVector.mul(this._startText.dist));
				if (position.dist(new GVector2f(x, y)) < this._startText.textWidth) {
					console.log("aaaaaaaaaanooooooooo");
				}
			}

			this._points.forEach(function (e, i, points) {
				if (this.movingPoint >= 0) return true;
				if (new GVector2f(x, y).dist(e) < SELECTOR_SIZE) this.movingPoint = i;else if (i + 1 < points.length && new GVector2f(x, y).dist(e.x + points[i + 1].x >> 1, e.y + points[i + 1].y >> 1) < SELECTOR_SIZE) this.movingPoint = parseFloat(i) + 0.5;
			}, this);
			if (this.movingPoint >= 0) {
				return this.movingPoint >= 0;
			}

			for (var i = 1; i < this._points.length; i++) {
				if (Line.determineClick(this._points[i - 1], this._points[i], x, y, 10)) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: "setTarget",
		value: function setTarget(val) {
			if (this.movingPoint === 0) {
				this.targetA = val;
			} else if (this.movingPoint == this.points.length - 1) {
				this.targetB = val;
			}
		}
	}, {
		key: "updateCreatingPosition",
		value: function updateCreatingPosition(pos) {
			this._points[this._points.length - 1].set(pos);
			Entity.findMinAndMax(this._points, this.position, this.size);
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			var obj,
			    size = this._points.length;

			if (this._targetA) {
				obj = Project.scene.getObject(this._targetLayerA, this._targetA);
				if (obj) {
					this._points[0].set(obj.getConnectorPosition(this._targetConnectionA));
				} else {
					this.targetA = obj;
				}
			}

			if (this._targetB) {
				obj = Project.scene.getObject(this._targetLayerB, this._targetB);
				if (obj) {
					this._points[size - 1].set(obj.getConnectorPosition(this._targetConnectionB));
				} else {
					this.targetB = obj;
				}
			}
			if (this._targetA || this._targetB) {
				Entity.findMinAndMax(this._points, this.position, this.size);
			}

			if (isNumber(this._radius) && this._radius > 1) this._radius += "";

			doLine({
				shadow: this.moving && !this.locked,
				lineCap: this._lineCap,
				joinType: this._joinType,
				lineStyle: this._lineStyle,
				points: this._points,
				borderWidth: this.borderWidth,
				borderColor: this.fillColor,
				radius: this.radius,
				lineDash: this._lineStyle == LINE_STYLE_STRIPPED ? [15, 5] : [],
				ctx: ctx
			});

			Arrow.drawArrow(ctx, this._points[1], this._points[0], this, this._arrowEndType);
			Arrow.drawArrow(ctx, this._points[size - 2], this._points[size - 1], this, this._arrowStartType);

			var point, offset;

			var first = this._points[0].getClone();
			var second = this._points[1].getClone();
			offset = CanvasHandler.calcTextWidth(ctx, this._text_B, "10pt Comic Sans MS");
			point = first.add(second.sub(first).normalize().mul((offset >> 1) + 10));
			doRect({
				position: point,
				fillColor: "white",
				width: offset,
				height: 10,
				center: true,
				ctx: ctx
			});
			ctx.fillStyle = "black";
			ctx.textAlign = FONT_HALIGN_CENTER;
			ctx.textBaseline = FONT_VALIGN_MIDDLE;
			ctx.fillText(this._text_B, point.x, point.y);

			if (isObject(this._startText) && this._startText !== null) {
				var final = this._points[this._points.length - 1].getClone();
				var semiFinal = this._points[this._points.length - 2].getClone();
				var vector = semiFinal.sub(final).normalize();
				var angle = this._startText.angle;
				var newVector = new GVector2f(vector.x * Math.cos(angle) - vector.y * Math.sin(angle), vector.x * Math.sin(angle) + vector.y * Math.cos(angle));
				var position = final.add(newVector.mul(this._startText.dist));
				doRect({
					position: position,
					fillColor: "white",
					width: this._startText.textWidth,
					height: this._startText.fontSize,
					center: true,
					ctx: ctx
				});
				ctx.fillStyle = "black";
				ctx.textAlign = FONT_HALIGN_CENTER;
				ctx.textBaseline = FONT_VALIGN_MIDDLE;
				ctx.fillText(this._startText.text, position.x, position.y);
			}


			context.lineWidth = DEFAULT_STROKE_WIDTH << 1;
			if (this.selected) {
				drawBorder(ctx, this, {});
				drawSelectArc(ctx, this._points[0].x, this._points[0].y);
				for (var i = 1; i < size; i++) {
					drawSelectArc(ctx, this._points[i].x, this._points[i].y);
					drawSelectArc(ctx, this._points[i].x + this._points[i - 1].x >> 1, this._points[i].y + this._points[i - 1].y >> 1);
				}
			}
		}
	}, {
		key: "points",
		get: function get() {
			return this._points;
		}
	}, {
		key: "lineCap",
		set: function set(val) {
			this._lineCap = val;
		}
	}, {
		key: "arrowEndType",
		set: function set(val) {
			this._arrowEndType = val;
		}
	}, {
		key: "lineType",
		set: function set(val) {
			this._lineType = val;
		}
	}, {
		key: "joinType",
		set: function set(val) {
			this._joinType = val;
		}
	}, {
		key: "lineStyle",
		set: function set(val) {
			this._lineStyle = val;
		}
	}, {
		key: "arrowStartType",
		set: function set(val) {
			this._arrowStartType = val;
		}
	}, {
		key: "targetB",
		set: function set(val) {
			var object = val ? val.id : "";
			if (this._targetB == object) {
				return;
			}
			this._targetB = object;
			this._targetLayerB = val ? val.layer : "";
			this._targetConnectionB = val ? val.selectedConnector : "";
		}
	}, {
		key: "targetA",
		set: function set(val) {
			var object = val ? val.id : "";
			if (this._targetA == object) {
				return;
			}
			this._targetA = object;
			this._targetLayerA = val ? val.layer : "";
			this._targetConnectionA = val ? val.selectedConnector : "";
		}
	}], [{
		key: "determineClick",
		value: function determineClick(p1, p2, x, y, maxDist) {
			if (x < Math.min(p1.x, p2.x) || x > Math.max(p1.x, p2.x) || y < Math.min(p1.y, p2.y) || y > Math.max(p1.y, p2.y)) return false;

			var dist = p1.dist(p2),
			    log = Math.ceil(Math.log2(dist)),
			    min,
			    max,
			    center,
			    i;
			if (p1.x < p2.x) {
				min = p1.getClone();
				max = p2.getClone();
			} else {
				min = p2.getClone();
				max = p1.getClone();
			}
			center = min.getClone().add(max).br(1);
			for (i = 0; i < log; i++) {
				if (x > center.x) min = center;else max = center;
				center = min.add(max).br(1);

				if (Math.abs(y - center.y) < maxDist) return true;
			}
			return false;
		}
	}]);

	return Line;
}(Entity);

var Arc = function (_Entity9) {
	_inherits(Arc, _Entity9);

	function Arc(position, size, fillColor) {
		_classCallCheck(this, Arc);

		var _this44 = _possibleConstructorReturn(this, (Arc.__proto__ || Object.getPrototypeOf(Arc)).call(this, OBJECT_ARC, position, size, { fillColor: fillColor, minSize: new GVector2f(SELECTOR_SIZE) }));

		_this44.moveType = -1;
		return _this44;
	}

	_createClass(Arc, [{
		key: "updateCreatingPosition",
		value: function updateCreatingPosition(pos) {
			this.size.x = pos.x - this.position.x;
			this.size.y = pos.y - this.position.y;
		}
	}, {
		key: "_clickIn",
		value: function _clickIn(x, y) {
			var vec = new GVector2f(x, y);
			this.moveType = -1;

			this.checkConnectors(vec);
			if (this._selectedConnector) return true;

			Entity.setMoveType(this, vec);
			return this.moveType >= 0;
		}
	}, {
		key: "_draw",
		value: function _draw(ctx) {
			doArc({
				position: this.position,
				size: this.size,
				fillColor: this.fillColor,
				borderColor: this.borderColor,
				borderWidth: this.borderWidth,
				shadow: this.moving && !this.locked,
				ctx: ctx
			});

			Entity.drawConnectors(this, ctx);

			drawBorder(ctx, this);
		}
	}]);

	return Arc;
}(Entity);

var MINIMAL_DIAGONAL = 10;

var Area = function () {
	function Area() {
		_classCallCheck(this, Area);

		this.clear();
		this._name = OBJECT_AREA;
		this._moving = false;
		this._min = new GVector2f();
		this._max = new GVector2f();
		this._offset = new GVector2f();
	}

	_createClass(Area, [{
		key: "move",
		value: function move(x, y) {
			this._offset.add(x, y);
		}
	}, {
		key: "clear",
		value: function clear() {
			this._points = [];
			this._isCreating = false;
		}
	}, {
		key: "removeSelected",
		value: function removeSelected(onBorder) {
			var revert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var inst = this;
			var size = this._max.getClone().sub(this._min);

			Project.scene.forEach(function (e) {
				var tl = inst._isPointIn(e.position.x, e.position.y),
				    tr = inst._isPointIn(e.position.x + e.size.x, e.position.y),
				    bl = inst._isPointIn(e.position.x, e.position.y + e.size.y),
				    br = inst._isPointIn(e.position.x + e.size.x, e.position.y + e.size.y);

				if (onBorder) {
					if (tl || tr || bl || br) {
						Scene.remove(e);
					}
				} else {
					if (tl && tr && bl && br) {
						Scene.remove(e);
					}
				}
			});

			each(Project.scene.layers, function (layer) {
				var paths = layer.paint.points;
				each(paths, function (path) {
					if (!path.points.length) return false;
					var tl = inst._isPointIn(path.min.x, path.min.y),
					    tr = inst._isPointIn(path.max.x, path.min.y),
					    bl = inst._isPointIn(path.min.x, path.max.y),
					    br = inst._isPointIn(path.max.x, path.max.y);

					if (!tl && !tr && !bl && !br) return false;

					var result;
					if (onBorder) {
						var result = false;
						each(path.points, function (point) {
							if (result) return;
							result = inst._isPointIn(point.x, point.y);
						});
					} else {
						result = true;
						each(path.points, function (point) {
							if (!result) return;
							result = inst._isPointIn(point.x, point.y);
						});
					}
					path.forRemove = result;
				});
				layer.paint.removeSelectedPaths();
			});
		}
	}, {
		key: "_isPointIn",
		value: function _isPointIn(x, y) {
			if (this._points < 2) return false;
			var countLeft = 0;
			var countRight = 0;
			var unRecognized = [];
			each(this._points, function (a, i, arr) {
				var b = arr[(i + 1) % arr.length];

				if (a.y >= y && b.y < y || a.y <= y && b.y > y) {
					if (b.x > x && a.x > x) countRight++;else if (b.x < x && a.x < x) countLeft++;else {
						unRecognized.push([a.x, a.y, b.x, b.y]);
					}
				}
			});

			if (unRecognized.length == 0 && (countRight % 2 == 0 || countLeft % 2 == 0)) return false;

			return true;
		}
	}, {
		key: "hover",
		value: function hover(x, y) {
			if (this._isCreating) return false;

			var val = x > this._min.x && y > this._min.y && x < this._max.x && y < this._max.y;

			if (val) val = this._isPointIn(x, y);
			setCursor(val ? CURSOR_POINTER : CURSOR_DEFAULT);
			return val !== false;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			return this._isPointIn(x, y);
		}
	}, {
		key: "addPoint",
		value: function addPoint(position) {
			var last = this._points[this._points.length - 1];

			doLine({
				points: [last.x, last.y, position.x, position.y],
				borderWidth: 5,
				borderColor: "blue"
			});

			this._min.x = Math.min(this._min.x, position.x);
			this._min.y = Math.min(this._min.y, position.y);
			this._max.x = Math.max(this._max.x, position.x);
			this._max.y = Math.max(this._max.y, position.y);

			this._points.push(position);
		}
	}, {
		key: "startCreate",
		value: function startCreate(position) {
			this.clear();
			this._points.push(position);
			this._isCreating = true;
			this._min.set(position);
			this._max.set(position);
		}
	}, {
		key: "endCreate",
		value: function endCreate(position) {
			this._points.push(position);
			this._isCreating = false;

			this._min.x = Math.min(this._min.x, position.x);
			this._min.y = Math.min(this._min.y, position.y);
			this._max.x = Math.max(this._max.x, position.x);
			this._max.y = Math.max(this._max.y, position.y);
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			if (this._isCreating || this._points.length <= 3) return;
			doPolygon({
				points: this._points,
				offset: this._offset,
				borderWidth: 5,
				borderColor: "red"
			});
		}
	}, {
		key: "name",
		get: function get() {
			return this._name;
		}
	}, {
		key: "moving",
		get: function get() {
			return this._moving;
		},
		set: function set(val) {
			var _this45 = this;

			this._moving = val;
			if (!val) {
				each(this._points, function (e) {
					e.x += _this45._offset.x;
					e.y += _this45._offset.y;
				});
				this._min.add(this._offset);
				this._max.add(this._offset);
				this._offset.set(0, 0);
			}
		}
	}, {
		key: "isCreating",
		get: function get() {
			return this._isCreating;
		}
	}, {
		key: "isReady",
		get: function get() {
			return this._min && this._max && this._min.dist(this._max) > MINIMAL_DIAGONAL;
		}
	}]);

	return Area;
}();

var Graph = function (_Entity10) {
	_inherits(Graph, _Entity10);

	function Graph() {
		var vertices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
		var edges = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		_classCallCheck(this, Graph);

		var _this46 = _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, OBJECT_GRAPH, new GVector2f(), new GVector2f()));

		_this46._vertices = vertices;
		_this46._edges = edges;
		return _this46;
	}

	_createClass(Graph, [{
		key: "addVertex",
		value: function addVertex(vertex) {
			if (!isObject(vertex) || isUndefined(vertex.x) || isUndefined(vertex.y)) return false;

			vertex["fillColor"] = vertex["fillColor"] || GRAPH_FILL_COLOR;
			vertex["borderColor"] = vertex["borderColor"] || GRAPH_BORDER_COLOR;
			vertex["size"] = vertex["size"] || GRAPH_VERTEX_COLOR;
			vertex["borderWidth"] = vertex["borderWidth"] || GRAPH_BORDER_WIDTH;
			vertex["label"] = vertex["label"] || "";
			this._vertices.push(vertex);
		}
	}, {
		key: "addEdge",
		value: function addEdge(edge) {
			if (!isObject(edge) || isUndefined(edge.A) || isUndefined(edge.B)) return false;
			edge["fillColor"] = edge["fillColor"] || GRAPH_BORDER_COLOR;
			edge["borderWidth"] = edge["borderWidth"] || GRAPH_BORDER_WIDTH;
			edge["labelA"] = edge["labelA"] || "";
			edge["labelB"] = edge["labelB"] || "";
			edge["startA"] = edge["startA"] || LINE_NONE;
			edge["startB"] = edge["startB"] || LINE_NONE;
			this._edges.push(edge);
		}
	}, {
		key: "draw",
		value: function draw() {
			var _this47 = this;

			each(this._edges, function (e) {
				if (typeof _this47._vertices[e.A] !== "undefined" && typeof _this47._vertices[e.B] !== "undefined") {
					doLine({
						points: [_this47._vertices[e.A].x, _this47._vertices[e.A].y, _this47._vertices[e.B].x, _this47._vertices[e.B].y],
						borderWidth: e.borderWidth,
						borderColor: e.fillColor
					});
				}
			});

			each(this._vertices, function (e) {
				return doArc({
					x: e.x,
					y: e.y,
					fillColor: e.fillColor,
					size: e.size,
					borderColor: e.borderColor,
					borderWidth: e.borderWidth,
					center: true
				});
			});
		}
	}]);

	return Graph;
}(Entity);

function initGraphs() {
	var g = new Graph();
	g.addVertex({ x: 100, y: 100, size: 30, borderWidth: 5, borderColor: "blue", fillColor: "red" });
	g.addVertex({ x: 500, y: 100, size: 40, borderWidth: 15, borderColor: "blue", fillColor: "red" });
	g.addVertex({ x: 300, y: 300, size: 50, borderWidth: 25, borderColor: "blue", fillColor: "red" });

	g.addEdge({ fillColor: "pink", borderWidth: 10, A: 0, B: 1 });
	g.addEdge({ fillColor: "brown", borderWidth: 20, A: 1, B: 2 });
	g.addEdge({ fillColor: "orange", borderWidth: 30, A: 0, B: 2 });
	Scene.addToScene(g);
}

var ImageObject = function (_Entity11) {
	_inherits(ImageObject, _Entity11);

	function ImageObject(position, size, image, data) {
		_classCallCheck(this, ImageObject);

		var _this48 = _possibleConstructorReturn(this, (ImageObject.__proto__ || Object.getPrototypeOf(ImageObject)).call(this, OBJECT_IMAGE, position, size, data));

		_this48._radius = 20;

		_this48._image = image || null;

		return _this48;
	}

	_createClass(ImageObject, [{
		key: "updateCreatingPosition",
		value: function updateCreatingPosition(pos) {
			this.size.x = pos.x - this.position.x;
			this.size.y = pos.y - this.position.y;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) return false;

			var vec = new GVector2f(x, y);
			this.moveType = -1;

			this.checkConnectors(vec);
			if (this._selectedConnector) return true;

			Entity.setMoveType(this, vec);

			return this.moveType >= 0;
		}
	}, {
		key: "draw",
		value: function draw() {
			var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : context;

			doRect({
				bgImage: this._image || false,
				fill: this._image === null,
				position: this._position,
				size: this.size,
				radius: this.radius,
				draw: true,
				shadow: this.moving && !this.locked,
				borderWidth: this.borderWidth,
				borderColor: this.borderColor,
				ctx: ctx
			});

			drawBorder(ctx, this);
		}
	}, {
		key: "image",
		set: function set(img) {
			this._image = img;
		}
	}]);

	return ImageObject;
}(Entity);

var TextArea = function (_Entity12) {
	_inherits(TextArea, _Entity12);

	function TextArea(text, position, size) {
		var fontColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_FONT_COLOR;

		_classCallCheck(this, TextArea);

		var _this49 = _possibleConstructorReturn(this, (TextArea.__proto__ || Object.getPrototypeOf(TextArea)).call(this, OBJECT_TEXT, position, size, { fillColor: DEFAULT_BACKGROUND_COLOR, radius: DEFAULT_RADIUS }));

		_this49._text = text || "";
		_this49._textColor = fontColor;
		_this49._fontSize = DEFAULT_FONT_SIZE;
		_this49._moveType = -1;
		_this49._verticalTextAlign = FONT_VALIGN_TOP;
		_this49._horizontalTextAlign = FONT_HALIGN_LEFT;
		_this49._fontOffset = DEFAULT_TEXT_OFFSET;
		_this49._selected = false;
		_this49._padding = 20;
		_this49._lineHeight = 30;

		_this49.addConnector(new GVector2f(0, 0), new GVector2f(1, 0), new GVector2f(0, 1), new GVector2f(1, 1));
		return _this49;
	}

	_createClass(TextArea, [{
		key: "_blur",
		value: function _blur() {
			this._selected = false;
			SelectedText = null;
		}
	}, {
		key: "clickIn",
		value: function clickIn(x, y) {
			if (!this.clickInBoundingBox(x, y)) {
				if (this._selected) this._blur();
				return false;
			}

			this._selected = true;
			SelectedText = this;

			var pos = this.position,
			    vec = new GVector2f(x, y);

			var area = document.getElementById("selectedEditor");

			if (area) {
				document.body.removeChild(area);
			}

			area = document.createElement("div");
			area.setAttribute("id", "selectedEditor");
			area.setAttribute("contenteditable", "true");
			area.style["top"] = this._position.y + "px";
			area.style["left"] = this._position.x + "px";
			area.style["width"] = this._size.x + "px";
			area.style["height"] = this._size.y + "px";
			area.style["backgroundColor"] = this._fillColor;
			area.style["borderRadius"] = this._radius + "px";
			area.style["padding"] = this._padding + "px";
			area.style["color"] = this._textColor;
			area.style["zIndex"] = 100000;

			area.style["font"] = this._fontSize + "pt " + DEFAULT_FONT;

			document.body.insertBefore(area, document.getElementById("myCanvas"));

			this.checkConnectors(vec);
			if (this._selectedConnector) return true;

			if (vec.dist(pos.x + (this.size.x >> 1), pos.y) < SELECTOR_SIZE) this._moveType = 0;else if (vec.dist(pos.x + this.size.x, pos.y + (this.size.y >> 1)) < SELECTOR_SIZE) this._moveType = 1;else if (vec.dist(pos.x + (this.size.x >> 1), pos.y + this.size.y) < SELECTOR_SIZE) this._moveType = 2;else if (vec.dist(pos.x, pos.y + (this.size.y >> 1)) < SELECTOR_SIZE) this._moveType = 3;else if (vec.dist(pos.x + this.size.x, pos.y + this.size.y) < SELECTOR_SIZE) this._moveType = 5;else if (x > this.position.x && y > this.position.y && x < this.position.x + this.size.x && y < this.position.y + this.size.y) this._moveType = 4;
			return this._moveType >= 0;
		}
	}, {
		key: "draw",
		value: function draw() {
			var _this50 = this;

			var pos = this.position.getClone();

			doRect({
				shadow: this.moving && !this.locked,
				position: this.position,
				size: this.size,
				radius: this.radius,
				fillColor: this.fillColor,
				borderWidth: this._borderWidth,
				draw: true,
				fill: true
			});

			context.textAlign = this._horizontalTextAlign;
			context.textBaseline = this._verticalTextAlign;
			context.fillStyle = this._textColor;
			context.font = this._fontSize + "pt " + DEFAULT_FONT;

			var offsetY = this._padding;
			each(this._text, function (e) {
				context.fillText(e, pos.x + _this50._padding, pos.y + offsetY);
				offsetY += _this50._lineHeight * 1.40;
			});
		}
	}, {
		key: "text",
		set: function set(val) {
			console.log(val);
			this._text = val.split("\n");
		}
	}]);

	return TextArea;
}(Entity);

var Arrow = function () {
	function Arrow() {
		_classCallCheck(this, Arrow);
	}

	_createClass(Arrow, null, [{
		key: "drawArrow",
		value: function drawArrow(ctx, pFrom, pTo, parent) {
			var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
			var angle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Math.PI / 6;
			var length = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 30;

			if (type == 0) return;

			var vec = pTo.getClone().sub(pFrom).normalize();
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);

			var p0 = new GVector2f(pTo.x, pTo.y);
			var p1 = new GVector2f(pTo.x - (vec.x * cos - vec.y * sin) * length, pTo.y - (vec.x * sin + vec.y * cos) * length);
			var p2 = new GVector2f(pTo.x - (vec.x * cos + vec.y * sin) * length, pTo.y + (vec.x * sin - vec.y * cos) * length);

			var p3 = new GVector2f(pTo.x - ((vec.x * cos - vec.y * sin) * length << 1) + (pTo.x - ((vec.x * cos + vec.y * sin) * length << 1)) >> 1, pTo.y - ((vec.x * sin + vec.y * cos) * length << 1) + (pTo.y + ((vec.x * sin - vec.y * cos) * length << 1)) >> 1);

			switch (type) {
				case 2210:
					doLine({
						points: [[p1, p0], [p2, p0]],
						borderColor: parent.borderColor,
						borderWidth: parent.borderWidth,
						ctx: ctx
					});
					break;
				case 2211:
					doPolygon({
						points: [p0, p1, p2],
						fill: true,
						draw: true,
						borderColor: parent.borderColor,
						fillColor: parent.fillColor,
						borderWidth: parent.borderWidth,
						ctx: ctx
					});
					break;
				case 2212:
					doPolygon({
						points: [p0, p1, p2],
						fill: true,
						draw: true,
						borderColor: parent.borderColor,
						fillColor: parent.borderColor,
						borderWidth: parent.borderWidth,
						ctx: ctx
					});
					break;
				case 2213:
					doPolygon({
						points: [p1, p0, p2, p3],
						fill: true,
						draw: true,
						borderColor: parent.borderColor,
						fillColor: parent.fillColor,
						borderWidth: parent.borderWidth,
						ctx: ctx
					});
					break;
				case 2214:
					doPolygon({
						points: [p1, p0, p2, p3],
						fill: true,
						draw: true,
						borderColor: parent.borderColor,
						fillColor: parent.borderColor,
						borderWidth: parent.borderWidth,
						ctx: ctx
					});
					break;
			}
		}
	}]);

	return Arrow;
}();

var Test = function () {
	function Test() {
		_classCallCheck(this, Test);
	}

	_createClass(Test, [{
		key: "testContextMenu",
		value: function testContextMenu() {}
	}, {
		key: "testInput",
		value: function testInput() {
			var input = new InputManager();

			if (input.isButtonDown(0) || input.isButtonDown("gabo") || input.isButtonDown(false) || input.isButtonDown(0)) Logger.error("button je dole aj ked by tam nemal byť");

			if (input.isKeyDown(0) || input.isKeyDown("gabo") || input.isKeyDown(false) || input.isKeyDown(0)) Logger.error("key je dole aj ked by tam nemal byť");

			input.keyDown(0);

			if (!input.isKeyDown(0)) Logger.error("key nieje dole ked by mal byť dole");

			input.keyUp(0);

			if (input.isKeyDown(0)) Logger.error("key je dole aj ked by tam už nemal byť");

			input.buttonDown({ button: 0 });

			if (!input.isButtonDown(0)) Logger.error("button nieje dole ked by mal byť dole");

			input.buttonUp({ button: 0 });

			if (input.isButtonDown(0)) Logger.error("button je dole aj ked by tam už nemal byť");
		}
	}, {
		key: "testTable",
		value: function testTable() {}
	}], [{
		key: "allTests",
		value: function allTests() {}
	}]);

	return Test;
}();

var SharerManager = function () {
	function SharerManager() {
		var _this51 = this;

		_classCallCheck(this, SharerManager);

		this._id = false;
		this._socket = false;
		this._sharing = false;
		this.paint = {
			addPoint: function addPoint(point, layer) {
				return _this51._paintOperation(ACTION_PAINT_ADD_POINT, point, layer);
			},
			breakLine: function breakLine(layer) {
				return _this51._paintOperation(ACTION_PAINT_BREAK_LINE, layer);
			},
			clean: function clean(layer) {
				return _this51._paintOperation(ACTION_PAINT_CLEAN, layer);
			}
		};
		this._sender = new EventTimer(function (e) {
			return _this51._sendStack();
		}, 1000 / 60);
		this._buffer = [];
		Logger && Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(SharerManager, [{
		key: "_sendStack",
		value: function _sendStack() {
			if (!this._socket || this._socket.disconnected) return;
			this._socket.emit("sendBuffer", this._buffer);
			this._buffer = [];
		}
	}, {
		key: "startShare",
		value: function startShare(options) {
			this._socket = io();
			this._sharing = true;
			this._startTime = Date.now();
			this._sharePaints = options.sharePaints;
			this._shareCreator = options.shareCreator;
			this._shareObjects = options.shareObjects;
			this._maximalWatchers = options.maxWatchers;
			this._actualWatchers = [];
			var inst = this,
			    data = {
				res: {
					x: window.innerWidth,
					y: window.innerHeight
				},
				pass: options.password,
				limit: options.maxWatchers,
				realTime: options.realTime,
				detailMovement: options.detailMovement,
				share: {
					menu: options.shareMenu,
					paints: this._sharePaints,
					creator: this._shareCreator,
					objects: this._shareObjects
				}
			};

			this._socket.on('chatMessage', function (data) {
				Panel.recieveMessage(data["text"], data["sender"]);
			});

			this._sendMessage('startShare', data);

			this._socket.on('notification', function (data) {
				Logger.notif("prijatá správa: " + data["msg"]);
				console.log(data["msg"]);
			});

			this._socket.on('confirmShare', function (data) {
				inst._id = data["id"];

				var a = document.createElement("a");
				a.setAttribute("target", "_blank");
				a.setAttribute("href", inst.watcherUrl);
				a.appendChild(document.createTextNode("adrese"));
				a.style.float = "none";

				var span = document.createElement("span");
				span.appendChild(document.createTextNode("zdiela sa na "));
				span.appendChild(a);
				span.appendChild(document.createTextNode(" s ID " + data["id"]));

				Logger.notif(span);
				Menu.disabled("sharing", "watch");
				Menu.disabled("sharing", "stopShare");
				Menu.disabled("sharing", "shareOptions");
				Menu.disabled("sharing", "copyUrl");
				Menu.disabled("sharing", "startShare");

				Panel.startShare(sendMessage);
			});

			this._socket.on('getAllData', function (recData) {
				console.log("prišla žiadosť o odoslanie všetkých dát");
				var data = {
					id: inst._id,
					msg: {
						scene: Scene.toObject(),
						creator: Creator.toObject(),
						paint: Paints.toObject()
					},
					target: recData.target
				};
				console.log("recData.nickName: " + recData.nickName);
				Panel.addWatcher(recData.nickName);
				inst._actualWatchers.push(recData.nickName);
				Logger.notif("prijatá správa: Nový watcher " + recData.nickName + " sa úspešne pripojil");
				inst._sendMessage('sendAllData', data);
			});
		}
	}, {
		key: "stopShare",
		value: function stopShare() {
			Menu.disabled("sharing", "watch");
			Menu.disabled("sharing", "stopShare");
			Menu.disabled("sharing", "shareOptions");
			Menu.disabled("sharing", "copyUrl");
			Menu.disabled("sharing", "startShare");

			this._id = false;
			this._socket.disconnect();
			this._socket = false;
			this._sharing = false;
			Panel.stopShare();
		}
	}, {
		key: "copyUrl",
		value: function copyUrl() {
			var area = document.createElement("textarea");
			area.appendChild(document.createTextNode(this.watcherUrl));
			document.body.appendChild(area);
			area.select();
			try {
				document.execCommand('copy');
				Logger.notif("Adresa zdielania bola úspečne skopírovaná do schránky");
			} catch (e) {
				Logger.notif("Nepodarilo sa skopírovať adresu zdielania");
			}
			document.body.removeChild(area);
		}
	}, {
		key: "changeCreator",
		value: function changeCreator(key, val) {
			var data = {
				id: this._id,
				msg: {
					key: key,
					val: val
				}
			};
			this._sendMessage('changeCreator', data);
		}
	}, {
		key: "_paintOperation",
		value: function _paintOperation(action, arg1, arg2) {
			if (!this._sharePaints) return false;

			var data = {
				id: this._id,
				msg: {
					action: action
				}
			};
			switch (action) {
				case ACTION_PAINT_ADD_POINT:
					data["msg"]["pX"] = arg1.x;
					data["msg"]["pY"] = arg1.y;
					data["msg"]["layer"] = arg2;
					break;
				case ACTION_PAINT_BREAK_LINE:
					data["msg"]["layer"] = arg1;
					break;

				case ACTION_PAINT_CLEAN:
					data["msg"]["layer"] = arg1;
					break;
				default:
					Logger.error("nastala chyba lebo sa chce vykonať neznáma paintAction: " + action);
					return;
			}
			this._sendMessage('paintAction', data);
		}
	}, {
		key: "sendMessage",
		value: function sendMessage(text, sender) {
			var data = {
				id: this._id,
				msg: {
					text: text,
					sender: sender
				}
			};
			this._sendMessage('chatMessage', data);
		}
	}, {
		key: "mouseChange",
		value: function mouseChange(x, y, isLeftButtonD) {
			if (!this._id) return false;
			var data = {
				id: this._id,
				msg: {
					posX: Input.mousePos.x,
					posY: Input.mousePos.y,
					buttonDown: Input.isButtonDown(LEFT_BUTTON)
				}
			};

			this._sendMessage('mouseData', data);
		}
	}, {
		key: "_sendMessage",
		value: function _sendMessage(title, data) {
			this._sender.callIfCan();
			this._buffer.push([title, data]);
			this._socket.emit(title, data);
		}
	}, {
		key: "objectChange",
		value: function objectChange(o, action, keys) {
			if (!this._socket) return;
			var data = {
				id: this._id,
				msg: {
					action: action
				}
			};
			switch (action) {
				case ACTION_OBJECT_MOVE:
					data["msg"]["oId"] = o.id;
					data["msg"]["oL"] = o.layer;
					data["msg"]["oX"] = o.position.x;
					data["msg"]["oY"] = o.position.y;
					data["msg"]["oW"] = o.size.x;
					data["msg"]["oH"] = o.size.y;
					break;
				case ACTION_OBJECT_CHANGE:
					data["msg"]["oId"] = o.id;
					data["msg"]["oL"] = o.layer;
					data["msg"]["keys"] = {};

					each(keys, function (e, i) {
						return data.msg.keys["i"] = o[i];
					});
					break;
				case ACTION_OBJECT_DELETE:
					data["msg"]["oId"] = o.id;
					data["msg"]["oL"] = o.layer;
					break;
				case ACTION_OBJECT_CREATE:
					data["msg"]["o"] = o;
					break;
				default:
					Logger.error("nastala chyba lebo sa chce vykonať neznáma akcia: " + action);
					return;
			}
			this._sendMessage('action', data);
		}
	}, {
		key: "write",
		value: function write(msg) {
			this._sendMessage('broadcastMsg', { id: this._id, msg: msg });
		}
	}, {
		key: "isSharing",
		get: function get() {
			return this._sharing;
		}
	}, {
		key: "maxWatchers",
		get: function get() {
			return this._maximalWatchers;
		}
	}, {
		key: "duration",
		get: function get() {
			return Date.now() - this._startTime;
		}
	}, {
		key: "watcherUrl",
		get: function get() {
			return location.origin + "/watcher?id=" + this._id;
		}
	}]);

	return SharerManager;
}();

var TaskManager = function () {
	function TaskManager(results, title, layer) {
		var _this52 = this;

		_classCallCheck(this, TaskManager);

		this._title = title;
		this._layer = layer;
		this._resultCount = 0;
		this._results = {};
		this._start = Date.now();

		each(results, function (e, i) {
			_this52._results[i] = {
				correctValue: e,
				correct: false
			};
			_this52._resultCount++;
		});
		Logger.log("Bol vytvorený objekt " + this.constructor.name, LOGGER_COMPONENT_CREATE);
	}

	_createClass(TaskManager, [{
		key: "onSuccess",
		value: function onSuccess() {
			Logger.notif("Všetko je vyriešené správne");
		}
	}, {
		key: "_getMissingResultsCount",
		value: function _getMissingResultsCount() {
			var missing = 0;
			each(this._results, function (e) {
				if (!e.correct) missing++;
			});

			return missing;
		}
	}, {
		key: "checkResult",
		value: function checkResult(el) {
			if (this._results[el.id] && this._results[el.id].correctValue === el.text) {
				this._results[el.id].correct = true;
				this._results[el.id].time = Date.now();
				if (this._getMissingResultsCount() === 0) this.onSuccess();
				return true;
			}

			return false;
		}
	}, {
		key: "draw",
		value: function draw() {}
	}]);

	return TaskManager;
}();

function createTable(titles, data) {
	var row = G("tr", {}),
	    tbl = new G("table", {
		attr: { border: "1" },
		style: { borderCollapse: "collapse", width: "100%" }
	});
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = titles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var title = _step.value;

			row.append(new G("td", { cont: title, style: { padding: "5px", fontWeight: "bold", textAlign: "center" } }));
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

	tbl.append(row);
	for (var i in data) {
		row = G("tr", {});
		for (var j in data[i]) {
			row.append(new G("td", {
				style: { padding: "5px" },
				cont: j != 0 ? data[i][j] : getFormattedDate(data[i][j])
			}));
		}
		tbl.append(row);
	}
	return tbl;
}

var FormManager = function () {
	function FormManager(data) {
		_classCallCheck(this, FormManager);

		this._data = data;
		this._allowerAttributes = ["id", "style", "name", "value", "onclick", "onchange", "placeholder", "disabled", "visible"];
	}

	_createClass(FormManager, [{
		key: "createForm",
		value: function createForm(id) {
			return this._generateForm(this._data[id]);
		}
	}, {
		key: "_createInput",
		value: function _createInput(data) {
			var isChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (data["visible"] === false) return null;
			var i,
			    input,
			    result = new G("div", {});

			if (isIn(data["type"], "checkbox", "multiCheckbox") && !isChildren) {
				result.attr("class", "panel");
			}

			if (data["label"] && data["id"] && !isChildren) {
				result.append('<label for="' + data["id"] + '">' + data["label"] + ': </label>');
			}

			if (data["type"] === "multiCheckbox") {
				result.append(G.createElement("div", { cont: data["label"] }));
				var container = new G("div", {});

				for (i in data["items"]) {
					if (data["items"].hasOwnProperty(i)) {
						container.append(this._createInput(data["items"][i], true));
					}
				}

				result.append(container);
			} else if (data["type"] == "wrapper") {
				var wrapper = new G("div", {});
				FormManager._setAllCheckedAttributes(wrapper.first(), this._allowerAttributes, data);

				for (i in data["items"]) {
					if (data["items"].hasOwnProperty(i)) {
						wrapper.append(this._createInput(data["items"][i]));
					}
				}
				result.append(wrapper);
			} else if (data["type"] === "combobox") {
				input = new G("select", {});

				FormManager._setAllCheckedAttributes(input.first(), this._allowerAttributes, data);

				if (data["disabled"] === true) {
					input.attr("disabled", data["disabled"]);
				}

				for (i in data["options"]) {
					if (data["options"].hasOwnProperty(i)) {
						input.append(G.createElement("option", { value: data["options"][i].value }, data["options"][i].label));
					}
				}
				result.append(input);
			} else if (data["type"] === "plainText") {
				result.append(data["text"]);
			} else {
				input = new G("input", { attr: { type: data["type"] } });
				if (typeof data["checked"] === "boolean") {
					input.attr("checked", data["checked"]);
				}

				FormManager._setAllCheckedAttributes(input.first(), this._allowerAttributes, data);

				result.append(input);
			}
			if (isChildren) {
				result.append('<label for="' + data["id"] + '">' + data["label"] + ': </label>');
			}

			return result.first();
		}
	}, {
		key: "_generateForm",
		value: function _generateForm(form) {
			var result = new G("form", { cont: "<h2>" + form.title + "</h2><br/>" });

			for (var i in form.elements) {
				if (form.elements.hasOwnProperty(i)) {
					var element = this._createInput(form.elements[i]);
					if (element) {
						result.append(element);
					}
				}
			}

			return result.first();
		}
	}], [{
		key: "_setAllCheckedAttributes",
		value: function _setAllCheckedAttributes(element, allowedAttributes, data) {
			for (var i in allowedAttributes) {
				if (allowedAttributes.hasOwnProperty(i) && data[allowedAttributes[i]]) {
					element.setAttribute(allowedAttributes[i], data[allowedAttributes[i]]);
				}
			}
		}
	}]);

	return FormManager;
}();
