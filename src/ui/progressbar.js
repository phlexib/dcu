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
