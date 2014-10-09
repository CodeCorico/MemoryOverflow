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

    this.says = function(sentence, askTheMachine) {
      console.log(_this.saysFormat().replace('{sentence}', sentence));

      if(askTheMachine) {
        theMachine.answers(askTheMachine);
      }

      return _this;
    };

    this.saysError = function(sentence, askTheMachine) {
      _this.says(clc.yellow(sentence), askTheMachine);
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