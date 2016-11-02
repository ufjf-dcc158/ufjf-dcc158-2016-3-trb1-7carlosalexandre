var http = require("http");
var url = require("url");

function start(router, handlers) {
	function onRequest(req, res){
		console.log("Requisição recebida");
		router(url.parse(req.url).pathname, handlers, req, res);
	}

	http.createServer(onRequest).listen(8888);
	console.log("Servidor iniciado em localhost:8888");
}

module.exports.start = start;
