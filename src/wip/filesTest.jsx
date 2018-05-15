 //
  var APP_FILE = app.project.file;
  var AEP_FOLDER = APP_FILE.parent;
  var PROJECT_FOLDER = Folder (AEP_FOLDER.parent.parent);
  var STAGING_FOLDER = new Folder(AEP_FOLDER.fsName + "/_staging/");
  var OUT_FOLDER = new Folder(AEP_FOLDER.fsName + "/_out/");
  var RENDER_FOLDER = Folder (PROJECT_FOLDER.fsName + "/Render/Comp");

  alert(RENDER_FOLDER);