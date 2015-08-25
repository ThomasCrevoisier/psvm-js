var Promise = require('bluebird'),
    tarball = require('tarball-extract'),
    fs = require('fs'),
    nugget = require('nugget'),
    process = require('child_process'),
    rimraf = require('rimraf');

function nuggetAsync (url, options) {
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

function createNonExistingDir (path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function extract (src, dest) {
  return new Promise(function (resolve, reject) {
    console.log('Extracting ', src, ' into ', dest);
    tarball.extractTarball(src, dest, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function parseResponseBody (res) {
  return JSON.parse(res.body);
}

function copy (source, dest) {
  return new Promise(function (resolve, reject) {
    var stream = fs.createReadStream(source)
      .pipe(fs.createWriteStream(dest));

    stream.on('error', function (err) {
        reject(err);
    });

    stream.on('end', function () {
      resolve();
    });
  });
}

function command (cmd) {
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

function deleteDir (path) {
  return new Promise (function (resolve, reject) {
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
  parseResponseBody: parseResponseBody,
  copy: copy,
  command: command,
  deleteDir: deleteDir
}
