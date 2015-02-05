var path = require('path'),
	lib = require(path.join(__dirname, "../lib/index.js"));

// Testing API
var files = path.join(__dirname, "../../otherproj/**/*.js"),
	options = {},
	done = function(json){
		console.log("Success:", json);
	};

lib.inspect(files, null, options, done)
