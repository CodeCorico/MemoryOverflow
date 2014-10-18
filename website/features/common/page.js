$(function() {
  'use strict';

  window.Page = new (function Page() {

    var _this = this,
        _$el = {},
        _on = {},
        _cityRules = {
          normalPosition: 1735,
          scrollSpeed: 0.4
        };

    function _init() {
      _this.$el({
        window: $(window),
        header: $('.body-header'),
        city: $('.city'),
        logo: $('.logo'),
        homeMessage: $('.home-message')
      });

      _this.$el('window')
        .scroll(_onPageRedraw)
        .resize(_onPageRedraw);

      _onPageRedraw();
    }

    function _onPageRedraw() {
      var windowHeight = _this.$el('window').height(),
          scrollTop = _this.$el('window').scrollTop(),
          scrollBottom = scrollTop + windowHeight,
          windowCenter = scrollTop + (windowHeight / 2),
          headerTranslateY = -Math.round(scrollTop * 0.9),
          headerOpacity = Math.max(0, 1 - ((scrollTop * 100 / (_this.$el('header').height() / 2)) / 100));

      _this.$el('logo').css({
        transform: 'translateY(' + headerTranslateY + 'px)',
        opacity: headerOpacity
      });
      _this.$el('homeMessage').css({
        transform: 'translateY(' + headerTranslateY + 'px)',
        opacity: headerOpacity
      });

      _this.$el('city').css('bottom', (_cityRules.normalPosition - scrollBottom) * _cityRules.scrollSpeed);

      _this.fire('pageRedraw', {
        windowHeight: windowHeight,
        scrollTop: scrollTop,
        scrollBottom: scrollBottom,
        windowCenter: windowCenter
      });
    }

    this.$el = function(nameOrElements) {
      if(typeof nameOrElements == 'object') {
        $.extend(true, _$el, nameOrElements);

        return _this;
      }

      return _$el[nameOrElements] || null;
    };

    this.onPageRedraw = function(func) {
      _on.pageRedraw = _on.pageRedraw || [];
      _on.pageRedraw.push(func);
    };

    this.fire = function(event, args) {
      if(!_on[event]) {
        return _this;
      }

      $.each(_on[event], function(index, func) {
        func(args);
      });
    };

    _init();

  })();

});