(function (name, factory) {
  if (typeof window === "object") {
    window[name] = factory();
  }
})("Fog", function () {
  var _w = window,
      _b = document.body,
      _d = document.documentElement;

  var random = function () {
    if (arguments.length === 1) {
      if (Array.isArray(arguments[0])) {
        var index = Math.round(random(0, arguments[0].length - 1));
        return arguments[0][index];
      }
      return random(0, arguments[0]);
    } else if (arguments.length === 2) {
      return Math.random() * (arguments[1] - arguments[0]) + arguments[0];
    }
    return 0;
  };

  var screenInfo = function (e) {
    var width = Math.max(0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0),
        height = Math.max(0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0),
        scrollx = Math.max(0, _w.pageXOffset || _d.scrollLeft || _b.scrollLeft || 0) - (_d.clientLeft || 0),
        scrolly = Math.max(0, _w.pageYOffset || _d.scrollTop || _b.scrollTop || 0) - (_d.clientTop || 0);
    return {
      width: width,
      height: height,
      ratio: width / height,
      centerx: width / 2,
      centery: height / 2,
      scrollx: scrollx,
      scrolly: scrolly
    };
  };

  var Point = function (x, y) {
    this.x = 0;
    this.y = 0;
    this.set(x, y);
  };
  Point.prototype = {
    constructor: Point,
    set: function (x, y) {
      this.x = x || 0;
      this.y = y || 0;
    },
    copy: function (point) {
      this.x = point.x || 0;
      this.y = point.y || 0;
      return this;
    },
    add: function (x, y) {
      this.x += x || 0;
      this.y += y || 0;
      return this;
    }
  };

  var Factory = function (options) {
    this._canvas = null;
    this._context = null;
    this._width = 0;
    this._height = 0;
    this._particles = [];
    this._options = {
      particleCount: 100,
      particleAlpha: 0.05,
      particleSize: 5,
      particleSpeed: 0.5,
      colorAlpha: 0.5
    };
    this._onDraw = this._onDraw.bind(this);
    this._onResize = this._onResize.bind(this);
    this.setOptions(options);
    this.init();
  };
  Factory.prototype = {
    constructor: Factory,
    setOptions: function (options) {
      if (typeof options === "object") {
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            this._options[key] = options[key];
          }
        }
      }
    },
    init: function () {
      try {
        this._canvas = document.createElement("canvas");
        this._canvas.style["display"] = "block";
        this._canvas.style["position"] = "fixed";
        this._canvas.style["margin"] = "0";
        this._canvas.style["padding"] = "0";
        this._canvas.style["border"] = "0";
        this._canvas.style["outline"] = "0";
        this._canvas.style["left"] = "0";
        this._canvas.style["top"] = "0";
        this._canvas.style["width"] = "100%";
        this._canvas.style["height"] = "100%";
        this._canvas.style["z-index"] = "-1";
        this._onResize();
        this._context = this._canvas.getContext("2d");
        this._context.clearRect(0, 0, this._width, this._height);
        window.addEventListener("resize", this._onResize);
        document.body.appendChild(this._canvas);
      } catch (e) {
        console.warn("Canvas Context Error: " + e.toString());
        return;
      }
      this._createParticles();
      this._onDraw();
    },
    _createParticles: function () {
      this._particles = [];
      for (var i = 0; i < this._options.particleCount; i++) {
        var particle = new Point(random(this._width), random(this._height));
        particle.size = random(this._options.particleSize);
        particle.alpha = random(this._options.particleAlpha);
        particle.speed = random(this._options.particleSpeed);
        particle.color = `hsla(${random(0, 360)}, 100%, 50%, ${this._options.colorAlpha})`; // Set random color
        this._particles.push(particle);
      }
    },
    _drawParticle: function (particle) {
      this._context.save();
      this._context.beginPath();
      this._context.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI, false);
      this._context.fillStyle = particle.color;
      this._context.fill();
      this._context.restore();
    },
    _onDraw: function () {
      this._context.clearRect(0, 0, this._width, this._height);
      for (var i = 0; i < this._particles.length; i++) {
        var particle = this._particles[i];
        particle.add(random(-particle.speed, particle.speed), random(-particle.speed, particle.speed));
        if (particle.x > this._width) particle.x = 0;
        if (particle.x < 0) particle.x = this._width;
        if (particle.y > this._height) particle.y = 0;
        if (particle.y < 0) particle.y = this._height;
        this._drawParticle(particle);
      }
      requestAnimationFrame(this._onDraw);
    },
    _onResize: function (e) {
      var screen = screenInfo(e);
      this._width = screen.width;
      this._height = screen.height;
      if (this._canvas) {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
      }
      this._createParticles();
    }
  };
  return Factory;
});

new Fog({
  particleCount: 200,
  particleAlpha: 0.1,
  particleSize: 10,
  particleSpeed: 0.2,
  colorAlpha: 0.3
});
