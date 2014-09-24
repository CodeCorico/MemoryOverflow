(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),
      FileUtils = require('../file/file.js').File,
      cheerio = require('cheerio');

  function _replaceStyle(content) {
    return content.replace(new RegExp('{([^/][a-z-]*)}', 'ig'), '<span class=\'content-$1\'>').replace(new RegExp('{(/[a-z-]*)}', 'ig'), '</span>');
  }

  function _translateHTML(html, translation) {
    return html.replace(new RegExp('&amp;{(.*?)}', 'g'), function(match, value) {
      return translation[value];
    });
  }

  function _getContentBetweenBraces(content, braceCode) {
    var begin = '{' + braceCode + '}',
        end = '{/' + braceCode + '}';
    return content.substring(content.indexOf(begin) + begin.length, content.indexOf(end));
  }

  function _applyStyles($element, json, width, height) {
    for (var key in json) {
      var value = json[key];

      if (key == 'area') {
        $element.css({
          top: value.y1,
          left: value.x1,
          bottom: height - value.y2,
          right: width - value.x2
        });
      }
      else {
        $element.css(key, value);
      }
    }
  }

  var Card = function(file, templatePath) {
    var _languageFiles = {},
        _templateFilePath = templatePath.substring(templatePath.indexOf('templates/') + 'templates/'.length);

    function _loadCard(cardContent, templateData, card, onLoadComplete) {
      var cardType = cardContent.type.content,
          imageFile = templatePath + '/' + _templateFilePath + '-' + cardType + '.jpg';

      fs.exists(imageFile, function(exists) {
        if (exists) {
          fs.readFile(path.join(__dirname, 'card.html'), 'utf8', function (err, data) {
            if (err) {
              onLoadComplete(err, null);
              return;
            }

            var cards = [],
                $ = cheerio.load(data),
                $container = $('.card-container'),
                $image = $('.card-image'),
                $content = $('.card-content'),
                cardCode = null,
                width = 3485, // TODO get image width
                height = 5195; // TODO get image height

            $container.css({
              width: width,
              height: height
            });

            $image.append($('<image src="' + imageFile + '"></span>'));

            for (var key in templateData) {
              var values = templateData[key];

              if (key == 'default-style') {
                _applyStyles($container, values, width, height);
              }
              else {
                var className = '';

                if (key.indexOf('-style') > 0) {
                  className = key.split('-')[0];
                }
                else if (key.indexOf('type-') === 0) {
                  className = 'content content-' + cardType;
                  if (key.split('-')[1] != cardType) {
                    continue;
                  }
                }
                else if (key == 'content') {
                  var style = '<style type="text/css">';

                  for (var styleKey in values) {
                    if (styleKey == 'default') {
                      style += '.content{\n';
                    }
                    else {
                      style += '.content-' + styleKey + '{\n';
                    }

                    for (var styleValue in values[styleKey]) {
                      style += styleValue + ': ' + values[styleKey][styleValue] + ';\n';
                    }

                    style += '}';
                  }
                  $('head').append(style + '</style>');
                  continue;
                }

                var $element = $('<span class="' + className + '"></span>');
                _applyStyles($element, values, width, height);
                $content.append($element);
              }
            }

            for (var key in cardContent) {
              var content = cardContent[key].content;

              if (key == 'title') {
                  $content.find('.title').html(content);
              }

              if (key.indexOf('code') === 0) {

                var code = _getContentBetweenBraces(content, 'code'),
                    comment = _getContentBetweenBraces(content, 'comment');

                cardCode = key.split(':')[1];

                if (code) {
                  $content.find('.content').html(code);
                }
                if (comment) {
                  $content.find('.comment').html(comment);
                }

                cards.push({
                  html: $.html(),
                  name: card,
                  code: cardCode
                });

              }

              if (key == 'description') {
                var description = content.substring(0, content.indexOf('{comment}')),
                    comment = _getContentBetweenBraces(content, 'comment');

                if (description) {
                  $content.find('.content').html(description);
                }
                if (comment) {
                  $content.find('.comment').html(comment);
                }

                cards.push({
                  html: $.html(),
                  name: card,
                  code: null
                });

              }

            }

            var _cards = [];

            // translate content
            cards.forEach(function(card) {
              var html = card.html;

              Object.keys(_languageFiles).forEach(function(lang) {

                var _card = {
                  html : _translateHTML(_replaceStyle(html), _languageFiles[lang]),
                  name: card.name,
                  code: card.code,
                  lang: lang
                };
                _cards.push(_card);

              });

            });

            onLoadComplete(null, _cards);

          });
        }
      });

    }

    this.load = function(onLoadComplete) {
      var splitFile = file.split('/'),
          card = splitFile[splitFile.length -1].replace('.md', '');

      fs.readFile(templatePath + '/' + _templateFilePath + '.json', 'utf8', function (err, data) {
        if (err) {
          onLoadComplete(err, null);
          return;
        }

        var templateData = JSON.parse(data);

        fs.readFile(file, 'utf8', function (err, data) {
          if (err) {
            onLoadComplete(err, null);
            return;
          }

          var cardContent = FileUtils.parseMarkdown(data);

          if (cardContent.type && cardContent.type.content) {
            _getLanguageContent(function() {
              _loadCard(cardContent, templateData, card, onLoadComplete);
            });
          }
          else {
            throw new Error('no type in card: ' + card);
          }

        });

      });

    };

    this.languageFiles = function(language, file) {
      if (typeof language != 'undefined' && typeof file != 'undefined') {
        _languageFiles[language] = file;
      }

      return _languageFiles;
    };

    var _numberLanguagesToParse = 0;

    function _getLanguageContent(callback) {
      if (_languageFiles) {
        callback = callback || false;

        _numberLanguagesToParse = Object.keys(_languageFiles).length;

        for (var language in _languageFiles) {
          _parseLanguage(language, _languageFiles[language], callback);
        }
      }
    }

    function _parseLanguage(language, file, callback) {

      fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          throw err;
        }

        var content = FileUtils.parsePo(data);

        // need to pre-parse the content
        for (var key in content) {
          content[_replaceStyle(key)] = _replaceStyle(content[key]);
        }

        _languageFiles[language] = content;

        _numberLanguagesToParse --;
        if (_numberLanguagesToParse === 0 && callback) {
          callback();
        }

      });
    }

  };

  exports.Card = Card;

})();