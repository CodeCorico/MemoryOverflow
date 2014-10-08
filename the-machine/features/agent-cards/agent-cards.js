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

  var AgentCard = function(theMachine) {
    TheMachineAgent.call(this, theMachine);

    var _this = this;

    function _init() {
      _this.name('of Cards');

      _this.says('Target acquired, I\'m watching it.');

      _this
        .watch(paths.templates, function(args) {
          var template = path.dirname(args.path).replace(path.join(__dirname, '../templates') + path.sep, ''),
              templateName = template.split(path.sep).pop();

          _this
            .newDiscussion()
            .says('Boss, the template "' + templateName + '" has been updated. I have to regenerate cards.');

          if(template) {
            _generate(template);
          }
        })
        .watch(paths.scripts, function() {
          _this
            .newDiscussion()
            .says('The Admin is working on your brain boss. I have to regenerate cards.');

          _generate();
        })
        .watch(paths.cardsContent, function() {
          _this
            .newDiscussion()
            .says('The cards have new changes. I have to regenerate cards.');

          _generate();
        })
        .watch(paths.cardsLang, function(args) {
          _this
            .newDiscussion()
            .says('Someone is trying to speak an other language. I have to regenerate cards.');

          var lang = path.basename(args.path, '.po').split('.')[1];
          _generate(null, lang);
        });
    }

    function _generate() {
      _this.says('Cards generated. Everything is ok.', {
        needGratitude: true
      });
    }

    _init();
  };

  module.exports = AgentCard;

 })();