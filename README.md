# Purescript Version Manager

## Installation

First, let's install psvm through npm : `npm install -g psvm`.

FYI, psvm will create a directory `$HOME/.psvm` and will work in it as the
default directory. If you want to use a different directory, you can set an
environment variable `PSVM_HOME`.

It will :
  * put versions of Purescript you download in `$HOME/.psvm/versions` (or `$PSVM_HOME/versions`, if `$PSVM_HOME` is set)
  * put all bin files for the version you want to use in `$HOME/.psvm/current/bin` (or `$PSVM_HOME/current/bin`, if `$PSVM_HOME` is set)

Because of the last point, it's necessary you add `$HOME/.psvm/current/bin` in your PATH.

## Usage

Let's run `psvm --help` to see what we can do:


    Purescript version manager

    Options:
    [--help, -?]        Display help about this program
    [--version, -V]     Display the version of this program

    Available Commands:
    help                display help about this program
    ls-remote           List releases available on the Purescript repo
    latest              Print the latest available version of Purescript
    install             Install a specific version of Purescript
    use                 Use the specified installed version of Purescript
    ls                  List installed versions of Purescript
    current             Output the current version used of Purescript
    install-latest      Install the latest version of Purescript
    uninstall           Uninstall a specific version of Purescript

#### Example

* To get all versions of Purescript available on the github repo: `psvm ls-remote`
* To install the version `v0.7.0` of Purescript : `psvm install v0.7.0`
* To install the latest version of Purescript : `psvm install-latest`
* To use the version `v0.7.3` of Purescript : `psvm use v0.7.3`

#### Note:

* Some old versions of PureScript only offer the source code, they will not be installed.
* psvm has been tested on 64-bit versions of Mac OS, Linux, and Windows.
* psvm uses the GitHub API for some commands, which can lead to rate limiting, especially on CI services. If an environment variable `GITHUB_API_TOKEN` is set, it will be used for authenticating to the GitHub API.
