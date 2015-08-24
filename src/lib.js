var got = require('got'),
    nugget = require('nugget'),
    R = require('ramda'),
    path = require('path'),
    paths = require('./paths'),
    fs = require('fs'),
    os = require('os'),
    tarball = require('tarball-extract'),
    PURESCRIPT_REPO_API_URL = 'https://api.github.com/repos/purescript/purescript',
    PURESCRIPT_DOWNLOAD_URL = 'https://github.com/purescript/purescript';

function getReleases () {
  return got(PURESCRIPT_REPO_API_URL + '/releases')
    .then(function (res) {
      var response = JSON.parse(res.body);

      return R.map(R.prop('tag_name'), response);
  });
}

function getLatestRelease () {
  return got(PURESCRIPT_REPO_API_URL + '/releases/latest')
    .then(function (res) {
      var response = JSON.parse(res.body);

      return R.prop('tag_name', response);
    });
}

function getInstalledVersions () {
  var dirs = fs.readdirSync(paths.PSVM_VERSIONS);

  return R.filter(function (dir) {
    return R.match(/v?\d+\.\d+\.\d+/, dir).length > 0;
  }, dirs);
}

// TODO : refacto
function createDirIfNotCreated (path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function installVersion (version) {
  return getReleases()
    .then(function (releases) {
      if (R.contains(version, releases)) {
        downloadVersion(version, function (err) {
          if (err) {
            throw err;
          }

          createDirIfNotCreated(path.join(paths.PSVM_VERSIONS, version));
          tarball.extractTarball(path.join(paths.PSVM_ARCHIVES, version + '-macos.tar.gz'), path.join(paths.PSVM_VERSIONS, version), function(err){
            if(err) console.log(err)
          });
        });
      } else {
        throw "Version specified not found";
      }
    });
}

function downloadVersion (version, cb) {
  var osType = getOSRelease();

  var downloadURL = PURESCRIPT_DOWNLOAD_URL + '/releases/download/' + version + '/' + osType + '.tar.gz';

  nugget(downloadURL, {
    target: version + '-' + osType + '.tar.gz',
    dir: paths.PSVM_ARCHIVES
  }, cb);
}

function use (version) {
  fs.createReadStream(path.join(paths.PSVM_VERSIONS, version, 'purescript', 'psc')).pipe(fs.createWriteStream('/usr/local/bin/psc-yolo'));
  var srcPath = path.join(paths.PSVM_VERSIONS, version, 'purescript'),
      destPath = '/usr/local/bin/';

  copy(path.join(srcPath, 'psc'), path.join(destPath, 'psc'));
  copy(path.join(srcPath, 'psc-bundle'), path.join(destPath, 'psc-bundle'));
  copy(path.join(srcPath, 'psc-docs'), path.join(destPath, 'psc-docs'));
  copy(path.join(srcPath, 'psc-publish'), path.join(destPath, 'psc-publish'));
  copy(path.join(srcPath, 'psci'), path.join(destPath, 'psci'));
}

function copy (source, dest) {
  fs.createReadStream(source)
    .pipe(fs.createWriteStream(dest));
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

module.exports = {
  getReleases: getReleases,
  getLatestRelease: getLatestRelease,
  getInstalledVersions: getInstalledVersions,
  installVersion: installVersion,
  use: use
};
