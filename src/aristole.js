var path = require('path'),
	plato = require('plato'),
	colors = require('colors/safe'),
	glob = require('glob'),
	_ = require('lodash'),
	merge = require('merge'),
	fs = require('fs'),
	platolib = require(path.join(__dirname, "../node_modules/plato/lib/plato.js")),
	platoutil = require(path.join(__dirname, "../node_modules/plato/lib/util.js")),
	Store = require("jfs");


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
	try {
		platolib.inspect(filesGlob, 'report', options, function(reports){
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
	} catch (e){
		console.warn('Could not process complexity report:', e);
		done(null);
	}
}
var simpleGit = null;
function full(srcPath, options){
	var srcRoot = path.join(srcPath, '../');
	simpleGit = require('simple-git')( srcRoot );
	simpleGit.reset(['--hard', 'master'], function(){
		simpleGit.checkout('master', function(){
			simpleGit.log({}, function(err, summary){
				if(err){
					console.error(err);
				}
				if(!summary){
					throw "Missing git log information";
				}
				var all = summary.all;
				var step = options.step || 100;
				console.log(colors.green('Processing ' + all.length + ' commits with a step of ' + step));
				walk(all, all.length-1, step, srcPath);
			});
		});
	});
}

/**
 *  walk()
 *  Walk source control timeline and perform source code analysis
 *	Implements functional tail recursion strategy
 */

var boundary = '\n*****\n';
var db = new Store("./report/data.json", { type:'single', pretty:true });

function walk(all, cursor, step, srcPath){
	if(cursor < 0){
		console.log(colors.green('Finished'));
		return;
	}
	//process all
	var commit = all[cursor],
			commitHash = commit.hash;

	if(!commit){
		throw "missing commit information";
	}
	simpleGit.reset(['--hard', 'master'], function(){
		simpleGit.checkout(commitHash, function(err, checkedOut){
			if(err){
				throw err;
			}
			console.log(colors.green('Analyzing commit #' + cursor + '...'));
			inspect(path.join(srcPath, '**/*.js'), { date:commit.date }, function(jsonResults){
				if(!jsonResults){
					return walk(all, cursor-step, step, srcPath);
				}
				console.log(colors.green('Saving results...'));
				db.save(commitHash, merge({commitNumber:cursor}, commit, jsonResults.overview.summary.total), function(err, id){
					if(err){
						console.error(err);
					}
					walk(all, cursor-step, step, srcPath);
				});
			});
		});
	});
}

// Expose API
module.exports = {
	inspect:inspect,
	full:full
}
