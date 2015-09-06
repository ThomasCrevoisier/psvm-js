var path = require('path');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
  PSVM_DIR: path.join(getUserHome(), '.psvm'),
  PSVM_ARCHIVES: path.join(getUserHome(), '.psvm', 'archives'),
  PSVM_VERSIONS: path.join(getUserHome(), '.psvm', 'versions'),
  PSVM_CURRENT: path.join(getUserHome(), '.psvm', 'current'),
  PSVM_CURRENT_BIN: path.join(getUserHome(), '.psvm', 'current', 'bin'),
}
