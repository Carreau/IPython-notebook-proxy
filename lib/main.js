var http = require('http'),
    httpProxy = require('http-proxy');

var repl = require('repl');

default_router =  {
}

var add_route = function(dict, location, port, remote) {
    remote = remote ? remote : 'localhost';

    location= location.replace(/\/$/, "")
    location= location.replace(/^\//, "")
    remote= remote.replace(/\/$/, "")
    remote= remote.replace(/^\//, "")

    dict['localhost/'+location+'/']= remote+':'+port+'/'+location+'/';
    return dict
}

var remove_route = function(dict, location, port, remote) {
    remote = remote ? remote : 'localhost'

    location= location.replace(/\/$/, "")
    location= location.replace(/^\//, "")
    remote= remote.replace(/\/$/, "")
    remote= remote.replace(/^\//, "")
    
    delete dict['localhost/'+location+'/']
    return dict
}

var router = default_router

var options = {
  router: router
}

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(8000);


var updateRoutes = function(proxy, router) {
    proxy.setRoutes(router);
    proxy.emit('routes', proxy.hostnamesOnly == false? proxy.routes : proxy.router);

}

var add_rule = function(loc, port){
    var router = proxyServer.proxy.proxyTable.router
    var new_router = add_route(router,loc, port)
    updateRoutes(proxyServer.proxy.proxyTable, new_router)
}
var rem_rule = function(loc, port){
    var router = proxyServer.proxy.proxyTable.router
    var new_router = remove_route(router,loc, port)
    updateRoutes(proxyServer.proxy.proxyTable, new_router)
}


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



r.context.options = options;
r.context.proxyServer = proxyServer;
r.context.updateRoutes = updateRoutes;
r.context.add_route = add_route;
r.context.remove_route = remove_route;
r.context.add_rule = add_rule
r.context.rem_rule = rem_rule
