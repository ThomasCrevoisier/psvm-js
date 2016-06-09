var got = require('got'),
    nugget = require('nugget'),
    R = require('ramda'),
    path = require('path'),
    paths = require('./paths'),
    os = require('os'),
    util = require('./util'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    PURESCRIPT_REPO_API_URL = 'https://api.github.com/repos/purescript/purescript',
    PURESCRIPT_DOWNLOAD_URL = 'https://github.com/purescript/purescript';

function getReleases () {
  return gotGithubApi('/releases')
    .then(util.parseResponseBody)
    .then(function (body) {
      return R.map(R.prop('tag_name'), body);
  });
}

function getLatestRelease () {
  return gotGithubApi('/releases/latest')
    .then(util.parseResponseBody)
    .then(function (body) {
      return R.prop('tag_name', body);
    });
}

function gotGithubApi (path) {
  return got(PURESCRIPT_REPO_API_URL + path, {
    headers: process.env.GITHUB_API_TOKEN ?
      { 'authorization': 'token ' + process.env.GITHUB_API_TOKEN } :
      {}
  });
}

function getInstalledVersions () {
    return fs.readdirAsync(paths.PSVM_VERSIONS)
        .then(function (dirs) {
            return R.filter(function (dir) {
                return R.match(/v?\d+\.\d+\.\d+/, dir).length > 0;
            }, dirs);
        }, function (err) {
            if (err.code === 'ENOENT') {
                return [];
            } else {
                throw err;
            }
        });
}

function installVersion (version) {
  var osType = getOSRelease();

  return getReleases()
    .then(function (releases) {
      if (R.contains(version, releases)) {
        return downloadVersion(version, osType)
                .then(function () {
                  util.createNonExistingDir(path.join(paths.PSVM_VERSIONS, version));
                  return util.extract(path.join(paths.PSVM_ARCHIVES, version + '-' + osType + '.tar.gz'), path.join(paths.PSVM_VERSIONS, version));
                });
      } else {
        return new Promise(function (resolve, reject) {
          reject("Version " + version + " not found");
        });
      }
    });
}

function downloadVersion (version, os) {
  var downloadURL = PURESCRIPT_DOWNLOAD_URL + '/releases/download/' + version + '/' + os + '.tar.gz';

  console.log('Downloading Purescript compiler ', version, ' for ', os);

  return util.nuggetAsync(downloadURL, {
    target: version + '-' + os + '.tar.gz',
    dir: paths.PSVM_ARCHIVES
  });
}

function use (version) {
  var srcPath = path.join(paths.PSVM_VERSIONS, version, 'purescript'),
      destPath = path.join(paths.PSVM_CURRENT_BIN),
      promises = [
          util.copy(path.join(srcPath, 'psc'), path.join(destPath, 'psc')),
          util.copy(path.join(srcPath, 'psc-bundle'), path.join(destPath, 'psc-bundle')),
          util.copy(path.join(srcPath, 'psc-docs'), path.join(destPath, 'psc-docs')),
          util.copy(path.join(srcPath, 'psc-publish'), path.join(destPath, 'psc-publish')),
          util.copy(path.join(srcPath, 'psci'), path.join(destPath, 'psci'))
      ];

  Promise.all(promises)
    .then(function () {
      fs.chmodSync(path.join(destPath, 'psc'), '0777');
      fs.chmodSync(path.join(destPath, 'psc-bundle'), '0777');
      fs.chmodSync(path.join(destPath, 'psc-docs'), '0777');
      fs.chmodSync(path.join(destPath, 'psc-publish'), '0777');
      fs.chmodSync(path.join(destPath, 'psci'), '0777');
    });
}

function getOSRelease () {
  var OSName = os.platform();

  if (OSName === 'darwin') {
    return 'macos';
  } else if (OSName === 'linux') {
    return 'linux64';
  } else {
    throw "Unsupported OS, sorry bro.";
  }
}

function getCurrentVersion () {
  var cmd = path.join(paths.PSVM_CURRENT_BIN, 'psc') + ' --version';

  return util.command(cmd);
}

function uninstallVersion (version) {
  if (R.contains(version, getInstalledVersions())) {
    return util.deleteDir(path.join(paths.PSVM_VERSIONS, version));
  } else {
    return new Promise(function (resolve, reject) {
      reject('Version to uninstall not found');
    })
  }
}

module.exports = {
  getReleases: getReleases,
  getLatestRelease: getLatestRelease,
  getInstalledVersions: getInstalledVersions,
  installVersion: installVersion,
  use: use,
  getCurrentVersion: getCurrentVersion,
  uninstallVersion: uninstallVersion
};
