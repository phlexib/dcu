var Config = { // eslint-disable-line no-unused-vars
    "name"    : "BUILD:REPLACE{{pkg.fullname}}",
    "version" : "BUILD:REPLACE{{pkg.version}}",

    "defaults" : {
        "userDebug" : false
    },

    "globals" : {
        "debug"        : eval("BUILD:REPLACE{{debug}}"),
        "logMaxSize"   : 5000000,
        "resourcePath" : aeq.file.joinPath(aeq.app.getUserDataFolder().fsName, "Buck", "BUILD:REPLACE{{pkg.fullname}}"),

        "globalTemplatePath"  : $.getenv("BUCK_SOURCE_ROOT") ? "\\" + aeq.file.joinPath($.getenv("BUCK_SOURCE_ROOT"), "AE", "templates", "markerTemplates") : null,
        "projectTemplatePath" : $.getenv("BUCK_PROJECT_PATH") ? "\\" + aeq.file.joinPath($.getenv("BUCK_PROJECT_PATH"), "Production", "Common", "Meta", "markerTemplates") : null
    }
};
