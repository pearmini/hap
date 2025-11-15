import * as d3 from "d3";
import {FilterGL2} from "./filter";

export function sort({parent, image, width, height, animated = true, generator, interpolate = d3.interpolateYlGnBu}) {
  const _ = {};
  const filter = FilterGL2(parent, {image, width, height});
  let timer;
  let data;
  let index = 0;

  function loop() {
    if (index >= data.length) return stop();
    draw(index + 1);
    index++;
  }

  function once() {
    draw(data.length - 1);
  }

  function draw(n) {
    const slice = data.slice(0, n + 1).flat();
    const I = slice.map((_, i) => i);
    const P = slice.map((d) => d.points);
    const C = slice.map((d) => d.c);
    filter.fillRect(0, 0, width, height, [0, 0, 0, -1]);
    filter.fillPolygons(I, P, C);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  _.start = function () {
    stop();
    index = 0;
    const step = 20;
    const count = Math.floor(width / step);
    const numbers = d3.shuffle(new Array(count).fill(0).map((_, i) => i));
    const sorter = generator(numbers);
    const N = Array.from(sorter);
    const scaleX = d3.scaleBand(numbers, [0, width]).padding(0.2).paddingOuter(0);
    const scaleY = d3.scaleLinear([0, N.length - 1], [0, height]);
    data = [];
    for (let i = 1; i < N.length; i++) {
      const j = i - 1;
      const aN = N[j];
      const bN = N[i];
      const map = new Map(bN.map((v, i) => [v, i]));
      const links = aN.map((v, ai) => {
        const bi = map.get(v);
        const p0 = [scaleX(ai), scaleY(j)];
        const p1 = [scaleX(ai) + scaleX.bandwidth(), scaleY(j)];
        const p2 = [scaleX(bi) + scaleX.bandwidth(), scaleY(i)];
        const p3 = [scaleX(bi), scaleY(i)];
        const {r, g, b} = d3.rgb(interpolate(v / (numbers.length - 1)));
        const c = [r / 255, g / 255, b / 255, 1];
        return {points: [p0, p1, p2, p3], c};
      });
      data.push(links);
    }
    if (!animated) once();
    else (timer = d3.interval(loop, 100)), loop();
  };

  _.destroy = function () {
    stop();
  };

  return _;
}
