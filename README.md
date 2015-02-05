# Plato-Git

Run complexity reports on git project and build full sets of data points in pure JSON format

# Getting package

npm install plato-git

# Usage

var platogit = require("plato-git");

platogit(/** fileGlob **/, /** Plato Options **/, /** callback **/);

platogit("myproj/**/*.js", {}, function(jsonResults){
	// process jsonResults
});


