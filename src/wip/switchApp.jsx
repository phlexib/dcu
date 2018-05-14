var open2017 = "osascript -e 'tell application \"Adobe After Effects CC 2017\" to activate'"
var runScript2017 = "osascript -e 'tell application \"Adobe After Effects CC 2017\" to DoScriptFile \"/Users/buck/Documents/BUCK/DEV/wip/helloWorld.jsx\"'" // works


function saveProjectFromVersionToVersion(from,to){
    var curProjectFile = app.project.file;
    var curProjectFileString = curProjectFile.fsName;
    var newProjectString = curProjectFileString.replace(from,to);
    var fileToSave = new File(newProjectString);
    
    if (!fileToSave.exists) {
       var new_project = app.project.save(fileToSave);
       system.callSystem(open2017);
       system.callSystem(runScript2017);
      
    }else{
        alert("file already exists");
        system.callSystem(open2017);
        system.callSystem(runScript2017);
    }
    return fileToSave;
}


//app.executeCommand(4035);
var v2014File = saveProjectFromVersionToVersion("2015" , "2014");
var saveAsCC2013 = "/Users/buck/Documents/BUCK/DEV/wip/helloWorld.jsx";
