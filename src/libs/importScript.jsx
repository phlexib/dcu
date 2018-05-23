 var ImportScript = (function (){
    var scriptRootFolder;
    var pcRoot = "//abadal/GlobalPrefs/work.ben/AE/Scripts";
    var macRoot = "//GlobalPrefs/work.ben/AE/Scripts";
      function setScriptFile(scriptPath){
        if (isWindows === true) {
            scriptRootFolder = Folder(pcRoot);
          } else {
            scriptRootFolder = Folder(macRoot);
          }
          var scriptFile = File(scriptRootFolder.fsName + "/" + scriptPath);
          return scriptFile;
          
      }

      /**
       * run an external script using eval. 
       * @param {Sctring} scriptName 
       */
      function runScript(scriptName){  
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

      return {runScript:runScript}

})();

