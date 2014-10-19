(function() {
  'use strict';

  var expect = require('chai').expect,
      path = require('path'),
      fs = require('fs'),
      theMachine = null,
      theMachinePath = path.resolve(path.join(__dirname, 'the-machine.js')),
      agent = null,
      agentPath = path.resolve(path.join(__dirname, 'the-machine-agent.js')),
      log = null,
      stdoutWrite = null,
      lastLog = '';

  function _stopConsoleLog() {
    _cleanLog();
    log = console.log;
    stdoutWrite = process.stdout.write;

    console.log = function(string) {
      lastLog = string;
    };

    process.stdout.write = function(string) {
      lastLog += string;
    };
  }

  function _cleanLog() {
    lastLog = '';
  }

  function _cleanLastLogConsole() {
    lastLog = lastLog.replace(/\u001b/g, '').replace(/\[.*?m/g, '');
  }

  function _startConsoleLog() {
    console.log = log;
    process.stdout.write = stdoutWrite;
  }

  describe('The Machine', function() {

    it('should start', function() {
      expect(fs.existsSync(theMachinePath)).to.be.true;

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
      expect(inError).to.be.false;
    });

    it('should communicate', function() {
      var sentence = 'Someone is trying to test my brain.';

      _stopConsoleLog();
      theMachine.says(sentence);
      _startConsoleLog();
      _cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain(sentence);

      _stopConsoleLog();
      theMachine.answers({
        needHello: true
      });
      _startConsoleLog();

      _cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain('Hello.');
    });

  });

  describe('The Special Agents', function() {

    it('should start', function() {
      expect(fs.existsSync(agentPath)).to.be.true;

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
      expect(inError).to.be.false;
    });

    it('should communicate with The Machine', function() {
      var sentence = 'Boss are you there?';

      _stopConsoleLog();
      agent.says(sentence);

      _startConsoleLog();

      _cleanLastLogConsole();
      expect(lastLog).to.contain('Agent of tests:');
      expect(lastLog).to.contain(sentence);

      _stopConsoleLog();
      agent.says(sentence, {
        needHello: true
      });
      _startConsoleLog();

      _cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain('Hello.');
    });

  });

})();