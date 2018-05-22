var w = new Window("dialog");
var mkrGrp = win.add("group", [0, 120, 385, 180], "Group Markers", {
  orientation: "column",
  alignment: "fill"
});
var mkrLabel = mkrGrp.add("edittext", [10, 10, 225, 30], "1", {
  readonly: 0,
  noecho: 0,
  borderless: 0,
  multiline: 0,
  enterKeySignalsOnChange: 0,
  wantReturn: true
});


function handle_key(key, control) {
  
  switch (key.keyName) {
    case "Up":
      control.text = String(Number(control.text) + 1);
      break;
    case "Down":
      control.text = String(Number(control.text) - 1);
  }
} // handle_key
mkrLabel.addEventListener("keydown", function(k) {
  handle_key(k, this);
});

function changeSubGroup(currentText, operator) {
  var hasSubGroup = currentText.split("#");
  var labelText;
  if (hasSubGroup.length > 1) {
    var curSubGroup = parseInt(hasSubGroup[1]);
    switch (operator) {
      case "+":
        labelText = hasSubGroup[0] + "#" + (curSubGroup + 1);
        break;
      case "-":
        if (curSubGroup > 1) {
          labelText = hasSubGroup[0] + "#" + (curSubGroup - 1);
        } else {
          labelText = hasSubGroup[0];
        }
        break;
      default:
        labelText = hasSubGroup[0] + "#" + (curSubGroup + 1);
        break;
    }
  } else {
    labelText = currentText + "#1";
  }
  return labelText;
}
w.show();
