import * as d3 from "d3";
import {random} from "./random";

export function* randomNormal(count, [width, height]) {
  const normalX = d3.randomNormal(width / 2, width / 6);
  const normalY = d3.randomNormal(height / 2, height / 6);
  for (let i = 0; i < count; i++) {
    yield [normalX(), normalY()];
  }
}

randomNormal.metadata = {
  key: "randomNormal",
  name: "Normal Random",
  description: "Normally distributed random numbers",
  visualizer: random,
};
