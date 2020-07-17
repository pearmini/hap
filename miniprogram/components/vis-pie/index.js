Component({
  properties: {
    data: {
      type: Array,
      observer(newVal, oldVal, changePath) {
        const chart = (canvas, width, height, F2) => {
          return this.pie(canvas, width, height, F2, newVal);
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
    pie(canvas, width, height, F2, data) {
      const chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data);
      chart.legend({
        position: 'right'
      });

      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 0.85
      });

      chart.axis(false);
      chart.interval().position('a*value').color('name')
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        }).animate({
          appear: {
            duration: 1200,
            easing: 'bounceOut'
          }
        });

      chart.render();
      return chart;
    }
  }
})