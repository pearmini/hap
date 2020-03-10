import { random } from "./random.js";
import { perlin } from "./perlin.js";
import { bfs } from "./bfs.js";
import { dfs } from "./dfs.js";
import { best } from "./best.js";
import { prim } from "./prim.js";
import { bisect } from "./bisect.js";
import { mergesort } from "./mergesort.js";
import { insertsort } from "./insertsort.js";

class SamplerManager {
  get(sample) {
    if (sample === "最佳候选") {
      return best;
    } else if (sample === "Perlin噪声") {
      return perlin;
    } else if (sample === "均匀随机") {
      return random;
    } else if (sample === "BFS") {
      return bfs;
    } else if (sample === "DFS") {
      return dfs;
    } else if (sample === "Prim") {
      return prim;
    } else if (sample === "二分搜索" || sample === "ToLeft") {
      return bisect;
    } else if (sample === "归并排序") {
      return mergesort;
    } else if (sample === "插入排序") {
      return insertsort;
    } else {
      return bfs;
    }
  }
}
const samplerManager = new SamplerManager();
export { samplerManager };
