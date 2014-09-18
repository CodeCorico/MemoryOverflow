/*

Header + Footer : http://themeforest.net/item/gamecity-a-flat-responsive-gaming-template/full_screen_preview/7615416

Options : http://demo.bossthemes.com/gameworld2/index.php?route=common/home

Slideshow for last/random cards : http://themeforest.net/item/sevenmag-html5-blogmagazinegamesnews-template/full_screen_preview/7805540

Porfolio buttons + Welcome to US : http://vergatheme.com/demosd/goddess/


*/


/*
 *
 * Structure du website:
 *
 * /                         : Présentation - Gros boutons "Rechercher une carte", "Voir les editions" - Mettre en avant la dernière édition - Contribute!
 *
 * /search/                  : Recherche de carte par code ou nom
 * /edition/                 : liste toutes les editions
 * /edition/fundamentals     : page de l'edition avec ses infos et ses cartes
 * /edition/fundamentals/foo : page de la carte avec ses infos, son changelog, etc
 * /create/                  : Aide à la creation de carte (génération de l'UID) (génération des fichiers ?)
 * /print/                   : Wizard pour fabriquer des sets de cartes à imprimer
 *
 * Responsive
 * Au début on prompt un choix (ou on force par les arguments) :
 * Tout regenerer - Mettre à jour
 * Il faudrait un hook pour qu'au push ca regénère les cartes (ou un truc dans le genre)
 * Fabriquer le site pour chaque langue
 * Pouvoir mettre du analytics
 *
 * - lecture du markdown
 * - generation de fichiers HTML (avec header et footer)
 *
 *
 * features/
 *          languages/
 *                    en_EN.po
 *          common/
 *                 assets/
 *                        page.css
 *                        responsive.css
 *                 header.js
 *                 footer.js
 *                 page.js
 *          console/
 *          tests/
 *          create/
 *          print/
 *                page.js
 *          edition/
 *                  edition.js
 *          card/
 *               card.js
 *          search/
 *                 search.js
 *          assets/
 *                 export.js
 *
 *

 */
 (function() {
  'use strict';

  var fs = require('fs'),
      CardsGenerator = require('./features/card/cards-generator').CardsGenerator,
      FileUtils = require('./features/file/file.js').File,
      _arguments = {},
      _usage = 'node generator.js --template=<template name>';

  process.argv.forEach(function (val, index, array) {
    if (val != 'node' && val.indexOf('generator.js') === -1) {
      var type = val.split('=')[0],
          value = val.split('=')[1];

      if (type.substring(0, 2) == '--') {
        _arguments[type.substring(2)] = value;
      }
    }
  });

  if (!_arguments.template) {
    throw new Error('--template arg missing, usage: ' + _usage);
  }

  var template = '../templates/' + _arguments.template;

  fs.exists(template, function(exists) {
    if (!exists) {
        throw new Error('template \'' + template + '\' does not exist');
    }
  });

  var Generator = function() {

    FileUtils.directory(FileUtils.websiteDirectory() + 'cards/');
    FileUtils.directory(FileUtils.websiteDirectory() + 'print/');

    (new CardsGenerator(template, _arguments.template)).generate();

  };

  new Generator();

 })();