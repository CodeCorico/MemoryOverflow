var TheMachineAgent = require('../the-machine/the-machine-agent.js'),
    fs = require('fs-extra'),
    path = require('path'),
    ejs = require('ejs'),
    glob = require('glob'),
    extend = require('extend'),
    i18n = require('i18n'),

    PATHS = {
      WEBSITE_SOURCE: '../website/**/*.*',
      WEBSITE_LOCALES: '../website/locales',
      WEBSITE_LOCALES_JSON: '../website/locales/*.json',
      WEBSITE_TARGET: process.env.WEBSITE_TARGET,
    },
    LANGS = {
      INDEX: 'en',
      DIRECTORIES: []
    };

var AgentWebsite = function(theMachine) {
  TheMachineAgent.call(this, theMachine);

  var _this = this;

  function _init() {
    _this.name('of Website');

    if(theMachine.isOneShot()) {
      _this
        .newDiscussion()
        .says('Website acquired, I generate it right now!');

      _work('all');

      return;
    }

    _this.says('Website acquired, I\'m watching it\'s files.');

    _this.watch(PATHS.WEBSITE_SOURCE, function() {
      _this
        .newDiscussion()
        .says('Boss, the website has been updated. I\'m generating its files...');

      _work();
    });

    _work();
  }

  function _work() {
    var error = false;

    var locales = glob
      .sync(PATHS.WEBSITE_LOCALES_JSON)
      .map(function(file) {
        return path.basename(file.replace('.json', ''));
      });

    i18n.configure({
      locales: locales,
      defaultLocale: 'en',
      directory: path.resolve(PATHS.WEBSITE_LOCALES),
      updateFiles: false
    });

    glob
      .sync(path.join(PATHS.WEBSITE_TARGET, '/**/*.*'))
      .filter(function(file) {
        return file.indexOf('.md') < 0 && file.indexOf('/cards/') < 0;
      })
      .forEach(function(file) {
        fs.removeSync(file);
      });

    glob
      .sync(PATHS.WEBSITE_SOURCE)
      .filter(function(file) {
        return file.indexOf('.md') < 0 && file.indexOf('/locales') < 0;
      })
      .forEach(function(file) {
        if (error) {
          return;
        }

        var source = path.resolve(file);
        var sourceCleaned = file.replace('../website/', '');
        var destination = path.join(PATHS.WEBSITE_TARGET, sourceCleaned);
        var isEjs = source.indexOf('.ejs') > -1;

        if (sourceCleaned.indexOf('features/') === 0) {
          var sourceSplitted = sourceCleaned.split('/');
          sourceCleaned = 'assets/' + sourceSplitted[1] + '/' + sourceSplitted[sourceSplitted.length - 1];
          destination = path.join(PATHS.WEBSITE_TARGET, sourceCleaned);
        }

        if (isEjs) {
          if (path.dirname(file) != '../website') {
            return;
          }

          for(var langIndex = 0, langLength = locales.length; langIndex < langLength; langIndex++) {
            var lang = locales[langIndex],
                langDir = '.';

            i18n.setLocale(lang);

            if(lang != 'en') {
              langDir = lang;
            }

            destination = path.join(PATHS.WEBSITE_TARGET, langDir, sourceCleaned.replace('.ejs', '.html'));

            var ejsData = fs.readFileSync(source, 'utf8');
            var html = ejs.render(ejsData, extend(true, {
              filename: source
            }, _ejsAPI(i18n, lang, langDir)));

            if(!html) {
              error = 'Sorry but "' + source  + '" contains EJS formatting errors. Please fix it!';

              break;
            }

            fs.outputFileSync(destination, html, {
              preserveTimestamps: true
            });
          }
        }
        else {
          fs.copySync(source, destination);
        }
      });

    if (error) {
      _this.saysError(error, {
        needSlaps: true
      });

      return;
    }

    _this.says('The website is generated. Everything is ok.', {
      needGratitude: true
    });
  }

  function _ejsAPI(i18n, lang, langDir) {
    var title = '',
        api = {
          css: [],
          js: [],
          title: function(newTitle) {
            if(typeof newTitle == 'string') {
              title = newTitle;
            }

            return i18n.__(title);
          },
          __: function() {
            return i18n.__.apply(i18n, arguments);
          },
          _n: function() {
            return i18n._n.apply(i18n, arguments);
          },
          base: function() {
            return langDir == '.' ? '' : '../';
          },
          index: function() {
            return '/' + (langDir == '.' ? '' : langDir + '/');
          },
          lang: function() {
            return lang;
          }
        };

    return api;
  }

  _init();
};

module.exports = AgentWebsite;
