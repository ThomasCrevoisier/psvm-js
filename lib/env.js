var paths = require('./paths'),
    util = require('./util');

function createPSVMEnv () {
  util.createNonExistingDir(paths.PSVM_DIR);
  util.createNonExistingDir(paths.PSVM_ARCHIVES);
  util.createNonExistingDir(paths.PSVM_VERSIONS);
  util.createNonExistingDir(paths.PSVM_CURRENT);
  util.createNonExistingDir(paths.PSVM_CURRENT_BIN);
}

module.exports = {
  createPSVMEnv: createPSVMEnv
};
