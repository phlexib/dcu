var Core = (function () { // eslint-disable-line no-unused-vars
    /**
     * Add files matching extension (or folders)
     *
     * @param {Folder} folder Root folder to serach in
     * @param {string} extension File extension to search
     * @returns {{files: File[], folders: Folder[]}} Obj containing arrays of found files & folders
     */
    function findFolderItems (folder, extension) {
        Log.trace("--> findFolderItems: " + String(folder));
        var foundItems = {
            "files"   : aeq.arrayEx(),
            "folders" : {}
        };

        var folderObject = aeq.file.getFolder(folder);
        if (aeq.isNullOrUndefined(folderObject)) {
            Log.warning("<-- findFolderItems: Can't find folder " + String(folder));
            return;
        }

        var items = aeq.file.getFiles(folderObject);
        if (aeq.isNullOrUndefined(items)) {
            Log.warning("<-- findFolderItems: No matching items in " + String(folder));
            return;
        }

        items.forEach(function (item) {
            if (aeq.isFolder(item))
                foundItems.folders[item.displayName] = aeq.file.getFiles(item, "*" + extension);
            else if (aeq.file.getExtension(item) === extension)
                foundItems.files.push(item);
        });

        Log.trace("<-- findFolderItems: " + String(folder));
        return foundItems;
    }

    /**
     * Gets marker template json files
     *
     * @param {String} path                          - Path to get
     * @returns {{files: File[], folders: Folder[]}} - Array of json template files
     */
    function getMarkerTemplateFiles (path) {
        Log.trace("--> getMarkerTemplateFiles: " + path);

        var templateFolder;
        var templateFolderItems;

        if (!aeq.isNullOrUndefined(path)) {
            templateFolder = aeq.file.getFolder(path);
            templateFolderItems = findFolderItems(templateFolder, "json");
        }

        Log.trace("<-- getMarkerTemplateFiles: " + path);
        return templateFolderItems;
    }

    /**
     * @typedef {Object} NamedButton
     * @property {String} label Button label text
     * @property {String} [markerText] Marker text
     */

    /**
     * @typedef {Object} NumberedButtonData
     * @property {Number} count # of buttons to create
     * @property {Number} [offset] # to offset
     * @property {String} [prefix] Button prefix string
     */

    /**
     *
     * @typedef {Object} ButtonTemplate
     * @property {String} name - Name of the temlate
     * @property {NumberedButtonData} [numberedButtons] Numbered button data
     * @property {NamedButton[]} [buttons] Named button array
     */

    /**
     * Parses a marker template file, returning an object if valid
     *
     * @param {File} markerTemplateFile - File to parse
     * @returns {ButtonTemplate}        - Marker template data
     */
    function parseMarkerTemplateFile (markerTemplateFile) {
        Log.trace("--> parseMarkerTemplateFile: " + String(markerTemplateFile));
        var markerTemplateFileContents = aeq.file.readFile(markerTemplateFile);
        var parsedContents = JSON.parse(markerTemplateFileContents);
        var problems = aeq.arrayEx();

        if (!(parsedContents.hasOwnProperty("buttons") || parsedContents.hasOwnProperty("numberedButtons"))) {
            problems.push("File " + String(markerTemplateFile.fullName) + " is invalid!\nMissing either 'buttons' or 'numberedButtons'");
            return alert(problems.join("\n"));
        }

        if (parsedContents.hasOwnProperty("buttons")) {
            parsedContents.buttons = aeq.arrayEx(parsedContents.buttons);

            parsedContents.buttons.forEach(function (buttonObj, i) {
                if (!buttonObj.hasOwnProperty("label"))
                    problems.push("File " + String(markerTemplateFile.fileName) + ", button #" + String(i) + " contains an invalid button!\nMissing 'label'!");
            });
        } else if (!parsedContents.numberedButtons.hasOwnProperty("count"))
            problems.push("NumberedButtons File " + String(markerTemplateFile.fileName) + ", is missing button count!");

        if (problems.length > 0) {
            var msg = "parseMarkerTemplateFile errors:\n" + problems.join("\n");

            alert(msg);
            Log.error("<-- parseMarkerTemplateFile: " + msg);
            return;
        }

        Log.trace("<-- parseMarkerTemplateFile: " + String(markerTemplateFile));
        return parsedContents;
    }

    return {
        "findFolderItems"         : findFolderItems,
        "getMarkerTemplateFiles"  : getMarkerTemplateFiles,
        "parseMarkerTemplateFile" : parseMarkerTemplateFile
    };
})();
