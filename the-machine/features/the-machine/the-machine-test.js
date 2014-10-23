(function() {
  'use strict';

  var expect = require('chai').expect,
      path = require('path'),
      fs = require('fs'),
      TheMachine = null,
      theMachine = null,
      theMachineOneShot = null,
      theMachinePath = path.resolve(path.join(__dirname, 'the-machine.js')),
      TheMachineAgent = null,
      agent = null,
      agentOneShot = null,
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

      TheMachine = require(theMachinePath);

      var inError = false;
      _stopConsoleLog();
      try {
        theMachine = new TheMachine();
      }
      catch(error) {
        inError = true;
      }

      _startConsoleLog();
      expect(inError).to.be.false;
    });

    it('should start in one shot mode', function() {
      var inError = false;
      _stopConsoleLog();
      try {
        theMachineOneShot = new TheMachine(true);
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

    it('should communicate in one shot mode', function() {
      var sentence = 'Someone is trying to test my brain. Again.';

      _stopConsoleLog();
      theMachineOneShot.says(sentence);
      _startConsoleLog();
      _cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain(sentence);

      _stopConsoleLog();
      theMachineOneShot.answers({
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

      TheMachineAgent = require(agentPath);

      var inError = false;
      _stopConsoleLog();
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

    it('should start in one shot mode', function() {
      var inError = false;
      _stopConsoleLog();
      try {
        agentOneShot = new (function() {
          TheMachineAgent.call(this, theMachineOneShot);

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

    it('should communicate with The Machine in one shot mode', function() {
      var sentence = 'Boss are you there?';

      _stopConsoleLog();
      agentOneShot.says(sentence);

      _startConsoleLog();

      _cleanLastLogConsole();
      expect(lastLog).to.contain('Agent of tests:');
      expect(lastLog).to.contain(sentence);

      _stopConsoleLog();
      agentOneShot.says(sentence, {
        needHello: true
      });
      _startConsoleLog();

      _cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain('Hello.');
    });

    it('should have a sentence template', function() {
      var sentence = agent.saysFormat();
      expect(sentence).to.contain('Agent of tests');
      expect(sentence).to.contain('{sentence}');
    });

    it('should says an error', function() {
      var sentence = 'I have made a mistake.';

      _stopConsoleLog();
      agent.saysError(sentence);

      _startConsoleLog();

      _cleanLastLogConsole();
      expect(lastLog).to.contain('Agent of tests:');
      expect(lastLog).to.contain(sentence);
    });

    it('should watch something', function() {
      var watchFunc = function() {
        return 'I\'m watching';
      };

      agent.watch('*.js', watchFunc);
      var watchers = agent.watchers();

      expect(watchers).to.have.length(1);
      expect(watchers[0].files).to.equal('*.js');
      expect(watchers[0].func.toString()).to.equal(watchFunc.toString());
    });

  });

})();