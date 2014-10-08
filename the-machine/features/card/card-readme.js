(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),
      FileUtils = require('../file/file.js').File;

  var CardReadme = function(card) {
    if (!card) {
      throw new Error('A card is required.');
    }

    function _replaceStyle(content) {
      return content
        .replace(new RegExp('{/([a-z-]*)}', 'ig'), '`')
        .replace(new RegExp('[^&]{!/|{([a-z-]*)}', 'ig'), '`');
    }

    function _translateContent(content, translation) {
      if (!translation) {
        return content;
      }

      return content.replace(new RegExp('&{(.*?)}', 'g'), function(match, value) {
        return translation[value];
      });
    }

    this.generate = function(onGenerationComplete) {
      onGenerationComplete = onGenerationComplete || false;

      fs.readFile(path.join(__dirname, 'README.md.tpl'), 'utf8', function (err, data) {

        var content = data,
            codes = card.config().codes,
            languages = card.languageFiles(),
            englishLanguage = languages ? languages['en_EN'] : null;

        if (languages) {
          //console.log(languages);

          var parsedContent = {};
          // need to pre-parse the content
          for (var key in englishLanguage) {
            parsedContent[_replaceStyle(key)] = _replaceStyle(englishLanguage[key]);
          }
          englishLanguage = parsedContent;

          content = content.replace('{card.languages}', Object.keys(languages).map(function(lang) {
            return lang;
          }).join(', '));
        }

        if (codes) {
          content = content.replace('{card.codes}', codes.join(', '));
        }

        content = content
          .replace('{card.name}', _translateContent(_replaceStyle(card.config().title), englishLanguage))
          .replace('{card.mdfile}', card.config().name)
          .replace('{card.description}', _translateContent(_replaceStyle(card.config().description), englishLanguage))
          .replace('{card.type}', card.config().type)
          .replace('{card.edition}', card.config().edition);

        fs.writeFile(card.readmeFile(), content, function(err) {
          if (err) {
            console.log(err);
          }
        });

      });

    };

  };

  exports.CardReadme = CardReadme;

})();