(function() {
  'use strict';

  var assert = require('chai').assert,
      path = require('path'),
      Card = require('./card').Card,
      rootDirectory = path.join(__dirname, '../../../');

  describe('#valid', function() {

    it('should load the card \'foo\'', function(done) {

      var fooCardDirectory = rootDirectory + 'cards/fundamentals/foo/',
          fooCard = new Card(fooCardDirectory + 'foo.md', rootDirectory + 'templates/fototse', 'foo');

      fooCard.languageFiles('fr_FR', fooCardDirectory + 'foo.fr_FR.po');

      fooCard.load(function(error, loadedCards) {

        assert(!error, 'Loading does not throw an error');
        assert(loadedCards.length > 0, 'Should have loaded cards');

        done();
      });

    });

  });

})();