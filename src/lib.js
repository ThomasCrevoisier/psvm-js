const got = require("got");
const R = require("ramda");
const path = require("path");
const os = require("os");
const Promise = require("bluebird");
const paths = require("./paths");
const util = require("./util");
const fs = Promise.promisifyAll(require("fs"));
const glob = Promise.promisify(require("glob"));

const PURESCRIPT_REPO_API_URL =
  "https://api.github.com/repos/purescript/purescript";
const PURESCRIPT_DOWNLOAD_URL = "https://github.com/purescript/purescript";

function gotGithubApi(ghPath) {
  return got(PURESCRIPT_REPO_API_URL + ghPath, {
    headers: process.env.GITHUB_API_TOKEN
      ? {
          authorization: `token ${process.env.GITHUB_API_TOKEN}`,
        }
      : {},
  });
}

function getOSRelease() {
  const OSName = os.platform();
  const OSArch = os.arch();

  if (os.arch() !== "x64") {
    throw new Error(`Unsupported CPU architecture (need x64; saw: ${OSArch})`);
  }

  if (OSName === "darwin") {
    return "macos";
  }
  if (OSName === "linux") {
    return "linux64";
  }
  if (OSName === "win32") {
    return "win64";
  }
  throw new Error("Unsupported OS, sorry. :(");
}

function getReleases() {
  return gotGithubApi("/releases")
    .then(util.parseResponseBody)
    .then((body) => R.map(R.prop("tag_name"), body));
}

function getLatestRelease() {
  return gotGithubApi("/releases/latest")
    .then(util.parseResponseBody)
    .then((body) => R.prop("tag_name", body));
}

function getInstalledVersions() {
  return fs.readdirAsync(paths.PSVM_VERSIONS).then(
    (dirs) =>
      R.filter((dir) => R.match(/v?\d+\.\d+\.\d+/, dir).length > 0, dirs),
    (err) => {
      if (err.code === "ENOENT") {
        return [];
      }
      throw err;
    }
  );
}

function downloadVersion(version, currentOS) {
  const downloadURL = `${PURESCRIPT_DOWNLOAD_URL}/releases/download/${version}/${currentOS}.tar.gz`;

  console.log("Downloading PureScript compiler ", version, " for ", currentOS);

  return util.nuggetAsync(downloadURL, {
    target: `${version}-${currentOS}.tar.gz`,
    dir: paths.PSVM_ARCHIVES,
  });
}

function installVersion(version) {
  const osType = getOSRelease();

  return getReleases().then((releases) => {
    if (R.contains(version, releases)) {
      return downloadVersion(version, osType).then(() => {
        util.createNonExistingDir(path.join(paths.PSVM_VERSIONS, version));
        return util.extract(
          path.join(paths.PSVM_ARCHIVES, `${version}-${osType}.tar.gz`),
          path.join(paths.PSVM_VERSIONS, version)
        );
      });
    }
    return new Promise((resolve, reject) => {
      reject(new Error(`Version ${version} not found`));
    });
  });
}

function cleanCurrentVersion() {
  return glob("+(psc*|purs|purs.exe)", {
    cwd: paths.PSVM_CURRENT_BIN,
  }).then((files) =>
    Promise.all(
      R.map(
        (file) =>
          fs.unlink(path.join(paths.PSVM_CURRENT_BIN, file), (err) => {
            if (err) throw err;
          }),
        files
      )
    )
  );
}

function use(version) {
  const srcPath = path.join(paths.PSVM_VERSIONS, version, "purescript");
  const destPath = path.join(paths.PSVM_CURRENT_BIN);

  cleanCurrentVersion()
    .then(() =>
      glob("+(psc*|purs|purs.exe)", {
        cwd: srcPath,
      })
    )
    .then((files) =>
      Promise.all(
        R.map(
          (file) =>
            util
              .copy(path.join(srcPath, file), path.join(destPath, file))
              .then(() => fs.chmodAsync(path.join(destPath, file), "0777")),
          files
        )
      )
    );
}

function getCurrentVersion() {
  const cmd = `${path.join(paths.PSVM_CURRENT_BIN, "psc")} --version`;

  return util.command(cmd);
}

function uninstallVersion(version) {
  if (R.composeP(getInstalledVersions(), R.contains(version))) {
    return util.deleteDir(path.join(paths.PSVM_VERSIONS, version));
  }
  return new Promise((resolve, reject) => {
    reject(new Error("Version to uninstall not found"));
  });
}

module.exports = {
  getReleases,
  getLatestRelease,
  getInstalledVersions,
  installVersion,
  use,
  getCurrentVersion,
  uninstallVersion,
};
