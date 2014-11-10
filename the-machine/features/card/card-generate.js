(function() {
  'use strict';

  var fs = require('fs-extra'),
      extend = require('extend'),
      path = require('path'),
      glob = require('glob'),
      spawn = require('child_process').spawn,
      Card = require('./card'),
      CardReadme = require('./card-readme'),
      ProgressBar = require('progress'),

      PATHS = {
        WKHTMLTOIMAGE: path.resolve(path.join(__dirname, '..', '..', 'vendor', 'wkhtmltoimage', 'wkhtmltoimage') + (process.platform == 'win32' ? '.exe' : '')),
        CARDS: path.join(__dirname, '..', '..', '..', 'cards', '**', '**', '*.+(md|po)'),
        WEBSITE_PRINT: path.join(__dirname, '..', '..', '..', 'website', 'data', 'print'),
        TEMPLATES: path.join(__dirname, '..', '..', '..', 'templates', '**', '*.json')
      };

  function cardGenerate(options, log, onGenerationComplete) {
    options = extend(true, {
      onlyTemplate: null,
      onlyName: null,
      onlyLang: null,
      progressLoad: '[:bar] :current / :total',
      progressGeneration: '[:bar] :current / :total'
    }, options || {});

    var _bar = null,
        _cardsToLoad = 0,
        _loadedCards = [],
        _cardsToGenerate = 0,
        _cards = [],
        templates = [];

    if(options.onlyTemplate) {
      templates.push(options.onlyTemplate);
    }
    else {
      var files = glob.sync(PATHS.TEMPLATES);
      files.forEach(function(file) {
        templates.push(file
          .split('/')
          .pop()
          .replace('.json', '')
        );
      });
    }

    function _endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function _loadCards() {
      var atLeastOneCard = false;

      _cardsToLoad = 0;

      var files = glob.sync(PATHS.CARDS);

      if (files && files.length) {
        files = files.map(function(file) {
          return path.resolve(file);
        });

        files.forEach(function(file) {
          if (_endsWith(file, 'md') && !_endsWith(file, 'README.md')) {
            var name = path.basename(file, '.md');

            if (!options.onlyName || options.onlyName == name) {
              templates.forEach(function(template) {
                _cards[name] = new Card(file, template, name);
                _cardsToLoad++;
              });
            }
          }
        });

        files.forEach(function(file) {
          if (_endsWith(file, 'po')) {
            var splitted = path.basename(file, '.po').split('.'),
                name = splitted[0],
                fileLang = splitted[1];

            if ((!options.onlyLang || options.onlyLang == fileLang) && _cards[name]) {
              atLeastOneCard = true;

              _cards[name].languageFiles(fileLang, file);
            }
          }
          else if (_endsWith(file, 'README.md')) {
            var name = path.dirname(file).split(path.sep).pop();

            if (_cards[name]) {
              _cards[name].readmeFile(file);
            }
          }
        });
      }

      if (atLeastOneCard) {
        _bar = new ProgressBar(options.progressLoad, {
          complete: '=',
          incomplete: ' ',
          width: _cardsToLoad * 4,
          total: _cardsToLoad
        });

        _bar.render();

        for (var file in _cards) {
          _loadCard(_cards[file]);
        }
      }
      else {
        onGenerationComplete(false, {
          msg: 'no card'
        });
      }
    }

    function _loadCard(card) {
      card.load(function(error, loadedCards) {
        if (error) {
          _bar.terminate();
          onGenerationComplete(false, {
            msg: error,
            card: card.name()
          });
          return;
        }

        if (_bar) {
          _bar.tick();
        }

        //new CardReadme(card).generate();

        _loadedCards = _loadedCards.concat(loadedCards);

        _cardsToLoad--;
        if (_cardsToLoad === 0) {
          _generateCards();
        }
      });
    }

    function _generateCards() {
      _cardsToGenerate = Object.keys(_loadedCards).length;

      _bar = new ProgressBar(options.progressGeneration, {
        complete: '=',
        incomplete: ' ',
        width: _cardsToGenerate * 4,
        total: _cardsToGenerate
      });

      _bar.render();

      _loadedCards.forEach(function(card) {
        _generateCard(card.html, card.name, card.template, card.code, card.lang);
      });
    }

    function _generateCard(html, card, template, code, lang) {
      var output = card + (code ? '-' + code : '') + (lang ? '.' + lang : ''),
          htmlFile = path.join(PATHS.WEBSITE_PRINT, template);

      fs.ensureDirSync(htmlFile);
      htmlFile = path.join(htmlFile, output + '.html');

      fs.writeFile(htmlFile, html, function(err) {
        if (err) {
          throw new Error(err);
        }

        try {
          var imgFile = path.join(PATHS.WEBSITE_PRINT, template);
          fs.ensureDirSync(imgFile);
          imgFile = path.join(imgFile, output + '.jpg');

          spawn(
            PATHS.WKHTMLTOIMAGE, [
              '--disable-javascript',
              htmlFile,
              imgFile
            ]
          ).stdout.on('end', function() {
            if (_bar) {
              _bar.tick();
            }

            _cardsToGenerate--;
            if (_cardsToGenerate === 0) {
              if (onGenerationComplete) {
                onGenerationComplete(true);
              }
            }
          });
        }
        catch (err1) {
          throw new Error(err1);
        }
      });
    }

    _loadCards();

  };

  module.exports = cardGenerate;

})();