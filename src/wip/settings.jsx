function saveScriptSettings() {
  var sectionName = "DCTOJSON-UI";
  app.settings.saveSetting(sectionName, "toto", "Right");
  //  for( var s = 0 ; s <MARKERS_DEFAULTS.length; s++){
  //    var value = grpMarkersGrp.children[0].children[2].children[0].value;
  //   app.settings.saveSetting(sectionName, MARKERS_DEFAULTS[0], value);
  //  }
}
saveScriptSettings();

alert(app.settings.haveSetting("DCTOJSON-UI", "Object"));
alert(app.settings.getSetting("DCTOJSON-UI", "toto"));