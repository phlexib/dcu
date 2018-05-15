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
