'use strict';

var R2 = require('R2');
var fs = require('fs');
var path = require('path');

function isCss(source) {
    return (/\.css$/i).test(source);
}


//inner function
function exists() {
    var filepath = path.join.apply(path, arguments);
    return fs.existsSync(filepath) || path.existsSync(filepath);
}

function isDir() {
    var filepath = path.join.apply(path, arguments);
    return exists(filepath) && fs.statSync(filepath).isDirectory();
}

function isFile() {
    var filepath = path.join.apply(path, arguments);
    return exists(filepath) && fs.statSync(filepath).isFile();
}


//core function swap
function swap(filepath) {
    try {
        //old file content 
        //TODO: if need encoding util such as iconv-lite
        var content = fs.readFileSync(filepath, 'utf-8');
        
        //TOD: set compress as a option
        var output = R2.swap(content, {compress: false});
        
        //new file name
        var newFile = filepath.substring(0, filepath.length-3) + 'rtl.css'; 
        
        //write in new file instead cover old file
        fs.writeFileSync(newFile, output);
        
    } catch(e) {
        console.log('error for swap file');
    }
}


//processFile
var processFile = exports.processFile = function(file) {
    //check if css
    if (isCss(file)) {
        swap(file);
    }
};


//processDir
var processDir = exports.processDir = function(dir) {
    var fileList = [];
    //scan dir for .css
    fs.readdirSync(dir).forEach(function (path){
        if (path[0] != '.') {
            var file = dir + '/' + path;

            //check
            if (isFile(file) && isCss(file)) {
                fileList.push(file);
            }
        }
    });

    fileList.forEach(function (f){
        swap(f);
    });
};


//rtl
exports.rtl = function(path) {

    //set default path
    path = path || process.cwd();

    //fix source is dir or just file
    if(isDir(path)) {
        processDir(path);
    }else if(isFile(path)) {
        processFile(path);
    }
}