(function() {
  'use strict';

  var gulp = require('gulp'),
      clc = require('cli-color'),
      glob = require('glob'),
      extend = require('extend');

  var TheMachine = function() {
    var _this = this,
        _agents = [];

    function _init() {
      var bannerWidth = 52,
          margin = new Array(Math.floor((clc.width - bannerWidth) / 2)).join(' '),
          fillBar = margin.replace(/ /g, '░');

      var banner = [
        clc.red(fillBar + '░░░░░░░░░░░░░░░░                    ░░░░░░░░░░░░░░░░' + fillBar) + '\n',
        clc.red(          '             ░░                      ░░             ') + '\n',
        clc.red(          '           ░░                          ░░           ') + '\n',
        clc.red(          '         ░░                              ░░         ') + '\n',
        clc.red(          '         ░░   ' +                 ' ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ ' +           '   ░░         ') + '\n',
        clc.red(          '         ░░   ') + clc.redBright('████████████████████████') + clc.red('   ░░         ') + '\n',
        clc.red(          '         ░░   ' +                 ' ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ' +           '   ░░         ') + '\n',
        clc.red(          '         ░░                              ░░         ') + '\n',
        clc.red(          '           ░░                          ░░           ') + '\n',
        clc.red(          '             ░░                      ░░             ') + '\n',
        clc.red(fillBar + '░░░░░░░░░░░░░░░░                    ░░░░░░░░░░░░░░░░' + fillBar) + '\n\n',
        clc.red(          '           « The Machine sees everything »') + '\n\n\n'
      ];

      for(var i = 0, len = banner.length; i < len; i++) {
        if(i !== 0 && i != 10) {
          banner[i] = margin + banner[i];
        }
      }

      console.log([clc.reset].concat(banner).join(''));

      _this.says('Special agents, go watching your targets.');

      var files = glob.sync('./features/**/agent-*.js');

      if(files || files.length) {
        files.forEach(function(file) {
          var agent = require(file.replace('./features', '../'));
          _agents.push(new agent(_this));
        });

        gulp.task('watch', function() {
          _agents.forEach(function(agent) {
            agent.watchers().forEach(function(watcher) {
              gulp.watch(watcher.files, watcher.func);
            });
          });
        });
      }

      gulp.task('default', ['watch']);
    }

    this.says = function(sentence) {
      process.stdout.write(clc.red('The Machine: '));
      for(var i = 0, len = sentence.length; i < len; i++) {
        process.stdout.write(clc.redBright(sentence[i]));
        var wait = 20,
            stop = 1 * new Date();
        while(1 * new Date() < stop + wait) { }
      }
      process.stdout.write('\n');

      return _this;
    };

    this.answers = function(options) {
      options = extend(true, {
        needHello: false,
        needGratitude: false,
        needSlaps: false
      }, options || {});

      var sentences = [];

      if(options.needHello) {
        sentences = ['Hello.'];
      }
      else if(options.needGratitude) {
        sentences = [
          'Good work soon.',
          'Proud of you.',
          'Got it.',
          'Cool cool cool.',
          'Fantastic.'
        ];
      }
      else if(options.needSlaps) {
        sentences = [
          'Looks like it\'s a problem',
          'Ho god!',
          'Damn it!',
          '$%#!'
        ];
      }

      if(sentences.length > 0) {
        _this.says(sentences[Math.floor(Math.random() * sentences.length)]);
      }

      return _this;
    }

    _init();

  };

  module.exports = TheMachine;

 })();
