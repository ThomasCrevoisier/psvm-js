var paths = require('./paths'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs'));

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function createDirIfNotCreated (path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function createPSVMEnv () {
  createDirIfNotCreated(paths.PSVM_DIR);
  createDirIfNotCreated(paths.PSVM_ARCHIVES);
  createDirIfNotCreated(paths.PSVM_VERSIONS);
}

module.exports = {
  createPSVMEnv: createPSVMEnv
};
