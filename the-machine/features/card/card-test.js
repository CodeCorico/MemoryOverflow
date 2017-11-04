const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const rootDirectory = path.join(__dirname, '../../..');
const cardPath = path.resolve(path.join(__dirname, 'card.js'));

const testCardLoad = (cardDirectory, cardName, template, lang) => {
  expect(fs.existsSync(cardPath)).to.be.true;

  const Card = require(cardPath);
  const cardMarkdownFile = path.join(cardDirectory, cardName + '.md');

  let inError = false;

  expect(fs.existsSync(rootDirectory)).to.be.true;
  expect(fs.existsSync(cardDirectory)).to.be.true;
  expect(fs.existsSync(cardMarkdownFile)).to.be.true;

  const card = new Card(cardMarkdownFile, template, cardName);

  expect(card).not.to.be.null;

  card.languageFiles(lang, path.join(cardDirectory, cardName + '.' + lang + '.po'));

  let loadedCards = card.load();

  expect(loadedCards).to.be.an('array');
  expect(loadedCards.length).to.be.above(0);

  loadedCards.forEach((card) => {
    expect(card.name).to.equal(cardName);
    expect(card.template).to.equal(template);
    expect(card.lang).to.equal(lang);
    expect(card.code).not.to.be.empty;
    expect(card.html).not.to.be.empty;
  });

  return card;
};

module.exports.testCardLoad = testCardLoad;

describe('Card', function() {

  it('should load the card "foo" in french', function() {
    const cardName = 'foo';
    const cardDirectory = path.join(rootDirectory, 'cards/fundamentals/foo');
    const template = 'fototse';
    const lang = 'fr_FR';

    let card = testCardLoad(cardDirectory, cardName, template, lang);

    expect(card).not.to.be.null;
  });

  it('should load the card "foo" in english', function() {
    const cardName = 'foo';
    const cardDirectory = path.join(rootDirectory, 'cards/fundamentals/foo');
    const template = 'fototse';
    const lang = 'en_US';

    let card = testCardLoad(cardDirectory, cardName, template, lang);

    expect(card).not.to.be.null;
  });

});
