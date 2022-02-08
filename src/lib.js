var got = require('got'),
    nugget = require('nugget'),
    path = require('path'),
    paths = require('./paths'),
    os = require('os'),
    util = require('./util'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    glob = Promise.promisify(require('glob')),
    PURESCRIPT_REPO_API_URL = 'https://api.github.com/repos/purescript/purescript',
    PURESCRIPT_DOWNLOAD_URL = 'https://github.com/purescript/purescript';

async function getReleases() {
    const res = await gotGithubApi('/releases');
    const body = JSON.parse(res.body);

    return body.map(({ tag_name }) => tag_name);
}

function getLatestRelease() {
    const res = gotGithubApi('/releases/latest');
    const body = JSON.parse(res.body);

    return body.tag_name;
}

function gotGithubApi(path) {
    return got(PURESCRIPT_REPO_API_URL + path, {
        headers: process.env.GITHUB_API_TOKEN ? {
            'authorization': 'token ' + process.env.GITHUB_API_TOKEN
        } : {}
    });
}

async function getInstalledVersions() {
    try {
        const dirs = await fs.readdirAsync(paths.PSVM_VERSIONS);
        return dirs.filter(/v?\d+\.\d+\.\d+/.test);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        } else {
            throw err;
        }
    }
}

function installVersion(version) {
    const osType = getOSRelease();
    const releases = await getReleases();

    if (releases.includes(version)) {
        await downloadVersion(version, osType);
        const releaseArchivePath = path.join(paths.PSVM_ARCHIVES, `${version}-${osType}.tar.gz`)
        const targetDir = path.join(paths.PSVM_VERSIONS, version);

        util.createNonExistingDir(targetDir);

        return util.extract(releaseArchivePath, targetDir);
    } else {
        throw `Version ${version} not found`
    }
}

function downloadVersion(version, os) {
    var downloadURL = PURESCRIPT_DOWNLOAD_URL + '/releases/download/' + version + '/' + os + '.tar.gz';

    console.log('Downloading PureScript compiler ', version, ' for ', os);

    return util.nuggetAsync(downloadURL, {
        target: version + '-' + os + '.tar.gz',
        dir: paths.PSVM_ARCHIVES
    });
}

async function cleanCurrentVersion() {
    const files = await glob('+(psc*|purs|purs.exe)', { cwd: paths.PSVM_CURRENT_BIN });

    files.forEach(file => {
        fs.unlink(path.join(paths.PSVM_CURRENT_BIN, file), function(err) { if (err) throw err;})
    })
}

async function use(version) {
    const srcPath = path.join(paths.PSVM_VERSIONS, version, 'purescript'),
          destPath = path.join(paths.PSVM_CURRENT_BIN);

    await cleanCurrentVersion();

    const files = await glob('+(psc*|purs|purs.exe)', { cwd: srcPath });
    const copyExe = file =>
        util.copy(path.join(srcPath, file), path.join(destPath, file))
            .then(() => fs.chmodAsync(path.join(destPath, file), '0777'));

    return Promise.all(files.map(copyExe));
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
    if (getInstalledVersions().includes(version)) {
        return util.deleteDir(path.join(paths.PSVM_VERSIONS, version));
    } else {
        return new Promise(function (_, reject) {
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
