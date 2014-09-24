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

      _cardsToGenerate = 0;

      FileUtils.listFiles(path.join(__dirname, '../../../cards'), function(error, files) {

        if (!error) {
          // first, find the markdown files
          files.forEach(function(file) {
            if (_endsWith(file, 'md') && !_endsWith(file, 'README.md')) {
              var name = path.basename(file, '.md');
              _cards[name] = new Card(file, templateFile, templateName);
              _cardsToGenerate ++;
            }
          });

          // then the translation files
          files.forEach(function(file) {
            if (_endsWith(file, 'po')) {
              var name = path.basename(file, '.po'),
                  splited = name.split('.');

              _cards[splited[0]].languageFiles(splited[1], file);
            }
          });
        }

        _bar = new ProgressBar('Generating cards [:bar] :current / :total', {
          complete: '=',
          incomplete: ' ',
          width: _cardsToGenerate * 4,
          total: _cardsToGenerate
        });

        for (var file in _cards) {
          _generate(_cards[file]);
        }

      });

    };

  };

  exports.CardsGenerator = CardsGenerator;

})();