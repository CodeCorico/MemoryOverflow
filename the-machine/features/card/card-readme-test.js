(function() {
  'use strict';

  var expect = require('chai').expect,
      path = require('path'),
      fs = require('fs-extra'),
      rootDirectory = path.join(__dirname, '..', '..', '..'),
      tempDirectory = path.join(__dirname, '..', '..', 'card-readme-temp'),
      fooCard = null,
      fooCardDirectory = null,
      cardReadmePath = path.resolve(path.join(__dirname, 'card-readme.js'));

  describe('Card readme', function() {

    it('should load the card \'foo\' in french', function(done) {

      var testCardLoad = require(path.join(__dirname, 'card-test.js')).testCardLoad,
          cardName = 'foo',
          template = 'fototse',
          lang = 'fr_FR',
          inError = false;

      fooCardDirectory = path.join(rootDirectory, 'cards', 'fundamentals', 'foo');

      try {
        testCardLoad(fooCardDirectory, cardName, template, lang, function(card) {
          expect(card).not.to.be.null;
          fooCard = card;
          done();
        });
      }
      catch(error) {
        inError = true;
        expect(inError).to.be.false;
        done();
      }
    });

    it('should create a temp directory', function(done) {
      fs.mkdirs(tempDirectory, function(err) {
        expect(err).to.be.null;
        done();
      });
    });

    it('should generate the card \'foo\' readme', function(done) {
      expect(fs.existsSync(cardReadmePath)).to.be.true;

      var CardReadme = require(cardReadmePath),
          inError = false;

      try {
        fooCard.readmeFile(path.join(tempDirectory, 'README.md'));

        var readme = new CardReadme(fooCard);

        readme.generate(function(error, readmeFile) {
          expect(error).to.be.null;
          expect(fs.existsSync(readmeFile)).to.be.true;

          done();
        });
      }
      catch(error) {
        inError = true;
        expect(inError).to.be.false;
        done();
      }
    });

    it('should remove the temp directory', function(done) {
      fs.remove(tempDirectory, function(err) {
        expect(err).to.be.null;
        done();
      });
    });

  });

})();