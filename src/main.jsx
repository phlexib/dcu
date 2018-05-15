//////
(function(thisObj) {
  //// Reference DynamicContentToJSON from file

  if(isWindows){
    var scriptRootFolder = Folder(
      "//abadal/GlobalPrefs/CURRENT/src/AE/scripts/Pipeline/dynamicContentToJSON"
    );
  }else{
    var scriptRootFolder = Folder(
      "//GlobalPrefs/CURRENT/src/AE/scripts/Pipeline/dynamicContentToJSON"
    );
  }
  
  var dcToJSONScriptFile = File(
    scriptRootFolder.fsName + "/" + "dynamicContentToJSON.jsx"
  );
  if (dcToJSONScriptFile) {
    dcToJSONScriptFile.open("r");
    var dcToJSONScript = dcToJSONScriptFile.read();
    dcToJSONScriptFile.close();
    eval(dcToJSONScript);
  } else {
    alert("could not find Script");
  }

  /// Globals Variables

  var EXPORT_DETAILS_VISIBLE = false;
  var MARKER_GROUPS_ARRAY = [{ id: 1, text: "group name" }];
  var SCRIPTNAME = "DC To Json User";
  var SCRIPTVERSION = "0.0.1";

  ///// START UI
  var win = buildUI(thisObj);
  function buildUI(thisObj) {
    var pal =
      thisObj instanceof Panel
        ? thisObj
        : new Window("palette", SCRIPTNAME + "-" + SCRIPTVERSION, undefined, {
            resizeable: true
          });
    return pal;
  }

  //// TITLE GRP
  titleGrp = win.add("group", [0, 0, 300, 20]);
  titleGrp.orientation = "row";
  titleGrp.alignment = "left";
  title = titleGrp.add("statictext", [0, 10, 50, 20], "v" + SCRIPTVERSION);

  //// ORGANIZE PANEL
  orgPanel = win.add("panel", [10, 10, 300, 80], "1 - ORGANIZE PROJECT");
  orgPanel.orientation = "row";

  orgBtn = orgPanel.add("button", [10, 10, 150, 40], "MOVE ASSETS");
  orgBtn.helpTip =
    "Move all assets in Asset Folder. Duplicate Live Comp to Json Comp";
  orgBtn.onClick = function() {
    OrganizeItems.moveItemsToFolders();
  };
  renameGrp = orgPanel.add("group", [10, 10, 300, 40], "undefined", {
    orientation: "fill",
    alignment: "left"
  });
  renameBtn = renameGrp.add("button", [10, 10, 150, 40], "RENAME LAYERS");
  renameBtn.helpTip = "Add Shot Extension name to every used Layers.";
  renameBtn.onClick = function() {
    RenameLayers.renameLayerToShot(app.project.activeItem);
  };

  //// MAKE MARKERS PANEL
  mrkPanel = win.add("panel", [10, 85, 300, 370], "2 - MARKER MAKER");
  mrkPanel.orientation = "column";

  dynamicGrp = mrkPanel.add("group", [10, 0, 300, 80], "undefined", {
    orientation: "row"
  });
  dynBtn = dynamicGrp.add("button", [10, 10, 300, 40], "DYNAMIC");
  dynBtn.onClick = function() {
    setMarker("dynamic", "");
  };
  alignGrp = mrkPanel.add("group", [10, 60, 400, 110], "undefined", {
    orientation: "fill"
  });
  centerBtn = alignGrp.add("button", [10, 10, 150, 40], "CENTER TEXT");
  centerBtn.onClick = function() {
    setMarker("textVAlign=.5", "");
  };
  bottomBtn = alignGrp.add("button", [10, 10, 150, 40], "BOTTOM TEXT");
  bottomBtn.onClick = function() {
    setMarker("textVAlign=1", "");
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

  reloadGrp = mrkPanel.add("group", [10, 120, 385, 180], "Group Markers", {
    orientation: "row"
  });
  reloadGrp.alignment = "right";

  var assignString =
    '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x06\x00iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\u00EF\u00BB\u00BF" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmp:CreatorTool="Adobe Photoshop CC 2018 (Macintosh)" xmp:CreateDate="2018-05-14T15:56:03-07:00" xmp:ModifyDate="2018-05-14T16:17:02-07:00" xmp:MetadataDate="2018-05-14T16:17:02-07:00" dc:format="image/png" photoshop:ColorMode="3" photoshop:ICCProfile="sRGB IEC61966-2.1" xmpMM:InstanceID="xmp.iid:1cd127d2-b7a5-4c1f-ab4f-e3099dd7d126" xmpMM:DocumentID="adobe:docid:photoshop:7451094e-017a-f44c-9bd8-021d3bab82e8" xmpMM:OriginalDocumentID="xmp.did:0939ff2a-b2f0-4b59-8923-b4d677249905"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action="created" stEvt:instanceID="xmp.iid:0939ff2a-b2f0-4b59-8923-b4d677249905" stEvt:when="2018-05-14T15:56:03-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)"/> <rdf:li stEvt:action="saved" stEvt:instanceID="xmp.iid:1cd127d2-b7a5-4c1f-ab4f-e3099dd7d126" stEvt:when="2018-05-14T16:17:02-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)" stEvt:changed="/"/> </rdf:Seq> </xmpMM:History> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>U\u00A5\x12\u009C\x00\x00\x01\x0BIDAT8\u008D\u00ED\u0094\u00B1J\x041\x14E\u00CF\u00B8.\u00A8k%\x166\x16.\u0088?\u00A0\u00DFa\u00E3\x17\u00F8\x0F\u00FE\u0091\u0085\u009F\u00B0\u008D\u00A5`)b\u00B3*\u0082X\u0089\u0088\u00CD\u008A\u0088\u00BB\x1E\u008B\u0089Lf\u00C8\fY\u00D9\u00D2\x0B\u0081\u00E4\u00E5\u00DD;\u0099\u009B\u00F7R\u00A8,\x12K\u0099y#\u00E02\'q9Sp\x17\u00D8\u00CAI\u00CC=a6\u00FE\x05k\u00E8\u00BA\u00B0\u00DE\u00BC\u0082{\u00C0\x17p\x12\u00D63\u00E0;\u00CC\u008F\u0081)\u00B0\u009Fd\u00AA\u00A9\u00B1\u00AA>Y\u00E2P=Wo\u00D4\u00A3\x10{S7R\u00DC6A\u00D4\u009Ez\x1D\x04&\u00EAg\u0098\u00DF\u00A9\u00EBm\u00BC.A\u00D4\u00BEze\u0085q\u0097\u0098J\x11\u00F5\u00F2N\u00F0\u00E9\u00B1\u00E1\u00CA\x00\u00B8\x07\u00D6\u0080!\u00F0\u00DA\u00D8\u00DF\x06\u00FA\u00C0C\u00D3\u00C3g\u00F5\u00B6\u00E5\u00CB\u00830R{\x17\u00EA\u00ECw\x1D\u0097\u00C6f\u00B8\u00D9\x14\u00DE[\u00E2\x00+D\u00D5\x12\u0097\u00CD\u00B4\u0083\u00D4\u0085\u00DA\u00FB\x17\x0B\x16T\u00B56\x0Fj\u009C\u00F8\u0097_(\r>\u00A5\u00EC\u0084\u00D6n\u0088N\u00F6\x01\x1C\x00\u0093*Z\u0099{\u00E6\u00DF1J\u0095\u00CDB\u00F0\x03\u00B7\\m&\x00\u00BC\u00C4\u00F1\x00\x00\x00\x00IEND\u00AEB`\u0082';
  assignMkrBtn = reloadGrp.add(
    "iconbutton",
    [20, 00, 40, 20],
    ScriptUI.newImage(
      createResourceFile("assign.png", assignString, getUserDataFolder())
    ),
    { style: "toolbutton", toggle: 0 }
  );
  assignMkrBtn.helpTip = "Load Markers group from active comp";
  assignMkrBtn.onClick = function() {
    for (var mark = 0; mark < MARKER_GROUPS_ARRAY.length; mark++) {
      updateGroupMarkerText(
        MARKER_GROUPS_ARRAY[mark].id,
        MARKER_GROUPS_ARRAY[mark].text
      );
    }
  };

  var reloadBinaryString =
    '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\x06\u00E0iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\u00EF\u00BB\u00BF" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmp:CreatorTool="Adobe Photoshop CC 2018 (Macintosh)" xmp:CreateDate="2018-05-14T15:56:03-07:00" xmp:ModifyDate="2018-05-14T16:17:13-07:00" xmp:MetadataDate="2018-05-14T16:17:13-07:00" dc:format="image/png" photoshop:ColorMode="3" photoshop:ICCProfile="sRGB IEC61966-2.1" xmpMM:DocumentID="adobe:docid:photoshop:a9c8bdd4-fecd-214c-80bd-cbaf4a29d21c" xmpMM:InstanceID="xmp.iid:b5634421-66b5-4b5c-8c2c-e17e4b2ab6e7" xmpMM:OriginalDocumentID="adobe:docid:photoshop:4bd636a3-36e4-1548-a9a2-092e04a5745c"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action="created" stEvt:instanceID="xmp.iid:c26dece5-00cb-4996-9a38-fa59d75dca32" stEvt:when="2018-05-14T15:56:03-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)"/> <rdf:li stEvt:action="saved" stEvt:instanceID="xmp.iid:9c6227bc-cf69-4059-8ee5-5e6efbaacfdd" stEvt:when="2018-05-14T15:59:12-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)" stEvt:changed="/"/> <rdf:li stEvt:action="saved" stEvt:instanceID="xmp.iid:b5634421-66b5-4b5c-8c2c-e17e4b2ab6e7" stEvt:when="2018-05-14T16:17:13-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)" stEvt:changed="/"/> </rdf:Seq> </xmpMM:History> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>\u00A2\u00B1\u0087\x19\x00\x00\x00\u00F1IDAT8\u008D\u00DD\u0094;J\x04A\x14EO\u008B\u00F8\x0B\u00C7@:2\x11\u008C\x0574\u00B8\x04\x17\u00E1\x16\f\\\u0080[\u00D0X\u008CGF\f5\x1016\x18\u00D0\x1E\u00F5\u0098<\u00B0[f\u00BA_\u00B7\u00D9\\(\u00EAU\u00D5}\u0087\u00FA\x17*\t\u008D\u0081M\u00E0\u00BC\u00CBX$\u0081\u00D3\x00\x1E\x02\u00ED\tjW\u00B9\u00F5Wwj\u00D1\u00E6\u00EF\u0082\u00DD\x04\u00E8C\u00AD"\u009E\f\x01\u008E\u00D4i\x00\u00C6\u00EAu\u00B4O\u00A2\u00EFQ\u00DD\u00EB\x03<\u0088\u00C4\u00B3h\u00DF\u00ABo\x11\u009F\u00C6\u00D8\u00D1\u00A2\u00DC\u00EC\u00A1<\x01%\u00B0\u00D5e\\\u00CB\u00D0\u0080/\u00E0;c\u00CC\x02\u00D3Z\x1D\u00E0\b\u00D8\u00CE\x18\u00D7kq\x19\u00F5\u00EB\x02\u00DF\x03\u00B0\u00BB\u0084Q\x06\u00E7\x19h\u00DC\u00C3\u0099\u00FA\u0092x\u008A\x7F\u00CB$\u00EE%jc\u0086;@\u0095YV\u00CB*\x1B{X\x01\u00B3\x01\u00C0\u00F7e\u00C0\r\u00E0\u00F3\u00BF\u00C0\u00FAt\u00E7\u00C0>pA\u00BF\x17t\u00DC\u00E8\u00A9m\u00EE\u00A5:w\u0098\u00AE\u00FA~\x0Ei\u00FD\x00J^\u00AB\u00D9\u00DB\u00BB\x01\u00CA\x00\x00\x00\x00IEND\u00AEB`\u0082';
  reloadMkrBtn = reloadGrp.add(
    "iconbutton",
    [20, 00, 40, 20],
    ScriptUI.newImage(
      createResourceFile("upload.png", reloadBinaryString, getUserDataFolder())
    ),
    { style: "toolbutton", toggle: 0 }
  );
  reloadMkrBtn.helpTip = "Reload Markers group from active comp";
  reloadMkrBtn.onClick = function() {
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
  collectPanel = win.add(
    "panel",
    [10, 375, 400, 435],
    "3 - COLLECT AND STAGE",
    { orientation: "column" }
  );
  collectGrp = collectPanel.add("group", [0, 70, 300, 100], "undefined", {
    orientation: "row",
    alignment: "fill"
  });
  collectBtn = collectGrp.add("button", [10, 10, 300, 40], "COLLECT AND SAVE");
  collectBtn.helpTip =
    "- Reduce\n - Collect.\n- Stage Project.\n- Save to CC (13) (A dialog Window will show up).\n- Render h264 file in Render/_out folder. \n- Save Markers Description Text file.";
  collectBtn.onClick = function() {
    ReduceAndSaveProject.reduceSave();
    writeArrayToFile(MARKER_GROUPS_ARRAY);
  };

  //// EXPORT PANEL
  exportPanel = win.add("panel", [10, 375, 300, 120], "4 - EXPORT", {
    orientation: "column"
  });
  exportGrp = exportPanel.add("group", [0, 70, 300, 100], "undefined", {
    orientation: "row",
    alignment: "fill"
  });
  exportBtn = exportGrp.add("button", [10, 10, 260, 40], "EXPORT ALL");
  exportBtn.onClick = function() {
    DynamicContentToJSON.dcMain.onExportAllClick();
  };

  exportDetailBtn = exportGrp.add("button", [350, 10, 380, 40], "<");
  exportDetailBtn.enabled = true;
  exportDetailBtn.onClick = function() {
    if (this.text === "<") {
      this.text = "^";
    } else {
      this.text = "<";
    }
    showHideExportDetails();
  };

  var expDetailGrp = exportPanel.add("group", [0, 70, 100, 40], "undefined");
  expDetailGrp.alignment = "left";

  win.onResizing = win.onResize = function() {
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
  function addMarkerGrp(parent, values) {
    var newId = values.id;
    var newText = values.text;
    if (!newId) {
      newId = MARKER_GROUPS_ARRAY.length;
    }
    if (!newText) {
      newText = "group name " + newId.toString();
    }
    MARKER_GROUPS_ARRAY.push({ id: newId, text: newText });

    switchButtonValue();
    var mkrGrp = parent.add("group", [10, 120, 385, 180], "Group Markers", {
      orientation: "column",
      alignment: "fill"
    });
    mkrBtn = mkrGrp.add("button", [10, 10, 30, 30], newId);
    mkrBtn.onClick = function() {
      assignGroup(this.text);
    };
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

    mkrLabel.addEventListener("keydown", function(kd) {
      if (kd.keyName == "Enter") {
        var curGrpObject = getByValue(MARKER_GROUPS_ARRAY, newId);
        var arrIndex = getIndexByValue(MARKER_GROUPS_ARRAY, newId);
        MARKER_GROUPS_ARRAY[arrIndex].text = kd.target.text;
        // updateGroupMarkerText(newId,kd.target.text);
      }
    });

    mkrAddBtn = mkrGrp.add("button", [100, 10, 120, 30], "+");
    mkrAddBtn.onClick = function() {
      addMarkerGrp(grpMarkersGrp, {
        id: MARKER_GROUPS_ARRAY.length + 1,
        text: ""
      });
    };
    parent.orientation = "column";

    updateUILayout(parent); //Update UI
  }

  //// ADD MARKER GROUP TO LAYER

  function assignGroup(id) {
    var kids = grpMarkersGrp.children;
    var btnGrp = kids[id - 1].children;
    var grpObject = { id: id, text: btnGrp[1].text };
    MARKER_GROUPS_ARRAY[id - 1] = grpObject;
    var curGrpObject = getByValue(MARKER_GROUPS_ARRAY, id);
    setMarker(curGrpObject.id, curGrpObject.text);
  }

  function updateGroupMarkerText(id, text) {
    for (var m = 0; m < LoopMarkers.groupMarkers.length; m++) {
      if (LoopMarkers.groupMarkers[m].id == id) {
        var layerComp = findItemById(LoopMarkers.groupMarkers[m].comp);
        var layerToSet = layerComp.layer(
          LoopMarkers.groupMarkers[m].layerIndex
        );
        var updatedMarker = new MarkerValue(
          LoopMarkers.groupMarkers[m].id,
          text
        );
        layerToSet
          .property("Marker")
          .setValueAtTime(LoopMarkers.groupMarkers[m].time, updatedMarker);
      }
    }
  }

  //// REMOVE MARKERS

  function removeMarkerGroup(id) {
    var kids = grpMarkersGrp.children;
    var numKids = kids.length;
    if (numKids > 0) {
      //Verify that at least one child exists
      grpMarkersGrp.remove(kids[id]);
    }
    updateUILayout(group2); //Update UI
  }

  //// REMOVE GROUPS FROM UI

  function removeAllChildren(parent) {
    var kids = parent.children;
    var numKids = kids.length;
    // Remove all kids
    while (numKids > 0) {
      //keep at least one default
      parent.remove(kids[numKids - 1]);
      numKids--;
    }
    updateUILayout(parent); //Update UI
  }

  //// SWITCH Marker Btn Status to Disable
  function switchButtonValue() {
    var kids = grpMarkersGrp.children;
    for (var k = 0; k < kids.length; k++) {
      var btnGrp = kids[k].children;
      btnGrp[2].enabled = false;
      btnGrp[2].text = "-"; //Remove last child in the container
    }
  }

  //// SHOW EXPORT DETAIL PANEL
  function showHideExportDetails() {
    if (!EXPORT_DETAILS_VISIBLE) {
      var g = expDetailGrp.add("group", [0, 70, 260, 430], "undefined"); //Add a group
      g.orientation = "column";
      g.alignment = "left";
      var exportContentBtn = g.add(
        "button",
        [10, 10, 260, 40],
        "Export Content"
      ); //Add a button to that group
      exportContentBtn.onClick = function() {
        DynamicContentToJSON.dcMain.onExportAllClick();
      };
      var testExportBtn = g.add("button", [10, 10, 260, 40], "Test Export"); //Add another button to that group
      testExportBtn.onClick = function() {
        DynamicContentToJSON.dcMain.onTestExportClick();
      };

      // Tempoarily remove Validator as it doesn't work
      // var validatorBtn = g.add("button", [10, 10,260, 40], "Validator");
      // validatorBtn.onClick = function(){
      //   DynamicContentToJSON.dcMain.onValidateClick();
      // };
      ///
      var uniquifyBtn = g.add("button", [10, 10, 260, 40], "Uniquify");
      uniquifyBtn.onClick = function() {
        DynamicContentToJSON.dcMain.onUniquifyClick();
      };
      EXPORT_DETAILS_VISIBLE = true;
      updateUILayout(expDetailGrp); //Update UI
    } else {
      var kids = expDetailGrp.children;
      var numKids = kids.length;
      if (numKids > 0) {
        //Verify that at least one child exists
        expDetailGrp.remove(kids[numKids - 1]); //Remove last child in the container
      }
      EXPORT_DETAILS_VISIBLE = false;
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
  function setMarker(markerComment, markerChapter) {
    //Log.trace("--> setMarker: " + String(markerComment));
    app.beginUndoGroup("Make Makers");

    var comp = aeq.getActiveComp();

    if (!aeq.isComp(comp)) {
      var msg = "Please activate a comp before making markers.";
      alert(msg);
      // Log.warning("<-- setMarker: " + msg);
      return;
    }

    aeq.getSelectedLayers(comp).forEach(function(layer) {
      var marker = new MarkerValue(markerComment, markerChapter);
      aeq.getMarkerGroup(layer).setValueAtTime(comp.time, marker);
    });

    app.endUndoGroup();
    //Log.trace("<-- setMarker: " + String(markerComment));
  }

  //// GET ALL MARKERS FROM PROJECT
  function refreshMarkers() {
    var groupMarkers = LoopMarkers.getMarkers(app.project.activeItem);

    if (groupMarkers.length < 1) {
      addMarkerGrp(grpMarkersGrp, { id: "1", text: "group 1" });
    } else {
      var unique = new Array();

      for (var u = 0; u < groupMarkers.length; u++) {
        if (findInArray(unique, groupMarkers[u].id) === false) {
          unique.push(groupMarkers[u]);
        }
      }
      unique.sort(function(a, b) {
        return (a.id > b.id) - (a.id < b.id);
      });
      MARKER_GROUPS_ARRAY = [];
      for (var m = 0; m < unique.length; m++) {
        addMarkerGrp(grpMarkersGrp, unique[m]);
      }
    }
  }

  function writeArrayToFile(arr) {
    var curAppFile = app.project.file;
    var tmpPath = curAppFile.parent;
    var parentFolder = tmpPath.parent;
    var filepath =
      parentFolder.fsName + "/" + curAppFile.displayName.split(".")[0] + ".txt";
    var textOutput = "MARKER LIST\n";

    for (var e = 0; e < arr.length; e++) {
      var line = "\n" + arr[e].id + " - " + arr[e].text;
      textOutput += line;
    }

    SaveMarkerFile.saveFile(textOutput, filepath);
  }

  ////////////////////////////////////////
  ///////////// END FUNCTIONS ////////////
  ////////////////////////////////////////

  //// UTILS
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

  function findItemById(id) {
    for (var item = 1; item <= app.project.numItems; item++) {
      var curItem = app.project.item(item);
      if (curItem.id === id) {
        return curItem;
        break;
      }
    }
  }

  function isWindows(){
    return $.os.indexOf("Windows") != -1;
  }

  function getByValue(arr, value) {
    for (var i = 0; i < MARKER_GROUPS_ARRAY.length; i++) {
      if (arr[i].id == value) return arr[i];
    }
  }
  function getIndexByValue(arr, value) {
    for (var i = 0; i < MARKER_GROUPS_ARRAY.length; i++) {
      if (arr[i].id == value) return i;
    }
  }

  function sortArray(a, b) {
    return (a.id > b.id) - (a.id < b.id);
  }

  function getUserDataFolder() {
    var userDataFolder = Folder.userData;
    var aescriptsFolder = Folder(
      userDataFolder.toString() + "/Aescripts/new_project/yourImg"
    );
    if (!aescriptsFolder.exists) {
      var checkFolder = aescriptsFolder.create();
      if (!checkFolder) {
        alert("Error creating ");
        aescriptsFolder = Folder.temp;
      }
    }
    return aescriptsFolder.toString();
  }

  function createResourceFile(filename, binaryString, resourceFolder) {
    var myFile = new File(resourceFolder + "/" + filename);
    if (!File(myFile).exists) {
      if (!isSecurityPrefSet()) {
        alert(
          "This script requires access to write files. Go to the  General  panel of the application preferences and make sure  Allow Scripts to Write Files and Access Network  is checked."
        );
        try {
          app.executeCommand(2359);
        } catch (e) {
          alert(e);
        }
        if (!isSecurityPrefSet()) return null;
      }
      myFile.encoding = "BINARY";
      myFile.open("w");
      myFile.write(binaryString);
      myFile.close();
    }
    return myFile;
  }
  function isSecurityPrefSet() {
    try {
      var securitySetting = app.preferences.getPrefAsLong(
        "Main Pref Section",
        "Pref_SCRIPTING_FILE_NETWORK_SECURITY"
      );
      return securitySetting == 1;
    } catch (e) {
      return (securitySetting = 1);
    }
  }
})(this);
