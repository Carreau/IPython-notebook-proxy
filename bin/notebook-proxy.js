#!/usr/bin/env node
var program = require('commander');

program
  //.version('0.0.1') // get that from package.json
  .option('-p, --port <n>', 'The port to listen on', parseInt, 80)
  .parse(process.argv);

console.log('you asked for port ', program.port);
