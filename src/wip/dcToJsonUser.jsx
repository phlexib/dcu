var dcToJsonUser = (function() {
  //// REARRANGE ALL FOOTAGE IN AN ASSET FOLDER
  function moveItemsToFolders() {
    app.beginUndoGroup("Organize Assets");
    var proj = app.project;
    var items = proj.items;

    var assetsFolder = findFolder("Assets");
    if (!assetsFolder) {
      assetsFolder = app.project.items.addFolder("Assets");
    }
    var solidFolder = findFolder("Solids");
    if (!solidFolder) {
      solidFolder = app.project.items.addFolder("Solids");
    }

    for (var i = proj.numItems; i > 0; i--) {
      if (proj.item(i).mainSource instanceof SolidSource) {
        proj.item(i).parentFolder = solidFolder;
      } else if (proj.item(i).mainSource instanceof FileSource) {
        proj.item(i).parentFolder = assetsFolder;
      }
    }
    app.beginUndoGroup();
  }

  //// RENAME LAYERS BASED ON SHOT NAME
  var layerNamesLog = [];

  function renameLayerToShot(comp) {
    var projectTokens = app.project.file.displayName.split("_");
    var sName = projectTokens[0] + "_" + projectTokens[1];

    app.beginUndoGroup("rename Layers");
    for (var l = comp.numLayers; l > 0; l--) {
      var layerName = comp.layer(l).name;
      var newLayerName = layerName.split("-")[0] + "-" + sName;

      if (comp.layer(l).nullLayer === true) {
      } else if (layerName.layerName.split("-")[1] != sname) {
        comp.layer(l).name = newLayerName;
        var logObject = {
          layerId: layer.index,
          comp: comp.id
        };

        layerNamesLog.push(logObject);

        if (comp.layer(l).source instanceof CompItem) {
          comp.layer(l).source.name = newLayerName;
          renameLayerToShot(sName, comp.layer(l).source);
        }
      }
    }
    app.beginUndoGroup();
  }



  /// UTILS
  function findFolder(folderName) {
    for (i = 1; i <= app.project.numItems; i++) {
      var curItem = app.project.item(i);
      if (curItem instanceof FolderItem && curItem.name == folderName) {
        return curItem;
        break;
      }
    }
  }

  function findItemByID(lookUpId) {
    for (i = 1; i <= app.project.numItems; i++) {
      var curItem = app.project.item(i);
      if (curItem.id === lookUpId) {
        return curItem;
        break;
      }
    }
  }

  ////// Find element in array
  function findInArray(arr, val) {
    var found = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id == val) {
        found = true;
        return found;
      }
    }
    return found;
  }

  return {
    moveItemsToFolders: moveItemsToFolders,
    renameLayerToShot: renameLayerToShot
  };
})();
