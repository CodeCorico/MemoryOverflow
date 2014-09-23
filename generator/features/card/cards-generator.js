(function() {
  'use strict';

  var path = require('path'),
      Card = require('./card').Card,
      FileUtils = require('../file/file.js').File,
      ProgressBar = require('progress');

  function _endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  var CardsGenerator = function(templateFile, templateName) {
    var bar = null;

    function _generate(card, done) {
      card.generate(function(args) {
        if (args.error) {
          throw new Error(args.error);
        }

        if (bar) {
          bar.tick();
        }

        if (done) {
          console.log('Generating cards : Done');
        }
      });
    }

    this.generate = function() {

      FileUtils.listFiles(path.join(__dirname, '../../../cards'), function(error, files) {

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
          _generate(cards[i], i === len - 1);
        }

      });

    };

  };

  exports.CardsGenerator = CardsGenerator;

})();