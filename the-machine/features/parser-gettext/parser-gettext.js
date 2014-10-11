(function() {
  'use strict';

  var gettextParser = require('gettext-parser');

  function parserGettext(text) {
    var parsed = gettextParser.po.parse(text),
        translations = parsed.translations[''],
        contents = {};

    Object.keys(translations).forEach(function(key) {
      if (key) {
        var value = translations[key].msgstr;
        if (value.length === 1) {
          contents[key] = value[0];
        }
        else {
          contents[key] = value;
        }
      }
    });

    return contents;
  }

  module.exports = parserGettext;
})();