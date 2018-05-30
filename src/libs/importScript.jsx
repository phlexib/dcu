var ImportScript = (function() {

  var pattern = /-v\d/;
  var scriptRootFolder;
  var macRoot = "//GlobalPrefs/CURRENT/src/AE/scripts/Releases";
  var pcRoot = Config.globals.scriptsRootPath;

  function setScriptFile(scriptPath) {
    if (isWindows === true) {
      // var pcRootFolder = Folder(pcRoot + "/" + scriptPath);
      findScriptFile(pcRootFolder);
    } else {
      var macRootFolder = Folder(macRoot + "/" + scriptPath);
      findScriptFile(macRootFolder);
    }

    var scriptFile = File(scriptRootFolder.fsName + "/" + scriptPath + ".jsx");
    return scriptFile;
  }

  function findScriptFile(rootFolder) {
    var rootFolderFiles = rootFolder.getFiles();
    for (var f = 0; f < rootFolderFiles.length; f++) {
      if (rootFolderFiles[f].displayName.match(pattern)) {
        scriptRootFolder = Folder(rootFolderFiles[f].fsName);
      }
    }
  }

  /**
   * run an external script using eval.
   * @param {Sctring} scriptName
   */
  function runScript(scriptName) {
    var theScript = setScriptFile(scriptName);
    if (theScript.exists) {
      theScript.open("r");
      var scriptToRead = theScript.read();
      eval(scriptToRead);
      theScript.close();
    } else {
      alert("could not find DCtoJSON Script");
    }
  }

  function isWindows() {
    return $.os.indexOf("Windows") != -1;
  }


  return { runScript: runScript };
})();
