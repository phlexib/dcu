// save a text file with Markers Group For Reference
var SaveMarkerFile = (function() {

  function saveFile (content,filepath) {
    
    
    var write_file = File (filepath);
    if (!write_file.exists) {
      // if the file does not exist create one
      write_file = new File (filepath);
    } else {
      // if it exists ask the user if it should be overwritten
      var res = confirm("The Marker Ids text file already exists. Do you want to overwrite it", true, "Saving Marker File Warning!");
      // if the user hits no stop the script
      if (res !== true) {
        return;
      }
    }

    var out; // our output
    // we know already that the file exist
    // but to be sure
    if (write_file !== '') {
      //Open the file for writing.
      out = write_file.open('w', undefined, undefined);
      write_file.encoding = "UTF-8";
      write_file.lineFeed = "Unix"; //convert to UNIX lineFeed
      // txtFile.lineFeed = "Windows";
      // txtFile.lineFeed = "Macintosh";
    }
    // got an output?
    if (out !== false) {
      // loop the list and write each item to the file
      write_file.writeln(content);
      // always close files!
      write_file.close();
    }

}

/**
   * Create a text file with a list of all markers
   * @param {Array} arr
   */
  function writeArrayToFile(arr) {
    app.beginUndoGroup("rename Layers");
    
    var curAppFile = app.project.file;
    if(curAppFile){
      var tmpPath = curAppFile.parent;
      var parentFolder = tmpPath.parent;
      var filepath =
        parentFolder.fsName + "/" + curAppFile.displayName.split(".")[0] + ".txt";
      var textOutput = "MARKER LIST\n";
  
      for (var e = 0; e < arr.length; e++) {
        var line = "\n" + arr[e].id + " - " + arr[e].text;
        textOutput += line;
      }
  
      saveFile(textOutput, filepath);
    }
    app.endUndoGroup();
  }

  return {
    writeArrayToFile : writeArrayToFile
  };
})();
