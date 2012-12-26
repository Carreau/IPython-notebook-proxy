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
var router = add_route(default_router, 'static', 8888);
var router = add_route(default_router, 'ipython', 8888);
var router = add_route(default_router, 'test', 8889);
var router = add_route(default_router, 'dummy', 9000);
var router = remove_route(default_router, 'dummy', 9000);


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

var r = repl.start();



r.context.options = options;
r.context.proxyServer = proxyServer;
r.context.updateRoutes = updateRoutes;
r.context.add_route = add_route;
r.context.remove_route = remove_route;
r.context.add_rule = add_rule
r.context.rem_rule = rem_rule
