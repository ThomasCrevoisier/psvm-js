const Promise = require("bluebird");
const tar = require("tar");
const fs = require("fs");
const nugget = require("nugget");
const process = require("child_process");
const rimraf = require("rimraf");

function nuggetAsync(url, options) {
  return new Promise((resolve, reject) => {
    nugget(url, options, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createNonExistingDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function extract(src, dest) {
  console.log("Extracting ", src, " into ", dest);
  return tar.extract({ file: src, cwd: dest });
}

function rename(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function parseResponseBody(res) {
  return JSON.parse(res.body);
}

function copy(source, dest) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(dest);

    readStream.on("error", (err) => {
      reject(err);
    });

    writeStream.on("error", (err) => {
      reject(err);
    });

    writeStream.on("close", () => {
      resolve();
    });

    readStream.pipe(writeStream);
  });
}

function command(cmd) {
  const promise = new Promise((resolve, reject) => {
    process.exec(cmd, (error, stdout) => {
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
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  nuggetAsync,
  createNonExistingDir,
  extract,
  rename,
  parseResponseBody,
  copy,
  command,
  deleteDir,
};
