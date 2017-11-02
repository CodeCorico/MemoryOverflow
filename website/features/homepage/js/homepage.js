$(function() {
  'use strict';

  if(!window.Page) {
    return;
  }

  // 0 is the default
  var LANGS = ['en', 'fr'];
  var langKey;
  var validLang = LANGS[0];
  var langForced = location.href.indexOf('?l=f') > -1;

  if (langForced) {
    langForced = false;

    var actualLang = location.pathname == '/' ? LANGS[0] : location.pathname.split('/')[1];

    for (langKey in LANGS) {
      if (actualLang.indexOf(LANGS[langKey]) > -1) {
        Cookies.set('lang', actualLang);

        langForced = true;

        break;
      }
    }
  }

  if (!langForced) {
    var language = Cookies.get('lang') || window.navigator.language || window.navigator.userLanguage;
    language = language.toLowerCase();

    for (langKey in LANGS) {
      if (language.indexOf(LANGS[langKey]) > -1) {
        validLang = LANGS[langKey];

        if (!Cookies.get('lang')) {
          Cookies.set('lang', validLang);
        }

        break;
      }
    }

    if (validLang != LANGS[0] && location.pathname == '/') {
      location.href = '/' + validLang;
    }
    else if (validLang == LANGS[0] && location.pathname != '/') {
      location.href = '/';
    }
    else if (location.pathname != '/') {
      var actualLang = location.pathname.split('/')[1];

      if (actualLang != validLang) {
        location.href = '/' + validLang;
      }
    }
  }

  var _panelsVisibilityMargin = 0;
  var _panels = [{
    selector: '.panel-game'
  }, {
    selector: '.panel-cards'
  }, {
    selector: '.panel-contribute'
  }];

  function _init() {
    $.each(_panels, function(index, panel) {
      var $panel = $(panel.selector);

      $.extend(true, panel, {
        height: $panel.outerHeight(),
        top: $panel.offset().top,
        center: $panel.offset().top + ($panel.outerHeight() / 2)
      });
    });
  }

  window.Page.onPageRedraw(function(args) {
    if(args.windowWidth <= 1000) {
      $('.panel').css({
        display: '',
        transform: ''
      });

      return;
    }

    $.each(_panels, function(index, panel) {
      var $panel = $(panel.selector),
          $hologramPanel = $panel.find('.hologram-panel'),
          panelTopOffset = (Math.abs(args.windowCenter - panel.center) * 0.6),
          translateY = 0;

      if(args.windowCenter > panel.center) {
        translateY = -panelTopOffset;
      }
      else if(args.windowCenter < panel.center) {
        translateY = panelTopOffset;
      }

      $panel.css('transform', 'translateY(' + translateY + 'px)');

      if(panel.top > args.scrollTop - _panelsVisibilityMargin && panel.top + panel.height < args.scrollBottom + _panelsVisibilityMargin) {
        if(!$hologramPanel.data('open')) {
          $hologramPanel.data('open', true);

          $hologramPanel
            .velocity('stop', true)
            .velocity({
              scale: [1, 0]
            }, {
              display: 'block',
              duration: 250,
              easing: 'linear'
            });
        }
      }
      else if($hologramPanel.data('open')) {
        $hologramPanel.data('open', false);

        $hologramPanel
          .velocity('stop', true)
          .velocity({
            scale: [0, 1]
          }, {
            display: 'none',
            duration: 150,
            easing: 'linear'
          });
      }
    });
  });

  _init();
});
