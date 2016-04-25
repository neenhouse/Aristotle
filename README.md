# Aristotle

Run complexity reports on git project and build full sets of data points in pure JSON format

# Getting package

npm install plato-git

# Usage

var aristotle = require("aristotle");

aristotle(/** fileGlob **/, /** Plato Options **/, /** callback **/);

aristotle("myproj/**/*.js", {}, function(jsonResults){
	// process jsonResults
});
