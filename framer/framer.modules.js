require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"draggableAndDoubleTapLayer":[function(require,module,exports){
exports.createLayer = function() {
  var layerA, mainLayer;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Draggable+DoubleTap";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: "100px",
    paddingTop: "300px"
  };
  layerA.html = "Drag the layer, or double tap<br/>to scale up and down";
  layerA.draggable.enabled = true;
  layerA.on(Events.DoubleTap, function(ev) {
    return layerA.animate({
      properties: {
        scale: layerA.scale === 0.5 ? 1.0 : 0.5
      },
      curve: "ease",
      time: 0.5
    });
  });
  return mainLayer;
};


},{}],"navigationComponent":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.NavigationComponent = (function(superClass) {
  var _ANIMATION_CURVE, _ANIMATION_TIME, _LEFT_PADDING, navigationComponentsCounter;

  extend(NavigationComponent, superClass);

  _ANIMATION_TIME = 0.4;

  _ANIMATION_CURVE = "cubic-bezier(.6, .1, .3, 1)";

  _LEFT_PADDING = Framer.Device.deviceType.indexOf("iphone-6plus") === -1 ? 46 : 69;

  Events.NavigationWillPush = "navigationWillPush";

  Events.NavigationDidPush = "navigationDidPush";

  Events.NavigationWillPop = "navigationWillPop";

  Events.NavigationDidPop = "navigationDidPop";

  navigationComponentsCounter = 1;

  function NavigationComponent(options) {
    var backArrow, base, base1, base2, base3, base4, leftLayer, titleLayer;
    this.options = options != null ? options : {};
    if (!this.options.rootLayer) {
      throw new Error("Can't initialize NavigationComponent: parameter 'rootLayer' is required.");
      return;
    }
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "transparent";
    }
    if ((base4 = this.options).name == null) {
      base4.name = "Navigation Component " + navigationComponentsCounter;
    }
    NavigationComponent.__super__.constructor.call(this, this.options);
    navigationComponentsCounter++;
    this.navigationLayers = [];
    this.headerLayer = null;
    this.animationTime = this.options.animationTime || _ANIMATION_TIME;
    this.animationCurve = this.options.animationCurve || _ANIMATION_CURVE;
    this.animationPush = this.options.animationPush || this._defaultAnimationPush;
    this.animationPop = this.options.animationPop || this._defaultAnimationPop;
    this.currentLayerIndex = -1;
    this.lock = false;
    this.customHeader = false;
    if (this.options.headerLayer) {
      this.headerLayer = this.options.headerLayer;
      this.addSubLayer(this.headerLayer);
      this.customHeader = true;
    } else {
      this.headerLayer = new Layer({
        superLayer: this,
        name: "Header Layer",
        width: this.width,
        height: 88,
        clip: false,
        backgroundColor: "rgba(248, 248, 248, 0.9)"
      });
      this.headerLayer.style["background-image"] = "linear-gradient(0deg, rgb(200, 199, 204), rgb(200, 199, 204) 50%, transparent 50%)";
      this.headerLayer.style["background-size"] = "100% 1px";
      this.headerLayer.style["background-repeat"] = "no-repeat";
      this.headerLayer.style["background-position"] = "bottom";
      titleLayer = new Layer({
        superLayer: this.headerLayer,
        name: "Title Layer",
        width: this.headerLayer.width / 2,
        height: this.headerLayer.height,
        backgroundColor: ""
      });
      titleLayer.centerX();
      titleLayer.style = {
        "font-size": "34px",
        "color": "black",
        "line-height": this.headerLayer.height + "px",
        "font-weight": "500",
        "text-align": "center",
        "font-family": "'Helvetica Neue', Helvetica, Arial, sans-serif",
        "white-space": "nowrap",
        "height": this.headerLayer.height + "px"
      };
      leftLayer = new Layer({
        superLayer: this.headerLayer,
        name: "Left Layer",
        width: 140,
        height: this.headerLayer.height,
        backgroundColor: "",
        opacity: 0,
        x: _LEFT_PADDING
      });
      leftLayer.style = {
        "font-size": "34px",
        "color": "rgb(21, 125, 251)",
        "line-height": this.headerLayer.height + "px",
        "font-weight": "300",
        "text-align": "left",
        "font-family": "'Helvetica Neue', Helvetica, Arial, sans-serif",
        "white-space": "nowrap",
        "height": this.headerLayer.height + "px"
      };
      leftLayer.on(Events.Click, (function(_this) {
        return function() {
          return _this.pop();
        };
      })(this));
      backArrow = new Layer({
        superLayer: this.headerLayer,
        name: "Back Arrow",
        originX: 0,
        originY: 0,
        backgroundColor: "",
        opacity: 0,
        html: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='46px' height='88px' viewBox='0 0 46 88' enable-background='new 0 0 46 88' xml:space='preserve'> <polygon fill='#157DFB' points='36.51,64.51 40.61,60.4 24.2,44 40.61,27.59 36.51,23.49 20.1,39.9 16,44 20.1,48.1 20.1,48.1 '/> </svg>"
      });
      backArrow.on(Events.Click, (function(_this) {
        return function() {
          return _this.pop();
        };
      })(this));
      this.headerLayer.titleLayer = titleLayer;
      this.headerLayer.backArrow = backArrow;
      this.headerLayer.leftLayer = leftLayer;
      if (Framer.Device.deviceType.indexOf("iphone-6plus") >= 0) {
        this.headerLayer.height = 132;
        titleLayer.height = 132;
        titleLayer.style["font-size"] = "48px";
        titleLayer.style["line-height"] = titleLayer.height + "px";
        leftLayer.height = 132;
        leftLayer.style["font-size"] = "48px";
        leftLayer.style["line-height"] = titleLayer.height + "px";
        leftLayer.width = leftLayer.width * 1.5;
        backArrow.scale = 1.5;
      }
    }
    if (this.options.rootLayer) {
      this.navigationLayers = [this.options.rootLayer];
      this.currentLayerIndex = 0;
      this.addSubLayer(this.options.rootLayer);
      this.headerLayer.bringToFront();
      if (this.options.rootLayer.title && this.headerLayer.titleLayer) {
        this.headerLayer.titleLayer.html = "<div style=\"overflow: hidden; text-overflow: ellipsis\">" + this.options.rootLayer.title + "</div>";
      }
    }
  }

  NavigationComponent.prototype.push = function(layer) {
    var currentLayer, nextLayer;
    if (!this.lock) {
      this.emit(Events.NavigationWillPush, {
        navigationLayer: this,
        currentLayer: currentLayer,
        nextLayer: nextLayer
      });
      this.lock = true;
      this.navigationLayers.push(layer);
      this.addSubLayer(layer);
      if (this.headerLayer) {
        this.headerLayer.bringToFront();
      }
      currentLayer = this.navigationLayers[this.currentLayerIndex];
      nextLayer = layer;
      if (typeof currentLayer.layerWillDisappear === "function") {
        currentLayer.layerWillDisappear();
      }
      if (typeof nextLayer.layerWillAppear === "function") {
        nextLayer.layerWillAppear();
      }
      this.currentLayerIndex++;
      this.animationPush(currentLayer, nextLayer);
      this._defaultHeaderAnimationPush(currentLayer, nextLayer);
      return Utils.delay(this.animationTime, (function(_this) {
        return function() {
          currentLayer.visible = false;
          _this.lock = false;
          return _this.emit(Events.NavigationDidPush, {
            navigationLayer: _this,
            currentLayer: currentLayer,
            nextLayer: nextLayer
          });
        };
      })(this));
    } else {
      return layer.destroy();
    }
  };

  NavigationComponent.prototype.pop = function() {
    return this.popToLayerAtIndex(this.currentLayerIndex - 1);
  };

  NavigationComponent.prototype.popToRootLayer = function() {
    return this.popToLayerAtIndex(0);
  };

  NavigationComponent.prototype.popToLayerAtIndex = function(index) {
    var currentLayer, nextLayer;
    if (!this.lock) {
      this.lock = true;
      if (this.currentLayerIndex > 0 && ((0 <= index && index <= this.navigationLayers.length))) {
        this.emit(Events.NavigationWillPop, {
          navigationLayer: this,
          index: index,
          currentLayer: currentLayer,
          nextLayer: nextLayer
        });
        currentLayer = this.navigationLayers[this.currentLayerIndex];
        nextLayer = this.navigationLayers[index];
        nextLayer.visible = true;
        if (typeof currentLayer.layerWillDisappear === "function") {
          currentLayer.layerWillDisappear();
        }
        if (typeof nextLayer.layerWillAppear === "function") {
          nextLayer.layerWillAppear();
        }
        this.animationPop(currentLayer, nextLayer);
        this._defaultHeaderAnimationPop(currentLayer, nextLayer, index);
        return Utils.delay(this.animationTime, (function(_this) {
          return function() {
            var i, indexToBeDeleted, layerToBeDeleted, ref, ref1;
            for (indexToBeDeleted = i = ref = _this.navigationLayers.length - 1, ref1 = index + 1; ref <= ref1 ? i <= ref1 : i >= ref1; indexToBeDeleted = ref <= ref1 ? ++i : --i) {
              layerToBeDeleted = _this.navigationLayers[indexToBeDeleted];
              layerToBeDeleted.destroy();
              _this.navigationLayers.pop();
            }
            _this.currentLayerIndex = index;
            _this.lock = false;
            return _this.emit(Events.NavigationDidPop, {
              navigationLayer: _this,
              index: index,
              currentLayer: currentLayer,
              nextLayer: nextLayer
            });
          };
        })(this));
      } else {
        return this.lock = false;
      }
    }
  };

  NavigationComponent.prototype._animateHeaderSubLayer = function(subLayerName, fromLayer, toLayer, newTitle, currentToX, newFromX) {
    var headerSubLayer, newHeaderSubLayer, newHeaderSubLayerAnimation, origSubLayerX;
    if (this.headerLayer[subLayerName]) {
      headerSubLayer = this.headerLayer[subLayerName];
      origSubLayerX = headerSubLayer.x;
      headerSubLayer.animate({
        properties: {
          opacity: 0,
          x: currentToX
        },
        curve: _ANIMATION_CURVE,
        time: _ANIMATION_TIME
      });
      if (newTitle !== void 0) {
        newHeaderSubLayer = headerSubLayer.copy();
        newHeaderSubLayer.style = headerSubLayer.style;
        this.headerLayer.addSubLayer(newHeaderSubLayer);
        newHeaderSubLayer.name = "tmp " + subLayerName;
        newHeaderSubLayer.x = newFromX;
        newHeaderSubLayer.opacity = 0;
        newHeaderSubLayer.html = "<div style=\"overflow: hidden; text-overflow: ellipsis\">" + newTitle + "</div>";
        newHeaderSubLayerAnimation = new Animation({
          layer: newHeaderSubLayer,
          properties: {
            opacity: 1,
            x: origSubLayerX
          },
          curve: _ANIMATION_CURVE,
          time: _ANIMATION_TIME
        });
        newHeaderSubLayerAnimation.start();
        return newHeaderSubLayerAnimation.on("end", function() {
          headerSubLayer.html = newHeaderSubLayer.html;
          headerSubLayer.opacity = 1;
          headerSubLayer.x = origSubLayerX;
          return newHeaderSubLayer.destroy();
        });
      }
    }
  };

  NavigationComponent.prototype._defaultHeaderAnimationPush = function(fromLayer, toLayer) {
    if (this.headerLayer && !this.customHeader) {
      this._animateHeaderSubLayer("titleLayer", fromLayer, toLayer, toLayer.title, -_LEFT_PADDING, this.headerLayer.width);
      this._animateHeaderSubLayer("leftLayer", fromLayer, toLayer, fromLayer.title, -this.headerLayer.width / 2, this.headerLayer.width / 2);
      if (this.headerLayer.backArrow) {
        return this.headerLayer.backArrow.animate({
          properties: {
            opacity: 1
          },
          curve: _ANIMATION_CURVE,
          time: _ANIMATION_TIME
        });
      }
    }
  };

  NavigationComponent.prototype._defaultHeaderAnimationPop = function(fromLayer, toLayer, index) {
    var newLeftLayerTitle;
    if (this.headerLayer && !this.customHeader) {
      this._animateHeaderSubLayer("titleLayer", fromLayer, toLayer, toLayer.title, this.headerLayer.width, 0);
      newLeftLayerTitle = "";
      if (this.navigationLayers[index - 1] && this.navigationLayers[index - 1].title) {
        newLeftLayerTitle = this.navigationLayers[index - 1].title;
      } else {
        if (this.headerLayer.backArrow) {
          this.headerLayer.backArrow.animate({
            properties: {
              opacity: 0
            },
            curve: _ANIMATION_CURVE,
            time: _ANIMATION_TIME
          });
        }
      }
      return this._animateHeaderSubLayer("leftLayer", fromLayer, toLayer, newLeftLayerTitle, this.headerLayer.width / 2, -this.headerLayer.width / 2);
    }
  };

  NavigationComponent.prototype._defaultAnimationPush = function(fromLayer, toLayer) {
    var shadowLayer;
    shadowLayer = new Layer({
      superLayer: fromLayer,
      width: fromLayer.width,
      height: fromLayer.height,
      name: "shadowLayer",
      backgroundColor: "black",
      opacity: 0
    });
    shadowLayer.animate({
      properties: {
        opacity: 0.2
      },
      curve: _ANIMATION_CURVE,
      time: _ANIMATION_TIME
    });
    fromLayer.animate({
      properties: {
        x: -this.width * 0.25
      },
      curve: _ANIMATION_CURVE,
      time: _ANIMATION_TIME
    });
    toLayer.shadowColor = "rgba(0,0,0,0.2)";
    toLayer.shadowX = -10;
    toLayer.shadowBlur = 14;
    toLayer.x = this.width + (-toLayer.shadowX);
    return toLayer.animate({
      properties: {
        x: 0
      },
      curve: _ANIMATION_CURVE,
      time: _ANIMATION_TIME
    });
  };

  NavigationComponent.prototype._defaultAnimationPop = function(fromLayer, toLayer) {
    var shadowLayer, shadowLayerAnimation;
    fromLayer.animate({
      properties: {
        x: this.width + (-fromLayer.shadowX)
      },
      curve: _ANIMATION_CURVE,
      time: _ANIMATION_TIME
    });
    toLayer.animate({
      properties: {
        x: 0
      },
      curve: _ANIMATION_CURVE,
      time: _ANIMATION_TIME
    });
    shadowLayer = toLayer.subLayersByName("shadowLayer")[0];
    shadowLayerAnimation = new Animation({
      layer: shadowLayer,
      properties: {
        opacity: 0
      },
      curve: _ANIMATION_CURVE,
      time: _ANIMATION_TIME
    });
    shadowLayerAnimation.start();
    return shadowLayerAnimation.on("end", function() {
      return shadowLayer.destroy();
    });
  };

  return NavigationComponent;

})(Layer);


},{}],"panLayer":[function(require,module,exports){
exports.createLayer = function() {
  var getParams, layerA, mainLayer, panDirection;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Pan";
  panDirection = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  panDirection.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: "85px"
  };
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 308,
    width: mainLayer.width - 40,
    height: mainLayer.height - 328,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "Pan in any direction";
  getParams = function(ev) {
    return ", Dist:" + ev.distance.toFixed(2) + "px, Vel:" + ev.velocity.toFixed(2) + "px/sec<br/>Time:" + ev.deltaTime.toFixed(2) + "sec";
  };
  layerA.on(Events.PanLeft, function(ev) {
    return panDirection.html = "Left" + getParams(ev);
  });
  layerA.on(Events.PanRight, function(ev) {
    return panDirection.html = "Right" + getParams(ev);
  });
  layerA.on(Events.PanUp, function(ev) {
    return panDirection.html = "Up" + getParams(ev);
  });
  layerA.on(Events.PanDown, function(ev) {
    return panDirection.html = "Down" + getParams(ev);
  });
  return mainLayer;
};


},{}],"pinchAndRotateLayer":[function(require,module,exports){
exports.createLayer = function() {
  var initialRotation, initialScale, layerA, mainLayer, pinchRotateEnd;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Pinch+Rotate";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "Pinch and rotate this layer";
  pinchRotateEnd = function(ev) {
    var scale;
    scale = ev.scale;
    if (layerA.scale < 1) {
      layerA.animate({
        properties: {
          scale: 1
        },
        curve: "spring(300, 40, 0)"
      });
      scale = 1;
    }
    layerA.animate({
      properties: {
        rotation: 0
      },
      curve: "spring(300, 40, 0)"
    });
    return layerA.html = "Scale: " + scale.toFixed(2) + ", Rot: 0.0";
  };
  initialScale = 1;
  initialRotation = 0;
  layerA.on(Events.PinchStart, function(ev) {
    return initialScale = layerA.scale;
  });
  layerA.on(Events.RotateStart, function(ev) {
    return initialRotation = layerA.rotation;
  });
  layerA.on(Events.Pinch, function(ev) {
    layerA.animateStop();
    layerA.scale = ev.scale * initialScale;
    return layerA.html = "Scale: " + ev.scale.toFixed(2) + ", Rot: " + layerA.rotation.toFixed(2);
  });
  layerA.on(Events.Rotate, function(ev) {
    layerA.animateStop();
    layerA.rotation = ev.rotation;
    return layerA.html = "Scale: " + layerA.scale.toFixed(2) + ", Rot: " + ev.rotation.toFixed(2);
  });
  layerA.on(Events.PinchEnd, function(ev) {
    return pinchRotateEnd(ev);
  });
  layerA.on(Events.RotateEnd, function(ev) {
    return pinchRotateEnd(ev);
  });
  return mainLayer;
};


},{}],"pinchLayer":[function(require,module,exports){
exports.createLayer = function() {
  var initialScale, layerA, mainLayer;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Pinch";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "Pinch over this layer";
  initialScale = 1;
  layerA.on(Events.PinchStart, function(ev) {
    return initialScale = layerA.scale;
  });
  layerA.on(Events.PinchEnd, function(ev) {
    if (layerA.scale < 1) {
      layerA.animate({
        properties: {
          scale: 1
        },
        curve: "spring(300, 40, 0)"
      });
      return layerA.html = "Scale: 1.0";
    }
  });
  layerA.on(Events.Pinch, function(ev) {
    layerA.animateStop();
    layerA.scale = ev.scale * initialScale;
    return layerA.html = "Scale: " + ev.scale.toFixed(2);
  });
  return mainLayer;
};


},{}],"pressLayer":[function(require,module,exports){
exports.createLayer = function() {
  var layerA, mainLayer;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Long press";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "Long press on this layer";
  layerA.on(Events.Press, function(ev) {
    return layerA.animate({
      properties: {
        scale: layerA.scale === 0.5 ? 1.0 : 0.5
      },
      curve: "spring(300, 40, 0)"
    });
  });
  return mainLayer;
};


},{}],"removeAllListenersLayer":[function(require,module,exports){
exports.createLayer = function() {
  var ev, eventNameLayer, eventsToListen, i, layerA, len, mainLayer, showEvent;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Remove all listeners";
  eventNameLayer = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  eventNameLayer.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: "85px"
  };
  eventNameLayer.html = "All listeners will be removed after 10s";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 308,
    width: mainLayer.width - 40,
    height: mainLayer.height - 328,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "Swipe, Pinch, Press, DoubleTap or Rotate";
  showEvent = function(eventName) {
    eventNameLayer.html = eventName;
    eventNameLayer.animateStop();
    eventNameLayer.opacity = 1;
    return eventNameLayer.animate({
      properties: {
        opacity: 0
      },
      curve: "spring(300, 40, 0)"
    });
  };
  eventsToListen = [Events.SwipeLeft, Events.SwipeRight, Events.SwipeUp, Events.SwipeDown, Events.Pinch, Events.Press, Events.DoubleTap, Events.Rotate];
  for (i = 0, len = eventsToListen.length; i < len; i++) {
    ev = eventsToListen[i];
    layerA.on(ev, function(ev) {
      return showEvent(ev.type);
    });
  }
  Utils.delay(10.0, function() {
    var j, len1;
    for (j = 0, len1 = eventsToListen.length; j < len1; j++) {
      ev = eventsToListen[j];
      layerA.removeAllListeners();
    }
    eventNameLayer.animateStop();
    eventNameLayer.html = "All listeners have been removed";
    return eventNameLayer.opacity = 1.0;
  });
  return mainLayer;
};


},{}],"rotateLayer":[function(require,module,exports){
exports.createLayer = function() {
  var initialRotation, layerA, mainLayer;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Rotate";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "You can rotate this layer";
  initialRotation = 0;
  layerA.on(Events.RotateStart, function(ev) {
    return initialRotation = layerA.rotation;
  });
  layerA.on(Events.RotateEnd, function(ev) {
    layerA.animate({
      properties: {
        rotation: 0
      },
      curve: "spring(300, 40, 0)"
    });
    return layerA.html = "Rotation: 0.0";
  });
  layerA.on(Events.Rotate, function(ev) {
    layerA.animateStop();
    layerA.rotation = ev.rotation;
    return layerA.html = "Rotation: " + ev.rotation.toFixed(2);
  });
  return mainLayer;
};


},{}],"scrollAndRotateLayer":[function(require,module,exports){
exports.createLayer = function() {
  var i, initialRotation, j, layer, mainLayer, scroll;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Scroll+Rotate";
  scroll = new ScrollComponent({
    superLayer: mainLayer,
    backgroundColor: "rgba(255,255,255,0.2)",
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    scrollHorizontal: false,
    borderRadius: 8
  });
  scroll.contentInset = {
    top: 10,
    bottom: 10
  };
  for (i = j = 0; j <= 10; i = ++j) {
    layer = new Layer({
      superLayer: scroll.content,
      backgroundColor: "#fff",
      borderRadius: 4,
      width: scroll.content.width - 20,
      height: 160,
      x: 10,
      y: 170 * i
    });
  }
  initialRotation = 0;
  scroll.on(Events.RotateStart, function(ev) {
    return initialRotation = scroll.rotation;
  });
  scroll.on(Events.Rotate, function(ev) {
    scroll.animateStop();
    return scroll.rotation = ev.rotation;
  });
  return mainLayer;
};


},{}],"swipeLayer":[function(require,module,exports){
exports.createLayer = function() {
  var animateBack, animateLayer, layerA, mainLayer;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Swipe";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "Swipe in any direction";
  mainLayer.perspective = 1250;
  layerA.force2d = false;
  animateBack = function() {
    return layerA.animate({
      properties: {
        rotationX: 0,
        rotationY: 0
      },
      curve: "spring(300, 40, 0)"
    });
  };
  animateLayer = function(layer, properties) {
    var animationA;
    animationA = new Animation({
      layer: layer,
      properties: properties,
      curve: "spring(300, 40, 0)"
    });
    animationA.on(Events.AnimationEnd, animateBack);
    return animationA.start();
  };
  layerA.on(Events.SwipeLeft, function(ev) {
    return animateLayer(layerA, {
      rotationY: -60
    });
  });
  layerA.on(Events.SwipeRight, function(ev) {
    return animateLayer(layerA, {
      rotationY: 60
    });
  });
  layerA.on(Events.SwipeUp, function(ev) {
    return animateLayer(layerA, {
      rotationX: 60
    });
  });
  layerA.on(Events.SwipeDown, function(ev) {
    return animateLayer(layerA, {
      rotationX: -60
    });
  });
  return mainLayer;
};


},{}],"tapLayer":[function(require,module,exports){
exports.createLayer = function() {
  var layerA, mainLayer;
  mainLayer = new Layer({
    width: Screen.width,
    height: Screen.height,
    backgroundColor: "#28affa"
  });
  mainLayer.title = "Tap";
  layerA = new Layer({
    superLayer: mainLayer,
    x: 20,
    y: 108,
    width: mainLayer.width - 40,
    height: mainLayer.height - 128,
    backgroundColor: "#fff",
    borderRadius: 8
  });
  layerA.style = {
    textAlign: "center",
    fontSize: "40px",
    color: "black",
    fontWeight: "bold",
    lineHeight: layerA.height + "px"
  };
  layerA.html = "Tap to scale up, double tap down";
  layerA.on(Events.Tap, function(ev) {
    return layerA.animate({
      properties: {
        scale: 1.0
      },
      curve: "spring(300, 40, 0)"
    });
  });
  layerA.on(Events.DoubleTap, function(ev) {
    return layerA.animate({
      properties: {
        scale: 0.5
      },
      curve: "spring(300, 40, 0)"
    });
  });
  return mainLayer;
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL2RyYWdnYWJsZUFuZERvdWJsZVRhcExheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvbmF2aWdhdGlvbkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3BhbkxheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvcGluY2hBbmRSb3RhdGVMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3BpbmNoTGF5ZXIuY29mZmVlIiwiL1VzZXJzL2phdmllci9Qcm9ncmFtYWNpb24vZ2l0aHViL2ZyYW1lci1nZXN0dXJlcy5mcmFtZXIvbW9kdWxlcy9wcmVzc0xheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvcmVtb3ZlQWxsTGlzdGVuZXJzTGF5ZXIuY29mZmVlIiwiL1VzZXJzL2phdmllci9Qcm9ncmFtYWNpb24vZ2l0aHViL2ZyYW1lci1nZXN0dXJlcy5mcmFtZXIvbW9kdWxlcy9yb3RhdGVMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3Njcm9sbEFuZFJvdGF0ZUxheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvc3dpcGVMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3RhcExheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLFNBQUE7QUFFckIsTUFBQTtFQUFBLFNBQUEsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7SUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQWQ7SUFDQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE1BRGY7SUFFQSxlQUFBLEVBQWlCLFNBRmpCO0dBRGU7RUFJaEIsU0FBUyxDQUFDLEtBQVYsR0FBa0I7RUFHbEIsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUNaO0lBQUEsVUFBQSxFQUFZLFNBQVo7SUFDQSxDQUFBLEVBQUcsRUFESDtJQUVBLENBQUEsRUFBRyxHQUZIO0lBR0EsS0FBQSxFQUFPLFNBQVMsQ0FBQyxLQUFWLEdBQWtCLEVBSHpCO0lBSUEsTUFBQSxFQUFRLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLEdBSjNCO0lBS0EsZUFBQSxFQUFpQixNQUxqQjtJQU1BLFlBQUEsRUFBYyxDQU5kO0dBRFk7RUFTYixNQUFNLENBQUMsS0FBUCxHQUNDO0lBQUEsU0FBQSxFQUFXLFFBQVg7SUFDQSxRQUFBLEVBQVUsTUFEVjtJQUVBLEtBQUEsRUFBTyxPQUZQO0lBR0EsVUFBQSxFQUFZLE1BSFo7SUFJQSxVQUFBLEVBQVksT0FKWjtJQUtBLFVBQUEsRUFBWSxPQUxaOztFQU9ELE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFFZCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQWpCLEdBQTJCO0VBRTNCLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLFNBQWpCLEVBQTRCLFNBQUMsRUFBRDtXQUMzQixNQUFNLENBQUMsT0FB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TUFEVjtJQUVBLEtBQUEsRUFBTyxPQUZQO0lBR0EsVUFBQSxFQUFZLE1BSFo7SUFJQSxVQUFBLEVBQWUsTUFBTSxDQUFDLE1BQVIsR0FBZSxJQUo3Qjs7RUFNRCxNQUFNLENBQUMsSUFBUCxHQUFjO0VBRWQsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsR0FBakIsRUFBc0IsU0FBQyxFQUFEO1dBQ3JCLE1BQU0sQ0FBQyxPQUFQLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxLQUFBLEVBQU8sR0FBUDtPQUREO01BRUEsS0FBQSxFQUFPLG9CQUZQO0tBREQ7RUFEcUIsQ0FBdEI7RUFNQSxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxTQUFqQixFQUE0QixTQUFDLEVBQUQ7V0FDM0IsTUFBTSxDQUFDLE9BQVAsQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLEtBQUEsRUFBTyxHQUFQO09BREQ7TUFFQSxLQUFBLEVBQU8sb0JBRlA7S0FERDtFQUQyQixDQUE1QjtBQU1BLFNBQU87QUF2Q2MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIkRyYWdnYWJsZStEb3VibGVUYXBcIlxuXHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAxMjhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRsYXllckEuc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIjEwMHB4XCIsXG5cdFx0cGFkZGluZ1RvcDogXCIzMDBweFwiXG5cdFx0XG5cdGxheWVyQS5odG1sID0gXCJEcmFnIHRoZSBsYXllciwgb3IgZG91YmxlIHRhcDxici8+dG8gc2NhbGUgdXAgYW5kIGRvd25cIlxuXHRcblx0bGF5ZXJBLmRyYWdnYWJsZS5lbmFibGVkID0gdHJ1ZVxuXG5cdGxheWVyQS5vbiBFdmVudHMuRG91YmxlVGFwLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiBpZiBsYXllckEuc2NhbGUgPT0gMC41IHRoZW4gMS4wIGVsc2UgMC41XG5cdFx0XHRjdXJ2ZTogXCJlYXNlXCJcblx0XHRcdHRpbWU6IDAuNVxuXHRcdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImNsYXNzIGV4cG9ydHMuTmF2aWdhdGlvbkNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdFxuXHQjaU9TIGFuaW1hdGlvbiBjb25zdGFudHNcblx0X0FOSU1BVElPTl9USU1FIFx0XHRcdD0gMC40XG5cdF9BTklNQVRJT05fQ1VSVkUgXHRcdFx0PSBcImN1YmljLWJlemllciguNiwgLjEsIC4zLCAxKVwiXG5cdF9MRUZUX1BBRERJTkcgXHRcdFx0XHQ9IGlmIEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZS5pbmRleE9mKFwiaXBob25lLTZwbHVzXCIpIGlzIC0xIHRoZW4gNDYgZWxzZSA2OVxuXHRcblx0I0N1c3RvbSBldmVudHNcblx0RXZlbnRzLk5hdmlnYXRpb25XaWxsUHVzaCBcdD0gXCJuYXZpZ2F0aW9uV2lsbFB1c2hcIlxuXHRFdmVudHMuTmF2aWdhdGlvbkRpZFB1c2ggXHQ9IFwibmF2aWdhdGlvbkRpZFB1c2hcIlxuXHRFdmVudHMuTmF2aWdhdGlvbldpbGxQb3AgXHQ9IFwibmF2aWdhdGlvbldpbGxQb3BcIlxuXHRFdmVudHMuTmF2aWdhdGlvbkRpZFBvcCBcdD0gXCJuYXZpZ2F0aW9uRGlkUG9wXCJcblx0XG5cdCMgU2hhcmVkIGNsYXNzIHZhcmlhYmxlc1x0XHRcblx0bmF2aWdhdGlvbkNvbXBvbmVudHNDb3VudGVyID0gMVxuXHRcblx0IyBQdWJsaWMgY29uc3RydWN0b3Jcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblxuXHRcdCMgQ2hlY2sgcmVxdWlyZWQgcGFyYW1zXG5cdFx0aWYgbm90IEBvcHRpb25zLnJvb3RMYXllclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgaW5pdGlhbGl6ZSBOYXZpZ2F0aW9uQ29tcG9uZW50OiBwYXJhbWV0ZXIgJ3Jvb3RMYXllcicgaXMgcmVxdWlyZWQuXCIpXG5cdFx0XHRyZXR1cm5cblxuXHRcdEBvcHRpb25zLndpZHRoICAgICAgICAgICA/PSBTY3JlZW4ud2lkdGhcblx0XHRAb3B0aW9ucy5oZWlnaHQgICAgICAgICAgPz0gU2NyZWVuLmhlaWdodFxuXHRcdEBvcHRpb25zLmNsaXAgICAgICAgICAgICA/PSB0cnVlXG5cdFx0QG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwidHJhbnNwYXJlbnRcIlxuXHRcdEBvcHRpb25zLm5hbWUgXHRcdFx0ID89IFwiTmF2aWdhdGlvbiBDb21wb25lbnQgXCIgKyBuYXZpZ2F0aW9uQ29tcG9uZW50c0NvdW50ZXJcblxuXHRcdHN1cGVyIEBvcHRpb25zXG5cdFx0XG5cdFx0bmF2aWdhdGlvbkNvbXBvbmVudHNDb3VudGVyKytcblxuXHRcdEBuYXZpZ2F0aW9uTGF5ZXJzICAgPSBbXVxuXHRcdEBoZWFkZXJMYXllciBcdFx0PSBudWxsXG5cdFx0QGFuaW1hdGlvblRpbWUgXHRcdD0gQG9wdGlvbnMuYW5pbWF0aW9uVGltZSBvciBfQU5JTUFUSU9OX1RJTUVcblx0XHRAYW5pbWF0aW9uQ3VydmVcdFx0PSBAb3B0aW9ucy5hbmltYXRpb25DdXJ2ZSBvciBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0QGFuaW1hdGlvblB1c2ggXHRcdD0gQG9wdGlvbnMuYW5pbWF0aW9uUHVzaCBvciBAX2RlZmF1bHRBbmltYXRpb25QdXNoXG5cdFx0QGFuaW1hdGlvblBvcFx0XHQ9IEBvcHRpb25zLmFuaW1hdGlvblBvcCBvciBAX2RlZmF1bHRBbmltYXRpb25Qb3Bcblx0XHRAY3VycmVudExheWVySW5kZXggXHQ9IC0xXG5cdFx0QGxvY2sgXHRcdFx0XHQ9IGZhbHNlXG5cdFx0QGN1c3RvbUhlYWRlciBcdFx0PSBmYWxzZVxuXHRcdFxuXHRcdGlmIEBvcHRpb25zLmhlYWRlckxheWVyXG5cdFx0XHRAaGVhZGVyTGF5ZXIgPSBAb3B0aW9ucy5oZWFkZXJMYXllclxuXHRcdFx0QGFkZFN1YkxheWVyKEBoZWFkZXJMYXllcilcblx0XHRcdEBjdXN0b21IZWFkZXIgPSB0cnVlXG5cdFx0ZWxzZSAjIERlZmF1bHQgaU9TNyBoZWFkZXJcblx0XHRcdEBoZWFkZXJMYXllciA9IG5ldyBMYXllclxuXHRcdFx0XHRzdXBlckxheWVyOiBAXG5cdFx0XHRcdG5hbWU6IFwiSGVhZGVyIExheWVyXCJcblx0XHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IDg4XG5cdFx0XHRcdGNsaXA6IGZhbHNlXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJyZ2JhKDI0OCwgMjQ4LCAyNDgsIDAuOSlcIlxuXHRcdFx0QGhlYWRlckxheWVyLnN0eWxlW1wiYmFja2dyb3VuZC1pbWFnZVwiXSA9IFwibGluZWFyLWdyYWRpZW50KDBkZWcsIHJnYigyMDAsIDE5OSwgMjA0KSwgcmdiKDIwMCwgMTk5LCAyMDQpIDUwJSwgdHJhbnNwYXJlbnQgNTAlKVwiXG5cdFx0XHRAaGVhZGVyTGF5ZXIuc3R5bGVbXCJiYWNrZ3JvdW5kLXNpemVcIl0gPSBcIjEwMCUgMXB4XCJcblx0XHRcdEBoZWFkZXJMYXllci5zdHlsZVtcImJhY2tncm91bmQtcmVwZWF0XCJdID0gXCJuby1yZXBlYXRcIlxuXHRcdFx0QGhlYWRlckxheWVyLnN0eWxlW1wiYmFja2dyb3VuZC1wb3NpdGlvblwiXSA9IFwiYm90dG9tXCJcblx0XHRcdFxuXHRcdFx0dGl0bGVMYXllciA9IG5ldyBMYXllclxuXHRcdFx0XHRzdXBlckxheWVyOiBAaGVhZGVyTGF5ZXJcblx0XHRcdFx0bmFtZTogXCJUaXRsZSBMYXllclwiXG5cdFx0XHRcdHdpZHRoOiBAaGVhZGVyTGF5ZXIud2lkdGggLyAyXG5cdFx0XHRcdGhlaWdodDogQGhlYWRlckxheWVyLmhlaWdodFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0XHRcdHRpdGxlTGF5ZXIuY2VudGVyWCgpXG5cdFx0XHR0aXRsZUxheWVyLnN0eWxlID1cblx0XHRcdFx0XCJmb250LXNpemVcIiA6IFwiMzRweFwiXG5cdFx0XHRcdFwiY29sb3JcIiA6IFwiYmxhY2tcIlxuXHRcdFx0XHRcImxpbmUtaGVpZ2h0XCIgOiBAaGVhZGVyTGF5ZXIuaGVpZ2h0ICsgXCJweFwiXG5cdFx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IFwiNTAwXCJcblx0XHRcdFx0XCJ0ZXh0LWFsaWduXCIgOiBcImNlbnRlclwiXG5cdFx0XHRcdFwiZm9udC1mYW1pbHlcIjogXCInSGVsdmV0aWNhIE5ldWUnLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmXCJcblx0XHRcdFx0XCJ3aGl0ZS1zcGFjZVwiOiBcIm5vd3JhcFwiXG5cdFx0XHRcdFwiaGVpZ2h0XCIgOiBAaGVhZGVyTGF5ZXIuaGVpZ2h0ICsgXCJweFwiXG5cblx0XHRcdGxlZnRMYXllciA9IG5ldyBMYXllclxuXHRcdFx0XHRzdXBlckxheWVyOiBAaGVhZGVyTGF5ZXJcblx0XHRcdFx0bmFtZTogXCJMZWZ0IExheWVyXCJcblx0XHRcdFx0d2lkdGg6IDE0MFxuXHRcdFx0XHRoZWlnaHQ6IEBoZWFkZXJMYXllci5oZWlnaHRcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0eDogX0xFRlRfUEFERElOR1xuXHRcdFx0bGVmdExheWVyLnN0eWxlID1cblx0XHRcdFx0XCJmb250LXNpemVcIiA6IFwiMzRweFwiXG5cdFx0XHRcdFwiY29sb3JcIiA6IFwicmdiKDIxLCAxMjUsIDI1MSlcIlxuXHRcdFx0XHRcImxpbmUtaGVpZ2h0XCIgOiBAaGVhZGVyTGF5ZXIuaGVpZ2h0ICsgXCJweFwiXG5cdFx0XHRcdFwiZm9udC13ZWlnaHRcIiA6IFwiMzAwXCJcblx0XHRcdFx0XCJ0ZXh0LWFsaWduXCIgOiBcImxlZnRcIlxuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCI6IFwiJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZlwiXG5cdFx0XHRcdFwid2hpdGUtc3BhY2VcIjogXCJub3dyYXBcIlxuXHRcdFx0XHRcImhlaWdodFwiIDogQGhlYWRlckxheWVyLmhlaWdodCArIFwicHhcIlxuXHRcdFx0bGVmdExheWVyLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdFx0QHBvcCgpXG5cblx0XHRcdGJhY2tBcnJvdyA9IG5ldyBMYXllclxuXHRcdFx0XHRzdXBlckxheWVyOiBAaGVhZGVyTGF5ZXJcblx0XHRcdFx0bmFtZTogXCJCYWNrIEFycm93XCJcblx0XHRcdFx0b3JpZ2luWDogMFxuXHRcdFx0XHRvcmlnaW5ZOiAwXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdGh0bWw6IFwiPHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB3aWR0aD0nNDZweCcgaGVpZ2h0PSc4OHB4JyB2aWV3Qm94PScwIDAgNDYgODgnIGVuYWJsZS1iYWNrZ3JvdW5kPSduZXcgMCAwIDQ2IDg4JyB4bWw6c3BhY2U9J3ByZXNlcnZlJz4gPHBvbHlnb24gZmlsbD0nIzE1N0RGQicgcG9pbnRzPSczNi41MSw2NC41MSA0MC42MSw2MC40IDI0LjIsNDQgNDAuNjEsMjcuNTkgMzYuNTEsMjMuNDkgMjAuMSwzOS45IDE2LDQ0IDIwLjEsNDguMSAyMC4xLDQ4LjEgJy8+IDwvc3ZnPlwiXG5cdFx0XHRiYWNrQXJyb3cub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0XHRAcG9wKClcblx0XHRcdFxuXHRcdFx0QGhlYWRlckxheWVyLnRpdGxlTGF5ZXIgPSB0aXRsZUxheWVyXG5cdFx0XHRAaGVhZGVyTGF5ZXIuYmFja0Fycm93ID0gYmFja0Fycm93XG5cdFx0XHRAaGVhZGVyTGF5ZXIubGVmdExheWVyID0gbGVmdExheWVyXG5cdFx0XHRcblx0XHRcdGlmIEZyYW1lci5EZXZpY2UuZGV2aWNlVHlwZS5pbmRleE9mKFwiaXBob25lLTZwbHVzXCIpID49IDBcblx0XHRcdFx0QGhlYWRlckxheWVyLmhlaWdodCA9IDEzMlxuXHRcdFx0XHR0aXRsZUxheWVyLmhlaWdodCA9IDEzMlxuXHRcdFx0XHR0aXRsZUxheWVyLnN0eWxlW1wiZm9udC1zaXplXCJdID0gXCI0OHB4XCJcblx0XHRcdFx0dGl0bGVMYXllci5zdHlsZVtcImxpbmUtaGVpZ2h0XCJdID0gdGl0bGVMYXllci5oZWlnaHQgKyBcInB4XCJcblx0XHRcdFx0bGVmdExheWVyLmhlaWdodCA9IDEzMlxuXHRcdFx0XHRsZWZ0TGF5ZXIuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjQ4cHhcIlxuXHRcdFx0XHRsZWZ0TGF5ZXIuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IHRpdGxlTGF5ZXIuaGVpZ2h0ICsgXCJweFwiXG5cdFx0XHRcdGxlZnRMYXllci53aWR0aCA9IGxlZnRMYXllci53aWR0aCAqIDEuNVxuXHRcdFx0XHRiYWNrQXJyb3cuc2NhbGUgPSAxLjVcblx0XHRcdFx0XG5cdFx0aWYgQG9wdGlvbnMucm9vdExheWVyXG5cdFx0XHRAbmF2aWdhdGlvbkxheWVycyA9IFtAb3B0aW9ucy5yb290TGF5ZXJdXG5cdFx0XHRAY3VycmVudExheWVySW5kZXggPSAwXG5cdFx0XHRAYWRkU3ViTGF5ZXIoQG9wdGlvbnMucm9vdExheWVyKVxuXHRcdFx0QGhlYWRlckxheWVyLmJyaW5nVG9Gcm9udCgpXG5cdFx0XHRpZiBAb3B0aW9ucy5yb290TGF5ZXIudGl0bGUgYW5kIEBoZWFkZXJMYXllci50aXRsZUxheWVyXG5cdFx0XHRcdEBoZWFkZXJMYXllci50aXRsZUxheWVyLmh0bWwgPSBcIjxkaXYgc3R5bGU9XFxcIm92ZXJmbG93OiBoaWRkZW47IHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzXFxcIj5cIiArIEBvcHRpb25zLnJvb3RMYXllci50aXRsZSArIFwiPC9kaXY+XCJcblxuXHQjIFB1YmxpYyBtZXRob2RzXG5cdHB1c2g6IChsYXllcikgLT5cblx0XHRpZiBub3QgQGxvY2tcblx0XHRcdEBlbWl0KEV2ZW50cy5OYXZpZ2F0aW9uV2lsbFB1c2gsIHtuYXZpZ2F0aW9uTGF5ZXI6IEAsIGN1cnJlbnRMYXllcjogY3VycmVudExheWVyLCBuZXh0TGF5ZXI6IG5leHRMYXllcn0pXG5cdFx0XHRAbG9jayA9IHRydWVcblx0XHRcdEBuYXZpZ2F0aW9uTGF5ZXJzLnB1c2gobGF5ZXIpXG5cdFx0XHRAYWRkU3ViTGF5ZXIobGF5ZXIpXG5cdFx0XHRpZiBAaGVhZGVyTGF5ZXJcblx0XHRcdFx0QGhlYWRlckxheWVyLmJyaW5nVG9Gcm9udCgpXG5cdFx0XHRjdXJyZW50TGF5ZXIgPSBAbmF2aWdhdGlvbkxheWVyc1tAY3VycmVudExheWVySW5kZXhdXG5cdFx0XHRuZXh0TGF5ZXIgPSBsYXllclxuXHRcdFx0aWYgdHlwZW9mIGN1cnJlbnRMYXllci5sYXllcldpbGxEaXNhcHBlYXIgaXMgXCJmdW5jdGlvblwiXG5cdFx0XHRcdGN1cnJlbnRMYXllci5sYXllcldpbGxEaXNhcHBlYXIoKVxuXHRcdFx0aWYgdHlwZW9mIG5leHRMYXllci5sYXllcldpbGxBcHBlYXIgaXMgXCJmdW5jdGlvblwiXG5cdFx0XHRcdG5leHRMYXllci5sYXllcldpbGxBcHBlYXIoKVxuXHRcdFx0QGN1cnJlbnRMYXllckluZGV4Kytcblx0XHRcdEBhbmltYXRpb25QdXNoKGN1cnJlbnRMYXllciwgbmV4dExheWVyKVxuXHRcdFx0QF9kZWZhdWx0SGVhZGVyQW5pbWF0aW9uUHVzaChjdXJyZW50TGF5ZXIsIG5leHRMYXllcilcblx0XHRcdFV0aWxzLmRlbGF5IEBhbmltYXRpb25UaW1lLCA9PlxuXHRcdFx0XHRjdXJyZW50TGF5ZXIudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRcdEBsb2NrID0gZmFsc2Vcblx0XHRcdFx0QGVtaXQoRXZlbnRzLk5hdmlnYXRpb25EaWRQdXNoLCB7bmF2aWdhdGlvbkxheWVyOiBALCBjdXJyZW50TGF5ZXI6IGN1cnJlbnRMYXllciwgbmV4dExheWVyOiBuZXh0TGF5ZXJ9KVxuXHRcdGVsc2Vcblx0XHRcdCMgSWYgdGhlcmUgd2FzIGEgdHJhbnNpdGlvbmluZyBnb2luZyBvbiwganVzdCByZW1vdmUgdGhlIG5ldyBsYXllclxuXHRcdFx0bGF5ZXIuZGVzdHJveSgpXG5cdFx0XG5cdHBvcDogLT5cblx0XHRAcG9wVG9MYXllckF0SW5kZXgoQGN1cnJlbnRMYXllckluZGV4IC0gMSlcblxuXHRwb3BUb1Jvb3RMYXllcjogLT5cblx0XHRAcG9wVG9MYXllckF0SW5kZXgoMClcblxuXHRwb3BUb0xheWVyQXRJbmRleDogKGluZGV4KSAtPlxuXHRcdGlmIG5vdCBAbG9ja1xuXHRcdFx0QGxvY2sgPSB0cnVlXG5cdFx0XHRpZiBAY3VycmVudExheWVySW5kZXggPiAwIGFuZCAoMCA8PSBpbmRleCA8PSBAbmF2aWdhdGlvbkxheWVycy5sZW5ndGgpXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5OYXZpZ2F0aW9uV2lsbFBvcCwge25hdmlnYXRpb25MYXllcjogQCwgaW5kZXg6IGluZGV4LCBjdXJyZW50TGF5ZXI6IGN1cnJlbnRMYXllciwgbmV4dExheWVyOiBuZXh0TGF5ZXJ9KVxuXHRcdFx0XHRjdXJyZW50TGF5ZXIgPSBAbmF2aWdhdGlvbkxheWVyc1tAY3VycmVudExheWVySW5kZXhdXG5cdFx0XHRcdG5leHRMYXllciA9IEBuYXZpZ2F0aW9uTGF5ZXJzW2luZGV4XVxuXHRcdFx0XHRuZXh0TGF5ZXIudmlzaWJsZSA9IHRydWVcblx0XHRcdFx0aWYgdHlwZW9mIGN1cnJlbnRMYXllci5sYXllcldpbGxEaXNhcHBlYXIgaXMgXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0Y3VycmVudExheWVyLmxheWVyV2lsbERpc2FwcGVhcigpXG5cdFx0XHRcdGlmIHR5cGVvZiBuZXh0TGF5ZXIubGF5ZXJXaWxsQXBwZWFyIGlzIFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdG5leHRMYXllci5sYXllcldpbGxBcHBlYXIoKVxuXHRcdFx0XHRAYW5pbWF0aW9uUG9wKGN1cnJlbnRMYXllciwgbmV4dExheWVyKVxuXHRcdFx0XHRAX2RlZmF1bHRIZWFkZXJBbmltYXRpb25Qb3AoY3VycmVudExheWVyLCBuZXh0TGF5ZXIsIGluZGV4KVxuXHRcdFx0XHRVdGlscy5kZWxheSBAYW5pbWF0aW9uVGltZSwgPT5cblx0XHRcdFx0XHRmb3IgaW5kZXhUb0JlRGVsZXRlZCBpbiBbQG5hdmlnYXRpb25MYXllcnMubGVuZ3RoLTEuLmluZGV4KzFdXG5cdFx0XHRcdFx0XHRsYXllclRvQmVEZWxldGVkID0gQG5hdmlnYXRpb25MYXllcnNbaW5kZXhUb0JlRGVsZXRlZF1cblx0XHRcdFx0XHRcdGxheWVyVG9CZURlbGV0ZWQuZGVzdHJveSgpXG5cdFx0XHRcdFx0XHRAbmF2aWdhdGlvbkxheWVycy5wb3AoKVxuXHRcdFx0XHRcdEBjdXJyZW50TGF5ZXJJbmRleCA9IGluZGV4XG5cdFx0XHRcdFx0QGxvY2sgPSBmYWxzZVxuXHRcdFx0XHRcdEBlbWl0KEV2ZW50cy5OYXZpZ2F0aW9uRGlkUG9wLCB7bmF2aWdhdGlvbkxheWVyOiBALCBpbmRleDogaW5kZXgsIGN1cnJlbnRMYXllcjogY3VycmVudExheWVyLCBuZXh0TGF5ZXI6IG5leHRMYXllcn0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBsb2NrID0gZmFsc2VcblxuXHQjIFByaXZhdGUgbWV0aG9kc1xuXG5cdF9hbmltYXRlSGVhZGVyU3ViTGF5ZXI6IChzdWJMYXllck5hbWUsIGZyb21MYXllciwgdG9MYXllciwgbmV3VGl0bGUsIGN1cnJlbnRUb1gsIG5ld0Zyb21YKSAtPlxuXHRcdGlmIEBoZWFkZXJMYXllcltzdWJMYXllck5hbWVdXG5cdFx0XHRoZWFkZXJTdWJMYXllciA9IEBoZWFkZXJMYXllcltzdWJMYXllck5hbWVdXG5cdFx0XHRvcmlnU3ViTGF5ZXJYID0gaGVhZGVyU3ViTGF5ZXIueFxuXHRcdFx0XHRcblx0XHRcdCMgQW5pbWF0ZSBjdXJyZW50IHN1YmxheWVyXG5cdFx0XHRoZWFkZXJTdWJMYXllci5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRcdHg6IGN1cnJlbnRUb1hcblx0XHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0XHRcblx0XHRcdCNDcmVhdGUgbmV3IGxheWVyIHRvIGFuaW1hdGVcblx0XHRcdGlmIG5ld1RpdGxlIGlzbnQgdW5kZWZpbmVkXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyID0gaGVhZGVyU3ViTGF5ZXIuY29weSgpXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyLnN0eWxlID0gaGVhZGVyU3ViTGF5ZXIuc3R5bGVcblx0XHRcdFx0QGhlYWRlckxheWVyLmFkZFN1YkxheWVyKG5ld0hlYWRlclN1YkxheWVyKVxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllci5uYW1lID0gXCJ0bXAgXCIgKyBzdWJMYXllck5hbWVcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXIueCA9IG5ld0Zyb21YXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyLm9wYWNpdHkgPSAwXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyLmh0bWwgPSBcIjxkaXYgc3R5bGU9XFxcIm92ZXJmbG93OiBoaWRkZW47IHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzXFxcIj5cIiArIG5ld1RpdGxlICsgXCI8L2Rpdj5cIlxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllckFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdFx0XHRsYXllcjogbmV3SGVhZGVyU3ViTGF5ZXJcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRcdFx0eDogb3JpZ1N1YkxheWVyWFxuXHRcdFx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyQW5pbWF0aW9uLnN0YXJ0KClcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXJBbmltYXRpb24ub24gXCJlbmRcIiwgLT5cblx0XHRcdFx0XHRoZWFkZXJTdWJMYXllci5odG1sID0gbmV3SGVhZGVyU3ViTGF5ZXIuaHRtbFxuXHRcdFx0XHRcdGhlYWRlclN1YkxheWVyLm9wYWNpdHkgPSAxXG5cdFx0XHRcdFx0aGVhZGVyU3ViTGF5ZXIueCA9IG9yaWdTdWJMYXllclhcblx0XHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllci5kZXN0cm95KClcblxuXHRfZGVmYXVsdEhlYWRlckFuaW1hdGlvblB1c2g6IChmcm9tTGF5ZXIsIHRvTGF5ZXIpLT5cblx0XHRpZiBAaGVhZGVyTGF5ZXIgYW5kIG5vdCBAY3VzdG9tSGVhZGVyXG5cdFx0XHRcblx0XHRcdEBfYW5pbWF0ZUhlYWRlclN1YkxheWVyKFwidGl0bGVMYXllclwiLCBmcm9tTGF5ZXIsIHRvTGF5ZXIsIHRvTGF5ZXIudGl0bGUsIC1fTEVGVF9QQURESU5HLCBAaGVhZGVyTGF5ZXIud2lkdGgpXG5cblx0XHRcdEBfYW5pbWF0ZUhlYWRlclN1YkxheWVyKFwibGVmdExheWVyXCIsIGZyb21MYXllciwgdG9MYXllciwgZnJvbUxheWVyLnRpdGxlLCAtIEBoZWFkZXJMYXllci53aWR0aCAvIDIsIEBoZWFkZXJMYXllci53aWR0aCAvIDIpXG5cblx0XHRcdGlmIEBoZWFkZXJMYXllci5iYWNrQXJyb3dcblx0XHRcdFx0QGhlYWRlckxheWVyLmJhY2tBcnJvdy5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXG5cdF9kZWZhdWx0SGVhZGVyQW5pbWF0aW9uUG9wOiAoZnJvbUxheWVyLCB0b0xheWVyLCBpbmRleCktPlxuXHRcdCNBbmltYXRlIGhlYWRlclxuXHRcdGlmIEBoZWFkZXJMYXllciBhbmQgbm90IEBjdXN0b21IZWFkZXJcblxuXHRcdFx0QF9hbmltYXRlSGVhZGVyU3ViTGF5ZXIoXCJ0aXRsZUxheWVyXCIsIGZyb21MYXllciwgdG9MYXllciwgdG9MYXllci50aXRsZSwgQGhlYWRlckxheWVyLndpZHRoLCAwKVxuXHRcdFx0XG5cdFx0XHRuZXdMZWZ0TGF5ZXJUaXRsZSA9IFwiXCJcblx0XHRcdGlmIEBuYXZpZ2F0aW9uTGF5ZXJzW2luZGV4IC0gMV0gYW5kIEBuYXZpZ2F0aW9uTGF5ZXJzW2luZGV4IC0gMV0udGl0bGVcblx0XHRcdFx0bmV3TGVmdExheWVyVGl0bGUgPSBAbmF2aWdhdGlvbkxheWVyc1tpbmRleCAtIDFdLnRpdGxlXG5cdFx0XHRlbHNlIFxuXHRcdFx0XHRpZiBAaGVhZGVyTGF5ZXIuYmFja0Fycm93XG5cdFx0XHRcdFx0QGhlYWRlckxheWVyLmJhY2tBcnJvdy5hbmltYXRlXG5cdFx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0XHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0XHRAX2FuaW1hdGVIZWFkZXJTdWJMYXllcihcImxlZnRMYXllclwiLCBmcm9tTGF5ZXIsIHRvTGF5ZXIsIG5ld0xlZnRMYXllclRpdGxlLCBAaGVhZGVyTGF5ZXIud2lkdGggLyAyLCAtQGhlYWRlckxheWVyLndpZHRoIC8gMilcblx0XHRcdFxuXG5cdF9kZWZhdWx0QW5pbWF0aW9uUHVzaDogKGZyb21MYXllciwgdG9MYXllcikgLT5cblx0XHRzaGFkb3dMYXllciA9IG5ldyBMYXllclxuXHRcdFx0c3VwZXJMYXllcjogZnJvbUxheWVyXG5cdFx0XHR3aWR0aDogZnJvbUxheWVyLndpZHRoXG5cdFx0XHRoZWlnaHQ6IGZyb21MYXllci5oZWlnaHRcblx0XHRcdG5hbWU6IFwic2hhZG93TGF5ZXJcIlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCJcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRzaGFkb3dMYXllci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwLjJcblx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHRmcm9tTGF5ZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogLUB3aWR0aCAqIDAuMjVcblx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHR0b0xheWVyLnNoYWRvd0NvbG9yID0gXCJyZ2JhKDAsMCwwLDAuMilcIlxuXHRcdHRvTGF5ZXIuc2hhZG93WCA9IC0xMFxuXHRcdHRvTGF5ZXIuc2hhZG93Qmx1ciA9IDE0XG5cdFx0dG9MYXllci54ID0gQHdpZHRoICsgKC10b0xheWVyLnNoYWRvd1gpXG5cdFx0dG9MYXllci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cblx0XHRcdFxuXHRfZGVmYXVsdEFuaW1hdGlvblBvcDogKGZyb21MYXllciwgdG9MYXllcikgLT5cblx0XHRmcm9tTGF5ZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogQHdpZHRoICsgKC1mcm9tTGF5ZXIuc2hhZG93WClcblx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHR0b0xheWVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHRzaGFkb3dMYXllciA9IHRvTGF5ZXIuc3ViTGF5ZXJzQnlOYW1lKFwic2hhZG93TGF5ZXJcIilbMF1cblx0XHRzaGFkb3dMYXllckFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOiBzaGFkb3dMYXllclxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdHNoYWRvd0xheWVyQW5pbWF0aW9uLnN0YXJ0KClcblx0XHRzaGFkb3dMYXllckFuaW1hdGlvbi5vbiBcImVuZFwiLCAtPlxuXHRcdFx0c2hhZG93TGF5ZXIuZGVzdHJveSgpXG5cdFx0IiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlBhblwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRwYW5EaXJlY3Rpb24gPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogMTgwXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0cGFuRGlyZWN0aW9uLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCI4NXB4XCJcblx0XHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAzMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAzMjhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRsYXllckEuc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIiN7bGF5ZXJBLmhlaWdodH1weFwiXG5cdFx0XG5cdGxheWVyQS5odG1sID0gXCJQYW4gaW4gYW55IGRpcmVjdGlvblwiXG5cdFxuXHRnZXRQYXJhbXMgPSAoZXYpIC0+XG5cdFx0cmV0dXJuIFwiLCBEaXN0OlwiICsgZXYuZGlzdGFuY2UudG9GaXhlZCgyKSArIFwicHgsIFZlbDpcIiArIGV2LnZlbG9jaXR5LnRvRml4ZWQoMikgKyBcInB4L3NlYzxici8+VGltZTpcIiArIGV2LmRlbHRhVGltZS50b0ZpeGVkKDIpICsgXCJzZWNcIlxuXG5cdGxheWVyQS5vbiBFdmVudHMuUGFuTGVmdCwgKGV2KSAtPlxuXHRcdHBhbkRpcmVjdGlvbi5odG1sID0gXCJMZWZ0XCIgKyBnZXRQYXJhbXMoZXYpXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlBhblJpZ2h0LCAoZXYpIC0+XG5cdFx0cGFuRGlyZWN0aW9uLmh0bWwgPSBcIlJpZ2h0XCIgKyBnZXRQYXJhbXMoZXYpXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlBhblVwLCAoZXYpIC0+XG5cdFx0cGFuRGlyZWN0aW9uLmh0bWwgPSBcIlVwXCIgKyBnZXRQYXJhbXMoZXYpXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlBhbkRvd24sIChldikgLT5cblx0XHRwYW5EaXJlY3Rpb24uaHRtbCA9IFwiRG93blwiICsgZ2V0UGFyYW1zKGV2KVxuXHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiUGluY2grUm90YXRlXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMTI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiUGluY2ggYW5kIHJvdGF0ZSB0aGlzIGxheWVyXCJcblxuXHRwaW5jaFJvdGF0ZUVuZCA9IChldikgLT5cblx0XHRzY2FsZSA9IGV2LnNjYWxlXG5cdFx0aWYgbGF5ZXJBLnNjYWxlIDwgMVxuXHRcdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXHRcdFx0c2NhbGUgPSAxXG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHJvdGF0aW9uOiAwO1xuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRsYXllckEuaHRtbCA9IFwiU2NhbGU6IFwiICsgc2NhbGUudG9GaXhlZCgyKSArIFwiLCBSb3Q6IDAuMFwiXG5cblx0XHRcblx0aW5pdGlhbFNjYWxlID0gMVxuXHRpbml0aWFsUm90YXRpb24gPSAwXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlBpbmNoU3RhcnQsIChldikgLT5cblx0XHRpbml0aWFsU2NhbGUgPSBsYXllckEuc2NhbGVcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUm90YXRlU3RhcnQsIChldikgLT5cblx0XHRpbml0aWFsUm90YXRpb24gPSBsYXllckEucm90YXRpb25cblxuXHRsYXllckEub24gRXZlbnRzLlBpbmNoLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVTdG9wKClcblx0XHRsYXllckEuc2NhbGUgPSBldi5zY2FsZSppbml0aWFsU2NhbGVcblx0XHRsYXllckEuaHRtbCA9IFwiU2NhbGU6IFwiICsgZXYuc2NhbGUudG9GaXhlZCgyKSArIFwiLCBSb3Q6IFwiICsgbGF5ZXJBLnJvdGF0aW9uLnRvRml4ZWQoMilcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUm90YXRlLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVTdG9wKClcblx0XHRsYXllckEucm90YXRpb24gPSBldi5yb3RhdGlvblxuXHRcdGxheWVyQS5odG1sID0gXCJTY2FsZTogXCIgKyBsYXllckEuc2NhbGUudG9GaXhlZCgyKSArIFwiLCBSb3Q6IFwiICsgZXYucm90YXRpb24udG9GaXhlZCgyKVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5QaW5jaEVuZCwgKGV2KSAtPlxuXHRcdHBpbmNoUm90YXRlRW5kKGV2KVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5Sb3RhdGVFbmQsIChldikgLT5cblx0XHRwaW5jaFJvdGF0ZUVuZChldilcblx0XG5cdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJQaW5jaFwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlBpbmNoIG92ZXIgdGhpcyBsYXllclwiXG5cdFx0XG5cdCMgV2l0aCBkcmFnZ2FibGUgdHJ1ZSBzb21lIGV2ZW50cyBhcmUgbW9yZSBkaWZmaWN1bHQgdG8gdHJpZ2dlciwgYnV0IHRoZXkgd29ya1xuXHRpbml0aWFsU2NhbGUgPSAxXG5cdGxheWVyQS5vbiBFdmVudHMuUGluY2hTdGFydCwgKGV2KSAtPlxuXHRcdGluaXRpYWxTY2FsZSA9IGxheWVyQS5zY2FsZVxuXHRsYXllckEub24gRXZlbnRzLlBpbmNoRW5kLCAoZXYpIC0+XG5cdFx0aWYgbGF5ZXJBLnNjYWxlIDwgMVxuXHRcdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXHRcdFx0bGF5ZXJBLmh0bWwgPSBcIlNjYWxlOiAxLjBcIlxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5QaW5jaCwgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlU3RvcCgpXG5cdFx0bGF5ZXJBLnNjYWxlID0gZXYuc2NhbGUqaW5pdGlhbFNjYWxlXG5cdFx0bGF5ZXJBLmh0bWwgPSBcIlNjYWxlOiBcIiArIGV2LnNjYWxlLnRvRml4ZWQoMilcblx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIkxvbmcgcHJlc3NcIlxuXHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAxMjhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRsYXllckEuc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIiN7bGF5ZXJBLmhlaWdodH1weFwiXG5cdFx0XG5cdGxheWVyQS5odG1sID0gXCJMb25nIHByZXNzIG9uIHRoaXMgbGF5ZXJcIlxuXHRcdFxuXHRsYXllckEub24gRXZlbnRzLlByZXNzLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiBpZiBsYXllckEuc2NhbGUgPT0gMC41IHRoZW4gMS4wIGVsc2UgMC41XG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiUmVtb3ZlIGFsbCBsaXN0ZW5lcnNcIlxuXHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0ZXZlbnROYW1lTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogMTgwXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0ZXZlbnROYW1lTGF5ZXIuc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIjg1cHhcIlxuXG5cdGV2ZW50TmFtZUxheWVyLmh0bWwgPSBcIkFsbCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkIGFmdGVyIDEwc1wiXG5cblx0XHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAzMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAzMjhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRsYXllckEuc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIiN7bGF5ZXJBLmhlaWdodH1weFwiXG5cdFx0XG5cdGxheWVyQS5odG1sID0gXCJTd2lwZSwgUGluY2gsIFByZXNzLCBEb3VibGVUYXAgb3IgUm90YXRlXCJcblx0XG5cdHNob3dFdmVudCA9IChldmVudE5hbWUpIC0+XG5cdFx0ZXZlbnROYW1lTGF5ZXIuaHRtbCA9IGV2ZW50TmFtZVxuXHRcdGV2ZW50TmFtZUxheWVyLmFuaW1hdGVTdG9wKClcblx0XHRldmVudE5hbWVMYXllci5vcGFjaXR5ID0gMVxuXHRcdGV2ZW50TmFtZUxheWVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cblx0ZXZlbnRzVG9MaXN0ZW4gPSBbXG5cdFx0RXZlbnRzLlN3aXBlTGVmdCxcblx0XHRFdmVudHMuU3dpcGVSaWdodCxcblx0XHRFdmVudHMuU3dpcGVVcCxcblx0XHRFdmVudHMuU3dpcGVEb3duLFxuXHRcdEV2ZW50cy5QaW5jaCxcblx0XHRFdmVudHMuUHJlc3MsXG5cdFx0RXZlbnRzLkRvdWJsZVRhcCxcblx0XHRFdmVudHMuUm90YXRlXG5cdF1cblxuXHRmb3IgZXYgaW4gZXZlbnRzVG9MaXN0ZW5cblx0XHRsYXllckEub24gZXYsIChldikgLT5cblx0XHRcdHNob3dFdmVudChldi50eXBlKVxuXG5cdCMgUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgYWZ0ZXIgMTAgc2Vjb25kc1xuXHRVdGlscy5kZWxheSAxMC4wLCAtPlxuXHRcdGZvciBldiBpbiBldmVudHNUb0xpc3RlblxuXHRcdFx0bGF5ZXJBLnJlbW92ZUFsbExpc3RlbmVycygpXG5cdFx0ZXZlbnROYW1lTGF5ZXIuYW5pbWF0ZVN0b3AoKVxuXHRcdGV2ZW50TmFtZUxheWVyLmh0bWwgPSBcIkFsbCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHJlbW92ZWRcIlxuXHRcdGV2ZW50TmFtZUxheWVyLm9wYWNpdHkgPSAxLjBcblx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlJvdGF0ZVwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIllvdSBjYW4gcm90YXRlIHRoaXMgbGF5ZXJcIlxuXHRcdFxuXHQjIFdpdGggZHJhZ2dhYmxlIHRydWUgc29tZSBldmVudHMgYXJlIG1vcmUgZGlmZmljdWx0IHRvIHRyaWdnZXIsIGJ1dCB0aGV5IHdvcmtcblx0aW5pdGlhbFJvdGF0aW9uID0gMFxuXHRsYXllckEub24gRXZlbnRzLlJvdGF0ZVN0YXJ0LCAoZXYpIC0+XG5cdFx0aW5pdGlhbFJvdGF0aW9uID0gbGF5ZXJBLnJvdGF0aW9uXG5cdGxheWVyQS5vbiBFdmVudHMuUm90YXRlRW5kLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHJvdGF0aW9uOiAwO1xuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRsYXllckEuaHRtbCA9IFwiUm90YXRpb246IDAuMFwiXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlJvdGF0ZSwgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlU3RvcCgpXG5cdFx0bGF5ZXJBLnJvdGF0aW9uID0gZXYucm90YXRpb25cblx0XHRsYXllckEuaHRtbCA9IFwiUm90YXRpb246IFwiICsgZXYucm90YXRpb24udG9GaXhlZCgyKVxuXHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiU2Nyb2xsK1JvdGF0ZVwiXG5cdFxuXHRzY3JvbGwgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcInJnYmEoMjU1LDI1NSwyNTUsMC4yKVwiXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAxMjhcblx0XHRzY3JvbGxIb3Jpem9udGFsOiBmYWxzZVxuXHRcdGJvcmRlclJhZGl1czogOFxuXG5cdCMgQWRkIHNwYWNpbmdcblx0c2Nyb2xsLmNvbnRlbnRJbnNldCA9IFxuXHRcdHRvcDogMTBcblx0XHRib3R0b206IDEwXG5cblx0IyBDcmVhdGUgc29tZSBsYXllcnNcblx0Zm9yIGkgaW4gWzAuLjEwXVxuXHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRzdXBlckxheWVyOiBzY3JvbGwuY29udGVudFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdFx0Ym9yZGVyUmFkaXVzOiA0XG5cdFx0XHR3aWR0aDogc2Nyb2xsLmNvbnRlbnQud2lkdGggLSAyMFxuXHRcdFx0aGVpZ2h0OiAxNjBcblx0XHRcdHg6IDEwXG5cdFx0XHR5OiAxNzAgKiBpXG5cdFx0XHRcblx0aW5pdGlhbFJvdGF0aW9uID0gMFxuXHRcblx0c2Nyb2xsLm9uIEV2ZW50cy5Sb3RhdGVTdGFydCwgKGV2KSAtPlxuXHRcdGluaXRpYWxSb3RhdGlvbiA9IHNjcm9sbC5yb3RhdGlvblxuXHRcblx0c2Nyb2xsLm9uIEV2ZW50cy5Sb3RhdGUsIChldikgLT5cblx0XHRzY3JvbGwuYW5pbWF0ZVN0b3AoKVxuXHRcdHNjcm9sbC5yb3RhdGlvbiA9IGV2LnJvdGF0aW9uXG5cdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJTd2lwZVwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlN3aXBlIGluIGFueSBkaXJlY3Rpb25cIlxuXHRtYWluTGF5ZXIucGVyc3BlY3RpdmUgPSAxMjUwXG5cdGxheWVyQS5mb3JjZTJkID0gZmFsc2VcblxuXHRhbmltYXRlQmFjayA9IC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFxuXHRhbmltYXRlTGF5ZXIgPSAobGF5ZXIsIHByb3BlcnRpZXMpIC0+XG5cdFx0YW5pbWF0aW9uQSA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOiBsYXllclxuXHRcdFx0cHJvcGVydGllczogcHJvcGVydGllc1xuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRhbmltYXRpb25BLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIGFuaW1hdGVCYWNrKVxuXHRcdGFuaW1hdGlvbkEuc3RhcnQoKVxuXG5cdGxheWVyQS5vbiBFdmVudHMuU3dpcGVMZWZ0LCAoZXYpIC0+XG5cdFx0YW5pbWF0ZUxheWVyIGxheWVyQSwge3JvdGF0aW9uWTogLTYwfVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5Td2lwZVJpZ2h0LCAoZXYpIC0+XG5cdFx0YW5pbWF0ZUxheWVyIGxheWVyQSwge3JvdGF0aW9uWTogNjB9XG5cdFxuXHRsYXllckEub24gRXZlbnRzLlN3aXBlVXAsIChldikgLT5cblx0XHRhbmltYXRlTGF5ZXIgbGF5ZXJBLCB7cm90YXRpb25YOiA2MH1cblx0XG5cdGxheWVyQS5vbiBFdmVudHMuU3dpcGVEb3duLCAoZXYpIC0+XG5cdFx0YW5pbWF0ZUxheWVyIGxheWVyQSwge3JvdGF0aW9uWDogLTYwfVxuXG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlRhcFwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlRhcCB0byBzY2FsZSB1cCwgZG91YmxlIHRhcCBkb3duXCJcblx0XHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5UYXAsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDEuMFxuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuRG91YmxlVGFwLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAwLjVcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIl19
