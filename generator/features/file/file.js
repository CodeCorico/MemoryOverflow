(function() {
  'use strict';

  var fs = require('fs');

  var File = function() {

    var _file = this;

    this.parsePo = function(data) {
      var nodes = data
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n'),
          contents = {},
          id = null,
          str = null;

      nodes.forEach(function(node) {

        if (node.indexOf('##') === 0 || node.indexOf('#') === 0) {
          // ignore
        }
        else if (node.match(/msgid/g)) {
          id = node.substring(6).replace(/"/g, '');
        }
        else if (node.match(/msgstr/g)) {
          str = node.substring(7).replace(/"/g, '');

          if (id) {
            contents[id] = str;
          }
          id = null;
          str = null;
        }

      });

      return contents;
    };

    this.parseMarkdown = function(data) {
      var delimiter = new RegExp(/#\s.*?\n/g),
          headers = data.match(delimiter),
          contents = data.split(delimiter),
          results = {};

      for (var i = 0, len = headers.length; i < len; i ++) {
        var header = headers[i].replace('#', '').trim(),
            content = contents[i + 1].trim();

        results[header] = content;

      }

      return results;
    };

    function _createDirectory(directory) {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
    }

    this.directory = function(path) {
      _createDirectory(path);
      return path;
    };

    this.listFiles = function(dir, done) {
      var results = [];

      fs.readdir(dir, function(err, list) {
        if (err) {
          return done(err);
        }

        var pending = list.length;
        if (!pending) {
          return done(null, results);
        }

        list.forEach(function(file) {
          file = dir + '/' + file;

          fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              _file.listFiles(file, function(err, res) {
                results = results.concat(res);
                if (!--pending) {
                  done(null, results);
                }
              });
            }
            else {
              results.push(file);
              if (!--pending) {
                done(null, results);
              }
            }
          });
        });
      });
    };

  };

  exports.File = new File();
})();