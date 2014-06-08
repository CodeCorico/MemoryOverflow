$(function() {
  'use strict';

  var $el = {
    window: $(window),
    header: $('header')
  };

  $el.window.scroll(function(e) {
    if($el.window.scrollTop() >= 211) {
      $el.header.addClass('locked');
    }
    else {
      $el.header.removeClass('locked');
    }
  });

});