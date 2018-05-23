var win = buildUI(this);
function buildUI(thisObj) {
  var pal = thisObj instanceof Panel? thisObj : new Window("palette", "" , undefined, {resizeable: true });
  return pal;
}

label = win.add("edittext", [30, 10, 220, 30], "some_Text", {
    readonly: 0,
    noecho: 0,
    borderless: 0,
    multiline: 0,
    enterKeySignalsOnChange: 0,
    wantReturn: false
  });

label.addEventListener("keydown", function(key) {
  $.writeln(key.keyName);
  switch (key.keyName) {
  case "Up":
      key.currentTarget.text = "Up";
      break;

      case "Down":
      key.currentTarget.text = "Down";
        break;

      default:

        break;

    }
  });

win.show()