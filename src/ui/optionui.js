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
