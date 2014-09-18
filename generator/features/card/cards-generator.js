(function() {
  'use strict';

  var Card = require('./card').Card,
      FileUtils = require('../file/file.js').File,
      ProgressBar = require('progress');

  function _endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  var CardsGenerator = function(templateFile, templateName) {
    var bar = null;

    function _tick() {
      if (bar) {
        bar.tick();
      }
    }

    this.generate = function() {

      FileUtils.listFiles('../cards', function(error, files) {

        var cards = [];

        if (!error) {
          files.forEach(function(file) {
            if (_endsWith(file, 'md') && !_endsWith(file, 'README.md')) {
              cards.push(new Card(file, templateFile, templateName));
            }
          });
        }

        var len = cards.length;

        bar = new ProgressBar('Generating cards [:bar] :current / :total', {
          complete: '=',
          incomplete: ' ',
          width: len * 4,
          total: len
        });

        for (var i = 0; i < len; i++) {
          cards[i].generate(_tick);
        }

      });

    };

  };

  exports.CardsGenerator = CardsGenerator;

})();