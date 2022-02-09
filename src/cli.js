#!/usr/bin/env node

const cliparse = require("cliparse");
const R = require("ramda");
const process = require("process");
const env = require("./env");
const lib = require("./lib");
const pkgJson = require("../package.json");

function lsRemote() {
  lib.getReleases().then((releases) => {
    console.log("Available releases of PureScript: ");

    releases.forEach((v) => {
      console.log("\t", v);
    });
  });
}

function ls() {
  lib.getInstalledVersions().then((versions) => {
    if (versions.length > 0) {
      console.log("Installed versions of PureScript");

      R.reverse(versions).forEach((v) => {
        console.log("\t", v);
      });
    } else {
      console.log("No installed version of PureScript found");
    }
  });
}

function latest() {
  lib.getLatestRelease().then((release) => {
    console.log("Latest version of PureScript available:", release);
  });
}

function install(params) {
  env.createPSVMEnv();

  const version = params.args[0];

  lib
    .getInstalledVersions()
    .then(R.contains(version))
    .then((isVersionInstalled) => {
      if (isVersionInstalled) {
        console.log(`Version ${version} is already installed`);
      } else {
        lib.installVersion(version).catch((err) => {
          console.error(err);

          process.exit(1);
        });
      }
    });
}

function use(params) {
  const version = params.args[0];

  console.log("Switching to PureScript :", version);

  lib.use(version);
}

function current() {
  lib
    .getCurrentVersion()
    .then((version) => {
      console.log("Current version of PureScript: ", version);
    })
    .catch((err) => {
      if (err.code === 127) {
        console.error("No versions of psc are installed.");
        console.error(
          "You can install the latest version by running : psvm install-latest"
        );
        console.error("List all the installed versions by running : psvm ls");
        console.error(
          "Select a version after installing it by running : psvm use <VERSION>"
        );

        process.exit(127);
      } else {
        console.log(err.toString());
      }
    });
}

function installLatest() {
  env.createPSVMEnv();
  lib.getLatestRelease().then(lib.installVersion);
}

function uninstall(params) {
  env.createPSVMEnv();
  const version = params.args[0];

  lib.uninstallVersion(version);
}

const cliParser = cliparse.cli({
  name: "psvm",
  description: "PureScript version manager",
  version: pkgJson.version,
  commands: [
    cliparse.command(
      "ls-remote",
      {
        description: "List releases available on the PureScript repo",
        args: [],
        options: [],
      },
      lsRemote
    ),

    cliparse.command(
      "latest",
      {
        description: "Print the latest available version of PureScript",
        args: [],
        options: [],
      },
      latest
    ),

    cliparse.command(
      "install",
      {
        description: "Install a specific version of PureScript",
        args: [
          cliparse.argument("version", {
            description: "version to install",
          }),
        ],
        options: [],
      },
      install
    ),

    cliparse.command(
      "use",
      {
        description: "Use the specified installed version of PureScript",
        args: [
          cliparse.argument("version", {
            description: "version to use",
          }),
        ],
        options: [],
      },
      use
    ),

    cliparse.command(
      "ls",
      {
        description: "List installed versions of PureScript",
        args: [],
        options: [],
      },
      ls
    ),

    cliparse.command(
      "current",
      {
        description: "Output the current version used of PureScript",
        args: [],
        options: [],
      },
      current
    ),

    cliparse.command(
      "install-latest",
      {
        description: "Install the latest version of PureScript",
        args: [],
        options: [],
      },
      installLatest
    ),

    cliparse.command(
      "uninstall",
      {
        description: "Uninstall a specific version of PureScript",
        args: [
          cliparse.argument("version", {
            description: "version to uninstall",
          }),
        ],
        options: [],
      },
      uninstall
    ),
  ],
});

cliparse.parse(cliParser);
