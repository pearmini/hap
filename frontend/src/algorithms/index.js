import { randomUniform } from "./randomUniform";
import { randomNoise } from "./randomNoise";
import { circlePack } from "./circlePack";
import { rectPack } from "./rectPack";

export const algorithms = [
  { name: "Uniform Random", render: randomUniform },
  { name: "Circle Pack", render: circlePack },
  { name: "Noise Random", render: randomNoise },
  { name: "Rect Pack", render: rectPack },
];

export const defaultIndex = 0;
