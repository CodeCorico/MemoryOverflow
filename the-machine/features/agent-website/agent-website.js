(function() {
  'use strict';

  var TheMachineAgent = require('../the-machine/the-machine-agent.js'),
      fs = require('fs-extra'),
      path = require('path'),
      ejs = require('ejs'),
      glob = require('glob'),
      extend = require('extend'),

      PATHS = {
        WEBSITE: '../website',
        WEBSITE_EJS: '../website/**/*.ejs',
        WEBSITE_LOCALES: '../website/locales',
        WEBSITE_LOCALES_JSON: '../website/locales/*.json'
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

      LANGS.DIRECTORIES = glob.sync(PATHS.WEBSITE_LOCALES_JSON).map(function(file) {
        return path.basename(file.replace('.json', ''));
      });

      if(theMachine.isOneShot()) {
        _this.newDiscussion();
        _this.says('Website acquired, I generate it right now!');

        _work('all');

        return;
      }

      _this.says('Website acquired, I\'m watching its files.');

      _this
        .watch([PATHS.WEBSITE_EJS], function(args) {
          var filePath = args.path.split(path.sep),
              file = filePath.pop(),
              folder = filePath.join(path.sep);

          _work(args.type, file, folder);
        })
        .watch([PATHS.WEBSITE_LOCALES_JSON], function() {
          _this.newDiscussion();
          _this.says('Boss, a website locale file has been updated, I have to regenerate all the HTML files.');

          _work('all');
        });
    }

    function _work(type, ejsFile, folder) {
      ejsFile = ejsFile || '';
      folder = folder || '';

      var htmlFile = ejsFile.replace('.ejs', '.html'),
          htmlDestination = path.join(folder, htmlFile),
          ejsSource = path.join(folder, ejsFile);

      if(type != 'all') {
        _this.newDiscussion();
      }

      if(type == 'all' || folder.indexOf(path.sep + 'features' + path.sep) > -1) {
        if(type != 'all') {
          _this.says('Boss, a website feature has been ' + type + '. I have to regenerate all the HTML files.');
        }

        var ejsfiles = glob.sync(PATHS.WEBSITE_EJS).map(function(file) {
          var source = path.resolve(file);

          return {
            source: source,
            destinationFolder: path.dirname(source),
            destinationFile: path.basename(source.replace('.ejs', '.html'))
          };
        }).filter(function(file) {
          return file.source.indexOf(path.sep + 'features' + path.sep) === -1;
        });

        _generate(ejsfiles, function(success, error) {
          if(success) {
            _this.says('All HTML final files generated. Everything is ok.', {
              needGratitude: true
            });
          }
          else{
            _this.saysError(error, {
              needSlaps: true
            });
          }
        });
      }
      else if(type == 'deleted') {
        _this.says('Boss, the website "' + ejsFile + '" file has been deleted. I have to delete the HTML file.');

        _delete(htmlDestination, function(success, error) {
          if(success) {
            _this.says('"' + htmlFile + '" file deleted. Everything is ok.', {
              needGratitude: true
            });
          }
          else{
            _this.saysError(error, {
              needSlaps: true
            });
          }
        });
      }
      else {
        _this.says('Boss, the website "' + ejsFile + '" file has been updated. I have to regenerate it.');

        _generate([{
          source: ejsSource,
          destinationFolder: folder,
          destinationFile: htmlFile
        }], function(success, error) {
          if(success) {
            _this.says('"' + htmlFile + '" file generated. Everything is ok.', {
              needGratitude: true
            });
          }
          else{
            _this.saysError(error, {
              needSlaps: true
            });
          }
        });
      }
    }

    function _delete(htmlDestination, callback) {
      callback = callback || function() {};

      fs.removeSync(htmlDestination);

      callback(true);
    }

    function _ejsAPI(i18n, lang, subdir) {
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
              return subdir == '.' ? '' : '../';
            },
            index: function() {
              return '/' + (subdir == '.' ? '' : subdir + '/');
            },
            lang: function() {
              return lang;
            }
          };

      return api;
    }

    function _generate(ejsfiles, callback) {
      callback = callback || function() {};

      var i18n = require('i18n'),
          error = null;

      i18n.configure({
        locales: LANGS.DIRECTORIES,
        defaultLocale: LANGS.INDEX,
        directory: path.resolve(PATHS.WEBSITE_LOCALES),
        updateFiles: false
      });

      for(var langIndex = 0, langLength = LANGS.DIRECTORIES.length; langIndex < langLength; langIndex++) {
        var lang = LANGS.DIRECTORIES[langIndex],
            subdir = '.';

        if(lang != LANGS.INDEX) {
          subdir = lang;
          fs.ensureDir(path.join(PATHS.WEBSITE, subdir));
        }

        i18n.setLocale(lang);

        for(var i = 0, len = ejsfiles.length; i < len; i++) {
          var ejsFile = ejsfiles[i],
              source = ejsFile.source,
              destination = path.join(ejsFile.destinationFolder, subdir, ejsFile.destinationFile);

          if(!fs.existsSync(source)) {
            error = 'Mmm something wired appends, "' + source + '" didn\'t exists.';
            break;
          }

          var ejsString = fs.readFileSync(source, 'utf8');
          if(!ejsString) {
            error = 'Mmm I can\'t read "' + source + '".';
            break;
          }

          var html = ejs.render(ejsString, extend(true, {
            filename: source
          }, _ejsAPI(i18n, lang, subdir)));

          if(!html) {
            error = 'Sorry but "' + source  + '" contains EJS formatting errors. Please fix it!';
            break;
          }

          fs.outputFileSync(destination, html);
        }

      }

      return callback(!error, error);
    }

    _init();
  };

  module.exports = AgentWebsite;

 })();