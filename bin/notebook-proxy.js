#!/usr/bin/env node
var program = require('commander')
var repl = require('repl')

var version = require('../package').version

var proxy = require('../lib/main.js')

program
  .version(version) // get that from package.json
  .option('-p, --port <n>', 'The port to listen on', parseInt, 80)
  .option('-r, --repl', 'Start an REPL to give interactive command')
  .parse(process.argv)

console.log('you asked for port ', program.port)
console.log('You want to start the repl :', program.repl)

if(program.repl == true){
  console.log('==================================')
  console.log('add remove routing rules like so :')
  console.log('add_rule("/myurl/",portnumber)')
  console.log('rem_rule("/myurl/",portnumber)')
  console.log('')
  console.log('Use Ctrl+C to exit')
  console.log('')
  console.log('inspect ')
  console.log('> proxyServer.proxy.proxyTable.router')
  console.log('to see current routes')
  console.log('')
  console.log('Example :')
  console.log('> add_rule("/ipython/",8888)')
  console.log('')
  console.log('==================================')
  var r = repl.start();

  r.context.proxyServer = proxy.proxyServer;
  r.context.rem_rule = proxy.rem_rule;
  r.context.add_rule = proxy.add_rule
}
