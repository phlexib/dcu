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
