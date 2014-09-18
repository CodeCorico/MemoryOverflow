(function() {
  'use strict';

  var fs = require('fs'),
      FileUtils = require('../file/file.js').File,
      spawn = require('child_process').spawn,
      jsdom = require('jsdom');

  function _parseMD(data) {
    var nodes = data.split('\n'),
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
          fs.readFile('features/card/card.html', 'utf8', function (err, data) {
            if (err) {
              console.error(err);
            }

            // var jquery = fs.readFileSync('vendor/jquery/jquery-1.11.1.min.js', 'utf-8');

            jsdom.env(data, ['http://code.jquery.com/jquery.js'], function (errors, window) {
              var $ = window.$,
                $container = $('.card-container'),
                  $image = $('.card-image'),
                  $content = $('.card-content'),
                  language = null,
                  width = 3485,
                  height = 5195;

              $container .css({
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
                  var code = content.substring(content.indexOf('{code}') + 6, content.indexOf('{/code}')),
                      comment = content.substring(content.indexOf('{comment}') + 9, content.indexOf('{/comment}'));

                  language = key.split(':')[1];

                  if (code) {
                    $content.find('.content').html(code);
                  }
                  if (comment) {
                    $content.find('.comment').html(comment);
                  }

                }

              }

              var html = '<!DOCTYPE html>\n' + window.$('html').html(),
                  output = card + (language ? '-' + language : ''),
                  htmlFile = FileUtils.directory(FileUtils.websiteDirectory() + 'cards/' + templateName + '/') + output + '.html';

              fs.writeFile(htmlFile, html, function(err) {
                var error = err;
                if (!err) {
                  try {
                    spawn('wkhtmltoimage', [htmlFile, FileUtils.directory(FileUtils.websiteDirectory() + 'print/' + templateName + '/') + output + '.jpg']);
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
            });

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