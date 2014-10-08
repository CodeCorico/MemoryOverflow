(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),
      CardsGenerator = require('./features/card/cards-generator').CardsGenerator,
      FileUtils = require('./features/file/file.js').File,
      cmdArgs = {};

  process.argv.forEach(function (val) {
    if (val != 'node' && val.indexOf('generator.js') === -1) {
      var type = val.split('=')[0],
          value = val.split('=')[1];

      if (type.substring(0, 2) == '--') {
        cmdArgs[type.substring(2)] = value;
      }
    }
  });

  var TheMachine = function(options) {
    options = options || {};

    var _template = options.template || cmdArgs.template,
        _templatesToGenerate = 0,
        _onGenerationComplete = false,
        _lang = options.lang || cmdArgs.lang;

    function _templateExists(template, callback) {
      fs.exists(template, function(exists) {
        if (!exists) {
            throw new Error('template \'' + template + '\' does not exist');
        }
        if (callback) {
          callback();
        }
      });
    }

    function _generateTemplate(template) {
      var templatePath = path.join(__dirname, '../templates/', template);

      _templateExists(templatePath, function() {

        FileUtils.directory(path.join(__dirname, '../website', 'data'));
        FileUtils.directory(path.join(__dirname, '../website', 'data', 'cards'));
        FileUtils.directory(path.join(__dirname, '../website', 'data', 'print'));

        (new CardsGenerator(templatePath, template, _lang)).generate(function() {

          _templatesToGenerate --;

          if (_templatesToGenerate === 0 && _onGenerationComplete) {
            _onGenerationComplete();
          }

        });

      });
    }

    this.generate = function(onGenerationComplete) {
      _onGenerationComplete = onGenerationComplete || false;

      if (_lang && _lang.length == 2) {
        _lang = _lang + '_' + _lang.toUpperCase();
      }

      var templates = [];

      if (_template) {
        templates.push(_template);
      }
      else {
        var templatesPath = path.join(__dirname, '../templates'),
            directories = fs.readdirSync(templatesPath).filter(function (file) {
              return fs.statSync(path.join(templatesPath, file)).isDirectory();
            });

        directories.forEach(function(template) {
          templates.push(template);
        });
      }

      _templatesToGenerate = templates.length;

      templates.forEach(function(template) {
        _generateTemplate(template, onGenerationComplete);
      });
    };

  };

  exports.TheMachine = TheMachine;

 })();