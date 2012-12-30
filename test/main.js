var http = require('http');


var query = function(host, port, path){
    path = path?path:'/';
    return function(){http.get({'host':host,'port':port,'path':path}, function(res){
        res.on('data',function(chunck){console.log(host+':'+port+path+' -> '+chunck)});
    })};
}



var spawn = function(port){
    http.createServer(function(req,res) { 
        res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('listenting on '+port);
    }).listen(port);
}

//spawn(8888)
spawn(8889)
spawn(9000)
//setInterval(query('localhost',8000,'/ipython/'),1000);
setInterval(query('localhost',8000,'/test/'),1000);
