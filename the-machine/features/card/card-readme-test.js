const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const rootDirectory = path.join(__dirname, '../../..');
const tempDirectory = path.join(__dirname, '../../card-readme-temp');
const cardReadmePath = path.resolve(path.join(__dirname, 'card-readme.js'));

let fooCard = null;
let fooCardDirectory = null;

describe('Card readme', function() {

  it('should load the card "foo" in french', function() {
    const testCardLoad = require(path.join(__dirname, 'card-test.js')).testCardLoad;
    const cardName = 'foo';
    const template = 'fototse';
    const lang = 'fr_FR';

    let inError = false;

    fooCardDirectory = path.join(rootDirectory, 'cards/fundamentals/foo');

    let card = testCardLoad(fooCardDirectory, cardName, template, lang);

    expect(card).not.to.be.null;
    fooCard = card;
  });

  it('should create a temp directory', function(done) {
    fs.mkdirs(tempDirectory, (err) => {
      expect(err).to.be.null;
      done();
    });
  });

  it('should generate the card \'foo\' readme', function(done) {
    expect(fs.existsSync(cardReadmePath)).to.be.true;

    const CardReadme = require(cardReadmePath);
    let inError = false;

    try {
      fooCard.readmeFile(path.join(tempDirectory, 'README.md'));

      const readme = new CardReadme(fooCard);

      readme.generate((error, readmeFile) => {
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
    fs.remove(tempDirectory, (err) => {
      expect(err).to.be.null;
      done();
    });
  });

});