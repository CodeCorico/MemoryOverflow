$(function() {
  'use strict';

  if(!window.Page) {
    return;
  }

  var _panelsVisibilityMargin = 160,
      _panels = [{
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
        top: $panel.position().top,
        center: $panel.offset().top + ($panel.outerHeight() / 2)
      });
    });
  }

  window.Page.onPageRedraw(function(args) {
    $.each(_panels, function(index, panel) {
      var $panel = $(panel.selector),
          $hologramPanel = $panel.find('.hologram-panel'),
          panelMinCenter = panel.center - _panelsVisibilityMargin,
          panelMaxCenter = panel.center + _panelsVisibilityMargin,
          panelTopOffset = (Math.abs(args.windowCenter - panel.center) * 0.6),
          translateY = 0;

      if(args.windowCenter > panel.center) {
        translateY = -panelTopOffset;
      }
      else if(args.windowCenter < panel.center) {
        translateY = panelTopOffset;
      }

      $panel.css('transform', 'translateY(' + translateY + 'px)');

      if(panelMinCenter <= args.windowCenter && panelMaxCenter >= args.windowCenter) {
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