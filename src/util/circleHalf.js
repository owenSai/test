let PI = Math.PI,
    HPI = PI / 2,
    PI2 = 2 * PI,
    RAD = PI / 180,
    
mixIn = function() {
    function t() {
        l = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
        a = !0;
        for (var t in {
            toString: null
        })
            a = !1
    }
    function e(e, n, r) {
        var o, s = 0;
        null == a && t();
        for (o in e)
            if (!1 === i(n, e, o, r))
                break;
        if (a)
            for (; (o = l[s++]) && (e[o] === Object.prototype[o] || !1 !== i(n, e, o, r)); )
                ;
    }
    function i(t, e, i, n) {
        return t.call(n, e[i], i, e)
    }
    function n(t, i, n) {
        e(t, function(e, o) {
            if (r(t, o))
                return i.call(n, t[o], o, t)
        })
    }
    function r(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    function o(t, e) {
        for (var i, r = 0, o = arguments.length; ++r < o; )
            null != (i = arguments[r]) && n(i, s, t);
        return t
    }
    function s(t, e) {
        this[e] = t
    }
    var a, l;
    return o
}()
  , Point = function(t, e) {
    this.x = t || 0,
    this.y = e || 0,
    this.lx = 0,
    this.ly = 0,
    this.rx = 0,
    this.ry = 0,
    this.angle = 0,
    this.radius = 0,
    this.baseAngle = 0,
    this.oscillationSpeed = 1,
    this.elasticity = 10,
    this.viscosity = .25,
    this.damping = .1,
    this.stiffness = .1,
    this.origin = {
        x: this.x,
        y: this.y
    },
    this.delta = {
        x: 0,
        y: 0
    },
    this.offset = {
        x: 0,
        y: 0
    },
    this.fixed = !1,
    this.update = function(t, e, i) {
        if (null != t) {
            if (this.fixed)
                return this.x = this.origin.x,
                void (this.y = this.origin.y);
            this.offset.x += (this.origin.x - this.x) / this.elasticity,
            this.offset.y += (this.origin.y - this.y) / this.elasticity;
            var n = this.delta.x = this.x - t.x
              , r = this.delta.y = this.y - t.y
              , o = Math.sqrt(n * n + r * r);
            if (o < this.radius) {
                var s = Math.abs(o - this.radius) / i
                  , a = Math.atan2(this.delta.y, this.delta.x);
                this.offset.x += (Math.cos(a) * this.radius - this.delta.x) * (1 - this.damping) * s,
                this.offset.y += (Math.sin(a) * this.radius - this.delta.y) * (1 - this.damping) * s
            }
            this.offset.x *= 1 - this.viscosity,
            this.offset.y *= 1 - this.viscosity,
            Math.abs(this.offset.x) < .001 && (this.offset.x = 0),
            Math.abs(this.offset.y) < .001 && (this.offset.y = 0),
            this.x += this.offset.x * this.stiffness,
            this.y += this.offset.y * this.stiffness
        }
    }
},

Circle = function() {
    function t(t) {
        this.points = [],
        this.direction = 1,
        this.lastOscillationValues = {
            min: -1,
            max: -1
        },
        null != t && this.init(t)
    }
    function e(t, e) {
        null == e && this.setProperties(t);
        var i = PI2 / this.pointCount
          , n = Math.random() * PI2;
        this.points = [];
        for (var r = 0; r < this.pointCount; r++) {
            var o = new Point(0,0);
            n += i,
            o.angle = n,
            o.baseAngle = Math.random() * PI2,
            o.oscillationSpeed = this.oscillation.min + Math.random() * this.oscillation.max,
            o.radius = this.radiusIn + (.5 + .5 * Math.cos(o.baseAngle)) * (this.radiusOut - this.radiusIn),
            o.radiusMouse = this.radiusMouse,
            o.elasticity = this.elasticity,
            o.viscosity = this.viscosity,
            o.damping = this.damping,
            o.stiffness = this.stiffness,
            this.points.push(o)
        }
        this.lastOscillationValues.min == this.oscillation.min && this.lastOscillationValues.max == this.oscillation.max || this.resetOscillationSpeed()
    }
    function i() {
        for (var t = 0; t < this.pointCount; t++)
            this.points[t].oscillationSpeed = this.oscillation.min + Math.random() * this.oscillation.max;
        this.lastOscillationValues.min = this.oscillation.min,
        this.lastOscillationValues.max = this.oscillation.max
    }
    function n(t) {
        mixIn(this, t);
        var e = this.points[0];
        t.pointCount == this.points.length && t.radiusMouse == e.radiusMouse && t.elasticity == e.elasticity && t.viscosity == e.viscosity && t.damping == e.damping && t.stiffness == e.stiffness || this.init(t, !0),
        this.lastOscillationValues.min == this.oscillation.min && this.lastOscillationValues.max == this.oscillation.max || this.resetOscillationSpeed()
    }
    function r(t, e) {
        var i = this
          , n = {
            x: t,
            y: e
        }
          , r = n.x
          , o = n.y
          , s = Math.sqrt(r * r + o * o);
        this.points.forEach(function(t, e, r) {
            t.angle += i.speed,
            t.radius = i.radiusIn + (.5 + .5 * Math.sin(t.baseAngle)) * (i.radiusOut - i.radiusIn),
            t.baseAngle += t.oscillationSpeed;
            t.origin.x = Math.cos(t.angle) * t.radius,
            t.origin.y = Math.sin(t.angle) * t.radius;
            t.update(n, s, Math.abs(i.radiusOut - i.radiusIn));
            var o = r[(e + 1) % r.length]
              , a = t.x - o.x
              , l = t.y - o.y
              , u = .35 * Math.sqrt(a * a + l * l);
            t.lx = t.x + Math.cos(t.angle + HPI) * u,
            t.ly = t.y + Math.sin(t.angle + HPI) * u,
            t.rx = t.x + Math.cos(t.angle - HPI) * u,
            t.ry = t.y + Math.sin(t.angle - HPI) * u
        })
    }
    function o(t) {
        t.beginPath(),
        this.points.forEach(function(e, i, n) {
            var r = n[(i + 1) % n.length];
            t.lineTo(e.x, e.y),
            t.bezierCurveTo(e.lx, e.ly, r.rx, r.ry, r.x, r.y)
        }),
        t.closePath(),
        t.globalAlpha = this.alpha,
        1 == this.fill && (t.globalCompositeOperation = this.fillBlendMode,
        t.fillStyle = this.fillColor,
        t.fill(),
        t.globalCompositeOperation = "source-over"),
        1 == this.stroke && (t.lineWidth = this.lineWidth,
        t.globalCompositeOperation = this.strokeBlendMode,
        t.strokeStyle = this.strokeColor,
        t.stroke(),
        t.globalCompositeOperation = "source-over"),
        t.globalAlpha = 1,
        this.debug && (t.strokeStyle = "#F00",
        t.beginPath(),
        this.points.forEach(function(e, i, n) {
            var r = n[(i + 1) % n.length]
              , o = e.x - r.x
              , s = e.y - r.y
              , a = .35 * Math.sqrt(o * o + s * s)
              , l = e.x + Math.cos(e.angle + HPI) * a
              , u = e.y + Math.sin(e.angle + HPI) * a
              , c = e.x + Math.cos(e.angle - HPI) * a
              , d = e.y + Math.sin(e.angle - HPI) * a;
            t.moveTo(0, 0),
            t.lineTo(e.x, e.y),
            t.lineTo(l, u),
            t.moveTo(e.x, e.y),
            t.lineTo(c, d)
        }),
        t.stroke())
    }
    var s = t.prototype;
    return s.init = e,
    s.resetOscillationSpeed = i,
    s.setProperties = n,
    s.update = r,
    s.render = o,
    t
}()
  , Blob = function(t) {
    function e(t) {
        this.canvas = t,
        this.ctx = this.canvas.getContext("2d"),
        this.config = {},
        this.circles = [],
        this.circleCount = 1
    }
    function i(t, e) {
        this.circleCount = t || 1,
        this.config = null == e ? mixIn(this.config, o) : mixIn(this.config, o, e),
        this.computeRadius(),
        this.circles = [];
        for (var i = 0; i < this.circleCount; i++) {
            var n = new Circle(this.config);
            n.direction *= i % 2 == 0 ? -1 : 1,
            this.circles.push(n)
        }
    }
    function n() {
        var t = Math.min(this.canvas.width, this.canvas.height) / 2;
        this.config.radiusIn = t * this.config.radius.in,
        this.config.radiusOut = t * this.config.radius.out
    }
    function r(t, e, i) {
        null == i && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
        this.ctx.save(),
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2),
        this.computeRadius();
        var n = this;
        this.circles.forEach(function(i) {
            i.setProperties(n.config),
            i.update(t - n.canvas.width / 2, e - n.canvas.height / 2),
            i.render(n.ctx)
        }),
        this.ctx.restore()
    }
   
    var o = {
        stroke: !0,
        strokeColor: "#000",
        strokeBlendMode: "source-over",
        fill: !1,
        fillColor: "#FFF",
        fillBlendMode: "source-over",
        alpha: 1,
        lineWidth: 1,
        pointCount: 12,
        radius: {
            in: .9,
            out: .95
        },
        radiusIn: 200,
        radiusOut: 250,
        speed: 0,
        oscillation: {
            min: RAD,
            max: 3 * RAD
        },
        viscosity: .85,
        elasticity: .5,
        damping: .5,
        stiffness: .1
    }
      , s = e.prototype;
    return s.init = i,
    s.update = r,
    s.computeRadius = n,
    e
}();

export default function() {
    let init = function(el, size, r1, r2) {
        function t() {
            requestAnimationFrame(t),
            s.x += .1 * (a.x - s.x),
            s.y += .1 * (a.y - s.y),
            r.update(s.x, s.y),
            o.update(s.x, s.y, !1)
        }
        function e(t) {
            t || (t = window.event),
            t.pageX || t.pageY ? (a.x = t.pageX,
            a.y = t.pageY) : (t.clientX || t.clientY) && (a.x = t.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            a.y = t.clientY + document.body.scrollTop + document.documentElement.scrollTop);
            var e = $(el + " canvas").offset();
            a.x -= e.left,
            a.y -= e.top
        }
        function i(t) {
            var e = t.target.getBoundingClientRect();
            a.x = .5 * e.width,
            a.y = .5 * e.height
        }
        !function(t) {
            !function() {
                if (!t.requestAnimationFrame) {
                    t.webkitRequestAnimationFrame && (t.requestAnimationFrame = t.webkitRequestAnimationFrame,
                    t.cancelAnimationFrame = t.webkitCancelAnimationFrame || t.webkitCancelRequestAnimationFrame);
                    var e = 0;
                    t.requestAnimationFrame = function(i) {
                        var n = (new Date).getTime()
                            , r = Math.max(0, 16 - (n - e))
                            , o = t.setTimeout(function() {
                            i(n + r)
                        }, r);
                        return e = n + r,
                        o
                    }
                    ,
                    t.cancelAnimationFrame = function(t) {
                        clearTimeout(t)
                    }
                }
            }(),
            "function" == typeof define && define(function() {
                return t.requestAnimationFrame
            })
        }(window);

        var n = document.createElement("canvas");
        $(el).append(n),
        n.width = n.height = size;
        var r = new Blob(n);
        r.init(3, {
            interactive: !0,
            pointCount: 15,
            strokeColor: "#CCCCCC",
            strokeBlendMode: "source-over",
            lineWidth: 1,
            radius: r1,
            speed: .001,
            oscillation: {
                min: .5 * RAD,
                max: RAD
            },
            viscosity: .9,
            elasticity: .6,
            damping: .7,
            stiffness: .05
        });
        var o = new Blob(n);
        o.init(1, {
            interactive: !0,
            pointCount: 8,
            strokeColor: "#ffa424",
            strokeBlendMode: "source-over",
            lineWidth: 1,
            radius: r2,
            speed: .001,
            oscillation: {
                min: .5 * RAD,
                max: RAD
            },
            viscosity: .5,
            elasticity: .6,
            damping: .7,
            stiffness: .025
        });
        var s = new Point
            , a = new Point;
        n.onmousemove = n.ontouchmove = e,
        n.onmouseleave = n.ontouchend = i,
        t();
    }

    init('.selfsell-circles-half', 1200,
    { in: .5, out: .6 }, { in: .55, out: .6 } );
    
};