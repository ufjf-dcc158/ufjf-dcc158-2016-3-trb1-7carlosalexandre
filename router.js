var handlers = require("./requestHandlers");

function route(pathname, handlers, req, res) {
	console.log("Acesso a:" + pathname);
	if(typeof handlers[pathname] == 'function'){
		handlers[pathname](req, res);
	}else{
		console.log("Não há handler para " + pathname);
	}
}

module.exports.route = route;
