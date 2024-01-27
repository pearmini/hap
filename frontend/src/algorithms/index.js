import { randomUniform } from "./randomUniform";
import { randomNoise } from "./randomNoise";
import { circlePack } from "./circlePack";

export const algorithms = [
  { name: "Uniform Random", render: randomUniform },
  { name: "Circle Pack", render: circlePack },
  { name: "Noise Random", render: randomNoise },
];

export const defaultIndex = 0;
