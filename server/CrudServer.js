
// require
var ws = require("ws");

// properties
var _webSocketServer;
var _rows = new Object();


////////////////////////////////////////////////////////////////////
// starts here
////////////////////////////////////////////////////////////////////
function init()
{
	// create a default record

	_webSocketServer = new ws.Server({
		port: 1000
	})
	_webSocketServer.on("connection", onConnection);
}


////////////////////////////////////////////////////////////////////
// websocket
////////////////////////////////////////////////////////////////////
function onConnection(websocket)
{
	websocket.on("message", function(message)
	{
		var data = JSON.parse(message);
		switch(data.command)
		{
			case "refresh":
				websocket.send(JSON.stringify(_rows));
				break;
		
			case "update":
				var payload = data.payload;
				_rows[payload.id] = payload;
				websocket.close();
				break;
		
			case "delete":
				var id = data.id;
				delete _rows[id];
				websocket.close();
				break;
		}
	});
}

init();