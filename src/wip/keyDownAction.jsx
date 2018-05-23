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

label.addEventListener("keydown", handleArrowKey);

  function setTimeout() {
    if (!$._timers) $._timers = {}
    function guid() {
      var s4 = function() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
      return s4() + s4() + s4() + s4()  + s4()  + s4() + s4() + s4();
    }
    return function(func,millis) {
      var id = guid();
      $._timers[id] = func;
      return app.scheduleTask('$._timers["' + id + '"]();',millis,false);
    };
  }

  function handleArrowKey(key){
    $.writeln(key.keyName)
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
  }
 function debouncedKey(key){
   setTimeout(handleArrowKey(key),2000)
 }

win.show()