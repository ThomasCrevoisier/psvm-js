#!/usr/bin/env node

var cliparse = require("cliparse"),
    parsers = cliparse.parsers;

var psvmAPI = require('./psvm-api.js');


function sayHello () {
  psvmAPI.main();
}

var cliParser = cliparse.cli({
    name: "psvm",
    description: "PureScript version manager",
    version: "0.0.0",
    commands: [
        cliparse.command(
            "say-hello", {
                description: "List releases available on the PureScript repo",
                args: [],
                options: []
            },
            sayHello)
    ]
});

cliparse.parse(cliParser);
