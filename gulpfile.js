(function() {
  'use strict';

  var path = require('path'),
      gulp = require('gulp'),
      minimist = require('minimist'),
      Generator = require('./generator/generator').Generator;

  var paths = {
    scripts: ['generator/features/**/*.js'],
    cards: ['cards/**/*'],
    templates: ['templates/**/*.json', 'templates/**/*.jpg', 'templates/**/*.png']
  };

  var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'production' }
  };

  var options = minimist(process.argv.slice(2), knownOptions);

  function _generate(template) {
    new Generator({
      template: template
    });
  }

  gulp.task('watch', function() {
    gulp.watch(paths.templates, function(args) {
      var template = path.dirname(args.path).replace(path.join(__dirname, 'templates') + '/', '');
       if (template) {
          _generate(template);
        }
    });
    gulp.watch(paths.scripts, function() {
      _generate();
    });
    gulp.watch(paths.cards, function() {
      _generate();
    });
  });

  gulp.task('generate', function() {
    _generate(options.template);
  });

  // The default task (called when you run `gulp` from cli)
  gulp.task('default', ['watch']);

})();