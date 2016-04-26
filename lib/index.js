var path = require('path'),
	plato = require('plato'),
	glob = require('glob'),
	_ = require('lodash'),
	fs = require('fs'),
	platolib = require(path.join(__dirname, "../node_modules/plato/lib/plato.js")),
	platoutil = require(path.join(__dirname, "../node_modules/plato/lib/util.js"));


function unary(fn) { return function(a){ return fn(a);}; }

function formatOptions(options){
	options = options || {};
	if (options.date) {
	    // if we think we were given seconds
	    if (options.date < 10000000000 ) options.date = options.date * 1000;
	    options.date = new Date(options.date);
	} else {
		options.date = new Date();
	}
	return options;
}


/**
 *	getJson()
 *  Return plato report in JSON format
 *  Returned via callback where 1st arg is overview json and 2nd arg is array of report details
 */
function inspect(filesGlob, options, done){
	options = formatOptions(options);
	platolib.inspect(filesGlob, null, options, function(reports){
		// Get overview
		var overview = platolib.getOverviewReport(reports);

		// Add Source to Json
		filesGlob = filesGlob instanceof Array ? filesGlob : [filesGlob];
		var files = _.flatten(filesGlob.map(unary(glob.sync)));

		var commonBasePath = platoutil.findCommonBase(files);
		files.forEach(function(file) {
			var source = fs.readFileSync(file).toString().trim(),
				fileShort = file.replace(commonBasePath, '');

			_.find(reports, function(report, key){
				//console.log(report.info.fileShort, fileShort);
				if(report.info.fileShort === fileShort){
					reports[key].source = source;
					return true;
				}
			});
		});

		// Return final json
		done({
			overview:overview,
			reports:reports,
			date:options.date
		});
	});
}


/**
 *	analyzeGitProject()
 *	Walk project history and collect plato reports
 */
function analyzeGitProject(projectPath, option){
	// TODO
}


/**
 *	writeToMongo()
 *  Persists JSON and files arg to mongoDB
 */
function writeToMongo(json, mongoOptions, done){
	// TODO
	done(true);
}


// Expose API
module.exports = {
	inspect:inspect
}
