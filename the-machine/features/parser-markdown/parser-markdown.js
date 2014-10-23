(function() {
  'use strict';

  function parserMarkdown(data) {

    var delimiter = /^#.*/gm,
        headers = data.match(delimiter),
        contents = data.split(delimiter),
        results = null;

    if(headers) {
      for (var i = 0, len = headers.length; i < len; i ++) {
        var header = headers[i].replace('#', '').trim(),
            content = contents[i + 1].trim();

        results = results || {};

        results[header] = content;
      }
    }

    return results;
  }

  module.exports = parserMarkdown;
})();