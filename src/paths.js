const path = require("path");

function getUserHome() {
  return process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
}

function getPsvmHome() {
  return process.env.PSVM_HOME || path.join(getUserHome(), ".psvm");
}

const home = getPsvmHome();

module.exports = {
  PSVM_DIR: home,
  PSVM_ARCHIVES: path.join(home, "archives"),
  PSVM_VERSIONS: path.join(home, "versions"),
  PSVM_CURRENT: path.join(home, "current"),
  PSVM_CURRENT_BIN: path.join(home, "current", "bin"),
};
