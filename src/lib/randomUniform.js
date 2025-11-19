import * as d3 from "d3";
import {random} from "./random";

export function* randomUniform(count, [width, height]) {
  const uniformX = d3.randomUniform(0, width);
  const uniformY = d3.randomUniform(0, height);
  for (let i = 0; i < count; i++) {
    yield [uniformX(), uniformY()];
  }
}

randomUniform.metadata = {
  key: "randomUniform",
  name: "Uniform Random",
  description: "Uniformly distributed random numbers",
  visualizer: random,
};
