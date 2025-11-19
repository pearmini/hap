import * as d3 from "d3";
import {FilterGL2} from "./filter";

export function sort({parent, image, width, height, animated = true, generator, interpolate = d3.interpolateViridis}) {
  const _ = {};
  const filter = (_.filter = FilterGL2(parent, {image, width, height}));
  const step = 20;
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
      timer.stop();
      timer = null;
    }
  }

  function horizontalLinks() {
    const count = Math.floor(width / step);
    const numbers = d3.shuffle(new Array(count).fill(0).map((_, i) => i));
    const sorter = generator(numbers);
    const N = Array.from(sorter);
    const scaleX = d3.scaleBand(numbers, [0, width]).padding(0);
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
        let p2, p3;
        if (bi < ai) {
          p2 = [p1[0], scaleY(i)];
          p3 = [scaleX(bi), scaleY(i)];
        } else {
          p2 = [scaleX(bi) + scaleX.bandwidth(), scaleY(i)];
          p3 = [p0[0], scaleY(i)];
        }
        const {r, g, b} = d3.rgb(interpolate(v / (numbers.length - 1)));
        const c = [r / 255, g / 255, b / 255, 1];
        return {points: [p0, p1, p2, p3], c};
      });
      data.push(links);
    }
  }

  // function verticalLinks() {
  //   const count = Math.floor(height / step);
  //   const numbers = d3.shuffle(new Array(count).fill(0).map((_, i) => i));
  //   const sorter = generator(numbers);
  //   const N = Array.from(sorter);
  //   const scaleY = d3.scaleBand(numbers, [0, height]).padding(0);
  //   const scaleX = d3.scaleLinear([0, N.length - 1], [0, width]);
  //   data = [];
  //   for (let i = 1; i < N.length; i++) {
  //     const j = i - 1;
  //     const aN = N[j];
  //     const bN = N[i];
  //     const map = new Map(bN.map((v, i) => [v, i]));
  //     const links = aN.map((v, ai) => {
  //       const bi = map.get(v);
  //       const p0 = [scaleX(j), scaleY(ai)];
  //       const p1 = [scaleX(j), scaleY(ai) + scaleY.bandwidth()];
  //       let p2, p3;
  //       if (bi < ai) {
  //         p2 = [scaleX(i), p1[1]];
  //         p3 = [scaleX(i), scaleY(bi)];
  //       } else {
  //         p2 = [scaleX(i), scaleY(bi) + scaleY.bandwidth()];
  //         p3 = [scaleX(i), p0[1]];
  //       }
  //       const {r, g, b} = d3.rgb(interpolate(v / (numbers.length - 1)));
  //       const c = [r / 255, g / 255, b / 255, 1];
  //       return {points: [p0, p1, p2, p3], c};
  //     });
  //     data.push(links);
  //   }
  // }

  _.start = function () {
    stop();
    index = 0;
    horizontalLinks();
    // verticalLinks();
    if (!animated) once();
    else (timer = d3.interval(loop, 100)), loop();
  };

  _.destroy = function () {
    stop();
  };

  return _;
}
