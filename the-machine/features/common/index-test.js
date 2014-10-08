(function() {
  'use strict';

  var assert = require('chai').assert,
      fs = require('fs'),
      TheMachine = require('../../index.js').TheMachine;

  describe('#valid', function() {

    it('should have a readme file', function() {
      assert(fs.existsSync('./README.md') === true, 'Project has a readme file');
    });

    it('should generate cards', function(done) {
      new TheMachine(null).generate(function() {

        assert(fs.existsSync('../website/data/cards') === true, 'Cards folder has been generated');

        done();
      });
    });

  });

})();