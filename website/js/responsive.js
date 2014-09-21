(function() {
  'use strict';

  var _$el,
      _baseSize,
      _windowSize,
      _screenSize,
      _zoomRatio;

  // IE 9 & 10
  var _isIE = /*@cc_on !@*/false && (document.documentMode > 8);
  // IE 11
  _isIE = Object.hasOwnProperty.call(window, 'ActiveXObject') && !window.ActiveXObject ? true : _isIE;

  function _aspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
      width: srcWidth * ratio,
      height: srcHeight * ratio
    };
  }

  function _resize() {
    _windowSize = {
      width: _$el.window.width(),
      height: _$el.window.height()
    };

    _screenSize = _aspectRatioFit(_baseSize.width, _baseSize.height, _windowSize.width, _windowSize.height);

    _zoomRatio = _screenSize.width / _baseSize.width;

    _screenSize = {
      width: Math.round(_baseSize.width * _zoomRatio),
      height: Math.round(_baseSize.height * _zoomRatio)
    };

    var negativeZoomRatio = 1 / _zoomRatio,
        scale = (Math.round(1 * _zoomRatio) * 100) / 100,
        zoomIsEnabled = typeof document.body.style.zoom != 'undefined',
        position = !_isIE && zoomIsEnabled ? {
          top: Math.round(negativeZoomRatio * ((_windowSize.height - _screenSize.height) / 2)),
          left: Math.round(negativeZoomRatio * ((_windowSize.width - _screenSize.width) / 2))
        } : {
          top: Math.round((_windowSize.height - _screenSize.height) / 2),
          left: Math.round((_windowSize.width - _screenSize.width) / 2)
        };

    _$el.screen.css({
      top: position.top,
      left: position.left
    });

    if(zoomIsEnabled) {
      _$el.screen.css({
        top: position.top,
        left: position.left,
        zoom: _zoomRatio
      });

      _screenSize.style = {
        zoom: _zoomRatio
      };
    }
    else {
      _$el.screen.css({
        transform: 'scale(' + scale + ')',
        'transform-origin': '0 0'
      });

      _screenSize.style = {
        transform: 'scale(' + scale + ')'
      };
    }
  }

  $(window).load(function() {
    _$el = {
      window: $(window),
      screen: $('.content-screen'),
      container: $('.container')
    };

    _baseSize = {
      width: _$el.container.width(),
      height: _$el.container.height()
    };

    _resize();
    $(window).resize(_resize);
  });

})();