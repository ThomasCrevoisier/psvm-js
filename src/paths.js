var path = require('path');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = {
  PSVM_DIR: path.join(getUserHome(), '.psvm-js'),
  PSVM_ARCHIVES: path.join(getUserHome(), '.psvm-js', 'archives'),
  PSVM_VERSIONS: path.join(getUserHome(), '.psvm-js', 'versions')
}
