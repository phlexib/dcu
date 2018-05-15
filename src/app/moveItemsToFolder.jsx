// move all files into "Assets" Folder
// move all Solids into "Solids" Folder
var OrganizeItems = (function(){
  
  function moveItemsToFolders() {
    app.beginUndoGroup("organize assets");

    var proj = app.project;
    var assetsFolder = findFolder("Assets");
    if(!assetsFolder) { assetsFolder = app.project.items.addFolder("Assets") };
    var solidFolder = findFolder("Solids");
    if(!solidFolder) { solidFolder = app.project.items.addFolder("Solids") };
  
    var idArray = [];

    for(var i = 1; i <= proj.numItems; i++) {
      if ((proj.item(i).mainSource instanceof SolidSource) || (proj.item(i).mainSource instanceof FileSource)) {
         idArray.push(proj.item(i).id);
      }
    }

    for(var j = 0 ; j < idArray.length; j++) {
      var curItem = findItemById(idArray[j]);
      
      if (curItem.mainSource instanceof SolidSource) {
        curItem.parentFolder = solidFolder;
      } else if(curItem.mainSource instanceof FileSource) {
        curItem.parentFolder = assetsFolder;
      }
    }

    var liveComp = app.project.activeItem;
    if(liveComp instanceof CompItem){
      var jsonComp = liveComp.duplicate();
      jsonComp.name = liveComp.name.replace("Live","JSON");
    }else{
      alert("Select your Live Comp first ");
    }
    app.endUndoGroup();
  };

  function findFolder(folderName) {
    for (f = 1; f <= app.project.numItems; f++) {
      var curItem = app.project.item(f);
      if (curItem instanceof FolderItem && curItem.name == folderName) {
        return curItem;
        break;
      }
    }
  };

  function findItemById(id) {
    for (var item = 1; item <= app.project.numItems; item++) {
      var curItem = app.project.item(item);
      if (curItem.id === id) {
        return curItem;
        break;
      }
    }
  };

  return {
    moveItemsToFolders : moveItemsToFolders
  }
})();
