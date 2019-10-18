Component({
  properties: {
    data: {
      type: Array,
      observer(newVal, oldVal, changePath) {
        const chart = (canvas, width, height, F2) => {
          return this.circle(canvas, width, height, F2, newVal);
        }
        this.setData({
          opts: {
            onInit: chart
          }
        })
      }
    },
    width: Number,
    height: Number,
    content: String,
    title: String
  },

  data: {
    opts: null
  },

  methods: {
    circle(canvas, width, height, F2, data) {
      // customize shape and animation
      var _F = F2,
        Shape = _F.Shape,
        Util = _F.Util,
        Global = _F.Global,
        G = _F.G,
        Animate = _F.Animate;
      var Vector2 = G.Vector2;

      Shape.registerShape('interval', 'tick', {
        draw: function draw(cfg, container) {
          var points = this.parsePoints(cfg.points);
          var style = Util.mix({
            stroke: cfg.color
          }, Global.shape.interval, cfg.style);
          if (cfg.isInCircle) {
            var newPoints = points.slice(0);
            if (this._coord.transposed) {
              newPoints = [points[0], points[3], points[2], points[1]];
            }

            var _cfg$center = cfg.center,
              x = _cfg$center.x,
              y = _cfg$center.y;

            var v = [1, 0];
            var v0 = [newPoints[0].x - x, newPoints[0].y - y];
            var v1 = [newPoints[1].x - x, newPoints[1].y - y];
            var v2 = [newPoints[2].x - x, newPoints[2].y - y];

            var startAngle = Vector2.angleTo(v, v1);
            var endAngle = Vector2.angleTo(v, v2);
            var r0 = Vector2.length(v0);
            var r = Vector2.length(v1);

            if (startAngle >= 1.5 * Math.PI) {
              startAngle = startAngle - 2 * Math.PI;
            }

            if (endAngle >= 1.5 * Math.PI) {
              endAngle = endAngle - 2 * Math.PI;
            }

            var lineWidth = r - r0;
            var newRadius = r - lineWidth / 2;

            return container.addShape('Arc', {
              className: 'interval',
              attrs: Util.mix({
                x: x,
                y: y,
                startAngle: startAngle,
                endAngle: endAngle,
                r: newRadius,
                lineWidth: lineWidth,
                lineCap: 'round',
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowOffsetX: 0,
                shadowOffsetY: -5,
                shadowBlur: 50
              }, style)
            });
          }
        }
      });

      Animate.registerAnimation('waveIn', function(shape, animateCfg) {
        var startAngle = shape.attr('startAngle');
        var endAngle = shape.attr('endAngle');
        shape.attr('endAngle', startAngle);
        shape.animate().to(Util.mix({
          attrs: {
            endAngle: endAngle
          }
        }, animateCfg));
      });
      // ------

      const chart = new F2.Chart({
        el: canvas,
        width,
        height
      });

      chart.source(data, {
        percent: {
          max: 100
        }
      });
      chart.legend('name', {
        position: 'right'
      });

      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.382,
        radius: 0.8
      });
      chart.axis(false);
      chart.interval().position('name*percent').color('name', ['#1ad5de', '#a0ff03', '#e90b3a'])
        .shape('tick')
        .size(15).animate({
          appear: {
            animation: 'waveIn',
            duration: 1500,
            easing: 'elasticOut'
          },
          update: {
            duration: 1500,
            easing: 'elasticOut'
          }
        });

      data.map(function(obj) {
        // background
        chart.guide().arc({
          start: [obj.name, 0],
          end: [obj.name, 99.98],
          top: false,
          style: {
            lineWidth: 18,
            stroke: obj.bgColor
          }
        });
      });
      chart.render();
      return chart;
    }
  }
})