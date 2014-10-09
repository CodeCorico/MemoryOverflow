(function() {
  'use strict';

  var assert = require('chai').assert,
      path = require('path'),
      fs = require('fs'),
      theMachine = null,
      theMachinePath = path.resolve(path.join(__dirname, 'the-machine.js')),
      agent = null,
      agentPath = path.resolve(path.join(__dirname, 'the-machine-agent.js')),
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

  describe('The Machine', function() {

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

  describe('The Special Agents', function() {

    it('should start', function() {
      assert(fs.existsSync(agentPath), 'the-machine-agent.js file exists');

      _stopConsoleLog();
      var TheMachineAgent = require(agentPath),
          inError = false;

      try {
        agent = new (function() {
          TheMachineAgent.call(this, theMachine);

          this.name('of tests');
        })();
      }
      catch(error) {
        inError = true;
      }

      _startConsoleLog();
      assert(!inError, 'Start Agent of tests');
    });

    it('should communicate with The Machine', function() {
      var sentence = 'Boss are you there?';

      _stopConsoleLog();
      agent.says(sentence);

      _startConsoleLog();
      assert(lastLog.indexOf('Agent of tests:') > -1 && lastLog.indexOf(sentence) > -1, 'Agent knows how to communicate.');

      _stopConsoleLog();
      agent.says(sentence, {
        needHello: true
      });
      _startConsoleLog();

      assert(lastLog.indexOf('The Machine:') > -1 && lastLog.indexOf('Hello.') > -1, 'Agent knows how to communicate with The Machine.');
    });

  });

})();