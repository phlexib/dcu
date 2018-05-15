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
