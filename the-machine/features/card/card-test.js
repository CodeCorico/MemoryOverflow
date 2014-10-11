(function() {
  'use strict';

  var expect = require('chai').expect,
      path = require('path'),
      fs = require('fs'),
      rootDirectory = path.join(__dirname, '..', '..', '..'),
      cardPath = path.resolve(path.join(__dirname, 'card.js'));

  describe('Card', function() {

    function _testCardLoad(cardDirectory, cardName, template, lang, onCardLoaded) {
      expect(fs.existsSync(cardPath)).to.be.true;

      var Card = require(cardPath),
          cardMarkdownFile = path.join(cardDirectory, cardName + '.md'),
          inError = false;

      expect(fs.existsSync(rootDirectory)).to.be.true;
      expect(fs.existsSync(cardDirectory)).to.be.true;
      expect(fs.existsSync(cardMarkdownFile)).to.be.true;

      var card = new Card(cardMarkdownFile, template, cardName);
      expect(card).not.to.be.null;

      card.languageFiles(lang, path.join(cardDirectory, cardName + '.' + lang + '.po'));

      card.load(function(error, loadedCards) {
        expect(error).to.be.null;
        expect(loadedCards.length).not.to.be.empty;

        loadedCards.forEach(function(card) {
          expect(card.name).to.equal(cardName);
          expect(card.template).to.equal(template);
          expect(card.lang).to.equal(lang);
          expect(card.code).not.to.be.empty;
          expect(card.html).not.to.be.empty;
        });

        if (onCardLoaded) {
          onCardLoaded(card, loadedCards);
        }
      });
    }

    module.exports.testCardLoad = _testCardLoad;

    it('should load the card "foo" in french', function(done) {

      var cardName = 'foo',
          cardDirectory = path.join(rootDirectory, 'cards', 'fundamentals', 'foo'),
          template = 'fototse',
          lang = 'fr_FR',
          inError = false;

      try {
        _testCardLoad(cardDirectory, cardName, template, lang, function(card) {
          expect(card).not.to.be.null;
          done();
        });
      }
      catch(error) {
        inError = true;
        expect(inError).to.be.false;
        done();
      }
    });

    it('should load the card "foo" in english', function(done) {

      var cardName = 'foo',
          cardDirectory = path.join(rootDirectory, 'cards', 'fundamentals', 'foo'),
          template = 'fototse',
          lang = 'en_EN',
          inError = false;

      try {
        _testCardLoad(cardDirectory, cardName, template, lang, function(card) {
          expect(card).not.to.be.null;
          done();
        });
      }
      catch(error) {
        inError = true;
        expect(inError).to.be.false;
        done();
      }
    });

  });

})();