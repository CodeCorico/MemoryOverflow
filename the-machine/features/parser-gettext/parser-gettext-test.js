const expect = require('chai').expect;
const path = require('path');

describe('Parser gettext', function() {

  it('should parse', function() {

    const parserGettext = require(path.join(__dirname, 'parser-gettext.js'));
    const testArray = [
      '# A comment',
      '',
      'msgid ""',
      'msgstr "Plural-Forms: nplurals=3; plural=n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\n"',
      '',
      'msgid "Hello."',
      'msgstr "Bonjour."',
      '',
      '# A second comment',
      '',
      'msgid "The Machine knows\nhow to translate."',
      'msgstr "La Machine sait\ncomment traduire."',
      '',
      'msgid ""',
      '"The Machine knows\n"',
      '"how to translate.\n"',
      'msgstr ""',
      '"La Machine sait\n"',
      '"comment traduire.\n"',
      '',
      'msgid "The Machine # knows\nhow to translate."',
      'msgstr "La Machine # sait\ncomment traduire."',
      '',
      'msgid "I have %d apple"',
      'msgid_plural "I have %d apples"',
      'msgstr[0] "J\'ai %d pomme"',
      'msgstr[1] "J\'ai %d pommes"',
      'msgstr[2] "J\'ai %d pommes"',
      '',
    ];
    const expected = {
      'Hello.': 'Bonjour.',
      'The Machine knows\nhow to translate.': 'La Machine sait\ncomment traduire.',
      'The Machine knows\nhow to translate.\n': 'La Machine sait\ncomment traduire.\n',
      'The Machine # knows\nhow to translate.': 'La Machine # sait\ncomment traduire.',
      'I have %d apple': [
        'J\'ai %d pomme',
        'J\'ai %d pommes',
        'J\'ai %d pommes'
      ]
    };

    expect(parserGettext).not.to.be.null;
    expect(parserGettext(testArray.join('\n'))).to.deep.equal(expected);
  });

});
