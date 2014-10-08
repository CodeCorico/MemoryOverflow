(function() {
  'use strict';

  var gulp = require('gulp'),
      clc = require('cli-color'),
      glob = require('glob');

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
        clc.redBright('           « The Machine sees everything »') + '\n\n\n'
      ];

      for(var i = 0, len = banner.length; i < len; i++) {
        if(i !== 0 && i != 10) {
          banner[i] = margin + banner[i];
        }
      }

      console.log([clc.reset].concat(banner).join(''));

      _this.says('Special agents, go watching your targets.');

      var files = glob.sync('./features/**/agent-*.js');
      files.forEach(function(file) {
        var agent = require(file.replace('./features', '../'));
        _agents.push(new agent());
      });

      gulp.task('watch', function() {
        _agents.forEach(function(agent) {
          agent.watchers().forEach(function(watcher) {
            gulp.watch(watcher.files, watcher.func);
          });
        });
      });

      gulp.task('default', ['watch']);
    }

    this.says = function(sentence) {
      console.log(clc.redBright('The Machine says: ' + sentence));
    };

    _init();

  };

  module.exports = TheMachine;

 })();