# Purescript Version Manager

## Installation

First, let's install psvm through npm : `npm install -g psvm`.

FYI, psvm will create a directory `$HOME/.psvm` and will work in it.

It will :
  * put versions of Purescript you download in `$HOME/.psvm/versions`
  * put all bin files for the version you want to use in `$HOME/.psvm/current/bin`

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

* some old version of Purescript only offer the source code, they will not be installed.
* For the moment, it has only been tested on a MacOS. It should be usable on Linux too, normally.
