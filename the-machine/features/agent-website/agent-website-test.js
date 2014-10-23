(function() {
  'use strict';

  var expect = require('chai').expect,
      path = require('path'),
      fs = require('fs'),
      agentWebsitePath = path.resolve(path.join(__dirname, 'agent-website.js')),
      theMachinePath = path.resolve(path.join(__dirname, '..', 'the-machine', 'the-machine.js')),
      TheMachine = require(theMachinePath),
      theMachine = null,
      theMachineOneShot = null,
      AgentWebsite = null,
      agentWebsite = null,
      agentWebsiteOneShot = null,
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

  describe('The Agent of Website', function() {

    describe('In "normal" mode', function() {

      it('should start', function() {
        expect(fs.existsSync(agentWebsitePath)).to.be.true;

        AgentWebsite = require(agentWebsitePath);

        var inError = false;
        _stopConsoleLog();
        try {
          theMachine = new TheMachine();
          agentWebsite = new AgentWebsite(theMachine);
        }
        catch(error) {
          inError = true;
        }

        _startConsoleLog();
        expect(inError).to.be.false;
      });

    });

    describe('In "one shot" mode', function() {

      it('should start', function() {
        var inError = false;
        _stopConsoleLog();
        try {
          theMachineOneShot = new TheMachine(true);
          agentWebsiteOneShot = new AgentWebsite(theMachineOneShot);
        }
        catch(error) {
          inError = true;
        }

        _startConsoleLog();
        expect(inError).to.be.false;
      });

    });

  });

})();