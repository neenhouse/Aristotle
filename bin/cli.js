#!/usr/bin/env node

// Load dependencies
var path = require('path'),
    program = require('commander'),
    colors = require('colors/safe'),
    lib = require(path.join(__dirname, '../src/aristole'));


// Default path
var srcPath = path.join(process.cwd(), 'example/**/*.js'),
    cmd = 'inspect';

// Configure program
program
  .version('1.0.0')
  .option('-p, --path [path]', 'Path to files to analyze')
  .option('-f, --full', 'Full analysis of timeline')
  .option('-s, --step [step]', 'Number of steps')
  .parse(process.argv);

if (program.path) srcPath = path.join(process.cwd(), program.path);
if (program.full) cmd = 'full';

// Execute Aristole
if(program.full){
  console.log(colors.green('Performing timeline analysis of "' + srcPath + '"...' + '\n'));
  lib.full(srcPath, { step:program.step });
} else {
  console.log(colors.green('Analyzing "' + srcPath + '"...' + '\n'));
  lib.inspect(srcPath, {}, function(jsonResults){
  	console.log('results are: ', jsonResults.overview.summary.total);
  });
}
