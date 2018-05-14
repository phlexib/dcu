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
