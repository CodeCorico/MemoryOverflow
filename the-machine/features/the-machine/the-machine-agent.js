(function() {
  'use strict';

  var clc = require('cli-color');

  var TheMachineAgent = function() {

    var _this = this,
        _name = null,
        _watchers = [];

    this.name = function(newName) {
      if(typeof newName != 'undefined') {
        _name = newName;
      }

      return _name;
    };

    this.says = function(sentence) {
      console.log(clc.blueBright('Agent ' + _this.name() + ' says: ' + sentence));
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