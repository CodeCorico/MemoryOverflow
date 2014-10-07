(function() {
  'use strict';

  var path = require('path'),
      gulp = require('gulp'),
      http = require('http'),
      fs = require('fs'),
      minimist = require('minimist'),
      Generator = require('./index').Generator;

  var paths = {
    scripts: ['features/**/*.js'],
    cardsContent: ['../cards/**/*.md'],
    cardsLang: ['../cards/**/*.po'],
    templates: ['../templates/**/*.json', '../templates/**/*.jpg', '../templates/**/*.png']
  };

  var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
  };

  var options = minimist(process.argv.slice(2), knownOptions);

  function _generate(template, lang) {
    new Generator({
      template: template,
      lang: lang
    }).generate();
  }

  gulp.task('watch', function() {
    gulp.watch(paths.templates, function(args) {
      var template = path.dirname(args.path).replace(path.join(__dirname, '../templates') + '/', '');
       if (template) {
          _generate(template);
        }
    });
    gulp.watch(paths.scripts, function() {
      _generate();
    });
    gulp.watch(paths.cardsContent, function() {
      _generate();
    });
    gulp.watch(paths.cardsLang, function(args) {
      var lang = path.basename(args.path, '.po').split('.')[1];
      _generate(null, lang);
    });
  });

  gulp.task('generate', function() {
    _generate(options.template, options.lang);
  });

  gulp.task('wkhtmltoimage-linux', function() {
    console.log('wk path: ' + path.resolve(process.env.WKHTMLTOIMAGE_PATH));
    http
      .get('http://cdn.codecorico.com/wkhtmltoimage-i386', function(response) {
        response.on('end', function() {
          fs.chmod('wkhtmltoimage', '755');
        });
        response.pipe(fs.createWriteStream('wkhtmltoimage'));
      });
  });

  // The default task (called when you run `gulp` from cli)
  gulp.task('default', ['watch']);

})();