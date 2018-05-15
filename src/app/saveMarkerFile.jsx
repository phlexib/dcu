// save a text file with Markers Group For Reference
var SaveMarkerFile = (function() {

  function saveFile (content,filepath) {
    app.beginUndoGroup("rename Layers");
    
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
app.endUndoGroup();
  return {
    saveFile : saveFile
  };
})();
