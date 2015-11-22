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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZ2VzdHVyZXMtc2FuZGJveC5mcmFtZXIvbW9kdWxlcy9kcmFnZ2FibGVBbmREb3VibGVUYXBMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZ2VzdHVyZXMtc2FuZGJveC5mcmFtZXIvbW9kdWxlcy9uYXZpZ2F0aW9uQ29tcG9uZW50LmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9nZXN0dXJlcy1zYW5kYm94LmZyYW1lci9tb2R1bGVzL3BhbkxheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9nZXN0dXJlcy1zYW5kYm94LmZyYW1lci9tb2R1bGVzL3BpbmNoQW5kUm90YXRlTGF5ZXIuY29mZmVlIiwiL1VzZXJzL2phdmllci9Qcm9ncmFtYWNpb24vZ2l0aHViL2dlc3R1cmVzLXNhbmRib3guZnJhbWVyL21vZHVsZXMvcGluY2hMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aWVyL1Byb2dyYW1hY2lvbi9naXRodWIvZ2VzdHVyZXMtc2FuZGJveC5mcmFtZXIvbW9kdWxlcy9wcmVzc0xheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9nZXN0dXJlcy1zYW5kYm94LmZyYW1lci9tb2R1bGVzL3JlbW92ZUFsbExpc3RlbmVyc0xheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9nZXN0dXJlcy1zYW5kYm94LmZyYW1lci9tb2R1bGVzL3JvdGF0ZUxheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9nZXN0dXJlcy1zYW5kYm94LmZyYW1lci9tb2R1bGVzL3Njcm9sbEFuZFJvdGF0ZUxheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpZXIvUHJvZ3JhbWFjaW9uL2dpdGh1Yi9nZXN0dXJlcy1zYW5kYm94LmZyYW1lci9tb2R1bGVzL3N3aXBlTGF5ZXIuY29mZmVlIiwiL1VzZXJzL2phdmllci9Qcm9ncmFtYWNpb24vZ2l0aHViL2dlc3R1cmVzLXNhbmRib3guZnJhbWVyL21vZHVsZXMvdGFwTGF5ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBTyxDQUFDLFdBQVIsR0FBc0IsU0FBQTtBQUVyQixNQUFBO0VBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtJQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FBZDtJQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFEZjtJQUVBLGVBQUEsRUFBaUIsU0FGakI7R0FEZTtFQUloQixTQUFTLENBQUMsS0FBVixHQUFrQjtFQUdsQixNQUFBLEdBQWEsSUFBQSxLQUFBLENBQ1o7SUFBQSxVQUFBLEVBQVksU0FBWjtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsQ0FBQSxFQUFHLEdBRkg7SUFHQSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBQVYsR0FBa0IsRUFIekI7SUFJQSxNQUFBLEVBQVEsU0FBUyxDQUFDLE1BQVYsR0FBbUIsR0FKM0I7SUFLQSxlQUFBLEVBQWlCLE1BTGpCO0lBTUEsWUFBQSxFQUFjLENBTmQ7R0FEWTtFQVNiLE1BQU0sQ0FBQyxLQUFQLEdBQ0M7SUFBQSxTQUFBLEVBQVcsUUFBWDtJQUNBLFFBQUEsRUFBVSxNQURWO0lBRUEsS0FBQSxFQUFPLE9BRlA7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLFVBQUEsRUFBWSxPQUpaO0lBS0EsVUFBQSxFQUFZLE9BTFo7O0VBT0QsTUFBTSxDQUFDLElBQVAsR0FBYztFQUVkLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBakIsR0FBMkI7RUFFM0IsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsU0FBakIsRUFBNEIsU0FBQyxFQUFEO1dBQzNCLE1B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LFFBQUEsRUFBVSxNQURWO0lBRUEsS0FBQSxFQUFPLE9BRlA7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLFVBQUEsRUFBZSxNQUFNLENBQUMsTUFBUixHQUFlLElBSjdCOztFQU1ELE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFFZCxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxHQUFqQixFQUFzQixTQUFDLEVBQUQ7V0FDckIsTUFBTSxDQUFDLE9BQVAsQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLEtBQUEsRUFBTyxHQUFQO09BREQ7TUFFQSxLQUFBLEVBQU8sb0JBRlA7S0FERDtFQURxQixDQUF0QjtFQU1BLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLFNBQWpCLEVBQTRCLFNBQUMsRUFBRDtXQUMzQixNQUFNLENBQUMsT0FBUCxDQUNDO01BQUEsVUFBQSxFQUNDO1FBQUEsS0FBQSxFQUFPLEdBQVA7T0FERDtNQUVBLEtBQUEsRUFBTyxvQkFGUDtLQUREO0VBRDJCLENBQTVCO0FBTUEsU0FBTztBQXZDYyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiRHJhZ2dhYmxlK0RvdWJsZVRhcFwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiMTAwcHhcIixcblx0XHRwYWRkaW5nVG9wOiBcIjMwMHB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIkRyYWcgdGhlIGxheWVyLCBvciBkb3VibGUgdGFwPGJyLz50byBzY2FsZSB1cCBhbmQgZG93blwiXG5cdFxuXHRsYXllckEuZHJhZ2dhYmxlLmVuYWJsZWQgPSB0cnVlXG5cblx0bGF5ZXJBLm9uIEV2ZW50cy5Eb3VibGVUYXAsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IGlmIGxheWVyQS5zY2FsZSA9PSAwLjUgdGhlbiAxLjAgZWxzZSAwLjVcblx0XHRcdGN1cnZlOiBcImVhc2VcIlxuXHRcdFx0dGltZTogMC41XG5cdFx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiY2xhc3MgZXhwb3J0cy5OYXZpZ2F0aW9uQ29tcG9uZW50IGV4dGVuZHMgTGF5ZXJcblx0XG5cdCNpT1MgYW5pbWF0aW9uIGNvbnN0YW50c1xuXHRfQU5JTUFUSU9OX1RJTUUgXHRcdFx0PSAwLjRcblx0X0FOSU1BVElPTl9DVVJWRSBcdFx0XHQ9IFwiY3ViaWMtYmV6aWVyKC42LCAuMSwgLjMsIDEpXCJcblx0X0xFRlRfUEFERElORyBcdFx0XHRcdD0gaWYgRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlLmluZGV4T2YoXCJpcGhvbmUtNnBsdXNcIikgaXMgLTEgdGhlbiA0NiBlbHNlIDY5XG5cdFxuXHQjQ3VzdG9tIGV2ZW50c1xuXHRFdmVudHMuTmF2aWdhdGlvbldpbGxQdXNoIFx0PSBcIm5hdmlnYXRpb25XaWxsUHVzaFwiXG5cdEV2ZW50cy5OYXZpZ2F0aW9uRGlkUHVzaCBcdD0gXCJuYXZpZ2F0aW9uRGlkUHVzaFwiXG5cdEV2ZW50cy5OYXZpZ2F0aW9uV2lsbFBvcCBcdD0gXCJuYXZpZ2F0aW9uV2lsbFBvcFwiXG5cdEV2ZW50cy5OYXZpZ2F0aW9uRGlkUG9wIFx0PSBcIm5hdmlnYXRpb25EaWRQb3BcIlxuXHRcblx0IyBTaGFyZWQgY2xhc3MgdmFyaWFibGVzXHRcdFxuXHRuYXZpZ2F0aW9uQ29tcG9uZW50c0NvdW50ZXIgPSAxXG5cdFxuXHQjIFB1YmxpYyBjb25zdHJ1Y3RvclxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXG5cdFx0IyBDaGVjayByZXF1aXJlZCBwYXJhbXNcblx0XHRpZiBub3QgQG9wdGlvbnMucm9vdExheWVyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbml0aWFsaXplIE5hdmlnYXRpb25Db21wb25lbnQ6IHBhcmFtZXRlciAncm9vdExheWVyJyBpcyByZXF1aXJlZC5cIilcblx0XHRcdHJldHVyblxuXG5cdFx0QG9wdGlvbnMud2lkdGggICAgICAgICAgID89IFNjcmVlbi53aWR0aFxuXHRcdEBvcHRpb25zLmhlaWdodCAgICAgICAgICA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0QG9wdGlvbnMuY2xpcCAgICAgICAgICAgID89IHRydWVcblx0XHRAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJ0cmFuc3BhcmVudFwiXG5cdFx0QG9wdGlvbnMubmFtZSBcdFx0XHQgPz0gXCJOYXZpZ2F0aW9uIENvbXBvbmVudCBcIiArIG5hdmlnYXRpb25Db21wb25lbnRzQ291bnRlclxuXG5cdFx0c3VwZXIgQG9wdGlvbnNcblx0XHRcblx0XHRuYXZpZ2F0aW9uQ29tcG9uZW50c0NvdW50ZXIrK1xuXG5cdFx0QG5hdmlnYXRpb25MYXllcnMgICA9IFtdXG5cdFx0QGhlYWRlckxheWVyIFx0XHQ9IG51bGxcblx0XHRAYW5pbWF0aW9uVGltZSBcdFx0PSBAb3B0aW9ucy5hbmltYXRpb25UaW1lIG9yIF9BTklNQVRJT05fVElNRVxuXHRcdEBhbmltYXRpb25DdXJ2ZVx0XHQ9IEBvcHRpb25zLmFuaW1hdGlvbkN1cnZlIG9yIF9BTklNQVRJT05fQ1VSVkVcblx0XHRAYW5pbWF0aW9uUHVzaCBcdFx0PSBAb3B0aW9ucy5hbmltYXRpb25QdXNoIG9yIEBfZGVmYXVsdEFuaW1hdGlvblB1c2hcblx0XHRAYW5pbWF0aW9uUG9wXHRcdD0gQG9wdGlvbnMuYW5pbWF0aW9uUG9wIG9yIEBfZGVmYXVsdEFuaW1hdGlvblBvcFxuXHRcdEBjdXJyZW50TGF5ZXJJbmRleCBcdD0gLTFcblx0XHRAbG9jayBcdFx0XHRcdD0gZmFsc2Vcblx0XHRAY3VzdG9tSGVhZGVyIFx0XHQ9IGZhbHNlXG5cdFx0XG5cdFx0aWYgQG9wdGlvbnMuaGVhZGVyTGF5ZXJcblx0XHRcdEBoZWFkZXJMYXllciA9IEBvcHRpb25zLmhlYWRlckxheWVyXG5cdFx0XHRAYWRkU3ViTGF5ZXIoQGhlYWRlckxheWVyKVxuXHRcdFx0QGN1c3RvbUhlYWRlciA9IHRydWVcblx0XHRlbHNlICMgRGVmYXVsdCBpT1M3IGhlYWRlclxuXHRcdFx0QGhlYWRlckxheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdHN1cGVyTGF5ZXI6IEBcblx0XHRcdFx0bmFtZTogXCJIZWFkZXIgTGF5ZXJcIlxuXHRcdFx0XHR3aWR0aDogQHdpZHRoXG5cdFx0XHRcdGhlaWdodDogODhcblx0XHRcdFx0Y2xpcDogZmFsc2Vcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInJnYmEoMjQ4LCAyNDgsIDI0OCwgMC45KVwiXG5cdFx0XHRAaGVhZGVyTGF5ZXIuc3R5bGVbXCJiYWNrZ3JvdW5kLWltYWdlXCJdID0gXCJsaW5lYXItZ3JhZGllbnQoMGRlZywgcmdiKDIwMCwgMTk5LCAyMDQpLCByZ2IoMjAwLCAxOTksIDIwNCkgNTAlLCB0cmFuc3BhcmVudCA1MCUpXCJcblx0XHRcdEBoZWFkZXJMYXllci5zdHlsZVtcImJhY2tncm91bmQtc2l6ZVwiXSA9IFwiMTAwJSAxcHhcIlxuXHRcdFx0QGhlYWRlckxheWVyLnN0eWxlW1wiYmFja2dyb3VuZC1yZXBlYXRcIl0gPSBcIm5vLXJlcGVhdFwiXG5cdFx0XHRAaGVhZGVyTGF5ZXIuc3R5bGVbXCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCJdID0gXCJib3R0b21cIlxuXHRcdFx0XG5cdFx0XHR0aXRsZUxheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdHN1cGVyTGF5ZXI6IEBoZWFkZXJMYXllclxuXHRcdFx0XHRuYW1lOiBcIlRpdGxlIExheWVyXCJcblx0XHRcdFx0d2lkdGg6IEBoZWFkZXJMYXllci53aWR0aCAvIDJcblx0XHRcdFx0aGVpZ2h0OiBAaGVhZGVyTGF5ZXIuaGVpZ2h0XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0dGl0bGVMYXllci5jZW50ZXJYKClcblx0XHRcdHRpdGxlTGF5ZXIuc3R5bGUgPVxuXHRcdFx0XHRcImZvbnQtc2l6ZVwiIDogXCIzNHB4XCJcblx0XHRcdFx0XCJjb2xvclwiIDogXCJibGFja1wiXG5cdFx0XHRcdFwibGluZS1oZWlnaHRcIiA6IEBoZWFkZXJMYXllci5oZWlnaHQgKyBcInB4XCJcblx0XHRcdFx0XCJmb250LXdlaWdodFwiIDogXCI1MDBcIlxuXHRcdFx0XHRcInRleHQtYWxpZ25cIiA6IFwiY2VudGVyXCJcblx0XHRcdFx0XCJmb250LWZhbWlseVwiOiBcIidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWZcIlxuXHRcdFx0XHRcIndoaXRlLXNwYWNlXCI6IFwibm93cmFwXCJcblx0XHRcdFx0XCJoZWlnaHRcIiA6IEBoZWFkZXJMYXllci5oZWlnaHQgKyBcInB4XCJcblxuXHRcdFx0bGVmdExheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdHN1cGVyTGF5ZXI6IEBoZWFkZXJMYXllclxuXHRcdFx0XHRuYW1lOiBcIkxlZnQgTGF5ZXJcIlxuXHRcdFx0XHR3aWR0aDogMTQwXG5cdFx0XHRcdGhlaWdodDogQGhlYWRlckxheWVyLmhlaWdodFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHR4OiBfTEVGVF9QQURESU5HXG5cdFx0XHRsZWZ0TGF5ZXIuc3R5bGUgPVxuXHRcdFx0XHRcImZvbnQtc2l6ZVwiIDogXCIzNHB4XCJcblx0XHRcdFx0XCJjb2xvclwiIDogXCJyZ2IoMjEsIDEyNSwgMjUxKVwiXG5cdFx0XHRcdFwibGluZS1oZWlnaHRcIiA6IEBoZWFkZXJMYXllci5oZWlnaHQgKyBcInB4XCJcblx0XHRcdFx0XCJmb250LXdlaWdodFwiIDogXCIzMDBcIlxuXHRcdFx0XHRcInRleHQtYWxpZ25cIiA6IFwibGVmdFwiXG5cdFx0XHRcdFwiZm9udC1mYW1pbHlcIjogXCInSGVsdmV0aWNhIE5ldWUnLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmXCJcblx0XHRcdFx0XCJ3aGl0ZS1zcGFjZVwiOiBcIm5vd3JhcFwiXG5cdFx0XHRcdFwiaGVpZ2h0XCIgOiBAaGVhZGVyTGF5ZXIuaGVpZ2h0ICsgXCJweFwiXG5cdFx0XHRsZWZ0TGF5ZXIub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0XHRAcG9wKClcblxuXHRcdFx0YmFja0Fycm93ID0gbmV3IExheWVyXG5cdFx0XHRcdHN1cGVyTGF5ZXI6IEBoZWFkZXJMYXllclxuXHRcdFx0XHRuYW1lOiBcIkJhY2sgQXJyb3dcIlxuXHRcdFx0XHRvcmlnaW5YOiAwXG5cdFx0XHRcdG9yaWdpblk6IDBcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0aHRtbDogXCI8c3ZnIHZlcnNpb249JzEuMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycgeD0nMHB4JyB5PScwcHgnIHdpZHRoPSc0NnB4JyBoZWlnaHQ9Jzg4cHgnIHZpZXdCb3g9JzAgMCA0NiA4OCcgZW5hYmxlLWJhY2tncm91bmQ9J25ldyAwIDAgNDYgODgnIHhtbDpzcGFjZT0ncHJlc2VydmUnPiA8cG9seWdvbiBmaWxsPScjMTU3REZCJyBwb2ludHM9JzM2LjUxLDY0LjUxIDQwLjYxLDYwLjQgMjQuMiw0NCA0MC42MSwyNy41OSAzNi41MSwyMy40OSAyMC4xLDM5LjkgMTYsNDQgMjAuMSw0OC4xIDIwLjEsNDguMSAnLz4gPC9zdmc+XCJcblx0XHRcdGJhY2tBcnJvdy5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdEBwb3AoKVxuXHRcdFx0XG5cdFx0XHRAaGVhZGVyTGF5ZXIudGl0bGVMYXllciA9IHRpdGxlTGF5ZXJcblx0XHRcdEBoZWFkZXJMYXllci5iYWNrQXJyb3cgPSBiYWNrQXJyb3dcblx0XHRcdEBoZWFkZXJMYXllci5sZWZ0TGF5ZXIgPSBsZWZ0TGF5ZXJcblx0XHRcdFxuXHRcdFx0aWYgRnJhbWVyLkRldmljZS5kZXZpY2VUeXBlLmluZGV4T2YoXCJpcGhvbmUtNnBsdXNcIikgPj0gMFxuXHRcdFx0XHRAaGVhZGVyTGF5ZXIuaGVpZ2h0ID0gMTMyXG5cdFx0XHRcdHRpdGxlTGF5ZXIuaGVpZ2h0ID0gMTMyXG5cdFx0XHRcdHRpdGxlTGF5ZXIuc3R5bGVbXCJmb250LXNpemVcIl0gPSBcIjQ4cHhcIlxuXHRcdFx0XHR0aXRsZUxheWVyLnN0eWxlW1wibGluZS1oZWlnaHRcIl0gPSB0aXRsZUxheWVyLmhlaWdodCArIFwicHhcIlxuXHRcdFx0XHRsZWZ0TGF5ZXIuaGVpZ2h0ID0gMTMyXG5cdFx0XHRcdGxlZnRMYXllci5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiNDhweFwiXG5cdFx0XHRcdGxlZnRMYXllci5zdHlsZVtcImxpbmUtaGVpZ2h0XCJdID0gdGl0bGVMYXllci5oZWlnaHQgKyBcInB4XCJcblx0XHRcdFx0bGVmdExheWVyLndpZHRoID0gbGVmdExheWVyLndpZHRoICogMS41XG5cdFx0XHRcdGJhY2tBcnJvdy5zY2FsZSA9IDEuNVxuXHRcdFx0XHRcblx0XHRpZiBAb3B0aW9ucy5yb290TGF5ZXJcblx0XHRcdEBuYXZpZ2F0aW9uTGF5ZXJzID0gW0BvcHRpb25zLnJvb3RMYXllcl1cblx0XHRcdEBjdXJyZW50TGF5ZXJJbmRleCA9IDBcblx0XHRcdEBhZGRTdWJMYXllcihAb3B0aW9ucy5yb290TGF5ZXIpXG5cdFx0XHRAaGVhZGVyTGF5ZXIuYnJpbmdUb0Zyb250KClcblx0XHRcdGlmIEBvcHRpb25zLnJvb3RMYXllci50aXRsZSBhbmQgQGhlYWRlckxheWVyLnRpdGxlTGF5ZXJcblx0XHRcdFx0QGhlYWRlckxheWVyLnRpdGxlTGF5ZXIuaHRtbCA9IFwiPGRpdiBzdHlsZT1cXFwib3ZlcmZsb3c6IGhpZGRlbjsgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXNcXFwiPlwiICsgQG9wdGlvbnMucm9vdExheWVyLnRpdGxlICsgXCI8L2Rpdj5cIlxuXG5cdCMgUHVibGljIG1ldGhvZHNcblx0cHVzaDogKGxheWVyKSAtPlxuXHRcdGlmIG5vdCBAbG9ja1xuXHRcdFx0QGVtaXQoRXZlbnRzLk5hdmlnYXRpb25XaWxsUHVzaCwge25hdmlnYXRpb25MYXllcjogQCwgY3VycmVudExheWVyOiBjdXJyZW50TGF5ZXIsIG5leHRMYXllcjogbmV4dExheWVyfSlcblx0XHRcdEBsb2NrID0gdHJ1ZVxuXHRcdFx0QG5hdmlnYXRpb25MYXllcnMucHVzaChsYXllcilcblx0XHRcdEBhZGRTdWJMYXllcihsYXllcilcblx0XHRcdGlmIEBoZWFkZXJMYXllclxuXHRcdFx0XHRAaGVhZGVyTGF5ZXIuYnJpbmdUb0Zyb250KClcblx0XHRcdGN1cnJlbnRMYXllciA9IEBuYXZpZ2F0aW9uTGF5ZXJzW0BjdXJyZW50TGF5ZXJJbmRleF1cblx0XHRcdG5leHRMYXllciA9IGxheWVyXG5cdFx0XHRpZiB0eXBlb2YgY3VycmVudExheWVyLmxheWVyV2lsbERpc2FwcGVhciBpcyBcImZ1bmN0aW9uXCJcblx0XHRcdFx0Y3VycmVudExheWVyLmxheWVyV2lsbERpc2FwcGVhcigpXG5cdFx0XHRpZiB0eXBlb2YgbmV4dExheWVyLmxheWVyV2lsbEFwcGVhciBpcyBcImZ1bmN0aW9uXCJcblx0XHRcdFx0bmV4dExheWVyLmxheWVyV2lsbEFwcGVhcigpXG5cdFx0XHRAY3VycmVudExheWVySW5kZXgrK1xuXHRcdFx0QGFuaW1hdGlvblB1c2goY3VycmVudExheWVyLCBuZXh0TGF5ZXIpXG5cdFx0XHRAX2RlZmF1bHRIZWFkZXJBbmltYXRpb25QdXNoKGN1cnJlbnRMYXllciwgbmV4dExheWVyKVxuXHRcdFx0VXRpbHMuZGVsYXkgQGFuaW1hdGlvblRpbWUsID0+XG5cdFx0XHRcdGN1cnJlbnRMYXllci52aXNpYmxlID0gZmFsc2Vcblx0XHRcdFx0QGxvY2sgPSBmYWxzZVxuXHRcdFx0XHRAZW1pdChFdmVudHMuTmF2aWdhdGlvbkRpZFB1c2gsIHtuYXZpZ2F0aW9uTGF5ZXI6IEAsIGN1cnJlbnRMYXllcjogY3VycmVudExheWVyLCBuZXh0TGF5ZXI6IG5leHRMYXllcn0pXG5cdFx0ZWxzZVxuXHRcdFx0IyBJZiB0aGVyZSB3YXMgYSB0cmFuc2l0aW9uaW5nIGdvaW5nIG9uLCBqdXN0IHJlbW92ZSB0aGUgbmV3IGxheWVyXG5cdFx0XHRsYXllci5kZXN0cm95KClcblx0XHRcblx0cG9wOiAtPlxuXHRcdEBwb3BUb0xheWVyQXRJbmRleChAY3VycmVudExheWVySW5kZXggLSAxKVxuXG5cdHBvcFRvUm9vdExheWVyOiAtPlxuXHRcdEBwb3BUb0xheWVyQXRJbmRleCgwKVxuXG5cdHBvcFRvTGF5ZXJBdEluZGV4OiAoaW5kZXgpIC0+XG5cdFx0aWYgbm90IEBsb2NrXG5cdFx0XHRAbG9jayA9IHRydWVcblx0XHRcdGlmIEBjdXJyZW50TGF5ZXJJbmRleCA+IDAgYW5kICgwIDw9IGluZGV4IDw9IEBuYXZpZ2F0aW9uTGF5ZXJzLmxlbmd0aClcblx0XHRcdFx0QGVtaXQoRXZlbnRzLk5hdmlnYXRpb25XaWxsUG9wLCB7bmF2aWdhdGlvbkxheWVyOiBALCBpbmRleDogaW5kZXgsIGN1cnJlbnRMYXllcjogY3VycmVudExheWVyLCBuZXh0TGF5ZXI6IG5leHRMYXllcn0pXG5cdFx0XHRcdGN1cnJlbnRMYXllciA9IEBuYXZpZ2F0aW9uTGF5ZXJzW0BjdXJyZW50TGF5ZXJJbmRleF1cblx0XHRcdFx0bmV4dExheWVyID0gQG5hdmlnYXRpb25MYXllcnNbaW5kZXhdXG5cdFx0XHRcdG5leHRMYXllci52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0XHRpZiB0eXBlb2YgY3VycmVudExheWVyLmxheWVyV2lsbERpc2FwcGVhciBpcyBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRjdXJyZW50TGF5ZXIubGF5ZXJXaWxsRGlzYXBwZWFyKClcblx0XHRcdFx0aWYgdHlwZW9mIG5leHRMYXllci5sYXllcldpbGxBcHBlYXIgaXMgXCJmdW5jdGlvblwiXG5cdFx0XHRcdFx0bmV4dExheWVyLmxheWVyV2lsbEFwcGVhcigpXG5cdFx0XHRcdEBhbmltYXRpb25Qb3AoY3VycmVudExheWVyLCBuZXh0TGF5ZXIpXG5cdFx0XHRcdEBfZGVmYXVsdEhlYWRlckFuaW1hdGlvblBvcChjdXJyZW50TGF5ZXIsIG5leHRMYXllciwgaW5kZXgpXG5cdFx0XHRcdFV0aWxzLmRlbGF5IEBhbmltYXRpb25UaW1lLCA9PlxuXHRcdFx0XHRcdGZvciBpbmRleFRvQmVEZWxldGVkIGluIFtAbmF2aWdhdGlvbkxheWVycy5sZW5ndGgtMS4uaW5kZXgrMV1cblx0XHRcdFx0XHRcdGxheWVyVG9CZURlbGV0ZWQgPSBAbmF2aWdhdGlvbkxheWVyc1tpbmRleFRvQmVEZWxldGVkXVxuXHRcdFx0XHRcdFx0bGF5ZXJUb0JlRGVsZXRlZC5kZXN0cm95KClcblx0XHRcdFx0XHRcdEBuYXZpZ2F0aW9uTGF5ZXJzLnBvcCgpXG5cdFx0XHRcdFx0QGN1cnJlbnRMYXllckluZGV4ID0gaW5kZXhcblx0XHRcdFx0XHRAbG9jayA9IGZhbHNlXG5cdFx0XHRcdFx0QGVtaXQoRXZlbnRzLk5hdmlnYXRpb25EaWRQb3AsIHtuYXZpZ2F0aW9uTGF5ZXI6IEAsIGluZGV4OiBpbmRleCwgY3VycmVudExheWVyOiBjdXJyZW50TGF5ZXIsIG5leHRMYXllcjogbmV4dExheWVyfSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0QGxvY2sgPSBmYWxzZVxuXG5cdCMgUHJpdmF0ZSBtZXRob2RzXG5cblx0X2FuaW1hdGVIZWFkZXJTdWJMYXllcjogKHN1YkxheWVyTmFtZSwgZnJvbUxheWVyLCB0b0xheWVyLCBuZXdUaXRsZSwgY3VycmVudFRvWCwgbmV3RnJvbVgpIC0+XG5cdFx0aWYgQGhlYWRlckxheWVyW3N1YkxheWVyTmFtZV1cblx0XHRcdGhlYWRlclN1YkxheWVyID0gQGhlYWRlckxheWVyW3N1YkxheWVyTmFtZV1cblx0XHRcdG9yaWdTdWJMYXllclggPSBoZWFkZXJTdWJMYXllci54XG5cdFx0XHRcdFxuXHRcdFx0IyBBbmltYXRlIGN1cnJlbnQgc3VibGF5ZXJcblx0XHRcdGhlYWRlclN1YkxheWVyLmFuaW1hdGVcblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdFx0eDogY3VycmVudFRvWFxuXHRcdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHRcdFxuXHRcdFx0I0NyZWF0ZSBuZXcgbGF5ZXIgdG8gYW5pbWF0ZVxuXHRcdFx0aWYgbmV3VGl0bGUgaXNudCB1bmRlZmluZWRcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXIgPSBoZWFkZXJTdWJMYXllci5jb3B5KClcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXIuc3R5bGUgPSBoZWFkZXJTdWJMYXllci5zdHlsZVxuXHRcdFx0XHRAaGVhZGVyTGF5ZXIuYWRkU3ViTGF5ZXIobmV3SGVhZGVyU3ViTGF5ZXIpXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyLm5hbWUgPSBcInRtcCBcIiArIHN1YkxheWVyTmFtZVxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllci54ID0gbmV3RnJvbVhcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXIub3BhY2l0eSA9IDBcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXIuaHRtbCA9IFwiPGRpdiBzdHlsZT1cXFwib3ZlcmZsb3c6IGhpZGRlbjsgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXNcXFwiPlwiICsgbmV3VGl0bGUgKyBcIjwvZGl2PlwiXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0XHRcdGxheWVyOiBuZXdIZWFkZXJTdWJMYXllclxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdFx0XHR4OiBvcmlnU3ViTGF5ZXJYXG5cdFx0XHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXJBbmltYXRpb24uc3RhcnQoKVxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllckFuaW1hdGlvbi5vbiBcImVuZFwiLCAtPlxuXHRcdFx0XHRcdGhlYWRlclN1YkxheWVyLmh0bWwgPSBuZXdIZWFkZXJTdWJMYXllci5odG1sXG5cdFx0XHRcdFx0aGVhZGVyU3ViTGF5ZXIub3BhY2l0eSA9IDFcblx0XHRcdFx0XHRoZWFkZXJTdWJMYXllci54ID0gb3JpZ1N1YkxheWVyWFxuXHRcdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyLmRlc3Ryb3koKVxuXG5cdF9kZWZhdWx0SGVhZGVyQW5pbWF0aW9uUHVzaDogKGZyb21MYXllciwgdG9MYXllciktPlxuXHRcdGlmIEBoZWFkZXJMYXllciBhbmQgbm90IEBjdXN0b21IZWFkZXJcblx0XHRcdFxuXHRcdFx0QF9hbmltYXRlSGVhZGVyU3ViTGF5ZXIoXCJ0aXRsZUxheWVyXCIsIGZyb21MYXllciwgdG9MYXllciwgdG9MYXllci50aXRsZSwgLV9MRUZUX1BBRERJTkcsIEBoZWFkZXJMYXllci53aWR0aClcblxuXHRcdFx0QF9hbmltYXRlSGVhZGVyU3ViTGF5ZXIoXCJsZWZ0TGF5ZXJcIiwgZnJvbUxheWVyLCB0b0xheWVyLCBmcm9tTGF5ZXIudGl0bGUsIC0gQGhlYWRlckxheWVyLndpZHRoIC8gMiwgQGhlYWRlckxheWVyLndpZHRoIC8gMilcblxuXHRcdFx0aWYgQGhlYWRlckxheWVyLmJhY2tBcnJvd1xuXHRcdFx0XHRAaGVhZGVyTGF5ZXIuYmFja0Fycm93LmFuaW1hdGVcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cblx0X2RlZmF1bHRIZWFkZXJBbmltYXRpb25Qb3A6IChmcm9tTGF5ZXIsIHRvTGF5ZXIsIGluZGV4KS0+XG5cdFx0I0FuaW1hdGUgaGVhZGVyXG5cdFx0aWYgQGhlYWRlckxheWVyIGFuZCBub3QgQGN1c3RvbUhlYWRlclxuXG5cdFx0XHRAX2FuaW1hdGVIZWFkZXJTdWJMYXllcihcInRpdGxlTGF5ZXJcIiwgZnJvbUxheWVyLCB0b0xheWVyLCB0b0xheWVyLnRpdGxlLCBAaGVhZGVyTGF5ZXIud2lkdGgsIDApXG5cdFx0XHRcblx0XHRcdG5ld0xlZnRMYXllclRpdGxlID0gXCJcIlxuXHRcdFx0aWYgQG5hdmlnYXRpb25MYXllcnNbaW5kZXggLSAxXSBhbmQgQG5hdmlnYXRpb25MYXllcnNbaW5kZXggLSAxXS50aXRsZVxuXHRcdFx0XHRuZXdMZWZ0TGF5ZXJUaXRsZSA9IEBuYXZpZ2F0aW9uTGF5ZXJzW2luZGV4IC0gMV0udGl0bGVcblx0XHRcdGVsc2UgXG5cdFx0XHRcdGlmIEBoZWFkZXJMYXllci5iYWNrQXJyb3dcblx0XHRcdFx0XHRAaGVhZGVyTGF5ZXIuYmFja0Fycm93LmFuaW1hdGVcblx0XHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHRcdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHRcdEBfYW5pbWF0ZUhlYWRlclN1YkxheWVyKFwibGVmdExheWVyXCIsIGZyb21MYXllciwgdG9MYXllciwgbmV3TGVmdExheWVyVGl0bGUsIEBoZWFkZXJMYXllci53aWR0aCAvIDIsIC1AaGVhZGVyTGF5ZXIud2lkdGggLyAyKVxuXHRcdFx0XG5cblx0X2RlZmF1bHRBbmltYXRpb25QdXNoOiAoZnJvbUxheWVyLCB0b0xheWVyKSAtPlxuXHRcdHNoYWRvd0xheWVyID0gbmV3IExheWVyXG5cdFx0XHRzdXBlckxheWVyOiBmcm9tTGF5ZXJcblx0XHRcdHdpZHRoOiBmcm9tTGF5ZXIud2lkdGhcblx0XHRcdGhlaWdodDogZnJvbUxheWVyLmhlaWdodFxuXHRcdFx0bmFtZTogXCJzaGFkb3dMYXllclwiXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiYmxhY2tcIlxuXHRcdFx0b3BhY2l0eTogMFxuXHRcdHNoYWRvd0xheWVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDAuMlxuXHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdGZyb21MYXllci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAtQHdpZHRoICogMC4yNVxuXHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdHRvTGF5ZXIuc2hhZG93Q29sb3IgPSBcInJnYmEoMCwwLDAsMC4yKVwiXG5cdFx0dG9MYXllci5zaGFkb3dYID0gLTEwXG5cdFx0dG9MYXllci5zaGFkb3dCbHVyID0gMTRcblx0XHR0b0xheWVyLnggPSBAd2lkdGggKyAoLXRvTGF5ZXIuc2hhZG93WClcblx0XHR0b0xheWVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IDBcblx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblxuXHRcdFx0XG5cdF9kZWZhdWx0QW5pbWF0aW9uUG9wOiAoZnJvbUxheWVyLCB0b0xheWVyKSAtPlxuXHRcdGZyb21MYXllci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiBAd2lkdGggKyAoLWZyb21MYXllci5zaGFkb3dYKVxuXHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdHRvTGF5ZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogMFxuXHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdHNoYWRvd0xheWVyID0gdG9MYXllci5zdWJMYXllcnNCeU5hbWUoXCJzaGFkb3dMYXllclwiKVswXVxuXHRcdHNoYWRvd0xheWVyQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6IHNoYWRvd0xheWVyXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0c2hhZG93TGF5ZXJBbmltYXRpb24uc3RhcnQoKVxuXHRcdHNoYWRvd0xheWVyQW5pbWF0aW9uLm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRzaGFkb3dMYXllci5kZXN0cm95KClcblx0XHQiLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiUGFuXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdHBhbkRpcmVjdGlvbiA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiAxODBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRwYW5EaXJlY3Rpb24uc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIjg1cHhcIlxuXHRcdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDMwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDMyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlBhbiBpbiBhbnkgZGlyZWN0aW9uXCJcblx0XG5cdGdldFBhcmFtcyA9IChldikgLT5cblx0XHRyZXR1cm4gXCIsIERpc3Q6XCIgKyBldi5kaXN0YW5jZS50b0ZpeGVkKDIpICsgXCJweCwgVmVsOlwiICsgZXYudmVsb2NpdHkudG9GaXhlZCgyKSArIFwicHgvc2VjPGJyLz5UaW1lOlwiICsgZXYuZGVsdGFUaW1lLnRvRml4ZWQoMikgKyBcInNlY1wiXG5cblx0bGF5ZXJBLm9uIEV2ZW50cy5QYW5MZWZ0LCAoZXYpIC0+XG5cdFx0cGFuRGlyZWN0aW9uLmh0bWwgPSBcIkxlZnRcIiArIGdldFBhcmFtcyhldilcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUGFuUmlnaHQsIChldikgLT5cblx0XHRwYW5EaXJlY3Rpb24uaHRtbCA9IFwiUmlnaHRcIiArIGdldFBhcmFtcyhldilcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUGFuVXAsIChldikgLT5cblx0XHRwYW5EaXJlY3Rpb24uaHRtbCA9IFwiVXBcIiArIGdldFBhcmFtcyhldilcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUGFuRG93biwgKGV2KSAtPlxuXHRcdHBhbkRpcmVjdGlvbi5odG1sID0gXCJEb3duXCIgKyBnZXRQYXJhbXMoZXYpXG5cdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJQaW5jaCtSb3RhdGVcIlxuXHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAxMjhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRsYXllckEuc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIiN7bGF5ZXJBLmhlaWdodH1weFwiXG5cdFx0XG5cdGxheWVyQS5odG1sID0gXCJQaW5jaCBhbmQgcm90YXRlIHRoaXMgbGF5ZXJcIlxuXG5cdHBpbmNoUm90YXRlRW5kID0gKGV2KSAtPlxuXHRcdHNjYWxlID0gZXYuc2NhbGVcblx0XHRpZiBsYXllckEuc2NhbGUgPCAxXG5cdFx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFx0XHRzY2FsZSA9IDFcblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0cm90YXRpb246IDA7XG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXHRcdGxheWVyQS5odG1sID0gXCJTY2FsZTogXCIgKyBzY2FsZS50b0ZpeGVkKDIpICsgXCIsIFJvdDogMC4wXCJcblxuXHRcdFxuXHRpbml0aWFsU2NhbGUgPSAxXG5cdGluaXRpYWxSb3RhdGlvbiA9IDBcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUGluY2hTdGFydCwgKGV2KSAtPlxuXHRcdGluaXRpYWxTY2FsZSA9IGxheWVyQS5zY2FsZVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5Sb3RhdGVTdGFydCwgKGV2KSAtPlxuXHRcdGluaXRpYWxSb3RhdGlvbiA9IGxheWVyQS5yb3RhdGlvblxuXG5cdGxheWVyQS5vbiBFdmVudHMuUGluY2gsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVN0b3AoKVxuXHRcdGxheWVyQS5zY2FsZSA9IGV2LnNjYWxlKmluaXRpYWxTY2FsZVxuXHRcdGxheWVyQS5odG1sID0gXCJTY2FsZTogXCIgKyBldi5zY2FsZS50b0ZpeGVkKDIpICsgXCIsIFJvdDogXCIgKyBsYXllckEucm90YXRpb24udG9GaXhlZCgyKVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5Sb3RhdGUsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVN0b3AoKVxuXHRcdGxheWVyQS5yb3RhdGlvbiA9IGV2LnJvdGF0aW9uXG5cdFx0bGF5ZXJBLmh0bWwgPSBcIlNjYWxlOiBcIiArIGxheWVyQS5zY2FsZS50b0ZpeGVkKDIpICsgXCIsIFJvdDogXCIgKyBldi5yb3RhdGlvbi50b0ZpeGVkKDIpXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlBpbmNoRW5kLCAoZXYpIC0+XG5cdFx0cGluY2hSb3RhdGVFbmQoZXYpXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlJvdGF0ZUVuZCwgKGV2KSAtPlxuXHRcdHBpbmNoUm90YXRlRW5kKGV2KVxuXHRcblx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlBpbmNoXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMTI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiUGluY2ggb3ZlciB0aGlzIGxheWVyXCJcblx0XHRcblx0IyBXaXRoIGRyYWdnYWJsZSB0cnVlIHNvbWUgZXZlbnRzIGFyZSBtb3JlIGRpZmZpY3VsdCB0byB0cmlnZ2VyLCBidXQgdGhleSB3b3JrXG5cdGluaXRpYWxTY2FsZSA9IDFcblx0bGF5ZXJBLm9uIEV2ZW50cy5QaW5jaFN0YXJ0LCAoZXYpIC0+XG5cdFx0aW5pdGlhbFNjYWxlID0gbGF5ZXJBLnNjYWxlXG5cdGxheWVyQS5vbiBFdmVudHMuUGluY2hFbmQsIChldikgLT5cblx0XHRpZiBsYXllckEuc2NhbGUgPCAxXG5cdFx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFx0XHRsYXllckEuaHRtbCA9IFwiU2NhbGU6IDEuMFwiXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlBpbmNoLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVTdG9wKClcblx0XHRsYXllckEuc2NhbGUgPSBldi5zY2FsZSppbml0aWFsU2NhbGVcblx0XHRsYXllckEuaHRtbCA9IFwiU2NhbGU6IFwiICsgZXYuc2NhbGUudG9GaXhlZCgyKVxuXHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiTG9uZyBwcmVzc1wiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIkxvbmcgcHJlc3Mgb24gdGhpcyBsYXllclwiXG5cdFx0XG5cdGxheWVyQS5vbiBFdmVudHMuUHJlc3MsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IGlmIGxheWVyQS5zY2FsZSA9PSAwLjUgdGhlbiAxLjAgZWxzZSAwLjVcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJSZW1vdmUgYWxsIGxpc3RlbmVyc1wiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRldmVudE5hbWVMYXllciA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiAxODBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRldmVudE5hbWVMYXllci5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiODVweFwiXG5cblx0ZXZlbnROYW1lTGF5ZXIuaHRtbCA9IFwiQWxsIGxpc3RlbmVycyB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgMTBzXCJcblxuXHRcdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDMwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDMyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlN3aXBlLCBQaW5jaCwgUHJlc3MsIERvdWJsZVRhcCBvciBSb3RhdGVcIlxuXHRcblx0c2hvd0V2ZW50ID0gKGV2ZW50TmFtZSkgLT5cblx0XHRldmVudE5hbWVMYXllci5odG1sID0gZXZlbnROYW1lXG5cdFx0ZXZlbnROYW1lTGF5ZXIuYW5pbWF0ZVN0b3AoKVxuXHRcdGV2ZW50TmFtZUxheWVyLm9wYWNpdHkgPSAxXG5cdFx0ZXZlbnROYW1lTGF5ZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblxuXHRldmVudHNUb0xpc3RlbiA9IFtcblx0XHRFdmVudHMuU3dpcGVMZWZ0LFxuXHRcdEV2ZW50cy5Td2lwZVJpZ2h0LFxuXHRcdEV2ZW50cy5Td2lwZVVwLFxuXHRcdEV2ZW50cy5Td2lwZURvd24sXG5cdFx0RXZlbnRzLlBpbmNoLFxuXHRcdEV2ZW50cy5QcmVzcyxcblx0XHRFdmVudHMuRG91YmxlVGFwLFxuXHRcdEV2ZW50cy5Sb3RhdGVcblx0XVxuXG5cdGZvciBldiBpbiBldmVudHNUb0xpc3RlblxuXHRcdGxheWVyQS5vbiBldiwgKGV2KSAtPlxuXHRcdFx0c2hvd0V2ZW50KGV2LnR5cGUpXG5cblx0IyBSZW1vdmUgYWxsIGxpc3RlbmVycyBhZnRlciAxMCBzZWNvbmRzXG5cdFV0aWxzLmRlbGF5IDEwLjAsIC0+XG5cdFx0Zm9yIGV2IGluIGV2ZW50c1RvTGlzdGVuXG5cdFx0XHRsYXllckEucmVtb3ZlQWxsTGlzdGVuZXJzKClcblx0XHRldmVudE5hbWVMYXllci5hbmltYXRlU3RvcCgpXG5cdFx0ZXZlbnROYW1lTGF5ZXIuaHRtbCA9IFwiQWxsIGxpc3RlbmVycyBoYXZlIGJlZW4gcmVtb3ZlZFwiXG5cdFx0ZXZlbnROYW1lTGF5ZXIub3BhY2l0eSA9IDEuMFxuXHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiUm90YXRlXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMTI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiWW91IGNhbiByb3RhdGUgdGhpcyBsYXllclwiXG5cdFx0XG5cdCMgV2l0aCBkcmFnZ2FibGUgdHJ1ZSBzb21lIGV2ZW50cyBhcmUgbW9yZSBkaWZmaWN1bHQgdG8gdHJpZ2dlciwgYnV0IHRoZXkgd29ya1xuXHRpbml0aWFsUm90YXRpb24gPSAwXG5cdGxheWVyQS5vbiBFdmVudHMuUm90YXRlU3RhcnQsIChldikgLT5cblx0XHRpbml0aWFsUm90YXRpb24gPSBsYXllckEucm90YXRpb25cblx0bGF5ZXJBLm9uIEV2ZW50cy5Sb3RhdGVFbmQsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0cm90YXRpb246IDA7XG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXHRcdGxheWVyQS5odG1sID0gXCJSb3RhdGlvbjogMC4wXCJcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUm90YXRlLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVTdG9wKClcblx0XHRsYXllckEucm90YXRpb24gPSBldi5yb3RhdGlvblxuXHRcdGxheWVyQS5odG1sID0gXCJSb3RhdGlvbjogXCIgKyBldi5yb3RhdGlvbi50b0ZpeGVkKDIpXG5cdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJTY3JvbGwrUm90YXRlXCJcblx0XG5cdHNjcm9sbCA9IG5ldyBTY3JvbGxDb21wb25lbnRcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyNTUsMjU1LDI1NSwwLjIpXCJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdHNjcm9sbEhvcml6b250YWw6IGZhbHNlXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cblx0IyBBZGQgc3BhY2luZ1xuXHRzY3JvbGwuY29udGVudEluc2V0ID0gXG5cdFx0dG9wOiAxMFxuXHRcdGJvdHRvbTogMTBcblxuXHQjIENyZWF0ZSBzb21lIGxheWVyc1xuXHRmb3IgaSBpbiBbMC4uMTBdXG5cdFx0bGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHN1cGVyTGF5ZXI6IHNjcm9sbC5jb250ZW50XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0XHRib3JkZXJSYWRpdXM6IDRcblx0XHRcdHdpZHRoOiBzY3JvbGwuY29udGVudC53aWR0aCAtIDIwXG5cdFx0XHRoZWlnaHQ6IDE2MFxuXHRcdFx0eDogMTBcblx0XHRcdHk6IDE3MCAqIGlcblx0XHRcdFxuXHRpbml0aWFsUm90YXRpb24gPSAwXG5cdFxuXHRzY3JvbGwub24gRXZlbnRzLlJvdGF0ZVN0YXJ0LCAoZXYpIC0+XG5cdFx0aW5pdGlhbFJvdGF0aW9uID0gc2Nyb2xsLnJvdGF0aW9uXG5cdFxuXHRzY3JvbGwub24gRXZlbnRzLlJvdGF0ZSwgKGV2KSAtPlxuXHRcdHNjcm9sbC5hbmltYXRlU3RvcCgpXG5cdFx0c2Nyb2xsLnJvdGF0aW9uID0gZXYucm90YXRpb25cblx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlN3aXBlXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMTI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiU3dpcGUgaW4gYW55IGRpcmVjdGlvblwiXG5cdG1haW5MYXllci5wZXJzcGVjdGl2ZSA9IDEyNTBcblx0bGF5ZXJBLmZvcmNlMmQgPSBmYWxzZVxuXG5cdGFuaW1hdGVCYWNrID0gLT5cblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0cm90YXRpb25YOiAwXG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XG5cdGFuaW1hdGVMYXllciA9IChsYXllciwgcHJvcGVydGllcykgLT5cblx0XHRhbmltYXRpb25BID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6IGxheWVyXG5cdFx0XHRwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzXG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXHRcdGFuaW1hdGlvbkEub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgYW5pbWF0ZUJhY2spXG5cdFx0YW5pbWF0aW9uQS5zdGFydCgpXG5cblx0bGF5ZXJBLm9uIEV2ZW50cy5Td2lwZUxlZnQsIChldikgLT5cblx0XHRhbmltYXRlTGF5ZXIgbGF5ZXJBLCB7cm90YXRpb25ZOiAtNjB9XG5cdFxuXHRsYXllckEub24gRXZlbnRzLlN3aXBlUmlnaHQsIChldikgLT5cblx0XHRhbmltYXRlTGF5ZXIgbGF5ZXJBLCB7cm90YXRpb25ZOiA2MH1cblx0XG5cdGxheWVyQS5vbiBFdmVudHMuU3dpcGVVcCwgKGV2KSAtPlxuXHRcdGFuaW1hdGVMYXllciBsYXllckEsIHtyb3RhdGlvblg6IDYwfVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5Td2lwZURvd24sIChldikgLT5cblx0XHRhbmltYXRlTGF5ZXIgbGF5ZXJBLCB7cm90YXRpb25YOiAtNjB9XG5cblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiVGFwXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMTI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiVGFwIHRvIHNjYWxlIHVwLCBkb3VibGUgdGFwIGRvd25cIlxuXHRcdFxuXHRsYXllckEub24gRXZlbnRzLlRhcCwgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogMS4wXG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5Eb3VibGVUYXAsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDAuNVxuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iXX0=
