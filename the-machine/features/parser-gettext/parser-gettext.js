const gettextParser = require('gettext-parser');

module.exports = (text) => {
  var parsed = gettextParser.po.parse(text);
  let translations = parsed.translations[''];
  let contents = {};

  Object.keys(translations).forEach(function(key) {
    if (!key) {
      return;
    }

    let value = translations[key].msgstr;

    if (value.length === 1) {
      contents[key] = value[0];
    }
    else {
      contents[key] = value;
    }
  });

  return contents;
};
