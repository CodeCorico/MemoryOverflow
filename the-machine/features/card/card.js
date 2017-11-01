const fs = require('fs');
const path = require('path');
const parserMarkdown = require(path.join(__dirname, '../parser-markdown/parser-markdown.js'));
const parserGettext = require(path.join(__dirname, '../parser-gettext/parser-gettext.js'));
const cheerio = require('cheerio');

function Card (file, template, name) {
  if (!file || !template) {
    throw new Error('A file and a template are required.');
  }

  const _this = this;

  let _name = name;
  let _languageFiles = {};
  let _languages = {};
  let _readmeFile = null;
  let _cardConfig = null;
  let _templatePath = path.resolve(path.join(__dirname, '..', '..', '..', 'templates', template));
  let _templateFilePath = _templatePath.substring(_templatePath.indexOf('templates' + path.sep) + ('templates' + path.sep).length);
  let _numberLanguagesToParse = 0;

  const replaceStyle = (content) => {
    return content
      .replace(/\n{\/([a-z-]*)}/ig, '</p>')
      .replace(/[^&]{!\/|{([a-z-]*)}\n/ig, '<p class="content-$1">')
      .replace(/{\/([a-z-]*)}/ig, '</span>')
      .replace(/[^&]{!\/|{([a-z-]*)}/ig, '<span class="content-$1">');
  };

  const translateHTML = (html, translation) => {
    return html.replace(/&amp;{(.*?)}/g, (match, value) => {
      return translation[value];
    });
  };

  const applyStyles = ($element, json) => {
    for (let key in json) {
      let value = json[key];

      if (key == 'area') {
        $element.css({
          top: value.y1,
          left: value.x1,
          height: value.y2 - value.y1,
          width: value.x2 - value.x1
        });
      }
      else {
        $element.css(key, value);
      }
    }
  };

  const loadCard = (templateData, card) => {
    let cardType = _cardConfig.type;
    let imageFile = path.join(_templatePath, _templateFilePath + '-' + cardType.replace(/\s+/g, '-').toLowerCase() + '.jpg');

    let exists = fs.existsSync(imageFile);

    if (!exists) {
      throw new Error(imageFile + ' does not exist');
    }

    let data = null;

    try {
      data = fs.readFileSync(path.join(__dirname, 'card.html'), 'utf8');
    }
    catch (err) {
      return err.message;
    }

    let cards = [];
    let $ = cheerio.load(data);
    let $container = $('.card-container');
    let $image = $('.card-image');
    let $content = $('.card-content');
    let cardCode = null;

    // TODO get image width
    let width = 3485;
    // TODO get image height
    let height = 5195;

    $container.css({
      width: width,
      height: height
    });

    $image.append($(`<img src="${imageFile}" />`));

    for (let key in templateData) {
      let values = templateData[key];

      if (key == 'default') {
        applyStyles($container, values);
      }
      else {
        let className = '';

        if (key.indexOf('type-') === 0) {
          className = 'content content-' + cardType;

          if (key.split('-')[1] != cardType) {
            continue;
          }
        }
        else if (key == 'text-style') {
          let style = ['<style type="text/css">'];

          for (let styleKey in values) {
            if (styleKey == 'default') {
              style.push('.content{');
            }
            else {
              style.push('.content-' + styleKey + '{');
            }

            for (let styleValue in values[styleKey]) {
              style.push(styleValue + ': ' + values[styleKey][styleValue] + ';');
            }

            style.push('}');
          }

          style.push('</style>');

          $('head').append(style.join('\n'));

          continue;
        }
        else {
          className = key;
        }

        let $element = $('<span class="' + className + '"></span>');
        applyStyles($element, values);
        $content.append($element);
      }
    }

    $content.find('.brand').html('MemoryOverflow');

    for (let key in _cardConfig) {
      let content = replaceStyle(_cardConfig[key]);

      if (key == 'title') {
        $content.find('.title').html(content);
      }
      else if (key == 'edition') {
        $content.find('.edition').append('<span>' + content + ' - ' + content.substring(0, 1).toUpperCase() + '</span>');
      }
      else if (key.indexOf('code') === 0) {
        cardCode = key.split(':')[1];

        _cardConfig.codes = _cardConfig.codes || [];
        _cardConfig.codes.push(cardCode);

        $content.find('.content').html(content);

        cards.push({
          html: $.html(),
          name: card,
          template: _this.template(),
          code: cardCode
        });
      }
      else if (key == 'content') {
        $content.find('.content').html(content);

        cards.push({
          html: $.html(),
          name: card,
          template: _this.template(),
          code: null
        });
      }
    }

    let _cards = [];

    // translate content
    cards.forEach((card) => {
      let html = card.html;

      Object.keys(_languageFiles).forEach((lang) => {
        let _card = {
          html: translateHTML(html, _languageFiles[lang]),
          name: card.name,
          template: _this.template(),
          code: card.code,
          lang: lang
        };

        _cards.push(_card);
      });

    });

    return _cards;
  };

  const getLanguageContent = (callback) => {
    if (!_languages) {
      return;
    }

    _numberLanguagesToParse = Object.keys(_languages).length;

    if (_numberLanguagesToParse === 0) {
      throw new Error('No language files for card: ' + file);
    }

    for (let language in _languages) {
      parseLanguage(language, _languages[language]);
    }
  };

  const parseLanguage = (language, file) => {
    let data = fs.readFileSync(file, 'utf8');

    let parsedContent = {};
    _languages[language] = parserGettext(data);

    // need to pre-parse the content
    for (let key in _languages[language]) {
      parsedContent[replaceStyle(key)] = replaceStyle(_languages[language][key]);
    }

    _languageFiles[language] = parsedContent;

    _numberLanguagesToParse--;
  };

  this.name = () => {
    return _name;
  };

  this.template = () => {
    return template;
  };

  this.load = (onLoadComplete) => {
    let splitFile = file.split(path.sep);
    let card = splitFile[splitFile.length -1].replace('.md', '');
    let jsonFile = path.join(_templatePath, _templateFilePath + '.json');

    let data = null;

    try {
      data = fs.readFileSync(jsonFile, 'utf8');
    }
    catch (err) {
      return err.message;
    }

    let templateData = JSON.parse(data);

    try {
      data = fs.readFileSync(file, 'utf8');
    }
    catch (err) {
      return err.message;
    }

    _cardConfig = parserMarkdown(data);
    _cardConfig.name = _name;

    if (_cardConfig.type) {
      getLanguageContent();

      return loadCard(templateData, card);
    }
    else {
      return 'no type';
    }
  };

  this.languageFiles = (language, file) => {
    if (typeof language != 'undefined' && typeof file != 'undefined') {
      _languages[language] = file;
    }

    return _languages;
  };

  this.config = () => {
    return _cardConfig;
  };

  this.readmeFile = (readmeFile) => {
    if (typeof readmeFile != 'undefined') {
      _readmeFile = readmeFile;
    }
    return _readmeFile;
  };
}

module.exports = Card;
