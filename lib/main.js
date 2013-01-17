var http = require('http'),
    httpProxy = require('http-proxy')

var spawn = require('child_process').spawn

var repl = require('repl');

exports.version = require('../package').version;

default_router =  {
}

var spawned = [];

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

var list = function(){
    console.log(proxyServer.proxy.proxyTable.router)
}

var start_new = function(path, port){

    var server  = spawn('ipython', ['notebook',
            "--NotebookApp.base_project_url='/"+path+"/'",
            "--NotebookApp.base_kernel_url='/"+path+"/'",
            "--NotebookApp.port="+port,
            "--NotebookApp.port_retries=0",
            "--no-browser"
            ])
    spawned.push(server);
    add_rule(path,port)
    list()

    server.stdout.on('data', function (data) {
        console.log('stdout '+path +' : ' + data);
    });

    server.stderr.on('data', function (data) {
        console.log('stderr '+path +' : ' + data);
    });


    server.on('exit', function (code, signal) {
                console.log('child process terminated due to receipt of signal '+signal);
    });

}

var stop = function(process){

    // 2 sig to confirm
    process.kill('SIGHUP');
    process.kill('SIGHUP');

}

var stop_all = function(){
    spawned.forEach(stop)

}


exports.list = list

exports.add_rule = add_rule
exports.rem_rule = rem_rule
exports.proxyServer = proxyServer
exports.start = start_new
exports.spawned = spawned
exports.stop = stop
exports.stop_all = stop_all
