const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const PATHS = {
  THEMACHINE_AGENT: path.resolve(__dirname, '../the-machine/the-machine-agent.js'),
  AGENT_WEBSITE: path.resolve(__dirname, 'agent-website.js')
};

let log = null;
let stdoutWrite = null;
let lastLog = '';

const stopConsoleLog = () => {
  cleanLog();
  log = console.log;
  stdoutWrite = process.stdout.write;

  console.log = function(string) {
    lastLog = string;
  };

  process.stdout.write = function(string) {
    lastLog += string;
  };
};

const cleanLog = () => {
  lastLog = '';
};

const cleanLastLogConsole = () => {
  lastLog = lastLog.replace(/\u001b/g, '').replace(/\[.*?m/g, '');
};

const startConsoleLog = () => {
  console.log = log;
  process.stdout.write = stdoutWrite;
};

const TheMachine = function(onShot) {
  this.answers = () => { };
  this.isOneShot = () => {
    return onShot;
  };
};

describe('The Agent of Website', function() {

  before(() => {
    process.env.WEBSITE_TARGET = process.env.WEBSITE_TARGET || '../website-test';
  });

  after(() => {
    fs.removeSync(process.env.WEBSITE_TARGET);
  });

  it('should have the agent files', function() {
    expect(fs.existsSync(PATHS.THEMACHINE_AGENT)).to.be.true;
    expect(fs.existsSync(PATHS.AGENT_WEBSITE)).to.be.true;
  });

  describe('In "normal" mode', function() {

    it('should start', function() {
      let inError = false;

      stopConsoleLog();

      try {
        new require(PATHS.AGENT_WEBSITE)(new TheMachine(false));
      }
      catch(error) {
        inError = true;
      }

      startConsoleLog();

      expect(inError).to.be.false;
    });

  });

  describe('In "one shot" mode', function() {

    it('should start', function() {
      let inError = false;

      stopConsoleLog();

      try {
        new require(PATHS.AGENT_WEBSITE)(new TheMachine(true));
      }
      catch(error) {
        startConsoleLog();
        console.log(error);
        inError = true;
      }

      startConsoleLog();

      expect(inError).to.be.false;
    });

  });

});
