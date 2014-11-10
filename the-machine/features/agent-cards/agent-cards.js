(function() {
  'use strict';

  var TheMachineAgent = require('../the-machine/the-machine-agent.js'),
      cardGenerate = require('../card/card-generate.js'),
      path = require('path'),

      PATHS = {
        CARDS_CONTENT: ['../cards/**/*.md'],
        CARDS_LANG: ['../cards/**/*.po'],
        TEMPLATES: ['../templates/**/*.json', '../templates/**/*.jpg', '../templates/**/*.png']
      };

  var AgentCard = function(theMachine) {
    TheMachineAgent.call(this, theMachine);

    var _this = this;

    function _init() {
      _this.name('of Cards');

      if(theMachine.isOneShot()) {
        _this.says('Sorry boss, I don\'t support the one shot generation for now.');
        return;
      }

      _this.says('Target acquired, I\'m watching it.');

      _this
        .watch(PATHS.TEMPLATES, function(args) {
          var template = args.path
            .split(path.sep)
            .pop()
            .replace('.json', '');

          _this
            .newDiscussion()
            .says('Boss, the template "' + template + '" has been updated. I have to regenerate cards.');

          if(template) {
            _generate({
              onlyTemplate: template
            });
          }
        })
        .watch(PATHS.CARDS_CONTENT, function() {
          _this
            .newDiscussion()
            .says('The cards have new changes. I have to regenerate cards.');

          _generate();
        })
        .watch(PATHS.CARDS_LANG, function(args) {
          _this
            .newDiscussion()
            .says('Someone is trying to speak an other language. I have to regenerate cards.');

          var lang = path.basename(args.path, '.po').split('.')[1];
          _generate({
            onlyLang: lang
          });
        });
    }

    function _generate(options) {
      options = options || {};
      options.progressLoad = _this.saysFormat().replace('{sentence}', 'Loading [:bar] :current / :total');
      options.progressGeneration = _this.saysFormat().replace('{sentence}', 'Generation [:bar] :current / :total');

      cardGenerate(options, function(message) {
        _this.says(message);
      }, function(success, error) {
        if(success) {
          _this.says('Cards generated. Everything is ok.', {
            needGratitude: true
          });
        }
        else {
          error.msg = error.msg == 'no card' ? 'Hmm... I haven\'t found any card.' : error.msg;
          error.msg = error.msg == 'no type' ? 'Hmm... The card "' + error.card + '" has no type in its README file.' : error.msg;

          _this.saysError(error.msg, {
            needSlaps: true
          });
        }
      });
    }

    _init();
  };

  module.exports = AgentCard;

 })();