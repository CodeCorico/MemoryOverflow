const fs = require('fs-extra');
const extend = require('extend');
const path = require('path');
const glob = require('glob');
const spawnSync = require('child_process').spawnSync;
const Card = require('./card');
const CardReadme = require('./card-readme');
const ProgressBar = require('progress');

const PATHS = {
  WKHTMLTOIMAGE: path.resolve(path.join(__dirname, '../../vendor/wkhtmltoimage/wkhtmltoimage') + (process.platform == 'win32' ? '.exe' : '')),
  CARDS: path.join(__dirname, '../../../cards/**/**/*.+(md|po)'),
  TEMPLATES: path.join(__dirname, '../../../templates/**/*.json'),
  WEBSITE_PRINT: path.join(process.env.WEBSITE_TARGET, 'cards')
};

module.exports = (options, log, onGenerationComplete) => {
  options = extend(true, {
    onlyTemplate: null,
    onlyName: null,
    onlyLang: null,
    progressGeneration: '[:bar] :current / :total'
  }, options || {});

  var _bar = null,
      _loadedCards = [],
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
      for (var file in _cards) {
        _loadCard(_cards[file]);
      }

      let cardsLength = Object.keys(_loadedCards).length;

      console.log(cardsLength);

      _bar = new ProgressBar(options.progressGeneration, {
        complete: '=',
        incomplete: ' ',
        width: cardsLength * 4,
        total: cardsLength
      });

      _bar.render();

      _generateCards();
    }
    else {
      onGenerationComplete(false, {
        msg: 'no card'
      });
    }
  }

  function _loadCard(card) {
    let cards = card.load();

    if (typeof cards == 'string') {
      _bar.terminate();

      onGenerationComplete(false, {
        msg: cards,
        card: card.name()
      });

      return;
    }

    //new CardReadme(card).generate();

    _loadedCards = _loadedCards.concat(cards);
  }

  function _generateCards(i) {
    i = i || 0;

    if (_loadedCards[i]) {
      let card = _loadedCards[i];

      _generateCard(card.html, card.name, card.template, card.code, card.lang);

      _bar.tick();

      setTimeout(() => {
        _generateCards(++i);
      });
    }
    else {
      if (onGenerationComplete) {
        onGenerationComplete(true);
      }
    }
  }

  function _generateCard(html, card, template, code, lang) {
    var output = card + (code ? '-' + code : '') + (lang ? '.' + lang : ''),
        htmlFile = path.join(PATHS.WEBSITE_PRINT, template);

    fs.ensureDirSync(htmlFile);
    htmlFile = path.join(htmlFile, output + '.html');

    fs.writeFileSync(htmlFile, html);

    try {
      var imgFile = path.join(PATHS.WEBSITE_PRINT, template);
      fs.ensureDirSync(imgFile);
      imgFile = path.join(imgFile, output + '.jpg');

      spawnSync(
        PATHS.WKHTMLTOIMAGE, [
          '--disable-javascript',
          htmlFile,
          imgFile
        ]
      )

      fs.removeSync(htmlFile);
    }
    catch (err1) {
      throw new Error(err1);
    }
  }

  _loadCards();
};
