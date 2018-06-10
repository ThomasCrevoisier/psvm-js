var Promise = require('bluebird'),
    tar = require('tar'),
    fs = require('fs'),
    nugget = require('nugget'),
    process = require('child_process'),
    rimraf = require('rimraf');

function nuggetAsync(url, options) {
    return new Promise(function (resolve, reject) {
        nugget(url, options, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

function createNonExistingDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function extract(src, dest) {
  console.log('Extracting ', src, ' into ', dest);
  return tar.extract({ file: src, cwd: dest });
}

function rename(oldPath, newPath) {
    return new Promise(function (resolve, reject) {
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

function parseResponseBody(res) {
    return JSON.parse(res.body);
}

function copy(source, dest) {
    return new Promise(function (resolve, reject) {
        var readStream = fs.createReadStream(source),
            writeStream = fs.createWriteStream(dest);

        readStream.on('error', function (err) {
            reject(err);
        });

        writeStream.on('error', function (err) {
            reject(err);
        });

        writeStream.on('close', function () {
            resolve();
        });

        readStream.pipe(writeStream);
    });
}

function command(cmd) {
    var promise = new Promise(function (resolve, reject) {
        process.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });

    return promise;
}

function deleteDir(path) {
    return new Promise(function (resolve, reject) {
        rimraf(path, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

module.exports = {
    nuggetAsync: nuggetAsync,
    createNonExistingDir: createNonExistingDir,
    extract: extract,
    rename: rename,
    parseResponseBody: parseResponseBody,
    copy: copy,
    command: command,
    deleteDir: deleteDir
}
