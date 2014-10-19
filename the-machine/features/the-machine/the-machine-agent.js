(function() {
  'use strict';

  var clc = require('cli-color');

  var TheMachineAgent = function(theMachine) {

    var _this = this,
        _name = null,
        _watchers = [];

    this.name = function(newName) {
      if(typeof newName != 'undefined') {
        _name = newName;
      }

      return _name;
    };

    this.newDiscussion = function() {
      console.log('');
      return _this;
    };

    this.saysFormat = function() {
      return clc.blue('Agent ' + _this.name() + ': ') + clc.blueBright('{sentence}');
    };

    this.says = function(sentence, askTheMachine, specialColor) {
      specialColor = specialColor || clc.blueBright;

      process.stdout.write(clc.blue('Agent ' + _this.name() + ': '));
      for(var i = 0, len = sentence.length; i < len; i++) {
        process.stdout.write(specialColor(sentence[i]));
        var wait = 20,
            stop = 1 * new Date();
        while(1 * new Date() < stop + wait) { }
      }
      process.stdout.write('\n');

      if(askTheMachine) {
        theMachine.answers(askTheMachine);
      }

      return _this;
    };

    this.saysError = function(sentence, askTheMachine) {
      _this.says(sentence, askTheMachine, clc.yellow);
      return _this;
    };

    this.watch = function(files, func) {
      _watchers.push({
        files: files,
        func: func
      });

      return _this;
    };

    this.watchers = function() {
      return _watchers;
    };

  };

  module.exports = TheMachineAgent;

 })();