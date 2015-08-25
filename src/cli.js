#!/usr/bin/env node

var lib = require('./lib'),
    env = require('./env'),
    cliparse = require("cliparse"),
    R = require('ramda'),
    pkgJson = require('../package.json'),
    parsers = cliparse.parsers;

function lsRemote () {
  lib.getReleases().then(function (releases) {
    console.log('Available releases for download');
    R.map(function (v) {
      console.log('\t', v);
    }, releases);
  });
}

function ls () {
  var versions = lib.getInstalledVersions();
  console.log('Installed versions of Purescript');
  R.map(function (v) {
    console.log('\t', v);
  }, R.reverse(versions));
}

function latest () {
  lib.getLatestRelease().then(function (release) {
    console.log('Latest version of Purescript available:', release);
  });
}

function install (params) {
  env.createPSVMEnv();
  var version = params.args[0];

  lib.installVersion(version)
    .catch(console.log);
}

function use (params) {
  var version = params.args[0];

  console.log('Switching to Purescript :', version);

  lib.use(version);
}

function current () {
  lib.getCurrentVersion()
  .then(function (version) {
    console.log('Current version of Purescript: ', version);
  });
}

function installLatest () {
  env.createPSVMEnv();
  lib.getLatestRelease().then(lib.installVersion);
}

function uninstall (params) {
  env.createPSVMEnv();
  var version = params.args[0];

  lib.uninstallVersion(version);
}

var cliParser = cliparse.cli({
  name: "psvm",
  description: "Purescript version manager",
  version: pkgJson.version,
  commands: [
    cliparse.command(
      "ls-remote",
      { description: "List Purescript releases",
        args: [],
        options: []
      },
      lsRemote),

    cliparse.command(
      "latest",
      { description: "Get the latest available version of Purescript",
        args: [],
        options: []
      },
      latest),

    cliparse.command(
      "install",
      { description: "Install a specified version of Purescript",
        args: [cliparse.argument("version", { description: "version to install" })],
        options: []
      },
      install),

    cliparse.command(
      "use",
      { description: "Use a specific version",
        args: [cliparse.argument("version", { description: "version to use" })],
        options: []
      },
      use),

    cliparse.command(
      "ls",
      { description: "List installed version of Purescript",
        args: [],
        options: []
      },
      ls),

    cliparse.command(
      "current",
      { description: "Output the current version used of Purescript",
        args: [],
        options: []
      },
      current),

    cliparse.command(
      "install-latest",
      { description: "Install the latest version of Purescript",
        args: [],
        options: []
      },
    installLatest),

    cliparse.command(
      "uninstall",
      { description: "Uninstall a specific version of Purescript",
        args: [cliparse.argument("version", { description: "version to uninstall" })],
        options: []
      },
    uninstall)
  ]
});

cliparse.parse(cliParser);
