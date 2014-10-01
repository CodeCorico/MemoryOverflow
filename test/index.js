(function() {
  'use strict';

  var assert = require('chai').assert,
      fs = require('fs');

  describe('#valid', function() {

    it('should have a readme file', function() {
      assert(fs.existsSync('./README.md') === true, 'Project has a readme file');
    });

  });

})();