(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),
      FileUtils = require('../file/file.js').File,
      spawn = require('child_process').spawn,
      cheerio = require('cheerio');

  function _parseMD(data) {
    var nodes = data
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n'),
        contents = {},
        header = null,
        content = '';

    nodes.forEach(function(node) {

      // Heading 2
      if (node.indexOf('##') === 0) {
        content = '';
        header = node.replace('## ','');
      }
      // Heading 1
      else if (node.indexOf('#') === 0) {
        content = '';
        header = node.replace('# ','');
      }
      // Paragraph
      else if (node.length > 0) {
        content += node;

        contents[header] = {
          content: content
        };
      }
    });

    return contents;
  }

  function _replaceStyleMD(content) {
    return content.replace(new RegExp('{([^/][a-z-]*)}', 'ig'), '<span class=\'content-$1\'>').replace(new RegExp('{(/[a-z-]*)}', 'ig'), '</span>');
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

  var Card = function(file, templatePath, templateName) {
    var _templateFilePath = templatePath.substring(templatePath.indexOf('templates/') + 'templates/'.length),
        _templateJSONFile = _templateFilePath + '.json';

    function _generateCard(cardContent, templateData, card, onGenerationComplete) {
      var cardType = cardContent.type.content,
          imageFile = templatePath + '/' + _templateFilePath + '-' + cardType + '.jpg';

      fs.exists(imageFile, function(exists) {
        if (exists) {
          fs.readFile(path.join(__dirname, 'card.html'), 'utf8', function (err, data) {
            if (err) {
              console.error(err);
            }

            var $ = cheerio.load(data),
                $container = $('.card-container'),
                $image = $('.card-image'),
                $content = $('.card-content'),
                language = null,
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
                  $content.find('.title').html(_replaceStyleMD(content));
              }

              if (key.indexOf('code') === 0) {

                var code = _getContentBetweenBraces(content, 'code'),
                    comment = _getContentBetweenBraces(content, 'comment');

                language = key.split(':')[1];

                if (code) {
                  $content.find('.content').html(_replaceStyleMD(code));
                }
                if (comment) {
                  $content.find('.comment').html(_replaceStyleMD(comment));
                }

                _dumpCard($.html(), card, language, onGenerationComplete);

              }

              if (key == 'description') {
                var description = content.substring(0, content.indexOf('{comment}')),
                    comment = _getContentBetweenBraces(content, 'comment');

                if (description) {
                  $content.find('.content').html(_replaceStyleMD(description));
                }
                if (comment) {
                  $content.find('.comment').html(_replaceStyleMD(comment));
                }

                _dumpCard($.html(), card, null, onGenerationComplete);

              }

            }

          });
        }
      });

    }

    function _dumpCard(html, card, language, onGenerationComplete) {
      var output = card + (language ? '-' + language : ''),
          htmlFile = FileUtils.directory(path.join(__dirname, '../../../website', 'cards', templateName)) + '/' + output + '.html';

      fs.writeFile(htmlFile, html, function(err) {
        var error = err;
        if (!err) {
          try {
            spawn('wkhtmltoimage', ['--disable-javascript', htmlFile, FileUtils.directory(path.join(__dirname, '../../../website', 'print', templateName)) + '/' + output + '.jpg']);
          }
          catch (err1) {
            error = err1;
          }
        }
        if (onGenerationComplete) {
          onGenerationComplete({
            success: !error,
            error: error
          });
        }
      });
    }

    this.generate = function(onGenerationComplete) {
      var splitFile = file.split('/'),
          card = splitFile[splitFile.length -1].replace('.md', '');

      fs.readFile(templatePath + '/' + _templateFilePath + '.json', 'utf8', function (err, data) {
        if (err) {
          throw err;
        }

        var templateData = JSON.parse(data);

        fs.readFile(file, 'utf8', function (err, data) {
          if (err) {
            throw err;
          }

          var cardContent = _parseMD(data);

          if (cardContent.type && cardContent.type.content) {
            _generateCard(cardContent, templateData, card, onGenerationComplete);
          }
          else {
            throw new Error('no type in card: ' + card);
          }

        });

      });

    };
  };

  exports.Card = Card;

})();