#!/usr/bin/env node

var lib = require('./lib'),
    env = require('./env'),
    cliparse = require("cliparse"),
    R = require('ramda')
    parsers = cliparse.parsers;

function lsRemote () {
  lib.getReleases().then(function (releases) {
    console.log('Available releases for download');
    R.map(console.log, releases);
  });
}

function ls () {
  var versions = lib.getInstalledVersions();
  console.log('Installed versions of Purescript');
  R.map(console.log, R.reverse(versions));
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

  lib.use(version);
}

var cliParser = cliparse.cli({
  name: "psvm",
  description: "Purescript version manager",
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
      { description: "Install version",
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
      ls)
  ]
});

cliparse.parse(cliParser);
