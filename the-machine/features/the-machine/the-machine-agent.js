(function() {
  'use strict';

  var clc = require('cli-color'),
      extend = require('extend');

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

    this.says = function(sentence, askTheMachine) {
      console.log(clc.blue('Agent ' + _this.name() + ': ') + clc.blueBright(sentence));

      if(askTheMachine) {
        extend(true, {
          needGratitude: false
        }, askTheMachine);

        theMachine.asks(askTheMachine);
      }

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