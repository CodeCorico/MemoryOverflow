(function() {
  'use strict';

  var TheMachineAgent = require('../the-machine/the-machine-agent.js'),
      path = require('path');

  var paths = {
    scripts: ['features/**/*.js'],
    cardsContent: ['../cards/**/*.md'],
    cardsLang: ['../cards/**/*.po'],
    templates: ['../templates/**/*.json', '../templates/**/*.jpg', '../templates/**/*.png']
  };

  var AgentCard = function() {
    TheMachineAgent.call(this);

    var _this = this;

    function _init() {
      _this.name('of Cards');

      _this.says('Target acquired, I\'m watching it.');

      _this
        .watch(paths.templates, function(args) {
          var template = path.dirname(args.path).replace(path.join(__dirname, '../templates') + '/', '');
          if(template) {
            _generate(template);
          }
        })
        .watch(paths.scripts, function() {
          _generate();
        })
        .watch(paths.cardsContent, function() {
          _generate();
        })
        .watch(paths.cardsLang, function(args) {
          var lang = path.basename(args.path, '.po').split('.')[1];
          _generate(null, lang);
        });
    }

    function _generate() {
      _this.says('I generate biatch.');
    }

    _init();
  };

  module.exports = AgentCard;

 })();