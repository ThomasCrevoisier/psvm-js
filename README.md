# Purescript Version Manager

## Installation

This is as simple as `npm install -g psvm`.

## Usage

Let's run `psvm --help` to see what we can do:

    Purescript version manager

    Options:
    [--help, -?]        Display help about this program
    [--version, -V]     Display the version of this program

    Available Commands:
    help                display help about this program
    ls-remote           List Purescript releases
    latest              Get the latest available version of Purescript
    install             Install a specified version of Purescript
    use                 Use a specific version
    ls                  List installed version of Purescript
    current             Output the current version used of Purescript
    install-latest      Install the latest version of Purescript
    uninstall           Uninstall a specific version of Purescript

#### Example

* To get all versions of Purescript available on the github repo: `psvm ls-remote`
* To install the version `v0.7.0` of Purescript : `psvm install v0.7.0`
* To install the latest version of Purescript : `psvm install-latest`

#### Note:

* some old version of Purescript only offer the source code, they will not be installed.
* For the moment, it has only been tested on a MacOS. It should be usable on Linux too, normally.
