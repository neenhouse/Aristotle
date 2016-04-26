#!/usr/bin/env node

// Load dependencies
var path = require('path'),
    program = require('commander'),
    colors = require('colors/safe'),
    lib = require(path.join(__dirname, '../lib/index'));


// Default path
var srcPath = path.join(process.cwd(), 'src/**/*.js');

// Configure program
program
  .version('1.0.0')
  .option('-p, --path [path]', 'Path to files to analyze')
  .parse(process.argv);

if (program.path) srcPath = path.join(process.cwd(), program.path);

console.log(colors.green('Analyzing "' + srcPath + '"...' + '\n'));

// Execute Aristole
lib.inspect(srcPath, {}, function(jsonResults){
	console.log('results are: ', jsonResults.overview.summary.total);
});
