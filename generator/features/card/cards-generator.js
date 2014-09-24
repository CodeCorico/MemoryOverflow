(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),
      spawn = require('child_process').spawn,
      Card = require('./card').Card,
      FileUtils = require('../file/file.js').File,
      ProgressBar = require('progress');

  function _endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  var CardsGenerator = function(templateFile, templateName) {
    var _bar = null,
        _cardsToLoad = 0,
        _loadedCards = [],
        _cardsToGenerate = 0,
        _cards = [];

    function _loadCards() {

      _cardsToLoad = 0;

      FileUtils.listFiles(path.join(__dirname, '../../../cards'), function(error, files) {

        if (!error) {
          // first, find the markdown files
          files.forEach(function(file) {
            if (_endsWith(file, 'md') && !_endsWith(file, 'README.md')) {
              var name = path.basename(file, '.md');
              _cards[name] = new Card(file, templateFile, templateName);
              _cardsToLoad ++;
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

        _bar = new ProgressBar('Loading cards [:bar] :current / :total', {
          complete: '=',
          incomplete: ' ',
          width: _cardsToLoad * 4,
          total: _cardsToLoad
        });

        _bar.render();

        for (var file in _cards) {
          _loadCard(_cards[file]);
        }

      });
    }

    function _loadCard(card) {
      card.load(function(error, loadedCards) {
        if (error) {
          throw new Error(error);
        }

        if (_bar) {
          _bar.tick();
        }

        _loadedCards = _loadedCards.concat(loadedCards);

        _cardsToLoad --;
        if (_cardsToLoad === 0) {
          console.log('Loading cards : Done');

          _generateCards();
        }
      });
    }

    function _generateCards() {
      _cardsToGenerate = Object.keys(_loadedCards).length;

      _bar = new ProgressBar('Generating cards [:bar] :current / :total', {
        complete: '=',
        incomplete: ' ',
        width: _cardsToGenerate * 4,
        total: _cardsToGenerate
      });

      _bar.render();

      _loadedCards.forEach(function(card) {
        _generateCard(card.html, card.name, card.code, card.lang);
      });
    }

    function _generateCard(html, card, code, lang) {
      var output = card + (code ? '-' + code : '') + (lang ? '.' + lang : ''),
          htmlFile = FileUtils.directory(path.join(__dirname, '../../../website', 'cards', templateName)) + '/' + output + '.html';

      fs.writeFile(htmlFile, html, function(err) {
        if (err) {
          throw new Error(err);
        }

        try {
          spawn(
            'wkhtmltoimage',
            ['--disable-javascript', htmlFile, FileUtils.directory(path.join(__dirname, '../../../website', 'print', templateName)) + '/' + output + '.jpg']
          ).stdout.on('end', function() {
            if (_bar) {
              _bar.tick();
            }

            _cardsToGenerate --;
            if (_cardsToGenerate === 0) {
              console.log('Generating cards : Done');
            }
          });
        }
        catch (err1) {
          throw new Error(err1);
        }
      });
    }

    this.generate = function() {
      _loadCards();
    };

  };

  exports.CardsGenerator = CardsGenerator;

})();