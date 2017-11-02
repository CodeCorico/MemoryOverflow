const gulp = require('gulp');
const clc = require('cli-color');
const glob = require('glob');
const extend = require('extend');

module.exports = function TheMachine(oneShot) {
  oneShot = oneShot || false;

  const _agents = [];

  const init = () => {
    if (clc.windowSize.width) {
      const bannerWidth = 52;
      const fillCharasNb = Math.floor((clc.windowSize.width - bannerWidth) / 2);
      const margin = fillCharasNb > 0 ? new Array(Math.floor((clc.windowSize.width - bannerWidth) / 2)).join(' ') : '';
      const fillBar = margin.replace(/ /g, '░');

      const banner = [
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
        clc.red(          '           « The Machine sees everything »') + '\n\n'
      ];

      for(let i = 0, len = banner.length; i < len; i++) {
        if(i !== 0 && i != 10) {
          banner[i] = margin + banner[i];
        }
      }

      console.log([clc.reset].concat(banner).join(''));
    }

    if(oneShot) {
      this.says('Special agents, go generate your targets.');
    }
    else {
      this.says('Special agents, go watching your targets.');
    }

    let files = glob.sync('./features/**/agent-*.js');

    if(files || files.length) {
      files.forEach((file) => {
        if(file.indexOf('-test') > -1) {
          return;
        }

        let agent = require(file.replace('./features', '../'));

        _agents.push(new agent(this));
      });

      if(oneShot) {
        return;
      }

      gulp.task('watch', () => {
        _agents.forEach((agent) => {
          agent.watchers().forEach((watcher) => {
            gulp.watch(watcher.files, watcher.func);
          });
        });
      });
    }

    gulp.task('default', ['watch']);
  };

  this.isOneShot = () => {
    return oneShot;
  };

  this.says = (sentence) => {
    process.stdout.write(clc.red('The Machine: '));

    if(oneShot) {
      process.stdout.write(clc.redBright(sentence));
    }
    else {
      for (let i = 0, len = sentence.length; i < len; i++) {
        process.stdout.write(clc.redBright(sentence[i]));

        let wait = 10;
        let stop = 1 * new Date();

        while(1 * new Date() < stop + wait) { }
      }
    }
    process.stdout.write('\n');

    return this;
  };

  this.answers = (options) => {
    options = extend(true, {
      needHello: false,
      needGratitude: false,
      needSlaps: false
    }, options || {});

    let sentences = [];

    if(options.needHello) {
      sentences = ['Hello.'];
    }
    else if(options.needGratitude) {
      sentences = [
        'Good work son.',
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
      this.says(sentences[Math.floor(Math.random() * sentences.length)]);
    }

    return this;
  };

  init();
};
