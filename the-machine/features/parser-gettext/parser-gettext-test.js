(function() {
  'use strict';

  var expect = require('chai').expect,
      path = require('path');

  describe('Parser gettext', function() {

    it('should parse', function() {
      var parserGettext = require(path.join(__dirname, 'parser-gettext.js')),
          testArray = [
            '# A comment',
            '',
            'msgid "Hello."',
            'msgstr "Bonjour."',
            '',
            '# A second comment',
            '',
            'msgid "The Machine knows how to translate."',
            'msgstr "La Machine sait comment traduire."',
            '',
          ],
          testText = testArray.join('\n'),
          expected = {
            'Hello.': 'Bonjour.',
            'The Machine knows how to translate.': 'La Machine sait comment traduire.'
          };

      expect(parserGettext(testText)).to.deep.equal(expected);

    });

  });

})();