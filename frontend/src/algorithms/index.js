import { randomUniform } from "./randomUniform";
import { circlePack } from "./circlePack";

export const algorithms = [
  { name: "Uniform Random", render: randomUniform },
  { name: "Circle Pack", render: circlePack },
];

export const defaultIndex = 1;
