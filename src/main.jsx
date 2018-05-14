
//////
(function (thisObj) {  
  /// Globals Variables 
  var exportDetailsIsVisible = false;
  var markerGroupArray = [{id:1,text:"group name"}];
  var SCRIPTNAME =  "DC To Json User"
  var SCRIPTVERSION = "0.0.1"


  ///// START UI
  var win = buildUI(thisObj);  
  function buildUI(thisObj) {  
      var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", SCRIPTNAME + "-" + SCRIPTVERSION, undefined, {  
          resizeable: true,
      });  
      return pal;
    }


//// TITLE GRP
titleGrp = win.add("group", [0, 0, 300, 20]);
titleGrp.orientation = "row";
titleGrp.alignment = "left";
title = titleGrp.add("statictext",[0, 10,50, 20],"v"+SCRIPTVERSION);

//// ORGANIZE PANEL
orgPanel = win.add("panel", [10, 10, 300, 80], "1 - ORGANIZE PROJECT");
orgPanel.orientation = "row";

orgBtn = orgPanel.add("button", [10, 10, 150, 40], "MOVE ASSETS");
orgBtn.helpTip = "Move all assets in Asset Folder. Duplicate Live Comp to Json Comp";
orgBtn.onClick = function() {
  OrganizeItems.moveItemsToFolders();
};
renameGrp = orgPanel.add("group", [10, 10, 300, 40], "undefined", { orientation: "fill",alignment :"left"});
renameBtn = renameGrp.add("button", [10, 10,150, 40], "RENAME LAYERS");
renameBtn.helpTip = "Add Shot Extension name to every used Layers.";
renameBtn.onClick = function() {
  RenameLayers.renameLayerToShot(app.project.activeItem);
};

//// MAKE MARKERS PANEL
mrkPanel = win.add("panel", [10, 85, 300, 370], "2 - MARKER MAKER");
mrkPanel.orientation = "column";


dynamicGrp = mrkPanel.add("group", [10, 0, 300, 80], "undefined", {orientation: "row"});
dynBtn = dynamicGrp.add("button", [10, 10, 300, 40], "DYNAMIC");
dynBtn.onClick = function() {
  setMarker("dynamic","");
};
alignGrp = mrkPanel.add("group", [10, 60, 400, 110], "undefined", {orientation: "fill"});
centerBtn = alignGrp.add("button", [10, 10, 150, 40], "CENTER TEXT");
centerBtn.onClick = function() {
  setMarker("textVAlign=.5","");
};
bottomBtn = alignGrp.add("button", [10,10, 150, 40], "BOTTOM TEXT");
bottomBtn.onClick = function() {
  setMarker("textVAlign=1","");
};


/// Exampe grp
// var mkrGrp = mrkPanel.add("group", [10, 120, 385, 180], "Group Markers", {
//   orientation: "column",
//   alignment: "fill"
// });

// mkrExampleBtn = mkrGrp.add("button", [10, 10, 30, 30], "0");
// mkrExampleBtn.enabled = false;
// mkrExampleBtn.helpTip = "Apply Group to Selected Layers";
// mkrExampleLabel = mkrGrp.add("edittext", [30, 10, 250, 30], "group name", {
//     readonly: 1, 
//     noecho: 0,
//     borderless: 0,
//     multiline: 0,
//     enterKeySignalsOnChange: 0,
//     wantReturn: true
//   });
// mkrExampleLabel.enabled = true;
// mkrExampleLabel.helpTip = "RETURN will automatically update layers with new name.";
// mkrAddExampleBtn = mkrGrp.add("button", [100, 10, 120, 30], "+");
// mkrAddExampleBtn.enabled = false;
// mkrExampleBtn.helpTip = "Create a new Marker Group";

// end example group;

reloadGrp =  mrkPanel.add("group", [10, 120, 385, 180], "Group Markers", {orientation: "row"});
reloadGrp.alignment = "right";
var reloadBinaryString = ["\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x0F\x00\x00\x00\x0F\b\x06\x00\x00\x00;\u00D6\u0095J\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\u00C0IDATx\u00DAb`\u00A0\x000\u00E2\u0092\u00D8\u00BCy\u00B3\x03\x12\u00F7\x02\x10\x17\x00\u00F1\x04__\u00DF\x0F0A\x16,\u009A\x1A\u0080T>\x10\x0B`1\u0093\x1F\u0088\x0B\u00B1\u00DA\f\u00D48\x1FH%@\u00B9\x1F\u00A06*@1\f(\x02m\x7F\x00b0\u00A1\u0099\f\u00D3X\bT \b\u00C4\u008EP\x03\u0090A=.g+\u0082\b\u0098\u00C90\u0083\u0080x\"\x12\u00FF\x01\u00C3\u00D0\x06\u008CH!\u008D\x1E\u00AA\x0F\u0090\u00FD\x0E\u0095G\t\x0F\x16\u00B4PL@\u00E2o\x00\u00E2@\u00A8FP\x02\u00E9G\u00B7\x10Ys#\u009Af\x03\u00A0\u00A6\u00FD \x1A)\u00C1,\u00C0\u0099<\u0081\u008A\u00FB\u00A1\u00C9\x10\x1D\u0080\x12\u00CCD\u00A0\u0093\x1B\u0090\x05\u00D1\u00E3\x19d\u00FBGP\x1A\u0086\u00DA\u00C8\x00\u00F5\u00E7\x01\u00AA\u00876@\u0080\x01\x00}\u00DB5X\x1D\u00CC\u00FA\x0F\x00\x00\x00\x00IEND\u00AEB`\u0082"];
reloadMkrBtn= reloadGrp.add("iconbutton",[20,00,40,20] ,ScriptUI.newImage (createResourceFile ("iconbut_1Image.png", reloadBinaryString, getUserDataFolder())),{style: "toolbutton", toggle:0} );;
reloadMkrBtn.helpTip = "Reload Markers group from active comp";
reloadMkrBtn.onClick = function(){
  removeAllChildren(grpMarkersGrp);
  LoopMarkers.resetMarkers();
  refreshMarkers();

};

var grpMarkersGrp = mrkPanel.add(
  "group",
  [10, 115, 385, 200],
  "Group Markers",
  {
    alignment: "left",
    orientation: "column"
  }
);

//// COLLECT PANEL
collectPanel = win.add("panel", [10, 375, 400, 435], "3 - COLLECT AND STAGE",{orientation : "column"});
collectGrp = collectPanel.add("group", [0, 70, 300, 100], "undefined", {orientation: "row", alignment : "fill"});
collectBtn = collectGrp.add("button", [10, 10, 300, 40], "COLLECT AND SAVE");
collectBtn.helpTip = "- Reduce\n - Collect.\n- Stage Project.\n- Save to CC (13) (A dialog Window will show up).\n- Render h264 file in Render/_out folder. \n- Save Markers Description Text file."
collectBtn.onClick = function(){
  ReduceAndSaveProject.reduceSave();
  writeArrayToFile(markerGroupArray);
 };

//// EXPORT PANEL
exportPanel = win.add("panel", [10, 375, 300, 120], "4 - EXPORT",{orientation : "column"});
exportGrp = exportPanel.add("group", [0, 70, 300, 100], "undefined", {orientation: "row", alignment : "fill"});
exportBtn = exportGrp.add("button", [10, 10, 260, 40], "EXPORT ALL");
exportBtn.onClick = function(){
  dynamicContentToJSON.dcMain.onExportAllClick();
};

exportDetailBtn = exportGrp.add("button", [350, 10, 380, 40], "<");
exportDetailBtn.enabled = true;
exportDetailBtn.onClick = function() {
  if(this.text === "<" ){
    this.text =  "^"
  }else{
    this.text = "<"
  }
   showHideExportDetails();
};

var expDetailGrp = exportPanel.add("group", [0, 70, 100, 40], "undefined");
expDetailGrp.alignment = "left";

win.onResizing = win.onResize = function () {  
  this.layout.resize();  
};  

if (win instanceof Window) {  
  win.center();  
  win.show();  
} else {  
  win.layout.layout(true);  
  win.layout.resize();  
}  


///UPDATE UI EASILY TO REFLECT ADD/REMOVE CHANGES
function updateUILayout(container) {
  container.layout.layout(true); //Update the container
  win.layout.layout(true); //Then update the main UI layout
}
win.active = true;
win.layout.layout(true);
win.layout.resize();
win.onResizing = win.onResize = function() {
  this.layout.resize();
};


//// END UI

////////////////////////////////////////
///////////// FUNCTIONS ////////////////
////////////////////////////////////////

refreshMarkers();

///ADD NEW MARKER GROUP
function addMarkerGrp(parent, values){

  var newId = values.id;
  var newText = values.text;
  if(!newId){newId = markerGroupArray.length};
  if(!newText){newText = "group name "+ newId.toString()};
  markerGroupArray.push({id:newId,text:newText});

  switchButtonValue();
  var mkrGrp = parent.add("group", [10, 120, 385, 180], "Group Markers", {
    orientation: "column",
    alignment: "fill"
  });
  mkrBtn = mkrGrp.add("button", [10, 10, 30, 30], newId);
  mkrBtn.onClick = function(){
    assignGroup(this.text);
  }
  mkrBtn.helpTip = "Apply Group to Selected Layers";
  mkrLabel = mkrGrp.add("edittext", [30, 10, 250, 30], newText, {
    readonly: 0, 
    noecho: 0,
    borderless: 0,
    multiline: 0,
    enterKeySignalsOnChange: 0,
    wantReturn: true
  });
  //mkrLabel.onChanging = function(){$.writeln (newId + " selected.")};
  mkrLabel.addEventListener ("keydown", function (kd) {
    
    if( kd.keyName == "Enter"){
      var curGrpObject = getByValue(markerGroupArray, newId);
      var arrIndex = getIndexByValue(markerGroupArray, newId);
      markerGroupArray[arrIndex].text = kd.target.text;
      updateGroupMarkerText(newId,kd.target.text);
    }
  });
  mkrAddBtn = mkrGrp.add("button", [100, 10, 120, 30], "+");
  mkrAddBtn.onClick = function() {
    addMarkerGrp(grpMarkersGrp,{id:markerGroupArray.length+1,text:""});
  };
  parent.orientation = "column";
 
  updateUILayout(parent); //Update UI
}

//// ADD MARKER GROUP TO LAYER

function assignGroup(id){
  var kids = grpMarkersGrp.children;
  var btnGrp = kids[id-1].children;
  var grpObject = {id : id, text : btnGrp[1].text};
  markerGroupArray[id-1] = grpObject;
  var curGrpObject = getByValue(markerGroupArray, id);
  setMarker(curGrpObject.id,curGrpObject.text);
};

function updateGroupMarkerText(id,text){
  for (var m =0 ; m < LoopMarkers.groupMarkers.length ; m++){
  
    if(LoopMarkers.groupMarkers[m].id == id){
     var layerComp = findItemById (LoopMarkers.groupMarkers[m].comp);
     var layerToSet = layerComp.layer(LoopMarkers.groupMarkers[m].layerIndex);
     var updatedMarker = new MarkerValue(LoopMarkers.groupMarkers[m].id,text);
     layerToSet.property("Marker").setValueAtTime(LoopMarkers.groupMarkers[m].time, updatedMarker);
     
    }
  }
}

//// REMOVE MARKERS

function removeMarkerGroup(id){
    var kids = grpMarkersGrp.children;  
    var numKids = kids.length;  
    if(numKids > 0){    //Verify that at least one child exists  
      grpMarkersGrp.remove(kids[id]);  
    } 
    updateUILayout(group2);    //Update UI  
};


//// REMOVE GROUPS FROM UI

function removeAllChildren(parent){
  var kids = parent.children;  
  var numKids = kids.length;  
  // Remove all kids
  while (numKids > 0){ //keep at least one default 
    parent.remove(kids[numKids-1]);  
    numKids--;
  } 
  updateUILayout(parent);    //Update UI 
}


//// SWITCH Marker Btn Status to Disable
function switchButtonValue(){
  var kids = grpMarkersGrp.children;
   for (var k = 0 ; k < kids.length; k++){
     var btnGrp = kids[k].children;
     btnGrp[2].enabled = false
     btnGrp[2].text = "-"; //Remove last child in the container
   }
}

//// SHOW EXPORT DETAIL PANEL
function showHideExportDetails(){
  if (!exportDetailsIsVisible) {
    var g = expDetailGrp.add("group", [0, 70,260, 430], "undefined"); //Add a group
    g.orientation = "column";
    g.alignment = "left";
    var exportContentBtn = g.add("button", [10, 10,260, 40], "Export Content"); //Add a button to that group
    exportContentBtn.onClick = function(){
      dynamicContentToJSON.dcMain.onExportAllClick();
    };
    var testExportBtn = g.add("button", [10, 10,260, 40], "Test Export"); //Add another button to that group
    testExportBtn.onClick = function(){
      dynamicContentToJSON.dcMain.onTestExportClick();
    };

    // Tempoarily remove Validator as it doesn't work
    // var validatorBtn = g.add("button", [10, 10,260, 40], "Validator");
    // validatorBtn.onClick = function(){
    //   dynamicContentToJSON.dcMain.onValidateClick();
    // };
    ///
    var uniquifyBtn = g.add("button", [10, 10,260, 40], "Uniquify");
    uniquifyBtn.onClick = function(){
      dynamicContentToJSON.dcMain.onUniquifyClick();
    };
    exportDetailsIsVisible = true;
    updateUILayout(expDetailGrp); //Update UI
  } else {
    var kids = expDetailGrp.children;
    var numKids = kids.length;
    if (numKids > 0) {
      //Verify that at least one child exists
      expDetailGrp.remove(kids[numKids - 1]); //Remove last child in the container
    }
    exportDetailsIsVisible = false;
    updateUILayout(expDetailGrp); //Update UI
  }
}

//// MARKERS
/**
         * Creates marker with comment set to argument
         *
         * @param {String} markerComment - Comment to set on marker
         * @param {String} markerChapter - Comment to set on marker
         */
        function setMarker (markerComment,markerChapter) {
          //Log.trace("--> setMarker: " + String(markerComment));
          app.beginUndoGroup("Make Makers");

          var comp = aeq.getActiveComp();

          if (!aeq.isComp(comp)) {
              var msg = "Please activate a comp before making markers.";
              alert(msg);
             // Log.warning("<-- setMarker: " + msg);
              return;
          }

          aeq.getSelectedLayers(comp).forEach(function (layer) {
              var marker = new MarkerValue(markerComment,markerChapter);
              aeq.getMarkerGroup(layer).setValueAtTime(comp.time, marker);
          });

          app.endUndoGroup();
         //Log.trace("<-- setMarker: " + String(markerComment));
      }

//// GET ALL MARKERS FROM PROJECT
function refreshMarkers (){
  var groupMarkers = LoopMarkers.getMarkers(app.project.activeItem);

  if(groupMarkers.length <1){
    addMarkerGrp(grpMarkersGrp,{id:"1",text:"group 1"});
  }else{
    var unique = new Array;

  for(var u = 0; u<groupMarkers.length;u++){
    if(findInArray(unique , groupMarkers[u].id) === false){
      unique.push(groupMarkers[u]);
    }
  }
  unique.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
  markerGroupArray = [];
  for (var m=0 ; m < unique.length ; m++){
      
      addMarkerGrp(grpMarkersGrp,unique[m]);
      
    }
  }
  
};

function writeArrayToFile(arr){
  var curAppFile = app.project.file;
  var tmpPath = curAppFile.parent;
  var parentFolder = tmpPath.parent;
  var filepath = parentFolder.fsName + "/" + curAppFile.displayName.split(".")[0]+".txt";
  var textOutput = "MARKER LIST\n";
  
  for(var e = 0 ; e< arr.length; e++){
    var line = "\n" + arr[e].id + " - " + arr[e].text;
    textOutput += line;
  }

  SaveMarkerFile.saveFile(textOutput,filepath);

};

////////////////////////////////////////
///////////// END FUNCTIONS ////////////
////////////////////////////////////////

//// UTILS
function findInArray(arr,val){
  var found = false;
  for(var i = 0; i < arr.length; i++) {
    if (arr[i].id == val) {
        found = true;
        return found;
    }
  }
  return found;
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

function getByValue(arr, value) {
  for (var i=0; i<markerGroupArray.length ; i++) {
    if (arr[i].id == value) return arr[i];
  }
};
function getIndexByValue(arr, value) {
  for (var i=0; i<markerGroupArray.length ; i++) {
    if (arr[i].id == value) return i;
  }
};

function compare(a,b) {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
};

function getUserDataFolder () {
  var userDataFolder = Folder.userData;
  var aescriptsFolder = Folder(userDataFolder.toString() + "/Aescripts/new_project/yourImg"); 
  if (!aescriptsFolder.exists) {
    var checkFolder = aescriptsFolder.create();
        if (!checkFolder) {
          alert ("Error creating ");
          aescriptsFolder  = Folder.temp;
          } }
  return aescriptsFolder.toString();
  };

function createResourceFile (filename, binaryString, resourceFolder) {
  var myFile = new File(resourceFolder+"/"+filename);
  if (!File(myFile).exists)
  {
      if (!(isSecurityPrefSet())) 
      {
          alert ("This script requires access to write files. Go to the  General  panel of the application preferences and make sure  Allow Scripts to Write Files and Access Network  is checked.");	
           try{
          app.executeCommand(2359);
          }
          catch (e) {
              alert(e);
              }
          if (!isSecurityPrefSet()) return null; 
      }
      myFile.encoding = "BINARY";
      myFile.open( "w" );
      myFile.write( binaryString );
      myFile.close();
  }
  return myFile;
};
function isSecurityPrefSet(){
  try{
    var securitySetting = app.preferences.getPrefAsLong("Main Pref Section",
            "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
    return (securitySetting == 1);
          }catch(e){return (securitySetting = 1);}
  };
})(this);  