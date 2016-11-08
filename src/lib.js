var got = require('got'),
    nugget = require('nugget'),
    R = require('ramda'),
    path = require('path'),
    paths = require('./paths'),
    os = require('os'),
    util = require('./util'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    glob = Promise.promisify(require('glob')),
    semver = require('semver'),
    PURESCRIPT_REPO_API_URL = 'https://api.github.com/repos/purescript/purescript',
    PURESCRIPT_DOWNLOAD_URL = 'https://github.com/purescript/purescript';

function getReleases() {
    return gotGithubApi('/releases')
        .then(util.parseResponseBody)
        .then(function (body) {
            var releases = R.map(R.prop('tag_name'), body);
            return R.filter(releases => semver.valid(releases), releases);
        });
}

function getLatestRelease() {
    return gotGithubApi('/releases/latest')
        .then(util.parseResponseBody)
        .then(function (body) {
            return R.prop('tag_name', body);
        });
}

function gotGithubApi(path) {
    return got(PURESCRIPT_REPO_API_URL + path, {
        headers: process.env.GITHUB_API_TOKEN ? {
            'authorization': 'token ' + process.env.GITHUB_API_TOKEN
        } : {}
    });
}

function getInstalledVersions() {
    return fs.readdirAsync(paths.PSVM_VERSIONS)
        .then(function (dirs) {
            return R.filter(semver.valid, dirs);
        }, function (err) {
            if (err.code === 'ENOENT') {
                return [];
            } else {
                throw err;
            }
        });
}

function installVersion(version) {
    var osType = getOSRelease();

    return getReleases()
        .then(function (releases) {
            var matchingVersion = semver.maxSatisfying(releases, version);

            if (matchingVersion) {
                return downloadVersion(matchingVersion, osType)
                    .then(function () {
                        util.createNonExistingDir(path.join(paths.PSVM_VERSIONS, matchingVersion));
                        return util.extract(path.join(paths.PSVM_ARCHIVES, matchingVersion + '-' + osType + '.tar.gz'), path.join(paths.PSVM_VERSIONS, matchingVersion));
                    });
            } else {
                return new Promise(function (resolve, reject) {
                    reject("Version " + version + " not found");
                });
            }
        });
}

function downloadVersion(version, os) {
    var downloadURL = PURESCRIPT_DOWNLOAD_URL + '/releases/download/' + version + '/' + os + '.tar.gz';

    console.log('Downloading PureScript compiler ', version, ' for ', os);

    return util.nuggetAsync(downloadURL, {
        target: version + '-' + os + '.tar.gz',
        dir: paths.PSVM_ARCHIVES
    });
}

function cleanCurrentVersion() {
    return glob('psc*', {
            cwd: paths.PSVM_CURRENT_BIN
        })
        .then(function (files) {
            return Promise.all(
                R.map(function (file) {
                    return fs.unlink(path.join(paths.PSVM_CURRENT_BIN, file))
                }, files)
            );
        });
}

function use(version) {
    return getInstalledVersions()
    .then(function (versions) {
      var versionFound = semver.maxSatisfying(versions, version);

      if (versionFound) {
        var srcPath = path.join(paths.PSVM_VERSIONS, versionFound, 'purescript'),
            destPath = path.join(paths.PSVM_CURRENT_BIN);

        console.log('Switching to PureScript :', versionFound);

        return cleanCurrentVersion()
            .then(function () {
                return glob('psc*', {
                    cwd: srcPath
                });
            })
            .then(function (files) {
                return Promise.all(
                    R.map(function (file) {
                        return util.copy(path.join(srcPath, file), path.join(destPath, file)).then(function () {
                            return fs.chmodAsync(path.join(destPath, file), '0777');
                        });
                    }, files)
                );
            });
      } else {
        throw "No version found";
      }
    });
}

function getOSRelease() {
    var OSName = os.platform();
    var OSArch = os.arch();

    if (os.arch() !== 'x64') {
        throw 'Unsupported CPU architecture (need x64; saw: ' + OSArch + ')';
    }

    if (OSName === 'darwin') {
        return 'macos';
    } else if (OSName === 'linux') {
        return 'linux64';
    } else if (OSName === 'win32') {
        return 'win64';
    } else {
        throw "Unsupported OS, sorry. :(";
    }
}

function getCurrentVersion() {
    var cmd = path.join(paths.PSVM_CURRENT_BIN, 'psc') + ' --version';

    return util.command(cmd);
}

function uninstallVersion(version) {
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
