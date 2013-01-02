# IPython Notebook Proxy/Launcher

This is basically a thin wrapper around node http-proxy and repl
to be able to launch multiple notebook server on the same port, and accessible
at different URLs.

It also allows to host other applications than ipython notebook.

Unlike other proxy the routing scheme can be changed while the proxy is running without
deconnecting the current clients, and it works out of the box with websockets.

# Installation

Soon availlable on npm, I need to learn how to do it.

Righ now, Install node 0.8+ (works with 0.6 with **minimal** modification), install npm
clone git repository, run `npm install` in root or repo.

# Usage

```
$ ./bin/notebook-proxy.js
==================================
 QuickStart

> start("/ipython/",8888)
go to "localhost:8000/ipython/"

> start("/ipython-more/",7777
go to "localhost:8000/ipython-more/"

> stop_all()

> help()
For more info
==================================
>
```

It now listen on localhost:8000 (not on 127.0.0.1 but I have no idea why...)
and you can now spawn as many notebook server using.

```
start($url, localport)
```

The proxy will now redirect any request to `localport:8000/$url/` to the server.
You can start as many as you want with different url/port.

Stop all servers with `stop_all()`

also  it's a full node repl, so have fun.

PR welcome.
