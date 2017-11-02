const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const PATHS = {
  THEMACHINE: path.resolve(__dirname, 'the-machine.js'),
  THEMACHINE_AGENT: path.resolve(__dirname, 'the-machine-agent.js')
};

let TheMachine = null;
let theMachine = null;
let theMachineOneShot = null;
let TheMachineAgent = null;
let agent = null;
let agentOneShot = null;
let log = null;
let stdoutWrite = null;
let stderrWrite = null;
let lastLog = '';

const stopConsoleLog = () => {
  cleanLog();
  log = console.log;
  stdoutWrite = process.stdout.write;
  stderrWrite = process.stderr.write;

  console.log = function(string) {
    lastLog = string;
  };

  process.stdout.write = function(string) {
    lastLog += string;
  };

  process.stderr.write = function(string) {
    lastLog += string;
  };
}

const cleanLog = () => {
  lastLog = '';
}

const cleanLastLogConsole = () => {
  lastLog = lastLog.replace(/\u001b/g, '').replace(/\[.*?m/g, '');
}

const startConsoleLog = () => {
  console.log = log;
  process.stdout.write = stdoutWrite
  process.stderr.write = stderrWrite;
}

describe('The Machine', function() {

  before(() => {
    process.env.WEBSITE_TARGET = process.env.WEBSITE_TARGET || '../website-test';
  });

  after(() => {
    try {
      fs.removeSync(process.env.WEBSITE_TARGET);
    }
    catch(err) { }
  });

  it('should have her files', function() {
    expect(fs.existsSync(PATHS.THEMACHINE)).to.be.true;
    expect(fs.existsSync(PATHS.THEMACHINE_AGENT)).to.be.true;
  });

  describe('In "normal" mode', function() {

    it('should start', function() {
      TheMachine = require(PATHS.THEMACHINE);

      let inError = false;

      stopConsoleLog();

      try {
        theMachine = new TheMachine();
      }
      catch(error) {
        inError = true;
      }

      startConsoleLog();
      expect(inError).to.be.false;
    });

    it('should communicate', function() {
      const sentence = 'Someone is trying to test my brain.';

      stopConsoleLog();
      theMachine.says(sentence);
      startConsoleLog();
      cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain(sentence);

      stopConsoleLog();
      theMachine.answers({
        needHello: true
      });
      startConsoleLog();

      cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain('Hello.');
    });

  });

  describe('In "one shot" mode', function() {

    it('should start', function() {
      let inError = false;

      stopConsoleLog();

      try {
        theMachineOneShot = new TheMachine(true);
      }
      catch(error) {
        inError = true;
      }

      startConsoleLog();
      expect(inError).to.be.false;
    });

    it('should communicate', function() {
      const sentence = 'Someone is trying to test my brain. Again.';

      stopConsoleLog();
      theMachineOneShot.says(sentence);
      startConsoleLog();
      cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain(sentence);

      stopConsoleLog();
      theMachineOneShot.answers({
        needHello: true
      });
      startConsoleLog();

      cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain('Hello.');
    });

  });

});

describe('The Special Agents', function() {

  describe('In "normal" mode', function() {

    it('should start', function() {
      expect(fs.existsSync(PATHS.THEMACHINE_AGENT)).to.be.true;

      TheMachineAgent = require(PATHS.THEMACHINE_AGENT);

      let inError = false;

      stopConsoleLog();

      try {
        agent = new (function() {
          TheMachineAgent.call(this, theMachine);

          this.name('of tests');
        })();
      }
      catch(error) {
        inError = true;
      }

      startConsoleLog();
      expect(inError).to.be.false;
    });

    it('should communicate with The Machine', function() {
      const sentence = 'Boss are you there?';

      stopConsoleLog();
      agent.says(sentence);

      startConsoleLog();

      cleanLastLogConsole();
      expect(lastLog).to.contain('Agent of tests:');
      expect(lastLog).to.contain(sentence);

      stopConsoleLog();
      agent.says(sentence, {
        needHello: true
      });
      startConsoleLog();

      cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain('Hello.');
    });

    it('should have a sentence template', function() {
      const sentence = agent.saysFormat();

      expect(sentence).to.contain('Agent of tests');
      expect(sentence).to.contain('{sentence}');
    });

    it('should says an error', function() {
      const sentence = 'I have made a mistake.';

      stopConsoleLog();
      agent.saysError(sentence);

      startConsoleLog();

      cleanLastLogConsole();
      expect(lastLog).to.contain('Agent of tests:');
      expect(lastLog).to.contain(sentence);
    });

    it('should watch something', function() {
      const watchFunc = () => {
        return 'I\'m watching';
      };

      agent.watch('*.js', watchFunc);

      const watchers = agent.watchers();

      expect(watchers).to.have.length(1);
      expect(watchers[0].files).to.equal('*.js');
      expect(watchers[0].func.toString()).to.equal(watchFunc.toString());
    });

  });

  describe('In "one shot" mode', function() {

    it('should start', function() {
      let inError = false;

      stopConsoleLog();

      try {
        agentOneShot = new (function() {
          TheMachineAgent.call(this, theMachineOneShot);

          this.name('of tests');
        })();
      }
      catch(error) {
        inError = true;
      }

      startConsoleLog();
      expect(inError).to.be.false;
    });

    it('should communicate with The Machine', function() {
      const sentence = 'Boss are you there?';

      stopConsoleLog();
      agentOneShot.says(sentence);

      startConsoleLog();

      cleanLastLogConsole();
      expect(lastLog).to.contain('Agent of tests:');
      expect(lastLog).to.contain(sentence);

      stopConsoleLog();
      agentOneShot.says(sentence, {
        needHello: true
      });
      startConsoleLog();

      cleanLastLogConsole();
      expect(lastLog).to.contain('The Machine:');
      expect(lastLog).to.contain('Hello.');
    });

  });
});
