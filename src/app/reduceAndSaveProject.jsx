// rename layers to mathc shot

var ReduceAndSaveProject = (function() {
  function renderMp4() {
    var today = new Date();
    var APP_FILE = app.project.file;
    var PROJ_NAME = APP_FILE.displayName.split("_comp")[0];
    var AEP_FOLDER = APP_FILE.parent;
    var PROJECT_FOLDER = Folder(AEP_FOLDER.parent.parent);
    var RENDER_FOLDER = new Folder(PROJECT_FOLDER.fsName + "/Render/Comp/");

    var todayFormated = today.yearmonthday();
    var outputMp4File = new File(
      RENDER_FOLDER.fsName + "/render_" + PROJ_NAME + "_" + todayFormated
    );
    var testFile = new File(outputMp4File.fsName.split(".")[0] + ".mp4");
    if (testFile.exists) {
      var archiveFolder = new Folder(RENDER_FOLDER.fsName + "/_archive");
      if (!archiveFolder.exists) {
        archiveFolder.create();
      }
      if (
        testFile.copy(decodeURI(archiveFolder) + "/" + testFile.displayName)
      ) {
        testFile.remove();
      }
    }
    RenderComp.renderComp(app.project.activeItem, {
      renderSettingsTemplate: "Best Settings",
      file: outputMp4File,
      renderInAME: true,
      startRender: true
    });
    return outputMp4File;
  }

  function reduceSave() {
    var mp4File = renderMp4();
    var projectTokens = app.project.file.displayName.split("_");
    var sName = projectTokens[0] + "_" + projectTokens[1] + "_JSON";
    var compToReduce = findComp(sName);
    compToReduce.selected = true;
    compToReduce.openInViewer();
    // REDUCE PROJECT
    app.executeCommand(2735);

    // SAVE TO STAGING
    var curAppFile = app.project.file;
    var parentFolder = curAppFile.parent;
    var stagingFolder = new Folder(parentFolder.fsName + "/_staging/");
    var outFolder = new Folder(parentFolder.fsName + "/_out/");
    var newFile = new File(stagingFolder.fsName + "/" + curAppFile.displayName);

    if (!stagingFolder.exists) {
      stagingFolder.create();
    }
    if (!outFolder.exists) {
      outFolder.create();
    }
    app.project.save(newFile);

    // COLLECT FILES
    CollectFootage(outFolder, false);

    // SAVE A COPY AS CC13
    app.executeCommand(4035);

    alert(
      "Collec and Save Report : \nH264 render has been save to :" +
        mp4File.fsName +
        ".\n Project has been Collected and save to :  " +
        app.project.file.fsName +
        ".\n Project has been Staged to : " +
        newFile.fsName
    );
  }

  /**
   * Function to format a date
   * @return {String} the date as string in this format yyyy-mm-dd
   */
  Date.prototype.yearmonthday = function() {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;

    if (month.toString().length === 1) {
      month = "0" + month;
    }

    var day = this.getDate();
    if (day.toString().length === 1) {
      day = "0" + day;
    }
    return year + month + day;
  };

  /// COLLECT FUNCTION
  function CollectFootage(collectDir, collectFonts) {
    app.beginUndoGroup("Collect Files");

    // grab the projet name and set up our collect folders
    var projectName = app.project.file.name;
    projectName = projectName.substring(0, projectName.lastIndexOf("."));
    var projectDir = new Folder(
      collectDir.toString() + "/" + projectName + "_COLLECT"
    );
    var footageDir = new Folder(projectDir.absoluteURI + "/(Footage)");

    var missingFootage = []; //this is an array for storing any missing items, which we will alert later
    var nonRelinkList = []; //if we get a layerd psd or ai we can not replace it properly, so we'll leave this up to the user
    var curPsdAiFlag = false;

    //create the directories
    projectDir.create();
    footageDir.create();

    // loop through all project items, if it is footage copy it to the collect folder and relink.
    for (var i = 1; i <= app.project.numItems; i++) {
      var curItem = app.project.item(i);

      // make sure we only get footage items, excluding solids
      if (
        curItem instanceof FootageItem == true &&
        curItem.mainSource instanceof SolidSource != true
      ) {
        // if the footage item is missing, let's flag a warning
        if (curItem.footageMissing) {
          missingFootage[missingFootage.length] = curItem.name;
        }

        // check we have a valid item, and lets do this!
        if (curItem.file != null && !curItem.footageMissing) {
          // build a tree of parent folders for each footage item
          var folderTree = "";
          checkItem = curItem;
          while (checkItem.parentFolder != app.project.rootFolder) {
            // apend folder name
            folderTree = checkItem.parentFolder.name + "/" + folderTree;

            //walk up one level
            checkItem = checkItem.parentFolder;
          }

          // create the directory we want to copy to
          var targetDir = new Folder(
            footageDir.absoluteURI + "/" + folderTree + "/"
          );
          if (!targetDir.exists) {
            targetDir.create();
          }

          // Copy and relink!
          // check if it is an image, image sequence or other
          var extension = curItem.file.name
            .substring(curItem.file.name.lastIndexOf(".") + 1)
            .toLowerCase();

          if (
            extension == "jpg" ||
            extension == "jpeg" ||
            extension == "png" ||
            extension == "tga" ||
            extension == "tif" ||
            extension == "tiff" ||
            extension == "exr" ||
            extension == "bmp" ||
            extension == "pxr" ||
            extension == "pct" ||
            extension == "hdr" ||
            extension == "rla" ||
            extension == "ai" ||
            extension == "cin" ||
            extension == "dpx" ||
            extension == "psd"
          ) {
            // it is an image file

            // if we got a .psd or .ai we need to check if it is a layered file.
            if (extension == "psd" || extension == "ai") {
              // look for the characteristic "/" to indicate it is a layer within a file.
              x = curItem.name.indexOf(File.decode(curItem.file.name));
              if (curItem.name.charAt(x - 1) == "/") {
                //pretty sure at this point we have a layered file, lets flag it
                curPsdAiFlag = true;
                nonRelinkList[nonRelinkList.length] = curItem.name;
              }
            }

            if (curItem.mainSource.isStill) {
              var targetFile = new File(
                targetDir.absoluteURI + "/" + curItem.file.name
              );
              if (!targetFile.exists) {
                //we need to save the alpha interpretation because AE will try to guess at this newly and we don't want that
                var alphaMode = curItem.mainSource.alphaMode;
                var premulColor = curItem.mainSource.premulColor;

                curItem.file.copy(targetFile);
                if (curPsdAiFlag != true) {
                  // Due to limitations in extendscript it seems you can not relink to a layer within a file, so we will need escape this special case
                  curItem.replace(targetFile);
                }
                curItem.mainSource.alphaMode = alphaMode;
                curItem.mainSource.premulColor = premulColor;
              }
            } else {
              // image sequence

              //this should remove the frame numbers
              var sequenceName = curItem.file.name;
              sequenceName = sequenceName.substring(
                0,
                sequenceName.lastIndexOf(".")
              ); //strip extension
              var lastChar = sequenceName.substring(
                sequenceName.length - 1,
                sequenceName.length
              );
              //walk up the string stripping out trailing digits. This would probably be better with regex but it works...
              while (
                lastChar == "0" ||
                lastChar == "1" ||
                lastChar == "2" ||
                lastChar == "3" ||
                lastChar == "4" ||
                lastChar == "5" ||
                lastChar == "6" ||
                lastChar == "7" ||
                lastChar == "8" ||
                lastChar == "9"
              ) {
                // remove the last character
                sequenceName = sequenceName.substring(
                  0,
                  sequenceName.length - 1
                );
                //update the last character variable
                lastChar = sequenceName.substring(
                  sequenceName.length - 1,
                  sequenceName.length
                );
              }

              // often people like to render image sequences with a . or _ before them, so do one last check for that and remove it
              if (lastChar == "." || lastChar == "_") {
                // remove the last character
                sequenceName = sequenceName.substring(
                  0,
                  sequenceName.length - 1
                );
              }

              var folderContent = curItem.file.parent.getFiles();
              var targetFolder = new Folder(
                targetDir.absoluteURI + "/" + sequenceName
              );
              if (!targetFolder.exists) {
                targetFolder.create();
              }

              // copy all of the frames over
              var targetFile = new File(
                targetFolder.absoluteURI + "/" + curItem.file.name
              );
              if (!targetFile.exists) {
                for (j = 0; j < folderContent.length; j++) {
                  var currentFile = folderContent[j];

                  if (currentFile instanceof File) {
                    currentFile.copy(
                      targetFolder.absoluteURI + "/" + currentFile.name
                    );
                  }
                }
              }

              //we need to save the alpha interpretation because AE will try to guess at this newly and we don't want that
              var alphaMode = curItem.mainSource.alphaMode;
              var premulColor = curItem.mainSource.premulColor;
              // relink
              if (curPsdAiFlag != true) {
                // Due to limitations in extendscript it seems you can not relink to a layer within a file, so we will need escape this special case
                curItem.replaceWithSequence(targetFile, false);
              }
              curItem.mainSource.alphaMode = alphaMode;
              curItem.mainSource.premulColor = premulColor;
            }

            curPsdAiFlag = false; //Reset this for the next item
          } else {
            // it is not an image, so probably a video or something.
            var targetFile = new File(
              targetDir.absoluteURI + "/" + curItem.file.name
            );
            if (!targetFile.exists) {
              //we need to save the alpha interpretation because AE will try to guess at this newly and we don't want that
              var alphaMode = curItem.mainSource.alphaMode;
              var premulColor = curItem.mainSource.premulColor;

              curItem.file.copy(targetFile);
              curItem.replace(targetFile);
              curItem.mainSource.alphaMode = alphaMode;
              curItem.mainSource.premulColor = premulColor;
            }
          }
        }
      }
    }

    app.endUndoGroup();

    // collect the fonts
    if (collectFonts == true) {
      // TODO: need to write this one
    }

    // Write out a log file!
    var logFile = new File(
      projectDir.absoluteURI.toString() + "/" + projectName + "_Archive log.txt"
    );
    logFile.open("w:");

    // let the user know of any missing footage
    if (missingFootage.length > 0) {
      logFile.writeln(
        "ERROR! The following items are missing and could not be collected:"
      );
      //var missingFootageList = "";
      for (var i = 0; i < missingFootage.length; i++) {
        logFile.writeln(missingFootage[i]);
        //missingFootageList = missingFootageList + missingFootage[i] + "\n";
      }
      logFile.writeln();
    }

    // let the user know we could not replace a psd
    if (nonRelinkList.length > 0) {
      logFile.writeln(
        "WARNING! It appears there is a layered .psd or .ai in this project. The following files were collected, however they could not be relinked:"
      );
      for (var i = 0; i < nonRelinkList.length; i++) {
        //alert(nonRelinkList[i]);
        logFile.writeln(nonRelinkList[i]);
      }
      //alert("WARNING\nIt appears there is a layered .psd or .ai in this project. \nThe file was properly collected, however due to limitations in extendscript it could not be relinked.");
      logFile.writeln();
    }

    logFile.writeln(
      "Archive complete. " + Date("year", "month", "day").toString()
    );
    logFile.close();

    newFile = new File(projectDir.fsName + "/" + app.project.file.name);
    app.project.save(newFile);
  }

  return {
    reduceSave: reduceSave
  };
})();

function findComp(compName) {
  for (i = 1; i <= app.project.numItems; i++) {
    var curItem = app.project.item(i);
    if (curItem instanceof CompItem && curItem.name == compName) {
      return curItem;
      break;
    }
  }
}

//  ReduceAndSaveProject.reduceSave();
