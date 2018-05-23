(function(thisObj) {
  ImportScript.runScript("dynamicContentToJSON/dynamicContentToJSON.jsx");

  ///// Globals Variables
  
  var EXPORT_DETAILS_VISIBLE = false;
  
  var MARKER_GROUPS_ARRAY = [];
  var SCRIPTNAME = "DC To Json User";
  var SCRIPTVERSION = "1.0.0";
  var MARKERS_DEFAULTS = [
    { id: "Script", text: "Script" },
    { id: "Location", text: "Location" },
    { id: "Comment", text: "Comment" },
    { id: "Reaction", text: "Reaction" },
    { id: "Date", text: "Date" }
  ];
  var SUBGROUP = ["",1, 2, 3,4, 5, 6,7, 8, 9,10, 11, 12];

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

  ///// TITLE GRP
  titleGrp = win.add("group", [0, 0, 300, 20]);
  titleGrp.orientation = "row";
  titleGrp.alignment = "left";
  title = titleGrp.add("statictext", [0, 10, 50, 20], "v" + SCRIPTVERSION);

  ///// ORGANIZE PANEL
  orgPanel = win.add("panel", [10, 10, 300, 80], "1 - SIMPLIFY PROJECT");
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

  ///// MAKE MARKERS PANEL
  mrkPanel = win.add("panel", [10, 85, 300, 370], "2 - MARKER MAKER");
  mrkPanel.orientation = "column";

  dynamicGrp = mrkPanel.add("group", [10, 0, 300, 80], "undefined", {
    orientation: "row"
  });
  dynBtn = dynamicGrp.add("button", [10, 10, 300, 40], "DYNAMIC");
  dynBtn.onClick = function() {
    setMarker("dynamic");
  };
  alignGrp = mrkPanel.add("group", [10, 60, 400, 110], "undefined", {
    orientation: "fill"
  });
  centerBtn = alignGrp.add("button", [10, 10, 150, 40], "CENTER TEXT");
  centerBtn.onClick = function() {
    setMarker("textVAlign=.5");
  };
  bottomBtn = alignGrp.add("button", [10, 10, 150, 40], "BOTTOM TEXT");
  bottomBtn.onClick = function() {
    setMarker("textVAlign=1");
  };

  reactionGrp = mrkPanel.add("group", [10, 120, 385, 180], "Group Markers", {
    orientation: "row"
  });
  reactionGrp.alignment = "center";

  // emojis reactions buttons
  var wowString =
    '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\tpHYs\x00\x00\x00\'\x00\x00\x00\'\x01*\t\u0091O\x00\x00\x05\u00F2iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\u00EF\u00BB\u00BF" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmp:CreatorTool="Adobe Photoshop CC 2018 (Macintosh)" xmp:CreateDate="2018-05-21T15:09:51-07:00" xmp:ModifyDate="2018-05-21T15:49:52-07:00" xmp:MetadataDate="2018-05-21T15:49:52-07:00" dc:format="image/png" photoshop:ColorMode="3" photoshop:ICCProfile="sRGB IEC61966-2.1" xmpMM:InstanceID="xmp.iid:cb0f6bff-cb76-4e68-a33a-db090e118efe" xmpMM:DocumentID="xmp.did:95cf2852-43fc-46f6-a83e-5d70e93d2e15" xmpMM:OriginalDocumentID="xmp.did:95cf2852-43fc-46f6-a83e-5d70e93d2e15"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action="created" stEvt:instanceID="xmp.iid:95cf2852-43fc-46f6-a83e-5d70e93d2e15" stEvt:when="2018-05-21T15:09:51-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)"/> <rdf:li stEvt:action="saved" stEvt:instanceID="xmp.iid:cb0f6bff-cb76-4e68-a33a-db090e118efe" stEvt:when="2018-05-21T15:49:52-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)" stEvt:changed="/"/> </rdf:Seq> </xmpMM:History> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>\u00EF\u00ED\u00C1\x04\x00\x00\x03\u0085IDAT8\u008D}\u00951L[W\x14\u0086\u00BFs\u00DF{6\u00C6\u00B6h\u008CH\b\u00B5\u0088\u00C8@\b\u00AD\u00DA\u0089\u00A2T\u0091XJT"\x15\u00A9C\u00B3\u00B4kD\u0088\u0094\fM\u0098:T]\u00BA\u00A4\u0095\u00AA\fN\u0096\u008Em\x07"U"R\u0082J\u00A5P2 0\x12C\x10\u0082D\x02B)\u008E \b\x07\u00A8k\u00FB\u00D9\u00F7tx\u00C6\x18K\u00ED\u00BF\u00BD\u00F3\u00EE\u00FD\u00EE\u00B9\u00E7\u00FD\u00E7<)\u00BF\u00B8\x05\x00\n\x126HY\u00A1#\n8g\u00F5y\u00F6c\u0085^\u008C\u009C\x06\u00C0jF`F:\u00DF\x1A\u0087\u00F2\n\u00AB\x7F\u00A3\u008E\u00A0\x05\x0B\x12`\\jUV\u0088\u00B9P\u00D2n\u00A4tM\x12\u00A1~\u00DD.ta\u00A4\u00FA^Z\u00C2\x1FP.u\u00A1\u00DC\'\u00E6.rP:\u00860\u00C7\u009Eb.\u0099\u009D\u00E2\u00F0\u00D0\u00D5t\u00BA\x7F`\u00EA\u00C6\u00EC|\u00B6\u00CB\u009C\u008C \n\u00A2`NF\u0098\u009D\u00CFv\u00F5\x0FL\u00DD\x18\u00BA\u009ANgv\u008A\u00C3\u00C4\u00DC\u00FF\x00\n\u0088\u0091\u00D4\u00DA\u00F2~\u00AA=\x19i\x1C\u00B8\u00D4\u00CA\u00C2\u00D2\x1E\u008A"\x06\u00C4\u0080\u00A2,,\u00ED1p\u00A9\u0095\u00F6d\u00A4qmy?%FR\u0087\u00D7\x05\u0090j\ra\u0098\u00A2M\u0099\u0088\x03\x1D\u00CD\u0080\u0085\u008D7\u00D8}\x1F\u00BC\u00CA\u00B9\u00BE\u00C5\u00C4=H6\x05\u00B9\u00AC\u00EE`\u00FF)C\u00C8\\\x07\u00EE\u00D5fx\x16\u00B8\u008B\'\u0090\u00F0\u0098z\u00B8\u00C2\u00B3\u00A7\u009B\x102\u00E0\u00D4\x1C\u00EF\b\u0084\f\u00CF\u009En2\u00F5p\x05\x12\x1Ex\x02p\u00B7\u00C2\u00C0\x00\x1D\u00C0\u0088(\u00AEi\u008B0;\u0097\u00A5op\u0092+Cs\u00E4\x1C0M\x1Eh\u00E0\x02\u00D3\u00E4\u0091s\u00E0\u00CA\u00D0\x1C}\u0083\u0093\u00CC\u00CEe1m\x11Dq\u0081\x11\u00A0\u00C3\x00\u0083\u00C0e1@\u00D4\u00E5\u00C7\u009F_\x02\u0096\u00B5\u008D\x1C\u00AF3y\u0088\u00D6\x14=\u00EA\u00F2:\u0093gm#\x07\u00D8`m\u00D4E\u0082{^\x06\x06\r\u00D0\x03\u00B4\u00AB\x06\u00B6x\u00E7\\\x1C(p\u00B1\'A\u00F2L\x14\u00CD\u00FA\x18\x03F@\u00B3>\u00C93Q.\u00F6$\u0080B\u00B0\u00B6\u00AC\u00A8\x02\u00D0\x0E\u00F4H\u00F9\u00C5\u00AD\u00DF\u0080~\x14\u00A4\u00C1P\x06~\u00FAu\u0093\u008F\u00FAZx\u00BB\u00D9\x03\u00C7@K80\u00EE\u00AB<\u00A8\u00F2\u00D7\u008E\u00CF\u00EF\x7Fl\u00F3\u00F9\u00A7m8\u0080\u00E6\u00AB\u00C6\u009E8\x02\x02\u0094,\u00A6\u00D1\u0085\u00F6F\u00C8\u00E4\u00C1\x13\x0E\u008A\u0096\u00AF\u00BE^\u00C0q\u0084o\u00BFy\u0097\x06\t\f@k\x03\u00AC\u00E7\u00B0\u00B9\x12\u00B8U\u00F7M\u00B8\u00C0V\u00B5F\u00AE\u00C1\x16-\u00B2\u00BC\u008F\u00C4\x1C\u00F2\u00E2\u00F2\u00C9\x173L>y\x05(K/s\u008C\u00FDr\x01\u00F7\u00C0G\u0097\u00F7QGja\x00[\x06H\x03\u00EB\u00B5QU\u00E0T\u0084\u00D1\u00D1\r&\u009Flq\u00EE\u00FD\x04\u009D\u00EF%x<\u009E\u00E1\u00C1\u0083?\u00E1T\u00E4\u00B0n\u00B5Z\x07\u00D2\x06\x18\x03\x1E\x1D\u00D1@B\x06|en~\x17\u00E2.\u00A2\x1A\x186\u00EE1\u009D\u00DE\rz:d\x02;\x1D\u00E9\x110f\u0080U\u00E0\x0Ep\u00D4\u00E5&H\u00B3\u00EC[\x10\u00A9\u00FA\x10\x11J\u00BE\x05\u00AB\u00F5S\u00A0Ta\u00AC\x1E\u0086W\u0080\u009B\x00\b\u00C18\n\x1B\u00CEw\u00C7a\u00AF\x10x\u00C6\x11\u00D8+\u00D0}>\x0EasldU\u00F6\u00AE\u00C0\u00F1^\x06H\x01\u00C3X\u00C54y\u00EC\u0096\u0094\u0081\u00CF\u00A6\u0099\u0099\x0E\u00BE[\u00EF\u0085\x16\x1E\u008F~\u00C8\tW\u00B0o|*c\u00ED\x1Ep\u00FD\x10P\x0F\x04\x18\x06\u00BE\x13_\x1B\u00E5t\x03\x07\u00B9\x12w\u00BE\x7F\x0E\u00C0\u00C8\u0097\u009D\u00C4\u00A2.\u009A\u00C9\u00A3\u009E\u00E4\u0080\u00DB\x15 \u00FF\x07\x04\u00E8\x06\u00AE\u00E1\u00DB~\u00D3\x1C\u00EE\u00A2%\x1CD\u00B7\x0B\u00D8\u009D\u00C2\x12\u009E\u0099\x00\u00EE\x03\u008B\u00F5\x1B\u00DD\u00FA@E\u008B\u00C0\x0F\u00B8\u00B2\u00A4\u00D9b\u00AFx\u00C1/@w\u008B\x19\x1C\u0099\x01\u00C6\x0FkV\u00AF\x7F\x01\u0092Yd\u00D1yY1\x7F\x00\x00\x00\x00IEND\u00AEB`\u0082';

  wowBtn = reactionGrp.add(
    "iconbutton",
    [20, 00, 40, 20],
    ScriptUI.newImage(
      createResourceFile("wow.png", wowString, getUserDataFolder())
    ),
    { style: "toolbutton", toggle: 0 }
  );

  wowBtn.onClick = function() {
    setMarker("reactionWow");
  };
  var loveString =
    '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\tpHYs\x00\x00\x00\'\x00\x00\x00\'\x01*\t\u0091O\x00\x00\x05\u00F2iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\u00EF\u00BB\u00BF" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmp:CreatorTool="Adobe Photoshop CC 2018 (Macintosh)" xmp:CreateDate="2018-05-21T15:09:50-07:00" xmp:ModifyDate="2018-05-21T15:49:56-07:00" xmp:MetadataDate="2018-05-21T15:49:56-07:00" dc:format="image/png" photoshop:ColorMode="3" photoshop:ICCProfile="sRGB IEC61966-2.1" xmpMM:InstanceID="xmp.iid:a981695a-408b-4d51-bf85-48110639169a" xmpMM:DocumentID="xmp.did:b819d2ad-d67b-4135-b382-fef52fff21ec" xmpMM:OriginalDocumentID="xmp.did:b819d2ad-d67b-4135-b382-fef52fff21ec"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action="created" stEvt:instanceID="xmp.iid:b819d2ad-d67b-4135-b382-fef52fff21ec" stEvt:when="2018-05-21T15:09:50-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)"/> <rdf:li stEvt:action="saved" stEvt:instanceID="xmp.iid:a981695a-408b-4d51-bf85-48110639169a" stEvt:when="2018-05-21T15:49:56-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)" stEvt:changed="/"/> </rdf:Seq> </xmpMM:History> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>\u00EA0\u0091\x0E\x00\x00\x02\u00C7IDAT8\u008D\u008D\u00D4\u00CBk]U\x14\x06\u00F0\u00DF\u00D9\'7\u00BD\u0089y\u00DA\u0090&\u008D%\u00D8\u00E0\x0B\t\nZ\u00C1:3\u0093\u008E\u00F5\x1F\x10\u00ACR,\u00B5\x15q \u0082\x14\u0083#\u00A9-\x04\x11L\x15\u00A7\x0E\u0084 \u00B4\t\u00A9!\u00B5Pl\x15-\u00D2IT\u00ACBZbj\u00AF\u008D!\u00CD\u00E3>\u00CEqp\u00EE\u00AD7Wc\u00FB\u00CD\u00CE\u00B7\u00F6\u00FE\u00F6:k}kE\u00CB\u00CF\x1D\u00F0?h\u00C3\b\u0086\u0091\u00E2\x07\u00CC`m\u00AB\x0BM[\u00F0\u00C3x\u00A5*6\u0084P\u00E5+\u00F8\x19\u00D3\u00F8\x10s\u008D\x17C#\u0081#\u00F8\x06\x07\u00F0@\u00C3\u0099\x18\x0F\u00E3U|\u008B\u0097\u00EE$xR\u00EA\u00B8\x10\u00F2\u00E2\u0098\x10\u0088\u00E3:\u00B9:.\u00846\u00A9\u008Fp\u00BC^\u00A0\u00FE\u0097\x0F\u00E3E\u00B9XzsY\u00BA\u00B4L\u009A\u00D2\u009C\x13v\u00EE\x00\u00C9\u00B5\u00DF)\u0096\u0088"QW\u0087\u00A8\u00BB\u0083r\u00E5\u0088\u00AC\u00B6\u009FBTm\u00CA\u0083\u0098\u0093k\u008A\u0092\u0085\u00EBB\u00EFv\u00B9\u0091g\u0084\u009E{\u0095\u00BE\u00BB\u00AC<\u00F3u\u00F6\u00FA\u00C8\u00D3rO\fKn\u00FC\u00A94s^r\u00BD \u00F4\u00F7R*\u00AFW5\u00E6k\u0082\u00E3\u00A2h\x7Fz\u00F3/\u00DAZ\u00B5}\u00F0\u008Ep_\u00FF\u00ED\u00D4W\u00DF:\x06Z\u00DF}\u00FD6\u0097\\]\u00B0r\u00F0mVVE\u00DD\u009D\u00A4\u00E9\t\x1C\u008B\u00DF|\u00E4\u00C9v\u009C@G\u00BAX\u00D0r\u00F8\x05MO=\u00BE\u00A9\u00B0\u00B9\u0091\u00BDr#{7qQG\u00BB\u00A8%\u00AFt\u00E6\u00BC\u00A8\u00B3\x1Dz\u00F0G\u00C0\u00B3\u00D8\u00A9\u009C\u0088\u00DA[\u00C5\u00BBw56nK\u00C4\u00BBw\u0089\u00DA[)\'0\u0088=\x01\u008F!\x12"\u00E9\u00FA\u0086\u00A4\u00B0t\u00D7\u0082IaI\u00BA\u00BEA\u0088 \u0087\u00BE \u009B\x00\u00E2@%Q\u009C<{\u00D7\u0082\u00C5\u00C9\u00B3T\u0092\u00ECn\u00864\u00E0{\u00A4\u00D2T\x18\u00E8S\u009A:\u00A7xz\u00F6\u00CEb\u00A7g\u0095\u00A6\u00CE\t\x03}\u0099\u00BD(b!\u00A4\u00CCb\x1E\u0099\u00E7\u00FA{\u00AD\u008D\u008E)_\u00B8\u00B4\u00A5X\u00F9\u00C2%k\u00A3c\u0099e\u009As5\u00FA7\\\f\u00A9h5\u00E5Tv\u00B2\u009C\u00995\u009Fw\u00EB\u00D0Q\u00C5\u0089\u00E9\x7Fg61\u00ED\u00D6\u00A1\u00A3\u00E4\u00F3Uc\u0097k\u00A1\tL\u00D6|x?~\u0094\x15\u0096\u00E6\u009C\u00B4\u00B0$Y\u00BCa\u00DB\u00F3\u00FB\u00B4\u00BC\u0091\u008D\u00EC\u00DA{\u00E36>\u009F\x12v\u00F4\u0088\u00B6weS\u0093aEf\u00EC\u0085\u00DA\u00E8\u00FD*\u00DB.\u00E3Y\x1A%QW\u0087\u00F8\u009E\x16\u00C5/\u00BET\u00F9\u00E9\n\u00A8\u00CC]\u00C9l\u0095\u00CB\u00D5\u008B\u00C1~,\u00B0y\u0096O\u00E2Q\u00D9\u00B6\u00A1R\u00A1)\x16\u0086\x06%W\x17A\x18\x1A$\u00A9d\u00B1\x7F0\u008A\u00CFj\x1F\u008D\u00FB\u00F05\\\u00C6\u00FB\u00E8\u0094\u00A4$eQO\u00B7Z\u008D\u00EBP\u00C0\u00C1z\u00B1\u00FF\x12\u0084O\u00F0\x15^\u00C6><$M\u00B7Uck\u00B2\u00A5z\n\x1F\u00CB:\u00BB\t[m\u00EC_0&k\u00D4\x1E\fT\u00F9y\\\u00C4\x19\u00D5\u009A5\u00E2o\x02-\u00EFN\u00C3?t\u00CC\x00\x00\x00\x00IEND\u00AEB`\u0082';
  loveBtn = reactionGrp.add(
    "iconbutton",
    [20, 00, 40, 20],
    ScriptUI.newImage(
      createResourceFile("love.png", loveString, getUserDataFolder())
    ),
    { style: "toolbutton", toggle: 0 }
  );
  loveBtn.onClick = function() {
    setMarker("reactionLove");
  };
  var likeString =
    '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\tpHYs\x00\x00\x00\'\x00\x00\x00\'\x01*\t\u0091O\x00\x00\x05\u00E9iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\u00EF\u00BB\u00BF" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmp:CreatorTool="Adobe Photoshop CC 2018 (Macintosh)" xmp:CreateDate="2018-05-21T15:09:48-07:00" xmp:ModifyDate="2018-05-21T15:50-07:00" xmp:MetadataDate="2018-05-21T15:50-07:00" dc:format="image/png" photoshop:ColorMode="3" photoshop:ICCProfile="sRGB IEC61966-2.1" xmpMM:InstanceID="xmp.iid:da51a62d-e2d4-487c-9533-91bd774d69b7" xmpMM:DocumentID="xmp.did:20c46d75-3a63-43ce-b11b-f94ab1dffe6e" xmpMM:OriginalDocumentID="xmp.did:20c46d75-3a63-43ce-b11b-f94ab1dffe6e"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action="created" stEvt:instanceID="xmp.iid:20c46d75-3a63-43ce-b11b-f94ab1dffe6e" stEvt:when="2018-05-21T15:09:48-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)"/> <rdf:li stEvt:action="saved" stEvt:instanceID="xmp.iid:da51a62d-e2d4-487c-9533-91bd774d69b7" stEvt:when="2018-05-21T15:50-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)" stEvt:changed="/"/> </rdf:Seq> </xmpMM:History> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>\u009C\x06\u00B57\x00\x00\x02\u0093IDAT8\u008D\u0085\u00D4Oh\\U\x14\x06\u00F0\u00DF\u00BD\u00F3&3\u00E4\u008F\u00B1\u00E8\u00A2j\u008A\x05\u00FF\u00A2\u00B4\u00EAb\x10\x05E\x14AE7\u00BA)\x05Ai-"\u00A8Qp\u00EB\u00C6\u00A5\x0B\x05\u00C1\u0082V]\u00BB\x10\u00DC\x14A\x11\u00E9J\u00A2PQ7J\u00D1JCM\u00D0\u00A4\u00924\u0099$3}\u00EF\u00BAxo\u0092\u00C9\u00CCD\x0F\\x\u00EF\u00DC\u00F3}\u00F7\u009C\u00EF\u00DEs\u00C2\u00B3\u009F\u00AC\u00FB\x0F\u009B\u00C4#8\u0084\u0084\x1F\u00F156\u00F6\x02d{\u00F8\x0F\u00E1\u00A5\u008A\u00EC&\u00C4\u00CA\u009F\u00E3\x1C\u00BE\u00C4I\u00FC2\b\u008C\u0083\x0E\u00CC\u00E2;\u00BC\u0088[\x06bj\u00B8\x1D\u00AF\u00E0{\u00BC\u00F0\x7F\u0084\u00A7\u00F0\x0E\u009A\u0083\u0081\u00A1Z}6\u0089\x0F\u00AA\u00F8\u0091\u0084\u00AF\u00E2\u00D8\u0088\u008C\u00D5\x02\x7F\u00AF%\u0097\u00DAI6\\\u00D3,\u009E\x1B$\u00BCu\u00F0\u00A4~[\u00DDL\u009E\u00BE\u00BB\u00EE\u00C1\u009Bk\u0096\u00D7\u00D3\u00A8\u0090\u00938\u00D0O\u00F8\u0086\u00A1\u008A\u0088\u0081n\u00C1\u00E2j\u00F2\u00CC=u\u00CF\u00DF\u00DFP$\u00F2b(\u00B8\u0089\u00D71\x131\u0085\u00C7\u00FBwC\u00A0\x16K\u00D0\u0085\u00E5\u00C2\u0091V\u00DD\u00F4x\u00F0\u00D3\u00C5\u00DC\u00FC\u00A5\u00C2\u009F+\u00C9\u00E5\u00AD\u00A1\u00F2\u009F\u00C4\x13\x19\x1E\u00C6\u00F5=o\x16YZ+\x01\u009BW\u00B8\u00EF`\u00CD\u00CB\x0F5\u00C0\u00E2j\u00E1\u00D1;2\u00FB\u00AF\u008A\u00CE/\x15\u0096\u00D7\u0092\u00FA\u00CE\u00C3\u00BB\x11\u00AD\fw\u00F5\u00CAM\u00A9\u00D4\u00EB\u00DE\u00835\x07\u00AE\u0089\u00E6\u00CE\u00E7N<0\u00B6\u008D8\u00DA\x1As\u00B4U~\x7F\u00F6C\u00C7\u00FBg:f\u00F6E\u00A9\u0094\u00B5\u008E\u00FD\u0099\u00B2\x03\x04\u00E4\u0089\x7F\u00DA\u00C9S\u0087\u00EB\x0E\u00CF\u00D4\\;\u00D1\x15G\u00BDT$A\fC\u00B2\u00A7(8[%\u0087R\u00BB\u00D5\u00AD\u00F2o\u00BDC\u00BB3\u009Apq%\x11R\u00FF\u00E5t\u00B0\x10\x15\u00E9\x1B\u00CC\u00EF:\u00A6b\u008F\u0081\u00A9\u00E6P\x16\u00E0\u00DC_\u00B9\u00B1Zy\u0081\u0095\u00FD\u0081\u00B9Hj\u0093N\u00F7\u00FCy\u00C1\u00BE\u00F1\u00B0\u009D\u00ED\u00C2J\u00A1\u009B\u00D3\u00EE$\u00EDN\u00D2\u00CD\u0093\u0085\u0095\u00E4\u00F2f\u00D2\u00AC\x07\u00C5\u00CE\u00B3\u00FC\x1C_dB\u0084\u00B7\x13\u00C7cP\u009Fh\x04\u00DF\u00FE\u009E\u00EB\u00E6\u00FC|1w\u00F6B\u00EE\u00BA\u00E9\u00EE60b\u00A3\u009Bt\n&\u00C6B\u00AF\u009A5\u00BC\u008B\u0085\u00D07\u00BE\u008E\u00E3\u00C3,\u00B2\u00B4\u009E\u00B4\u00B7\u00B8z<\u00C8"\x1BWv\u00B4J\u0089\u00AC\x16L6\u00FA\u0084\u00E7\b>e\u00F7\u00F8:\u0085;\u00F3\u00C2\u00ECt3\u0098j\x10c\u00D9\u00C7\u00CD\u00FAn\x1D\u0093]do\u00F5\u00C8z\x15\u00F4\u00DBk\u0089c!X\u00C9\u00AAN)\u00D2\u00F0\u00AA\u00C8\u0096\u00AB\u00CC\u00DE\u00EC\'\x185`?\u00C6\u0099\u00C4\t<\u0086\u00DB\u00D0\u00A8\u00F66\u0094C\u00F54>R\u00DE\u00EC.\u00DBkb\u00FF\u0086\u00F7\u00F0+Z\u00B8\u00A1\u00F2\u00CFc\x0E_aa\x14\u00F0_\u00C4\u00DF\u00EC\u00E3\u00C9I\u0082\u00F1\x00\x00\x00\x00IEND\u00AEB`\u0082';
  likeBtn = reactionGrp.add(
    "iconbutton",
    [20, 00, 40, 20],
    ScriptUI.newImage(
      createResourceFile("like.png", likeString, getUserDataFolder())
    ),
    { style: "toolbutton", toggle: 0 }
  );
  likeBtn.onClick = function() {
    setMarker("reactionLike");
  };
  var hahaString =
    '\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\tpHYs\x00\x00\x00\'\x00\x00\x00\'\x01*\t\u0091O\x00\x00\x05\u00F2iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin="\u00EF\u00BB\u00BF" id="W5M0MpCehiHzreSzNTczkc9d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/05/06-01:08:21        "> <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"> <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmp:CreatorTool="Adobe Photoshop CC 2018 (Macintosh)" xmp:CreateDate="2018-05-21T15:09:47-07:00" xmp:ModifyDate="2018-05-21T15:50:03-07:00" xmp:MetadataDate="2018-05-21T15:50:03-07:00" dc:format="image/png" photoshop:ColorMode="3" photoshop:ICCProfile="sRGB IEC61966-2.1" xmpMM:InstanceID="xmp.iid:bfc33f69-176a-45fe-b9f0-67048cb337e7" xmpMM:DocumentID="xmp.did:e21f4edd-aa85-4a98-81e5-7659868feb95" xmpMM:OriginalDocumentID="xmp.did:e21f4edd-aa85-4a98-81e5-7659868feb95"> <xmpMM:History> <rdf:Seq> <rdf:li stEvt:action="created" stEvt:instanceID="xmp.iid:e21f4edd-aa85-4a98-81e5-7659868feb95" stEvt:when="2018-05-21T15:09:47-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)"/> <rdf:li stEvt:action="saved" stEvt:instanceID="xmp.iid:bfc33f69-176a-45fe-b9f0-67048cb337e7" stEvt:when="2018-05-21T15:50:03-07:00" stEvt:softwareAgent="Adobe Photoshop CC 2018 (Macintosh)" stEvt:changed="/"/> </rdf:Seq> </xmpMM:History> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end="r"?>\x18r\u00C7\u009B\x00\x00\x03.IDAT8\u008D\u0095\u0095\u00CFoTU\x14\u00C7?\u00E7\u00BE;?\u00DB\u008E\u009D\u00990\u00B1\u0086\u00A2L\b\x12Y\u00B1(D\u00A5\x014F\u00D2\u0085.\\\u0089\x1B\x17\u00980\x10\u00D8`\u00D7\u00FE\x01\u00BA \u0090\fv\u00C5\u00C6&\x04KHY\x10]\x185\u00D1\x18\u00C2\u00D2Hj\u00B0\u008D\u00D5\t\u009063\u00A5R\u0087\u00C7\u00FBq\u008F\u008B\u00F7\u00A65\u00E3\u0094\u00C4\u00B3{\u00F7\u00BE\u00FB9\u00DF\u00F3\u00BE\u00E7\u009D+\u00F1\u00BD\u00F3l\x13u\u00E08p\b\x18K\u00D7\x1E\x00\u00B7\u0081\u00AF\u0080\u00A5A\u0087\u00EC6\u00B0W\u0080S\u00C0[\u00C0\u00BE\u00BE\u00BD\u0083\u00E9\u00DA\u00E7\u00C0\u00DD\u00FE\u0083f\x00\u00AC\x01\u00DC\x01\u00CE\x0E\u0080\u0091\u00AE\u009DM\u00DFi<\x1B(4q\u00DA$\u00D2\u00E26\u00CA\u00B7"\u00D2"N\u009B\b\u00CD\u00ED\u0080\r\x02m\u0098j\x0ES\x1F\u00C2d\f\u00C6\u00E9\x7F8\u00C6i\u00B2W\x1F\u00C2Ts\x10h\u00E3\u00DFJ{\u00C0\u00BA\x11.\u009A\x1D9\u00AE\u00DFh13\u00B3\u0088V\n0V\u0080\u00D0m\u00D1B\x07c\x05\u00B4R`ff\u0091\u00B9\x1B-\u00CC\u008E\x1CF\u00B8Hb"\x06\u00D8\rL\u00ABbU\u0094\u00CA\u00F80\u00B3s-\u00F6O\u00CEs\u00F5\u00DA2fg\x11\x01\x040;\u008B\\\u00BD\u00B6\u00CC\u00FE\u00C9yf\u00E7ZT\u00C6\u0087QQT\u00B1\u00C04\u00B0\u00DB\x02\u00EF\x00S\u0089^a\u00A3\x1Ba\u009DR-e(d\rD\n\u00AA\u00BD\u00EFF!k\u00A8\u00962X\u00A7\u00FC\u00DD\u008D\u00C0HO\u00FF\x14\u00B0 \u00F1\u00BD\u00F3_\x00\x1F\u0088\u0080\f[\u00BE\u00F9\u00B1M\u00E4\to\u00BF\u00FB"\x10\u00C1\u00FD.d\u00CCV\u00C9/\x14\x01\u00CB\u00D7\u00F3\u00CB\u00D8Xy\u00F3\u00F5*\u00BA\x11\u00F5r\u00CEZ\u00A0\x06\u0089\b]\x0B8<Q\u00C1\u00E4\f\x1B\u00BF\u00B4\t"\x05\u0093\u0094\x0B\u00A0\x00\u00AB\x01Y+\u00BC\u00F1j\x15\u00E7;\u00DCZ\x00v\u00D3\u00DB\u00DAfc\x1Bk\u00A0\u009A\u00E3\u00C4\u0087\u00B7\u00F9\u00FE\u00A76\u00E3/\x15y\x1C\u00C4\x04\u00AA\u00C4izO\u0084\u00AC\b#Y\u008F?\x7F\u00EFr\u00E4\u00B5*\u00D7\u00AF\x1C\u0082\u00F5\x10\x17%\u00E6Y`\x05\u0080\u00D8A)Cy4K{u\u008Dv\u00C1Q\u00C5R\u00F2,#\u00E2\x01\u00F0D\x1D\u008F\u00E2\u0090E\u009E\u00C0\u00EA:\u00E5\u00D11(e\u00A0\u00F3\u00B4\u00A7k\u00C5\u0092t\u00FC\u00A4s\u00EC2A\u00C8\u0099\x13\u00BBx\u00FE[\u00E1\u00F0\u00DE\n{Jy*\u00E2\u0091\u0097\u00A4h_\u0095\u008E\u00C6\u00FC\u00F6\u0097\u00CF\x0F\u00AE\u00C3{\u00EF\u008FC\x10\u00E2\x1C \u00FC\x01\u00DC\u00B1\u00C0M`\x1F\u00C2)}\u00E0s\u00E0X\u0099\x03\'\u0087\u00E0\u00CB\x00J\x06r\x0E\u008D\u0093\u0092\u008B\u009EP\u00F1s\u00ECy\u0098\u00E7\u00F8G58\u0096E[>$\to\x017%\u009D6u\u00E0W"\u00ACy\u00CE\u00E0\u00E7\u0095\u00B5O7\u00C8\u00DC\u008A\u00B0y\u0083\u0097O\x14\u00C6\u00BE\x12\u00F9\u008Ep\u00CAR\u009E\x1E&\u00EF\x0Bn\u00DD\u0081%\x02^\x06\u0096z\u00A6,\x01\u00E7\u00B04\u00DD\u00BA#\u008FP\u00FBd\u0084\u00C7G\u009E\x12~\x17"\u009D\u00B4k*\u00909\u009A\u00A7|4\u0087\u00D7\u00D1\x1E\f\u00E0\\\u00CA@\u00FA\u00E6a\x13h\x10\u0083\u00C9\n\u00D4\u0084\x18p\u008F\x12\x07\u00CD\u00A8\u00C1\x03XQ\\\u00A0$\x0F\\\x06N\u00F7\x00\u00FD\u00F3\u00F04\u00F03\x1E\u009F\u00B9H\u008B\u00DCW\u008C\x01\u00CF&%\u00EBC\u0097\x18\x00\u00E0\u00D1\x05>N\u0081\u009B1h\x1E^\x06&\x10.!,\u00A8\u0082\x0B\x15\x17j\u00F27\b\x0B\b\u0097\u0080\u0089~\u00D8 \u0085\u00BD\u00B8\x0B\\\x00\x16\u00F8\u009FW\u00C0?\u00F2D8\x02L\u00CF\u00B2\u00ED\x00\x00\x00\x00IEND\u00AEB`\u0082';
  hahaBtn = reactionGrp.add(
    "iconbutton",
    [20, 00, 40, 20],
    ScriptUI.newImage(
      createResourceFile("haha.png", hahaString, getUserDataFolder())
    ),
    { style: "toolbutton", toggle: 0 }
  );
  hahaBtn.onClick = function() {
    setMarker("reactionHaha");
  };

  reloadGrp = mrkPanel.add("group", [10, 120, 385, 180], "Group Markers", {
    orientation: "row"
  });
  reloadGrp.alignment = "fill";

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
  assignMkrBtn.alignment = "left";
  assignMkrBtn.helpTip = "Update Comp Markers with new Names";
  assignMkrBtn.onClick = function() {
    var currentMarkers = LoopMarkers.getMarkers(app.project.activeItem);
    for (
      var mark = MARKERS_DEFAULTS.length;
      mark < grpMarkersGrp.children.length;
      mark++
    ) {
      var oldText = currentMarkers[mark - MARKERS_DEFAULTS.length].text;
      var kids = grpMarkersGrp.children;
      var btnGrp = kids[mark].children;
      updateGroupMarkerText(oldText, btnGrp[0].text, btnGrp[1].text);
    }
    refreshMarkers();
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
  reloadMkrBtn.alignment = "right";

  var grpMarkersGrp = mrkPanel.add(
    "group",
    [10, 115, 385, 200],
    "Group Markers",
    {
      alignment: "left",
      orientation: "column"
    }
  );

  mkrAddBtn = mrkPanel.add("button", [10, 10, 290, 30], "Add New Custom Group");
  mkrAddBtn.alignment = "center";
  mkrAddBtn.onClick = function() {
    addMarkerGrp(
      grpMarkersGrp,
      {
        text: "new group " + grpMarkersGrp.children.length
      },
      grpMarkersGrp.children.length
    );
  };

  ///// COLLECT PANEL
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
    LoopMarkers.layerMarkers;
    //writeArrayToFile(LoopMarkers.layerMarkers);
  };

  ///// EXPORT PANEL
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

  ///// UI FUNCTIONS
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

  /**
   * Add all the defaults Presets Markers
   */
  function addDefaultMarkers() {
    for (var def = 0; def < MARKERS_DEFAULTS.length; def++) {
      addDefaultMarkerGrp(grpMarkersGrp, MARKERS_DEFAULTS[def], def);
    }
    function addDefaultMarkerGrp(parent, values, index) {
      var newId = values.id;
      var newText = values.text;
      if (!newId) {
        newId = MARKER_GROUPS_ARRAY.length;
      }
      if (!newText) {
        newText = "group name " + newId.toString();
      }
      MARKER_GROUPS_ARRAY.push({ id: newId, text: newText });
      var mkrGrp = parent.add("group", [0, 120, 385, 180], "Group Markers", {
        orientation: "column",
        alignment: "fill"
      });
      mkrBtn = mkrGrp.add("button", [0, 10, 20, 30], index);
      mkrBtn.onClick = function() {
        var radioValue = this.parent.children[2].children[0].value
          ? "Left"
          : "Right";
        setMarker(this.parent.children[1].text.toLowerCase() + radioValue);
      };
      mkrBtn.helpTip = "Apply Group to Selected Layers";
      mkrLabel = mkrGrp.add("statictext", [30, 10, 180, 30], newId, {
        readonly: 1,
        noecho: 0,
        borderless: 0,
        multiline: 0,
        enterKeySignalsOnChange: 0,
        wantReturn: true
      });

      mkrSideGrp = mkrGrp.add("group", [0, 120, 385, 180], "Side");
      mkrSideBtn1 = mkrSideGrp.add("radiobutton", undefined, "Left");
      mkrSideBtn2 = mkrSideGrp.add("radiobutton", undefined, "Right");
      mkrSideBtn1.value = true;
      parent.orientation = "column";
      parent.alignment = "fill";
      mkrGrp.alignChildren = "left";
      updateUILayout(parent); //Update UI
    }
  }

  /**
   * Add Custom Marker Groups to UI
   * @param {Group} parent The parent UI Group to populate.
   * @param {Object} values Object with id and text properties
   * @param {Number} index The last Index of Children
   */
  function addMarkerGrp(parent, values, index) {
    var newId = values.id;
    var newText = values.text;
    if (!newId) {
      newId = MARKER_GROUPS_ARRAY.length;
    }
    if (!newText) {
      newText = "group name " + newId.toString();
    }
    MARKER_GROUPS_ARRAY.push({ id: newId, text: newText });

    var mkrGrp = parent.add("group", [0, 120, 385, 180], "Group Markers", {
      orientation: "column",
      alignment: "fill"
    });
    mkrBtn = mkrGrp.add("button", [0, 10, 20, 30], index);
    mkrBtn.onClick = function() {
      setMarker(this.parent.children[1].text.toLowerCase());
    };
    mkrBtn.helpTip = "Apply Group to Selected Layers";
    mkrLabel = mkrGrp.add("edittext", [30, 10, 220, 30], newText, {
      readonly: 0,
      noecho: 0,
      borderless: 0,
      multiline: 0,
      enterKeySignalsOnChange: 1,
      wantReturn: true
    });

    mkrLabel.addEventListener("keydown", function(key) {
      switch (key.keyName) {
        case "Up":
        key.currentTarget.text = changeSubGroup(key.currentTarget.text,"+");
        var list =  key.currentTarget.parent.children[2];
        list.selection = list.selection.index+1;
        
          break;
        case "Down":
        key.currentTarget.text = changeSubGroup(key.currentTarget.text,"-");
        var list =  key.currentTarget.parent.children[2];
        list.selection = list.selection.index-1;
          break;
        default:
          break;
      }
    });

    /**
     * Creates Subgroup Numbers with a # prefix
     * @param {String} currentText Group Name
     * @param {String} operator A string "+" || "-" to select subgroup
     */
    function changeSubGroup(currentText, operator) {
      var lookupPattern = /\d$/g;
      var hasSubGroup = currentText.match(lookupPattern);
      var newSubGroupNumber = (curSubGroup+1).toString()
      
      if (hasSubGroup) {
        var curSubGroup = parseInt(hasSubGroup);
        var labelText;
        switch (operator) {
          case "+":
            newSubGroupNumber = (curSubGroup+1).toString()
            labelText = currentText.replace(lookupPattern,newSubGroupNumber);
            break;
          case "-":
            if (curSubGroup > 1) {
              newSubGroupNumber = (curSubGroup-1).toString()
              labelText = currentText.replace(lookupPattern,newSubGroupNumber);
            } else {
              labelText = currentText;
            }
            break;
          default:
          labelText = currentText.replace(lookupPattern,"");
            break;
        }
      } else {
        labelText = currentText + "_1";
      }
      return labelText;
    }

    var subList = mkrGrp.add ("dropdownlist", [0,0,50,10], SUBGROUP); 
    subList.selection = 0;
    if(values.hasOwnProperty("subGroups")){
      for(var sub =0; sub <values.subGroups.length ; sub ++){
        var subNumber = values.subGroups[sub]
        subList.items[subNumber].checked = true;
      }
      subList.selection = values.subGroups.length;
      var hasSubGroup = subList.parent.children[1].text.split("_");
      subList.parent.children[1].text =  hasSubGroup[0]+"_"+String(subList.selection);
    }
    
    subList.onChange =  function () {
      var hasSubGroup = this.parent.children[1].text.split("_");
      var labelText;
      if(subList.selection === ""){
        this.parent.children[1].text =  hasSubGroup[0];
      }else{
        this.parent.children[1].text =  hasSubGroup[0] + "_"+ parseInt(this.selection);
      }
    }
    
    parent.orientation = "column";
    mkrGrp.alignChildren = "left";
    parent.alignment = "left";
    updateUILayout(parent); //Update UI
  }

  /**
   * Update all Markers in the comp with the latest name in the UI
   * @param {String} curText The current name of the group
   * @param {Number} id The index of the group in the UI
   * @param {String} text New Text to assign
   */
  function updateGroupMarkerText(curText, id, text) {
    var currentMarkers = LoopMarkers.getMarkers(app.project.activeItem);

    for (var m = 0; m < currentMarkers.length; m++) {
      if (currentMarkers[m].text == curText) {
        var layerComp = findItemById(currentMarkers[m].comp);
        var layerToSet = layerComp.layer(currentMarkers[m].layerIndex);
        var updatedMarker = new MarkerValue(text);
        layerToSet
          .property("Marker")
          .setValueAtTime(currentMarkers[m].time, updatedMarker);
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

  /**
   * Remove all children from a UI Group
   * @param {Group} parent The UI Group to clear
   */
  function removeAllChildren(parent) {
    var kids = parent.children;
    var numKids = kids.length;
    // Remove all kids
    while (numKids > 0) {
      //keep at least one default
      parent.remove(kids[numKids - 1]);
      numKids--;
    }
    updateUILayout(parent);
  }

  /** Show or Hide The Export Panel
   *
   */
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
   */
  function setMarker(markerComment) {
    //Log.trace("--> setMarker: " + String(markerComment));
    app.beginUndoGroup("Make Makers");

    var comp = aeq.getActiveComp();

    if (!aeq.isComp(comp)) {
      var msg = "Please activate a comp before making markers.";
      alert(msg);
      // Log.warning("<-- setMarker: " + msg);
      return;
    }

    var selectedLayers = aeq.getSelectedLayers(comp);
    if (selectedLayers.length < 1) {
      alert("Select a layer before assigning a marker.");
    } else {
      selectedLayers.forEach(function(layer) {
        var marker = new MarkerValue(markerComment);
        var markerTime = comp.time;
        var hasCloseKeyframe = false;
        var markerExists = false;
        var hasAlignment = false;

        if (
          markerTime < comp.displayStartTime ||
          markerTime < comp.displayStartTime + comp.duration
        ) {
          markerTime = comp.displayStartTime;
        }

        for (var i = 1; i <= layer.property("Marker").numKeys; i++) {
          if (layer.property("Marker").keyValue(i).comment === markerComment) {
            markerExists = true;
            alert('Layer already has a marker "' + markerComment + '"');
            continue;
          }

          if (
            (markerComment === "textVAlign=.5" ||
              markerComment === "textVAlign=1") &&
            (layer.property("Marker").keyValue(i).comment === "textVAlign=.5" ||
              layer.property("Marker").keyValue(i).comment === "textVAlign=1")
          ) {
            var res = confirm(
              "Layer already has an Alignment marker. Do you want to overwrite it",
              true,
              "Updating alignment marker"
            );
            // if the user hits no stop the script
            if (res !== true) {
              return;
            } else {
              markerExists = true;
              hasAlignment = true;
              var updateMarker = new MarkerValue(markerComment);
              aeq
                .getMarkerGroup(layer)
                .setValueAtTime(
                  layer.property("Marker").keyTime(i),
                  updateMarker
                );
              refreshMarkers();
              continue;
            }
          }
          if (
            layer.property("Marker").keyTime(i) >= markerTime - 0.5 &&
            layer.property("Marker").keyTime(i) <= markerTime + 0.5
          ) {
            hasCloseKeyframe = true;
            markerTime += 0.5;
          }
        }

        var marker = new MarkerValue(markerComment);

        if (markerExists === false && hasAlignment === false) {
          aeq.getMarkerGroup(layer).setValueAtTime(markerTime, marker);
        }
      });
      refreshMarkers();
    }
    app.endUndoGroup();
    //Log.trace("<-- setMarker: " + String(markerComment));
  }

  /**
   * Read all Markers in Comp to create a new list and update the UI - (Recursive)
   */
  function refreshMarkers() {
    removeAllChildren(grpMarkersGrp);
    LoopMarkers.resetMarkers();
    var groupMarkers = LoopMarkers.getMarkers(app.project.activeItem);
    addDefaultMarkers();
    if (groupMarkers.length < 1) {
      addMarkerGrp(
        grpMarkersGrp,
        { id: "1", text: "group 1" },
        MARKERS_DEFAULTS.length + 1
      );
    } else {
      var unique = [];
      for (var u = 0; u < groupMarkers.length; u++) {
        
        var found = findInArray(unique,groupMarkers[u].text);
        
        if (found <0) {
          unique.push(groupMarkers[u]);
          if(groupMarkers[u].sub !=0){
            var newSubGroup = [groupMarkers[u].sub]
            unique[unique.length-1].subGroups = newSubGroup;
          }
        } 
        
        if(found >=0) {
          if(unique[found].hasOwnProperty("subGroups")){
            unique[found].subGroups.push(groupMarkers[u].sub)
          }else{
            var newSubGroup = [groupMarkers[u].sub]
            unique[found].subGroups = newSubGroup;
          }
         
      }
      unique.sort(function(a, b) {
        return (a.id > b.id) - (a.id < b.id);
      });
    }
     
      MARKER_GROUPS_ARRAY = [];
      for (var m = 0; m < unique.length; m++) {
        addMarkerGrp(grpMarkersGrp, unique[m], MARKERS_DEFAULTS.length + m);
      }
    
  }
}

  /**
   * Create a text file with a list of all markers
   * @param {Array} arr
   */
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

  ////////////////////////////////////////
  ///////////// UTILS ////////////////////
  ////////////////////////////////////////
  function findInArray(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].text === val) {
        return i;
      }
    }
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

  function isWindows() {
    return $.os.indexOf("Windows") != -1;
  }

  function getByValue(arr, value) {
    for (var i = 0; i < MARKER_GROUPS_ARRAY.length; i++) {
      if (arr[i].text == value) return arr[i];
    }
  }
  function getIndexByValue(arr, value) {
    for (var i = 0; i < MARKER_GROUPS_ARRAY.length; i++) {
      if (arr[i].text == value) return i;
    }
  }

  function sortArray(a, b) {
    return (a.id > b.id) - (a.id < b.id);
  }

  function getUserDataFolder() {
    var userDataFolder = Folder.userData;
    var aescriptsFolder = Folder(
      userDataFolder.toString() + "/Buck/images/yourImg"
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
