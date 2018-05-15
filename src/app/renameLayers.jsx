// rename layers to mathc shot

var RenameLayers = (function() {

  var layerNamesLog = [];

  function renameLayerToShot(comp) {
    app.beginUndoGroup("rename Layers");
    var projectTokens = app.project.file.displayName.split("_");
    var sName = projectTokens[0]+"_"+projectTokens[1];

    for (var l = comp.numLayers; l > 0; l--) {
      var layerName = comp.layer(l).name;
      var newLayerName = layerName.split("-")[0]+"-"+sName;
      
      if (comp.layer(l).nullLayer === true){
      } else if(layerName.split("-")[1] != sName){
        comp.layer(l).name = newLayerName;
        var logObject = {
          layerIndex : comp.layer(l).index,
          comp : comp.id,
          compName : comp.name
        };

        layerNamesLog.push(logObject);
        
        if(comp.layer(l).source instanceof CompItem){
          comp.layer(l).source.name = newLayerName;
          renameLayerToShot(sName,comp.layer(l).source);
        }
      }
    }
    
    app.endUndoGroup();
  };

  return {
    renameLayerToShot: renameLayerToShot
  };
})();


