#target aftereffects

var dynamicContentToJSON = (function  (thisObj) {

    /* eslint-disable */

    /*
     * AEQuery scripting library
     * General purpose after effects scripting library.
    */

    var aeq = (function() {

    	/*jslint browser: true*/

    	/**
    	 * @namespace aeq
    	 */

    	/**
    	 * Gets objects by looking at a string and finding objects in After
    	 * Effects matching the description. The context is used to
    	 * determine a starting point for where the function starts looking
    	 * for elements.
    	 * If an `Array`, `CompItem`, `Layer`, or `Property` is given, the object will be
    	 * converted to the corresponding aequery object: `aeq.ArrayEx`, `aeq.Comp`,
    	 * `aeq.Layer`, `aeq.Property`.
    	 * @namespace aeq
    	 * @variation 1
    	 * @method
    	 * @param  {aeq.SelectorString|Array|CompItem|Layer|Property} selector A string containing
    	 *         a selector expression, or an object to be converted to aeq type object.
    	 * @param  {CompItem|FolderItem|Layer|PropertyGroup|Array} [context] The object
    	 *         to start looking from
    	 * @return {ArrayEx|aeq.Comp|aeq.Layer|aeq.Property} The found After Effects
    	 *         objects, or the converted AEQuery object
    	 */
    	var aeq = function(selector, context) {


    		if (aeq.isNullOrUndefined(selector))
    			return selector;

    		var result;

    		if (aeq.isAeq(selector))
    		{
    			result = selector;
    		}
    		else if (aeq.isString(selector))
    		{
    			result = aeq.select(selector, context);
    		}
    		else if (aeq.isArray(selector))
    		{
    			result = aeq.arrayEx(selector);
    		}
    		else if (aeq.isApp(selector))
    		{
    			result = aeq.app;
    		}
    		else if (aeq.isComp(selector))
    		{
    			result = new aeq.Comp(selector);
    		}
    		else if (aeq.isLayer(selector))
    		{
    			result = new aeq.Layer(selector);
    		}
    		else if (aeq.isProperty(selector))
    		{
    			result = new aeq.Property(selector);
    		}

    		result.aeq = true;

    		return result;
    	};

    	aeq.version = "0.4.0"

    	aeq.thisObj = this;

    	if ( typeof module === 'object' ) {
    		module.exports = aeq;
    	}

    	// Copy of jQuery.extend
    	/**
    	 * Merge the contents of two or more objects together into the first object.
    	 *
    	 * If only one object is given, the `aeq` object is assumed to be the target.
    	 *
    	 * @memberof aeq
    	 * @method
    	 * @return {Object} The merged object
    	 * @see [jQuery.extend]{@link https://api.jquery.com/jquery.extend/} for more
    	 *      information, this function uses the same api.
    	 * @example
    	 * var objectA = {
    	 *     test: "example"
    	 * };
    	 *
    	 * aeq.extend( objectA, {
    	 *     prop: "prop"
    	 * });
    	 *
    	 * // ObjectA is now
    	 * {
    	 *     test: "example",
    	 *     prop: "prop"
    	 * }
    	 */
    	aeq.extend = function() {
    		var options, name, src, copy, copyIsArray, clone,
    			target = setDefault(arguments[0], {}),
    			i = 1,
    			length = arguments.length,
    			deep = false;

    		// Handle a deep copy situation
    		if ( typeof target === "boolean" ) {
    			deep = target;

    			// Skip the boolean and the target
    			target = setDefault(arguments[ i ], {});
    			i++;
    		}

    		// Handle case when target is a string or something (possible in deep copy)
    		if ( typeof target !== "object" && !aeq.isFunction( target ) ) {
    			target = {};
    		}

    		// Extend aeq itself if only one argument is passed
    		if ( i === length ) {
    			target = this;
    			i--;
    		}

    		for ( ; i < length; i++ ) {

    			// Only deal with non-null/undefined values
    			if ( ( options = arguments[ i ] ) !== null ) {

    				// Extend the base object
    				for ( name in options ) {
    					src = target[ name ];
    					copy = options[ name ];

    					// Prevent never-ending loop
    					if ( target === copy ) {
    						continue;
    					}

    					// Recurse if we're merging plain objects or arrays
    					if ( deep && copy && ( aeq.isPlainObject( copy ) ||
    						( copyIsArray = aeq.isArray( copy ) ) ) ) {

    						if ( copyIsArray ) {
    							copyIsArray = false;
    							clone = src && aeq.isArray( src ) ? src : [];

    						} else {
    							clone = src && aeq.isPlainObject( src ) ? src : {};
    						}

    						// Never move original objects, clone them
    						target[ name ] = aeq.extend( deep, clone, copy );

    					// Don't bring in undefined values
    					} else if ( copy !== undefined ) {
    						target[ name ] = copy;
    					}
    				}
    			}
    		}

    		// Return the modified object
    		return target;
    	};

    	/**
    	 * Is executed for each element in an array
    	 * @callback forEachArrayCallback
    	 * @param {Any}     element The current element in the array
    	 * @param {Integer} index   The index of the current element in the array
    	 * @param {Array}   array   The array being looped through
    	 */

    	/**
    		* Is executed for key-value pair in an object
    		* @callback forEachObjectCallback
    		* @param {Any}     element The current key in the object
    		* @param {Integer} index   The value of the current key
    		* @param {Array}   array   The object being looped through
    		*/

    	/**
    	 * Loops through arrays and objects
    	 * @memberof aeq
    	 * @function
    	 * @param  {Array|Object}   obj       The array or object to loop through.
    	 * @param  {forEachArrayCallback|forEachObjectCallback} callback
    	 *         Function to execute for each element in the object or array
    	 * @return {Array|Object}             The value of `obj`
    	 */
    	aeq.forEach = function(obj, callback, fromIndex) {
    		var length, i;
    		if (obj && Object.prototype.toString.call(obj) === "[object Array]") {
    			length = obj.length;
    			i = fromIndex !== undefined ? fromIndex : 0;
    			for (; i < length; i++) {
    				if (callback(obj[i], i, obj) === false) {
    					break;
    				}
    			}
    		} else {
    			for (i in obj) {
    				if (obj.hasOwnProperty(i)) {
    					if (callback(i, obj[i], obj) === false) {
    						break;
    					}
    				}
    			}
    		}
    		return obj;
    	};

    	/**
    	 * Loops through arrays and objects and returns a filtered array
    	 * @memberof aeq
    	 * @function
    	 * @param  {Array|Object}   obj       The Array/object to loop through
    	 * @param  {forEachArrayCallback|forEachObjectCallback} callback  The function
    	 *         to execute for each element in the object. Should return a truthy
    	 *         value if the element should be included in the returned array.
    	 * @return {Array} The filtered array
    	 */
    	aeq.filter = function (obj, callback) {
    		var filteredArr = [],
    			length, i;
    		if (obj && Object.prototype.toString.call(obj) === "[object Array]") {
    			length = obj.length;
    			i = 0;
    			for (; i < length; i++) {
    				if (callback(obj[i], i, obj)) {
    					filteredArr.push(obj[i]);
    				}
    			}
    		} else {
    			for (i in obj) {
    				if (obj.hasOwnProperty(i)) {
    					if (callback(i, obj[i], obj)) {
    						filteredArr.push(obj[i]);
    					}
    				}
    			}
    		}
    		return filteredArr;
    	};

    	/**
    	 * Used for setting the default value in functions. Returns the first argument
    	 * is not undefined, else it returns `defaultVal`.
    	 * @method
    	 * @param  {Any} value      The value to check
    	 * @param  {Any} defaultVal The value to use if `value` is `undefined`
    	 * @return {Any}            `value` if it is not `undefined`, else `defaultVal`
    	 *
    	 * @example
    	 * function say( greeting ) {
    	 *     a = aeq.setDefault( greeting, 'Hello World!' )
    	 *     alert( a )
    	 * }
    	 */
    	aeq.setDefault = function (value, defaultVal) {
    		return typeof value == "undefined" ? defaultVal : value;
    	};

    	var setDefault = aeq.setDefault;


    	aeq.extend({

    		/**
    		 * Checks if value is null. Throws an error if it is not.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Any} o   The value to check against null.
    		 * @param  {String} err The error message to throw
    		 * @return {Boolean} `true` if no error was thrown
    		 */
    		assertIsNull: function (o, err) {
    			if (aeq.isNullOrUndefined(o))
    				return true;

    			throw new Error(err);
    		},

    		/**
    		 * Checks if value is null. Throws an error if it is.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Any} o   The value to check against null.
    		 * @param  {String} err The error message to throw
    		 * @return {Boolean} `true` if no error was thrown
    		 */
    		assertIsNotNull: function (o, err) {
    			if (!aeq.isNullOrUndefined(o))
    				return true;

    			throw new Error(err);
    		},

    		/**
    		 * Checks if value is `true`. Throws an error if it is not.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Any} o   The value to check against `true`.
    		 * @param  {String} err The error message to throw
    		 * @return {Boolean} `true` if no error was thrown
    		 */
    		assertIsTrue: function (o, err) {
    			if (o === true)
    				return true;

    			throw new Error(err);
    		},

    		/**
    		 * Checks if value is `false`. Throws an error if it is not.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Any} o   The value to check against `false`.
    		 * @param  {String} err The error message to throw
    		 * @return {Boolean} `true` if no error was thrown
    		 */
    		assertIsFalse: function (o, err) {
    			if (o === false)
    				return true;

    			throw new Error(err);
    		},

    		/**
    		 * Checks if array is empty. Throws an error if it is not.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Array} o   The array to check is empty.
    		 * @param  {String} err The error message to throw
    		 * @return {Boolean} `true` if no error was thrown
    		 */
    		assertIsEmpty: function (o, err) {
    			if (aeq.isEmpty(o))
    				return true;

    			throw new Error(err);
    		},

    		/**
    		 * Checks if array is empty. Throws an error if it is.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Array} o   The array to check is empty.
    		 * @param  {String} err The error message to throw
    		 * @return {Boolean} `true` if no error was thrown
    		 */
    		assertIsNotEmpty: function (o, err) {
    			if (!aeq.isEmpty(o))
    				return true;

    			throw new Error(err);
    		}
    	});





    	/**
    	 * Sets or gets an attribute value for all objects in an array. When getting a
    	 * value, it only returns the valure from the first object.
    	 * @memberof aeq
    	 * @see aeq.arrayEx.attr
    	 * @method
    	 * @param  {Any[]}  array         The array of objects to get or set attribute
    	 *                                values of.
    	 * @param  {string} attributeName The name of the attribute to get or set.
    	 * @param  {Any}    [newValue]    The value to set. If not given, will only get
    	 *                                the value of the first object.
    	 * @return {Any|undefined}        When getting, the value of the attribute.
    	 *                                When setting, `undefined`.
    	 */
    	aeq.attr = function(array, attributeName, newValue) {
    		var i, il;

    		// Throw error if only array is given
    		if ( arguments.length === 1 ) {
    			throw new Error( "Only one argument given to attr, must be 2 or 3" );
    		}

    		// Get value of attributeName for first object in the array if only attributeName is given
    		else if (arguments.length === 2) {
    			if ( array[0] !== undefined && array[0] !== null ) {
    				return getAttr( array[0], attributeName );
    			}
    			return undefined;

    		// Set value of attributeName for all objects in array if newValue is given
    		} else {
    			for ( i = 0, il = array.length; i < il; i++ ) {
    				setAttr( array[ i ], attributeName, newValue );
    			}
    			return array;
    		}
    	};

    	function getAttr(object, attributeName) {
    		if ( object[ attributeName ] instanceof Function ) {
    			return object[ attributeName ]();
    		}
    		return object[attributeName];
    	}

    	function setAttr(object, attributeName, newValue ) {
    		var attrSetters, setter;

    		// Check if there is a special setter for this object and attributeName
    		attrSetters = attr.setters[ object.toString() ];
    		if ( attrSetters !== undefined ) {
    			setter = attrSetters[ attributeName ];
    			if ( setter !== undefined ) {
    				attributeName = setter;
    			}
    		}

    		if ( object[ attributeName ] instanceof Function ) {
    			object[ attributeName ]( newValue );
    		} else {
    			object[attributeName] = newValue;
    		}
    		return object;
    	}

    	var attr = {
    		setters: {
    			"[object Property]": {
    				"value": "setValue"
    			}
    		}
    	};



    	aeq.extend({

    		/**
    		 * Gets all the item in a folder or project.
    		 * @method
    		 * @memberof aeq
    		 * @param  {FolderItem} [folder=app.project] The Folder to get items from.
    		 * @param  {boolean} [deep=true]             When `true`, gets items from
    		 *                                           subfolders as well.
    		 * @return {aeq.arrayEx}                     Array of Item objects
    		 */
    		getItems: function(folder, deep) {
    			// If no arguments are given, just return all items in project.
    			if (folder === undefined) {
    				return aeq.normalizeCollection(app.project.items);
    			}

    			deep = setDefault(deep, true);
    			folder = aeq.project.getFolder(folder);
    			if (folder === null) {
    				return aeq.arrayEx();
    			}

    			if (deep) {
    				return aeq.getItemsDeep(folder);
    			}

    			return aeq.normalizeCollection(folder.items);
    		},

    		/**
    		 * Returns an {@link aeq.arrayEx} with all items in a folder, and items in
    		 * subfolders.
    		 * @method
    		 * @param  {FolderItem} folder    The folder to flatten.
    		 * @return {aeq.arrayEx}          ArrayEx with Item objects.
    		 */
    		getItemsDeep: function(folder, returnArrayEx) {
    			// The returnArrayEx param is so we can skip the converting to arrayEx when
    			// recursing. It is not meant to be used outside of this function.
    			var item,
    				items = [],
    				len = folder.items.length;

    			for (var i=1; i <= len; i++) {
    				item = folder.items[i];
    				if (aeq.isFolderItem(item)) {
    					// Add all items in subfolder to the `items` array.
    					items.push.apply(items, aeq.getItemsDeep(item, false));
    				}
    				items.push(item);
    			}
    			// Skip converting to arrayEx when function is called by it self.
    			if (returnArrayEx === false) {
    				return items;
    			}
    			return aeq.arrayEx(items);
    		},

    		/**
    		 * Gets the all layers where the given Item object is used as a source.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Item} item    The item to find in comps
    		 * @return {aeq.arrayEx}  Array of Layer objects
    		 */
    		getItemInComps: function(item) {
    			var layers = []
    			aeq.forEach(item.usedIn, function(comp) {
    				aeq.forEachLayer(comp, function(layer) {
    					if (layer.source === item) {
    						layers.push(layer);
    					}
    				});
    			});
    			return aeq.arrayEx(layers);
    		},

    		/**
    		 * Gets all the CompItems in the project. Or all CompItems in the given folder.
    		 * @method
    		 * @memberof aeq
    		 * @param {FolderItem} [folder=app.project] The folder to get comps from.
    		 * @param {boolean} [deep=true]             Go through subfolders looking for comps.
    		 * @return {aeq.arrayEx} Array of CompItems
    		 */
    		getCompositions: function(folder, deep) {
    			var items = aeq.getItems(folder, deep)
    			return items.filter( aeq.isComp )
    		},

    		/**
    		 * Gets the active CompItem.
    		 * This gets `app.project.activeItem` and verifies that it is a comp. If it
    		 * not, it returns null.
    		 * @method
    		 * @memberof aeq
    		 * @return {CompItem|null} The active comp, or null if there is none.
    		 */
    		getActiveComposition: function () {
    			var activeItem = app.project.activeItem;
    			if (aeq.isComp(activeItem)) {
    				return activeItem;
    			}
    			return null;
    		},

    		/**
    		 * Gets the CompItem with the matching name, or `null` if none is found.
    		 * @method
    		 * @memberof aeq
    		 * @param  {string} name      The name of the comp to found
    		 * @return {CompItem|null}    The comp with the matching name, or null if
    		 *                            none is found
    		 */
    		getComposition: function (name) {
    			var length = app.project.items.length;

    			for (var i = 1; i <= length; i++) {
    				var item = app.project.item(i);
    				if (item.name === name && aeq.isComp(item)) {
    					return item;
    				}
    			}

    			// If the function have not returned by now, there is no comp with that name
    			return null;
    		},

    		/**
    		 * Gets all layers layers in a comp or an array of comps. This differs from
    		 * `comp.layers` in that this returns an actual array. Instead of a colletion
    		 * with a start index of 1.
    		 * @method
    		 * @memberof aeq
    		 * @param  {CompItem[]|CompItem} comps CompItem(s) to get layers from.
    		 * @return {aeq.arrayEx}         Layer objects in the comp(s)
    		 */
    		getLayers: function(comps) {
    			aeq.assertIsNotNull(comps, 'comps is null');

    			var arr = [];

    			if (aeq.isComp(comps)) {
    				comps = [comps];
    			}

    			for (var c=0; c < comps.length; c++) {
    				var comp = comps[c];
    				arr = arr.concat(aeq.normalizeCollection(comp.layers));
    			}

    			return aeq.arrayEx(arr);
    		},

    		/**
    		 * Gets selected layers from a given comp or from the active comp if no comp is given.
    		 * If there is no active comp, an empty array is returned.
    		 * @method
    		 * @memberof aeq
    		 * @param  {CompItem} [comp] The comp to get selected layers from.
    		 * @return {aeq.arrayEx}     Array of Layer objects.
    		 */
    		getSelectedLayers: function(comp) {
    			if (!aeq.isComp(comp)) {
    				comp = aeq.getActiveComp();
    			}
    			if (comp) {
    				return aeq.arrayEx(comp.selectedLayers);
    			}
    			return aeq.arrayEx();
    		},

    		/**
    		* Gets selected layers, or all layers if none is selected, from a given comp
    		* or from the active comp if no comp is given. If there is no active comp,
    		* an empty array is returned.
    		* @method
    		* @memberof aeq
    		* @param  {CompItem} [comp] Comp to get layers from
    		* @return {aeq.arrayEx}     Array of Layer objects
    		*/
    		getSelectedLayersOrAll: function(comp) {
    			if (!aeq.isComp(comp)) {
    				comp = aeq.getActiveComp();
    				if (comp === null) {
    					return aeq.arrayEx();
    				}
    			}

    			var layers = aeq.getSelectedLayers(comp);

    			if (layers.length === 0) {
    				return aeq.getLayers(comp);
    			}

    			return layers;
    		},

    		/**
    		 * Gets the selected properties on a layer or in a comp. Uses the active comp
    		 * if no argument is given. If there is no active comp, an empty array is
    		 * returned.
    		 * @method
    		 * @memberof aeq
    		 * @param  {CompItem|Layer} [obj] The object to get selected properties from.
    		 *         Defaults to the active comp.
    		 * @return {aeq.arrayEx}          Array of Property objects
    		 */
    		getSelectedProperties: function(obj) {
    			if (!obj) {
    				obj = aeq.getActiveComp();
    			}
    			if (obj) {
    				return aeq.arrayEx(obj.selectedProperties);
    			}
    			return aeq.arrayEx();
    		},

    		/**
    		 * Gets all Property objects of all Layer objects in an array.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Layer[]} layers   Layer Objects to get properties from.
    		 * @param  {Object} [options] Options for the function.
    		 * @param  {boolean} options.separate set to true to separate properties
    		 * (e.g separates Position into xPosition and yPosition). Default is true;
    		 * @return {aeq.arrayEx} Array of Property objects
    		 */
    		getProperties: function (layers, options) {
    			aeq.assertIsNotNull(layers, 'layer is null');

    			options = setDefault(options, { separate : true } );

    			var arr = [];

    			for (var l=0; l < layers.length; l++) {
    				var layer = layers[l];
    				arr = arr.concat(aeq.getPropertyChildren(layer, options));
    			}

    			return aeq.arrayEx(arr);
    		},

    		/**
    		 * Gets all children of the given layer or propertyGroup. This is a recursive
    		 * function, so it also gets grandchildren an so on.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Layer|PropertyGroup} propertyParent Object to get properties from
    		 * @param  {Object} [options] Options for the function.
    		 * @param  {boolean} options.separate set to true to separate properties
    		 * (e.g separates Position into xPosition and yPosition). Default is true;
    		 * @return {Array}            Array of Property objects
    		 */
    		getPropertyChildren: function(propertyParent, options) {
    			var arr = [];
    			var property;
    			var len = propertyParent.numProperties;
    			options = setDefault(options, { separate : false } );

    			for (var i=1; i <= len; i++)
    			{
    				property = propertyParent.property(i);

    				switch (property.propertyType)
    				{
    					case PropertyType.PROPERTY:
    						if (options.separate)
    							property = normalizeProperty(propertyParent, property);
    						if ( options.props !== false ) { // On by defualt
    							arr.push(property);
    						}
    						break;

    					case PropertyType.INDEXED_GROUP:
    					case PropertyType.NAMED_GROUP:
    						if ( options.groups === true ) { // Off by default
    							arr.push(property);
    						}
    						arr = arr.concat(aeq.getPropertyChildren(property, options));
    						break;

    					default:
    						break;

    				}
    			}

    			return arr;
    		},

    		/**
    		 * Gets the propertyGroups inside the effects group from all layers given.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Layer[]|Layer} layers The Layer(s) to get effects from.
    		 * @return {aeq.arrayEx}     Array of PropertyGroup objects
    		 */
    		getEffects: function(layers) {
    			aeq.assertIsNotNull(layers, 'layers is null');

    			if (aeq.isLayer(layers))
    				layers = [layers];

    			var arr = [];
    			var len = layers.length;
    			var effects, effectslen;

    			for (var l=0; l < len; l++) {
    				effects = layers[l].property("ADBE Effect Parade");
    				if ( effects === null )
    				{
    					return aeq.arrayEx();
    				}

    				effectslen = effects.numProperties;
    				for (var e = 1; e <= effectslen; e++) {
    					arr.push(effects.property(e));
    				}
    			}
    			return aeq.arrayEx(arr);
    		},

    		/**
    		 * Gets the Marker property group from the given layer or comp. If no object
    		 * is given, the active comp is used. If there is no active comp, `null` is
    		 * returned.
    		 * Note: Marker groups for comps is only available for After Effects version
    		 * 14.0 and later. If a comp is used in a earlier version. This function will
    		 * return `null`
    		 * @method
    		 * @memberof aeq
    		 * @param  {Layer|CompItem} [obj] The object to get the marker group from.
    		 * @return {MarkerPropertyGroup|null}
    		 */
    		getMarkerGroup: function(obj) {
    			if (!obj) {
    				obj = aeq.getActiveComp();
    			}

    			if (aeq.isLayer(obj))
    				return obj.property("ADBE Marker");

    			if (aeq.isComp(obj) && aeq.app.version >= 14.0)
    				return obj.markerProperty;

    			return null;
    		},

    		/**
    		 * Gets all keys on the given property or array of properties. Returns an
    		 * aeq.Keys object which can be used to see all attributes of the key.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Property|Property[]} property The Property or Properties to get
    		 *                               keys from.
    		 * @return {aeq.arrayEx}         Array of aeq.Key objects.
    		 */
    		getKeys: function(property) {
    			var arr = [], i, len;
    			if (aeq.isArray(property)) {
    				for (i = 0, len = property.length; i < len; i++) {
    					arr = arr.concat(aeq.getKeys(property[i]));
    				}
    				return aeq.arrayEx(arr);
    			}
    			for (i = 1, len = property.numKeys; i <= len; i++) {
    				arr.push(aeq.Key(property, i));
    			}
    			return aeq.arrayEx(arr);
    		},

    		getChildren: function(obj) {
    			var ret;
    			if (aeq.isComp(obj)) {
    				return aeq.normalizeCollection(obj.layers);
    			}
    			if (aeq.isLayer(obj) || aeq.isPropertyGroup(obj)) {
    				return aeq.getPropertyChildren(obj, {});
    			}
    			if (aeq.isArray(obj)) {
    				ret = aeq.arrayEx();
    				aeq.forEach(obj, function(item) {
    					ret.push.call(ret, aeq.getChildren(item));
    				});
    				return ret;
    			}
    		},

    		/**
    		 * Collection arrays have indexes in the range `1-Collection.length`, which is
    		 * usually not ideal when programming. This function takes a Collection object
    		 * and converts it to a normal array.
    		 * @method
    		 * @memberof aeq
    		 * @param  {Collection} collection The Collection to convert
    		 * @return {aeq.arrayEx}
    		 */
    		normalizeCollection: function(collection) {

    			// Because collection objects have a range [1...length], which is not ideal.
    			// This returns an array with all objects in the collection.
    			var ret = Array.prototype.slice.call(collection, 1);
    			var len = collection.length;
    			// Because the last object is at index Collection.length and slice only goes up to
    			// length - 1, we have to push the last object to the return value
    			if (len !== 0) {
    				ret.push(collection[len]);
    			}
    			return  aeq.arrayEx(ret);
    		},

    		/**
    		 * Converts frame count to time.
    		 * @method
    		 * @memberof aeq
    		 * @param  {number} frames
    		 * @param  {number} frameRate
    		 * @return {number}
    		 */
    		framesToTime: function(frames, frameRate) {
    			return frames / frameRate;
    		},

    		/**
    		 * Converts time to frame count.
    		 * @method
    		 * @memberof aeq
    		 * @param  {number} time
    		 * @param  {number} frameRate
    		 * @return {number}
    		 */
    		timeToFrames: function(time, frameRate) {
    			return time * frameRate;
    		}
    	});

    	// Short versions of some methods

    	/**
    	 * @see aeq.getComposition
    	 * @function
    	 */
    	aeq.getComp = aeq.getComposition;
    	/**
    	 * @see aeq.getCompositions
    	 * @function
    	 */
    	aeq.getComps = aeq.getCompositions;
    	/**
    	 * @see aeq.getActiveComposition
    	 * @function
    	 */
    	aeq.getActiveComp = aeq.activeComp = aeq.activeComposition = aeq.getActiveComposition;
    	/**
    	 * @see aeq.getSelectedProperties
    	 * @function
    	 */
    	aeq.getSelectedProps = aeq.getSelectedProperties;
    	/**
    	 * @see aeq.getSelectedLayersOrAll
    	 * @function
    	 */
    	aeq.getSelectedOrAllLayers = aeq.getSelectedLayersOrAll;


    	function normalizeProperty(propertyParent, property)
    	{
    		switch(property.name)
    		{
    			case 'X Position':
    			case 'Y Position':
    			case 'Z Position':
    				property = propertyParent.property('Position');
    				property.dimensionsSeparated = true;
    				return property.propertyGroup().property(property.name);

    			default:
    				return property;
    		}
    	}




    	aeq.extend({

    		/**
    		 * Loops through the layers of a comp, array of comps, or all layers in the
    		 * project, and executes a function for each one.
    		 * @method
    		 * @memberof aeq
    		 * @param  {CompItem|CompItem[]|forEachArrayCallback}   [obj]
    		 *         A `CompItem` or array of `compItem`s to get layers from.
    		 *         If this is function, the function will loop through all layers in
    		 *         the project.
    		 * @param  {forEachArrayCallback}
    		 *         callback The function to execute for each layer
    		 * @return {aeq}
    		 *         The AEQuery library.
    		 */
    		forEachLayer: function(obj, callback) {
    			if (aeq.isComp(obj) ) {
    				var length = obj.numLayers, i = 1;

    				for ( ; i <= length; i++) {
    					if (callback(obj.layer(i), i, obj) === false) {
    						break;
    					}
    				}
    			} else if (aeq.isArray(obj)) {
    				aeq.forEach(obj, function(obj ) {
    					aeq.forEachLayer(obj, callback);
    				});
    			} else if (aeq.isFunction(obj)) {
    				callback = obj;
    				aeq.forEachComp(function(comp) {
    					aeq.forEachLayer(comp, callback);
    				});
    			}
    			return aeq;
    		},

    		/**
    		 * Loops through the properties of a Comp, Layer, PropertyGroup, or an array
    		 * of any of them, and executes a function for each one.
    		 * @method
    		 * @memberof aeq
    		 * @param  {CompItem|Layer|PropertyGroup|Array|forEachArrayCallback}   [obj]
    		 *         The object or array of objects to get properties from.
    		 *         If this is function, the function will loop through all properties
    		 *         in the project.
    		 * @param  {forEachArrayCallback} callback
    		 *         The function to execute for each property
    		 * @return {aeq}
    		 *         The AEQuery library.
    		 */
    		forEachProperty: function(obj, callback) {
    			if (aeq.isLayer(obj) || aeq.isPropertyGroup(obj)) {
    				var properties = aeq.getPropertyChildren(obj, {});
    				aeq.forEach(properties, callback);
    			} else if (aeq.isComp(obj)) {
    				aeq.forEachLayer(obj, function(layer) {
    					var properties = aeq.getPropertyChildren(layer, {});
    					aeq.forEach(properties, callback);
    				});
    			} else if (aeq.isArray(obj)) {
    				aeq.forEach(obj, function(obj) {
    					aeq.forEachProperty(obj, callback);
    				});
    			} else if (aeq.isFunction(obj)) {
    				callback = obj;
    				aeq.forEachLayer(function(layer) {
    					aeq.forEachProperty(layer, callback);
    				});
    			}
    			return aeq;
    		},

    		/**
    		 * Loops through the effects in a Comp, or on a Layer, and executes a function
    		 * for each one.
    		 * @method
    		 * @memberof aeq
    		 * @param  {CompItem|Layer|Array|forEachArrayCallback}   [obj]
    		 *         The object or array of objects to get effects from.
    		 *         If this is function, the function will loop through all properties
    		 *         in the project.
    		 * @param  {forEachArrayCallback} callback
    		 *         The function to execute for each effect
    		 * @return {aeq}
    		 *         The AEQuery library.
    		 */
    		forEachEffect: function(obj, callback) {
    			var i, length, effects;
    			if (aeq.isLayer(obj)) {
    				effects = obj.property("ADBE Effect Parade");
    				length = effects.numProperties;

    				for ( i = 1; i <= length; i++) {
    					if (callback(effects.property(i), i, effects) === false) {
    						break;
    					}
    				}
    			} else if (aeq.isComp(obj)) {
    				aeq.forEachLayer(obj, function(layer) {
    					aeq.forEachEffect(layer, callback);
    				});
    			} else if (aeq.isArray(obj)) {
    				aeq.forEach(obj, function(obj) {
    					aeq.forEachEffect(obj, callback);
    				});
    			} else if (aeq.isFunction(obj)) {
    				callback = obj;
    				aeq.forEachLayer(function(layer) {
    					aeq.forEachEffect(layer, callback);
    				});
    			}
    			return aeq;
    		},

    		/**
    		 * Loops through the comps in a project and executes a function for each one.
    		 * @method
    		 * @memberof aeq
    		 * @param  {forEachArrayCallback} callback
    		 *         The function to execute for each comp.
    		 * @return {aeq}
    		 *         The AEQuery library.
    		 */
    		forEachComp: function(callback) {
    			aeq.forEach(aeq.getCompositions(), callback);
    		},

    		/**
    		 * Loops through the Project items in a project and executes a function
    		 * for each one.
    		 * @method
    		 * @memberof aeq
    		 * @param  {forEachArrayCallback} callback
    		 *         The function to execute for each item.
    		 * @return {aeq}
    		 *         The AEQuery library.
    		 */
    		forEachItem: function(callback) {
    			var project = app.project;
    			var items = project.items;
    			var length = items.length;
    			for (var i = 1; i <= length; i++) {
    				if (callback(items[i], i, project) === false) {
    					break;
    				}
    			}
    			return aeq;
    		},

    		/**
    		 * Loops through the items in the renderqueue and executes a function
    		 * for each one.
    		 * @method
    		 * @memberof aeq
    		 * @param  {forEachArrayCallback} callback
    		 *         The function to execute for each renderQueue Item.
    		 * @return {aeq}
    		 *         The AEQuery library.
    		 */
    		forEachRenderQueueItem: function(callback) {
    			var renderQueue = app.project.renderQueue;
    			var renderQueueItems = renderQueue.items;
    			var length = renderQueueItems.length;
    			for (var i = 1; i <= length; i++) {
    				if (callback(renderQueueItems[i], i, renderQueue) === false) {
    					break;
    				}
    			}
    			return aeq;
    		},

    		/**
    		 * Loops through the output modules in the renderqueue and executes a function
    		 * for each one.
    		 * @method
    		 * @memberof aeq
    		 * @param  {forEachArrayCallback} callback
    		 *         The function to execute for each Output Module.
    		 * @return {aeq}
    		 *         The AEQuery library.
    		 */
    		forEachOutputModule: function(callback) {
    			aeq.forEachRenderQueueItem(function(item) {
    				var length = item.outputModules.length;
    				for (var i = 1; i <= length; i++) {
    					if (callback(item.outputModules[i], i, item) === false) {
    						break;
    					}
    				}
    			});
    			return aeq;
    		}
    	});

    	// forEach aliases
    	/**
    	 * @see aeq.forEachProperty
    	 * @function
    	 */
    	aeq.forEachProp = aeq.forEachProperty;
    	/**
    	 * @see aeq.forEachComp
    	 * @function
    	 */
    	aeq.forEachComposition = aeq.forEachComp;
    	/**
    	 * @see aeq.forEachRenderQueueItem
    	 * @function
    	 */
    	aeq.forEachRQItem = aeq.forEachRenderQueueItem;
    	/**
    	 * @see aeq.forEachOutputModule
    	 * @function
    	 */
    	aeq.forEachOM = aeq.forEachOutputModule;





    	/**
    	 * @typedef {String} aeq.SelectorString
    	 * @description The selectorString has 3 expression types:
    	 *
    	 * - type
    	 * - props
    	 * - pseudo
    	 *
    	 * #### Type
    	 *
    	 * The type of object to find, one of:
    	 *
    	 * - `item`: Finds items in the project panel
    	 * - `activecomp`: Finds the active composition
    	 * - `comp`/`composition`: Finds CompItems
    	 * - `layer`: Finds Layers
    	 * - `propertygroup`/`propgrp`/`propgroup`: Finds property groups
    	 * - `prop`/`property`: Finds properties`
    	 * - `effect`: Finds effects property groups
    	 * - `key`: Finds keyframes on properties. Returns aeq.Key objects
    	 *
    	 * The types can be chained after each other, but must be in the order above,
    	 * but all of them are optional. Only the objects of the last specified `type`
    	 * will be returned.
    	 *
    	 * Type is the only expression type that is required. All other expression
    	 * types are optional.
    	 *
    	 * #### Props
    	 * written right after the type, without a space, and inside square brackes
    	 * (`[ ]`). The props are a list attribute names and values, separated by `=`.
    	 * The objects must have an attribute with the specified value to qualify as
    	 * a match. Attributes are separated by a space.
    	 *
    	 * #### Pseudo
    	 * Psoudo are a bit like `props` but start with a colon, `:`, followed by a
    	 * keyword specifying how the attributes should match. The attributes are
    	 * placed inside parenthesis `()`.
    	 *
    	 * The keywords that are currently supported are:
    	 *
    	 * - `:is()`: all attributes must match.
    	 * - `:has()`: same as `:is()`
    	 * - `:not()`: objects should not have any attributes matching the props.
    	 * - `:isnot()`: same as `:not()`
    	 *
    	 * Psoudo selectors can be chained.
    	 *
    	 * @example <caption>Get all comps with width and height of 1920x1080</caption>
    	 *     aeq("comp[width=1920 heigth=1080]")
    	 *
    	 * @example <caption>Get all properties of layers that are selected and
    	 *          does not have audio:</caption>
    	 *     aeq("layer[selected hasAudio=false] prop")
    	 *
    	 * @example <caption>Get properties that have `PropertyValueType.OneD` and are
    	 *          not selected.</caption>
    	 *     aeq("prop[propertyValueType=" + PropertyValueType.OneD + "]:not(selected)");
    	 *
    	 * @example <caption>Get layers that do not have audio inside comps
    	 *          that are selected:</caption>
    	 *    aeq("comp:is(selected) layer:not(hasAudio)")
    	 */

    	/**
    	 * Gets objects by looking at a string and finding objects in After Effects
    	 * matching the description. The context is used to determine a starting point
    	 * for where the function starts looking for elements.
    	 * @memberof aeq
    	 * @method
    	 * @param  {aeq.SelectorString} selector A string containing a
    	 *         selector expression
    	 * @param  {CompItem|FolderItem|Layer|PropertyGroup|Array} [context] The object
    	 *         to start looking from
    	 * @return {ArrayEx} The found After Effects objects
    	 */
    	aeq.select = function (selector, context) {
    		var results = [];

    		var parsedSelector = cssselector.parse(selector);
    		var parts = parsedSelector;

    		if (context !== undefined) {
    			if (aeq.isString(context)) {
    				results = aeq.select(context);
    			} else if (aeq.isArray(context)) {
    				results = context;
    			} else {
    				results = [context];
    			}
    		}

    		while (parts.length > 0) {
    			var part = parts[0];
    			var unshifted = false;

    			switch (part.type) {
    				case 'activecomp':
    					results = filterResults(aeq.arrayEx([aeq.getActiveComposition()]));
    					results.type = "comp";
    					break;
    				case 'composition':
    				case 'comp':
    					results = filterResults(aeq.getCompositions());
    					results.type = "comp";
    					break;

    				case 'layer':
    					if (results.type === "comp" || aeq.isComp(results[0])) {
    						results = filterResults(aeq.getLayers(results));
    						results.type = "layer";
    					} else if (results.type !== "comp") {
    						parts.unshift({ type : 'comp' });
    						unshifted = true;
    					}
    					break;

    				case 'propertygroup':
    				case 'propgrp':
    				case 'propgroup':
    					if ( results.type === "layer" || results.type === "propertygroup" ||
    						aeq.isLayer(results[0]) || aeq.isPropertyGroup(results[0])) {
    						results = filterResults(aeq.getProperties(results,
    							{ separate : false, groups: true, props: false }));
    						results.type = "propertygroup";
    					} else if (results.type !== "layer") {
    						parts.unshift({ type : 'layer' });
    						unshifted = true;
    					}
    					break;

    				case 'property':
    				case 'prop':
    					if (results.type === "layer" || results.type === "propertygroup" ||
    						aeq.isLayer(results[0]) || aeq.isPropertyGroup(results[0])) {
    						results = filterResults(aeq.getProperties(results, { separate : false }));
    						results.type = "property";
    					} else if (results.type !== "layer") {
    						parts.unshift({ type : 'layer' });
    						unshifted = true;
    					}
    					break;

    				case 'effect':
    					if (results.type === "layer" || aeq.isLayer(results[0]) ) {
    						results = filterResults(aeq.getEffects(results));
    						results.type = "effect";
    					} else if (results.type !== "layer") {
    						parts.unshift({ type : 'layer' });
    						unshifted = true;
    					}
    					break;

    				case 'key':
    				case 'keys':
    					if (results.type === "property" || aeq.isProperty(results[0]) ) {
    						results = filterResults(aeq.getKeys(results));
    						results.type = "key";
    					} else if (results.type !== "property") {
    						parts.unshift({ type : 'property' });
    						unshifted = true;
    					}
    					break;

    				case 'item':
    					results = filterResults(aeq.getItems());
    					results.type = "item";
    					break;

    				default:
    					throw new Error("Unrecognized token " + part.type);
    			}
    			if (!unshifted) {
    				parts.shift();
    			}
    		}
    		function filterResults(arr) {

    			// Only filter if there is something to filter
    			if (part.props || part.pseudo) {
    				return arr.filter(filter);
    			}
    			return arr;
    		}

    		function filter(obj) {
    			var ret = true, len, pseudo;
    			if (part.props !== null) {
    				if (!hasAllAttributes(obj, part.props, false)) {
    					return false;
    				}
    			}
    			if (!part.pseudo) {
    				return true;
    			}
    			len = part.pseudo.length;

    			for (var i = 0; i < len; i++) {
    				pseudo = part.pseudo[i];

    				if (pseudo.type === "not" || pseudo.type === "isnot") {
    					ret = hasAllAttributes(obj, pseudo.props, true);
    				} else if (pseudo.type === "is" || pseudo.type === "has") {
    					ret = hasAllAttributes(obj, pseudo.props, false);
    				}

    				if (ret === false) {
    					return false;
    				}
    			}
    			return true;
    		}

    		return aeq.arrayEx(results);
    	};


    	function hasAllAttributes(obj, attributes, not) {
    		var attributeValue;
    		for (var attribute in attributes) {
    			if (!attributes.hasOwnProperty(attribute)) {
    				continue;
    			}
    			attributeValue = attributes[attribute];

    			if (!obj.hasOwnProperty(attribute)) {
    				throw new Error('The attribute ' + attribute + ' does not exist on a ' + typeof(obj));
    			}

    			var isSame = compare(attributeValue, obj[attribute]);

    			// Return false if it is the same and it should not be,
    			// or if it isn't the same and it should be
    			if ((isSame && not) || (!isSame && not === false)) {
    				return false;
    			}
    		}
    		return true;
    	}

    	function compare(value, attribute) {
    		if (value.type === "Array") {
    			return valueInArray(value, attribute);
    		} else if (value.type === "RegExp") {
    			return value.value.test(attribute);

    		// For numbers, strings, booleans etc.
    		} else {
    			return value.value.toString() === attribute.toString();
    		}
    	}

    	function valueInArray(value, attribute) {
    		// Check if value is in array
    		for (var i = 0, il = value.value.length; i < il; i++) {
    			if (compare(value.value[i], attribute)) {
    				return true;
    			}
    		}
    		return false;
    	}




    	aeq.extend({

    		/**
    		 * Returns `true` if argument is null or undefined, false otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isNullOrUndefined: function(o) {
    			// Using truthiness to capture both 'undefined' and 'null'
    			return o == null;
    		},

    		/**
    		 * Returns `true` if argument is a boolean (`true` or `false`),
    		 * `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isBoolean: function(o) {
    			return typeof o === "boolean";
    		},

    		/**
    		 * Returns `true` if argument is a number, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isNumber: function(o) {
    			return typeof o === "number";
    		},

    		/**
    		 * Returns `true` if argument is a string, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isString: function(o) {
    			return typeof o === "string";
    		},

    		/**
    		 * Returns `true` if argument is an object, `false` otherwise. This will most
    		 * likely return `true` most of the time, as most things are objects. Try to
    		 * use a different function to check the type, if applicable.
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isObject: function(o) {
    			return o instanceof Object;
    		},

    		/**
    		 * Returns `true` if argument is a plain object, i.e an object created
    		 * using `{}` or `new Object()`, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isPlainObject: function(obj) {

    			// Not plain objects:
    			// - Any object or value whose internal [[Class]] property is not "[object Object]"
    			// - After Effects objects
    			if ( obj === undefined || obj === null ) {
    				return false;
    			}
    			if ( obj.toString() !== "[object Object]" ) {
    				return false;
    			}

    			if ( obj.constructor &&
    					!obj.constructor.prototype.hasOwnProperty("isPrototypeOf") ) {
    				return false;
    			}

    			// If the function hasn't returned already, we're confident that
    			// |obj| is a plain object, created by {} or constructed with new Object
    			return true;
    		},

    		/**
    		 * Returns `true` if argument is an array, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isArray: function(o) {
    			return o instanceof Array;
    		},

    		/**
    		 * Returns `true` if the passed array is empty, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Array} o The array to check
    		 * @return {Boolean}
    		 */
    		isEmpty: function(o) {
    			return o.length === undefined || o.length === 0;
    		},

    		/**
    		 * Returns `true` if argument is a function, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isFunc: function(o) {
    			return o instanceof Function;
    		},

    		/**
    		 * ???
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isAeq: function(o) {
    			return o instanceof Object && o.isAeq === true;
    		},

    		/**
    		 * Returns `true` if argument is the Application object, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isApp: function(o) {
    			return o instanceof Application;
    		},

    		/**
    		 * Returns `true` if argument is a Folder object, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isFolder: function(o) {
    			return o instanceof Folder;
    		},

    		/**
    		 * Returns `true` if argument is a File object, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isFile: function(o) {
    			return o instanceof File;
    		},

    		/**
    		 * Returns `true` if argument is a FolderItem, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isFolderItem: function(o) {
    			return o instanceof FolderItem;
    		},

    		/**
    		 * Returns `true` if argument is a FootageItem, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isFootageItem: function(o) {
    			return o instanceof FootageItem;
    		},

    		/**
    		 * Returns `true` if argument is a Compitem, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isComp: function(o) {
    			return o instanceof CompItem;
    		},

    		/**
    		 * Returns `true` if argument is an AVLayer, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isAVLayer: function(o) {
    			return o instanceof AVLayer;
    		},

    		/**
    		 * Returns `true` if argument is a ShapeLayer, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isShapeLayer: function(o) {
    			return o instanceof ShapeLayer;
    		},

    		/**
    		 * Returns `true` if argument is a TextLayer, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isTextLayer: function(o) {
    			return o instanceof TextLayer;
    		},

    		/**
    		 * Returns `true` if argument is a CameraLayer, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isCameraLayer: function(o) {
    			return o instanceof CameraLayer;
    		},

    		/**
    		 * Returns `true` if argument is a LightLayer, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isLightLayer: function(o) {
    			return o instanceof LightLayer;
    		},

    		/**
    		 * Returns `true` if a layer is a precomp, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Layer} o The layer to check
    		 * @return {Boolean}
    		 */
    		isPrecomp: function(o) {
    			if (!aeq.isLayer(o)) return false;
    			return aeq.isComp(o.source);
    		},

    		/**
    		 * Returns `true` if argument is any kind of layer, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isLayer: function(o) {
    			return aeq.isAVLayer(o) ||
    				aeq.isShapeLayer(o) ||
    				aeq.isTextLayer(o) ||
    				aeq.isCamera(o) ||
    				aeq.isLight(o);
    		},

    		/**
    		 * Returns `true` if argument is a Property, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isProperty: function(o) {
    			return o instanceof Property;
    		},

    		/**
    		 * Returns `true` if argument is a PropertyGroup, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isPropertyGroup: function(o) {
    			return o instanceof PropertyGroup;
    		},

    		/**
    		 * Returns `true` if argument is a Panel object, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isPanel: function(o) {
    			return o instanceof Panel;
    		},

    		/**
    		 * Returns `true` if argument is a Window object, `false` otherwise
    		 * @function
    		 * @memberof aeq
    		 * @param  {Any} o The value to check
    		 * @return {Boolean}
    		 */
    		isWindow: function(o) {
    			return o instanceof Window;
    		},

    		/**
    		 * ???
    		 * @function
    		 * @memberof aeq
    		 * @param  {Object} obj The object
    		 * @return {String}
    		 */
    		reflect: function (obj) {
    			var str = [];

    			for (var m in obj) {
    				if (obj.hasOwnProperty(m)) {
    					str.push(obj[m].constructor.name + ' ' + m + '=' + obj[m]);
    				}
    			}

    			return str.join();
    		}
    	});

    	// Function Aliases

    	/**
    	 * @see aeq.isBoolean
    	 * @function
    	 */
    	aeq.isBool = aeq.isBoolean;
    	/**
    	 * @see aeq.isNumber
    	 * @function
    	 */
    	aeq.isNum = aeq.isNumber;
    	/**
    	 * @see aeq.isString
    	 * @function
    	 */
    	aeq.isStr = aeq.isString;
    	/**
    	 * @see aeq.isObject
    	 * @function
    	 */
    	aeq.isObj = aeq.isObject;
    	/**
    	 * @see aeq.isArray
    	 * @function
    	 */
    	aeq.isArr = aeq.isArray;
    	/**
    	 * @see aeq.isFunc
    	 * @function
    	 */
    	aeq.isFunction = aeq.isFunc;
    	/**
    	 * @see aeq.isComp
    	 * @function
    	 */
    	aeq.isComposition = aeq.isComp;
    	/**
    	 * @see aeq.isProperty
    	 * @function
    	 */
    	aeq.isProp = aeq.isProperty;
    	/**
    	 * @see aeq.isFolder
    	 * @function
    	 */
    	aeq.isDir = aeq.isDirectory = aeq.isFolder;
    	/**
    	 * @see aeq.isCameraLayer
    	 * @function
    	 */
    	aeq.isCamera = aeq.isCameraLayer;
    	/**
    	 * @see aeq.isLightLayer
    	 * @function
    	 */
    	aeq.isLight = aeq.isLightLayer;




    	/**
    	 * Creates and alerts an aequery error from a JS error
    	 * @method
    	 * @memberof aeq
    	 * @param  {Error} err JS error object
    	 * @param  {type} args [description]
    	 */
    	aeq.error = function(err, args) {
    		var callingFunction = /\s*function\s*([^\(]*)/i.exec(err.source);
    		callingFunction = callingFunction !== null && callingFunction[ 1 ] !== ''
    			? callingFunction[ 1 ]
    			: "anonymous";

    		alert(err.toString() + "\n" +
    			"Script File: " + File.decode(err.fileName).replace(/^.*[\\|\/]/, "") +

    			// arguments.callee is the more reliable way of getting the function name
    			"\nFunction: " + (args === undefined ? callingFunction : args.callee.name) +
    			(args === undefined || args.length === 0
    				? ""
    				: "\nArguments: " + Array.prototype.toString.call(args)) +
    			"\nError on Line: " + err.line.toString()
    		);
    	};





    		/**
    		 * Returns a pressed-state object of modifier keys
    		 * @method
    		 * @memberof aeq
    		 * @return {{meta: boolean, ctrl: boolean, alt: boolean, shift: boolean}} Pressed-states object of modifier keys
    		 */
    		aeq.getModifiers = function() {
    			return {
    				meta: ScriptUI.environment.keyboardState.metaKey,
    				ctrl: ScriptUI.environment.keyboardState.ctrlKey,
    				alt: ScriptUI.environment.keyboardState.altKey,
    				shift: ScriptUI.environment.keyboardState.shiftKey
    			};
    		};




    	aeq.extend({
    		/**
    		 * Saves object of name:binaryContents pairs to files, returns object of files
    		 * @method
    		 * @memberof aeq
    		 * @param  {{name: contents}} resources Object of name:contents pairs
    		 * @param  {Folder|string} folderPath   String path to a folder, or folder object
    		 * @param  {string} extension           File extension to save files as
    		 * @return {{name: File}}             Object of created files
    		 */
    		createResourceFiles: function(resources, folder, extension) {
    			if (!aeq.app.securityPrefEnabled()) {
    				return false;
    			}
    			folder = aeq.getFolderObject(folder);
    			extension = setDefault(extension, "");
    			if (extension !== "" && extension.charAt(0) !== ".") {
    				extension = "." + extension;
    			}

    			aeq.file.ensureFolderExists(folder);

    			if (!folder.exists) {
    				throw new Error("Could not create resource folder: " + folder.fsname);
    			}

    			var resourceFiles = {};
    			aeq.forEach( resources, function(name, contents) {
    				var filePath = aeq.file.joinPath(folder.fsName, name + extension);
    				var file = new File(filePath);
    				resourceFiles[name] = file;

    				if (!file.exists || contents.length !== file.length) {
    					file.encoding = "BINARY";
    					file.open("w");
    					var success = file.write(contents);
    					if (!success) {
    						if (file.error === "") {
    							resourceFiles[name] = null;
    						} else {
    							resourceFiles[name] = new Error(file.error, file.fsName, undefined);
    						}
    					}
    					file.close();
    				}
    			});
    			return resourceFiles;
    		},

    		/**
    		 * Takes a file (or file path) and converts it to a binary string
    		 * @method
    		 * @memberof aeq
    		 * @param  {File|string} filePath Path or file to get data from
    		 * @return {string}               Binary string of file data
    		 */
    		getBinaryString: function(filePath) {
    			var file = aeq.getFileObject(filePath);

    			file.encoding = "BINARY";
    			file.open('r');
    			var fileData = file.read();
    			file.close();

    			var binaryString = fileData.toSource();

    			binaryString = binaryString.replace(/^\(new String\(\"/, "");
    			binaryString = binaryString.replace(/\"\)\)$/, "");

    			return binaryString;
    		}
    	});

    	// Function aliases




    	aeq.extend({
    		/**
    		 * `true` if system is a MacOS
    		 * @memberof aeq
    		 * @type {Boolean}
    		 */
    		isMac: $.os.indexOf("Windows") === -1,

    		/**
    		 * `true` if system is a Windows
    		 * @memberof aeq
    		 * @type {Boolean}
    		 */
    		isWindows: $.os.indexOf("Windows") !== -1,

    		/**
    		 * Gets a string containing current OS, AE version and AE language
    		 * @method
    		 * @memberof aeq
    		 * @return {string} String containing current OS, AE version and AE language
    		 */
    		getSystemInfo: function() {
    			return $.os + " AE " + app.version + "/" + app.isoLanguage;
    		}
    	});

    	aeq.isWin = aeq.isWindows;




    	aeq.extend({
    		/**
    		 * Creates an undoGroup and wraps passed function in it
    		 * @method
    		 * @memberof aeq
    		 * @param  {string}    name     Undo group name
    		 * @param  {Function}  callback Function to wrap in undo group
    		 * @param  {any|array} args     Argument or array of arguments to pass to callback
    		 * @return {any}                Returned value from function
    		 */
    		createUndoGroup: function(name, callback, args) {
    			app.beginUndoGroup(name);
    			if (!aeq.isArray(args)) {
    				args = [args];
    			}
    			var value = callback.apply(null, args);
    			app.endUndoGroup();

    			return value;
    		}
    	});

    	// Function aliases
    	aeq.undoGroup = aeq.createUndoGroup;




    	aeq.extend({
    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq
    		 * @param  {type} value [description]
    		 * @param  {type} obj   [description]
    		 * @return {type}       [description]
    		 */
    		valueInObject: function(value, obj) {
    			for (var key in obj) {
    				if (obj.hasOwnProperty(key)) {
    					if (value === obj[key]) {
    						return key;
    					}
    				}
    			}
    			return undefined;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq
    		 * @param  {type} property [description]
    		 * @return {type}          [description]
    		 */
    		propertyType: function(property) {
    			// Uses the propertyType attribute if it is not undefined
    			return aeq.valueInObject(property.propertyType || property, PropertyType);
    		}
    	});

    	// Function aliases




    	/**
    	 * [app description]
    	 * @namespace aeq.app
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.app = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.App]";
    		},

    		// Function for extending the object using objects
    		extend: aeq.extend,

    		/**
    		 * The After Effects version
    		 * @memberof aeq.app
    		 * @type {number}
    		 */
    		version: parseFloat(app.version),

    		/**
    		 * Checks whether AE security pref is enabled
    		 * @method
    		 * @memberof aeq.app
    		 * @return {boolean} Security pref status
    		 */
    		securityPrefEnabled : function() {
    			return app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY") == 1;
    		},

    		/**
    		 * Gets user data folder;
    		 * In Windows: the value of %USERDATA% (by default, C:\Documents and Settings\username\Application Data)
    		 * In Mac OS: ~/Library/Application Support
    		 * @method
    		 * @memberof aeq.app
    		 * @return {Folder} User data folder
    		 */
    		getUserDataFolder: function() {
    			return Folder.userData;
    		},

    		/**
    		 * Gets current script file object
    		 * @method
    		 * @memberof aeq.app
    		 * @return {File} File object of current script
    		 */
    		getScriptFile: function() {
    			return aeq.getFile($.fileName);
    		},

    		/**
    		 * Gets current AEP file object
    		 * @method
    		 * @memberof aeq.app
    		 * @return {File} File object of current AEP
    		 */
    		getAEP: function() {
    			return app.project.file;
    		},

    		/**
    		 * Gets folder containing current AEP, or null if AEP is not saved
    		 * @method
    		 * @memberof aeq.app
    		 * @return {Folder|null} Parent directory of current AEP
    		 */
    		getAEPDir: function() {
    			var aepFile = aeq.app.getAEP();

    			if (!aepFile)
    				return null;

    			return aeq.getFolder(aepFile.path);
    		},

    		/**
    		 * Gets filename of current AEP, or null if AEP is not saved
    		 * @method
    		 * @memberof aeq.app
    		 * @return {string|null} Filename of current AEP
    		 */
    		getAEPName: function() {
    			var aepFile = aeq.app.getAEP();
    			if (!aepFile) return null;
    			return aeq.file.stripExtension(aepFile.displayName);
    		},

    		/**
    		 * Gets array of both default preset folder paths
    		 * One in the user directory, one in the AE install directory
    		 * @method
    		 * @memberof aeq.app
    		 * @return {string[]} Array of preset folder paths
    		 */
    		getPresetsPaths: function () {
    			var appVersion = aeq.app.version;
    			var versionPrettyName = "";

    			if (parseInt(appVersion) == 11)
    				versionPrettyName = 'CS6';
    			else if (parseInt(appVersion) == 12)
    				versionPrettyName = 'CC';
    			else if (appVersion >= 13.0 && appVersion < 13.5)
    				versionPrettyName = 'CC 2014';
    			else if (appVersion >= 13.5 && appVersion < 14.0)
    				versionPrettyName = 'CC 2015';
    			else if (appVersion >= 14.0)
    				versionPrettyName = 'CC 2017';

    			return [
    				Folder.current.fullName + '/Presets/',
    				Folder.myDocuments.fullName + '/Adobe/After Effects ' + versionPrettyName + '/User Presets/',
    			];
    		},

    		/**
    		 * Checks security pref setting, prompting user to enable it if not
    		 * Throws an error if user declines prompt
    		 * @method
    		 * @memberof aeq.app
    		 */
    		ensureSecurityPrefEnabled: function() {
    			if (!aeq.app.securityPrefEnabled()) {

    				if (confirm("This script requires access to write files.\n" +
    					"Go to the \"General\" panel of the application preferences and ensure\n" +
    					"\"Allow Scripts to Write Files and Access Network\" is checked.\n\nOpen prefs now?")) {

    					app.executeCommand(2359); // launch prefs
    				}

    				if (!aeq.app.securityPrefEnabled())
    					throw new Error( "Security preference is not enabled! Can't continue." );
    			}
    		},

    		/**
    		 * Opens an AEP
    		 * @method
    		 * @memberof aeq.app
    		 * @param  {File|string} filePath AEP path or file object to open
    		 * @return {File}                 Newly-opened AEP
    		 */
    		open: function(filePath) {
    			var file = aeq.getFile(filePath);

    			if (file)
    				return app.open(file);

    			return app.open();
    		}
    	});

    	// Function aliases
    	aeq.open = aeq.app.open;
    	aeq.AEversion = aeq.app.version;




    	/**
    	 * Module for interacting with the command line / system
    	 * @namespace aeq.command
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.command = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.command]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * Call a command-line/system command.
    		 * @method
    		 * @memberof aeq.command
    		 * @param  {string|object} windows           Command to call if OS is windows,
    		 *                                           or an object with options.
    		 * @param  {string}        [windows.win]     Command to call if OS is windows.
    		 * @param  {string}        [windows.windows] Command to call if OS is windows.
    		 * @param  {string}        [windows.mac]     Argument to give the command.
    		 * @param  {string}        [windows.arg]     Command to call if OS is MacOS.
    		 * @param  {string}        [mac]             Command to call if OS is MacOS.
    		 * @param  {string}        [arg]             Argument to give the command.
    		 * @return {string}        The value returned from the command.
    		 *
    		 * @example
    		 * <caption>Open file in Finder/Explorer. ({@link aeq.command.revealFile})</caption>
    		 * aeq.command.call('Explorer /select,', 'open -R', '"' + file.fsName + '"' )
    		 * aeq.command.call({
    		 *     windows: 'Explorer /select,',
    		 *     mac: 'open -R',
    		 *     arg: '"' + file.fsName + '"'
    		 * })
    		 */
    		call: function(windows, mac, arg) {
    			if (aeq.isObject(arguments[0])) {
    				var args = arguments[0];
    				windows = setDefault(args.win, args.windows);
    				mac = setDefault(args.mac, args.osx);
    				arg = args.arg;
    			}
    			var command = mac;
    			if (aeq.isWindows) {
    				command = windows;
    			}
    			arg = arg !== undefined ? " " + arg : "";
    			return system.callSystem(command + arg);
    		},

    		/**
    		 * Opens the given URL in the default web browser.
    		 * @method
    		 * @memberof aeq.command
    		 * @param  {string} URL The URL to open.
    		 *
    		 * @example
    		 * <caption>Opens AEQuery bitbucket project.</caption>
    		 * aeq.command.openURL('https://bitbucket.org/motiondesign/aequery')
    		 */
    		openURL: function(URL) {
    			try {
    				if (URL.match(/^https?:\/\//) === null) {
    					URL = "http://" + URL;
    				}
    				aeq.command.call({
    					win: "cmd /c \"explorer",
    					mac: "open",
    					arg: URL
    				});
    			} catch(err){
    				alert("Error in openURL function\n" + err.toString());
    			}
    		},

    		/**
    		 * Reveals the given file path or file object in Finder/Explorer.
    		 * @method
    		 * @memberof aeq.command
    		 * @param  {string|File} filePath The path to the file that should be
    		 *                                revealed, or a file object to reveal.
    		 * @return {string}      The value returned when calling the reveal command
    		 *                       in the command line. Mostly empty, holds error info
    		 *                       if not empty.
    		 * @example
    		 * <caption>Reveals the rurnning script in Finder/Explorer</caption>
    		 * aeq.command.revealFile( $.fileName )
    		 */
    		revealFile: function(filePath) {
    			if ( aeq.isFile(filePath) ) {
    				filePath = filePath.fsName;
    			}
    			return aeq.command.call("Explorer /select,", "open -R", "\"" + filePath + "\"");
    		},

    		/**
    		 * Copies a string to the users clipboard.
    		 * @method
    		 * @memberof aeq.command
    		 * @param  {string} text The string to copy.
    		 *
    		 * @example
    		 * aeq.command.copyToClipboard( 'Hello World!' )
    		 */
    		copyToClipboard: function( text ) {
    			aeq.command.call(
    				'cmd.exe /c cmd.exe /c "echo ' + text + ' | clip"', // Windows
    				'echo "' + text + '" | pbcopy' // MacOS
    			);
    		}
    	});

    	// Function aliases
    	aeq.callSystem = aeq.command.call;
    	aeq.openURL = aeq.command.openURL;
    	aeq.revealFile = aeq.command.revealFile;
    	aeq.copyToClipboard = aeq.command.copyToClipboard;




    	/**
    	 * Module dealing with comp objects.
    	 * @namespace aeq.comp
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.comp = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.comp]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * Creates a comp with the given settings
    		 * @method
    		 * @memberof aeq.comp
    		 * @param  {FolderItem|object} [folder=app.project]  The folder to place the
    		 *         comp inside in the project panel. If not provided, this argument
    		 *         will be used as the `options` parameter.
    		 * @param  {object} [options] Comp settings:
    		 * @param  {string} [options.name=Comp] The name of the comp.
    		 * @param  {number} [options.width=1920] Comp width, in pixels.
    		 * @param  {number} [options.height=1080] Comp height, in pixels.
    		 * @param  {number} [options.pixelAspect=1] Comp pixel aspect ratio.
    		 * @param  {number} [options.duration=1] Comp duration, in seconds.
    		 * @param  {number} [options.frameRate=24] Comp frame rate.
    		 * @return {CompItem}  The created comp item.
    		 *
    		 * @example <caption>Create a comp in the project root, with name "Example",
    		 *          and a duration of 10 seconds. And use default values for the
    		 *          other options</caption>
    		 * var comp = aeq.comp.create({
    		 *     name: 'Example',
    		 *     duration: 10
    		 * })
    		 *
    		 * @example <caption>Create comp in a folder, with name "Example"</caption>
    		 * var comp = aeq.comp.create(compFolder, {
    		 *     name: "Example"
    		 * })
    		 *
    		 * @example <caption>Create a comp with all default values</caption>
    		 * var comp = aeq.comp.create()
    		 */
    		create: function(folder, options) {
    			if (!aeq.isFolderItem(folder)) {
    				options = setDefault(folder, {});
    				folder = setDefault(options.folder, app.project);
    			}

    			// TODO: Find a way to use the last used settings, or find some defaults
    			var defaultOptions = {
    				name: "Comp",
    				width: 1920,
    				height: 1080,
    				pixelAspect: 1,
    				duration: 1,
    				frameRate: 24
    			};

    			options = aeq.extend(defaultOptions, options);

    			return folder.items.addComp(
    				options.name,
    				options.width,
    				options.height,
    				options.pixelAspect,
    				options.duration,
    				options.frameRate
    			);
    		},

    		/**
    		 * Gets the `RenderQueueItem`s that references a given comp.
    		 * @method
    		 * @memberof aeq.comp
    		 * @param  {CompItem} comp   The comp to find in the Render Queue.
    		 * @param  {boolean} [queuedOnly=true]   Only get `RenderQueueItem`s that
    		 *                                       are queued.
    		 * @return {RenderQueueItem[]}    The `RenderQueueItem`s that references
    		 *                                the comp
    		 *
    		 * @example <caption>Get all `RenderQueueItem`s that references
    		 *          the comp.</caption>
    		 * var RQItems = aeq.comp.getCompInQueue( comp, false )
    		 */
    		getCompInQueue: function(comp, queuedOnly) {
    			if (aeq.isNullOrUndefined(queuedOnly))
    				queuedOnly = true;

    			var queuedItems;

    			if (queuedOnly) {
    				queuedItems = aeq.renderqueue.getQueuedItems();
    			} else {
    				queuedItems = aeq.renderqueue.getRQItems();
    			}

    			return aeq.filter(queuedItems, function (item) {
    				return item.comp.id == comp.id;
    			});
    		},

    		/**
    		 * Check if a comp is in the Render Queue, regardless of it being
    		 * queued or not.
    		 * @method
    		 * @memberof aeq.comp
    		 * @param  {CompItem} comp The comp to find in the queue.
    		 * @return {boolean}   True if comp is in the queue.
    		 */
    		isInQueue: function(comp) {
    			if (!aeq.isComp(comp))
    				return null;

    			var items = aeq.renderqueue.getRQItems();

    			return items.exists(function(item) {
    				return item.comp.id == comp.id;
    			});
    		},

    		/**
    		 * Check if a comp is in the Render Queue and queued.
    		 * @method
    		 * @memberof aeq.comp
    		 * @param  {CompItem} comp The comp to find the queue.
    		 * @return {boolean}     True if the comp is queued.
    		 */
    		isQueued: function(comp) {
    			return aeq.comp.getCompInQueue(comp, true).length > 0;
    		}
    	});

    	// Function aliases




    	/**
    	 * [file description]
    	 * @namespace aeq.file
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.file = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.file]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * The value of the OS's file system path separator symbol; \ or /
    		 * @memberof aeq.file
    		 * @type {string}
    		 */
    		pathSeparatorSymbol: $.os.indexOf("Windows") > -1 ? "\\" : "/",

    		// normalizePathArray, pathIsAbsolute, normalizePath, joinPath adapted from path-browserify
    		// (https://github.com/substack/path-browserify/)
    		//
    		// Copyright Joyent, Inc. and other Node contributors.
    		//
    		// Permission is hereby granted, free of charge, to any person obtaining a
    		// copy of this software and associated documentation files (the
    		// "Software"), to deal in the Software without restriction, including
    		// without limitation the rights to use, copy, modify, merge, publish,
    		// distribute, sublicense, and/or sell copies of the Software, and to permit
    		// persons to whom the Software is furnished to do so, subject to the
    		// following conditions:
    		//
    		// The above copyright notice and this permission notice shall be included
    		// in all copies or substantial portions of the Software.
    		//
    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {string[]} parts         Array of path components
    		 * @param  {boolean} allowAboveRoot [description]
    		 * @return {string[]}               [description]
    		 */
    		normalizePathArray: function(parts, allowAboveRoot) {
    			// if the path tries to go above the root, `up` ends up > 0
    			var up = 0;
    			for (var i = parts.length - 1; i >= 0; i--) {
    				var last = parts[i];
    				if (last === '.') {
    					parts.splice(i, 1);
    				} else if (last === '..') {
    					parts.splice(i, 1);
    					up++;
    				} else if (up) {
    					parts.splice(i, 1);
    					up--;
    				}
    			}

    			// if the path is allowed to go above the root, restore leading ..s
    			if (allowAboveRoot) {
    				for (; up--; up) {
    					parts.unshift('..');
    				}
    			}

    			return parts;
    		},

    		/**
    		 * Checks whether the path starts with the OS separator symbol
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {string} path File path
    		 * @return {boolean}     True if first character equals path separator symbol
    		 */
    		pathIsAbsolute: function(path) {
    			return path.charAt(0) === aeq.file.pathSeparatorSymbol;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {string} path Raw joined file path
    		 * @return {string}      Normalized path
    		 */
    		normalizePath: function(path) {
    			var pathIsAbsolute = aeq.file.pathIsAbsolute(path),
    				trailingSlash = path.substr(-1) === aeq.file.pathSeparatorSymbol;

    			// Normalize the path
    			path = aeq.file.normalizePathArray(aeq.filter(path.split(aeq.file.pathSeparatorSymbol), function(p) {
    				return !!p;
    			}), !pathIsAbsolute).join(aeq.file.pathSeparatorSymbol);

    			if (!path && !pathIsAbsolute) {
    				path = '.';
    			}
    			if (path && trailingSlash) {
    				path += aeq.file.pathSeparatorSymbol;
    			}

    			return (pathIsAbsolute ? aeq.file.pathSeparatorSymbol : '') + path;
    		},

    		/**
    		 * Joins path components into an OS-formatted file path string
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {...(String|File|Folder)} paths The path elements to join.
    		 * @return {string} File path string joined with OS's path separator
    		 */
    		joinPath: function() {
    			var paths = Array.prototype.slice.call(arguments, 0);
    			return aeq.file.normalizePath(aeq.filter(paths, function(p, index) {
    				// Path is a File or Folder object.
    				if ( p && typeof p.fsName === 'string') {
    					p = p.fsName
    					paths[index] = p
    				}
    				if (typeof p !== 'string') {
    					throw new TypeError('Arguments to path.join must be strings, Files or Folders');
    				}

    				return p;
    			}).join(aeq.file.pathSeparatorSymbol));
    		},

    		/**
    		 * Returns the extension of target file
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {File|string} filePath String path to a file, or file object
    		 * @return {string}               Extension of target file
    		 */
    		getExtension: function(filePath) {
    			var filePathStr = aeq.isFile(filePath) ? filePath.name : filePath;
    			return filePathStr.substr(filePathStr.lastIndexOf('.') + 1, filePathStr.length);
    		},

    		/**
    		 * Returns the filename of target file without extension
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {File|string} filePath String path to a file, or file object
    		 * @return {string}               Filename without extension
    		 */
    		stripExtension: function(filePath) {
    			var filePathStr = aeq.isFile(filePath) ? filePath.name : filePath;
    			return filePathStr.substr(0, filePathStr.lastIndexOf('.'));
    		},

    		/**
    		 * Takes a file path or a file object, and returns a file object
    		 * allows functions to be flexible in whether they take a path vs file
    		 * @method
    		 * @memberof aeq
    		 * @param  {File|string} filePath String path to a file, or file object
    		 * @return {File}                 Resolved file object
    		 */
    		getFileObject: function(filePath) {
    			return aeq.isFile(filePath) ? filePath : new File(filePath);
    		},

    		/**
    		 * Gets target file by path or file object, or null if doesn't exist
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {File|string} filePath String path to a file, or file object
    		 * @return {File|null}            Target file, or null if doesn't exist
    		 */
    		getFile: function(filePath) {
    			var file = aeq.getFileObject(filePath);

    			if (!file.exists)
    				return null;

    			return file;
    		},

    		/**
    		 * Gets all files in target path that matches filter (or, all files if no filter)
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {File|string} folderPath      Folder or path to get
    		 * @param  {string|function} [filter=""] Filter string or function
    		 * @return {aeq.arrayEx|null}                 Array of filtered files, or null if none
    		 */
    		getFiles: function(folderPath, filter) {
    			filter = setDefault(filter, "");
    			var folder = aeq.getFolder(folderPath),
    				files;

    			files = folder.getFiles(filter);

    			if (files === null || files.length === 0)
    				return null;

    			return aeq.arrayEx(files);
    		},

    		/**
    		 * Takes a folder path or a folder object, and returns a folder object
    		 * allows functions to be flexible in whether they take a path vs folder
    		 * @method
    		 * @memberof aeq
    		 * @param  {Folder|string} folderPath String path to a folder, or folder object
    		 * @return {Folder}                   Resolved folder object
    		 */
    		getFolderObject: function(folderPath) {
    			return aeq.isFolder(folderPath) ? folderPath : new Folder(folderPath);
    		},

    		/**
    		 * Returns a folder, or null if it doesn't exist
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {File|string} folderPath Folder path to get
    		 * @return {Folder|null} Target folder, or null if it doesn't exist
    		 */
    		getFolder: function(folderPath) {
    			var folder = aeq.getFolderObject(folderPath);

    			if (!folder.exists)
    				return null;

    			return folder;
    		},

    		/**
    		 * Returns a folder, creating if it doesn't exist
    		 * @method
    		 * @memberof aeq.file
    		 * @param  {File|string} folderPath Folder path to get or create
    		 * @return {Folder} Target folder
    		 */
    		ensureFolderExists: function(folderPath) {
    			var folder = aeq.getFolderObject(folderPath);

    			if (!folder.exists)
    				folder.create();

    			return folder;
    		},

    		/**
    		 * Returns the contents of a specified file
    		 * @method
    		 * @memberof aeq
    		 * @param  {File|string} filePath    Path or file to read
    		 * @param  {string} [encoding=UTF-8] Encoding method
    		 * @return {string|null}             Contents of the file, or null if file doesn't exist
    		 */
    		readFile: function(filePath, encoding) {
    			var file = aeq.getFileObject(filePath),
    				contents;

    			encoding = setDefault(encoding, "UTF-8");

    			if (file.exists) {
    				if (File.isEncodingAvailable(encoding))
    					file.encoding = encoding;

    				file.open();
    				contents = file.read();
    				file.close();
    				return contents;
    			}
    			return null;
    		},

    		/**
    		 * Writes data to a file, returns file
    		 * @method
    		 * @memberof aeq
    		 * @param  {File|string} filePath              Path or file to write to
    		 * @param  {string}  contents                  Data to write to the file
    		 * @param  {object} [options]                  Options for writing file.
    		 * @param  {boolean} [options.overwrite=false] `true` if file should be overwritten if exists.
    		 * @param  {string} [options.encoding="UTF-8"] Encoding method.
    		 * @return {File|null}                         New file, or null if file was not written
    		 *                                             correctly or file exits and overwrite = false
    		 */
    		writeFile: function(filePath, contents, options) {
    			var file = aeq.getFileObject(filePath);
    			options = aeq.setDefault(options, {});

    			if (file.exists && options.overwrite === false) {
    				return null
    			}

    			if (!file.exists) {
    				aeq.file.ensureFolderExists(file.path);
    			}

    			if (!aeq.isNullOrUndefined(options.encoding) && File.isEncodingAvailable(options.encoding)) {
    				file.encoding = options.encoding;
    			}

    			file.open("w");
    			var success = file.write(contents);
    			file.close();

    			if (success)
    				return file;

    			return null;
    		}
    	});

    	// Function aliases
    	aeq.pathSeparatorSymbol = aeq.file.pathSeparatorSymbol;
    	aeq.getFileObject = aeq.file.getFileObject;
    	aeq.getFolderObject = aeq.file.getFolderObject;
    	aeq.getFile = aeq.file.get = aeq.file.getFile;
    	aeq.getFiles = aeq.file.getFiles;
    	aeq.getFolder = aeq.file.getFolder;
    	aeq.readFile = aeq.file.readFile;
    	aeq.writeFile = aeq.file.writeFile;




    	/**
    	 * Module dealing with Layer objects.
    	 * @namespace aeq.layer
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.layer = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.layer]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * Copies the state of layer toggles from one layer to another.
    		 * Layer toggles: enabled, solo, shy, quality, effectsActive, motionBlur
    		 * adjustmentLayer, threeDLayer, blendingMode, preserveTransparency
    		 * parent, inPoint, stretch, startTime, outPoint, label, guideLayer
    		 * name, comment, autoOrient
    		 * @method
    		 * @memberof aeq.layer
    		 * @param  {Layer} sourceLayer The layer to copy from.
    		 * @param  {Layer} destLayer   The layer to copy to.
    		 */
    		setLayerToggles: function(sourceLayer, destLayer) {
    			var switches = "enabled solo shy quality effectsActive motionBlur " +
    				"adjustmentLayer threeDLayer blendingMode preserveTransparency " +
    				"parent inPoint stretch startTime outPoint label guideLayer " +
    				"name comment autoOrient";
    			switches = switches.split(" ");

    			aeq.forEach(switches, function(switchName) {
    				destLayer[switchName] = sourceLayer[switchName];
    			});
    		},

    		/**
    		 * Gets all layers that has the given layer as its parent.
    		 * @method
    		 * @memberof aeq.layer
    		 * @param  {Layer} parentLayer The layer to get children from.
    		 * @return {aeq.arrayEx}           The children Layers of the given Layer.
    		 */
    		children: function(parentLayer) {
    			var layers = aeq.getLayers(parentLayer.containingComp);
    			return layers.filter(function(layer) {
    				return layer.parent === parentLayer;
    			});
    		},

    		/**
    		 * Gets all layers that has the given layer as its parent, and all layers
    		 * that has those layers, and so on.
    		 * @method
    		 * @memberof aeq.layer
    		 * @param  {Layer} parentLayer The layer to get decendants from.
    		 * @return {aeq.arrayEx}           Children and decendants of the given Layer.
    		 */
    		allChildren: function(parentLayer) {
    			var allChildren = [];
    			var children = aeq.layer.children(parentLayer);
    			aeq.forEach(children, function(layer) {
    				allChildren.push( layer );
    				allChildren = allChildren.concat(aeq.layer.allChildren(layer));
    			});
    			return aeq.arrayEx(allChildren);
    		},

    		/**
    		 * Gets the layers parent chain. I.e This layer's parent's parent, and so on.
    		 * @method
    		 * @memberof aeq.layer
    		 * @param  {Layer} childLayer The layer to get parents from.
    		 * @return {aeq.arrayEx}          The Parents of the given layer.
    		 */
    		parents: function(childLayer) {
    			var parents = aeq.arrayEx();
    			var layer = childLayer;
    			while (layer.parent !== null) {
    				parents.push(layer.parent);
    				layer = layer.parent;
    			}
    			return parents;
    		},

    		/**
    		 * Gets all [parents]{@link aeq.layer.parents} and
    		 * [all children]{@link aeq.layer.allChildren} of the given layers.
    		 * @method
    		 * @memberof aeq.layer
    		 * @param  {Layer} root The Layer to get the parents and children from
    		 * @return {aeq.arrayEx}    The layer's parents and children.
    		 */
    		relatedLayers: function(root) {
    			var parents = aeq.layer.parents(root);
    			var children = aeq.layer.allChildren(root);
    			var all = parents.push.apply( parents, children);
    			return aeq.arrayEx( all );
    		}
    	});

    	// Function aliases




    	/**
    	 * [project description]
    	 * @namespace aeq.project
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.project = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.project]";
    		},

    		// Function for extending the object using objects
    		extend: aeq.extend,

    		/**
    		 * Gets all footage items in project
    		 * @method
    		 * @memberof aeq.project
    		 * @return {Item[]} ArrayEx of project footage items
    		 */
    		getFootage: function(){
    			var items = aeq.getItems();

    			return aeq.filter(items, aeq.isFootageItem);
    		},

    		/**
    		 * Gets all folders within target folder, or root
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {FolderItem|string} [parentFolder=app.project.root] Folder to search in by name or item, or root if undefined
    		 * @return {FolderItem[]}                                      ArrayEx of folder items
    		 */
    		getFolders: function(parentFolder){
    			var folders = aeq.getItems(parentFolder);

    			return folders.filter(aeq.isFolderItem);
    		},

    		/**
    		 * Find folder by name in target folder.
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {string} name                                       Folder name to find.
    		 * @param  {FolderItem|string} [parentFolder=app.project.root] Folder to search in by name or item, or root if undefined.
    		 * @return {FolderItem|null}                                   FolderItem with the name. Or `null` if not found.
    		 */
    		findFolder: function(name, parentFolder){
    			var folders = aeq.project.getFolders(parentFolder);

    			var folder = aeq.filter(folders, function(folder) {
    				return folder.name == name;
    			});
    			if (folder.length) {
    				return folder[0];
    			}
    			return null;
    		},

    		/**
    		 * Gets folder item, or null if can't find
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {FolderItem|string} folder                          Folder to get by name or item, or root if undefined
    		 * @param  {FolderItem|string} [parentFolder=app.project.root] Parent folder to search in by name or item, or root if undefined
    		 * @return {FolderItem|null}                                   Target folder item, or null
    		 */
    		getFolder: function(folder, parentFolder){
    			if (aeq.isFolderItem(folder)) {
    				return folder;
    			}

    			if (aeq.isString(folder)) {
    				return aeq.project.findFolder(folder, parentFolder);
    			}

    			return null;
    		},

    		/**
    		 * Gets all folder items that are selected
    		 * @method
    		 * @memberof aeq.project
    		 * @return {FolderItem[]} ArrayEx of all selected folder items
    		 */
    		getSelectedFolders: function(){
    			return aeq.filter(app.project.selection, aeq.isFolderItem);
    		},

    		/**
    		 * Gets all comp items that are selected
    		 * @method
    		 * @memberof aeq.project
    		 * @return {CompItem[]} ArrayEx of all selected comp items
    		 */
    		getSelectedComps: function(){
    			return aeq.filter(app.project.selection, aeq.isComp);
    		},

    		/**
    		 * Gets all footage items that are selected
    		 * @method
    		 * @memberof aeq.project
    		 * @return {Item[]} ArrayEx of all selected footage items
    		 */
    		getSelectedFootage: function(){
    			return aeq.filter(app.project.selection, aeq.isFootageItem);
    		},

    		/**
    		 * Gets folder item, or creates it if can't find
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {FolderItem|string} folder                          Folder to get by name or item, or root if undefined
    		 * @param  {FolderItem|string} [parentFolder=app.project.root] Parent folder to search in by name or item, or root if undefined
    		 * @return {FolderItem}                                        Target folder item
    		 */
    		getOrCreateFolder : function(folder, parentFolder){
    			if (aeq.isNullOrUndefined(parentFolder))
    				parentFolder = app.project.rootFolder;
    			else
    				parentFolder = aeq.project.getOrCreateFolder(parentFolder)

    			var foundFolder = aeq.project.getFolder(folder, parentFolder);

    			if (aeq.isNullOrUndefined(foundFolder))
    				return parentFolder.items.addFolder(folder);

    			return foundFolder;
    		},

    		/**
    		 * Gets folder item, or root if undefined
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {FolderItem|string} [folder=app.project.root] Folder to get by name or item, or root if undefined
    		 * @return {FolderItem}                                  Target folder item
    		 */
    		getFolderOrRoot : function (folder) {
    			folder = aeq.project.getFolder(folder);

    			if (aeq.isNullOrUndefined(folder))
    				return app.project.rootFolder;

    			return folder;
    		},

    		/**
    		 * Saves current AEP to target path, or prompts user if no path
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {string} [path] Path to save AEP to
    		 * @return {File}          File object of AEP
    		 */
    		save: function(path) {
    			if (!path)
    				return app.project.save();

    			var file = aeq.getFileObject(path);

    			if (file.exists)
    				if (!confirm("File exists! Overwrite?"))
    					return null;

    			return app.project.save(file);
    		},

    		/**
    		 * Saves current AEP to current path
    		 * @method
    		 * @memberof aeq.project
    		 * @return {File} File object of AEP
    		 */
    		quickSave: function() {
    			var file = aeq.app.getAEP();
    			return app.project.save(file);
    		},

    		/**
    		 * Imports a file into After Effects.
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {string|File} file    The file to import.
    		 * @param  {string|FolderItem} [folder=app.project]  The folder where the
    		 * imported item will be placed.
    		 * @param  {object} [options] options for importOptions.
    		 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence.
    		 * @return {Item}    The imported item
    		 */
    		importFile: function(file, folder, options) {
    			var proj = app.project,
    				newItem;

    			var newFile = aeq.getFile(file);

    			if (!aeq.isFile(newFile))
    				throw new Error( file + " is not a valid file!" );

    			if ( aeq.isNullOrUndefined( folder ) ) {
    				folder = app.project.rootFolder
    			} else {
    				folder = aeq.project.getOrCreateFolder( folder );
    			}

    			options = setDefault(options, {});

    			var iO = new ImportOptions(newFile);

    			if (options.sequence === true)
    				iO.sequence = true;

    			try {
    				newItem = proj.importFile(iO);
    			} catch (e) {
    				throw new Error( "Can't import file " + newFile.name + "\n" + String(e) );
    			}

    			if (newItem.duration * newItem.frameRate == 1)
    				newItem.replace(file);

    			newItem.parentFolder = folder;
    			newItem.selected = false;

    			return newItem;
    		},

    		/**
    		 * Like {@link aeq.project.importFile}, but without the extra.
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {File} file    File object to import
    		 * @param  {object} [options] options for importOptions
    		 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence
    		 * @return {Item}    The imported item
    		 */
    		simpleImportFile: function ( file, options ) {
    			var iO = new ImportOptions( file )

    			options = setDefault(options, {});
    			if (options.sequence === true)
    				iO.sequence = true;

    			try {
    				newItem = app.project.importFile(iO);
    			} catch (e) {
    				throw new Error( "Can't import file " + file.name + "\n" + String(e) );
    			}

    			return newItem
    		},

    		/**
    		 * Imports a sequence by file object or path
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {File|string} file    File or path of sequence to import
    		 * @param  {FolderItem} [folder] Folder to import items to
    		 * @return {Item}                Imported sequence
    		 */
    		importSequence: function(file, folder) {
    			return aeq.importFile(file, folder, {sequence: true});
    		},

    		/**
    		 * Imports array of files or paths to target folder
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {File[]|string[]} fileArray        Array of files or paths to import
    		 * @param  {FolderItem} [folder]              Folder to import items to
    		 * @param  {object} [options]                 options for importOptions.
    		 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence.
    		 * @return {Items[]}                          ArrayEx of imported items
    		 */
    		importFiles: function(fileArray, folder, options) {
    			var importedItems = aeq.arrayEx();

    			aeq.forEach(fileArray, function(file) {
    				var item = aeq.importFile(file, folder, options);
    				importedItems.push(item);
    			});

    			return importedItems;
    		},

    		/**
    		 * Moves item(s) to specified folder
    		 * @method
    		 * @memberof aeq.project
    		 * @param  {Item|Item[]} items Item or array of items
    		 * @param  {FolderItem} folder Folder to move item(s) to
    		 */
    		moveToFolder: function(items, folder) {
    			folder = aeq.project.getFolder(folder);

    			if (!aeq.isArray(items)) items = [items];

    			aeq.forEach(items, function (item) {
    				item.parentFolder = folder;
    				item.selected = false;
    			});
    		},

    		/**
    		 * Reduces current project to only comps that are queued
    		 * @method
    		 * @memberof aeq.project
    		 * @return {CompItem[]|null} Array of queued comps, or null
    		 */
    		reduceToQueuedComps: function() {
    			var queuedComps = aeq.renderqueue.getQueuedComps();

    			if (queuedComps.length === 0)
    				return null;

    			app.project.reduceProject(queuedComps);

    			return queuedComps;
    		}
    	});

    	// Function aliases
    	aeq.save = aeq.project.save;
    	aeq.quickSave = aeq.project.quickSave;
    	aeq.importFile = aeq.project.importFile;
    	aeq.importFiles = aeq.project.importFiles;
    	aeq.importSequence = aeq.project.importSequence;




    	/**
    	 * Module for dealing with Property objects.
    	 * @namespace aeq.property
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.property = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.property]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * Returns the property value type of a Property as a string.
    		 * @method
    		 * @memberof aeq.property
    		 * @param  {Property} property The property to get the value type of.
    		 * @return {string}          The property value type, on of:
    		 *
    		 * - `NO_VALUE`: Stores no data.
    		 * - `ThreeD_SPATIAL`: Array of three floating-point positional values.
    		 *    For example, an Anchor Point value might be `[10.0, 20.2, 0.0]`
    		 * - `ThreeD`: Array of three floating-point quantitative values.
    		 *    For example, a Scale value might be `[100.0, 20.2, 0.0]`
    		 * - `TwoD_SPATIAL`: Array of 2 floating-point positional values.
    		 *    For example, an Anchor Point value might be `[5.1, 10.0]`
    		 * - `TwoD`: Array of 2 floating-point quantitative values.
    		 *    For example, a Scale value might be `[5.1, 100.0]`
    		 * - `OneD`: A floating-point value.
    		 * - `COLOR`:Array of 4 floating-point values, in the range `[0.0..1.0]`.
    		 *    For example, `[0.8, 0.3, 0.1, 1.0]`
    		 * - `CUSTOM_VALUE`: Custom property value, such as the Histogram
    		 *    property for the Levels effect.
    		 * - `MARKER`: MarkerValue object
    		 * - `LAYER_INDEX`: Integer; a value of `0` means no layer.
    		 * - `MASK_INDEX`: Integer; a value of `0` means no mask.
    		 * - `SHAPE`: Shape object
    		 * - `TEXT_DOCUMENT`: TextDocument object
    		 *
    		 * @example <caption>Returns "ThreeD_SPATIAL"</caption>
    		 * aeq.property.valueType( layer.Transform.Position )
    		 */
    		valueType: function(property) {
    			return aeq.valueInObject(property.propertyValueType || property, PropertyValueType);
    		},

    		/**
    		 * Returns the property type as a string.
    		 * @method
    		 * @memberof aeq.property
    		 * @param  {Property} property The property to get the type of
    		 * @return {string}          The property type, on of:
    		 *
    		 * - `PROPERTY`: A single property such as position or zoom.
    		 * - `INDEXED_GROUP`: A property group whose members have an editable name
    		 *   and an index. Effects and masks are indexed groups. For example,
    		 *   the masks property of a layer refers to a variable number of individual
    		 *   masks by index number.
    		 * - `NAMED_GROUP`: A property group in which the member names are not
    		 *    editable. Layers are named groups.
    		 */
    		type: function(property) {
    			return aeq.valueInObject(property.propertyType || property, PropertyType);
    		},

    		/**
    		 * Gets the layer the given property is contained in.
    		 * @method
    		 * @memberof aeq.property
    		 * @param  {Property} property The Property to get layer from.
    		 * @return {Layer}          The containing Layer object.
    		 */
    		getLayer: function( property ) {
    			var depth = property.propertyDepth
    			return property.propertyGroup( depth )
    		}
    	});

    	// Function aliases
    	aeq.prop = aeq.property;




    	/**
    	 * Module for dealing with the render queue.
    	 * @namespace aeq.renderqueue
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.renderqueue = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.RenderQueue]";
    		},

    		// Function for extending the object using objects
    		extend: aeq.extend,

    		/**
    		 * Add a project item to the render queue.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @param  {Item|CompItem} item The item to add to the queue.
    		 * @return {RenderQueueItem}      The added RenderQueueItem.
    		 */
    		queue: function(item){
    			return app.project.renderQueue.items.add(item);
    		},

    		/**
    		 * Unqueues all items in the render queue
    		 * @method
    		 * @memberof aeq.renderqueue
    		 */
    		unqueue_all: function(){

    			var items = aeq.renderqueue.getRQItems();

    			items.forEach(function(item){
    				if (item.status != RQItemStatus.USER_STOPPED &&
    					item.status != RQItemStatus.ERR_STOPPED &&
    					item.status != RQItemStatus.RENDERING &&
    					item.status != RQItemStatus.DONE) {
    					item.render = false;
    				}
    			});
    		},

    		/**
    		 * Removes all items from the render queue.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 */
    		clear: function(){
    			var items = aeq.renderqueue.getRQItems();
    			items = items.reverse();
    			items.forEach(function(item){
    				item.remove();
    			});
    		},

    		/**
    		 * Check if an item in the render queue is queued for rendering.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @param  {RenderQueueItem} rqItem The item to check.
    		 * @return {boolean}        `true` if the item is going to be rendered.
    		 */
    		isQueued: function(rqItem) {
    			return rqItem.status == RQItemStatus.QUEUED;
    		},

    		/**
    		 * Gets all `RenderQueueItem`s in the render queue which are queued for
    		 * rendering.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @return {aeq.arrayEx} ArrayEx of `RenderQueueItem`s
    		 */
    		getQueuedItems: function() {
    			var items = aeq.renderqueue.getRQItems();
    			return item.filter(function(item) {
    				return aeq.renderqueue.isQueued(item);
    			});
    		},

    		/**
    		 * Gets all `CompItem`s that are queued for rendering.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @return {aeq.arrayEx} ArrayEx of `CompItem`s
    		 */
    		getQueuedComps: function() {
    			var queuedItems = aeq.renderqueue.getQueuedItems();
    			var compIDs = {};
    			var comps = [];

    			queuedItems.forEach(function(item) {
    				var comp = item.comp;
    				var compID = comp.id;

    				if (compIDs[compID] === undefined) {
    					compIDs[compID] = true;
    					comps.push(comp);
    				}
    			});

    			return aeq.arrayEx(comps);
    		},

    		/**
    		 * Gets all render queue items.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @return {aeq.arrayEx} ArrayEx of `RenderQueueItem`s
    		 */
    		getRQItems: function() {
    			return aeq.arrayEx(aeq.normalizeCollection(app.project.renderQueue.items));
    		},

    		/**
    		 * Gets all `compItem`s added to the render queue.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @return {aeq.arrayEx} ArrayEx of CompItems in the render queue.
    		 */
    		getRQComps: function() {
    			var rqItems = aeq.renderqueue.getRQItems();
    			var compIDs = {};
    			var comps = [];

    			rqItems.forEach(function(item) {
    				var comp = item.comp;
    				var compID = comp.id;

    				if (compIDs[compID] === undefined) {
    					compIDs[compID] = true;
    					comps.push(comp);
    				}
    			});

    			return aeq.arrayEx(comps);
    		},

    		/**
    		 * Gets settings from a `RenderQueueItem` or `OutputModule`.
    		 * @see [OutputModule.getSettings]{@link http://docs.aenhancers.com/outputmodule/#outputmodule-getsettings}
    		 * @see [RenderQueueItem.getSettings]{@link http://docs.aenhancers.com/renderqueueitem/#renderqueueitem-getsettings}
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @param  {RenderQueueItem|OutputModule} renderItem The object to get settings from.
    		 * @return {Object}        Object with render settings as strings.
    		 */
    		getSettings: function(renderItem) {
    			return renderItem.getSettings(GetSettingsFormat.STRING);
    		},

    		/**
    		 * Checks if the folder where the output module is rendering to exists, if
    		 * it does not exist, it gets created.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @param  {OutputModule} outputModule The output module to check the render
    		 *                                     path of.
    		 */
    		ensureRenderPathExists: function(outputModule) {
    			aeq.app.ensureSecurityPrefEnabled();
    			aeq.file.ensureFolderExists(outputModule.file.parent);
    		},

    		/**
    		 * Checks if the given output module template exists.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @param  {string} templateName Name of the template to check if exists.
    		 * @return {boolean}             `true` if the output module template exists.
    		 */
    		omTemplateExists: function(templateName) {
    			var tempComp = aeq.comp.create();
    			var tempRQItem = aeq.renderqueue.queue(tempComp);
    			var templates = aeq.arrayEx(tempRQItem.outputModule(1).templates);

    			var templateExists = templates.exists(function(template) {
    				return template == templateName;
    			});

    			tempRQItem.remove();
    			tempComp.remove();
    			return templateExists;
    		},

    		/**
    		 * Checks if the given render queue template exists.
    		 * @method
    		 * @memberof aeq.renderqueue
    		 * @param  {string} templateName Name of the template to check.
    		 * @return {boolean}             `true` if the template exists.
    		 */
    		rqTemplateExists: function(templateName) {
    			var tempComp = aeq.comp.create();
    			var tempRQItem = aeq.renderqueue.queue(tempComp);
    			var templates = aeq.arrayEx(tempRQItem.templates);

    			var templateExists = templates.exists(function(template) {
    				return template == templateName;
    			});

    			tempRQItem.remove();
    			tempComp.remove();
    			return templateExists;
    		}
    	});

    	// Function aliases




    	/**
    	 * [settings description]
    	 * @namespace aeq.settings
    	 * @memberof aeq
    	 * @type {Object}
    	 */
    	aeq.settings = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.settings]";
    		},

    		// Function for extending the object using objects
    		extend: aeq.extend,

    		/**
    		 * Saves setting if present, else gets setting
    		 * @memberof aeq.settings
    		 * @method
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @param  {string} [value]     Settings value to save for section:key
    		 * @return {aeq|string}         aeq or setting value of section:key
    		 */
    		setting: function(sectionName, keyName, value) {
    			if (value !== undefined) {
    				aeq.settings.save(sectionName, keyName, value);
    				return aeq;
    			}
    			return aeq.settings.get(sectionName, keyName);
    		},

    		/**
    		 * Initializes a setting, setting it if not present
    		 * @memberof aeq.settings
    		 * @method
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @param  {string} value       Settings value to save for section:key
    		 * @param  {bool} 	[overwrite] `true` to overwite if present
    		 * @return {string}             setting value of section:key
    		 */
    		initSetting: function(sectionName, keyName, value, overwrite) {
    			overwrite = setDefault(overwrite, false);

    			if (!aeq.settings.have(sectionName, keyName) || overwrite) {
    				aeq.settings.save(sectionName, keyName, value);
    			}

    			return aeq.settings.get(sectionName, keyName);
    		},

    		/**
    		 * Gets setting from section:key
    		 * @method
    		 * @memberof aeq.settings
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @return {string|undefined}   Value of saved setting, or undefined if blank
    		 */
    		get: function(sectionName, keyName) {
    			if (aeq.settings.have(sectionName, keyName)) {
    				return app.settings.getSetting(sectionName, keyName);
    			}
    			return undefined;
    		},

    		/**
    		 * Gets setting and returns as boolean value, or undefined if not boolean
    		 * @method
    		 * @memberof aeq.settings
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @return {boolean|undefined}  Saved setting as boolean
    		 */
    		getAsBool: function(sectionName, keyName) {
    			var value = aeq.settings.get(sectionName, keyName);

    			if (value === "true")
    				return true;
    			else if (value === "false")
    				return false;

    			return undefined;
    		},

    		/**
    		 * Gets setting and returns as array
    		 * @method
    		 * @memberof aeq.settings
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @return {string[]|undefined} Saved setting as boolean
    		 */
    		getAsArray: function(sectionName, keyName) {
    			return aeq.settings.get(sectionName, keyName).split(",");
    		},

    		/**
    		 * Gets setting and returns as float
    		 * @method
    		 * @memberof aeq.settings
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @return {number|undefined}   Saved setting as float
    		 */
    		getAsFloat: function(sectionName, keyName) {
    			return parseFloat(aeq.settings.get(sectionName, keyName));
    		},

    		/**
    		 * Gets setting and returns as int
    		 * @method
    		 * @memberof aeq.settings
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @return {number|undefined}   Saved setting as int
    		 */
    		getAsInt: function(sectionName, keyName) {
    			return parseInt(aeq.settings.get(sectionName, keyName));
    		},

    		/**
    		 * Checks whether setting has been saved / exists in file
    		 * @method
    		 * @memberof aeq.settings
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @return {boolean}            Whether the setting exists
    		 */
    		have: function(sectionName, keyName) {
    			return app.settings.haveSetting(sectionName, keyName);
    		},

    		/**
    		 * Saves setting
    		 * @memberof aeq.settings
    		 * @method
    		 * @param  {string} sectionName Settings section name
    		 * @param  {string} keyName     Settings key name
    		 * @param  {string} value       Settings value to save for section:key
    		 */
    		save: function(sectionName, keyName, value) {
    			app.settings.saveSetting(sectionName, keyName, value);
    		},

    		/**
    		 * Checks whether object of key names have saved settings,
    		 * returns object of saved values of this string
    		 * @method
    		 * @memberof aeq.settings
    		 * @param  {string} sectionName Settings section name
    		 * @param  {object} keyNames    Object of containing key names
    		 * @return {object}             Object of fetched settings
    		 */
    		unpack: function(sectionName, keyNames) {
    			var ret;
    			// Argument keyNames can either be an array with keyNames or an object with
    			// key: defaultValue pairs.
    			ret = aeq.isObject(keyNames) ? keyNames : {};

    			aeq.forEach(keyNames, function(keyName) {
    				if (app.settings.haveSetting(sectionName, keyName)) {
    					ret[keyName] = app.settings.getSetting(sectionName, keyName);
    				}
    			});

    			return ret;
    		}
    	});

    	// Function aliases
    	aeq.saveSetting = aeq.setSetting = aeq.settings.set = aeq.settings.save;
    	aeq.getSetting = aeq.settings.get;
    	aeq.getSettingAsBool = aeq.settings.getAsBool;
    	aeq.getSettingAsArray = aeq.settings.getAsArray;
    	aeq.getSettingAsFloat = aeq.settings.getAsFloat;
    	aeq.getSettingAsInt = aeq.settings.getAsInt;
    	aeq.haveSetting = aeq.settings.have;
    	aeq.unpackSettings = aeq.loadSettings = aeq.settings.load = aeq.settings.unpack;




    	/**
    	 * @namespace snippet
    	 * @memberof aeq
    	 * @type {object}
    	 */
    	aeq.snippet = aeq.extend({}, {
    		toString: function() {
    			return "[object aeq.snippet]";
    		},

    		// Function for extending the object using objects
    		extend: aeq.extend,

    		/**
    		 * Gets the active comp and alerts the user if no comp is open. It then
    		 * creates an undo group and executes a callback function with the comp as
    		 * the first argument.
    		 * @function activeComp
    		 * @memberof aeq.snippet
    		 * @param  {String}   undoGroup Name of the undo group
    		 * @param  {function} callback  Function to execute that gets the active comp
    		 *                              as the first argument
    		 * @return {Boolean|Any}        `false` if the function is not executed
    		 *         because no comp was selected. Else the value the `callback`
    		 *         function returns is returned.
    		 */
    		activeComp: function(undoGroup, callback) {
    			var comp = getCompWithAlert();
    			if (comp === null) return false;
    			return aeq.createUndoGroup(undoGroup, callback, [comp]);
    		},

    		/**
    		 * Gets the selected layers in the active comp and alerts the user if no comp
    		 * is open, or if no layer is selected. It then creates an undo group and
    		 * executes a callback function with the layers as the first argument, and the
    		 * comp as the second argument.
    		 * @memberof aeq.snippet
    		 * @param  {String}   undoGroup Name of the undo group
    		 * @param  {function} callback  Function to execute that gets the selected
    		 * layers as the first argument, and the comp as the second argument.
    		 * @return {Boolean|Any}        `false` if the function is not executed because
    		 * no comp or layer was selected. Else the value the `callback` function
    		 * returns is returned.
    		 */
    		selectedLayers: function(undoGroup, callback) {
    			var comp = getCompWithAlert();
    			if (comp === null) return false;
    			var layers = getSelectedLayersWithAlert(comp)
    			if (layers === null) return false;

    			layers = aeq.arrayEx(layers);
    			return aeq.createUndoGroup(undoGroup, callback, [layers, comp]);
    		},

    		/**
    		 * Gets the selected layers or all layers if no layers are selected, in the
    		 * active comp. Alerts the user if no comp is open. It then creates an undo
    		 * group and executes a callback function with the layers as the first
    		 * argument, and the comp as the second argument.
    		 * @memberof aeq.snippet
    		 * @param  {String}   undoGroup Name of the undo group.
    		 * @param  {function} callback  Function to execute that gets the selected
    		 * layers in an ArrayEx as the first argument, and the comp as the second
    		 * argument.
    		 * @return {Boolean|Any}        `false` if the function is not executed because
    		 * no comp was open. Else the value the `callback` function is returned.
    		 */
    		selectedLayersOrAll: function(undoGroup, callback) {
    			var comp = getCompWithAlert();
    			if (comp === null) return false;
    			var layers = aeq.getSelectedLayersOrAll(comp);

    			layers = aeq.arrayEx(layers);
    			return aeq.createUndoGroup(undoGroup, callback, [layers, comp]);
    		},

    		/**
    		 * Gets the selected properties in the active comp and alerts the user if no
    		 * comp is open, or if no property is selected. It then creates an undo group
    		 * and executes a callback function with the properties as the first argument,
    		 * and the comp as the second argument.
    		 * @memberof aeq.snippet
    		 * @param  {String}   undoGroup Name of the undo group
    		 * @param  {function} callback  Function to execute that gets the selected
    		 * properties in an ArrayEx as the first argument, and the comp as the second
    		 * argument.
    		 * @return {Boolean|Any}        `false` if the function is not executed.
    		 * because no comp or property was selected. Else the value the `callback`
    		 * function is returned.
    		 */
    		selectedProperties: function(undoGroup, callback) {
    			var comp = getCompWithAlert();
    			if (comp === null) return false;
    			var props = getSelectedPropertiesWithAlert(comp)
    			if (props === null) return false;

    			props = aeq.arrayEx(props);
    			return aeq.createUndoGroup(undoGroup, callback, [props, comp]);
    		},

    		/**
    		 * Loops through the selected layers in the active comp. Alerts the user if no
    		 * comp is open, or no layer is selected. It then creates an undo group
    		 * and executes a callback function for each of the layers.
    		 * @memberof aeq.snippet
    		 * @param  {String}          undoGroup Name of the undo group.
    		 * @param  {forEachArrayCallback} callback  Function to execute for each layer.
    		 * @return {Boolean|ArrayEx} `false` if the function is not executed because
    		 *         no comp was open or no layer selected. Else the layers array is
    		 *         returned.
    		 */
    		forEachSelectedLayer: function(undoGroup, callback) {
    			return aeq.snippet.selectedLayers(undoGroup, function(layers) {
    				layers.forEach(callback);
    				return layers;
    			})
    		},

    		/**
    		 * Loops through the selected layers or all layers if no layers are selected, in the
    		 * active comp. Alerts the user if no comp is open. It then creates an undo group
    		 * and executes a callback function for each of the layers.
    		 * @memberof aeq.snippet
    		 * @param  {String}          undoGroup Name of the undo group
    		 * @param  {forEachArrayCallback} callback  Function to execute for each layer.
    		 * @return {Boolean|ArrayEx}           `false` if the function is not executed
    		 *                                     because no comp was open. Else
    		 *                                     the layers array are returned.
    		 */
    		forEachSelectedLayerOrAll: function(undoGroup, callback) {
    			return aeq.snippet.selectedLayersOrAll(undoGroup, function(layers) {
    				layers.forEach(callback);
    				return layers;
    			})
    		},

    		/**
    		 * Loops through the selected properties in the active comp. Alerts the user if no
    		 * comp is open, or no properties is selected. It then creates an undo group
    		 * and executes a callback function for each of the properties.
    		 * @memberof aeq.snippet
    		 * @param  {String}          undoGroup Name of the undo group
    		 * @param  {forEachArrayCallback} callback  Function to execute for each property.
    		 * @return {Boolean|ArrayEx}           `false` if the function is not executed
    		 *                                     because no comp was open or no layer
    		 *                                     selected. Else the property array
    		 *                                     is returned.
    		 */
    		forEachSelectedProperty: function(undoGroup, callback) {
    			return aeq.snippet.selectedProperties(undoGroup, function(props) {
    				props.forEach(callback);
    				return props;
    			})
    		},
    	});

    	function getCompWithAlert() {
    		var comp = aeq.getActiveComp();
    		if ( comp === null ) {
    			alert( "No Comp selected" );
    		}
    		return comp;
    	}

    	function getSelectedLayersWithAlert(comp) {
    		if ( comp.selectedLayers.length === 0 ) {
    			alert( "No layers selected" );
    			return null;
    		}
    		return comp.selectedLayers;
    	}

    	function getSelectedPropertiesWithAlert(comp) {
    		if ( comp.selectedProperties.length === 0 ) {
    			alert( "No properties selected" );
    			return null;
    		}
    		return comp.selectedProperties;
    	}

    	// Function aliases






    	/**
    	 * Array with some extensions that mimics modern JavaScript.
    	 * @memberof aeq
    	 * @class
    	 * @param  {Array} arr The array object to extend. If not supplied, an empty
    	 *                     arrayEx will be returned.
    	 */
    	aeq.arrayEx = function (arr)
    	{
    		arr = setDefault(arr, []);

    		if (arr._init)
    			return arr;

    		/**
    		 * Used to check if array is already extended.
    		 * @memberof aeq.arrayEx
    		 * @private
    		 * @type {Boolean}
    		 * @default
    		 */
    		arr._init = true;

    		/**
    		 * @memberof aeq.arrayEx
    		 * @private
    		 * @type {Boolean}
    		 * @default
    		 */
    		arr.isAeq = true;

    		aeq.extend(arr, arrayEx);
    		return arr;
    	};

    	var arrayEx = {

    		/**
    		 * Loops through the elements in the array and executes a function.
    		 * @memberof aeq.arrayEx
    		 * @method
    		 * @param  {forEachArrayCallback} callback Function to execute for each element
    		 */
    		forEach: function (callback) {
    			var len = this.length;

    			for(var i=0; i < len; i++)
    				callback(this[i], i, this);
    		},

    		/**
    		 * Loops through the elements in the array and returns `true` if callback returns true for any element
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {Function} callback Function to execute for each element
    		 * @return {boolean}           Whether the function returned true for any element
    		 */
    		exists: function (callback) {
    			var len = this.length;

    			for (var i=0; i < len; i++)
    			{
    				if (callback(this[i], i, this))
    					return true;
    			}

    			return false;
    		},

    		/**
    		 * Loops through the elements in the array and returns `true` if callback returns true for all elements
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {Function} callback Function to execute for each element
    		 * @return {boolean}           Whether the function returned true for ALL elements
    		 */
    		isTrueForAll: function (callback) {
    			var len = this.length;

    			for (var i=0; i < len; i++)
    			{
    				if (!callback(this[i], i, this))
    					return false;
    			}

    			return true;
    		},

    		/**
    		 * Gets first element in array
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @return {any} First element in array
    		 */
    		first: function () {
    			if (this.length === 0)
    				throw new Error('There are no items in this array');

    			return this[0];
    		},

    		/**
    		 * Returns array element that triggers callback === true
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {Function} callback Function to execute for each element
    		 * @param  {any}      [def]    Default element to return if target be found
    		 * @return {any}               Array element that triggered callback, or default
    		 */
    		find: function (callback, def) {
    			var len = this.length;

    			for (var i=0; i < len; i++)
    			{
    				if (callback(this[i], i, this))
    					return this[i];
    			}

    			return def;
    		},

    		/**
    		 * Runs callback on each element, and returns a new arrayEx of elements that trigger callback === true
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {Function} callback Function to execute for each element
    		 * @return {aeq.arrayEx}       ArrayEx of filtered elements
    		 */
    		filter: function (callback) {
    			var filteredArr = [];
    			var len = this.length;

    			for(var i=0; i < len; i++)
    			{
    				if (callback(this[i], i, this))
    					filteredArr.push(this[i]);
    			}

    			return aeq.arrayEx(filteredArr);
    		},

    		/**
    		 * Returns index of searchElement in an array, or -1 if not found
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {any}    searchElement Element to find in arrayEx
    		 * @param  {number} [fromIndex=0] Index to start searching from, or 0 if not passed
    		 * @return {number}               `-1` if element is not found, else index number
    		 */
    		indexOf: function(searchElement, fromIndex) {
    			var k;

    			// 1. Let o be the result of calling ToObject passing
    			//    the this value as the argument.
    			if (this === null) {
    				throw new TypeError('"this" is null or not defined');
    			}

    			var o = Object(this);

    			// 2. Let lenValue be the result of calling the Get
    			//    internal method of o with the argument "length".
    			// 3. Let len be ToUint32(lenValue).
    			var len = o.length >>> 0;

    			// 4. If len is 0, return -1.
    			if (len === 0) {
    				return -1;
    			}

    			// 5. If argument fromIndex was passed let n be
    			//    ToInteger(fromIndex); else let n be 0.
    			var n = +fromIndex || 0;

    			if (Math.abs(n) === Infinity) {
    				n = 0;
    			}

    			// 6. If n >= len, return -1.
    			if (n >= len) {
    				return -1;
    			}

    			// 7. If n >= 0, then Let k be n.
    			// 8. Else, n<0, Let k be len - abs(n).
    			//    If k is less than 0, then let k be 0.
    			k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    			// 9. Repeat, while k < len
    			while (k < len) {
    				// a. Let Pk be ToString(k).
    				//   This is implicit for LHS operands of the in operator
    				// b. Let kPresent be the result of calling the
    				//    HasProperty internal method of o with argument Pk.
    				//   This step can be combined with c
    				// c. If kPresent is true, then
    				//    i.  Let elementK be the result of calling the Get
    				//        internal method of o with the argument ToString(k).
    				//   ii.  Let same be the result of applying the
    				//        Strict Equality Comparison Algorithm to
    				//        searchElement and elementK.
    				//  iii.  If same is true, return k.
    				if (k in o && o[k] === searchElement) {
    					return k;
    				}
    				k++;
    			}
    			return -1;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {Function} callback Function to execute for each element
    		 * @return {aeq.arrayEx}       [description]
    		 */
    		select: function (callback) {
    			var selectedArr = [];
    			var len = this.length;

    			for(var i=0; i < len; i++)
    				selectedArr.push(callback(this[i], i, this));

    			return aeq.arrayEx(selectedArr);
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {Function} callback Function to execute for each element
    		 * @return {object}            [description]
    		 */
    		map: function (callback) {
    			var obj = {};
    			var len = this.length;

    			for(var i=0; i < len; i++)
    			{
    				var o = callback(this[i], i, this);
    				obj[o.key] = o.value;
    			}

    			return obj;
    		},

    		/**
    		 * Inserts an element into arrayEx at specified index
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param  {any}    insert Element to insert
    		 * @param  {number} index  Index to insert element at
    		 */
    		insertAt: function (insert, index) {
    			this.splice(index, 0, insert);
    		},

    		/**
    		 * Sets or gets an attribute value for all objects in the array. When getting a
    		 * value, it only returns the valure from the first object.
    		 * @method
    		 * @memberof aeq.arrayEx
    		 * @param {string} attributeName  The name of the attribute to get or set.
    		 * @param  {Any}    [newValue]    The value to set. If not given, will only get
    		 *                                the value of the first object.
    		 * @return {Any}                  when getting, the value of the attribute.
    		 *                                When setting, `undefined`.
    		 * @see aeq.attr
    		 */
    		attr: function() {
    			// Add this array object to the beginning of arguments
    			[].unshift.call(arguments, this);
    			return aeq.attr.apply( this, arguments );
    		}
    	};





    	/**
    	 * Converts a CompItem into an aeq.Comp object
    	 * @memberof aeq
    	 * @class
    	 * @param  {CompItem} comp CompItem to turn into aeq.Comp object
    	 * @return {aeq.Comp} aeq.Comp object of CompItem
    	 */
    	aeq.Comp = function (comp) {
    		if (comp instanceof aeq.Comp) {
    			return comp;
    		}
    		if (this instanceof aeq.Comp) {
    			this.comp = comp;
    		} else {
    			return new aeq.Comp(comp);
    		}
    	};

    	aeq.Comp.prototype = {
    		isAeq: true,

    		toString: function() {
    			return "[object aeq.Comp]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * Get the original object
    		 * @method
    		 * @instance
    		 * @return {CompItem}
    		 */
    		get: function() {
    			return this.comp;
    		},

    		/**
    		 * Runs a function on each layer in aeq.Comp object
    		 * @method
    		 * @instance
    		 * @param  {Function} callback Function to run on each layer in aeq.Comp object
    		 */
    		forEachLayer: function(callback) {
    			var length = this.comp.numLayers, i = 1;
    			for ( ; i <= length; i++) {
    				callback(this.comp.layer(i), i, this);
    			}
    		}
    	};




    	/**
    	 * Converts a Key into an aeq.Key object
    	 * @memberof aeq
    	 * @class
    	 * @param  {Property} property Property to find key on
    	 * @param  {number}   index    The index of the key
    	 * @return {aeq.Key}           aeq.Key object
    	 */
    	aeq.Key = function (property, index) {
    		if (this instanceof aeq.Key) {
    			if (property instanceof aeq.Property) {
    				property = property.get();
    			}
    			// Check if index is valid
    			if (index <= 0 || index > property.numKeys) {
    				throw new Error("Index " + index + " out of range 1-" + property.numKeys);
    			}

    			this.property = property;
    			this.index = index;
    			this.originalTime = this.getTime();
    		} else {
    			return new aeq.Key(property, index);
    		}
    	};

    	aeq.Key.prototype = {
    		isAeq: true,

    		toString: function() {
    			return "[object aeq.Key]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		// Used to check if the key index is the correct for refrensing
    		// TODO: consider not checking this in every function or find better way to do this
    		checkKey: function() {

    			// Check if index is in range and that key at that index is at correct time
    			if (this.index <= this.property.numKeys && this.getTime() === this.originalTime) {
    				return; // If it is, then the index is still correct
    			}

    			// Get the keyIndex nearest to the keyTime
    			var newIndex = this.property.nearestKeyIndex(this.originalTime);

    			// The time of the nearest keyIndex could be something else if the original key
    			// was deleted, so we need to check it
    			if (this.property.keyTime(newIndex) === this.originalTime) {
    				this.index = newIndex;
    			} else {
    				throw new Error("Original key has been deleted/moved");
    			}
    		},

    		// Need two time functions because `this.time` relies on checkKey
    		/**
    		 * Gets comp time of current key
    		 * @instance
    		 * @method
    		 * @return {number} Key time of current key, in seconds
    		 */
    		getTime: function() {
    			return this.property.keyTime(this.index);
    		},

    		/**
    		 * Interpolation type object
    		 * @typedef  {object} InterpolationType
    		 * @property {KeyframeInterpolationType} inType  Interpolation for keyIn
    		 * @property {KeyframeInterpolationType} outType Interpolation for keyOut
    		 */

    		/**
    		 * @typedef {object} KeyframeInterpolationType
    		 * @property {number} LINEAR
    		 * @property {number} BEZIER
    		 * @property {number} HOLD
    		 */

    		/**
    		 * Gets or sets interpolation type of current key
    		 * @method
    		 * @instance
    		 * @param  {KeyframeInterpolationType} [inType]  In KeyframeInterpolationType enumerated value to set
    		 * @param  {KeyframeInterpolationType} [outType] Out KeyframeInterpolationType enumerated value to set
    		 * @return {InterpolationType|boolean}         Object of In/Out Interp types, or true/false if can/can't set type
    		 */
    		interpolationType: function(inType, outType) {
    			this.checkKey();

    			// Return current value if no arguments
    			if (arguments.length === 0) {
    				return {
    					inType: this.property.keyInInterpolationType(this.index),
    					outType: this.property.keyOutInterpolationType(this.index)
    				};
    			}

    			// If arguments, set new value

    			// Check if arguments is a value returned from this function
    			if ( outType === undefined && inType.outType ) {
    				outType = inType.outType;
    			}
    			if ( inType.inType ) {
    				inType = inType.inType;
    			}

    			// Use strings as a shorthand for KeyframeInterpolationType.TYPE
    			if (aeq.isString(inType)) {
    				inType = KeyframeInterpolationType[inType];
    			}

    			if (outType && aeq.isString(outType)) {
    				outType = KeyframeInterpolationType[outType];

    				// If outType is not defined the inType is used (standard behaviour)
    			} else if (outType === undefined) {
    				outType = inType;
    			}

    			// Check that the value is valid
    			// TODO: should this be skipped and just throw error?
    			if (!this.property.isInterpolationTypeValid(inType) ||
    				(outType && !this.property.isInterpolationTypeValid(outType) )) {
    				return false;
    			}

    			this.property.setInterpolationTypeAtKey(this.index, inType, outType);
    			return true;
    		},

    		/**
    		 * SpatialTangent type object
    		 * @typedef  {object} SpatialTangent
    		 * @property {KeyframeSpatialTangent} inTangent  Tangent for keyIn
    		 * @property {KeyframeSpatialTangent} outTangent Tangent for keyOut
    		 */

    		/**
    		 * @typedef {number[]} KeyframeSpatialTangent
    		 * @property {number} xSpatialTangent
    		 * @property {number} ySpatialTangent
    		 * @property {number} [zSpatialTangent]
    		 */

    		/**
    		 * Gets or sets in/out spatial tangents of current key
    		 * @method
    		 * @instance
    		 * @param  {KeyframeSpatialTangent} [inType]  In KeyframeSpatialTangent enumerated value to set
    		 * @param  {KeyframeSpatialTangent} [outType] Out KeyframeSpatialTangent enumerated value to set
    		 * @return {SpatialTangent}                 Object of In/Out spatial tangent values
    		 */
    		spatialTangent: function(inType, outType) {
    			this.checkKey();

    			// Return current value if no arguments
    			if (arguments.length === 0) {
    				return {
    					inTangent: this.property.keyInSpatialTangent(this.index),
    					outTangent: this.property.keyOutSpatialTangent(this.index)
    				};
    			}

    			// Check if arguments is a value returned from this function
    			if ( outType === undefined && inType.outTangent ) {
    				outType = inType.outTangent;
    			}
    			if ( inType.inTangent ) {
    				inType = inType.inTangent;
    			}

    			this.property.setSpatialTangentsAtKey(this.index, inType, outType);
    		},

    		/**
    		 * TemporalEase type object
    		 * @typedef  {object} TemporalEase
    		 * @property {KeyframeTemporalEase} inTemporalEase  TemporalEase for keyIn
    		 * @property {KeyframeTemporalEase} outTemporalEase TemporalEase for keyOut
    		 */

    		/**
    		 * @typedef {number[]} KeyframeTemporalEase
    		 * @property {number} xTemporalEase
    		 * @property {number} yTemporalEase
    		 * @property {number} [zTemporalEase]
    		 */

    		/**
    		 * Gets or sets in/out temporal ease of current key
    		 * @method
    		 * @instance
    		 * @param  {KeyframeTemporalEase} [inType]  In KeyframeTemporalEase enumerated value to set
    		 * @param  {KeyframeTemporalEase} [outType] Out KeyframeTemporalEase enumerated value to set
    		 * @return {TemporalEase}                   Object of In/Out temporal ease values
    		 */
    		temporalEase: function(inType, outType) {
    			this.checkKey();

    			// Return current value if no arguments
    			if (arguments.length === 0) {
    				return {
    					inEase: this.property.keyInTemporalEase(this.index),
    					outEase: this.property.keyOutTemporalEase(this.index)
    				};
    			}

    			// Check if arguments is a value returned from this function
    			if ( outType === undefined && inType.outEase ) {
    				outType = inType.outEase;
    			}
    			if ( inType.inEase ) {
    				inType = inType.inEase;
    			}

    			// TemporalEase have to be set using arrays of KeyframeEaseObjects with
    			// number of objects in the array matching the propertyValueType
    			if (!aeq.isArray(inType)) {
    				if (this.valueTypeIs("TwoD")) {
    					inType = [inType, inType];
    				} else if (this.valueTypeIs("ThreeD")) {
    					inType = [inType, inType, inType];
    				} else {
    					inType = [inType];
    				}
    			}
    			if (outType && !aeq.isArray(outType)) {
    				if (this.valueTypeIs("TwoD")) {
    					outType = [outType, outType];
    				} else if (this.valueTypeIs("ThreeD")) {
    					outType = [outType, outType, outType];
    				} else {
    					outType = [outType];
    				}
    			}

    			this.property.setTemporalEaseAtKey(this.index, inType, outType);
    		},

    		/**
    		 * Gets comp time of current key
    		 * @instance
    		 * @method
    		 * @return {number} Key time of current key, in seconds
    		 */
    		time: function() {
    			this.checkKey();
    			return this.originalTime;
    		},

    		/**
    		 * Removes current key from property
    		 * @method
    		 * @instance
    		 */
    		remove: function() {
    			this.checkKey();
    			this.property.removeKey(this.index);
    		},

    		/**
    		 * @typedef aeq.KeyInfo
    		 * @property {Property}          property           Prop that the key lives on
    		 * @property {any}               value              Key value
    		 * @property {time}              number             Key time
    		 * @property {InterpolationType} interpolationType  In/out interpolation type
    		 * @property {TemporalEase}      temporalEase       In/out temporal ease
    		 * @property {SpatialTangent}    spatialTangent     In/out spatial tangents
    		 * @property {boolean}           temporalAutoBezier Whether key has temporal auto-Bezier interpolation
    		 * @property {boolean}           temporalContinuous Whether key has temporal continuity
    		 * @property {boolean}           spatialAutoBezier  Whether key has spatial auto-Bezier interpolation
    		 * @property {boolean}           spatialContinuous  Whether key has spatial continuity
    		 * @property {boolean}           roving             Whether key is roving
    		 */

    		/**
    		 * Gets key data
    		 * @method
    		 * @instance
    		 * @return {aeq.KeyInfo} [description]
    		 */
    		getKeyinfo: function() {
    			this.checkKey();
    			var keyInfo = {
    				property: this.property,
    				interpolationType: this.interpolationType(),
    				value: this.value(),
    				time: this.time()
    			};

    			// These do not have any effect if interpolationType is not Bezier for in and out
    			if (keyInfo.interpolationType.inType === KeyframeInterpolationType.BEZIER &&
    					keyInfo.interpolationType.outType === KeyframeInterpolationType.BEZIER) {
    				keyInfo.temporalAutoBezier = this.temporalAutoBezier();
    				keyInfo.temporalContinuous = this.temporalContinuous();
    			}

    			// TODO: find out why this check is here, was like that in rd_scooter
    			if (keyInfo.interpolationType.outType !== KeyframeInterpolationType.HOLD) {
    				keyInfo.temporalEase = this.temporalEase();
    			}

    			// These attributes throws an error if valuetype is not spatial when setting
    			if (this.valueTypeIs("TwoD_SPATIAL" ) || this.valueTypeIs("ThreeD_SPATIAL")) {
    				keyInfo.spatialAutoBezier = this.spatialAutoBezier();
    				keyInfo.spatialContinuous = this.spatialContinuous();
    				keyInfo.spatialTangent = this.spatialTangent();
    				keyInfo.roving = this.roving();
    			}
    			return keyInfo;
    		},

    		/**
    		 * Copies current key to a new property at current (or target) time
    		 * @method
    		 * @instance
    		 * @param  {Property} targetProp            Property to create new key on
    		 * @param  {number} [time=aeq.KeyInfo.time] Time to create new key at; defaults to current key's time
    		 * @return {aeq.Key}                        New key
    		 */
    		copyTo: function(targetProp, time) {
    			var keyInfo = this.getKeyinfo();
    			keyInfo.time = time !== undefined ? time : keyInfo.time;

    			if ( targetProp.isAeq ) {
    				targetProp = targetProp.get();
    			}
    			keyInfo.property = targetProp;
    			return aeq.pasteKey(keyInfo);
    		},

    		/**
    		 * Moves current key to new time
    		 * @method
    		 * @instance
    		 * @param  {number} time New key time
    		 */
    		moveTo: function(time) {
    			var thisTime = this.time();

    			// Keyframe should not be moved
    			if (time === thisTime) {
    				return;
    			}

    			var newKey = this.copyTo(this.property, time);
    			this.remove();

    			this.index = this.property.nearestKeyIndex(newKey.time());
    			this.originalTime = time;
    		},

    		/**
    		 * Checks whether this property type matches argument
    		 * @method
    		 * @instance
    		 * @param  {string} type PropertyValueType to check
    		 * @return {boolean} `true` if property type matches argument
    		 */
    		valueTypeIs: function valueTypeIs(type) {
    			return this.property.propertyValueType === PropertyValueType[type];
    		}
    	};

    	// Create many methods that function the same way at the same time
    	aeq.forEach([
    		"roving",
    		"selected",
    		"spatialAutoBezier",
    		"spatialContinuous",
    		"temporalAutoBezier",
    		"temporalContinuous",
    		"value"
    	], function(type) {
    		var typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
    		var getter = "key" + typeCapitalized;
    		var setter = "set" + typeCapitalized + "AtKey";

    		aeq.Key.prototype[type] = function() {
    			this.checkKey();
    			if (arguments.length === 0) {
    				return this.property[getter](this.index);
    			}

    			// Add this.index to the beginning of the arguments array
    			[].unshift.call(arguments, this.index);
    			this.property[setter].apply(this.property, arguments);
    		};
    	});

    	/**
    	 * Pastes key info?
    	 * @method
    	 * @instance
    	 * @param {aeq.KeyInfo} keyInfo
    	 * @return {aeq.Key} New key
    	 */
    	aeq.pasteKey = function( keyInfo ) {
    		var keyIndex = keyInfo.property.addKey(keyInfo.time);
    		var key = new aeq.Key(keyInfo.property, keyIndex);

    		if (keyInfo.property.value.length === 2 && aeq.isArray(keyInfo.value) && keyInfo.value.length === 3) {
    			keyInfo.value = [keyInfo.value[0], keyInfo.value[1]];
    			keyInfo.spatialTangent.inTangent = [keyInfo.spatialTangent.inTangent[0], keyInfo.spatialTangent.inTangent[1]];
    			keyInfo.spatialTangent.outTangent = [keyInfo.spatialTangent.outTangent[0], keyInfo.spatialTangent.outTangent[1]];
    		}

    		key.value(keyInfo.value);

    		// Copy over the keyframe settings
    		if (keyInfo.temporalEase !== undefined) {
    			key.temporalEase(keyInfo.temporalEase);
    		}

    		key.interpolationType(keyInfo.interpolationType);

    		if (keyInfo.temporalAutoBezier !== undefined && keyInfo.temporalContinuous !== undefined) {

    			key.temporalAutoBezier(keyInfo.temporalAutoBezier);
    			key.temporalContinuous(keyInfo.temporalContinuous);
    		}

    		if (keyInfo.spatialAutoBezier !== undefined && keyInfo.spatialContinuous !== undefined) {
    			key.spatialAutoBezier(keyInfo.spatialAutoBezier);
    			key.spatialContinuous(keyInfo.spatialContinuous);

    			key.spatialTangent(keyInfo.spatialTangent);
    			key.roving(keyInfo.roving);
    		}
    		return key;
    	};





    	/**
    	 * Converts a Layer into an aeq.Layer object
    	 * @memberof aeq
    	 * @class
    	 * @param  {Layer} layer Layer to turn into aeq.Layer object
    	 * @return {aeq.Layer} aeq.Layer object of Layer
    	 */
    	aeq.Layer = function (layer) {
    		if (layer instanceof aeq.Layer) {
    			return layer;
    		}

    		// Check if function called with "new" keyword
    		if (this instanceof aeq.Layer) {
    			this.layer = layer;

    		} else {
    			return new aeq.Layer(layer);
    		}
    	};

    	aeq.Layer.prototype = {
    		isAeq: true,

    		toString: function() {
    			return "[object aeq.Layer]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * Get the original object
    		 * @method
    		 * @instance
    		 * @return {Layer}
    		 */
    		get: function() {
    			return this.layer;
    		},

    		/**
    		 * Gets or sets layer parent
    		 * @method
    		 * @instance
    		 * @param  {aeq.SelectorString|null} [selector] Selector for new parent, or null to remove parent
    		 * @return {Layer|null} Parent layer, or null if none
    		 */
    		parent: function(selector) {
    			if (arguments.length === 0) {
    				return this.layer.parent;
    			}

    			// Pass in null to remove the parent
    			if (selector === null) {
    				this.layer.parent = null;
    				return null;
    			}

    			var layer = getLayer(this.layer, selector);

    			if (layer === null) {
    				return null;
    			}
    			this.layer.parent = layer;
    			return layer;
    		},

    		/**
    		 * Copies current layer to comp
    		 * @method
    		 * @instance
    		 * @param  {CompItem|aeq.Comp} comp Comp to copy layer to
    		 * @return {aeq.Layer}              Newly copied layer
    		 */
    		copyToComp: function(comp) {
    			if (!aeq.isComp(comp)) {
    				if (comp instanceof aeq.Comp) {
    					comp = comp.comp;
    				} else if (aeq.isString(comp)) {
    					comp = aeq.getComp(comp);
    				}
    			}
    			this.layer.copyToComp(comp);
    			return this;
    		},

    		/**
    		 * Removes this layer's parent
    		 * @method
    		 * @instance
    		 * @return {aeq.Layer} This layer
    		 */
    		removeParent: function() {
    			this.layer.parent = null;
    			return this;
    		},

    		/**
    		 * Executes a callback function on each effect on this layer
    		 * @method
    		 * @instance
    		 * @param  {Function} callback Function to run on each effect
    		 * @return {aeq.Layer}         This layer
    		 */
    		forEachEffect: function(callback) {
    			var effects = this.layer.property("ADBE Effect Parade"),
    				length = effects.numProperties, i = 1;

    			for ( ; i <= length; i++ ) {
    				callback(effects.property(i), i, effects);
    			}
    			return this;
    		},

    		/**
    		 * Adds effect to layer by name or matchname
    		 * @method
    		 * @instance
    		 * @param  {string} effectName Effect name or matchname to add to layer
    		 */
    		addEffect: function(effectName) {
    			var effects = this.layer.property("ADBE Effect Parade");
    			if ( effects.canAddProperty( effectName ) ) {
    				effects.addProperty( effectName );
    			} else {
    				throw new Error( 'Can not add effect "' + effectName + '" to this layer' );
    			}
    		},

    		/**
    		 * Gets all layers that has the given layer as its parent.
    		 * @method
    		 * @instance
    		 * @return {Layer[]} Children of this layer
    		 */
    		children: function() {
    			return aeq.layer.children( this.layer );
    		},

    		/**
    		 * Gets all layers that has the given layer as its parent, and all layers
    		 * that has those layers, and so on.
    		 * @method
    		 * @instance
    		 * @return {Layer[]} Children and decendants of this layer
    		 */
    		allChildren: function() {
    			return aeq.layer.allChildren( this.layer );
    		},

    		/**
    		 * This layer's parent chain
    		 * @method
    		 * @instance
    		 * @return {Layer[]} Parents of this layer
    		 */
    		parents: function() {
    			return aeq.layer.parents( this.layer );
    		},

    		/**
    		 * All [parents]{@link aeq.layer.parents} and
    		 * [all children]{@link aeq.layer.allChildren} of the this layer.
    		 * @method
    		 * @instance
    		 * @return {Layer[]} The layer's parents and children.
    		 */
    		relatedLayers: function() {
    			return aeq.layer.relatedLayers( this.layer );
    		}
    	};

    	// Create methods that only returns the value for attributes that are read-
    	// only and can change over time;
    	aeq.forEach([
    		"active",
    		"index",
    		"isNameSet",
    		"selectedProperties",
    		"time",
    		"containingComp",
    		"hasVideo"
    	], function(attribute) {
    		aeq.Layer.prototype[attribute] = function() {
    			return this.layer[attribute];
    		};
    	});

    	// Create methods for attributes that are basic read/write
    	aeq.forEach([
    		"comment",
    		"enabled",
    		"inPoint",
    		"locked",
    		"name",
    		"outPoint",
    		"shy",
    		"solo",
    		"startTime",
    		"stretch"
    	], function(attribute) {
    		aeq.Layer.prototype[attribute] = function(newValue) {
    			if (arguments.length === 0) {
    				return this.layer[attribute];
    			}
    			this.layer[attribute] = newValue;

    			// Return the aeq.Layer object for chaining methods
    			return this;
    		};
    	});

    	// Create Methods that just call the layer object methods
    	aeq.forEach([
    		"activeAtTime",
    		"applyPreset",
    		"duplicate",
    		"remove",
    		"moveToBeginning",
    		"moveToEnd"
    	], function(method) {
    		aeq.Layer.prototype[method] = function(newValue) {
    			this.layer[method](newValue);

    			// Return the aeq.Layer object for chaining methods
    			return this;
    		};
    	});

    	// Create methods that can take a Layer, aeq.Layer, number or string as input
    	// and need to pass that to a method that takes a Layer object
    	aeq.forEach([
    		"setParentWithJump",
    		"moveAfter",
    		"moveBefore"
    	], function(method) {
    		aeq.Layer.prototype[method] = function(selector) {
    			var layer = getLayer(this.layer, selector);

    			if (layer === null) {
    				return null;
    			}
    			this.layer[method](layer);
    			return layer;
    		};
    	});


    	// Used in aeq.Layer.parent, setParentWithJump and move methods
    	var regexRelativeIndex = /^(\+|-)=/;

    	/* The selector argument can be one of the following:
    	* An aeq.Layer object
    	* A Layer object
    	* An index for a layer in the comp
    	* A string with a layer name
    	* A string starting with "+=" or "-=" then a number to indicate an index
    	* relative to the current layer
    	*/
    	function getLayer(baseLayer, selector) {
    		var index, offset;

    		// Set the value
    		if (selector instanceof aeq.Layer) {
    			return selector.layer;
    		}
    		if (aeq.isLayer(selector)) {
    			return selector;
    		}
    		// Set parent to layer with index
    		if (aeq.isNumber(selector)) {
    			return baseLayer.containingComp.layer(selector);
    		}

    		// Set parent to layer with name or with a relative index
    		if (aeq.isString(selector)) {

    			// Check if string starts with "+=" or "-="
    			if (regexRelativeIndex.test(selector)) {
    				offset = getRelativeIndex(selector);
    				if (offset) {
    					// Set parent to layer with index relative to this layer
    					index = baseLayer.index + offset;

    					// Return null if index is out of range
    					if (index === 0 || index > baseLayer.containingComp.numLayers) {
    						return null;
    					}
    					return baseLayer.containingComp.layer(index);
    				}
    			}
    			// Use the string as a name if it does not start with += or -= or if the
    			// rest of the string is not a valid number
    			return baseLayer.containingComp.layer(selector);
    		}
    		// If none of the above is true it should return null
    		return null;
    	}

    	function getRelativeIndex(str) {
    		var offset = str.charAt(0) + str.substr(2);
    		offset = parseInt(offset, 10);
    		if (isNaN(offset)) {
    			return false;
    		}
    		return offset;
    	}





    	/**
    	 * Converts a Property into an aeq.Property object
    	 * @memberof aeq
    	 * @class
    	 * @param  {Property} property Property to convert
    	 * @return {aeq.Property}      aeq.Property object
    	 */
    	aeq.Property = function (property) {
    		if (property instanceof aeq.Property) {
    			return property;
    		}
    		if (this instanceof aeq.Property) {
    			this.property = property;
    		} else {
    			return new aeq.Property(property);
    		}
    	};

    	aeq.Property.prototype = {
    		isAeq: true,

    		toString: function() {
    			return "[object aeq.Property]";
    		},

    		// Function for extending the prototype using objects
    		extend: aeq.extend,

    		/**
    		 * Get the original object
    		 * @method
    		 * @instance
    		 * @return {Property}
    		 */
    		get: function() {
    			return this.property;
    		},

    		/**
    		 * Gets or sets expression on property
    		 * @method
    		 * @instance
    		 * @param  {string} [newValue] Expression to set
    		 * @return {string|boolean}    Returns current expression, current expression error, or `true` if expression was set
    		 */
    		expression: function(newValue) {
    			if (!this.property.canSetExpression) {
    				return false;
    			}
    			if (arguments.length === 0) {
    				return this.property.expression;
    			}
    			this.property.expression = newValue;
    			if (this.property.expressionError === ""
    					&& (this.property.expressionEnabled
    					|| newValue === "")) {
    				return true;
    			}
    			return this.property.expressionError;
    		},

    		/**
    		 * Gets array of selected keys
    		 * @method
    		 * @instance
    		 * @return {Key[]} Array of keys to return
    		 */
    		selectedKeys: function() {
    			var selectedKeys = [];
    			// Return key objects for selected keys
    			for (var i = 1; i <= this.property.selectedKeys.length; i++) {
    				selectedKeys.push(this.key(i));
    			}
    			return selectedKeys;
    		},

    		/**
    		 * Adds & returns a new key at time
    		 * @method
    		 * @instance
    		 * @param  {number} time The time in seconds; a floating-point value. The beginning of the composition is 0.
    		 * @return {Key}         Newly-created key
    		 */
    		addKey: function(time) {
    			var keyIndex = this.property.addKey(time);
    			return this.key(keyIndex);
    		},

    		/**
    		 * Retrieves property following passed dimension
    		 * @method
    		 * @instance
    		 * @param  {number} dim The dimension number (starting at 0).
    		 * @return {Property}   Property following passed dimension
    		 */
    		separationFollower: function(dim) {
    			return this.property.getSeparationFollower(dim);
    		},

    		/**
    		 * Returns the index of the keyframe nearest to the specified time.
    		 * @method
    		 * @instance
    		 * @param  {number} time The time in seconds; a floating-point value. The beginning of the composition is 0.
    		 * @return {Key}         Nearest key
    		 */
    		nearestKeyIndex: function(time) {
    			var keyIndex = this.property.nearestKeyIndex(time);
    			return this.key(keyIndex);
    		},

    		/**
    		 * Removes key by index or key object
    		 * @method
    		 * @instance
    		 * @param  {number|Key} keyIndex Index of target key, or key itself
    		 */
    		removeKey: function(keyIndex) {
    			if (aeq.isNumber(keyIndex)) {
    				this.property.removeKey(keyIndex);
    			} else if (keyIndex.toString() === "[object aeq.Key]") {
    				keyIndex.remove();
    			}
    		},

    		/**
    		 * Returns the original multidimensional property for this separated follower
    		 * Can only be accessed if the property is one of the separated properties
    		 * 	(e.g Y Position), otherwise AE throws an error
    		 * @method
    		 * @instance
    		 * @return {Property|null} Original multidimensional property, or null
    		 */
    		separationLeader: function() {
    			if (this.property.isSeparationFollower) {
    				return this.property.separationLeader;
    			}
    			return null;
    		},

    		/**
    		 * Returns the dimension number it represents in the multidimensional leader
    		 * Can only be accessed if the property is one of the separated properties
    		 * 	(e.g Y Position), otherwise AE throws an error
    		 * @method
    		 * @instance
    		 * @return {number|null} Dimension number, or null
    		 */
    		separationDimension: function() {
    			if (this.property.isSeparationFollower) {
    				return this.property.separationDimension;
    			}
    			return null;
    		},

    		/**
    		 * Returns maximum permitted value of property
    		 * @method
    		 * @instance
    		 * @return {number|null} Max value, or null if there isn't one
    		 */
    		maxValue: function() {
    			if (this.property.hasMax) {
    				return this.property.maxValue;
    			}
    			return null;
    		},

    		/**
    		 * Returns minimum permitted value of property
    		 * @method
    		 * @instance
    		 * @return {number|null} Max value, or null if there isn't one
    		 */
    		minValue: function() {
    			if (this.property.hasMin) {
    				return this.property.minValue;
    			}
    			return null;
    		},

    		/**
    		 * Gets or sets property value
    		 * 	If expressionEnabled is true, returns the evaluated expression value.
    		 * 	If there are keyframes, returns the keyframed value at the current time.
    		 * 	Otherwise, returns the static value.
    		 * @method
    		 * @instance
    		 * @param  {any} [newValue] New value to try to set
    		 * @return {any}            Current value
    		 */
    		value: function(newValue) {
    			if (arguments.length === 0) {
    				return this.property.value;
    			}
    			this.property.setValue(newValue);
    		},

    		/**
    		 * Get or set the value of the current property as evaluated at the specified time
    		 * @method
    		 * @instance
    		 * @param  {number} time    The time in seconds; a floating-point value. The beginning of the composition is 0.
    		 * @param  {any}    [value] Property value at time
    		 * @return {any|number}     Set value, or index of nearest key to `time`
    		 */
    		valueAtTime: function(time, value) {
    			// TODO: Both setValueAtTime and valueAtTime require two arguments
    			// How should this be handled?
    			if (arguments.length === 1) {
    				return this.property.valueAtTime(time);
    			}
    			this.property.setValueAtTime(time, value);

    			// TODO: should returning key object be optional?
    			return this.nearestKeyIndex(time);
    		},

    		/**
    		 * Get or sets values for a set of keyframes at specified times
    		 * @method
    		 * @instance
    		 * @param  {number[]} time    Array of times
    		 * @param  {any[]}    [value] Array of values
    		 * @return {any[]|number[]}   Array of set values, or array of indices of nearest key to `time`
    		 */
    		valuesAtTimes: function(times, values) {
    			var result = [], i = 0, il = times.length;
    			if (arguments.length === 1) {
    				for ( ; i < il; i++ ) {
    					// TODO: valueAtTime require two arguments How should this be handled?
    					result.push(this.property.valueAtTime(times[i]));
    				}
    				return result;
    			}
    			this.property.setValuesAtTimes(times, values);

    			// TODO: should returning key objects be optional?
    			for ( ; i < il; i++ ) {
    				result.push(this.nearestKeyIndex(times[i]));
    			}
    			return result;
    		},

    		/**
    		 * Runs a function on each key in current property
    		 * @method
    		 * @instance
    		 * @param  {Function} callback Function to execute on each key
    		 */
    		forEachKey: function(callback) {
    			var keys = this.getKeys()
    			var length = keys.length, i = 0;

    			for ( ; i < length; i++ ) {
    				callback(keys[i], keys[i].index, this.property);
    			}
    		},

    		/**
    		 * Returns a aeq.Key object for specific key index
    		 * @method
    		 * @instance
    		 * @param  {number} keyIndex Index of target key
    		 * @return {aeq.Key}         aeq.Key object for target key
    		 */
    		key: function(keyIndex) {
    			return new aeq.Key(this.property, keyIndex);
    		},

    		/**
    		 * Gets all keys of the property
    		 * @method
    		 * @return {aeq.Key[]} ArrayEx of all keyframes on the property
    		 */
    		getKeys: function() {
    			var keys = []
    			var length = this.property.numKeys, i = 1;

    			for ( ; i <= length; i++ ) {
    				keys.push(this.key(i));
    			}
    			return aeq.arrayEx( keys )
    		}
    	};

    	// Create functions for read-only attributes
    	aeq.forEach([
    		"expressionError",
    		"isTimeVarying",
    		"numKeys",
    		"canSetExpression",
    		"canVaryOverTime",
    		"isSpatial",
    		"isSeparationFollower",
    		"isSeparationLeader",
    		"propertyIndex",
    		"propertyValueType",
    		"unitsText"
    	], function(attribute) {
    		aeq.Property.prototype[attribute] = function() {
    			return this.property[attribute];
    		};
    	});



    	return aeq;
    }());

    var cssselector=(function() {
      "use strict";

      /*
       * Generated by PEG.js 0.9.0.
       *
       * http://pegjs.org/
       */

      function peg$subclass(child, parent) {
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
      }

      function peg$SyntaxError(message, expected, found, location) {
        this.message  = message;
        this.expected = expected;
        this.found    = found;
        this.location = location;
        this.name     = "SyntaxError";

        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, peg$SyntaxError);
        }
      }

      peg$subclass(peg$SyntaxError, Error);

      function peg$parse(input) {
        var options = arguments.length > 1 ? arguments[1] : {},
            parser  = this,

            peg$FAILED = {},

            peg$startRuleFunctions = { Start: peg$parseStart },
            peg$startRuleFunction  = peg$parseStart,

            peg$c0 = "[",
            peg$c1 = { type: "literal", value: "[", description: "\"[\"" },
            peg$c2 = "]",
            peg$c3 = { type: "literal", value: "]", description: "\"]\"" },
            peg$c4 = function(props) { return mergeProps(props) },
            peg$c5 = "(",
            peg$c6 = { type: "literal", value: "(", description: "\"(\"" },
            peg$c7 = ")",
            peg$c8 = { type: "literal", value: ")", description: "\")\"" },
            peg$c9 = /^[a-zA-Z]/,
            peg$c10 = { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
            peg$c11 = function(name) { var o = {}; var key = name.join(''); o[key] = { type: 'Bool', value: true }; return o; },
            peg$c12 = "=",
            peg$c13 = { type: "literal", value: "=", description: "\"=\"" },
            peg$c14 = function(name, value) { var o = {}; var key = name.join(''); o[key] = value; return o; },
            peg$c15 = function(type, props, pseudo) {
                return { type: type.join('').toLowerCase(), props: props, pseudo: pseudo }
              },
            peg$c16 = ":",
            peg$c17 = { type: "literal", value: ":", description: "\":\"" },
            peg$c18 = function(type, props) { return { type: type.join('').toLowerCase(), props: props } },
            peg$c19 = function(literal) { return literal; },
            peg$c20 = function() { return { type: 'Bool', value: true } },
            peg$c21 = function() { return { type: 'Bool', value: false } },
            peg$c22 = "0",
            peg$c23 = { type: "literal", value: "0", description: "\"0\"" },
            peg$c24 = /^[0-9]/,
            peg$c25 = { type: "class", value: "[0-9]", description: "[0-9]" },
            peg$c26 = /^[1-9]/,
            peg$c27 = { type: "class", value: "[1-9]", description: "[1-9]" },
            peg$c28 = ".",
            peg$c29 = { type: "literal", value: ".", description: "\".\"" },
            peg$c30 = function() { return { type: 'Number', value: parseFloat(text()) } },
            peg$c31 = function() { return { type: 'Integer', value: parseFloat(text()) } },
            peg$c32 = "0x",
            peg$c33 = { type: "literal", value: "0x", description: "\"0x\"" },
            peg$c34 = function(digits) { return { type: "Hex", value: parseInt(digits, 16) } },
            peg$c35 = /^[0-9a-f]/i,
            peg$c36 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
            peg$c37 = "\"",
            peg$c38 = { type: "literal", value: "\"", description: "\"\\\"\"" },
            peg$c39 = function(chars) {
                  return { type: "String", value: chars.join("") };
                },
            peg$c40 = "'",
            peg$c41 = { type: "literal", value: "'", description: "\"'\"" },
            peg$c42 = "\\",
            peg$c43 = { type: "literal", value: "\\", description: "\"\\\\\"" },
            peg$c44 = { type: "any", description: "any character" },
            peg$c45 = function() { return text(); },
            peg$c46 = function(sequence) { return sequence; },
            peg$c47 = function() { return ""; },
            peg$c48 = function() { return "\0"; },
            peg$c49 = "b",
            peg$c50 = { type: "literal", value: "b", description: "\"b\"" },
            peg$c51 = function() { return "\b";   },
            peg$c52 = "f",
            peg$c53 = { type: "literal", value: "f", description: "\"f\"" },
            peg$c54 = function() { return "\f";   },
            peg$c55 = "n",
            peg$c56 = { type: "literal", value: "n", description: "\"n\"" },
            peg$c57 = function() { return "\n";   },
            peg$c58 = "r",
            peg$c59 = { type: "literal", value: "r", description: "\"r\"" },
            peg$c60 = function() { return "\r";   },
            peg$c61 = "t",
            peg$c62 = { type: "literal", value: "t", description: "\"t\"" },
            peg$c63 = function() { return "\t";   },
            peg$c64 = "v",
            peg$c65 = { type: "literal", value: "v", description: "\"v\"" },
            peg$c66 = function() { return "\v";   },
            peg$c67 = "x",
            peg$c68 = { type: "literal", value: "x", description: "\"x\"" },
            peg$c69 = "u",
            peg$c70 = { type: "literal", value: "u", description: "\"u\"" },
            peg$c71 = function(digits) {
                  return String.fromCharCode(parseInt(digits, 16));
                },
            peg$c72 = /^[\n\r\u2028\u2029]/,
            peg$c73 = { type: "class", value: "[\\n\\r\\u2028\\u2029]", description: "[\\n\\r\\u2028\\u2029]" },
            peg$c74 = { type: "other", description: "end of line" },
            peg$c75 = "\n",
            peg$c76 = { type: "literal", value: "\n", description: "\"\\n\"" },
            peg$c77 = "\r\n",
            peg$c78 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
            peg$c79 = "\r",
            peg$c80 = { type: "literal", value: "\r", description: "\"\\r\"" },
            peg$c81 = "\u2028",
            peg$c82 = { type: "literal", value: "\u2028", description: "\"\\u2028\"" },
            peg$c83 = "\u2029",
            peg$c84 = { type: "literal", value: "\u2029", description: "\"\\u2029\"" },
            peg$c85 = function(head, tail) {
                head.push(tail); return { type: "Array", value: head };
              },
            peg$c86 = ",",
            peg$c87 = { type: "literal", value: ",", description: "\",\"" },
            peg$c88 = function(value) { return value },
            peg$c89 = "true",
            peg$c90 = { type: "literal", value: "true", description: "\"true\"" },
            peg$c91 = "false",
            peg$c92 = { type: "literal", value: "false", description: "\"false\"" },
            peg$c93 = { type: "other", description: "whitespace" },
            peg$c94 = /^[ \t\n\r]/,
            peg$c95 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
            peg$c96 = { type: "other", description: "regular expression" },
            peg$c97 = "/",
            peg$c98 = { type: "literal", value: "/", description: "\"/\"" },
            peg$c99 = function(body, flags) {
                return {
                  type:  "RegExp",
                  body:  body,
                  flags: flags,
                  value: new RegExp(body, flags)
                };
              },
            peg$c100 = function(char_, chars) {
                return char_ + chars;
              },
            peg$c101 = function(chars) { return chars.join(""); },
            peg$c102 = /^[*\\\/[]/,
            peg$c103 = { type: "class", value: "[*\\\\/[]", description: "[*\\\\/[]" },
            peg$c104 = function(char_) { return char_; },
            peg$c105 = /^[\\\/[]/,
            peg$c106 = { type: "class", value: "[\\\\/[]", description: "[\\\\/[]" },
            peg$c107 = function(char_) { return "\\" + char_; },
            peg$c108 = function(chars) { return "[" + chars + "]"; },
            peg$c109 = /^[\]\\]/,
            peg$c110 = { type: "class", value: "[\\]\\\\]", description: "[\\]\\\\]" },
            peg$c111 = /^[gimuy]/,
            peg$c112 = { type: "class", value: "[gimuy]", description: "[gimuy]" },
            peg$c113 = function(parts) { return parts.join(""); },

            peg$currPos          = 0,
            peg$savedPos         = 0,
            peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
            peg$maxFailPos       = 0,
            peg$maxFailExpected  = [],
            peg$silentFails      = 0,

            peg$result;

        if ("startRule" in options) {
          if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
          }

          peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }

        function text() {
          return input.substring(peg$savedPos, peg$currPos);
        }

        function location() {
          return peg$computeLocation(peg$savedPos, peg$currPos);
        }

        function expected(description) {
          throw peg$buildException(
            null,
            [{ type: "other", description: description }],
            input.substring(peg$savedPos, peg$currPos),
            peg$computeLocation(peg$savedPos, peg$currPos)
          );
        }

        function error(message) {
          throw peg$buildException(
            message,
            null,
            input.substring(peg$savedPos, peg$currPos),
            peg$computeLocation(peg$savedPos, peg$currPos)
          );
        }

        function peg$computePosDetails(pos) {
          var details = peg$posDetailsCache[pos],
              p, ch;

          if (details) {
            return details;
          } else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
              p--;
            }

            details = peg$posDetailsCache[p];
            details = {
              line:   details.line,
              column: details.column,
              seenCR: details.seenCR
            };

            while (p < pos) {
              ch = input.charAt(p);
              if (ch === "\n") {
                if (!details.seenCR) { details.line++; }
                details.column = 1;
                details.seenCR = false;
              } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                details.line++;
                details.column = 1;
                details.seenCR = true;
              } else {
                details.column++;
                details.seenCR = false;
              }

              p++;
            }

            peg$posDetailsCache[pos] = details;
            return details;
          }
        }

        function peg$computeLocation(startPos, endPos) {
          var startPosDetails = peg$computePosDetails(startPos),
              endPosDetails   = peg$computePosDetails(endPos);

          return {
            start: {
              offset: startPos,
              line:   startPosDetails.line,
              column: startPosDetails.column
            },
            end: {
              offset: endPos,
              line:   endPosDetails.line,
              column: endPosDetails.column
            }
          };
        }

        function peg$fail(expected) {
          if (peg$currPos < peg$maxFailPos) { return; }

          if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
          }

          peg$maxFailExpected.push(expected);
        }

        function peg$buildException(message, expected, found, location) {
          function cleanupExpected(expected) {
            var i = 1;

            expected.sort(function(a, b) {
              if (a.description < b.description) {
                return -1;
              } else if (a.description > b.description) {
                return 1;
              } else {
                return 0;
              }
            });

            while (i < expected.length) {
              if (expected[i - 1] === expected[i]) {
                expected.splice(i, 1);
              } else {
                i++;
              }
            }
          }

          function buildMessage(expected, found) {
            function stringEscape(s) {
              function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

              return s
                .replace(/\\/g,   '\\\\')
                .replace(/"/g,    '\\"')
                .replace(/\x08/g, '\\b')
                .replace(/\t/g,   '\\t')
                .replace(/\n/g,   '\\n')
                .replace(/\f/g,   '\\f')
                .replace(/\r/g,   '\\r')
                .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
                .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
                .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
                .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
            }

            var expectedDescs = new Array(expected.length),
                expectedDesc, foundDesc, i;

            for (i = 0; i < expected.length; i++) {
              expectedDescs[i] = expected[i].description;
            }

            expectedDesc = expected.length > 1
              ? expectedDescs.slice(0, -1).join(", ")
                  + " or "
                  + expectedDescs[expected.length - 1]
              : expectedDescs[0];

            foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

            return "Expected " + expectedDesc + " but " + foundDesc + " found.";
          }

          if (expected !== null) {
            cleanupExpected(expected);
          }

          return new peg$SyntaxError(
            message !== null ? message : buildMessage(expected, found),
            expected,
            found,
            location
          );
        }

        function peg$parseStart() {
          var s0;

          s0 = peg$parseSelectors();

          return s0;
        }

        function peg$parsePropertiesBrackets() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c0;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c1); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseProperty();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseProperty();
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c2;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c3); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c4(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parsePropertiesParentheses() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 40) {
            s1 = peg$c5;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseProperty();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseProperty();
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s3 = peg$c7;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c4(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseProperty() {
          var s0;

          s0 = peg$parseValuePair();
          if (s0 === peg$FAILED) {
            s0 = peg$parseValueSingle();
          }

          return s0;
        }

        function peg$parseValueSingle() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = [];
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              if (peg$c9.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
            }
          } else {
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c11(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseValuePair() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = [];
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              if (peg$c9.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
            }
          } else {
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s2 = peg$c12;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c13); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseValue();
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c14(s1, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseSelector() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = [];
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              if (peg$c9.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
            }
          } else {
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsePropertiesBrackets();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parsePseudo();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parsePseudo();
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c15(s1, s2, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseSelectors() {
          var s0, s1;

          s0 = [];
          s1 = peg$parseSelector();
          if (s1 !== peg$FAILED) {
            while (s1 !== peg$FAILED) {
              s0.push(s1);
              s1 = peg$parseSelector();
            }
          } else {
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parsePseudo() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 58) {
            s1 = peg$c16;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c9.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c9.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsePropertiesParentheses();
              if (s3 === peg$FAILED) {
                s3 = null;
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c18(s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseValue() {
          var s0;

          s0 = peg$parseBooleanLiteral();
          if (s0 === peg$FAILED) {
            s0 = peg$parseNumericLiteral();
            if (s0 === peg$FAILED) {
              s0 = peg$parseStringLiteral();
              if (s0 === peg$FAILED) {
                s0 = peg$parseArrayLiteral();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseRegularExpressionLiteral();
                }
              }
            }
          }

          return s0;
        }

        function peg$parseNumericLiteral() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$parseHexIntegerLiteral();
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            peg$silentFails++;
            s3 = peg$parseDecimalDigit();
            peg$silentFails--;
            if (s3 === peg$FAILED) {
              s2 = void 0;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c19(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseDecimalLiteral();
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c19(s1);
            }
            s0 = s1;
          }

          return s0;
        }

        function peg$parseBooleanLiteral() {
          var s0, s1;

          s0 = peg$currPos;
          s1 = peg$parseTrueToken();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c20();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseFalseToken();
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c21();
            }
            s0 = s1;
          }

          return s0;
        }

        function peg$parseDecimalIntegerLiteral() {
          var s0, s1, s2, s3;

          if (input.charCodeAt(peg$currPos) === 48) {
            s0 = peg$c22;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseNonZeroDigit();
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseDecimalDigit();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseDecimalDigit();
              }
              if (s2 !== peg$FAILED) {
                s1 = [s1, s2];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }

          return s0;
        }

        function peg$parseDecimalDigit() {
          var s0;

          if (peg$c24.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c25); }
          }

          return s0;
        }

        function peg$parseNonZeroDigit() {
          var s0;

          if (peg$c26.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c27); }
          }

          return s0;
        }

        function peg$parseDecimalLiteral() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = peg$parseDecimalIntegerLiteral();
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s2 = peg$c28;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c29); }
            }
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parseDecimalDigit();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseDecimalDigit();
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c30();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 46) {
              s1 = peg$c28;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c29); }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseDecimalDigit();
              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parseDecimalDigit();
                }
              } else {
                s2 = peg$FAILED;
              }
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c30();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseDecimalIntegerLiteral();
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c31();
              }
              s0 = s1;
            }
          }

          return s0;
        }

        function peg$parseHexIntegerLiteral() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2).toLowerCase() === peg$c32) {
            s1 = input.substr(peg$currPos, 2);
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c33); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = [];
            s4 = peg$parseHexDigit();
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseHexDigit();
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s2 = input.substring(s2, peg$currPos);
            } else {
              s2 = s3;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c34(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseHexDigit() {
          var s0;

          if (peg$c35.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c36); }
          }

          return s0;
        }

        function peg$parseStringLiteral() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c37;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseDoubleStringCharacter();
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseDoubleStringCharacter();
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 34) {
                s3 = peg$c37;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c38); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c39(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 39) {
              s1 = peg$c40;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c41); }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parseSingleStringCharacter();
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseSingleStringCharacter();
              }
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 39) {
                  s3 = peg$c40;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c41); }
                }
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c39(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }

          return s0;
        }

        function peg$parseDoubleStringCharacter() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 34) {
            s2 = peg$c37;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 92) {
              s2 = peg$c42;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c43); }
            }
            if (s2 === peg$FAILED) {
              s2 = peg$parseLineTerminator();
            }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c44); }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c45();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s1 = peg$c42;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c43); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseEscapeSequence();
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c46(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseLineContinuation();
            }
          }

          return s0;
        }

        function peg$parseSingleStringCharacter() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 39) {
            s2 = peg$c40;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 92) {
              s2 = peg$c42;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c43); }
            }
            if (s2 === peg$FAILED) {
              s2 = peg$parseLineTerminator();
            }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c44); }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c45();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s1 = peg$c42;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c43); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parseEscapeSequence();
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c46(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseLineContinuation();
            }
          }

          return s0;
        }

        function peg$parseLineContinuation() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 92) {
            s1 = peg$c42;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseLineTerminatorSequence();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c47();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseEscapeSequence() {
          var s0, s1, s2, s3;

          s0 = peg$parseCharacterEscapeSequence();
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 48) {
              s1 = peg$c22;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c23); }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$currPos;
              peg$silentFails++;
              s3 = peg$parseDecimalDigit();
              peg$silentFails--;
              if (s3 === peg$FAILED) {
                s2 = void 0;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c48();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseHexEscapeSequence();
              if (s0 === peg$FAILED) {
                s0 = peg$parseUnicodeEscapeSequence();
              }
            }
          }

          return s0;
        }

        function peg$parseCharacterEscapeSequence() {
          var s0;

          s0 = peg$parseSingleEscapeCharacter();
          if (s0 === peg$FAILED) {
            s0 = peg$parseNonEscapeCharacter();
          }

          return s0;
        }

        function peg$parseSingleEscapeCharacter() {
          var s0, s1;

          if (input.charCodeAt(peg$currPos) === 39) {
            s0 = peg$c40;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s0 = peg$c37;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c38); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 92) {
                s0 = peg$c42;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c43); }
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 98) {
                  s1 = peg$c49;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c50); }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c51();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 102) {
                    s1 = peg$c52;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c53); }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c54();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 110) {
                      s1 = peg$c55;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c56); }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c57();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 114) {
                        s1 = peg$c58;
                        peg$currPos++;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c59); }
                      }
                      if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c60();
                      }
                      s0 = s1;
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 116) {
                          s1 = peg$c61;
                          peg$currPos++;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c62); }
                        }
                        if (s1 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c63();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 118) {
                            s1 = peg$c64;
                            peg$currPos++;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c65); }
                          }
                          if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c66();
                          }
                          s0 = s1;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          return s0;
        }

        function peg$parseNonEscapeCharacter() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          s2 = peg$parseEscapeCharacter();
          if (s2 === peg$FAILED) {
            s2 = peg$parseLineTerminator();
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c44); }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c45();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseEscapeCharacter() {
          var s0;

          s0 = peg$parseSingleEscapeCharacter();
          if (s0 === peg$FAILED) {
            s0 = peg$parseDecimalDigit();
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 120) {
                s0 = peg$c67;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c68); }
              }
              if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 117) {
                  s0 = peg$c69;
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c70); }
                }
              }
            }
          }

          return s0;
        }

        function peg$parseHexEscapeSequence() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 120) {
            s1 = peg$c67;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = peg$currPos;
            s4 = peg$parseHexDigit();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseHexDigit();
              if (s5 !== peg$FAILED) {
                s4 = [s4, s5];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s2 = input.substring(s2, peg$currPos);
            } else {
              s2 = s3;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c71(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseUnicodeEscapeSequence() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 117) {
            s1 = peg$c69;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c70); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = peg$currPos;
            s4 = peg$parseHexDigit();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseHexDigit();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseHexDigit();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseHexDigit();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              s2 = input.substring(s2, peg$currPos);
            } else {
              s2 = s3;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c71(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseLineTerminator() {
          var s0;

          if (peg$c72.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }

          return s0;
        }

        function peg$parseLineTerminatorSequence() {
          var s0, s1;

          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 10) {
            s0 = peg$c75;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c77) {
              s0 = peg$c77;
              peg$currPos += 2;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c78); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 13) {
                s0 = peg$c79;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c80); }
              }
              if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 8232) {
                  s0 = peg$c81;
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c82); }
                }
                if (s0 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 8233) {
                    s0 = peg$c83;
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c84); }
                  }
                }
              }
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c74); }
          }

          return s0;
        }

        function peg$parseArrayLiteral() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c0;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c1); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parseArrayValue();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parseArrayValue();
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseValue();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 93) {
                        s7 = peg$c2;
                        peg$currPos++;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c3); }
                      }
                      if (s7 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c85(s3, s5);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseArrayValue() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = peg$parseValue();
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s3 = peg$c86;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c87); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c88(s1);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseTrueToken() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 4) === peg$c89) {
            s1 = peg$c89;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c90); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseFalseToken() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 5) === peg$c91) {
            s1 = peg$c91;
            peg$currPos += 5;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c92); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parse_() {
          var s0, s1;

          peg$silentFails++;
          s0 = [];
          if (peg$c94.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c95); }
          }
          while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c94.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c95); }
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c93); }
          }

          return s0;
        }

        function peg$parseRegularExpressionLiteral() {
          var s0, s1, s2, s3, s4;

          peg$silentFails++;
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 47) {
            s1 = peg$c97;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c98); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseRegularExpressionBody();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 47) {
                s3 = peg$c97;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c98); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseRegularExpressionFlags();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c99(s2, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c96); }
          }

          return s0;
        }

        function peg$parseRegularExpressionBody() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$parseRegularExpressionFirstChar();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseRegularExpressionChars();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c100(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseRegularExpressionChars() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parseRegularExpressionChar();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parseRegularExpressionChar();
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c101(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parseRegularExpressionFirstChar() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (peg$c102.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c103); }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseRegularExpressionNonTerminator();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c104(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$parseRegularExpressionBackslashSequence();
            if (s0 === peg$FAILED) {
              s0 = peg$parseRegularExpressionClass();
            }
          }

          return s0;
        }

        function peg$parseRegularExpressionChar() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (peg$c105.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c106); }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseRegularExpressionNonTerminator();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c104(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$parseRegularExpressionBackslashSequence();
            if (s0 === peg$FAILED) {
              s0 = peg$parseRegularExpressionClass();
            }
          }

          return s0;
        }

        function peg$parseRegularExpressionBackslashSequence() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 92) {
            s1 = peg$c42;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseRegularExpressionNonTerminator();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c107(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseRegularExpressionNonTerminator() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          s2 = peg$parseLineTerminator();
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseSourceCharacter();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c104(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseRegularExpressionClass() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c0;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c1); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseRegularExpressionClassChars();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c2;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c3); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c108(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseRegularExpressionClassChars() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parseRegularExpressionClassChar();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parseRegularExpressionClassChar();
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c101(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parseRegularExpressionClassChar() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (peg$c109.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c110); }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = void 0;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseRegularExpressionNonTerminator();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c104(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$parseRegularExpressionBackslashSequence();
          }

          return s0;
        }

        function peg$parseRegularExpressionFlags() {
          var s0, s1, s2;

          s0 = peg$currPos;
          s1 = [];
          if (peg$c111.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c112); }
          }
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c111.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c112); }
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c113(s1);
          }
          s0 = s1;

          return s0;
        }

        function peg$parseSourceCharacter() {
          var s0;

          if (input.length > peg$currPos) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c44); }
          }

          return s0;
        }


          function mergeProps(array){
            var merged = {};

            for (var i = 0; i < array.length; i++) {
              var pair = array[i]
              for (var key in pair) {
                if (pair.hasOwnProperty(key)) {
                    merged[key] = pair[key]
                }
              }
            }

            return merged;
          }


        peg$result = peg$startRuleFunction();

        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
          return peg$result;
        } else {
          if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail({ type: "end", description: "end of input" });
          }

          throw peg$buildException(
            null,
            peg$maxFailExpected,
            peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
            peg$maxFailPos < input.length
              ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
              : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
          );
        }
      }

      return {
        SyntaxError: peg$SyntaxError,
        parse:       peg$parse
      };
    })()
    aeq.ui = (function (ui) {
    	/**
    	 * [description]
    	 * @class
    	 * @memberof aeq
    	 * @param  {type} obj [description]
    	 */
    	ui.Container = function(obj) {
    		this.obj = obj;
    	};

    	ui.Container.prototype = {
    		toString: function() {
    			return "[object aeq.ui.Container]";
    		},

    		extend: aeq.extend,

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @return {type} [description]
    		 */
    		get : function() {
    			return this.obj;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} options [description]
    		 * @return {type}         [description]
    		 */
    		set: function(options) {
    			ui.set(this.obj, options);
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @private
    		 * @memberof aeq.ui.Container
    		 * @param  {type} type    [description]
    		 * @param  {type} options [description]
    		 * @return {type}         [description]
    		 */
    		_add: function(type, options) {
    			if (aeq.isObject(options.arg1) && !aeq.isArray(options.arg1)) {
    				options = options.arg1;

    				// "items" is used by listbox, dropdownlist and treeview
    				// if it is defined, it most likely one of those controls
    				options.arg1 = options.items || options.text;
    			}

    			var obj = this.obj.add(type, options.bounds, options.arg1, options.properties);
    			ui.set(obj, options);
    			return obj;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onClick    [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addButton: function(arg1, onClick, properties) {
    			return this._add('button', {
    				arg1: arg1,
    				properties: properties,
    				onClick: onClick
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onClick    [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addCheckbox: function(arg1, onClick, properties) {
    			return this._add('checkbox', {
    				arg1: arg1,
    				properties: properties,
    				onClick: onClick
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onChange   [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addDropdownList: function(arg1, onChange, properties) {
    			return this._add('dropdownlist', {
    				arg1: arg1,
    				properties: properties,
    				onChange: onChange
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onChange   [description]
    		 * @param  {type} onChanging [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addEditText: function(arg1, onChange, onChanging, properties) {
    			return this._add('edittext', {
    				arg1: arg1,
    				properties: properties,
    				onChange: onChange,
    				onChanging: onChanging
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} options [description]
    		 * @return {type}         [description]
    		 */
    		addGroup: function(options) {
    			var group = this.obj.add('group');
    			group = new ui.Container(group);
    			if (options) {
    				group.set(options);
    			}
    			return group;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onClick    [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addIconButton: function(arg1, onClick, properties) {
    			var options = {
    				arg1: arg1,
    				onClick: onClick,
    				properties: properties
    			};

    			if (aeq.isObject(options.arg1) && !aeq.isArray(options.arg1) &&
    				!aeq.isFile(options.arg1) && options.arg1.format === undefined) {
    					// Check options.arg1.format to see if it is ScriptUIImage
    				options = options.arg1;
    				options.arg1 = options.image || undefined;
    			}

    			var obj = this.obj.add("iconbutton", options.bounds, options.arg1, options.properties);
    			ui.set(obj, options);
    			return obj;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onClick    [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addImage: function(arg1, onClick, properties) {
    			var options = {
    				arg1: arg1,
    				onClick: onClick,
    				properties: properties
    			};

    			if (aeq.isObject(options.arg1) && !aeq.isArray(options.arg1) &&
    				!aeq.isFile(options.arg1) && options.arg1.format === undefined) {
    					// Check options.arg1.format to see if it is ScriptUIImage
    				options = options.arg1;
    				options.arg1 = options.image || undefined;
    			}

    			var obj = this.obj.add("image", options.bounds, options.arg1, options.properties);
    			ui.set(obj, options);
    			return obj;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1          [description]
    		 * @param  {type} onChange      [description]
    		 * @param  {type} onDoubleClick [description]
    		 * @param  {type} properties    [description]
    		 * @return {type}               [description]
    		 */
    		addListBox: function(arg1, onChange, onDoubleClick, properties) {
    			return this._add('listbox', {
    				arg1: arg1,
    				properties: properties,
    				onChange: onChange,
    				onDoubleClick: onDoubleClick
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addPanel : function(arg1, properties) {
    			var panel = this._add('panel', {
    				arg1: arg1,
    				properties: properties,
    			});
    			return new ui.Container(panel);
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} value    [description]
    		 * @param  {type} maxValue [description]
    		 * @return {type}          [description]
    		 */
    		addProgressbar: function(value, maxValue) {
    			return this.obj.add('progressbar', undefined, value, maxValue);
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onClick    [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addRadioButton: function(arg1, onClick, properties) {
    			return this._add('radiobutton', {
    				arg1: arg1,
    				properties: properties,
    				onClick: onClick
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} value      [description]
    		 * @param  {type} maxValue   [description]
    		 * @param  {type} onChange   [description]
    		 * @param  {type} onChanging [description]
    		 * @return {type}            [description]
    		 */
    		addScrollbar: function(value, maxValue, onChange, onChanging) {
    			var scrollbar = this.obj.add('scrollbar', undefined, value, maxValue);
    			scrollbar.onChange = onChange;
    			scrollbar.onChanging = onChanging;
    			return scrollbar;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} value      [description]
    		 * @param  {type} minValue   [description]
    		 * @param  {type} maxValue   [description]
    		 * @param  {type} onChange   [description]
    		 * @param  {type} onChanging [description]
    		 * @return {type}            [description]
    		 */
    		addSlider: function(value, minValue, maxValue, onChange, onChanging) {
    			var slider = this.obj.add('slider', undefined, value, minValue, maxValue);
    			slider.onChange = onChange;
    			slider.onChanging = onChanging;
    			return slider;
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addStaticText: function(arg1, properties) {
    			return this._add('statictext', {
    				arg1: arg1,
    				properties: properties
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} text [description]
    		 * @return {type}      [description]
    		 */
    		addTab: function(text) {
    			var tab = this.obj.add('tab', undefined, text);
    			return new ui.Container(tab);
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @return {type} [description]
    		 */
    		addTabbedPanel: function() {
    			var tabbedpanel = this.obj.add('tabbedpanel');
    			return new ui.Container(tabbedpanel);
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} arg1       [description]
    		 * @param  {type} onChange   [description]
    		 * @param  {type} properties [description]
    		 * @return {type}            [description]
    		 */
    		addTreeView: function(arg1, onChange, properties) {
    			return this._add('treeview', {
    				arg1: arg1,
    				properties: properties,
    				onChange: onChange
    			});
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @return {type} [description]
    		 */
    		update: function() {
    			this.obj.layout.layout(true);
    			this.obj.layout.resize();
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @param  {type} obj [description]
    		 * @return {type}     [description]
    		 */
    		remove: function(obj) {
    			if (obj instanceof ui.Container ) {
    				obj = obj.obj;
    			}
    			this.obj.remove(obj);
    		},

    		/**
    		 * Remove all of the containers children
    		 * @memberof aeq.ui.Container
    		 */
    		removeChildren: function(obj) {
    			if (obj instanceof ui.Container) {
    				obj = obj.obj;
    			}
    			for (var i = obj.children.length - 1; i >= 0; i--) {
    				obj.remove(obj.children[i]);
    			}
    		},

    		/**
    		 * [description]
    		 * @method
    		 * @memberof aeq.ui.Container
    		 * @return {type} [description]
    		 */
    		removeAll: function() {
    			for (var i = this.obj.children.length - 1; i >= 0; i--) {
    				this.obj.remove( this.obj.children[i] );
    			}
    		}
    	};

    	// Aliases, backwards compatible
    	ui.Container.prototype.addListbox = ui.Container.prototype.addListBox;
    	ui.Container.prototype.addStatictext = ui.Container.prototype.addStaticText;
    	ui.Container.prototype.addTreeview = ui.Container.prototype.addTreeView;

    	(function createControllerSetters() {
    		var oneParameters = ['enabled', 'helpTip', 'orientation', 'text', 'visible'],
    			twoParameters = [
    				'alignChildren',
    				'alignment',
    				'location',
    				'maximumSize',
    				'minimumSize',
    				'preferredSize',
    				'size'
    			],
    			fourParameters = ['bounds', 'margins'];

    		aeq.forEach(oneParameters, function(type) {
    			ui.Container.prototype[type] = function(newValue) {
    				if ( newValue === undefined ) {
    					return this.obj[type];
    				}
    				this.obj[type] = newValue;
    			};
    		});

    		function multiParameter(type, numParameters) {
    			return function(newValue) {
    				if ( newValue === undefined ) {
    					return this.obj[type];
    				}
    				newValue = arguments.length === numParameters ? Array.apply(null, arguments) : arguments[0];
    				this.obj[type] = newValue;
    			};
    		}

    		aeq.forEach(twoParameters, function(type) {
    			ui.Container.prototype[type] = multiParameter(type, 2);
    		});

    		aeq.forEach(fourParameters, function(type) {
    			ui.Container.prototype[type] = multiParameter(type, 4);
    		});

    	})();

    	return ui;
    }(aeq.ui || {}));

    /**
     * [description]
     * @namespace aeq.ui
     * @memberof aeq
     */
    aeq.ui = (function (ui) {
    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui
    	 * @param  {Panel} thisObj [description]
    	 * @param  {string}  title   [description]
    	 * @param  {type}  opt     [description]
    	 * @return {type}          [description]
    	 */
    	ui.createMainWindow = function(thisObj, title, opt) {
    		if (aeq.isPanel(thisObj)) {
    			return new ui.Window(thisObj);
    		}

    		if (aeq.isString(thisObj)) {
    			opt = title;
    			title = thisObj;
    		}
    		opt = aeq.setDefault(opt, { resizeable : true });

    		var root = new Window("palette", title, undefined, opt);

    		aeq.ui.root = root;

    		return new ui.Window(root);
    	};

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui
    	 * @param  {string} title   [description]
    	 * @param  {type} options [description]
    	 * @return {type}         [description]
    	 */
    	ui.createWindow = function(title, options) {
    		options = aeq.setDefault(options, { resizeable : true });
    		var newWindow = new Window("palette", title, undefined, options);
    		return new ui.Window(newWindow);
    	};

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui
    	 * @param  {string} title   [description]
    	 * @param  {type} options [description]
    	 * @return {type}         [description]
    	 */
    	ui.createDialog = function(title, options) {
    		options = aeq.setDefault(options, { resizeable : true });
    		var newWindow = new Window("dialog", title, undefined, options);
    		return new ui.Window(newWindow);
    	};

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui
    	 * @param  {Function} callback [description]
    	 * @return {type}            [description]
    	 */
    	ui.ready = function(callback) {
    		callback();
    	};

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui
    	 * @param  {type} obj     [description]
    	 * @param  {type} options [description]
    	 * @return {type}         [description]
    	 */
    	ui.set = function(obj, options) {
    		for (var option in options) {
    			if (options.hasOwnProperty(option) && option !== 'properties' && option !== 'arg1') {
    				obj[option] = options[option];
    			}
    		}
    	};

    	return ui;
    }(aeq.ui || {}));

    aeq.ui = (function(ui) {

    	/**
    	 * [description]
    	 * @class
    	 * @memberof aeq
    	 * @param  {type} obj [description]
    	 * @return {type}     [description]
    	 */
    	ui.Window = function(obj) {
    		this.obj = obj;
    	};

    	ui.Window.prototype = ui.Container.prototype;

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui.Window
    	 * @return {type} [description]
    	 */
    	ui.Window.prototype.show = function() {
    		this.layout();
    		if (aeq.isWindow(this.obj))
    			return this.obj.show();
    	};

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui.Window
    	 * @return {type} [description]
    	 */
    	ui.Window.prototype.hide = function() {
    		if (aeq.isWindow(this.obj))
    			this.obj.hide();
    	};

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui.Window
    	 * @param  {type} value [description]
    	 * @return {type}       [description]
    	 */
    	ui.Window.prototype.close = function(value) {
    		if (aeq.isWindow(this.obj))
    			this.obj.close(value)
    	}

    	/**
    	 * [description]
    	 * @method
    	 * @memberof aeq.ui.Window
    	 * @return {type} [description]
    	 */
    	ui.Window.prototype.layout = function() {
    		this.obj.layout.layout(true);
    		this.obj.layout.resize();
    		this.obj.onResizing = this.obj.onResize = function() {
    			this.layout.resize();
    		};
    	};

    	return ui;
    }(aeq.ui || {}));

    /* eslint-enable */

    /* eslint-disable */

    var bm_ProjectHelper = (function(){

        var fileString = '';

        var ob = {};
        ob.init = init;
        ob.getGradientData = getGradientData;
        ob.end = end;

        function init(){
            fileString = '';
        }

        function end(){
            fileString = '';
        }

        function getProjectData(){
            var proj = app.project;
            var ff = proj.file;
            if(!ff) {
                fileString = '<no file>';
            } else {
                var demoFile = new File(ff.absoluteURI);
                //bm_eventDispatcher.log('ffff222:');
                demoFile.open('r', 'TEXT', '????');
                fileString = demoFile.read(demoFile.length);
            }
        }

        function getGradientData(shapeNavigation, numKeys){
            if(!fileString){
                getProjectData();
            }
            var hasNoGradColorData = false;
            if(fileString.indexOf('ADBE Vector Grad Colors') === -1) {
                hasNoGradColorData = true;
            }
            numKeys = numKeys ? numKeys : 1;
            var gradientIndex = 0, navigationIndex = 0;
            var i = 0, len = shapeNavigation.length;
            while(i<len){
                navigationIndex = fileString.indexOf(shapeNavigation[i],navigationIndex);
                i += 1;
            }
            gradientIndex = fileString.indexOf('ADBE Vector Grad Colors',navigationIndex);
            var gradFillIndex = fileString.indexOf('ADBE Vector Graphic - G-Fill',navigationIndex);
            var gradStrokeIndex = fileString.indexOf('ADBE Vector Graphic - G-Stroke',navigationIndex);
            var limitIndex;
            if(gradStrokeIndex !== -1 && gradFillIndex !== -1){
                limitIndex = Math.min(gradFillIndex,gradStrokeIndex);
            } else {
                limitIndex = Math.max(gradFillIndex,gradStrokeIndex);
            }
            if(limitIndex === -1){
                limitIndex = Number.MAX_VALUE;
            }
            //var regEx = /<prop.map>/g;
            var currentKey = 0, keyframes = [], hasOpacity = false, maxOpacities = 0, maxColors = 0;
            while(currentKey < numKeys){
                var gradientData = {};
                gradientIndex = fileString.indexOf('<prop.map',gradientIndex);
                if(hasNoGradColorData || gradientIndex > limitIndex || (gradientIndex == -1 && limitIndex == Number.MAX_VALUE)){
                    gradientData.c = [[0,1,1,1],[1,0,0,0]];
                    maxColors = Math.max(maxColors,2);
                } else {
                    var endMatch = '</prop.map>';
                    var lastIndex = fileString.indexOf(endMatch,gradientIndex);
                    var xmlString = fileString.substr(gradientIndex,lastIndex+endMatch.length-gradientIndex);
                    xmlString = xmlString.replace(/\n/g,'');
                    var XML_Ob = new XML(xmlString);
                    var stops = XML_Ob['prop.list'][0]['prop.pair'][0]['prop.list'][0]['prop.pair'][0]['prop.list'][0]['prop.pair'][0]['prop.list'][0]['prop.pair'];
                    var colors = XML_Ob['prop.list'][0]['prop.pair'][0]['prop.list'][0]['prop.pair'][1]['prop.list'][0]['prop.pair'][0]['prop.list'][0]['prop.pair'];
                    i = 0;
                    len = stops.length();
                    var opacitiesArr = [],op, floats, nextFloats, midPoint, midPosition;
                    while(i<len){
                        floats = stops[i]['prop.list'][0]['prop.pair'][0]['array'][0].float;
                        op = [];
                        op.push(bm_generalUtils.roundNumber(Number(floats[0].toString()),3));
                        op.push(bm_generalUtils.roundNumber(Number(floats[2].toString()),3));
                        if(op[1] !== 1){
                            hasOpacity = true;
                        }
                        opacitiesArr.push(op);
                        midPosition = bm_generalUtils.roundNumber(Number(floats[1].toString()),3);
                        if(i<len-1 /*&& midPosition !== 0.5*/){
                            op = [];
                            nextFloats = stops[i+1]['prop.list'][0]['prop.pair'][0]['array'][0].float;
                            midPoint = Number(floats[0].toString()) + (Number(nextFloats[0].toString())-Number(floats[0].toString()))*midPosition;
                            var midPointValue = Number(floats[2].toString()) + (Number(nextFloats[2].toString())-Number(floats[2].toString()))*0.5;
                            op.push(bm_generalUtils.roundNumber(midPoint,3));
                            op.push(bm_generalUtils.roundNumber(midPointValue,3));
                            opacitiesArr.push(op);
                        }
                        i += 1;
                    }
                    i = 0;
                    len = colors.length();
                    var colorsArr = [];
                    while(i<len){
                        floats = colors[i]['prop.list'][0]['prop.pair'][0]['array'][0].float;
                        op = [];
                        op.push(bm_generalUtils.roundNumber(Number(floats[0].toString()),3));
                        op.push(bm_generalUtils.roundNumber(Number(floats[2].toString()),3));
                        op.push(bm_generalUtils.roundNumber(Number(floats[3].toString()),3));
                        op.push(bm_generalUtils.roundNumber(Number(floats[4].toString()),3));
                        colorsArr.push(op);
                        midPosition = bm_generalUtils.roundNumber(Number(floats[1].toString()),3);
                        if(i<len-1 /*&& midPosition !== 0.5*/){
                            op = [];
                            nextFloats = colors[i+1]['prop.list'][0]['prop.pair'][0]['array'][0].float;
                            midPoint = Number(floats[0].toString()) + (Number(nextFloats[0].toString())-Number(floats[0].toString()))*midPosition;
                            var midPointValueR = Number(floats[2].toString()) + (Number(nextFloats[2].toString())-Number(floats[2].toString()))*midPosition;
                            var midPointValueG = Number(floats[3].toString()) + (Number(nextFloats[3].toString())-Number(floats[3].toString()))*midPosition;
                            var midPointValueB = Number(floats[4].toString()) + (Number(nextFloats[4].toString())-Number(floats[4].toString()))*midPosition;
                            op.push(bm_generalUtils.roundNumber(midPoint,3));
                            op.push(bm_generalUtils.roundNumber(midPointValueR,3));
                            op.push(bm_generalUtils.roundNumber(midPointValueG,3));
                            op.push(bm_generalUtils.roundNumber(midPointValueB,3));
                            colorsArr.push(op);
                        }
                        i += 1;
                    }
                    gradientData.c = colorsArr;
                    gradientData.o = opacitiesArr;
                    maxOpacities = Math.max(maxOpacities,opacitiesArr.length);
                    maxColors = Math.max(maxColors,colorsArr.length);
                }

                gradientIndex = lastIndex;

                keyframes.push(gradientData);
                currentKey += 1;
            }

            return gradientData;
            // only returning gradientData
            // need to understand opacity and midpoints
        }

        return ob;
    }());

    /*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
    /*global app, $, PropertyValueType, bm_eventDispatcher*/
    var bm_generalUtils = (function () {
        'use strict';
        var ob = {};
        ob.Gtlym = {};
        ob.Gtlym.CALL = {};
        
        function random(len) {
            var sequence = 'abcdefghijklmnoqrstuvwxyz1234567890', returnString = '', i;
            for (i = 0; i < len; i += 1) {
                returnString += sequence.charAt(Math.floor(Math.random() * sequence.length));
            }
            return returnString;
        }
        
        function setTimeout(func, millis) {
            var guid = random(10);
            ob.Gtlym.CALL["interval_" + guid] = func;
            return app.scheduleTask('generalUtils.Gtlym.CALL["interval_' + guid + '"]();', millis, false);
        }

        function roundArray(arr, decimals) {
            var i, len = arr.length;
            var retArray = [];
            for (i = 0; i < len; i += 1) {
                if (typeof arr[i] === 'number') {
                    retArray.push(roundNumber(arr[i], decimals));
                } else {
                    retArray.push(roundArray(arr[i], decimals));
                }
            }
            return retArray;
        }
        
        function roundNumber(num, decimals) {
            num = num || 0;
            if (typeof num === 'number') {
                return parseFloat(num.toFixed(decimals));
            } else {
                return roundArray(num, decimals);
            }
        }
        
        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        
        function arrayRgbToHex(values) {
            return rgbToHex(Math.round(values[0] * 255), Math.round(values[1] * 255), Math.round(values[2] * 255));
        }
        
        var iterateProperty = (function () {
            
            var response;
            
            function iterateProperties(property, ob) {
                ob.name = property.name;
                ob.matchName = property.matchName;
                if (property.numProperties) {
                    ob.properties = [];
                    var i = 0, len = property.numProperties;
                    while (i < len) {
                        var propertyOb = {};
                        ob.properties.push(propertyOb);
                        iterateProperties(property(i + 1), propertyOb);
                        i++;
                    }
                } else {
                    if (property.propertyValueType !== PropertyValueType.NO_VALUE && property.value !== undefined) {
                        ob.value = property.value.toString();
                    } else {
                        ob.value = '--- No Value:' + ' ---';
                    }
                }
            }
            
            return function (property) {
                response = {};
                iterateProperties(property, response);
                bm_eventDispatcher.sendEvent('console:log', response);
            };
        }());
        
        function iterateOwnProperties(property){
            var propsArray = [];
            for (var s in property) {
                if(property.hasOwnProperty(s)) {
                    propsArray.push(s);
                }
            }
            bm_eventDispatcher.log(propsArray);
        }
        
        function convertPathsToAbsoluteValues(ks) {
            var i, len;
            if (ks.i) {
                len = ks.i.length;
                for (i = 0; i < len; i += 1) {
                    ks.i[i][0] += ks.v[i][0];
                    ks.i[i][1] += ks.v[i][1];
                    ks.o[i][0] += ks.v[i][0];
                    ks.o[i][1] += ks.v[i][1];
                }
            } else {
                len = ks.length;
                for (i = 0; i < len - 1; i += 1) {
                    convertPathsToAbsoluteValues(ks[i].s[0]);
                    convertPathsToAbsoluteValues(ks[i].e[0]);
                }
            }
        }
        
        function findAttributes(name){
            var ob = {
                ln: null,
                cl: ''
            }
            var regexElem = /[\.|#][a-zA-Z0-9\-_]*/g;
            var match,firstChar, matchString;
            while(match = regexElem.exec(name)){
                matchString = match[0];
                firstChar = matchString.substring(0,1);
                if (firstChar === '#') {
                    ob.ln = matchString.substring(1);
                } else {
                    ob.cl += ob.cl === '' ? '' : ' ';
                    ob.cl += matchString.substring(1);
                }
            }
            return ob;
        }
        
        ob.random = random;
        ob.roundNumber = roundNumber;
        ob.setTimeout = setTimeout;
        ob.arrayRgbToHex = arrayRgbToHex;
        ob.iterateProperty = iterateProperty;
        ob.iterateOwnProperties = iterateOwnProperties;
        ob.convertPathsToAbsoluteValues = convertPathsToAbsoluteValues;
        ob.findAttributes = findAttributes;
        
        return ob;
        
    }());
    /*jslint vars: true , plusplus: true, continue:true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
    /*global bm_keyframeHelper, bm_eventDispatcher, bm_generalUtils, PropertyFactory, Matrix*/
    var bm_shapeHelper = (function () {
        'use strict';
        var ob = {}, shapeItemTypes = {
            shape: 'sh',
            rect: 'rc',
            ellipse: 'el',
            star: 'sr',
            fill: 'fl',
            gfill: 'gf',
            gStroke: 'gs',
            stroke: 'st',
            merge: 'mm',
            trim: 'tm',
            twist: 'tw',
            group: 'gr',
            repeater: 'rp',
            roundedCorners: 'rd'
        };
        var navigationShapeTree = [];
        var extraParams = {};

        function getItemType(matchName) {
            switch (matchName) {
            case 'ADBE Vector Shape - Group':
                return shapeItemTypes.shape;
            case 'ADBE Vector Shape - Star':
                return shapeItemTypes.star;
            case 'ADBE Vector Shape - Rect':
                return shapeItemTypes.rect;
            case 'ADBE Vector Shape - Ellipse':
                return shapeItemTypes.ellipse;
            case 'ADBE Vector Graphic - Fill':
                return shapeItemTypes.fill;
            case 'ADBE Vector Graphic - Stroke':
                return shapeItemTypes.stroke;
            case 'ADBE Vector Graphic - Merge':
            case 'ADBE Vector Filter - Merge':
                return shapeItemTypes.merge;
            case 'ADBE Vector Graphic - Trim':
            case 'ADBE Vector Filter - Trim':
                return shapeItemTypes.trim;
            case 'ADBE Vector Graphic - Twist':
            case 'ADBE Vector Filter - Twist':
                return shapeItemTypes.twist;
            case 'ADBE Vector Filter - RC':
                return shapeItemTypes.roundedCorners;
            case 'ADBE Vector Group':
                return shapeItemTypes.group;
            case 'ADBE Vector Graphic - G-Fill':
                return shapeItemTypes.gfill;
            case 'ADBE Vector Graphic - G-Stroke':
                return shapeItemTypes.gStroke;
            case 'ADBE Vector Filter - Repeater':
                return shapeItemTypes.repeater;
            default:
                //bm_eventDispatcher.log(matchName);
                return '';
            }
        }

        function checkAdditionalCases(prop) {
            if(extraParams && extraParams.is_rubberhose_autoflop && prop.name === 'Admin'){
                return true;
            }
            return false;
        }
        
        function iterateProperties(iteratable, array, frameRate, stretch, isText) {
            var i, len = iteratable.numProperties, ob, prop, itemType;
            for (i = 0; i < len; i += 1) {
                ob = null;
                prop = iteratable.property(i + 1);
                if (prop.enabled || checkAdditionalCases(prop)) {
                    itemType = getItemType(prop.matchName);
                    if (isText && itemType !== shapeItemTypes.shape && itemType !== shapeItemTypes.group && itemType !== shapeItemTypes.merge) {
                        continue;
                    }
                    if (itemType === shapeItemTypes.shape) {
                        ob = {};
                        ob.ind = i;
                        ob.ty = itemType;
                        ob.ix = prop.propertyIndex;
                        ob.ks = bm_keyframeHelper.exportKeyframes(prop.property('Path'), frameRate, stretch);
                        checkVertexCount(ob.ks.k);
                        if (prop.property("Shape Direction").value === 3) {
                            reverseShape(ob.ks.k);
                        }
                        //bm_generalUtils.convertPathsToAbsoluteValues(ob.ks.k);
                    } else if (itemType === shapeItemTypes.rect && !isText) {
                        ob = {};
                        ob.ty = itemType;
                        ob.d = prop.property("Shape Direction").value;
                        ob.s = bm_keyframeHelper.exportKeyframes(prop.property('Size'), frameRate, stretch);
                        ob.p = bm_keyframeHelper.exportKeyframes(prop.property('Position'), frameRate, stretch);
                        ob.r = bm_keyframeHelper.exportKeyframes(prop.property('Roundness'), frameRate, stretch);
                    } else if(itemType === shapeItemTypes.star && !isText) {
                        ob = {};
                        ob.ty = itemType;
                        ob.sy = prop.property("Type").value;
                        ob.d = prop.property("Shape Direction").value;
                        ob.pt = bm_keyframeHelper.exportKeyframes(prop.property('Points'), frameRate, stretch);
                        ob.pt.ix = prop.property('Points').propertyIndex;
                        ob.p = bm_keyframeHelper.exportKeyframes(prop.property('Position'), frameRate, stretch);
                        ob.p.ix = prop.property('Position').propertyIndex;
                        ob.r = bm_keyframeHelper.exportKeyframes(prop.property('Rotation'), frameRate, stretch);
                        ob.r.ix = prop.property('Rotation').propertyIndex;
                        if(ob.sy === 1) {
                            ob.ir = bm_keyframeHelper.exportKeyframes(prop.property('Inner Radius'), frameRate, stretch);
                            ob.ir.ix = prop.property('Inner Radius').propertyIndex;
                            ob.is = bm_keyframeHelper.exportKeyframes(prop.property('Inner Roundness'), frameRate, stretch);
                            ob.is.ix = prop.property('Inner Roundness').propertyIndex;
                        }
                        ob.or = bm_keyframeHelper.exportKeyframes(prop.property('Outer Radius'), frameRate, stretch);
                        ob.or.ix = prop.property('Outer Radius').propertyIndex;
                        ob.os = bm_keyframeHelper.exportKeyframes(prop.property('Outer Roundness'), frameRate, stretch);
                        ob.os.ix = prop.property('Outer Roundness').propertyIndex;
                        ob.ix = prop.propertyIndex;
                    } else if (itemType === shapeItemTypes.ellipse) {
                        ob = {};
                        ob.d = prop.property("Shape Direction").value;
                        ob.ty = itemType;
                        ob.s = bm_keyframeHelper.exportKeyframes(prop.property('Size'), frameRate, stretch);
                        ob.p = bm_keyframeHelper.exportKeyframes(prop.property('Position'), frameRate, stretch);
                    } else if (itemType === shapeItemTypes.fill) {
                        ob = {};
                        ob.ty = itemType;
                        ob.c = bm_keyframeHelper.exportKeyframes(prop.property('Color'), frameRate, stretch);
                        ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                        ob.r = prop.property('Fill Rule').value;
                    } else if (itemType === shapeItemTypes.gfill) {
                        ob = {};
                        ob.ty = itemType;
                        ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                        ob.r = prop.property('Fill Rule').value;
                        navigationShapeTree.push(prop.name);
                        exportGradientData(ob,prop,frameRate, stretch, navigationShapeTree);
                        navigationShapeTree.pop();

                    } else if (itemType === shapeItemTypes.gStroke) {
                        ob = {};
                        ob.ty = itemType;
                        ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                        ob.w = bm_keyframeHelper.exportKeyframes(prop.property('Stroke Width'), frameRate, stretch);
                        navigationShapeTree.push(prop.name);
                        exportGradientData(ob,prop,frameRate, stretch, navigationShapeTree);
                        navigationShapeTree.pop();
                        ob.lc = prop.property('Line Cap').value;
                        ob.lj = prop.property('Line Join').value;
                        if (ob.lj === 1) {
                            ob.ml = prop.property('Miter Limit').value;
                        }
                        getDashData(ob,prop, frameRate, stretch);

                    } else if (itemType === shapeItemTypes.stroke) {
                        ob = {};
                        ob.ty = itemType;
                        ob.c = bm_keyframeHelper.exportKeyframes(prop.property('Color'), frameRate, stretch);
                        ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Opacity'), frameRate, stretch);
                        ob.w = bm_keyframeHelper.exportKeyframes(prop.property('Stroke Width'), frameRate, stretch);
                        ob.lc = prop.property('Line Cap').value;
                        ob.lj = prop.property('Line Join').value;
                        if (ob.lj === 1) {
                            ob.ml = prop.property('Miter Limit').value;
                        }
                        getDashData(ob,prop, frameRate, stretch);

                    } else if (itemType === shapeItemTypes.repeater) {
                        ob = {};
                        ob.ty = itemType;
                        ob.c = bm_keyframeHelper.exportKeyframes(prop.property('Copies'), frameRate, stretch);
                        ob.c.ix = prop.property('Copies').propertyIndex;
                        ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Offset'), frameRate, stretch);
                        ob.o.ix = prop.property('Offset').propertyIndex;
                        ob.m = prop.property('Composite').value;
                        ob.ix = prop.propertyIndex;
                        var trOb = {};
                        var transformProperty = prop.property('Transform');
                        trOb.ty = 'tr';
                        trOb.p = bm_keyframeHelper.exportKeyframes(transformProperty.property('Position'), frameRate, stretch);
                        trOb.p.ix = transformProperty.property('Position').propertyIndex;
                        trOb.a = bm_keyframeHelper.exportKeyframes(transformProperty.property('Anchor Point'), frameRate, stretch);
                        trOb.a.ix = transformProperty.property('Anchor Point').propertyIndex;
                        trOb.s = bm_keyframeHelper.exportKeyframes(transformProperty.property('Scale'), frameRate, stretch);
                        trOb.s.ix = transformProperty.property('Scale').propertyIndex;
                        trOb.r = bm_keyframeHelper.exportKeyframes(transformProperty.property('Rotation'), frameRate, stretch);
                        trOb.r.ix = transformProperty.property('Rotation').propertyIndex;
                        trOb.so = bm_keyframeHelper.exportKeyframes(transformProperty.property('Start Opacity'), frameRate, stretch);
                        trOb.so.ix = transformProperty.property('Start Opacity').propertyIndex;
                        trOb.eo = bm_keyframeHelper.exportKeyframes(transformProperty.property('End Opacity'), frameRate, stretch);
                        trOb.eo.ix = transformProperty.property('End Opacity').propertyIndex;
                        trOb.nm = transformProperty.name;
                        ob.tr = trOb;
                    } else if (itemType === shapeItemTypes.merge) {
                        ob = {};
                        ob.ty = itemType;
                        ob.mm = prop.property('ADBE Vector Merge Type').value;
                    } else if (itemType === shapeItemTypes.trim) {
                        ob = {};
                        ob.ty = itemType;
                        ob.s = bm_keyframeHelper.exportKeyframes(prop.property('Start'), frameRate, stretch);
                        ob.s.ix = prop.property('Start').propertyIndex;
                        ob.e = bm_keyframeHelper.exportKeyframes(prop.property('End'), frameRate, stretch);
                        ob.e.ix = prop.property('End').propertyIndex;
                        ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Offset'), frameRate, stretch);
                        ob.o.ix = prop.property('Offset').propertyIndex;
                        ob.m = prop.property('Trim Multiple Shapes').value;
                        ob.ix = prop.propertyIndex;
                    } else if (itemType === shapeItemTypes.twist) {
                        ob = {};
                        ob.ty = itemType;
                        bm_generalUtils.iterateProperty(prop);
                        ob.a = bm_keyframeHelper.exportKeyframes(prop.property('ADBE Vector Twist Angle'), frameRate, stretch);
                        ob.a.ix = prop.property('ADBE Vector Twist Angle').propertyIndex;
                        ob.c = bm_keyframeHelper.exportKeyframes(prop.property('ADBE Vector Twist Center'), frameRate, stretch);
                        ob.c.ix = prop.property('ADBE Vector Twist Center').propertyIndex;
                        /*ob.e = bm_keyframeHelper.exportKeyframes(prop.property('End'), frameRate, stretch);
                        ob.e.ix = prop.property('End').propertyIndex;
                        ob.o = bm_keyframeHelper.exportKeyframes(prop.property('Offset'), frameRate, stretch);
                        ob.o.ix = prop.property('Offset').propertyIndex;
                        ob.m = prop.property('Trim Multiple Shapes').value;*/
                        ob.ix = prop.propertyIndex;
                    } else if (itemType === shapeItemTypes.group) {
                        ob = {
                            ty : itemType,
                            it: [],
                            nm: prop.name,
                            np: prop.property('Contents').numProperties,
                            cix: prop.property('Contents').propertyIndex,
                            ix: prop.propertyIndex
                        };
                        navigationShapeTree.push(prop.name);
                        iterateProperties(prop.property('Contents'), ob.it, frameRate, stretch, isText);
                        if (!isText) {
                            var trOb = {};
                            var transformProperty = prop.property('Transform');
                            trOb.ty = 'tr';
                            trOb.p = bm_keyframeHelper.exportKeyframes(transformProperty.property('Position'), frameRate, stretch);
                            trOb.p.ix = transformProperty.property('Position').propertyIndex;
                            trOb.a = bm_keyframeHelper.exportKeyframes(transformProperty.property('Anchor Point'), frameRate, stretch);
                            trOb.a.ix = transformProperty.property('Anchor Point').propertyIndex;
                            trOb.s = bm_keyframeHelper.exportKeyframes(transformProperty.property('Scale'), frameRate, stretch);
                            trOb.s.ix = transformProperty.property('Scale').propertyIndex;
                            trOb.r = bm_keyframeHelper.exportKeyframes(transformProperty.property('Rotation'), frameRate, stretch);
                            trOb.r.ix = transformProperty.property('Rotation').propertyIndex;
                            trOb.o = bm_keyframeHelper.exportKeyframes(transformProperty.property('Opacity'), frameRate, stretch);
                            trOb.o.ix = transformProperty.property('Opacity').propertyIndex;
                            if(transformProperty.property('Skew').canSetExpression) {
                                trOb.sk = bm_keyframeHelper.exportKeyframes(transformProperty.property('Skew'), frameRate, stretch);
                                trOb.sk.ix = transformProperty.property('Skew').propertyIndex;
                                trOb.sa = bm_keyframeHelper.exportKeyframes(transformProperty.property('Skew Axis'), frameRate, stretch);
                                trOb.sa.ix = transformProperty.property('Skew Axis').propertyIndex;
                            }
                            trOb.nm = transformProperty.name;
                            ob.it.push(trOb);
                        }
                        navigationShapeTree.pop();
                    } else if (itemType === shapeItemTypes.roundedCorners) {
                        ob = {
                            ty : itemType,
                            nm: prop.name
                        };
                        ob.r = bm_keyframeHelper.exportKeyframes(prop.property('Radius'), frameRate, stretch);
                    }
                    if (ob) {
                        ob.nm = prop.name;
                        ob.mn = prop.matchName;
                        var layerAttributes = bm_generalUtils.findAttributes(prop.name);
                        if(layerAttributes.ln){
                            ob.ln = layerAttributes.ln;
                        }
                        if(layerAttributes.cl){
                            ob.cl = layerAttributes.cl;
                        }
                        array.push(ob);
                    }
                }
                
            }
        }

        function exportGradientData(ob,prop, navigationShapeTree){
            var property = prop.property('Colors');
            var gradientData = bm_ProjectHelper.getGradientData(navigationShapeTree, property.numKeys);
            ob.g = {
                p:gradientData.p,
                k:property
            };
            ob.s = prop.property('Start Point');
            ob.e = prop.property('End Point');
            ob.t = prop.property('Type').value;
            if(ob.t === 2){
                ob.h = prop.property('Highlight Length');
                ob.a = prop.property('Highlight Angle');
            }
        }
        
        ob.iterateProperties = iterateProperties;

        return ob;
    }());

    "object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(a){return a<10?"0"+a:a}function this_value(){return this.valueOf()}function quote(a){return rx_escapable.lastIndex=0,rx_escapable.test(a)?'"'+a.replace(rx_escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,h,g=gap,i=b[a];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,h=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=0===h.length?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;c<f;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=0===h.length?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;d<c;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON.stringify");return str("",{"":a})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

    var Config = { // eslint-disable-line no-unused-vars
        "name"    : "Facebook MOD JSON exporter",
        "version" : "2.3.6",

        "defaults" : {
            "enableLogging" : true,
            "userDebug"     : false,
            "saveRecovery"  : false
        },

        "globals" : {
            "debug" : eval("false"),

            // File paths
            "validatorPath"       : new File($.fileName).parent.fsName.replace(/\\/g, "/") + "/",
            "resourcePath"        : aeq.file.joinPath(aeq.app.getUserDataFolder().fsName, "Facebook MOD JSON exporter"),
            "tempObjectFilename"  : "tempData.json",
            "logMaxSize"          : 5000000,
            "uniqueFolderName"    : "Unique Comps",
            "uniqueSuffixLength"  : 2,
            "validLayerDelimiter" : "-",

            // Globals that get set within the script
            "uniqueSuffixes"    : [],
            "continueExporting" : false,
            "mainFPS"           : 0,
            "startTime"         : 0,
            "endTime"           : 0,

            // Supported properties & values
            "supportedModes" : [
                "add",
                "color",
                "color burn",
                "color dodge",
                "darken",
                "difference",
                "exclusion",
                "hard light",
                "hue",
                "lighten",
                "luminosity",
                "multiply",
                "normal",
                "overlay",
                "saturation",
                "screen",
                "soft light"
            ],

            "supportedTextJustifications" : {
                "left_justify"   : 0,
                "right_justify"  : 1,
                "center_justify" : 0.5
            },

            "supportedEffects" : {
                "other" : aeq.arrayEx([
                    "ADBE Point3D Control",
                    "ADBE Angle Control",
                    "ADBE Checkbox Control",
                    "ADBE Color Control",
                    "ADBE Layer Control",
                    "ADBE Point Control",
                    "ADBE Slider Control"
                ]),
                "supportedColouring" : aeq.arrayEx([
                    "ADBE Color Balance (HLS)",
                    "DGE Gradient",
                    // "ADBE Drop Shadow",
                    "ADBE Fill"
                ]),
                "supportedDistorts" : aeq.arrayEx([
                    "ADBE Corner Pin",
                    "ADBE BEZMESH",
                    "ADBE Displacement Map"
                ]),
                "supportedBlurs" : aeq.arrayEx([
                    "ADBE Motion Blur",
                    "ADBE Gaussian Blur 2",
                    "ADBE Gaussian Blur",
                    "ADBE Box Blur2",
                    "ADBE Box Blur"
                ])
            },

            "unsupportedTextOptions" : [
                "fauxBold",
                "smallCaps",
                "subscript",
                "superscript"
            ]
        }
    };

    var Util = (function () {
        /**
         * Binds a function to an instance of 'this'
         *
         * @param {Function} func - Function to bind
         * @param {any} oThis     - 'This' to bind it to
         * @returns {any}         - Result
         */
        function bind (func, oThis) {
            if (typeof func !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 2);
            var fToBind = func;
            var fNOP = function () {};
            var fBound = function () {
                return fToBind.apply(
                    this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };

            fNOP.prototype = func.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        }

        /**
         * Takes n number of objects, combines them into a single object.
         * Will not merge repeated properties
         *
         * @returns {Object} Merged object
         */
        function mergeObjs () {
            var res = {};
            var args = [];
            for (var i = 0; i < arguments.length; i++) args[i] = arguments[i];
            for (var a = 0; a < args.length; a++) {
                var obj = args[a];
                for (var p in obj) {
                    if (obj.hasOwnProperty(p) && res[p] === undefined)
                        res[p] = obj[p];
                }
            }
            return res;
        }

        /**
         * Returns size of object (# of keys)
         *
         * @param {{}} obj Object to traverse
         * @returns {Number} Number of keys in object
         */
        function getObjectSize (obj) {
            var count = 0;

            for (var key in obj) {
                if (obj.hasOwnProperty(key))
                    ++count;
            }

            return count;
        }


        /**
         * Polyfill of array.indexOf
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
         *
         * @param {Array} arr            - Array to search in
         * @param {String} searchElement - Element to find in array
         * @param {Number} [fromIndex]   - Index to start searching from
         * @returns {Number}             - Resulting index
         */
        function indexOf (arr, searchElement, fromIndex) {
            var k;

            if (arr === null)
                throw new TypeError("'this' is null or not defined");

            var o = Object(arr);
            var len = o.length >>> 0;

            if (len === 0)
                return -1;

            var n = fromIndex | 0;

            if (n >= len)
                return -1;

            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (k in o && o[k] === searchElement)
                    return k;
                k++;
            }
            return -1;
        }

        /**
         * Finds an element in an array
         *
         * @param {Array} arr            - Array to search in
         * @param {String} searchElement - Element to find in array
         * @returns {any | null}         - Resulting item in array
         */
        function findInArray (arr, searchElement) {
            if (arr instanceof Array) {
                for (var i = 0, il = arr.length; i < il; i++) {
                    if (arr[i] === searchElement)
                        return searchElement;
                }
            }

            return null;
        }

        /**
         * Converts normalized [rgba] array to hex
         *
         * @param {Number[]} rgba - Array of numbers 0-1
         * @returns {String}      - Hex string
         */
        function rgbToHex (rgba) {
            var base = 1 << 24;
            var r = rgba[0] * 255 << 16;
            var g = rgba[1] * 255 << 8;
            var b = rgba[2] * 255;

            var val = base + r + g + b;
            return val.toString(16).slice(1).toUpperCase();
        }

        /**
         * Converts hex string to normalized rgba array
         *
         * @param {String} hex - Hex string
         * @returns {Number[]} - Normalized rgba array
         */
        function hexToRgb (hex) {
            var bigint = parseInt(hex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
            return [r / 255, g / 255, b / 255, 1];
        }

        /**
         * Converts 0.0-1.0 to 0-255
         *
         * @param {Number} val - Value from 0.0-1.0
         * @returns {Number}   - Value from 0-255
         */
        function normalizedToDec (val) {
            return Math.round(val * 255);
        }

        /**
         * Converts RGB array [0.0-1.0, 0.0-1.0, 0.0-1.0] to [0-255, 0-255, 0-255]
         *
         * @param {[Number, Number, Number]} normalizedColourArray [0.0-1.0, 0.0-1.0, 0.0-1.0]
         * @returns {[Number, Number, Number]} [0-255, 0-255, 0-255]
         */
        function colourToDec (normalizedColourArray) {
            return [
                Util.normalizedToDec(normalizedColourArray[0]),
                Util.normalizedToDec(normalizedColourArray[1]),
                Util.normalizedToDec(normalizedColourArray[2])
            ];
        }

        /**
         * Rounds any input value of type "number", even arrays, to two decimal points
         *
         * @param {Number|Number[]} val - Array or number to round
         * @param {Number} [precision]  - Number of places to round to
         * @returns {Number|Array}      - Rounded array or number
         */
        function roundVal (val, precision) {
            precision = aeq.setDefault(precision, 3);

            if (aeq.isNullOrUndefined(val.length))
                return parseFloat(val.toFixed(precision));

            var roundedArray = aeq.arrayEx();

            aeq.arrayEx(val).forEach(function (valItem) {
                roundedArray.push(parseFloat(valItem.toFixed(precision)));
            });

            return roundedArray;
        }


        /**
         * Capitalizes first letter of string
         *
         * @param {String} string - String to capitalize first letter of
         * @returns {String}      - Formatted string
         */
        function capitalizeFirstLetter (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        /**
         * Trims long string
         *
         * @param {String} longString - Layer name or string to pass in
         * @returns {String}          - Truncated name
         */
        function trimLongString (longString) {
            var shortString = longString;
            var maxLength = 10;

            if (!aeq.isString(longString))
                return "";

            if (shortString.length > maxLength)
                shortString = longString.substring(0, maxLength) + "...";

            return shortString;
        }

        /**
         * Replaces all instances of search token with replacement in string
         *
         * @param {String} string  - String to replace in
         * @param {String} search  - Token to search for
         * @param {String} replace - String to replace token with
         * @returns {String}       - Replaced string
         */
        function replaceAll (string, search, replace) {
            return string.split(search).join(replace);
        }

        /**
         * Strips an extension from given string
         *
         * @param {String|File} filePath - String
         * @returns {String}             - String without extension
         */
        function stripExtension (filePath) {
            var filePathStr = aeq.isFile(filePath) ? filePath.name : filePath;
            return filePathStr.substr(0, filePathStr.lastIndexOf("."));
        }

        /**
         * Builds a date string in format YYYYMMDD
         *
         * @returns {String} YYYYMMDD
         */
        function buildDateString () {
            var date = new Date();
            var yyyy = date.getFullYear();
            var mm = date.getMonth() + 1;
            var dd = date.getDate();

            mm = mm < 10 ? "0" + mm : mm;
            dd = dd < 10 ? "0" + dd : dd;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        /**
         * Builds a time string in format HHMMSS
         *
         * @returns {String} HHMMSS
         */
        function buildTimeString () {
            var date = new Date();
            var hh = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();

            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;

            return hh.toString() + mm.toString() + ss.toString();
        }


        /**
         * Calculates area of polygon
         *
         * @param {[Number[]][]} vertices Array of vertices
         * @returns {Number} Total area of poly
         */
        function getPolyArea () {
            var a;
            var al;
            var total = 0;
            var vertices = [];

            if (arguments.length === 1 && arguments[0] instanceof Array) {
                var arr = arguments[0];
                for (a = 0, al = arr.length; a < al; a++)
                    vertices.push(arr[a]);
            } else {
                for (a = 0, al = arguments.length; a < al; a++)
                    vertices.push(arguments[a]);
            }

            if (vertices.length === 4)
                vertices = [vertices[0], vertices[1], vertices[3], vertices[2]];

            for (var i = 0, il = vertices.length; i < il; i++) {
                var addX = vertices[i][0];
                var addY = vertices[i === vertices.length - 1 ? 0 : i + 1][1];
                var subX = vertices[i === vertices.length - 1 ? 0 : i + 1][0];
                var subY = vertices[i][1];

                total += addX * addY * 0.5;
                total -= subX * subY * 0.5;
            }

            return Math.abs(total);
        }

        /**
         * Draws a poly
         *
         * @param {Number} numPoints Number of points
         * @param {Number} radius Radius of poly
         * @param {[Number, Number]} center Origin
         * @returns {[Number, Number][]} Array of vertices
         */
        function createPoly (numPoints, radius, center) {
            var poly = [];
            var slice = 2 * Math.PI / numPoints;
            for (var i = 0; i < numPoints; i++) {
                var angle = slice * i;
                var newX = center[0] + radius * Math.cos(angle);
                var newY = center[1] + radius * Math.sin(angle);
                var point = [newX, newY];
                poly.push(point);
            }

            return poly;
        }

        /**
         * Gets interpolated value between values a and b
         * also works with arrays, but not arrays of arrays
         *
         * @param {Number} pct        - Percent of progress
         * @param {Number|Number[]} a - First item
         * @param {Number|Number[]} b - Second item
         * @returns {Number}          - Interpolated value
         */
        function lerp (pct, a, b) {
            var res;

            if (a instanceof Array && b instanceof Array) {
                res = [];

                if (a.length !== b.length)
                    return null;

                for (var i = 0; i < a.length; i++)
                    res.push(a[i] + pct * (b[i] - a[i]));
            } else
                res = a + pct * (b - a);

            return res;
        }

        /**
         * Lerp with output control
         *
         * @param {Number} value     - Control
         * @param {Number} valueMin  - Control min
         * @param {Number} valueMax  - Control max
         * @param {Number} outputMin - Output min
         * @param {Number} outputMax - Output max
         * @returns {Number}         - Lerped value
         */
        function fullLerp (value, valueMin, valueMax, outputMin, outputMax) {
            return outputMin + ((value - valueMin) / (valueMax - valueMin)) * (outputMax - outputMin);
        }

        /**
         * Strips out "invalid" unicode characters from a string and replaces them with ?
         *
         * @param {String} input - Input string
         * @returns {String}     - Cleaned string
         */
        function cleanString (input) {
            var output = "";

            for (var i = 0; i < input.length; i++) {
                var nextChar = "?";

                if (input.charCodeAt(i) <= 127)
                    nextChar = input.charAt(i);

                output += nextChar;
            }

            return output;
        }

        return {
            "bind"          : bind,
            "mergeObjs"     : mergeObjs,
            "getObjectSize" : getObjectSize,

            "indexOf"     : indexOf,
            "findInArray" : findInArray,

            "trimLongString"        : trimLongString,
            "capitalizeFirstLetter" : capitalizeFirstLetter,
            "replaceAll"            : replaceAll,
            "stripExtension"        : stripExtension,
            "buildDateString"       : buildDateString,
            "buildTimeString"       : buildTimeString,

            "hexToRgb"        : hexToRgb,
            "rgbToHex"        : rgbToHex,
            "normalizedToDec" : normalizedToDec,
            "colourToDec"     : colourToDec,
            "roundVal"        : roundVal,

            "getPolyArea" : getPolyArea,
            "createPoly"  : createPoly,
            "lerp"        : lerp,
            "fullLerp"    : fullLerp,
            "cleanString" : cleanString
        };
    })();

    var Log = (function () { // eslint-disable-line no-unused-vars
        /**
         * Builds spacing chain based on stack length
         *
         * @returns {String} Spacing string
         */
        function buildSpacing () {
            var spacer = "";

            var stack = $.stack.split("\n");
            stack.length = stack.length - 6;

            aeq.forEach(stack, function (stackItem) {
                if (stackItem.indexOf("anonymous") === -1)
                    spacer += " ";
            });

            return spacer;
        }

        var logFileName = Config.name + " Log.txt";
        var logFilePath = aeq.file.joinPath(Config.globals.resourcePath, logFileName);
        var logFileObject = aeq.getFileObject(logFilePath);

        aeq.app.ensureSecurityPrefEnabled();

        if (!logFileObject.exists)
            logFileObject = aeq.file.writeFile(logFileObject, "");

        var level = 0;
        var levels = {
            "0" : "debug",
            "1" : "trace",
            "2" : "info",
            "3" : "warning",
            "4" : "error",
            "5" : "fatal"
        };

        /**
         * Formats log text; writes to console if debug, writes to file
         *
         * @param {Number} logLevel Log level to log
         * @param {String} text Log text
         * @returns {String} Formatted log line
         */
        function _log (logLevel, text) {
            if (logLevel < level)
                return;

            var aepName = aeq.app.getAEPName();
            var aepStr = aepName ? Util.cleanString(aepName) + ".aep" : "Unsaved AEP";
            var timeStr = Util.buildDateString() + "." + Util.buildTimeString();

            var line = [
                levels[logLevel],
                timeStr,
                aepStr,
                buildSpacing() + Util.cleanString(text)
            ].join(" :: ");

            if (Config.globals.debug || Prefs.getAsBool("userDebug")) {
                writeLn(line);
                $.writeln(line);
            }

            if (logFileObject.length > Config.globals.logMaxSize)
                clear();

            logFileObject.open("a");
            var success = logFileObject.write(line + "\n");
            logFileObject.close();

            if (!success) {
                alert("Could not write log... " + String(logFilePath) + " - " + String(logFileObject.error));
                return;
            }

            return line;
        }

        /**
         * Sets the logging level to parameter
         *
         * @param {Number} logLevel - New logging level
         * @returns {Number}        - New level value
         */
        function setLevel (logLevel) {
            level = logLevel;
            return level;
        }

        /**
         * Reveals the log file in Finder/Explorer
         */
        function reveal () {
            aeq.command.revealFile(logFilePath);
        }

        /**
         * Wipes the log file
         */
        function clear () {
            aeq.app.ensureSecurityPrefEnabled();
            aeq.writeFile(logFileObject, "", { "overwrite" : true });
            logFileObject = aeq.getFileObject(logFilePath);
        }

        /**
         * Sets log level based on global debug pref, or user debug pref
         * Sets the logging level to 0 ('debug') if debug mode, else 2 ('info')
         */
        function initLevel () {
            setLevel(Config.globals.debug || Prefs.getAsBool("userDebug") ? 0 : 2);
        }

        /**
         * Logs as debug, used for weird, techy, archaic stuff
         *
         * @param {String} text - Log text
         * @returns {String}    - Formatted log line
         */
        function debug (text) {
            return _log(0, text);
        }

        /**
         * Logs as trace, used to follow data flow.
         * Warning: VERY verbose
         *
         * @param {String} text Log text
         * @returns {String} Formatted log line
         */
        function trace (text) {
            return _log(1, text);
        }

        /**
         * Logs as info, used for
         *
         * @param {String} text Log text
         * @returns {String} Formatted log line
         */
        function info (text) {
            return _log(2, text);
        }

        /**
         * Logs as warning, used for non-blocking errors or potential issues
         *
         * @param {String} text Log text
         * @returns {String} Formatted log line
         */
        function warning (text) {
            return _log(3, text);
        }

        /**
         * Logs as error, used for... errors
         *
         * @param {String} text Log text
         * @returns {String} Formatted log line
         */
        function error (text) {
            return _log(4, text);
        }

        /**
         * Logs as fatal, used for BIG PROBLEMS
         *
         * @param {String} text Log text
         * @returns {String} Formatted log line
         */
        function fatal (text) {
            return _log(5, text);
        }

        return {
            "setLevel"  : setLevel,
            "reveal"    : reveal,
            "debug"     : debug,
            "initLevel" : initLevel,

            "trace"   : trace,
            "info"    : info,
            "warning" : warning,
            "error"   : error,
            "fatal"   : fatal
        };
    })();

    var Prefs = (function () { // eslint-disable-line no-unused-vars
        /**
         * Sets pref value
         *
         * @param {String} key - Pref key
         * @param {any} val    - Value to set
         */
        function set (key, val) {
            app.settings.saveSetting(Config.name, key, val.toString());
        }

        /**
         * Gets pref value as string
         *
         * @param {String} key - Pref key
         * @returns {String}   - Pref value as string
         */
        function get (key) {
            if (!app.settings.haveSetting(Config.name, key))
                set(key, Config.defaults[key]);

            return app.settings.getSetting(Config.name, key);
        }

        /**
         * Gets pref value as boolean
         *
         * @param {String} key - Pref key
         * @returns {Boolean}  - Pref value as bool
         */
        function getAsBool (key) {
            return get(key) === "true";
        }

        /**
         * Gets pref value as string array
         *
         * @param {String} key - Pref key
         * @returns {String[]} - Pref value as string array
         */
        function getAsArray (key) {
            var prefArray = get(key).split(",");

            if (String(prefArray) === "")
                return aeq.arrayEx();

            return aeq.arrayEx(prefArray);
        }

        /**
         * Gets pref value as int array
         *
         * @param {String} key - Pref key
         * @returns {Number[]} - Pref as int array
         */
        function getAsIntArray (key) {
            var strArray = getAsArray(key);
            var intArray = aeq.arrayEx();

            if (strArray.length === 1 && strArray[0] === "")
                return intArray;

            aeq.forEach(strArray, function (item) {
                intArray.push(parseInt(item));
            });

            return intArray;
        }

        /**
         * Gets pref value as float
         *
         * @param {String} key - Pref key
         * @returns {Number}   - Pref value as float
         */
        function getAsFloat (key) {
            return parseFloat(get(key));
        }

        /**
         * Gets pref value as int
         *
         * @param {String} key - Pref key
         * @returns {Number}   - Pref value as int
         */
        function getAsInt (key) {
            return parseInt(get(key));
        }

        /**
         * Resets pref to default value
         *
         * @param {String} key - Pref key
         * @returns {String}   - Pefault pref value
         */
        function reset (key) {
            set(key, Config.defaults[key]);

            return app.settings.getSetting(Config.name, key);
        }

        /**
         * Resets all prefs from Config.defaults
         */
        function resetAll () {
            for (var key in Config.defaults) {
                if (Config.defaults.hasOwnProperty(key))
                    reset(key);
            }
        }

        return {
            "set"           : set,
            "get"           : get,
            "getAsBool"     : getAsBool,
            "getAsArray"    : getAsArray,
            "getAsIntArray" : getAsIntArray,
            "getAsFloat"    : getAsFloat,
            "getAsInt"      : getAsInt,
            "reset"         : reset,
            "resetAll"      : resetAll
        };
    })();

    /* eslint indent: 0 */

    /**
     * Builds error interface
     *
     * @param {{errors: errObj[], warnings: errObj[]}} errorObj - Error object
     * @param {Boolean} [blocking]                              - Whether this should be a dialog or palette
     */
    function ErrorUI (errorObj, blocking) {
        blocking = aeq.setDefault(blocking, false);

        var me = this;

        if (blocking)
            this.win = aeq.ui.createDialog(Config.name + ": Conversion Errors");
        else
            this.win = aeq.ui.createWindow(Config.name + ": Conversion Errors");

        this.win.set(Style.GroupBottomColumn);

            var grpErrors = this.win.addGroup(Style.GroupFillColumn);
                grpErrors.set({
                    "orientation" : "stack"
                });

                    this.tvItems = grpErrors.addTreeView(Style.ErrorBlock);
                    this.tvItems.onDoubleClick = function () {
                        me.btnIssueItemClick();
                    };

                this.etErrorText = grpErrors.addEditText("", undefined, undefined, Style.ErrorText);
                aeq.ui.set(this.etErrorText, Style.ErrorBlock);
                this.etErrorText.visible = false;

        if (blocking)
            this.win.addStaticText("Found issues! Ignore these and continue exporting JSON?", Style.FillTopRow);
        else
            this.win.addStaticText("Double-click any error entry above to select that layer\nThen press X to scroll to it!", Style.ErrorText);

        var grpMeta = this.win.addGroup(Style.FillTopRow);

            var closeBtnText = blocking ? "Cancel" : "Close";
            grpMeta.addButton(closeBtnText, Util.bind(this.close, this), Style.Button);

            if (blocking)
                grpMeta.addButton("Continue", Util.bind(this.btnContinueClick, this), Style.Button);
            else
                grpMeta.addButton("Reveal Log", Util.bind(this.btnRevealLogClick, this), Style.Button);

            grpMeta.addButton("Toggle Errors View", Util.bind(this.btnToggleClick, this), Style.Button);

        this.setErrorMessages(errorObj);
    }

    ErrorUI.prototype = {
        "show" : function () { this.win.show(); },

        "close" : function () {
            this.win.close();
            Config.globals.continueExporting = false;
        },

        /**
         * Closes errorUI and continues exporting
         */
        "btnContinueClick" : function () {
            this.win.close();
            Config.globals.continueExporting = true;
        },

        /**
         * Reveal the log file
         */
        "btnRevealLogClick" : function () {
            Log.reveal();
        },

        /**
         * Toggles tree view vs text view
         */
        "btnToggleClick" : function () {
            this.tvItems.visible = !this.tvItems.visible;
            this.etErrorText.visible = !this.etErrorText.visible;
        },

        /**
         * Reveals specific item's layer in its comp
         */
        "btnIssueItemClick" : function () {
            var item = this.tvItems.selection;

            if (aeq.isNullOrUndefined(item) || item.type !== "item")
                return;

            if (aeq.isNullOrUndefined(item.layer))
                return;

            this.revealLayer(item.comp, item.idx);
        },

        /**
         * Reveals a layer in comp
         *
         * @param {String} compName - Comp name to open
         * @param {Number} index    - Layer index
         */
        "revealLayer" : function (compName, index) {
            var comp = aeq.getComposition(compName);

            if (aeq.isNullOrUndefined(comp))
                return;

            // Open the comp
            comp.openInViewer();

            var compLayers = aeq.getLayers(comp);
            // Deselect all layers
            compLayers.forEach(function (layer) {
                layer.selected = false;
            });

            // Find this layer
            var layer = compLayers[index - 1];

            if (aeq.isNullOrUndefined(layer))
                return;

            // Select the layer
            layer.selected = true;
        },

        /**
         * Groups issue arrays into groups object
         *
         * @param {errObj[]} issueArray - All warning/error objects
         * @returns {errObj[]}          - Error object array for this issue
         */
        "buildIssueGroupsObject" : function (issueArray) {
            var issueGroupsObject = {};

            issueArray.forEach(function (issueObject) {
                if (!issueGroupsObject.hasOwnProperty(issueObject.issue))
                    issueGroupsObject[issueObject.issue] = aeq.arrayEx();

                issueGroupsObject[issueObject.issue].push(issueObject);
            });

            return issueGroupsObject;
        },

        /**
         * Builds formatted message text for all errors/warnings
         *
         * @param {errObj[]} issueGroupObject - Array of errorObjs for this issue
         * @returns {String}                  - Formatted text for issue groups
         */
        "buildIssueGroupText" : function (issueGroupObject) {
            var msg = "";

            for (var issueGroupName in issueGroupObject) {
                if (!issueGroupObject.hasOwnProperty(issueGroupName))
                    continue;

                msg += issueGroupName + ":\n";

                // Loop through and build each line per layer
                var issueObjectArray = issueGroupObject[issueGroupName];
                issueObjectArray.forEach(function (issueObject) { // jshint ignore: line
                    var dataMsg = issueObject.hasOwnProperty("data") ? ": " + issueObject.data : "";
                    msg += "    - " + issueObject.layer + " (" + issueObject.comp + " #" + issueObject.idx + ")" + dataMsg + "\n";
                });

                msg += "\n";
            }

            return msg;
        },

        /**
         * Builds issues text and concatenates to big string for displace
         *
         * @param {errObj[]} errorGroupsObject   - Object containing error data
         * @param {errObj[]} warningGroupsObject - Object containing warning data
         * @returns {String}                     - Error output message
         */
        "formatErrorObjects" : function (errorGroupsObject, warningGroupsObject) {
            var outputMessage = "";

            if (Util.getObjectSize(errorGroupsObject) > 0) {
                var errorText = this.buildIssueGroupText(errorGroupsObject);

                outputMessage = "The following errors were registered---\n";
                outputMessage += errorText;
                outputMessage += "\n\n";
            }

            if (Util.getObjectSize(warningGroupsObject) > 0) {
                var warningText = this.buildIssueGroupText(warningGroupsObject);

                outputMessage += "The following warnings were registered---\n";
                outputMessage += warningText;
            }

            return outputMessage;
        },

        /**
         * Builds node tree for issueGroupObject
         *
         * @param {errObj[]} issueGroupObject Object containing issue data
         */
        "buildIssueGroupNodeTree" : function (issueGroupObject) {
            for (var issueGroupName in issueGroupObject) {
                if (!issueGroupObject.hasOwnProperty(issueGroupName))
                    continue;

                var issueNode = this.tvItems.add("node", issueGroupName);

                var issueObjectArray = issueGroupObject[issueGroupName];
                issueObjectArray.forEach(function (issueObject) { // jshint ignore: line
                    var dataMsg = issueObject.hasOwnProperty("data") ? ": " + issueObject.data : "";
                    var itemText = issueObject.layer + " (" + issueObject.comp + " #" + issueObject.idx + ")" + dataMsg;

                    var issueItem = issueNode.add("item", itemText);
                        issueItem.layer = issueObject.layer;
                        issueItem.comp = issueObject.comp;
                        issueItem.idx = issueObject.idx;
                });
            }
        },

        /**
         * Accepts an errors object and prepares a UI
         *
         * @param {{errors: errObj[], warnings: errObj[]}} errorObj - Error object
         */
        "setErrorMessages" : function (errorObj) {
            var errorGroupsObject = this.buildIssueGroupsObject(errorObj.errors);
            var errorSize = Util.getObjectSize(errorGroupsObject);
            var warningGroupsObject = this.buildIssueGroupsObject(errorObj.warnings);
            var warningSize = Util.getObjectSize(warningGroupsObject);

            // Build nodes
            if (errorSize > 0) {
                this.tvItems.add("item", "Errors:");
                this.buildIssueGroupNodeTree(errorGroupsObject);
            }

            if (errorSize > 0 && warningSize > 0)
                this.tvItems.add("item", "");

            if (warningSize > 0) {
                this.tvItems.add("item", "Warnings:");
                this.buildIssueGroupNodeTree(warningGroupsObject);
            }

            // Build text box
            var errorMessage = this.formatErrorObjects(errorGroupsObject, warningGroupsObject);
            this.etErrorText.text = errorMessage;
        }
    };

    /* eslint indent: 0 */

    /**
     * Draws the main UI
     *
     * @param {any} thisObj `this` object for the current context
     */
    function MainUI (thisObj) {
        this.win = aeq.ui.createMainWindow(thisObj, Config.name + " v" + Config.version);

        // Builds UI
        var grp = this.win.addGroup({
            "orientation" : "column",
            "alignment"   : ["fill", "fill"],
            "spacing"     : 10
        });

            var grpLogo = grp.addGroup(Style.FillTopRow);

                grpLogo.addStaticText("v" + Config.version);

                this.btnOptions = grpLogo.addButton("?", Util.bind(this.btnOptionsClick, this));
                    aeq.ui.set(this.btnOptions, {
                        "alignment"     : ["right", "top"],
                        "preferredSize" : [20, 20],
                        "maximumSize"   : [20, 20],
                        "minimumSize"   : [20, 20],
                        "size"          : [20, 20]
                    });


            var grpMain = grp.addGroup(Style.FillTopCol);
                grpMain.addStaticText("Warning: this script will save your file!", Style.UIText);

                var grpExportBtns = grpMain.addGroup(Style.FillTopRow);
                    grpExportBtns.addButton("Export Content", Util.bind(this.btnExportContentClick, this), Style.Button);
                    grpExportBtns.addButton("Export All", Util.bind(this.btnExportAllClick, this), Style.Button);

            grp.addPanel({
                "preferredSize" : [240, -1]
            });

            var grpTools = grp.addGroup(Style.FillTopCol);

                var grpToolButtons = grpTools.addGroup(Style.FillTopRow);
                    grpToolButtons.addButton("Test Export", Util.bind(this.btnTestExportClick, this), Style.Button);
                    grpToolButtons.addButton("Uniquify Comp", Util.bind(this.btnUniquifyClick, this), Style.Button);

                var grpValidation = grpTools.addGroup(Style.FillTopCol);
                    grpValidation.addButton("Launch Validator", Util.bind(this.btnValidate, this), Style.Button);
    }

    MainUI.prototype = {
        "show"  : function () { this.win.show(); },
        "close" : function () { this.win.close(); },

        "btnOptionsClick"       : function () { this.onOptionsClick(); },
        "btnExportContentClick" : function () { this.onExportContentClick(); },
        "btnExportAllClick"     : function () { this.onExportAllClick(); },

        "btnTestExportClick" : function () { this.onTestExportClick(); },
        "btnUniquifyClick"   : function () { this.onUniquifyClick(); },
        "btnValidate"        : function () { this.onValidateClick(); }
    };

    /* eslint indent: 0 */

    /**
     * Builds option UI
     */
    function OptionUI () {
        this.win = aeq.ui.createDialog(Config.name + ": Options");
        this.win.set(Style.GroupBottomColumn);

            var grpOptions = this.win.addGroup(Style.GroupFillColumn);
                this.chkDebug = grpOptions.addCheckbox("Debug Mode", this.onDebugChkClick);
                this.chkEnableRecovery = grpOptions.addCheckbox("Save Recovery File", this.onSaveRecoveryChkClick);
                this.chkEnableRecovery.helpTip = "Saves layer data into a recovery file.\n" +
                                                 "This can speed up exports if the script crashes midway,\n\n" +
                                                 "Note: For large exports, it's faster not to use this!";

                // Recovery mode may be pointless! So let's just hide the controller.
                this.chkEnableRecovery.visible = false;

            var grpMeta = this.win.addGroup(Style.GroupBottomRow);
                grpMeta.addButton("Close", Util.bind(this.close, this), Style.Button);
                grpMeta.addButton("Reveal Log", Log.reveal, Style.Button);

        this.init();
    }

    OptionUI.prototype = {
        "init" : function () {
            this.chkDebug.value = Prefs.getAsBool("userDebug");
            this.chkEnableRecovery.value = Prefs.getAsBool("saveRecovery");
        },

        "onDebugChkClick" : function () {
            if (!aeq.isNullOrUndefined(this.text))
                Prefs.set("userDebug", this.value);

            Log.initLevel();
        },

        "onSaveRecoveryChkClick" : function () {
            if (!aeq.isNullOrUndefined(this.text))
                Prefs.set("saveRecovery", this.value);
        },

        "show"  : function () { this.win.show(); },
        "close" : function () { this.win.close(); }
    };

    /* eslint indent: 0 */

    /**
     * Creates progress bar window
     *
     * @param {String} pBarTitle - Title for pbar
     * @param {Number} maxVal    - Max value for pbar
     */
    function PBarUI (pBarTitle, maxVal) {
        this.win = aeq.ui.createWindow(pBarTitle);

        this.win.orientation = "stack";
        this.win.minimumSize = [600, 300];

        this.pbPBar = this.win.addProgressbar(0, maxVal);
        this.pbPBar.minimumSize = [410, 60];

        this.stProgress = this.win.addStaticText("100%", {
            "creation" : {
                "justify" : "center"
            }
        });

        this.win.obj.graphics.foregroundColor = this.win.obj.graphics.newPen(this.win.obj.graphics.PenType.SOLID_COLOR, [1, 1, 1], 1);
    }

    PBarUI.prototype = {
        "show"  : function () { this.win.show(); },
        "close" : function () { this.win.close(); },

        /**
         * Increments bar value and updates UI
         */
        "update" : function () {
            this.win.obj.center();
            this.win.obj.show();

            this.pbPBar.value++;

            this.stProgress.text = Math.floor(this.pbPBar.value / this.pbPBar.maxvalue * 100) + "%";
            this.win.obj.update();
        }
    };

    var Style = { // eslint-disable-line no-unused-vars
        "Default" : {
            "alignment" : "fill"
        },
        "Button" : {
            "preferredSize" : [100, -1]
        },
        "UIText" : {
            "minimumSize" : [200, -1],
            "alignment"   : ["middle", "top"],
            "justify"     : "center"
        },

        "GroupTopColumn" : {
            "orientation"   : "column",
            "alignment"     : ["fill", "top"],
            "alignChildren" : ["fill", "top"]
        },
        "GroupFillColumn" : {
            "orientation"   : "column",
            "alignment"     : ["fill", "fill"],
            "alignChildren" : ["fill", "fill"]
        },
        "GroupBottomColumn" : {
            "orientation"   : "column",
            "alignment"     : ["fill", "bottom"],
            "alignChildren" : ["fill", "bottom"]
        },
        "GroupBottomRow" : {
            "orientation"   : "row",
            "alignment"     : ["fill", "bottom"],
            "alignChildren" : ["fill", "bottom"]
        },
        "FillTopCol" : {
            "orientation"   : "column",
            "alignment"     : ["fill", "top"],
            "alignChildren" : ["fill", "top"]
        },
        "FillTopRow" : {
            "orientation"   : "row",
            "alignment"     : ["fill", "top"],
            "alignChildren" : ["fill", "top"]
        },

        "ErrorBlock" : {
            "alignment"   : ["fill", "fill"],
            "maximumSize" : [900, 650]
        },
        "ErrorText" : {
            "multiline"  : true,
            "readonly"   : true,
            "scrollable" : true,
            "alignment"  : ["fill", "fill"],
            "justify"    : "center"
        }
    };

    /**
     * primary function to iterate through active comp and fill JSON object with associated layers/properties
     *
     * @param {"content" | "all"} arg - Argument target
     * @returns {Object}              - Result
     */
    function DCtoJSON (arg) { // eslint-disable-line no-unused-vars
        // Holds overall Roto and Content objects. Global for this function.
        var rotoObject = {
            "exporterVersion" : Config.version,
            "layers"          : {}
        };
        var contentObject = {};

        /**
         * Iterates through allLayersObj, and populates rotoObject and contentObject from there
         *
         * @param {LayersObject[]} allLayersObj - All layers object
         */
        function populateOutputObjects (allLayersObj) {
            Log.trace("--> populateOutputObjects: Starting to iterate over allLayersObj");

            // can this use... aeq.forEach(allLayersObj, function (layerObj) { // stuff });
            for (var layerName in allLayersObj) {
                if (allLayersObj.hasOwnProperty(layerName)) {
                    var layerObj = allLayersObj[layerName];
                    var safeLayerName = layerName;
                    var layerRoto = {};

                    // Build layerRoto if needed
                    if (arg === "all")
                        layerRoto = layerObj.layerRoto;

                    // If tempContent isn't empty, push it to contentObject and set it as tempRoto's source
                    var layerContent = layerObj.layerContent;
                    if (Util.getObjectSize(layerContent) > 0) {
                        contentObject[safeLayerName] = layerContent;
                        layerRoto.source = safeLayerName;
                    }

                    rotoObject.layers[safeLayerName] = layerRoto;
                }
            }

            Log.trace("<-- populateOutputObjects: Done iterating over allLayersObj");
        }

        /**
         * Writes rotoObject and contentObject to json files
         */
        function writeJSONFiles () {
            Log.trace("--> writeJSONFiles");

            var defaultFileName = aeq.app.getAEPName() + "_" + Util.buildDateString() + ".json";
            var userJSONFileObj = (new File(defaultFileName)).saveDlg("Export " + comp.name + " as JSON...", "JSON:*.json;");

            if (!userJSONFileObj) {
                Log.trace("<-- writeJSONFiles: JSON export canceled.");
                alert("JSON export canceled.");
                return;
            }

            var tempContentFileObj = userJSONFileObj;
            var userJSONFileName = Util.stripExtension(userJSONFileObj.fsName);

            if (arg === "all") { // set up naming for roto file if exporting everything
                var contentName = userJSONFileName + "_content.json";

                if (userJSONFileName.match("roto"))
                    contentName = userJSONFileName.replace("roto", "content") + ".json";

                var rotoString = JSON.stringify(rotoObject);
                var rotoFileObj = aeq.file.writeFile(userJSONFileObj, rotoString, { "encoding" : "UTF-8" }); // eslint-disable-line no-unused-vars
                tempContentFileObj = new File(contentName);
            }

            var contentString = JSON.stringify(contentObject);
            var contentFileObj = aeq.file.writeFile(tempContentFileObj, contentString, { "encoding" : "UTF-8" }); // eslint-disable-line no-unused-vars
            //app.executeCommand(16); // undo

            Log.trace("<-- writeJSONFiles");
        }


        Log.trace("--> DCtoJSON ('" + arg + "')");

        // Ensure project is good to go
        if (!aeq.app.getAEP())
            return alert(Err._formatErrorObj(Err.notSaved()));

        aeq.project.quickSave();

        var comp = aeq.activeComp();
        if (aeq.isNullOrUndefined(comp))
            return alert(Err._formatErrorObj(Err.noComp()));

        var foundErrors = ErrorChecker.errorCheckAll(comp, true);

        if (foundErrors && !Config.globals.continueExporting)
            return;

        Config.globals.startTime = new Date().getTime();
        Config.globals.mainFPS = comp.frameRate;

        var allLayersObj = buildAllLayersObj(comp, arg);

        // Populate rotoObject and contentObject
        populateOutputObjects(allLayersObj);
        rotoObject.duration = aeq.timeToFrames(comp.duration, comp.frameRate);
        rotoObject.frameRate = comp.frameRate;
        rotoObject.frameSize = [comp.width, comp.height];

        Config.globals.endTime = new Date().getTime();

        // Write to disk
        writeJSONFiles();

        if (Prefs.getAsBool("saveRecovery")) {
            var tempFilePath = aeq.file.joinPath(Config.globals.resourcePath, Config.globals.tempObjectFilename);
            var tempFile = aeq.file.getFile(tempFilePath);

            if (!aeq.isNullOrUndefined(tempFile))
                tempFile.remove();
        }

        if (foundErrors)
            ErrorChecker.showErrors();

        Log.trace("<-- DCtoJSON ('" + arg + "')");
    }

    /**
     * Object containing layer data
     *
     * @typedef {Object} LayerObject
     * @property {Layer} layer                - Layer link
     * @property {ContentObject} layerContent - Layer Content Object
     * @property {RotoObject} layerRoto       - Layer Roto Object
     */

    /**
     * Object containing Temp Content data
     *
     * @typedef {Object} ContentObject
     *
     * @property {Number[]} [location]                         - Dimensions ([0, 0, size[0], size[1])
     *
     * Shape Data:
     * @property {Boolean} [isRound]                           - Whether shape layer has an ellipse
     * @property {[Number, Number, Number]} [borderColor]      - Border colour
     * @property {Number} [border]                             - Border width
     * @property {[Number, Number, Number]} [backgroundColor]  - BG colour
     *
     * Gradient info:
     * @property {String} [gradient]                           - "linear" or "radial"
     * @property {[Number, Number]} [gradientStartPoint]       - Gradient start point ([x, y])
     * @property {[Number, Number]} [gradientEndPoint]         - Gradient end point ([x, y])
     * @property {Number[]} [positions]                        - Gradient stop positions array
     * @property {[Number, Number, Number, Number][]} [colors] - Gradient stop colours (rgba)
     *
     * Red Giant Gradient Info:
     * @property {String} [gradient]                           - "linear" or "radial"
     * @property {Number} [gradientAngle]                      - Gradient angle (for linear)
     * @property {[Number, Number]} [gradientCenter]           - Gradient center (for radial)
     * @property {Number} [gradientRadius]                     - Gradient radius (for radial)
     * @property {Number[]} [gpos]                             - Gradient stop positions array
     * @property {[Number, Number, Number, Number][]} [gcol]   - Gradient stop colours (rgba)
     *
     * Source Data Info:
     * @property {String} [src_video]                          - Filename of source video
     * @property {String} [image]                              - Filename of source image
     * @property {Number[]} [backgroundColor]                  - RGB array of BG colour
     *
     * Marker Data Info:
     * @property {Boolean} [isDynamic]                         - Whether property is dynamic
     * @property {Number} [contentGroup]                       - Content group #
     * @property {String} [contentType]                        - Content type tag
     *
     * Text Data Info:
     * @property {String} [text]                               - Text content
     * @property {String} [textTypeface]                       - Text typeface name
     * @property {Number} [textSize]                           - Text size (with scale offset)
     * @property {Number[]} [textColor]                        - Text colour (0-255)[]
     * @property {Number} [textAlign]                          - Text justification value (0, 0.5, 1)
     * @property {Number} [textTracking]                       - Text tracking value (px)
     * @property {Number} [textVAlign]                         - Text vAlign value (px)
     * @property {Number} [textLeading]                        - Text leading value (px)
     * @property {Boolean} [textItalic]                        - Whether text is italic
     * @property {String} [textWeight]                         - Style
     * @property {Number[]} [textShadColor]                    - Drop shadow colour (0-255)[]
     * @property {Number} [textShadOpacity]                    - Drop shadow opacity (0-100)
     * @property {Number} [textShadDirection]                  - Drop shadow direction (0-360)
     * @property {Number} [textShadDistance]                   - Drop shadow distance (px)
     * @property {Number} [textShadBlur]                       - Drop shadow blur (px)
     *
     * @property {HLSEffectObject} [colorAdjustments]          - HSL Data
     */

    /**
     * Object containing Roto Content data
     *
     * @typedef {Object} RotoObject
     * @property {Boolean} isVisible                - Whether layer is visible
     * @property {[Number, Number]} size            - Layer size
     * @property {Number} zPosition                 - Z position (depth in comp)
     * @property {Number} firstFrame                - Layer in frame
     * @property {Number} lastFrame                 - Layer out frame
     * @property {String[]} [children]              - Child layer names
     * @property {String} [blendMode]               - Blending mode
     * @property {String} [contentType]             - Content type
     * @property {LUTDataObject} [colorAdjustments] - LUT data
     *
     * TRACK MATTE DATA:
     * @property {Boolean} maskExcludes             - Whether mask is inverted
     * @property {String} maskLayer                 - Mask layer name
     *
     * ANIMATED DATA:
     * @property {Number[]} opacity                 - Video start time
     *
     * FRAME DATA: One of the blow MUST be present
     * @property {Number[][]} [bezierWarpData]      - Bezier warp data
     * @property {Number[][]} [frameData]           - Frame data
     *
     * BLUR DATA:
     * @property {Number[]} [blur]                                          - Video local start time
     * @property {Number[]} [xBlur]                                         - Start frame
     * @property {Number[]} [yBlur]                                         - End frame
     * @property {{sigma: Number[], direction: Number[]}} [directionalBlur] - Local start time
     */

    /**
     * Recurses through layers and adds each layer to a big allLayersObj
     * This takes care of ALL ae dom touching, so that at the end each layerObj is big and complete
     * Then, in DCtoJSON, we take this data and build content and roto objects for output
     *
     * @param {CompItem} rootComp      - Comp to recurse through
     * @param {"all" | "content"} mode - Mode
     * @param {Number} [startOffset]   - Offset from start of comp
     * @param {Number} [inMin]         - In max in frames
     * @param {Number} [outMax]        - Out max in frames
     * @returns {LayerObject[]}      - Resulting layer object
     */
    function buildAllLayersObj (rootComp, mode, startOffset, inMin, outMax) { // eslint-disable-line no-unused-vars
        /**
         * Parses temp file contents as object
         *
         * @param {File} tempFile    - Temp file from disk
         * @returns {LayersObject[]} - AllLayersObject from file
         */
        function parseTempFile (tempFile) {
            Log.trace("--> parseTempFile");

            var tempFileContents = aeq.file.readFile(tempFile);

            // Strip trailing ',', wrap in brackets for parsing
            tempFileContents = "{" + tempFileContents.replace(/,$/, "") + "}";

            Log.trace("parseTempFile: Done reading! Parsing...");

            var tempObject = {};
            writeLn("Reading temp file, please wait...");
            writeLn("This is slow (~5+ minutes).");

            try {
                tempObject = JSON.parse(tempFileContents);
            } catch (e) {
                Log.error(e);
            }

            Log.trace("<-- parseTempFile");
            return tempObject;
        }

        /**
         * Builds layer objects for all layers in comp
         *
         * @param {CompItem} comp          - Comp to recurse through
         * @param {"all" | "content"} mode - Mode
         * @param {Number} [startOffset]   - Offset from start of comp
         * @param {Number} [inMin]         - In max in frames
         * @param {Number} [outMax]        - Out max in frames
         */
        function buildCompLayerObjs (comp, mode, startOffset, inMin, outMax) {
            if (!aeq.isComp(comp))
                return;

            Log.trace("--> buildCompLayerObjs: Building layerObjs from comp '" + comp.name + "'");

            var fps = Config.globals.mainFPS;
            startOffset = aeq.setDefault(startOffset, 0);
            inMin = aeq.setDefault(inMin, 0);
            outMax = aeq.setDefault(outMax, Math.ceil(aeq.timeToFrames(comp.duration, fps)));

            aeq.forEachLayer(comp, function (layer) {
                pBar.update();

                // Skip layer if it already has been processed (usually because it exists in temp file)
                if (allLayersObj.hasOwnProperty(layer.name)) {
                    Log.trace("buildCompLayerObjs: Skipping layer " + layer.name);
                    return;
                }

                // Skip layer if name doesn't contain delimiter
                if (!Core.isValidLayer(layer))
                    return;

                var layerObj = {
                    "layerContent" : {},
                    "layerRoto"    : {}
                };

                allLayersObj[layer.name] = layerObj;

                // Parse markers
                var markerData = Markers.buildLayerMarkersObject(layer);

                // Parse IO data
                var ioData = Core.buildLayerIOObject(layer, startOffset, inMin, outMax);

                // Get scale offset
                var scaleOffset = Core.findScaleOffset(layer, ioData);

                // Parse Size
                var sizeData = Core.findSize(layer, scaleOffset);

                // If precomp, set up children layers, and recurse
                if (aeq.isPrecomp(layer)) {
                    var newOffset = startOffset + Math.ceil(aeq.timeToFrames(layer.startTime, fps));
                    var newInMin = ioData.startFrame;
                    var newOutMax = ioData.endFrame + 1;

                    buildCompLayerObjs(layer.source, mode, newOffset, newInMin, newOutMax);
                    precompLayerNames.push(layer.name);
                }

                /* CONTENT ONLY STUFF ---> */
                // Parse Shape Layer
                var shapeLayerData = Core.buildShapeLayerObj(layer);
                if (!aeq.isNullOrUndefined(shapeLayerData)) {
                    layerObj.layerContent = Util.mergeObjs(layerObj.layerContent, shapeLayerData);
                    layerObj.layerContent.location = [0, 0, sizeData[0], sizeData[1]];
                }

                // Parse DGE Gradient
                var redGiantGradientData = Gradients.buildRedGiantGradientDataObject(layer);
                if (!aeq.isNullOrUndefined(redGiantGradientData)) {
                    if (!aeq.isNullOrUndefined(layerObj.layerContent.gradient)) {
                        delete layerObj.layerContent.gradient;
                        delete layerObj.layerContent.gradientStartPoint;
                        delete layerObj.layerContent.gradientEndPoint;
                        delete layerObj.layerContent.gradientColors;
                        delete layerObj.layerContent.gradientPositions;
                    }
                    layerObj.layerContent = Util.mergeObjs(layerObj.layerContent, redGiantGradientData);
                }

                // Parse layer source
                var sourceData = Core.buildLayerSourceDataObject(layer);
                if (!aeq.isNullOrUndefined(sourceData)) {
                    if (!aeq.isNullOrUndefined(sourceData.backgroundColor) && !aeq.isNullOrUndefined(layerObj.layerContent.gradient))
                        delete sourceData.backgroundColor;

                    layerObj.layerContent = Util.mergeObjs(layerObj.layerContent, sourceData);
                }

                // Add this data no matter what
                // If it's on a precomp, it'll be deleted later
                if (!aeq.isNullOrUndefined(markerData)) {
                    layerObj.layerContent.isDynamic = markerData.isDynamic;
                    layerObj.layerContent.contentGroup = markerData.contentGroup;
                    layerObj.layerContent.contentType = markerData.contentType;
                }

                // Parse text
                var textData = Text.buildTextLayerObject(layer, scaleOffset);
                if (!aeq.isNullOrUndefined(textData))
                    layerObj.layerContent = Util.mergeObjs(layerObj.layerContent, textData);

                // Parse HLS Effect
                var hslEffectData = Core.buildHLSEffectObject(layer, 0);
                if (!aeq.isNullOrUndefined(hslEffectData))
                    layerObj.layerContent.colorAdjustments = hslEffectData;

                /* <--- CONTENT ONLY STUFF */


                // Content only needs the above data; return now
                if (mode === "content") {
                    if (Prefs.getAsBool("saveRecovery"))
                        tempFile.write("\"" + layer.name + "\":" + JSON.stringify(layerObj) + ",");

                    return;
                }

                /* ROTO ONLY STUFF ---> */

                // Parse animated data. WARNING: THIS IS SLOW!
                var animatedData = Core.buildAnimatedDataObject(layer, ioData, scaleOffset);
                if (!aeq.isNullOrUndefined(animatedData))
                    layerObj.layerRoto = Util.mergeObjs(layerObj.layerRoto, animatedData);

                // Set visible
                layerObj.layerRoto.isVisible = layer.enabled;

                // Set size
                layerObj.layerRoto.size = sizeData;

                // Parse children
                layerObj.layerRoto.children = Core.getPrecompLayerNames(layer);

                // Parse blending mode
                if (layer.blendingMode !== BlendingMode.NORMAL && Core.checkHasSupportedBlendMode(layer))
                    layerObj.layerRoto.blendMode = Core.getBlendingModeName(layer);

                // tempRoto: add markerData
                if (!aeq.isNullOrUndefined(markerData) && !aeq.isPrecomp(layer))
                    layerObj.layerRoto.contentType = markerData.contentType;

                // Parse track matte
                var trackMatteData = Core.buildTrackMatteObject(layer);
                if (!aeq.isNullOrUndefined(trackMatteData))
                    layerObj.layerRoto = Util.mergeObjs(layerObj.layerRoto, trackMatteData);

                // Parse LUTs (deprecated / needs work)
                /*
                var lutData = LUTs.buildLUTObject(layer);
                if (!aeq.isNullOrUndefined(lutData))
                    layerObj.layerRoto.colorAdjustments = lutData;
                */

                // Set IO data
                layerObj.layerRoto.firstFrame = !aeq.isNullOrUndefined(ioData.vidStart) ? ioData.vidStart : ioData.startFrame;
                layerObj.layerRoto.inFrame = ioData.startFrame;
                // layerObj.layerRoto.outFrame = ioData.endFrame;
                layerObj.layerRoto.lastFrame = ioData.endFrame;

                // Set zPosition
                layerObj.layerRoto.zPosition = layer.containingComp.numLayers - layer.index;

                // Parse displacement map
                layerObj.displacementMap = Core.buildDisplacementMapObject(layer);

                /* <--- ROTO ONLY STUFF */
                if (Prefs.getAsBool("saveRecovery"))
                    tempFile.write("\"" + layer.name + "\":" + JSON.stringify(layerObj) + ",");
            });

            Log.trace("<-- buildCompLayerObjs: Finished layerObjs from comp '" + comp.name + "'");
        }

        Log.trace("--> buildAllLayersObj: Building from root comp '" + rootComp.name + "'...");

        var allLayersObj = {};
        var precompLayerNames = aeq.arrayEx();

        var pBar = new PBarUI("Serializing Project for JSON Export", Core.getLayersDeep(rootComp).length);
        pBar.show();

        var tempFile = aeq.file.getFileObject(tempFilePath);
        var tempFilePath = aeq.file.joinPath(Config.globals.resourcePath, Config.globals.tempObjectFilename);

        if (Prefs.getAsBool("saveRecovery")) {
            if (tempFile.exists && confirm("Found recovery file! Try to recover existing data?\n\nWarning-- this may take a while (~5+ minutes)"))
                allLayersObj = parseTempFile(tempFile);

            if (!tempFile.exists)
                tempFile = aeq.file.writeFile(tempFile, "");

            tempFile.open("a");
        }

        buildCompLayerObjs(rootComp, mode, startOffset, inMin, outMax);

        if (Prefs.getAsBool("saveRecovery"))
            tempFile.close();

        // This is used to push parent markers all the way down
        // We're using an index array to isolate precomps, so we don't have
        // to iterate through the whole layerObj
        precompLayerNames.forEach(function (precompLayerName) {
            var layerObj = allLayersObj[precompLayerName];
            Markers.sendMarkerObjectToPrecompLayers(layerObj, allLayersObj);
        });

        pBar.update();
        pBar.close();

        Log.trace("<-- buildAllLayersObj: Returning obj from root comp '" + rootComp.name + "'");
        return allLayersObj;
    }

    var Core = (function () {

        /**
         * Analyzes project item and returns a fake enum of item type
         *
         * @param {Item} item Project item to check
         * @returns {String} Fake enum of item type
         */
        function getItemType (item) {
            if (aeq.isComp(item)) return "ItemType.COMP";
            if (aeq.isFolderItem(item)) return "ItemType.FOLDER";

            if (!aeq.isFootageItem(item)) return null;

            if (item.mainSource instanceof SolidSource) return "ItemType.SOLID";
            if (item.mainSource instanceof PlaceholderSource) return "ItemType.PLACEHOLDER";

            var extension = aeq.file.getExtension(item.mainSource.file);
            if (extension.toLowerCase() === "c4d") return "ItemType.C4D";

            if (item.hasVideo) {
                if (item.mainSource.isStill) return "ItemType.IMAGE";
                if (item.hasAudio) return "ItemType.VIDEO_WITH_AUDIO";

                var importedItem = aeq.importFile(item.mainSource.file);
                var importIsImage = importedItem.mainSource.isStill;
                importedItem.remove();

                if (importIsImage) return "ItemType.IMAGE_SEQUENCE";

                return "ItemType.VIDEO";
            }

            if (item.hasAudio) return "ItemType.AUDIO";

            return null;
        }

        /**
         * Checks whether a layer is of a valid type
         *
         * @param {AVLayer} layer - Layer to check
         * @returns {Boolean}     - Whether layer is a valid type
         */
        function isValidLayerType (layer) {
            return aeq.isLayer(layer) && !aeq.isCameraLayer(layer) && !layer.nullLayer && !layer.guideLayer;
        }

        /**
         * Checks whether a layer is valid, by presence of a dash and type
         *
         * @param {AVLayer} layer - Layer to check
         * @returns {Boolean}   - Whether layer is valid
         */
        function isValidLayer (layer) {
            if (!isValidLayerType(layer))
                return false;

            return !aeq.isNullOrUndefined(layer.name.match(Config.globals.validLayerDelimiter));
        }

        /**
         * Copies a property from one object to another by name, if source has property
         *
         * @param {{}} source Source object
         * @param {{}} target Target object
         * @param {String} propName Property name
         * @returns {Boolean} Whether the copy happened
         */
        function copyObjectPropertyByName (source, target, propName) {
            Log.trace("--> copyObjectPropertyByName: Copying " + propName);

            if (source.hasOwnProperty(propName)) {
                target[propName] = source[propName];
                Log.trace("<-- copyObjectPropertyByName: Copied " + propName);
                return true;
            }

            Log.trace("<-- copyObjectPropertyByName: Source didn't have property " + propName);
            return false;
        }

        /**
         * Returns an arrayEx of all layers in comp and precomps
         * @param  {CompItem} comp               - The comp to flatten.
         * @param  {Boolean} [includeCompLayers] - Whether to include comp layers
         * @param  {Boolean} [returnArrayEx]     - Whether to retun as arrayEx
         * @return {aeq.arrayEx}                 - ArrayEx with Layer objects.
         */
        function getLayersDeep (comp, includeCompLayers, returnArrayEx) {
            includeCompLayers = aeq.setDefault(includeCompLayers, true);

            // The returnArrayEx param is so we can skip the converting to arrayEx when
            // recursing. It is not meant to be used outside of this function.
            var layers = [];

            aeq.forEachLayer(comp, function (layer) {
                if (aeq.isPrecomp(layer)) {
                    layers.push.apply(layers, getLayersDeep(layer.source, includeCompLayers, false));

                    if (!includeCompLayers)
                        return;
                }

                layers.push(layer);
            });

            // Skip converting to arrayEx when function is called by it self.
            if (returnArrayEx === false)
                return layers;

            return aeq.arrayEx(layers);
        }

        /**
         * Recursively makes unique
         *
         * @param {CompItem} comp - Comp to make unique
         * @returns {CompItem}    - New comp
         */
        function recursiveMakeUnique (comp) {
            var compSuffix = "_:" + generateUniqueString();
            var uniqueComp = comp.duplicate();
            var originalCompName = uniqueComp.name;
            uniqueComp.parentFolder = aeq.project.getOrCreateFolder(Config.globals.uniqueFolderName);
            uniqueComp.name = originalCompName + compSuffix;

            aeq.getLayers(uniqueComp).filter(isValidLayer).forEach(function (layer) {
                var wasLocked = false;

                if (layer.locked) {
                    wasLocked = true;
                    layer.locked = false;
                }

                var originalLayerName = layer.name;

                var layerNameSuffix = "_" + generateUniqueString();

                if (aeq.isPrecomp(layer)) {
                    var newSource = Core.recursiveMakeUnique(layer.source);
                    layer.replaceSource(newSource, false);

                    if (!layer.isNameFromSource) {
                        layer.name = originalLayerName + layerNameSuffix;
                        app.project.autoFixExpressions(originalLayerName, layer.name);
                    }
                } else {
                    layer.name = originalLayerName + layerNameSuffix;
                    app.project.autoFixExpressions(originalLayerName, layer.name);
                }

                layer.locked = wasLocked;
            });

            app.project.autoFixExpressions(originalCompName, uniqueComp.name);

            return uniqueComp;
        }

        /**
         * Generates a uniqueID; stores created IDs in a global flag
         *
         * @returns {String} - Unique ID
         */
        function generateUniqueString () {
            /**
             * Generates a hex string
             *
             * @param {Number} len - Length of string to generate
             * @returns {String}   - Generated string
             */
            function generateIDString (len) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < len; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            }

            var length = Config.globals.uniqueSuffixLength;
            var tempID = generateIDString(length);

            while (Config.globals.uniqueSuffixes.join("|").indexOf(tempID) > -1)
                tempID = generateIDString(length);

            Config.globals.uniqueSuffixes.push(tempID);

            return tempID;
        }

        /**
         * Finds size of layer
         *
         * @param {TextLayer} layer    - Layer to check
         * @param {Number} scaleOffset - scaleOffset value
         * @returns {[Number, Number]} - 2-dimensional size array
         */
        function findSize (layer, scaleOffset) {
            Log.trace("--> findSize: Finding size of '" + layer.name + "'...");

            if (aeq.isTextLayer(layer)) {
                Log.trace("<-- findSize: Found bounding box of TextLayer '" + layer.name + "'");
                return Text.buildTextBoxBoundsObject(layer, scaleOffset).size;
            }

            var tempPointControl = layer("ADBE Effect Parade").addProperty("ADBE Point Control");
            tempPointControl.property("ADBE Point Control-0001").expression = "var obj = thisLayer.sourceRectAtTime();\n" +
                                                                              "[obj.width, obj.height]";

            var tempVal = tempPointControl.property("ADBE Point Control-0001").valueAtTime(0, false);
            tempPointControl.remove();

            if (layer.source) {
                Log.trace("<-- findSize: Found size of layer with source '" + layer.name + "'");
                return Util.roundVal(tempVal);
            } else if (aeq.isShapeLayer(layer)) {
                Log.trace("<-- findSize: Found size of ShapeLayer '" + layer.name + "'");
                return Util.roundVal(tempVal * scaleOffset);
            }

            Log.trace("<-- findSize: Couldn't find size of '" + layer.name + "'");
            return;
        }

        /**
         * Finds the maximum percentage of scale offset, even if parented to other scaled layers
         *
         * @param {Layer} layer                - Layer to check
         * @param {LayerIOObject} ioDataObject - Object containing IO data
         * @returns {Number}                   - Maximum scale percentange (0.0 - 1.0)
         */
        function findScaleOffset (layer, ioDataObject) {
            Log.trace("--> findScaleOffset: Finding scale offset of layer '" + layer.name + "'...");

            var fps = Config.globals.mainFPS;

            var scaleOffsetFx = layer("ADBE Effect Parade").addProperty("ADBE Slider Control");
            scaleOffsetFx.property("ADBE Slider Control-0001").expression = "L = thisLayer;\n" +
                                                                            "s = L.transform.scale;\n" +
                                                                            "while (L.hasParent) {\n" +
                                                                            "  sp = L.parent.transform.scale;\n" +
                                                                            "  s = [s[0] * sp[0], s[1] * sp[1]] * .01;\n" +
                                                                            "  L = L.parent;\n" +
                                                                            "};\n" +
                                                                            "s[0] * .01";

            var pointOffset = scaleOffsetFx.property("ADBE Slider Control-0001").valueAtTime(ioDataObject.localStart, false);

            for (var currentFrame = ioDataObject.localStart; currentFrame < ioDataObject.localEnd; currentFrame++) {
                var currentTime = aeq.framesToTime(currentFrame, fps);
                var scaleOffsetValue = scaleOffsetFx.property("ADBE Slider Control-0001").valueAtTime(currentTime, false);
                pointOffset = Math.max(scaleOffsetValue, pointOffset);
            }

            scaleOffsetFx.remove();

            Log.trace("<-- findScaleOffset: layer '" + layer.name + "'");
            return pointOffset;
        }

        /**
         * Gets a layer's effect by index
         *
         * @param {Layer} layer        - Layer to get effect from
         * @param {Number} effectIndex - Effect index to get
         * @returns {PropertyGroup}    - Effect
         */
        function getLayerEffectByIndex (layer, effectIndex) {
            return layer("ADBE Effect Parade")(effectIndex);
        }

        /**
         * Returns an array of layer names within a specified precomp
         *
         * @param {AVLayer} precompLayer - Precomp as a layer
         * @returns {String[]}           - Array of precomp's child layer names
         */
        function getPrecompLayerNames (precompLayer) {
            Log.trace("--> getPrecompLayerNames: Getting layer names in precomp '" + precompLayer.name + "'");

            if (!aeq.isPrecomp(precompLayer)) {
                Log.trace("<-- getPrecompLayerNames: Layer '" + precompLayer.name + "' is not a precomp.");
                return;
            }

            var childrenNameArray = aeq.arrayEx();
            var comp = precompLayer.source;

            aeq.forEachLayer(comp, function (compLayer) {
                if (!isValidLayer(compLayer))
                    return;

                childrenNameArray.push(compLayer.name);
            });

            Log.trace("<-- getPrecompLayerNames: '" + precompLayer.name + "'");
            return childrenNameArray;
        }

        /**
         * Returns first property on layer matching propName, else undefined
         *
         * @param {Layer} layer Layer to search on
         * @param {String} propName Property name to find
         * @returns {Property | undefined} Property, or undefined
         */
        function findLayerPropByName (layer, propName) {
            return aeq.getProperties([layer], { "groups" : true }).find(function (prop) {
                return prop.matchName === propName;
            });
        }

        /**
         * Returns arrayEx of effect(s) on layer matching effectName, else undefined
         *
         * @param {Layer} layer Layer to search on
         * @param {String} effectName Effect name to find
         * @returns {PropertyGroup[] | undefined} Effect, or undefned
         */
        function findLayerEffectsByName (layer, effectName) {
            return aeq.getEffects(layer).filter(function (effect) {
                return effect.matchName.match(effectName) && effect.enabled;
            });
        }

        /**
         * Returns 0-255 colour of first Fill effect on a layer
         *
         * @param {Layer} layer Layer to get fill colour of
         * @returns {[Number, Number, Number]} [0-255, 0-255, 0-255]
         */
        function getFillEffectColour (layer) {
            var fillEffect = Core.findLayerEffectsByName(layer, "ADBE Fill")[0];

            if (aeq.isNullOrUndefined(fillEffect))
                return;

            return Util.colourToDec(fillEffect("ADBE Fill-0002").value);
        }

        /**
         * Returns a rounded value for a property at given time
         *
         * @param {Property} property       - Property
         * @param {Number} time             - Time to get the value at
         * @param {Boolean} [preExpression] - Whether to evaluate pre-expression; defaults false
         * @returns {Number} Rounded value at time
         */
        function getRoundedValueAtTime (property, time, preExpression) {
            preExpression = aeq.setDefault(preExpression, false);

            return Util.roundVal(property.valueAtTime(time, preExpression));
        }

        /**
         * Finds blending mode for a layer object
         *
         * @param {AVLayer} layer Layer to check
         * @returns {String} Layer's blending mode value
         */
        function getBlendingModeName (layer) {
            for (var BlendingModeValue in BlendingMode) {
                if (layer.blendingMode === BlendingMode[BlendingModeValue])
                    return Util.replaceAll(BlendingModeValue.toLowerCase(), "_", " ");
            }
        }

        /**
         * Finds track matte name for a layer object
         *
         * @param {AVLayer} layer - Layer to check
         * @returns {String}      - Layer's track matte name value
         */
        function getTrackMatteTypeName (layer) {
            for (var TrackMatteValue in TrackMatteType) {
                if (layer.trackMatteType === TrackMatteType[TrackMatteValue])
                    return TrackMatteValue.toLowerCase();
            }
        }

        /**
         * Check whether layer is using a supported
         *
         * @param {AVLayer} layer - Layer to check
         * @returns {Boolean}     - False if unsupported mode found
         */
        function checkHasSupportedBlendMode (layer) {
            return aeq.arrayEx(Config.globals.supportedModes).indexOf(Core.getBlendingModeName(layer)) > -1;
        }

        /**
         * Checks whether passed blur is supported
         *
         * @param {String} blurName - Name of blur to check
         * @returns {Boolean}       - False if unsupported blur found
         */
        function checkIsSupportedBlur (blurName) {
            return aeq.arrayEx(Config.globals.supportedEffects.supportedBlurs).indexOf(blurName) > -1;
        }

        /**
         * Object containing HLS effect data
         *
         * @typedef {Object} HLSEffectObject
         * @property {String} type       - "HSL" always
         * @property {Number} hue        - Hue value
         * @property {Number} saturation - Saturation value
         * @property {Number} lightness  - Lightness value
         */

        /**
         * Builds an HLS object from layer
         *
         * @param {Layer} layer       - Target layer
         * @param {Number} frame      - Frame to build object at
         * @returns {HLSEffectObject} - HSL Object
         */
        function buildHLSEffectObject (layer, frame) {
            Log.trace("--> buildHLSEffectObject: Building HLSObj for " + layer.name + " at frame " + String(frame));

            var hslEffect = Core.findLayerEffectsByName(layer, "(HLS)")[0];
            var fps = Config.globals.mainFPS;
            var currentTime = aeq.framesToTime(frame, fps);

            if (aeq.isNullOrUndefined(hslEffect)) {
                Log.trace("<-- buildHLSEffectObject: No HLS effect");
                return null;
            }

            Log.trace("<-- buildHLSEffectObject: Returning HLSObj for " + layer.name);
            return {
                "type"       : "HSL",
                "hue"        : getRoundedValueAtTime(hslEffect.property("ADBE Color Balance (HLS)-0001"), currentTime),
                "saturation" : getRoundedValueAtTime(hslEffect.property("ADBE Color Balance (HLS)-0003"), currentTime),
                "lightness"  : getRoundedValueAtTime(hslEffect.property("ADBE Color Balance (HLS)-0002"), currentTime)
            };
        }

        /**
         * Object containing blur keys & property links
         *
         * @typedef {Object} BlurEffectObjectData
         * @property {Property} [blur]  - Property link for general blur
         * @property {Property} [xBlur] - Property link for horizontal blur
         * @property {Property} [yBlur] - Property link for vertical blur
         * @property {{sigma: Property, direction: Property}} [directionalBlur] - Property links for sigma/direction
         */

        /**
         * Builds object of blur effect metadata
         * This is separated from getting the value as this should only be calcualted once
         *
         * @param {Layer} layer            - Layer to check
         * @returns {BlurEffectObjectData} - Blur effect object
         */
        function buildBlurMetadataObject (layer) {
            Log.trace("--> buildBlurMetadataObject: Building BlurEffectDataObj for layer '" + layer.name + "'...");

            var blurDirections = {
                "1" : "blur", // regular blur
                "2" : "xBlur", // horizontal blur
                "3" : "yBlur" // vertical blur
            };

            var blurEffects = Core.findLayerEffectsByName(layer, "Blur").filter(function (blurEffect) {
                return Core.checkIsSupportedBlur(blurEffect.matchName);
            });

            var blurMetadataObject = {};
            var blurKey = "";
            var blurProp;

            blurEffects.forEach(function (blurEffect) {
                if (blurEffect.matchName.match("Gaussian Blur")) {
                    Log.trace("<-- buildBlurMetadataObject: Found a Gaussian Blur");
                    blurKey = blurDirections[blurEffect.property("ADBE Gaussian Blur 2-0002").value];
                    blurProp = blurEffect.property("ADBE Gaussian Blur 2-0001");
                } else if (blurEffect.matchName.match("Box Blur")) {
                    Log.trace("<-- buildBlurMetadataObject: Found a Box Blur");
                    blurKey = blurDirections[blurEffect.property("ADBE Box Blur2-0003").value];
                    blurProp = blurEffect.property("ADBE Box Blur2-0001");
                } else if (blurEffect.matchName.match("Motion Blur")) {
                    Log.trace("<-- buildBlurMetadataObject: Found a as Directional Blur");
                    blurKey = "directionalBlur";
                    blurProp = {
                        "sigma"     : blurEffect.property("ADBE Motion Blur-0002"),
                        "direction" : blurEffect.property("ADBE Motion Blur-0001")
                    };
                }

                blurMetadataObject[blurKey] = blurProp;
            });

            Log.trace("<-- buildBlurMetadataObject: Returning for '" + layer.name + "'");
            return blurMetadataObject;
        }

        /**
         * Object containing displacementMap data
         * @typedef {Object} DisplacementMapDataObject
         * @property {String} src_video         - Name of souce file (png or mov)
         * @property {Number[]} src_video_size  - Width and height of the source video
         * @property {Number} displacementScale - Amount to affect pixel data (value is multiplied +-0-1 grey values)
         */

        /**
         * Builds displacement map object
         *
         * @param {AVLayer} layer               - Layer to build displacement map object for
         * @returns {DisplacementMapDataObject} - Disp object
         */
        function buildDisplacementMapObject (layer) {
            var displacementFx = Core.findLayerEffectsByName(layer, "ADBE Displacement Map")[0];

            if (aeq.isNullOrUndefined(displacementFx))
                return;

            var displacementFxLayerIndex = displacementFx("ADBE Displacement Map-0001").value;
            var displacementLayer = layer.containingComp.layer(displacementFxLayerIndex);
            var displacementLayerSource = displacementLayer.source;

            var displacementLayerSourceFileName = "";

            // check if displacement layer has source file
            if (!(aeq.isNullOrUndefined(displacementLayerSource) || aeq.isNullOrUndefined(displacementLayerSource.file)))
                displacementLayerSourceFileName = displacementLayerSource.file.name;

            return {
                "src_video"         : displacementLayerSourceFileName,
                "src_video_size"    : [displacementLayerSource.width, displacementLayerSource.height],
                "displacementScale" : Util.roundVal(displacementFx("ADBE Displacement Map-0003").value)
            };
        }

        /**
         * Creates point controls on a given layer
         * Returns array of created effect indices
         *
         * @param {Layer} layer Layer to create effects on
         * @param {Number} scaleOffset - Scale offset value
         * @returns {Number[]} Array of effect indices
         */
        function createPointControls (layer, scaleOffset) {
            Log.trace("--> createPointControls: '" + layer.name + "'...");
            var pointControlIndexArray = aeq.arrayEx();

            /** @type {PropertyGroup} */
            var layerEffectGroup = layer.property("ADBE Effect Parade");
            var numProps = 4;
            var fx;

            var objString = aeq.isTextLayer(layer) ? JSON.stringify(Text.buildTextBoxBoundsObject(layer, scaleOffset)) : "thisLayer.sourceRectAtTime()";

            var expVars = "var obj = " + objString + ";\n" +
                            "var UL = [obj.left, obj.top];\n" +
                            "var LR = [obj.left + obj.width, obj.top + obj.height];\n";

            var trExps = [
                expVars + "thisLayer.toComp(UL)",
                expVars + "thisLayer.toComp([LR[0],UL[1]])",
                expVars + "thisLayer.toComp([UL[0],LR[1]])",
                expVars + "thisLayer.toComp(LR)"
            ];

            if (layerEffectGroup("ADBE Corner Pin") && layerEffectGroup("ADBE Corner Pin").enabled)
                fx = "ADBE Corner Pin";
            else if (layerEffectGroup("ADBE BEZMESH") && layerEffectGroup("ADBE BEZMESH").enabled) {
                fx = "ADBE BEZMESH";
                numProps = 12;
            }

            for (var i = 0, il = numProps; i < il; i++) {
                // creates point controls for each pin, sets expression to get comp space transforms for all pins
                var pointControl = layerEffectGroup.addProperty("ADBE Point Control");
                var exp = trExps[i];

                if (fx)
                    exp = "toComp(effect('" + fx + "')(" + (i + 1) + "))";

                pointControl.property("ADBE Point Control-0001").expression = exp;
                pointControlIndexArray.push(layerEffectGroup.numProperties);
            }

            Log.trace("<-- createPointControls: '" + layer.name + "'");
            return pointControlIndexArray;
        }

        /**
         * Removes effects from a layer based on array of effect indices
         *
         * @param {Layer} layer Layer
         * @param {Number[]} effectIndexArray Array of created point control indices for a layer
         */
        function removeEffectsByIndexArray (layer, effectIndexArray) {
            for (var i = effectIndexArray.length - 1; i >= 0; i--)
                getLayerEffectByIndex(layer, effectIndexArray[i]).remove();
        }

        /**
         * Object containing animated data
         *
         * @typedef {Object} AnimatedDataObject
         *
         * @property {Number[]} [opacity]                                       - Video start time
         *
         * @property {Number[]} [blur]                                          - Video local start time
         * @property {Number[]} [xBlur]                                         - Start frame
         * @property {Number[]} [yBlur]                                         - End frame
         * @property {{sigma: Number[], direction: Number[]}} [directionalBlur] - Local start time
         *
         * @property {Number[][]} [bezierWarpData]                              - Bezier warp data
         * @property {Number[][]} [frameData]                                   - Frame data
         */

        /**
         * Iterates over a layer between start and end frames
         * Builds an object containing all animated data for layer between these times
         *
         * @param {Layer} layer                - Layer to parse
         * @param {LayerIOObject} ioDataObject - Object containing IO data
         * @param {Number} scaleOffset         - Scale offset value
         * @returns {AnimatedDataObject}       - Object containing all animated arrays
         */
        function buildAnimatedDataObject (layer, ioDataObject, scaleOffset) {
            Log.trace("--> buildAnimatedDataObject: Building object for layer '" + layer.name + "' between frames '" + ioDataObject.startFrame + "' and '" + ioDataObject.endFrame + "'");

            var animatedDataObject = {
                "opacity" : []
            };

            var frameObjKey = Core.findLayerEffectsByName(layer, "ADBE BEZMESH")[0] ? "bezierWarpData" : "frameData";
            animatedDataObject[frameObjKey] = [];

            // Build point controls on layer, returning array of created effect indices
            var pointControlIndexArray = createPointControls(layer, scaleOffset);

            var blurEffectObject = {};
            var blurMetadataObject = Core.buildBlurMetadataObject(layer);
            aeq.forEach(blurMetadataObject, function (blurKey) {
                if (blurKey === "directionalBlur") {
                    blurEffectObject[blurKey] = {
                        "sigma"     : [],
                        "direction" : []
                    };
                } else
                    blurEffectObject[blurKey] = [];
            });

            // Iterate through frames!
            var startFrame = !aeq.isNullOrUndefined(ioDataObject.vidStart) ? ioDataObject.vidLocalStart : ioDataObject.localStart;
            var fps = Config.globals.mainFPS;

            for (var currentFrame = startFrame; currentFrame <= ioDataObject.localEnd; currentFrame++) {
                var currentTime = aeq.framesToTime(currentFrame, fps);
                var opacValue = 0;

                // FRAME DATA
                var frameDataObject = Core.buildFrameDataObject(layer, pointControlIndexArray, currentTime);
                animatedDataObject[frameObjKey].push(frameDataObject.frameData);

                // OPACITY -- check if mov, and mov is visible
                if (frameDataObject.isZeroArea === false) {
                    if (aeq.isNullOrUndefined(ioDataObject.vidStart) || (!aeq.isNullOrUndefined(ioDataObject.vidStart) && currentFrame >= ioDataObject.localStart))
                        opacValue = Util.roundVal(layer("ADBE Transform Group")("ADBE Opacity").valueAtTime(currentTime, false) * 0.01);
                }

                animatedDataObject.opacity.push(opacValue);

                // BLUR EFFECT: Push value(s) at current time to blur object
                if (!aeq.isNullOrUndefined(blurMetadataObject)) {
                    aeq.forEach(blurMetadataObject, function (blurKey) { // jshint ignore:line
                        var blurProp = blurMetadataObject[blurKey];
                        if (blurKey === "directionalBlur") {
                            blurEffectObject.directionalBlur.sigma.push(getRoundedValueAtTime(blurProp.sigma, currentTime));
                            blurEffectObject.directionalBlur.direction.push(getRoundedValueAtTime(blurProp.direction, currentTime));
                        } else
                            blurEffectObject[blurKey].push(getRoundedValueAtTime(blurProp, currentTime));
                    });
                }
            }

            // Remove point controls on layer
            removeEffectsByIndexArray(layer, pointControlIndexArray);

            if (!aeq.isNullOrUndefined(blurMetadataObject))
                animatedDataObject = Util.mergeObjs(animatedDataObject, blurEffectObject);

            Log.trace("<-- buildAnimatedDataObject: Returning for layer '" + layer.name + "' between frames '" + ioDataObject.startFrame + "' and '" + ioDataObject.endFrame + "'");
            return animatedDataObject;
        }

        /**
         * Returns corner pin / bezier warp data as array of array, for targetFrame
         *
         * @param {Layer} layer                     - Layer to convrt
         * @param {Number[]} pointControlIndexArray - Array of point control effect indices
         * @param {Number} currentTime              - Current target frame
         * @returns {{frameData: Number[], isZeroArea: Boolean}} Array of frame data
         */
        function buildFrameDataObject (layer, pointControlIndexArray, currentTime) {
            // Prep returned object
            var frameDataObject = {
                "frameData"  : [],
                "isZeroArea" : false
            };

            for (var i = 0, il = pointControlIndexArray.length; i < il; i++) {
                var thisPointControl = getLayerEffectByIndex(layer, pointControlIndexArray[i]);
                var val = getRoundedValueAtTime(thisPointControl.property("ADBE Point Control-0001"), currentTime);
                frameDataObject.frameData.push(val);
            }

            // If no area, set minimum area
            if (Util.getPolyArea(frameDataObject.frameData) < 0.01) {
                frameDataObject.isZeroArea = true;
                frameDataObject.frameData = Util.createPoly(frameDataObject.frameData.length, 0.01, frameDataObject.frameData[0]);
            }

            return frameDataObject;
        }

        /**
         * Object containing layer IO data
         *
         * @typedef {Object} LayerIOObject
         *
         * @property {Number} [vidStart]      - Video start time
         * @property {Number} [vidLocalStart] - Video local start time
         *
         * @property {Number} startFrame      - Start frame
         * @property {Number} endFrame        - End frame
         * @property {Number} localStart      - Local start time
         * @property {Number} localEnd        - Local end time
         */

        /**
         * Builds an object detailing in, out, vidStart in frames for a given layer
         *
         * @param {Layer} layer        - Layer to build IO Object for
         * @param {Number} startOffset - Offset from start of comp
         * @param {Number} inMin       - In max in frames
         * @param {Number} outMax      - Out max in frames
         * @returns {LayerIOObject}    - IO Object
         */
        function buildLayerIOObject (layer, startOffset, inMin, outMax) {
            Log.trace("--> buildLayerIOObject: '" + layer.name + "'...");

            var fps = Config.globals.mainFPS;
            var startTimeInFrames = Math.ceil(aeq.timeToFrames(layer.startTime, fps));
            var inFrame = Math.ceil(aeq.timeToFrames(layer.inPoint, fps));
            var outFrame = Math.ceil(aeq.timeToFrames(layer.outPoint, fps));

            var ioObj = {};

            if (layer.source && layer.source.file && layer.source.file.name.match(".mov")) {
                if (startTimeInFrames - startOffset < inFrame) {
                    ioObj.vidStart = startOffset + startTimeInFrames;
                    ioObj.vidLocalStart = startTimeInFrames + 0;
                }
            }

            ioObj.startFrame = Math.max(inMin, startOffset + inFrame);
            ioObj.endFrame = Math.min(outMax, startOffset + outFrame) - 1;
            ioObj.localStart = Math.round(Math.max(inMin - startOffset, inFrame));
            ioObj.localEnd = Math.round(Math.min(outMax - startOffset, outFrame) - 1);

            Log.trace("<-- buildLayerIOObject: '" + layer.name + "'");
            return ioObj;
        }

        /**
         * Object containing layer marker data
         * @typedef {Object} ShapeLayerDataObj
         * @property {Boolean} [isRound]                           - Whether shape layer has an ellipse
         * @property {[Number, Number, Number]} [borderColor]      - Border colour
         * @property {Number} [border]                             - Border width
         * @property {[Number, Number, Number]} [backgroundColor]  - BG colour
         *
         * Gradient info:
         * @property {String} [gradient]                           - "linear" or "radial"
         * @property {[Number, Number]} [gradientStartPoint]       - Gradient start point ([x, y])
         * @property {[Number, Number]} [gradientEndPoint]         - Gradient end point ([x, y])
         * @property {Number[]} [positions]                        - Gradient stop positions array
         * @property {[Number, Number, Number, Number][]} [colors] - Gradient stop colours (rgba)
         */

        /**
         * Parses a shape layer
         *
         * @param {ShapeLayer} layer         - Shape layer to parse
         * @returns {ShapeLayerDataObj | {}} - Shape data object
         */
        function buildShapeLayerObj (layer) {
            if (!aeq.isShapeLayer(layer))
                return;

            Log.trace("--> buildShapeLayerObj: '" + layer.name + "'...");

            var shapeObj = {};

            if (Core.findLayerPropByName(layer, "ADBE Vector Shape - Ellipse"))
                shapeObj.isRound = true;

            var gradFill = Gradients.buildShapeGradientFillObject(layer);
            if (!aeq.isNullOrUndefined(gradFill))
                return Util.mergeObjs(shapeObj, gradFill);

            var fillEffectColour = Core.getFillEffectColour(layer);

            var strokeColorProp = Core.findLayerPropByName(layer, "ADBE Vector Stroke Color");
            if (strokeColorProp && strokeColorProp.propertyGroup(1).enabled) {
                var borderColor = Util.colourToDec(strokeColorProp.value);

                if (!aeq.isNullOrUndefined(fillEffectColour))
                    borderColor = fillEffectColour;

                shapeObj.borderColor = [255, borderColor[0], borderColor[1], borderColor[2]];
                shapeObj.border = Core.findLayerPropByName(layer, "ADBE Vector Stroke Width").value;
            }

            var fillColorProp = Core.findLayerPropByName(layer, "ADBE Vector Fill Color");
            if (fillColorProp && fillColorProp.propertyGroup(1).enabled) {
                var fillColor = Util.colourToDec(fillColorProp.value);

                if (!aeq.isNullOrUndefined(fillEffectColour))
                    fillColor = fillEffectColour;

                shapeObj.backgroundColor = fillColor;
            }

            Log.trace("<-- buildShapeLayerObj: '" + layer.name + "'");
            return shapeObj;
        }

        /**
         * Object containing source data
         *
         * @typedef {Object} SourceDataObject
         * @property {Number[]} location          Source dimensions [0, 0, width, height]
         * @property {String} [src_video]         Filename of source video
         * @property {String} [image]             Filename of source image
         * @property {Number[]} [backgroundColor] RGB array of BG colour
        */

        /**
         * Builds object for layer source
         *
         * @param {AVLayer} layer      - Layer to parse
         * @returns {SourceDataObject} - Object of layer source data
         */
        function buildLayerSourceDataObject (layer) {
            Log.trace("--> buildLayerSourceDataObject: '" + layer.name + "'...");

            var src = layer.source;

            if (!src || aeq.isComp(src))
                return;

            var layerSourceDataObject = {};

            // If source is a mov, return name as src_video
            // Otherwise, return as image
            if (src.file) {
                var key = "image";

                if (src.file.toString().match(".mov"))
                    key = "src_video";

                layerSourceDataObject[key] = src.file.displayName;
            } else if (src.mainSource instanceof SolidSource) {
                // Get solid colour from source
                var solidColour = Util.colourToDec(src.mainSource.color);

                // Check for a fill effect on the layer. If it's present, use that
                var fillEffectColour = Core.getFillEffectColour(layer);
                if (!aeq.isNullOrUndefined(fillEffectColour))
                    solidColour = fillEffectColour;

                layerSourceDataObject.backgroundColor = solidColour;
            }

            layerSourceDataObject.location = [0, 0, src.width, src.height];

            Log.trace("<-- buildLayerSourceDataObject: '" + layer.name + "'");
            return layerSourceDataObject;
        }

        /**
         * Object containing track matte data
         *
         * @typedef {Object} TrackMatteObject
         * @property {Boolean} maskExcludes - Whether mask is inverted
         * @property {String} maskLayer     - Mask layer name
        */

        /**
         * Builds track matte object
         *
         * @param {AVLayer} layer      - Layer to build object from
         * @returns {TrackMatteObject} - Track matte data object
         */
        function buildTrackMatteObject (layer) {
            if (!layer.hasTrackMatte)
                return;

            Log.trace("--> buildTrackMatteObject: '" + layer.name + "'...");

            var matteLayer = layer.containingComp.layer(layer.index - 1);

            var trackMatteObject = {
                "maskExcludes" : Core.getTrackMatteTypeName(layer).match("inverted") ? true : false, // eslint-disable-line no-unneeded-ternary
                "maskLayer"    : matteLayer.name
            };

            if (matteLayer.source && matteLayer.source.mainSource instanceof FileSource && !matteLayer.name.match(Config.globals.validLayerDelimiter))
                trackMatteObject.maskLayer = matteLayer.source.file.name;

            Log.trace("<-- buildTrackMatteObject: '" + layer.name + "'");
            return trackMatteObject;
        }

        return {
            "getItemType"                : getItemType,
            "isValidLayerType"           : isValidLayerType,
            "isValidLayer"               : isValidLayer,
            "findLayerPropByName"        : findLayerPropByName,
            "copyObjectPropertyByName"   : copyObjectPropertyByName,
            "getLayersDeep"              : getLayersDeep,
            "recursiveMakeUnique"        : recursiveMakeUnique,
            "findSize"                   : findSize,
            "findScaleOffset"            : findScaleOffset,
            "getPrecompLayerNames"       : getPrecompLayerNames,
            "findLayerEffectsByName"     : findLayerEffectsByName,
            "getFillEffectColour"        : getFillEffectColour,
            "getRoundedValueAtTime"      : getRoundedValueAtTime,
            "getBlendingModeName"        : getBlendingModeName,
            "getTrackMatteTypeName"      : getTrackMatteTypeName,
            "checkHasSupportedBlendMode" : checkHasSupportedBlendMode,
            "checkIsSupportedBlur"       : checkIsSupportedBlur,
            "buildHLSEffectObject"       : buildHLSEffectObject,
            "buildBlurMetadataObject"    : buildBlurMetadataObject,
            "buildDisplacementMapObject" : buildDisplacementMapObject,
            "buildAnimatedDataObject"    : buildAnimatedDataObject,
            "buildFrameDataObject"       : buildFrameDataObject,
            "buildLayerIOObject"         : buildLayerIOObject,
            "buildShapeLayerObj"         : buildShapeLayerObj,
            "buildLayerSourceDataObject" : buildLayerSourceDataObject,
            "buildTrackMatteObject"      : buildTrackMatteObject
        };
    })();

    var Err = (function () { // eslint-disable-line no-unused-vars
        /**
         * Error object
         * @typedef {Object} errObj
         * @property {String} issue   - Issue text
         * @property {String} [layer] - Layer name
         * @property {Number} [idx]   - Layer index in comp
         * @property {String} [comp]  - Comp name
         * @property {String} [data]  - Issue data
         */

        /**
         * Formats an error message
         *
         * @param {errObj} errObj - Error object
         * @returns {String}      - Formatted string for output error message
         */
        function _formatErrorObj (errObj) {
            var issue = errObj.issue;

            var layer = aeq.isNullOrUndefined(errObj.layer) ? "" : ": " + errObj.layer;
            var index = aeq.isNullOrUndefined(errObj.idx) ? "" : " #" + errObj.idx;
            var comp = aeq.isNullOrUndefined(errObj.comp) ? "" : " (" + errObj.comp + index + ")";
            var data = aeq.isNullOrUndefined(errObj.data) ? "" : " (" + String(errObj.data) + ")";

            return issue + layer + comp + data;
        }

        /**
         * Logs a formatted error object, and returns object
         *
         * @param {errObj} errObj - Error object to log
         * @returns {errObj}      - The same error object
         */
        function _err (errObj) {
            Log.error(_formatErrorObj(errObj));
            return errObj;
        }

        /**
         * Logs a formatted warning object, and returns object
         *
         * @param {errObj} errObj - warning object to log
         * @returns {errObj}      - The same warning object
         */
        function _warn (errObj) {
            Log.warning(_formatErrorObj(errObj));
            return errObj;
        }

        /**
         * Builds error string for duplicate warps
         *
         * @param {Layer} layer     - Bad layer
         * @param {String} warpType - Warp type
         * @returns {errObj}        - Error object
         */
        function dupeWarps (layer, warpType) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Too many " + warpType
            });
        }

        /**
         * Builds error string for duplicate gradients
         *
         * @param {Layer} layer - Bad layer
         * @returns {errObj}    - Error object
         */
        function dupeGrads (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Too many Gradient effects"
            });
        }

        /**
         * Builds error string for duplicate layer name
         *
         * @param {Layer} layer - Bad layer
         * @returns {errObj}    - Error object
         */
        function dupeLayerName (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Duplicate layer name"
            });
        }

        /**
         * Builds error sring for unsupported source
         *
         * @param {Layer} layer - Bad layer
         * @param {String} type - File source type
         * @returns {errObj}    - Error object
         */
        function unsupportedFileSource (layer, type) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported file source type: " + type
            });
        }


        /**
         * Builds error sring for unsupported shape type
         *
         * @param {ShapeLayer} layer - Bad layer
         * @returns {errObj}         - Error object
         */
        function unsupportedShape (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported shape group"
            });
        }

        /**
         * Builds error string for bad blending mode
         *
         * @param {Layer} layer         - Bad layer
         * @param {String} blendingMode - Bad blending mode
         * @returns {errObj}            - Error object
         */
        function unsupportedBlendingMode (layer, blendingMode) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported blending mode",
                "data"  : String(blendingMode)
            });
        }

        /**
         * Builds warning string for bad alpha matte
         *
         * @param {Layer} layer - Bad layer
         * @returns {errObj}    - Error object
         */
        function unsupportedAlphaMatte (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported Alpha Matte source",
                "data"  : "Alpha Matte should be Shape Layer, Solid or PNG"
            });
        }

        /**
         * Builds warning string for bad luma matte
         *
         * @param {Layer} layer - Bad layer
         * @returns {errObj}    - Error object
         */
        function unsupportedLumaMatte (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported Luma Matte source",
                "data"  : "Luma Matte should be MOV"
            });
        }

        /**
         * Builds warning string for unsupported effect
         *
         * @param {Layer} layer       - Bad layer
         * @param {String} effectName - Name of effect
         * @returns {errObj}          - Error object
         */
        function unsupportedEffect (layer, effectName) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported effect",
                "data"  : String(effectName)
            });
        }

        /**
         * Builds error string for unsupported text options
         *
         * @param {TextLayer} layer           - Bad layer
         * @param {String} unsupportedOptions - Bad type string
         * @returns {errObj}                  - Error object
         */
        function unsupportedTextOptions (layer, unsupportedOptions) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported text options",
                "data"  : String(unsupportedOptions)
            });
        }

        /**
         * Builds error string for unsupported font
         *
         * @param {TextLayer} layer - Bad layer
         * @returns {errObj}        - Error object
         */
        function unsupportedFont (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported font"
            });
        }

        /**
         * Builds error string for unsupported justification
         *
         * @param {TextLayer} layer      - Bad layer
         * @param {String} justification - Justification type
         * @returns {errObj}             - Error object
         */
        function unsupportedJustification (layer, justification) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Unsupported text justification",
                "data"  : String(justification)
            });
        }


        /**
         * Builds error string for having a mask
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Error object
         */
        function hasMask (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Has a mask"
            });
        }

        /**
         * Builds warning string for a layer having an image sequence
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Warning string
         */
        function hasImgSequence (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Layer is Image Sequence"
            });
        }

        /**
         * Builds warning string for a layer having start time between frames
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Warning string
         */
        function startTimeBetweenFrames (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Layer start time is between frames"
            });
        }

        /**
         * Builds warning string for a layer having in point between frames
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Warning string
         */
        function inPointBetweenFrames (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Layer in point is between frames"
            });
        }

        /**
         * Builds error string for having a fill effect on an image
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Error object
         */
        function imgFill (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Image w/ fill effect"
            });
        }

        /**
         * Builds warning string for an image in root comp?
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Warning string
         */
        function imgInRoot (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Image in root comp? Facebook will assume the image is THIS SIZE",
                "data"  : String([layer.containingComp.width, layer.containingComp.height])
            });
        }

        /**
         * Builds error string for missing paragraph text
         *
         * @param {TextLayer} layer - Bad layer
         * @returns {errObj}        - Error object
         */
        function notBoxText (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Non-paragraph text layer"
            });
        }

        /**
         * Builds error string for content group or type
         *
         * @param {Layer} layer - Bad layer
         * @returns {errObj}    - Error object
         */
        function groupOrType (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Content group OR type (not both)"
            });
        }

        /**
         * Builds warning string for disabled effect
         *
         * @param {Layer} layer       - Bad layer
         * @param {String} effectName - Name of effect
         * @returns {errObj}          - Error object
         */
        function disabledEffect (layer, effectName) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Disabled effect",
                "data"  : String(effectName)
            });
        }

        /**
         * Builds error string for unnamed layer
         *
         * @param {Layer} layer - Bad layer
         * @returns {errObj}    - Error object
         */
        function unnamed (layer) {
            return _warn({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Incorrect name? (Missing '-')"
            });
        }

        /**
         * Builds error string for layer styles
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Error object
         */
        function layerStyles (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Has layer styles"
            });
        }

        /**
         * Builds error string for time remap
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Error object
         */
        function timeRemap (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Is time remapped"
            });
        }

        /**
         * Builds error string for displacement map not having a file source
         *
         * @param {AVLayer} layer - Bad layer
         * @returns {errObj}      - Error object
         */
        function dispMapInvalidSource (layer) {
            return _err({
                "layer" : layer.name,
                "idx"   : layer.index,
                "comp"  : layer.containingComp.name,
                "issue" : "Invalid displacement map source"
            });
        }


        /**
         * Builds error string for project not saved
         *
         * @returns {errObj} - Error object
         */
        function notSaved () {
            return _err({
                "issue" : "Your project must be saved at least once before running this script."
            });
        }

        /**
         * Builds error string for no active comp
         *
         * @returns {errObj} - Error object
         */
        function noComp () {
            return _err({
                "issue" : "Please open or select a comp before running this script."
            });
        }

        return {
            "_formatErrorObj"          : _formatErrorObj,
            "dupeWarps"                : dupeWarps,
            "dupeGrads"                : dupeGrads,
            "dupeLayerName"            : dupeLayerName,
            "unsupportedFileSource"    : unsupportedFileSource,
            "unsupportedShape"         : unsupportedShape,
            "unsupportedBlendingMode"  : unsupportedBlendingMode,
            "unsupportedAlphaMatte"    : unsupportedAlphaMatte,
            "unsupportedLumaMatte"     : unsupportedLumaMatte,
            "unsupportedEffect"        : unsupportedEffect,
            "unsupportedTextOptions"   : unsupportedTextOptions,
            "unsupportedFont"          : unsupportedFont,
            "unsupportedJustification" : unsupportedJustification,
            "hasMask"                  : hasMask,
            "hasImgSequence"           : hasImgSequence,
            "startTimeBetweenFrames"   : startTimeBetweenFrames,
            "inPointBetweenFrames"     : inPointBetweenFrames,
            "imgFill"                  : imgFill,
            "imgInRoot"                : imgInRoot,
            "notBoxText"               : notBoxText,
            "groupOrType"              : groupOrType,
            "disabledEffect"           : disabledEffect,
            "unnamed"                  : unnamed,
            "layerStyles"              : layerStyles,
            "timeRemap"                : timeRemap,
            "dispMapInvalidSource"     : dispMapInvalidSource,
            "notSaved"                 : notSaved,
            "noComp"                   : noComp
        };
    })();

    /**
     * Contains error checking functions
     */
    var ErrorChecker = (function () { // eslint-disable-line no-unused-vars
        var errorObj = {
            "warnings" : aeq.arrayEx(),
            "errors"   : aeq.arrayEx()
        };

        var foundLayerNames = aeq.arrayEx();

        /**
         * Resets errorObj
         */
        function initErrorObj () {
            errorObj = {
                "warnings" : aeq.arrayEx(),
                "errors"   : aeq.arrayEx()
            };
        }

        /**
         * Resets foundLayerNames
         */
        function initFoundLayerNames () {
            foundLayerNames = aeq.arrayEx();
        }

        /**
         * Checks whether an effect is supported
         *
         * @param {String} effectName - Effect match name
         * @returns {Boolean}         - Whether effect is supported
         */
        function isSupportedEffect (effectName) {
            var allSupportedEffects = [];

            // Flatten all of the objects containing arrays of matchnames as it's easier to parse
            aeq.forEach(Config.globals.supportedEffects, function (supportedEffectGroupName) {
                var supportedEffectGroup = Config.globals.supportedEffects[supportedEffectGroupName];
                allSupportedEffects = allSupportedEffects.concat(supportedEffectGroup);
            });

            return aeq.arrayEx(allSupportedEffects).indexOf(effectName) > -1;
        }

        /**
         * Checks for errors, returns an object containing array of error and warning messages
         *
         * @param {Layer} layer                              - Layer to check
         * @param {Window} [pBar]                            - Progress bar
         * @returns {{errors: String[], warnings: String[]}} - Object of error and warning arrays
         */
        function findErrors (layer) {
            if (!Core.isValidLayerType(layer))
                return;

            // Get actual layer
            var layerName = layer.name;

            // Check duplicate names
            if (foundLayerNames.indexOf(layerName) > -1)
                errorObj.errors.push(Err.dupeLayerName(layer));
            else
                foundLayerNames.push(layerName);

            // Check non-standard names
            if (!Core.isValidLayer(layer))
                errorObj.warnings.push(Err.unnamed(layer));

            // Check content group & content type
            var markers = Markers.buildLayerMarkersObject(layer);
            if (!aeq.isNullOrUndefined(markers) &&
                !layer.isTrackMatte &&
                !layer.enabled && (
                    (markers.contentGroup && aeq.isNullOrUndefined(markers.contentType)) ||
                    (markers.contentType && aeq.isNullOrUndefined(markers.contentGroup))
                ))
                errorObj.warnings.push(Err.groupOrType(layer));

            // Check for having a source but filled
            var src = layer.source;
            if (src && src.file) {
                if (src.file.displayName.indexOf(".psd") > -1)
                    errorObj.errors.push(Err.unsupportedFileSource(layer, "psd"));

                if (src.file.displayName.indexOf(".ai") > -1)
                    errorObj.errors.push(Err.unsupportedFileSource(layer, "ai"));

                if (Core.getItemType(src) === "ItemType.IMAGE_SEQUENCE")
                    errorObj.warnings.push(Err.hasImgSequence(layer));

                if (layer("ADBE Effect Parade")("ADBE Fill"))
                    errorObj.errors.push(Err.imgFill(layer));

                if (!aeq.isNullOrUndefined(layer.startTime)) {
                    var nearestStartTime = Math.round(layer.startTime / layer.containingComp.frameDuration) * layer.containingComp.frameDuration;
                    if (layer.startTime.toFixed(7) !== nearestStartTime.toFixed(7))
                        errorObj.errors.push(Err.startTimeBetweenFrames(layer));
                }

                if (!aeq.isNullOrUndefined(layer.inPoint)) {
                    var nearestInPoint = Math.round(layer.inPoint / layer.containingComp.frameDuration) * layer.containingComp.frameDuration;
                    if (layer.inPoint.toFixed(7) !== nearestInPoint.toFixed(7))
                        errorObj.errors.push(Err.inPointBetweenFrames(layer));
                }

                if (aeq.isEmpty(layer.containingComp.usedIn) && !aeq.isNullOrUndefined(markers) && markers.isDynamic)
                    errorObj.warnings.push(Err.imgInRoot(layer));
            }

            // Check blending mode
            if (!Core.checkHasSupportedBlendMode(layer))
                errorObj.errors.push(Err.unsupportedBlendingMode(layer, Core.getBlendingModeName(layer)));

            // Check displacement
            var diplacementMapObject = Core.buildDisplacementMapObject(layer);
            if (!aeq.isNullOrUndefined(diplacementMapObject) && diplacementMapObject.src_video === "")
                errorObj.errors.push(Err.dispMapInvalidSource(layer));

            // Check text layer errors
            if (aeq.isTextLayer(layer)) {
                var textDocument = layer("ADBE Text Properties")("ADBE Text Document").value;

                if (!textDocument.boxText)
                    errorObj.errors.push(Err.notBoxText(layer));

                if (!Text.checkHasSupportedJustification(textDocument))
                    errorObj.errors.push(Err.unsupportedJustification(layer, Text.getTextJustificationName(textDocument)));

                var unsupportedTextOptions = Text.checkHasUnsupportedTextOptions(textDocument);
                if (!aeq.isEmpty(unsupportedTextOptions))
                    errorObj.errors.push(Err.unsupportedTextOptions(layer, String(unsupportedTextOptions)));
            }

            // Check time remap
            if (layer.timeRemapEnabled && layer.timeRemap.canSetExpression)
                errorObj.errors.push(Err.timeRemap(layer));

            // Check mask presence
            if (layer.mask && layer.mask.numProperties > 0)
                errorObj.errors.push(Err.hasMask(layer));

            // Check layer styles
            if (!aeq.isNullOrUndefined(layer("ADBE Layer Styles")) && layer("ADBE Layer Styles").canSetEnabled)
                errorObj.errors.push(Err.layerStyles(layer));

            // shape layer errors should be updated to only error on stars, etc
            /*if (layer instanceof ShapeLayer) {
                if (Core.findLayerPropByName(layer, "ADBE Vector Shape - Rect")) errorObj.errors.push(Err.unsupportedShape(layer));
            }*/

            // Check track matte mode
            if (layer.hasTrackMatte) {
                var matteLayer = layer.containingComp.layer(layer.index - 1);
                var matteSource = matteLayer.source;

                var trackMatteType = Core.getTrackMatteTypeName(layer);

                if (trackMatteType.indexOf("alpha") > -1) {
                    // if (aeq.isComp(matteSource))
                    //     errorObj.warnings.push(Err.unsupportedAlphaMatte(layer));
                    if (aeq.isComp(matteSource) ||
                        !(aeq.isShapeLayer(matteLayer) ||
                        matteSource.mainSource instanceof SolidSource ||
                        aeq.file.getExtension(matteSource.mainSource.file).toLowerCase() === "png"))
                        errorObj.warnings.push(Err.unsupportedAlphaMatte(layer));
                } else if (trackMatteType.indexOf("luma") > -1) {
                    if (aeq.isNullOrUndefined(matteSource) ||
                        aeq.isComp(matteSource) ||
                        (matteSource.mainSource instanceof FileSource && !(aeq.file.getExtension(matteSource.mainSource.file).toLowerCase() === "mov")))
                        errorObj.warnings.push(Err.unsupportedLumaMatte(layer));
                }
            }

            // Check for bad or duplicate effects
            var cpCnt = 0;
            var bwCnt = 0;
            var gCnt = 0;

            aeq.getEffects(layer).forEach(function (effect) {
                var effectName = effect.matchName;

                if (!effect.enabled)
                    errorObj.warnings.push(Err.disabledEffect(layer, effectName));

                if (!isSupportedEffect(effectName))
                    errorObj.warnings.push(Err.unsupportedEffect(layer, effectName));

                if (effectName === "ADBE Corner Pin")
                    cpCnt++;
                else if (effectName === "ADBE BEZMESH")
                    bwCnt++;
                else if (effectName === "DGE Gradient")
                    gCnt++;
            });

            // Throw errors for 'too many X' effects
            if (cpCnt > 1 && !bwCnt)
                errorObj.errors.push(Err.dupeWarps(layer, "Corner Pins"));
            else if (bwCnt > 1 && !cpCnt)
                errorObj.errors.push(Err.dupeWarps(layer, "Bezier Warps"));
            else if (cpCnt >= 1 && bwCnt >= 1)
                errorObj.errors.push(Err.dupeWarps(layer, "Corner Pins and Bezier Warps"));
            if (gCnt > 1)
                errorObj.errors.push(Err.dupeGrads(layer));

            return errorObj;
        }

        /**
         * Checks all layers in a given comp for errors
         * If no comp passed, uses activeComp
         *
         * @param {CompItem} [comp]    - Comp to check
         * @param {Boolean} [blocking] - Whether to create blocking error window
         * @returns {Boolean}          - Whether errors were found
         */
        function errorCheckAll (comp, blocking) {
            Log.trace("--> errorCheckAll");

            Config.globals.startTime = new Date().getTime();

            initErrorObj();
            initFoundLayerNames();

            comp = aeq.setDefault(comp, aeq.getActiveComp());

            var allLayers = Core.getLayersDeep(comp);

            var pBar = new PBarUI("Checking for Errors", allLayers.length);
            pBar.show();

            allLayers.forEach(function (layer) {
                findErrors(layer);
            });

            pBar.update();
            pBar.close();

            Config.globals.endTime = new Date().getTime();

            Log.trace("<-- errorCheckAll");
            return showErrors(blocking);
        }

        /**
         * Shows error dialog if errorObj is populated
         *
         * @param {Boolean} [blocking] - Whether to create blocking error window
         * @returns {Boolean}          - Whether there were errors
         */
        function showErrors (blocking) {
            if (!(aeq.isEmpty(errorObj.errors) && aeq.isEmpty(errorObj.warnings))) {
                new ErrorUI(errorObj, blocking).show();
                return true;
            }

            return false;
        }

        return {
            "initErrorObj"        : initErrorObj,
            "initFoundLayerNames" : initFoundLayerNames,
            "findErrors"          : findErrors,
            "errorCheckAll"       : errorCheckAll,
            "showErrors"          : showErrors
        };
    })();

    var Gradients = (function () { // eslint-disable-line no-unused-vars
        /**
         * Object containing Red Giant Gradient effect data
         *
         * @typedef {Object} RedGiantGradientObject
         * @property {String} gradient                         - "linear" or "radial"
         * @property {Number[]} gpos                           - Gradient stop positions array
         * @property {[Number, Number, Number, Number][]} gcol - Gradient stop colours (rgba)
         * @property {Number} [gradientAngle]                  - Gradient angle (for linear)
         * @property {[Number, Number]} [gradientCenter]       - Gradient center (for radial)
         * @property {Number} [gradientRadius]                 - Gradient radius (for radial)
         */

        /**
         * Object containing shape gradient fill data
         *
         * @typedef {Object} ShapeGradientFillObject
         * @property {String} gradient                           - "linear" or "radial"
         * @property {[Number, Number]} gradientStartPoint       - Gradient start point ([x, y])
         * @property {[Number, Number]} gradientEndPoint         - Gradient end point ([x, y])
         * @property {Number[]} positions                        - Gradient stop positions array
         * @property {[Number, Number, Number, Number][]} colors - Gradient stop colours (rgba)
         */

        /**
         * Returns array with [parentCompName, layerName, gradientFillName]
         *
         * @param {Layer} layer                - Layer to check
         * @returns {[String, String, String]} - Shape gradient path string array
         */
        function getShapeGradPath (layer) {
            Log.trace("--> getShapeGradPath: '" + layer.name + "'...");
            var gradProp = Core.findLayerPropByName(layer, "ADBE Vector Graphic - G-Fill");

            if (aeq.isNullOrUndefined(gradProp)) {
                Log.trace("<-- getShapeGradPath: '" + layer.name + "' has no gradient fill");
                return null;
            }

            Log.trace("<-- getShapeGradPath: returning gradient path for layer '" + layer.name + "'");
            return [layer.containingComp.name, layer.name, gradProp.name];
        }

        /**
         * Requires the effect "Gradient" from the effect library "Red Giant Text Anarchy"
         *
         * @param {AVLayer} layer            - Layer
         * @returns {RedGiantGradientObject} - Gradient properties object
         */
        function buildRedGiantGradientDataObject (layer) {
            Log.trace("--> buildRedGiantGradientDataObject: " + layer.name);

            var i;
            var il;
            var gradFx = layer("ADBE Effect Parade").property("DGE Gradient");

            if (aeq.isNullOrUndefined(gradFx) || !gradFx.enabled)
                return;

            var redGiantGradientDataObject = {};

            // Build stops?
            var posUnsorted = [];
            var gPos = [];
            var gCol = [];
            var maxProps = 25;

            // checks to see if color stop is used (color stops are every fourth property)
            for (i = 2, il = maxProps; i <= il; i += 4) {
                if (gradFx(i).value) {
                    var rgb = Util.colourToDec(gradFx(i + 2).value);
                    var pos = Util.roundVal(gradFx(i + 1).value);
                    posUnsorted.push(pos);
                    gPos.push(pos);
                    gCol.push([
                        Util.normalizedToDec(1 - gradFx(i + 3).value),
                        rgb[0],
                        rgb[1],
                        rgb[2]
                    ]);
                }
            }

            gPos.sort(function (a, b) { return a - b; });

            var colSort = [];
            for (i = 0, il = gPos.length; i < il; i++)
                colSort.push(gCol[Util.indexOf(posUnsorted, gPos[i])]);

            var minPos = Math.min.apply(null, gPos);
            var maxPos = Math.max.apply(null, gPos);

            // check if there is a value at 0 and at 1, add them if they don't exist
            if (minPos > 0) {
                colSort.unshift(colSort[0]);
                gPos.unshift(0);
            }
            if (maxPos < 1) {
                gPos.push(1);
                colSort.push(colSort[colSort.length - 1]);
            }

            redGiantGradientDataObject.gradientPositions = gPos;
            redGiantGradientDataObject.gradientColors = colSort;

            // Gradient type
            var fxGradType = gradFx.property("DGE Gradient-0028").value;
            if (fxGradType === 1) {
                redGiantGradientDataObject.gradient = "linear";
                redGiantGradientDataObject.gradientAngle = Util.roundVal(gradFx.property("DGE Gradient-0029").value);
            } else if (fxGradType === 2) {
                redGiantGradientDataObject.gradient = "radial";
                redGiantGradientDataObject.gradientCenter = Util.roundVal(gradFx.property("DGE Gradient-0030").value);

                // set radius
                if (gradFx.property("DGE Gradient-0038").value)
                    redGiantGradientDataObject.gradientRadius = Util.roundVal(gradFx.property("DGE Gradient-0037").value);
                else
                    redGiantGradientDataObject.gradientRadius = Math.max(layer.width, layer.height) * 0.5;
            }

            Log.trace("<-- buildRedGiantGradientDataObject: " + layer.name);
            return redGiantGradientDataObject;
        }

        /**
         * generates and formats gradient object from Bodymovin to work with Mod JSON spec
         *
         * @param {Layer} layer               - Layer
         * @returns {ShapeGradientFillObject} - Shape gradient fill object
         */
        function buildShapeGradientFillObject (layer) {
            Log.trace("--> buildShapeGradientFillObject: " + layer.name);

            /**
             * Finds nearest opacity knot indices closest to target value
             *
             * @param {Number} value                                     - Value to search around for
             * @param {Number[]} opacityKnotPositions                    - Array of knot positions
             * @returns {{lastKnotIndex: Number, nextKnotIndex: Number}} - Object with container knot indices
             */
            function findNearestOpacityKnotIndices (value, opacityKnotPositions) {
                var nearestOpacityKnotIndices = {
                    "lastKnotIndex" : 0,
                    "nextKnotIndex" : opacityKnotPositions.length - 1
                };

                var currentLastDiff = 99999999999;
                var currentNextDiff = 99999999999;
                var thisDiff;

                opacityKnotPositions.forEach(function (opacityKnot, i) {
                    if (opacityKnot < value) {
                        // we're looking for the key PRIOR
                        thisDiff = value - opacityKnot;
                        if (thisDiff < currentLastDiff) {
                            nearestOpacityKnotIndices.lastKnotIndex = i;
                            currentLastDiff = thisDiff;
                        }
                    } else {
                        thisDiff = opacityKnot - value;
                        if (thisDiff < currentNextDiff) {
                            nearestOpacityKnotIndices.nextKnotIndex = i;
                            currentNextDiff = thisDiff;
                        }
                    }
                });

                return nearestOpacityKnotIndices;
            }

            var propPath = getShapeGradPath(layer);
            if (propPath === null)
                return null;
            var grad = bm_ProjectHelper.getGradientData(propPath, 1); // eslint-disable-line camelcase

            var colors = aeq.arrayEx();
            var colourKnotPositions = aeq.arrayEx();
            var opacityKnotPositions = aeq.arrayEx();

            var gradColours = grad.c;
            var gradOpacities = grad.o;
            var i;
            var il;

            for (i = 0, il = gradOpacities.length; i < il; i++)
                opacityKnotPositions.push(gradOpacities[i][0]);

            for (i = 0, il = gradColours.length; i < il; i++) {
                var colourKnot = gradColours[i];
                var knotPosition = colourKnot[0];

                var knotOpacity;
                var matchingKnotIndex = Util.indexOf(opacityKnotPositions, knotPosition);

                // No direct opacity knot matching this one -- let's try to find it.
                if (matchingKnotIndex === -1) {
                    if (knotPosition < gradOpacities[0][0])
                        // If colour position is BEFORE first opacity, use first opacity
                        knotOpacity = gradOpacities[0][1];
                    else if (knotPosition > gradOpacities[gradOpacities.length - 1][0])
                        // If colour position is AFTER last opacity, use last opacity
                        knotOpacity = gradOpacities[gradOpacities.length - 1][1];
                    else {
                        // If colour position is in the middle... dunno
                        var nearestIndices = findNearestOpacityKnotIndices(knotPosition, opacityKnotPositions);
                        var lastKnotPosition = gradOpacities[nearestIndices.lastKnotIndex][0];
                        var nextKnotPosition = gradOpacities[nearestIndices.nextKnotIndex][0];

                        var lastKnotValue = gradOpacities[nearestIndices.lastKnotIndex][1];
                        var nextKnotValue = gradOpacities[nearestIndices.nextKnotIndex][1];

                        knotOpacity = Util.fullLerp(knotPosition, lastKnotPosition, nextKnotPosition, lastKnotValue, nextKnotValue);
                    }
                } else
                    knotOpacity = gradOpacities[matchingKnotIndex][1];

                colors.push([
                    Util.normalizedToDec(knotOpacity),
                    Util.normalizedToDec(colourKnot[1]),
                    Util.normalizedToDec(colourKnot[2]),
                    Util.normalizedToDec(colourKnot[3])
                ]);

                colourKnotPositions.push(knotPosition);
            }

            var minPos = colourKnotPositions[0];
            var maxPos = colourKnotPositions[colourKnotPositions.length - 1];

            // check if there is a value at 0 and at 1, add them if they don't exist
            if (minPos > 0) {
                colors.unshift(colors[0]);
                colourKnotPositions.unshift(0);
            }
            if (maxPos < 1) {
                colourKnotPositions.push(1);
                colors.push(colors[colors.length - 1]);
            }

            var GradTypes = {
                "linear" : 1,
                "radial" : 2
            };
            var gradTypeProp = Core.findLayerPropByName(layer, "ADBE Vector Grad Type");

            Log.trace("<-- buildShapeGradientFillObject: " + layer.name);

            return {
                "gradientPositions"  : colourKnotPositions,
                "gradientColors"     : colors,
                "gradient"           : gradTypeProp.value === GradTypes.linear ? "linear" : "radial",
                "gradientStartPoint" : Core.findLayerPropByName(layer, "ADBE Vector Grad Start Pt").value,
                "gradientEndPoint"   : Core.findLayerPropByName(layer, "ADBE Vector Grad End Pt").value
            };
        }

        return {
            "buildRedGiantGradientDataObject" : buildRedGiantGradientDataObject,
            "buildShapeGradientFillObject"    : buildShapeGradientFillObject
        };
    })();

    /**
     * NOTE: this functionality requires asynchrony or it will crash the script (or just not work)
     * NOTE: probably means it needs to be CEP
     */
    var LUTs = (function () { // eslint-disable-line no-unused-vars
        /**
         * Finds .lut files in folder relative to current project file
         *
         * @param {Project} proj    - Project to check
         * @returns {File[] | null} - Array of LUT files, or null
         */
        function findLUTs (proj) {
            Log.trace("--> findLUTs: " + proj.file.displayName);
            var folderPath = proj.file.parent.parent.parent.fsName + "/Render/JSON/LUT";
            var folderObj = new Folder(folderPath);

            if (folderObj.exists) {
                Log.trace("<-- findLUTs: LUT File array");
                return folderObj.getFiles("*.lut");
            }

            Log.trace("<-- findLUTs: Can't find LUTs");
            return null;
        }

        /**
         * Object containing LUT Data
         *
         * @typedef {Object} LUTDataObject
         * @property {String} type  - LUT type
         * @property {Number[]} red   - red values
         * @property {Number[]} green - green values
         * @property {Number[]} blue  - blue values
         */

        /**
         * Builds LUT object, according to schema
         *
         * @param {Layer} layer     - Layer to build obj of
         * @returns {LUTDataObject} - LUT data object
         */
        function buildLUTObject (layer) {
            Log.trace("--> buildLUTObject: " + lutFile.displayName);

            var luts = findLUTs(app.project);
            var lutFile = luts.find(function (lut) {
                return layer.name === lut.name;
            });

            var lutObject = {
                "type"  : "MAP",
                "red"   : [],
                "green" : [],
                "blue"  : []
            };

            var lutSize;
            var beginVals;
            var count = 0;

            if (lutFile.exists) {
                lutFile.open("r");

                while (!lutFile.eof) {
                    count++;

                    var ln = lutFile.readln();

                    if (ln.match("LUT:")) {
                        var tmpA = ln.split(" ");
                        lutSize = parseInt(tmpA[tmpA.length - 1]);
                    }

                    var num = parseInt(ln);

                    if (lutSize && !isNaN(num)) {
                        if (!beginVals)
                            beginVals = count;

                        if (count <= (lutSize - 1 + beginVals))
                            lutObject.red.push(num);
                        else if (count > (lutSize - 1 + beginVals) && count <= (lutSize * 2 - 1 + beginVals))
                            lutObject.green.push(num);
                        else if (count > (lutSize * 2 - 1 + beginVals))
                            lutObject.blue.push(num);
                    }
                }

                lutFile.close();
            }

            Log.trace("<-- buildLUTObject: " + lutFile.displayName);
            return lutObject;
        }

        return {
            "buildLUTObject" : buildLUTObject
        };
    })();

    var Markers = (function () { // eslint-disable-line no-unused-vars
        /**
         * Object containing layer marker data
         * @typedef {Object} LayerMarkerDataObject
         * @property {Number} [textVAlign]   - Vertical alignment amount
         * @property {Boolean} [isDynamic]   - Whether property is dynamic
         * @property {Number} [contentGroup] - Content group #
         * @property {String} [contentType]  - Content type tag
         */

        /**
         * Builds an array of marker comments for a given layer
         *
         * @param {Layer} layer - Layer to build marker comments array for
         * @returns {String[]}  - Array of marker comments
         */
        function buildLayerMarkerCommentArray (layer) {
            Log.trace("--> buildLayerMarkerCommentArray: '" + layer.name + "'...");

            if (!aeq.isLayer(layer)) {
                Log.trace("buildLayerMarkerCommentArray: '" + layer.name + "' is not a layer!");
                return;
            }

            var markerCommentArray = aeq.arrayEx();
            var markerGroup = aeq.Property(aeq.getMarkerGroup(layer));

            markerGroup.forEachKey(function (marker) {
                var comment = marker.value().comment;
                if (comment !== "")
                    markerCommentArray.push(comment);
            });

            if (aeq.isEmpty(markerCommentArray)) {
                Log.trace("<-- buildLayerMarkerCommentArray: '" + layer.name + "' has no markers with comments!");
                return;
            }

            Log.trace("<-- buildLayerMarkerCommentArray: '" + layer.name + "'");
            return markerCommentArray;
        }

        /**
         * Builds layer markers object for a layer
         *
         * @param {Layer} layer             - Layer to build object from
         * @returns {LayerMarkerDataObject} - Layer's marker data
         */
        function buildLayerMarkersObject (layer) {
            Log.trace("--> buildLayerMarkersObject: '" + layer.name + "'...");

            var markerCommentArray = buildLayerMarkerCommentArray(layer);

            if (aeq.isNullOrUndefined(markerCommentArray)) {
                Log.trace("<-- buildLayerMarkersObject: '" + layer.name + "'");
                return;
            }

            var layerMarkersObject = {};

            markerCommentArray.forEach(function (markerComment) {
                if (markerComment.indexOf("textVAlign") > -1) {
                    var vAlignSplitComment = markerComment.split("=");
                    layerMarkersObject.textVAlign = parseFloat(vAlignSplitComment[1]);
                } else if (markerComment === "dynamic")
                    layerMarkersObject.isDynamic = true;
                else if (!isNaN(parseInt(markerComment)))
                    layerMarkersObject.contentGroup = parseInt(markerComment);
                else
                    layerMarkersObject.contentType = markerComment;
            });

            if (Util.getObjectSize(layerMarkersObject) === 0) {
                Log.trace("<-- buildLayerMarkersObject: Couldn't parse markers on '" + layer.name + "'");
                return;
            }

            Log.trace("<-- buildLayerMarkersObject: '" + layer.name + "'");
            return layerMarkersObject;
        }

        /**
         * Finds contentGroup, contentType, and isDynamic properties on a specific layerobject,
         * passes that data to all child layers
         *
         * @param {Object} layerObj    - One specific layerObject from buildAllLayersObj
         * @param {Object} allLayerObj - Object of ALL layers from buildAllLayersObj
         */
        function sendMarkerObjectToPrecompLayers (layerObj, allLayerObj) {
            Log.trace("--> sendMarkerObjectToPrecompLayers");

            if (!layerObj.layerRoto.hasOwnProperty("children") || aeq.isNullOrUndefined(layerObj.layerRoto.children)) {
                Log.trace("<-- sendMarkerObjectToPrecompLayers: No children");
                return;
            }

            // Right now, we're ONLY pushing marker data down if parent has either contentGroup or contentType
            if (!(layerObj.layerContent.hasOwnProperty("contentGroup") || layerObj.layerContent.hasOwnProperty("contentType"))) {
                Log.trace("<-- sendMarkerObjectToPrecompLayers: No contentGroup or contentType");
                return;
            }

            layerObj.layerRoto.children.forEach(function (childName) {
                var childLayerObject = allLayerObj[childName];

                if (aeq.isNullOrUndefined(childLayerObject))
                    return;

                childLayerObject.layerContent.isDynamic = aeq.setDefault(childLayerObject.layerContent.isDynamic, layerObj.layerContent.isDynamic);
                childLayerObject.layerContent.contentGroup = aeq.setDefault(childLayerObject.layerContent.contentGroup, layerObj.layerContent.contentGroup);
                childLayerObject.layerContent.contentType = aeq.setDefault(childLayerObject.layerContent.contentType, layerObj.layerContent.contentType);
                childLayerObject.layerRoto.contentType = aeq.setDefault(childLayerObject.layerRoto.contentType, layerObj.layerContent.contentType);

                if (childLayerObject.layerRoto.hasOwnProperty("children"))
                    sendMarkerObjectToPrecompLayers(childLayerObject, allLayerObj);
            });

            delete layerObj.layerContent.isDynamic;
            delete layerObj.layerContent.contentGroup;
            delete layerObj.layerContent.contentType;

            Log.trace("<-- sendMarkerObjectToPrecompLayers");
        }

        return {
            "buildLayerMarkersObject"         : buildLayerMarkersObject,
            "sendMarkerObjectToPrecompLayers" : sendMarkerObjectToPrecompLayers
        };
    })();

    var Text = (function () { // eslint-disable-line no-unused-vars
        /**
         * Object containing text box bounds data
         *
         * @typedef {Object} TextBoxBoundsObject
         * @property {[Number, Number]} size - Size of textbox, scaled to max possible size
         * @property {Number} left           - Left bound
         * @property {Number} top            - Top bound
         * @property {Number} width          - Width of box
         * @property {Number} height         - Height of box
         */

        /**
         * Object containing text style data
         *
         * @typedef {Object} TextStyleObject
         * @property {Boolean} textItalic    - Whether text is italic
         * @property {String} textWeight     - Style
         */

        /**
         * Object containing text drop shadow data
         *
         * @typedef {Object} TextDropShadowObject
         * @property {Number[]} textShadColor   - Drop shadow colour (0-255)[]
         * @property {Number} textShadOpacity   - Drop shadow opacity (0-100)
         * @property {Number} textShadDirection - Drop shadow direction (0-360)
         * @property {Number} textShadDistance  - Drop shadow distance (px)
         * @property {Number} textShadBlur      - Drop shadow blur (px)
         */

        /**
         * Object containing text layer data
         *
         * @typedef {Object} TextLayerObject
         * @property {String} text         - Text content
         * @property {String} textTypeface - Text typeface name
         * @property {Number} textSize     - Text size (with scale offset)
         * @property {Number[]} textColor  - Text colour (0-255)[]
         * @property {Number} textAlign    - Text justification value (0, 0.5, 1)
         * @property {Number} textTracking - Text tracking value (px)
         * @property {Number} textVAlign   - Text vAlign value (px)
         * @property {Number} textLeading  - Text leading value (px)
         *
         * // text style stuff
         * @property {Boolean} textItalic  - Whether text is italic
         * @property {String} textWeight   - Style
         *
         * // drop shad stuff
         * @property {Number[]} [textShadColor]   - Drop shadow colour (0-255)[]
         * @property {Number} [textShadOpacity]   - Drop shadow opacity (0-100)
         * @property {Number} [textShadDirection] - Drop shadow direction (0-360)
         * @property {Number} [textShadDistance]  - Drop shadow distance (px)
         * @property {Number} [textShadBlur]      - Drop shadow blur (px)
         */

        /**
         * Check whether textDocument is using an unsupported option
         * (faux-bold, super- and sub-script, allcaps, smallcaps)
         *
         * @param {TextDocument} textDocument TextDocument property from a text layer
         * @returns {String[]} Array of all bad text options
         */
        function checkHasUnsupportedTextOptions (textDocument) {
            Log.trace("--> checkHasUnsupportedTextOptions");

            var badOptions = aeq.arrayEx(Config.globals.unsupportedTextOptions);

            Log.trace("<-- checkHasUnsupportedTextOptions");
            return badOptions.filter(function (badOption) {
                return textDocument[badOption];
            });
        }

        /**
         * Check whether textDocuent is using a supported justification
         *
         * @param {TextDocument} textDoc - TextDocument property from a text layer
         * @returns {Boolean}            - False if unsupported mode found
         */
        function checkHasSupportedJustification (textDoc) {
            return Config.globals.supportedTextJustifications.hasOwnProperty(getTextJustificationName(textDoc));
        }


        /**
         * Finds justification value for a textDocument
         *
         * @param {TextDocument} textDoc - TextDocument property from a text layer
         * @returns {String}             - Text document's justification value
         */
        function getTextJustificationName (textDoc) {
            for (var JustificationValue in ParagraphJustification) {
                if (textDoc.justification === ParagraphJustification[JustificationValue])
                    return JustificationValue.toLowerCase();
            }
        }

        /**
         * Generates bounds object for text layers of boxText
         *
         * @param {TextLayer} layer            - Layer to find bounds of
         * @param {Number} scaleOffset         - Scale offset value
         * @returns {Null|TextBoxBoundsObject} - TextBox bounds object
         */
        function buildTextBoxBoundsObject (layer, scaleOffset) {
            Log.trace("--> buildTextBoxBoundsObject: layer '" + layer.name + "'...");

            var textDoc = layer("ADBE Text Properties")("ADBE Text Document").value;

            if (!textDoc.boxText) {
                Log.trace("<-- buildTextBoxBoundsObject: layer '" + layer.name + "' isn't boxText");
                return null;
            }

            Log.trace("<-- buildTextBoxBoundsObject: layer '" + layer.name + "'...");
            return {
                "size"   : Util.roundVal(textDoc.boxTextSize * scaleOffset),
                "left"   : Util.roundVal(textDoc.boxTextPos[0]),
                "top"    : Util.roundVal(textDoc.boxTextPos[1]),
                "width"  : Util.roundVal(textDoc.boxTextSize[0]),
                "height" : Util.roundVal(textDoc.boxTextSize[1])
            };
        }

        /**
         * Generates style object from layer's textDocument
         *
         * @param {TextLayer} layer   - Layer to build styleObj from
         * @returns {TextStyleObject} - Text style object
         */
        function buildTextStyleObject (layer) {
            Log.trace("--> buildTextStyleObject");
            var textDoc = layer("ADBE Text Properties")("ADBE Text Document").value;

            var textStyle = {
                "textItalic" : false
            };

            var style;
            var weights = ["thin", "ultralight", "light", "book", "medium", "semibold", "bold", "ultrabold", "heavy", "ultraheavy"];

            try {
                // special case for font named "noyh a text"
                if (textDoc.fontStyle === "2")
                    style = "book";
                else
                    // convert font style to all lowercase, no spaces or numbers
                    style = textDoc.fontStyle.toLowerCase().match(new RegExp(/[a-zA-Z]+/g)).join("");
            } catch (e) {
                var msg = Err._formatErrorObj(Err.unsupportedFont(layer));
                alert(msg);
                return;
            }

            if (style.match("italic") || style.match("oblique") || textDoc.fauxItalic) {
                style = style.replace("italic", "").replace("oblique", "");
                textStyle.textItalic = true;
            }

            if (style.match("hairline"))
                style = "thin";
            else if (style.match("extralight"))
                style = "ultralight";
            else if (style.match("demibold"))
                style = "semibold";
            else if (style.match("extrabold"))
                style = "ultrabold";
            else if (style.match("black"))
                style = "heavy";
            else if (style.match("regular") || style.match("roman"))
                style = "book";

            textStyle.textWeight = Util.findInArray(weights, style);

            Log.trace("<-- buildTextStyleObject");
            return textStyle;
        }

        /**
         * Generates a text shadow object for specified layer; if no effect present, returns empty object
         *
         * @param {Layer} layer Layer to parse
         * @returns {{} | TextDropShadowObject} Empty object or TextDropShadowObject
         */
        function buildTextDropShadowObject (layer) {
            Log.trace("--> buildTextDropShadowObject: " + layer.name);
            var effectGroup = layer.property("ADBE Effect Parade");
            var effect = effectGroup("ADBE Drop Shadow");

            if (!(effect && effect.enabled)) {
                Log.trace("<-- buildTextDropShadowObject: No shad, or not enabled on " + layer.name);
                return {};
            }

            Log.trace("<-- buildTextDropShadowObject: " + layer.name);
            return {
                "textShadColor"     : Util.colourToDec(effect.property("ADBE Drop Shadow-0001").value), // [0.0-1.0[]] => [0-255[]]
                "textShadOpacity"   : 100 * Util.roundVal(effect.property("ADBE Drop Shadow-0002").value / 255), // for 8bpc
                "textShadDirection" : Util.roundVal(effect.property("ADBE Drop Shadow-0003").value) % 360, // 0-360
                "textShadDistance"  : Util.roundVal(effect.property("ADBE Drop Shadow-0004").value), // px
                "textShadBlur"      : Util.roundVal(effect.property("ADBE Drop Shadow-0005").value) // px
            };
        }

        /**
         * Main text layer serialization function; converts text layer to object
         *
         * @param {TextLayer} layer    - Layer to build obj for
         * @param {Number} scaleOffset - Scale offset value
         * @returns {TextLayerObject}  - Text object
         */
        function buildTextLayerObject (layer, scaleOffset) {
            if (!aeq.isTextLayer(layer))
                return;

            Log.trace("--> buildTextLayerObject: " + layer.name);

            var fColor;
            var tvaVal;
            var textLeading;
            var textDocument = layer("ADBE Text Properties")("ADBE Text Document").value;
            var oldTxt = textDocument.text; //  may need error as well
            var newTxt = oldTxt.replace(/\r/g, " ").replace(/\n/g, " ");

            // Check for Fill effect to override colour; otherwise set to text colour
            var lyrFx = layer("ADBE Effect Parade");
            if (lyrFx("ADBE Fill") && lyrFx("ADBE Fill").enabled)
                fColor = lyrFx("ADBE Fill")("ADBE Fill-0002").value;
            else
                fColor = textDocument.fillColor;

            // If allCaps flag, force text to upper case
            if (textDocument.allCaps)
                newTxt = newTxt.toUpperCase();

            // Create markers to check vertical align value
            // If no value, set to 0
            var lyrMarks = Markers.buildLayerMarkersObject(layer);
            if (lyrMarks && lyrMarks.textVAlign)
                tvaVal = lyrMarks.textVAlign;
            else
                tvaVal = 0; // otherwise defaults to 0

            // Cheat to ensure there's a 2nd line to calculate leading
            textDocument.text = newTxt + "\nQ\n";
            if (textDocument.baselineLocs[5] && textDocument.baselineLocs[5] < 5000)
                textLeading = Util.roundVal(textDocument.baselineLocs[5] - textDocument.baselineLocs[1]);
            textDocument.text = oldTxt; // sets text back to what it was

            var textObject = {
                "text"         : newTxt,
                "textTypeface" : textDocument.fontFamily,
                "textSize"     : Util.roundVal(textDocument.fontSize * scaleOffset, 0),
                "textColor"    : Util.colourToDec(fColor),
                "textAlign"    : Config.globals.supportedTextJustifications[getTextJustificationName(textDocument)],
                "textTracking" : textDocument.tracking,
                "textVAlign"   : tvaVal,
                "textLeading"  : textLeading
            };

            var textStyle = buildTextStyleObject(layer);
            // var textShadow = buildTextDropShadowObject(layer);

            textObject = Util.mergeObjs(textStyle, textObject);
            // textObject = Util.mergeObjs(textShadow, textObject);

            Log.trace("<-- buildTextLayerObject: " + layer.name);
            return textObject;
        }

        return {
            "checkHasUnsupportedTextOptions" : checkHasUnsupportedTextOptions,
            "checkHasSupportedJustification" : checkHasSupportedJustification,
            "getTextJustificationName"       : getTextJustificationName,
            "buildTextBoxBoundsObject"       : buildTextBoxBoundsObject,
            "buildTextLayerObject"           : buildTextLayerObject
        };
    })();

    var Validator = (function () { // eslint-disable-line no-unused-vars
        /**
         * Starts HTML validator for JSON files,
         */
        function startValidator () {
            Log.trace("--> startValidator");

            var validatorPath = aeq.file.joinPath(Config.globals.validatorPath, "Validator", "validator.html");

            aeq.getFileObject(validatorPath).execute();

            Log.trace("<-- startValidator");
        }

        return {
            "startValidator" : startValidator
        };
    })();

    /**
     * Main object for the script
     *
     * @param {any} thisObj `this` object for the current context
     */
    function Main (thisObj) {
        this.init();
        this.mainUi = new MainUI(thisObj);

        this.mainUi.onOptionsClick = Util.bind(this.onOptionsClick, this);

        this.mainUi.onExportContentClick = Util.bind(this.onExportContentClick, this);
        this.mainUi.onExportAllClick = Util.bind(this.onExportAllClick, this);

        this.mainUi.onTestExportClick = Util.bind(this.onTestExportClick, this);
        this.mainUi.onUniquifyClick = Util.bind(this.onUniquifyClick, this);
        this.mainUi.onValidateClick = Util.bind(this.onValidateClick, this);
    }

    Main.prototype = {
        /**
         * Initializes script if needed
         */
        "init" : function () {
            Log.initLevel();
        },

        /**
         * Shows the UI
         */
        "run" : function () {
            this.mainUi.show();
            return;
        },

        /**
         * Actions for the Options button
         */
        "onOptionsClick" : function () {
            Log.trace("--> onOptionsClick");
            new OptionUI().show();
            Log.trace("<-- onOptionsClick");
        },

        /**
         * Actions for the Export Content button
         */
        "onExportContentClick" : function () {
            Log.trace("--> onExportContentClick");
            app.beginUndoGroup(Config.name + ": Export Content");
            DCtoJSON("content");
            app.endUndoGroup();
            Log.info("onExportContentClick: Data assembly completed in " + String(Config.globals.endTime - Config.globals.startTime) + "ms");
            Log.trace("<-- onExportContentClick");
        },

        /**
         * Actions for the Export All button
         */
        "onExportAllClick" : function () {
            Log.trace("--> onExportAllClick");
            app.beginUndoGroup(Config.name + ": Export All");
            DCtoJSON("all");
            app.endUndoGroup();
            Log.info("onExportAllClick: Data assembly completed in " + String(Config.globals.endTime - Config.globals.startTime) + "ms");
            Log.trace("<-- onExportAllClick");
        },

        /**
         * Actions for the Test Export button
         */
        "onTestExportClick" : function () {
            Log.trace("--> onTestExportClick");
            app.beginUndoGroup(Config.name + ": Test Export");

            var foundErrors = ErrorChecker.errorCheckAll();

            if (!foundErrors)
                alert("No errors found!");

            app.endUndoGroup();
            Log.info("onTestExportClick: Completed in " + String(Config.globals.endTime - Config.globals.startTime) + "ms");
            Log.trace("<-- onTestExportClick");
        },

        /**
         * Actions for the Test Export button
         */
        "onUniquifyClick" : function () {
            Log.trace("--> onUniquifyClick");
            app.beginUndoGroup(Config.name + ": Uniquify Comp");

            var comp = aeq.activeComp();

            if (aeq.isNullOrUndefined(comp)) {
                var msg = Err._formatErrorObj(Err.noComp());
                alert(msg);
                return;
            }

            var newComp = Core.recursiveMakeUnique(comp);
            newComp.parentFolder = comp.parentFolder;

            var uniqueFolder = aeq.project.findFolder(Config.globals.uniqueFolderName);
            if (uniqueFolder.numItems === 0)
                uniqueFolder.remove();

            newComp.openInViewer();

            app.endUndoGroup();
            Log.trace("<-- onUniquifyClick");
        },

        /**
         * Actions for the Validate button
         */
        "onValidateClick" : function () {
            Log.trace("--> onValidateClick");
            app.beginUndoGroup(Config.name + ": Validate MOV");
            Validator.startValidator();
            app.endUndoGroup();
            Log.trace("<-- onValidateClick");
        }
    };

    var dcMain = new Main(thisObj);
		return {dcMain :dcMain}

	})(this);
