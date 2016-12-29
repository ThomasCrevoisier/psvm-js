#!/usr/bin/env node

var cliparse = require("cliparse"),
    parsers = cliparse.parsers;

var lsRemote = require('./output/Command.LsRemote').lsRemote;
var ls = require('./output/Command.Ls').ls;

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
      , cliparse.command(
          "ls", {
              description: "List installed version of PureScript",
              args: [],
              options: []
          },
          ls)
    ]
});

cliparse.parse(cliParser);
