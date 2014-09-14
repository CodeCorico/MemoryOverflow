(function() {

  var fs = require('fs'),
      Card = require('./card').Card;

  function _listFiles(dir, done) {
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
            _listFiles(file, function(err, res) {
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

  function _endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  var CardsGenerator = function(templateFile, templateName) {

    this.generate = function() {

      _listFiles('../cards', function(error, files) {

        if (!error) {
          files.forEach(function(file) {
            if (_endsWith(file, 'md') && !_endsWith(file, 'README.md')) {
              new Card(file, templateFile, templateName).generate();
            }

          });
        }

      });

    };

  };

  exports.CardsGenerator = CardsGenerator;

})();