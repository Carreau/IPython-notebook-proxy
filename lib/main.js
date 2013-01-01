var http = require('http'),
    httpProxy = require('http-proxy');

var repl = require('repl');

exports.version = require('../package').version;

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

exports.add_rule = add_rule;
exports.rem_rule = rem_rule;
exports.proxyServer = proxyServer;

