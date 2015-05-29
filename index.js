// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');

// plugin level function (dealing with files)
function gulpOptimizeBrowserify() {
	var propRe = /,\n\s+__hasProp = {}.hasOwnProperty,/mg;
	var extRe = /\s+__extends = function\(child, parent\) \{ for \(var key in parent\) \{ if \(__hasProp.call\(parent, key\)\) child\[key\] = parent\[key\]; } function ctor\(\) \{ this.constructor = child; \} ctor.prototype = parent.prototype; child.prototype = new ctor\(\); child.__super__ = parent.prototype; return child; }/mg;

	// creating a stream through which each file will pass
	var stream = through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			// do nothing if no contents
		}

		// remove duplicated extends
		var content = String(file.contents);
		content = content.replace(propRe, '');
		content = content.replace(extRe, '');

		content =
		"(function(){\n"+
		"var __hasProp = {}.hasOwnProperty;\n"+
		"var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };\n"+
		content+"\n"+
		"})()\n";

		file.contents = new Buffer(content);

		return cb(null, file);
	});

	// returning the file stream
	return stream;
};

// exporting the plugin main function
module.exports = gulpOptimizeBrowserify;