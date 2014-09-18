(function() {
  'use strict';

  var fs = require('fs');

  var File = function() {

    var _file = this;

    this.websiteDirectory= function() {
      var directory = '../website/';
      return this.directory(directory);
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