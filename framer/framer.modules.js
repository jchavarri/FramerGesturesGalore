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
      layerA.removeAllListeners(ev);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamF2aS9Qcm9qZWN0cy9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL2RyYWdnYWJsZUFuZERvdWJsZVRhcExheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpL1Byb2plY3RzL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvbmF2aWdhdGlvbkNvbXBvbmVudC5jb2ZmZWUiLCIvVXNlcnMvamF2aS9Qcm9qZWN0cy9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3BhbkxheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpL1Byb2plY3RzL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvcGluY2hBbmRSb3RhdGVMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aS9Qcm9qZWN0cy9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3BpbmNoTGF5ZXIuY29mZmVlIiwiL1VzZXJzL2phdmkvUHJvamVjdHMvZ2l0aHViL2ZyYW1lci1nZXN0dXJlcy5mcmFtZXIvbW9kdWxlcy9wcmVzc0xheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpL1Byb2plY3RzL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvcmVtb3ZlQWxsTGlzdGVuZXJzTGF5ZXIuY29mZmVlIiwiL1VzZXJzL2phdmkvUHJvamVjdHMvZ2l0aHViL2ZyYW1lci1nZXN0dXJlcy5mcmFtZXIvbW9kdWxlcy9yb3RhdGVMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aS9Qcm9qZWN0cy9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3Njcm9sbEFuZFJvdGF0ZUxheWVyLmNvZmZlZSIsIi9Vc2Vycy9qYXZpL1Byb2plY3RzL2dpdGh1Yi9mcmFtZXItZ2VzdHVyZXMuZnJhbWVyL21vZHVsZXMvc3dpcGVMYXllci5jb2ZmZWUiLCIvVXNlcnMvamF2aS9Qcm9qZWN0cy9naXRodWIvZnJhbWVyLWdlc3R1cmVzLmZyYW1lci9tb2R1bGVzL3RhcExheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLFNBQUE7QUFFckIsTUFBQTtFQUFBLFNBQUEsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7SUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQWQ7SUFDQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE1BRGY7SUFFQSxlQUFBLEVBQWlCLFNBRmpCO0dBRGU7RUFJaEIsU0FBUyxDQUFDLEtBQVYsR0FBa0I7RUFHbEIsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUNaO0lBQUEsVUFBQSxFQUFZLFNBQVo7SUFDQSxDQUFBLEVBQUcsRUFESDtJQUVBLENBQUEsRUFBRyxHQUZIO0lBR0EsS0FBQSxFQUFPLFNBQVMsQ0FBQyxLQUFWLEdBQWtCLEVBSHpCO0lBSUEsTUFBQSxFQUFRLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLEdBSjNCO0lBS0EsZUFBQSxFQUFpQixNQUxqQjtJQU1BLFlBQUEsRUFBYyxDQU5kO0dBRFk7RUFTYixNQUFNLENBQUMsS0FBUCxHQUNDO0lBQUEsU0FBQSxFQUFXLFFBQVg7SUFDQSxRQUFBLEVBQVUsTUFEVjtJQUVBLEtBQUEsRUFBTyxPQUZQO0lBR0EsVUFBQSxFQUFZLE1BSFo7SUFJQSxVQUFBLEVBQVksT0FKWjtJQUtBLFVBQUEsRUFBWSxPQUxaOztFQU9ELE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFFZCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQWpCLEdBQTJCO0VBRTNCLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLFNBQWpCLEVBQTRCLFNBQUMsRUFBRDtXQUMzQixNQUFNLENBQUMsT0FBUCxDQUNDO01BQUEsVUFBQSxFQUNDO1FBQUEsS0FBQSxFQUFVLE1BQU0sQ0FBQyxLQUFQLEtBQWdCLEdBQW5CLEdBQTRCLEdBQTVCLEdBQXFDLEdBQTVDO09BREQ7TUFFQSxLQUFBLEVBQU8sTUFGUDtNQUdBLElBQUEsRUFBTSxHQUhOO0tBREQ7RUFEMkIsQ0FBNUI7QUFPQSxTQUFPO0FBckNjOzs7O0FDQXRCLElBQUE7OztBQUFNLE9BQU8sQ0FBQztBQUdiLE1BQUE7Ozs7RUFBQSxlQUFBLEdBQXFCOztFQUNyQixnQkFBQSxHQUFzQjs7RUFDdEIsYUFBQSxHQUF1QixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyxjQUFqQyxDQUFBLEtBQW9ELENBQUMsQ0FBeEQsR0FBK0QsRUFBL0QsR0FBdUU7O0VBRzNGLE1BQU0sQ0FBQyxrQkFBUCxHQUE2Qjs7RUFDN0IsTUFBTSxDQUFDLGlCQUFQLEdBQTRCOztFQUM1QixNQUFNLENBQUMsaUJBQVAsR0FBNEI7O0VBQzVCLE1BQU0sQ0FBQyxnQkFBUCxHQUEyQjs7RUFHM0IsMkJBQUEsR0FBOEI7O0VBR2pCLDZCQUFDLE9BQUQ7QUFHWixRQUFBO0lBSGEsSUFBQyxDQUFBLDRCQUFELFVBQVM7SUFHdEIsSUFBRyxDQUFJLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBaEI7QUFDQyxZQUFVLElBQUEsS0FBQSxDQUFNLDBFQUFOO0FBQ1YsYUFGRDs7O1VBSVEsQ0FBQyxRQUFtQixNQUFNLENBQUM7OztXQUMzQixDQUFDLFNBQW1CLE1BQU0sQ0FBQzs7O1dBQzNCLENBQUMsT0FBbUI7OztXQUNwQixDQUFDLGtCQUFtQjs7O1dBQ3BCLENBQUMsT0FBWSx1QkFBQSxHQUEwQjs7SUFFL0MscURBQU0sSUFBQyxDQUFBLE9BQVA7SUFFQSwyQkFBQTtJQUVBLElBQUMsQ0FBQSxnQkFBRCxHQUFzQjtJQUN0QixJQUFDLENBQUEsV0FBRCxHQUFpQjtJQUNqQixJQUFDLENBQUEsYUFBRCxHQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsSUFBMEI7SUFDN0MsSUFBQyxDQUFBLGNBQUQsR0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULElBQTJCO0lBQzlDLElBQUMsQ0FBQSxhQUFELEdBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxJQUEwQixJQUFDLENBQUE7SUFDOUMsSUFBQyxDQUFBLFlBQUQsR0FBaUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULElBQXlCLElBQUMsQ0FBQTtJQUMzQyxJQUFDLENBQUEsaUJBQUQsR0FBc0IsQ0FBQztJQUN2QixJQUFDLENBQUEsSUFBRCxHQUFZO0lBQ1osSUFBQyxDQUFBLFlBQUQsR0FBa0I7SUFFbEIsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVo7TUFDQyxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxPQUFPLENBQUM7TUFDeEIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsV0FBZDtNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBSGpCO0tBQUEsTUFBQTtNQUtDLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsS0FBQSxDQUNsQjtRQUFBLFVBQUEsRUFBWSxJQUFaO1FBQ0EsSUFBQSxFQUFNLGNBRE47UUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBRlI7UUFHQSxNQUFBLEVBQVEsRUFIUjtRQUlBLElBQUEsRUFBTSxLQUpOO1FBS0EsZUFBQSxFQUFpQiwwQkFMakI7T0FEa0I7TUFPbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFNLENBQUEsa0JBQUEsQ0FBbkIsR0FBeUM7TUFDekMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFNLENBQUEsaUJBQUEsQ0FBbkIsR0FBd0M7TUFDeEMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFNLENBQUEsbUJBQUEsQ0FBbkIsR0FBMEM7TUFDMUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFNLENBQUEscUJBQUEsQ0FBbkIsR0FBNEM7TUFFNUMsVUFBQSxHQUFpQixJQUFBLEtBQUEsQ0FDaEI7UUFBQSxVQUFBLEVBQVksSUFBQyxDQUFBLFdBQWI7UUFDQSxJQUFBLEVBQU0sYUFETjtRQUVBLEtBQUEsRUFBTyxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWIsR0FBcUIsQ0FGNUI7UUFHQSxNQUFBLEVBQVEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUhyQjtRQUlBLGVBQUEsRUFBaUIsRUFKakI7T0FEZ0I7TUFNakIsVUFBVSxDQUFDLE9BQVgsQ0FBQTtNQUNBLFVBQVUsQ0FBQyxLQUFYLEdBQ0M7UUFBQSxXQUFBLEVBQWMsTUFBZDtRQUNBLE9BQUEsRUFBVSxPQURWO1FBRUEsYUFBQSxFQUFnQixJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsSUFGdEM7UUFHQSxhQUFBLEVBQWdCLEtBSGhCO1FBSUEsWUFBQSxFQUFlLFFBSmY7UUFLQSxhQUFBLEVBQWUsZ0RBTGY7UUFNQSxhQUFBLEVBQWUsUUFOZjtRQU9BLFFBQUEsRUFBVyxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsSUFQakM7O01BU0QsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtRQUFBLFVBQUEsRUFBWSxJQUFDLENBQUEsV0FBYjtRQUNBLElBQUEsRUFBTSxZQUROO1FBRUEsS0FBQSxFQUFPLEdBRlA7UUFHQSxNQUFBLEVBQVEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUhyQjtRQUlBLGVBQUEsRUFBaUIsRUFKakI7UUFLQSxPQUFBLEVBQVMsQ0FMVDtRQU1BLENBQUEsRUFBRyxhQU5IO09BRGU7TUFRaEIsU0FBUyxDQUFDLEtBQVYsR0FDQztRQUFBLFdBQUEsRUFBYyxNQUFkO1FBQ0EsT0FBQSxFQUFVLG1CQURWO1FBRUEsYUFBQSxFQUFnQixJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsSUFGdEM7UUFHQSxhQUFBLEVBQWdCLEtBSGhCO1FBSUEsWUFBQSxFQUFlLE1BSmY7UUFLQSxhQUFBLEVBQWUsZ0RBTGY7UUFNQSxhQUFBLEVBQWUsUUFOZjtRQU9BLFFBQUEsRUFBVyxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsSUFQakM7O01BUUQsU0FBUyxDQUFDLEVBQVYsQ0FBYSxNQUFNLENBQUMsS0FBcEIsRUFBMkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUMxQixLQUFDLENBQUEsR0FBRCxDQUFBO1FBRDBCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtNQUdBLFNBQUEsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7UUFBQSxVQUFBLEVBQVksSUFBQyxDQUFBLFdBQWI7UUFDQSxJQUFBLEVBQU0sWUFETjtRQUVBLE9BQUEsRUFBUyxDQUZUO1FBR0EsT0FBQSxFQUFTLENBSFQ7UUFJQSxlQUFBLEVBQWlCLEVBSmpCO1FBS0EsT0FBQSxFQUFTLENBTFQ7UUFNQSxJQUFBLEVBQU0sK1ZBTk47T0FEZTtNQVFoQixTQUFTLENBQUMsRUFBVixDQUFhLE1BQU0sQ0FBQyxLQUFwQixFQUEyQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQzFCLEtBQUMsQ0FBQSxHQUFELENBQUE7UUFEMEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCO01BR0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxVQUFiLEdBQTBCO01BQzFCLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBYixHQUF5QjtNQUN6QixJQUFDLENBQUEsV0FBVyxDQUFDLFNBQWIsR0FBeUI7TUFFekIsSUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyxjQUFqQyxDQUFBLElBQW9ELENBQXZEO1FBQ0MsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLEdBQXNCO1FBQ3RCLFVBQVUsQ0FBQyxNQUFYLEdBQW9CO1FBQ3BCLFVBQVUsQ0FBQyxLQUFNLENBQUEsV0FBQSxDQUFqQixHQUFnQztRQUNoQyxVQUFVLENBQUMsS0FBTSxDQUFBLGFBQUEsQ0FBakIsR0FBa0MsVUFBVSxDQUFDLE1BQVgsR0FBb0I7UUFDdEQsU0FBUyxDQUFDLE1BQVYsR0FBbUI7UUFDbkIsU0FBUyxDQUFDLEtBQU0sQ0FBQSxXQUFBLENBQWhCLEdBQStCO1FBQy9CLFNBQVMsQ0FBQyxLQUFNLENBQUEsYUFBQSxDQUFoQixHQUFpQyxVQUFVLENBQUMsTUFBWCxHQUFvQjtRQUNyRCxTQUFTLENBQUMsS0FBVixHQUFrQixTQUFTLENBQUMsS0FBVixHQUFrQjtRQUNwQyxTQUFTLENBQUMsS0FBVixHQUFrQixJQVRuQjtPQXJFRDs7SUFnRkEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVo7TUFDQyxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsQ0FBQyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVY7TUFDcEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO01BQ3JCLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUF0QjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsWUFBYixDQUFBO01BQ0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFuQixJQUE2QixJQUFDLENBQUEsV0FBVyxDQUFDLFVBQTdDO1FBQ0MsSUFBQyxDQUFBLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBeEIsR0FBK0IsMkRBQUEsR0FBOEQsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBakYsR0FBeUYsU0FEekg7T0FMRDs7RUEzR1k7O2dDQW9IYixJQUFBLEdBQU0sU0FBQyxLQUFEO0FBQ0wsUUFBQTtJQUFBLElBQUcsQ0FBSSxJQUFDLENBQUEsSUFBUjtNQUNDLElBQUMsQ0FBQSxJQUFELENBQU0sTUFBTSxDQUFDLGtCQUFiLEVBQWlDO1FBQUMsZUFBQSxFQUFpQixJQUFsQjtRQUFxQixZQUFBLEVBQWMsWUFBbkM7UUFBaUQsU0FBQSxFQUFXLFNBQTVEO09BQWpDO01BQ0EsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixLQUF2QjtNQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYjtNQUNBLElBQUcsSUFBQyxDQUFBLFdBQUo7UUFDQyxJQUFDLENBQUEsV0FBVyxDQUFDLFlBQWIsQ0FBQSxFQUREOztNQUVBLFlBQUEsR0FBZSxJQUFDLENBQUEsZ0JBQWlCLENBQUEsSUFBQyxDQUFBLGlCQUFEO01BQ2pDLFNBQUEsR0FBWTtNQUNaLElBQUcsT0FBTyxZQUFZLENBQUMsa0JBQXBCLEtBQTBDLFVBQTdDO1FBQ0MsWUFBWSxDQUFDLGtCQUFiLENBQUEsRUFERDs7TUFFQSxJQUFHLE9BQU8sU0FBUyxDQUFDLGVBQWpCLEtBQW9DLFVBQXZDO1FBQ0MsU0FBUyxDQUFDLGVBQVYsQ0FBQSxFQUREOztNQUVBLElBQUMsQ0FBQSxpQkFBRDtNQUNBLElBQUMsQ0FBQSxhQUFELENBQWUsWUFBZixFQUE2QixTQUE3QjtNQUNBLElBQUMsQ0FBQSwyQkFBRCxDQUE2QixZQUE3QixFQUEyQyxTQUEzQzthQUNBLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBQyxDQUFBLGFBQWIsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQzNCLFlBQVksQ0FBQyxPQUFiLEdBQXVCO1VBQ3ZCLEtBQUMsQ0FBQSxJQUFELEdBQVE7aUJBQ1IsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsaUJBQWIsRUFBZ0M7WUFBQyxlQUFBLEVBQWlCLEtBQWxCO1lBQXFCLFlBQUEsRUFBYyxZQUFuQztZQUFpRCxTQUFBLEVBQVcsU0FBNUQ7V0FBaEM7UUFIMkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLEVBaEJEO0tBQUEsTUFBQTthQXNCQyxLQUFLLENBQUMsT0FBTixDQUFBLEVBdEJEOztFQURLOztnQ0F5Qk4sR0FBQSxHQUFLLFNBQUE7V0FDSixJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLENBQXhDO0VBREk7O2dDQUdMLGNBQUEsR0FBZ0IsU0FBQTtXQUNmLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixDQUFuQjtFQURlOztnQ0FHaEIsaUJBQUEsR0FBbUIsU0FBQyxLQUFEO0FBQ2xCLFFBQUE7SUFBQSxJQUFHLENBQUksSUFBQyxDQUFBLElBQVI7TUFDQyxJQUFDLENBQUEsSUFBRCxHQUFRO01BQ1IsSUFBRyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsQ0FBckIsSUFBMkIsQ0FBQyxDQUFBLENBQUEsSUFBSyxLQUFMLElBQUssS0FBTCxJQUFjLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxNQUFoQyxDQUFELENBQTlCO1FBQ0MsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsaUJBQWIsRUFBZ0M7VUFBQyxlQUFBLEVBQWlCLElBQWxCO1VBQXFCLEtBQUEsRUFBTyxLQUE1QjtVQUFtQyxZQUFBLEVBQWMsWUFBakQ7VUFBK0QsU0FBQSxFQUFXLFNBQTFFO1NBQWhDO1FBQ0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxnQkFBaUIsQ0FBQSxJQUFDLENBQUEsaUJBQUQ7UUFDakMsU0FBQSxHQUFZLElBQUMsQ0FBQSxnQkFBaUIsQ0FBQSxLQUFBO1FBQzlCLFNBQVMsQ0FBQyxPQUFWLEdBQW9CO1FBQ3BCLElBQUcsT0FBTyxZQUFZLENBQUMsa0JBQXBCLEtBQTBDLFVBQTdDO1VBQ0MsWUFBWSxDQUFDLGtCQUFiLENBQUEsRUFERDs7UUFFQSxJQUFHLE9BQU8sU0FBUyxDQUFDLGVBQWpCLEtBQW9DLFVBQXZDO1VBQ0MsU0FBUyxDQUFDLGVBQVYsQ0FBQSxFQUREOztRQUVBLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBZCxFQUE0QixTQUE1QjtRQUNBLElBQUMsQ0FBQSwwQkFBRCxDQUE0QixZQUE1QixFQUEwQyxTQUExQyxFQUFxRCxLQUFyRDtlQUNBLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBQyxDQUFBLGFBQWIsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtBQUMzQixnQkFBQTtBQUFBLGlCQUF3QixpS0FBeEI7Y0FDQyxnQkFBQSxHQUFtQixLQUFDLENBQUEsZ0JBQWlCLENBQUEsZ0JBQUE7Y0FDckMsZ0JBQWdCLENBQUMsT0FBakIsQ0FBQTtjQUNBLEtBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxHQUFsQixDQUFBO0FBSEQ7WUFJQSxLQUFDLENBQUEsaUJBQUQsR0FBcUI7WUFDckIsS0FBQyxDQUFBLElBQUQsR0FBUTttQkFDUixLQUFDLENBQUEsSUFBRCxDQUFNLE1BQU0sQ0FBQyxnQkFBYixFQUErQjtjQUFDLGVBQUEsRUFBaUIsS0FBbEI7Y0FBcUIsS0FBQSxFQUFPLEtBQTVCO2NBQW1DLFlBQUEsRUFBYyxZQUFqRDtjQUErRCxTQUFBLEVBQVcsU0FBMUU7YUFBL0I7VUFQMkI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLEVBWEQ7T0FBQSxNQUFBO2VBb0JDLElBQUMsQ0FBQSxJQUFELEdBQVEsTUFwQlQ7T0FGRDs7RUFEa0I7O2dDQTJCbkIsc0JBQUEsR0FBd0IsU0FBQyxZQUFELEVBQWUsU0FBZixFQUEwQixPQUExQixFQUFtQyxRQUFuQyxFQUE2QyxVQUE3QyxFQUF5RCxRQUF6RDtBQUN2QixRQUFBO0lBQUEsSUFBRyxJQUFDLENBQUEsV0FBWSxDQUFBLFlBQUEsQ0FBaEI7TUFDQyxjQUFBLEdBQWlCLElBQUMsQ0FBQSxXQUFZLENBQUEsWUFBQTtNQUM5QixhQUFBLEdBQWdCLGNBQWMsQ0FBQztNQUcvQixjQUFjLENBQUMsT0FBZixDQUNDO1FBQUEsVUFBQSxFQUNDO1VBQUEsT0FBQSxFQUFTLENBQVQ7VUFDQSxDQUFBLEVBQUcsVUFESDtTQUREO1FBR0EsS0FBQSxFQUFPLGdCQUhQO1FBSUEsSUFBQSxFQUFNLGVBSk47T0FERDtNQVFBLElBQUcsUUFBQSxLQUFjLE1BQWpCO1FBQ0MsaUJBQUEsR0FBb0IsY0FBYyxDQUFDLElBQWYsQ0FBQTtRQUNwQixpQkFBaUIsQ0FBQyxLQUFsQixHQUEwQixjQUFjLENBQUM7UUFDekMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQXlCLGlCQUF6QjtRQUNBLGlCQUFpQixDQUFDLElBQWxCLEdBQXlCLE1BQUEsR0FBUztRQUNsQyxpQkFBaUIsQ0FBQyxDQUFsQixHQUFzQjtRQUN0QixpQkFBaUIsQ0FBQyxPQUFsQixHQUE0QjtRQUM1QixpQkFBaUIsQ0FBQyxJQUFsQixHQUF5QiwyREFBQSxHQUE4RCxRQUE5RCxHQUF5RTtRQUNsRywwQkFBQSxHQUFpQyxJQUFBLFNBQUEsQ0FDaEM7VUFBQSxLQUFBLEVBQU8saUJBQVA7VUFDQSxVQUFBLEVBQ0M7WUFBQSxPQUFBLEVBQVMsQ0FBVDtZQUNBLENBQUEsRUFBRyxhQURIO1dBRkQ7VUFJQSxLQUFBLEVBQU8sZ0JBSlA7VUFLQSxJQUFBLEVBQU0sZUFMTjtTQURnQztRQU9qQywwQkFBMEIsQ0FBQyxLQUEzQixDQUFBO2VBQ0EsMEJBQTBCLENBQUMsRUFBM0IsQ0FBOEIsS0FBOUIsRUFBcUMsU0FBQTtVQUNwQyxjQUFjLENBQUMsSUFBZixHQUFzQixpQkFBaUIsQ0FBQztVQUN4QyxjQUFjLENBQUMsT0FBZixHQUF5QjtVQUN6QixjQUFjLENBQUMsQ0FBZixHQUFtQjtpQkFDbkIsaUJBQWlCLENBQUMsT0FBbEIsQ0FBQTtRQUpvQyxDQUFyQyxFQWhCRDtPQWJEOztFQUR1Qjs7Z0NBb0N4QiwyQkFBQSxHQUE2QixTQUFDLFNBQUQsRUFBWSxPQUFaO0lBQzVCLElBQUcsSUFBQyxDQUFBLFdBQUQsSUFBaUIsQ0FBSSxJQUFDLENBQUEsWUFBekI7TUFFQyxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBdEMsRUFBaUQsT0FBakQsRUFBMEQsT0FBTyxDQUFDLEtBQWxFLEVBQXlFLENBQUMsYUFBMUUsRUFBeUYsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUF0RztNQUVBLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxFQUFnRCxPQUFoRCxFQUF5RCxTQUFTLENBQUMsS0FBbkUsRUFBMEUsQ0FBRSxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQWYsR0FBdUIsQ0FBakcsRUFBb0csSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLEdBQXFCLENBQXpIO01BRUEsSUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLFNBQWhCO2VBQ0MsSUFBQyxDQUFBLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBdkIsQ0FDQztVQUFBLFVBQUEsRUFDQztZQUFBLE9BQUEsRUFBUyxDQUFUO1dBREQ7VUFFQSxLQUFBLEVBQU8sZ0JBRlA7VUFHQSxJQUFBLEVBQU0sZUFITjtTQURELEVBREQ7T0FORDs7RUFENEI7O2dDQWM3QiwwQkFBQSxHQUE0QixTQUFDLFNBQUQsRUFBWSxPQUFaLEVBQXFCLEtBQXJCO0FBRTNCLFFBQUE7SUFBQSxJQUFHLElBQUMsQ0FBQSxXQUFELElBQWlCLENBQUksSUFBQyxDQUFBLFlBQXpCO01BRUMsSUFBQyxDQUFBLHNCQUFELENBQXdCLFlBQXhCLEVBQXNDLFNBQXRDLEVBQWlELE9BQWpELEVBQTBELE9BQU8sQ0FBQyxLQUFsRSxFQUF5RSxJQUFDLENBQUEsV0FBVyxDQUFDLEtBQXRGLEVBQTZGLENBQTdGO01BRUEsaUJBQUEsR0FBb0I7TUFDcEIsSUFBRyxJQUFDLENBQUEsZ0JBQWlCLENBQUEsS0FBQSxHQUFRLENBQVIsQ0FBbEIsSUFBaUMsSUFBQyxDQUFBLGdCQUFpQixDQUFBLEtBQUEsR0FBUSxDQUFSLENBQVUsQ0FBQyxLQUFqRTtRQUNDLGlCQUFBLEdBQW9CLElBQUMsQ0FBQSxnQkFBaUIsQ0FBQSxLQUFBLEdBQVEsQ0FBUixDQUFVLENBQUMsTUFEbEQ7T0FBQSxNQUFBO1FBR0MsSUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLFNBQWhCO1VBQ0MsSUFBQyxDQUFBLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBdkIsQ0FDQztZQUFBLFVBQUEsRUFDQztjQUFBLE9BQUEsRUFBUyxDQUFUO2FBREQ7WUFFQSxLQUFBLEVBQU8sZ0JBRlA7WUFHQSxJQUFBLEVBQU0sZUFITjtXQURELEVBREQ7U0FIRDs7YUFTQSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBckMsRUFBZ0QsT0FBaEQsRUFBeUQsaUJBQXpELEVBQTRFLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixHQUFxQixDQUFqRyxFQUFvRyxDQUFDLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBZCxHQUFzQixDQUExSCxFQWREOztFQUYyQjs7Z0NBbUI1QixxQkFBQSxHQUF1QixTQUFDLFNBQUQsRUFBWSxPQUFaO0FBQ3RCLFFBQUE7SUFBQSxXQUFBLEdBQWtCLElBQUEsS0FBQSxDQUNqQjtNQUFBLFVBQUEsRUFBWSxTQUFaO01BQ0EsS0FBQSxFQUFPLFNBQVMsQ0FBQyxLQURqQjtNQUVBLE1BQUEsRUFBUSxTQUFTLENBQUMsTUFGbEI7TUFHQSxJQUFBLEVBQU0sYUFITjtNQUlBLGVBQUEsRUFBaUIsT0FKakI7TUFLQSxPQUFBLEVBQVMsQ0FMVDtLQURpQjtJQU9sQixXQUFXLENBQUMsT0FBWixDQUNDO01BQUEsVUFBQSxFQUNDO1FBQUEsT0FBQSxFQUFTLEdBQVQ7T0FERDtNQUVBLEtBQUEsRUFBTyxnQkFGUDtNQUdBLElBQUEsRUFBTSxlQUhOO0tBREQ7SUFLQSxTQUFTLENBQUMsT0FBVixDQUNDO01BQUEsVUFBQSxFQUNDO1FBQUEsQ0FBQSxFQUFHLENBQUMsSUFBQyxDQUFBLEtBQUYsR0FBVSxJQUFiO09BREQ7TUFFQSxLQUFBLEVBQU8sZ0JBRlA7TUFHQSxJQUFBLEVBQU0sZUFITjtLQUREO0lBS0EsT0FBTyxDQUFDLFdBQVIsR0FBc0I7SUFDdEIsT0FBTyxDQUFDLE9BQVIsR0FBa0IsQ0FBQztJQUNuQixPQUFPLENBQUMsVUFBUixHQUFxQjtJQUNyQixPQUFPLENBQUMsQ0FBUixHQUFZLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFWO1dBQ3JCLE9BQU8sQ0FBQyxPQUFSLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxDQUFBLEVBQUcsQ0FBSDtPQUREO01BRUEsS0FBQSxFQUFPLGdCQUZQO01BR0EsSUFBQSxFQUFNLGVBSE47S0FERDtFQXRCc0I7O2dDQTZCdkIsb0JBQUEsR0FBc0IsU0FBQyxTQUFELEVBQVksT0FBWjtBQUNyQixRQUFBO0lBQUEsU0FBUyxDQUFDLE9BQVYsQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLENBQUEsRUFBRyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBWixDQUFaO09BREQ7TUFFQSxLQUFBLEVBQU8sZ0JBRlA7TUFHQSxJQUFBLEVBQU0sZUFITjtLQUREO0lBS0EsT0FBTyxDQUFDLE9BQVIsQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLENBQUEsRUFBRyxDQUFIO09BREQ7TUFFQSxLQUFBLEVBQU8sZ0JBRlA7TUFHQSxJQUFBLEVBQU0sZUFITjtLQUREO0lBS0EsV0FBQSxHQUFjLE9BQU8sQ0FBQyxlQUFSLENBQXdCLGFBQXhCLENBQXVDLENBQUEsQ0FBQTtJQUNyRCxvQkFBQSxHQUEyQixJQUFBLFNBQUEsQ0FDMUI7TUFBQSxLQUFBLEVBQU8sV0FBUDtNQUNBLFVBQUEsRUFDQztRQUFBLE9BQUEsRUFBUyxDQUFUO09BRkQ7TUFHQSxLQUFBLEVBQU8sZ0JBSFA7TUFJQSxJQUFBLEVBQU0sZUFKTjtLQUQwQjtJQU0zQixvQkFBb0IsQ0FBQyxLQUFyQixDQUFBO1dBQ0Esb0JBQW9CLENBQUMsRUFBckIsQ0FBd0IsS0FBeEIsRUFBK0IsU0FBQTthQUM5QixXQUFXLENBQUMsT0FBWixDQUFBO0lBRDhCLENBQS9CO0VBbkJxQjs7OztHQWpTbUI7Ozs7QUNBMUMsT0FBTyxDQUFDLFdBQVIsR0FBc0IsU0FBQTtBQUVyQixNQUFBO0VBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtJQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FBZDtJQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFEZjtJQUVBLGVBQUEsRUFBaUIsU0FGakI7R0FEZTtFQUloQixTQUFTLENBQUMsS0FBVixHQUFrQjtFQUdsQixZQUFBLEdBQW1CLElBQUEsS0FBQSxDQUNsQjtJQUFBLFVBQUEsRUFBWSxTQUFaO0lBQ0EsQ0FBQSxFQUFHLEVBREg7SUFFQSxDQUFBLEVBQUcsR0FGSDtJQUdBLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FBVixHQUFrQixFQUh6QjtJQUlBLE1BQUEsRUFBUSxHQUpSO0lBS0EsZUFBQSxFQUFpQixNQUxqQjtJQU1BLFlBQUEsRUFBYyxDQU5kO0dBRGtCO0VBU25CLFlBQVksQ0FBQyxLQUFiLEdBQ0M7SUFBQSxTQUFBLEVBQVcsUUFBWDtJQUNBLFFBQUEsRUFBVSxNQURWO0lBRUEsS0FBQSxFQUFPLE9BRlA7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLFVBQUEsRUFBWSxNQUpaOztFQU9ELE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FDWjtJQUFBLFVBQUEsRUFBWSxTQUFaO0lBQ0EsQ0FBQSxFQUFHLEVBREg7SUFFQSxDQUFBLEVBQUcsR0FGSDtJQUdBLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FBVixHQUFrQixFQUh6QjtJQUlBLE1BQUEsRUFBUSxTQUFTLENBQUMsTUFBVixHQUFtQixHQUozQjtJQUtBLGVBQUEsRUFBaUIsTUFMakI7SUFNQSxZQUFBLEVBQWMsQ0FOZDtHQURZO0VBU2IsTUFBTSxDQUFDLEtBQVAsR0FDQztJQUFBLFNBQUEsRUFBVyxRQUFYO0lBQ0EsUUFBQSxFQUFVLE1BRFY7SUFFQSxLQUFBLEVBQU8sT0FGUDtJQUdBLFVBQUEsRUFBWSxNQUhaO0lBSUEsVUFBQSxFQUFlLE1BQU0sQ0FBQyxNQUFSLEdBQWUsSUFKN0I7O0VBTUQsTUFBTSxDQUFDLElBQVAsR0FBYztFQUVkLFNBQUEsR0FBWSxTQUFDLEVBQUQ7QUFDWCxXQUFPLFNBQUEsR0FBWSxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBWixHQUFxQyxVQUFyQyxHQUFrRCxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBbEQsR0FBMkUsa0JBQTNFLEdBQWdHLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBYixDQUFxQixDQUFyQixDQUFoRyxHQUEwSDtFQUR0SDtFQUdaLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLE9BQWpCLEVBQTBCLFNBQUMsRUFBRDtXQUN6QixZQUFZLENBQUMsSUFBYixHQUFvQixNQUFBLEdBQVMsU0FBQSxDQUFVLEVBQVY7RUFESixDQUExQjtFQUdBLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLFFBQWpCLEVBQTJCLFNBQUMsRUFBRDtXQUMxQixZQUFZLENBQUMsSUFBYixHQUFvQixPQUFBLEdBQVUsU0FBQSxDQUFVLEVBQVY7RUFESixDQUEzQjtFQUdBLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLEtBQWpCLEVBQXdCLFNBQUMsRUFBRDtXQUN2QixZQUFZLENBQUMsSUFBYixHQUFvQixJQUFBLEdBQU8sU0FBQSxDQUFVLEVBQVY7RUFESixDQUF4QjtFQUdBLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLE9BQWpCLEVBQTBCLFNBQUMsRUFBRDtXQUN6QixZQUFZLENBQUMsSUFBYixHQUFvQixNQUFBLEdBQVMsU0FBQSxDQUFVLEVBQVY7RUFESixDQUExQjtBQUdBLFNBQU87QUEzRGM7Ozs7QUNBdEIsT0FBTyxDQUFDLFdBQVIsR0FBc0IsU0FBQTtBQUVyQixNQUFBO0VBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtJQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FBZDtJQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFEZjtJQUVBLGVBQUEsRUFBaUIsU0FGakI7R0FEZTtFQUloQixTQUFTLENBQUMsS0FBVixHQUFrQjtFQUdsQixNQUFBLEdBQWEsSUFBQSxLQUFBLENBQ1o7SUFBQSxVQUFBLEVBQVksU0FBWjtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsQ0FBQSxFQUFHLEdBRkg7SUFHQSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBQVYsR0FBa0IsRUFIekI7SUFJQSxNQUFBLEVBQVEsU0FBUyxDQUFDLE1BQVYsR0FBbUIsR0FKM0I7SUFLQSxlQUFBLEVBQWlCLE1BTGpCO0lBTUEsWUFBQSxFQUFjLENBTmQ7R0FEWTtFQVNiLE1BQU0sQ0FBQyxLQUFQLEdBQ0M7SUFBQSxTQUFBLEVBQVcsUUFBWDtJQUNBLFFBQUEsRUFBVSxNQURWO0lBRUEsS0FBQSxFQUFPLE9BRlA7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLFVBQUEsRUFBZSxNQUFNLENBQUMsTUFBUixHQUFlLElBSjdCOztFQU1ELE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFFZCxjQUFBLEdBQWlCLFNBQUMsRUFBRDtBQUNoQixRQUFBO0lBQUEsS0FBQSxHQUFRLEVBQUUsQ0FBQztJQUNYLElBQUcsTUFBTSxDQUFDLEtBQVAsR0FBZSxDQUFsQjtNQUNDLE1BQU0sQ0FBQyxPQUFQLENBQ0M7UUFBQSxVQUFBLEVBQ0M7VUFBQSxLQUFBLEVBQU8sQ0FBUDtTQUREO1FBRUEsS0FBQSxFQUFPLG9CQUZQO09BREQ7TUFJQSxLQUFBLEdBQVEsRUFMVDs7SUFNQSxNQUFNLENBQUMsT0FBUCxDQUNDO01BQUEsVUFBQSxFQUNDO1FBQUEsUUFBQSxFQUFVLENBQVY7T0FERDtNQUVBLEtBQUEsRUFBTyxvQkFGUDtLQUREO1dBSUEsTUFBTSxDQUFDLElBQVAsR0FBYyxTQUFBLEdBQVksS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLENBQVosR0FBK0I7RUFaN0I7RUFlakIsWUFBQSxHQUFlO0VBQ2YsZUFBQSxHQUFrQjtFQUVsQixNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxVQUFqQixFQUE2QixTQUFDLEVBQUQ7V0FDNUIsWUFBQSxHQUFlLE1BQU0sQ0FBQztFQURNLENBQTdCO0VBR0EsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsV0FBakIsRUFBOEIsU0FBQyxFQUFEO1dBQzdCLGVBQUEsR0FBa0IsTUFBTSxDQUFDO0VBREksQ0FBOUI7RUFHQSxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxLQUFqQixFQUF3QixTQUFDLEVBQUQ7SUFDdkIsTUFBTSxDQUFDLFdBQVAsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsRUFBRSxDQUFDLEtBQUgsR0FBUztXQUN4QixNQUFNLENBQUMsSUFBUCxHQUFjLFNBQUEsR0FBWSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQVQsQ0FBaUIsQ0FBakIsQ0FBWixHQUFrQyxTQUFsQyxHQUE4QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQWhCLENBQXdCLENBQXhCO0VBSHJDLENBQXhCO0VBS0EsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsTUFBakIsRUFBeUIsU0FBQyxFQUFEO0lBQ3hCLE1BQU0sQ0FBQyxXQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsUUFBUCxHQUFrQixFQUFFLENBQUM7V0FDckIsTUFBTSxDQUFDLElBQVAsR0FBYyxTQUFBLEdBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFiLENBQXFCLENBQXJCLENBQVosR0FBc0MsU0FBdEMsR0FBa0QsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFaLENBQW9CLENBQXBCO0VBSHhDLENBQXpCO0VBS0EsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsUUFBakIsRUFBMkIsU0FBQyxFQUFEO1dBQzFCLGNBQUEsQ0FBZSxFQUFmO0VBRDBCLENBQTNCO0VBR0EsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsU0FBakIsRUFBNEIsU0FBQyxFQUFEO1dBQzNCLGNBQUEsQ0FBZSxFQUFmO0VBRDJCLENBQTVCO0FBSUEsU0FBTztBQXBFYzs7OztBQ0F0QixPQUFPLENBQUMsV0FBUixHQUFzQixTQUFBO0FBRXJCLE1BQUE7RUFBQSxTQUFBLEdBQWdCLElBQUEsS0FBQSxDQUNmO0lBQUEsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUFkO0lBQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO0lBRUEsZUFBQSxFQUFpQixTQUZqQjtHQURlO0VBSWhCLFNBQVMsQ0FBQyxLQUFWLEdBQWtCO0VBR2xCLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FDWjtJQUFBLFVBQUEsRUFBWSxTQUFaO0lBQ0EsQ0FBQSxFQUFHLEVBREg7SUFFQSxDQUFBLEVBQUcsR0FGSDtJQUdBLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FBVixHQUFrQixFQUh6QjtJQUlBLE1BQUEsRUFBUSxTQUFTLENBQUMsTUFBVixHQUFtQixHQUozQjtJQUtBLGVBQUEsRUFBaUIsTUFMakI7SUFNQSxZQUFBLEVBQWMsQ0FOZDtHQURZO0VBU2IsTUFBTSxDQUFDLEtBQVAsR0FDQztJQUFBLFNBQUEsRUFBVyxRQUFYO0lBQ0EsUUFBQSxFQUFVLE1BRFY7SUFFQSxLQUFBLEVBQU8sT0FGUDtJQUdBLFVBQUEsRUFBWSxNQUhaO0lBSUEsVUFBQSxFQUFlLE1BQU0sQ0FBQyxNQUFSLEdBQWUsSUFKN0I7O0VBTUQsTUFBTSxDQUFDLElBQVAsR0FBYztFQUdkLFlBQUEsR0FBZTtFQUNmLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLFVBQWpCLEVBQTZCLFNBQUMsRUFBRDtXQUM1QixZQUFBLEdBQWUsTUFBTSxDQUFDO0VBRE0sQ0FBN0I7RUFFQSxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxRQUFqQixFQUEyQixTQUFDLEVBQUQ7SUFDMUIsSUFBRyxNQUFNLENBQUMsS0FBUCxHQUFlLENBQWxCO01BQ0MsTUFBTSxDQUFDLE9BQVAsQ0FDQztRQUFBLFVBQUEsRUFDQztVQUFBLEtBQUEsRUFBTyxDQUFQO1NBREQ7UUFFQSxLQUFBLEVBQU8sb0JBRlA7T0FERDthQUlBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsYUFMZjs7RUFEMEIsQ0FBM0I7RUFRQSxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxLQUFqQixFQUF3QixTQUFDLEVBQUQ7SUFDdkIsTUFBTSxDQUFDLFdBQVAsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsRUFBRSxDQUFDLEtBQUgsR0FBUztXQUN4QixNQUFNLENBQUMsSUFBUCxHQUFjLFNBQUEsR0FBWSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQVQsQ0FBaUIsQ0FBakI7RUFISCxDQUF4QjtBQUtBLFNBQU87QUE1Q2M7Ozs7QUNBdEIsT0FBTyxDQUFDLFdBQVIsR0FBc0IsU0FBQTtBQUVyQixNQUFBO0VBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtJQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FBZDtJQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFEZjtJQUVBLGVBQUEsRUFBaUIsU0FGakI7R0FEZTtFQUloQixTQUFTLENBQUMsS0FBVixHQUFrQjtFQUdsQixNQUFBLEdBQWEsSUFBQSxLQUFBLENBQ1o7SUFBQSxVQUFBLEVBQVksU0FBWjtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsQ0FBQSxFQUFHLEdBRkg7SUFHQSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBQVYsR0FBa0IsRUFIekI7SUFJQSxNQUFBLEVBQVEsU0FBUyxDQUFDLE1BQVYsR0FBbUIsR0FKM0I7SUFLQSxlQUFBLEVBQWlCLE1BTGpCO0lBTUEsWUFBQSxFQUFjLENBTmQ7R0FEWTtFQVNiLE1BQU0sQ0FBQyxLQUFQLEdBQ0M7SUFBQSxTQUFBLEVBQVcsUUFBWDtJQUNBLFFBQUEsRUFBVSxNQURWO0lBRUEsS0FBQSxFQUFPLE9BRlA7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLFVBQUEsRUFBZSxNQUFNLENBQUMsTUFBUixHQUFlLElBSjdCOztFQU1ELE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFFZCxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxLQUFqQixFQUF3QixTQUFDLEVBQUQ7V0FDdkIsTUFBTSxDQUFDLE9BQVAsQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLEtBQUEsRUFBVSxNQUFNLENBQUMsS0FBUCxLQUFnQixHQUFuQixHQUE0QixHQUE1QixHQUFxQyxHQUE1QztPQUREO01BRUEsS0FBQSxFQUFPLG9CQUZQO0tBREQ7RUFEdUIsQ0FBeEI7QUFNQSxTQUFPO0FBakNjOzs7O0FDQXRCLE9BQU8sQ0FBQyxXQUFSLEdBQXNCLFNBQUE7QUFFckIsTUFBQTtFQUFBLFNBQUEsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7SUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBQWQ7SUFDQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE1BRGY7SUFFQSxlQUFBLEVBQWlCLFNBRmpCO0dBRGU7RUFJaEIsU0FBUyxDQUFDLEtBQVYsR0FBa0I7RUFHbEIsY0FBQSxHQUFxQixJQUFBLEtBQUEsQ0FDcEI7SUFBQSxVQUFBLEVBQVksU0FBWjtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsQ0FBQSxFQUFHLEdBRkg7SUFHQSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBQVYsR0FBa0IsRUFIekI7SUFJQSxNQUFBLEVBQVEsR0FKUjtJQUtBLGVBQUEsRUFBaUIsTUFMakI7SUFNQSxZQUFBLEVBQWMsQ0FOZDtHQURvQjtFQVNyQixjQUFjLENBQUMsS0FBZixHQUNDO0lBQUEsU0FBQSxFQUFXLFFBQVg7SUFDQSxRQUFBLEVBQVUsTUFEVjtJQUVBLEtBQUEsRUFBTyxPQUZQO0lBR0EsVUFBQSxFQUFZLE1BSFo7SUFJQSxVQUFBLEVBQVksTUFKWjs7RUFNRCxjQUFjLENBQUMsSUFBZixHQUFzQjtFQUl0QixNQUFBLEdBQWEsSUFBQSxLQUFBLENBQ1o7SUFBQSxVQUFBLEVBQVksU0FBWjtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsQ0FBQSxFQUFHLEdBRkg7SUFHQSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBQVYsR0FBa0IsRUFIekI7SUFJQSxNQUFBLEVBQVEsU0FBUyxDQUFDLE1BQVYsR0FBbUIsR0FKM0I7SUFLQSxlQUFBLEVBQWlCLE1BTGpCO0lBTUEsWUFBQSxFQUFjLENBTmQ7R0FEWTtFQVNiLE1BQU0sQ0FBQyxLQUFQLEdBQ0M7SUFBQSxTQUFBLEVBQVcsUUFBWDtJQUNBLFFBQUEsRUFBVSxNQURWO0lBRUEsS0FBQSxFQUFPLE9BRlA7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLFVBQUEsRUFBZSxNQUFNLENBQUMsTUFBUixHQUFlLElBSjdCOztFQU1ELE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFFZCxTQUFBLEdBQVksU0FBQyxTQUFEO0lBQ1gsY0FBYyxDQUFDLElBQWYsR0FBc0I7SUFDdEIsY0FBYyxDQUFDLFdBQWYsQ0FBQTtJQUNBLGNBQWMsQ0FBQyxPQUFmLEdBQXlCO1dBQ3pCLGNBQWMsQ0FBQyxPQUFmLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQVMsQ0FBVDtPQUREO01BRUEsS0FBQSxFQUFPLG9CQUZQO0tBREQ7RUFKVztFQVNaLGNBQUEsR0FBaUIsQ0FDaEIsTUFBTSxDQUFDLFNBRFMsRUFFaEIsTUFBTSxDQUFDLFVBRlMsRUFHaEIsTUFBTSxDQUFDLE9BSFMsRUFJaEIsTUFBTSxDQUFDLFNBSlMsRUFLaEIsTUFBTSxDQUFDLEtBTFMsRUFNaEIsTUFBTSxDQUFDLEtBTlMsRUFPaEIsTUFBTSxDQUFDLFNBUFMsRUFRaEIsTUFBTSxDQUFDLE1BUlM7QUFXakIsT0FBQSxnREFBQTs7SUFDQyxNQUFNLENBQUMsRUFBUCxDQUFVLEVBQVYsRUFBYyxTQUFDLEVBQUQ7YUFDYixTQUFBLENBQVUsRUFBRSxDQUFDLElBQWI7SUFEYSxDQUFkO0FBREQ7RUFLQSxLQUFLLENBQUMsS0FBTixDQUFZLElBQVosRUFBa0IsU0FBQTtBQUNqQixRQUFBO0FBQUEsU0FBQSxrREFBQTs7TUFDQyxNQUFNLENBQUMsa0JBQVAsQ0FBMEIsRUFBMUI7QUFERDtJQUVBLGNBQWMsQ0FBQyxXQUFmLENBQUE7SUFDQSxjQUFjLENBQUMsSUFBZixHQUFzQjtXQUN0QixjQUFjLENBQUMsT0FBZixHQUF5QjtFQUxSLENBQWxCO0FBT0EsU0FBTztBQS9FYzs7OztBQ0F0QixPQUFPLENBQUMsV0FBUixHQUFzQixTQUFBO0FBRXJCLE1BQUE7RUFBQSxTQUFBLEdBQWdCLElBQUEsS0FBQSxDQUNmO0lBQUEsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUFkO0lBQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO0lBRUEsZUFBQSxFQUFpQixTQUZqQjtHQURlO0VBSWhCLFNBQVMsQ0FBQyxLQUFWLEdBQWtCO0VBR2xCLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FDWjtJQUFBLFVBQUEsRUFBWSxTQUFaO0lBQ0EsQ0FBQSxFQUFHLEVBREg7SUFFQSxDQUFBLEVBQUcsR0FGSDtJQUdBLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FBVixHQUFrQixFQUh6QjtJQUlBLE1BQUEsRUFBUSxTQUFTLENBQUMsTUFBVixHQUFtQixHQUozQjtJQUtBLGVBQUEsRUFBaUIsTUFMakI7SUFNQSxZQUFBLEVBQWMsQ0FOZDtHQURZO0VBU2IsTUFBTSxDQUFDLEtBQVAsR0FDQztJQUFBLFNBQUEsRUFBVyxRQUFYO0lBQ0EsUUFBQSxFQUFVLE1BRFY7SUFFQSxLQUFBLEVBQU8sT0FGUDtJQUdBLFVBQUEsRUFBWSxNQUhaO0lBSUEsVUFBQSxFQUFlLE1BQU0sQ0FBQyxNQUFSLEdBQWUsSUFKN0I7O0VBTUQsTUFBTSxDQUFDLElBQVAsR0FBYztFQUdkLGVBQUEsR0FBa0I7RUFDbEIsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsV0FBakIsRUFBOEIsU0FBQyxFQUFEO1dBQzdCLGVBQUEsR0FBa0IsTUFBTSxDQUFDO0VBREksQ0FBOUI7RUFFQSxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxTQUFqQixFQUE0QixTQUFDLEVBQUQ7SUFDM0IsTUFBTSxDQUFDLE9BQVAsQ0FDQztNQUFBLFVBQUEsRUFDQztRQUFBLFFBQUEsRUFBVSxDQUFWO09BREQ7TUFFQSxLQUFBLEVBQU8sb0JBRlA7S0FERDtXQUlBLE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFMYSxDQUE1QjtFQU9BLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLE1BQWpCLEVBQXlCLFNBQUMsRUFBRDtJQUN4QixNQUFNLENBQUMsV0FBUCxDQUFBO0lBQ0EsTUFBTSxDQUFDLFFBQVAsR0FBa0IsRUFBRSxDQUFDO1dBQ3JCLE1BQU0sQ0FBQyxJQUFQLEdBQWMsWUFBQSxHQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBWixDQUFvQixDQUFwQjtFQUhMLENBQXpCO0FBS0EsU0FBTztBQTNDYzs7OztBQ0F0QixPQUFPLENBQUMsV0FBUixHQUFzQixTQUFBO0FBRXJCLE1BQUE7RUFBQSxTQUFBLEdBQWdCLElBQUEsS0FBQSxDQUNmO0lBQUEsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUFkO0lBQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO0lBRUEsZUFBQSxFQUFpQixTQUZqQjtHQURlO0VBSWhCLFNBQVMsQ0FBQyxLQUFWLEdBQWtCO0VBRWxCLE1BQUEsR0FBYSxJQUFBLGVBQUEsQ0FDWjtJQUFBLFVBQUEsRUFBWSxTQUFaO0lBQ0EsZUFBQSxFQUFpQix1QkFEakI7SUFFQSxDQUFBLEVBQUcsRUFGSDtJQUdBLENBQUEsRUFBRyxHQUhIO0lBSUEsS0FBQSxFQUFPLFNBQVMsQ0FBQyxLQUFWLEdBQWtCLEVBSnpCO0lBS0EsTUFBQSxFQUFRLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLEdBTDNCO0lBTUEsZ0JBQUEsRUFBa0IsS0FObEI7SUFPQSxZQUFBLEVBQWMsQ0FQZDtHQURZO0VBV2IsTUFBTSxDQUFDLFlBQVAsR0FDQztJQUFBLEdBQUEsRUFBSyxFQUFMO0lBQ0EsTUFBQSxFQUFRLEVBRFI7O0FBSUQsT0FBUywyQkFBVDtJQUNDLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FDWDtNQUFBLFVBQUEsRUFBWSxNQUFNLENBQUMsT0FBbkI7TUFDQSxlQUFBLEVBQWlCLE1BRGpCO01BRUEsWUFBQSxFQUFjLENBRmQ7TUFHQSxLQUFBLEVBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFmLEdBQXVCLEVBSDlCO01BSUEsTUFBQSxFQUFRLEdBSlI7TUFLQSxDQUFBLEVBQUcsRUFMSDtNQU1BLENBQUEsRUFBRyxHQUFBLEdBQU0sQ0FOVDtLQURXO0FBRGI7RUFVQSxlQUFBLEdBQWtCO0VBRWxCLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLFdBQWpCLEVBQThCLFNBQUMsRUFBRDtXQUM3QixlQUFBLEdBQWtCLE1BQU0sQ0FBQztFQURJLENBQTlCO0VBR0EsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsTUFBakIsRUFBeUIsU0FBQyxFQUFEO0lBQ3hCLE1BQU0sQ0FBQyxXQUFQLENBQUE7V0FDQSxNQUFNLENBQUMsUUFBUCxHQUFrQixFQUFFLENBQUM7RUFGRyxDQUF6QjtBQUlBLFNBQU87QUEzQ2M7Ozs7QUNBdEIsT0FBTyxDQUFDLFdBQVIsR0FBc0IsU0FBQTtBQUVyQixNQUFBO0VBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtJQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FBZDtJQUNBLE1BQUEsRUFBUSxNQUFNLENBQUMsTUFEZjtJQUVBLGVBQUEsRUFBaUIsU0FGakI7R0FEZTtFQUloQixTQUFTLENBQUMsS0FBVixHQUFrQjtFQUdsQixNQUFBLEdBQWEsSUFBQSxLQUFBLENBQ1o7SUFBQSxVQUFBLEVBQVksU0FBWjtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsQ0FBQSxFQUFHLEdBRkg7SUFHQSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBQVYsR0FBa0IsRUFIekI7SUFJQSxNQUFBLEVBQVEsU0FBUyxDQUFDLE1BQVYsR0FBbUIsR0FKM0I7SUFLQSxlQUFBLEVBQWlCLE1BTGpCO0lBTUEsWUFBQSxFQUFjLENBTmQ7R0FEWTtFQVNiLE1BQU0sQ0FBQyxLQUFQLEdBQ0M7SUFBQSxTQUFBLEVBQVcsUUFBWDtJQUNBLFFBQUEsRUFBVSxNQURWO0lBRUEsS0FBQSxFQUFPLE9BRlA7SUFHQSxVQUFBLEVBQVksTUFIWjtJQUlBLFVBQUEsRUFBZSxNQUFNLENBQUMsTUFBUixHQUFlLElBSjdCOztFQU1ELE1BQU0sQ0FBQyxJQUFQLEdBQWM7RUFDZCxTQUFTLENBQUMsV0FBVixHQUF3QjtFQUN4QixNQUFNLENBQUMsT0FBUCxHQUFpQjtFQUVqQixXQUFBLEdBQWMsU0FBQTtXQUNiLE1BQU0sQ0FBQyxPQUFQLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxTQUFBLEVBQVcsQ0FBWDtRQUNBLFNBQUEsRUFBVyxDQURYO09BREQ7TUFHQSxLQUFBLEVBQU8sb0JBSFA7S0FERDtFQURhO0VBT2QsWUFBQSxHQUFlLFNBQUMsS0FBRCxFQUFRLFVBQVI7QUFDZCxRQUFBO0lBQUEsVUFBQSxHQUFpQixJQUFBLFNBQUEsQ0FDaEI7TUFBQSxLQUFBLEVBQU8sS0FBUDtNQUNBLFVBQUEsRUFBWSxVQURaO01BRUEsS0FBQSxFQUFPLG9CQUZQO0tBRGdCO0lBSWpCLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBTSxDQUFDLFlBQXJCLEVBQW1DLFdBQW5DO1dBQ0EsVUFBVSxDQUFDLEtBQVgsQ0FBQTtFQU5jO0VBUWYsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsU0FBakIsRUFBNEIsU0FBQyxFQUFEO1dBQzNCLFlBQUEsQ0FBYSxNQUFiLEVBQXFCO01BQUMsU0FBQSxFQUFXLENBQUMsRUFBYjtLQUFyQjtFQUQyQixDQUE1QjtFQUdBLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLFVBQWpCLEVBQTZCLFNBQUMsRUFBRDtXQUM1QixZQUFBLENBQWEsTUFBYixFQUFxQjtNQUFDLFNBQUEsRUFBVyxFQUFaO0tBQXJCO0VBRDRCLENBQTdCO0VBR0EsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsT0FBakIsRUFBMEIsU0FBQyxFQUFEO1dBQ3pCLFlBQUEsQ0FBYSxNQUFiLEVBQXFCO01BQUMsU0FBQSxFQUFXLEVBQVo7S0FBckI7RUFEeUIsQ0FBMUI7RUFHQSxNQUFNLENBQUMsRUFBUCxDQUFVLE1BQU0sQ0FBQyxTQUFqQixFQUE0QixTQUFDLEVBQUQ7V0FDM0IsWUFBQSxDQUFhLE1BQWIsRUFBcUI7TUFBQyxTQUFBLEVBQVcsQ0FBQyxFQUFiO0tBQXJCO0VBRDJCLENBQTVCO0FBR0EsU0FBTztBQXhEYzs7OztBQ0F0QixPQUFPLENBQUMsV0FBUixHQUFzQixTQUFBO0FBRXJCLE1BQUE7RUFBQSxTQUFBLEdBQWdCLElBQUEsS0FBQSxDQUNmO0lBQUEsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUFkO0lBQ0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxNQURmO0lBRUEsZUFBQSxFQUFpQixTQUZqQjtHQURlO0VBSWhCLFNBQVMsQ0FBQyxLQUFWLEdBQWtCO0VBR2xCLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FDWjtJQUFBLFVBQUEsRUFBWSxTQUFaO0lBQ0EsQ0FBQSxFQUFHLEVBREg7SUFFQSxDQUFBLEVBQUcsR0FGSDtJQUdBLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FBVixHQUFrQixFQUh6QjtJQUlBLE1BQUEsRUFBUSxTQUFTLENBQUMsTUFBVixHQUFtQixHQUozQjtJQUtBLGVBQUEsRUFBaUIsTUFMakI7SUFNQSxZQUFBLEVBQWMsQ0FOZDtHQURZO0VBU2IsTUFBTSxDQUFDLEtBQVAsR0FDQztJQUFBLFNBQUEsRUFBVyxRQUFYO0lBQ0EsUUFBQSxFQUFVLE1BRFY7SUFFQSxLQUFBLEVBQU8sT0FGUDtJQUdBLFVBQUEsRUFBWSxNQUhaO0lBSUEsVUFBQSxFQUFlLE1BQU0sQ0FBQyxNQUFSLEdBQWUsSUFKN0I7O0VBTUQsTUFBTSxDQUFDLElBQVAsR0FBYztFQUVkLE1BQU0sQ0FBQyxFQUFQLENBQVUsTUFBTSxDQUFDLEdBQWpCLEVBQXNCLFNBQUMsRUFBRDtXQUNyQixNQUFNLENBQUMsT0FBUCxDQUNDO01BQUEsVUFBQSxFQUNDO1FBQUEsS0FBQSxFQUFPLEdBQVA7T0FERDtNQUVBLEtBQUEsRUFBTyxvQkFGUDtLQUREO0VBRHFCLENBQXRCO0VBTUEsTUFBTSxDQUFDLEVBQVAsQ0FBVSxNQUFNLENBQUMsU0FBakIsRUFBNEIsU0FBQyxFQUFEO1dBQzNCLE1BQU0sQ0FBQyxPQUFQLENBQ0M7TUFBQSxVQUFBLEVBQ0M7UUFBQSxLQUFBLEVBQU8sR0FBUDtPQUREO01BRUEsS0FBQSxFQUFPLG9CQUZQO0tBREQ7RUFEMkIsQ0FBNUI7QUFNQSxTQUFPO0FBdkNjIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJEcmFnZ2FibGUrRG91YmxlVGFwXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMTI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIxMDBweFwiLFxuXHRcdHBhZGRpbmdUb3A6IFwiMzAwcHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiRHJhZyB0aGUgbGF5ZXIsIG9yIGRvdWJsZSB0YXA8YnIvPnRvIHNjYWxlIHVwIGFuZCBkb3duXCJcblx0XG5cdGxheWVyQS5kcmFnZ2FibGUuZW5hYmxlZCA9IHRydWVcblxuXHRsYXllckEub24gRXZlbnRzLkRvdWJsZVRhcCwgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogaWYgbGF5ZXJBLnNjYWxlID09IDAuNSB0aGVuIDEuMCBlbHNlIDAuNVxuXHRcdFx0Y3VydmU6IFwiZWFzZVwiXG5cdFx0XHR0aW1lOiAwLjVcblx0XHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJjbGFzcyBleHBvcnRzLk5hdmlnYXRpb25Db21wb25lbnQgZXh0ZW5kcyBMYXllclxuXHRcblx0I2lPUyBhbmltYXRpb24gY29uc3RhbnRzXG5cdF9BTklNQVRJT05fVElNRSBcdFx0XHQ9IDAuNFxuXHRfQU5JTUFUSU9OX0NVUlZFIFx0XHRcdD0gXCJjdWJpYy1iZXppZXIoLjYsIC4xLCAuMywgMSlcIlxuXHRfTEVGVF9QQURESU5HIFx0XHRcdFx0PSBpZiBGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUuaW5kZXhPZihcImlwaG9uZS02cGx1c1wiKSBpcyAtMSB0aGVuIDQ2IGVsc2UgNjlcblx0XG5cdCNDdXN0b20gZXZlbnRzXG5cdEV2ZW50cy5OYXZpZ2F0aW9uV2lsbFB1c2ggXHQ9IFwibmF2aWdhdGlvbldpbGxQdXNoXCJcblx0RXZlbnRzLk5hdmlnYXRpb25EaWRQdXNoIFx0PSBcIm5hdmlnYXRpb25EaWRQdXNoXCJcblx0RXZlbnRzLk5hdmlnYXRpb25XaWxsUG9wIFx0PSBcIm5hdmlnYXRpb25XaWxsUG9wXCJcblx0RXZlbnRzLk5hdmlnYXRpb25EaWRQb3AgXHQ9IFwibmF2aWdhdGlvbkRpZFBvcFwiXG5cdFxuXHQjIFNoYXJlZCBjbGFzcyB2YXJpYWJsZXNcdFx0XG5cdG5hdmlnYXRpb25Db21wb25lbnRzQ291bnRlciA9IDFcblx0XG5cdCMgUHVibGljIGNvbnN0cnVjdG9yXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHQjIENoZWNrIHJlcXVpcmVkIHBhcmFtc1xuXHRcdGlmIG5vdCBAb3B0aW9ucy5yb290TGF5ZXJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbid0IGluaXRpYWxpemUgTmF2aWdhdGlvbkNvbXBvbmVudDogcGFyYW1ldGVyICdyb290TGF5ZXInIGlzIHJlcXVpcmVkLlwiKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRAb3B0aW9ucy53aWR0aCAgICAgICAgICAgPz0gU2NyZWVuLndpZHRoXG5cdFx0QG9wdGlvbnMuaGVpZ2h0ICAgICAgICAgID89IFNjcmVlbi5oZWlnaHRcblx0XHRAb3B0aW9ucy5jbGlwICAgICAgICAgICAgPz0gdHJ1ZVxuXHRcdEBvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcInRyYW5zcGFyZW50XCJcblx0XHRAb3B0aW9ucy5uYW1lIFx0XHRcdCA/PSBcIk5hdmlnYXRpb24gQ29tcG9uZW50IFwiICsgbmF2aWdhdGlvbkNvbXBvbmVudHNDb3VudGVyXG5cblx0XHRzdXBlciBAb3B0aW9uc1xuXHRcdFxuXHRcdG5hdmlnYXRpb25Db21wb25lbnRzQ291bnRlcisrXG5cblx0XHRAbmF2aWdhdGlvbkxheWVycyAgID0gW11cblx0XHRAaGVhZGVyTGF5ZXIgXHRcdD0gbnVsbFxuXHRcdEBhbmltYXRpb25UaW1lIFx0XHQ9IEBvcHRpb25zLmFuaW1hdGlvblRpbWUgb3IgX0FOSU1BVElPTl9USU1FXG5cdFx0QGFuaW1hdGlvbkN1cnZlXHRcdD0gQG9wdGlvbnMuYW5pbWF0aW9uQ3VydmUgb3IgX0FOSU1BVElPTl9DVVJWRVxuXHRcdEBhbmltYXRpb25QdXNoIFx0XHQ9IEBvcHRpb25zLmFuaW1hdGlvblB1c2ggb3IgQF9kZWZhdWx0QW5pbWF0aW9uUHVzaFxuXHRcdEBhbmltYXRpb25Qb3BcdFx0PSBAb3B0aW9ucy5hbmltYXRpb25Qb3Agb3IgQF9kZWZhdWx0QW5pbWF0aW9uUG9wXG5cdFx0QGN1cnJlbnRMYXllckluZGV4IFx0PSAtMVxuXHRcdEBsb2NrIFx0XHRcdFx0PSBmYWxzZVxuXHRcdEBjdXN0b21IZWFkZXIgXHRcdD0gZmFsc2Vcblx0XHRcblx0XHRpZiBAb3B0aW9ucy5oZWFkZXJMYXllclxuXHRcdFx0QGhlYWRlckxheWVyID0gQG9wdGlvbnMuaGVhZGVyTGF5ZXJcblx0XHRcdEBhZGRTdWJMYXllcihAaGVhZGVyTGF5ZXIpXG5cdFx0XHRAY3VzdG9tSGVhZGVyID0gdHJ1ZVxuXHRcdGVsc2UgIyBEZWZhdWx0IGlPUzcgaGVhZGVyXG5cdFx0XHRAaGVhZGVyTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0c3VwZXJMYXllcjogQFxuXHRcdFx0XHRuYW1lOiBcIkhlYWRlciBMYXllclwiXG5cdFx0XHRcdHdpZHRoOiBAd2lkdGhcblx0XHRcdFx0aGVpZ2h0OiA4OFxuXHRcdFx0XHRjbGlwOiBmYWxzZVxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyNDgsIDI0OCwgMjQ4LCAwLjkpXCJcblx0XHRcdEBoZWFkZXJMYXllci5zdHlsZVtcImJhY2tncm91bmQtaW1hZ2VcIl0gPSBcImxpbmVhci1ncmFkaWVudCgwZGVnLCByZ2IoMjAwLCAxOTksIDIwNCksIHJnYigyMDAsIDE5OSwgMjA0KSA1MCUsIHRyYW5zcGFyZW50IDUwJSlcIlxuXHRcdFx0QGhlYWRlckxheWVyLnN0eWxlW1wiYmFja2dyb3VuZC1zaXplXCJdID0gXCIxMDAlIDFweFwiXG5cdFx0XHRAaGVhZGVyTGF5ZXIuc3R5bGVbXCJiYWNrZ3JvdW5kLXJlcGVhdFwiXSA9IFwibm8tcmVwZWF0XCJcblx0XHRcdEBoZWFkZXJMYXllci5zdHlsZVtcImJhY2tncm91bmQtcG9zaXRpb25cIl0gPSBcImJvdHRvbVwiXG5cdFx0XHRcblx0XHRcdHRpdGxlTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0c3VwZXJMYXllcjogQGhlYWRlckxheWVyXG5cdFx0XHRcdG5hbWU6IFwiVGl0bGUgTGF5ZXJcIlxuXHRcdFx0XHR3aWR0aDogQGhlYWRlckxheWVyLndpZHRoIC8gMlxuXHRcdFx0XHRoZWlnaHQ6IEBoZWFkZXJMYXllci5oZWlnaHRcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdFx0XHR0aXRsZUxheWVyLmNlbnRlclgoKVxuXHRcdFx0dGl0bGVMYXllci5zdHlsZSA9XG5cdFx0XHRcdFwiZm9udC1zaXplXCIgOiBcIjM0cHhcIlxuXHRcdFx0XHRcImNvbG9yXCIgOiBcImJsYWNrXCJcblx0XHRcdFx0XCJsaW5lLWhlaWdodFwiIDogQGhlYWRlckxheWVyLmhlaWdodCArIFwicHhcIlxuXHRcdFx0XHRcImZvbnQtd2VpZ2h0XCIgOiBcIjUwMFwiXG5cdFx0XHRcdFwidGV4dC1hbGlnblwiIDogXCJjZW50ZXJcIlxuXHRcdFx0XHRcImZvbnQtZmFtaWx5XCI6IFwiJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZlwiXG5cdFx0XHRcdFwid2hpdGUtc3BhY2VcIjogXCJub3dyYXBcIlxuXHRcdFx0XHRcImhlaWdodFwiIDogQGhlYWRlckxheWVyLmhlaWdodCArIFwicHhcIlxuXG5cdFx0XHRsZWZ0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0c3VwZXJMYXllcjogQGhlYWRlckxheWVyXG5cdFx0XHRcdG5hbWU6IFwiTGVmdCBMYXllclwiXG5cdFx0XHRcdHdpZHRoOiAxNDBcblx0XHRcdFx0aGVpZ2h0OiBAaGVhZGVyTGF5ZXIuaGVpZ2h0XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHg6IF9MRUZUX1BBRERJTkdcblx0XHRcdGxlZnRMYXllci5zdHlsZSA9XG5cdFx0XHRcdFwiZm9udC1zaXplXCIgOiBcIjM0cHhcIlxuXHRcdFx0XHRcImNvbG9yXCIgOiBcInJnYigyMSwgMTI1LCAyNTEpXCJcblx0XHRcdFx0XCJsaW5lLWhlaWdodFwiIDogQGhlYWRlckxheWVyLmhlaWdodCArIFwicHhcIlxuXHRcdFx0XHRcImZvbnQtd2VpZ2h0XCIgOiBcIjMwMFwiXG5cdFx0XHRcdFwidGV4dC1hbGlnblwiIDogXCJsZWZ0XCJcblx0XHRcdFx0XCJmb250LWZhbWlseVwiOiBcIidIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWZcIlxuXHRcdFx0XHRcIndoaXRlLXNwYWNlXCI6IFwibm93cmFwXCJcblx0XHRcdFx0XCJoZWlnaHRcIiA6IEBoZWFkZXJMYXllci5oZWlnaHQgKyBcInB4XCJcblx0XHRcdGxlZnRMYXllci5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdEBwb3AoKVxuXG5cdFx0XHRiYWNrQXJyb3cgPSBuZXcgTGF5ZXJcblx0XHRcdFx0c3VwZXJMYXllcjogQGhlYWRlckxheWVyXG5cdFx0XHRcdG5hbWU6IFwiQmFjayBBcnJvd1wiXG5cdFx0XHRcdG9yaWdpblg6IDBcblx0XHRcdFx0b3JpZ2luWTogMFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRodG1sOiBcIjxzdmcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB4PScwcHgnIHk9JzBweCcgd2lkdGg9JzQ2cHgnIGhlaWdodD0nODhweCcgdmlld0JveD0nMCAwIDQ2IDg4JyBlbmFibGUtYmFja2dyb3VuZD0nbmV3IDAgMCA0NiA4OCcgeG1sOnNwYWNlPSdwcmVzZXJ2ZSc+IDxwb2x5Z29uIGZpbGw9JyMxNTdERkInIHBvaW50cz0nMzYuNTEsNjQuNTEgNDAuNjEsNjAuNCAyNC4yLDQ0IDQwLjYxLDI3LjU5IDM2LjUxLDIzLjQ5IDIwLjEsMzkuOSAxNiw0NCAyMC4xLDQ4LjEgMjAuMSw0OC4xICcvPiA8L3N2Zz5cIlxuXHRcdFx0YmFja0Fycm93Lm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdFx0QHBvcCgpXG5cdFx0XHRcblx0XHRcdEBoZWFkZXJMYXllci50aXRsZUxheWVyID0gdGl0bGVMYXllclxuXHRcdFx0QGhlYWRlckxheWVyLmJhY2tBcnJvdyA9IGJhY2tBcnJvd1xuXHRcdFx0QGhlYWRlckxheWVyLmxlZnRMYXllciA9IGxlZnRMYXllclxuXHRcdFx0XG5cdFx0XHRpZiBGcmFtZXIuRGV2aWNlLmRldmljZVR5cGUuaW5kZXhPZihcImlwaG9uZS02cGx1c1wiKSA+PSAwXG5cdFx0XHRcdEBoZWFkZXJMYXllci5oZWlnaHQgPSAxMzJcblx0XHRcdFx0dGl0bGVMYXllci5oZWlnaHQgPSAxMzJcblx0XHRcdFx0dGl0bGVMYXllci5zdHlsZVtcImZvbnQtc2l6ZVwiXSA9IFwiNDhweFwiXG5cdFx0XHRcdHRpdGxlTGF5ZXIuc3R5bGVbXCJsaW5lLWhlaWdodFwiXSA9IHRpdGxlTGF5ZXIuaGVpZ2h0ICsgXCJweFwiXG5cdFx0XHRcdGxlZnRMYXllci5oZWlnaHQgPSAxMzJcblx0XHRcdFx0bGVmdExheWVyLnN0eWxlW1wiZm9udC1zaXplXCJdID0gXCI0OHB4XCJcblx0XHRcdFx0bGVmdExheWVyLnN0eWxlW1wibGluZS1oZWlnaHRcIl0gPSB0aXRsZUxheWVyLmhlaWdodCArIFwicHhcIlxuXHRcdFx0XHRsZWZ0TGF5ZXIud2lkdGggPSBsZWZ0TGF5ZXIud2lkdGggKiAxLjVcblx0XHRcdFx0YmFja0Fycm93LnNjYWxlID0gMS41XG5cdFx0XHRcdFxuXHRcdGlmIEBvcHRpb25zLnJvb3RMYXllclxuXHRcdFx0QG5hdmlnYXRpb25MYXllcnMgPSBbQG9wdGlvbnMucm9vdExheWVyXVxuXHRcdFx0QGN1cnJlbnRMYXllckluZGV4ID0gMFxuXHRcdFx0QGFkZFN1YkxheWVyKEBvcHRpb25zLnJvb3RMYXllcilcblx0XHRcdEBoZWFkZXJMYXllci5icmluZ1RvRnJvbnQoKVxuXHRcdFx0aWYgQG9wdGlvbnMucm9vdExheWVyLnRpdGxlIGFuZCBAaGVhZGVyTGF5ZXIudGl0bGVMYXllclxuXHRcdFx0XHRAaGVhZGVyTGF5ZXIudGl0bGVMYXllci5odG1sID0gXCI8ZGl2IHN0eWxlPVxcXCJvdmVyZmxvdzogaGlkZGVuOyB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpc1xcXCI+XCIgKyBAb3B0aW9ucy5yb290TGF5ZXIudGl0bGUgKyBcIjwvZGl2PlwiXG5cblx0IyBQdWJsaWMgbWV0aG9kc1xuXHRwdXNoOiAobGF5ZXIpIC0+XG5cdFx0aWYgbm90IEBsb2NrXG5cdFx0XHRAZW1pdChFdmVudHMuTmF2aWdhdGlvbldpbGxQdXNoLCB7bmF2aWdhdGlvbkxheWVyOiBALCBjdXJyZW50TGF5ZXI6IGN1cnJlbnRMYXllciwgbmV4dExheWVyOiBuZXh0TGF5ZXJ9KVxuXHRcdFx0QGxvY2sgPSB0cnVlXG5cdFx0XHRAbmF2aWdhdGlvbkxheWVycy5wdXNoKGxheWVyKVxuXHRcdFx0QGFkZFN1YkxheWVyKGxheWVyKVxuXHRcdFx0aWYgQGhlYWRlckxheWVyXG5cdFx0XHRcdEBoZWFkZXJMYXllci5icmluZ1RvRnJvbnQoKVxuXHRcdFx0Y3VycmVudExheWVyID0gQG5hdmlnYXRpb25MYXllcnNbQGN1cnJlbnRMYXllckluZGV4XVxuXHRcdFx0bmV4dExheWVyID0gbGF5ZXJcblx0XHRcdGlmIHR5cGVvZiBjdXJyZW50TGF5ZXIubGF5ZXJXaWxsRGlzYXBwZWFyIGlzIFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRjdXJyZW50TGF5ZXIubGF5ZXJXaWxsRGlzYXBwZWFyKClcblx0XHRcdGlmIHR5cGVvZiBuZXh0TGF5ZXIubGF5ZXJXaWxsQXBwZWFyIGlzIFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRuZXh0TGF5ZXIubGF5ZXJXaWxsQXBwZWFyKClcblx0XHRcdEBjdXJyZW50TGF5ZXJJbmRleCsrXG5cdFx0XHRAYW5pbWF0aW9uUHVzaChjdXJyZW50TGF5ZXIsIG5leHRMYXllcilcblx0XHRcdEBfZGVmYXVsdEhlYWRlckFuaW1hdGlvblB1c2goY3VycmVudExheWVyLCBuZXh0TGF5ZXIpXG5cdFx0XHRVdGlscy5kZWxheSBAYW5pbWF0aW9uVGltZSwgPT5cblx0XHRcdFx0Y3VycmVudExheWVyLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0XHRAbG9jayA9IGZhbHNlXG5cdFx0XHRcdEBlbWl0KEV2ZW50cy5OYXZpZ2F0aW9uRGlkUHVzaCwge25hdmlnYXRpb25MYXllcjogQCwgY3VycmVudExheWVyOiBjdXJyZW50TGF5ZXIsIG5leHRMYXllcjogbmV4dExheWVyfSlcblx0XHRlbHNlXG5cdFx0XHQjIElmIHRoZXJlIHdhcyBhIHRyYW5zaXRpb25pbmcgZ29pbmcgb24sIGp1c3QgcmVtb3ZlIHRoZSBuZXcgbGF5ZXJcblx0XHRcdGxheWVyLmRlc3Ryb3koKVxuXHRcdFxuXHRwb3A6IC0+XG5cdFx0QHBvcFRvTGF5ZXJBdEluZGV4KEBjdXJyZW50TGF5ZXJJbmRleCAtIDEpXG5cblx0cG9wVG9Sb290TGF5ZXI6IC0+XG5cdFx0QHBvcFRvTGF5ZXJBdEluZGV4KDApXG5cblx0cG9wVG9MYXllckF0SW5kZXg6IChpbmRleCkgLT5cblx0XHRpZiBub3QgQGxvY2tcblx0XHRcdEBsb2NrID0gdHJ1ZVxuXHRcdFx0aWYgQGN1cnJlbnRMYXllckluZGV4ID4gMCBhbmQgKDAgPD0gaW5kZXggPD0gQG5hdmlnYXRpb25MYXllcnMubGVuZ3RoKVxuXHRcdFx0XHRAZW1pdChFdmVudHMuTmF2aWdhdGlvbldpbGxQb3AsIHtuYXZpZ2F0aW9uTGF5ZXI6IEAsIGluZGV4OiBpbmRleCwgY3VycmVudExheWVyOiBjdXJyZW50TGF5ZXIsIG5leHRMYXllcjogbmV4dExheWVyfSlcblx0XHRcdFx0Y3VycmVudExheWVyID0gQG5hdmlnYXRpb25MYXllcnNbQGN1cnJlbnRMYXllckluZGV4XVxuXHRcdFx0XHRuZXh0TGF5ZXIgPSBAbmF2aWdhdGlvbkxheWVyc1tpbmRleF1cblx0XHRcdFx0bmV4dExheWVyLnZpc2libGUgPSB0cnVlXG5cdFx0XHRcdGlmIHR5cGVvZiBjdXJyZW50TGF5ZXIubGF5ZXJXaWxsRGlzYXBwZWFyIGlzIFwiZnVuY3Rpb25cIlxuXHRcdFx0XHRcdGN1cnJlbnRMYXllci5sYXllcldpbGxEaXNhcHBlYXIoKVxuXHRcdFx0XHRpZiB0eXBlb2YgbmV4dExheWVyLmxheWVyV2lsbEFwcGVhciBpcyBcImZ1bmN0aW9uXCJcblx0XHRcdFx0XHRuZXh0TGF5ZXIubGF5ZXJXaWxsQXBwZWFyKClcblx0XHRcdFx0QGFuaW1hdGlvblBvcChjdXJyZW50TGF5ZXIsIG5leHRMYXllcilcblx0XHRcdFx0QF9kZWZhdWx0SGVhZGVyQW5pbWF0aW9uUG9wKGN1cnJlbnRMYXllciwgbmV4dExheWVyLCBpbmRleClcblx0XHRcdFx0VXRpbHMuZGVsYXkgQGFuaW1hdGlvblRpbWUsID0+XG5cdFx0XHRcdFx0Zm9yIGluZGV4VG9CZURlbGV0ZWQgaW4gW0BuYXZpZ2F0aW9uTGF5ZXJzLmxlbmd0aC0xLi5pbmRleCsxXVxuXHRcdFx0XHRcdFx0bGF5ZXJUb0JlRGVsZXRlZCA9IEBuYXZpZ2F0aW9uTGF5ZXJzW2luZGV4VG9CZURlbGV0ZWRdXG5cdFx0XHRcdFx0XHRsYXllclRvQmVEZWxldGVkLmRlc3Ryb3koKVxuXHRcdFx0XHRcdFx0QG5hdmlnYXRpb25MYXllcnMucG9wKClcblx0XHRcdFx0XHRAY3VycmVudExheWVySW5kZXggPSBpbmRleFxuXHRcdFx0XHRcdEBsb2NrID0gZmFsc2Vcblx0XHRcdFx0XHRAZW1pdChFdmVudHMuTmF2aWdhdGlvbkRpZFBvcCwge25hdmlnYXRpb25MYXllcjogQCwgaW5kZXg6IGluZGV4LCBjdXJyZW50TGF5ZXI6IGN1cnJlbnRMYXllciwgbmV4dExheWVyOiBuZXh0TGF5ZXJ9KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAbG9jayA9IGZhbHNlXG5cblx0IyBQcml2YXRlIG1ldGhvZHNcblxuXHRfYW5pbWF0ZUhlYWRlclN1YkxheWVyOiAoc3ViTGF5ZXJOYW1lLCBmcm9tTGF5ZXIsIHRvTGF5ZXIsIG5ld1RpdGxlLCBjdXJyZW50VG9YLCBuZXdGcm9tWCkgLT5cblx0XHRpZiBAaGVhZGVyTGF5ZXJbc3ViTGF5ZXJOYW1lXVxuXHRcdFx0aGVhZGVyU3ViTGF5ZXIgPSBAaGVhZGVyTGF5ZXJbc3ViTGF5ZXJOYW1lXVxuXHRcdFx0b3JpZ1N1YkxheWVyWCA9IGhlYWRlclN1YkxheWVyLnhcblx0XHRcdFx0XG5cdFx0XHQjIEFuaW1hdGUgY3VycmVudCBzdWJsYXllclxuXHRcdFx0aGVhZGVyU3ViTGF5ZXIuYW5pbWF0ZVxuXHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0XHR4OiBjdXJyZW50VG9YXG5cdFx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdFx0XG5cdFx0XHQjQ3JlYXRlIG5ldyBsYXllciB0byBhbmltYXRlXG5cdFx0XHRpZiBuZXdUaXRsZSBpc250IHVuZGVmaW5lZFxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllciA9IGhlYWRlclN1YkxheWVyLmNvcHkoKVxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllci5zdHlsZSA9IGhlYWRlclN1YkxheWVyLnN0eWxlXG5cdFx0XHRcdEBoZWFkZXJMYXllci5hZGRTdWJMYXllcihuZXdIZWFkZXJTdWJMYXllcilcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXIubmFtZSA9IFwidG1wIFwiICsgc3ViTGF5ZXJOYW1lXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyLnggPSBuZXdGcm9tWFxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllci5vcGFjaXR5ID0gMFxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllci5odG1sID0gXCI8ZGl2IHN0eWxlPVxcXCJvdmVyZmxvdzogaGlkZGVuOyB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpc1xcXCI+XCIgKyBuZXdUaXRsZSArIFwiPC9kaXY+XCJcblx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXJBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdFx0bGF5ZXI6IG5ld0hlYWRlclN1YkxheWVyXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0XHRcdHg6IG9yaWdTdWJMYXllclhcblx0XHRcdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdFx0XHRuZXdIZWFkZXJTdWJMYXllckFuaW1hdGlvbi5zdGFydCgpXG5cdFx0XHRcdG5ld0hlYWRlclN1YkxheWVyQW5pbWF0aW9uLm9uIFwiZW5kXCIsIC0+XG5cdFx0XHRcdFx0aGVhZGVyU3ViTGF5ZXIuaHRtbCA9IG5ld0hlYWRlclN1YkxheWVyLmh0bWxcblx0XHRcdFx0XHRoZWFkZXJTdWJMYXllci5vcGFjaXR5ID0gMVxuXHRcdFx0XHRcdGhlYWRlclN1YkxheWVyLnggPSBvcmlnU3ViTGF5ZXJYXG5cdFx0XHRcdFx0bmV3SGVhZGVyU3ViTGF5ZXIuZGVzdHJveSgpXG5cblx0X2RlZmF1bHRIZWFkZXJBbmltYXRpb25QdXNoOiAoZnJvbUxheWVyLCB0b0xheWVyKS0+XG5cdFx0aWYgQGhlYWRlckxheWVyIGFuZCBub3QgQGN1c3RvbUhlYWRlclxuXHRcdFx0XG5cdFx0XHRAX2FuaW1hdGVIZWFkZXJTdWJMYXllcihcInRpdGxlTGF5ZXJcIiwgZnJvbUxheWVyLCB0b0xheWVyLCB0b0xheWVyLnRpdGxlLCAtX0xFRlRfUEFERElORywgQGhlYWRlckxheWVyLndpZHRoKVxuXG5cdFx0XHRAX2FuaW1hdGVIZWFkZXJTdWJMYXllcihcImxlZnRMYXllclwiLCBmcm9tTGF5ZXIsIHRvTGF5ZXIsIGZyb21MYXllci50aXRsZSwgLSBAaGVhZGVyTGF5ZXIud2lkdGggLyAyLCBAaGVhZGVyTGF5ZXIud2lkdGggLyAyKVxuXG5cdFx0XHRpZiBAaGVhZGVyTGF5ZXIuYmFja0Fycm93XG5cdFx0XHRcdEBoZWFkZXJMYXllci5iYWNrQXJyb3cuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblxuXHRfZGVmYXVsdEhlYWRlckFuaW1hdGlvblBvcDogKGZyb21MYXllciwgdG9MYXllciwgaW5kZXgpLT5cblx0XHQjQW5pbWF0ZSBoZWFkZXJcblx0XHRpZiBAaGVhZGVyTGF5ZXIgYW5kIG5vdCBAY3VzdG9tSGVhZGVyXG5cblx0XHRcdEBfYW5pbWF0ZUhlYWRlclN1YkxheWVyKFwidGl0bGVMYXllclwiLCBmcm9tTGF5ZXIsIHRvTGF5ZXIsIHRvTGF5ZXIudGl0bGUsIEBoZWFkZXJMYXllci53aWR0aCwgMClcblx0XHRcdFxuXHRcdFx0bmV3TGVmdExheWVyVGl0bGUgPSBcIlwiXG5cdFx0XHRpZiBAbmF2aWdhdGlvbkxheWVyc1tpbmRleCAtIDFdIGFuZCBAbmF2aWdhdGlvbkxheWVyc1tpbmRleCAtIDFdLnRpdGxlXG5cdFx0XHRcdG5ld0xlZnRMYXllclRpdGxlID0gQG5hdmlnYXRpb25MYXllcnNbaW5kZXggLSAxXS50aXRsZVxuXHRcdFx0ZWxzZSBcblx0XHRcdFx0aWYgQGhlYWRlckxheWVyLmJhY2tBcnJvd1xuXHRcdFx0XHRcdEBoZWFkZXJMYXllci5iYWNrQXJyb3cuYW5pbWF0ZVxuXHRcdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdFx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXHRcdFx0QF9hbmltYXRlSGVhZGVyU3ViTGF5ZXIoXCJsZWZ0TGF5ZXJcIiwgZnJvbUxheWVyLCB0b0xheWVyLCBuZXdMZWZ0TGF5ZXJUaXRsZSwgQGhlYWRlckxheWVyLndpZHRoIC8gMiwgLUBoZWFkZXJMYXllci53aWR0aCAvIDIpXG5cdFx0XHRcblxuXHRfZGVmYXVsdEFuaW1hdGlvblB1c2g6IChmcm9tTGF5ZXIsIHRvTGF5ZXIpIC0+XG5cdFx0c2hhZG93TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHN1cGVyTGF5ZXI6IGZyb21MYXllclxuXHRcdFx0d2lkdGg6IGZyb21MYXllci53aWR0aFxuXHRcdFx0aGVpZ2h0OiBmcm9tTGF5ZXIuaGVpZ2h0XG5cdFx0XHRuYW1lOiBcInNoYWRvd0xheWVyXCJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJibGFja1wiXG5cdFx0XHRvcGFjaXR5OiAwXG5cdFx0c2hhZG93TGF5ZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMC4yXG5cdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0ZnJvbUxheWVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IC1Ad2lkdGggKiAwLjI1XG5cdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0dG9MYXllci5zaGFkb3dDb2xvciA9IFwicmdiYSgwLDAsMCwwLjIpXCJcblx0XHR0b0xheWVyLnNoYWRvd1ggPSAtMTBcblx0XHR0b0xheWVyLnNoYWRvd0JsdXIgPSAxNFxuXHRcdHRvTGF5ZXIueCA9IEB3aWR0aCArICgtdG9MYXllci5zaGFkb3dYKVxuXHRcdHRvTGF5ZXIuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0eDogMFxuXHRcdFx0Y3VydmU6IF9BTklNQVRJT05fQ1VSVkVcblx0XHRcdHRpbWU6IF9BTklNQVRJT05fVElNRVxuXG5cdFx0XHRcblx0X2RlZmF1bHRBbmltYXRpb25Qb3A6IChmcm9tTGF5ZXIsIHRvTGF5ZXIpIC0+XG5cdFx0ZnJvbUxheWVyLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHg6IEB3aWR0aCArICgtZnJvbUxheWVyLnNoYWRvd1gpXG5cdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0dG9MYXllci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRjdXJ2ZTogX0FOSU1BVElPTl9DVVJWRVxuXHRcdFx0dGltZTogX0FOSU1BVElPTl9USU1FXG5cdFx0c2hhZG93TGF5ZXIgPSB0b0xheWVyLnN1YkxheWVyc0J5TmFtZShcInNoYWRvd0xheWVyXCIpWzBdXG5cdFx0c2hhZG93TGF5ZXJBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRsYXllcjogc2hhZG93TGF5ZXJcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGN1cnZlOiBfQU5JTUFUSU9OX0NVUlZFXG5cdFx0XHR0aW1lOiBfQU5JTUFUSU9OX1RJTUVcblx0XHRzaGFkb3dMYXllckFuaW1hdGlvbi5zdGFydCgpXG5cdFx0c2hhZG93TGF5ZXJBbmltYXRpb24ub24gXCJlbmRcIiwgLT5cblx0XHRcdHNoYWRvd0xheWVyLmRlc3Ryb3koKVxuXHRcdCIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJQYW5cIlxuXHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0cGFuRGlyZWN0aW9uID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IDE4MFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdHBhbkRpcmVjdGlvbi5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiODVweFwiXG5cdFx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMzA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMzI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiUGFuIGluIGFueSBkaXJlY3Rpb25cIlxuXHRcblx0Z2V0UGFyYW1zID0gKGV2KSAtPlxuXHRcdHJldHVybiBcIiwgRGlzdDpcIiArIGV2LmRpc3RhbmNlLnRvRml4ZWQoMikgKyBcInB4LCBWZWw6XCIgKyBldi52ZWxvY2l0eS50b0ZpeGVkKDIpICsgXCJweC9zZWM8YnIvPlRpbWU6XCIgKyBldi5kZWx0YVRpbWUudG9GaXhlZCgyKSArIFwic2VjXCJcblxuXHRsYXllckEub24gRXZlbnRzLlBhbkxlZnQsIChldikgLT5cblx0XHRwYW5EaXJlY3Rpb24uaHRtbCA9IFwiTGVmdFwiICsgZ2V0UGFyYW1zKGV2KVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5QYW5SaWdodCwgKGV2KSAtPlxuXHRcdHBhbkRpcmVjdGlvbi5odG1sID0gXCJSaWdodFwiICsgZ2V0UGFyYW1zKGV2KVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5QYW5VcCwgKGV2KSAtPlxuXHRcdHBhbkRpcmVjdGlvbi5odG1sID0gXCJVcFwiICsgZ2V0UGFyYW1zKGV2KVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5QYW5Eb3duLCAoZXYpIC0+XG5cdFx0cGFuRGlyZWN0aW9uLmh0bWwgPSBcIkRvd25cIiArIGdldFBhcmFtcyhldilcblx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlBpbmNoK1JvdGF0ZVwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlBpbmNoIGFuZCByb3RhdGUgdGhpcyBsYXllclwiXG5cblx0cGluY2hSb3RhdGVFbmQgPSAoZXYpIC0+XG5cdFx0c2NhbGUgPSBldi5zY2FsZVxuXHRcdGlmIGxheWVyQS5zY2FsZSA8IDFcblx0XHRcdGxheWVyQS5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRcdHNjYWxlID0gMVxuXHRcdGxheWVyQS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRyb3RhdGlvbjogMDtcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFx0bGF5ZXJBLmh0bWwgPSBcIlNjYWxlOiBcIiArIHNjYWxlLnRvRml4ZWQoMikgKyBcIiwgUm90OiAwLjBcIlxuXG5cdFx0XG5cdGluaXRpYWxTY2FsZSA9IDFcblx0aW5pdGlhbFJvdGF0aW9uID0gMFxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5QaW5jaFN0YXJ0LCAoZXYpIC0+XG5cdFx0aW5pdGlhbFNjYWxlID0gbGF5ZXJBLnNjYWxlXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlJvdGF0ZVN0YXJ0LCAoZXYpIC0+XG5cdFx0aW5pdGlhbFJvdGF0aW9uID0gbGF5ZXJBLnJvdGF0aW9uXG5cblx0bGF5ZXJBLm9uIEV2ZW50cy5QaW5jaCwgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlU3RvcCgpXG5cdFx0bGF5ZXJBLnNjYWxlID0gZXYuc2NhbGUqaW5pdGlhbFNjYWxlXG5cdFx0bGF5ZXJBLmh0bWwgPSBcIlNjYWxlOiBcIiArIGV2LnNjYWxlLnRvRml4ZWQoMikgKyBcIiwgUm90OiBcIiArIGxheWVyQS5yb3RhdGlvbi50b0ZpeGVkKDIpXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlJvdGF0ZSwgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlU3RvcCgpXG5cdFx0bGF5ZXJBLnJvdGF0aW9uID0gZXYucm90YXRpb25cblx0XHRsYXllckEuaHRtbCA9IFwiU2NhbGU6IFwiICsgbGF5ZXJBLnNjYWxlLnRvRml4ZWQoMikgKyBcIiwgUm90OiBcIiArIGV2LnJvdGF0aW9uLnRvRml4ZWQoMilcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUGluY2hFbmQsIChldikgLT5cblx0XHRwaW5jaFJvdGF0ZUVuZChldilcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUm90YXRlRW5kLCAoZXYpIC0+XG5cdFx0cGluY2hSb3RhdGVFbmQoZXYpXG5cdFxuXHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiUGluY2hcIlxuXHRcblx0IyBDcmVhdGUgbGF5ZXJcblx0bGF5ZXJBID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAxMjhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZlwiXG5cdFx0Ym9yZGVyUmFkaXVzOiA4XG5cdFxuXHRsYXllckEuc3R5bGUgPVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIixcblx0XHRmb250U2l6ZTogXCI0MHB4XCIsXG5cdFx0Y29sb3I6IFwiYmxhY2tcIixcblx0XHRmb250V2VpZ2h0OiBcImJvbGRcIixcblx0XHRsaW5lSGVpZ2h0OiBcIiN7bGF5ZXJBLmhlaWdodH1weFwiXG5cdFx0XG5cdGxheWVyQS5odG1sID0gXCJQaW5jaCBvdmVyIHRoaXMgbGF5ZXJcIlxuXHRcdFxuXHQjIFdpdGggZHJhZ2dhYmxlIHRydWUgc29tZSBldmVudHMgYXJlIG1vcmUgZGlmZmljdWx0IHRvIHRyaWdnZXIsIGJ1dCB0aGV5IHdvcmtcblx0aW5pdGlhbFNjYWxlID0gMVxuXHRsYXllckEub24gRXZlbnRzLlBpbmNoU3RhcnQsIChldikgLT5cblx0XHRpbml0aWFsU2NhbGUgPSBsYXllckEuc2NhbGVcblx0bGF5ZXJBLm9uIEV2ZW50cy5QaW5jaEVuZCwgKGV2KSAtPlxuXHRcdGlmIGxheWVyQS5zY2FsZSA8IDFcblx0XHRcdGxheWVyQS5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRcdGxheWVyQS5odG1sID0gXCJTY2FsZTogMS4wXCJcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuUGluY2gsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVN0b3AoKVxuXHRcdGxheWVyQS5zY2FsZSA9IGV2LnNjYWxlKmluaXRpYWxTY2FsZVxuXHRcdGxheWVyQS5odG1sID0gXCJTY2FsZTogXCIgKyBldi5zY2FsZS50b0ZpeGVkKDIpXG5cdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJMb25nIHByZXNzXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMTA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMTI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiTG9uZyBwcmVzcyBvbiB0aGlzIGxheWVyXCJcblx0XHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5QcmVzcywgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRzY2FsZTogaWYgbGF5ZXJBLnNjYWxlID09IDAuNSB0aGVuIDEuMCBlbHNlIDAuNVxuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlJlbW92ZSBhbGwgbGlzdGVuZXJzXCJcblx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGV2ZW50TmFtZUxheWVyID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IDE4MFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGV2ZW50TmFtZUxheWVyLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCI4NXB4XCJcblxuXHRldmVudE5hbWVMYXllci5odG1sID0gXCJBbGwgbGlzdGVuZXJzIHdpbGwgYmUgcmVtb3ZlZCBhZnRlciAxMHNcIlxuXG5cdFx0XG5cdCMgQ3JlYXRlIGxheWVyXG5cdGxheWVyQSA9IG5ldyBMYXllclxuXHRcdHN1cGVyTGF5ZXI6IG1haW5MYXllclxuXHRcdHg6IDIwXG5cdFx0eTogMzA4XG5cdFx0d2lkdGg6IG1haW5MYXllci53aWR0aCAtIDQwXG5cdFx0aGVpZ2h0OiBtYWluTGF5ZXIuaGVpZ2h0IC0gMzI4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdGJvcmRlclJhZGl1czogOFxuXHRcblx0bGF5ZXJBLnN0eWxlID1cblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0Zm9udFNpemU6IFwiNDBweFwiLFxuXHRcdGNvbG9yOiBcImJsYWNrXCIsXG5cdFx0Zm9udFdlaWdodDogXCJib2xkXCIsXG5cdFx0bGluZUhlaWdodDogXCIje2xheWVyQS5oZWlnaHR9cHhcIlxuXHRcdFxuXHRsYXllckEuaHRtbCA9IFwiU3dpcGUsIFBpbmNoLCBQcmVzcywgRG91YmxlVGFwIG9yIFJvdGF0ZVwiXG5cdFxuXHRzaG93RXZlbnQgPSAoZXZlbnROYW1lKSAtPlxuXHRcdGV2ZW50TmFtZUxheWVyLmh0bWwgPSBldmVudE5hbWVcblx0XHRldmVudE5hbWVMYXllci5hbmltYXRlU3RvcCgpXG5cdFx0ZXZlbnROYW1lTGF5ZXIub3BhY2l0eSA9IDFcblx0XHRldmVudE5hbWVMYXllci5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRjdXJ2ZTogXCJzcHJpbmcoMzAwLCA0MCwgMClcIlxuXG5cdGV2ZW50c1RvTGlzdGVuID0gW1xuXHRcdEV2ZW50cy5Td2lwZUxlZnQsXG5cdFx0RXZlbnRzLlN3aXBlUmlnaHQsXG5cdFx0RXZlbnRzLlN3aXBlVXAsXG5cdFx0RXZlbnRzLlN3aXBlRG93bixcblx0XHRFdmVudHMuUGluY2gsXG5cdFx0RXZlbnRzLlByZXNzLFxuXHRcdEV2ZW50cy5Eb3VibGVUYXAsXG5cdFx0RXZlbnRzLlJvdGF0ZVxuXHRdXG5cblx0Zm9yIGV2IGluIGV2ZW50c1RvTGlzdGVuXG5cdFx0bGF5ZXJBLm9uIGV2LCAoZXYpIC0+XG5cdFx0XHRzaG93RXZlbnQoZXYudHlwZSlcblxuXHQjIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGFmdGVyIDEwIHNlY29uZHNcblx0VXRpbHMuZGVsYXkgMTAuMCwgLT5cblx0XHRmb3IgZXYgaW4gZXZlbnRzVG9MaXN0ZW5cblx0XHRcdGxheWVyQS5yZW1vdmVBbGxMaXN0ZW5lcnMoZXYpXG5cdFx0ZXZlbnROYW1lTGF5ZXIuYW5pbWF0ZVN0b3AoKVxuXHRcdGV2ZW50TmFtZUxheWVyLmh0bWwgPSBcIkFsbCBsaXN0ZW5lcnMgaGF2ZSBiZWVuIHJlbW92ZWRcIlxuXHRcdGV2ZW50TmFtZUxheWVyLm9wYWNpdHkgPSAxLjBcblx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlJvdGF0ZVwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIllvdSBjYW4gcm90YXRlIHRoaXMgbGF5ZXJcIlxuXHRcdFxuXHQjIFdpdGggZHJhZ2dhYmxlIHRydWUgc29tZSBldmVudHMgYXJlIG1vcmUgZGlmZmljdWx0IHRvIHRyaWdnZXIsIGJ1dCB0aGV5IHdvcmtcblx0aW5pdGlhbFJvdGF0aW9uID0gMFxuXHRsYXllckEub24gRXZlbnRzLlJvdGF0ZVN0YXJ0LCAoZXYpIC0+XG5cdFx0aW5pdGlhbFJvdGF0aW9uID0gbGF5ZXJBLnJvdGF0aW9uXG5cdGxheWVyQS5vbiBFdmVudHMuUm90YXRlRW5kLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHJvdGF0aW9uOiAwO1xuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRsYXllckEuaHRtbCA9IFwiUm90YXRpb246IDAuMFwiXG5cdFxuXHRsYXllckEub24gRXZlbnRzLlJvdGF0ZSwgKGV2KSAtPlxuXHRcdGxheWVyQS5hbmltYXRlU3RvcCgpXG5cdFx0bGF5ZXJBLnJvdGF0aW9uID0gZXYucm90YXRpb25cblx0XHRsYXllckEuaHRtbCA9IFwiUm90YXRpb246IFwiICsgZXYucm90YXRpb24udG9GaXhlZCgyKVxuXHRcblx0cmV0dXJuIG1haW5MYXllclxuXG4iLCJleHBvcnRzLmNyZWF0ZUxheWVyID0gLT5cblx0XG5cdG1haW5MYXllciA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiIzI4YWZmYVwiXG5cdG1haW5MYXllci50aXRsZSA9IFwiU2Nyb2xsK1JvdGF0ZVwiXG5cdFxuXHRzY3JvbGwgPSBuZXcgU2Nyb2xsQ29tcG9uZW50XG5cdFx0c3VwZXJMYXllcjogbWFpbkxheWVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcInJnYmEoMjU1LDI1NSwyNTUsMC4yKVwiXG5cdFx0eDogMjBcblx0XHR5OiAxMDhcblx0XHR3aWR0aDogbWFpbkxheWVyLndpZHRoIC0gNDBcblx0XHRoZWlnaHQ6IG1haW5MYXllci5oZWlnaHQgLSAxMjhcblx0XHRzY3JvbGxIb3Jpem9udGFsOiBmYWxzZVxuXHRcdGJvcmRlclJhZGl1czogOFxuXG5cdCMgQWRkIHNwYWNpbmdcblx0c2Nyb2xsLmNvbnRlbnRJbnNldCA9IFxuXHRcdHRvcDogMTBcblx0XHRib3R0b206IDEwXG5cblx0IyBDcmVhdGUgc29tZSBsYXllcnNcblx0Zm9yIGkgaW4gWzAuLjEwXVxuXHRcdGxheWVyID0gbmV3IExheWVyXG5cdFx0XHRzdXBlckxheWVyOiBzY3JvbGwuY29udGVudFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNmZmZcIlxuXHRcdFx0Ym9yZGVyUmFkaXVzOiA0XG5cdFx0XHR3aWR0aDogc2Nyb2xsLmNvbnRlbnQud2lkdGggLSAyMFxuXHRcdFx0aGVpZ2h0OiAxNjBcblx0XHRcdHg6IDEwXG5cdFx0XHR5OiAxNzAgKiBpXG5cdFx0XHRcblx0aW5pdGlhbFJvdGF0aW9uID0gMFxuXHRcblx0c2Nyb2xsLm9uIEV2ZW50cy5Sb3RhdGVTdGFydCwgKGV2KSAtPlxuXHRcdGluaXRpYWxSb3RhdGlvbiA9IHNjcm9sbC5yb3RhdGlvblxuXHRcblx0c2Nyb2xsLm9uIEV2ZW50cy5Sb3RhdGUsIChldikgLT5cblx0XHRzY3JvbGwuYW5pbWF0ZVN0b3AoKVxuXHRcdHNjcm9sbC5yb3RhdGlvbiA9IGV2LnJvdGF0aW9uXG5cdFxuXHRyZXR1cm4gbWFpbkxheWVyXG5cbiIsImV4cG9ydHMuY3JlYXRlTGF5ZXIgPSAtPlxuXHRcblx0bWFpbkxheWVyID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjMjhhZmZhXCJcblx0bWFpbkxheWVyLnRpdGxlID0gXCJTd2lwZVwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlN3aXBlIGluIGFueSBkaXJlY3Rpb25cIlxuXHRtYWluTGF5ZXIucGVyc3BlY3RpdmUgPSAxMjUwXG5cdGxheWVyQS5mb3JjZTJkID0gZmFsc2VcblxuXHRhbmltYXRlQmFjayA9IC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHRyb3RhdGlvblk6IDBcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFxuXHRhbmltYXRlTGF5ZXIgPSAobGF5ZXIsIHByb3BlcnRpZXMpIC0+XG5cdFx0YW5pbWF0aW9uQSA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOiBsYXllclxuXHRcdFx0cHJvcGVydGllczogcHJvcGVydGllc1xuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XHRhbmltYXRpb25BLm9uKEV2ZW50cy5BbmltYXRpb25FbmQsIGFuaW1hdGVCYWNrKVxuXHRcdGFuaW1hdGlvbkEuc3RhcnQoKVxuXG5cdGxheWVyQS5vbiBFdmVudHMuU3dpcGVMZWZ0LCAoZXYpIC0+XG5cdFx0YW5pbWF0ZUxheWVyIGxheWVyQSwge3JvdGF0aW9uWTogLTYwfVxuXHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5Td2lwZVJpZ2h0LCAoZXYpIC0+XG5cdFx0YW5pbWF0ZUxheWVyIGxheWVyQSwge3JvdGF0aW9uWTogNjB9XG5cdFxuXHRsYXllckEub24gRXZlbnRzLlN3aXBlVXAsIChldikgLT5cblx0XHRhbmltYXRlTGF5ZXIgbGF5ZXJBLCB7cm90YXRpb25YOiA2MH1cblx0XG5cdGxheWVyQS5vbiBFdmVudHMuU3dpcGVEb3duLCAoZXYpIC0+XG5cdFx0YW5pbWF0ZUxheWVyIGxheWVyQSwge3JvdGF0aW9uWDogLTYwfVxuXG5cdHJldHVybiBtYWluTGF5ZXJcblxuIiwiZXhwb3J0cy5jcmVhdGVMYXllciA9IC0+XG5cdFxuXHRtYWluTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIiMyOGFmZmFcIlxuXHRtYWluTGF5ZXIudGl0bGUgPSBcIlRhcFwiXG5cdFxuXHQjIENyZWF0ZSBsYXllclxuXHRsYXllckEgPSBuZXcgTGF5ZXJcblx0XHRzdXBlckxheWVyOiBtYWluTGF5ZXJcblx0XHR4OiAyMFxuXHRcdHk6IDEwOFxuXHRcdHdpZHRoOiBtYWluTGF5ZXIud2lkdGggLSA0MFxuXHRcdGhlaWdodDogbWFpbkxheWVyLmhlaWdodCAtIDEyOFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCIjZmZmXCJcblx0XHRib3JkZXJSYWRpdXM6IDhcblx0XG5cdGxheWVyQS5zdHlsZSA9XG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiLFxuXHRcdGZvbnRTaXplOiBcIjQwcHhcIixcblx0XHRjb2xvcjogXCJibGFja1wiLFxuXHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuXHRcdGxpbmVIZWlnaHQ6IFwiI3tsYXllckEuaGVpZ2h0fXB4XCJcblx0XHRcblx0bGF5ZXJBLmh0bWwgPSBcIlRhcCB0byBzY2FsZSB1cCwgZG91YmxlIHRhcCBkb3duXCJcblx0XHRcblx0bGF5ZXJBLm9uIEV2ZW50cy5UYXAsIChldikgLT5cblx0XHRsYXllckEuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0c2NhbGU6IDEuMFxuXHRcdFx0Y3VydmU6IFwic3ByaW5nKDMwMCwgNDAsIDApXCJcblx0XG5cdGxheWVyQS5vbiBFdmVudHMuRG91YmxlVGFwLCAoZXYpIC0+XG5cdFx0bGF5ZXJBLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdHNjYWxlOiAwLjVcblx0XHRcdGN1cnZlOiBcInNwcmluZygzMDAsIDQwLCAwKVwiXG5cdFx0XG5cdHJldHVybiBtYWluTGF5ZXJcblxuIl19
