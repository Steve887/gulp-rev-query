var _ = require('underscore');
var through = require('through2');

var defaults = {
    ver: 'ver',
	prefix: '-',
	suffix: '.'
};


module.exports = function(opts) {
    opts = _.defaults((opts || {}), defaults);

    // convert a-xxxxxxxx.css to a.css?ver=xxxxxxxx
    function hashToQuery(file) {
		var regex = new RegExp('(\\' + opts.prefix + '(\\w+))(\\' + opts.suffix + '\\w+)', 'g');
        var content = new String(file.contents);
        content = content.replace(regex, function($, $1, $2, $3) {
            return $3 + '?' + opts.ver + '=' + $2;
        });
        file.contents = new Buffer(content);
        file.ver = opts.ver;
        return file;
    }
    return through.obj(function(file, encoding, callback) {
        callback(null, hashToQuery(file));
    });
};
