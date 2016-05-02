# Aristotle [![Build Status](https://travis-ci.org/neenhouse/Aristotle.svg?branch=master)](https://travis-ci.org/neenhouse/Aristotle)

Run complexity reports on git project and build full sets of data points in pure JSON format

# Getting package

npm install aristole

# Usage

var aristotle = require("aristotle");

aristotle(/** fileGlob **/, /** Plato Options **/, /** callback **/);

aristotle("myproj/**/*.js", {}, function(jsonResults){
	// process jsonResults
});
