(function() {
  'use strict';

  var assert = require('chai').assert,
      path = require('path'),
      fs = require('fs');

  describe('The Machine', function() {

    var theMachine = null,
        theMachinePath = path.resolve(path.join(__dirname, 'the-machine.js')),
        log = null,
        lastLog = '';

    function _stopConsoleLog() {
      log = console.log;

      console.log = function(string) {
        lastLog = string;
      };
    }

    function _startConsoleLog() {
      console.log = log;
    }

    it('should start', function() {
      assert(fs.existsSync(theMachinePath), 'the-machine.js file exists');

      _stopConsoleLog();
      var TheMachine = require(theMachinePath),
          inError = false;

      try {
        theMachine = new TheMachine();
      }
      catch(error) {
        inError = true;
      }

      _startConsoleLog();
      assert(!inError, 'Start The Machine');
    });

    it('should communicate', function() {
      var sentence = 'Someone is trying to test my brain.';

      _stopConsoleLog();
      theMachine.says(sentence);
      _startConsoleLog();
      assert(lastLog.indexOf('The Machine:') > -1 && lastLog.indexOf(sentence) > -1, 'The Machine knows how to communicate.');

      _stopConsoleLog();
      theMachine.answers({
        needHello: true
      });
      _startConsoleLog();

      assert(lastLog.indexOf('The Machine:') > -1 && lastLog.indexOf('Hello.') > -1, 'The Machine knows how to answer.');
    });

  });

})();