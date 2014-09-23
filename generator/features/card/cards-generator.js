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
    var _bar = null,
        _cardsToGenerate = 0,
        _cards = [];

    function _generate(card) {
      card.generate(function(args) {
        if (args.error) {
          throw new Error(args.error);
        }

        if (_bar) {
          _bar.tick();
        }

        _cardsToGenerate --;
        if (_cardsToGenerate === 0) {
          console.log('Generating cards : Done');
        }
      });
    }

    this.generate = function() {

      FileUtils.listFiles(path.join(__dirname, '../../../cards'), function(error, files) {

        if (!error) {
          files.forEach(function(file) {
            if (_endsWith(file, 'md') && !_endsWith(file, 'README.md')) {
              _cards.push(new Card(file, templateFile, templateName));
            }
          });
        }

        _cardsToGenerate = _cards.length;

        _bar = new ProgressBar('Generating cards [:bar] :current / :total', {
          complete: '=',
          incomplete: ' ',
          width: _cardsToGenerate * 4,
          total: _cardsToGenerate
        });

        _cards.forEach(function(card) {
          _generate(card);
        });

      });

    };

  };

  exports.CardsGenerator = CardsGenerator;

})();