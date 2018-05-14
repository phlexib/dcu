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
