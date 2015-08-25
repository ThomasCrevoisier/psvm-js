var paths = require('./paths'),
    util = require('./util');

function createPSVMEnv () {
  util.createNonExistingDir(paths.PSVM_DIR);
  util.createNonExistingDir(paths.PSVM_ARCHIVES);
  util.createNonExistingDir(paths.PSVM_VERSIONS);
}

module.exports = {
  createPSVMEnv: createPSVMEnv
};
