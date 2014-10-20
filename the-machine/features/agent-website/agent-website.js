(function() {
  'use strict';

  var TheMachineAgent = require('../the-machine/the-machine-agent.js'),
      fs = require('fs-extra'),
      path = require('path'),
      ejs = require('ejs'),
      glob = require('glob'),

      PATHS = {
        WEBSITE_EJS: '../website/**/*.ejs'
      };

  var AgentWebsite = function(theMachine) {
    TheMachineAgent.call(this, theMachine);

    var _this = this;

    function _init() {
      _this.name('of Website');

      if(theMachine.isOneShot()) {
        _this.says('Sorry boss, I don\'t support the one shot generation for now.');
        return;
      }

      _this.says('Website acquired, I\'m watching this files.');

      _this
        .watch([PATHS.WEBSITE_EJS], function(args) {
          var filePath = args.path.split(path.sep),
              file = filePath.pop(),
              folder = filePath.join(path.sep);

          _work(args.type, file, folder);
        });
    }

    function _work(type, ejsFile, folder) {
      var htmlFile = ejsFile.replace('.ejs', '.html'),
          htmlDestination = path.join(folder, htmlFile),
          ejsSource = path.join(folder, ejsFile);

      _this.newDiscussion();

      if(folder.indexOf(path.sep + 'features' + path.sep) > -1) {
        _this.says('Boss, a website feature has been ' + type + '. I have to regenerate all the HTML files.');


        var ejsfiles = glob.sync(PATHS.WEBSITE_EJS).map(function(file) {

          var source = path.resolve(file),
              destination = source.replace('.ejs', '.html');

          return {
            source: source,
            destination: destination
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
          destination: htmlDestination
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

    function _generate(ejsfiles, callback) {
      callback = callback || function() {};

      var error = null;

      for(var i = 0, len = ejsfiles.length; i < len; i++) {
        var source = ejsfiles[i].source,
            destination = ejsfiles[i].destination;

        if(!fs.existsSync(source)) {
          error = 'Mmm something wired appends, "' + source + '" didn\'t exists.';
          break;
        }

        var ejsString = fs.readFileSync(source, 'utf8');
        if(!ejsString) {
          error = 'Mmm I can\'t read "' + source + '".';
          break;
        }

        var html = ejs.render(ejsString, {
          filename: source,
          css: [],
          js: []
        });

        if(!html) {
          error = 'Sorry but "' + source  + '" contains EJS formatting errors. Please fix it!';
          break;
        }

        fs.outputFileSync(destination, html);
      }

      return callback(!error, error);
    }

    _init();
  };

  module.exports = AgentWebsite;

 })();