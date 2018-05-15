const argv = require("yargs").argv;
const concat = require("gulp-concat");
const del = require("del");
const eslint = require("gulp-eslint");
const fs = require("fs");
const gulp = require("gulp");
const indent = require("gulp-indent");
const os = require("os");
const rseq = require("run-sequence");
const tokenReplace = require("gulp-token-replace");

const pkg = JSON.parse(fs.readFileSync("./package.json"));
const FILENAME = pkg.main;
const AE_VERSION = "2017";

const SCRIPTUI_DIR = getScriptUiPanelDir(AE_VERSION);
const BUILD_DIR = "./build/";
const RELEASE_DIR = "./release/" + pkg.name + "-v" + pkg.version;

const debug = argv.debug || false;
const replaceToken = {
    "prefix" : "BUILD:REPLACE{{",
    "suffix" : "}}",
    "global" : {
        "pkg"   : pkg,
        "debug" : debug  
    },
};


/******* GENERAL TASKS *******/
gulp.task("default", ["debug"]);

gulp.task("debug", function (cb) {
    return rseq("clean:all", "copy:jsx", cb);
});

gulp.task("release", function (cb) {
    return rseq("debug", "package:all", cb);
});

gulp.task("clean:all", function () {
    return del([
        BUILD_DIR,
        SCRIPTUI_DIR + FILENAME
    ], { "force" : true });
});

gulp.task("watch", ["default"], function () {
    gulp.watch(["src/**/*.js*", "!src/libs/*.js", "src/*.inc"], ["watch:rebuild:jsx"]);
    gulp.watch(["src/libs/*.js*"], ["watch:rebuild:libs"]);
});

gulp.task("watch:rebuild:jsx", function () {
    console.log("Body change detected: Rebuilding...");
    rseq("copy:jsx:noLibs", function () {
        console.log("Body change detected: Done rebuilding!");
    });
});

gulp.task("watch:rebuild:libs", function () {
    console.log("Library change detected: Rebuilding...");
    rseq("default", function () {
        console.log("Library change detected: Done rebuilding!");
    });
});


/******* BUILD *******/
gulp.task("build:libs", function () {
    return gulp.src([
        "src/libs/*.js*"
    ])
        .pipe(indent({
            "spaces" : true,
            "amount" : 4
        }))
        .pipe(concat("libs.js"))
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task("build:jsx:body", function () {
    return gulp.src([
        "./src/config.js",
        "./src/framework/util.js*",
        "./src/framework/*.js*",
        "./src/ui/*.js*",
        "./src/app/*.js*",
        "./src/main.jsx"
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(indent({
            "spaces" : true,
            "amount" : 4
        }))
        .pipe(concat("body.js"))
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task("build:jsx", ["build:jsx:body"], function () {
    return gulp.src([
        // "./src/_top.inc",
        BUILD_DIR + "libs.js",
        BUILD_DIR + "body.js",
        // "./src/_bottom.inc"
    ])
        .pipe(tokenReplace(replaceToken))
        .pipe(concat(FILENAME))
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task("copy:jsx", ["build:jsx", "build:libs"], function () {
    return gulp.src([
        BUILD_DIR + FILENAME
    ])
        .pipe(gulp.dest(SCRIPTUI_DIR));
});

gulp.task("copy:jsx:noLibs", ["build:jsx"], function () {
    return gulp.src([
        BUILD_DIR + FILENAME
    ])
        .pipe(gulp.dest(SCRIPTUI_DIR));
});

/******* RELEASE *******/

gulp.task("package:copyTemplate", function () {
    return gulp.src([
        "./release/_template/**"
    ])
        .pipe(gulp.dest(RELEASE_DIR));
});

gulp.task("package:all", ["package:copyTemplate"], function () {
    return gulp.src([
        BUILD_DIR + "*.jsx"
    ])
        .pipe(gulp.dest(RELEASE_DIR));
});

/******* UTILITIES *******/

/**
 * Gets scriptUI panel directory
 *
 * @param {String} version - AE version to get path to
 * @returns {String}       - Path to ScriptUI Panels folder
 */
function getScriptUiPanelDir (version) {
    if (os.platform() === "darwin")
        return "/Applications/Adobe After Effects CC " + version + "/Scripts/ScriptUI Panels/";

    return "C:\\Program Files\\Adobe\\Adobe After Effects CC " + version + "\\Support Files\\Scripts\\ScriptUI Panels\\";
}
