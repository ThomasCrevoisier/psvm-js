#!/usr/bin/env node

var cliparse = require("cliparse"),
    parsers = cliparse.parsers;

var lsRemoteCommand = require('./output/Command.LsRemote');

function lsRemote () {
  lsRemoteCommand.lsRemote();
}

var cliParser = cliparse.cli({
    name: "psvm",
    description: "PureScript version manager",
    version: "0.0.0",
    commands: [
        cliparse.command(
            "ls-remote", {
                description: "List releases available on the PureScript repo",
                args: [],
                options: []
            },
            lsRemote)
    ]
});

cliparse.parse(cliParser);
