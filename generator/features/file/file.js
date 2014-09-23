(function() {
  'use strict';

  var fs = require('fs');

  var File = function() {

    var _file = this;

    this.parseMarkdown = function(data) {
      var nodes = data
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .split('\n'),
          contents = {},
          header = null,
          content = '';

      nodes.forEach(function(node) {

        // Heading 2
        if (node.indexOf('##') === 0) {
          content = '';
          header = node.replace('## ','');
        }
        // Heading 1
        else if (node.indexOf('#') === 0) {
          content = '';
          header = node.replace('# ','');
        }
        // Paragraph
        else if (node.length > 0) {
          content += node;

          contents[header] = {
            content: content
          };
        }
      });

      return contents;
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