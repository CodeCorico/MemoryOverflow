(function() {
  'use strict';

  var assert = require('chai').assert,
      fs = require('fs'),
      Generator = require('../../index.js').Generator;

  describe('#valid', function() {

    it('should have a readme file', function() {
      assert(fs.existsSync('./README.md') === true, 'Project has a readme file');
    });

    it('should generate cards', function(done) {
      new Generator(null).generate(function() {

        assert(fs.existsSync('../website/data/cards') === true, 'Cards folder has been generated');

        done();
      });
    });

  });

})();