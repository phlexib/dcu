var DCTools = (function(){

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

  return{
    findInArray : findInArray,
    findItemById : findItemById,
    getByValue : getByValue,
    getIndexByValue : getIndexByValue,
    sortArray :sortArray,
    getUserDataFolder : getUserDataFolder,
    createResourceFile : createResourceFile,
    isSecurityPrefSet : isSecurityPrefSet
  }

})();
