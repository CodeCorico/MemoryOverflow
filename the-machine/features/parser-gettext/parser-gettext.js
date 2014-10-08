(function() {
  'use strict';

  function parserGettext(data) {
    var nodes = data
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n'),
        contents = {},
        id = null,
        str = null;

    nodes.forEach(function(node) {
      if (node.indexOf('##') === 0 || node.indexOf('#') === 0) {
        // ignore
      }
      else if (node.match(/msgid/g)) {
        id = node.substring(6).replace(/"/g, '');
      }
      else if (node.match(/msgstr/g)) {
        str = node.substring(7).replace(/"/g, '');

        if (id) {
          contents[id] = str;
        }
        id = null;
        str = null;
      }
    });

    return contents;
  }

  module.exports = parserGettext;
})();